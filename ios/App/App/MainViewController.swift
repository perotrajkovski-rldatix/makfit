import Capacitor
import UIKit

// Registers custom native plugins that aren't distributed as npm/SPM packages
// (e.g. StoreKitBillingPlugin) with the Capacitor bridge. capacitorDidLoad() is
// the earliest timing-safe hook — it runs once the bridge exists, before the
// web view starts loading JS, so registerPluginInstance() is guaranteed to run
// before any JS code could try to call the plugin.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(StoreKitBillingPlugin())
    }
}
