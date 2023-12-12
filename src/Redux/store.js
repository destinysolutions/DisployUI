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

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: AuthSlice,
  asset: Assetslice,
  schedule: ScheduleSlice,
  globalstates: globalStates,
  screen: Screenslice,
  composition: CompositionSlice,
  apps: AppsSlice,
});

const persisteRoot = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: { root: persisteRoot },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
