import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Video from "react-native-video";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Splash GIF */}
      <Image
        source={require("../assets/splash.gif")}
        style={{ width: width, height: height }}
      />

      {/* Background audio */}
      <Video
        source={require("../assets/opening-audio.mp3")} // your audio file
        audioOnly={true} // play audio only
        repeat={false} // set true if you want to loop
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore" // plays even if phone is on silent (iOS)
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
});
