import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../admin/admindashborad";
import Assets from "../Components/Assests/Assets";

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
          <Route
            path="/assets"
            element={
              <Assets
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
