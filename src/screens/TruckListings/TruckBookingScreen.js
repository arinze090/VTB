import moment from "moment";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

import FixedBottomContainer from "../../components/common/FixedBottomContainer";
import HeaderTitle from "../../components/common/HeaderTitle";
import SafeAreaViewComponent from "../../components/common/SafeAreaViewComponent";
import ScrollViewSpace from "../../components/common/ScrollViewSpace";
import FormButton from "../../components/form/FormButton";
import FormInput from "../../components/form/FormInput";
import CountryPickerx from "../../components/pickerSelect/CountryPicker";
import PickerSelect from "../../components/pickerSelect/PickerSelect";
import { availableTimesForAppointmentDaily } from "../../data/dummyData";
import { isPriceWithinRange } from "../../Library/Common";
import { COLORS } from "../../themes/themes";

const TruckBookingScreen = ({ route, navigation }) => {
  const item = route?.params;
  console.log("ddd", item);

  const today = moment().format("YYYY-MM-DD");

  const transformedBookingTimesData = availableTimesForAppointmentDaily?.map(
    (item) => ({
      label: item,
      value: item,
    })
  );

  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);

  const [pickupTime, setPickupTime] = useState();
  const [price, setPrice] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [countryObject, setCountryObject] = useState("");
  const [description, setDescription] = useState("");

  // Error states
  const [formError, setFormError] = useState("");
  const [pickupTimeError, setPickupTimeError] = useState();
  const [priceError, setPriceError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [cityError, setCityError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deliveryCityError, setDeliveryCityError] = useState("");
  const [deliveryAddressError, setDeliveryAddressError] = useState("");

  const handleDateSelect = (day) => {
    const date = day.dateString;

    console.log("dayyy", day, date);

    if (!moment(date).isBefore(today)) {
      setSelectedDate(date);
    } else {
      // If somehow a past date is selected (by a logic bug or manual intervention)
      setSelectedDate("");
      setAvailableTimes([]);
    }
  };

  const futureAvailability = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          selectedColor: COLORS.vtbBtnColor,
          selectedTextColor: "#ffffff",
        },
      }
    : {};

  const bookAppointment = async () => {
    const bookingData = {
      truckInfo: item,
      listingId: item?.id,
      appointmentTime: {
        date: selectedDate,
        time: pickupTime,
      },
      description: description,
      price: parseInt(price),
      pickupLocation: {
        address: address,
        city: city,
        country: country,
      },
      deliveryLocation: {
        address: deliveryAddress,
        city: deliveryCity,
        country: country,
      },

      status: "request",
      reminders: [15, 60],
    };

    console.log("bookingData", bookingData);

    if (!selectedDate) {
      setFormError("Please select a date for your booking");
    } else if (!pickupTime) {
      setPickupTimeError("please select a time for your delivery");
    } else if (!price) {
      setPriceError("Please provide your bargain price");
    } else if (!country) {
      setCountryError("please select a country");
    } else if (!city) {
      setPriceError("Please provide your pickup city");
    } else if (!address) {
      setAddressError("please provide you pickup address");
    } else if (!description) {
      setDescriptionError("Please provide a brief description");
    } else {
      navigation.navigate("TruckBookingConfirmation", bookingData);
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
        headerTitle={"Truck Booking"}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* <View style={{padding: 20, flexDirection: 'row'}}>
          <Image
            style={styles.tourguideBookingImage}
            source={{
              uri: item?.pictures[0]
                ? item?.pictures[0]
                : require('../../assets/3.jpg'),
            }}
          />
          <View
            style={{
              marginLeft: 10,
              width: windowWidth / 1.45,
              // backgroundColor: "red",
              justifyContent: 'space-between',
            }}>
            <Text numberOfLines={1} style={styles.tourguideBookingTitle}>
              {item?.car_name}
            </Text>
            <View style={styles.tourguideProfile2}>
              <Ionicons
                name="location-outline"
                size={15}
                style={{marginRight: 6}}
              />
              <Text>{item?.city}</Text>
            </View>
            <Text>{formatPriceRange(item?.price?.[0])}</Text>
          </View>
        </View> */}

        <Calendar
          onDayPress={handleDateSelect}
          markedDates={futureAvailability}
          theme={{
            arrowColor: COLORS.vtbBtnColor,
            todayTextColor: COLORS.vtbBtnColor,
            selectedDayBackgroundColor: COLORS.vtbBtnColor,
            selectedDayTextColor: "#ffffff",
            dotColor: COLORS.vtbBtnColor,
            textMonthFontWeight: "bold",
            textMonthFontSize: 18,
          }}
          monthFormat={"MMMM yyyy"}
        />

        {selectedDate && (
          <View style={{ marginTop: 20 }}>
            <PickerSelect
              items={transformedBookingTimesData}
              placeholder={"Select your pickup time"}
              formInputTitle={"Select your preferred pickup time"}
              onValueChange={(value) => {
                setPickupTime(value);
                setFormError("");
                setPickupTimeError("");
              }}
              errorMessage={pickupTimeError}
            />

            <FormInput
              formInputTitle={"Price"}
              keyboardType={"number-pad"}
              placeholder="Enter your your price"
              value={price}
              onChangeText={(txt) => {
                setPrice(txt);
                setPriceError("");
                setFormError("");

                const isValid = isPriceWithinRange(txt, item?.price);
                if (!isValid) {
                  setPriceError("Entered price is outside allowed range.");
                }
              }}
              errorMessage={priceError}
            />

            <CountryPickerx
              formInputTitle={"Country"}
              countryError={countryError}
              setCountry={setCountry}
              setFormError={setFormError}
              setCountryObject={setCountryObject}
            />

            <FormInput
              formInputTitle={"Pickup State"}
              keyboardType={"default"}
              placeholder="Enter your pickup state"
              value={city}
              onChangeText={(txt) => {
                setCity(txt);
                setCityError("");
                setFormError("");
              }}
              errorMessage={cityError}
            />

            <FormInput
              formInputTitle={"Pickup Address"}
              keyboardType={"default"}
              placeholder="Enter your pickup address"
              value={address}
              onChangeText={(txt) => {
                setAddress(txt);
                setAddressError("");
                setFormError("");
              }}
              errorMessage={addressError}
            />

            <FormInput
              formInputTitle={"Delivery State"}
              keyboardType={"default"}
              placeholder="Enter your delivery state"
              value={deliveryCity}
              onChangeText={(txt) => {
                setDeliveryCity(txt);
                setDeliveryCityError("");
                setFormError("");
              }}
              errorMessage={deliveryCityError}
            />

            <FormInput
              formInputTitle={"Delivery Address"}
              keyboardType={"default"}
              placeholder="Enter your delivery address"
              value={deliveryAddress}
              onChangeText={(txt) => {
                setDeliveryAddress(txt);
                setDeliveryAddressError("");
                setFormError("");
              }}
              errorMessage={deliveryAddressError}
            />

            <FormInput
              formInputTitle={"Brief Description"}
              keyboardType={"default"}
              placeholder="Enter your brief description"
              value={description}
              onChangeText={(txt) => {
                setDescription(txt);
                setDescriptionError("");
                setFormError("");
              }}
              errorMessage={descriptionError}
              numberOfLines={5}
              multiLine={true}
              height={100}
            />
          </View>
        )}

        <ScrollViewSpace />
      </ScrollView>

      {/* Buttons */}
      <FixedBottomContainer top={1.19}>
        <FormButton
          title={"Continue"}
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

export default TruckBookingScreen;

const styles = StyleSheet.create({
  tourguideBookingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  tourguideBookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    // marginBottom: 10,
  },
  tourguideProfile2: {
    flexDirection: "row",
    // marginTop: 10,
  },
});
