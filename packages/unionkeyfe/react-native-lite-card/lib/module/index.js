import { Linking, NativeEventEmitter, NativeModules, Platform } from 'react-native';
const {
  OKLiteManager
} = NativeModules;
class OnekeyLite {
  UiEventEmitter = null;
  constructor() {
    if (Platform.OS !== 'android') return;
    this.UiEventEmitter = new NativeEventEmitter(OKLiteManager);
  }
  addConnectListener(listener) {
    this.removeConnectListeners();
    return this.UiEventEmitter?.addListener('nfc_ui_event', listener);
  }
  removeConnectListeners() {
    return this.UiEventEmitter?.removeAllListeners('nfc_ui_event');
  }
  addAccordListener() {
    if (Platform.OS !== 'android') return;
    const eventEmitter = new NativeEventEmitter(OKLiteManager);
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
    if (Platform.OS === 'android') OKLiteManager.cancel();
  }
  intoSetting() {
    if (Platform.OS === 'android') {
      OKLiteManager.intoSetting();
    } else {
      Linking.openSettings();
    }
  }
}
const onekeyLite = new OnekeyLite();
export default onekeyLite;
//# sourceMappingURL=index.js.map