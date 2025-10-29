import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore  // 👈 IMPORTANT: Import this!
import GoogleMaps  // 👈 IMPORTANT: Import Google Maps

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()  // 👈 IMPORTANT: Initialize Firebase here
    GMSServices.provideAPIKey("AIzaSyAZ-NsqVk2FGJYnJ8aQTuXI0v9JOB5MS-8")  // 👈 IMPORTANT: Initialize Google Maps

    self.moduleName = "epredict"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
