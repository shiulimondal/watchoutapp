import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GetEpisodeDetails,
  GetPlanDetails,
} from "../../../services/ApiServices";

const initialState = {
  plan_loading: false,
  plan_data: null,
  error: null,
};

export const getPlanDetails = createAsyncThunk(
  "plans/getPlanDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetPlanDetails();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const PlanDetailsSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlanDetails.pending, (state) => {
        state.plan_loading = true;
      })
      .addCase(getPlanDetails.fulfilled, (state, action) => {
        state.plan_loading = false;
        state.plan_data = action.payload.data;
      })
      .addCase(getPlanDetails.rejected, (state, action) => {
        state.plan_loading = false;
        state.error = action.payload;
      });
  },
});

export default PlanDetailsSlice.reducer;
