import React, { useState } from "react";
import PropTypes from "prop-types";
import Account from "./Account";
import Security from "./Security";
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

const UserProfile = ({ sidebarOpen, setSidebarOpen }) => {
  UserProfile.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [activeTab, setActiveTab] = useState("account");
  const data = [
    {
      label: "Account",
      value: "account",
      desc: <Account />,
      icon: <AiOutlineUser />,
    },
    // {
    //   label: "Security",
    //   value: "security",
    //   desc: <Security />,
    //   icon: <CiLock />,
    // },

    // {
    //   label: "Billing & Plans",
    //   value: "billing_plans",
    //   desc: <BillingsPlans />,
    //   icon: <BsSdCard />,
    // },
    // {
    //   label: "Notifications",
    //   value: "notifications",
    //   desc: <Notifications />,
    //   icon: <IoIosNotificationsOutline />,
    // },
    // {
    //   label: "Connections",
    //   value: "connections",
    //   desc: <Connection />,
    //   icon: <AiOutlineLink />,
    // },
  ];
  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Account Settings
            </h1>
          </div>
          <div className="mt-5 page-contain">
            <Tabs value={activeTab}>
              <TabsHeader className="p-0 text-[#A7AFB7]">
                {data.map(({ icon, label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className={`${
                      activeTab === value
                        ? "text-white items-center rounded-full bg-primary "
                        : ""
                    } py-3 px-5 w-auto`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{icon}</span>
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
