import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "../../../constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SimilarContents from "../../../components/SimilarContents";
import StarCasts from "../../../components/StarCasts";
import ContentDetails from "../../../components/ContentDetails";
import Slider from "@react-native-community/slider";
import {
    useFocusEffect,
    useLocalSearchParams,
    useNavigation,
    useRouter,
} from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import MiniVideoPlayer from "../../../components/MiniVideoPlayer";
import { checkIfClimaxPaid } from "../../../redux/features/ClimaxIfPaidSlice";
import ContentLoader from "../../../components/ContentLoader";
import {
    GetAuthContentDetails,
    GetContentDetails,
} from "../../../services/ApiServices";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import { stopGlobalVideo } from "../../../redux/features/VideoProgressSlice";

const { width, height } = Dimensions.get("window");

const MovieDetails = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const video = React.useRef(null);
    const { userData, user_loading } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    // const { content, loading } = useSelector((state) => state.content);
    const params = useLocalSearchParams();
    const router = useRouter();
    const [castDeatils, setCastDeatils] = useState([]);

    const [related, setRelated] = useState([]);

    const [movieDetails, setMovieDetails] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [videoLink, setVideoLink] = useState("");
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [contentType, setContentType] = useState("trailer");
    const [playingFullScreen, setPlayingFullScreen] = useState(false)
    const [playingFull, setPlayingFull] = useState(true)
    const [fullScreen, setFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [contentId, setContentId] = useState(null);


    useEffect(() => {
        if (content) {
            setMovieDetails(content);
            setCastDeatils(content?.casts);
            setRelated(content?.related_content);
            setVideoLink(content?.trailer_url);
        }
    }, [content]);

    const handleShare = async (movieId) => {
        try {
            const result = await Share.share({
                message: `Check out this: http://ec2-23-20-244-234.compute-1.amazonaws.com/details/${movieId}`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    dispatch(stopGlobalVideo());
                } else {
                    // Shared
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const fetchContent = async () => {
        setLoading(true);
        let payload = {
            data: {
                content_id: contentId ? contentId : params.content_id,
                type: "unauthorized",
            },
        };
        let authPayload = {
            data: {
                content_id: contentId ? contentId : params.content_id,
                user_id: userData
                    ? userData?.data?.user_id
                    : forMobileData
                        ? forMobileData?.data?.user_id
                        : signupData?.data?.user_id,
                type: "authorized",
            },
            token: userData
                ? userData?.token
                : forMobileData
                    ? forMobileData?.token
                    : signupData?.token,
        };
        if (!userData && !signupData && !forMobileData) {
            const response = await GetContentDetails(payload);
            setContent(response.data);
            setLoading(false);
            setPlayingFull(false);
        } else {
            const response = await GetAuthContentDetails(authPayload);
            setContent(response.data);
            setLoading(false);
            setPlayingFull(false);
        }
    };

    const fetchClimaxStatus = () => {
        const payload = {
            token: userData
                ? userData?.token
                : forMobileData
                    ? forMobileData?.token
                    : signupData?.token,
        };

        dispatch(checkIfClimaxPaid(payload));
    };

    useEffect(() => {
        fetchContent();
    }, [contentId]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            // setPlayingFullScreen(true);
            fetchContent();
            fetchClimaxStatus();
        });
        return unsubscribe;
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setIsPlaying(false);
            };
        }, [setIsPlaying])
    );



    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <MiniVideoPlayer
                content={content}
                videoLink={videoLink}
                storedProgress={progress}
                loading={isLoading}
                videoRef={video}
                setVideoUrl={(data) => setVideoLink(data)}
                contentType={contentType}
                playingFullScreen={playingFullScreen}
                setIsPlaybackFullScreenChanged={(data) => setPlayingFullScreen(data)}
                setFullscreen={(data) => setFullscreen(data)}
                isNowPlaying={isPlaying}
                setIsPlaying={(data) => setIsPlaying(data)}
                setContentType={(data) => setContentType(data)}
            />
            {!playingFull && 
            <ScrollView>
                <ContentDetails
                    contentDetails={movieDetails}
                    userData={
                        userData ? userData : forMobileData ? forMobileData : signupData
                    }
                    isWatchListed={content?.watch_list}
                    isContentLiked={content?.like}
                    setVideoUrl={(data) => setVideoLink(data)}
                    setContentType={(data) => setContentType(data)}
                    setPlayingFullScreen={(data) => setPlayingFullScreen(data)}
                    setIsPlaying={(data) => setIsPlaying(data)}
                    handleShare={(data) => handleShare(data)}
                />

                <StarCasts castDeatils={castDeatils} />

                <SimilarContents
                    content={related}
                    setContent={(data) => setContentId(data)}
                />
            </ScrollView>}
        
        </View>
    );
};

export default MovieDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },

    video: {
        width: width,
        height: 250,
    },
    progressBarContainer: {
        bottom: 8,
        width: width,
    },
    progressBar: {
        width: width + 30,
        alignSelf: "center",
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
    },

    videoRightControls: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
    },
});
