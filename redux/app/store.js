import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/AuthSlice";
import GetBannersSlice from "../features/home/BannersSlice";
import ContentDetailsSlice from "../features/details/ContentDetailsSlice";
import CastDetailsSlice from "../features/details/CastDetailsSlice";
import EpisodeDetailsSlice from "../features/details/EpisodeDetailsSlice";
import PopularShowsSlice from "../features/home/PopularShowsSlice";
import JustAddedShowsSlice from "../features/home/JustAddedShowsSlice";
import SearchSlice from "../features/SearchClice";
import DetailsCheckSlice from "../features/auth/DetailsCheckSlice";
import SignUpSlice from "../features/auth/SignUpSlice";
import SignUpForPhSlice from "../features/auth/SignUpForPhSlice";
import EmailCheckSlice from "../features/auth/EmailCheckSlice";
import PhNumberCheckSlice from "../features/auth/PhNumberCheckSlice";
import LoginSlice from "../features/auth/LoginSlice";
import ProfileDetailsSlice from "../features/details/ProfileDetailsSlice";
import UpdateProfileSlice from "../features/UpdateProfileSlice";
import AddToWatchListSlice from "../features/AddToWatchListSlice";
import WatchlistDetailsSlice from "../features/details/WatchlistDetailsSlice";
import PlanDetailsSlice from "../features/details/PlanDetailsSlice";
import MakePaymentSlice from "../features/MakePaymentSlice";
import VerifyPaymentSlice from "../features/VerifyPaymentSlice";
import MyPlanDetailsSlice from "../features/details/MyPlanDetailsSlice";
import LogoutActiveDeviceSlice from "../features/LogoutActiveDeviceSlice";
import CheckDeviceActiveSlice from "../features/CheckDeviceActiveSlice";
import ActiveDevicesDetailsSlice from "../features//details/ActiveDevicesDetailsSlice";
import LogoutActiveDeviceDetailsSlice from "../features//details/LogoutActiveDeviceDetailsSlice";
import MakeClimaxPaymentSlice from "../features/MakeClimaxPaymentSlice";
import ClimaxIfPaidSlice from "../features/ClimaxIfPaidSlice";
import CouponDetailsSlice from "../features/details/CouponDetailsSlice";
import ReactToContentSlice from "../features/ReactToContentSlice";
import UpcomingContentsSlice from "../features/details/UpcomingContentsSlice";
import { PhNumberCheck } from "@/services/ApiServices";
import videoProgressReducer from '../features/VideoProgressSlice';

export const store = configureStore({
    reducer: {
        user: AuthSlice,
        banner: GetBannersSlice,
        content: ContentDetailsSlice,
        cast: CastDetailsSlice,
        episode: EpisodeDetailsSlice,
        popular: PopularShowsSlice,
        justAdded: JustAddedShowsSlice,
        search: SearchSlice,
        check: DetailsCheckSlice,
        email: EmailCheckSlice,
        phone: PhNumberCheckSlice,
        account: SignUpSlice,
        accountForPh: SignUpForPhSlice,
        login: LoginSlice,
        userDetails: ProfileDetailsSlice,
        updateProfile: UpdateProfileSlice,
        watchlistAdd: AddToWatchListSlice,
        watchlist: WatchlistDetailsSlice,
        plans: PlanDetailsSlice,
        payment: MakePaymentSlice,
        verify: VerifyPaymentSlice,
        myPlan: MyPlanDetailsSlice,
        logoutActive: LogoutActiveDeviceSlice,
        checkActive: CheckDeviceActiveSlice,
        activeDevice: ActiveDevicesDetailsSlice,
        logoutActiveDevice: LogoutActiveDeviceDetailsSlice,
        climaxPayment: MakeClimaxPaymentSlice,
        climax: ClimaxIfPaidSlice,
        coupon: CouponDetailsSlice,
        react: ReactToContentSlice,
        upcoming: UpcomingContentsSlice,
        videoProgress: videoProgressReducer
    },
});
