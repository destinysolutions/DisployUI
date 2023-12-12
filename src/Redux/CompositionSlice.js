import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUrl } from "../Pages/Api";
import toast from "react-hot-toast";

export const handleGetCompositions = createAsyncThunk(
  "composition/handleGetCompositions",
  async ({ id, token }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(
        `CompositionMaster/GetAllCompositionMaster`,
        {
          headers: {
            Authorization: token,
          },
          signal,
        }
      );
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
  compositions: [],
  error: null,
};

const CompositionSlice = createSlice({
  name: "composition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //get by user id
    builder.addCase(
      handleGetCompositions.pending,
      (state, { payload, meta, type }) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      handleGetCompositions.fulfilled,
      (state, { payload, meta }) => {
        state.loading = false;
        state.compositions = payload?.data;
        state.error = null;
      }
    );
    builder.addCase(handleGetCompositions.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload ?? null;
      state.compositions = [];
    });
  },
});

export const {} = CompositionSlice.actions;

export default CompositionSlice.reducer;
