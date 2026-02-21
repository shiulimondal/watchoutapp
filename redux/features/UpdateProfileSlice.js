import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UpdateProfile } from "../../services/ApiServices";

const initialState = {
  update_loading: false,
  update_data: null,
  error: null,
};

export const updateUserProfile = createAsyncThunk(
  "updateProfile/updateUserProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UpdateProfile(payload.data, payload.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpdateProfileSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.update_loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.update_loading = false;
        state.update_data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.update_loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = UpdateProfileSlice.actions;

export default UpdateProfileSlice.reducer;
