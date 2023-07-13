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

const Dashboard = ({ sidebarOpen, setSidebarOpen }) => {
  Dashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const location = useLocation();

  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessageVisible(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

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
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4">
              Overview dashboard
            </h1>
            <div className="lg:flex md:flex sm:block">
              <button className=" dashboard-btn  flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <BsLightningCharge className="text-lg mr-1" />
                Book a Demo
              </button>
              <button className=" dashboard-btn flex align-middle items-center text-primary rounded-full  text-base border border-primary lg:px-6 sm:px-5 sm:mt-3 py-2 sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <MdOutlineSlowMotionVideo className="text-lg mr-1" />
                Watch Video
              </button>
            </div>
          </div>
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

          <div className="mt-5">
            <Tabs value={activeTab}>
              <TabsHeader className="border-b rounded-none border-blue-gray-50 p-0 mb-5 text-[#A7AFB7]  ">
                {data.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={`${
                      activeTab === value
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
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
