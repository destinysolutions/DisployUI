import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { getUrl, postUrl } from "../Pages/Api";

export const handleGetAllAssets = createAsyncThunk(
  "asset/handleGetAllAssets",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await getUrl("AssetMaster/GetAll", {
        headers: {
          Authorization: token,
        },
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

export const handleGetAllAssetsTypeBase = createAsyncThunk(
  "AssetMaster/handleGetAllAssetsTypeBase",
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

export const handleCheckFolderImage = createAsyncThunk(
  "AssetMaster/checkFolderImage",
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

export const handleDeleteFolder = createAsyncThunk(
  "AssetMaster/handleDeleteFolder",
  async ({ config2 }, { rejectWithValue }) => {
    try {
      const response = await axios.request(config2);
      return response.data;
    } catch (error) {
      if (error?.response) {
        return rejectWithValue(error?.response?.data);
      }
    }
  }
);

export const handleWarningDelete = createAsyncThunk(
  "AssetMaster/handleWarning",
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

export const handelDeletedataAssets = createAsyncThunk(
  "AssetMaster/handelDeletedataAssets",
  async (config, { rejectWithValue }) => {
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

export const handelCreateFolder = createAsyncThunk(
  "AssetMaster/handelCreateFolder",
  async (config, { rejectWithValue }) => {
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

export const handelAllDelete = createAsyncThunk(
  "AssetMaster/handelAllDelete",
  async (config, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handelMoveDataToFolder = createAsyncThunk(
  "AssetMaster/handelMoveDataToFolder",
  async (config, { rejectWithValue }) => {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handelPostImageFromDrive = createAsyncThunk(
  "AssetMaster/handelPostImageFromDrive",
  async (
    { serviceId, imageId, imageName, token, fileSizeInBytes, mimeType },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await postUrl(
        `GoogleDrive/SaveOnlineUpload?ImageID=${imageId}&serviceID=${serviceId}&UploadedfileName=${imageName}&fileSizeInBytes=${fileSizeInBytes}&mime_type=${mimeType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.status == true) {
        toast.remove();
        toast.success(data?.message);
      } else {
        toast.remove();
        toast(data?.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  loading: false,
  assets: [],
  error: null,
  data: null, // User data
  status: "idle", // Request status: 'idle', 'loading', 'succeeded', or 'failed'
  message: "", // Message to display (success or error message)
  imageUploadLoading: false,
};

const Assetslice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.message = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handleGetAllAssets.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetAllAssets.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      const allAssets = [
        ...(payload?.image ? payload?.image : []),
        ...(payload?.video ? payload?.video : []),
        ...(payload?.doc ? payload?.doc : []),
        ...(payload?.onlineimages ? payload?.onlineimages : []),
        ...(payload?.onlinevideo ? payload?.onlinevideo : []),
        ...(payload?.folder ? payload?.folder : []),
      ];

      const sortedAssets = allAssets.sort((a, b) => {
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
      state.assets = sortedAssets;
    });
    builder.addCase(handleGetAllAssets.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.assets = [];
    });

    builder.addCase(handleGetAllAssetsTypeBase.pending, (state) => {
      // Assets Get type
      state.status = "loading";
    });
    builder.addCase(handleGetAllAssetsTypeBase.fulfilled, (state, action) => {
      // Assets Get type
      state.data = action.payload?.data;
      state.folders = action.payload?.folderData;
    });
    builder.addCase(handleGetAllAssetsTypeBase.rejected, (state, action) => {
      // Assets Get type
      state.status = "failed";
      state.error = action.payload?.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handleCheckFolderImage.pending, (state) => {
      // handleCheckFolderImage
      state.status = "loading";
    });
    builder.addCase(handleCheckFolderImage.fulfilled, (state, action) => {
      // handleCheckFolderImage
      state.data = action.payload;
    });
    builder.addCase(handleCheckFolderImage.rejected, (state, action) => {
      // handleCheckFolderImage
      state.status = "failed";
    });

    builder.addCase(handleDeleteFolder.pending, (state) => {
      // handleDeleteFolder
      state.status = "loading";
    });
    builder.addCase(handleDeleteFolder.fulfilled, (state, action) => {
      // handleDeleteFolder
      state.status = "succeeded";
      state.message = action.payload?.message;
    });
    builder.addCase(handleDeleteFolder.rejected, (state, action) => {
      // handleDeleteFolder
      state.status = "failed";
      state.error = action.payload?.message;
    });

    builder.addCase(handleWarningDelete.pending, (state) => {
      // handleWarningDelete
      state.status = "loading";
    });
    builder.addCase(handleWarningDelete.fulfilled, (state, action) => {
      // handleWarningDelete
      state.status = "succeeded";
      state.data = action.payload;
      state.message = action.payload?.message;
    });
    builder.addCase(handleWarningDelete.rejected, (state, action) => {
      // handleWarningDelete
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handelDeletedataAssets.pending, (state) => {
      // handelDeletedataAssets
      state.status = "loading";
    });
    builder.addCase(handelDeletedataAssets.fulfilled, (state, action) => {
      // handelDeletedataAssets
      state.status = "succeeded";
      state.data = action.payload;
      state.message = action.payload?.message || "Delete Successfully";
    });
    builder.addCase(handelDeletedataAssets.rejected, (state, action) => {
      // handelDeletedataAssets
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handelCreateFolder.pending, (state) => {
      // handelCreateFolder
      state.status = "loading";
    });
    builder.addCase(handelCreateFolder.fulfilled, (state, action) => {
      // handelCreateFolder
      state.status = "succeeded";
      state.data = action.payload?.data;
      state.message = "Creating Folder SuccessFully...";
    });
    builder.addCase(handelCreateFolder.rejected, (state, action) => {
      // handelCreateFolder
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handelAllDelete.pending, (state) => {
      // handelAllDelete
      state.status = "loading";
    });
    builder.addCase(handelAllDelete.fulfilled, (state, action) => {
      // handelAllDelete
      state.status = "succeeded";
      state.message = action.payload?.message || "Delete Successfully";
    });
    builder.addCase(handelAllDelete.rejected, (state, action) => {
      // handelAllDelete
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    builder.addCase(handelMoveDataToFolder.pending, (state) => {
      // handelMoveDataToFolder
      state.status = "loading";
    });
    builder.addCase(handelMoveDataToFolder.fulfilled, (state, action) => {
      // handelMoveDataToFolder
      state.status = "succeeded";
      state.data = action.payload?.data;
      state.message = "Data move to Folder successFully...";
    });
    builder.addCase(handelMoveDataToFolder.rejected, (state, action) => {
      // handelMoveDataToFolder
      state.status = "failed";
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });

    // upload image from drives
    builder.addCase(handelPostImageFromDrive.pending, (state) => {
      state.imageUploadLoading = true;
    });
    builder.addCase(
      handelPostImageFromDrive.fulfilled,
      (state, { payload }) => {
        state.imageUploadLoading = false;
      }
    );
    builder.addCase(handelPostImageFromDrive.rejected, (state, action) => {
      state.imageUploadLoading = false;
      state.error = action.payload.message;
      state.message = action.payload?.message;
    });
  },
});

export const { resetStatus } = Assetslice.actions;

export default Assetslice.reducer;
