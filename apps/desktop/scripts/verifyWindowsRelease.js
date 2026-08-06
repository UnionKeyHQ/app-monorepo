/* eslint-disable no-console */
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const desktopDir = path.resolve(__dirname, '..');
const defaultManifest = path.join(desktopDir, 'build-electron', 'latest.yml');

function fail(message) {
  throw new Error(`[secure-update] ${message}`);
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hashFile(filePath, algorithm, encoding) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest(encoding)));
  });
}

function parseManifestEntry(manifestText, artifactName) {
  const normalizedName = artifactName.replace(/\\/g, '/');
  const entries = [
    ...manifestText.matchAll(
      /^\s*- url:\s*['"]?([^'"\r\n]+)['"]?\s*\r?\n\s+sha512:\s*([^\s]+)\s*\r?\n\s+size:\s*(\d+)/gm,
    ),
  ];
  const entry = entries.find(
    (match) => decodeURIComponent(match[1]).replace(/\\/g, '/') === normalizedName,
  );
  if (!entry) {
    fail(`${artifactName} is missing from latest.yml`);
  }
  return { sha512: entry[2], size: Number(entry[3]) };
}

function getAuthenticodeSignature(artifactPath) {
  const script = [
    '$signature = Get-AuthenticodeSignature -LiteralPath $env:UNIONKEY_ARTIFACT_PATH',
    '[PSCustomObject]@{',
    'Status = [string]$signature.Status',
    'StatusMessage = $signature.StatusMessage',
    'Subject = $signature.SignerCertificate.Subject',
    'Thumbprint = $signature.SignerCertificate.Thumbprint',
    '} | ConvertTo-Json -Compress',
  ].join('\n');
  const result = spawnSync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-Command', script],
    {
      encoding: 'utf8',
      env: { ...process.env, UNIONKEY_ARTIFACT_PATH: artifactPath },
    },
  );
  if (result.status !== 0 || !result.stdout.trim()) {
    fail(`could not inspect Authenticode signature: ${result.stderr.trim()}`);
  }
  return JSON.parse(result.stdout);
}

function verifyAuthenticode(artifactPath) {
  const signature = getAuthenticodeSignature(artifactPath);
  const allowTestCertificate = process.env.ALLOW_TEST_CERTIFICATE === '1';
  if (allowTestCertificate && !process.env.WINDOWS_SIGNER_THUMBPRINT?.trim()) {
    fail('WINDOWS_SIGNER_THUMBPRINT is required for test-certificate validation');
  }
  const acceptedStatuses = allowTestCertificate
    ? new Set(['Valid', 'UnknownError'])
    : new Set(['Valid']);
  if (!signature.Thumbprint || !acceptedStatuses.has(signature.Status)) {
    fail(
      `Authenticode is not trusted (${signature.Status}: ${
        signature.StatusMessage || 'no signer'
      })`,
    );
  }

  const expectedSubject = process.env.WINDOWS_PUBLISHER_NAME?.trim();
  if (!expectedSubject && !allowTestCertificate) {
    fail('WINDOWS_PUBLISHER_NAME is required for a production release');
  }
  if (
    expectedSubject &&
    !signature.Subject.toLowerCase().includes(expectedSubject.toLowerCase())
  ) {
    fail(`unexpected signer subject: ${signature.Subject}`);
  }

  const expectedThumbprint = process.env.WINDOWS_SIGNER_THUMBPRINT
    ?.replace(/\s/g, '')
    .toUpperCase();
  if (
    expectedThumbprint &&
    signature.Thumbprint.toUpperCase() !== expectedThumbprint
  ) {
    fail(`unexpected signer thumbprint: ${signature.Thumbprint}`);
  }
  return signature;
}

