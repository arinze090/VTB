import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import VtbTruckCard from "../../components/cards/VtbTruckCard";
import HeaderTitle from "../../components/common/HeaderTitle";
import SafeAreaViewComponent from "../../components/common/SafeAreaViewComponent";
import ScrollViewSpace from "../../components/common/ScrollViewSpace";
import SearchBar from "../../components/search/SearchBar";
import { saveTruckListings } from "../../redux/features/user/userSlice";
import { COLORS } from "../../themes/themes";
import axiosInstance from "../../utils/api-client";

const TruckListing = ({ navigation }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const userProfle = state?.user?.user;
  console.log("userProfle", userProfle);

  const reduxTruckListings = state?.user?.truckListings;
  console.log("reduxTruckListings", reduxTruckListings);

  const [loading, setLoading] = useState(false);

  const fetchTruckListings = async () => {
    setLoading(true);

    try {
      await axiosInstance({
        url: "api/listing/all-offerings",
        method: "GET",
      })
        .then((res) => {
          console.log("fetchTruckListings res", res?.data);
          setLoading(false);

          dispatch(saveTruckListings(res?.data?.data));
        })
        .catch((err) => {
          console.log("fetchTruckListings err", err?.response?.data);
          setLoading(false);
        });
    } catch (error) {
      console.log("fetchTruckListings error", error);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchTruckListings();
  }, []);

  return (
    <SafeAreaViewComponent>
      <HeaderTitle headerTitle={"Truck Listings"} />
      <SearchBar searchPlaceholder={"Search trucks, vans, buses ..."} />

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={COLORS.vtbBtnColor}
            style={{ zIndex: 999 }}
          />
        }
      >
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
    </SafeAreaViewComponent>
  );
};

export default TruckListing;

const styles = StyleSheet.create({});
