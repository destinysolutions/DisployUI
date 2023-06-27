import React, { useState } from "react";
import "../Styles/sidebar.css";
import { Link } from "react-router-dom";
import * as FiIcons from "react-icons/fi";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const Menus = [
    {
      title: "Dashboard",
      cName: "nav-text link-items",
      path: "/dashboard",
      icon: <img src="/MenuIcons/dashboard_icon.svg" alt="Dashboard" />,
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
          title: "Connect Screen",
          path: "/connectscreen",
          icon: (
            <img src="/MenuIcons/connect_screen.svg" alt="Connect Screen" />
          ),
        },
        {
          title: " New Screen",
          path: "/newscreen",
          icon: <img src="/MenuIcons/new_screen.svg" alt=" New Screen" />,
        },
        {
          title: "New Screen Group",
          path: "/newscreengroup",
          icon: (
            <img src="/MenuIcons/new_screen_group.svg" alt="New Screen Group" />
          ),
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
      title: "Publish",
      cName: "nav-text link-items",
      path: "/publish",
      icon: <img src="/MenuIcons/publish_icon.svg" alt="Publish" />,
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
    {
      title: "My Plan",
      cName: "nav-text link-items",
      path: "/myplan",
      icon: <img src="/MenuIcons/my_plan_icon.svg" alt="My_Plan" />,
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

  const handleTooltipToggle = (index) => {
    setActiveIcon(index);
    setTooltipVisible(!tooltipVisible);
  };
  return (
    <>
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
                        onMouseLeave={handleTooltipToggle}
                      >
                        {item.icon}
                      </div>
                      {!sidebarOpen &&
                        tooltipVisible &&
                        activeIcon === index && (
                          <div
                            id="tooltip-bottom"
                            role="tooltip"
                            className="absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700"
                          >
                            <span
                              className={`${
                                !sidebarOpen && !tooltipVisible && "hidden"
                              } ml-5 `}
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
                      <div className="ml-5">
                        <FiIcons.FiChevronDown
                          className={`${
                            activeSubmenu === index
                              ? "transform rotate-180"
                              : ""
                          } transition-transform duration-300 text-white text-[25px]`}
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
                    <ul className="ml-6 mt-3">
                      {item.subMenus.map((submenu, subIndex) => (
                        <li key={subIndex} className="py-2 relative">
                          <Link to={submenu.path}>
                            {submenu.icon}
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
            {MenuIcons.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
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
