import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { GET_INDUSTRY } from "../Pages/Api";


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

export const handleScreenLimit = createAsyncThunk(
  "Common/handleScreenLimit",
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

export const handleAllTimeZone = createAsyncThunk(
  "Common/handleAllTimeZone",
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


export const handleAllPosTheme = createAsyncThunk(
  "Common/handleAllPosTheme",
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



export const getIndustry = createAsyncThunk("common/getIndustry", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.get(`${GET_INDUSTRY}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    toast.error('Failed to fetch data');
    throw error;
  }
});


const initialState = {
  loading: false,
  allPlans: [],
  trial: [],
  allFeature: [],
  error: null,
  data: null,
  message: "",
  status: null,
  screenLimit: false,
  timeZoneList: [],
  PosTheme: [],
  Industry: [],
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

    builder.addCase(handleScreenLimit.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleScreenLimit.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.screenLimit = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleScreenLimit.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handleAllTimeZone.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleAllTimeZone.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.timeZoneList = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleAllTimeZone.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handleAllPosTheme.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(handleAllPosTheme.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.PosTheme = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleAllPosTheme.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });



    builder.addCase(getIndustry.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getIndustry.fulfilled, (state, action) => {
      state.loading = false;
      state.Industry = action.payload.data;
      state.token = action?.data?.token;
      state.data = action.payload?.data;
    });

    builder.addCase(getIndustry.rejected, (state, action) => {
      state.loading = false;
      state.Industry = null;
      state.message = action.error.message || "Failed to data";
    });
  },
});

export const { resetStatus } = CommonSlice.actions;

export default CommonSlice.reducer;