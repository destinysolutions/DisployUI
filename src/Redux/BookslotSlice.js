import toast from "react-hot-toast";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_BOOKING_SLOT, GET_BOOKSLOT_REPORT } from "../Pages/Api";




const initialState = {
    data: [],
    status: "idle",
    error: null,
    success: null,
    message: null,
};

export const getAllBookingSlotCustomer = createAsyncThunk("AdsCustomer/getAllBookingSlotCustomer", async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().root.auth.token;
        const response = await axios.get(GET_BOOKING_SLOT, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.log("error", error);
        toast.error('Failed to fetch data');
        throw error;
    }
}
);

export const getAllSlotReport = createAsyncThunk("AdsCustomer/getAllSlotReport", async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().root.auth.token;
        const response = await axios.get(GET_BOOKSLOT_REPORT, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.log("error", error);
        toast.error('Failed to fetch data');
        throw error;
    }
}
);


const BookslotSlice = createSlice({
    name: "Bookslot",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.error = null;
            state.message = null;
            state.status = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAllBookingSlotCustomer.pending, (state) => {
                state.status = null;
            })
            .addCase(getAllBookingSlotCustomer.fulfilled, (state, action) => {
                state.status = null;
                state.data = action.payload?.data;
            })
            .addCase(getAllBookingSlotCustomer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            .addCase(getAllSlotReport.pending, (state) => {
                state.status = null;
            })
            .addCase(getAllSlotReport.fulfilled, (state, action) => {
                state.status = null;
                state.data = action.payload?.data;
            })
            .addCase(getAllSlotReport.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    },
});

export const { resetStatus } = BookslotSlice.actions;

export default BookslotSlice.reducer;