import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUrl } from "../Pages/Api";
import toast from "react-hot-toast";
import { BroadcastChannel } from "broadcast-channel";

export const handleGetAllScheduleTimezone = createAsyncThunk(
  "asset/handleGetAllScheduleTimezone",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await getUrl("EventMaster/GetAllTimeZone", {
        headers: {
          Authorization: token,
        },
      });
      if (data?.status == 200) return data;
      else {
        toast.remove();
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.remove();
      toast.error(error?.response?.data?.message || "Something went wrong!!!");
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handelGetSessionToken = createAsyncThunk(
  "globalstates/handelGetSessionToken",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getUrl("GoogleDrive/GetSession");
      return data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Network error. Please check your internet connection.!!!"
      );
      return rejectWithValue(error?.response?.data);
    }
  }
);

const navigateFromCompositionChannel = new BroadcastChannel(
  "navigateFromComposition"
);

const initialState = {
  timezoneLoading: false,
  timezones: [],
  navigateFromComposition: false,
  session_token_apideck: null,
  tokenLoading: false,
};

const globalStates = createSlice({
  name: "globalstates",
  initialState,
  reducers: {
    handleChangeNavigateFromComposition: (state, { payload }) => {
      state.navigateFromComposition = payload;
    },
    handleNavigateFromComposition: (state, { payload }) => {
      navigateFromCompositionChannel.postMessage("");
      navigateFromCompositionChannel.onmessage = (event) => {
        navigateFromCompositionChannel.close();
      };
    },
    handleNavigateFromCompositionChannel: (state, { payload }) => {
      state.navigateFromComposition = false;
      navigateFromCompositionChannel.onmessage = (event) => {
        // window.location.reload();
        navigateFromCompositionChannel.close();
      };
    },
    handleChangeSessionToken: (state, { payload }) => {
      state.session_token_apideck = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      handleGetAllScheduleTimezone.pending,
      (state, { payload }) => {
        state.timezoneLoading = true;
        state.timezones = [];
      }
    );
    builder.addCase(
      handleGetAllScheduleTimezone.fulfilled,
      (state, { payload }) => {
        state.timezoneLoading = false;
        state.timezones = payload?.data;
      }
    );
    builder.addCase(
      handleGetAllScheduleTimezone.rejected,
      (state, { payload }) => {
        state.timezoneLoading = false;
        state.timezones = [];
      }
    );

    // get session token
    builder.addCase(handelGetSessionToken.pending, (state, { payload }) => {
      state.tokenLoading = true;
    });
    builder.addCase(handelGetSessionToken.fulfilled, (state, { payload }) => {
      let data = JSON.parse(payload?.data);
      state.session_token_apideck = data?.data?.session_token;
      state.tokenLoading = false;
    });
    builder.addCase(handelGetSessionToken.rejected, (state, { payload }) => {
      state.session_token_apideck = null;
      state.tokenLoading = false;
    });
  },
});

export const {
  handleChangeNavigateFromComposition,
  handleNavigateFromCompositionChannel,
  handleNavigateFromComposition,
  handleChangeSessionToken,
} = globalStates.actions;

export default globalStates.reducer;
