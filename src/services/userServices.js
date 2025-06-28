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

export  const fetchTruckListings = async (
  axiosInstance,
  dispatch,
  saveTruckListings
) => {
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
