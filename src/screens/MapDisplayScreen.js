import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import HeaderTitle from "../components/common/HeaderTitle";
import SearchBar from "../components/search/SearchBar";
import {
  formatDistance,
  formatDuration,
  formatPerMinute,
  formatToNaira,
} from "../Library/Common";
import { windowHeight } from "../utils/Dimensions";
import SafeAreaViewComponent from "../components/common/SafeAreaViewComponent";

const MapDisplayScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  // Add proper default values to prevent errors with undefined coordinates
  const item = route?.params || {};
  const routeCoords = item?.routeCoords;
  const pickup = item?.pickoffCoords;
  const dropoff = item?.dropoffCoords;
  const routeInfo = item?.routeInfo;

  // Debug info - remove in production
  console.log("Route params:", item);
  console.log("Route coordinates count:", routeCoords?.length);
  console.log("Pickup:", pickup);
  console.log("Dropoff:", dropoff);

  // Validate coordinates
  useEffect(() => {
    const validateCoordinates = () => {
      setLoading(true);

      // Check if pickup and dropoff are valid
      if (!pickup?.latitude || !pickup?.longitude) {
        setError("Invalid pickup coordinates");
        setLoading(false);
        return false;
      }

      if (!dropoff?.latitude || !dropoff?.longitude) {
        setError("Invalid dropoff coordinates");
        setLoading(false);
        return false;
      }

      // Check route coordinates if they exist
      if (routeCoords && routeCoords.length > 0) {
        for (let i = 0; i < routeCoords.length; i++) {
          if (!routeCoords[i]?.latitude || !routeCoords[i]?.longitude) {
            setError(`Invalid route coordinate at index ${i}`);
            setLoading(false);
            return false;
          }
        }
      }

      setLoading(false);
      return true;
    };

    validateCoordinates();
  }, [pickup, dropoff, routeCoords]);

  // Fit map to coordinates after map is ready and coordinates are valid
  useEffect(() => {
    if (!loading && !error && mapRef.current) {
      // If we have route coordinates, fit to those
      if (routeCoords?.length > 0) {
        setTimeout(() => {
          mapRef.current.fitToCoordinates(routeCoords, {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
          });
        }, 500); // Short delay to ensure map is fully loaded
      }
      // If no route coords but we have pickup and dropoff, fit to those points
      else if (pickup && dropoff) {
        setTimeout(() => {
          mapRef.current.fitToCoordinates([pickup, dropoff], {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
          });
        }, 500);
      }
    }
  }, [loading, error, routeCoords, pickup, dropoff]);

  // Display loading indicator or error
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Calculate initial region if no route coordinates
  const initialRegion = {
    latitude: pickup?.latitude || 0,
    longitude: pickup?.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaViewComponent style={styles.container}>
      <HeaderTitle
        onLeftIconPress={() => navigation.goBack()}
        leftIcon="arrow-back-outline"
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
                {formatToNaira(formatPerMinute(routeInfo?.duration) * 1500)}
              </Text>
            </View>
          </View>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        zoomEnabled={true} // Allow zooming with gestures
        scrollEnabled={true}
        showsUserLocation
        initialRegion={initialRegion}
        onMapReady={() => console.log("Map is ready")}
        onError={(error) => console.log("Map error:", error)}
      >
        {pickup && (
          <Marker coordinate={pickup} title="Pickup" pinColor="green" />
        )}

        {dropoff && (
          <Marker coordinate={dropoff} title="Dropoff" pinColor="red" />
        )}

        {routeCoords?.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#00BFFF"
            strokeWidth={4}
          />
        )}
      </MapView>
    </SafeAreaViewComponent>
  );
};

export default MapDisplayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
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
