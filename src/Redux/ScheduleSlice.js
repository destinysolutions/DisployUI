import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUrl, postUrl } from "../Pages/Api";
import toast from "react-hot-toast";
import axios from "axios";

export const handleGetAllSchedule = createAsyncThunk(
  "schedule/handleGetAllSchedule",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await getUrl("ScheduleMaster/GetAllSchedule", {
        headers: {
          Authorization: token,
        },
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

export const handleGetScheduleById = createAsyncThunk(
  "schedule/handleGetScheduleById",
  async ({ id, token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`EventMaster/SelectByID?ID=${id}`, {
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

export const handleUpdateTimezone = createAsyncThunk(
  "schedule/handleUpdateTimezone",
  async ({ id, timeZoneName, userID, token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await postUrl(`ScheduleMaster/UpdateTimeZone`, {
        data: {
          scheduleId: id,
          timeZoneName,
          userID,
        },
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
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

export const handleDeleteScheduleById = createAsyncThunk(
  "schedule/handleDeleteScheduleById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { data } = await postUrl("ScheduleMaster/AddSchedule", {
        data: {
          scheduleId: id,
          operation: "Delete",
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
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleDeleteScheduleAll = createAsyncThunk("schedule/handleDeleteScheduleAll", async ({ config }, { rejectWithValue }) => {
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

const initialState = {
  loading: false,
  successMessage : null,
  schedules: [],
  error: null,
  type:null,
  deleteLoading: false,
  singleSchedule: null,
};

const ScheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    handleChangeSchedule: (state, { payload }) => {
      state.schedules = payload;
    },
  },
  extraReducers: (builder) => {
    //get all
    builder.addCase(handleGetAllSchedule.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
      state.schedules = [];
    });
    builder.addCase(
      handleGetAllSchedule.fulfilled,
      (state, { payload, meta, type }) => {
        state.loading = false;
        state.schedules = payload?.data ?? [];
        state.error = null;
      }
    );
    builder.addCase(handleGetAllSchedule.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload ?? null;
      state.schedules = [];
    });

    //get by id
    builder.addCase(
      handleGetScheduleById.pending,
      (state, { payload, meta, type }) => {
        state.deleteLoading = true;
        state.error = null;
      }
    );
    builder.addCase(
      handleGetScheduleById.fulfilled,
      (state, { payload, meta }) => {
        state.deleteLoading = false;
        state.singleSchedule = payload?.data[0];
        state.error = null;
      }
    );
    builder.addCase(handleGetScheduleById.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.error = payload ?? null;
      state.singleSchedule = null;
    });

    //update timezone
    builder.addCase(
      handleUpdateTimezone.fulfilled,
      (state, { payload, meta }) => {
        state.error = null;
      }
    );
    builder.addCase(handleUpdateTimezone.rejected, (state, { payload }) => {
      state.error = payload ?? null;
    });

    //delete by id
    builder.addCase(
      handleDeleteScheduleById.pending,
      (state, { payload, meta, type }) => {
        state.deleteLoading = true;
        state.error = null;
      }
    );
    builder.addCase(
      handleDeleteScheduleById.fulfilled,
      (state, { payload, meta }) => {
        state.deleteLoading = false;
        state.schedules = state.schedules.filter(
          (data) => data.scheduleId !== meta.arg?.id
        );
        state.error = null;
      }
    );
    builder.addCase(handleDeleteScheduleById.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.error = payload ?? null;
      state.schedules = state.schedules;
    });

    //delete all
    builder.addCase(
      handleDeleteScheduleAll.pending,(state, { payload, meta, type }) => {
        state.deleteLoading = true;
        state.error = null;
      }
    );
    builder.addCase(handleDeleteScheduleAll.fulfilled,(state, { payload, meta }) => {
        state.deleteLoading = false;
        state.type = "DELETE"
        state.successMessage = payload?.message || "Delete SuccessFully"
        state.schedules = payload?.data ?? [];
        state.error = null;
      }
    );
    builder.addCase(handleDeleteScheduleAll.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.error = payload ?? null;
      state.schedules = state.schedules;
    });
  },
});

export const { handleChangeSchedule } = ScheduleSlice.actions;

export default ScheduleSlice.reducer;
