import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { getUrl } from "../Pages/Api";

export const handleGetAllAssets = createAsyncThunk(
  "asset/handleGetAllAssets",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await getUrl("AssetMaster/GetAll", {
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
  assets: [],
  error: null,
};

const Assetslice = createSlice({
  name: "asset",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(handleGetAllAssets.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetAllAssets.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      const allAssets = [
        ...(payload?.image ? payload?.image : []),
        ...(payload?.video ? payload?.video : []),
        ...(payload?.doc ? payload?.doc : []),
        ...(payload?.onlineimages ? payload?.onlineimages : []),
        ...(payload?.onlinevideo ? payload?.onlinevideo : []),
        ...(payload?.folder ? payload?.folder : []),
      ];

      const sortedAssets = allAssets.sort((a, b) => {
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
      state.assets = sortedAssets;
    });
    builder.addCase(handleGetAllAssets.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.assets = [];
    });
  },
});

export const {} = Assetslice.actions;

export default Assetslice.reducer;
