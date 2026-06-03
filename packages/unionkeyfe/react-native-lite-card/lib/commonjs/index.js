"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const {
  OKLiteManager
} = _reactNative.NativeModules;
class OnekeyLite {
  UiEventEmitter = null;
  constructor() {
    if (_reactNative.Platform.OS !== 'android') return;
    this.UiEventEmitter = new _reactNative.NativeEventEmitter(OKLiteManager);
  }
  addConnectListener(listener) {
    this.removeConnectListeners();
    return this.UiEventEmitter?.addListener('nfc_ui_event', listener);
  }
  removeConnectListeners() {
    return this.UiEventEmitter?.removeAllListeners('nfc_ui_event');
  }
  addAccordListener() {
    if (_reactNative.Platform.OS !== 'android') return;
    const eventEmitter = new _reactNative.NativeEventEmitter(OKLiteManager);
    return eventEmitter.addListener('nfc_active_connection', () => {});
  }
  getLiteInfo() {
    return new Promise(resolve => {
      OKLiteManager.getLiteInfo(this.convertToPromise(resolve));
    });
  }
  checkNFCPermission() {
    return new Promise(resolve => {
      OKLiteManager.checkNFCPermission(this.convertToPromise(resolve));
    });
  }
  setMnemonic(mnemonic, pwd, overwrite = false) {
    return new Promise(resolve => {
      OKLiteManager.setMnemonic(mnemonic, pwd, overwrite, this.convertToPromise(resolve));
    });
  }
  getMnemonicWithPin(pwd) {
    return new Promise(resolve => {
      OKLiteManager.getMnemonicWithPin(pwd, this.convertToPromise(resolve));
    });
  }
  changePin(oldPin, newPin) {
    return new Promise(resolve => {
      OKLiteManager.changePin(oldPin, newPin, this.convertToPromise(resolve));
    });
  }
  reset() {
    return new Promise(resolve => {
      OKLiteManager.reset(this.convertToPromise(resolve));
    });
  }
  convertToPromise(resolve) {
    return (...result) => {
      resolve({
        error: result[0],
        data: result[1],
        cardInfo: result[2]
      });
    };
  }
  cancel() {
    if (_reactNative.Platform.OS === 'android') OKLiteManager.cancel();
  }
  intoSetting() {
    if (_reactNative.Platform.OS === 'android') {
      OKLiteManager.intoSetting();
    } else {
      _reactNative.Linking.openSettings();
    }
  }
}
const onekeyLite = new OnekeyLite();
var _default = exports.default = onekeyLite;
//# sourceMappingURL=index.js.map