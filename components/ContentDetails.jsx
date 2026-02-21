import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Share,
    ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import moment from "moment";
import { msToTime } from "../util/Util";
import { addToWatchList } from "../redux/features/AddToWatchListSlice";
import { useDispatch, useSelector } from "react-redux";
import { reactContent } from "../redux/features/ReactToContentSlice";
import { stopGlobalVideo } from "../redux/features/VideoProgressSlice";
import Toast from 'react-native-simple-toast';

const ContentDetails = ({
    contentDetails,
    userData,
    isWatchListed,
    isContentLiked,
    setVideoUrl,
    setContentType,
    setPlayingFullScreen,
    setIsPlaying,
    handleShare,
}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { add_data, add_loading } = useSelector((state) => state.watchlistAdd);
    const { react_data, react_loading } = useSelector((state) => state.react);
    const [isContentWatchListed, setIsContentWatchListed] = useState(
        isWatchListed == 1 && true
    );
    const [isLiked, setIsLiked] = useState(isContentLiked == 1 && true);
    const [isWatchListPressed, setIsWatchListPressed] = useState(false);
    const [isReactionPressed, setIsReactionPressed] = useState(false);
    const [isOriginalPlaying, setisOriginalPlaying] = useState(false);

    useEffect(() => {
        if (add_data && add_data?.status && isWatchListPressed) {
            setIsContentWatchListed((prev) => !prev);
            const message = isContentWatchListed
                ? `${contentDetails?.title} Removed from watchlist`
                : `${contentDetails?.title} Added to watchlist`;
            // ToastAndroid.show(message, ToastAndroid.SHORT);
            Toast.show(message, Toast.LONG);
            setIsWatchListPressed(false);
        }
    }, [add_data]);

    useEffect(() => {
        if (react_data && react_data?.status && isReactionPressed) {
            setIsLiked((prev) => !prev);
            setIsReactionPressed(false);
        }
    }, [react_data]);

    const handleVideoPlay = () => {
        if (!isOriginalPlaying) {
            setVideoUrl(contentDetails?.video_url);
            setContentType("video");
            setPlayingFullScreen(true);
            setisOriginalPlaying(true);
        } else {
            setVideoUrl(contentDetails?.trailer_url);
            setisOriginalPlaying(false);
            setContentType("trailer");
        }
    };

    const handleWatchlist = () => {
        if (userData) {
            const payload = {
                data: {
                    user_id: userData?.data?.user_id,
                    content_id: contentDetails.content_id,
                    value: isContentWatchListed ? "0" : "1",
                },
                token: userData?.token,
            };

            dispatch(addToWatchList(payload));
            setIsWatchListPressed(true);
        } else {
            router.push("/Login");
        }
    };

    const handleReaction = () => {
        if (userData) {
            const payload = {
                data: {
                    user_id: userData?.data?.user_id,
                    content_id: contentDetails.content_id,
                    value: isLiked ? "0" : "1",
                },
                token: userData?.token,
            };

            dispatch(reactContent(payload));
            setIsReactionPressed(true);
        } else {
            router.push("/Login");
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.descContainer}>
                <Text style={styles.titleText}>{contentDetails?.title}</Text>
                <View style={styles.typeContainer}>
                    <View style={styles.ageContainer}>
                        <Text style={styles.ageText}>
                            {contentDetails?.age_group > 18
                                ? "A 18+"
                                : contentDetails?.age_group < 18
                                    ? "U 18-"
                                    : "U/A 18"}
                        </Text>
                    </View>
                    <Text style={{ color: Colors.dark.secondary, fontSize: 17 }}>•</Text>
                    <Text style={{ color: "white", fontSize: 11 }}>
                        {moment(contentDetails?.release_date).format("yyyy")}
                    </Text>

                    {/* <Text style={{ color: Colors.dark.secondary, fontSize: 17 }}>•</Text>
                    <View
                        style={[
                            styles.ageContainer,
                            {
                                backgroundColor: "transparent",
                                borderWidth: 1,
                                borderColor: Colors.dark.secondary,
                            },
                        ]}
                    >
                        <Text style={styles.ageText}>{contentDetails?.genre[0]}</Text>
                    </View> */}

                    {contentDetails?.duration && (
                        <Text style={{ color: Colors.dark.secondary, fontSize: 17 }}>
                            •
                        </Text>
                    )}
                    <Text style={{ color: "white", fontSize: 11 }}>
                        {contentDetails?.duration &&
                            msToTime(parseInt(contentDetails?.duration))}
                    </Text>
                    {contentDetails?.episodes && (
                        <Text style={{ color: "white", fontSize: 12 }}>{"Episodes"}</Text>
                    )}
                    {/* <Text style={{ color: Colors.dark.secondary, fontSize: 20 }}>•</Text> */}
                    {/* <Text style={{ color: "white", fontSize: 12 }}>Rating</Text>
          <View
            style={[
              styles.ageContainer,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: Colors.dark.secondary,
              },
            ]}
          >
            <Text style={styles.ageText}>{contentDetails?.rating}</Text>
          </View> */}
                </View>
            </View>

            <View
                style={{
                    width: "100%",
                    flexDirection: "row",
                    marginHorizontal: 10,
                    gap: 15,
                }}
            >

                {userData ? (
                    contentDetails?.plan_status ? (
                        contentDetails?.video_url ? (
                            <TouchableOpacity style={{ width: "94%" }} onPress={handleVideoPlay}>
                                <View style={styles.button}>
                                    <Ionicons name="play" color="white" size={20} />
                                    <Text style={{ color: "white", fontSize: 17 }}>
                                        Play{" "}
                                        {!isOriginalPlaying
                                            ? contentDetails?.content_type === "webseries" || contentDetails?.content_type === "comedy"
                                                ? "Show"
                                                : "Movie"
                                            : "Trailer"}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    ) : (
                        <TouchableOpacity
                            style={{ width: "94%" }}
                            onPress={() => {
                                dispatch(stopGlobalVideo());
                                router.push("SubscriptionPlans");
                                // setTimeout(() => {
                                //     if (!my_plan_data) {
                                //         router.push("SubscriptionPlans");
                                //     } else if (my_plan_data?.plan_status === "active") {
                                //         router.push("MyPlan");
                                //     } else {
                                //         router.push("SubscriptionPlans");
                                //     }
                                // }, 100);
                            }}
                        >
                            <View style={styles.button}>
                                <Ionicons name="person" color="white" size={20} />
                                <Text style={{ color: "white", fontSize: 15 }}>Subscribe</Text>
                            </View>
                        </TouchableOpacity>

                    )
                ) : (
                    <TouchableOpacity
                        style={{ width: "94%" }}
                        // onPress={() => router.push("Login")}
                        onPress={() => {
                            dispatch(stopGlobalVideo());
                            setTimeout(() => router.push("Login"), 100)
                        }}
                    >
                        <View style={styles.button}>
                            <Ionicons name="person" color="white" size={20} />
                            <Text style={{ color: "white", fontSize: 15 }}>Login</Text>
                        </View>
                    </TouchableOpacity>
                )}


            </View>


            {!userData && (
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 20,
                        alignSelf: "center",
                        gap: 2,
                    }}
                >
                    <Ionicons
                        name="information-circle-outline"
                        color={"white"}
                        size={18}
                    />
                    <Text style={{ color: "white", textAlign: "center", fontSize: 11 }}>
                        You need to login and subscribe to a plan first to play this
                        content.
                    </Text>
                </View>
            )}

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginVertical: 30,
                    gap: 10,
                }}
            >
                <TouchableOpacity onPress={handleWatchlist}>
                    <View style={{ alignItems: "center", gap: 8 }}>
                        {add_loading ? (
                            <ActivityIndicator color={"white"} size={"small"} />
                        ) : (
                            <Ionicons
                                name={isContentWatchListed ? "remove-outline" : "add-outline"}
                                color={"white"}
                                size={30}
                            />
                        )}
                        <Text style={styles.socialText}>
                            {isContentWatchListed ? "Remove" : "Watchlist"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReaction}>
                    <View style={{ alignItems: "center", gap: 8 }}>
                        {react_loading ? (
                            <ActivityIndicator
                                color={"white"}
                                size={"small"}
                                style={{ marginBottom: 10 }}
                            />
                        ) : (
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                color={isLiked ? "red" : Colors.dark.secondary}
                                size={30}
                            />
                        )}
                        <Text style={styles.socialText}>
                            {isLiked ? "Dislike" : "Like"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleShare(contentDetails.content_id)}
                >
                    <View style={{ alignItems: "center", gap: 8 }}>
                        <Ionicons name="arrow-redo-outline" color={"white"} size={30} />
                        <Text style={styles.socialText}>Share</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 12, marginHorizontal: 15, gap: 10 }}>
                <View>
                    <Text style={styles.detailsText}>Synopsis</Text>
                </View>
                <Text style={{ color: "white", lineHeight: 17, fontSize: 12 }}>
                    {contentDetails?.long_description}
                </Text>
            </View>
        </View>
    );
};

export default ContentDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },
    descContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },

    titleText: {
        color: Colors.dark.secondary,
        fontSize: 30,
        fontWeight: "bold",
    },

    typeContainer: {
        flexDirection: "row",
        marginVertical: 10,
        gap: 7,
        alignItems: "center",
    },

    ageContainer: {
        backgroundColor: "#2D2E32",
        paddingVertical: 2,
        paddingHorizontal: 7,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },

    ageText: {
        color: "white",
        fontSize: 11,
    },

    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.dark.secondary,
        // width: "45%",
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: "center",
        gap: 5,
    },

    socialText: {
        color: "white",
        fontSize: 12,
    },

    detailsText: {
        fontSize: 17,
        fontWeight: "bold",
        color: "white",
    },
});
