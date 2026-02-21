import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetEpisodeDetails } from "../../../services/ApiServices";

const initialState = {
  episode_loading: false,
  episode_content: null,
  error: null,
};

export const episodeDetails = createAsyncThunk(
  "episode/episodeDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetEpisodeDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const EpisodeDetailsSlice = createSlice({
  name: "episode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(episodeDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(episodeDetails.fulfilled, (state, action) => {
        state.episode_loading = false;
        state.episode_content = action.payload.data;
      })
      .addCase(episodeDetails.rejected, (state, action) => {
        state.episode_loading = false;
        state.error = action.payload;
      });
  },
});

export default EpisodeDetailsSlice.reducer;
