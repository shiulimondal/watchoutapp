import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getMyPlanDetails } from "../../redux/features/details/MyPlanDetailsSlice";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import { getUserDetails } from "../../redux/features/details/ProfileDetailsSlice";

const MyPlan = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const router = useRouter();
    const animation = useRef(null);
    const { userData } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const { my_plan_data, my_plan_loading } = useSelector(
        (state) => state.myPlan
    );



    const { data, loading } = useSelector((state) => state.userDetails);

    console.log('========== Plan status data ========', data.plan_status);

    useEffect(() => {
        let payload = {
            user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
            token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
        };

        let userPayload = {
            user_id: userData ? userData?.data?.user_id : forMobileData ? forMobileData?.data?.user_id : signupData?.data?.user_id,
            token: userData ? userData?.token : forMobileData ? forMobileData?.token : signupData?.token,
        };

        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(getMyPlanDetails(payload));
            dispatch(getUserDetails(userPayload));
        });
        return unsubscribe;
    }, []);

    const handleBackPress = () => {
        router.back();
    };

    const buyPlan = () => {
        router.push("/SubscriptionPlans");
    };

    const getNumberOfDays = (date1, date2) => {
        const date1Str = new Date(date1);
        const date2Str = new Date(date2);

        const timeDifference = date2Str - date1Str;

        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        return Math.floor(daysDifference);
    };

    const calculatePlanRemaining = (date) => {
        if (!date) return null;
        const target = new Date(date);
        const today = new Date();
        const targetDateOnly = new Date(
            target.getFullYear(),
            target.getMonth(),
            target.getDate()
        );
        const todayDateOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const msInDay = 1000 * 60 * 60 * 24;
        return Math.round((targetDateOnly - todayDateOnly) / msInDay);
    };

    const daysRemaining = calculatePlanRemaining(my_plan_data?.expiration_date);
    
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backHandler} onPress={handleBackPress}>
                <Ionicons name="arrow-back-outline" color={"white"} size={22} />
                {/* <Text style={{ color: "white", fontSize: 17 }}>Back</Text> */}
            </TouchableOpacity>
            {my_plan_data ? (
                <LinearGradient
                    colors={["#141E30", "#243B55"]} // Define your gradient colors
                    style={styles.myPlanBox}
                >
                    {daysRemaining <0 &&(
                        <View style={{
                            position:'absolute',
                            paddingHorizontal:10,
                            padding:4,
                            backgroundColor:'#243B55',
                            borderRadius:15,
                            top:-14,
                            left:10
                        }}>
                            <Text style={{
                                fontSize:13,
                                fontWeight:'500',
                                color:'#fff'
                            }}>Last active plan</Text>
                        </View>
                    )}
                
                    <Text style={styles.myPlanTitle}>
                        {my_plan_data?.Subscription?.title} Plan Details
                    </Text>
                    <Text style={styles.myPlanValue}>
                        {my_plan_data?.Payment?.currency}{" "}
                        {my_plan_data?.Subscription?.price}
                    </Text>
                    <Text style={styles.myPlanDays}>
                        For{" "}
                        {getNumberOfDays(
                            my_plan_data?.updatedAt,
                            my_plan_data?.expiration_date
                        )}{" "}
                        days
                    </Text>
                    <Text style={styles.myPlanStartedAt}>
                        Date of Purchase:{" "}
                        {moment(my_plan_data?.updatedAt).format("DD MMM, yyyy")}
                    </Text>
                    <Text style={styles.myPlanDeatils}>
                        All Wathcout Originals & Exclusives, Blockbuster, Movies, Comedies,
                        Shows
                    </Text>
                    <Text style={styles.myPlanDevices}>
                        Watch Ad-Free Movies and Web Series on{" "}
                        {my_plan_data?.Subscription?.no_of_device}{" "}
                        {my_plan_data?.Subscription?.no_of_device > 1
                            ? "devices"
                            : "device"}
                    </Text>

                    <View style={styles.tableRows}>
                        <Text style={styles.tableHeader}>Status</Text>
                        <Text style={styles.tableContent}>
                            {daysRemaining < 0 ? "Inactive" : "Active"}
                        </Text>
                    </View>

                    <View style={styles.tableRows}>
                        <Text style={styles.tableHeader}>Pack Country</Text>
                        <Text style={styles.tableContent}>India</Text>
                    </View>

                    <View style={styles.tableRows}>
                        <Text style={styles.tableHeader}>Payment Mode</Text>
                        <Text style={styles.tableContent}>{my_plan_data?.payment_history?.method}</Text>
                    </View>

                    <View style={styles.tableRows}>
                        <Text style={styles.tableHeader}>Expires On</Text>
                        <Text style={styles.tableContent}>
                            {moment(my_plan_data?.expiration_date).format("DD MMM, yyyy")}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: "/SubscriptionPlans",
                                params: {
                                    activePlan: JSON.stringify(my_plan_data),
                                    planStatus: data.plan_status,
                                },
                            });
                        }}
                    >
                        {daysRemaining < 0 ?
                            <View>
                                <Text
                                    style={{
                                        color: Colors.dark.secondary,
                                        textAlign: "center",
                                        marginTop: 35,
                                        fontSize: 17,
                                    }}
                                >
                                    Buy New plan
                                </Text>
                            </View>
                            :
                            <View>
                                <Text
                                    style={{
                                        color: Colors.dark.secondary,
                                        textAlign: "center",
                                        marginTop: 35,
                                        fontSize: 17,
                                    }}
                                >
                                    
                                    Upgrade your plan
                                </Text>
                            </View>}

                    </TouchableOpacity>
                </LinearGradient>
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
                        Not subscribed to any plan!
                    </Text>
                </View>
            )}
            {!my_plan_data && (
                <TouchableOpacity onPress={buyPlan}>
                    <View style={styles.buyPlanButton}>
                        <Text style={styles.buyPlanText}>Buy Plan</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default MyPlan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.dark.primary100,
    },
    animationContainer: {
        backgroundColor: Colors.dark.primary100,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    backHandler: {
        marginVertical: 30,
        flexDirection: "row",
        alignItems: "center",
    },

    buyPlanButton: {
        backgroundColor: Colors.dark.secondary,
        paddingVertical: 17,
        borderRadius: 10,
        marginVertical: 30,
    },

    buyPlanText: {
        color: "white",
        fontSize: 15,
        fontWeight: "400",
        textAlign: "center",
    },

    myPlanBox: {
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.dark.secondary,
    },

    myPlanTitle: {
        color: Colors.dark.secondary,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },

    myPlanValue: {
        textAlign: "center",
        color: "white",
        fontSize: 20,
        marginVertical: 15,
        fontWeight: "bold",
    },

    myPlanDays: {
        fontSize: 12,
        color: "gray",
        textAlign: "center",
    },

    myPlanStartedAt: {
        textAlign: "center",
        color: "white",
        fontSize: 12,
        marginVertical: 10,
    },

    myPlanDeatils: {
        textAlign: "center",
        color: "gray",
        fontSize: 13,
        marginTop: 15,
        marginBottom: 10,
    },

    myPlanDevices: {
        textAlign: "center",
        color: "gray",
        fontSize: 13,
        marginTop: 5,
        marginBottom: 10,
    },

    tableRows: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: "gray",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },

    tableHeader: {
        color: "gray",
        textAlign: "center",
        flex: 1,
    },

    tableContent: {
        color: "white",
        textAlign: "center",
        flex: 1,
    },
});
