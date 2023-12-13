import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE } from "redux-persist";
import AuthSlice from "../Redux/Authslice";
import Assetslice from "./Assetslice";
import ScheduleSlice from "./ScheduleSlice";
import globalStates from "./globalStates";
import Screenslice from "./Screenslice";
import CompositionSlice from "./CompositionSlice";
import AppsSlice from "./AppsSlice";
import SettingUserSlice from "./SettingUserSlice";

// const rootPersistConfig = {
//   key: "root",
//   storage,
//   whitelist: [""],
// };

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthSlice),
  asset: Assetslice,
  schedule: ScheduleSlice,
  globalstates: globalStates,
  screen: Screenslice,
  composition: CompositionSlice,
  apps: AppsSlice,
  settingUser : SettingUserSlice
});

const persisteRoot = rootReducer;

export const store = configureStore({
  reducer: { root: persisteRoot },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);