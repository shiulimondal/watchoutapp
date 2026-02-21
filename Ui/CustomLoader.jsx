import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Image } from "react-native";
import Colors from "../constants/Colors";


const CustomLoader = ({ size = 30, imageSource }) => {
    const spinAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spin = Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        );
        spin.start();

        return () => spin.stop();
    }, []);

    const rotate = spinAnim.interpolate({
        inputRange: [0, 3],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={styles.overlay}>
            <Animated.Image
                source={imageSource}
                style={[
                    {
                        width: size,
                        height: size,
                        transform: [{ rotate }],
                        tintColor: Colors.dark.secondary
                    },
                ]}
                resizeMode="contain"
            />
        </View>
    );
};

export default CustomLoader;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(13, 22, 35, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
});
