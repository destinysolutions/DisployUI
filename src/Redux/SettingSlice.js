import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUrl, postUrl } from "../Pages/Api";
import toast from "react-hot-toast";

export const handleGetStorageDetails = createAsyncThunk(
  "setting/handleGetStorageDetails",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await postUrl("UserMaster/GetStorageDetails", {
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
      toast.error(error?.response?.data?.message);
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  storageDegtails: null,
};

const SettingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(handleGetStorageDetails.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetStorageDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.storageDegtails = payload?.data;
    });
    builder.addCase(handleGetStorageDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.storageDegtails = null;
    });
  },
});

export const {} = SettingSlice.actions;

export default SettingSlice.reducer;
