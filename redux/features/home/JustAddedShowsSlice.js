import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetJustAddedShows } from "../../../services/ApiServices";

const initialState = {
  just_added_loading: false,
  just_added_data: [],
  error: null,
};

export const getJustAddedShows = createAsyncThunk(
  "justAdded/getJustAddedShows",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetJustAddedShows();
      return response;
    } catch (error) {
      console.log(error, "error");

      return rejectWithValue(error.message);
    }
  }
);

export const JustAddedShowsSlice = createSlice({
  name: "justAdded",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJustAddedShows.pending, (state) => {
        state.just_added_loading = true;
      })
      .addCase(getJustAddedShows.fulfilled, (state, action) => {
        state.just_added_loading = false;
        state.just_added_data = action.payload.data;
      })
      .addCase(getJustAddedShows.rejected, (state, action) => {
        state.just_added_loading = false;
        state.error = action.payload;
      });
  },
});

export default JustAddedShowsSlice.reducer;
