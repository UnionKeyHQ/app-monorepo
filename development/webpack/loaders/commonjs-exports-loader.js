module.exports = function commonjsExportsLoader(source) {
  if (
    typeof source !== 'string' ||
    !source.includes('exports.') ||
    source.includes('var exports = module.exports;')
  ) {
    return source;
  }

  const strictModePattern = /(['"]use strict['"];?\s*)/;

  if (strictModePattern.test(source)) {
    return source.replace(
      strictModePattern,
      '$1\nvar exports = module.exports;\n',
    );
  }

  return `var exports = module.exports;\n${source}`;
};
