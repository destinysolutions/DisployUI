import { Suspense, useState } from "react";
import { Alert } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useSelector } from "react-redux";
import { USERDASHBOARD } from "../../Pages/Api";
import Sidebar from "../Sidebar";
import Loading from "../Loading";
import Navbar from "../Navbar";
import Footer from "../Footer";
import PurchasePlanWarning from "./PurchasePlan/PurchasePlanWarning";
import Business from "../Dashboard/TabingData/Business";


const DummyDashboard = ({ sidebarOpen, setSidebarOpen }) => {
    DummyDashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const {user, userDetails, token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const location = useLocation();
  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(false);
  const [sidebarload, setSidebarLoad] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [warning, setWarning] = useState(false)
  useEffect(() => {
    const hasSeenMessage = localStorage.getItem("hasSeenMessage");

    if (!hasSeenMessage && message != null) {
      setMessageVisible(true);
      localStorage.setItem("hasSeenMessage", "true");
    }
  }, [message]);

  useEffect(() => {
    if ((userDetails?.isTrial=== false) && (userDetails?.isActivePlan=== false)) {
      setWarning(true)
    } else {
      setWarning(false)
    }
  }, [userDetails])

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
           
            <div className="flex border-b border-gray ">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Navbar />
            </div>    
            <div className={userDetails?.isTrial && user?.userDetails?.isRetailer === false && !userDetails?.isActivePlan ?"lg:pt-32 md:pt-32 pt-10 px-5 page-contain" : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"}>
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                <div className="grid lg:grid-cols-3 gap-2">
                  <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
                    Dashboard Overview
                  </h1>
                 
                </div>
                <Business
                  setSidebarLoad={setSidebarLoad}
                  setDashboardData={setDashboardData}
                  dashboardData={dashboardData}
                />
              </div>
            </div>
           

            <Footer />
          </>
        </Suspense>
      )}

      {warning && (
        <PurchasePlanWarning />
      )}
    </>
  );
};

export default DummyDashboard;
