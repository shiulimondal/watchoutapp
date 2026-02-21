import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GetAuthContentDetails,
  GetContentDetails,
} from "../../../services/ApiServices";

const initialState = {
  loading: false,
  content: null,
  error: null,
};

export const contentDetails = createAsyncThunk(
  "content/contentDetails",
  async (payload, { rejectWithValue }) => {
    if (payload.data.type === "unauthorized") {
      try {
        const response = await GetContentDetails(payload);
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    } else {
      try {
        const response = await GetAuthContentDetails(payload);
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const ContentDetailsSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    reset: (state) => {
      state.content = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(contentDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(contentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload.data;
      })
      .addCase(contentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = ContentDetailsSlice.actions;

export default ContentDetailsSlice.reducer;
