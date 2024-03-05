import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ADD_UPDATE_ORGANIZATION_USER_ROLE,
  GET_ORG_USERS,
  GET_SELECT_BY_STATE,
  GET_USER_SCREEN_DETAILS,
  USER_ROLE_GET,
  getUrl,
} from "../Pages/Api";
import toast from "react-hot-toast";
import axios from "axios";

export const handleGetCountries = createAsyncThunk(
  "SettingUSer/handleGetCountries",
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await getUrl(`Cascading/GetAllCountry`, {
        signal,
      });
      if (data?.status === 200) return data;
      else {
        toast.error(data?.message);
        return rejectWithValue(data?.message);
      }
    } catch (error) {
      rejectWithValue(error?.response?.data?.message);
    }
  }
);

//get state
export const handleGetState = createAsyncThunk(
  "data/handleGetState",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const queryParams = new URLSearchParams({
        CountryID: payload,
      }).toString();
      const response = await axios.get(
        `${GET_SELECT_BY_STATE}?${queryParams}`,
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

// Delete User
export const handleUserDelete = createAsyncThunk(
  "UserMaster/OrgUserSpecificID",
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

// Add User
export const handleAddNewUser = createAsyncThunk(
  "UserMaster/handleAddUser",
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

//get user screens
export const userScreens = createAsyncThunk(
  "data/userScreens",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const queryParams = new URLSearchParams({
        OrgUserSpecificID: payload,
      }).toString();
      const response = await axios.get(
        `${GET_USER_SCREEN_DETAILS}?${queryParams}`,
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

//get user roles
export const getUsersRoles = createAsyncThunk(
  "data/getUsersRoles",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const response = await axios.post(
        ADD_UPDATE_ORGANIZATION_USER_ROLE,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        return {
          status: true,
          message: response.data.message,
          data: response.data.data,
        };
      } else {
        return { status: false, message: "Failed to Load data" };
      }
    } catch (error) {
      throw error;
    }
  }
);

//get users
export const getOrgUsers = createAsyncThunk(
  "data/getOrgUsers",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const response = await axios.post(GET_ORG_USERS, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);

//get user screens
export const handleSelectUserById = createAsyncThunk(
  "data/handleSelectUserById",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const queryParams = new URLSearchParams({
        OrgUserSpecificID: payload,
      }).toString();
      const response = await axios.post(
        `${GET_ORG_USERS}?${queryParams}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
// Add Edit User Role
export const handleAddNewUserRole = createAsyncThunk(
  "UserMaster/handleAddNewUserRole",
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

// get userRole by id
export const handleUserRoleById = createAsyncThunk(
  "UserMaster/handleUserRoleById",
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

//get users
export const getOrgUsersRole = createAsyncThunk(
  "data/getOrgUsersRole",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().root.auth.token;
      const response = await axios.post(USER_ROLE_GET, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
);

// get phone number verify
export const handlePhoneNumberverify = createAsyncThunk(
  "UserMaster/handlePhoneNumberverify",
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

// get OTP verify
export const handleOTPverify = createAsyncThunk(
  "UserMaster/handleOTPverify",
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

const initialState = {
  Countries: [],
  error: null,
  data: null, // User data
  status: "idle", // Request status: 'idle', 'loading', 'succeeded', or 'failed'
  message: "", // Message to display (success or error message)
};

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
    builder.addCase(handleGetCountries.pending, (state, { payload }) => {
      state.error = null;
    });
    builder.addCase(
      handleGetCountries.fulfilled,
      (state, { payload, meta }) => {
        state.Countries = payload?.data;
        state.error = null;
      }
    );
    builder.addCase(handleGetCountries.rejected, (state, { payload }) => {
      state.error = payload ?? null;
      state.Countries = [];
    });

    builder.addCase(handleAddNewUser.pending, (state) => {
      // Add User
      state.status = "loading";
    });
    builder.addCase(handleAddNewUser.fulfilled, (state, action) => {
      // Add User
      state.status = "succeeded";
      state.data = action.payload;
      state.message = action.payload.message || "User Add successfully";
    });
    builder.addCase(handleAddNewUser.rejected, (state, action) => {
      // Add User
      state.status = "failed";
      state.error = action.payload.message;
      state.message =
        action.payload.message || "This user is not insert try agin";
    });

    builder.addCase(handleUserDelete.pending, (state) => {
      // Delete User
      state.status = "loading";
    });
    builder.addCase(handleUserDelete.fulfilled, (state, action) => {
      // Delete User
      state.status = "succeeded";
      state.data = action.payload;
      state.message = action.payload?.message || "User deleted successfully";
    });
    builder.addCase(handleUserDelete.rejected, (state, action) => {
      // Delete User
      state.status = "failed";
      state.error = action.payload?.message;
      state.message = "Failed to delete user";
    });

    builder.addCase(userScreens.pending, (state) => {
      state.status = null;
    });
    builder.addCase(userScreens.fulfilled, (state, action) => {
      state.status = null;
      state.getUserData = action.payload?.data;
    });
    builder.addCase(userScreens.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builder.addCase(getUsersRoles.pending, (state) => {
      state.status = null;
    });
    builder.addCase(getUsersRoles.fulfilled, (state, action) => {
      state.status = null;
      state.getUserData = action.payload?.data;
    });
    builder.addCase(getUsersRoles.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builder.addCase(handleGetState.pending, (state) => {
      state.status = null;
    });
    builder.addCase(handleGetState.fulfilled, (state, action) => {
      state.status = null;
      state.getUserData = action.payload?.data;
    });
    builder.addCase(handleGetState.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builder.addCase(getOrgUsers.pending, (state) => {
      state.status = null;
    });
    builder.addCase(getOrgUsers.fulfilled, (state, action) => {
      state.status = null;
      state.getUserData = action.payload?.data;
    });
    builder.addCase(getOrgUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builder.addCase(handleSelectUserById.pending, (state) => {
      state.status = null;
    });
    builder.addCase(handleSelectUserById.fulfilled, (state, action) => {
      state.status = null;
      state.getUserData = action.payload?.data;
    });
    builder.addCase(handleSelectUserById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builder.addCase(handleAddNewUserRole.pending, (state) => {
      // Add User Role
      state.status = "loading";
    });
    builder.addCase(handleAddNewUserRole.fulfilled, (state, action) => {
      // Add User Role
      state.status = "succeeded";
      state.data = action.payload;
      state.message = action.payload.message || "User Role saved successfully";
    });
    builder.addCase(handleAddNewUserRole.rejected, (state, action) => {
      // Add User Role
      state.status = "failed";
      state.error = action.payload.message;
      state.message =
        action.payload.message || "This user is not insert try agin";
    });

    // userRole By Id
    builder.addCase(handleUserRoleById.pending, (state) => {
      state.status = false;
    });
    builder.addCase(handleUserRoleById.fulfilled, (state, action) => {
      state.status = true;
      state.data = action.payload;
      // state.message = action.payload.message || "User Role saved successfully";
    });
    builder.addCase(handleUserRoleById.rejected, (state, action) => {
      state.status = false;
      state.error = action.payload.message;
      // state.message =
      //   action.payload.message || "This user is not insert try agin";
    });

    builder.addCase(getOrgUsersRole.pending, (state) => {
      state.status = null;
    });
    builder.addCase(getOrgUsersRole.fulfilled, (state, action) => {
      state.status = null;
      state.getUserData = action.payload?.data;
    });
    builder.addCase(getOrgUsersRole.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    // phone number verify
    builder.addCase(handlePhoneNumberverify.pending, (state) => {
      state.status = false;
    });
    builder.addCase(handlePhoneNumberverify.fulfilled, (state, action) => {
      state.status = true;
      state.data = action.payload;
    });
    builder.addCase(handlePhoneNumberverify.rejected, (state, action) => {
      state.status = false;
      state.error = action.payload.message;
   
    });

     // OTP verify
     builder.addCase(handleOTPverify.pending, (state) => {
      state.status = false;
    });
    builder.addCase(handleOTPverify.fulfilled, (state, action) => {
      state.status = true;
      state.data = action.payload;
    });
    builder.addCase(handleOTPverify.rejected, (state, action) => {
      state.status = false;
      state.error = action.payload.message;
      
    });
  },
});

export const { resetStatus } = SettingUserSlice.actions;

export default SettingUserSlice.reducer;
