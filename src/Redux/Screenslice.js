import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getUrl, postUrl } from "../Pages/Api";

export const handleGetScreen = createAsyncThunk(
  "screen/handleGetScreen",
  async ({ id, token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`NewScreen/SelectByUserScreen`, {
        headers: {
          Authorization: token,
        },
        signal,
      });
      if (data?.status == 200) return data;
      else {
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleDeleteAllScreen = createAsyncThunk(
  "screen/handleDeleteAllScreen",
  async ({ userID, token }, { rejectWithValue }) => {
    try {
      const { data } = await postUrl("NewScreen/UpdateNewScreen", {
        data: {
          userID,
          operation: "DeleteUserIdScreenOtp",
        },
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      if (data?.status == 200) return data;
      else {
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      rejectWithValue(error?.response?.data?.message);
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
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

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
    //get by user id
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
        state.screens = state.screens.map((screen) => {
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
        state.screens = state.screens.map((screen) => {
          if (screen.screenID === meta?.arg?.dataToUpdate?.screenID) {
            return {
              ...screen,
              assetName: meta?.arg?.mediaName,
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
    builder.addCase(
      handleUpdateScreenSchedule.fulfilled,
      (state, { payload, meta }) => {
        state.screens = state.screens.map((screen) => {
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
    builder.addCase(
      handleDeleteScreenById.fulfilled,
      (state, { payload, meta }) => {
        state.deleteLoading = false;
        state.screens = state.screens.filter(
          (data) => data.screenID !== meta.arg?.screenID
        );
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
    });
  },
});

export const { handleChangeScreens } = Screenslice.actions;

export default Screenslice.reducer;
