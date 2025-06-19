import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import VtbBookingCard from "../../components/cards/VtbBookingCard";
import HeaderTitle from "../../components/common/HeaderTitle";
import SafeAreaViewComponent from "../../components/common/SafeAreaViewComponent";
import ScrollViewSpace from "../../components/common/ScrollViewSpace";
import { saveBookedTrucks } from "../../redux/features/user/userSlice";
import { COLORS } from "../../themes/themes";
import axiosInstance from "../../utils/api-client";

const BookedTrucksListingScreen = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const userProfle = state?.user?.user;
  console.log("userProfle", userProfle);

  const reduxBookedTrucks = state?.user?.bookedTrucks;
  console.log("reduxBookedTrucks", reduxBookedTrucks);

  const [loading, setLoading] = useState(false);

  const getAllBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("api/books/user-booking");

      const userBookings = res?.data;

      if (!userBookings) {
        return;
      }

      const enrichedBookingData = await Promise.all(
        userBookings.map(async (booking) => {
          try {
            const listingRes = await axiosInstance.get(
              `api/listing/offerings/${booking?.listingId}`
            );
            return {
              ...booking,
              listingData: listingRes?.data?.data,
            };
          } catch (error) {
            console.error(
              `Error fetching listing for ${booking?.listingId}`,
              error
            );
            return { ...booking, listingData: null };
          }
        })
      );

      console.log("enrichedBookingData", enrichedBookingData);
      dispatch(saveBookedTrucks(enrichedBookingData));
    } catch (error) {
      console.log("getAllBookings error", error?.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  const onRefresh = useCallback(() => {
    setLoading(true);
    getAllBookings();
  }, []);

  return (
    <SafeAreaViewComponent>
      <HeaderTitle headerTitle={"My Bookings"} />

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
        {loading ? (
          <Text style={styles.loadingText}>
            Please wait while we fetch your bookings
          </Text>
        ) : reduxBookedTrucks && reduxBookedTrucks?.length ? (
          reduxBookedTrucks?.map((cur, i) => (
            <VtbBookingCard key={i} props={cur} price={cur?.price} />
          ))
        ) : (
          <Text style={[styles.noData]}>
            You dont have any booked vehicle at the moment. You can browse
            through the list of vehicles listing and book one at your
            convenience
          </Text>
        )}
        <ScrollViewSpace />
      </ScrollView>
    </SafeAreaViewComponent>
  );
};

export default BookedTrucksListingScreen;

const styles = StyleSheet.create({
  noData: {
    fontWeight: "400",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});
