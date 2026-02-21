import SkeletonLoading from 'expo-skeleton-loading';
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
const { width, height } = Dimensions.get("window");

const ContentLoader = () => {
    return (
        <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
            <View
                style={{
                    marginBottom: 20,
                    width: width * 0.6,
                    height: 35,
                    borderRadius: 10,
                    background: "#3e3e3eff"
                }}
            />

            <View
                style={{
                    marginBottom: 10,
                    width: width * 0.9,
                    height: 20,
                    borderRadius: 10,
                    background: "#3e3e3eff"
                }}
            />

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    marginVertical: 15,
                    background: "#3e3e3eff"
                }}
            >
                <View
                    style={{
                        marginBottom: 10,
                        width: "46%",
                        height: 50,
                        borderRadius: 10,
                        background: "#3e3e3eff"
                    }}
                />
                <View
                    style={{
                        marginBottom: 10,
                        width: "46%",
                        height: 50,
                        borderRadius: 10,
                        background: "#3e3e3eff"
                    }}
                />
            </View>
            <View
                style={{
                    marginBottom: 10,
                    width: width * 0.9,
                    height: 20,
                    borderRadius: 10,
                    background: "#3e3e3eff"
                }}
            />
            <View
                style={{
                    marginBottom: 10,
                    width: width * 0.9,
                    height: 20,
                    borderRadius: 10,
                    background: "#3e3e3eff"
                }}
            />
            <View
                style={{
                    marginBottom: 10,
                    width: width * 0.7,
                    height: 20,
                    borderRadius: 10,
                    background: "#3e3e3eff"
                }}
            />
            <View style={{ marginVertical: 20, background: "#3e3e3eff" }}>
                <View
                    style={{
                        marginBottom: 20,
                        width: width * 0.4,
                        height: 25,
                        borderRadius: 10,
                        background: "#3e3e3eff"
                    }}
                />
                <View style={{ flexDirection: "row", gap: 20, background: "#3e3e3eff" }}>
                    <View style={[styles.loaderContainer, { background: "#3e3e3eff" }]}>
                        <View style={[styles.assetView, { background: "#3e3e3eff" }]}></View>
                    </View>
                    <View style={[styles.loaderContainer, { background: "#3e3e3eff" }]}>
                        <View style={[styles.assetView, { background: "#3e3e3eff" }]}></View>
                    </View>
                </View>
            </View>
        </SkeletonLoading>
    );
};

export default ContentLoader;

const styles = StyleSheet.create({
    loaderContainer: {
        width: (width * 33) / 100,
        aspectRatio: 0.8,
        borderRadius: 10,
        overflow: "hidden",
    },

    assetView: {
        paddingHorizontal: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
});
