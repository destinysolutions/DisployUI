import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getUrl } from "../Pages/Api";

export const handleGetYoutubeData = createAsyncThunk(
  "apps/handleGetYoutubeData",
  async ({ token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`YoutubeApp/GetAllYoutubeApp`, {
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
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleGetTextScrollData = createAsyncThunk(
  "apps/handleGetTextScrollData",
  async ({ token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`YoutubeApp/GetAlltextScroll`, {
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
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleGetAllApps = createAsyncThunk(
  "apps/handleGetAllApps",
  async ({ token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`YoutubeApp/GetAllApps`, {
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
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleGetDigitalMenuData = createAsyncThunk(
  "apps/handleGetDigitalMenuData",
  async ({ token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`YoutubeApp/GetAllYoutubeApp`, {
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
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

const initialState = {
  allApps: {
    loading: false,
    data: [],
    error: null,
  },
  youtube: {
    loading: false,
    youtubeData: [],
    error: null,
  },
  textScroll: {
    loading: false,
    textScrollData: [],
    error: null,
  },
  DigitalMenu: {
    loading: false,
    DigitalMenuData: [],
    error: null,
  },
  allAppsData: [],
};

const AppsSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get youtube data
    builder.addCase(
      handleGetYoutubeData.pending,
      (state, { payload, meta, type }) => {
        state.youtube.loading = true;
        state.youtube.error = null;
        state.youtube.youtubeData = [];
      }
    );
    builder.addCase(
      handleGetYoutubeData.fulfilled,
      (state, { payload, meta }) => {
        state.youtube.loading = false;
        state.youtube.youtubeData = payload?.data ? payload?.data : [];
        state.allAppsData =
          payload?.data.length > 0
            ? [...state.allAppsData, ...payload?.data]
            : [];
        state.error = null;
      }
    );
    builder.addCase(handleGetYoutubeData.rejected, (state, { payload }) => {
      state.youtube.loading = false;
      state.youtube.error = payload ?? null;
      state.youtube.youtubeData = [];
    });

    //get textscroll data
    builder.addCase(
      handleGetTextScrollData.pending,
      (state, { payload, meta, type }) => {
        state.textScroll.loading = true;
        state.textScroll.error = null;
      }
    );
    builder.addCase(
      handleGetTextScrollData.fulfilled,
      (state, { payload, meta }) => {
        state.textScroll.loading = false;
        state.textScroll.textScrollData = payload?.data ? payload?.data : [];
        state.allAppsData =
          payload?.data.length > 0
            ? [...state.allAppsData, ...payload?.data]
            : [];
        state.error = null;
      }
    );
    builder.addCase(handleGetTextScrollData.rejected, (state, { payload }) => {
      state.textScroll.loading = false;
      state.textScroll.error = payload ?? null;
      state.textScroll.textScrollData = [];
    });

    //get all apps
    builder.addCase(
      handleGetAllApps.pending,
      (state, { payload, meta, type }) => {
        state.allApps.loading = true;
        state.allApps.error = null;
      }
    );
    builder.addCase(handleGetAllApps.fulfilled, (state, { payload, meta }) => {
      state.allApps.loading = false;
      state.allApps.data = payload?.data ?? [];
      state.allAppserror = null;
    });
    builder.addCase(handleGetAllApps.rejected, (state, { payload }) => {
      state.allApps.loading = false;
      state.allApps.error = payload ?? null;
      state.allApps.data = [];
    });

     //get Digital Menu data
     builder.addCase(
      handleGetDigitalMenuData.pending,
      (state, { payload, meta, type }) => {
        state.DigitalMenu.loading = true;
        state.DigitalMenu.error = null;
      }
    );
    builder.addCase(
      handleGetDigitalMenuData.fulfilled,
      (state, { payload, meta }) => {
        state.DigitalMenu.loading = false;
        state.DigitalMenu.DigitalMenuData = payload?.data ? payload?.data : [];
        state.error = null;
      }
    );
    builder.addCase(handleGetDigitalMenuData.rejected, (state, { payload }) => {
      state.DigitalMenu.loading = false;
      state.DigitalMenu.error = payload ?? null;
      state.DigitalMenu.DigitalMenuData = [];
    });
  },
});

export const { } = AppsSlice.actions;

export default AppsSlice.reducer;
