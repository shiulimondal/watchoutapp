import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { VerifySubscriptionPayment } from "../../services/ApiServices";

const initialState = {
    payment_loading: false,
    payment_data: null,
    error: null,
};

export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await VerifySubscriptionPayment(
                payload.data,
                payload.token
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const VerifyPaymentSlice = createSlice({
    name: "verify",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyPayment.pending, (state) => {
                state.payment_loading = true;
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.payment_loading = false;
                state.payment_data = action.payload;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.payment_loading = false;
                state.error = action.payload;
            });
    },
});

export default VerifyPaymentSlice.reducer;
