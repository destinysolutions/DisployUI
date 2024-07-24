import React from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from '../Components/Dashboard/UserDashboard';
import Screens from '../Components/Screen/Screens';
import EditUser from '../Pages/EditUser';
import UserProfile from '../Pages/Profile/UserProfile';
import MergeScreen from '../Components/Screen/SubScreens/MergeScreen';
import AddMergeScreen from '../Components/Screen/SubScreens/AddMergeScreen';
import NewScreenGroup from '../Components/Screen/SubScreens/NewScreenGroup';
import AddSlot from '../Components/Screen/SubScreens/BookSlot/AddSlot';
import BookingSlot from '../Components/Screen/SubScreens/BookSlot/BookingSlot';
import Screensplayer from '../Components/Screen/SubScreens/Screensplayer';
import NewScreenDetail from '../Components/Screen/SubScreens/NewScreenDetail';
import FileUpload from '../Components/Assests/FileUpload';
import Assets from '../Components/Assests/Assets';
import Apps from '../Components/Apps/Apps';
import Youtube from '../Components/Apps/Youtube';
import YoutubeDetailByID from '../Components/Apps/YoutubeDetailByID';
import YoutubeDetail from '../Components/Apps/YoutubeDetail';
import TextScrollDetailById from '../Components/Apps/TextScrollDetailById';
import TextScrollDetail from '../Components/Apps/TextScrollDetail';
import Weather from '../Components/Apps/Weather';
import WeatherDetail from '../Components/Apps/WeatherDetail';
import TextScroll from '../Components/Apps/TextScroll';
import DigitalMenuBoard from '../Components/Apps/DigitalMenuBoard';
import DigitalMenuBoardDetail from '../Components/Apps/DigitalMenuBoardDetail';
import Composition from '../Components/Composition/Composition';
import AddComposition from '../Components/Composition/AddComposition';
import EditSelectedLayout from '../Components/Composition/EditSelectedLayout';
import DisployStudio from '../Components/DisployStudio/DisployStudio';
import FinalReport from '../Components/Reports/FinalReport';
import Uptimereport from '../Components/Reports/Uptimereport';
import Auditlogreport from '../Components/Reports/Auditlogreport';
import SalesReport from '../Components/Reports/SalesReport';
import CancelReport from '../Components/Reports/CancelReport';
import Mediareport from '../Components/Reports/Mediareport';
import MySchedule from '../Components/Schedule/MySchedule';
import WeatherSchedule from '../Components/Schedule/WeatherSchedule';
import AddSchedule from '../Components/Schedule/AddSchedule';
import AddWeatherSchedule from '../Components/Schedule/AddWeatherSchedule';
import SaveAssignScreenModal from '../Components/Schedule/SaveAssignScreenModal';
import Approval from '../Components/Approval/Approval';
import Settings from '../Components/Settings/Settings';
import Userrole from '../Components/Settings/Userrole';
import EventEditor from '../Components/Schedule/EventEditor';
import NewFolderDialog from '../Components/Assests/NewFolderDialog ';
import Trash from '../Redux/Trash';
import ErrorFallback from '../Components/ErrorFallback';
import GridAssets from "../Components/Assests/GridAssets";
import SelectedLayout from "../Components/Composition/SelectedLayout";
import Report from "../Components/Reports/Report";

const RetailerRoutes = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <BrowserRouter>
        <ErrorBoundary
          fallback={ErrorFallback}
          onReset={() => {
            window.location.reload();
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            <Route path="/register" element={<Navigate to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                <UserDashboard
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
              path="/userprofile"
              element={
                <UserProfile
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
              path="/add-mergescreen"
              element={
                <AddMergeScreen
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
            {/*<Route
              path="/bookslot"
              element={
                <AddSlot />
              }
            />
            <Route
              path="/bookingslot"
              element={
                <BookingSlot
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />*/}
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
                <Assets
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />

            <Route
              path="/assets-grid"
              element={
                <GridAssets
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />

            {/* Apps component route */}
            <Route
              path="/apps"
              element={
                <Apps
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/youtube"
              element={
                <Youtube
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/youtubedetail/:id"
              element={
                <YoutubeDetailByID
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/youtubedetail"
              element={
                <YoutubeDetail
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/textscrolldetail/:id"
              element={
                <TextScrollDetailById
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/textscrolldetail"
              element={
                <TextScrollDetail
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />

            <Route
              path="/Weather"
              element={
                <Weather
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/weatherdetail"
              element={
                <WeatherDetail
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/weatherdetail/:id"
              element={
                <WeatherDetail
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/text-scroll"
              element={
                <TextScroll
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            {/* Digital Menu Board route */}
            <Route
              path="/Digital-Menu-Board"
              element={
                <DigitalMenuBoard
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />

            <Route
              path="/digital-menu-detail"
              element={
                <DigitalMenuBoardDetail
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/digital-menu-detail/:id"
              element={
                <DigitalMenuBoardDetail
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            {/* Playlist component route */}
            <Route
              path="/composition"
              element={
                <Composition
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/addcomposition"
              element={
                <AddComposition
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/addcomposition/:id"
              element={
                <SelectedLayout
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/editcomposition/:id/:layoutId"
              element={
                <EditSelectedLayout
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />

            {/* <Route
              path="/selectedlayout"
              element={
                <SelectLayout
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            /> */}
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
                <Report
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/reports/:report/:daily/:date"
              element={
                <FinalReport
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
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
            <Route
              path="/addschedule"
              element={
                <AddSchedule
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/addweatherschedule"
              element={
                <AddWeatherSchedule
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
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
            <Route
              path="/NewFolderDialog/:folderId"
              component={NewFolderDialog}
              element={
                <NewFolderDialog
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
            <Route
              path="/trash"
              element={
                <Trash
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              }
            />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
  )
}

export default RetailerRoutes
