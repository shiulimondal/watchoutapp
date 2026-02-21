import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Button,
    ActivityIndicator,
    ToastAndroid,
    Alert,
    Platform
} from "react-native";
// import RazorpayCheckout from "react-native-razorpay";
import { useDispatch, useSelector } from "react-redux";
import TickIcon from "../components/svgComponents/TickIcon";
import CrossIcon from "../components/svgComponents/CrossIcon";
import { makePayment } from "../redux/features/MakePaymentSlice";
import { useRouter } from "expo-router";
import { couponDiscount } from "../redux/features/details/CouponDetailsSlice";
import ModalComponent from "./ModalComponent";
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import { v4 as uuidv4 } from "uuid";
import DeviceInfo from 'react-native-device-info';
import { useIAP } from 'expo-iap';
import Toast from 'react-native-simple-toast';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const SubscriptionContainer = ({
    item,
    index,
    currentIndex,
    activePlan,
    setIsPaid,
    setIsVerifying
}) => {


    const router = useRouter();
    const { userData, user_loading } = useSelector((state) => state.login);
    // console.log('=============userData=======================', userData);

    const signupData = useSelector((state) => state.account.data);
    console.log('=============signupData=======================', signupData);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    console.log('=============forMobileData=======================', forMobileData);
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.userDetails);
    const [newPrice, setNewPrice] = useState(item.price);
    const [modalVisible, setModalVisible] = useState(false);
    const [referralCode, setReferralCode] = useState("");
    const { coupon_data, coupon_loading } = useSelector((state) => state.coupon);
    const [subscriptionPlanSelected, setSubscriptionPlanSelected] =
        useState(null);

    const [discountPercentage, setDiscountPercentage] = useState(null);
    const [isReferalCodeApplied, setIsReferalCodeApplied] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [isCouponCodeAvailable, setIsCouponCodeAvailable] = useState(false);
    const [couponId, setCouponId] = useState(null);
    const { payment_data, payment_loading } = useSelector(
        (state) => state.verify
    );

    const [selected, setSelected] = useState(false);
    console.log('get user data from asyncStorage:-------', selected);

    useEffect(() => {
        const getData = async () => {
            try {
                const userValue = await AsyncStorage.getItem('user_data')
                if (userValue !== null) {
                    setSelected(JSON.parse(userValue))
                }
            } catch (err) {
                console.log('Error reading from AsyncStorage:', err)
            }
        };
        getData();
    }, []);

    // ====================== ios IAP with react-native-iap ======================

    const {
        connected,
        products,
        fetchProducts,
        requestPurchase,
        currentPurchase,
        finishTransaction,
    } = useIAP();

    const productIds = ['com.ottwatchout.basic.plan'];

    useEffect(() => {
        if (connected) {
            // Fetch your products
            fetchProducts({ skus: productIds, type: 'inapp' });
        }
    }, [connected]);

    useEffect(() => {
        if (currentPurchase) {
            const completePurchase = async () => {
                try {
                    console.log('Purchase completed:', currentPurchase.id);
                    await finishTransaction({
                        purchase: currentPurchase,
                        isConsumable: true,
                    });
                    await iapApiCall(currentPurchase);
                } catch (error) {
                    console.error('Failed to complete purchase:', error);
                }
            };
            completePurchase();
        }
    }, [currentPurchase]);

    const handleIosIapPayment = async () => {
        const productId = productIds[0];
        try {
            await requestPurchase({
                request: {
                    ios: {
                        sku: productId,
                    },
                    android: {
                        skus: [productId],
                    },
                },
            });
        } catch (error) {
            console.error('Purchase failed:', error);
        }
    };

    // Your API call function
    const iapApiCall = async (purchase) => {
        const user_id =
            userData?.data?.user_id ??
            forMobileData?.data?.user_id ??
            signupData?.data?.user_id;

        const token = userData?.token ?? forMobileData?.token ?? signupData?.token;

        const payload = {
            user_id,
            subscription_id: subscriptionPlanSelected?.subscription_id,
            currency: "INR",
            amount: Math.ceil(newPrice),
            previous_subscription_id:
                activePlan?.Subscription?.subscription_id ?? null,
            transaction_id: purchase.transactionDate,
            order_id: purchase.id,
        };
        try {
            const response = await fetch('https://watchoutonline.in/api/v1/payment/verify-apple-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log(data, 'data data');
            if (data.status) {
                // Update user's subscription status in your app
                alert('Purchase verified and processed successfully');
                setIsPaid(true);
                router.replace("/(tabs)/home");
            } else {
                console.error('Purchase verification failed:', data.error);
            }

        } catch (error) {
            console.error('API call failed:', error);
        }
    };

    // ====================== ios IAP Purchase Handler ======================     


    useEffect(() => {
        if (data?.plan_status && item.price > activePlan?.Subscription?.price) {
            const discountedPrice = calculateDiscountedPrice(
                activePlan?.Subscription?.price,
                item.price
            );
            setNewPrice(discountedPrice);
        } else {
            setNewPrice(item.price);
        }
    }, [data?.plan_status, item.price, activePlan]);


    const handlePayment = async () => {
        const platform = DeviceInfo.getSystemName(); // 'Android' or 'iOS'

        if (platform === 'Android') {
            await handlePhonePePayment(); // keep your existing logic here
        }
        else if (platform === 'iOS') {
            await handleIosIapPayment(); // write this function below
        }
        else {
            Alert.alert("Unsupported Platform", `Payments are not available on ${platform}`);
        }
    };

    const handlePhonePePayment = async () => {
        try {
            const flowId = uuidv4();
            const environment = 'PRODUCTION'; // Use 'PRODUCTION' or 'SANDBOX' '
            const merchantId = 'M22T6CQ8O6GTR'; // Your merchant ID
            const enableLogging = false; // Turn off logging in production

            // Initialize PhonePe SDK
            const initResult = await PhonePePaymentSDK.init("PRODUCTION", merchantId, uuidv4(), true);
            console.log("Init result:", initResult);
            if (!initResult) throw new Error('PhonePe SDK initialization failed');
            // console.log('✅ PhonePe SDK Initialized');

            // 1. Fetch access token from your backend
            const tokenRes = await fetch(`${process.env.EXPO_PUBLIC_URL}/payment/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchantId }),
            });

            if (!tokenRes.ok) {
                const errorText = await tokenRes.text();
                throw new Error(`Token API failed: ${tokenRes.status} ${errorText}`);
            }

            const tokenData = await tokenRes.json();
            console.log('Token API response:-----------------', tokenData);

            const accessToken = tokenData?.data?.access_token;
            console.log('Token API response:🧨🧨-----------------', accessToken);
            if (!accessToken) throw new Error('Access token retrieval failed');

            // 2. Create order on your backend
            const merchantOrderId = `TX${Date.now()}`;
            const amountInPaise = Math.ceil(newPrice) * 100;

            const orderPayload = {
                subscription_id: subscriptionPlanSelected?.subscription_id,
                currency: "INR",
                previous_subscription_id: activePlan?.Subscription?.subscription_id ?? null,
                user_id: userData?.data?.user_id || selected?.data?.user_id,
                merchantOrderId,
                amount: amountInPaise,
                paymentInstrument: { type: 'PG_CHECKOUT' },
                access_token: accessToken,
                redirectUrl: 'https://watchoutonline.in/api/v1/payment/wehBook',
                metaInfo: {
                    udf1: userData?.data?.first_name || forMobileData?.data?.first_name || signupData?.data?.first_name || '',
                    udf2: userData?.data?.email || forMobileData?.data?.email || signupData?.data?.email || '',
                    udf3: userData?.data?.phone || forMobileData?.data?.phone || signupData?.data?.phone || '',
                    udf4: userData?.data?.user_id || selected?.data?.user_id || forMobileData?.data?.user_id || signupData?.data?.user_id || '',
                },
            };

            console.log('Order----------- res:', orderPayload);

            // const orderRes = await fetch('https://watchoutonline.in/api/v1/payment/order', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(orderPayload),
            // });

            const orderRes = await fetch(`${process.env.EXPO_PUBLIC_URL}/payment/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            if (!orderRes.ok) {
                const errorText = await orderRes.text();
                throw new Error(`Order API failed: ${orderRes.status} ${errorText}`);
            }

            const orderData = await orderRes.json();
            console.log('Order API response:--------------', orderData);

            const order = orderData?.responseData;
            if (!order?.orderId || !order?.token) throw new Error('Invalid order creation response');

            // 3. Prepare request body for PhonePe SDK
            const sdkRequestBody = JSON.stringify({
                merchantId,
                orderId: order.orderId,
                paymentMode: { type: 'PAY_PAGE' },
                token: order.token,
                redirectUrl: 'https://watchoutonline.in/api/v1/payment/wehBook',
                callbackUrl: 'https://watchoutonline.in/api/v1/payment/wehBook',
            });
            console.log('✅ sdkRequestBody:--------------', sdkRequestBody);

            try {
                const paymentRes = await PhonePePaymentSDK.startTransaction(sdkRequestBody, null);
                console.log('✅ Transaction Result:--------------', paymentRes);
                //  const paymentId = uuidv4();
                //   onVerify(paymentId, merchantOrderId, accessToken, "phonepe");
                if (paymentRes.status === 'SUCCESS') {
                    console.log('Payment Success', paymentRes?.status);

                    const paymentId = uuidv4();
                    onVerify(paymentId, merchantOrderId, accessToken);
                    //  onVerify(order.orderId, merchantOrderId, order.token, "phonepe");
                } else if (paymentRes.status === 'CANCELLED') {
                    console.log('Payment Cancelled', 'User cancelled the transaction');
                } else if (paymentRes.status === 'FAILURE') {
                    console.log('Payment Failed', paymentRes.error || 'Transaction failed');
                }
            } catch (err) {
                console.error('SDK startTransaction error:', err);
                console.log('Payment Error', err.message || 'Something went wrong during payment');
            }
        } catch (err) {
            console.error('🚨 Payment Error:', err);
            Alert.alert('Error', err.message || 'Something went wrong during payment');
        }
    };



    const onVerify = async (
        orderId,
        merchantOrderId = null,
        orderToken = null,
        // platform = "phonepe" // "phonepe" or "iap_ios"
    ) => {
        setIsVerifying(true);

        console.log('==================orderId==================', orderId);
        console.log(merchantOrderId);
        console.log('===================OrderToken=================', orderToken);

        const user_id =
            userData?.data?.user_id ??
            forMobileData?.data?.user_id ??
            signupData?.data?.user_id;

        const token = userData?.token ?? forMobileData?.token ?? signupData?.token;

        const payload = {
            user_id,
            subscription_id: subscriptionPlanSelected?.subscription_id,
            currency: "INR",
            amount: Math.ceil(newPrice),
            previous_subscription_id:
                activePlan?.Subscription?.subscription_id ?? null,
            transaction_id: orderId,
            // merchantOrderId: platform === "phonepe" ? merchantOrderId : null,
            merchantOrderId: merchantOrderId,
            // access_token: platform === "phonepe" ? orderToken : null,
            access_token: orderToken,
            // platform,
        };

        const sendAuthPostData = async (url, obj, token) => {
            try {
                console.log("➡️ Sending Payload:", JSON.stringify(obj, null, 2));
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(obj),
                });
                return await response.json();
            } catch (err) {
                console.error("❌ Fetch error:", err);
                throw err;
            }
        };

        try {
            const url = `${process.env.EXPO_PUBLIC_URL}/payment/verifyOrder`;
            console.log("🌐 API Endpoint:", url);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Verify call timed out")), 15000)
            );

            const res = await Promise.race([
                sendAuthPostData(url, payload, token),
                timeoutPromise,
            ]);

            console.log("✅ Response from /verifyOrder:", JSON.stringify(res, null, 2));

            if (res?.status === true) {
                setIsPaid(true);
                router.replace("/(tabs)/home");
                // ToastAndroid.show("Payment Successful", ToastAndroid.BOTTOM);
                Toast.show("Payment Successful", Toast.LONG);
            } else {
                Toast.show(res?.message || "Payment Failed", Toast.LONG);
                // ToastAndroid.show(res?.message || "Payment Failed", ToastAndroid.BOTTOM);
            }
        } catch (error) {
            console.error("❌ Error in onVerify:", error);
            // ToastAndroid.show("Something went wrong", ToastAndroid.BOTTOM);
            Toast.show("Something went wrong", Toast.LONG);
        } finally {
            setIsVerifying(false);
        }

    };




    const getNumberOfDays = (date1, date2) => {
        const date1Str = new Date(date1);
        const date2Str = new Date(date2);
        const timeDifference = date2Str - date1Str;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        return Math.floor(daysDifference);
    };

    const calculateDiscountedPrice = (activePrice, actualPrice) => {
        let planTotalDays = getNumberOfDays(
            activePlan?.updatedAt,
            activePlan?.expiration_date
        );

        let completedDays = getNumberOfDays(activePlan?.updatedAt, new Date());

        let remainingDays = planTotalDays - completedDays;

        let perdayDayPrice = 0;

        if (actualPrice > activePrice) {
            perdayDayPrice = activePrice / planTotalDays;
        }
        let discountedPrice = perdayDayPrice * remainingDays;
        let newPrice = actualPrice - discountedPrice;

        return Math.round(newPrice);
    };

    const handleSubscribePress = (item) => {
        setIsCouponCodeAvailable(true);
        setSubscriptionPlanSelected(item);
    };

    useEffect(() => {
        if (coupon_data?.status) {
            setDiscountPercentage(coupon_data?.data?.discounted_amount);
            setCouponId(coupon_data?.data?.coupon_id);
        } else {
            setDiscountPercentage(0);
        }
    }, [coupon_data]);

    const handleReferralSubmit = () => {
        const payload = {
            data: {
                user_id: userData
                    ? userData?.data?.user_id
                    : forMobileData
                        ? forMobileData?.data?.user_id
                        : signupData?.data?.user_id,
                coupon_code: referralCode,
            },
            token: userData
                ? userData?.token
                : forMobileData
                    ? forMobileData?.token
                    : signupData?.token,
        };

        dispatch(couponDiscount(payload));
        setIsReferalCodeApplied(true);
    };

    const handleUseCoupon = (price) => {
        setModalVisible(false);
        setIsApplied(true);
        setNewPrice(price);
    };

    const handleCouponCodeAvailable = () => {
        setIsCouponCodeAvailable(false);
        setModalVisible(true);
    };
    return (
        <View style={styles.subsriptionsContainer}>
            <View
                style={[
                    styles.subsriptionBox,
                ]}
            >
                <View style={styles.typeOfPlanBox}>
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                        {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                    </Text>
                </View>
                <Text numberOfLines={2} style={[styles.subsriptionTitle,]}>
                    {item.ex_month} months
                </Text>
                <Text numberOfLines={2} style={[styles.subsriptionTitle,]}>
                    of {item.title.charAt(0).toUpperCase() + item.title.slice(1)} Plan
                </Text>
                <Text numberOfLines={2} style={[styles.subsriptionTitle,]}>
                    Just{" "}
                    <Text style={{ color: Colors.dark.secondary }}>₹{item.price}{"  "}
                        {data?.plan_status &&
                            item.price > activePlan?.Subscription?.price &&
                            !isApplied &&
                            currentIndex === index && (
                                <Text style={{ color: "white", fontSize: 15, letterSpacing: 1 }}>
                                    (* Pay just{"  "}
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "700",
                                        }}
                                    >
                                        ₹
                                        {item.price > activePlan?.Subscription?.price
                                            ? calculateDiscountedPrice(
                                                activePlan?.Subscription?.price,
                                                item.price
                                            )
                                            : item.price})
                                    </Text>
                                </Text>
                            )}
                        {subscriptionPlanSelected?.Subscription?.subscription_id ===
                            item?.Subscription?.subscription_id &&
                            isApplied && (
                                <Text style={{ color: "white", fontSize: 15, letterSpacing: 1, lineHeight: 18 }}>
                                    (* Pay just{"  "}
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 15,
                                            fontWeight: "700",
                                        }}
                                    >
                                        ₹{Math.ceil(newPrice)})
                                    </Text>
                                </Text>
                            )}</Text>
                </Text>
                <Text
                    style={{ color: "white", marginTop: 0, marginBottom: 15, lineHeight: 18, fontSize: 14, }}
                >  {item.desc}
                </Text>
                <View style={{ gap: 10 }}>
                    {item?.features?.length > 0 &&
                        item?.features?.map((i, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    {i.isAvailable == 1 ? <TickIcon /> : <CrossIcon />}

                                    <Text style={{ color: "white", fontSize: 13 }}>{i.desc}</Text>
                                </View>
                            );
                        })}
                </View>


                <TouchableOpacity
                    disabled={
                        activePlan?.Subscription?.subscription_id === item.subscription_id || payment_loading
                    }
                    activeOpacity={0.8}
                    onPress={() => {
                        isApplied ? handlePayment() : handleSubscribePress(item);
                    }}
                >
                    <View style={[
                        styles.button,
                        {
                            backgroundColor: activePlan?.Subscription?.subscription_id === item.subscription_id
                                ? 'gray'
                                : Colors.dark.secondary,
                        },
                    ]}>
                        {payment_loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ color: 'white', fontSize: 15 }}>
                                {activePlan?.Subscription?.subscription_id === item.subscription_id
                                    ? 'Subscribed'
                                    : 'Subscribe'}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => router.push("/TermsConditions")}>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>
                        Terms & Conditions
                    </Text>
                </TouchableOpacity>

                <ModalComponent
                    visible={isCouponCodeAvailable}
                    title="Do you have any coupon code?"
                    options={[
                        { label: "Yes", onPress: handleCouponCodeAvailable },
                        {
                            label: "No",
                            onPress: () => {
                                setIsCouponCodeAvailable(false);
                                handlePayment();
                            },
                        },
                    ]}
                    onRequestClose={() => setIsCouponCodeAvailable(false)}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Enter Referral Code</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Referral Code"
                                placeholderTextColor="#888"
                                value={referralCode}
                                onChangeText={(text) => setReferralCode(text)}
                                onFocus={() => setIsReferalCodeApplied(false)}
                            />
                            {isReferalCodeApplied &&
                                coupon_data?.status === true &&
                                !coupon_loading ? (
                                <Text
                                    style={{
                                        color: "green",
                                        fontWeight: "800",
                                        marginBottom: 15,
                                    }}
                                >
                                    {`You will save ₹ ${Math.ceil(
                                        subscriptionPlanSelected?.price * (discountPercentage / 100)
                                    )}`}
                                </Text>
                            ) : isReferalCodeApplied &&
                                coupon_data?.status === false &&
                                !coupon_loading ? (
                                <Text
                                    style={{
                                        color: "red",
                                        fontWeight: "800",
                                        marginBottom: 15,
                                        textAlign: "center",
                                    }}
                                >
                                    Invalid referral code
                                </Text>
                            ) : null}

                            {isReferalCodeApplied && coupon_data?.status === true ? (
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={() => {
                                            if (activePlan) {
                                                handleUseCoupon(
                                                    calculateDiscountedPrice(
                                                        activePlan?.Subscription?.price,
                                                        item.price
                                                    ) -
                                                    subscriptionPlanSelected?.price *
                                                    (discountPercentage / 100)
                                                );
                                            } else {
                                                setNewPrice(
                                                    item.price -
                                                    subscriptionPlanSelected?.price *
                                                    (discountPercentage / 100)
                                                );
                                                setModalVisible(false);
                                                setIsApplied(true);
                                            }
                                        }}
                                    >
                                        {coupon_loading ? (
                                            <ActivityIndicator color={"white"} size={"small"} />
                                        ) : (
                                            <Text style={styles.modalButtonText}>Apply</Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: "gray" }]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={[styles.modalButtons]}>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={handleReferralSubmit}
                                    >
                                        {coupon_loading ? (
                                            <ActivityIndicator color={"white"} size={"small"} />
                                        ) : (
                                            <Text style={styles.modalButtonText}>Submit</Text>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: "gray" }]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>


        </View>
    );
};

export default SubscriptionContainer;

const styles = StyleSheet.create({
    subsriptionsContainer: {
        marginHorizontal: 15,
    },
    subsriptionBox: {
        borderWidth: 1,
        borderColor: Colors.dark.secondary,
        width: width - 80,
        height: "71%",
        padding: 15,
        borderRadius: 15,
        backgroundColor: "rgba(0,0,0,0.8)",
        paddingVertical: 20,
        paddingTop: 40,
    },

    subsriptionTitle: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },

    button: {
        backgroundColor: Colors.dark.secondary,
        paddingVertical: 15,
        marginTop: 35,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    typeOfPlanBox: {
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
        paddingHorizontal: 10,
        position: "absolute",
        alignSelf: "flex-end",
        right: 15,
        top: 15,
    },

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        backgroundColor: Colors.dark.primary100,
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "white",
    },
    input: {
        height: 40,
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: "#fff",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        width: "100%",
    },

    modalButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: Colors.dark.secondary,
        borderRadius: 5,
    },

    modalButtonText: {
        color: "white",
        fontSize: 16,
    },
});
