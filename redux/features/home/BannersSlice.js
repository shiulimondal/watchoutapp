import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetAuthBanners, GetBanners } from "../../../services/ApiServices";

const initialState = {
  banner_loading: false,
  banner_data: [],
  error: null,
};

export const getBanners = createAsyncThunk(
  "home/getBanners",
  async (payload, { rejectWithValue }) => {
    if (payload.data.type === "authorized") {
      try {
        const response = await GetAuthBanners(payload);
        return response;
      } catch (error) {
        console.log(error, "error");

        return rejectWithValue(error.message);
      }
    } else {
      try {
        const response = await GetBanners();
        return response;
      } catch (error) {
        console.log(error, "error");

        return rejectWithValue(error.message);
      }
    }
  }
);

export const GetBannersSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => {
        state.banner_loading = true;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.banner_loading = false;
        state.banner_data = action.payload.data;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.banner_loading = false;
        state.error = action.payload;
      });
  },
});

export default GetBannersSlice.reducer;
