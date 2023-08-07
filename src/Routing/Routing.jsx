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
import Assets from "../Components/Assests/Assets";
import MyPlaylist from "../Components/PlayList/MyPlaylist";
import Apps from "../Components/Apps/Apps";
import AppDetail from "../Components/Apps/AppDetail";
import AppInstance from "../Components/Apps/AppInstance";
import DisployStudio from "../Components/DisployStudio/DisployStudio";
import Report from "../Components/Reports/Report";
import EditUser from "../Pages/EditUser";
import ViewUserProfile from "../Pages/ViewUserProfile";
import Mediareport from "../Components/Reports/Mediareport";
import Uptimereport from "../Components/Reports/Uptimereport";
import Settings from "../Components/Settings/Settings";
import MySchedule from "../Components/Schedule/MySchedule";
import AddSchedule from "../Components/Schedule/AddSchedule";
import WeatherSchedule from "../Components/Schedule/WeatherSchedule";
import SaveAssignScreenModal from "../Components/Schedule/SaveAssignScreenModal";
import Approval from "../Components/Approval/Approval";
import FileUpload from "../Components/Assests/FileUpload";
import Auditlogreport from "../Components/Reports/Auditlogreport";
import SalesReport from "../Components/Reports/SalesReport";
import CancelReport from "../Components/Reports/CancelReport";
import EventEditor from "../Components/Schedule/EventEditor";
import Unsplash from "../Components/Assests/Unsplash";
import Userrole from "../Components/Settings/Userrole";
const Routing = () => {
  //for screen resize sidebar open close
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        {/* login register route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* forgotpassword and termsconditions route */}
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

        {/* Dashboard component route */}
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
          path="/edituser"
          element={
            <EditUser
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/viewuserprofile"
          element={
            <ViewUserProfile
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />

        {/* screen component route */}
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

        {/* Assests component route */}
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
          path="/assets"
          element={
            <Assets sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          }
        />

        {/* Apps component route */}
        <Route
          path="/apps"
          element={
            <Apps sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          }
        />
        <Route
          path="/appdetail"
          element={
            <AppDetail
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/appinstance"
          element={
            <AppInstance
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />

        {/* Playlist component route */}
        <Route
          path="/myplaylist"
          element={
            <MyPlaylist
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />

        {/* DisployStudio component route */}
        <Route
          path="/disploystudio"
          element={
            <DisployStudio
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />

        {/* Reports component route */}
        <Route
          path="/reports"
          element={
            <Report sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          }
        />
        <Route
          path="/uptimereport"
          element={
            <Uptimereport
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/auditlogreport"
          element={
            <Auditlogreport
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/salesreport"
          element={
            <SalesReport
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/cancelreport"
          element={
            <CancelReport
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/mediareport"
          element={
            <Mediareport
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        {/* Schedule component route */}
        <Route
          path="/myschedule"
          element={
            <MySchedule
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route
          path="/weatherschedule"
          element={
            <WeatherSchedule
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        <Route path="/addschedule" element={<AddSchedule />} />
        <Route
          path="/saveassignscreenmodal"
          element={<SaveAssignScreenModal />}
        />
        {/* Approval component route */}
        <Route
          path="/approval"
          element={
            <Approval
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        {/* Settings component route */}
        <Route
          path="/settings"
          element={
            <Settings
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />

        <Route
          path="/userrole"
          element={
            <Userrole
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />
        {/*Event Editors */}
        <Route
          path="/eventedit"
          element={
            <EventEditor
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        />

        {/*Event Editors */}

        {/* error page route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

export default Routing;
