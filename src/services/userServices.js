export const checkUserProfile = async (dispatch, getUser, axiosInstance) => {
  try {
    const profileResponse = await axiosInstance({
      url: "api/profile/profile",
      method: "GET",
    });

    if (profileResponse?.data) {
      dispatch(getUser(profileResponse?.data));
    }
  } catch (error) {
    console.error("checkUserProfile check error:", error);
    // navigation.navigate("OnboardingFlow1");
  }
};

export const checkUserPreferences = async (
  axiosInstance,
  userId,
  dispatch,
  saveUserPreferences
) => {
  try {
    const preferenceResponse = await axiosInstance({
      url: `matchmaking/preference/${userId}`,
      method: "GET",
    });

    if (preferenceResponse?.data) {
      console.log("checkUserPreferences res", preferenceResponse?.data);
      dispatch(saveUserPreferences(preferenceResponse?.data));
    }
  } catch (error) {
    console.error("User preference check error:", error);
  }
};
