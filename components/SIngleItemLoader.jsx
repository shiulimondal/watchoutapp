import SkeletonLoading from 'expo-skeleton-loading';
import React from "react";
import { View } from 'react-native';

const SIngleItemLoader = () => {
    return (
        <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
            <View style={{ marginHorizontal: 25, background: "#3e3e3eff" }}>
                <View
                    style={{ width: 150, height: 17, borderRadius: 5, background: "#3e3e3eff" }}
                />
            </View>
        </SkeletonLoading>
    );
};

export default SIngleItemLoader;
