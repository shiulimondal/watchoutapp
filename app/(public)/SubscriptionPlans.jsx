import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
    Dimensions,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getPlanDetails } from "../../redux/features/details/PlanDetailsSlice";
import SubscriptionContainer from "@/components/SubscriptionContainer";
import BackButton from "@/components/BackButton";
import PaginationDots from "@/components/PaginationDots";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SubscriptionPlans() {
    const { userData, user_loading } = useSelector((state) => state.login);
    const params = useLocalSearchParams();
    console.log(params.activePlan, 'params.planStatus');
    const dispatch = useDispatch();
    const router = useRouter();
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { plan_data, plan_loading } = useSelector((state) => state.plans);
    const [activePlan, setActivePlan] = useState(
        params.planStatus ? JSON.parse(params.activePlan) : null
    );
    const [isVerifying, setIsVerifying] = useState(false);

    const { payment_data, payment_loading } = useSelector(
        (state) => state.payment
    );

    console.log('=======Payment Data==========', payment_data);
    //console.log('=======active Plan Data==========', activePlan);

    const [isPaid, setIsPaid] = useState(false);
    
    useEffect(() => {
        if (payment_data && isPaid) {
            router.push("/(tabs)/home");
            setIsPaid(false);
        }
    }, [payment_data]);

    useEffect(() => {
        if (plan_data && plan_data?.length > 0) {
            setSubscriptionData(plan_data);
        }
    }, [plan_data]);

    useEffect(() => {
        dispatch(getPlanDetails());
    }, []);

    const renderSubscriptions = (item, index) => {
        return (
            <SubscriptionContainer
                item={item}
                index={index}
                currentIndex={currentIndex}
                //activePlan={payment_data}
                activePlan={activePlan}
                setIsPaid={(data) => {
                    setIsPaid(data);
                }}
                setIsVerifying={setIsVerifying}
            />
        );
    };

    const handlePageChange = (event) => {
        const { contentOffset } = event.nativeEvent;
        const index = Math.round(contentOffset.x / (width - 30));
        setCurrentIndex(index);
    };

    // const onBackPress = () => {
    //     router.back();
    // };
    const onBackPress = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <>

            <View style={styles.container}>

                <ImageBackground
                    blurRadius={15}
                    source={require("../../assets/blur.jpg")}
                    style={styles.imageBackground}
                    resizeMode="cover"
                >

                    <View style={[styles.header, { flexDirection: "row", alignItems: "center" }]}>
                        <TouchableOpacity onPress={onBackPress}>
                            <Ionicons name="chevron-back-outline" color={"white"} size={25} />
                        </TouchableOpacity>

                        <Text style={[styles.heading, { marginLeft: 7 }]}>Subscription Plans</Text>
                    </View>

                    {subscriptionData.length > 0 ? (
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            decelerationRate={30}
                            data={subscriptionData}
                            renderItem={({ item, index }) => renderSubscriptions(item, index)}
                            keyExtractor={(item) => item.subscription_id}
                            onScroll={(event) => handlePageChange(event)}
                            pagingEnabled
                            snapToAlignment="center"
                        />
                    ) : (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size={"large"} color={"white"} />
                        </View>
                    )}

                    <View style={styles.paginationDots}>
                        <PaginationDots data={subscriptionData} currentIndex={currentIndex} />
                    </View>


                </ImageBackground>


                {isVerifying && (
                    <View style={styles.overlay}>
                        <View style={styles.loaderBox}>
                            <ActivityIndicator size="small" color="#38A4FF" />
                            <Text style={styles.loaderText}>Verifying...</Text>
                        </View>
                    </View>
                )}

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 999,
    },
    loaderBox: {
        height: 55,
        width: 135,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    loaderText: {
        fontSize: 13,
        marginTop: 5,
        color: '#000',
    },

    imageBackground: {
        width: width,
        height: height + 50,
        backgroundColor: "black",
        opacity: 0.55,
    },
    header: {
        marginVertical: 50,
        marginHorizontal: 20,
    },
    heading: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    loaderContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: height - 70,
    },
    paginationDots: {
        top: "80%",
        position: "absolute",
        alignSelf: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
        justifyContent: "center",
        alignItems: "center",
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
});
