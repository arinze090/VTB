import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

import HeaderTitle from "../../components/common/HeaderTitle";
import FormButton from "../../components/form/FormButton";
import FormInput from "../../components/form/FormInput";
import { emailValidator } from "../../Library/Validation";

import FixedBottomContainer from "../../components/common/FixedBottomContainer";
import SafeAreaViewComponent from "../../components/common/SafeAreaViewComponent";
import KeyboardAvoidingComponent from "../../components/form/KeyboardAvoidingComponent";
import { RNToast } from "../../Library/Common";
import { setUserDestination } from "../../redux/features/user/userSlice";
import { COLORS } from "../../themes/themes";
import axiosInstance from "../../utils/api-client";
import { windowHeight, windowWidth } from "../../utils/Dimensions";

const ForgetPassword = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

  const sendOTPToEmail = async () => {
    const codeVerificationData = {
      email: email,
    };
    try {
      setLoading(true);
      await axiosInstance({
        url: "api/auth/forgot-password",
        method: "POST",
        data: codeVerificationData,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("res", res);
          setLoading(false);

          if (res?.data) {
            console.log("sendOTPToEmail data", res?.data);
            dispatch(setUserDestination("ResetPassword"));
            RNToast(Toast, "A Verification has been sent to your email");

            navigation.navigate("EmailVerification", { email: email });
          }
        })
        .catch((err) => {
          console.log("sendOTPToEmail err", err);
          setLoading(false);
          if (err?.message.includes("Too many requests")) {
            setFormError("Too many attempts. Please try again later.");
          }
        });
    } catch (error) {
      console.log("sendOTPToEmail error", error);
    }
  };

  return (
    <SafeAreaViewComponent>
      <KeyboardAvoidingComponent>
        <HeaderTitle
          leftIcon={"arrow-back-outline"}
          onLeftIconPress={() => {
            navigation.goBack();
          }}
        />
        <View style={{ marginBottom: 20, padding: 20 }}>
          <Text style={{ color: "black", fontSize: 24, fontWeight: "700" }}>
            Forgot Password
          </Text>
          <Text
            style={{
              color: "#1E1E1EB2",
              fontSize: 13,
              fontWeight: "500",
              marginTop: 10,
            }}
          >
            Enter the email address associated with your account and we'll send
            you an OTP then you can reset your password
          </Text>
        </View>

        <FormInput
          formInputTitle={"Email"}
          value={email}
          placeholder="Email"
          width={1.1}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(txt) => {
            setEmail(txt);
            setFormError("");
            setEmailError("");

            if (!emailValidator(txt)) {
              setEmailError("Please enter a valid email");
            } else {
              setEmailError("");
            }
          }}
          placeholderTextColor="#ccc"
          errorMessage={emailError}
        />

        {/* Buttons */}
        <FixedBottomContainer top={1.3}>
          <FormButton
            title={"Next"}
            formError={formError}
            onPress={sendOTPToEmail}
            disabled={loading}
            loading={loading}
          />
        </FixedBottomContainer>
      </KeyboardAvoidingComponent>
    </SafeAreaViewComponent>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  imageBg: {
    padding: 20,
    height: windowHeight / 4,
    backgroundColor: "red",
  },
  logo: {
    width: windowWidth / 1.2,
    height: windowHeight / 8,
  },
  logoContainer: {
    // backgroundColor: COLORS.formButton,
    width: windowWidth / 1.2,
    height: windowHeight / 10,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
  },
  auth: {
    // width: windowWidth / 1.1,
    // alignSelf: "center",
    marginTop: 30,
    marginLeft: 20,
  },
  error: {
    color: "red",
    fontWeight: "500",
    alignSelf: "center",
    marginBottom: 7,
    fontSize: 13,
  },
  alreadySection: {
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
  },
  alreadyText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  signup: {
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    // backgroundColor: "red",
    // marginTop: 10,
  },
  validationError: {
    color: COLORS.formButton,
    fontWeight: "500",
    marginBottom: 15,
    fontSize: 13,
    // textAlign: 'center',
  },
});
