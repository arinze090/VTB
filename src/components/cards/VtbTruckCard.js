import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { formatPriceRange } from "../../Library/Common";
import { COLORS } from "../../themes/themes";
import { windowWidth } from "../../utils/Dimensions";
import AvailabilityCard from "./AvailabilityCard";

const VtbTruckCard = ({ props, onPress }) => {
  console.log("ppp", props);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.vtbCard}
    >
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Image source={{ uri: props?.pictures[0] }} style={styles.truckImage} />
        <View style={{ justifyContent: "space-between" }}>
          <Text style={styles.truckName}>{props?.car_name}</Text>
          <Text style={styles.truckType}>{props?.type}</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="cash-outline"
              size={15}
              color="black"
              style={{ marginRight: 7 }}
            />
            <Text style={styles.truckName}>
              {formatPriceRange(props?.price?.[0])}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.truckA}>{props?.location}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="globe-outline" size={10} color={COLORS.appGrey2} />
            <Text style={styles.truckQ}>Location</Text>
          </View>
        </View>
        <View>
          <Text style={styles.truckA}>10 tons</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="cube-outline" size={10} color={COLORS.appGrey2} />
            <Text style={styles.truckQ}>Capacity</Text>
          </View>
        </View>
        <View>
          <AvailabilityCard availability={props?.availability} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VtbTruckCard;

const styles = StyleSheet.create({
  vtbCard: {
    padding: 10,
    width: windowWidth / 1.1,
    // backgroundColor: 'red',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.appGrey,
    marginBottom: 10,
  },
  truckImage: {
    width: windowWidth / 4,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  truckName: {
    fontSize: 16,
    fontWeight: "500",
  },
  truckType: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.appGrey5,
  },
  truckQ: {
    fontSize: 13,
    marginLeft: 2,
    color: COLORS.appGrey2,
  },
  truckA: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
});
