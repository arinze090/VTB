import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxStoreProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./src/redux/store";

import MainNavigator from "./src/navigation/MainNavigator";

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <SafeAreaProvider>
      <ReduxStoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </PersistGate>
      </ReduxStoreProvider>
    </SafeAreaProvider>
  );
}
