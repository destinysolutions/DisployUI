import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";


export const handleGetAllPlans = createAsyncThunk(
  "Common/handleGetAllPlans",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response?.data);
      }
    }
  }
);

export const handleGetTrialPlan = createAsyncThunk(
  "Common/handleGetTrialPlan",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response?.data);
      }
    }
  }
);

export const handleEditTrialPlan = createAsyncThunk(
  "Common/handleEditTrialPlan",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response?.data);
      }
    }
  }
);

export const handleAllFeatureList = createAsyncThunk(
  "Common/handleAllFeatureList",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response?.data);
      }
    }
  }
);


const initialState = {
  loading: false,
  allPlans: [],
  trial: [],
  allFeature:[],
  error: null,
  data: null,
  message: "",
  status: null,
};

const CommonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.message = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleGetAllPlans.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleGetAllPlans.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.allPlans = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleGetAllPlans.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handleGetTrialPlan.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleGetTrialPlan.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.trial = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleGetTrialPlan.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handleEditTrialPlan.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleEditTrialPlan.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.trial = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleEditTrialPlan.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handleAllFeatureList.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleAllFeatureList.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.allFeature = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleAllFeatureList.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });
  },
});

export const { resetStatus } = CommonSlice.actions;

export default CommonSlice.reducer;