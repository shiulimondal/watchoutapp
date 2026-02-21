import { CheckDeviceExists } from "@/services/ApiServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  check_loading: false,
  check_data: null,
  error: null,
};

export const checkIfDeviceIsActive = createAsyncThunk(
  "checkActive/checkIfDeviceIsActive",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CheckDeviceExists(payload.data, payload.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const CheckDeviceActiveSlice = createSlice({
  name: "checkActive",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkIfDeviceIsActive.pending, (state) => {
        state.check_loading = true;
      })
      .addCase(checkIfDeviceIsActive.fulfilled, (state, action) => {
        state.check_loading = false;
        state.check_data = action.payload;
      })
      .addCase(checkIfDeviceIsActive.rejected, (state, action) => {
        state.check_loading = false;
        state.error = action.payload;
      });
  },
});

export default CheckDeviceActiveSlice.reducer;
