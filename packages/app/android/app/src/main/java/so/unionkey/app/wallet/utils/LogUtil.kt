package so.unionkey.app.wallet.utils

import so.unionkey.app.wallet.MainApplication
import so.unionkey.app.wallet.unionkeyLite.NfcConstant
import so.unionkey.app.wallet.reactModule.LoggerManager

object LogUtil {
    @JvmStatic
    fun printLog(tag: String, msg: String) {
        if (NfcConstant.DEBUG) LoggerManager.getInstance()?.logInfo("$tag: $msg")
    }
}