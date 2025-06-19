import polyline from "@mapbox/polyline";
import axios from "axios";
import Constants from "expo-constants";
import debounce from "lodash.debounce";
import React, { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import HeaderTitle from "../components/common/HeaderTitle";
import SafeAreaViewComponent from "../components/common/SafeAreaViewComponent";
import SearchBar from "../components/search/SearchBar";
import {
  formatDistance,
  formatDuration,
  formatPerMinute,
  formatToNaira,
} from "../Library/Common";
import { COLORS } from "../themes/themes";
import { windowHeight, windowWidth } from "../utils/Dimensions";

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (windowWidth / windowHeight);

const MapsSearchScreen = ({ navigation, route }) => {
  const item = route?.params;
  console.log("userLiveAddress", item);

  const GOOGLE_MAPS_PLACES_API_KEY =
    Constants.expoConfig?.extra?.EXPO_GOOGLE_MAPS_PLACES_API_KEY;
  const HERE_API_KEY = Constants.expoConfig?.extra?.HERE_API_KEY;

  const mapRef = useRef();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedQueryData, setSelectedQueryData] = useState();
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeCoordsx, setRouteCoordsx] = useState();
  const [routeInfo, setRouteInfo] = useState(null);

  console.log("selectedQueryData", selectedQueryData, routeCoords);

  const pickupCoords = {
    longitude: item?.coordinates?.longitude,
    latitude: item?.coordinates?.latitude,
  };

  const dropoffCoords = {
    longitude: selectedQueryData?.position?.lng,
    latitude: selectedQueryData?.position?.lat,
  };

  //   const routeCoords = [pickupCoords, dropoffCoords];

  const fetchSuggestions = async (text) => {
    if (!text) {
      return setSuggestions([]);
    }

    try {
      const res = await axios.get(
        "https://autosuggest.search.hereapi.com/v1/autosuggest",
        {
          params: {
            q: text,
            apiKey: HERE_API_KEY,
            // at: '6.5244,3.3792',
            at: `${item?.coordinates?.latitude},${item?.coordinates?.longitude}`,
          },
        }
      );

      console.log("fetchSuggestions", res?.data?.items);

      setSuggestions(res?.data?.items || []);
    } catch (error) {
      console.error("Error fetching suggestions", error?.response);
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  const handleInputChange = (text) => {
    setQuery(text);
    debouncedFetch(text);
  };

  const handleSelect = (itemx) => {
    console.log("Selected location:", itemx);
    setSelectedQueryData(itemx);
    setQuery(itemx?.title);
    setSuggestions([]);

    // getRouteFromHere(pickupCoords, itemx?.position);
    getRouteFromGoogle(pickupCoords, itemx?.position);
  };

  const decodePolyline = (encoded) => {
    const decoded = polyline.decode(encoded);
    console.log("decoded", decoded);

    return decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
  };

  const getRouteFromGoogle = async (origin, destination) => {
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destStr = `${destination.lat},${destination.lng}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&mode=driving&key=${GOOGLE_MAPS_PLACES_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("data", data);
      console.log("dddd", data?.routes);

      if (data.status !== "OK") return console.error(data);

      const points = data.routes[0].overview_polyline.points;
      const decoded = polyline.decode(points).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      const legEndLocation = data.routes[0].legs[0].end_location;
      const newDropOffCoords = {
        latitude: legEndLocation.lat,
        longitude: legEndLocation.lng,
      };

      const duration = data.routes[0].legs[0].duration.value;
      const distance = data.routes[0].legs[0].distance.value;

      setRouteCoords(decoded);
      setRouteInfo({ duration, distance });

      console.log("routesssss", duration, distance, decoded);
      mapRef.current.fitToCoordinates(decoded, {
        edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
        animated: true,
      });

      navigation.navigate("MapsDisplayScreen", {
        routeCoords: decoded,
        pickoffCoords: pickupCoords,
        dropoffCoords: newDropOffCoords,
        routeInfo: {
          distance: distance,
          duration: duration,
        },
      });
    } catch (err) {
      console.error("Google Routing Error", err);
    }
  };

  return (
    <SafeAreaViewComponent>
      <HeaderTitle
        headerTitle={"Your route"}
        onLeftIconPress={() => navigation.goBack()}
        leftIcon={"close-outline"}
      />
      <SearchBar
        searchIcon={"radio-button-on-outline"}
        searchIconColor={COLORS.vtbBtnColor}
        searchPhrase={item?.userLiveAddress}
      />
      <SearchBar
        searchIcon={"search-outline"}
        onPressIn={fetchSuggestions}
        searchPhrase={query}
        setSearchPhrase={handleInputChange}
      />

      {/* ✅ Route Information Card */}
      {routeInfo && (
        <View style={styles.routeInfoCard}>
          <View style={styles.routeInfoRow}>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Distance</Text>
              <Text style={styles.routeInfoValue}>
                {formatDistance(routeInfo?.distance)}
              </Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Duration</Text>
              <Text style={styles.routeInfoValue}>
                {formatDuration(routeInfo?.duration)}
              </Text>
            </View>
            <View style={styles.routeInfoItem}>
              <Text style={styles.routeInfoLabel}>Est. Cost</Text>
              <Text style={styles.routeInfoValue}>
                {/* ₦{Math.round(routeInfo.distance * 150)} */}
                {formatToNaira(formatPerMinute(routeInfo?.duration) * 1500)}
              </Text>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
              padding: 10,
            }}
          >
            <Text style={{ color: "black" }}>{item?.title}</Text>
            {item?.address && (
              <Text style={{ color: "#888" }}>{item?.address.label}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* this is for displaying like how bolt display the data*/}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: pickupCoords.latitude,
          longitude: pickupCoords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {/* Markers */}
        <Marker coordinate={pickupCoords} title="Pickup" pinColor="pink" />
        {dropoffCoords && (
          <Marker coordinate={dropoffCoords} title="Dropoff" pinColor="red" />
        )}

        {/* Polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#4B4DED"
          />
        )}
      </MapView>
    </SafeAreaViewComponent>
  );
};

export default MapsSearchScreen;

const styles = StyleSheet.create({
  mapContainer: {
    // flex: 1,
    height: windowHeight,
  },
  routeInfoCard: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  routeInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  routeInfoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  routeInfoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  suggestionTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  suggestionAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  pickupMarker: {
    alignItems: "center",
  },
  dropoffMarker: {
    alignItems: "center",
  },
  markerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#007AFF",
    marginTop: -3,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
