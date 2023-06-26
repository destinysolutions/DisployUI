import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Business from "./TabingData/Business";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import Users from "./TabingData/Users";
import Screens from "./TabingData/Screens";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = React.useState("business");
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

  const [sidebarOverlap, setsidebarOverlap] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 780) {
        setsidebarOverlap(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarOverlap={sidebarOverlap}
        />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div
          className={`${
            sidebarOpen ? (sidebarOverlap ? "ml-60" : "") : "ml-2"
          }`}
        >
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737]">
              Overview dashboard
            </h1>
            <div className="lg:flex md:flex sm:block">
              <button className=" dashboard-btn  flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 sm-mt-2 py-2 sm:mt-2  text-base mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <img
                  src="/DisployImg/channel.svg"
                  className="mr-2 hover:fill-white"
                />
                Book a Demo
              </button>
              <button className=" dashboard-btn flex align-middle items-center text-primary rounded-full  text-base border border-primary lg:px-6 sm:px-5 sm:mt-2 py-2 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <img
                  src="/DisployImg/Group.svg"
                  className="mr-2 p-1 hover:fill-white"
                />
                Watch Video
              </button>
            </div>
          </div>
          <div className="mt-5">
            <Tabs value={activeTab}>
              <TabsHeader className="border-b rounded-none border-blue-gray-50 p-0 mb-5 text-[#A7AFB7] ">
                {data.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={`${
                      activeTab === value
                        ? "text-SlateBlue border-b-2  border-SlateBlue "
                        : ""
                    } p-2 pb-2 w-auto font-semibold`}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
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
