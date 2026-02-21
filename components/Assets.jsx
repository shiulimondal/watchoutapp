import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import SkeletonLoading from 'expo-skeleton-loading';
import React from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { msToTime } from "../util/Util";

const { width, height } = Dimensions.get("window");

const Assets = ({ item, isSearch, loading, setContent }) => {

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
                    <View style={[styles.container, { background: "#3e3e3eff" }]}>
                        <View style={[styles.assetView, { background: "#3e3e3eff" }]}></View>
                    </View>
                </SkeletonLoading>
            ) : (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setContent(item?.content_id)}
                >
                    <View style={styles.container}>
                        <ImageBackground
                            source={
                                item?.feature_image ? { uri: item?.feature_image } : item?.image
                            }
                            style={styles.imageBackground}
                        >
                            {!isSearch && (
                                <>
                                    <LinearGradient
                                        colors={["rgba(13, 22, 35, 1)", "rgba(13, 22, 35, 0)"]}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 0, y: 0 }}
                                        style={{
                                            ...StyleSheet.absoluteFillObject,
                                            borderRadius: 10,
                                        }}
                                    />
                                    <View style={styles.assetView}>
                                        <View>
                                            <Text style={styles.assetText}>{item?.title}</Text>
                                            <Text style={{ color: "white", fontSize: 10 }}>
                                                {item?.duration
                                                    ? msToTime(parseInt(item?.duration))
                                                    : "Watch Season 1"}
                                            </Text>
                                        </View>
                                    </View>
                                </>
                            )}
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            )}
        </>
    );
};

export default Assets;

const styles = StyleSheet.create({
    container: {
        marginLeft: 14,
        width: (width * 33) / 100,
        aspectRatio: 0.8,
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
        paddingHorizontal: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    assetText: { color: "white", fontSize: 15, fontWeight: "bold" },
});
