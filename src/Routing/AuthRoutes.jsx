import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import ForgotPassword from "../Pages/ForgotPassword";
import TermsConditions from "../Pages/TermsConditions";

const LoginContainer = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/dashboard" element={<Navigate to="/" />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route
              path="/forgotpassword"
              element={
                <ForgotPassword
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/termsconditions"
              element={
                <TermsConditions
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default LoginContainer;
