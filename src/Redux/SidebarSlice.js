import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GET_SIDEBAR_MENU } from "../Pages/Api";

const initialState = {
    data: [],
    status: "idle",
    error: null,
    success: null,
    message : null,
    type: null
  };


  export const getMenuAll = createAsyncThunk('data/fetchApiData',async (payload, thunkAPI) => {
      try {
        const token = thunkAPI.getState().root.auth.token;
        const getRole = JSON.parse(localStorage.getItem("userID"))
        const queryParams = new URLSearchParams({ RoleID: getRole.role }).toString();
        const response = await axios.get(`${GET_SIDEBAR_MENU}?${queryParams}`,{headers: { Authorization: `Bearer ${token}` }});
        return response.data;
      } catch (error) {
        console.error('error', error);
        throw error;
      }
    }
  );



const sidebarMenu = createSlice({
    name: "screenGroup",
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
        })
        .addCase(getMenuAll.fulfilled, (state, action) => {    // getMenu
          state.status = null;
          state.data = action.payload?.data;
        })
        .addCase(getMenuAll.rejected, (state, action) => {    // getMenu
          state.status = "failed";
          state.error = action.error.message;
        })
    },
  });
  
  export const { resetStatus } = sidebarMenu.actions;
  
  export default sidebarMenu.reducer;
  