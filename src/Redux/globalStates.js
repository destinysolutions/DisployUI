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
        toast.error(data?.message || "Something went wrong!!!");
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      toast.remove();
      toast.error(error?.response?.data?.message || "Something went wrong!!!");
      rejectWithValue(error?.response?.data?.message);
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
        window.location.reload();
        navigateFromCompositionChannel.close();
      };
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
  },
});

export const {
  handleChangeNavigateFromComposition,
  handleNavigateFromCompositionChannel,
  handleNavigateFromComposition,
} = globalStates.actions;

export default globalStates.reducer;
