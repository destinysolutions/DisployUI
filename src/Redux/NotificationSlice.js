import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";


export const handleGetAllNotifications = createAsyncThunk(
    "Common/handleGetAllNotifications",
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

  export const handleGetAllRemoveNotifications = createAsyncThunk(
    "Common/handleGetAllRemoveNotifications",
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
    allNotifications: [],
    error: null,
    data: null,
    message: "",
    status: null,
  };


  const NotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
      resetStatus: (state) => {
        state.error = null;
        state.message = null;
        state.status = null;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(handleGetAllNotifications.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(handleGetAllNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allNotifications = action.payload;
        state.message = action.payload?.message;
      });
      builder.addCase(handleGetAllNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.message = action.payload?.message;
      });

      builder.addCase(handleGetAllRemoveNotifications.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(handleGetAllRemoveNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allNotifications = action.payload;
        state.message = action.payload?.message;
      });
      builder.addCase(handleGetAllRemoveNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.message = action.payload?.message;
      });
    },
  });
  
  export const { resetStatus } = NotificationSlice.actions;
  
  export default NotificationSlice.reducer;