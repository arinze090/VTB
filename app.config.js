import "dotenv/config";

export default {
  expo: {
    name: "VTB",
    slug: "vtb",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/adaptiveIcon.png",
    scheme: "vtb",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/adaptiveIcon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptiveIcon.png",
        backgroundColor: "#ffffff",
      },
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.EXPO_GOOGLE_MAPS_PLACES_API_KEY,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "VTB needs access to your location to show you nearby rides.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptiveIcon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.vtb",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_GOOGLE_MAPS_PLACES_API_KEY,
        },
      },
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      HERE_API_KEY: process.env.EXPO_HERE_API_KEY,
      EXPO_GOOGLE_MAPS_PLACES_API_KEY:
        process.env.EXPO_GOOGLE_MAPS_PLACES_API_KEY,
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Rendezvouscare accesses your photos to let you share them with your friends.",
        },
      ],
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
