import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axios from "axios";
import { ADD_ADMIN_RATE, ADD_COST_AREA, ASSIGN_ADS, DELETE_COST_AREA, GETALLADS, GET_COST_AREA, GET_NOTIFICATIONS, UPDATE_ADS_RATE } from "../../Pages/Api";


const initialState = {
  data: [],
  getNotification: [],
  status: "idle",
  error: null,
  success: null,
  message: null,
  type: null,
  costbyArea: []
};

// getAdvertisementData all
export const getAdvertisementData = createAsyncThunk("data/fetchApiData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.get(GETALLADS, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// Assign Advertisement 
export const assignAdvertisement = createAsyncThunk("data/postData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ASSIGN_ADS, payload, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// getNotification all
export const getNotificationData = createAsyncThunk("data/getNotificationData", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.get(GET_NOTIFICATIONS, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// getNotification all
export const UpdateAdsRate = createAsyncThunk("data/UpdateAdsRate", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.post(`${UPDATE_ADS_RATE}?${queryParams}`, null, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

export const AddMarginRate = createAsyncThunk("data/AddMarginRate", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(`${ADD_ADMIN_RATE}`, payload, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
);

// GetAllCostByArea 
export const getCostByArea = createAsyncThunk("AdsCustomer/getCostByArea", async (payload, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams({ CostByAreaID: payload ? payload : 0 }).toString();
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.get(`${GET_COST_AREA}?${queryParams}`, { headers: { Authorization: `Bearer ${token}` }, });
    return response.data;
  } catch (error) {
    console.log("error", error);
    toast.error('Failed to fetch data');
    throw error;
  }
});

export const deleteCostByArea = createAsyncThunk("AdsCustomer/deleteCostByArea", async (ID,) => {
  try {
    const queryParams = new URLSearchParams({ CostByAreaID: ID }).toString()
    const response = await axios.get(`${DELETE_COST_AREA}?${queryParams}`)
    return response.data
  } catch (error) {
    console.log(error)
    toast.error("Failed to fech data")
    throw error;
  }
})

// insert Costbyarea
export const handleAddCostbyarea = createAsyncThunk("data/handleAddCostbyarea", async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const response = await axios.post(ADD_COST_AREA, payload, { headers: { Authorization: `Bearer ${token}` }, });
    return response.data;
  } catch (error) {
    throw error;
  }
});

const AdvertisementSlice = createSlice({
  name: "advertisementData",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.message = null;
      state.status = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAdvertisementData.pending, (state) => {    // getRetailer
        state.status = null;
      })
      .addCase(getAdvertisementData.fulfilled, (state, action) => {    // getRetailer
        state.status = null;
        state.data = action.payload?.data;
      })
      .addCase(getAdvertisementData.rejected, (state, action) => {    // getRetailer
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(assignAdvertisement.pending, (state) => {    // addData
        state.status = null;
      })
      .addCase(assignAdvertisement.fulfilled, (state, action) => {    // addData
        state.status = "succeeded";
        state.data = action.payload?.data;
        state.message = action.payload.message || 'Save data successFully';
      })
      .addCase(assignAdvertisement.rejected, (state, action) => {    // addData
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getNotificationData.pending, (state) => {    // addData
        state.status = null;
      })
      .addCase(getNotificationData.fulfilled, (state, action) => {    // addData
        state.status = "get";
        state.getNotification = action.payload?.data;
      })
      .addCase(getNotificationData.rejected, (state, action) => {    // addData
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(UpdateAdsRate.pending, (state) => {
        state.status = null;
      })
      .addCase(UpdateAdsRate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(UpdateAdsRate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(AddMarginRate.pending, (state) => {
        state.status = null;
      })
      .addCase(AddMarginRate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(AddMarginRate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getCostByArea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCostByArea.fulfilled, (state, action) => {
        state.loading = false;
        state.costbyArea = action.payload.data;
        state.token = action?.data?.token;
        state.data = action.payload?.data;
      })

      .addCase(getCostByArea.rejected, (state, action) => {
        state.loading = false;
        state.costbyArea = null;
        state.message = action.error.message || "Failed to data";
      })

      .addCase(deleteCostByArea.pending, (state) => {
        state.status = "loading"
      })

      .addCase(deleteCostByArea.fulfilled, (state, action) => {
        state.status = "succeded"
        state.data = action.payload
        state.message = action.payload?.message || "Cost by Area deleted successfully";

      })
      .addCase(deleteCostByArea.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message;
        state.message = "Failed to delete Price";
      });

    builder.addCase(handleAddCostbyarea.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(handleAddCostbyarea.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
      toast.success('Location Saved Successfully');
    });

    builder.addCase(handleAddCostbyarea.rejected, (state, action) => {
      state.loading = false;
      state.status = "failed";
      toast.error(action.payload.message);
    });
  },
});

export const { resetStatus } = AdvertisementSlice.actions;

export default AdvertisementSlice.reducer;