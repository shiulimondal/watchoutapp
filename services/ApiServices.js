import {
    sendGetRequest,
    sendAuthGetRequest,
    sendAuthPostData,
    sendFormPostData,
    sendFormPutData,
    sendPostRequest,
} from "../util/RequestHelper";

export const GetBanners = async () => {
    let url = process.env.EXPO_PUBLIC_URL + `/home/banner`;
    return sendGetRequest(url);
};

export const GetAuthBanners = async (payload) => {
    let url =
        process.env.EXPO_PUBLIC_URL +
        `/home/banner?user_id=${payload.data.user_id}`;
    return sendAuthGetRequest(url, payload.token);
};

export const GetContentDetails = async (payload) => {
    let url =
        process.env.EXPO_PUBLIC_URL +
        `/details/content?id=${payload.data.content_id}`;
    return sendGetRequest(url);
};

export const GetAuthContentDetails = async (payload) => {
    let url =
        process.env.EXPO_PUBLIC_URL +
        `/details/content?id=${payload.data.content_id}&user_id=${payload.data.user_id}`;
    return sendAuthGetRequest(url, payload.token);
};

export const GetCastDetails = async (cast_id) => {
    let url = process.env.EXPO_PUBLIC_URL + `/details/cast/${cast_id}`;
    return sendGetRequest(url);
};

export const GetEpisodeDetails = async (season_id) => {
    let url = process.env.EXPO_PUBLIC_URL + `/details/season/${season_id}`;
    return sendGetRequest(url);
};

export const GetPopularShows = async (season_id) => {
    let url = process.env.EXPO_PUBLIC_URL + `/home/popular-shows`;
    return sendGetRequest(url);
};

export const GetJustAddedShows = async (season_id) => {
    let url = process.env.EXPO_PUBLIC_URL + `/home/just-added`;
    return sendGetRequest(url);
};

export const GetSeacrhedData = async (payload) => {
    let url =
        process.env.EXPO_PUBLIC_URL +
        `/search?limit=${payload.limit}&page=${payload.page}&keyword=${payload.keyword}`;
    return sendGetRequest(url);
};

export const EmailCheck = async (requestObj) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/email-check";
    return sendPostRequest(url, requestObj);
};

export const PhNumberCheck = async (requestObj) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/phone-check";
    return sendPostRequest(url, requestObj);
};

export const DetailsCheck = async (requestObj) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/details-check";
    return sendPostRequest(url, requestObj);
};

export const SignUp = async (requestObj) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/signup";
    return sendPostRequest(url, requestObj);
};

export const SignUpForMobile = async (requestObj) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/signup-with-phone";
    return sendPostRequest(url, requestObj);
};

export const Login = async (requestObj) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/login";
    return sendPostRequest(url, requestObj);
};

export const GetUserDetails = async (payload) => {
    let url = process.env.EXPO_PUBLIC_URL + `/user/details/${payload.user_id}`;
    return sendAuthGetRequest(url, payload.token);
};

export const UpdateProfile = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/update";
    return sendAuthPostData(url, requestObj, token);
};

export const AddToWatchList = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + "/review/add-to-watchlist";
    return sendAuthPostData(url, requestObj, token);
};

export const GetWatchList = async (payload) => {
    let url =
        process.env.EXPO_PUBLIC_URL +
        `/review/watchlist-listing/${payload.user_id}`;
    return sendAuthGetRequest(url, payload.token);
};

export const GetPlanDetails = async () => {
    let url = process.env.EXPO_PUBLIC_URL + `/subscription/listing`;
    return sendGetRequest(url);
};

export const MakeSubscriptionPayment = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + "/payment/order";
    return sendAuthPostData(url, requestObj, token);
};

export const VerifySubscriptionPayment = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + "/payment/verifyOrder";
    return sendAuthPostData(url, requestObj, token);
};

// push/ stop video api----------------------------
export const getStopTime = async (requestObj, token) => {
    console.log("requestObj======================", requestObj);
    let url = process.env.EXPO_PUBLIC_URL + "/'user/user-content-time-update";
    return sendAuthPostData(url, requestObj, token);
};

export const GetMyPlanDetails = async (payload) => {
    let url =
        process.env.EXPO_PUBLIC_URL + `/payment/plan-details/${payload.user_id}`;
    return sendAuthGetRequest(url, payload.token);
};

export const LogoutExistingUser = async (requestObj) => {
    let url = process.env.EXPO_PUBLIC_URL + "/user/update-device";
    return sendPostRequest(url, requestObj);
};

export const CheckDeviceExists = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + `/user/device-check`;
    return sendAuthPostData(url, requestObj, token);
};

export const GetActiveDevices = async (payload) => {
    let url =
        process.env.EXPO_PUBLIC_URL + `/user/active-devices/${payload.user_id}`;
    return sendAuthGetRequest(url, payload.token);
};

export const LogoutActiveDevice = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + `/user/remove-device`;
    return sendAuthPostData(url, requestObj, token);
};

export const MakeClimaxPayment = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + "/payment/addOn";
    return sendAuthPostData(url, requestObj, token);
};

export const GetClimaxPaymentStatus = async (payload) => {
    let url = process.env.EXPO_PUBLIC_URL + `/subscription/addOn-check`;
    return sendAuthGetRequest(url, payload.token);
};

export const GetCouponDiscount = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + "/coupon/check";
    return sendAuthPostData(url, requestObj, token);
};

export const AddReaction = async (requestObj, token) => {
    let url = process.env.EXPO_PUBLIC_URL + "/review/like-dislike";
    return sendAuthPostData(url, requestObj, token);
};

export const GetUpcomingContents = async () => {
    let url = process.env.EXPO_PUBLIC_URL + `/home/upcoming`;
    return sendGetRequest(url);
};
