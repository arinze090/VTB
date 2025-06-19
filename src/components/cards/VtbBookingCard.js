import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { formatDate, setPriceTo2DecimalPlaces } from "../../Library/Common";
import { COLORS } from "../../themes/themes";
import { windowWidth } from "../../utils/Dimensions";
import StatusBadge from "../common/StatusBadge";

const VtbBookingCard = ({ props, onPress, price }) => {
  console.log("ppp", props);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.vtbCard}
    >
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Image
          source={{ uri: props?.listingData?.pictures[0] }}
          style={styles.truckImage}
        />
        <View style={{ justifyContent: "space-between" }}>
          <Text style={styles.truckName}>{props?.listingData?.car_name}</Text>
          <Text style={styles.truckType}>{props?.listingData?.type}</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="cash-outline"
              size={15}
              color="black"
              style={{ marginRight: 7 }}
            />
            <Text style={styles.truckName}>
              {setPriceTo2DecimalPlaces(parseInt(props?.price))}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="calendar-outline" size={10} color={COLORS.appGrey2} />
          <Text style={styles.truckQ}>Date: </Text>
          <Text style={styles.truckA}>{formatDate(props?.createdAt)}</Text>
        </View>

        <View>
          <StatusBadge status={props?.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VtbBookingCard;

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
    fontSize: 12,
    fontWeight: "500",
    // marginBottom: 4,
  },
});
