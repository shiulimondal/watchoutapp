import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetActiveDevices } from "../../../services/ApiServices";

const initialState = {
  active_device_loading: false,
  active_device_data: null,
  error: null,
};

export const getActiveDevices = createAsyncThunk(
  "activeDevice/getActiveDevices",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await GetActiveDevices(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ActiveDevicesDetailsSlice = createSlice({
  name: "activeDevice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActiveDevices.pending, (state) => {
        state.active_device_loading = true;
      })
      .addCase(getActiveDevices.fulfilled, (state, action) => {
        state.active_device_loading = false;
        state.active_device_data = action.payload.data;
      })
      .addCase(getActiveDevices.rejected, (state, action) => {
        state.active_device_loading = false;
        state.error = action.payload;
      });
  },
});

export default ActiveDevicesDetailsSlice.reducer;
