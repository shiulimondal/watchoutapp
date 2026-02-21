import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useStatem, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Easing,
    ActivityIndicator,
    BackHandler,
} from "react-native";
import Colors from "../../constants/Colors";
import * as Brightness from "expo-brightness";
import * as NavigationBar from "expo-navigation-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { router } from "expo-router";
import DeviceBrightness from "@adrianso/react-native-device-brightness";

const FullScreenVideoLayout = ({
    status,
    videoRef,
    handleBackPress,
    isLoading,
    isVideoEnded,
    togglePlayPause,
    isPlaying,
    toggleSound,
    changeScreenOrientation,
    handleSliderChange,
    handleSliderRelease,
    isMuted,
    progress,
    setIsPlaying,
    brightness,
    volume,
    setVolume,
    setBrightness,
    changeScreenOrientationToPortrait,
}) => {
    useEffect(() => {
        const backAction = () => {
            changeScreenOrientationToPortrait();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        // Hide the bottom navigation bar
        const hideNavigationBar = async () => {
            await NavigationBar.setVisibilityAsync("hidden");
        };

        hideNavigationBar();

        // Cleanup: Reset visibility on unmount
        return () => {
            NavigationBar.setVisibilityAsync("visible");
        };
    }, []);

    const leftPosition = useRef(new Animated.Value(0)).current;
    const rightPosition = useRef(new Animated.Value(0)).current;

    const toggleSettingsMenu = () => {
        setShowSettingsMenu((prevState) => !prevState);
    };

    const changeBrightness = async (value) => {
        setBrightness(value);

        const { status } = await Brightness.requestPermissionsAsync();
        if (status === "granted") {
            DeviceBrightness.setBrightnessLevel(value);
        }
    };

    const handleVolumeChange = (value) => {
        setVolume(value);
        if (!videoRef.current) return;
        videoRef.current.setVolumeAsync(value);
    };

    const animateText = (position) => {
        if (position === "left") {
            Animated.timing(leftPosition, {
                toValue: -100,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(rightPosition, {
                toValue: 100,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }).start();
        }
    };

    const resetText = (position) => {
        if (position === "left") {
            Animated.timing(leftPosition, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(rightPosition, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: false,
            }).start();
        }
    };

    const skipBackward = async () => {
        if (!videoRef.current) return;

        const status = await videoRef.current.getStatusAsync();
        const newPosition = status.positionMillis - 10000;

        if (newPosition > 0) {
            await videoRef.current.setPositionAsync(newPosition);
        } else {
            await videoRef.current.setPositionAsync(0);
        }
    };

    const skipForward = async () => {
        if (!videoRef.current) return;

        const status = await videoRef.current.getStatusAsync();
        const newPosition = status.positionMillis + 10000;

        if (newPosition < status.durationMillis) {
            await videoRef.current.setPositionAsync(newPosition);
        } else {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
        }
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""
                }${seconds}`;
        } else {
            return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    };

    return (
        <>
            <LinearGradient
                colors={["rgba(13, 22, 35, 1)", "rgba(13, 22, 35, 0)"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.overlay}
            >
                <TouchableOpacity onPress={handleBackPress}>
                    <View style={styles.backNavigation}>
                        <Ionicons name="arrow-back-outline" color={"white"} size={22} />
                        {/* <Text style={{ color: "white", fontSize: 20 }}>Back</Text> */}
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <Animated.View style={{ left: leftPosition }}>
                            <Text style={{ color: Colors.dark.secondary, fontSize: 17 }}>
                                - 10
                            </Text>
                        </Animated.View>
                        <TouchableOpacity
                            onPress={() => {
                                skipBackward();
                                animateText("left");
                                setTimeout(() => {
                                    resetText("left");
                                }, 500);
                            }}
                        >
                            <Ionicons
                                name="refresh-outline"
                                size={45}
                                color={Colors.dark.secondary}
                                style={{ transform: [{ rotateY: "180deg" }] }}
                            />
                        </TouchableOpacity>
                    </View>
                    {isLoading ? (
                        <View style={styles.playButton}>
                            <View>
                                <ActivityIndicator
                                    size={"large"}
                                    color={Colors.dark.secondary}
                                />
                            </View>
                        </View>
                    ) : isVideoEnded ? (
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={togglePlayPause}
                        >
                            <View>
                                <Ionicons
                                    name={"reload"}
                                    size={50}
                                    color={Colors.dark.secondary}
                                />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={togglePlayPause}
                        >
                            <View>
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={50}
                                    color={Colors.dark.secondary}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <TouchableOpacity
                            disabled={isVideoEnded}
                            onPress={() => {
                                skipForward();
                                animateText("right");
                                setTimeout(() => {
                                    resetText("right");
                                }, 500);
                            }}
                        >
                            <Ionicons
                                name="refresh-outline"
                                size={45}
                                color={!isVideoEnded ? Colors.dark.secondary : "transparent"}
                            />
                        </TouchableOpacity>
                        <Animated.View style={{ left: rightPosition }}>
                            <Text
                                style={{
                                    color: !isVideoEnded ? Colors.dark.secondary : "transparent",
                                    fontSize: 17,
                                }}
                            >
                                + 10
                            </Text>
                        </Animated.View>
                    </View>
                </View>
                <View>
                    <View style={styles.videoControls}>
                        <TouchableOpacity disabled={true}>
                            <Text style={{ color: "white", fontSize: 16 }}>
                                {/* Watch Trailer */}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.videoRightControls}>
                            {/* <TouchableOpacity onPress={toggleSettingsMenu}>
                <Ionicons
                  name={"settings-outline"}
                  size={25}
                  color={Colors.dark.secondary}
                />
              </TouchableOpacity> */}
                            <TouchableOpacity onPress={toggleSound}>
                                <Ionicons
                                    name={isMuted ? "volume-mute-outline" : "volume-high-outline"}
                                    size={25}
                                    color={Colors.dark.secondary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={changeScreenOrientation}>
                                <MaterialIcons
                                    name="zoom-in-map"
                                    size={20}
                                    color={Colors.dark.secondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.progressBarFullScreenContainer}>
                        <Text style={{ color: Colors.dark.secondary }}>
                            {formatTime(status.positionMillis || 0)}
                        </Text>
                        <Slider
                            style={styles.progressBarFullscreen}
                            minimumValue={0}
                            maximumValue={100}
                            value={progress}
                            onValueChange={handleSliderChange}
                            onSlidingComplete={handleSliderRelease}
                            minimumTrackTintColor={Colors.dark.secondary}
                            maximumTrackTintColor={Colors.dark.secondary}
                            thumbTintColor={Colors.dark.secondary}
                        />
                        <Text style={{ color: Colors.dark.secondary }}>
                            {formatTime(status.durationMillis || 0)}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
            <View style={styles.brightnessSliderContainer}>
                <Slider
                    style={styles.brightnessSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={brightness}
                    onValueChange={changeBrightness}
                    minimumTrackTintColor={Colors.dark.secondary}
                    maximumTrackTintColor={Colors.dark.secondary}
                    thumbTintColor={Colors.dark.secondary}
                    orientation="vertical"
                />
            </View>
            <View style={styles.volumeSliderContainer}>
                <Slider
                    style={styles.volumeSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={handleVolumeChange}
                    minimumTrackTintColor={Colors.dark.secondary}
                    maximumTrackTintColor={Colors.dark.secondary}
                    thumbTintColor={Colors.dark.secondary}
                    orientation="vertical"
                />
            </View>
        </>
    );
};

export default FullScreenVideoLayout;

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
        width: "5%",
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

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.primary,
    },
    modalContent: {
        width: 320,
        padding: 20,
        backgroundColor: Colors.dark.tabBackground,
        borderRadius: 10,
        alignItems: "center",
        height: 150,
    },
    modalTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        lineHeight: 20,
    },

    progressBarFullscreen: {
        width: "88%",
    },
    progressBarFullScreenContainer: {
        marginTop: 12,
        marginLeft: 20,
        bottom: 5,
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },
    brightnessSliderContainer: {
        position: "absolute",
        left: 10,
        top: "45%",
        // top height / 2.2,
        // height: height / 3,
        justifyContent: "center",
    },
    brightnessSlider: {
        height: "100%",
        width: 200,
        transform: [{ rotate: "270deg" }],
        right: "20%",
    },
    volumeSliderContainer: {
        position: "absolute",
        right: 10,
        top: "45%",
        // top height / 2.2,
        // height: height / 3,
        justifyContent: "center",
    },
    volumeSlider: {
        height: "100%",
        width: 200,
        transform: [{ rotate: "270deg" }],
        left: "20%",
    },
});
