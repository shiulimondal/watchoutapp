import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutActiveDevice } from "../../redux/features/LogoutActiveDeviceSlice";
import { readData, writeData } from "../../util/Util";
import { login } from "../../redux/features/auth/LoginSlice";
import Colors from "../../constants/Colors";
import ActiveIcon from "../../components/svgComponents/ActiveIcon";
import DeviceInfo from "react-native-device-info";
import * as Device from "expo-device";
import Toast from 'react-native-simple-toast';

const ActiveDevices = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [devices, SetDevices] = useState(JSON.parse(params?.deviceDetails));
    const [userDetails, setUserDetails] = useState(
        JSON.parse(params?.userDetails)
    );
    const { logout_data, logout_loading } = useSelector(
        (state) => state.logoutActive
    );
    const { userData, user_loading } = useSelector((state) => state.login);

    const [deviceId, setDeviceId] = useState(null);
    const [deviceManufacturer, setDeviceManufacturer] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceType, setDeviceType] = useState("");
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    useEffect(() => {
        if (userData && userData.status && isLoggedOut) {
            Toast.show("Please wait, till we let you in...", Toast.LONG);

            // ToastAndroid.show(
            //     "Please wait, till we let you in...",
            //     ToastAndroid.BOTTOM
            // );
            navigation.reset({
                index: 0,
                routes: [{ name: "(tabs)" }],
            });
            writeData("user_data", userData);
            setIsLoggedOut(false);
        }
    }, [userData]);

    useEffect(() => {
        if (logout_data?.status) {
            const loginDataForEmail = {
                email: userDetails.email,
                otp: params?.otp,
                device_unique_id: deviceId,
                device_name: deviceName,
                device_manufacturer: deviceManufacturer,
                device_type: deviceType,
            };

            const loginData = {
                phone: userDetails.phone,
                otp: params?.otp,
                device_unique_id: deviceId,
                device_name: deviceName,
                device_manufacturer: deviceManufacturer,
                device_type: deviceType,
            };
            if (userDetails.phone) {
                dispatch(login(loginData));
            } else {
                dispatch(login(loginDataForEmail));
            }
        }
    }, [logout_data]);

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

    const logoutDevice = (device) => {
        let payload = {
            user_id: userDetails?.user_id,
            device_login_id: device.device_login_id,
            device_unique_id: deviceId,
            device_name: deviceName,
            device_manufacturer: deviceManufacturer,
            device_type: deviceType,
        };
        dispatch(logoutActiveDevice(payload));
        setIsLoggedOut(true);
    };

    return (
        <View style={style.container}>
            <View
                style={{
                    marginVertical: 20,
                    paddingBottom: 0,
                    paddingTop: 25,
                    flexDirection: "row",
                    gap: 15,
                    alignItems: "center",
                }}
            >
                <Text style={style.topHeader}>Active Devices</Text>
            </View>

            <Text style={{
                color:'#fff',
                fontWeight:'500',
                fontSize:13,
                paddingHorizontal:15
            }}>Please click logout from other device listed below to watch on your current device</Text>

            {devices.map((device) => (
                <View
                    key={device?.device_login_id}
                    style={{
                        marginVertical: 20,
                        backgroundColor: Colors.dark.tabBackground,
                        padding: 15,
                        borderRadius: 10,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                        Device Details
                    </Text>
                    <View style={{
                        paddingVertical: 20,
                        width: 290,
                    }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: '70%',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 20,
                                }}
                            >
                                <View style={{ position: "relative" }}>
                                    <View
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: -2,
                                            zIndex: 2,
                                        }}
                                    >
                                        <ActiveIcon />
                                    </View>
                                    <Ionicons
                                        name="phone-portrait-outline"
                                        size={25}
                                        color={Colors.dark.secondary}
                                    />
                                </View>

                                <View>
                                    <Text
                                        style={{
                                            color: "white",
                                            fontWeight: "600",
                                            fontSize: 14,

                                        }}
                                    >
                                        {device?.device_manufacturer} {device?.device_name}
                                    </Text>
                                    <Text
                                        style={{
                                            color: "white", fontSize: 10, fontWeight: 200,
                                            width: 180,
                                        }}
                                    >
                                        {device?.device_type}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                disabled={logout_loading}
                                onPress={() => logoutDevice(device)}
                            >
                                <View
                                    style={{
                                        backgroundColor: logout_loading
                                            ? "gray"
                                            : Colors.dark.secondary,
                                        paddingHorizontal: 12,
                                        paddingVertical: 7,
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text style={{ fontSize: 12, color: "white" }}>Log Out</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            ))}

            {/* Full Screen Loader with Blur Effect */}
            {logout_loading && (
                <View style={style.loaderOverlay}>
                    <ActivityIndicator size="large" color={Colors.dark.secondary} />
                </View>
            )}
        </View>
    );
};

export default ActiveDevices;

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
        padding: 20,
    },
    topHeader: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    loaderOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background with some transparency
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it's above other elements
    },
});
