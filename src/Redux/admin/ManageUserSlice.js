import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_USER_TYPE_MASTER, GET_ALL_USER_TYPE_MASTER } from "../../admin/AdminAPI";


const initialState = {
    data: [],
    status: "idle",
    loading:false,
    error: null,
    success: null,
    message: null,
    type: null
};


// getOnBodingData all
export const getManageUserData = createAsyncThunk("data/fetchApiData", async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().root.auth.token;
        // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
        const response = await axios.get(GET_ALL_USER_TYPE_MASTER, payload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", } });
        return response.data;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}
);

// handleRemoveUser 
export const handleRemoveManageUser = createAsyncThunk("data/remove", async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().root.auth.token;
        const response = await axios.post(ADD_USER_TYPE_MASTER, payload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", } });
        return response.data;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}
);

// accepted request 
export const handleAddEdit = createAsyncThunk("data/AddEdit", async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().root.auth.token;
        const response = await axios.post(`${ADD_USER_TYPE_MASTER}`, payload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", } });
        return response.data;
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}
);

const ManageUserSlice = createSlice({
    name: "ManageUserData",
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
            .addCase(getManageUserData.pending, (state) => {    // getManageUserData
                state.status = null;
                state.loading = true;

            })
            .addCase(getManageUserData.fulfilled, (state, action) => {    // getManageUserData
                state.status = null;
                state.data = action.payload?.data;
                state.loading = false;
            })
            .addCase(getManageUserData.rejected, (state, action) => {    // getManageUserData
                state.status = "failed";
                state.error = action.error.message;
                state.loading = false;
            })

            .addCase(handleRemoveManageUser.pending, (state) => {    // handleRemoveManageUser
                state.status = null;
            })
            .addCase(handleRemoveManageUser.fulfilled, (state, action) => {    // handleRemoveManageUser
                state.status = "succeeded";
                // state.data = action.payload?.data;
                state.message = action.payload.message || 'Delete data successFully';
            })
            .addCase(handleRemoveManageUser.rejected, (state, action) => {    // handleRemoveManageUser
                // state.status = "failed";
                state.error = action.error.message;
            })

            .addCase(handleAddEdit.pending, (state) => {    // handleRemoveManageUser
                state.status = null;
            })
            .addCase(handleAddEdit.fulfilled, (state, action) => {    // handleRemoveManageUser
                state.status = "succeeded";
                state.data = action.payload?.data;
                state.message = action.payload.message || 'Add data successFully';
            })
            .addCase(handleAddEdit.rejected, (state, action) => {    // handleRemoveManageUser
                // state.status = "failed";
                state.error = action.error.message;
            })
    },
});

export const { resetStatus } = ManageUserSlice.actions;

export default ManageUserSlice.reducer;