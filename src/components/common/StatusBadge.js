import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { statusStyles } from "../../Library/Precedence";

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || {};

  return (
    <View
      style={{
        backgroundColor: style.bgColor,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
      }}
    >
      <Text style={{ color: style.textColor, fontWeight: "500", fontSize: 12 }}>
        {style.message}
      </Text>
    </View>
  );
};

export default StatusBadge;

const styles = StyleSheet.create({});
