import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  screens: [],
  error: null,
};

const Screenslice = createSlice({
  name: "screen",
  initialState,
  reducers: {},
});

export const {} = Screenslice.actions;

export default Screenslice.reducer;
