import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import Colors from "../../constants/Colors";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Assets from "../../components/Assets";
import { useDispatch, useSelector } from "react-redux";
import { getCastDetails } from "../../redux/features/details/CastDetailsSlice";
import moment from "moment";
import ContentLoader from "../../components/ContentLoader";
import SkeletonLoading from "expo-skeleton-loading";
import HorizontalAssets from "../../components/HorizontalAssets";


const { width, height } = Dimensions.get("window");

const CastDetails = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const dispatch = useDispatch();
    const [showFullDetails, setShowFullDetails] = useState(false);
    const [fullDetailText, setFullDetailsText] = useState("");
    const [castDetails, setCastDetails] = useState(null);
    const [relatedContent, setRelatedContent] = useState([]);

    const { content, loading } = useSelector((state) => state.cast);

    useEffect(() => {
        setCastDetails(content?.data);
        setFullDetailsText(content?.data?.bio);
        setRelatedContent(content?.contentData);
    }, [content]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(getCastDetails(params?.cast_id));
        });
        return unsubscribe;
    }, [navigation]);

    const toggleDetails = () => {
        setShowFullDetails(!showFullDetails);
    };

    const renderRelated = ({ item }, type) => {
        return <HorizontalAssets item={item} type={type} />;
    };

    const backHandler = () => {
        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <View>
                    <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                        <View
                            style={{
                                marginBottom: 20,
                                width: width,
                                height: height / 3,
                                backgroundColor: '#3e3e3eff'
                            }}
                        />
                    </SkeletonLoading>
                    <View style={{ padding: 15 }}>
                        <ContentLoader />
                    </View>
                </View>
            ) : (
                <View>
                    <ImageBackground
                        source={{ uri: castDetails?.profile_pic }}
                        resizeMode="cover"
                        style={styles.image}
                    >
                        <LinearGradient
                            colors={[Colors.dark.primary100, "rgba(13, 22, 35, 0)"]}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.linearGradient}
                        />
                        <View
                            style={{
                                justifyContent: "space-between",
                                height: "100%",
                                marginHorizontal: 10,
                            }}
                        >
                            <TouchableOpacity onPress={backHandler}>
                                <View style={styles.backHandler}>
                                    <Ionicons
                                        name="arrow-back-outline"
                                        color={"white"}
                                        size={25}
                                    />
                                    {/* <Text style={{ color: "white", fontSize: 20 }}>Back</Text> */}
                                </View>
                            </TouchableOpacity>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>
                                    {castDetails?.full_name}
                                    <Text style={{ fontSize: 25, fontWeight: "300" }}>
                                        {" "}
                                        (
                                        {castDetails?.role?.charAt(0).toUpperCase() +
                                            castDetails?.role?.slice(1)}
                                        )
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={{ marginHorizontal: 15, gap: 10 }}>
                        <View style={styles.castInfoBox}>
                            <Text style={[styles.castInfoText, { fontWeight: "bold" }]}>
                                Birthday:
                            </Text>
                            <Text style={styles.castInfoText}>
                                {moment(castDetails?.birthday).format("DD MMM, yyyy")}
                            </Text>
                        </View>
                        <View style={styles.castInfoBox}>
                            <Text style={[styles.castInfoText, { fontWeight: "bold" }]}>
                                Birth place:
                            </Text>
                            <Text style={styles.castInfoText}>{castDetails?.birthPlace}</Text>
                        </View>
                        <View style={styles.castInfoBox}>
                            <Text style={[styles.castInfoText, { fontWeight: "bold" }]}>
                                Family Member:
                            </Text>
                            <Text style={styles.castInfoText}>
                                {castDetails?.familyMembers}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.castDetailsContainer}>
                        <Text style={styles.castDetails}>
                            {showFullDetails
                                ? fullDetailText
                                : fullDetailText?.substring(0, 150)}
                        </Text>
                    </View>

                    {showFullDetails && (
                        <TouchableOpacity>
                            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                                <Image
                                    source={{
                                        uri: "https://upload.wikimedia.org/wikipedia/commons/6/6a/New-imdb-logo.png",
                                    }}
                                    style={styles.imdbImage}
                                />
                            </View>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={toggleDetails}
                        style={{
                            flexDirection: "row",
                            gap: 5,
                            marginHorizontal: 15,
                            marginVertical: 10,
                        }}
                    >
                        <Text style={styles.readMoreText}>
                            {showFullDetails ? "Read Less" : "Read More"}
                        </Text>
                        <Ionicons
                            name={
                                showFullDetails ? "chevron-up-outline" : "chevron-down-outline"
                            }
                            size={17}
                            color={Colors.dark.secondary}
                        />
                    </TouchableOpacity>

                    <View>
                        <View style={styles.showsView}>
                            <Text
                                style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
                            >
                                Related Content
                            </Text>
                            {/* <TouchableOpacity>
            <Text style={{ color: "white", fontSize: 15 }}>View More</Text>
          </TouchableOpacity> */}
                        </View>

                        <View style={{ marginBottom: 25 }}>
                            <FlatList
                                horizontal
                                data={relatedContent}
                                renderItem={(item) => renderRelated(item, "popular")}
                                keyExtractor={(item) => item.content_id}
                            />
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

export default CastDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },
    image: {
        width: width,
        height: height * 0.45,
    },
    linearGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "80%",
    },
    textContainer: {
        width: width - 30,
        marginBottom: 20,
    },
    text: {
        fontSize: 25,
        fontWeight: "500",
        color: "white",
    },

    castInfoBox: {
        flexDirection: "row",
        gap: 10,
    },

    castInfoText: {
        color: "white",
        fontWeight: "200",
    },

    castDetailsContainer: {
        marginHorizontal: 15,
        marginVertical: 15,
        marginBottom: 5,
    },

    castDetails: {
        color: "gray",
        lineHeight: 20,
    },

    readMoreText: {
        color: Colors.dark.secondary,
    },

    showsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
        marginVertical: 12,
        marginTop: 30,
    },

    backHandler: {
        marginTop: '7%',
        marginHorizontal: '2%',
        flexDirection: "row",
        alignItems: "center",
    },

    imdbImage: {
        width: 60,
        height: 20,
        borderRadius: 5,
    },
});
