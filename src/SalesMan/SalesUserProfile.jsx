import React, { useState } from 'react'
import SalesManSidebar from './SalesManSidebar'
import SalesManNavbar from './SalesManNavbar'
import { useSelector } from 'react-redux';
import { AiOutlineUser } from 'react-icons/ai';
import { CiLock } from 'react-icons/ci';
import SalesSecurity from './SalesSecurity';
import SalesAccount from './SalesAccount';
import Footer from '../Components/Footer';

const SalesUserProfile = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, userDetails } = useSelector((state) => state.root.auth);
  const [activeTab, setActiveTab] = useState("account");

  const data = [
    {
      label: "Account",
      value: "account",
      desc: <SalesAccount />,
      icon: <AiOutlineUser />,
    },
    {
      label: "Security",
      value: "security",
      desc: <SalesSecurity />,
      icon: <CiLock />,
    },
  ];
  return (
    <>
      <div className="flex border-b border-gray ">
        <SalesManSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <SalesManNavbar />
      </div>
      <div className={userDetails?.isTrial && user?.userDetails?.isRetailer === false && !userDetails?.isActivePlan ? "lg:pt-32 md:pt-32 pt-10 px-5 page-contain" : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"}>
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Account Settings
            </h1>
          </div>
          <div className="mt-5 page-contain">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              {data?.map(({ icon, label, value }) => (
                <li className="me-4">
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
    </>
  )
}

export default SalesUserProfile
