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
    },
    {
      label: "Security",
      value: "security",
      desc: <Security />,
    },

    {
      label: "Billing & Plans",
      value: "billing_plans",
      desc: <BillingsPlans />,
    },
    {
      label: "Notifications",
      value: "notifications",
      desc: <Notifications />,
    },
    {
      label: "Connections",
      value: "connections",
      desc: <Connection />,
    },
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
              <TabsHeader className="border-b rounded-none border-lightgray p-0 mb-5 text-[#A7AFB7]  ">
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
      <Footer />
    </>
  );
};

export default UserProfile;
