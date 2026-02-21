import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import SkeletonLoading from 'expo-skeleton-loading';
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Dimensions,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { getWatchList } from "../../redux/features/details/WatchlistDetailsSlice";
import { msToTime } from "../../util/Util";
import { addToWatchList } from "../../redux/features/AddToWatchListSlice";

const { width, height } = Dimensions.get("window");

export default function WatchList() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const router = useRouter();
    const animation = useRef(null);
    const refRBSheet = useRef([]);
    const [watchLists, setWatchLists] = useState([]);
    const { userData, user_loading } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const { watchlist_data, watchlist_loading } = useSelector(
        (state) => state.watchlist
    );
    const { add_data, add_loading } = useSelector((state) => state.watchlistAdd);

    useEffect(() => {
        if (watchlist_data?.length > 0) {
            setWatchLists(watchlist_data);
        } else setWatchLists([]);
    }, [watchlist_data]);

    useEffect(() => {
        const payload = {
            user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
            token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
        };
        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(getWatchList(payload));
        });
        return unsubscribe;
    }, [navigation]);

    const secondsToHoursMinutes = (seconds) => {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        return { hours: hours, minutes: minutes };
    };

    const viewContent = (item) => {
        if (item.content_type === "movie") {
            router.push({
                pathname: "/home/MovieDetails",
                params: {
                    content_id: item?.content_id,
                },
            });
        } else if (item.content_type === "webseries") {
            router.push({
                pathname: "/home/SeriesDetails",
                params: {
                    content_id: item?.content_id,
                },
            });
        }
    };

    useEffect(() => {
        const payload = {
            user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
            token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
        };
        dispatch(getWatchList(payload));
    }, [add_data]);

    const removeItem = (item) => {
        let payload = {
            data: {
                user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
                content_id: item.content_id,
                value: "0",
            },
            token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
        };

        dispatch(addToWatchList(payload));
    };

    const renderWatchlist = ({ item, index }) => {
        const time = secondsToHoursMinutes(item.duration);

        return (
            <>
                {watchlist_loading ? (
                    <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                        <View style={[styles.contentView, { background: "#3e3e3eff" }]}>
                            <View
                                style={{ flexDirection: "row", alignItems: "center", gap: 10, background: "#3e3e3eff" }}
                            >
                                <View style={[styles.contentImage, { background: "#3e3e3eff" }]} />
                                <View style={{ gap: 5, background: "#3e3e3eff" }}>
                                    <View
                                        style={{ width: 140, height: 25, borderRadius: 5, background: "#3e3e3eff" }}
                                    />
                                    <View
                                        style={{ width: 100, height: 15, borderRadius: 5, background: "#3e3e3eff" }}
                                    />
                                </View>
                            </View>
                        </View>
                    </SkeletonLoading>
                ) : (
                    <>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => refRBSheet.current[index].open()}
                        >
                            <View style={styles.contentView}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.feature_image }}
                                        style={styles.contentImage}
                                    />
                                    <View style={{ gap: 5 }}>
                                        <Text style={{ color: "white", fontSize: 15 }}>
                                            {item.title}
                                        </Text>
                                        <Text style={{ color: "white", fontSize: 12 }}>
                                            {item?.duration
                                                ? msToTime(item.duration)
                                                : "Watch Series Now"}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons
                                    name={"chevron-forward-outline"}
                                    color={"white"}
                                    size={20}
                                />
                            </View>
                        </TouchableOpacity>
                        <RBSheet
                            ref={(ref) => (refRBSheet.current[index] = ref)}
                            useNativeDriver={false}
                            height={110}
                            customStyles={{
                                wrapper: {
                                    backgroundColor: "transparent",
                                },
                                draggableIcon: {
                                    backgroundColor: "#000",
                                },
                            }}
                            customModalProps={{
                                animationType: "slide",
                                statusBarTranslucent: true,
                            }}
                            customAvoidingViewProps={{
                                enabled: false,
                            }}
                        >
                            <View style={{ padding: 20, alignItems: "center", gap: 10 }}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{ width: "100%" }}
                                    onPress={() => removeItem(item)}
                                >
                                    <View style={{ alignItems: "center" }}>
                                        <Text style={styles.sheetText}>Remove from Watchlist</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.seperator}></View>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{ width: "100%" }}
                                    onPress={() => viewContent(item)}
                                >
                                    <View style={{ alignItems: "center" }}>
                                        <Text style={styles.sheetText}>View Content</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </RBSheet>
                    </>
                )}
            </>
        );
    };

    const handleNavigate = () => {
        router.push("/Login");
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View
                style={{
                    marginVertical: 20,
                    padding: 20,
                    paddingBottom: 0,
                    paddingTop: 25,
                }}
            >
                <Text style={styles.topHeader}>Watchlist</Text>
            </View>

            {!userData && !signupData && !forMobileData ? (
                <View style={[styles.container, { padding: 20 }]}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{
                                width: 150,
                                height: 150,
                                backgroundColor: Colors.dark.primary100,
                            }}
                            source={require("../../assets/animations/notfound.json")}
                        />

                        <Text style={{ color: "white", marginVertical: 20, fontSize: 15 }}>
                            You need to login to view your watchlist!
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleNavigate}>
                        <View style={styles.buyPlanButton}>
                            <Text style={styles.buyPlanText}>Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : watchLists.length > 0 ? (
                <FlatList
                    data={watchLists}
                    renderItem={renderWatchlist}
                    keyExtractor={(item) => item.content_id}
                />
            ) : (
                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <Text style={{ color: "white" }}>
                        Your Watchlist is empty, add a few to enjoy later!
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },

    topHeader: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },

    contentView: {
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    contentImage: {
        width: 140,
        height: 80,
        borderRadius: 10,
    },

    sheetText: {
        color: "black",
        fontSize: 16,
        fontWeight: "500",
    },

    seperator: {
        borderBottomWidth: 0.6,
        borderColor: "black",
        width: "100%",
        borderStyle: "dotted",
    },

    animationContainer: {
        backgroundColor: Colors.dark.primary100,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },

    buyPlanButton: {
        backgroundColor: Colors.dark.secondary,
        paddingVertical: 17,
        borderRadius: 10,
        marginVertical: 30,
    },

    buyPlanText: {
        color: "white",
        fontSize: 15,
        fontWeight: "400",
        textAlign: "center",
    },
});
