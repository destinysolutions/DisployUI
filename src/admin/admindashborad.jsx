import Sidebar from "../Components/Sidebar";
import PropTypes from "prop-types";

const AdminDashboard = ({ sidebarOpen, setSidebarOpen }) => {
  AdminDashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  return (
    <div className="flex border-b border-gray ">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
        admin
        <button
          onClick={() => {
            localStorage.setItem("role_access", "");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
