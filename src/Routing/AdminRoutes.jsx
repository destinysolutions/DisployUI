import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admindashborad from "../admin/Admindashboard";
import OnBoding from "../admin/OnBoding";
import ManageUserType from "../admin/ManageUserType";
import User from "../admin/User";
import Pending from "../admin/Pending";

const AdminContainer = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin-dashboard" element={<Navigate to="/" />} />
          <Route
            path="/"
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
            path="/pending"
            element={
              <Pending
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
