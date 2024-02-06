import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GET_USER_BY_USERROLE, USER_ROLE_COMBINE } from "../Pages/Api";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  success: null,
  message: null,
  type: null,
  getUserData: [],
  dataRole : []
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

export const roleBaseUserFind = createAsyncThunk(
  "data/roleBaseUserFind",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const queryParams = new URLSearchParams({
        UserRoleID: payload,
      }).toString();
      const response = await axios.get(
        `${GET_USER_BY_USERROLE}?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        return {
          status: true,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        return { status: false, message: "Failed to data" };
      }
    } catch (error) {
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
        state.status = null;
      })
      .addCase(getUserRoleData.fulfilled, (state, action) => {
        state.status = null;
        state.data = action.payload?.data;
        state.dataRole = action.payload?.data;
      })
      .addCase(getUserRoleData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(roleBaseUserFind.pending, (state) => {
        state.status = null;
      })
      .addCase(roleBaseUserFind.fulfilled, (state, action) => {
        state.status = null;
        state.getUserData = action?.payload?.data;
      })
      .addCase(roleBaseUserFind.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = userRoleSlice.actions;

export default userRoleSlice.reducer;
