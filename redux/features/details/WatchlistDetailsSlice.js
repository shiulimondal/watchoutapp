import { GetWatchList } from "@/services/ApiServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlist_loading: false,
  watchlist_data: null,
  error: null,
};

export const getWatchList = createAsyncThunk(
  "watchlist/getWatchList",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await GetWatchList(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const WatchlistDetailsSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWatchList.pending, (state) => {
        state.watchlist_loading = true;
      })
      .addCase(getWatchList.fulfilled, (state, action) => {
        state.watchlist_loading = false;
        state.watchlist_data = action.payload.data;
      })
      .addCase(getWatchList.rejected, (state, action) => {
        state.watchlist_loading = false;
        state.error = action.payload;
      });
  },
});

export default WatchlistDetailsSlice.reducer;
