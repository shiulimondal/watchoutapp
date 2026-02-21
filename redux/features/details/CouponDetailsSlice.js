import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GetCouponDiscount,
  GetEpisodeDetails,
} from "../../../services/ApiServices";

const initialState = {
  coupon_loading: false,
  coupon_data: null,
  error: null,
};

export const couponDiscount = createAsyncThunk(
  "coupon/couponDiscount",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await GetCouponDiscount(payload.data, payload.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const CouponDetailsSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(couponDiscount.pending, (state) => {
        state.coupon_loading = true;
      })
      .addCase(couponDiscount.fulfilled, (state, action) => {
        state.coupon_loading = false;
        state.coupon_data = action.payload;
      })
      .addCase(couponDiscount.rejected, (state, action) => {
        state.coupon_loading = false;
        state.error = action.payload;
      });
  },
});

export default CouponDetailsSlice.reducer;
