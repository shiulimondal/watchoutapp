import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetSeacrhedData } from "../../services/ApiServices";

const initialState = {
  search_loading: false,
  data: [],
  error: null,
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await GetSeacrhedData(payload);
      return response;
    } catch (error) {
      console.log(error, "error");

      return rejectWithValue(error.message);
    }
  }
);

export const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.search_loading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.search_loading = false;
        state.data = action.payload.data;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.search_loading = false;
        state.error = action.payload;
      });
  },
});

export default SearchSlice.reducer;
