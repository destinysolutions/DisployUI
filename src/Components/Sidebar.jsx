import React, { useState, useEffect } from "react";
import "../Styles/sidebar.css";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
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
      icon: <img src="/MenuIcons/screens_icon.svg" alt="Screens" />,
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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 780) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div>
        <div className="navbar">
          <div className="menu-bars">
            <FaIcons.FaBars
              onClick={() => setSidebarOpen(true)}
              className="text-primary"
            />
          </div>
        </div>

        <nav className={sidebarOpen ? "nav-menu active" : "nav-menu"}>
          <ul className="space-y-1 font-medium">
            <li className="navbar-toggle relative">
              <img
                src="/DisployImg/logo.svg"
                alt="Logo"
                className="brand cursor-pointer duration-500 w-40"
              />
              <div className="menu-bars relative">
                <AiIcons.AiOutlineCloseCircle
                  className="text-white"
                  onClick={() => setSidebarOpen(false)}
                />
              </div>
            </li>
            {Menus.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <div className="flex items-center">
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                    {item.subMenus && (
                      <div className="ml-16">
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
                            <span>{submenu.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li>
              {" "}
              <div className="dotline my-4"></div>{" "}
            </li>
            {MenuIcons.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
