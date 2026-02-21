import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MakeSubscriptionPayment } from "../../services/ApiServices";

const initialState = {
  payment_loading: false,
  payment_data: null,
  error: null,
};

export const makePayment = createAsyncThunk(
  "payment/makePayment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await MakeSubscriptionPayment(
        payload.data,
        payload.token
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const MakePaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makePayment.pending, (state) => {
        state.payment_loading = true;
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.payment_loading = false;
        state.payment_data = action.payload;
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.payment_loading = false;
        state.error = action.payload;
      });
  },
});

export default MakePaymentSlice.reducer;
