import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmailCheck } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const emailCheck = createAsyncThunk(
  "check/emailCheck",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await EmailCheck(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const EmailCheckSlice = createSlice({
  name: "check",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(emailCheck.pending, (state) => {
        state.loading = true;
      })
      .addCase(emailCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(emailCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default EmailCheckSlice.reducer;
