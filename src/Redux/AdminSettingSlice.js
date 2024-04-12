import toast from "react-hot-toast";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    AllDiscount: [],
    status: "idle",
    error: null,
    success: null,
    message: null,
    DiscountById: null,
    data: [],
    deleteData: null,
    allSegment: [],
    plan: null
};

export const handleGetAllDiscount = createAsyncThunk(
    "AdminSetting/handleGetAllDiscount",
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

export const handleGetAllSegment = createAsyncThunk(
    "common/handleGetAllSegment",
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

export const handleGetDiscountByID = createAsyncThunk(
    "AdminSetting/handleGetDiscountByID",
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

export const handleAddEditDiscount = createAsyncThunk(
    "AdminSetting/handleAddEditDiscount",
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

export const handleDeleteDiscount = createAsyncThunk(
    "AdminSetting/handleDeleteDiscount",
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

export const handleAddPlan = createAsyncThunk(
    "AdminSetting/handleAddPlan",
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


const AdminSettingSlice = createSlice({
    name: "adminSetting",
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
            .addCase(handleGetAllDiscount.pending, (state) => {
                state.status = null;
            })
            .addCase(handleGetAllDiscount.fulfilled, (state, action) => {
                state.status = null;
                state.AllDiscount = action.payload?.data;
            })
            .addCase(handleGetAllDiscount.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

        builder
            .addCase(handleGetDiscountByID.pending, (state) => {
                state.status = null;
            })
            .addCase(handleGetDiscountByID.fulfilled, (state, action) => {
                state.status = null;
                state.DiscountById = action.payload?.data;
            })
            .addCase(handleGetDiscountByID.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

        builder
            .addCase(handleAddEditDiscount.pending, (state) => {
                state.status = null;
            })
            .addCase(handleAddEditDiscount.fulfilled, (state, action) => {
                state.status = null;
                state.data = action.payload?.data;
            })
            .addCase(handleAddEditDiscount.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

        builder
            .addCase(handleDeleteDiscount.pending, (state) => {
                state.status = null;
            })
            .addCase(handleDeleteDiscount.fulfilled, (state, action) => {
                state.status = null;
                state.deleteData = action.payload?.data;
            })
            .addCase(handleDeleteDiscount.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

        builder
            .addCase(handleGetAllSegment.pending, (state) => {
                state.status = null;
            })
            .addCase(handleGetAllSegment.fulfilled, (state, action) => {
                state.status = null;
                state.allSegment = action.payload?.data;
            })
            .addCase(handleGetAllSegment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

        builder
            .addCase(handleAddPlan.pending, (state) => {
                state.status = null;
            })
            .addCase(handleAddPlan.fulfilled, (state, action) => {
                state.status = null;
                state.plan = action.payload?.data;
            })
            .addCase(handleAddPlan.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    },
});

export const { resetStatus } = AdminSettingSlice.actions;

export default AdminSettingSlice.reducer;