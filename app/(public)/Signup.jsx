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
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/AuthSlice";
import { writeData } from "../../util/Util";
import { useEffect, useState } from "react";
const { width, height } = Dimensions.get("window");
import Checkbox from "expo-checkbox";
import { detailsCheck } from "../../redux/features/auth/DetailsCheckSlice";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import Toast from 'react-native-simple-toast';

export default function Signup() {
  const params = useLocalSearchParams();
  const item = useLocalSearchParams();
  const router = useRouter();
  const [formErrors, setFormErrors] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [isChecked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendOtpType, setSendOtpType] = useState("");

  const { data, loading } = useSelector((state) => state.check);

  const dispatch = useDispatch();

  useEffect(() => {
    if (params?.email) {
      setEmail(params.email);
    }
  }, [params?.email]);

  useEffect(() => {
    if (params?.phone) {
      setPhone(params?.phone);
    }
  }, [params?.phone]);

  useEffect(() => {
    if (data && data?.status && submitted && sendOtpType) {
      console.log(data, sendOtpType, 'Data in signup for phone');

      // ToastAndroid.show(params?.RegisterType === "phone" || sendOtpType === "success" ? "OTP send to phone number" : "OTP send to email", ToastAndroid.BOTTOM);
      Toast.show(params?.RegisterType === "phone" || sendOtpType === "success" ? "OTP send to phone number" : "OTP send to email", Toast.LONG);
      router.push({
        pathname: "/OtpScreen",
        params: {
          name: name,
          email: !params?.phone && !email ? params.email : email,
          phone: params?.phone ? params?.phone : phone,
          sendOtpType: sendOtpType,
          type: "signup",
          RegisterType: params?.RegisterType
        },
      });
      setSubmitted(false);
    }
    else if (data && data?.status && submitted) {
      console.log(data, sendOtpType, 'Data in signup for email');

      Toast.show(params?.RegisterType === "email" ? "OTP send to email" : null, Toast.LONG);
      router.push({
        pathname: "/OtpScreen",
        params: {
          name: name,
          email: !params?.phone && !email ? params.email : email,
          phone: params?.phone ? params?.phone : phone,
          sendOtpType: sendOtpType,
          type: "signup",
          RegisterType: params?.RegisterType
        },
      });
      setSubmitted(false);
    }

    else if (data && !data?.status && submitted) {

      // ToastAndroid.show(data?.message, ToastAndroid.BOTTOM);
      Toast.show(data?.message, Toast.LONG);
      setSubmitted(false);
    }
  }, [data, sendOtpType]);


  const validEmail = (email) => {
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return reg.test(String(email).toLowerCase());
  };

  const validateData = () => {
    setFormErrors({});
    const errors = {};

    if (name == "") {
      errors.name = "Name is required";
    }
    else if (email == "") {
      errors.email = "Email is required";
    }
    else if (!validEmail(email)) {
      errors.email = "Email address is not valid";
    }
    else if (phone == null) {
      errors.phone = "Phone number is required";
    } else if (phone.length < 10) {
      errors.phone = "Phone number can not be less than 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const onChangeName = (text) => {
    setName(text);
  };

  const onChangePhone = (value) => {
    setPhone(value);
  };






  const handleSendOtp = () => {
    const mobileNumber =
      params?.phone
        ? `91${params?.phone}`
        : params?.RegisterType === "phone"
          ? `91${phone}`
          : null;

    if (!mobileNumber) {
      // ToastAndroid.show("Invalid phone number", ToastAndroid.SHORT);
      Toast.show("Invalid phone number", Toast.LONG);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("otp_expiry", "5");
    formData.append("template_id", "677bb2ecd6fc0571560535d4");
    formData.append("mobile", mobileNumber);
    formData.append("authkey", "436860AVh2E0gVf677bb65aP1");
    formData.append("realTimeResponse", "1");

    axios
      .post("https://control.msg91.com/api/v5/otp", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.data.type === "success") {
          setSendOtpType(response.data.type);
          // ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
          Toast.show("OTP sent successfully", Toast.LONG);
        } else {
          // ToastAndroid.show(
          //   response.data.message || "Failed to send OTP",
          //   ToastAndroid.SHORT
          // );
          Toast.show(
            response.data.message || "Failed to send OTP",
            Toast.LONG
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error.response?.data || error.message);
        // ToastAndroid.show(
        //   error.response?.data?.message || "Something went wrong",
        //   ToastAndroid.SHORT
        // );
        Toast.show(
          error.response?.data?.message || "Something went wrong",
          Toast.LONG
        );
      });
  };



  const handleSignUp = () => {
    // const isPhoneNumber = /^\d+$/.test(params?.email);
    if (!validateData()) {
      return;
    }

    let data = {
      name: name,
      email: !params?.phone && !email ? params.email : email,
      phone: params?.phone ? params?.phone : phone,
      registration_type: params?.RegisterType
    };
    // console.log(data, 'Sign Up Data');

    setSubmitted(true);

    dispatch(detailsCheck(data));
    if (params?.phone || params?.RegisterType === "phone") {
      handleSendOtp();
    }
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
        <TouchableOpacity style={{ zIndex: 2 }} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            size={25}
            color={"white"}
            style={{ marginTop: 40, marginLeft: 20 }}
          />
        </TouchableOpacity>
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

      <View style={{ marginHorizontal: 20 }}>
        <View style={{ alignItems: "center", bottom: "95%" }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
            Let's Sign up
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: formErrors?.name ? "red" : Colors.dark.inputBorder,
              },
            ]}
            placeholder="Enter Your Name"
            placeholderTextColor={"gray"}
            onChangeText={onChangeName}
            onFocus={() => setFormErrors({})}
            value={name}
          />

          {formErrors.name && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: "red", fontSize: 12 }}>
                {formErrors.name}
              </Text>
            </View>
          )}

          <TextInput
            editable={params?.phone ? true : !params?.email ? true : false}
            style={[
              styles.input,
              { borderColor: params?.phone ? Colors.dark.secondary : !params?.email ? Colors.dark.secondary : "gray" },
            ]}
            placeholder="Enter Your Email"
            onChangeText={(value) => setEmail(value)}
            placeholderTextColor={"gray"}
            onFocus={() => setFormErrors({})}
            value={email}
          />

          {formErrors.email && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: "red" }}>{formErrors.email}</Text>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>

            <TextInput
              editable={false}
              style={[
                styles.input,
                {
                  borderColor: params?.phone ? Colors.dark.inActiveTab : Colors.dark.inputBorder,
                  width: "17%"
                },
              ]}
              placeholder="Enter your Phone number"
              placeholderTextColor={"gray"}
              value={"+91"}
            />
            <TextInput
              editable={params?.phone ? false : true}
              keyboardType="number-pad"
              style={[
                styles.input,
                {
                  borderColor: params?.phone ? "gray" : Colors.dark.secondary,
                  width: "80%"
                },
              ]}
              placeholder="Enter Your Phone Number"
              placeholderTextColor={"gray"}
              onChangeText={onChangePhone}
              onFocus={() => setFormErrors({})}
              value={phone}
            />
          </View>


          {formErrors.phone && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ color: "red", fontSize: 12 }}>
                {formErrors.phone}
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            bottom: 310,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={Colors.dark.secondary}
          />
          <TouchableOpacity onPress={() => router.push("/TermsConditions")}>
            <Text style={{ color: "white", fontSize: 12 }}>
              Accept the{" "}
              <Text style={{ color: Colors.dark.secondary, fontWeight: "800" }}>
                Terms and Conditions
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={!isChecked || loading}
          style={{ width: "100%", bottom: 280 }}
          onPress={handleSignUp}
        >
          <View
            style={[
              styles.button,
              {
                backgroundColor: !isChecked
                  ? "gray"
                  : loading
                    ? "gray"
                    : Colors.dark.secondary,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={"white"} size={"small"} />
            ) : (
              <Text style={{ color: "white", fontSize: 15 }}>Get Started</Text>
            )}
          </View>
        </TouchableOpacity>

        <View
          style={{
            bottom: 260,
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/Login",
              })
            }
          >
            <Text
              style={{
                color: Colors.dark.secondary,
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    // bottom: 260,
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    width: "100%",
    marginTop: 25,
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "white",
  },

  checkbox: {
    borderRadius: 5,
    borderColor: Colors.dark.secondary,
    borderWidth: 1,
  },
});
