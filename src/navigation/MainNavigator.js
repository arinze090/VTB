import React from "react";

import { useDispatch, useSelector } from "react-redux";
import AppNavigation from "./AppNavigator";
import AuthStack from "./AuthNavigator";

const MainNavigator = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const loggedInUser = state?.user?.user;
  console.log("logged", loggedInUser);

  return <>{loggedInUser ? <AppNavigation /> : <AuthStack />}</>;
};

export default MainNavigator;
