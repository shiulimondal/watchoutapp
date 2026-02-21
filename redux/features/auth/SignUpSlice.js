import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignUp } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const signUp = createAsyncThunk(
  "account/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await SignUp(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const SignUpSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logoutInitiate: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutInitiate } = SignUpSlice.actions;

export default SignUpSlice.reducer;
