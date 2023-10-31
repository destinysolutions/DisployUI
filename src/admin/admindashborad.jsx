import Users from "../Components/Dashboard/TabingData/Users";
import Sidebar from "../Components/Sidebar";
import PropTypes from "prop-types";
import AdminNavbar from "./adminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = ({ sidebarOpen, setSidebarOpen }) => {
  AdminDashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  return (
    // <div className="flex border-b border-gray ">
    //   <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    //   <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
    //     admin
    //     <button
    //       onClick={() => {
    //         localStorage.setItem("role_access", "");
    //         window.location.reload();
    //       }}
    //     >
    //       Logout
    //     </button>
    //     <div>
    //       <Users />
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="flex border-b border-gray">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminNavbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <Users />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
