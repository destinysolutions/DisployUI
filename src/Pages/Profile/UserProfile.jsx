import React, { useState } from "react";
import PropTypes from "prop-types";
import Account from "./Account";
import Security from "./Security";
import AdNotifications from "./AdNotifications"
import BillingsPlans from "./Billings_&_Plans";
import Notifications from "./Notifications";
import Connection from "./Connection";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { AiOutlineLink, AiOutlineUser } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { BsSdCard } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PurchasePlanWarning from "../../Components/Common/PurchasePlanWarning";
import { useSelector } from "react-redux";
import { FaRegMoneyBill1 } from "react-icons/fa6";
import { RiAdvertisementLine } from "react-icons/ri";

const UserProfile = ({ sidebarOpen, setSidebarOpen }) => {
  UserProfile.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const notification = useLocation().state;
  const { user } = useSelector((state) => state.root.auth);
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
      icon: <RiAdvertisementLine  />,
    },
    {
      label: "Notifications",
      value: "notifications",
      desc: <Notifications sidebarOpen={sidebarOpen} />,
      icon: <IoIosNotificationsOutline />,
    },

    {
      label: "Billing",
      value: "billing",
      desc: <BillingsPlans sidebarOpen={sidebarOpen} />,
      icon: <FaRegMoneyBill1 />,
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
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              {data.map(({ icon, label, value }) => (
                <li class="me-4">
                  <a
                    className={`inline-block px-4 py-3 ${activeTab === value ? "text-white bg-primary active" : "border border-primary text-black"} cursor-pointer rounded-full `}
                    aria-current="page"
                    onClick={() => setActiveTab(value)}
                  >
                    <div className="flex items-center sm:text-sm">
                      <span className="lg:mr-2 mr-1 lg:text-xl text-lg">
                        {icon}
                      </span>
                      {label}
                    </div>
                  </a>
                </li>

              ))}
            </ul>

            {data.map(({ value, desc }) => (
              <div key={value} value={value} className={`${activeTab === value ? "" : "hidden"}`}>
                {desc}
              </div>
            ))}

          </div>
        </div>
      </div>
      <Footer />

      {!user?.isisTrial && !user?.isActivePlan && (
        <PurchasePlanWarning />
      )}
    </>
  );
};

export default UserProfile;
