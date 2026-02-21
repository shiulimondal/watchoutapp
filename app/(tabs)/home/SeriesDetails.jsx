import React, { useCallback, useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "../../../constants/Colors";
import SimilarContents from "../../../components/SimilarContents";
import StarCasts from "../../../components/StarCasts";
import ContentDetails from "../../../components/ContentDetails";
import EpisodeDetails from "../../../components/EpisodeDetails";
import SeasonDetails from "../../../components/SeasonDetails";
import {
    useFocusEffect,
    useLocalSearchParams,
    useNavigation,
    useRouter,
} from "expo-router";
import { readData, writeData } from "../../../util/Util";
import MiniVideoPlayer from "../../../components/MiniVideoPlayer";
import ContentLoader from "../../../components/ContentLoader";
import { contentDetails } from "../../../redux/features/details/ContentDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { episodeDetails } from "../../../redux/features/details/EpisodeDetailsSlice";
import {
    GetAuthContentDetails,
    GetContentDetails,
} from "../../../services/ApiServices";

const { width, height } = Dimensions.get("window");

const SeriesDetails = () => {
    const { userData, user_loading } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const router = useRouter();
    const params = useLocalSearchParams();
    const video = React.useRef(null);
    const [progress, setProgress] = useState(0);
    const [castDeatils, setCastDeatils] = useState([]);
    const [seriesDetails, setSeriesDetails] = useState(null);
    const [seasonDetails, setSeasonDetails] = useState([]);
    const [episodesDetails, setEpisodesDetails] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [related, setRelated] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(null);
    const [videoLink, setVideoLink] = useState("");
    const [fullScreen, setFullscreen] = useState(false);
    const [contentType, setContentType] = useState("trailer");
    const [playingFullScreen, setPlayingFullScreen] = useState(false)
    const [contentId, setContentId] = useState(null);
    const [episodesId, setepisodesId] = useState(null);

    const { episode_content, episode_loading } = useSelector(
        (state) => state.episode
    );

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, [isLoading]);

    useEffect(() => {
        setEpisodesDetails(episode_content);
    }, [episode_content]);

    useEffect(() => {
        dispatch(episodeDetails(selectedSeason));
    }, [selectedSeason]);

    useEffect(() => {
        if (content) {
            setSeriesDetails(content);
            setCastDeatils(content?.casts);
            setRelated(content?.related_content);
            setSeasonDetails(content?.seasonDetails);
            setSelectedSeason(content?.seasonDetails[0]?.season_id);
            setVideoLink(content?.trailer_url);
        }
    }, [content]);

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
        } else {
            const response = await GetAuthContentDetails(authPayload);
            setContent(response.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [contentId]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchContent();
        });
        return unsubscribe;
    }, [navigation]);

    // useFocusEffect(
    //     useCallback(() => {
    //         return () => {
    //             if (video.current) {
    //                 video.current.pauseAsync();
    //             }
    //         };
    //     }, [])
    // );

    const handleSeasonPress = (id) => {
        setSelectedSeason(id);
        setIsLoading(true);
    };

    const renderEpisodes = ({ item, index }) => {
        return (
            <EpisodeDetails
                item={item}
                index={index}
                loading={episode_loading || isLoading}
                setVideoUrl={(data) => setVideoLink(data)}
                setContentType={(data) => setContentType(data)}
                setepisodesId={(data) => setepisodesId(data)}
            />
        );
    };

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
                setContentType={(data) => setContentType(data)}
                episodesId={episodesId}
            />

            {loading ? (
                <View style={{ padding: 15 }}>
                    <ContentLoader />
                </View>
            ) : (
                <ScrollView>
                    <ContentDetails
                        contentDetails={seriesDetails}
                        userData={
                            userData ? userData : forMobileData ? forMobileData : signupData
                        }
                        isWatchListed={content?.watch_list}
                        setContentType={(data) => setContentType(data)}
                        setPlayingFullScreen={(data) => setPlayingFullScreen(data)}
                        setVideoUrl={(data) => setVideoLink(data)}
                        setepisodesId={(data) => setepisodesId(data)}

                    />

                    <StarCasts castDeatils={castDeatils} />

                    <View style={styles.seasonContainer}>
                        {seasonDetails.map((season) => {
                            return (
                                <SeasonDetails
                                    key={season.season_id}
                                    season={season}
                                    selectedSeason={selectedSeason}
                                    handleSeasonPress={handleSeasonPress}
                                    setVideoUrl={(data) => setVideoLink(data)}
                                    setContentType={(data) => setContentType(data)}
                                />
                            );
                        })}
                    </View>

                    <View style={{ marginBottom: 10, marginHorizontal: 15 }}>
                        <FlatList
                            horizontal
                            data={episodesDetails}
                            renderItem={renderEpisodes}
                            keyExtractor={(item) => item?.episode_id}
                        />
                    </View>

                    <SimilarContents
                        content={related}
                        setContent={(data) => setContentId(data)}
                    />
                </ScrollView>
            )}
        </View>
    );
};

export default SeriesDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },

    video: {
        width: width,
        height: 250,
    },

    seasonContainer: {
        borderTopWidth: 2,
        borderColor: "#343539",
        marginHorizontal: 15,
        flexDirection: "row",
        // marginVertical: 10,
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

    progressBarContainer: {
        bottom: 8,
        width: width,
    },
    progressBar: {
        // height: 100,
        width: width + 30,
        alignSelf: "center",
    },
});
