export const initialUser = {
  user: null,
};
export const login = "LOGIN";
export const loginUser = (user) => ({
  type: login,
  payload: user,
});
export const signup = "SIGNUP";
export const signUpUser = (user) => ({
  type: signup,
  payload: user,
});
export const logout = "LOGOUT";
export const logoutUser = () => ({
  type: logout,
});
