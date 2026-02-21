import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
    ImageBackground,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    Animated,
} from "react-native";
import Colors from "../constants/Colors";
const { width, height } = Dimensions.get("window");
import { useRouter } from "expo-router";
import moment from "moment";
import { msToTime } from "../util/Util";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchList } from "../redux/features/AddToWatchListSlice";
// import SkeletonLoading from 'expo-skeleton-loading';
import { useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-simple-toast';

const Banner = React.memo(({ item, loading, isVisible }) => {
    const dispatch = useDispatch();
    const { userData, user_loading } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const { add_data, add_loading } = useSelector((state) => state.watchlistAdd);
    const router = useRouter();
    const [isWatchListed, setIsWatchListed] = useState(item?.watch_list === "1");

    const [isWatchListPressed, setIsWatchListPressed] = useState(false);

    useEffect(() => {
        setIsWatchListed(item?.watch_list === "1");
    }, [item?.watch_list]);

    const scaleValue = useRef(new Animated.Value(1)).current; // Initialize animated value for scale

    // Trigger zoom-in animation when item is visible
    useFocusEffect(
        React.useCallback(() => {
            if (isVisible) {
                // Animate from scale 1 (full size) to scale 1.5 (oversized)
                Animated.timing(scaleValue, {
                    toValue: 1.3, // Final scale value (oversized)
                    duration: 7000,
                    useNativeDriver: true,
                }).start();
            } else {
                // Reset to scale 1 when the item is not visible
                Animated.timing(scaleValue, {
                    toValue: 1, // Go back to original size (scale = 1)
                    duration: 500, // Duration for smooth transition
                    useNativeDriver: true,
                }).start();
            }
        }, [isVisible, scaleValue]) // Trigger effect when screen is focused
    );


    // // Trigger zoom-in animation when item is visible
    // useEffect(() => {
    //   if (isVisible) {
    //     // Animate from scale 1 (full size) to scale 1.5 (oversized)
    //     Animated.timing(scaleValue, {
    //       toValue: 1.3, // Final scale value (oversized)
    //       duration: 7000, 
    //       useNativeDriver: true,
    //     }).start();
    //   } else {
    //     // Reset to scale 1 when the item is not visible
    //     Animated.timing(scaleValue, {
    //       toValue: 1, // Go back to original size (scale = 1)
    //       duration: 500, // Duration for smooth transition
    //       useNativeDriver: true,
    //     }).start();
    //   }
    // }, [isVisible, scaleValue]);

    useEffect(() => {
        if (add_data && add_data?.status && isWatchListPressed) {
            setIsWatchListed((prev) => !prev);
            const message = isWatchListed
                ? `${item?.title} Removed from watchlist`
                : `${item?.title} Added to watchlist`;
            // ToastAndroid.show(message, ToastAndroid.SHORT);
            Toast.show(message, Toast.LONG);
            setIsWatchListed(!isWatchListed);
            setIsWatchListPressed(false);
        }
    }, [add_data]);

    const handleNavigate = (type) => {
        if (type === "movie") {
            router.push({
                pathname: "/home/MovieDetails",
                params: {
                    content_id: item?.content_id,
                },
            });
        } else if (type === "webseries" || type === "comedy") {
            router.push({
                pathname: "/home/SeriesDetails",
                params: {
                    content_id: item?.content_id,
                },
            });
        }
    };

    const handleWatchLater = () => {
        if (userData) {
            let payload = {
                data: {
                    user_id: userData?.data?.user_id,
                    content_id: item.content_id,
                    value: isWatchListed ? "0" : "1",
                },
                token: userData?.token,
            };

            dispatch(addToWatchList(payload));
            setIsWatchListPressed(true);
        } else if (signupData) {
            let payload = {
                data: {
                    user_id: signupData?.data?.user_id,
                    content_id: item.content_id,
                    value: isWatchListed ? "0" : "1",
                },
                token: signupData?.token,
            };

            dispatch(addToWatchList(payload));
            setIsWatchListPressed(true);
        } else if (forMobileData) {
            let payload = {
                data: {
                    user_id: forMobileData?.data?.user_id,
                    content_id: item.content_id,
                    value: isWatchListed ? "0" : "1",
                },
                token: forMobileData?.token,
            };

            dispatch(addToWatchList(payload));
            setIsWatchListPressed(true);
        } else {
            router.push("/Login");
        }
    };

    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleNavigate(item.content_type)}
            >
                <Animated.View
                    style={[styles.image, { transform: [{ scale: scaleValue }] }]} // Applying animated scale to the item
                >
                    <ImageBackground
                        source={{ uri: item?.feature_image }}
                        resizeMode="cover"
                        style={styles.image}
                    >
                        <LinearGradient
                            colors={[Colors.dark.primary100, "rgba(13, 22, 35, 0)"]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.linearGradient}
                        />

                    </ImageBackground>
                </Animated.View>

            </TouchableOpacity>

            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    {item?.title}
                    <Text style={{ fontSize: 18, fontWeight: "300" }}>
                        {" "}
                        ({moment(item?.release_date).format("yyyy")})
                    </Text>
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: "300",
                        color: "white",
                        marginTop: 5,
                    }}
                >
                    {item?.content_type === "movie"
                        ? msToTime(parseInt(item?.duration))
                        : "Watch Season 1 now"}{" "}
                    •{" "}
                    {item?.content_type.charAt(0).toUpperCase() +
                        item?.content_type.slice(1)}
                </Text>
            </View>
            <View style={{ width: "100%", position: "absolute", bottom: 6 }}>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        marginHorizontal: 15,
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity style={{ width: "45%" }} onPress={handleWatchLater}>
                        <View style={styles.bannerButtons}>
                            {add_loading ? (
                                <ActivityIndicator color={"white"} size={"small"} />
                            ) : (
                                <Ionicons
                                    name={
                                        isWatchListed
                                            ? "remove-circle-outline"
                                            : "add-circle-outline"
                                    }
                                    size={20}
                                    color={"white"}
                                />
                            )}
                            {/* {loading ? (
           <SkeletonLoader>
             <SkeletonLoader.Item
               style={{ width: 90, height: 20, borderRadius: 5 }}
             />
           </SkeletonLoader>
         ) : (
           <Text
             style={{ fontSize: 17, fontWeight: "300", color: "white" }}
           >
             {isWatchListed ? "Watchlisted" : "Watch Later"}
           </Text>
         )} */}
                            <Text style={{ fontSize: 17, fontWeight: "300", color: "white" }}>
                                {isWatchListed ? "Watchlisted" : "Watch Later"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: "45%" }}
                        onPress={() => handleNavigate(item.content_type)}
                    >
                        <View
                            style={[
                                styles.bannerButtons,
                                {
                                    backgroundColor: Colors.dark.secondary,
                                    paddingVertical: 12,
                                    borderRadius: 10,
                                },
                            ]}
                        >
                            <Ionicons name="play-circle-outline" size={20} color={"white"} />
                            <Text style={{ fontSize: 17, fontWeight: "300", color: "white" }}>
                                Watch Now !
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


        </>
    );
});

export default Banner;

const styles = StyleSheet.create({
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
        fontSize: 27,
        fontWeight: "500",
        color: "white",
    },

    bannerButtons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        marginVertical: 10,
    },
});
