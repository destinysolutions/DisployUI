import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../FireBase/firebase";

export const handleRegisterUser = createAsyncThunk(
  "auth/handleRegisterUser",
  async ({ config }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error?.response) {
        toast.error(error?.response?.data?.message);
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
        console.log(error?.response);
        toast.error(error?.response?.data?.message);
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
        console.log(error?.response);
        toast.error(error?.response?.data?.message);
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
      window.localStorage.clear("timer");
      localStorage.setItem("role_access", "");
      window.location.reload();
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
      state.user = payload;
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
  },
});

export const { handleLogout } = Authslice.actions;

export default Authslice.reducer;
