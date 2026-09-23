package so.unionkey.app.wallet

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import so.unionkey.app.wallet.reactModule.OKLiteManager
import so.unionkey.app.wallet.reactModule.PermissionManager
import so.unionkey.app.wallet.reactModule.MinimizerModule
import so.unionkey.app.wallet.reactModule.HttpServerModule
import so.unionkey.app.wallet.reactModule.CacheModule
import so.unionkey.app.wallet.reactModule.AppRestartManager
import so.unionkey.app.wallet.reactModule.LoggerManager
import so.unionkey.app.wallet.viewManager.homePage.HomePageManager


class MainReactNativePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules = mutableListOf<NativeModule>()

        modules.add(OKLiteManager(reactContext))
        modules.add(PermissionManager(reactContext))
        modules.add(MinimizerModule(reactContext))
        modules.add(HttpServerModule(reactContext))
        modules.add(CacheModule(reactContext))
        modules.add(AppRestartManager(reactContext))
        modules.add(LoggerManager(reactContext))

        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<*, *>> {
        val managers = mutableListOf<ViewManager<*, *>>()
        managers.add(HomePageManager())
        return managers
    }
}
