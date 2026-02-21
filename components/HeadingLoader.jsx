import SkeletonLoading from 'expo-skeleton-loading';
import React from "react";
import { View } from 'react-native';

const HeadingLoader = ({ styles }) => {
    return (
        <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 15,
                    marginVertical: 12,
                    marginTop: 30,
                    ...styles,
                }}
            >
                <View
                    style={{ width: 150, height: 20, borderRadius: 5, backgroundColor: "#3e3e3eff", }}
                />
            </View>
        </SkeletonLoading>
    );
};

export default HeadingLoader;
