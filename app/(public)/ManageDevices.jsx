import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { readData, writeData } from "../../util/Util";
import { login } from "../../redux/features/auth/LoginSlice";
import Colors from "../../constants/Colors";
import ActiveIcon from "../../components/svgComponents/ActiveIcon";
import { getActiveDevices } from "../../redux/features/details/ActiveDevicesDetailsSlice";
import SkeletonLoading from 'expo-skeleton-loading';
import { logoutActiveDevice } from "../../redux/features/details/LogoutActiveDeviceDetailsSlice";

const { width, height } = Dimensions.get("window");

const ManageDevices = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [devices, setDevices] = useState([]);
    const { logout_active_device_data, logout_active_device_loading } =
        useSelector((state) => state.logoutActiveDevice);
    const { userData, user_loading } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const { active_device_data, active_device_loading } = useSelector(
        (state) => state.activeDevice
    );

    const [deviceId, setDeviceId] = useState(null);
    const [deviceManufacturer, setDeviceManufacturer] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceType, setDeviceType] = useState("");
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    useEffect(() => {
        if (active_device_data) {
            setDevices(active_device_data);
        }
    }, [active_device_data]);

    useEffect(() => {
        let payload = {
            user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
            token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
        };

        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(getActiveDevices(payload));
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (logout_active_device_data?.status && isLoggedOut) {
            let payload = {
                user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
                token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
            };
            dispatch(getActiveDevices(payload));
            setIsLoggedOut(false);
        }
    }, [logout_active_device_data]);

    useEffect(() => {
        readData("device_id").then((id) => {
            setDeviceId(id);
            readData("device_manufacturer").then((manufacturer) => {
                setDeviceManufacturer(manufacturer);
                readData("device_name").then((name) => {
                    setDeviceName(name);
                    readData("device_type").then((type) => {
                        setDeviceType(type);
                    });
                });
            });
        });
    }, []);

    const logoutDevice = (device) => {
        let payload = {
            data: {
                user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
                device_login_id: device.device_login_id,
            },
            token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
        };

        dispatch(logoutActiveDevice(payload));
        setIsLoggedOut(true);
    };

    // Separate current device and other devices
    const currentDevice = devices?.filter(
        (device) => device?.device_unique_id === deviceId
    );
    const otherDevices = devices?.filter(
        (device) => device?.device_unique_id !== deviceId
    );

    // Combine current device at the top followed by other devices
    const sortedDevices = [...currentDevice, ...otherDevices];

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
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={25} color={"white"} />
                </TouchableOpacity>
                <Text style={style.topHeader}>Active Devices</Text>
            </View>

            {sortedDevices?.length > 0 ? (
                sortedDevices?.map((device) => (
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
                            {device?.device_unique_id === deviceId
                                ? "Your Device"
                                : "Other Device"}
                        </Text>
                        <View style={{ paddingVertical: 20 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
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
                                        {device?.device_unique_id === deviceId && (
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
                                        )}
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
                                            style={{ color: "white", fontSize: 10, fontWeight: 200 }}
                                        >
                                            {device?.device_type}
                                        </Text>
                                    </View>
                                </View>

                                {device?.device_unique_id !== deviceId && (
                                    <TouchableOpacity
                                        disabled={logout_active_device_loading}
                                        onPress={() => logoutDevice(device)}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: logout_active_device_loading
                                                    ? "gray"
                                                    : Colors.dark.secondary,
                                                paddingHorizontal: 12,
                                                paddingVertical: 7,
                                                borderRadius: 5,
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, color: "white" }}>
                                                Log Out
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                    <View
                        style={{
                            width: width - 40,
                            height: 130,
                            borderRadius: 10,
                            marginVertical: 20,
                            background: "#3e3e3eff"
                        }}
                    />
                </SkeletonLoading>
            )}

            {/* Full Screen Loader with Blur Effect */}
            {logout_active_device_loading && (
                <View style={style.loaderOverlay}>
                    <ActivityIndicator size="large" color={Colors.dark.secondary} />
                </View>
            )}
        </View>
    );
};

export default ManageDevices;

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
