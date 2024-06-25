import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const handleAddCard = createAsyncThunk(
    "Common/handleAddCard",
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
export const GetAllCardList = createAsyncThunk(
    "Common/GetAllCardList",
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

export const handleDeleteCard = createAsyncThunk(
    "Common/handleDeleteCard",
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

export const handleDefaultCard = createAsyncThunk(
    "Common/handleDefaultCard",
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
const initialState = {
    loading: false,
    card: null,
    error: null,
    data: null,
    message: "",
    status: null,
    CardList:[]
};


const CardSlice = createSlice({
    name: "Card",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.error = null;
            state.message = null;
            state.status = null;
            state.card = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(handleAddCard.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handleAddCard.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.card = action.payload;
            state.message = action.payload?.message;
        });
        builder.addCase(handleAddCard.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });

        builder.addCase(GetAllCardList.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(GetAllCardList.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.CardList = action.payload;
            state.message = action.payload?.message;
        });
        builder.addCase(GetAllCardList.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });

        builder.addCase(handleDeleteCard.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handleDeleteCard.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.message = action.payload?.message;
        });
        builder.addCase(handleDeleteCard.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });

        builder.addCase(handleDefaultCard.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(handleDefaultCard.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.message = action.payload?.message;
        });
        builder.addCase(handleDefaultCard.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.message;
            state.message = action.payload?.message;
        });
    },
});

export const { resetStatus } = CardSlice.actions;

export default CardSlice.reducer;