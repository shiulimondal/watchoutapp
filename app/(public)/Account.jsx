import { writeData } from "@/util/Util";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import SkeletonLoading from "expo-skeleton-loading";
import SIngleItemLoader from "../../components/SIngleItemLoader";
import moment from "moment";
import { getUserDetails } from "../../redux/features/details/ProfileDetailsSlice";

const Account = () => {
    const { userData, user_loading } = useSelector((state) => state.login);
    const navigation = useNavigation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.userDetails);
    const [imageLoading, setImageLoading] = useState(true);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);

    useEffect(() => {
        setTimeout(() => {
            setImageLoading(false);
        }, 2000);
    }, []);

    const fetchUserDetails = useCallback(() => {
        if (userData) {
            let payload = {
                user_id: userData?.data?.user_id,
                token: userData?.token,
            };
            dispatch(getUserDetails(payload));
        } else if (signupData) {
            let payload = {
                user_id: signupData?.data?.user_id,
                token: signupData?.token,
            };
            dispatch(getUserDetails(payload));
        }
        else if (forMobileData) {
            let payload = {
                user_id: forMobileData?.data?.user_id,
                token: forMobileData?.token,
            };
            dispatch(getUserDetails(payload));
        }
    }, [dispatch, userData, signupData, forMobileData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchUserDetails();
        });

        return unsubscribe;
    }, [navigation]);

    const editProfile = () => {
        router.push("/EditProfile");
    };

    const handleBackPress = () => {
        router.back();
    };

    return (
        <ScrollView style={style.container}>
            <TouchableOpacity style={style.backHandler} onPress={handleBackPress}>
                <Ionicons name="arrow-back-outline" color={"white"} size={22} />
                {/* <Text style={{ color: "white", fontSize: 17 }}>Back</Text> */}
            </TouchableOpacity>
            {imageLoading || loading ? (
                <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                    <View style={[style.profileDetailsContainer, { background: "#3e3e3eff" }]}>
                        <View
                            style={[style.profileImage, { background: "#3e3e3eff" }]}
                        ></View>
                    </View>
                </SkeletonLoading>
            ) : (
                <View style={style.profileDetailsContainer}>
                    <View style={style.profileImageContainer}>
                        <Image
                            source={
                                data?.profile_pic
                                    ? { uri: data?.profile_pic }
                                    : require("../../assets/user.png")
                            }
                            style={style.profileImage}
                        />
                        <TouchableOpacity
                            style={style.editIconContainer}
                            onPress={editProfile}
                        >
                            <MaterialCommunityIcons name="pencil" color={"white"} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={{ marginVertical: 35, marginBottom: 20 }}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={style.label}>Your Name</Text>

                    <View style={style.infoView}>
                        {loading ? (
                            <SIngleItemLoader />
                        ) : (
                            <Text style={style.value}>{data?.first_name}</Text>
                        )}
                    </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={style.label}>Email Address</Text>
                    <View style={style.infoView}>
                        {loading ? (
                            <SIngleItemLoader />
                        ) : (
                            <Text style={style.value}>{data?.email}</Text>
                        )}
                    </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={style.label}>Phone Number</Text>
                    <View style={style.infoView}>
                        {loading ? (
                            <SIngleItemLoader />
                        ) : (
                            <Text style={style.value}>{data?.phone}</Text>
                        )}
                    </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={style.label}>Gender</Text>
                    <View style={style.infoView}>
                        {loading ? (
                            <SIngleItemLoader />
                        ) : (
                            <Text style={style.value}>
                                {data?.gender
                                    ? data?.gender?.charAt(0).toUpperCase() +
                                    data?.gender?.slice(1)
                                    : "-"}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text style={style.label}>Date of Birth</Text>
                    <View style={style.infoView}>
                        {loading ? (
                            <SIngleItemLoader />
                        ) : (
                            <Text style={style.value}>
                                {data?.date_of_birth
                                    ? moment(data?.date_of_birth).format("yyyy/MM/DD")
                                    : "DD / MM /YYYY"}
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            <TouchableOpacity disabled={loading} onPress={editProfile}>
                <View
                    style={[
                        style.editButton,
                        { backgroundColor: loading ? "gray" : Colors.dark.secondary },
                    ]}
                >
                    <Text style={style.editText}>Edit Profile</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Account;

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.dark.primary100,
    },

    backHandler: {
        marginVertical: 30,
        flexDirection: "row",
        alignItems: "center",
    },

    profileDetailsContainer: {
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    profileImageContainer: {
        position: "relative",
    },

    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: Colors.dark.secondary,
    },

    editIconContainer: {
        position: "absolute",
        top: -5,
        right: 5,
        backgroundColor: Colors.dark.secondary,
        borderRadius: 50,
        padding: 6,
        borderWidth: 5,
        borderColor: Colors.dark.primary100,
    },

    editButton: {
        backgroundColor: Colors.dark.secondary,
        paddingVertical: 17,
        borderRadius: 10,
        marginVertical: 30,
    },

    editText: {
        color: "white",
        fontSize: 15,
        fontWeight: "400",
        textAlign: "center",
    },

    label: {
        color: "gray",
        marginHorizontal: 25,
        fontSize: 10,
    },

    value: {
        color: "white",
        fontSize: 14,
        marginHorizontal: 25,
    },

    infoView: {
        paddingVertical: 10,
        paddingBottom: 15,
        borderBottomWidth: 0.6,
        borderColor: Colors.dark.secondary,
    },
});
