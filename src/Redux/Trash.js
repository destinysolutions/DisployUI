import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const handleGetTrash = createAsyncThunk("UserMaster/Gettrash", async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      if (response?.data?.status) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      console.log("error", error);
      throw error; // Rethrow the error to let the rejection be handled by the rejected action
    }
  }
);

export const handleTrash = createAsyncThunk("UserMaster/handleTrash", async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      if (response?.data?.status) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      console.log("error", error);
      throw error; // Rethrow the error to let the rejection be handled by the rejected action
    }
  }
);

export const handleTrashAll = createAsyncThunk("UserMaster/handleTrashAll", async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      if (response?.data?.status) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      console.log("error", error);
      throw error; // Rethrow the error to let the rejection be handled by the rejected action
    }
  }
);

export const handleTrashRestore = createAsyncThunk("UserMaster/handleTrashRestore", async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      if (response?.data?.status) {
        return response.data;
      } else {
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      console.log("error", error);
      throw error; // Rethrow the error to let the rejection be handled by the rejected action
    }
  }
);

const TrashSlice = createSlice({
    name: 'trashData',
    initialState: {
        deletedData: [],
        isLoading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(handleGetTrash.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.successMessage = null;
          })
          .addCase(handleGetTrash.fulfilled, (state, action) => {
            state.isLoading = false;
            state.deletedData = action.payload?.data; // Assuming action.payload is the data you want to store
          })
          .addCase(handleGetTrash.rejected, (state, action) => {
            state.isLoading = false;
            state.successMessage = null;
            state.error = action.payload ?? "An error occurred while fetching trash data";
          })

          .addCase(handleTrash.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.successMessage = null;
          })
          .addCase(handleTrash.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = "DELETE";
          })
          .addCase(handleTrash.rejected, (state, action) => {
            state.isLoading = false;
            state.successMessage = null;
            state.error = action.payload ?? "Something went wrong. Please try again.";
          })

          .addCase(handleTrashAll.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.successMessage = null;
          })
          .addCase(handleTrashAll.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = "DELETE";
          })
          .addCase(handleTrashAll.rejected, (state, action) => {
            state.isLoading = false;
            state.successMessage = null;
            state.error = action.payload ?? "Something went wrong. Please try again.";
          })

          .addCase(handleTrashRestore.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.successMessage = null;
          })
          .addCase(handleTrashRestore.fulfilled, (state, action) => {
            state.isLoading = false;
            state.successMessage = "RESTORE";
          })
          .addCase(handleTrashRestore.rejected, (state, action) => {
            state.isLoading = false;
            state.successMessage = null;
            state.error = action.payload ?? "Something went wrong. Please try again.";
          });

    },
  });
  
  export default TrashSlice.reducer;