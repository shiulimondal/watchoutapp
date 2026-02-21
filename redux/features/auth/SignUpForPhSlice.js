import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignUpForMobile } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const SignUpForPh = createAsyncThunk(
  "account/SignUpForPh",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await SignUpForMobile(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const SignUpForPhSlice = createSlice({
  name: "accountForPh",
  initialState,
  reducers: {
    logoutInitiateForPhone: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignUpForPh.pending, (state) => {
        state.loading = true;
      })
      .addCase(SignUpForPh.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(SignUpForPh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutInitiateForPhone } = SignUpForPhSlice.actions;

export default SignUpForPhSlice.reducer;
