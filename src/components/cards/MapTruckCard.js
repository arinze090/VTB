import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatPerMinute, formatToNaira } from "../../Library/Common";
import { windowWidth } from "../../utils/Dimensions";
import { COLORS } from "../../themes/themes";

const MapTruckCard = ({ props, isSelected, onPress, distance, routeInfo }) => {
  const estimatedTime = Math.round(distance * 2);
  console.log("estimatedTime", estimatedTime, props);

  const calculateTruckPrice = (truck, routeInfo) => {
    // Your pricing logic here
    const basePrice = 1500;
    const durationMultiplier = routeInfo?.duration
      ? formatPerMinute(routeInfo?.duration)
      : 10;
    return basePrice * durationMultiplier;
  };

  return (
    <TouchableOpacity
      style={[styles.truckCard, isSelected && styles.selectedTruckCard]}
      onPress={onPress}
    >
      <View style={styles.truckImageContainer}>
        {props?.pictures?.[0] ? (
          <Image
            source={{ uri: props?.pictures[0] }}
            style={styles.truckImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.truckPlaceholder}>
            <Ionicons name="car-outline" size={24} color="#666" />
          </View>
        )}
      </View>

      <View style={styles.truckInfo}>
        <Text style={styles.truckName} numberOfLines={1}>
          {props?.car_name || "Unknown Vehicle"}
        </Text>
        <Text style={styles.truckType}>{props?.type || "Truck"}</Text>

        <View style={styles.truckDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={12} color="#666" />
            <Text style={styles.detailText}>{distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={12} color="#666" />
            <Text style={styles.detailText}>{estimatedTime} min</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.truckPrice}>
            {formatToNaira(calculateTruckPrice(props, routeInfo))}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.rating}>{props?.rating || "4.5"}</Text>
          </View>
        </View>
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={COLORS.vtbBtnColor}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MapTruckCard;

const styles = StyleSheet.create({
  truckCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    width: windowWidth * 0.7,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTruckCard: {
    borderColor: COLORS.vtbBtnColor,
    borderWidth: 2,
    backgroundColor: "#F8FCFF",
  },
  truckImageContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  truckImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  truckPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  truckInfo: {
    alignItems: "center",
  },
  truckName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
    textAlign: "center",
  },
  truckType: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  truckDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  detailText: {
    fontSize: 11,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  truckPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.vtbBtnColor,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    fontSize: 11,
    color: "#666",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  bookingSection: {
    paddingHorizontal: 15,
    paddingTop: 12,
  },
  bookButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
