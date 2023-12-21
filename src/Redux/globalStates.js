import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUrl } from "../Pages/Api";
import toast from "react-hot-toast";

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

const initialState = {
  timezoneLoading: false,
  timezones: [],
};

const globalStates = createSlice({
  name: "globalstates",
  initialState,
  reducers: {},
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

export const {} = globalStates.actions;

export default globalStates.reducer;
