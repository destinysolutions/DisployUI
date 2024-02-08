import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { ASSIGN_ADS, GETALLADS } from "../../Pages/Api";


const initialState = {
    data: [],
    status: "idle",
    error: null,
    success: null,
    message: null,
    type: null
  };

  // getAdvertisementData all
export const getAdvertisementData = createAsyncThunk("data/fetchApiData", async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
      const response = await axios.get(GETALLADS, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  );

  // Assign Advertisement 
export const assignAdvertisement = createAsyncThunk("data/postData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ASSIGN_ADS, payload, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

  const AdvertisementSlice = createSlice({
    name: "advertisementData",
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
        .addCase(getAdvertisementData.pending, (state) => {    // getRetailer
          state.status = null;
        })
        .addCase(getAdvertisementData.fulfilled, (state, action) => {    // getRetailer
          state.status = null;
          state.data = action.payload?.data;
        })
        .addCase(getAdvertisementData.rejected, (state, action) => {    // getRetailer
          state.status = "failed";
          state.error = action.error.message;
        })

        .addCase(assignAdvertisement.pending, (state) => {    // addData
          state.status = null;
        })
        .addCase(assignAdvertisement.fulfilled, (state, action) => {    // addData
          state.status = "succeeded";
          state.data = action.payload?.data;
          state.message = action.payload.message || 'Save data successFully';
        })
        .addCase(assignAdvertisement.rejected, (state, action) => {    // addData
          state.status = "failed";
          state.error = action.error.message;
        })
  
    },
  });
  
  export const { resetStatus } = AdvertisementSlice.actions;
  
  export default AdvertisementSlice.reducer;