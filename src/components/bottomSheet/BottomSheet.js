import React from "react";
import { StyleSheet, Text } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector } from "react-redux";
import { windowHeight } from "../../utils/Dimensions";

const BottomSheet = ({
  bottomSheetRef,
  height,
  children,
  bottomsheetTitle,
}) => {
  const state = useSelector((state) => state);

  return (
    <RBSheet
      ref={bottomSheetRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={windowHeight / (height || 1.2)}
      render
      customStyles={{
        wrapper: {
          backgroundColor: "grey",
        },
        draggableIcon: {
          backgroundColor: "black",
        },
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: "white",
        },
      }}
    >
      <Text style={[styles.bottomSheetTitle]}>{bottomsheetTitle}</Text>
      {children}
    </RBSheet>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetTitle: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    fontSize: 17,
    fontWeight: "700",
    alignSelf: "center",
    marginTop: 10,
    color: "black",
  },
});
