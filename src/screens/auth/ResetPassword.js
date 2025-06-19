import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import PassMeter from "react-native-passmeter";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

import FixedBottomContainer from "../../components/common/FixedBottomContainer";
import HeaderTitle from "../../components/common/HeaderTitle";
import SafeAreaViewComponent from "../../components/common/SafeAreaViewComponent";
import FormButton from "../../components/form/FormButton";
import FormInput from "../../components/form/FormInput";
import KeyboardAvoidingComponent from "../../components/form/KeyboardAvoidingComponent";
import { RNToast } from "../../Library/Common";
import { checkPassword, checkPasswordMatch } from "../../Library/Validation";
import { setUserDestination } from "../../redux/features/user/userSlice";
import { COLORS } from "../../themes/themes";
import axiosInstance from "../../utils/api-client";
import { windowWidth } from "../../utils/Dimensions";

const ResetPassword = ({ navigation }) => {
  const dispatch = useDispatch();

  // Passmeter validation
  const MAX_LEN = 15,
    MIN_LEN = 8,
    PASS_LABELS = [
      "  Too Short",
      "  Must include a lower, uppercase, number and special character like !@#$%%^&*",
      "  Must include a lower, uppercase, number and special character like !@#$%%^&*",
      "  Must include a lower, uppercase, number and special character like !@#$%%^&*",
      "  Perfecto !",
    ];
  const deviceWindow = Dimensions.get("window");

  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");
  const [formError, setFormError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatedPassword = checkPassword(newPassword);

  // This function handles the password visibility displaying the icons
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const checkPasswords = checkPasswordMatch(newPassword, confirmPassword);
  console.log("checkPasswords", checkPasswords);

  const resetPassword = async () => {
    const codeVerificationData = {
      password: confirmPassword,
    };
    try {
      setLoading(true);
      await axiosInstance({
        url: "api/auth/reset-password",
        method: "POST",
        data: codeVerificationData,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("resetPassword res", res);
          setLoading(false);

          if (res?.data) {
            console.log("resetPassword data", res?.data);
            RNToast(Toast, "Your password has been reset successfully");

            navigation.navigate("Login");
            dispatch(setUserDestination(null));
          }
        })
        .catch((err) => {
          console.log("resetPassword err", err);
          setLoading(false);
          if (err?.message.includes("Too many requests")) {
            setFormError("Too many attempts. Please try again later.");
          }
        });
    } catch (error) {
      console.log("resetPassword error", error);
    }
  };

  return (
    <SafeAreaViewComponent>
      <KeyboardAvoidingComponent>
        <HeaderTitle
          onLeftIconPress={() => navigation.goBack()}
          leftIcon="arrow-back-outline"
          progress={100}
        />
        <View style={{ marginBottom: 20, padding: 20 }}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 24,
              fontWeight: "600",
              lineHeight: 24,
            }}
          >
            Create Password
          </Text>
          <Text style={{ color: "#1E1E1EB2", fontSize: 16, fontWeight: "400" }}>
            Choose a strong password to keep your account secure.
          </Text>
        </View>

        <FormInput
          formInputTitle={"Password"}
          placeholder="Enter New password"
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={passwordVisibility}
          textContentType="password"
          rightIcon={rightIcon}
          iconColor="#1E1E1EB2"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setPasswordError("");
          }}
          // onChange={handleChange}
          handlePasswordVisibility={handlePasswordVisibility}
          marginBottom={10}
        />
        <Text
          style={{
            color: "#999",
            fontSize: 12,
            marginTop: newPassword?.length ? -6 : 5,
            padding: 10,
            marginBottom: 10,
          }}
        >
          Use at least 8 characters including 1 uppercase letter, a number and a
          special character like !@#$%%^&*
        </Text>
        <View
          style={{
            width: windowWidth / 1.1,
            overflow: "hidden",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          {newPassword !== "" ? (
            <PassMeter
              showLabels
              password={newPassword}
              maxLength={MAX_LEN}
              minLength={MIN_LEN}
              labels={PASS_LABELS}
              backgroundColor={styles.bg}
            />
          ) : null}
        </View>
        {passwordError && (
          <Text style={styles.validationError}>{passwordError}</Text>
        )}

        <FormInput
          formInputTitle={"Confirm password"}
          placeholder="Enter New password"
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={passwordVisibility}
          textContentType="password"
          rightIcon={rightIcon}
          iconColor="#1E1E1EB2"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setPasswordError("");
          }}
          // onChange={handleChange}
          handlePasswordVisibility={handlePasswordVisibility}
        />

        {/* Buttons */}
        <FixedBottomContainer top={1.3}>
          <FormButton
            title={"Next"}
            loading={loading}
            onPress={resetPassword}
            formError={formError}
            disabled={loading}
          />
        </FixedBottomContainer>
      </KeyboardAvoidingComponent>
    </SafeAreaViewComponent>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  validationError: {
    color: "red",
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 13,
    // textAlign: 'center',
  },
});
