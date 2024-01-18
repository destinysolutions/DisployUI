import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_ROLE_COMBINE } from "../Pages/Api";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  success: null,
  message: null,
  type: null,
};

export const getUserRoleData = createAsyncThunk(
  "data/fetchApiData",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      // const queryParams = new URLSearchParams({ScreenGroupID : null}).toString();
      const response = await axios.options(USER_ROLE_COMBINE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);

const userRoleSlice = createSlice({
  name: "userRole",
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
      .addCase(getUserRoleData.pending, (state) => {
        // getScreenGroup
        state.status = null;
      })
      .addCase(getUserRoleData.fulfilled, (state, action) => {
        // getScreenGroup
        state.status = null;
        state.data = action.payload?.data;
      })
      .addCase(getUserRoleData.rejected, (state, action) => {
        // getScreenGroup
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = userRoleSlice.actions;

export default userRoleSlice.reducer;
