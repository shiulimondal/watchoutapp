import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import { useDispatch, useSelector } from "react-redux";
import { readData } from "@/util/Util";
import { View } from "react-native";
import Colors from "@/constants/Colors";
import { signin } from "@/redux/features/auth/LoginSlice";

const StackNavigation = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    console.log(isAuthenticated, "isAuthenticated");

    // useEffect(() => {
    //   setTimeout(() => {
    //     router.replace("/gettingstarted");
    //   }, 3000);
    //   router.replace("/");
    // }, []);

    useEffect(() => {
        readData("has_user_started")
            .then((response) => {
                if (response) {
                    useProtectedRoute(response);
                    console.log(response, "has_user_started");
                    readData("user_data").then((response) => {
                        if (response) {
                            dispatch(signin(response));
                        }
                    });
                } else {
                    useProtectedRoute(isAuthenticated);
                    readData("user_data").then((response) => {
                        if (response) {
                            dispatch(signin(response));
                        }
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function useProtectedRoute(isAuthenticated) {
        if (!isAuthenticated) {
            setTimeout(() => {
                router.replace("/gettingstarted");
            }, 3000);
            router.replace("/");
        } else {
            setTimeout(() => {
                router.replace("/(tabs)/home");
            }, 3000);
            router.replace("/");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#000000" }}>
            {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
            <Stack screenOptions={{ animation: "fade" }}>
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: false,
                        animation: "fade",
                    }}
                />
                <Stack.Screen
                    name="(public)/gettingstarted"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(public)/MovieDetails"
                    options={{
                        headerShown: false,
                        orientation: "portrait",
                        animation: "fade",
                    }}
                />
                <Stack.Screen
                    name="(public)/SeriesDetails"
                    options={{
                        headerShown: false,
                        // orientation: "portrait",
                        animation: "fade",
                    }}
                />
                <Stack.Screen
                    name="(public)/Search"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="(public)/VideoPlayer"
                    options={{
                        headerShown: false,
                        orientation: "landscape",
                        animation: "fade",
                    }}
                />
                <Stack.Screen
                    name="(public)/CastDetails"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen name="(public)/Login" options={{ headerShown: false }} />
                <Stack.Screen
                    name="(public)/OtpScreen"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="(public)/Signup" options={{ headerShown: false }} />
                <Stack.Screen
                    name="(public)/Account"
                    options={{ headerShown: false, animation: "none" }}
                />
                <Stack.Screen
                    name="(public)/EditProfile"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="(public)/MyPlan"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="(public)/SubscriptionPlans"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="(public)/ActiveDevices"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(public)/ManageDevices"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(public)/TermsConditions"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="(public)/PrivacyPolicy"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="(public)/Refund"
                    options={{ headerShown: false, animation: "fade" }}
                />
            </Stack>
            {/* </ThemeProvider> */}
        </View>
    );
};

export default StackNavigation;
