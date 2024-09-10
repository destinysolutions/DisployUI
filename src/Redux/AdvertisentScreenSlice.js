import toast from "react-hot-toast";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetAllAdvertisementScreen, GETALLAPPROVAL } from "../Pages/Api";

const initialState = {
    data: [],
    status: "idle",
    error: null,
    success: null,
    message: null,
};

export const getAllAdvertisementScreenData = createAsyncThunk("AdvertisementScreenData/fetchApiData", async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().root.auth.token;
        const response = await axios.get(GetAllAdvertisementScreen, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}
);


const ApprovalSlice = createSlice({
    name: "advertisentScreenItems",
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
            .addCase(getAllAdvertisementScreenData.pending, (state) => {
                state.status = null;
            })
            .addCase(getAllAdvertisementScreenData.fulfilled, (state, action) => {
                state.status = null;
                state.data = action.payload?.data;
            })
            .addCase(getAllAdvertisementScreenData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    },
});

export const { resetStatus } = ApprovalSlice.actions;

export default ApprovalSlice.reducer;