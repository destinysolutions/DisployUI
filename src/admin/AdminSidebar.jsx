import "../Styles/sidebar.css";
import * as FiIcons from "react-icons/fi";
import { ImStack } from "react-icons/im";
import PropTypes from "prop-types";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useState } from "react";
import { useEffect } from "react";
import { FaUserTimes } from "react-icons/fa";
import { FaUserAlt, FaUserCheck, FaUsers } from "react-icons/fa";
import { SlOrganization } from "react-icons/sl";
import logo from "../images/DisployImg/White-Logo2.png";
import { FaUserGroup } from "react-icons/fa6";
import settingIcon from "../images/MenuIcons/setting_icon.svg"
const AdminSidebar = ({ sidebarOpen }) => {
  AdminSidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
  };
  const [activeSubmenu, setActiveSubmenu] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({});
  const updateSubmenuState = (submenuTitle, isOpen) => {
    const updatedStates = { ...submenuStates, [submenuTitle]: isOpen };
    setSubmenuStates(updatedStates);
    localStorage.setItem("submenuStates", JSON.stringify(updatedStates));
  };
  useEffect(() => {
    const storedStates = localStorage.getItem("submenuStates");
    if (storedStates) {
      setSubmenuStates(JSON.parse(storedStates));
    }
  }, []);
  //for menu list
  const Menus = [
    {
      title: "Dashboard",
      cName: "nav-text link-items",
      path: "/admin-dashboard",
      icon: <ImStack className="text-2xl" />,
    },
    {
      title: "UserType",
      cName: "nav-text link-items",
      path: "/manage-user-type",
      icon: <FaUsers className="text-2xl" />,
    },
    {
      title: "User",
      cName: "nav-text link-items",
      path: "/user",
      icon: <FaUserAlt className="text-2xl" />,
    },
    {
      title: "Organization",
      cName: "nav-text link-items",
      //path: "/organization",
      path: "/onborded",
      icon: <SlOrganization className="text-2xl" />,
      subMenus: [
        // {
        //   title: "Pending",
        //   path: "/pending",
        //   icon: <FaUserTimes className="  text-xl  " />,
        // },
        {
          title: "OnBorded",
          path: "/onborded",
          icon: <FaUserCheck className="  text-xl  " />,
        },
        {
          title: "Retailer",
          path: "/retailer",
          icon: <FaUserCheck className="  text-xl  " />,
        },
        {
          title: "Advertisement",
          path: "/advertisement",
          icon: <FaUserCheck className="  text-xl  " />,
        },
      ],
    },
    {
      title: "Clients",
      cName: "nav-text link-items",
      path: "/client",
      icon: <FaUserGroup className="text-2xl" />,
    },
    {
      title: "Settings",
      cName: "nav-text link-items",
      path: "/settings",
      icon: <img src={settingIcon} alt="Settings" className="w-6" />,
    },
  ];

  //using for mobile sidebar
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const handleSidebarToggle = () => {
    setMobileSidebar(!mobileSidebar);
  };
  return (
    <>
      {/* full screen sidebar start */}
      {sidebarOpen ? (
        <>
          <div className="flex">
            <div className="w-60 fixed top-0 md:left-0 lg:left-0  z-40 px-4 h-screen lg:rounded-tr-[50px] md:rounded-tr-[50px] sm:rounded-tr-[30px] bg-primary">
              <div className="flex items-center lg:py-6 md:py-6 sm:pt-6 sm:pb-3 pt">
                <img
                  src={logo}
                  alt="Logo"
                  className="cursor-pointer duration-500"
                />
              </div>
                <ul className="space-y-1 font-medium">
                  {Menus.map((item, index) => {
                    const submenuIsOpen = submenuStates[item.title] || false;
                    const isActive = window.location.pathname === item.path;
                    return (
                      <li
                        key={index}
                        className={`${item.cName} ${isActive ? "active" : ""}`}
                      >
                        <div className="flex items-center">
                          <Link to={item.path}>
                            <div>{item.icon}</div>
                            <span className="ml-5">{item.title}</span>
                          </Link>
                          {item.subMenus && (
                            <div className="ml-5 absolute right-0">
                              <FiIcons.FiChevronDown
                                className={`${
                                  submenuIsOpen ? "transform rotate-180" : ""
                                } transition-transform duration-300 text-white `}
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateSubmenuState(
                                    item.title,
                                    !submenuIsOpen
                                  );
                                }}
                              />
                            </div>
                          )}
                        </div>
                        {submenuIsOpen && item.subMenus && (
                          <ul className="ml-4 mt-3">
                            {item.subMenus.map((submenu, subIndex) => (
                              <li
                                key={subIndex}
                                className="p-2 relative submenu"
                              >
                                <Link to={submenu.path}>
                                  <div>{submenu.icon}</div>
                                  <span className="ml-5">{submenu.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="menu-bars self-center">
          <HiOutlineMenuAlt2
            onClick={handleSidebarToggle}
            className={` text-SlateBlue text-3xl ${mobileSidebar && "hidden"} ${
              mobileSidebar ? "ml-0" : "ml-5"
            }`}
          />
        </div>
      )}
      {/* full screen sidebar end */}

      {/* mobile screen sidebar start */}
      {mobileSidebar && (
        <div className="flex">
          <div className="w-56 fixed top-0 left-0 z-[9999] px-4 h-screen rounded-tr-[50px] bg-primary">
            <div className="flex items-center py-6">
              <img
                src={logo}
                alt="Logo"
                className="cursor-pointer duration-500 w-44"
              />
              <div className="ml-0 relative right-0 mt-1">
                <AiIcons.AiOutlineCloseCircle
                  className="text-white cursor-pointer text-2xl"
                  onClick={() => setMobileSidebar(false)}
                />
              </div>
            </div>
            <div className="h-100vh overflow-auto">
              <ul className="space-y-1 font-medium">
                {Menus.map((item, index) => {
                  return (
                    <li key={index} className={item.cName}>
                      <div className="flex items-center">
                        <Link to={item.path}>
                          <div>{item.icon}</div>
                          <span className="ml-5">{item.title}</span>
                        </Link>
                        {item.subMenus && (
                          <div className="ml-5 absolute right-0">
                            <FiIcons.FiChevronDown
                              className={`${
                                activeSubmenu ? "transform rotate-180" : ""
                              } transition-transform duration-300 text-white 
                          `}
                              onClick={() => setActiveSubmenu(!activeSubmenu)}
                            />
                          </div>
                        )}
                      </div>
                      {activeSubmenu && item.subMenus && (
                        <ul className="ml-4 mt-3">
                          {item.subMenus.map((submenu, subIndex) => (
                            <li key={subIndex} className="p-2 relative submenu">
                              <Link to={submenu.path}>
                                <div>{submenu.icon}</div>
                                <span className="ml-5">{submenu.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* mobile screen sidebar end */}
    </>
  );
};

export default AdminSidebar;
