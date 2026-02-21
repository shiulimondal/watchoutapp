import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUserDetails } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const getUserDetails = createAsyncThunk(
  "userDetails/getUserDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await GetUserDetails(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ProfileDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ProfileDetailsSlice.reducer;
