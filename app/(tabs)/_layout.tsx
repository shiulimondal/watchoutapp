import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import {
    Dimensions,
    Image,
    Pressable,
    useWindowDimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import HomeIcon from "@/components/svgComponents/HomeIcon";
import WatchListIcon from "@/components/svgComponents/WatchListIcon";
import UpcomingIcon from "@/components/svgComponents/UpcomingIcon";
import ProfileIcon from "@/components/svgComponents/ProfileIcon";
import { useDispatch } from "react-redux";
import { stopGlobalVideo } from "@/redux/features/VideoProgressSlice";

const { width, height } = Dimensions.get("window");

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const dispatch = useDispatch();

    const handleTabPress = () => {
        dispatch(stopGlobalVideo());
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.dark.activeTab,
                tabBarInactiveTintColor: Colors.dark.inActiveTab,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.dark.tabBackground,
                    paddingTop: 8,
                    borderColor: Colors.dark.tabBackground,
                    display: isLandscape ? "none" : "flex",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "",

                    tabBarIcon: ({ color, focused }) => (
                        // focused ? (
                        //   <Image source={require("../../assets/icons/home.png")} />
                        // ) : (
                        //   <Image source={require("../../assets/icons/inactivehome.png")} />
                        // ),
                        <HomeIcon color={focused ? Colors.dark.secondary : "gray"} />
                    ),
                }}
            // listeners={{ tabPress: handleTabPress, }}
            />
            <Tabs.Screen
                name="WatchList"
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => (
                        // focused ? (
                        //   <Image source={require("../../assets/icons/subscriptions.png")} />
                        // ) : (
                        //   <Image
                        //     source={require("../../assets/icons/inactivesubscriptions.png")}
                        //   />
                        // ),
                        <WatchListIcon color={focused ? Colors.dark.secondary : "gray"} />
                    ),
                }}
                listeners={{ tabPress: handleTabPress, }}
            />

            <Tabs.Screen
                name="Notifications"
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => (
                        // focused ? (
                        //   <Image source={require("../../assets/icons/notifications.png")} />
                        // ) : (
                        //   <Image
                        //     source={require("../../assets/icons/inactivenotifications.png")}
                        //   />
                        // ),
                        <UpcomingIcon color={focused ? Colors.dark.secondary : "gray"} />
                    ),
                }}
                listeners={{ tabPress: handleTabPress, }}
            />

            <Tabs.Screen
                name="Profile"
                options={{
                    title: "",
                    tabBarIcon: ({ color, focused }) => (
                        // focused ? (
                        //   <Image source={require("../../assets/icons/profile.png")} />
                        // ) : (
                        //   <Image
                        //     source={require("../../assets/icons/inactiveprofile.png")}
                        //   />
                        // ),
                        <ProfileIcon color={focused ? Colors.dark.secondary : "gray"} />
                    ),
                }}
                listeners={{ tabPress: handleTabPress, }}
            />
        </Tabs>
    );
}
