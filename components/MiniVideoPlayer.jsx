import Video from "react-native-video";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Easing,
    ActivityIndicator,
    useWindowDimensions,
    Platform,
    Alert,
    ToastAndroid,
    Pressable,
    Image,
    ImageBackground,
    ScrollView,
    TouchableWithoutFeedback
} from "react-native";
import Colors from "../constants/Colors";
import Slider from "@react-native-community/slider";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import { v4 as uuidv4 } from 'uuid';
import { checkIfClimaxPaid } from "../redux/features/ClimaxIfPaidSlice";
import SystemSetting from "react-native-system-setting";
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomLoader from "../Ui/CustomLoader";
import * as NavigationBar from 'expo-navigation-bar';
import ModalComponent from "./ModalComponent";
import { startGlobalVideo, stopGlobalVideo } from "../redux/features/VideoProgressSlice";
import { reactContent } from "../redux/features/ReactToContentSlice";
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get("window");

const MiniVideoPlayer = ({
    content,
    videoLink,
    videoRef,
    // isNowPlaying,
    setContentType,
    setVideoUrl,
    contentType,
    playingFullScreen,
    setIsPlaybackFullScreenChanged,
    setFullscreen,
    episodesId
}) => {
    const isPlaying = useSelector((state) => state.videoProgress.isNowPlaying);
    const { width, height } = useWindowDimensions();
    const [videoAspectRatio, setVideoAspectRatio] = useState(null);
    const screenAspectRatio = width / height;
    let dynamicResizeMode = "contain";
    if (videoAspectRatio) {
        dynamicResizeMode = videoAspectRatio > screenAspectRatio ? "cover" : "contain";
    }

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const router = useRouter();
    const { climax_data, climax_loading } = useSelector((state) => state.climax);
    const { userData, user_loading } = useSelector((state) => state.login);
    const signUpData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const { climax_payment_data, climax_payment_loading } = useSelector(
        (state) => state.climaxPayment
    );
    const { react_data, react_loading } = useSelector((state) => state.react);
    const { episode_content, episode_loading } = useSelector(
        (state) => state.episode

    );

    const [showControls, setShowControls] = useState(true);
    const hideTimeout = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoPlaybackUrl, setVideoPlaybackUrl] = useState("");
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newPosition, setNewPosition] = useState(0);
    const [lastPausedTime, setLastPausedTime] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
    const [consentDefaultClimax, setConsentDefaultClimax] = useState(false);
    const [consentPaidClimax, setConsentPaidClimax] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [brightness, setBrightness] = useState(0.5);
    const scale = useRef(new Animated.Value(1)).current;
    const [lastScale, setLastScale] = useState(1);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    useEffect(() => {
        setCurrentEpisodeIndex(episodesId);
    }, [episodesId]);

    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(episodesId);
    const [countdown, setCountdown] = useState(30);
    const [showNextPopup, setShowNextPopup] = useState(false);
    const [isLiked, setIsLiked] = useState(content?.like == 1 && true);
    const [isReactionPressed, setIsReactionPressed] = useState(false);
    const [watchedEpisodes, setWatchedEpisodes] = useState([]);
    const [resumeTimes, setResumeTimes] = useState({});
    const [trailerEnded, setTrailerEnded] = useState(false);
    const [movieEnded, setMovieEnded] = useState(false);
    const [seriesEnded, setSeriesEnded] = useState(false);


    useEffect(() => {
        const updateNavigationBar = async () => {
            if (isFullscreen) {
                await NavigationBar.setVisibilityAsync("hidden");
            } else {
                await NavigationBar.setVisibilityAsync("visible");
            }
        };
        updateNavigationBar();
        return () => {
            NavigationBar.setVisibilityAsync("visible");
        };
    }, [isFullscreen]);

    useEffect(() => {
        if (react_data && react_data?.status && isReactionPressed) {
            setIsLiked((prev) => !prev);
            setIsReactionPressed(false);
        }
    }, [react_data]);

    const [showSkip, setShowSkip] = useState(false);
    const [introTime, setIntroTime] = useState(0);

    useEffect(() => {
        if (contentType === "video" && content?.intro_time) {
            setIntroTime(Number(content.intro_time));
            setShowSkip(true);
        }
    }, [contentType, content]);

    const handleEnd = () => {
        // Trailer finished → don’t autoplay
        if (videoPlaybackUrl === content?.trailer_url) {
            setTrailerEnded(true);
            setShowControls(true);
            return;
        }
        if (videoPlaybackUrl === content?.video_url && content?.content_type === "movie") {
            setMovieEnded(true);
            setShowControls(true);
            return;
        }

        //  No episodes available
        if (!Array.isArray(episode_content) || episode_content.length === 0) {
            return;
        }

        //  If no episode was started yet → start first
        if (currentEpisodeIndex === -1) {
            const firstVideoUrl = episode_content[0]?.video_url ?? null;
            if (!firstVideoUrl) return;

            setCurrentEpisodeIndex(0);
            setVideoPlaybackUrl(firstVideoUrl);
            setContentType("video");
            dispatch(startGlobalVideo())
            return;
        }

        //  Move to next episode
        const nextIndex = currentEpisodeIndex + 1;
        if (nextIndex < episode_content.length) {
            const nextVideoUrl = episode_content[nextIndex]?.video_url ?? null;
            if (!nextVideoUrl) return;

            setCurrentEpisodeIndex(nextIndex);
            setVideoPlaybackUrl(nextVideoUrl);
            setContentType("video");

            // trigger autoplay (otherwise it stays paused)
            dispatch(startGlobalVideo());

        } else {
            // setSeriesEnded(true);
            if (isFullscreen) {
                setEpisodeModal(true)
            } else {
                setEpisodeModal(false);
            }
        }
    };

    const restartTrailer = () => {
        videoRef.current?.seek(0); // restart from beginning
        setTrailerEnded(false);
        dispatch(startGlobalVideo());
    };
    const restartMovie = () => {
        videoRef.current?.seek(0);
        setMovieEnded(false);
        dispatch(startGlobalVideo());
    };

    const restartSeries = () => {
        if (!Array.isArray(episode_content) || episode_content.length === 0) return;

        const firstVideoUrl = episode_content[0]?.video_url ?? null;
        if (!firstVideoUrl) return;

        setCurrentEpisodeIndex(0);
        setVideoPlaybackUrl(firstVideoUrl);
        setContentType("video");
        setSeriesEnded(false);

        dispatch(startGlobalVideo());
    };



    const handleNext = () => {
        if (videoPlaybackUrl === content?.trailer_url) {
            return;
        }

        if (Array.isArray(episode_content) && episode_content.length > 0) {
            const nextIndex = currentEpisodeIndex + 1;

            if (nextIndex < episode_content.length) {
                const nextEpisode = episode_content[nextIndex];
                if (!nextEpisode?.video_url) {
                    return;
                }
                setCurrentEpisodeIndex(nextIndex);
                setVideoPlaybackUrl(nextEpisode.video_url);
                setContentType("video");
            } else {
                console.log("No more episodes available.");
            }
        } else {
            console.log("No episodes available for handleNext");
        }
    };

    // Go to previous episode
    const handlePrev = () => {
        if (Array.isArray(episode_content) && episode_content.length > 0) {
            const prevIndex = currentEpisodeIndex - 1;

            if (prevIndex >= 0) {
                const prevEpisode = episode_content[prevIndex];
                if (!prevEpisode?.video_url) {
                    return;
                }
                setCurrentEpisodeIndex(prevIndex);
                setVideoPlaybackUrl(prevEpisode.video_url);
                setShowNextPopup(false);
                setCountdown(30);
                setContentType("video");
            }
        } else {
            console.warn("No episodes available for handlePrev");
        }
    };


    const handleSeek = (time) => {
        if (videoRef?.current?.seek) {
            videoRef.current.seek(time);
            setCurrentTime(time);
            dispatch(startGlobalVideo());
        } else {
            console.warn("videoRef is not ready");
        }
    };

    useEffect(() => {
        if (videoLink)
            setVideoPlaybackUrl(videoLink);
    }, [videoLink]);

    // for screen rotation  📱📱📱📱📱📱📱📱📱
    useEffect(() => {
        if (
            parseInt(content?.default_climax) !== 0 &&
            newPosition >= parseInt(content?.default_climax) &&
            newPosition <= parseInt(content?.default_climax) + 1000
        ) {
            setIsModalVisible(true);
            dispatch(stopGlobalVideo());
        } else if (
            parseInt(content?.paid_climax) !== 0 &&
            newPosition >= parseInt(content?.paid_climax) &&
            newPosition <= parseInt(content?.paid_climax) + 2000
        ) {
            if (!consentPaidClimax) {
                setIsSecondModalVisible(true);
                dispatch(stopGlobalVideo());
            }
        }
    }, [newPosition]);

    const changeScreenOrientation = async () => {
        if (!isFullscreen) {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
            );
            setIsFullscreen(true);
        } else {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            setIsFullscreen(false);
            showNextPopup(false);

            setTimeout(async () => {
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.DEFAULT
                );
            }, 5000);
        }
    };

    // for screen rotation  📱📱📱📱📱📱📱📱📱
    useEffect(() => {
        (async () => {
            await ScreenOrientation.unlockAsync();
            const orientation = await ScreenOrientation.getOrientationAsync();
        })();
    }, []);

    useEffect(() => {
        const maybeUnlock = async () => {
            if (playingFullScreen) {
                await ScreenOrientation.unlockAsync();
                setIsPlaybackFullScreenChanged(false);
            }
        };
        maybeUnlock();
    }, [playingFullScreen]);

    // for screen rotation  📱📱📱📱📱📱📱📱📱
    useEffect(() => {
        const handleOrientationChange = async ({ orientationInfo }) => {
            const orientation = orientationInfo.orientation;
            if (
                orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
            ) {
                setIsFullscreen(true);
            } else if (
                orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
                orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
            ) {
                setIsFullscreen(false);
                showNextPopup(false)
            }
        };

        const subscription = ScreenOrientation.addOrientationChangeListener(handleOrientationChange);
        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, []);

    // for volume up 🔊🔊🔊🔊🔊🔊🔊🔊🔊
    useEffect(() => {
        SystemSetting.setVolume(volume);
        setVolume(volume);
    }, [volume]);

    // for volume down 🔈🔈🔈🔈🔈🔈🔈🔈🔈
    useEffect(() => {
        SystemSetting.getVolume().then((volume) => {
            SystemSetting.setVolume(volume);
            setVolume(volume);
        });
    }, []);

    // for mute 🔇🔇🔇🔇🔇🔇🔇🔇
    const toggleMute = () => {
        setIsMuted((prev) => {
            const newMute = !prev;
            SystemSetting.setVolume(newMute ? 0 : volume);
            return newMute;
        });
    };

    const skipIntro = () => {
        if (videoRef.current && introTime > 0) {
            videoRef.current.seek(introTime / 1000);
            setShowSkip(false);
        }
    };

    const skipBackward = () => {
        const newTime = Math.max(currentTime - 10, 0);
        videoRef.current?.seek(newTime);
        setCurrentTime(newTime);
    };

    const skipForward = () => {
        const newTime = Math.min(currentTime + 10, duration);
        videoRef.current?.seek(newTime);
        setCurrentTime(newTime);
    };

    const leftSlide = useRef(new Animated.Value(0)).current;
    const rightSlide = useRef(new Animated.Value(0)).current;

    const animateText = (direction) => {
        const slide = direction === "left" ? leftSlide : rightSlide;
        slide.setValue(-15);
        Animated.timing(slide, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // for show time duration ⌚⌚⌚⌚⌚⌚⌚⌚
    const formatTime = (seconds = 0, showHours = false) => {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;
        const mm = minutes < 10 ? `0${minutes}` : minutes;
        const ss = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        const hh = hours < 10 ? `0${hours}` : hours;
        if (showHours || totalSeconds > 3600) {
            return `${hh}:${mm}:${ss}`;
        } else {
            return `${mm}:${ss}`;
        }
    };

    // for brightness🔦🔦🔦🔦🔦🔦🔦🔦
    const handleBrightnessChange = async (val) => {
        try {
            await SystemSetting.setAppBrightness(val);
            setBrightness(val);
        } catch (error) {
            console.log("Failed to set brightness", error);
        }
    };

    const handleReaction = () => {
        if (userData) {
            const payload = {
                data: {
                    user_id: userData?.data?.user_id,
                    content_id: content?.content_id,
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

    const [episodeModal, setEpisodeModal] = useState(false)

    const closeEpisodeModal = async () => {
        setEpisodeModal(false)
    };

    const handleallEpisode = (val) => {
        setEpisodeModal(true);
        setTimeout(() => {
            console.log("episodeModal after update:", episodeModal);
        }, 0);
    };


    const playClimaxTwo = async () => {
        await videoRef.current.setPositionAsync(parseInt(content?.paid_climax));
        await videoRef.current.playAsync();
        setIsModalVisible(false);
        dispatch(startGlobalVideo());
    };

    useEffect(() => {
        if (climax_data?.status) {
            playClimaxTwo();
        }
    }, [climax_data]);

    useEffect(() => {
        if (climax_payment_data?.status) {
            setIsPaymentModalVisible(false);
            const payload = {
                token: userData
                    ? userData?.token
                    : forMobileData
                        ? forMobileData?.token
                        : signUpData?.token,
            };

            dispatch(checkIfClimaxPaid(payload));
        }
    }, [climax_payment_data]);


    useEffect(() => {
        if (videoLink != "") {
            setVideoPlaybackUrl(videoLink);
        }
    }, [videoLink]);

    const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
        useNativeDriver: true,
    });

    const onPinchStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            setLastScale(lastScale * event.nativeEvent.scale);
            scale.setValue(1);
        }
    };

    const animatedStyle = {
        transform: [{ scale: Animated.multiply(scale, lastScale) }],
    };


    useEffect(() => {
        hideTimeout.current = setTimeout(() => {
            setShowControls(false);
        }, 2000);
        return () => {
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
        };
    }, []);

    const handleTap = (val) => {
        setShowControls(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
            setShowControls(false);
        }, 3500);
    };

    const handleBackPress = () => {
        if (isFullscreen) {
            changeScreenOrientation();
        } else {
            router.back();
            setVideoUrl("");
        }
    };

    const handleBackHome = () => {
        router.replace("/(tabs)/home");
        dispatch(stopGlobalVideo());
    };

    async function changeScreenOrientationToPortrait() {
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        setIsFullscreen(false);
        showNextPopup(false)
    }

    useEffect(() => {
        const checkOrientation = async () => {
            const current = await ScreenOrientation.getOrientationAsync();
        };

        checkOrientation();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await ScreenOrientation.unlockAsync(); // allow physical rotation again
        });
        return unsubscribe;
    }, [navigation]);

    // for show climax modal 
    const [hasHandledSecondModal, setHasHandledSecondModal] = useState(false);
    const closeModal = () => {
        setIsSecondModalVisible(false);
        setHasHandledSecondModal(true);

        if (videoRef.current && videoRef.current.seek) {
            videoRef.current.seek(0);
        }
    };

    const handleDenyClimax = (type = "default") => {
        try {
            if (videoRef.current && videoRef.current.seek) {
                const targetTimeInSeconds =
                    type === "default"
                        ? (parseInt(content?.default_climax || 0) + 1100) / 1000
                        : lastPausedTime;

                videoRef.current.seek(targetTimeInSeconds);
            }

            setIsModalVisible(false);
            setIsSecondModalVisible(false);
            setHasHandledSecondModal(true);
            dispatch(startGlobalVideo());

            if (type === "default") {
                setConsentDefaultClimax(true);
                changeScreenOrientationToPortrait();
            }

        } catch (error) {
            console.error("Error seeking video:", error);
        }
    };


    const handlePayForClimax = async () => {
        try {
            const flowId = uuidv4();
            const environment = 'PRODUCTION';
            const merchantId = 'M22T6CQ8O6GTR';
            const enableLogging = false;
            try {
                const currentOrientation = await ScreenOrientation.getOrientationAsync();
            } catch (err) {
                console.log("❗ Unable to fetch current orientation:", err.message);
            }

            const initResult = await PhonePePaymentSDK.init(environment, merchantId, flowId, enableLogging);
            if (!initResult) throw new Error('PhonePe SDK initialization failed');
            console.log('✅ PhonePe SDK Initialized');

            // Step 1: Get access token
            const tokenRes = await fetch(`${process.env.EXPO_PUBLIC_URL}/payment/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchantId }),
            });

            if (!tokenRes.ok) {
                const errorText = await tokenRes.text();
                throw new Error(`Token API failed: ${tokenRes.status} ${errorText}`);
            }

            const tokenData = await tokenRes.json();
            const accessToken = tokenData?.data?.access_token;
            if (!accessToken) throw new Error('Access token retrieval failed');

            // Step 2: Create order
            const merchantOrderId = `TX${Date.now()}`;
            const amountInPaise = 1 * 100;

            const orderPayload = {
                merchantOrderId,
                amount: amountInPaise,
                paymentInstrument: { type: 'PG_CHECKOUT' },
                access_token: accessToken,
                redirectUrl: 'https://webhook.site/208c3d8e-1ae4-4810-bf9b-de40443ce3bd',
                metaInfo: {
                    udf1: userData?.data?.first_name || forMobileData?.data?.first_name || signUpData?.data?.first_name || '',
                    udf2: userData?.data?.email || forMobileData?.data?.email || signUpData?.data?.email || '',
                    udf3: userData?.data?.phone || forMobileData?.data?.phone || signUpData?.data?.phone || '',
                },
            };

            const orderRes = await fetch(`${process.env.EXPO_PUBLIC_URL}/payment/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            if (!orderRes.ok) {
                const errorText = await orderRes.text();
                throw new Error(`Order API failed: ${orderRes.status} ${errorText}`);
            }

            const orderData = await orderRes.json();
            const order = orderData?.responseData;
            if (!order?.orderId || !order?.token) throw new Error('Invalid order creation response');

            // Step 3: Start transaction via SDK
            const sdkRequestBody = JSON.stringify({
                merchantId,
                orderId: order.orderId,
                paymentMode: { type: 'PAY_PAGE' },
                token: order.token,
                redirectUrl: 'https://webhook.site/208c3d8e-1ae4-4810-bf9b-de40443ce3bd',
                callbackUrl: 'https://webhook.site/208c3d8e-1ae4-4810-bf9b-de40443ce3bd',
            });

            const paymentRes = await PhonePePaymentSDK.startTransaction(sdkRequestBody, null);

            if (paymentRes.status === 'SUCCESS') {
                const paymentId = uuidv4();
                const items = {
                    amount: amountInPaise,
                    currency: "INR",
                    merchantOrderId,
                    access_token: accessToken,
                    transaction_id: paymentId,
                    content_id: content?.content_id,
                    user_id: userData
                        ? userData?.data?.user_id
                        : forMobileData
                            ? forMobileData?.data?.user_id
                            : signUpData?.data?.user_id,
                };



                const sendAuthPostData = async (url, obj, token) => {
                    try {
                        const response = await fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(obj),
                        });

                        const text = await response.text();

                        try {
                            return JSON.parse(text);
                        } catch {
                            throw new Error("Failed to parse JSON from verify-addOn");
                        }
                    } catch (err) {
                        console.error("❌ Fetch error:", err.message, err);
                        throw err;
                    }
                };

                try {
                    const url = `${process.env.EXPO_PUBLIC_URL}/payment/verify-addOn`;

                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Verify call timed out")), 15000)
                    );

                    const res = await Promise.race([
                        sendAuthPostData(url, items),
                        timeoutPromise,
                    ]);

                    if (res?.status === true && res?.data) {
                        setVideoPlaybackUrl(res.data);
                        closeModal()
                        dispatch(startGlobalVideo());
                        setConsentPaidClimax(true);
                        const payload = {
                            token: userData
                                ? userData?.token
                                : forMobileData
                                    ? forMobileData?.token
                                    : signUpData?.token,
                        }
                        dispatch(checkIfClimaxPaid(payload));
                    }


                } catch (error) {
                    console.error("🚨 Verification Error:", error.message);
                    // ToastAndroid.show(error.message || "Something went wrong", ToastAndroid.BOTTOM);
                    Toast.show(error.message || "Something went wrong", Toast.LONG);
                }

            } else if (paymentRes.status === 'CANCELLED') {
                closeModal()
                // ToastAndroid.show("Payment Cancelled", ToastAndroid.BOTTOM);
                Toast.show("Payment Cancelled", Toast.LONG);
            } else if (paymentRes.status === 'FAILURE') {
                closeModal()
                // ToastAndroid.show("Payment Failed", ToastAndroid.BOTTOM);
                Toast.show("Payment Failed", Toast.LONG);
            }

        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong during payment');
        }
    };


    return (
        <>
            <PinchGestureHandler onGestureEvent={onPinchEvent}
                onHandlerStateChange={onPinchStateChange}
            >
                <Animated.View
                    style={[
                        {
                            width: isFullscreen ? width : "100%",
                            height: isFullscreen ? height : 250,
                            alignSelf: 'center',
                            overflow: 'hidden',
                        },
                        animatedStyle,
                    ]}
                >
                    {videoPlaybackUrl ? (
                        <Video
                            ref={videoRef}
                            source={{ uri: videoPlaybackUrl, type: "m3u8" }}
                            style={StyleSheet.absoluteFillObject}
                            resizeMode={isFullscreen ? dynamicResizeMode : "contain"}
                            controls={false}
                            paused={!isPlaying}
                            muted={isMuted}
                            onLoadStart={() => {
                                setIsLoading(true);
                                setShowNextPopup(false);
                            }}
                            onLoad={({ duration, naturalSize }) => {
                                setIsLoading(false);
                                setDuration(duration);
                                // save video aspect ratio
                                if (naturalSize?.width && naturalSize?.height) {
                                    setVideoAspectRatio(naturalSize.width / naturalSize.height);
                                }
                                // enable skip intro button at start
                                if (introTime > 0) {
                                    setShowSkip(true);
                                }
                                // auto-play only if not already playing
                                if (!isPlaying) dispatch(startGlobalVideo());
                                // resume playback if episode + resume time exist
                                if (Array.isArray(episode_content) && currentEpisodeIndex >= 0) {
                                    const currentEp = episode_content[currentEpisodeIndex];
                                    if (currentEp && resumeTimes[currentEp.episode_id]) {
                                        videoRef.current?.seek(resumeTimes[currentEp.episode_id]);
                                    }
                                }
                            }}
                            onProgress={({ currentTime }) => {
                                setCurrentTime(currentTime);
                                if (showSkip && introTime > 0 && currentTime * 1000 >= introTime) {
                                    setShowSkip(false);
                                }

                                if (Array.isArray(episode_content) && currentEpisodeIndex >= 0) {
                                    const currentEp = episode_content[currentEpisodeIndex];
                                    if (currentEp?.episode_id) {
                                        setResumeTimes((prev) => ({
                                            ...prev,
                                            [currentEp.episode_id]: currentTime,
                                        }));
                                    }
                                }
                            }}

                            onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}
                            onEnd={handleEnd}
                            progressUpdateInterval={500}
                        />

                    ) : (
                        <LinearGradient
                            colors={[
                                "rgba(13, 22, 35, 0.6)",
                                "rgba(13, 22, 35, 0.15)",
                                "rgba(13, 22, 35, 0)",
                            ]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.overlay}
                        >
                            <View style={{ height: 250, justifyContent: "center", alignItems: "center" }}>
                                <ActivityIndicator size={"large"} color={Colors.dark.secondary} />
                            </View>
                        </LinearGradient>
                    )}
                    {/* 🔽 Video Controls */}
                    {isLoading && (
                        <View style={styles.fullscreenLoader}>
                            <CustomLoader imageSource={require("../assets/waiting.png")} size={40} />
                        </View>
                    )}

                    {
                        showControls && (
                            isFullscreen ? (
                                <LinearGradient
                                    colors={[
                                        "rgba(13, 22, 35, 0.6)",
                                        "rgba(13, 22, 35, 0.15)",
                                        "rgba(13, 22, 35, 0)",
                                    ]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 0, y: 0 }}
                                    style={styles.overlay}
                                >
                                    <View style={styles.fullscreenControls}>
                                        {/* Left: Back + Volume */}
                                        <TouchableOpacity style={styles.backBtnContainer} onPress={handleBackPress}>
                                            <Ionicons name="arrow-back-outline" color="white" size={22} />
                                        </TouchableOpacity>

                                        <View style={styles.titleContainer}>
                                            {contentType === "trailer" || content?.content_type === "movie" ? (
                                                <Text style={styles.titletext}>
                                                    {content?.title}{" "}
                                                    <Text style={styles.sub_titletext}>
                                                        ({content?.age_group > 18
                                                            ? "A 18+"
                                                            : content?.age_group < 18
                                                                ? "U 18-"
                                                                : "U/A 18"})
                                                    </Text>
                                                </Text>
                                            ) : (content?.content_type === "webseries" || content?.content_type === "comedy") ? (
                                                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                                                    <Text style={styles.titletext}>{content?.title}</Text>
                                                    {contentType === "trailer" && (
                                                        <Text style={styles.sub_titletext}>
                                                            {"  "}
                                                            ({content?.age_group > 18
                                                                ? "A 18+"
                                                                : content?.age_group < 18
                                                                    ? "U 18-"
                                                                    : "U/A 18"})
                                                        </Text>
                                                    )}
                                                    {contentType === "video" &&
                                                        episode_content &&
                                                        episode_content.length > 0 &&
                                                        currentEpisodeIndex >= 0 &&
                                                        episode_content[currentEpisodeIndex] && (
                                                            <Text style={styles.sub_titletext}>
                                                                {"  "}
                                                                S{episode_content[currentEpisodeIndex]?.season_title?.replace("Season ", "")}{" "}
                                                                {episode_content[currentEpisodeIndex]?.title}{"  "}
                                                                ({content?.age_group > 18
                                                                    ? "A 18+"
                                                                    : content?.age_group < 18
                                                                        ? "U 18-"
                                                                        : "U/A 18"})
                                                            </Text>
                                                        )}
                                                </View>
                                            ) : null}
                                        </View>

                                        <View style={styles.volumeContainer}>
                                            <Slider
                                                style={styles.verticalSlider}
                                                minimumValue={0}
                                                maximumValue={1}
                                                value={isMuted ? 0 : volume}
                                                onValueChange={(val) => {
                                                    setVolume(val);
                                                    setIsMuted(val === 0);
                                                }}
                                                minimumTrackTintColor={Colors.dark.secondary}
                                                maximumTrackTintColor={Colors.dark.secondary}
                                                thumbTintColor={Colors.dark.secondary}
                                            />
                                        </View>

                                        {/* Center Controls */}
                                        <View style={styles.centerControls}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                <Animated.View style={{ transform: [{ translateX: leftSlide }] }}>
                                                    <Text style={styles.skipText}>- 10</Text>
                                                </Animated.View>
                                                <TouchableOpacity onPress={() => {
                                                    skipBackward();
                                                    animateText("left");
                                                }}>
                                                    <Ionicons name="refresh-outline" size={45} color={Colors.dark.secondary} style={{ transform: [{ rotateY: "180deg" }] }} />
                                                </TouchableOpacity>
                                            </View>

                                            {videoPlaybackUrl === content?.trailer_url && trailerEnded ? (
                                                // Trailer refresh
                                                <TouchableOpacity onPress={restartTrailer}>
                                                    <Ionicons name="refresh-outline" size={45} color={Colors.dark.secondary} />
                                                </TouchableOpacity>
                                            ) : videoPlaybackUrl === content?.video_url && content?.content_type === "movie" && movieEnded ? (
                                                // Movie refresh
                                                <TouchableOpacity onPress={restartMovie}>
                                                    <Ionicons name="refresh-outline" size={45} color={Colors.dark.secondary} />
                                                </TouchableOpacity>
                                            ) : (
                                                // Play / Pause
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (isPlaying) {
                                                            dispatch(stopGlobalVideo());
                                                        } else {
                                                            if (trailerEnded || movieEnded || currentTime >= duration) {
                                                                videoRef.current?.seek(0);
                                                                setTrailerEnded(false);
                                                                setMovieEnded(false);
                                                            }
                                                            dispatch(startGlobalVideo());
                                                        }
                                                    }}
                                                >
                                                    <Icon
                                                        name={!isPlaying ? "play" : "pause"}
                                                        size={48}
                                                        color={Colors.dark.secondary}
                                                    />
                                                </TouchableOpacity>
                                            )}


                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                <TouchableOpacity onPress={() => {
                                                    skipForward();
                                                    animateText("right");
                                                }}>
                                                    <Ionicons name="refresh-outline" size={45} color={Colors.dark.secondary} />
                                                </TouchableOpacity>
                                                <Animated.View style={{ transform: [{ translateX: rightSlide }] }}>
                                                    <Text style={[styles.skipText, { marginLeft: 15 }]}>+ 10</Text>
                                                </Animated.View>
                                            </View>
                                        </View>

                                        {/* Right: Brightness, Fullscreen, Mute */}
                                        <View style={styles.seekContainer}>
                                            <Slider
                                                style={styles.verticalSlider}
                                                minimumValue={0.1}
                                                maximumValue={1}
                                                value={brightness}
                                                onValueChange={handleBrightnessChange}
                                                minimumTrackTintColor={Colors.dark.secondary}
                                                maximumTrackTintColor={Colors.dark.secondary}
                                                thumbTintColor={Colors.dark.secondary}
                                            />
                                        </View>

                                        <View style={styles.controlsRow}>
                                            {/* Episodes */}
                                            {((content?.content_type === "webseries" || content?.content_type === "comedy")
                                                && !showNextPopup
                                                && contentType === 'video') && (
                                                    <TouchableOpacity
                                                        style={[styles.controlBtn, { left: 60 }]}
                                                        onPress={() => {
                                                            handleallEpisode("open");
                                                        }}>
                                                        <MaterialIcons
                                                            name="video-collection"
                                                            size={20}
                                                            color={Colors.dark.secondary}
                                                        />
                                                        <Text style={styles.controlText}>Episodes</Text>
                                                    </TouchableOpacity>
                                                )}

                                            {/* Like */}
                                            {contentType === 'video' && (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.controlBtn,
                                                        content?.content_type === "webseries" || content?.content_type === "comedy"
                                                            ? { left: 160 }
                                                            : { right: 120 }
                                                    ]}
                                                    onPress={handleReaction}    >
                                                    <Ionicons
                                                        name={isLiked ? "heart" : "heart-outline"}
                                                        color={isLiked ? "red" : Colors.dark.secondary}
                                                        size={20}
                                                    />
                                                </TouchableOpacity>
                                            )}

                                            {/* // --- Previous Episode Button --- */}
                                            {(content?.content_type === "webseries" || content?.content_type === "comedy") &&
                                                currentEpisodeIndex > 0 &&
                                                !showNextPopup && (
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.controlBtn,
                                                            currentEpisodeIndex < (episode_content?.length ?? 0) - 1
                                                                ? { right: 220 }
                                                                : { right: 100 }
                                                        ]}
                                                        onPress={handlePrev}
                                                    >
                                                        <MaterialIcons
                                                            name="skip-next"
                                                            size={20}
                                                            color={Colors.dark.secondary}
                                                            style={{ transform: [{ rotateY: "180deg" }] }}
                                                        />
                                                        <Text style={styles.controlText}>Previous Episode</Text>
                                                    </TouchableOpacity>
                                                )}

                                            {/* // --- Next Episode Button --- */}
                                            {contentType === 'trailer' ? null : (
                                                (content?.content_type === "webseries" || content?.content_type === "comedy") &&
                                                !showNextPopup &&
                                                episode_content?.length > 0 &&
                                                currentEpisodeIndex < (episode_content?.length ?? 0) - 1 && (
                                                    <TouchableOpacity
                                                        style={[styles.controlBtn, { right: 100 }]}
                                                        onPress={handleNext}
                                                    >
                                                        <MaterialIcons
                                                            name="skip-next"
                                                            size={20}
                                                            color={Colors.dark.secondary}
                                                        />
                                                        <Text style={styles.controlText}>Next Episode</Text>
                                                    </TouchableOpacity>
                                                )
                                            )
                                            }

                                            {/* Mute */}
                                            <TouchableOpacity style={[styles.controlBtn, { right: 70 }]} onPress={toggleMute}>
                                                <Icon name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color={Colors.dark.secondary} />

                                            </TouchableOpacity>

                                            {/* Fullscreen */}
                                            <TouchableOpacity style={[styles.controlBtn, { right: 30 }]} onPress={changeScreenOrientation} >
                                                <MaterialIcons name="zoom-out-map" size={20} color={Colors.dark.secondary} />

                                            </TouchableOpacity>
                                        </View>

                                        {showSkip && contentType === "video" && (
                                            <TouchableOpacity
                                                style={[
                                                    styles.muteContainer,
                                                    isFullscreen && {
                                                        right: 30,
                                                        bottom: 70,
                                                    },
                                                ]}
                                                onPress={skipIntro}
                                            >
                                                <Text style={styles.skip_txt}>Skip</Text>
                                                <MaterialIcons
                                                    name="skip-next"
                                                    size={18}
                                                    color={'#fff'}
                                                />
                                            </TouchableOpacity>
                                        )}

                                        <View style={styles.timeContainer}>
                                            <Text style={styles.durationTime}>{formatTime(currentTime, duration >= 3600)}</Text>
                                            <View style={styles.sliderContainer}>
                                                <Slider
                                                    style={styles.slider}
                                                    minimumValue={0}
                                                    maximumValue={duration}
                                                    value={currentTime}
                                                    onSlidingComplete={handleSeek}
                                                    minimumTrackTintColor={Colors.dark.secondary}
                                                    maximumTrackTintColor={Colors.dark.secondary}
                                                    thumbTintColor={Colors.dark.secondary}
                                                />
                                            </View>
                                            <Text style={styles.durationTime}>{formatTime(duration, duration >= 3600)}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            ) : (
                                videoPlaybackUrl && (
                                    <LinearGradient
                                        colors={[
                                            "rgba(13, 22, 35, 0.6)",
                                            "rgba(13, 22, 35, 0.15)",
                                            "rgba(13, 22, 35, 0)",
                                        ]}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 0, y: 0 }}
                                        style={styles.overlay}
                                    >
                                        <View style={styles.miniControls}>
                                            <TouchableOpacity
                                                onPress={handleBackHome}
                                                style={{
                                                    position: 'absolute',
                                                    top: 35, left: 15
                                                }}>
                                                <Ionicons name="arrow-back-outline" color="white" size={25} />
                                            </TouchableOpacity>

                                            <View style={{ position: 'absolute', top: 35, left: 50 }}>


                                                {contentType === "trailer" || content?.content_type === "movie" ? (
                                                    <Text style={styles.titletext}>
                                                        {content?.title}{" "}
                                                        <Text style={styles.sub_titletext}>
                                                            ({content?.age_group > 18
                                                                ? "A 18+"
                                                                : content?.age_group < 18
                                                                    ? "U 18-"
                                                                    : "U/A 18"})
                                                        </Text>
                                                    </Text>
                                                ) : (content?.content_type === "webseries" || content?.content_type === "comedy") ? (
                                                    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                                                        <Text style={styles.titletext}>{content?.title}</Text>

                                                        {contentType === "trailer" &&
                                                            (
                                                                <Text style={styles.sub_titletext}>
                                                                    {"  "}
                                                                    ({content?.age_group > 18
                                                                        ? "A 18+"
                                                                        : content?.age_group < 18
                                                                            ? "U 18-"
                                                                            : "U/A 18"})
                                                                </Text>
                                                            )}

                                                        {contentType === "video" &&
                                                            episode_content &&
                                                            episode_content.length > 0 &&
                                                            currentEpisodeIndex >= 0 &&
                                                            episode_content[currentEpisodeIndex] && (
                                                                <Text style={styles.sub_titletext}>
                                                                    {"  "}
                                                                    S{episode_content[currentEpisodeIndex]?.season_title?.replace("Season ", "")}{" "}
                                                                    {episode_content[currentEpisodeIndex]?.title}{"  "}
                                                                    ({content?.age_group > 18
                                                                        ? "A 18+"
                                                                        : content?.age_group < 18
                                                                            ? "U 18-"
                                                                            : "U/A 18"})
                                                                </Text>
                                                            )}
                                                    </View>
                                                ) : null}
                                            </View>

                                            <View style={styles.halfcenterControls}>
                                                {videoPlaybackUrl === content?.trailer_url && trailerEnded ? (
                                                    // Refresh button for trailer
                                                    <TouchableOpacity onPress={restartTrailer}>
                                                        <Ionicons name="refresh-outline" size={45} color={Colors.dark.secondary} />
                                                    </TouchableOpacity>
                                                ) : videoPlaybackUrl === content?.video_url && content?.content_type === "movie" && movieEnded ? (
                                                    // Refresh button for movie
                                                    <TouchableOpacity onPress={restartMovie}>
                                                        <Ionicons name="refresh-outline" size={45} color={Colors.dark.secondary} />
                                                    </TouchableOpacity>
                                                ) : (
                                                    // Play / Pause button
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if (isPlaying) {
                                                                dispatch(stopGlobalVideo());
                                                            } else {
                                                                if (trailerEnded || movieEnded || seriesEnded || currentTime >= duration) {
                                                                    videoRef.current?.seek(0);
                                                                    setTrailerEnded(false);
                                                                    setMovieEnded(false);
                                                                    setSeriesEnded(false);
                                                                }
                                                                dispatch(startGlobalVideo());
                                                            }
                                                        }}
                                                    >
                                                        <Icon
                                                            name={!isPlaying ? "play" : "pause"}
                                                            size={44}
                                                            color={Colors.dark.secondary}
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                            </View>



                                            {showSkip && contentType === "video" && (
                                                <TouchableOpacity
                                                    style={styles.muteContainer}
                                                    onPress={skipIntro}
                                                >
                                                    <Text style={styles.skip_txt}>Skip</Text>
                                                    <MaterialIcons
                                                        name="skip-next"
                                                        size={18}
                                                        color={'#fff'}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity style={styles.halfscreenBtn} onPress={changeScreenOrientation}>
                                                <MaterialIcons name="zoom-out-map" size={20} color={Colors.dark.secondary} />
                                            </TouchableOpacity>

                                            <View style={styles.halftimeContainer}>
                                                <View style={styles.sliderhalfContainer}>
                                                    <Slider
                                                        style={styles.halfslider}
                                                        minimumValue={0}
                                                        maximumValue={duration}
                                                        value={currentTime}
                                                        onSlidingComplete={handleSeek}
                                                        minimumTrackTintColor={Colors.dark.secondary}
                                                        maximumTrackTintColor={Colors.dark.secondary}
                                                        thumbTintColor={Colors.dark.secondary}
                                                    />
                                                </View>
                                                <Text style={styles.halfdurationTime}>{formatTime(duration, duration >= 3600)}</Text>
                                            </View>

                                        </View>
                                    </LinearGradient>
                                )

                            )
                        )
                    }
                </Animated.View>
            </PinchGestureHandler >

            {!showControls && (
                <Pressable onPress={() => handleTap("tap")} style={StyleSheet.absoluteFillObject} />
            )}

            {climax_data !== null && <ModalComponent
                visible={isSecondModalVisible}
                title="Would you like to watch Climax 2?"
                options={[{ label: "Yes", onPress: handlePayForClimax }, { label: "No", onPress: handleDenyClimax }]}
                onRequestClose={closeModal}
            />}

            <ModalComponent
                visible={isPaymentModalVisible}
                title="Ah! seems like you haven't subscribed for it! Would you like subscribe for it now?"
                options={[{ label: "Yes", onPress: handlePayForClimax }, { label: "No", onPress: () => router.back() }]}
                onRequestClose={closeModal}
                modalHeight={170}
            />

            {episodeModal && (
                <LinearGradient
                    colors={["rgba(13, 22, 35, 0.4)", "rgba(13, 22, 35, 0.3)"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.overlay}
                >
                    <TouchableWithoutFeedback onPress={closeEpisodeModal}>
                        <View style={[styles.modalOverlay, { height: height, width: width }]}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {Array.isArray(episode_content) &&
                                            episode_content.map((item, index) => {
                                                if (!item) return null;

                                                const isCurrent = index === currentEpisodeIndex;
                                                const isWatched = watchedEpisodes?.includes(item?.episode_id) ?? false;
                                                const progressPercent =
                                                    resumeTimes?.[item?.episode_id] && item?.duration
                                                        ? (resumeTimes[item.episode_id] / (parseInt(item.duration) / 1000)) * 100
                                                        : 0;

                                                return (
                                                    <TouchableOpacity
                                                        key={item?.episode_id ?? index}
                                                        style={{
                                                            // marginHorizontal: 7,
                                                            marginRight: 12,
                                                            borderWidth: 2,
                                                            borderColor: isCurrent
                                                                ? Colors.dark.secondary
                                                                : isWatched
                                                                    ? "#ccc"
                                                                    : "transparent",
                                                            borderRadius: 5,
                                                            overflow: "hidden",
                                                        }}
                                                        onPress={() => {
                                                            setCurrentEpisodeIndex(index);
                                                            if (item?.video_url) setVideoPlaybackUrl(item.video_url);
                                                            closeEpisodeModal();

                                                            if (!isPlaying) dispatch(startGlobalVideo());
                                                            if (item?.episode_id && !watchedEpisodes.includes(item.episode_id)) {
                                                                setWatchedEpisodes(prev => [...prev, item.episode_id]);
                                                            }

                                                            if (videoRef?.current?.seek) {
                                                                const resumeAt = resumeTimes?.[item?.episode_id];
                                                                videoRef.current.seek(resumeAt ?? 0);
                                                            }
                                                        }}
                                                    >
                                                        {item?.feature_image && (
                                                            <Image
                                                                source={{ uri: item.feature_image }}
                                                                style={{ height: 130, width: 170, resizeMode: "cover" }}
                                                            />
                                                        )}
                                                        <View
                                                            style={{
                                                                height: 130,
                                                                width: 170,
                                                                backgroundColor: "rgba(4, 4, 4, 0.6)",
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                justifyContent: "flex-start",
                                                                borderRadius: 3,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 14,
                                                                    marginLeft: 7,
                                                                    marginTop: 7,
                                                                    fontWeight: "500",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                {item?.title || ""}
                                                            </Text>
                                                        </View>

                                                        {/* progress bar */}
                                                        {progressPercent > 0 && (
                                                            <View
                                                                style={{
                                                                    position: "absolute",
                                                                    bottom: 0,
                                                                    left: 0,
                                                                    height: 4,
                                                                    width: `${progressPercent}%`,
                                                                    backgroundColor: "#e50914",
                                                                }}
                                                            />
                                                        )}
                                                    </TouchableOpacity>
                                                );
                                            })}
                                    </ScrollView>

                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>


                </LinearGradient>
            )}


        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },
    modalOverlay: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.9)',
        // backgroundColor: 'rgba(200, 195, 195, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalContent: {
        padding: 10,
        backgroundColor: 'rgba(13, 22, 35, 0.4)',
        height: 155,
        marginTop: 60,
        // width: '90%',
        // marginLeft:15,
        paddingHorizontal: 15
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    fullscreenLoader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    fullscreenControls: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: 10,
    },
    miniLoader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    miniControls: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        zIndex: 9999,
    },
    overlay_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height,
        paddingHorizontal: 20,
    },
    volumeContainer: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    muteContainer: {
        position: 'absolute',
        right: 15,
        bottom: 50,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(197, 219, 239, 0.6)',
        padding: 7,
        borderRadius: 6,
        paddingHorizontal: 10
    },
    skip_txt: {
        color: '#fff',
        fontSize: 12,
        fontStyle: 'italic',
        fontWeight: '500'
    },
    nextEpisodeContainer: {
        position: 'absolute',
        right: 20,
        bottom: 65,
        borderWidth: 1,
    },
    centerControls: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 120,
        flexDirection: 'row',
        width: 450
    },
    halfcenterControls: {
        position: 'absolute',
        top: '45%',
        left: '55%',
        transform: [{ translateX: -22 }],
        zIndex: 10,

    },
    skipTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seekContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verticalSlider: {
        width: 150,
        transform: [{ rotate: '-90deg' }],
    },
    durationTime: {
        color: Colors.dark.secondary,
        fontSize: 12,
        textAlign: 'center',
    },
    halfdurationTime: {
        color: Colors.dark.secondary,
        fontSize: 12,
        textAlign: 'center',
        position: 'absolute',
        right: 30,
        bottom: 2,
    },
    controlsRow: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 7,
        zIndex:999
    },
    controlText: {
        marginLeft: 5,
        color: Colors.dark.secondary,
        fontSize: 12,
    },
    halfscreenBtn: {
        position: 'absolute',
        right: 15,
        bottom: 8,
        zIndex:999
    },
    skipText: {
        color: Colors.dark.secondary,
        fontSize: 14,
        textAlign: 'center',
    },
    timeContainer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        width: '100%',
    },
    halftimeContainer: {
        position: 'absolute',
        bottom: 8,
        width: '100%',
        height: 20,
        paddingRight:80
    },
    timeText: {
        color: Colors.dark.secondary,
        fontSize: 12,
    },
    sliderContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    sliderhalfContainer: {
        flex: 1,
        justifyContent: 'center',
        // alignSelf:'flex-start',
        marginHorizontal: 0,
        // backgroundColor:'yellow',
        paddingHorizontal: 0,
        paddingLeft: 12,
        paddingRight: 2

    },
    slider: {
        width: '100%',
        height: 40,
    },
    halfslider: {
        width: '100%',
        // height: 40,
        // backgroundColor:"green",
        alignSelf: 'flex-start',
        right: 7,
        // marginHorizontal:2,
        paddingHorizontal: 0

    },
    backBtnContainer: {
        position: 'absolute',
        left: 20,
        top: 20
    },
    titleContainer: {
        position: 'absolute',
        left: 60,
        top: 20
    },
    titletext: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff'
    },
    sub_titletext: {
        fontSize: 10,
        fontWeight: '400',
        color: '#fff',
        // marginLeft: 7
    },
    upcomming_next: {
        backgroundColor: 'rgba(225, 222, 222, 0.5)',
        padding: 3,
        position: 'absolute',
        right: 30,
        top: 80,
        borderRadius: 4
    },
    upcomming_banner: {
        height: 50,
        width: 80,
        borderRadius: 7,
    },
    upcomming_timmer_view: {
        backgroundColor: 'rgba(225, 222, 222, 0.5)',
        height: 50,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    next_timmer_txt: {
        color: '#2b2a2aff',
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: '500'
    },
    upcomming_next_button: {
        height: 30,
        width: 70,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(56, 164, 255, 0.6)',
        position: 'absolute',
        right: 0,
        top: 70,
    },
    next_button: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '700',
        fontStyle: 'italic'
    }


});

export default MiniVideoPlayer;
