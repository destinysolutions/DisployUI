import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUrl } from '../Pages/Api';
import toast from 'react-hot-toast';
import axios from 'axios';

export const handleGetCountries = createAsyncThunk(
    "SettingUSer/handleGetCountries",
    async (_, { rejectWithValue, signal }) => {
        try {
            const { data } = await getUrl(`Cascading/GetAllCountry`, {
                signal,
            });
            if (data?.status == 200) return data;
            else {
                toast.error(data?.message);
                return rejectWithValue(data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
            rejectWithValue(error?.response?.data?.message);
        }
    }
);


// Delete User
export const handleUserDelete = createAsyncThunk("UserMaster/OrgUserSpecificID",
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
          toast.error(error?.response?.data?.message);
          return rejectWithValue(error?.response?.data);
        }
      }
    }
);


// Add User
export const handleAddNewUser = createAsyncThunk("UserMaster/handleAddUser",
    async ({ config }, { rejectWithValue }) => {
      try {
        const response = await axios.request(config);
        console.log("response",response.data);
        if (response?.data?.status) {
          return response.data;
        } else {
          return rejectWithValue(response?.data);
        }
      } catch (error) {
        if (error?.response) {
          toast.error(error?.response?.data?.message);
          return rejectWithValue(error?.response?.data);
        }
      }
    }
);

const initialState = {
    Countries: [],
    error: null,
    data: null,       // User data 
    status: 'idle',   // Request status: 'idle', 'loading', 'succeeded', or 'failed'
    message: '',      // Message to display (success or error message)
  
}

const SettingUserSlice = createSlice({
    name: "SettingUSer",
    initialState,
    reducers: {
    resetStatus: (state) => {
        state.error = null;
        state.message = null;
        state.status = null;
      },
    },
    extraReducers: (builder) => {
        //get countries data
        builder.addCase(handleGetCountries.pending,(state, { payload }) => {
                state.error = null;
            }
        );
        builder.addCase(handleGetCountries.fulfilled,(state, { payload, meta }) => {
                state.Countries = payload.data
                state.error = null
            }
        );
        builder.addCase(handleGetCountries.rejected, (state, { payload }) => {
            state.error = payload??null
            state.Countries=[]
        });

        builder.addCase(handleAddNewUser.pending, (state) => {     // Add User
          state.status = 'loading';
        })
        builder.addCase(handleAddNewUser.fulfilled, (state, action) => {  // Add User
          state.status = 'succeeded';
          state.data = action.payload;
          state.message =  action.payload.message || 'User Add successfully';
        })
        builder.addCase(handleAddNewUser.rejected, (state, action) => {     // Add User
          state.status = 'failed';
          state.error = action.payload.message;
          state.message = action.payload.message;;
        });

        builder.addCase(handleUserDelete.pending, (state) => {     // Delete User
            state.status = 'loading';
          })
          builder.addCase(handleUserDelete.fulfilled, (state, action) => {  // Delete User
            state.status = 'succeeded';
            state.data = action.payload;
            state.message =  action.payload.message || 'User deleted successfully';
          })
          builder.addCase(handleUserDelete.rejected, (state, action) => {     // Delete User
            state.status = 'failed';
            state.error = action.payload.message;
            state.message = 'Failed to delete user';
          });
    }
});

export const { resetStatus } = SettingUserSlice.actions

export default SettingUserSlice.reducer