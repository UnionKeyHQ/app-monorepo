// scripts/replace-regex-in-entire-node-modules.js
const fs = require('fs');
const path = require('path');

console.log('🔍 开始在全 node_modules 范围内搜索并修复...');

// 1. 定位项目根目录的 node_modules
const projectRoot = process.cwd();
const nodeModulesRoot = path.join(projectRoot, 'node_modules');

if (!fs.existsSync(nodeModulesRoot)) {
  console.error('❌ 错误：node_modules 目录不存在。');
  console.log('请确保依赖已安装。当前目录：', projectRoot);
  process.exit(1);
}

console.log('📁 扫描根目录：', nodeModulesRoot);

// 2. 递归查找所有 JavaScript/TypeScript 文件 (排除部分目录)
function findAllJSFiles(dir, fileList = [], skippedDirs = []) {
  // 需要跳过的目录名（提高效率，避免扫描无关项）
  const SKIP_DIRS = [
    '.git', '.github', '.vscode', '__tests__', 'test', 'tests',
    'coverage', 'node_modules', // 注意：这里跳过的是次级node_modules
     'build', 'release', // 通常为构建产物
    'docs', 'examples', 'demo',
    '*.min.js', '*.bundle.js' // 通过通配符思想在后续过滤
  ];
  
  // 需要跳过的包名前缀（针对一些已知的大型、无关包提升速度）
  const SKIP_PACKAGE_PREFIXES = [
    '@types', 'typescript', 'eslint', 'webpack',
    'babel', 'jest', 'mocha', 'karma' // 构建、测试工具包
  ];

  let items;
  try {
    items = fs.readdirSync(dir);
  } catch (err) {
    // 忽略无权限或损坏的目录
    return fileList;
  }
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    let stat;
    try {
      stat = fs.statSync(itemPath);
    } catch (err) {
      continue; // 跳过无法访问的项目
    }
    
    if (stat.isDirectory()) {
      const dirName = path.basename(itemPath);
      const parentDirName = path.basename(dir);
      
      // 检查是否应该跳过此目录
      const shouldSkipDir = SKIP_DIRS.includes(dirName) ||
                           SKIP_PACKAGE_PREFIXES.some(prefix => dirName.startsWith(prefix)) ||
                           /^\./.test(dirName); // 跳过隐藏目录
      
      if (shouldSkipDir) {
        skippedDirs.push(itemPath);
        continue;
      }
      
      // 继续递归扫描
      findAllJSFiles(itemPath, fileList, skippedDirs);
    } else if (stat.isFile()) {
      // 只处理 .js, .ts, .jsx, .tsx, .mjs, .cjs 文件
      if (/\.(js|ts|jsx|tsx|mjs|cjs)$/i.test(item)) {
        // 跳过明显的测试文件、压缩文件、映射文件
        if (!/\.(test|spec|min|prod|bundle)\.(js|ts)$/i.test(item) &&
            !/\.map$/i.test(item)) {
          fileList.push(itemPath);
        }
      }
    }
  }
  return { fileList, skippedDirs };
}

console.log('📄 正在递归扫描 node_modules（这可能需要一些时间）...');
const scanResult = findAllJSFiles(nodeModulesRoot);
const allFiles = scanResult.fileList;
const skippedDirs = scanResult.skippedDirs;

console.log(`✅ 扫描完成！`);
console.log(`📊 找到待检查文件：${allFiles.length} 个`);
console.log(`⏩ 跳过扫描目录：${skippedDirs.length} 个（如测试文件、构建工具等）`);
if (skippedDirs.length > 0 && allFiles.length > 5000) {
  console.log('   （跳过的目录有助于大幅提升扫描速度）');
}

