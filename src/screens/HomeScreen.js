import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

import VtbTruckCard from "../components/cards/VtbTruckCard";
import Carousels from "../components/common/Carousel";
import ScrollViewSpace from "../components/common/ScrollViewSpace";
import SearchBar from "../components/search/SearchBar";
import { getTimeOfDayGreeting } from "../Library/Common";
import { saveTruckListings } from "../redux/features/user/userSlice";
import { COLORS } from "../themes/themes";
import axiosInstance from "../utils/api-client";
import { windowWidth } from "../utils/Dimensions";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const HERE_API_KEY = Constants.expoConfig?.extra?.HERE_API_KEY;

  const userProfle = state?.user?.user;
  console.log("userProfle", userProfle);

  const reduxTruckListings = state?.user?.truckListings;
  console.log("reduxTruckListings", reduxTruckListings);

  const greeting = getTimeOfDayGreeting();

  const [userLiveAddress, setUserLiveAddress] = useState();
  const [coordinates, setCoordinates] = useState();

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  console.log("location", location, errorMsg);

  const fetchTruckListings = async () => {
    try {
      await axiosInstance({
        url: "api/listings/all-offerings",
        method: "GET",
      })
        .then((res) => {
          console.log("fetchTruckListings res", res?.data);
          dispatch(saveTruckListings(res?.data?.data));
        })
        .catch((err) => {
          console.log("fetchTruckListings err", err?.response?.data);
        });
    } catch (error) {
      console.log("fetchTruckListings error", error);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const apiKey = HERE_API_KEY;

    try {
      const res = await axios.get(
        "https://revgeocode.search.hereapi.com/v1/revgeocode",
        {
          params: {
            at: `${lat},${lng}`,
            apikey: apiKey,
          },
        }
      );

      console.log("reverseGeocode res:", res);

      const address = res?.data?.items?.[0]?.address?.label;
      setUserLiveAddress(address);
      console.log("Resolved address:", address);
      return address;
    } catch (error) {
      console.error("Reverse geocoding error:", error?.response);
      return null;
    }
  };

  useEffect(() => {
    fetchTruckListings();
  }, []);

  useEffect(() => {
    (async () => {
      // Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      console.log("locationnnnn", loc);
      reverseGeocode(loc?.coords?.latitude, loc?.coords?.longitude);
      setCoordinates(loc?.coords);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View
        style={{
          backgroundColor: COLORS.vtbBtnColor,
          marginBottom: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.menuBorder} activeOpacity={0.9}>
              <Ionicons
                name="location-outline"
                size={25}
                color="black"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </TouchableOpacity>

            <View style={styles.profileDetails}>
              {/* <Text style={styles.profileName}>
                Hello,{' '}
                <Text style={{fontWeight: '600'}}>{userProfle?.fullname} </Text>
              </Text> */}
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  color: "white",
                  width: windowWidth / 2,
                  // backgroundColor: 'red',
                }}
              >
                {userLiveAddress}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color="white"
              onPress={() => {
                navigation.navigate("Notification");
              }}
              style={{ marginLeft: 24 }}
            />
          </View>
        </View>
        <View
          style={{
            padding: 20,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: "white", marginBottom: 10 }}>
            {greeting},{" "}
            <Text
              style={{
                fontSize: 14,
                color: "white",
                marginBottom: 10,
                fontWeight: "700",
              }}
            >
              {userProfle?.fullname}!
            </Text>
          </Text>
          <Text style={{ fontSize: 22, color: "white", fontWeight: "600" }}>
            Want to Book a Truck ?
          </Text>
        </View>
      </View>

      <SearchBar
        onPressIn={() =>
          navigation.navigate("MapsSearchScreen", {
            userLiveAddress: userLiveAddress,
            coordinates: coordinates,
          })
        }
        searchPlaceholder={"Where to"}
        searchIcon={"search-outline"}
      />

      {/* Carousel section */}
      {/* <Carousels /> */}

      {/* Popular Trucks */}
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600" }}>
            Popular Trucks
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              textDecorationLine: "underline",
            }}
          >
            See More
          </Text>
        </View>
        {reduxTruckListings?.map((cur, i) => (
          <VtbTruckCard
            key={i}
            props={cur}
            onPress={() => {
              navigation.navigate("TruckDetails", cur);
            }}
          />
        ))}

        <ScrollViewSpace />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    // backgroundColor: '#F7F7F7',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 40,
  },
  profileSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // padding: 20,
  },
  profileDetails: {
    // alignItems: 'center',
    marginLeft: 10,
    justifyContent: "space-between",
    // backgroundColor: 'red',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 24,
    color: "white",
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 24,
    color: "#000",
  },
  wallet: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLORS.pinky,
    alignItems: "center",
    borderRadius: 10,
    marginRight: 6,
  },
  walletBalance: {
    color: "black",
    fontWeight: "700",
    fontSize: 14,
    marginRight: 6,
  },
  menuBorder: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
  },
});
