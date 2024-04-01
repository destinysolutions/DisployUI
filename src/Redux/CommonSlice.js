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

  const initialState = {
    loading: false,
    allPlans :[],
    error: null,
    data: null, 
    message: "",
    status:null,
  };

  const CommonSlice = createSlice({
    name: "asset",
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
    },
  });
  
  export const { resetStatus } = CommonSlice.actions;
  
  export default CommonSlice.reducer;