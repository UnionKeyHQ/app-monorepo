import { NativeEventEmitter } from 'react-native';
import type { CardInfo, PromiseResult } from './types';
export type NfcConnectUiState = {
    code: number;
    message: string;
};
declare class OnekeyLite {
    UiEventEmitter: NativeEventEmitter | null;
    constructor();
    addConnectListener(listener: (event: NfcConnectUiState) => void): import("react-native").EmitterSubscription | undefined;
    removeConnectListeners(): void | undefined;
    addAccordListener(): import("react-native").EmitterSubscription | undefined;
    getLiteInfo(): Promise<PromiseResult<CardInfo>>;
    checkNFCPermission(): Promise<PromiseResult<boolean>>;
    setMnemonic(mnemonic: string, pwd: string, overwrite?: boolean): Promise<PromiseResult<boolean>>;
    getMnemonicWithPin(pwd: string): Promise<PromiseResult<string>>;
    changePin(oldPin: string, newPin: string): Promise<PromiseResult<boolean>>;
    reset(): Promise<PromiseResult<boolean>>;
    convertToPromise<T>(resolve: (value: PromiseResult<T> | PromiseLike<PromiseResult<T>>) => void): (error: import("./types").CallbackError, data: T | null, cardInfo: CardInfo) => void;
    cancel(): void;
    intoSetting(): void;
}
declare const onekeyLite: OnekeyLite;
export default onekeyLite;
//# sourceMappingURL=index.d.ts.map