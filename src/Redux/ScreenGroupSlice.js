import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

// SelectByUserScreen
export const SelectByUserScreen = createAsyncThunk(
  "data/SelectByUserScreen",
  async ({ config }, { rejectWithValue }) => {
    try {
      const data = await axios.request(config);
      return data.data;
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

// getScreenGroup
export const getScreenGroup = async (payload) => {
  const queryParams = new URLSearchParams(payload).toString();
  const response = await axios.post(`your_api_endpoint?${queryParams}`);
  return response.data;
};

export const getGroupData = createAsyncThunk(
  "data/fetchApiData",
  async (payload) => {
    try {
      const data = await getScreenGroup(payload);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

// Save ScreenGroup
export const saveScreenGroup = async (payload) => {
  const response = await axios.post("your_api_endpoint", payload);
  // Check conditions in the response and return accordingly
  if (response.data.status) {
    return {
      status: true,
      message: response.data.message,
      data: response.data.data,
    };
  } else {
    return { status: false, message: "Failed to save data" };
  }
};

export const saveGroupData = createAsyncThunk("data/save", async (payload) => {
  try {
    const data = await saveScreenGroup(payload);
    return data;
  } catch (error) {
    throw error;
  }
});

const screenGroupSlice = createSlice({
  name: "screenGroup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(SelectByUserScreen.pending, (state) => {   // SelectByUserScreen
        state.status = "loading";
      })
      .addCase(SelectByUserScreen.fulfilled, (state, action) => {    // SelectByUserScreen
        // console.log(action.payload.data,"---------");
        state.status = "succeeded";
        state.data = action.payload.data;
      })
      .addCase(SelectByUserScreen.rejected, (state, action) => {  // SelectByUserScreen
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getGroupData.pending, (state) => {
        // getScreenGroup
        state.status = "loading";
      })
      .addCase(getGroupData.fulfilled, (state, action) => {
        // getScreenGroup
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getGroupData.rejected, (state, action) => {
        // getScreenGroup
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(saveGroupData.pending, (state) => {
        // Save ScreenGroup
        state.status = "loading";
      })
      .addCase(saveGroupData.fulfilled, (state, action) => {
        // Save ScreenGroup
        state.status = "succeeded";
        state.message = action.payload.message;
        state.data = action.payload.data;
      })
      .addCase(saveGroupData.rejected, (state, action) => {
        // Save ScreenGroup
        state.status = "failed";
        state.message = action.error.message || "Failed to save data";
      });
  },
});

export default screenGroupSlice.reducer;
