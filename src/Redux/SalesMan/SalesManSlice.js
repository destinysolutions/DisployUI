import toast from "react-hot-toast";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ADD_REGISTER_URL, UPDATE_USER_ORG } from "../../Pages/Api";

const initialState = {
    data: [],
    status: "idle",
    error: null,
    success: null,
    message: null,
};

// Add Sales Man
export const addSalesManData = createAsyncThunk("data/postData", async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const response = await axios.post(ADD_REGISTER_URL, payload, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  );
  
  // Add Sales Man
  export const updateSalesManData = createAsyncThunk("data/update", async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const queryParams = new URLSearchParams(payload).toString();
      const response = await axios.post(`${UPDATE_USER_ORG}?${queryParams}`, null, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
  );


export const GetAllSalesMan = createAsyncThunk(
    "salesMan/GetAllSalesMan",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            if (response?.data?.status) {
                return response.data;
            } else {
                return rejectWithValue(response?.data);
            }
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);

export const GetSalesManDashboard = createAsyncThunk(
    "salesMan/GetSalesManDashboard",
    async ({ config }, { rejectWithValue }) => {
        try {
            const response = await axios.request(config);
            if (response?.data?.status) {
                return response.data;
            } else {
                return rejectWithValue(response?.data);
            }
        } catch (error) {
            if (error?.response) {
                return rejectWithValue(error?.response?.data);
            }
        }
    }
);



const SalesManSlice = createSlice({
    name: "salesMan",
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
        .addCase(addSalesManData.pending, (state) => {
            state.status = "loading";
        })
        .addCase(addSalesManData.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
        })
        .addCase(addSalesManData.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
        });

        builder
        .addCase(updateSalesManData.pending, (state) => {
            state.status = "loading";
        })
        .addCase(updateSalesManData.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
        })
        .addCase(updateSalesManData.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
        });

        builder
        .addCase(GetAllSalesMan.pending, (state) => {
            state.status = "loading";
        })
        .addCase(GetAllSalesMan.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
        })
        .addCase(GetAllSalesMan.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
        });

        builder
        .addCase(GetSalesManDashboard.pending, (state) => {
            state.status = "loading";
        })
        .addCase(GetSalesManDashboard.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
        })
        .addCase(GetSalesManDashboard.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
        });

    },
});

export const { resetStatus } = SalesManSlice.actions;

export default SalesManSlice.reducer;