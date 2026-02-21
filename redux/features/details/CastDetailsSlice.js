import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetCastDetails } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  content: null,
  error: null,
};

export const getCastDetails = createAsyncThunk(
  "cast/getCastDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetCastDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const CastDetailsSlice = createSlice({
  name: "cast",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCastDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCastDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(getCastDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default CastDetailsSlice.reducer;
