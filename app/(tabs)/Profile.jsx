import { writeData } from "@/util/Util";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SkeletonLoading from 'expo-skeleton-loading';
import { StatusBar } from "expo-status-bar";
import { logout } from "../../redux/features/auth/LoginSlice";
import { getUserDetails } from "../../redux/features/details/ProfileDetailsSlice";
import ProfileIcon from "../../components/svgComponents/Profile";
import PlanIcon from "../../components/svgComponents/PlanIcon";
import TermsIcon from "../../components/svgComponents/TermsIcon";
import PrivacyIcon from "../../components/svgComponents/PrivacyIcon";
import ShareIcon from "../../components/svgComponents/ShareIcon";
import RateUsIcon from "../../components/svgComponents/RateUsIcon";
import HelpIcon from "../../components/svgComponents/HelpIcon";
import Icon from "react-native-vector-icons/MaterialIcons";
import { logoutInitiate } from "../../redux/features/auth/SignUpSlice";
import { logoutInitiateForPhone } from "../../redux/features/auth/SignUpForPhSlice";
import RefundIcon from "../../components/svgComponents/RefundIcon";
import ModalComponent from "../../components/ModalComponent";
import Toast from 'react-native-simple-toast';
// import { checkVersion } from "react-native-check-version";

const { width, height } = Dimensions.get("window");

const size = 100;

