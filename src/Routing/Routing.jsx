import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import ForgotPassword from "../Pages/ForgotPassword";
import TermsConditions from "../Pages/TermsConditions";
import Dashboard from "../Components/Dashboard/Dashboard";
import Screens from "../Components/Screen/Screens";
import ErrorPage from "../Pages/ErrorPage";
import NewScreenGroup from "../Components/Screen/SubScreens/NewScreenGroup";
import Screensplayer from "../Components/Screen/SubScreens/Screensplayer";
import { useState, useEffect } from "react";
import MergeScreen from "../Components/Screen/SubScreens/MergeScreen";
import NewScreenDetail from "../Components/Screen/SubScreens/NewScreenDetail";

const Routing = () => {
  const [sidebarOpen, setSidebarOpen] = useState();
  const handleResize = () => {
    if (window.innerWidth < 780) {
      setSidebarOpen(false);
    } else if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("load", handleResize);
    return () => {
      window.removeEventListener("load", handleResize);
    };
  }, []);
  return (
    <>
      <Routes>
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
        <Route
          path="/dashboard"
          element={
            <Dashboard
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/screens"
          element={
            <Screens
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/mergescreen"
          element={
            <MergeScreen
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/newscreengroup"
          element={
            <NewScreenGroup
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/screensplayer"
          element={
            <Screensplayer
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/newscreendetail"
          element={
            <NewScreenDetail
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default Routing;
