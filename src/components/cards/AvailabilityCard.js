import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../themes/themes";

const AvailabilityCard = ({ availability }) => {
  return (
    <View
      style={[
        styles.statusCard,
        {
          backgroundColor:
            availability == "available"
              ? COLORS.acceptedBgColor
              : COLORS.declinedBgColor,
        },
      ]}
    >
      <Text
        style={[
          styles.statusText,
          {
            color:
              availability == "available"
                ? COLORS.acceptedColor
                : COLORS.declinedColor,
          },
        ]}
      >
        {availability == "available" ? "Available" : "UnAvailable"}
      </Text>
    </View>
  );
};

export default AvailabilityCard;

const styles = StyleSheet.create({
  statusCard: {
    padding: 5,
    borderRadius: 16,
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
  },
});
