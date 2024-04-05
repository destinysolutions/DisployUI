import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GET_SIDEBAR_MENU, MENU_ACCESS } from "../Pages/Api";

const initialState = {
  data: [],
  menuAccess: [],
  status: "idle",
  error: null,
  success: null,
  message: null,
  loading: false,
  type: null
};


export const getMenuAll = createAsyncThunk('data/fetchApiData', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const user = thunkAPI.getState().root.auth.user;
    const queryParams = new URLSearchParams({ RoleID: user?.userRole }).toString();
    const response = await axios.get(`${GET_SIDEBAR_MENU}?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}
);

export const getMenuPermission = createAsyncThunk('data/getMenuPermission', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().root.auth.token;
    const queryParams = new URLSearchParams(payload).toString();
    const response = await axios.get(`${MENU_ACCESS}?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}
);


const sidebarMenu = createSlice({
  name: "sidebar",
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
      .addCase(getMenuAll.pending, (state) => {    // getMenu
        state.status = null;
        state.loading = true;
      })
      .addCase(getMenuAll.fulfilled, (state, action) => {    // getMenu
        state.status = null;
        state.loading = false;
        state.data = action.payload?.data;
      })
      .addCase(getMenuAll.rejected, (state, action) => {    // getMenu
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getMenuPermission.pending, (state) => {    // getMenu
        state.status = null;
      })
      .addCase(getMenuPermission.fulfilled, (state, action) => {    // getMenu
        state.status = null;
        state.menuAccess = action.payload?.data;
      })
      .addCase(getMenuPermission.rejected, (state, action) => {    // getMenu
        state.status = "failed";
        state.error = action.error.message;
      })

  },
});

export const { resetStatus } = sidebarMenu.actions;

export default sidebarMenu.reducer;
