import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../../constants/Colors";

const MiniScreenVideolayout = ({
    handleBackPress,
    isLoading,
    isBuffering,
    isVideoEnded,
    togglePlayPause,
    isPlaying,
    toggleSound,
    changeScreenOrientation,
    isMuted,
}) => {
    return (
        <LinearGradient
            colors={["rgba(13, 22, 35, 1)", "rgba(13, 22, 35, 0)"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.overlay}
        >
            <TouchableOpacity onPress={handleBackPress}>
                <View style={styles.backNavigation}>
                    <Ionicons name="arrow-back-outline" color={"white"} size={22} />
                    {/* <Text style={{ color: "white", fontSize: 17 }}>Back</Text> */}
                </View>
            </TouchableOpacity>
            {isLoading || isBuffering ? (
                <View style={styles.playButton}>
                    <ActivityIndicator size={"large"} color={Colors.dark.secondary} />
                </View>
            ) : isVideoEnded ? (
                <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                    <View>
                        <Ionicons name={"reload"} size={50} color={Colors.dark.secondary} />
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                    <View>
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={50}
                            color={Colors.dark.secondary}
                        />
                    </View>
                </TouchableOpacity>
            )}
            <View style={styles.videoControls}>
                <TouchableOpacity disabled>
                    <Text style={{ color: "transparent", fontSize: 14 }}>
                        Watch Trailer
                    </Text>
                </TouchableOpacity>
                <View style={styles.videoRightControls}>
                    <TouchableOpacity onPress={toggleSound}>
                        <Ionicons
                            name={isMuted ? "volume-mute-outline" : "volume-high-outline"}
                            size={25}
                            color={Colors.dark.secondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={changeScreenOrientation}>
                        <MaterialIcons
                            name="zoom-out-map"
                            size={20}
                            color={Colors.dark.secondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default MiniScreenVideolayout;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "column",
        justifyContent: "space-between",
    },

    backNavigation: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginTop: 10,
    },

    playButton: {
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        height: 60,
        alignSelf: "center",
    },

    videoControls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },

    videoRightControls: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
    },
});
