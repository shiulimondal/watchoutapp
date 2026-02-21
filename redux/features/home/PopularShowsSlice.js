import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetPopularShows } from "../../../services/ApiServices";

const initialState = {
  popular_loading: false,
  popular_data: [],
  error: null,
};

export const getPopularShows = createAsyncThunk(
  "popular/getPopularShows",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetPopularShows();
      return response;
    } catch (error) {
      console.log(error, "error");

      return rejectWithValue(error.message);
    }
  }
);

export const PopularShowsSlice = createSlice({
  name: "popular",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPopularShows.pending, (state) => {
        state.popular_loading = true;
      })
      .addCase(getPopularShows.fulfilled, (state, action) => {
        state.popular_loading = false;
        state.popular_data = action.payload.data;
      })
      .addCase(getPopularShows.rejected, (state, action) => {
        state.popular_loading = false;
        state.error = action.payload;
      });
  },
});

export default PopularShowsSlice.reducer;
