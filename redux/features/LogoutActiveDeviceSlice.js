import { LogoutExistingUser } from "@/services/ApiServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  logout_loading: false,
  logout_data: null,
  error: null,
};

export const logoutActiveDevice = createAsyncThunk(
  "logoutActive/logoutActiveDevice",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await LogoutExistingUser(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const LogoutActiveDeviceSlice = createSlice({
  name: "logoutActive",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutActiveDevice.pending, (state) => {
        state.logout_loading = true;
      })
      .addCase(logoutActiveDevice.fulfilled, (state, action) => {
        state.logout_loading = false;
        state.logout_data = action.payload;
      })
      .addCase(logoutActiveDevice.rejected, (state, action) => {
        state.logout_loading = false;
        state.error = action.payload;
      });
  },
});

export default LogoutActiveDeviceSlice.reducer;
