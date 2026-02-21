import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Assets from "./Assets";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const { width, height } = Dimensions.get("window");

const SimilarContents = ({ content, setContent }) => {
    const renderRelated = ({ item }) => {
        // console.log('setContent--++++++++++---------------------+++++++++++++++---', item);
        return <Assets item={item} setContent={(data) => setContent(data)} />;
    };

    return (
        <View style={styles.container}>
            {content?.length > 0 && (
                <View style={styles.showsView}>
                    <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
                        More like this
                    </Text>
                </View>
            )}

            <View style={{ marginBottom: 20 }}>
                <FlatList
                    horizontal
                    data={content}
                    renderItem={renderRelated}
                    keyExtractor={(item) => item?.content_id}
                />
            </View>
        </View>
    );
};

export default SimilarContents;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },
    showsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
        marginVertical: 12,
        marginTop: 10,
    },
});
