import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_REGISTER_URL, GETALLRETAILER, UPDATE_USER } from "../../Pages/Api";
import { ADD_ORGANIZATION_MASTER, GET_ALL_ORGANIZATION_MASTER, GET_ALL_STORAGE, INCREASE_STORAGE } from "../../admin/AdminAPI";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  success: null,
  loading:false,
  message: null,
  type: null
};

// getOnBodingData all
export const getOnBodingData = createAsyncThunk("data/fetchApiData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
    const response = await axios.get(GET_ALL_ORGANIZATION_MASTER, payload, { headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json", } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// handleRemoveUser 
export const handleRemoveUser = createAsyncThunk("data/remove", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ADD_ORGANIZATION_MASTER, payload, { headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json", } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);


// accepted request 
export const handlAcceptedRequest = createAsyncThunk("data/handlAcceptedRequest", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.post(`${INCREASE_STORAGE}?${queryParams}`,null,{headers: { Authorization: `Bearer ${token}` }});
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

const OnBodingSlice = createSlice({
  name: "onBodingData",
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
      .addCase(getOnBodingData.pending, (state) => {    // getRetailer
        state.status = null;
        state.loading = true;
      })
      .addCase(getOnBodingData.fulfilled, (state, action) => {    // getRetailer
        state.status = null;
        state.data = action.payload?.data;
        state.loading = false;
      })
      .addCase(getOnBodingData.rejected, (state, action) => {    // getRetailer
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(handleRemoveUser.pending, (state) => {    // handleRemoveUser
        state.status = null;
      })
      .addCase(handleRemoveUser.fulfilled, (state, action) => {    // handleRemoveUser
        state.status = "succeeded";
        state.data = action.payload?.data;
        state.message = action.payload.message || 'Dalete data successFully';
      })
      .addCase(handleRemoveUser.rejected, (state, action) => {    // handleRemoveUser
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(handlAcceptedRequest.pending, (state) => {    // handlAcceptedRequest
        state.status = null;
      })
      .addCase(handlAcceptedRequest.fulfilled, (state, action) => {    // handlAcceptedRequest
        state.status = "succeeded";
        state.data = action.payload?.data;
        state.message = action.payload.message || 'This operation successFully';
      })
      .addCase(handlAcceptedRequest.rejected, (state, action) => {    // handlAcceptedRequest
        state.status = "failed";
        state.error = action.error.message;
      })

  },
});

export const { resetStatus } = OnBodingSlice.actions;

export default OnBodingSlice.reducer;