import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetMyPlanDetails } from "../../../services/ApiServices";

const initialState = {
  my_plan_loading: false,
  my_plan_data: null,
  error: null,
};

export const getMyPlanDetails = createAsyncThunk(
  "myPlan/getMyPlanDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await GetMyPlanDetails(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const MyPlanDetailsSlice = createSlice({
  name: "myPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyPlanDetails.pending, (state) => {
        state.my_plan_loading = true;
      })
      .addCase(getMyPlanDetails.fulfilled, (state, action) => {
        state.my_plan_loading = false;
        state.my_plan_data = action.payload.data;
      })
      .addCase(getMyPlanDetails.rejected, (state, action) => {
        state.my_plan_loading = false;
        state.error = action.payload;
      });
  },
});

export default MyPlanDetailsSlice.reducer;