const Profile = () => {
    const navigation = useNavigation();
    const { userData, user_loading } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const router = useRouter();
    const dispatch = useDispatch();
    const [menuItems, setmenuItems] = useState([
        {
            id: 1,
            name: "Account",
            icon: require("../../assets/icons/account.png"),
            svgIcon: <ProfileIcon />,
            navigateTo: "/Account",
        },
        {
            id: 2,
            name: "My Plan",
            svgIcon: <PlanIcon />,
            icon: require("../../assets/icons/myplan.png"),
            navigateTo: "/MyPlan",
        },
        {
            id: 3,
            name: "Manage Devices",
            icon: require("../../assets/icons/emailsettings.png"),
            iconName: "tablet-mobile-combo",
            navigateTo: "/ManageDevices",
        },
        {
            id: 4,
            name: "Cancellation and Refund",
            svgIcon: <RefundIcon />,
            icon: require("../../assets/icons/emailsettings.png"),
            navigateTo: "/Refund",
        },
        {
            id: 5,
            name: "Terms and Condition",
            svgIcon: <TermsIcon />,
            icon: require("../../assets/icons/terms.png"),
            navigateTo: "/TermsConditions",
        },
        {
            id: 6,
            name: "Privacy Policy",
            svgIcon: <PrivacyIcon />,
            icon: require("../../assets/icons/privacy.png"),
            navigateTo: "/PrivacyPolicy",
        },
    ]);
    const { data, loading } = useSelector((state) => state.userDetails);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

    const url =
        "https://expo.dev/accounts/dev3scwt/projects/watchout/builds/6f34f21f-c87f-4344-8434-a35ad89b5cfd";

    const fetchUserDetails = useCallback(() => {
        if (userData) {
            let payload = {
                user_id: userData?.data?.user_id,
                token: userData?.token,
            };
            dispatch(getUserDetails(payload));
        } else if (signupData) {
            let payload = {
                user_id: signupData?.data?.user_id,
                token: signupData?.token,
            };
            dispatch(getUserDetails(payload));
        } else if (forMobileData) {
            let payload = {
                user_id: forMobileData?.data?.user_id,
                token: forMobileData?.token,
            };
            dispatch(getUserDetails(payload));
        }
    }, [dispatch, userData, signupData, forMobileData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchUserDetails();
        });

        return unsubscribe;
    }, [navigation]);

    // const [appVersion, setAppVersion] = useState()
    // useEffect(() => {
    //     const fetchVersion = async () => {
    //         try {
    //             const version = await checkVersion();
    //             setAppVersion(version?.version)
    //         } catch (e) {
    //             console.log("Error checking version:", e);
    //         }
    //     };
    //     fetchVersion();
    // }, []);


    const signout = () => {
        if (userData) {
            dispatch(logout());
        } else if (signupData) {
            dispatch(logoutInitiate());
        }
        else if (forMobileData) {
            dispatch(logoutInitiateForPhone());
        }
        writeData("user_data", null);
    };

    const handleBackPress = () => {
        router.back();
    };

    const handleNavigate = () => {
        router.push("/Login");
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: "Watchout | An OTT application" + "\n" + url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const deleteAccount = async (token) => {
        const sendAuthPostData = async (url, token) => {
            try {

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return await response.json();
            } catch (err) {
                console.error("❌ Fetch error:", err);
                throw err;
            }
        };
        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/user/delete-account`;
            console.log('del url--------------------', url);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Delete account request timed out")), 15000)
            );
            const res = await Promise.race([
                sendAuthPostData(url, token),
                timeoutPromise,
            ]);
            if (res?.status === true) {
                Toast.show("Account deleted successfully", Toast.LONG);
                dispatch(logout());
                dispatch(logoutInitiate());
                dispatch(logoutInitiateForPhone());
                writeData("user_data", null);
                router.replace("/(tabs)/home");
            } else {
                Toast.show(res?.message || "Failed to delete account", Toast.LONG);
            }
        } catch (error) {
            console.error("❌ Error in deleteAccount:", error);
            Toast.show("Something went wrong", Toast.LONG);
        }
    };


    return (
        <>
            {!userData && !signupData && !forMobileData ? (
                <SafeAreaView
                    style={[style.container, { padding: 0, backgroundColor: "#0D1623" }]}
                >
                    <StatusBar style="auto" />

                    <ImageBackground
                        source={require("../../assets/get.png")}
                        style={style.imageBackground}
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={[
                                "rgba(13, 22, 35, 1)",
                                "rgba(13, 22, 35, 0.7)",
                                "rgba(13, 22, 35, 0)",
                            ]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={style.gradient}
                        />
                    </ImageBackground>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "white", fontSize: 20 }}>
                            Do you have an account?
                        </Text>
                        <TouchableOpacity
                            style={{
                                width: "90%",
                                marginVertical: 20,
                            }}
                            onPress={handleNavigate}
                        >
                            <View style={style.button}>
                                <Text style={{ color: "white", fontSize: 18 }}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            ) : (
                <ScrollView style={style.container}>
                    {/* <TouchableOpacity style={style.backHandler} onPress={handleBackPress}>
        <Ionicons name="chevron-back-outline" color={"white"} size={20} />
        <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
      </TouchableOpacity> */}
                    {loading ? (
                        <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                            <View style={[style.profileDetailsContainer, { background: "#3e3e3eff" }]}>
                                <View>
                                    <View style={[style.profileImage, { background: "#3e3e3eff" }]} />
                                </View>
                                <View style={{ gap: 5, background: "#3e3e3eff" }}>
                                    <View
                                        style={{
                                            width: 220,
                                            height: 20,
                                            marginBottom: 5,
                                            borderRadius: 5,
                                            background: "#3e3e3eff"
                                        }}
                                    />
                                    <View
                                        style={{ width: 150, height: 20, borderRadius: 5, background: "#3e3e3eff" }}
                                    />
                                </View>
                            </View>
                        </SkeletonLoading>
                    ) : (
                        <View style={style.profileDetailsContainer}>
                            <View>
                                <Image
                                    source={
                                        data?.profile_pic
                                            ? { uri: data?.profile_pic }
                                            : require("../../assets/user.png")
                                    }
                                    style={style.profileImage}
                                />
                            </View>
                            <View style={{ gap: 5 }}>
                                <Text style={style.userNameText}>{data?.first_name}</Text>
                                <Text style={style.userIdText}>
                                    @{data?.first_name?.replace(/\s+/g, "").toLowerCase()}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={style.profileControllsContainer}>
                        <View>
                            <Text style={style.appSettingsText}>App Settings</Text>
                        </View>
                        <View style={style.profileMenuContainer}>
                            {menuItems.map((menuItem, index) => {
                                return (
                                    <React.Fragment key={menuItem.id}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={style.profileMenuItems}
                                            onPress={() =>
                                                router.push(
                                                    menuItem.navigateTo ? menuItem.navigateTo : "/Profile"
                                                )
                                            }
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    gap: 15,
                                                    alignItems: "center",
                                                }}
                                            >
                                                {/* <Image
                          source={menuItem.icon}
                          resizeMode="contain"
                          style={style.iconImage}
                        /> */}
                                                {menuItem.svgIcon ? (
                                                    menuItem.svgIcon
                                                ) : (
                                                    <Entypo
                                                        name={menuItem.iconName}
                                                        size={20}
                                                        color={Colors.dark.secondary}
                                                    />
                                                )}
                                                <Text style={style.profileMenuText}>
                                                    {menuItem.name}
                                                </Text>
                                            </View>
                                            <View>
                                                <Ionicons
                                                    name="chevron-forward-outline"
                                                    color={"gray"}
                                                    size={20}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        {index < menuItems.length - 1 && (
                                            <View style={style.separatorContainer}>
                                                <LinearGradient
                                                    colors={[
                                                        "rgba(128, 128, 128, 0)",
                                                        "rgba(128, 128, 128, 0.3)",
                                                        "rgba(128, 128, 128, 0)",
                                                    ]}
                                                    style={style.separator}
                                                    start={[0, 0.5]}
                                                    end={[1, 0.5]}
                                                />
                                            </View>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </View>
                    </View>

                    <View style={style.socialContainer}>
                        <TouchableOpacity onPress={handleShare}>
                            <View style={{ alignItems: "center", gap: 10 }}>
                                {/* <Image
                source={require("../../assets/icons/share.png")}
                resizeMode="contain"
                style={style.socialImage}
              /> */}
                                <ShareIcon />
                                <Text style={style.socialText}>Share</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ alignItems: "center", gap: 10 }}>
                            {/* <Image
                source={require("../../assets/icons/rateus.png")}
                resizeMode="contain"
                style={[style.socialImage, { height: 60, width: 60 }]}
              /> */}
                            <RateUsIcon />
                            <Text style={style.socialText}>Rate Us</Text>
                        </View>
                        <View style={{ alignItems: "center", gap: 10 }}>
                            {/* <Image
                source={require("../../assets/icons/help.png")}
                resizeMode="contain"
                style={style.socialImage}
              /> */}
                            <HelpIcon />
                            <Text style={style.socialText}>Help</Text>
                        </View>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={style.versionText}>Version: 1.0.0</Text>
                    </View>

                    <TouchableOpacity onPress={signout}>
                        <View style={style.logoutButton}>
                            {/* {isLoading ? (
                <ActivityIndicator color={"white"} size={"small"} />
              ) : (
                <Text style={style.logoutText}>Logout</Text>
              )} */}
                            <Text style={style.logoutText}>Logout</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsDeleteConfirmVisible(true)}>

                        <View style={style.deleteButton}>
                            <Icon name="delete" size={20} color={Colors.dark.buttonColor} style={{ marginRight: 8 }} />
                            <Text style={{ ...style.logoutText, fontSize: 13, color: Colors.dark.buttonColor }}>Delete Account</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            )}

            <ModalComponent
                visible={isDeleteConfirmVisible}
                title="Delete Your Account Permanently"
                options={[
                    {
                        label: "Cancel",
                        onPress: () => setIsDeleteConfirmVisible(false),
                    },
                    {
                        label: "Delete",
                        onPress: () => {
                            setIsDeleteConfirmVisible(false);
                            deleteAccount(userData?.token);
                        },
                    },
                ]}
                onRequestClose={() => setIsDeleteConfirmVisible(false)}
            />


        </>
    );
};

export default Profile;

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.dark.primary100,
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

    backHandler: {
        marginVertical: 30,
        flexDirection: "row",
        alignItems: "center",
    },

    profileDetailsContainer: {
        marginVertical: 10,
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        marginTop: 50,
    },

    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },

    userNameText: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
    },

    userIdText: {
        color: "gray",
        fontSize: 13,
    },

    profileControllsContainer: {
        marginVertical: 10,
        gap: 15,
    },

    appSettingsText: {
        color: "gray",
        fontSize: 17,
    },

    profileMenuContainer: {
        borderRadius: 15,
        backgroundColor: Colors.dark.menuBackground,
    },

    profileMenuItems: {
        backgroundColor: Colors.dark.menuBackground,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: 15,
    },

    profileMenuText: {
        color: "gray",
        fontSize: 15,
    },

    separatorContainer: {
        marginHorizontal: 10,
    },

    separator: {
        height: 1,
        width: "100%",
    },

    iconImage: {
        width: 20,
        height: 20,
    },

    socialContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        // marginVertical: 20,
        marginVertical: 40,
        gap: -65,
    },

    socialImage: {
        width: 25,
        height: 25,
    },

    socialText: {
        color: "gray",
        fontSize: 13,
        textAlign: "center",
    },

    logoutButton: {
        backgroundColor: Colors.dark.buttonColor,
        paddingVertical: 17,
        borderRadius: 10,
        marginTop: 30,
    },
    deleteButton: {
        paddingVertical: 20,
        borderRadius: 10,
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    logoutText: {
        color: "white",
        fontSize: 15,
        fontWeight: "400",
        textAlign: "center",
    },

    versionText: {
        color: "gray",
        textAlign: "center",
        fontSize: 12,
    },

    button: {
        backgroundColor: Colors.dark.secondary,
        paddingVertical: 20,
        alignItems: "center",
        borderRadius: 10,
    },
});
