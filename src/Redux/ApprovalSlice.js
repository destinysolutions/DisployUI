import toast from "react-hot-toast";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GETALLAPPROVAL } from "../Pages/Api";

const initialState = {
    data: [],
    status: "idle",
    error: null,
    success: null,
    message: null,
};

export const getApprovalData = createAsyncThunk(
    "approval/fetchApiData",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().root.auth.token;
            const response = await axios.get(GETALLAPPROVAL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.log("error", error);
            throw error;
        }
    }
);

export const handleApproval = createAsyncThunk(
    "approval/handleApproval",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            if (response?.data?.status) {
                return response.data;
            } else {
                return rejectWithValue(response?.data);
            }
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);

const ApprovalSlice = createSlice({
    name: "approval",
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
            .addCase(getApprovalData.pending, (state) => {
                state.status = null;
            })
            .addCase(getApprovalData.fulfilled, (state, action) => {
                state.status = null;
                state.data = action.payload?.data;
            })
            .addCase(getApprovalData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
        builder
        .addCase(handleApproval.pending, (state) => {
            state.status = "loading";
        })
        .addCase(handleApproval.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
        })
        .addCase(handleApproval.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
        });

    },
});

export const { resetStatus } = ApprovalSlice.actions;

export default ApprovalSlice.reducer;