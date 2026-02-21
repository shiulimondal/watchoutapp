import React, { useEffect, useState, useRef } from "react";
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    PanResponder,
    Animated,
    Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import Colors from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
    getPlaybackPosition,
    readData,
    setPlaybackPosition,
    writeData,
} from "../../util/Util";
import SystemSetting from "react-native-system-setting";
import * as Brightness from "expo-brightness";

const { width, height } = Dimensions.get("window");

const VideoPlayer = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const video = React.useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [brightness, setBrightness] = useState(0.5);
    const [isVideoEnded, setIsVideoEnded] = useState(false);

    const sliderRef = useRef(null);

    const [lastTapTime, setLastTapTime] = useState(0);
    const [lastTapX, setLastTapX] = useState(null);

    const leftPosition = useRef(new Animated.Value(0)).current;
    const rightPosition = useRef(new Animated.Value(0)).current;

    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const settingsMenuAnim = useRef(new Animated.Value(0)).current;
    const [videoQualities, setVideoQualities] = useState([
        { id: 1, value: "Auto" },
        { id: 2, value: "360p" },
        { id: 3, value: "480p" },
        { id: 4, value: "720p" },
    ]);
    const [contentViewing, setContentViewing] = useState(
        JSON.parse(params?.content)
    );

    useEffect(() => {
        const fetchPlaybackPosition = async () => {
            const position = await getPlaybackPosition(contentViewing?.content_id);

            if (video.current) {
                await video.current.setPositionAsync(position);
            }
        };

        fetchPlaybackPosition();

        return () => {
            if (video.current) {
                video.current.unloadAsync();
            }
        };
    }, [contentViewing?.content_id]);



    useEffect(() => {
        Animated.timing(settingsMenuAnim, {
            toValue: showSettingsMenu ? 1 : 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, [showSettingsMenu]);

    useEffect(() => {
        (async () => {
            const { status } = await Brightness.requestPermissionsAsync();
            if (status === "granted") {
                Brightness.getSystemBrightnessAsync();
            }
        })();
    }, [brightness]);

    useEffect(() => {
        SystemSetting?.setVolume(volume);
    }, [volume]);

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

    const handleDoubleTap = async (x) => {
        const now = new Date().getTime();
        const DOUBLE_PRESS_DELAY = 300;

        if (x === lastTapX && now - lastTapTime < DOUBLE_PRESS_DELAY) {
            // Double tap
            const screenWidth = Dimensions.get("window").width;
            const playForwardIconWidth = 60;

            const playForwardIconPosition = (screenWidth - playForwardIconWidth) / 2;

            if (x > playForwardIconPosition) {
                skipForward();
            } else {
                skipBackward();
            }
        } else {
            // Single tap
            setLastTapTime(now);
            setLastTapX(x);
        }
    };

    const skipForward = async () => {
        if (!video.current) return;

        const status = await video.current.getStatusAsync();
        const newPosition = status.positionMillis + 10000;

        if (newPosition < status.durationMillis) {
            await video.current.setPositionAsync(newPosition);
        } else {
            await video.current.pauseAsync();
            setIsPlaying(false);
        }
    };

    const skipBackward = async () => {
        if (!video.current) return;

        const status = await video.current.getStatusAsync();
        const newPosition = status.positionMillis - 10000;

        if (newPosition > 0) {
            await video.current.setPositionAsync(newPosition);
        } else {
            await video.current.setPositionAsync(0);
        }
    };

    const toggleOverlay = () => {
        setShowOverlay(!showOverlay);
    };

    const toggleSound = async () => {
        if (!video.current) return;

        await video.current.setIsMutedAsync(!isMuted);
        setIsMuted(!isMuted);
    };

    const handleSliderChange = (value) => {
        setIsSeeking(true);
        setProgress(value);
    };

    const handleSliderRelease = async (value) => {
        setIsSeeking(false);
        if (!video.current) return;

        const status = await video.current.getStatusAsync();
        const newPosition = (value * status.durationMillis) / 100;

        const positionDifference = newPosition - status.positionMillis;

        await video.current.setPositionAsync(newPosition);

        if (isPlaying) {
            if (positionDifference > 0) {
                await video.current.playFromPositionAsync(newPosition);
            } else {
                await video.current.playAsync();
            }
        }
    };

    const togglePlayPause = async () => {
        if (!video.current) return;

        if (isVideoEnded) {
            await video.current.replayAsync();
            setIsVideoEnded(false);
        } else if (isPlaying) {
            await video.current.pauseAsync();
        } else {
            await video.current.playAsync();
        }

        setIsPlaying(!isPlaying);
        setTimeout(toggleOverlay, 5000);
    };

    const handlePlaybackStatusUpdate = async (status) => {
        if (!status.isLoaded) return;

        if (status.isPlaying) {
            setPlaybackPosition(contentViewing?.content_id, status.positionMillis);
        }

        const progressPercentage =
            (status.positionMillis / status.durationMillis) * 100;
        setProgress(progressPercentage);

        try {
            await writeData("video_progress", progressPercentage);
        } catch (error) {
            console.log("Error saving video progress:", error);
        }

        if (status.didJustFinish) {
            setIsVideoEnded(true);
            setIsPlaying(false);
            setShowOverlay(true);
        }
    };

    const handleFullScreen = () => {
        router.back();
        // params.onBack(progress);
    };

    const goBack = () => {
        router.back();
    };

    const handleVolumeChange = (value) => {
        setVolume(value);
        if (!video.current) return;
        video.current.setVolumeAsync(value);
    };

    const changeBrightness = async (value) => {
        setBrightness(value);
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === "granted") {
            Brightness.setSystemBrightnessAsync(value);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                handleDoubleTap(evt.nativeEvent.locationX);
            },
        })
    ).current;

    const handleQualityChange = (quality) => {
        setShowSettingsMenu(false);
    };

    const toggleSettingsMenu = () => {
        setShowSettingsMenu((prevState) => !prevState);
    };

    const settingsMenuTranslateX = settingsMenuAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
    });

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <TouchableOpacity
                activeOpacity={1}
                onPress={toggleOverlay}
                {...panResponder.panHandlers}
            >
                {/* <Video
                    ref={video}
                    style={{ width: "100%", height: "100%" }}
                    source={{
                        uri: params.videoUrl,
                    }}
                    volume={100}
                    useNativeControls={false}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    onLoadStart={() => setIsLoading(true)}
                    onReadyForDisplay={() => {
                        setIsLoading(false);
                        if (!isPlaying) {
                            video.current.playAsync();
                            setIsPlaying(true);
                        }
                    }}
                /> */}
                {showOverlay && (
                    <LinearGradient
                        colors={["rgba(13, 22, 35, 1)", "rgba(13, 22, 35, 0)"]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.overlay}
                    >
                        <TouchableOpacity onPress={goBack}>
                            <View style={styles.backNavigation}>
                                <Ionicons
                                    name="chevron-back-outline"
                                    color={"white"}
                                    size={20}
                                />
                                <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                            >
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
                            <View
                                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                            >
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
                                        color={
                                            !isVideoEnded ? Colors.dark.secondary : "transparent"
                                        }
                                    />
                                </TouchableOpacity>
                                <Animated.View style={{ left: rightPosition }}>
                                    <Text
                                        style={{
                                            color: !isVideoEnded
                                                ? Colors.dark.secondary
                                                : "transparent",
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
                                    <TouchableOpacity onPress={toggleSettingsMenu}>
                                        <Ionicons
                                            name={"settings-outline"}
                                            size={25}
                                            color={Colors.dark.secondary}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleSound}>
                                        <Ionicons
                                            name={
                                                isMuted ? "volume-mute-outline" : "volume-high-outline"
                                            }
                                            size={25}
                                            color={Colors.dark.secondary}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleFullScreen}>
                                        <MaterialIcons
                                            name="zoom-in-map"
                                            size={20}
                                            color={Colors.dark.secondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.progressBarContainer}>
                                <Slider
                                    style={styles.progressBar}
                                    minimumValue={0}
                                    maximumValue={100}
                                    value={progress}
                                    onValueChange={handleSliderChange}
                                    onSlidingComplete={handleSliderRelease}
                                    minimumTrackTintColor={Colors.dark.secondary}
                                    maximumTrackTintColor={Colors.dark.secondary}
                                    thumbTintColor={Colors.dark.secondary}
                                />
                            </View>
                        </View>
                    </LinearGradient>
                )}
                {showOverlay && (
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
                )}
                {showOverlay && (
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
                )}
            </TouchableOpacity>
            <Animated.View
                style={[
                    styles.settingsMenu,
                    { transform: [{ translateX: settingsMenuTranslateX }] },
                ]}
            >
                <Text style={styles.settingsMenuHeader}>Change Quality</Text>
                {videoQualities.map((quality) => {
                    return (
                        <TouchableOpacity
                            key={quality.id}
                            style={styles.settingsMenuItem}
                            onPress={() => handleQualityChange(quality.value)}
                        >
                            <Text style={styles.settingsMenuText}>{quality.value}</Text>
                        </TouchableOpacity>
                    );
                })}
            </Animated.View>
        </View>
    );
};

export default VideoPlayer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },
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
        paddingHorizontal: 15,
    },

    videoRightControls: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
    },

    progressBarContainer: {
        bottom: 5,
    },
    progressBar: {
        width: "100%",
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
    settingsMenu: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: 250,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 20,
    },
    settingsMenuHeader: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 10,
    },
    settingsMenuItem: {
        padding: 10,
        borderBottomWidth: 0.2,
        borderBottomColor: "gray",
    },
    settingsMenuText: {
        color: "#fff",
    },
});
