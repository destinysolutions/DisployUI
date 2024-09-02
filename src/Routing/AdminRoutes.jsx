import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admindashborad from "../admin/Admindashboard";
import OnBoding from "../admin/OnBoding";
import ManageUserType from "../admin/ManageUserType";
import User from "../admin/User";
import Pending from "../admin/Pending";
import Retailer from "../admin/Retailer/Retailer";
import Advertisement from "../admin/Advertisement/Advertisement";
import UserList from "../admin/UserList/UserList";
import AdminSetting from "../admin/AdminSetting";
import CustomerOnboding from "../admin/CustomerOnboding";
import SalesMan from "../admin/SalesMan/SalesMan";
import RetailerDetails from "../admin/Retailer/RetailerDetails";

const AdminContainer = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <Admindashborad
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/manage-user-type"
            element={
              <ManageUserType
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/onboarded"
            element={
              <OnBoding
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/retailer"
            element={
              <Retailer
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="retailer/detail-page/:id/:email"
            element={
              <RetailerDetails
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/advertisement"
            element={
              <Advertisement
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/pending"
            element={
              <Pending
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/client"
            element={
              <UserList
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <AdminSetting
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />

          <Route
            path="/users"
            element={
              <User sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            }
          />

          <Route
            path="onboarded/customer-details/:id/:email"
            element={
              <CustomerOnboding sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            }
          />

          <Route
            path="SalesMan"
            element={
              <SalesMan sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            }
          />
          SalesMan
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AdminContainer;
