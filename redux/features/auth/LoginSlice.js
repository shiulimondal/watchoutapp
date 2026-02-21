import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Login } from "../../../services/ApiServices";

const initialState = {
  user_loading: false,
  userData: null,
  error: null,
};

export const login = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Login(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const LoginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signin: (state, action) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.user_loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user_loading = false;
        state.userData = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.user_loading = false;
        state.error = action.payload;
      });
  },
});

export const { signin, logout } = LoginSlice.actions;

export default LoginSlice.reducer;
