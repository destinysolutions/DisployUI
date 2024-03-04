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

const AdminContainer = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin-dashboard" />} />
          <Route
            path="/admin-dashboard"
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
            path="/onborded"
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
            path="/user"
            element={
              <User sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AdminContainer;
