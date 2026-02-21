import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Colors from "../../constants/Colors";
import NotificationsLoader from "../../components/NotificationsLoader";
import moment from "moment";
import { useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUpcomingContents } from "../../redux/features/details/UpcomingContentsSlice";
import LottieView from "lottie-react-native";
const { width, height } = Dimensions.get("window");

const Notifications = () => {
    const animation = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.upcoming);
    const [notificatons, setNotifications] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(getUpcomingContents());
        });
        return unsubscribe;
    }, [navigation]);

    const renderNotificatons = ({ item, index }) => {
        if (loading) {
            return <NotificationsLoader />;
        }
        return (
            <>
                <View style={styles.contentContainer}>
                    <View style={{ alignItems: "center", gap: -5 }}>
                        {/* <Image
              source={require("../../assets/logo.png")}
              style={styles.contentProviderImage}
            /> */}
                        <Text style={styles.dateDay}>
                            {moment(item.release_date).format("DD")}
                        </Text>
                        <Text style={styles.dateMonth}>
                            {moment(item.release_date).format("MMM")}
                        </Text>
                    </View>
                    <View style={styles.contentBox}>
                        <Text style={styles.contentHeading}>{item.title}</Text>
                        <Text style={styles.contentDesc}>{item.short_description}</Text>
                        <View style={{ marginVertical: 10 }}>
                            <Image
                                source={{ uri: item.feature_image }}
                                style={styles.contentImage}
                            />
                        </View>

                        <View style={styles.contentTagBox}>
                            <Text style={{ color: "gray", fontSize: 10 }}>
                                {item.content_type.charAt(0).toUpperCase() +
                                    item.content_type.slice(1)}
                            </Text>
                        </View>

                        {/* <View style={{ flexDirection: "row", gap: 5 }}>
              {item.tags.map((tag, index) => {
                return (
                  <View key={tag.id} style={styles.contentTagBox}>
                    <Text style={{ color: "gray", fontSize: 10 }}>
                      {tag.tag}
                    </Text>
                    {index + 1 < item.tags.length && (
                      <Text style={{ color: "gray", fontSize: 17 }}>•</Text>
                    )}
                  </View>
                );
              })}
            </View> */}
                    </View>
                </View>
                {index + 1 < notificatons.length && (
                    <View style={styles.contentSeperator}></View>
                )}
            </>
        );
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    marginVertical: 20,
                    padding: 20,
                    paddingBottom: 0,
                    paddingTop: 25,
                }}
            >
                <Text style={styles.topHeader}>Upcoming</Text>
            </View>

            {data?.length > 0 ? (
                <FlatList
                    data={data}
                    renderItem={renderNotificatons}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <View style={styles.animationContainer}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                            width: 150,
                            height: 150,
                            backgroundColor: Colors.dark.primary100,
                        }}
                        source={require("../../assets/animations/notfound.json")}
                    />

                    <Text style={{ color: "white", marginVertical: 20, fontSize: 15 }}>
                        Keep looking, new contents are coming!
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },

    topHeader: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },

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
        borderWidth: 2,
        borderColor: "white",
    },

    contentBox: {
        gap: 5,
    },

    contentHeading: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
    },
    contentDesc: {
        color: "white",
        fontSize: 12,
        width: width - 120,
        lineHeight: 16,
        fontWeight: "300",
    },

    contentImage: {
        width: 300,
        height: 180,
        borderRadius: 10,
        // borderWidth: 0.6,
        // borderColor: "white",
        marginRight: 14,
    },

    contentSeperator: {
        borderWidth: 0.2,
        borderStyle: "dashed",
        borderColor: "gray",
        marginBottom: 20,
        marginHorizontal: 20,
    },

    dateDay: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    dateMonth: {
        color: "white",
        fontSize: 16,
    },

    contentTagBox: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },
    animationContainer: {
        backgroundColor: Colors.dark.primary100,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
});
