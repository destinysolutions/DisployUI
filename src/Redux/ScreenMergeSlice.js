import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_MERGE_SCREEN, ASSETS_UPLOAD_IN_SCREEN,  DELETE_MERGE_SCREEN_ALL, GET_MARGE_SCREEN, GROUP_IN_SCREEN_DELETE_ALL, UPDATE_MERGE_NAME, UPDATE_NEW_SCREEN } from "../Pages/Api";

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
      if (response.data.status === 200) {
        return {
          status: true,
          message: response.data.message,
          data: response?.data,
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
export const getMargeData = createAsyncThunk("data/fetchApiData", async (payload,thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
      const response = await axios.get(GET_MARGE_SCREEN,{headers: {Authorization: `Bearer ${token}`}});      
      return response.data;
    } catch (error) {
      console.log("error",error);
      throw error;
    }
  }
);

// Save ScreenGroup 
export const saveMergeData = createAsyncThunk("data/save", async (payload,thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ADD_MERGE_SCREEN, payload?.payload,{headers: {Authorization: `Bearer ${token}`}});
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

// ScreenGroup Deleted singl
export const screenGroupDelete = createAsyncThunk("data/screenGroupDelete", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams({ MergeScreenIds: payload }).toString();
    const response = await axios.delete(`${DELETE_MERGE_SCREEN_ALL}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: false, message: "Failed to delete data" };
    }
  } catch (error) {
    throw error;
  }
});

// ScreenGroup Deleted singl
export const screenMergeDeleteAll = createAsyncThunk("data/screenMergeDeleteAll", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams({ MergeScreenIds: payload }).toString();
    const response = await axios.delete(`${DELETE_MERGE_SCREEN_ALL}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: false, message: "Failed to delete data" };
    }
  } catch (error) {
    throw error;
  }
});

// update group name
export const updateMergeData = createAsyncThunk("data/updateMergeData", async (payload,thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.get(`${UPDATE_MERGE_NAME}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});
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


// Group in screen Deleted 
export const groupInScreenDelete = createAsyncThunk("data/groupInScreenDelete", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.delete(`${GROUP_IN_SCREEN_DELETE_ALL}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});
    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: false, message: "Failed to delete data" };
    }
  } catch (error) {
    throw error;
  }
});

// Group in screen Deleted 
export const addTagsAndUpdate = createAsyncThunk("data/AddTagsAndUpdate", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(UPDATE_NEW_SCREEN, payload,{headers: {Authorization: `Bearer ${token}`}});
    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: false, message: "Failed to delete data" };
    }
  } catch (error) {
    throw error;
  }
});

// Merge in screen Deleted 
export const groupAssetsInUpdateScreen = createAsyncThunk("data/groupAssetsInUpdateScreen", async (payload, thunkAPI) => {
  try {
  
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.put(`${ASSETS_UPLOAD_IN_SCREEN}?${queryParams}`, null, { headers: { Authorization: `Bearer ${token}` } });

    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: false, message: "Failed to delete data" };
    }
  } catch (error) {
    throw error;
  }
});

const screenGroupSlice = createSlice({
  name: "screenMarge",
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
        state.data = action.payload?.data;
      })
      .addCase(SelectByUserScreen.rejected, (state, action) => {  // SelectByUserScreen
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getMargeData.pending, (state) => {    // getScreenGroup
        state.status = null;
      })
      .addCase(getMargeData.fulfilled, (state, action) => {    // getScreenGroup
        state.status = null;
        state.data = action.payload?.data;
      })
      .addCase(getMargeData.rejected, (state, action) => {    // getScreenGroup
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(saveMergeData.pending, (state) => {      // Save ScreenGroup
        state.status = "loading";
      })
      .addCase(saveMergeData.fulfilled, (state, action) => {    // Save ScreenGroup
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(saveMergeData.rejected, (state, action) => {     // Save ScreenGroup
        state.status = "failed";
        state.message = action.error.message || "Failed to save data";
      })

      .addCase(screenGroupDelete.pending, (state) => {      // screenGroupDelete
        state.status = "loading";
      })
      .addCase(screenGroupDelete.fulfilled, (state, action) => {    // screenGroupDelete
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(screenGroupDelete.rejected, (state, action) => {     // screenGroupDelete
        state.status = "failed";
        state.error = action.error.message || "Failed to delete data";
      })

      .addCase(updateMergeData.pending, (state) => {      // updateMergeData
        state.status = "loading";
      })
      .addCase(updateMergeData.fulfilled, (state, action) => {    // updateMergeData
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(updateMergeData.rejected, (state, action) => {     // updateMergeData
        state.status = "failed";
        state.error = action.error.message || "Failed to update data";
      })

      .addCase(screenMergeDeleteAll.pending, (state) => {      // screenMergeDeleteAll
        state.status = "loading";
      })
      .addCase(screenMergeDeleteAll.fulfilled, (state, action) => {    // screenMergeDeleteAll
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(screenMergeDeleteAll.rejected, (state, action) => {     // screenMergeDeleteAll
        state.status = "failed";
        state.error = action.error.message || "Failed to delete data";
      })

      .addCase(groupInScreenDelete.pending, (state) => {      // groupInScreenDelete
        state.status = "loading";
      })
      .addCase(groupInScreenDelete.fulfilled, (state, action) => {    // groupInScreenDelete
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(groupInScreenDelete.rejected, (state, action) => {     // groupInScreenDelete
        state.status = "failed";
        state.error = action.error.message || "Failed to delete data";
      })

      .addCase(addTagsAndUpdate.pending, (state) => {      // addTagsAndUpdate
        state.status = "loading";
      })
      .addCase(addTagsAndUpdate.fulfilled, (state, action) => {    // addTagsAndUpdate
        state.status = "succeeded";
        state.message = action.payload.message || "This operation successFully" ; 
      })
      .addCase(addTagsAndUpdate.rejected, (state, action) => {     // addTagsAndUpdate
        state.status = "failed";
        state.error = action.error.message || "Failed to delete data";
      })

      .addCase(groupAssetsInUpdateScreen.pending, (state) => {      // groupAssetsInUpdateScreen
        state.status = "loading";
      })
      .addCase(groupAssetsInUpdateScreen.fulfilled, (state, action) => {    // groupAssetsInUpdateScreen
        state.status = "succeeded";
        state.message = action.payload.message || "This operation successFully" ; 
      })
      .addCase(groupAssetsInUpdateScreen.rejected, (state, action) => {     // groupAssetsInUpdateScreen
        state.status = "failed";
        state.error = action.error.message || "Failed to data";
      })

  },
});

export const { resetStatus } = screenGroupSlice.actions;

export default screenGroupSlice.reducer;
