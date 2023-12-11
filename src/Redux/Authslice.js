import { createSlice } from "@reduxjs/toolkit";

// export const handleRegisterUser = createAsyncThunk(
//   "auth/handleRegisterUser",
//   async (
//     {
//       fname,
//       lname,
//       email,
//       phone,
//       civility,
//       password,
//       mobile,
//       company,
//       shippingAddress,
//       signal,
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       signal.current = new AbortController();
//       const response = await PostUrl("signup", {
//         data: {
//           fname,
//           lname,
//           email,
//           phone,
//           password,
//           civility,
//           mobile,
//           company,
//           shippingAddress,
//         },
//         signal: signal.current.signal,
//       });
//       return response.data;
//     } catch (error) {
//       if (error?.response) {
//         toast.error(error?.response?.data?.message);
//         return rejectWithValue(error?.response?.data);
//       }
//     }
//   }
// );

export const handleLoginUser = createAsyncThunk(
  "auth/handleLoginUser",
  async ({ email, password, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("login", {
        data: { email, password },
        signal: signal.current.signal,
      });
      return response.data;
    } catch (error) {
      if (error?.response) {
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
  reducers: {},
});

export const {} = Authslice.actions;

export default Authslice.reducer;
