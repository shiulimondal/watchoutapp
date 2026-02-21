import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PhNumberCheck } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const PhoneNumberCheck = createAsyncThunk(
  "check/PhoneNumberCheck",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PhNumberCheck(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const PhNumberCheckSlice = createSlice({
  name: "check",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PhoneNumberCheck.pending, (state) => {
        state.loading = true;
      })
      .addCase(PhoneNumberCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(PhoneNumberCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default PhNumberCheckSlice.reducer;
