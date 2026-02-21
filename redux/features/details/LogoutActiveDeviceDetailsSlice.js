import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LogoutActiveDevice } from "../../../services/ApiServices";

const initialState = {
  logout_active_device_loading: false,
  logout_active_device_data: null,
  error: null,
};

export const logoutActiveDevice = createAsyncThunk(
  "logoutActiveDevice/logoutActiveDevice",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await LogoutActiveDevice(payload.data, payload.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const LogoutActiveDeviceDetailsSlice = createSlice({
  name: "logoutActiveDevice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutActiveDevice.pending, (state) => {
        state.logout_active_device_loading = true;
      })
      .addCase(logoutActiveDevice.fulfilled, (state, action) => {
        state.logout_active_device_loading = false;
        state.logout_active_device_data = action.payload;
      })
      .addCase(logoutActiveDevice.rejected, (state, action) => {
        state.logout_active_device_loading = false;
        state.error = action.payload;
      });
  },
});

export default LogoutActiveDeviceDetailsSlice.reducer;
