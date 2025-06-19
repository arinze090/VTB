import React from "react";
import { Platform, SafeAreaView, StyleSheet } from "react-native";

const SafeAreaViewComponent = ({ children }) => {
  return <SafeAreaView style={[styles.container]}>{children}</SafeAreaView>;
};

export default SafeAreaViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: Platform.OS == "android" ? 0 : 20,
  },
});
