import React, { useState } from "react";
import "../Styles/sidebar.css";
import { Link } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Sidebar = ({ sidebarOpen }) => {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const Menus = [
    {
      title: "Dashboard",
      cName: "nav-text link-items",
      path: "/dashboard",
      icon: (
        <img
          src="/MenuIcons/dashboard_icon.svg"
          alt="Dashboard"
          className="fill-white"
        />
      ),
    },
    {
      title: "Screens",
      cName: "nav-text link-items",
      path: "/screens",
      icon: (
        <img
          src="/MenuIcons/screens_icon.svg"
          alt="Screens"
          className="max-w-sm"
        />
      ),
      subMenus: [
        {
          title: (
            <button onClick={() => setShowOTPModal(true)}> New Screen</button>
          ),
          icon: <img src="/MenuIcons/new_screen.svg" alt=" New Screen" />,
        },
        {
          title: "New Screen Group",
          path: "/newscreengroup",
          icon: (
            <img src="/MenuIcons/new_screen_group.svg" alt="New Screen Group" />
          ),
        },
        {
          title: "Merge Screens",
          path: "/mergescreen",
          icon: <img src="/MenuIcons/merge_screen.svg" alt="Merge Screen" />,
        },
      ],
    },
    {
      title: "Assets",
      cName: "nav-text link-items",
      path: "/assets",
      icon: <img src="/MenuIcons/assets_icon.svg" alt="Assets" />,
    },
    {
      title: "Playlist ",
      cName: "nav-text link-items",
      path: "/playlist",
      icon: <img src="/MenuIcons/playlist_icon.svg" alt="Playlist" />,
    },
    {
      title: "Disploy Studio",
      cName: "nav-text link-items",
      path: "/studio",
      icon: (
        <img src="/MenuIcons/disploy_studio_icon.svg" alt="Disploy_Studio" />
      ),
    },
    {
      title: "My Schedule",
      cName: "nav-text link-items",
      path: "/myplan",
      icon: <img src="/MenuIcons/schedule_icon.svg" alt="My_Plan" />,
    },
    {
      title: "Apps",
      cName: "nav-text link-items",
      path: "/apps",
      icon: <img src="/MenuIcons/apps_icon.svg" alt="Apps" />,
    },
    {
      title: "Reports",
      cName: "nav-text link-items",
      path: "/reports",
      icon: <img src="/MenuIcons/reports_icon.svg" alt="Reports" />,
    },
    
  ];
  const MenuIcons = [
    {
      title: "Support",
      cName: "nav-text link-items",
      path: "/support",
      icon: <img src="/MenuIcons/support_icon.svg" alt="Support" />,
    },
    {
      title: "Settings",
      cName: "nav-text link-items",
      path: "/settings",
      icon: <img src="/MenuIcons/setting_icon.svg" alt="Settings" />,
    },
    {
      title: "Take Tour",
      cName: "nav-text link-items",
      path: "/taketour",
      icon: <img src="/MenuIcons/take_tour_icon.svg" alt="Take_Tour" />,
    },
    {
      title: "Bin to Trash",
      cName: "nav-text link-items",
      path: "/bintotrash",
      icon: <img src="/MenuIcons/Trash_icon.svg" alt="Bin_to_Trash" />,
    },
    {
      title: "Log Out",
      cName: "nav-text link-items",
      path: "/logout",
      icon: <img src="/MenuIcons/logout_icon.svg" alt="LogOut" />,
    },
  ];

  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [MITooltipVisible, setMITooltipVisible] = useState(false);

  const [SMTooltipVisible, setSMTooltipVisible] = useState(false);

  const handleTooltipToggle = (index) => {
    setActiveIcon(index);
    setTooltipVisible(true);
  };
  const handleMITooltipToggle = (MIindex) => {
    setActiveIcon(MIindex);
    setMITooltipVisible(true);
  };
  const handleSMTooltipToggle = (subIndex) => {
    setActiveIcon(subIndex);
    setSMTooltipVisible(true);
  };
  return (
    <>
      {showOTPModal ? (
        <>
          <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-[#A7AFB7] border-slate-200 rounded-t">
                  <h3 className="text-xl font-medium">New Screen</h3>
                  <button
                    className="p-1 text-xl"
                    onClick={() => setShowOTPModal(false)}
                  >
                    <AiOutlineCloseCircle />
                  </button>
                </div>

                <div className="relative p-6 flex-auto">
                  <div className="flex items-center justify-center">
                    <img src="/DisployImg/BlackLogo.svg" />
                  </div>
                  <div className="bg-white rounded-[20px] shadow-md p-5">
                    <div className="container mx-auto">
                      <div className="max-w-sm mx-auto md:max-w-lg">
                        <div className="w-full">
                          <div className="bg-white h-64 py-3 rounded text-center">
                            <div className="flex flex-col mt-4">
                              <div className="font-normal text-lg text-[#000000]">
                                Enter the 6-character pairing code?
                              </div>
                            </div>

                            <div
                              id="otp"
                              className="flex flex-row justify-center text-center px-2 mt-5"
                            >
                              <input
                                className="m-2 border h-10 w-10 text-center form-control rounded"
                                type="text"
                                id="first"
                                maxLength="1"
                              />
                              <input
                                className="m-2 border h-10 w-10 text-center form-control rounded"
                                type="text"
                                id="second"
                                maxLength="1"
                              />
                              <input
                                className="m-2 border h-10 w-10 text-center form-control rounded"
                                type="text"
                                id="third"
                                maxLength="1"
                              />
                              <input
                                className="m-2 border h-10 w-10 text-center form-control rounded"
                                type="text"
                                id="fourth"
                                maxLength="1"
                              />
                              <input
                                className="m-2 border h-10 w-10 text-center form-control rounded"
                                type="text"
                                id="fifth"
                                maxLength="1"
                              />
                              <input
                                className="m-2 border h-10 w-10 text-center form-control rounded"
                                type="text"
                                id="sixth"
                                maxLength="1"
                              />
                            </div>

                            <div className="flex justify-center text-center mt-5">
                              <input type="checkbox" />
                              <p className="ml-2 text-[#515151] text-[13px] ">
                                Start screen in Preview Mode
                              </p>
                            </div>
                            <div className="flex justify-center text-center mt-5">
                              <p className="text-[#515151] text-[13px]">
                                To get pair code, please install Disploy app on
                                your Players (Android, LG, Samsung, FireStick,
                                Raspberry Pi, etc.)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center pb-7">
                  <Link to="/newscreendetail">
                    <button
                      className="text-white bg-[#00072E] font-semibold  px-6 py-2 text-sm rounded-[45px]"
                      type="button"
                    >
                      Continue
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <div className="flex">
        <div
          className={`${
            sidebarOpen ? "w-52" : "w-16"
          } fixed top-0 md:left-0 lg:left-0  z-40 px-4 h-screen lg:rounded-tr-[50px] md:rounded-tr-[50px] sm:rounded-tr-[30px] bg-primary `}
        >
          <div className="flex items-center lg:py-6 md:py-6 sm:pt-6 sm:pb-3 pt">
            {sidebarOpen ? (
              <img
                src="/DisployImg/logo.svg"
                alt="Logo"
                className="cursor-pointer duration-500"
              />
            ) : (
              <img
                src="/DisployImg/logoIcon.svg"
                alt="Logo"
                className="cursor-pointer duration-500"
              />
            )}
          </div>
          <ul className="space-y-1 font-medium">
            {Menus.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <div className="flex items-center">
                    <Link to={item.path}>
                      <div
                        onMouseEnter={() => handleTooltipToggle(index)}
                        onMouseLeave={() => setTooltipVisible(false)}
                      >
                        {item.icon}
                      </div>
                      {!sidebarOpen &&
                        tooltipVisible &&
                        activeIcon === index && (
                          <div
                            id="tooltip-right"
                            role="tooltip"
                            className=" absolute z-10 visible inline-block px-2 py-1 text-sm font-medium text-white bg-SlateBlue rounded-sm shadow-sm opacity-100 tooltip  left-[30px]  dark:bg-gray-700"
                          >
                            <span
                              className={`${
                                !sidebarOpen && !tooltipVisible && "hidden"
                              } ml-0 text-sm `}
                            >
                              {item.title}
                            </span>
                            <div
                              className="tooltip-arrow"
                              data-popper-arrow
                            ></div>
                          </div>
                        )}
                      <span className={`${!sidebarOpen && "hidden"} ml-5 `}>
                        {item.title}
                      </span>
                    </Link>
                    {item.subMenus && (
                      <div className={`${!sidebarOpen ? "ml-[1px]" : "ml-5"}`}>
                        <FiIcons.FiChevronDown
                          className={`${
                            activeSubmenu === index
                              ? "transform rotate-180"
                              : ""
                          } transition-transform duration-300 text-white ${
                            sidebarOpen ? "text-[25px]" : "text-[18px]"
                          }`}
                          onClick={() =>
                            setActiveSubmenu(
                              activeSubmenu === index ? null : index
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                  {activeSubmenu === index && item.subMenus && (
                    <ul className={`${!sidebarOpen ? "ml-2" : "ml-6"} mt-3`}>
                      {item.subMenus.map((submenu, subIndex) => (
                        <li key={subIndex} className="py-2 relative">
                          <Link to={submenu.path}>
                            <div
                              onMouseEnter={() =>
                                handleSMTooltipToggle(subIndex)
                              }
                              onMouseLeave={() => setSMTooltipVisible(false)}
                            >
                              {submenu.icon}
                            </div>
                            {!sidebarOpen &&
                              SMTooltipVisible &&
                              activeIcon === subIndex && (
                                <div
                                  id="tooltip-right"
                                  role="tooltip"
                                  className=" absolute z-10 visible inline-block px-2 py-1 text-sm font-medium text-white bg-SlateBlue rounded-sm shadow-sm opacity-100 tooltip  left-[30px]  dark:bg-gray-700"
                                >
                                  <span
                                    className={`${
                                      !sidebarOpen &&
                                      !SMTooltipVisible &&
                                      "hidden"
                                    } ml-0 text-sm `}
                                  >
                                    {submenu.title}
                                  </span>
                                  <div
                                    className="tooltip-arrow"
                                    data-popper-arrow
                                  ></div>
                                </div>
                              )}
                            <span
                              className={`${!sidebarOpen && "hidden"} ml-5 `}
                            >
                              {submenu.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li>
              <div className="dotline my-4"></div>
            </li>
            {MenuIcons.map((item, MIindex) => {
              return (
                <li key={MIindex} className={item.cName}>
                  <Link to={item.path}>
                    <div
                      onMouseEnter={() => handleMITooltipToggle(MIindex)}
                      onMouseLeave={() => setMITooltipVisible(false)}
                    >
                      {item.icon}
                    </div>
                    {!sidebarOpen &&
                      MITooltipVisible &&
                      activeIcon === MIindex && (
                        <div
                          id="tooltip-right"
                          role="tooltip"
                          className=" absolute z-10 visible inline-block px-2 py-1 text-sm font-medium text-white bg-SlateBlue rounded-sm shadow-sm opacity-100 tooltip  left-[30px]  dark:bg-gray-700"
                        >
                          <span
                            className={`${
                              !sidebarOpen && !MITooltipVisible && "hidden"
                            } ml-0  `}
                          >
                            {item.title}
                          </span>
                          <div
                            className="tooltip-arrow"
                            data-popper-arrow
                          ></div>
                        </div>
                      )}
                    <span className={`${!sidebarOpen && "hidden"} ml-5 `}>
                      {item.title}
                    </span>
                  </Link>
                  {Menus.title}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
