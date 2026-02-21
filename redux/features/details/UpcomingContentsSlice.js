import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUpcomingContents } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const getUpcomingContents = createAsyncThunk(
  "upcoming/getUpcomingContents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetUpcomingContents();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpcomingContentsSlice = createSlice({
  name: "upcoming",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUpcomingContents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpcomingContents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(getUpcomingContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default UpcomingContentsSlice.reducer;
