import { Suspense, useState } from "react";
import Business from "./TabingData/Business";
import { BsLightningCharge } from "react-icons/bs";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { Alert } from "@material-tailwind/react";
import Users from "./TabingData/Users";
import Screens from "./TabingData/Screens";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import Footer from "../Footer";
import Loading from "../Loading";
import { USERDASHBOARD } from "../../Pages/Api";
import axios from "axios";
import { useSelector } from "react-redux";

const UserDashboard = ({ sidebarOpen, setSidebarOpen }) => {
  UserDashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  //using for registration success messge
  const location = useLocation();
  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(false);
  const [sidebarload, setSidebarLoad] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
    const hasSeenMessage = localStorage.getItem("hasSeenMessage");

    if (!hasSeenMessage && message != null) {
      setMessageVisible(true);
      localStorage.setItem("hasSeenMessage", "true");
    }
  }, [message]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessageVisible(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${USERDASHBOARD}`,
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then((data) => {
        setDashboardData(data?.data?.data);
        setSidebarLoad(false);
      })
      .catch((error) => {
        console.log("Error fetching states data:", error);
      });
  }, []);

  return (
    <>
      {sidebarload && <Loading />}

      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
            {/* sidebar and navbar display start */}
            <div className="flex border-b border-gray ">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Navbar />
            </div>
            {/* sidebar and navbar display end */}

            {/* registration success meg show start */}
            {message != null && messageVisible && (
              <Alert
                className="bg-[#5dbb63] w-auto"
                style={{ position: "fixed", top: "20px", right: "20px" }}
              >
                <div className="flex">
                  {message}{" "}
                  <button
                    className="ml-10"
                    onClick={() => setMessageVisible(false)}
                  >
                    <AiOutlineClose className="text-xl" />
                  </button>
                </div>
              </Alert>
            )}
            {/* registration success meg show end */}

            {/* dashboard component start */}
            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                <div className="grid lg:grid-cols-3 gap-2">
                  <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
                    Dashboard Overview
                  </h1>
                  {/* <div className="lg:col-span-2 lg:flex items-center md:mt-0 lg:mt-0 md:justify-end sm:mt-3 flex-wrap">
              <button className="dashboard-btn  flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 lg:mt-0 md:mt-0 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <BsLightningCharge className="text-lg mr-1" />
                Book a Demo
              </button>
              <button className="dashboard-btn  flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 lg:mt-0 md:mt-0 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <MdOutlineSlowMotionVideo className="text-lg mr-1" />
                Watch Video
              </button>
            </div> */}
                </div>
                <Business
                  setSidebarLoad={setSidebarLoad}
                  setDashboardData={setDashboardData}
                  dashboardData={dashboardData}
                />
              </div>
            </div>
            {/* dashboard component end */}

            <Footer />
          </>
        </Suspense>
      )}
    </>
  );
};

export default UserDashboard;