// 3. 定义要查找的【精确】原始正则表达式模式
// 注意：这里我们严格匹配用户提供的原始字符串
// 格式：const re = /(BixinKey\d{10})|(K\d{4})|(T\d{4})|(Touch\s\w{4})|(Pro\s\w{4})/i
// 考虑可能存在的微小变体（空格、let/var）
const ORIGINAL_REGEX_PATTERNS = [
  // 模式1：精确匹配（用户提供的标准格式）
  /const\s+re\s*=\s*\/\(BixinKey\\d\{10\}\)\|\(K\\d\{4\}\)\|\(T\\d\{4\}\)\|\(Touch\\s\\w\{4\}\)\|\(Pro\\s\\w\{4\}\)\/i/,
  
  // 模式2：使用 let 或 var 声明
  /(?:let|var)\s+re\s*=\s*\/\(BixinKey\\d\{10\}\)\|\(K\\d\{4\}\)\|\(T\\d\{4\}\)\|\(Touch\\s\\w\{4\}\)\|\(Pro\\s\\w\{4\}\)\/i/,
  
  // 模式3：等号周围可能有更多空格或换行
  /const\s+re\s*=\s*\/\s*\(\s*BixinKey\s*\\d\s*\{\s  *10\s*\}\s*\)\s*\|\s*\(\s*K\s*\\d\s*\{\s*4\s*\}\s*\)\s*\|\s*\(\s*T\s*\\d\s*\{\s*4\s*\}\s*\)\s*\|\s*\(\s*Touch\s*\\s\s*\\w\s*\{\s*4\s*\}\s*\)\s*\|\s*\(\s*Pro\s*\\s\s*\\w\s*\{\s*4\s*\}\s*\)\s*\/\s*i/i
];

// 4. 定义要替换成的【精确】目标正则表达式
// 目标：const re = /(DEX[\s-]\w{6})/i
const TARGET_REGEX = '/(DEX[\\s-]\\w{6})/i';
// 替换后的完整行（保留 const/let/var 声明）
function getReplacementLine(originalLine) {
  if (originalLine.includes('let re')) {
    return `let re = ${TARGET_REGEX}`;
  } else if (originalLine.includes('var re')) {
    return `var re = ${TARGET_REGEX}`;
  }
  // 默认为 const
  return `const re = ${TARGET_REGEX}`;
}

// 5. 开始遍历、查找并替换
let modifiedFiles = [];
let checkedFiles = 0;
let patternMatches = {};

console.log('\n🔄 开始分析文件内容并执行替换...');
// 为提升体验，显示一个进度条（每处理2%的文件报告一次）
const progressInterval = Math.max(1, Math.floor(allFiles.length * 0.02));

for (const filePath of allFiles) {
  checkedFiles++;
  
  // 进度反馈
  if (checkedFiles % progressInterval === 0) {
    const percent = ((checkedFiles / allFiles.length) * 100).toFixed(1);
    console.log(`📊 进度: ${percent}% (${checkedFiles}/${allFiles.length})`);
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(projectRoot, filePath);
    
    // 先快速跳过明显不包含目标内容的文件
    if (!content.includes('BixinKey') && !content.includes('const re') && 
        !content.includes('let re') && !content.includes('var re')) {
      continue;
    }
    
    // 检查是否已包含目标正则表达式（避免重复修改）
    if (content.includes(TARGET_REGEX)) {
      continue;
    }
    
    // 尝试匹配每一个原始正则表达式模式
    let matchedPattern = null;
    let matchDetails = null;
    
    for (let i = 0; i < ORIGINAL_REGEX_PATTERNS.length; i++) {
      const pattern = ORIGINAL_REGEX_PATTERNS[i];
      const match = content.match(pattern);
      if (match) {
        matchedPattern = pattern;
        matchDetails = {
          patternIndex: i,
          matchedText: match[0],
          position: match.index
        };
        break;
      }
    }
    
    if (matchedPattern) {
      console.log(`\n🎯 [${checkedFiles}/${allFiles.length}] 发现匹配！`);
      console.log(`   文件：${relativePath}`);
      console.log(`   匹配模式：模式${matchDetails.patternIndex + 1}`);
      console.log(`   匹配内容：${matchDetails.matchedText.substring(0, 80)}...`);
      
      // 备份原文件
      const backupPath = filePath + '.backup_' + Date.now();
      fs.copyFileSync(filePath, backupPath);
      
      // 执行替换
      const newContent = content.replace(matchedPattern, (match) => {
        // 根据原始行决定使用 const/let/var
        return getReplacementLine(match);
      });
      
      // 写入修改
      fs.writeFileSync(filePath, newContent, 'utf8');
      
      // 记录修改信息
      modifiedFiles.push({
        path: relativePath,
        backup: backupPath,
        pattern: matchDetails.patternIndex + 1
      });
      
      // 统计模式使用情况
      const patternKey = `模式${matchDetails.patternIndex + 1}`;
      patternMatches[patternKey] = (patternMatches[patternKey] || 0) + 1;
      
      console.log(`   ✅ 已替换并备份至：${path.relative(projectRoot, backupPath)}`);
    }
  } catch (error) {
    // 忽略无法读取或处理的文件
    continue;
  }
}

