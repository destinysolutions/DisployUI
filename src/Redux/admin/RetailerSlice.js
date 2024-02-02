import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_REGISTER_URL, GETALLRETAILER, UPDATE_USER, UPDATE_USER_ORG } from "../../Pages/Api";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  success: null,
  message: null,
  type: null
};

// getRetailerData all
export const getRetailerData = createAsyncThunk("data/fetchApiData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
    const response = await axios.get(GETALLRETAILER, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// Add Retailer
export const addRetailerData = createAsyncThunk("data/postData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ADD_REGISTER_URL, payload, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// Add Retailer
export const updateRetailerData = createAsyncThunk("data/update", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.post(`${UPDATE_USER_ORG}?${queryParams}`, null, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

const RetailersSlice = createSlice({
  name: "retailerData",
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
      .addCase(getRetailerData.pending, (state) => {    // getRetailer
        state.status = null;
      })
      .addCase(getRetailerData.fulfilled, (state, action) => {    // getRetailer
        state.status = null;
        state.data = action.payload?.data;
      })
      .addCase(getRetailerData.rejected, (state, action) => {    // getRetailer
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addRetailerData.pending, (state) => {    // addRetailerData
        state.status = null;
      })
      .addCase(addRetailerData.fulfilled, (state, action) => {    // addRetailerData
        state.status = "succeeded";
        state.data = action.payload?.data;
        state.message = action.message || 'Save data successFully';
      })
      .addCase(addRetailerData.rejected, (state, action) => {    // addRetailerData
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(updateRetailerData.pending, (state) => {    // updateRetailerData
        state.status = null;
      })
      .addCase(updateRetailerData.fulfilled, (state, action) => {    // updateRetailerData
        state.status = "succeeded";
        state.data = action.payload?.data;
        state.message = action.message || 'Save data successFully';
      })
      .addCase(updateRetailerData.rejected, (state, action) => {    // updateRetailerData
        state.status = "failed";
        state.error = action.error.message;
      })

  },
});

export const { resetStatus } = RetailersSlice.actions;

export default RetailersSlice.reducer;