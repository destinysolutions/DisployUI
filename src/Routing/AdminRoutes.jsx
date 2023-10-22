import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../admin/admindashborad";

const AdminContainer = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AdminContainer;
