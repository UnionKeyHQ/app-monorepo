"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
var _default = exports.default = {
  clearAll: () => {
    _reactNative.NativeModules.RNWebViewCleaner.clearAll();
  }
};
//# sourceMappingURL=index.js.map