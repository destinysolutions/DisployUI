import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUrl } from '../Pages/Api';
import toast from 'react-hot-toast';

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
const initialState = {
    Countries: [],
    error: null
}

const SettingUserSlice = createSlice({
    name: "SettingUSer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //get countries data
        builder.addCase(
            handleGetCountries.pending,
            (state, { payload }) => {
                state.error = null;
            }
        );
        builder.addCase(
            handleGetCountries.fulfilled,
            (state, { payload, meta }) => {
                state.Countries = payload.data
                state.error = null
            }
        );
        builder.addCase(handleGetCountries.rejected, (state, { payload }) => {
            state.error = payload??null
            state.Countries=[]

        });
    }
});

export const { } = SettingUserSlice.actions

export default SettingUserSlice.reducer