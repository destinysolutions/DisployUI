import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUrl } from "../Pages/Api";
import toast from "react-hot-toast";
import axios from "axios";

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
      if (data?.status === 200) return data;
      else {
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleGetCompositionLayouts = createAsyncThunk(
  "composition/handleGetCompositionLayouts",
  async ({ config }, { rejectWithValue, signal }) => {
    try {
      const { data } = await axios.request(config);
      if (data?.status === 200) return data;
      else {
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const handleDeleteAll = createAsyncThunk("composition/handleDeleteAll",async ({ config }, { rejectWithValue, signal }) => {
  try {
    const response = await axios.request(config);
    if (response?.data?.status) {
      return response.data;
    } else {
      return rejectWithValue(response?.data);
    }
  } catch (error) {
    console.log("error", error);
    throw error; // Re-throw the error to be handled in the rejected action
  }
  }
);

const initialState = {
  loading: false,
  compositions: [],
  error: null,
  compositionLayouts: [],
  successMessage: null,
  type: null,
};

const CompositionSlice = createSlice({
  name: "composition",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.successMessage = null;
      state.type = null;
    },
  },
  extraReducers: (builder) => {
    //get all compostions
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
    //get all compostions layouts
    builder.addCase(
      handleGetCompositionLayouts.pending,
      (state, { payload, meta, type }) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addCase(
      handleGetCompositionLayouts.fulfilled,
      (state, { payload, meta }) => {
        state.loading = false;
        state.compositionLayouts = payload?.data;
        state.error = null;
      }
    );
    builder.addCase(
      handleGetCompositionLayouts.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? null;
        state.compositionLayouts = [];
      }
    );

    //delete all
    builder.addCase(handleDeleteAll.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(handleDeleteAll.fulfilled, (state, action) => {
      state.loading = false;
      state.type = "DELETE";
      state.successMessage = action.payload?.message || "Delete SuccessFully";
      state.error = null;
    });
    
    builder.addCase(handleDeleteAll.rejected, (state, action) => {
      state.loading = false;
      state.type = "ERROR";
      state.error = action.error.message ?? null;
    });

  },
});

export const { resetStatus } = CompositionSlice.actions;

export default CompositionSlice.reducer;
