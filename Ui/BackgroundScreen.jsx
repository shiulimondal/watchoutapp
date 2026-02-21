import React from 'react';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get("window");
const BackgroundScreen = ({ children }) => {


    return (
        // <SafeAreaView style={styles.container}>
        //     <StatusBar style="auto" />
            <ImageBackground
                source={require("../assets/get.png")}
                style={styles.imageBackground}
                resizeMode="cover"
            >
                <TouchableOpacity style={{ zIndex: 2 }} onPress={() => router.back()}>
                    <Ionicons
                        name="arrow-back-outline"
                        size={25}
                        color={"white"}
                        style={{ marginTop: 40, marginLeft: 20 }}
                    />
                </TouchableOpacity>
                <LinearGradient
                    colors={[
                        "rgba(13, 22, 35, 1)",
                        "rgba(13, 22, 35, 0.7)",
                        "rgba(13, 22, 35, 0)",
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.gradient}
                />
                {children}
            </ImageBackground>
        // </SafeAreaView>
    );
};

export default BackgroundScreen;

const styles = StyleSheet.create({
    imageBackground: {
        width: width,
        height: "80%",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
});
