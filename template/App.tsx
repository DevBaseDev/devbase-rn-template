import * as Sentry from "@sentry/react-native";
import React from "react";
import { Platform, UIManager } from "react-native";
import BuildConfig from "react-native-config";
import { enableScreens } from "react-native-screens";
import reactotron from "./reactotron";
import RootErrorBoundary from "./src/features/error-boundary/RootErrorBoundary";
import Navigator from "./src/features/navigation/Navigator";
import { makeMirage } from "./src/services/network/mock/mirage";
import { PortalProvider } from "./src/common/contexts/PortalContext";
(function setup() {
  // Log environement variables
  console.log(BuildConfig);

  // React Navigation, optimize memory usage.
  enableScreens();

  // Initialize sentry SDK (DSN string must be inserted in BuildConfig environment files).
  const { SENTRY_DSN } = BuildConfig;

  if (typeof SENTRY_DSN === "string" && SENTRY_DSN.length > 0) {
    Sentry.init({
      dsn: SENTRY_DSN,
    });
  }

  // Layout animation
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  // Mirage – API Mocking
  if (BuildConfig.MOCK_EXAMPLE_API === "YES") {
    makeMirage();
    __DEV__ && console.log("Mirage Configured");
  }
})();

const App = () => {
  return (
    <RootErrorBoundary>
      <PortalProvider>
        <Navigator />
      </PortalProvider>
    </RootErrorBoundary>
  );
};

const AppWithOverlay = __DEV__ ? reactotron.overlay(App) : App;

export default AppWithOverlay;
