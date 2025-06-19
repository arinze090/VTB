import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { windowHeight, windowWidth } from "../../utils/Dimensions";

const DetailsOption = ({ label, value }) => {
  return (
    <View style={styles.Q}>
      <Text style={styles.summaryQ}>{label}</Text>
      <Text style={styles.summaryA}>{value || "N/A"}</Text>
    </View>
  );
};

export default DetailsOption;

const styles = StyleSheet.create({
  summaryQ: {
    color: "#333",
    // fontWeight: '500',
    fontSize: 14,
    // backgroundColor: 'red',
    // width: windowWidth / 1.3,
  },
  summaryQ1: {
    color: "#ccc",
    // fontWeight: '500',
    fontSize: 14,
    // backgroundColor: 'red',
    width: windowWidth / 1.3,
  },
  summaryA: {
    color: "#000",
    fontWeight: "500",
    fontSize: 16,
  },
  summaryQ2: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  br: {
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  Q: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: windowHeight / 15,
    alignContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    padding: 10,
  },
  breaker: {
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  summary: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    color: "#fff",
  },
});
