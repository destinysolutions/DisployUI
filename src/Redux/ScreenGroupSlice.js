import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_GROUP_SCREEN, DELETE_GROUP_SCREEN_ALL, DELETE_SINGLE_GROUP_SCREEN, GET_GROUP_SCREEN, GROUP_IN_SCREEN_ASSETS_UPDATE_ALL, GROUP_IN_SCREEN_DELETE_ALL, PRIVIEW_GROUP_SCREEN, UPDATE_GROUP_NAME, UPDATE_NEW_SCREEN } from "../Pages/Api";

const initialState = {
  data: [],
  screenData : [],
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
export const getGroupData = createAsyncThunk("data/fetchApiData", async (payload,thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
      const response = await axios.get(GET_GROUP_SCREEN,{headers: {Authorization: `Bearer ${token}`}});      
      return response.data;
    } catch (error) {
      console.log("error",error);
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

// ScreenGroup Deleted singl
export const screenGroupDelete = createAsyncThunk("data/screenGroupDelete", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams({ ScreenGroupID: payload }).toString();
    const response = await axios.delete(`${DELETE_SINGLE_GROUP_SCREEN}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});

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
export const screenGroupDeleteAll = createAsyncThunk("data/screenGroupDeleteAll", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams({ ScreenGroupIds: payload }).toString();
    const response = await axios.delete(`${DELETE_GROUP_SCREEN_ALL}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});

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
export const updateGroupData = createAsyncThunk("data/updateGroupData", async (payload,thunkAPI) => {
  try {

    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.get(`${UPDATE_GROUP_NAME}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});
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

// Group in screen Deleted 
export const groupAssetsInUpdateScreen = createAsyncThunk("data/groupAssetsInUpdateScreen", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.put(`${GROUP_IN_SCREEN_ASSETS_UPDATE_ALL}?${queryParams}`, null, { headers: { Authorization: `Bearer ${token}` } });

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

export const openPriviewModel = createAsyncThunk("data/openPriviewModel", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams({ ScreenGroupID: payload }).toString();    
    const response = await axios.get(`${PRIVIEW_GROUP_SCREEN}?${queryParams}`, {headers: { Authorization: `Bearer ${token}` }});
    if (response.data.status) {
      return {
        status: true,
        message: response.data.message,
        data: response.data.myComposition,
      };
    } else {
      return { status: false, message: "Failed to delete data" };
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
        state.screenData = action.payload?.data;
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
        state.data = action.payload?.data;
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
      })
      .addCase(saveGroupData.rejected, (state, action) => {     // Save ScreenGroup
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

      .addCase(updateGroupData.pending, (state) => {      // updateGroupData
        state.status = "loading";
      })
      .addCase(updateGroupData.fulfilled, (state, action) => {    // updateGroupData
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(updateGroupData.rejected, (state, action) => {     // updateGroupData
        state.status = "failed";
        state.error = action.error.message || "Failed to update data";
      })

      .addCase(screenGroupDeleteAll.pending, (state) => {      // screenGroupDeleteAll
        state.status = "loading";
      })
      .addCase(screenGroupDeleteAll.fulfilled, (state, action) => {    // screenGroupDeleteAll
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(screenGroupDeleteAll.rejected, (state, action) => {     // screenGroupDeleteAll
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

      .addCase(openPriviewModel.pending, (state) => {      // openPriviewModel
        state.status = "loading";
      })
      .addCase(openPriviewModel.fulfilled, (state, action) => {    // openPriviewModel
        state.status = "priview";
        state.message = action.payload.message || "This operation successFully" ; 
        state.data = action.payload?.data;
      })
      .addCase(openPriviewModel.rejected, (state, action) => {     // openPriviewModel
        state.status = "failed";
        state.error = action.error.message || "Failed to data";
      })

  },
});

export const { resetStatus } = screenGroupSlice.actions;

export default screenGroupSlice.reducer;
