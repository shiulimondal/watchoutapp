import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  userData: null,
  error: "",
  isAuthenticated: false,
};

const AuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("data from slice-->", action.payload);
      state.userData = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
