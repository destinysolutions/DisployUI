import Business from "../Components/Dashboard/TabingData/Business";
import PropTypes from "prop-types";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { BsLightningCharge } from "react-icons/bs";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import Dashboard from "./Dashboard";

const AdminDashboard = ({ sidebarOpen, setSidebarOpen }) => {
  AdminDashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  return (
    <>
      <div className="flex border-b border-gray">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminNavbar />
      </div>
      <div className="pt-6 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Overview dashboard
            </h1>
            <div className="flex flex-wrap">
              <button className="dashboard-btn  flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 lg:mt-0 md:mt-0 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <BsLightningCharge className="text-lg mr-1" />
                Book a Demo
              </button>
              <button className="dashboard-btn  flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 lg:mt-0 md:mt-0 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <MdOutlineSlowMotionVideo className="text-lg mr-1" />
                Watch Video
              </button>
            </div>
          </div>
          <Dashboard />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
