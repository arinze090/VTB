import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { formatDateTime, RNToast } from "../../Library/Common";
import VtbTruckCard2 from "../../components/cards/VtbTruckCard2";
import DetailsOption from "../../components/common/DetailsOption";
import DetailsOption2 from "../../components/common/DetailsOption2";
import FixedBottomContainer from "../../components/common/FixedBottomContainer";
import HeaderTitle from "../../components/common/HeaderTitle";
import SafeAreaViewComponent from "../../components/common/SafeAreaViewComponent";
import ScrollViewSpace from "../../components/common/ScrollViewSpace";
import FormButton from "../../components/form/FormButton";
import axiosInstance from "../../utils/api-client";

const TruckBookingConfirmationScreen = ({ navigation, route }) => {
  const item = route?.params;
  console.log("ddd", item);

  const [loading, setLoading] = useState(false);

  // Error states
  const [formError, setFormError] = useState("");

  const bookAppointment = async () => {
    setLoading(true);
    const bookingData = {
      listingId: item?.listingId,
      appointmentTime: {
        date: item?.appointmentTime?.date,
        time: item?.appointmentTime?.time,
      },
      description: item?.description,
      price: item?.price,
      pickupLocation: {
        address: item?.pickupLocation?.address,
        city: item?.pickupLocation?.city,
        country: item?.pickupLocation?.country,
      },
      deliveryLocation: {
        address: item?.deliveryLocation?.address,
        city: item?.deliveryLocation?.city,
        country: item?.deliveryLocation?.country,
      },

      status: "request",
      reminders: [15, 60],
    };

    console.log("bookingData", bookingData);

    try {
      await axiosInstance({
        url: "api/books/booking",
        method: "POST",
        data: bookingData,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("bookAppointment res", res);
          setLoading(false);

          RNToast(Toast, "Great, your appointment has been booked");
          Alert.alert(
            "Booking Received",
            "Thank you for booking with us! Our team will review your request and reach out to you shortly to confirm availability and details. A confirmation email has been sent to your inbox. Please keep an eye on your notifications."
          );
          navigation.navigate("TruckListing");
        })
        .catch((err) => {
          console.log("bookAppointment err", err?.response);
          setLoading(false);
        });
    } catch (error) {
      console.log("bookAppointment error", error?.response);
      setLoading(false);
    }
  };

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        leftIcon={"arrow-back-outline"}
        onLeftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon={""}
        headerTitle={"Booking Request"}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <VtbTruckCard2 props={item?.truckInfo} price={item?.price} />
        <DetailsOption
          label={"Pickup Date & Time"}
          value={`${formatDateTime(item?.appointmentTime?.date)} at ${
            item?.appointmentTime?.time
          }`}
        />

        <DetailsOption2
          label={"From"}
          value={`${item?.pickupLocation?.address}. ${item?.pickupLocation?.city} state`}
        />

        <DetailsOption2
          label={"To"}
          value={`${item?.deliveryLocation?.address}. ${item?.deliveryLocation?.city} state`}
        />

        <DetailsOption2 label={"Description"} value={item?.description} />

        <ScrollViewSpace />
      </ScrollView>

      {/* Buttons */}
      <FixedBottomContainer top={1.19}>
        <FormButton
          title={"Confirm Booking"}
          width={1.1}
          onPress={bookAppointment}
          disabled={loading}
          formError={formError}
          loading={loading}
        />
      </FixedBottomContainer>
    </SafeAreaViewComponent>
  );
};

export default TruckBookingConfirmationScreen;

const styles = StyleSheet.create({
  answerLocation: {
    fontSize: 16,
    fontWeight: "500",
  },
  questionLocation: {
    fontSize: 14,
    color: "#333",
  },
});
