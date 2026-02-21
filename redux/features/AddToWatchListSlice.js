import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddToWatchList, UpdateProfile } from "../../services/ApiServices";

const initialState = {
  add_loading: false,
  add_data: null,
  error: null,
};

export const addToWatchList = createAsyncThunk(
  "watchlistAdd/addToWatchList",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AddToWatchList(payload.data, payload.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const AddToWatchListSlice = createSlice({
  name: "watchlistAdd",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWatchList.pending, (state) => {
        state.add_loading = true;
      })
      .addCase(addToWatchList.fulfilled, (state, action) => {
        state.add_loading = false;
        state.add_data = action.payload;
      })
      .addCase(addToWatchList.rejected, (state, action) => {
        state.add_loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = AddToWatchListSlice.actions;

export default AddToWatchListSlice.reducer;
