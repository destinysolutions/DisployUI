import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../admin/admindashborad";
import OnBoding from "../admin/OnBoding";

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
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route
            path="/onboding"
            element={
              <OnBoding
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AdminContainer;
