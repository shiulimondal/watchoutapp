import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/AuthSlice";
import { writeData } from "../../util/Util";
import LogoSvg from "../../components/svgComponents/LogoSvg";
const { width, height } = Dimensions.get("window");

export default function GettingStarted() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNavigate = () => {
    dispatch(login());
    router.push("/(tabs)/home");
    writeData("has_user_started", true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <ImageBackground
        source={require("../../assets/get.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* <SvgXml xml={gettingstarted} style={styles.imageBackground}> */}
        <LinearGradient
          colors={[
            "rgba(13, 22, 35, 1)",
            "rgba(13, 22, 35, 0.7)",
            "rgba(13, 22, 35, 0)",
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradient}
        />
        {/* </SvgXml> */}
      </ImageBackground>

      <View style={styles.logoContainer}>
        {/* <Image source={require("../../assets/logo.png")} style={styles.logo} /> */}
        <LogoSvg width={150} height={150} />
        <View style={{ width: "90%", marginVertical: 15 }}>
          <Text numberOfLines={2} style={styles.text}>
            Watch unlimited movies, series & TV Shows anywhere, anytime
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: "90%",
          position: "absolute",
          bottom: 30,
          marginHorizontal: 20,
        }}
        onPress={handleNavigate}
      >
        <View style={styles.button}>
          <Text style={{ color: "white", fontSize: 17 }}>Get Started</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1623",
  },

  imageBackground: {
    width: width,
    height: "80%",
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  logoContainer: {
    alignItems: "center",
    bottom: "25%",
  },

  logo: {
    height: "32%",
    width: "40%",
  },

  text: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
  },

  button: {
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 10,
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
