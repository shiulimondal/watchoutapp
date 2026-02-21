import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../constants/Colors";
import { useRouter } from "expo-router";
import { stopGlobalVideo } from "../redux/features/VideoProgressSlice";
import { useDispatch } from "react-redux";

const StarCasts = ({ castDeatils }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const handleCastPress = (id) => {
        router.push({
            pathname: "/CastDetails",
            params: {
                cast_id: id,
            },
        });
    };

    return (
        <View
            style={{
                marginVertical: 12,
                marginHorizontal: 15,
                marginRight: 0,
                gap: 10,
                backgroundColor: Colors.dark.primary100,
            }}
        >
            <View style={{}}>
                <Text style={styles.detailsText}>Cast & Crew</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {castDeatils?.map((cast) => {
                    return (
                        <TouchableOpacity
                            key={cast?.artist_id}
                            style={{ marginRight: 15 }}
                            onPress={() => { handleCastPress(cast.artist_id), dispatch(stopGlobalVideo()) }}
                        >
                            <Image
                                source={{ uri: cast?.profile_pic }}
                                style={styles.castImage}
                            />
                            <View style={styles.castTextContainer}>
                                <Text style={styles.castText}>
                                    {cast?.role.charAt(0).toUpperCase() + cast?.role.slice(1)}
                                </Text>
                            </View>

                            <View style={{ alignItems: "center", marginVertical: 7 }}>
                                <Text
                                    style={[
                                        styles.castText,
                                        {
                                            width: "60%",
                                            textAlign: "center",
                                            color: "#ECECEC",
                                            lineHeight: 16,
                                        },
                                    ]}
                                >
                                    {cast?.full_name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default StarCasts;

const styles = StyleSheet.create({
    castImage: {
        width: 130,
        height: 120,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },

    castTextContainer: {
        backgroundColor: Colors.dark.secondary,
        paddingVertical: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: "center",
    },

    castText: {
        fontSize: 12,
        color: "white",
    },

    detailsText: {
        fontSize: 17,
        fontWeight: "bold",
        color: "white",
    },
});
