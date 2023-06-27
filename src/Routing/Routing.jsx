import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import ForgotPassword from "../Pages/ForgotPassword";
import TermsConditions from "../Pages/TermsConditions";
import Dashboard from "../Components/Dashboard/Dashboard";
import Screens from "../Components/Screen/Screens";
import ErrorPage from "../Pages/ErrorPage";
import NewScreen from "../Components/Screen/SubScreens/NewScreen";
import ConnectScreen from "../Components/Screen/SubScreens/ConnectScreen";
import NewScreenGroup from "../Components/Screen/SubScreens/NewScreenGroup";
import Screensplayer from "../Components/Screen/SubScreens/Screensplayer";
const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/termsconditions" element={<TermsConditions />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/screens" element={<Screens />} />
      <Route path="/newscreen" element={<NewScreen />} />
      <Route path="/connectscreen" element={<ConnectScreen />} />
      <Route path="/newscreengroup" element={<NewScreenGroup />} />
      <Route path="/screensplayer" element={<Screensplayer />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Routing;
