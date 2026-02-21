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
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { readData, writeData } from "../../util/Util";
import { useEffect, useRef, useState } from "react";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { signUp } from "../../redux/features/auth/SignUpSlice";
import { login } from "../../redux/features/auth/LoginSlice";
import { TouchableHighlight } from "react-native-gesture-handler";
import { detailsCheck } from "../../redux/features/auth/DetailsCheckSlice";
import { emailCheck } from "../../redux/features/auth/EmailCheckSlice";
import { DetailsCheck, EmailCheck } from "../../services/ApiServices";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SignUpForPh } from "../../redux/features/auth/SignUpForPhSlice";
import DeviceInfo from "react-native-device-info";
import * as Device from "expo-device";
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get("window");
const CELL_COUNT = 4;

export default function OtpScreen() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    console.log(params, 'params params');
    const otpRef = useRef();
    const router = useRouter();
    const [formErrors, setFormErrors] = useState({});
    const [email, setEmail] = useState("");
    const [value, setValue] = useState("");
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const [submitted, setSubmitted] = useState(false);
    const [deviceId, setDeviceId] = useState(null);
    const [deviceManufacturer, setDeviceManufacturer] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceType, setDeviceType] = useState("");

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const { data, loading } = useSelector((state) => state.account);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData, loading: forMobileloading } = useSelector(
        (state) => state.accountForPh
    );
    const { userData, user_loading } = useSelector((state) => state.login);
    const [timer, setTimer] = useState(30);
    const [isDisabled, setIsDisabled] = useState(true);
    const [otp, setOtp] = useState(null);
    const dispatch = useDispatch();

    console.log(data, 'state.account');
    console.log(signupData, 'state.account.data');
    console.log(forMobileData, 'state.accountForPh');
    console.log(userData, 'userData');

    useEffect(() => {
        let interval = null;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            setIsDisabled(false);
        }

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            try {
                const id = await DeviceInfo.getAndroidId();
                const name = Device.modelName;
                const manufacturer = Device.manufacturer;
                const type = Device.osName;

                setDeviceId(id);
                setDeviceName(name);
                setDeviceManufacturer(manufacturer);
                setDeviceType(type);
            } catch (error) {
                console.error("Error fetching device info:", error);
            }
        };

        fetchDeviceInfo();
    }, []);

    useEffect(() => {
        if (userData && userData.status && submitted) {
            if (userData && userData.plan_status) {
                if (userData?.device_status) {
                    Toast.show("Logged in successfully", Toast.LONG);
                    // ToastAndroid.show("Logged in successfully", ToastAndroid.BOTTOM);
                    writeData("user_data", userData);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "(tabs)" }],
                    });
                    setSubmitted(false);
                } else {
                    router.replace({
                        pathname: "/ActiveDevices",
                        params: {
                            deviceDetails: JSON.stringify(userData?.other_device_details),
                            userDetails: JSON.stringify(userData?.data),
                            otp: value,
                        },
                    });
                    setSubmitted(false);
                }
            } else {
                Toast.show("Logged in successfully", Toast.LONG);
                // ToastAndroid.show("Logged in successfully", ToastAndroid.BOTTOM);
                writeData("user_data", userData);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "(tabs)" }],
                });
                setSubmitted(false);
            }
        } else if (userData && !userData.status && submitted) {
            Toast.show(userData.message, Toast.LONG);
            // ToastAndroid.show(userData.message, ToastAndroid.BOTTOM);
        }
    }, [userData]);

    useEffect(() => {
        if (data && data?.status && submitted) {
            if (data && data.plan_status) {
                if (data?.device_status) {
                    Toast.show("Account created successfully", Toast.LONG);
                    // ToastAndroid.show(
                    //     "Account created successfully",
                    //     ToastAndroid.BOTTOM
                    // );
                    writeData("user_data", data);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "(tabs)" }],
                    });
                    setSubmitted(false);
                }
            } else {
                Toast.show("Account created successfully", Toast.LONG);
                // ToastAndroid.show("Account created successfully", ToastAndroid.BOTTOM);
                writeData("user_data", data);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "(tabs)" }],
                });
                setSubmitted(false);
            }
        } else if (data && !data?.status && submitted) {
            Toast.show(data?.message, Toast.LONG);
            // ToastAndroid.show(data?.message, ToastAndroid.BOTTOM);
            setSubmitted(false);
        }
    }, [data]);

    useEffect(() => {
        console.log(forMobileData, 'forMobileData');
        console.log(forMobileData?.status, 'forMobileData');
        console.log(submitted, 'forMobileData');

        if (forMobileData && forMobileData?.status && submitted) {
            if (forMobileData && forMobileData.plan_status) {
                if (forMobileData?.device_status) {
                    Toast.show("Account created successfully", Toast.LONG);
                    // ToastAndroid.show(
                    //     "Account created successfully",
                    //     ToastAndroid.BOTTOM
                    // );
                    writeData("user_data", forMobileData);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "(tabs)" }],
                    });
                    setSubmitted(false);
                }
            } else {
                Toast.show("Account created successfully", Toast.LONG);
                // ToastAndroid.show("Account created successfully", ToastAndroid.BOTTOM);
                writeData("user_data", forMobileData);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "(tabs)" }],
                });
                setSubmitted(false);
            }
        } else if (forMobileData && !forMobileData?.status && submitted) {
            Toast.show(forMobileData?.message, Toast.LONG);
            // ToastAndroid.show(forMobileData?.message, ToastAndroid.BOTTOM);
            setSubmitted(false);
        }
    }, [forMobileData]);

    const confirmCode = (value) => {
        if (value) {
            let dataForEmail = {
                name: params.name,
                email: params.email,
                phone: params.phone,
                registration_type: "email",
                otp: value,
                device_unique_id: deviceId,
                device_name: deviceName,
                device_manufacturer: deviceManufacturer,
                device_type: deviceType,
            };
            let dataForMobile = {
                name: params.name,
                email: params.email,
                phone: params.phone,
                registration_type: "phone",
                otp: value,
                device_unique_id: deviceId,
                device_name: deviceName,
                device_manufacturer: deviceManufacturer,
                device_type: deviceType,
            };

            let loginDataForEmail = {
                email: params.email,
                otp: value,
                device_unique_id: deviceId,
                device_name: deviceName,
                device_manufacturer: deviceManufacturer,
                device_type: deviceType,
            };

            let loginDataForPh = {
                phone: params.phone,
                otp: value,
                device_unique_id: deviceId,
                device_name: deviceName,
                device_manufacturer: deviceManufacturer,
                device_type: deviceType,
            };

            setSubmitted(true);

            if (params.type === "signup") {
                if (
                    params?.sendOtpType === "success" ||
                    params.RegisterType === "phone"
                ) {
                    dispatch(SignUpForPh(dataForMobile));
                } else {
                    dispatch(signUp(dataForEmail));
                }
            } else {
                if (params.type === "login" && params?.phone) {
                    dispatch(login(loginDataForPh));
                } else {
                    dispatch(login(loginDataForEmail));
                }
            }
        } else {
            Toast.show("Please enter OTP!", Toast.LONG);
        }
    };

    const handleResendMailOtp = async () => {
        setTimer(30);
        setIsDisabled(true);

        let loginData = {
            email: params.email,
        };

        let signUpData = {
            name: params.name,
            email: params.email,
            phone: params.phone,
        };
        if (params.type === "signup") {
            const response = await DetailsCheck(signUpData);
            if (response.status) {

                // ToastAndroid.show("OTP resent to email", ToastAndroid.BOTTOM);
                Toast.show("OTP resent to email", Toast.LONG);
                setOtp(response.otp);
            }
        } else {
            const response = await EmailCheck(loginData);
            if (response.status) {
                // ToastAndroid.show("OTP resent to email", ToastAndroid.BOTTOM);
                Toast.show("OTP resent to email", Toast.LONG);
                setOtp(response.otp);
            }
        }
    };




    // resend otp-------------------
    const handleResendPhoneOtp = () => {
        if (!params?.phone) {
            Toast.show("Invalid phone number", Toast.LONG);
            // ToastAndroid.show("Invalid phone number", ToastAndroid.SHORT);
            return;
        }

        const mobileNumber = `91${params?.phone}`;

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
                    // ToastAndroid.show("OTP resent to phone number", ToastAndroid.SHORT);
                    Toast.show("OTP resent to phone number", Toast.LONG);
                } else {
                    // ToastAndroid.show(
                    //     response.data.message || "Failed to resend OTP",
                    //     ToastAndroid.SHORT
                    // );
                    Toast.show(
                        response.data.message || "Failed to resend OTP",
                        Toast.LONG
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error.response?.data || error.message);
                // ToastAndroid.show(
                //     error.response?.data?.message || "Something went wrong",
                //     ToastAndroid.SHORT
                // );
                Toast.show(
                    error.response?.data?.message || "Something went wrong",
                    Toast.LONG
                );
            });
    };

    //  verify otp ========================
    const handleVerifyOtp = () => {
        if (!params?.phone || !value) {
            Toast.show("Phone or OTP is missing", Toast.LONG);
            // ToastAndroid.show("Phone or OTP is missing", ToastAndroid.SHORT);
            return;
        }

        const mobileNumber = `91${params?.phone}`;
        const queryString = new URLSearchParams({
            otp: value,
            mobile: mobileNumber,
        }).toString();

        axios
            .get(`https://control.msg91.com/api/v5/otp/verify?${queryString}`, {
                headers: {
                    authkey: "436860AVh2E0gVf677bb65aP1",
                },
            })
            .then((response) => {
                // ToastAndroid.show(response?.data?.message, ToastAndroid.BOTTOM);
                Toast.show(response?.data?.message, Toast.LONG);
            })
            .catch((error) => {
                // ToastAndroid.show(error?.message, ToastAndroid.BOTTOM);
                Toast.show(error?.message, Toast.LONG);
            });
    };


    const onSubmit = () => {
        console.log("otp", value);

        const otp = otpRef.current?.getValue();

        setFormErrors({});
        const errors = {};
        if (value == "") {
            errors.otp = "OTP is required";
        } else if (value.length < 4) {
            errors.otp = "OTP cannot be less than 4 digits";
        } else {
            if (params.sendOtpType === "success" || params.RegisterType === "phone") {
                handleVerifyOtp();
            }
            confirmCode(value);
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return false;
        }

        return true;
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#0D1623" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ImageBackground
                    source={require("../../assets/get.png")}
                    resizeMode="cover"
                    style={{ flex: 1 }} // <- add this
                >

                    <TouchableOpacity style={{ zIndex: 2 }} onPress={() => router.back()}>
                        <Ionicons
                            name="arrow-back-outline"
                            size={25}
                            color={"white"}
                            style={{ marginTop: 40, marginLeft: 20 }}
                        />
                    </TouchableOpacity>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <LinearGradient
                            colors={[
                                "rgba(13, 22, 35, 1)",
                                "rgba(13, 22, 35, 0.9)",
                                "rgba(13, 22, 35, 0)",
                            ]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.gradient}
                        />
                        <View style={{ paddingHorizontal: 20, position: 'absolute', bottom: 70, width: '100%' }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 30, }}>
                                    Your OTP
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    style={{
                                        flexDirection: "row",
                                        gap: 5,
                                        alignItems: "center",
                                        marginTop: 10,
                                    }}
                                >
                                    <Text style={{ color: Colors.dark.secondary }}>
                                        {params.phone
                                            ? params.phone
                                            : params.email}
                                    </Text>

                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems:'center', justifyContent:'center'}}>
                                <CodeField
                                    ref={ref}
                                    value={value}
                                    onChangeText={setValue}
                                    cellCount={CELL_COUNT}
                                    rootStyle={styles.codeFieldRoot}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    renderCell={({ index, symbol, isFocused }) => (
                                        <Text
                                            key={index}
                                            style={[styles.cell, isFocused && styles.focusCell]}
                                            onLayout={getCellOnLayoutHandler(index)}
                                        >
                                            {symbol || (isFocused ? <Cursor /> : null)}
                                        </Text>
                                    )}
                                />

                                {formErrors.otp && (
                                    <View style={{ marginTop: 0 }}>
                                        <Text style={{ color: "red", fontSize: 12 }}>
                                            {formErrors.otp}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    gap: 5,
                                }}
                            >
                                <Text style={{ color: "white", fontSize: 12 }}>
                                    Didn't get OTP yet?
                                </Text>
                                <TouchableOpacity
                                    onPress={
                                        params.sendOtpType === "success"
                                            ? handleResendPhoneOtp
                                            : handleResendMailOtp
                                    }
                                    disabled={isDisabled}
                                >
                                    <Text
                                        style={{
                                            color: isDisabled ? "gray" : Colors.dark.secondary,
                                            fontWeight: "bold",
                                            fontSize: 12,
                                        }}
                                    >
                                        {isDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                disabled={loading || forMobileloading || user_loading}
                                style={{
                                    width: "100%",
                                    marginTop: 20
                                }}
                                onPress={onSubmit}
                            >
                                <View
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: loading
                                                ? "gray"
                                                : user_loading
                                                    ? "gray"
                                                    : forMobileloading
                                                        ? "gray"
                                                        : Colors.dark.secondary,
                                        },
                                    ]}
                                >
                                    {loading || forMobileloading || user_loading ? (
                                        <ActivityIndicator color={"white"} size={"small"} />
                                    ) : (
                                        <Text style={{ color: "white", fontSize: 15 }}>Submit</Text>
                                    )}
                                </View>

                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </KeyboardAvoidingView>
        </View>
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

    input: {
        borderWidth: 1,
        borderColor: Colors.dark.inputBorder,
        width: "100%",
        marginTop: 30,
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 10,
        color: "white",
    },

    codeFieldRoot: { marginVertical: 20 },
    cell: {
        width: 55,
        height: 55,
        lineHeight: 50,
        fontSize: 34,
        borderWidth: 0.6,
        borderColor: Colors.dark.activeTab,
        textAlign: "center",
        borderRadius: 10,
        color: Colors.dark.activeTab,
        marginHorizontal: 12,
    },

    focusCell: {
        borderColor: Colors.dark.activeTab,
        borderWidth: 2,
        color: Colors.dark.secondary,
    },
});
