import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../constants/Colors";
import EpisodeDetails from "./EpisodeDetails";

const SeasonDetails = ({ season, selectedSeason, handleSeasonPress }) => {
    const renderEpisodes = ({ item }) => {
        return <EpisodeDetails item={item} />;
    };

    return (
        <View>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleSeasonPress(season.season_id)}
            >
                <View key={season.id} style={styles.seasonBox}>
                    <View
                        style={[
                            styles.seasonSelected,
                            {
                                borderColor:
                                    selectedSeason === season.season_id
                                        ? Colors.dark.secondary
                                        : "transparent",
                            },
                        ]}>
                        <Text style={styles.seasonTitle}>
                            Season {season?.season_number}
                        </Text>
                        <Text style={styles.episodesCount}>
                            ({season?.episodes?.length} Episodes)
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default SeasonDetails;

const styles = StyleSheet.create({
    seasonBox: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingRight: 15,
    },

    seasonTitle: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },

    episodesCount: {
        color: "#8D8D8D",
        fontSize: 12,
        marginHorizontal: 5,
    },

    seasonSelected: {
        flexDirection: "row",
        alignItems: "center",
        bottom: 15,
        paddingTop: 10,
        borderTopWidth: 4,
    },
});
