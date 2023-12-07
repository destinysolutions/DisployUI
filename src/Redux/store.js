import { createStore } from "redux";
import { combineReducers } from "redux";
import UserReducer from "./userreducer";


const rootReducer = combineReducers({
  user: UserReducer,
});

export default createStore(rootReducer);
