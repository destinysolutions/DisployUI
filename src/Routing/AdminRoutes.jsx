import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../admin/admindashborad";
import Assets from "../Components/Assests/Assets";
import Dashboard from "../Components/Dashboard/Dashboard";
import Trash from "../Components/Trash";
import NewFolderDialog from "../Components/Assests/NewFolderDialog ";
import EventEditor from "../Components/Schedule/EventEditor";
import Userrole from "../Components/Settings/Userrole";
import Settings from "../Components/Settings/Settings";
import Approval from "../Components/Approval/Approval";
import SaveAssignScreenModal from "../Components/Schedule/SaveAssignScreenModal";
import AddSchedule from "../Components/Schedule/AddSchedule";
import WeatherSchedule from "../Components/Schedule/WeatherSchedule";
import MySchedule from "../Components/Schedule/MySchedule";
import Mediareport from "../Components/Reports/Mediareport";
import CancelReport from "../Components/Reports/CancelReport";
import SalesReport from "../Components/Reports/SalesReport";
import Auditlogreport from "../Components/Reports/Auditlogreport";
import Uptimereport from "../Components/Reports/Uptimereport";
import Report from "../Components/Reports/Report";
import DisployStudio from "../Components/DisployStudio/DisployStudio";
import SelectLayout from "../Components/PlayList/SelectedLayout";
import AddComposition from "../Components/PlayList/AddComposition";
import Composition from "../Components/PlayList/Composition";
import TextScroll from "../Components/Apps/TextScroll";
import Weather from "../Components/Apps/Weather";
import TextScrollDetail from "../Components/Apps/TextScrollDetail";
import YoutubeDetail from "../Components/Apps/YoutubeDetail";
import Youtube from "../Components/Apps/Youtube";
import Apps from "../Components/Apps/Apps";
import FileUpload from "../Components/Assests/FileUpload";
import NewScreenDetail from "../Components/Screen/SubScreens/NewScreenDetail";
import Screensplayer from "../Components/Screen/SubScreens/Screensplayer";
import NewScreenGroup from "../Components/Screen/SubScreens/NewScreenGroup";
import MergeScreen from "../Components/Screen/SubScreens/MergeScreen";
import UserProfile from "../Pages/Profile/UserProfile";
import EditUser from "../Pages/EditUser";
import Screens from "../Components/Screen/Screens";

const AdminContainer = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route
            path="/"
            element={
              <AdminDashboard
                // sidebarOpen={sidebarOpen}
                // setSidebarOpen={setSidebarOpen}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AdminContainer;
