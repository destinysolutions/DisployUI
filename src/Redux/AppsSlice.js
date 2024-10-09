import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { ADD_DATE_APPS, DELETE_DATE_APPS, getUrl, postUrl } from "../Pages/Api";
import axios from "axios";

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

export const handleGetWeatherData = createAsyncThunk(
  "apps/handleGetWeatherData",
  async ({ token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`WeatherApp/GetWeatherApp`, {
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
        headers: { Authorization: token, },
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

// getDate Apps
export const getDateApps = createAsyncThunk("DateApp/getDateApps", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await getUrl(`DateApp/GetAllDateApp`, { headers: { Authorization: `Bearer ${token}`, }, });
    // const response = await axios.get(GET_NOTIFICATIONS, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    toast.error('Failed to fetch data');
    throw error;
  }
});

export const getDateById = createAsyncThunk("DateApp/getDateById", async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await getUrl(`DateApp/SelectDateAppById?ID=${id}`, { headers: { Authorization: `Bearer ${token}`, }, });
    return response.data;
  } catch (error) {
    console.log("error", error);
    toast.error('Failed to fetch data');
    throw error;
  }
});

export const deleteDate = createAsyncThunk("DateApp/deleteDate", async (Id, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams({ id: Id, }).toString();
    const token = thunkAPI.getState().root.auth.token
    const response = await axios.post(`${DELETE_DATE_APPS}?${queryParams}`, {}, { headers: { Authorization: `Bearer ${token}` }, });
    if (response.data.status) {
      return { status: true, message: response.data.message, data: response.data.data, };
    }
  } catch (error) {
    console.log(error);
    throw error
  }
});

export const handleAddDateApps = createAsyncThunk("DealMaster/handleAddDateApps", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ADD_DATE_APPS, payload, { headers: { Authorization: `Bearer ${token}` }, });
    return response.data;
  } catch (error) {
    throw error;
  }
});

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
  weather: {
    loading: false,
    weatherData: [],
    error: null,
  },
  DigitalMenu: {
    loading: false,
    DigitalMenuData: [],
    error: null,
  },
  allAppsData: [],
  DateApps: []
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

    //get weather data
    builder.addCase(
      handleGetWeatherData.pending,
      (state, { payload, meta, type }) => {
        state.weather.loading = true;
        state.weather.error = null;
      }
    );
    builder.addCase(
      handleGetWeatherData.fulfilled,
      (state, { payload, meta }) => {
        state.weather.loading = false;
        state.weather.weatherData = payload?.data ? payload?.data : [];
        state.allAppsData =
          payload?.data.length > 0
            ? [...state.allAppsData, ...payload?.data]
            : [];
        state.error = null;
      }
    );
    builder.addCase(handleGetWeatherData.rejected, (state, { payload }) => {
      state.weather.loading = false;
      state.weather.error = payload ?? null;
      state.weather.weatherData = [];
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
    builder.addCase(getDateApps.pending, (state) => {
      state.status = null;
    })
    builder.addCase(getDateApps.fulfilled, (state, { payload }) => {
      state.status = true;
      state.DateApps = payload?.data;
      state.token = payload?.data?.token;
    })
    builder.addCase(getDateApps.rejected, (state, action) => {
      state.status = false;
      state.error = action.error.message;
    })

    builder.addCase(getDateById.pending, (state) => {
      state.status = false;
    })
    builder.addCase(getDateById.fulfilled, (state, { payload }) => {
      state.status = true;
      state.DateApps = payload?.data;
      state.token = payload?.data?.token;
    })
    builder.addCase(getDateById.rejected, (state, action) => {
      state.status = false;
      state.error = action.error.message;
    })

    builder.addCase(deleteDate.pending, (state) => {
      state.status = false;
    })
    builder.addCase(deleteDate.fulfilled, (state, { payload }) => {
      state.status = true;
      state.data = payload?.data;
      state.token = payload?.data?.token;
    })
    builder.addCase(deleteDate.rejected, (state, action) => {
      state.status = false;
      state.error = action.error.message;
    })

    builder.addCase(handleAddDateApps.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleAddDateApps.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    });
    builder.addCase(handleAddDateApps.rejected, (state, action) => {
      state.status = "failed";
      toast.error = (action.payload.message);

    });
  },
});

export const { } = AppsSlice.actions;

export default AppsSlice.reducer;
