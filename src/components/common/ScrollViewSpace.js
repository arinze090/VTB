import React from "react";
import { StyleSheet, View } from "react-native";

const ScrollViewSpace = () => {
  return (
    <View
      style={[
        styles.section,
        { marginTop: 50, minHeight: 150, marginBottom: 20 },
      ]}
    />
  );
};

export default ScrollViewSpace;

const styles = StyleSheet.create({});
