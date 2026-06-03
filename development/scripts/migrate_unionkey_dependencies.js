#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const config = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, 'development/unionkey/external-repos.json'),
    'utf8',
  ),
);

const packageFiles = [
  'package.json',
  'apps/mobile/package.json',
  'apps/desktop/package.json',
  'apps/ext/package.json',
  'apps/web/package.json',
  'apps/web-embed/package.json',
  'packages/shared/package.json',
  'packages/kit/package.json',
];

const sections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
  'resolutions',
];

const dryRun = !process.argv.includes('--write');
const mappings = config.repositories.flatMap((repo) => repo.packageMappings);

function replacePackageSpec(value) {
  if (typeof value !== 'string') {
    return value;
  }
  return mappings.reduce(
    (current, mapping) => current.replaceAll(mapping.from, mapping.to),
    value,
  );
}

function migratePackageJson(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const packageJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const changes = [];

  sections.forEach((section) => {
    const deps = packageJson[section];
    if (!deps) {
      return;
    }

    Object.keys(deps).forEach((name) => {
      const mapped = mappings.find((mapping) => mapping.from === name);
      const nextValue = replacePackageSpec(deps[name]);

      if (mapped) {
        deps[mapped.to] = nextValue;
        delete deps[name];
        changes.push(`${section}: ${name} -> ${mapped.to}`);
        return;
      }

      if (nextValue !== deps[name]) {
        deps[name] = nextValue;
        changes.push(`${section}: ${name} spec updated`);
      }
    });
  });

  if (!dryRun && changes.length > 0) {
    fs.writeFileSync(fullPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  }

  return changes.map((change) => `${relativePath}: ${change}`);
}

const allChanges = packageFiles.flatMap(migratePackageJson);

if (dryRun) {
  console.log('# Dry run. Add --write after UnionKey packages are published.');
}

if (allChanges.length === 0) {
  console.log('No dependency declarations need migration.');
} else {
  console.log(allChanges.join('\n'));
}
