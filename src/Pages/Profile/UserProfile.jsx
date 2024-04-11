import React, { useState } from "react";
import PropTypes from "prop-types";
import Account from "./Account";
import Security from "./Security";
import AdNotifications from "./AdNotifications"
import BillingsPlans from "./Billings_&_Plans";
import Notifications from "./Notifications";
import Connection from "./Connection";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { AiOutlineLink, AiOutlineUser } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { BsSdCard } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const UserProfile = ({ sidebarOpen, setSidebarOpen }) => {
  UserProfile.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const notification = useLocation().state;
  const [activeTab, setActiveTab] = useState(notification !== null ? notification?.notificationData : "account");
  const data = [
    {
      label: "Account",
      value: "account",
      desc: <Account />,
      icon: <AiOutlineUser />,
    },
    {
      label: "Security",
      value: "security",
      desc: <Security />,
      icon: <CiLock />,
    },

    // {
    //   label: "Billing & Plans",
    //   value: "billing_plans",
    //   desc: <BillingsPlans />,
    //   icon: <BsSdCard />,
    // },
    {
      label: "Advertisement",
      value: "ad-notifications",
      desc: <AdNotifications sidebarOpen={sidebarOpen} />,
      icon: <IoIosNotificationsOutline />,
    },
    {
      label: "Notifications",
      value: "notifications",
      desc: <Notifications sidebarOpen={sidebarOpen} />,
      icon: <IoIosNotificationsOutline />,
    },
    // {
    //   label: "Connections",
    //   value: "connections",
    //   desc: <Connection />,
    //   icon: <AiOutlineLink />,
    // },
  ];

  return (
    <>
      <div className="flex bg-white border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Account Settings
            </h1>
          </div>
          <div className="mt-5 page-contain">
            <Tabs value={activeTab}>
              <TabsHeader className="p-0 text-primary">
                {data.map(({ icon, label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={`${activeTab === value
                      ? "text-white items-center rounded-full bg-primary"
                      : ""
                      } account-settings-tab-li lg:py-3 lg:px-4 py-2 px-2 w-auto border sm:text-sm border-primary rounded-full lg:mx-2 mx-1 z-0`}
                  >
                    <div className="flex items-center sm:text-sm">
                      <span className="lg:mr-2 mr-1 lg:text-xl text-lg">
                        {icon}
                      </span>
                      {label}
                    </div>
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
      <Footer />
    </>
  );
};

export default UserProfile;
