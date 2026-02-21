import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  MakeClimaxPayment,
  MakeSubscriptionPayment,
} from "../../services/ApiServices";

const initialState = {
  climax_payment_loading: false,
  climax_payment_data: null,
  error: null,
};

export const makeClimaxPayment = createAsyncThunk(
  "climaxPayment/makeClimaxPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await MakeClimaxPayment(payload.data, payload.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const MakeClimaxPaymentSlice = createSlice({
  name: "climaxPayment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeClimaxPayment.pending, (state) => {
        state.climax_payment_loading = true;
      })
      .addCase(makeClimaxPayment.fulfilled, (state, action) => {
        state.climax_payment_loading = false;
        state.climax_payment_data = action.payload;
      })
      .addCase(makeClimaxPayment.rejected, (state, action) => {
        state.climax_payment_loading = false;
        state.error = action.payload;
      });
  },
});

export default MakeClimaxPaymentSlice.reducer;
