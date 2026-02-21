import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStopTime } from "../../services/ApiServices";

const initialState = {
    stopTimeLoading: false,
    stopTimeData: null,
    stopTimeError: null,
    isNowPlaying: true,
};


export const fetchStopTime = createAsyncThunk(
    "video/fetchStopTime",
    async ({ requestObj, token }, { rejectWithValue }) => {
        try {
            const response = await getStopTime(requestObj, token);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const VideoProgressSlice = createSlice({
    name: "videoProgress",
    initialState,
    reducers: {
        startGlobalVideo: (state) => {
            state.isNowPlaying = true;
        },
        stopGlobalVideo: (state) => {
            state.isNowPlaying = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStopTime.pending, (state) => {
                state.stopTimeLoading = true;
            })
            .addCase(fetchStopTime.fulfilled, (state, action) => {
                state.stopTimeLoading = false;
                state.stopTimeData = action.payload;
            })
            .addCase(fetchStopTime.rejected, (state, action) => {
                state.stopTimeLoading = false;
                state.stopTimeError = action.payload;
            });
    },
});

export const { startGlobalVideo, stopGlobalVideo } = VideoProgressSlice.actions;
export default VideoProgressSlice.reducer;
