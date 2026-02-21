import SkeletonLoading from 'expo-skeleton-loading';
import React from "react";
import { Dimensions, View } from "react-native";

const { width, height } = Dimensions.get("window");

const NotificationsLoader = () => {
    return (
        <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>

            <View style={[styles.contentContainer, { background: "#3e3e3eff" }]}>
                <View style={[styles.contentProviderImage, { background: "#3e3e3eff" }]} />
                <View style={[styles.contentBox, { background: "#3e3e3eff" }]}>
                    <View
                        style={{
                            width: 100,
                            height: 20,
                            marginBottom: 5,
                            borderRadius: 5,
                            background: "#3e3e3eff"
                        }}
                    />
                    <View
                        style={{
                            width: 250,
                            height: 70,
                            marginBottom: 5,
                            borderRadius: 5,
                            background: "#3e3e3eff"
                        }}
                    />
                    <View
                        style={{
                            width: 280,
                            height: 180,
                            marginBottom: 5,
                            borderRadius: 10,
                            background: "#3e3e3eff"
                        }}
                    />
                    <View
                        style={{
                            width: 80,
                            height: 15,
                            marginBottom: 5,
                            borderRadius: 5,
                            marginTop: 10,
                            background: "#3e3e3eff"
                        }}
                    />
                </View>
            </View>
            <View style={[styles.contentSeperator, { borderColor: "#3e3e3eff" }]}></View>
        </SkeletonLoading>
    );
};

export default NotificationsLoader;

const styles = {
    contentContainer: {
        flexDirection: "row",
        gap: 15,
        marginLeft: 20,
        paddingBottom: 15,
        marginBottom: 10,
        width: width - 90,
    },

    contentProviderImage: {
        width: 60,
        height: 60,
        borderRadius: 100,
    },

    contentBox: {
        gap: 5,
    },
    contentSeperator: {
        borderWidth: 0.2,
        borderStyle: "dashed",
        borderColor: "gray",
        marginBottom: 20,
        marginHorizontal: 20,
    },
};
