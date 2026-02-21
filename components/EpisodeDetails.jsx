import React from "react";
import {
    Dimensions,
    FlatList,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { msToTime } from "../util/Util";
import SkeletonLoading from 'expo-skeleton-loading';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { stopGlobalVideo } from "../redux/features/VideoProgressSlice";
import { setCurrentEpisode } from "../redux/features/details/EpisodeDetailsSlice";

// const EpisodeDetails = ({ item, index, loading, setVideoUrl, setContentType, EpisodeDetails }) => {
const EpisodeDetails = ({ item, index, loading, setVideoUrl, setContentType, setepisodesId }) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.login);
    const { my_plan_data, my_plan_loading } = useSelector(
        (state) => state.myPlan
    );


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

    return (
        <View index={index}>
            {loading ? (
                <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                    <View
                        style={{
                            marginBottom: 20,
                            width: width * 0.72,
                            height: 180,
                            borderRadius: 10,
                            marginRight: 20,
                            background: "#3e3e3eff"
                        }}
                    />
                </SkeletonLoading>
            ) : (
                <TouchableOpacity
                    onPress={() => {
                        setTimeout(() => {
                            dispatch(stopGlobalVideo());
                            if (!userData) {
                                dispatch(stopGlobalVideo());
                                router.push("Login");
                                return;
                            }
                            if (!my_plan_data || daysRemaining <= 0) {
                                dispatch(stopGlobalVideo());
                                router.push("SubscriptionPlans");
                                return;
                            }
                            if (my_plan_data && daysRemaining > 0) {
                                dispatch(stopGlobalVideo());
                                setVideoUrl(item?.video_url);
                                setContentType("video");
                                setepisodesId(index)
                            }

                        }, 100);
                    }}
                // onPress={() => setVideoUrl(item?.video_url)}
                >
                    <View
                        style={{
                            marginRight: 20,
                            width: (width * 70) / 100,
                            aspectRatio: 1.5,
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                    >
                        <ImageBackground
                            source={{ uri: item?.feature_image }}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                                overflow: "hidden",
                            }}
                        >
                            <LinearGradient
                                colors={["rgba(13, 22, 35, 1)", "rgba(13, 22, 35, 0)"]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 0, y: 0 }}
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    borderRadius: 10,
                                }}
                            />
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    padding: 10,
                                    paddingHorizontal: 10,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                }}>
                                <View>
                                    <Text
                                        style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
                                    >
                                        Episode {item?.episode_number}{" "}
                                        <Text style={{ fontSize: 10, fontWeight: "400" }}>
                                            ({msToTime(parseInt(item?.duration))})
                                        </Text>
                                    </Text>
                                    <View style={{ width: "95%" }}>
                                        <Text style={{ color: "white", fontSize: 12 }}>
                                            {item?.description}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity>
                                    <View>
                                        <Ionicons
                                            name="play-circle-outline"
                                            size={30}
                                            color={"white"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default EpisodeDetails;

const styles = StyleSheet.create({});
