import { useState } from "react";
import Business from "./TabingData/Business";
import { BsLightningCharge } from "react-icons/bs";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Alert,
} from "@material-tailwind/react";
import Users from "./TabingData/Users";
import Screens from "./TabingData/Screens";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import Footer from "../Footer";

const Dashboard = ({ sidebarOpen, setSidebarOpen }) => {
  Dashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  //using for registration success messge
  const location = useLocation();
  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(false);

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

  //using for tab
  const [activeTab, setActiveTab] = useState("business");
  const data = [
    {
      label: "Business",
      value: "business",
      desc: <Business />,
    },
    {
      label: "User",
      value: "user",
      desc: <Users />,
    },

    {
      label: "Screens",
      value: "screenStatus",
      desc: <Screens />,
    },
  ];

  return (
    <>
      {/* sidebar and navbar display start */}
      <div className="flex border-b border-gray ">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
            <button className="ml-10" onClick={() => setMessageVisible(false)}>
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
              Overview dashboard
            </h1>
            <div className="lg:col-span-2 lg:flex items-center justify-end flex-wrap">
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

          {/* <div className="mt-5 page-contain">
            <Tabs value={activeTab}>
              <TabsHeader className="border-b rounded-none border-lightgray p-0 mb-5 text-[#A7AFB7]  ">
                {data.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={`${activeTab === value
                      ? "text-SlateBlue border-b-2 border-SlateBlue  "
                      : ""
                      } p-2 pb-2 w-auto font-semibold `}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody className="p-0">
                {data.map(({ value, desc }) => (
                  <TabPanel key={value} value={value}>
                    {desc}
                  </TabPanel>
                ))}
              </TabsBody>`
            </Tabs>
          </div> */}

          <Business />
        </div>
      </div>
      {/* dashboard component end */}

      <Footer />
    </>
  );
};

export default Dashboard;
