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
import SettingSlice from "./SettingSlice";
import ScreenGroupSlice from "./ScreenGroupSlice";
import TrashSlice from "./Trash";
import SidebarSlice from "./SidebarSlice";
import ScreenMergeSlice from "./ScreenMergeSlice";
import UserRoleSlice from "./UserRoleSlice";
import RetailersSlice from "./admin/RetailerSlice";
import OnBodingSlice from "./admin/OnBodingSlice";
import WeatherSlice from "./WeatherSlice";
import ManageUserSlice from "./admin/ManageUserSlice";
import AdvertisementSlice from "./admin/AdvertisementSlice";
import CommonSlice from "./CommonSlice";
import NotificationSlice from "./NotificationSlice";
import PaymentSlice from "./PaymentSlice";
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

const globalStatesPersistConfig = {
  key: "globalstate",
  storage,
  whitelist: ["session_token_apideck"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthSlice),
  asset: Assetslice,
  schedule: ScheduleSlice,
  globalstates: persistReducer(globalStatesPersistConfig, globalStates),
  screen: Screenslice,
  composition: CompositionSlice,
  apps: AppsSlice,
  settingUser: SettingUserSlice,
  setting: SettingSlice,
  screenGroup: ScreenGroupSlice,
  screenMarge: ScreenMergeSlice,
  trashData: TrashSlice,
  sidebarData: SidebarSlice,
  userRole: UserRoleSlice,
  retailerData: RetailersSlice,
  onBoding: OnBodingSlice,
  weather: WeatherSlice,
  ManageUser: ManageUserSlice,
  advertisementData: AdvertisementSlice,
  common: CommonSlice,
  notification: NotificationSlice,
  payment:PaymentSlice
});

const persisteRoot = rootReducer;

export const store = configureStore({
  reducer: { root: persisteRoot },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
