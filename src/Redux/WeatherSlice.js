import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_OR_UPDATE_WEATHER,DELETE_WEATHER,GET_BY_ID_WEATHER, GET_WEATHER, } from "../Pages/Api";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  success: null,
  message: null,
  type: null
};

// // getData all
export const getData = createAsyncThunk("data/fetchApiData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
    const response = await axios.get(GET_WEATHER, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// Add 
export const addData = createAsyncThunk("data/postData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ADD_OR_UPDATE_WEATHER, payload, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

export const getByIdData = createAsyncThunk("data/getByIdData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams({WeatherSchedulingID : payload}).toString();
    const response = await axios.get(`${GET_BY_ID_WEATHER}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// // Add Retailer
export const deletedData = createAsyncThunk("data/deletedData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams({WeatherSchedulingID : payload}).toString();
    const response = await axios.delete(`${DELETE_WEATHER}?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

const WeatherSlice = createSlice({
  name: "weather",
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
      .addCase(getData.pending, (state) => {    // getData
        state.status = null;
      })
      .addCase(getData.fulfilled, (state, action) => {    // getData
        state.status = null;
        state.data = action.payload?.data;
      })
      .addCase(getData.rejected, (state, action) => {    // getData
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addData.pending, (state) => {    // addData
        state.status = null;
      })
      .addCase(addData.fulfilled, (state, action) => {    // addData
        state.status = "succeeded";
        state.data = action.payload?.data;
        state.message = action.payload.message || 'Save data successFully';
      })
      .addCase(addData.rejected, (state, action) => {    // addData
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getByIdData.pending, (state) => {    // getByIdData
        state.status = null;
      })
      .addCase(getByIdData.fulfilled, (state, action) => {    // getByIdData
        state.status = "Edit";
        state.editData = action.payload?.data;
        state.message = action.payload.message || 'Save data successFully';
      })
      .addCase(getByIdData.rejected, (state, action) => {    // getByIdData
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deletedData.pending, (state) => {    // deletedData
        state.status = null;
      })
      .addCase(deletedData.fulfilled, (state, action) => {    // deletedData
        state.status = "deleted";
        state.message = action.payload.message || 'deleted data successFully';
      })
      .addCase(deletedData.rejected, (state, action) => {    // deletedData
        state.status = "failed";
        state.error = action.error.message;
      })

  },
});

export const { resetStatus } = WeatherSlice.actions;

export default WeatherSlice.reducer;