import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../FireBase/firebase";
import { getUrl, postUrl } from "../Pages/Api";

export const handleRegisterUser = createAsyncThunk(
  "auth/handleRegisterUser",
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

export const handleLoginUser = createAsyncThunk(
  "auth/handleLoginUser",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      if (response?.data?.status == 200) {
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

export const handleLoginWithGoogle = createAsyncThunk(
  "auth/handleLoginWithGoogle",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      if (response?.data?.status == 200) {
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

export const handleGetUserDetails = createAsyncThunk(
  "auth/handleGetUserDetails",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await getUrl(`Register/SelectByID/?ID=${id}`, {
        headers: { Authorization: token },
      });
      if (Object.values(response?.data?.data).length > 0) {
        return response.data?.data;
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

export const UpdateUserDetails = createAsyncThunk(
  "auth/UpdateUserDetails",
  async ({ data, file, user, token }, { rejectWithValue }) => {
    let formdata = new FormData();
    formdata.append("orgUserSpecificID", user?.userID);
    formdata.append("firstName", data?.firstName);
    formdata.append("lastName", data?.lastName);
    formdata.append("email", data?.email);
    formdata.append("phone", data?.phone);
    formdata.append("isActive", "1");
    formdata.append("orgUserID", user?.userID);
    formdata.append("userRole", "0");
    formdata.append("countryID", data?.countryID);
    formdata.append("company", "Admin");
    formdata.append("operation", "Save");
    formdata.append("address", data?.address);
    formdata.append("stateId", data?.stateId);
    formdata.append("zipCode", data?.zipCode);
    formdata.append("languageId", data?.languageId);
    formdata.append("timeZoneId", data?.timeZoneId);
    formdata.append("currencyId", data?.currencyId);
    formdata.append("IsFromUserMaster", 0);
    if (file !== null && file !== undefined) {
      formdata.append("file", file);
    } else {
      formdata.append("profilePhoto", data?.profilePhoto);
    }
    try {
      const response = await postUrl("UserMaster/AddOrgUserMaster", {
        data: formdata,
        headers: { Authorization: token, "Content-Type": "multipart/formdata" },
      });
      if (Object.values(response?.data).length > 0) {
        return response.data?.data;
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
  loading: false,
  user: null,
  error: null,
  token: null,
  userDetails: null,
};

const Authslice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleLogout: (state, { payload }) => {
      state.loading = true;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      // auth.signOut();
      window.location.href = window.location.origin;
      window.localStorage.removeItem("timer");
      localStorage.setItem("role_access", "");
      // window.location.reload();
    },
  },
  extraReducers: (builder) => {
    // login user
    builder.addCase(handleRegisterUser.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleRegisterUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = null;
      state.error = null;
      state.token = payload?.data?.token;
    });
    builder.addCase(handleRegisterUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.user = null;
      state.error = payload ?? null;
      state.token = null;
    });

    // login user
    builder.addCase(handleLoginUser.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleLoginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = null;
      state.token = payload?.data?.token;
    });
    builder.addCase(handleLoginUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.user = null;
      state.error = payload ?? null;
      state.token = null;
    });

    // login with google
    builder.addCase(handleLoginWithGoogle.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleLoginWithGoogle.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
      state.error = null;
      state.token = payload?.data?.token;
    });
    builder.addCase(handleLoginWithGoogle.rejected, (state, { payload }) => {
      state.loading = false;
      state.user = null;
      state.error = payload ?? null;
      state.token = null;
    });

    // get user details
    builder.addCase(handleGetUserDetails.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userDetails = payload;
      state.error = null;
    });
    builder.addCase(handleGetUserDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.userDetails = null;
      state.error = payload ?? null;
    });

    // update user details
    builder.addCase(UpdateUserDetails.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(UpdateUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userDetails = payload?.model;
      state.error = null;
    });
    builder.addCase(UpdateUserDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.userDetails = state.userDetails;
      state.error = payload ?? null;
    });
  },
});

export const { handleLogout } = Authslice.actions;

export default Authslice.reducer;
