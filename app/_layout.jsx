import "react-native-reanimated";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
    Platform,
    Text,
    TextInput,
    Linking,
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import ReduxProvider from "@/redux/ReduxProvider";
import StackNavigation from "@/navigation/StackNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { usePreventScreenCapture } from "expo-screen-capture";
import { useKeepAwake } from "expo-keep-awake";
import * as Brightness from "expo-brightness";
import * as Application from "expo-application";
import firestore from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    usePreventScreenCapture();
    useKeepAwake();

    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    const [storeVersion, setStoreVersion] = useState("");
    const [appVersion, setAppVersion] = useState("");
    const [notes, setNotes] = useState("");
    const [updateURL, setUpdateURL] = useState(
        Platform.OS === "android"
            ? "https://play.google.com/store/apps/details?id=com.ottwatchout"
            : "https://apps.apple.com/app/idXXXXXXXX"
    );

    useEffect(() => {
        getFirestoreVersion();
        getLocalAppVersion();
    }, []);

    const getFirestoreVersion = async () => {
        try {
            const versionRef = firestore().collection("versions").doc("Bteiz5Hntin7uV0XM953");
            const docSnap = await versionRef.get();

            if (docSnap.exists) {
                const data = docSnap.data();
                setStoreVersion(data.version);
                setNotes(data.message);
                console.log("🔥 Firestore Version:", data.version);
            } else {
                console.log("No version document found.");
            }
        } catch (error) {
            console.error("Error fetching version:", error);
        }
    };

    const getLocalAppVersion = () => {
        const currentVersion = Application.nativeApplicationVersion || "unknown";
        setAppVersion(currentVersion);
        console.log("📱 Current App Version:", currentVersion);
    };

    // Compare versions 
    // const compareVersions = (v1, v2) => {
    //     const v1Parts = v1.split(".").map(Number);
    //     const v2Parts = v2.split(".").map(Number);

    //     for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    //         const a = v1Parts[i] || 0;
    //         const b = v2Parts[i] || 0;
    //         if (a > b) return 1; // v1 > v2
    //         if (a < b) return -1; // v1 < v2
    //     }
    //     return 0;
    // };

    // show modal if Firestore version > local app version
    // const shouldShowUpdate =
    //     appVersion && storeVersion && compareVersions(storeVersion, appVersion) > 0;

    const shouldShowUpdate = appVersion && storeVersion && appVersion !== storeVersion;

    // Brightness permission
    useEffect(() => {
        (async () => {
            const { status } = await Brightness.requestPermissionsAsync();
            if (status === "granted") {
                Brightness.getSystemBrightnessAsync();
            }
        })();
    }, []);

    // Disable font scaling globally
    useEffect(() => {
        if (Text.defaultProps) {
            Text.defaultProps.allowFontScaling = false;
        } else {
            Text.defaultProps = { allowFontScaling: false };
        }

        if (TextInput.defaultProps) {
            TextInput.defaultProps.allowFontScaling = false;
        } else {
            TextInput.defaultProps = { allowFontScaling: false };
        }
    }, []);

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <View style={{ flex: 1 }}>
            <RootLayoutNav />

            {/* 🔔 Bottom Update Modal */}
            {shouldShowUpdate && (
                <Modal visible transparent animationType="fade" statusBarTranslucent>
                    <View style={styles.overlay}>
                        <View style={styles.modalBox}>
                            <View style={styles.appInfo}>
                                <Image
                                    source={require("../assets/images/icon.png")}
                                    style={styles.appIcon}
                                />
                                <View>
                                    <Text style={styles.appName}>Watchout</Text>
                                    <Text style={styles.appDetails}>
                                        v{storeVersion} (latest)
                                        {"\n"}{notes ? notes : null}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.title}>NEW UPDATE IS AVAILABLE</Text>
                            <Text style={styles.message}>
                                Update your application to the{"\n"}latest version
                            </Text>

                            <Text style={styles.submessage}>
                                A brand new version of this app is available in the{" "}
                                {Platform.OS === "ios" ? "App Store" : "Play Store"}.
                                {"\n"}Please update your app to use all of our amazing features.
                            </Text>

                            <View style={styles.buttonsContainer}>
                                <LinearGradient
                                    colors={["#152449ff", "#0A0F1C", "#0072FF",]}
                                    locations={[0.03, 1, 1]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientContainer}
                                >
                                    <TouchableOpacity
                                        style={styles.updateBtn}
                                        onPress={() => {
                                            if (updateURL) Linking.openURL(updateURL);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.updateText}>Update Now</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

function RootLayoutNav() {
    usePreventScreenCapture();
    return (
        <ReduxProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StackNavigation />
            </GestureHandlerRootView>
        </ReduxProvider>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "rgba(0,0,0,0.8)",
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        width: "100%",
        padding: 20,
        paddingTop: 15,
        paddingBottom: 40,
    },
    title: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 10,
        color: "#999",
        textAlign: 'center'
    },
    message: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        textAlign: 'center',
        marginTop: 7
    },
    submessage: {
        fontSize: 11,
        fontWeight: "400",
        color: "#999",
        textAlign: 'center',
        marginTop: 10
    },
    appInfo: {
        alignItems: "center",
        marginVertical: 10,
    },
    appIcon: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    appName: {
        fontSize: 14,
        fontWeight: "400",
        color: '#fff',
        textAlign: 'center',
        marginTop: 7
    },
    appDetails: {
        fontSize: 13,
        color: "#666",
        textAlign: 'center',
    },
    whatsNewTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 10,
    },
    whatsNewText: {
        fontSize: 13,
        color: "#333",
        marginTop: 4,
    },

    gradientContainer: {
        borderRadius: 10,
        width: "100%",
        padding: 2,
        marginTop: 20
    },
    updateBtn: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    updateText: {
        color: "#F6F6F6",
        fontSize: 16,
        fontWeight: "600",
    },
});
