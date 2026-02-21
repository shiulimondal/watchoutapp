import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Dimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Animated,
    ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Banner from "../../../components/Banner";
import Header from "../../../components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import Colors from "../../../constants/Colors";
import SkeletonLoading from 'expo-skeleton-loading';
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "../../../redux/features/home/BannersSlice";
import { getPopularShows } from "../../../redux/features/home/PopularShowsSlice";
import { getJustAddedShows } from "../../../redux/features/home/JustAddedShowsSlice";
import "react-native-get-random-values";
import { readData, writeData } from "../../../util/Util";
import * as Device from "expo-device";
import { checkIfDeviceIsActive } from "../../../redux/features/CheckDeviceActiveSlice";
import { logout } from "../../../redux/features/auth/LoginSlice";
import DeviceInfo from "react-native-device-info";
import { getMyPlanDetails } from "../../../redux/features/details/MyPlanDetailsSlice";
import * as ScreenOrientation from "expo-screen-orientation";
import HeadingLoader from "../../../components/HeadingLoader";
import HorizontalAssets from "../../../components/HorizontalAssets";

const { width, height } = Dimensions.get("window");
const index = () => {
    const navigation = useNavigation();
    const { userData } = useSelector((state) => state.login);
    const { data } = useSelector((state) => state.account);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);

    const userDataToUse = userData ? userData : data ? data : forMobileData;

    const dispatch = useDispatch();
    const router = useRouter();
    const { banner_data, banner_loading } = useSelector((state) => state.banner);
    const { popular_data, popular_loading } = useSelector(
        (state) => state.popular
    );
    const { just_added_data, just_added_loading } = useSelector(
        (state) => state.justAdded
    );
    const { check_data, check_loading } = useSelector(
        (state) => state.checkActive
    );

    const { my_plan_data, my_plan_loading } = useSelector(
        (state) => state.myPlan
    );

    const [banner, setBanner] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [justAdded, setJustAdded] = useState([]);
    const [filteredJustAdded, setFilteredJustAdded] = useState([]);
    const [popular, setPopular] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [viewableItems, setViewableItems] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollY = new Animated.Value(0);
    useEffect(() => {
        setActiveIndex(0);
    }, [filterType]);

    useFocusEffect(
        React.useCallback(() => {
            const lockOrientation = async () => {
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
            };

            lockOrientation();

            return () => { };
        }, [])
    );


    // Callback to handle viewable items when scrolling
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        setViewableItems(viewableItems); // Set the visible items
    }, []);

    // Viewability configuration
    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50, // Define when an item is considered "visible"
    };

    useEffect(() => {
        if (check_data && !check_data?.status && isLoggedOut) {
            dispatch(logout());
            writeData("user_data", null);
            setIsLoggedOut(false);
        }
    }, [check_data]);

    const fetchOrCreateDeviceId = async () => {
        const deviceName = Device.modelName;
        const deviceManufacturer = Device.manufacturer;
        const deviceType = Device.osName;

        const id = await DeviceInfo.getAndroidId();


        let payload = {
            data: {
                user_id: userDataToUse?.data?.user_id,
                device_unique_id: id,
            },
            token: userDataToUse?.token,
        };

        dispatch(checkIfDeviceIsActive(payload));
        setIsLoggedOut(true);

        writeData("device_id", id);
        writeData("device_manufacturer", deviceManufacturer);
        writeData("device_name", deviceName);
        writeData("device_type", deviceType);
    };

    useEffect(() => {
        if (userDataToUse?.plan_status) {
            fetchOrCreateDeviceId();
        }
    }, []);

    useEffect(() => {
        if (banner_data?.length > 0) {
            setBanner(banner_data);
            setFilteredBanners(banner_data);
        }
    }, [banner_data]);

    useEffect(() => {
        if (popular_data?.length > 0) {
            setPopular(popular_data);
        }
    }, [popular_data]);

    useEffect(() => {
        if (just_added_data?.length > 0) {
            setJustAdded(just_added_data);
            setFilteredJustAdded(just_added_data);
        }
    }, [just_added_data]);

    const calculatePlanRemaining = (date) => {
        if (!date) return null;
        const target = new Date(date);
        const today = new Date();
        const targetDateOnly = new Date(
            target.getFullYear(),
            target.getMonth(),
            target.getDate()
        );
        const todayDateOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const msInDay = 1000 * 60 * 60 * 24;
        return Math.round((targetDateOnly - todayDateOnly) / msInDay);
    };

    const daysRemaining = calculatePlanRemaining(my_plan_data?.expiration_date);



    useEffect(() => {
        setLoading(true);
        let payload = {
            data: {
                type: "unauthorized",
            },
        };

        let authPayload = {
            data: {
                user_id: userDataToUse?.data?.user_id,
                type: "authorized",
            },
            token: userDataToUse?.token,
        };

        let planPayload = {
            user_id: userDataToUse?.data?.user_id,
            token: userDataToUse?.token,
        };

        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(getBanners(userDataToUse ? authPayload : payload)).finally(
                () => {
                    setLoading(false);
                }
            );
            dispatch(getPopularShows());
            dispatch(getJustAddedShows());
            dispatch(getMyPlanDetails(planPayload));
        });

        return unsubscribe;
    }, [navigation, dispatch]);

    useEffect(() => {
        if (filterType !== "all") {
            const newBanners = banner.filter(
                (item) => item.content_type === filterType
            );
            const newJustAdded = justAdded.filter(
                (item) => item.content_type === filterType
            );
            setFilteredBanners(newBanners);
            setFilteredJustAdded(newJustAdded);
        } else {
            setFilteredBanners(banner);
            setFilteredJustAdded(justAdded);
        }
    }, [filterType, banner, justAdded]);

    const renderJustAdded = ({ item }) => (
        <HorizontalAssets item={item} loading={loading} />
    );
    const renderPopular = ({ item }, type) => (
        <HorizontalAssets item={item} loading={loading} type={type} />
    );

    const renderBanner = ({ item }) => {
        const isVisible = viewableItems.some(
            (viewableItem) => viewableItem.key === item.content_id
        );
        return <Banner item={item} loading={banner_loading} isVisible={isVisible} />;
    };

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setActiveIndex((prevIndex) => (prevIndex + 1) % filteredBanners.length);
    //     }, 4000);

    //     return () => clearInterval(interval); // Cleanup on unmount
    // }, [filteredBanners.length]);

    const flatListRef = React.useRef(null);


    useEffect(() => {
        if (filteredBanners.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % filteredBanners.length);
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [filteredBanners.length]);



    // Scroll effect based on activeIndex
    useEffect(() => {
        if (flatListRef.current && filteredBanners.length > 0) {
            flatListRef.current.scrollToIndex({
                animated: true,
                index: activeIndex,
            });
        }
    }, [activeIndex, filteredBanners.length]);
    return (
        <View style={styles.Container}>
            <Header
                scrollY={scrollY}
                filterType={filterType}
                setCurrentFilterType={(data) => setFilterType(data)}
            />
            <ScrollView
                style={[styles.Scrollcontainer, { backgroundColor: Colors.dark.primary100 }]}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <StatusBar style="auto" />
                {loading ? (
                    <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                        <View
                            style={{
                                width: width,
                                height: height * 0.65,
                                backgroundColor: "#3e3e3eff",
                            }}
                        />
                    </SkeletonLoading>

                ) : filteredBanners?.length > 0 ? (
                    <>
                        <FlatList
                            ref={flatListRef}
                            horizontal
                            pagingEnabled
                            scrollEnabled={true}
                            data={filteredBanners}
                            renderItem={renderBanner}
                            keyExtractor={(item) => item.content_id}
                            initialNumToRender={5}
                            maxToRenderPerBatch={3}
                            windowSize={5}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            getItemLayout={(data, index) => ({
                                length: width,
                                offset: width * index,
                                index,
                            })}
                        />
                        <View style={styles.dotContainer}>
                            {filteredBanners.map((_, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setActiveIndex(index)}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            styles.dot,
                                            {
                                                backgroundColor: activeIndex === index ? 'white' : 'gray',
                                            },
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                    </>
                ) : (
                    <View
                        style={{
                            backgroundColor: Colors.dark.primary100,
                            height: height * 0.65,
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 20 }}>Coming soon!</Text>

                    </View>
                )}
                <View>
                    {loading ? (
                        <HeadingLoader />
                    ) : (
                        <View style={styles.showsView}>
                            <Text
                                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                            >
                                Just Added
                            </Text>

                        </View>
                    )}

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={filteredJustAdded}
                        renderItem={renderJustAdded}
                        keyExtractor={(item) => item.content_id}
                    />
                </View>

                {filterType !== "movie" && (
                    <View>
                        {loading ? (
                            <HeadingLoader />
                        ) : (
                            <View style={styles.showsView}>
                                <Text
                                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                                >
                                    Popular Shows
                                </Text>

                            </View>
                        )}

                        <View style={{ marginBottom: 25 }}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={popular}
                                renderItem={(item) => renderPopular(item, "popular")}
                                keyExtractor={(item) => item.content_id}
                            />
                        </View>
                    </View>
                )}

                <View style={{ marginTop: filterType === "movie" && 15 }}>
                    {loading ? (
                        <HeadingLoader styles={{ marginTop: 10 }} />
                    ) : (
                        <View style={[styles.showsView, { marginTop: 10 }]}>
                            <Text
                                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                            >
                                Trending Shows
                            </Text>

                        </View>
                    )}

                    <View style={{ marginBottom: 25 }}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={justAdded}
                            renderItem={renderJustAdded}
                            keyExtractor={(item) => item.content_id}
                        />
                    </View>
                </View>

            </ScrollView>



            {
                !isDismissed &&
                my_plan_data?.expiration_date &&
                calculatePlanRemaining(my_plan_data?.expiration_date) < 3 && (
                    <TouchableOpacity
                        onPress={() => setTimeout(() => router.push("SubscriptionPlans"), 100)}
                        style={styles.subscriptionContainer}>
                        <Text style={{ color: "white", fontWeight: "700" }}>
                            Subscription{" "}
                            {daysRemaining > 0
                                ? `Expires in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`
                                : daysRemaining === 0
                                    ? "Expires today"
                                    : `Expired ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) > 1 ? "s" : ""
                                    } ago`}
                        </Text>

                        <TouchableOpacity onPress={() => setIsDismissed(true)}>
                            <Ionicons name="close-outline" size={25} color={"white"} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    Scrollcontainer: {
        flexGrow: 1,
        backgroundColor: Colors.dark.primary100,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 5,
        margin: 5,
    },
    image: {
        width: width,
        height: height * 0.65,
        justifyContent: "flex-end",
    },
    linearGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "80%",
    },
    textContainer: {
        position: "absolute",
        bottom: 10,
        left: 10,
        alignItems: "center",
        width: width - 30,
        marginBottom: 70,
    },
    text: {
        fontSize: 35,
        fontWeight: "500",
        color: "white",
    },
    bannerButtons: {
        flexDirection: "row",
        width: "45%",
        justifyContent: "center",
        gap: 5,
        marginVertical: 10,
    },
    showsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
        marginVertical: 12,
        marginTop: 30,
    },

    subscriptionContainer: {
        backgroundColor: Colors.dark.buttonColor,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});