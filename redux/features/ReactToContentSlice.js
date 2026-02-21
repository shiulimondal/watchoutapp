import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddReaction } from "../../services/ApiServices";

const initialState = {
  react_loading: false,
  react_data: null,
  error: null,
};

export const reactContent = createAsyncThunk(
  "react/reactContent",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AddReaction(payload.data, payload.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ReactToContentSlice = createSlice({
  name: "react",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reactContent.pending, (state) => {
        state.react_loading = true;
      })
      .addCase(reactContent.fulfilled, (state, action) => {
        state.react_loading = false;
        state.react_data = action.payload;
      })
      .addCase(reactContent.rejected, (state, action) => {
        state.react_loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = ReactToContentSlice.actions;

export default ReactToContentSlice.reducer;
