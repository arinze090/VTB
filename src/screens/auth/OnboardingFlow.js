import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

import Toast from "react-native-toast-message";
import FixedBottomContainer from "../../components/common/FixedBottomContainer";
import HeaderTitle from "../../components/common/HeaderTitle";
import SafeAreaViewComponent from "../../components/common/SafeAreaViewComponent";
import ScrollViewSpace from "../../components/common/ScrollViewSpace";
import FormButton from "../../components/form/FormButton";
import FormInput from "../../components/form/FormInput";
import KeyboardAvoidingComponent from "../../components/form/KeyboardAvoidingComponent";
import CountryPickerx from "../../components/pickerSelect/CountryPicker";
import { RNToast } from "../../Library/Common";
import { getUser } from "../../redux/features/user/userSlice";
import { COLORS } from "../../themes/themes";
import axiosInstance from "../../utils/api-client";

const OnboardingFlow = ({ navigation }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [countryObject, setCountryObject] = useState("");

  console.log("countdd", country, countryObject);

  // Error states
  const [formError, setFormError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [cityError, setCityError] = useState("");
  const [addressError, setAddressError] = useState("");

  const onboardUser = async () => {
    const onboardData = {
      fullname: fullName,
      country: country,
      city: city,
      address: address,
    };

    if (!fullName) {
      setFullNameError("Please provide your full name");
    } else if (!country) {
      setCountryError("Provide your valid country");
    } else if (!city) {
      setCityError("Provide your city");
    } else if (!address) {
      setAddressError("Provide your valid address");
    } else {
      setLoading(true);
      try {
        await axiosInstance({
          url: "api/profile/profile",
          method: "POST",
          data: onboardData,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            console.log("res", res);
            setLoading(false);

            if (res?.data) {
              console.log("onboardUser data", res?.data);

              checkUserProfile();
            } else {
              console.log("message", res?.data?.message);
              setFormError(
                "An error occured while onboarding your profile, please try again later"
              );
            }
          })
          .catch((err) => {
            console.log("onboardUser err", err?.response);
            setLoading(false);
            setFormError(err?.response?.data?.message);
          });
      } catch (error) {
        console.log("onboardUser error", error);
      }
    }
  };

  const checkUserProfile = async () => {
    try {
      const profileResponse = await axiosInstance({
        url: "api/profile/profile",
        method: "GET",
      });

      if (profileResponse?.data) {
        dispatch(getUser(profileResponse?.data?.data));
        navigation.navigate("Login");
        RNToast(Toast, "Awesome. Your profile has been setup 😇");
      }
    } catch (error) {
      console.error("checkUserProfile check error:", error);
    }
  };

  return (
    <SafeAreaViewComponent>
      <KeyboardAvoidingComponent>
        <HeaderTitle
          leftIcon={"arrow-back-outline"}
          // progress={50}
          onLeftIconPress={() => {
            navigation.goBack();
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 0 }}
        >
          <View style={{ marginBottom: 20, padding: 20 }}>
            <Text
              style={{
                color: COLORS.black,
                fontSize: 24,
                fontWeight: "600",
                lineHeight: 24,
              }}
            >
              Onboarding
            </Text>
            <Text
              style={{ color: "#1E1E1EB2", fontSize: 16, fontWeight: "400" }}
            >
              Please fill in your information to create an account{" "}
            </Text>
          </View>

          <FormInput
            formInputTitle={"Full Name"}
            keyboardType={"default"}
            placeholder="Enter your Fullname"
            value={fullName}
            onChangeText={(txt) => {
              setFullName(txt);
              setFullNameError("");
              setFormError("");
            }}
            errorMessage={fullNameError}
          />

          <CountryPickerx
            formInputTitle={"Country"}
            countryError={countryError}
            setCountry={setCountry}
            setFormError={setFormError}
            setCountryObject={setCountryObject}
          />

          <FormInput
            formInputTitle={"City"}
            placeholder="Enter your city"
            keyboardType={"default"}
            value={city}
            onChangeText={(txt) => {
              setCity(txt);
              setFormError("");
              setCityError("");
            }}
            errorMessage={cityError}
          />

          <FormInput
            formInputTitle={"Address"}
            numberOfLines={5}
            multiLine={true}
            keyboardType={"default"}
            height={100}
            placeholder="Enter your address"
            value={address}
            onChangeText={(txt) => {
              setAddress(txt);
              setAddressError("");
              setFormError("");
            }}
            errorMessage={addressError}
          />

          <ScrollViewSpace />
        </ScrollView>

        {/* Buttons */}
        <FixedBottomContainer top={1.3}>
          <FormButton
            title={"Complete"}
            width={1.1}
            onPress={onboardUser}
            loading={loading}
            disabled={loading}
            formError={formError}
          />
        </FixedBottomContainer>
      </KeyboardAvoidingComponent>
    </SafeAreaViewComponent>
  );
};

export default OnboardingFlow;

const styles = StyleSheet.create({});
