import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_GROUP_SCREEN, GET_GROUP_SCREEN } from "../Pages/Api";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  success: null,
  message : null,
  type: null
};

// SelectByUserScreen
export const SelectByUserScreen = createAsyncThunk("data/SelectByUserScreen",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      if (response.data.status) {
        return {
          status: true,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        return { status: false, message: "Failed to save data" };
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

// getScreenGroup all
export const getGroupData = createAsyncThunk("data/fetchApiData", async (payload,thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      // const queryParams = new URLSearchParams(payload).toString();
      const response = await axios.post(GET_GROUP_SCREEN,null,{
        headers: {Authorization: `Bearer ${token}`},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Save ScreenGroup 
export const saveGroupData = createAsyncThunk("data/save", async (payload,thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ADD_GROUP_SCREEN, payload,{headers: {Authorization: `Bearer ${token}`}});
    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: false, message: "Failed to save data" };
    }
  } catch (error) {
    throw error;
  }
});


const screenGroupSlice = createSlice({
  name: "screenGroup",
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

      .addCase(SelectByUserScreen.pending, (state) => {   // SelectByUserScreen
        state.status = null;
      })
      .addCase(SelectByUserScreen.fulfilled, (state, action) => {    // SelectByUserScreen
        state.status = null;
        state.data = action.payload.data;
      })
      .addCase(SelectByUserScreen.rejected, (state, action) => {  // SelectByUserScreen
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getGroupData.pending, (state) => {    // getScreenGroup
        state.status = null;
      })
      .addCase(getGroupData.fulfilled, (state, action) => {    // getScreenGroup
        state.status = null;
        state.data = action.payload;
      })
      .addCase(getGroupData.rejected, (state, action) => {    // getScreenGroup
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(saveGroupData.pending, (state) => {      // Save ScreenGroup
        state.status = "loading";
      })
      .addCase(saveGroupData.fulfilled, (state, action) => {    // Save ScreenGroup
        state.status = "succeeded";
        state.message = action.payload.message;
        state.data = action.payload.data;
      })
      .addCase(saveGroupData.rejected, (state, action) => {     // Save ScreenGroup
        state.status = "failed";
        state.message = action.error.message || "Failed to save data";
      });


  },
});

export const { resetStatus } = screenGroupSlice.actions;

export default screenGroupSlice.reducer;
