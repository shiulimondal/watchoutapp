import { GetClimaxPaymentStatus } from "@/services/ApiServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  climax_loading: false,
  climax_data: null,
  error: null,
};

export const checkIfClimaxPaid = createAsyncThunk(
  "climax/checkIfClimaxPaid",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await GetClimaxPaymentStatus(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ClimaxIfPaidSlice = createSlice({
  name: "climax",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkIfClimaxPaid.pending, (state) => {
        state.climax_loading = true;
      })
      .addCase(checkIfClimaxPaid.fulfilled, (state, action) => {
        state.climax_loading = false;
        state.climax_data = action.payload;
      })
      .addCase(checkIfClimaxPaid.rejected, (state, action) => {
        state.climax_loading = false;
        state.error = action.payload;
      });
  },
});

export default ClimaxIfPaidSlice.reducer;
