import { login, signup, logout, initialUser } from "./useraction";

const UserReducer = (state = initialUser, action) => {
  if (action.type == login) {
    return {
      ...state,
      user: action.payload,
    };
  } else if (action.type == signup) {
    return {
      ...state,
      user: action.payload,
    };
  } else if (action.type == logout) {
    return {
      ...state,
      user: null,
    };
  } else {
    return state;
  }
};
export default UserReducer;