// 6. 输出详细的结果报告
console.log('\n' + '='.repeat(60));
console.log('🎯 全局替换完成！汇总报告');
console.log('='.repeat(60));
console.log(`📁 扫描根目录：${nodeModulesRoot}`);
console.log(`📄 扫描文件总数：${allFiles.length} 个`);
console.log(`🔍 实际检查文件：${checkedFiles} 个`);
console.log(`✏️  成功修改文件：${modifiedFiles.length} 个`);

if (Object.keys(patternMatches).length > 0) {
  console.log(`📊 模式匹配统计：`);
  for (const [pattern, count] of Object.entries(patternMatches)) {
    console.log(`   ${pattern}: ${count} 次`);
  }
}

if (modifiedFiles.length > 0) {
  console.log('\n📋 被修改的文件列表：');
  modifiedFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file.path} (匹配模式${file.pattern})`);
  });
  
  // 7. 验证修改结果
  console.log('\n🔬 开始验证修改...');
  let verifiedCount = 0;
  let failedFiles = [];
  
  for (const file of modifiedFiles) {
    const fullPath = path.join(projectRoot, file.path);
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(TARGET_REGEX)) {
        verifiedCount++;
      } else {
        failedFiles.push(file.path);
      }
    } catch (error) {
      failedFiles.push(file.path);
    }
  }
  
  console.log(`📊 验证结果：${verifiedCount}/${modifiedFiles.length} 个文件验证成功`);
  
  if (failedFiles.length > 0) {
    console.log('\n⚠️  以下文件验证失败（目标正则表达式未找到）：');
    failedFiles.forEach(f => console.log(`   ❌ ${f}`));
    console.log('\n💡 建议：检查备份文件，确认原始内容是否被正确匹配。');
  }
} else {
  console.log('\n💡 未找到需要修改的文件。可能原因：');
  console.log('   1. 目标正则表达式不存在于当前 node_modules 中');
  console.log('   2. 正则表达式的格式与脚本查找的模式不完全一致');
  console.log('   3. 文件可能已被之前的操作修改过');
}

// 8. 提供回滚指令
if (modifiedFiles.length > 0) {
  console.log('\n' + '='.repeat(60));
  console.log('🔄 如何回滚（如果需要恢复原状）：');
  console.log('='.repeat(60));
  console.log('如需恢复所有修改，可执行以下命令（在项目根目录）：');
  console.log('');
  modifiedFiles.forEach(file => {
    const backupRel = path.relative(projectRoot, file.backup);
    const fileRel = file.path;
    console.log(`cp "${backupRel}" "${fileRel}"`);
  });
  console.log('\n或运行以下 Node.js 代码片段：');
  console.log(`
const fs = require('fs');
${modifiedFiles.map(f => 
  `fs.copyFileSync("${f.backup}", "${path.join(projectRoot, f.path)}");`
).join('\n')}
console.log('已恢复 ${modifiedFiles.length} 个文件');
  `);
}

console.log('\n✨ 脚本执行完毕！');