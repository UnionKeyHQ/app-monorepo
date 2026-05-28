// scripts/replace-touch-to-dex-in-node-modules.js
const fs = require('fs');
const path = require('path');

console.log('🔍 开始在全 node_modules 范围内搜索并替换 Touch → DEX ...');

// 1. 定位项目根目录的 node_modules
const projectRoot = process.cwd();
const nodeModulesRoot = path.join(projectRoot, 'node_modules');

if (!fs.existsSync(nodeModulesRoot)) {
  console.error('❌ 错误：node_modules 目录不存在。');
  console.log('当前目录：', projectRoot);
  process.exit(1);
}

console.log('📁 扫描根目录：', nodeModulesRoot);

// 2. 递归查找所有 JavaScript / TypeScript 文件
function findAllJSFiles(dir, fileList = [], skippedDirs = []) {
  const SKIP_DIRS = [
    '.git', '.github', '.vscode',
    '__tests__', 'test', 'tests',
    'coverage', 'build', 'release',
    'docs', 'examples', 'demo'
  ];

  const SKIP_PACKAGE_PREFIXES = [
    '@types', 'typescript', 'eslint',
    'webpack', 'babel', 'jest', 'mocha', 'karma'
  ];

  let items;
  try {
    items = fs.readdirSync(dir);
  } catch {
    return { fileList, skippedDirs };
  }

  for (const item of items) {
    const itemPath = path.join(dir, item);
    let stat;
    try {
      stat = fs.statSync(itemPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      const dirName = path.basename(itemPath);
      const shouldSkip =
        SKIP_DIRS.includes(dirName) ||
        SKIP_PACKAGE_PREFIXES.some(p => dirName.startsWith(p)) ||
        /^\./.test(dirName);

      if (shouldSkip) {
        skippedDirs.push(itemPath);
        continue;
      }

      findAllJSFiles(itemPath, fileList, skippedDirs);
    } else if (stat.isFile()) {
      if (
        /\.(js|ts|jsx|tsx|mjs|cjs)$/i.test(item) &&
        !/\.(test|spec|min|prod|bundle)\.(js|ts)$/i.test(item) &&
        !/\.map$/i.test(item)
      ) {
        fileList.push(itemPath);
      }
    }
  }

  return { fileList, skippedDirs };
}

console.log('📄 正在递归扫描 node_modules（可能需要一些时间）...');
const scanResult = findAllJSFiles(nodeModulesRoot);
const allFiles = scanResult.fileList;
const skippedDirs = scanResult.skippedDirs;

console.log(`✅ 扫描完成！`);
console.log(`📊 待检查文件：${allFiles.length}`);
console.log(`⏩ 跳过目录：${skippedDirs.length}`);

// 3. 定义【查找 & 替换】规则（只动这一句）
const SEARCH_PATTERN = /if\s*\(\s*name\.startsWith\(['"]Touch['"]\)\s*\)/g;
const REPLACEMENT = `if (name.startsWith('DEX'))`;

let checkedFiles = 0;
let modifiedFiles = [];

console.log('\n🔄 开始分析并执行替换...');

const progressInterval = Math.max(1, Math.floor(allFiles.length * 0.02));

for (const filePath of allFiles) {
  checkedFiles++;

  if (checkedFiles % progressInterval === 0) {
    const percent = ((checkedFiles / allFiles.length) * 100).toFixed(1);
    console.log(`📊 进度: ${percent}% (${checkedFiles}/${allFiles.length})`);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // 快速过滤
    if (!content.includes('startsWith') || !content.includes('Touch')) {
      continue;
    }

    if (!SEARCH_PATTERN.test(content)) {
      continue;
    }

    const newContent = content.replace(SEARCH_PATTERN, REPLACEMENT);

    if (newContent !== content) {
      const backupPath = filePath + '.backup_' + Date.now();
      fs.copyFileSync(filePath, backupPath);
      fs.writeFileSync(filePath, newContent, 'utf8');

      modifiedFiles.push({
        file: path.relative(projectRoot, filePath),
        backup: path.relative(projectRoot, backupPath),
      });

      console.log(`🎯 已修改：${path.relative(projectRoot, filePath)}`);
    }
  } catch {
    continue;
  }
}

// 4. 汇总报告
console.log('\n' + '='.repeat(60));
console.log('🎯 替换完成');
console.log('='.repeat(60));
console.log(`📄 扫描文件：${checkedFiles}`);
console.log(`✏️ 修改文件：${modifiedFiles.length}`);

if (modifiedFiles.length > 0) {
  console.log('\n📋 修改文件列表：');
  modifiedFiles.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.file}`);
  });

  console.log('\n🔄 回滚方法（如需恢复）：');
  modifiedFiles.forEach(f => {
    console.log(`cp "${f.backup}" "${f.file}"`);
  });
} else {
  console.log('\n💡 未发现需要替换的代码。');
}

console.log('\n✨ 脚本执行完毕！');