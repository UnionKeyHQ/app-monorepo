#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../unionkey/external-repos.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const repos = config.repositories;
const owner = process.env.UNIONKEY_GITHUB_OWNER || config.owner;

const useGh = process.argv.includes('--gh');
const json = process.argv.includes('--json');
const check = process.argv.includes('--check');
const personal = process.argv.includes('--personal');

function quote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function printRepoCommands(repo) {
  const target = `${owner}/${repo.name}`;
  console.log(`# ${target}`);
  if (repo.source === target) {
    console.log(`gh repo view ${target} --json nameWithOwner,url,isPrivate`);
  } else if (repo.source) {
    const ownerArgs = personal ? '' : ` --org ${owner}`;
    console.log(
      `gh repo fork ${repo.source}${ownerArgs} --clone=false --fork-name ${repo.name}`,
    );
  } else {
    console.log(
      [
        'gh repo create',
        target,
        '--private',
        `--description ${quote(repo.description)}`,
      ].join(' '),
    );
  }
  console.log('');
}

function printCheckCommands(repo) {
  const target = `${owner}/${repo.name}`;
  console.log(`gh repo view ${target} --json nameWithOwner,url,isPrivate`);
}

if (json) {
  console.log(JSON.stringify(config, null, 2));
  process.exit(0);
}

console.log('# UnionKey repository preparation commands');
console.log('# Install/auth GitHub CLI first: gh auth login');
console.log('# Override owner with UNIONKEY_GITHUB_OWNER=your-owner.');
console.log('# Add --personal when the owner is the active user account, not an org.');
console.log('');

if (check) {
  console.log('# Repository existence checks');
  console.log('');
  repos.forEach(printCheckCommands);
  process.exit(0);
}

if (!useGh) {
  console.log(
    '# Dry run. Add --gh to print commands intended to run after review.',
  );
  console.log('');
}

repos.forEach(printRepoCommands);
