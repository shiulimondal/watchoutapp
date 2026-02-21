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
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/features/AuthSlice";
import { writeData } from "../../util/Util";
import { useEffect, useState } from "react";
import { emailCheck } from "../../redux/features/auth/EmailCheckSlice";
import { Ionicons } from "@expo/vector-icons";
import { PhoneNumberCheck } from "../../redux/features/auth/PhNumberCheckSlice";
const { width, height } = Dimensions.get("window");
import axios from 'axios';
import { SignUp } from "../../services/ApiServices";
import Toast from 'react-native-simple-toast';

export default function Login() {
    const router = useRouter();
    const [formErrors, setFormErrors] = useState({});
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [fieldChanged, setFieldChanged] = useState("");
    const [sendOtpType, setSendOtpType] = useState("");

    const dispatch = useDispatch();

    const { data, loading } = useSelector((state) => state.email);
    const { data: phoneData, loading: phoneLoading } = useSelector((state) => state.phone);

    useEffect(() => {
        if (data && data?.status && submitted) {
            Toast.show("OTP sent to email", Toast.LONG);
            // ToastAndroid.show(`OTP sent to email`, ToastAndroid.BOTTOM);
            router.push({
                pathname: "/OtpScreen",
                params: {
                    email: email,
                    type: "login",
                },
            });
        }
        else if (email && submitted) {
            Toast.show("Email is not registered, please create an account to continue", Toast.LONG);
            // ToastAndroid.show(
            //     "Email is not registered, please create an account to continue",
            //     ToastAndroid.BOTTOM
            // );
            setEmail("");
            router.push({
                pathname: "/Signup",
                params: {
                    email: email,
                    RegisterType: "email",
                },
            });
        }
    }, [data]);


    // const handleSendOtp = () => {
    //     const data = {
    //         otp_expiry: '5',
    //         template_id: '677bb2ecd6fc0571560535d4',
    //         mobile: `91${phone}`,
    //         authkey: '436860AVh2E0gVf677bb65aP1',
    //         realTimeResponse: 1
    //     };

    //     axios
    //         .post('https://control.msg91.com/api/v5/otp', data, {
    //             headers: {
    //                 "Content-Type": "application/JSON"
    //             }
    //         })
    //         .then((response) => {
    //             console.log('Response:', response.data);
    //             if (response.data.type === "success") {
    //                 setSendOtpType(response.data.type)
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             ToastAndroid.show(error, ToastAndroid.BOTTOM);
    //         });
    // };

const handleSendOtp = async () => {
  try {
    const params = new URLSearchParams();
    params.append("otp_expiry", "5");
    params.append("template_id", "677bb2ecd6fc0571560535d4");
    params.append("mobile", `91${phone}`);
    params.append("authkey", "436860AVh2E0gVf677bb65aP1");
    params.append("realTimeResponse", "1");

    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    if (response.data.type === "success") {
      setSendOtpType(response.data.type);
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    Toast.show(error.message, Toast.LONG);
    //   ToastAndroid.show(error, ToastAndroid.BOTTOM);
  }
};



    useEffect(() => {
        if (phoneData && phoneData?.status == false && submitted) {
            Toast.show("OTP sent to phone", Toast.LONG);
            // ToastAndroid.show(`OTP sent to phone`, ToastAndroid.BOTTOM);
            handleSendOtp();
            router.push({
                pathname: "/OtpScreen",
                params: {
                    phone: phone,
                    type: "login",
                    sendOtpType: sendOtpType
                },
            });
        }
        else if (phone && submitted) {
            Toast.show("Phone number is not registered, please create an account to continue", Toast.LONG);
            // ToastAndroid.show(
            //     "Phone number is not registered, please create an account to continue",
            //     ToastAndroid.BOTTOM
            // );
            setPhone("");
            router.push({
                pathname: "/Signup",
                params: {
                    phone: phone,
                },
            });
        }
    }, [phoneData]);



    const validEmail = (email) => {
        const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return reg.test(String(email).toLowerCase());
    };

    const validPhone = (phone) => {
        const reg = /^[0-9]{10,}$/;
        return reg.test(phone);
    };

    const validateData = () => {
        setFormErrors({});
        const errors = {};
        if (fieldChanged === "email") {
            if (!validEmail(email)) {
                errors.email = "Enter a valid email address";
            }

        }
        else {
            if (!validPhone(phone)) {
                errors.phone = "Enter a valid phone number";
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return false;
        }

        return true;
    };

    const onChangeEmail = (text) => {
        setEmail(text);
        setFieldChanged("email");
    };

    const onChangePhone = (text) => {
        setPhone(text);
        setFieldChanged("phone");
    };

    const handleGetOtp = () => {
        if (!validateData()) {
            return;
        }

        let data = {
            email: email,
        };
        let data2 = {
            phone: phone,
        };
        if (fieldChanged === "email") {
            dispatch(emailCheck(data));
            setSubmitted(true);
        }
        if (fieldChanged === "phone") {
            dispatch(PhoneNumberCheck(data2));
            setSubmitted(true);
        }
    };

    const isButtonDisabled = !(email || phone);
    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
        style={{ flex: 1,backgroundColor: "#0D1623", }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1,backgroundColor: "#0D1623", }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        
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
                <View style={{ alignItems: "center", bottom: "100%" }}>
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 30, marginBottom: 10 }}>
                        Let's you in
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: formErrors?.email && fieldChanged === "email"
                                    ? "red"
                                    : phone ? Colors.dark.inActiveTab
                                        : Colors.dark.inputBorder,
                            },
                        ]}
                        placeholder="Enter your email"
                        placeholderTextColor={"gray"}
                        onChangeText={onChangeEmail}
                        onFocus={() => setFormErrors({})}
                        value={email}
                        editable={!phone}
                    />
                    {formErrors.email && fieldChanged === "email" && (
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: "red", fontSize: 12 }}>
                                {formErrors.email}
                            </Text>
                        </View>
                    )}
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
                        <View style={{ flex: 1, borderBottomColor: "white", borderBottomWidth: 0.2, marginRight: 10 }} />
                        <Text style={{ color: "white", fontSize: 14, }}>
                            OR
                        </Text>
                        <View style={{ flex: 1, borderBottomColor: "white", borderBottomWidth: 0.2, marginLeft: 10 }} />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>

                        <TextInput
                            editable={false}
                            style={[
                                styles.input,
                                {
                                    borderColor: email ? Colors.dark.inActiveTab : Colors.dark.inputBorder,
                                    width: "17%"
                                },
                            ]}
                            placeholder="Enter your Phone number"
                            placeholderTextColor={"gray"}
                            value={"+91"}
                        />
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: formErrors?.phone && fieldChanged === "phone"
                                        ? "red" : email ? Colors.dark.inActiveTab
                                            : Colors.dark.inputBorder,
                                    width: "80%"
                                },
                            ]}
                            keyboardType="numeric"
                            placeholder="Enter your Phone number"
                            placeholderTextColor={"gray"}
                            onChangeText={onChangePhone}
                            onFocus={() => setFormErrors({})}
                            value={phone}
                            editable={!email}
                        />
                    </View>
                    {formErrors.phone && fieldChanged === "phone" && (
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: "red", fontSize: 12 }}>
                                {formErrors.phone}
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    disabled={loading || phoneLoading || isButtonDisabled}
                    style={{ width: "100%", bottom: "80%" }}
                    onPress={handleGetOtp}
                >
                    <View
                        style={[
                            styles.button,
                            { backgroundColor: loading || phoneLoading || isButtonDisabled ? "gray" : Colors.dark.secondary },
                        ]}
                    >
                        {loading || phoneLoading ? (
                            <ActivityIndicator color={"white"} size={"small"} />
                        ) : (
                            <Text style={{ color: "white", fontSize: 15 }}>Get OTP</Text>
                        )}
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        bottom: "70%",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 5,

                    }}
                >
                    <Text style={{ color: "white", fontSize: 11 }}>
                        Don't haven't an account?
                    </Text>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 11,
                        }}
                    >
                        SignUp with
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/Signup",
                                params: {
                                    email: email,
                                    phone: phone,
                                    RegisterType: "email",
                                },
                            })
                        }
                    >
                        <Text
                            style={{
                                color: Colors.dark.secondary,
                                fontWeight: "bold",
                                fontSize: 13,
                                bottom: 2
                            }}
                        >
                            Email
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 11,
                        }}
                    >
                        or
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/Signup",
                                params: {
                                    email: email,
                                    phone: phone,
                                    RegisterType: "phone",
                                },
                            })
                        }
                    >
                        <Text
                            style={{
                                color: Colors.dark.secondary,
                                fontWeight: "bold",
                                fontSize: 13,
                                bottom: 2
                            }}
                        >
                            Phone
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        
        </ScrollView>
        </KeyboardAvoidingView>
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
        // bottom: 160,
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
        marginTop: 16,
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 10,
        color: "white",
    },
});
