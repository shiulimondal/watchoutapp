import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DetailsCheck, SignUp } from "../../../services/ApiServices";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const detailsCheck = createAsyncThunk(
  "check/detailsCheck",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await DetailsCheck(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const DetailsCheckSlice = createSlice({
  name: "check",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(detailsCheck.pending, (state) => {
        state.loading = true;
      })
      .addCase(detailsCheck.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(detailsCheck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default DetailsCheckSlice.reducer;
