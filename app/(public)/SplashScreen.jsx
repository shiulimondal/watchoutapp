import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import LogoSvg from "../../components/svgComponents/LogoSvg";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            {
              opacity: opacity,
              transform: [{ scale: scale }],
            },
          ]}
        >
          <LogoSvg width={200} height={200} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  imageBackground: {
    width: width,
    height: "100%",
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
