import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const handlePaymentIntegration = createAsyncThunk(
    "Common/handlePaymentIntegration",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);

export const handlePaymentDetails = createAsyncThunk(
    "Common/handlePaymentDetails",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);

export const handleAllInvoice = createAsyncThunk(
    "Common/handleAllInvoice",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);
export const handleInvoiceById = createAsyncThunk(
    "Common/handleInvoiceById",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);

export const handleSendInvoice = createAsyncThunk(
    "Common/handleSendInvoice",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            return response.data;
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);



const initialState = {
    loading: false,
    error: null,
    data: null,
    message: "",
    status: null,
    payment: "",
    paymentDetails: null,
    AllInvoice: [],
};


const PaymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.error = null;
            state.message = null;
            state.status = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(handlePaymentIntegration.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handlePaymentIntegration.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.payment = action.payload;
            state.message = action.payload?.message;
        });
        builder.addCase(handlePaymentIntegration.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });

        builder.addCase(handlePaymentDetails.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handlePaymentDetails.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.paymentDetails = action.payload;
            state.message = action.payload?.message;
        });
        builder.addCase(handlePaymentDetails.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });

        builder.addCase(handleAllInvoice.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handleAllInvoice.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.AllInvoice = action.payload;
            state.message = action.payload?.message;
        });
        builder.addCase(handleAllInvoice.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });

        builder.addCase(handleInvoiceById.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handleInvoiceById.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.AllInvoice = action.payload;
            state.message = action.payload?.message;
        });
        builder.addCase(handleInvoiceById.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });

        builder.addCase(handleSendInvoice.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handleSendInvoice.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.message = action.payload?.message;
        });
        builder.addCase(handleSendInvoice.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });
    },
});

export const { resetStatus } = PaymentSlice.actions;

export default PaymentSlice.reducer;