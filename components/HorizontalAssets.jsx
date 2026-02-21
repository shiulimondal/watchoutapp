import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import SkeletonLoading from 'expo-skeleton-loading';
import React from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { msToTime } from "../util/Util";

const { width, height } = Dimensions.get("window");

const HorizontalAssets = ({ item, loading, type }) => {
    const router = useRouter();

    const navigateToContent = (type) => {
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
    return (
        <>
            {loading ? (
                <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                    <View style={[styles.container, { backgroundColor: "#3e3e3eff", }]}>
                        <View style={[styles.assetView, { backgroundColor: "#3e3e3eff", }]} />
                    </View>
                </SkeletonLoading>
            ) : (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigateToContent(item?.content_type)}
                >
                    <View
                        style={[
                            styles.container,
                            {
                                aspectRatio: type === "popular" ? 0.8 : 16 / 9,
                                width:
                                    type === "popular" ? (width * 34) / 100 : (width * 70) / 100,
                            },
                        ]}
                    >
                        <ImageBackground
                            source={
                                item?.feature_image ? { uri: item?.feature_image } : item?.image
                            }
                            style={styles.imageBackground}
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
                            <View style={[styles.assetView, { paddingHorizontal: type === "popular" ? 8 : 15, }]}>
                                <View>
                                    <Text style={styles.assetText}>{item.title.length > 10 ? item.title.slice(0, 8) + "..." : item.title}</Text>
                                    <Text style={{ color: "white", fontSize: 10 }}>
                                        {item?.duration
                                            ? msToTime(parseInt(item?.duration))
                                            : "Watch Season 1"}
                                    </Text>
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
        </>
    );
};

export default HorizontalAssets;

const styles = StyleSheet.create({
    container: {
        marginLeft: 14,
        width: (width * 70) / 100,
        aspectRatio: 16 / 9,
        borderRadius: 10,
        overflow: "hidden",
    },

    imageBackground: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        overflow: "hidden",
    },

    assetView: {
        position: "absolute",
        bottom: 0,
        padding: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    assetText: { color: "white", fontSize: 15, fontWeight: "bold" },
});
