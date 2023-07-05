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
import { useState, useEffect, useCallback } from "react";
import MergeScreen from "../Components/Screen/SubScreens/MergeScreen";
import NewScreenDetail from "../Components/Screen/SubScreens/NewScreenDetail";
import FileUpload from "../Components/Assests/fileUpload";
import Assets from "../Components/Assests/Assets";
import MyPlaylist from "../Components/PlayList/MyPlaylist";

const Routing = () => {
  const [sidebarOpen, setSidebarOpen] = useState();
  const handleResize = useCallback(() => {
    if (window.innerWidth < 780) {
      setSidebarOpen(false);
    } else if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  }, [sidebarOpen]);
  
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, sidebarOpen]);
  
  useEffect(() => {
    handleResize();
    window.addEventListener("load", handleResize);
  
    return () => {
      window.removeEventListener("load", handleResize);
    };
  }, [handleResize]);

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
          path="/fileupload"
          element={
            <FileUpload
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
        <Route
          path="/assets"
          element={
            <Assets sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          }
        />
        <Route
          path="/myplaylist"
          element={
            <MyPlaylist
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
