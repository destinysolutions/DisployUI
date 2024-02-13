import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { SCREEN_DEACTIVATE_ACTIVATE, deleteUrl, getUrl, postUrl } from "../Pages/Api";
import axios from "axios";

export const handleGetScreen = createAsyncThunk("screen/handleGetScreen",async ({ id, token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`NewScreen/SelectByUserScreen`, {
        headers: {
          Authorization: token,
        },
        signal,
      });
      if (data?.status === 200 ) return data;
      else {
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleDeleteAllScreen = createAsyncThunk("screen/handleDeleteAllScreen", async ({ config }, { rejectWithValue }) => {
  try {
    const response = await axios.request(config);
    if (response?.data?.status) {
      return response.data;
    } else {
      return rejectWithValue(response?.data);
    }
  } catch (error) {
    console.log("error", error);
  }
}
);

export const handleUpdateScreenName = createAsyncThunk(
  "screen/handleUpdateScreenName",
  async ({ dataToUpdate, token }, { rejectWithValue }) => {
    try {
      const { data } = await postUrl("NewScreen/UpdateNewScreen", {
        data: dataToUpdate,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (data?.status == 200) return data;
      else {
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleUpdateScreenAsset = createAsyncThunk(
  "screen/handleUpdateScreenAsset",
  async ({ mediaName, dataToUpdate, token }, { rejectWithValue }) => {
    try {
      const { data } = await postUrl("NewScreen/UpdateNewScreen", {
        data: dataToUpdate,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (data?.status == 200) return data;
      else {
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleUpdateScreenSchedule = createAsyncThunk(
  "screen/handleUpdateScreenSchedule",
  async ({ schedule, dataToUpdate, token }, { rejectWithValue }) => {
    try {
      const { data } = await postUrl("NewScreen/UpdateNewScreen", {
        data: dataToUpdate,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (data?.status == 200) return data;
      else {
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleDeleteScreenById = createAsyncThunk(
  "screen/handleDeleteScreenById",
  async ({ screenID, token }, { rejectWithValue }) => {
    try {
      const { data } = await postUrl("NewScreen/UpdateNewScreen", {
        data: {
          screenID,
          operation: "DeleteScreenOtp",
        },
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (data?.status == 200) return data;
      else {
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Group in screen Deleted 
export const screenDeactivateActivate = createAsyncThunk("data/AddTagsAndUpdate", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.put(`${SCREEN_DEACTIVATE_ACTIVATE}?${queryParams}`, null, { headers: { Authorization: `Bearer ${token}` } });
    
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

const initialState = {
  loading: false,
  screens: [],
  error: null,
  userScreenLoading: false,
  deleteLoading: false,
};

const Screenslice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    handleChangeScreens: (state, { payload }) => {
      state.screens = payload;
    },
  },
  extraReducers: (builder) => {
    //get screeens all
    builder.addCase(
      handleGetScreen.pending,
      (state, { payload, meta, type }) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(handleGetScreen.fulfilled, (state, { payload, meta }) => {
      state.loading = false;
      state.screens = payload?.data;
      state.error = null;
    });
    builder.addCase(handleGetScreen.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload ?? null;
      state.screens = [];
    });

    //update screen name
    builder.addCase(
      handleUpdateScreenName.fulfilled,
      (state, { payload, meta }) => {
        state.screens = state.screens?.map((screen) => {
          if (screen.screenID === meta?.arg?.dataToUpdate?.screenID) {
            return {
              ...screen,
              screenName: meta?.arg?.dataToUpdate?.screenName,
            };
          }
          return screen;
        });
        state.error = null;
      }
    );
    builder.addCase(handleUpdateScreenName.rejected, (state, { payload }) => {
      state.error = payload ?? null;
      state.screens = state.screens;
    });

    //update screen asset
    builder.addCase(
      handleUpdateScreenAsset.fulfilled,
      (state, { payload, meta }) => {
        state.screens = state.screens?.map((screen) => {
          if (screen.screenID === meta?.arg?.dataToUpdate?.screenID) {
            return {
              ...screen,
              assetName: meta?.arg?.mediaName,
              mediaDetailID:meta?.arg?.dataToUpdate?.mediaDetailID
            };
          }
          return screen;
        });
        state.error = null;
      }
    );
    builder.addCase(handleUpdateScreenAsset.rejected, (state, { payload }) => {
      state.error = payload ?? null;
      state.screens = state.screens;
    });

    //update screen schedule
    builder.addCase(handleUpdateScreenSchedule.fulfilled,(state, { payload, meta }) => {
        state.screens = state.screens?.map((screen) => {
          if (screen.screenID === meta?.arg?.dataToUpdate?.screenID) {
            return {
              ...screen,
              scheduleName: meta?.arg?.schedule?.scheduleName,
            };
          }
          return screen;
        });
        state.error = null;
      }
    );
    builder.addCase(
      handleUpdateScreenSchedule.rejected,
      (state, { payload }) => {
        state.error = payload ?? null;
        state.screens = state.screens;
      }
    );

    //delete by id
    builder.addCase(
      handleDeleteScreenById.pending,
      (state, { payload, meta, type }) => {
        state.deleteLoading = true;
        state.error = null;
      }
    );
    builder.addCase(handleDeleteScreenById.fulfilled,(state, { payload, meta }) => {
        state.deleteLoading = false;
        state.screens = state.screens.filter((data) => data.screenID !== meta.arg?.screenID);
        state.error = null;
      }
    );
    builder.addCase(handleDeleteScreenById.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.error = payload ?? null;
      state.screens = state.screens;
    });

    //delete all screens
    builder.addCase(
      handleDeleteAllScreen.pending,
      (state, { payload, meta, type }) => {
        state.deleteLoading = true;
        state.error = null;
      }
    );
    builder.addCase(
      handleDeleteAllScreen.fulfilled,
      (state, { payload, meta }) => {
        state.deleteLoading = false;
        state.screens = [];
        state.error = null;
      }
    );
    builder.addCase(handleDeleteAllScreen.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.error = payload ?? null;
      state.screens = state.screens;
    })

    .addCase(screenDeactivateActivate.pending, (state) => {      // screenDeactivateActivate
      state.status = "loading";
    })
    .addCase(screenDeactivateActivate.fulfilled, (state, action) => {    // screenDeactivateActivate
      state.status = "succeeded";
      state.message = action.payload.message || "This operation successFully" ; 
    })
    .addCase(screenDeactivateActivate.rejected, (state, action) => {     // screenDeactivateActivate
      state.status = "failed";
      state.error = action.error.message || "Failed to delete data";
    });

  },
});

export const { handleChangeScreens } = Screenslice.actions;

export default Screenslice.reducer;
