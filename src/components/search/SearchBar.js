import React from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../themes/themes";
import { windowWidth } from "../../utils/Dimensions";

const SearchBar = ({
  clicked,
  setClicked,
  searchPlaceholder,
  searchPhrase,
  setSearchPhrase,
  onPressIn,
  searchIcon,
  searchIconColor,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={
          !clicked ? styles.searchBar__unclicked : styles.searchBar__clicked
        }
        onPress={Keyboard.dismiss}
      >
        {/* search Icon */}
        <Ionicons
          name={searchIcon}
          size={27}
          color={searchIconColor ? searchIconColor : "#000"}
        />

        {/* Input field */}
        <TouchableWithoutFeedback
          onPressIn={onPressIn}
          // onFocus={Keyboard.dismiss}
        >
          <TextInput
            style={styles.input}
            placeholder={searchPlaceholder}
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            placeholderTextColor="#757575"
            autoFocus={clicked}
            // onFocus={() => setClicked(true)}
            onFocus={onPressIn}
            autoCorrect={false}
          />
        </TouchableWithoutFeedback>
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Ionicons
            name="close-outline"
            size={20}
            color={COLORS.rendezvousRed}
            style={{ padding: 1 }}
            onPress={() => {
              setSearchPhrase("");
            }}
          />
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {/* {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
              setSearchPhrase("");
            }}
            color="#666"
          />
        </View>
      )} */}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: windowWidth - 10,
    marginBottom: 10,
    // marginTop: 10,
    // marginBottom: 10,
  },
  searchBar__unclicked: {
    padding: 7,
    flexDirection: "row",
    width: "97%",
    backgroundColor: "#2465E10D",
    borderRadius: 8,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 7,
    flexDirection: "row",
    width: "93%",
    backgroundColor: "#2465E10D",
    borderRadius: 8,
    alignItems: "center",
    // justifyContent: "space-evenly",
  },
  input: {
    fontSize: 16,
    marginLeft: 10,
    width: "90%",
    color: "black",
  },
});