function clearSignChecksum(artifactPath, sha256) {
  const signingKey = process.env.GPG_SIGNING_KEY?.trim();
  if (!signingKey) {
    fail('GPG_SIGNING_KEY is required with --sign');
  }
  const sidecarPath = `${artifactPath}.SHA256SUMS.asc`;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unionkey-release-'));
  const checksumPath = path.join(tempDir, 'SHA256SUMS');
  fs.writeFileSync(
    checksumPath,
    `${sha256}  ${path.basename(artifactPath)}\n`,
    'utf8',
  );
  try {
    const args = [
      '--batch',
      '--yes',
      '--armor',
      '--local-user',
      signingKey,
      '--output',
      sidecarPath,
      '--clearsign',
      checksumPath,
    ];
    const options = { encoding: 'utf8' };
    if (process.env.GPG_PASSPHRASE) {
      args.splice(2, 0, '--pinentry-mode', 'loopback', '--passphrase-fd', '0');
      options.input = `${process.env.GPG_PASSPHRASE}\n`;
    }
    const result = spawnSync('gpg.exe', args, options);
    if (result.status !== 0) {
      fail(`GPG signing failed: ${result.stderr.trim()}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  return sidecarPath;
}

function getTrustedPublicKeys() {
  const source = fs.readFileSync(
    path.join(desktopDir, 'app', 'constant', 'gpg.js'),
    'utf8',
  );
  return source.match(
    /-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]+?-----END PGP PUBLIC KEY BLOCK-----/g,
  );
}

async function verifySidecar(sidecarPath, artifactPath, expectedSha256) {
  if (!fs.existsSync(sidecarPath)) {
    fail(`missing GPG sidecar: ${sidecarPath}`);
  }
  const openpgp = await import('openpgp');
  const armoredKeys = getTrustedPublicKeys();
  if (!armoredKeys?.length) {
    fail('the application has no embedded GPG trust key');
  }
  const verificationKeys = await Promise.all(
    armoredKeys.map((armoredKey) => openpgp.readKey({ armoredKey })),
  );
  const message = await openpgp.readCleartextMessage({
    cleartextMessage: fs.readFileSync(sidecarPath, 'utf8'),
  });
  const result = await openpgp.verify({ message, verificationKeys });
  const verified = await Promise.any(
    result.signatures.map(async (signature) => {
      await signature.verified;
      return true;
    }),
  ).catch(() => false);
  if (!verified) {
    fail('GPG sidecar is not signed by a key trusted by the application');
  }
  const match = /^([a-f\d]{64})\s+\*?([^\r\n]+)$/i.exec(message.getText().trim());
  if (!match) {
    fail('signed checksum has an invalid format');
  }
  if (match[1].toLowerCase() !== expectedSha256) {
    fail('signed SHA-256 does not match the installer');
  }
  if (path.basename(match[2].trim()) !== path.basename(artifactPath)) {
    fail('signed filename does not match the installer');
  }
}

async function main() {
  const artifactArg = readArg('--artifact');
  if (!artifactArg) {
    fail('usage: node scripts/verifyWindowsRelease.js --artifact <exe> [--manifest <latest.yml>] [--sign]');
  }
  const artifactPath = path.resolve(artifactArg);
  const manifestPath = path.resolve(readArg('--manifest') || defaultManifest);
  if (!fs.existsSync(artifactPath) || !fs.existsSync(manifestPath)) {
    fail('installer or latest.yml does not exist');
  }

  const stats = fs.statSync(artifactPath);
  const [sha512, sha256] = await Promise.all([
    hashFile(artifactPath, 'sha512', 'base64'),
    hashFile(artifactPath, 'sha256', 'hex'),
  ]);
  const manifestEntry = parseManifestEntry(
    fs.readFileSync(manifestPath, 'utf8'),
    path.basename(artifactPath),
  );
  if (manifestEntry.size !== stats.size || manifestEntry.sha512 !== sha512) {
    fail('latest.yml size/SHA-512 does not match the signed installer');
  }

  const authenticode = verifyAuthenticode(artifactPath);
  const skipGpg = process.argv.includes('--skip-gpg');
  if (skipGpg && process.env.ALLOW_TEST_CERTIFICATE !== '1') {
    fail('--skip-gpg is allowed only for local test-certificate validation');
  }
  const sidecarPath = `${artifactPath}.SHA256SUMS.asc`;
  if (!skipGpg) {
    if (process.argv.includes('--sign')) {
      clearSignChecksum(artifactPath, sha256);
    }
    await verifySidecar(sidecarPath, artifactPath, sha256);
  }

  console.log(
    JSON.stringify(
      {
        artifact: artifactPath,
        bytes: stats.size,
        sha256,
        signer: authenticode.Subject,
        signerThumbprint: authenticode.Thumbprint,
        manifest: manifestPath,
        gpgSidecar: skipGpg ? 'skipped for local test' : sidecarPath,
        verified: true,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
