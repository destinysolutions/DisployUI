import { useEffect, useState } from "react";
import "../Styles/sidebar.css";
import { Link } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdOutlineAddToQueue } from "react-icons/md";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import PropTypes from "prop-types";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import ScreenOTPModal from "./Screen/ScreenOTPModal";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const Sidebar = ({ sidebarOpen }) => {
  Sidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
  };

  //for menu list
  const Menus = [
    {
      title: "Dashboard",
      cName: "nav-text link-items",
      path: "/dashboard",
      icon: (
        <img
          src="/MenuIcons/dashboard_icon.svg"
          alt="Dashboard"
          className="fill-white w-6"
        />
      ),
    },
    {
      title: "Screens",
      cName: "nav-text link-items",
      path: "/screens",
      icon: (
        <img src="/MenuIcons/screens_icon.svg" alt="Screens" className="w-6" />
      ),
      subMenus: [
        {
          title: (
            <button onClick={() => setShowOTPModal(true)}> New Screen</button>
          ),
          icon: (
            <MdOutlineAddToQueue className=" text-gray text-lg opacity-60 " />
          ),
        },
        {
          title: "New Screen Group",
          path: "/newscreengroup",
          icon: (
            <HiOutlineRectangleGroup className=" text-gray text-xl opacity-60 " />
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
      icon: (
        <img src="/MenuIcons/assets_icon.svg" alt="Assets" className="w-6" />
      ),
    },
    {
      title: "Playlist ",
      cName: "nav-text link-items",
      path: "/myplaylist",
      icon: (
        <img
          src="/MenuIcons/playlist_icon.svg"
          alt="Playlist"
          className="w-6"
        />
      ),
    },
    {
      title: "Disploy Studio",
      cName: "nav-text link-items",
      path: "/disploystudio",
      icon: (
        <img
          src="/MenuIcons/disploy_studio_icon.svg"
          alt="Disploy_Studio"
          className="w-6"
        />
      ),
    },
    {
      title: "My Schedule",
      cName: "nav-text link-items",
      path: "/myschedule",
      icon: (
        <img
          src="/MenuIcons/schedule_icon.svg"
          alt="My_Schedule"
          className="w-6"
        />
      ),
    },
    {
      title: "Apps",
      cName: "nav-text link-items",
      path: "/apps",
      icon: <img src="/MenuIcons/apps_icon.svg" alt="Apps" className="w-6" />,
    },
    {
      title: "Reports",
      cName: "nav-text link-items",
      path: "/reports",
      icon: (
        <img src="/MenuIcons/reports_icon.svg" alt="Reports" className="w-6" />
      ),
    },
    {
      title: "Approval",
      cName: "nav-text link-items",
      path: "/approval",
      icon: (
        <img
          src="/MenuIcons/approval_icon.svg"
          alt="Approval"
          className="w-6"
        />
      ),
    },
    {
      title: "Social Media Tools",
      cName: "nav-text link-items",
      path: "/Social_Media_Tools",
      icon: (
        <img
          src="/MenuIcons/social-media-tools-icon.svg"
          alt="Social Media Tools"
          className="w-6"
        />
      ),
    },
  ];
  const MenuIcons = [
    {
      title: "Support",
      cName: "nav-text link-items",
      path: "/support",
      icon: (
        <img src="/MenuIcons/support_icon.svg" alt="Support" className="w-6" />
      ),
    },
    {
      title: "Settings",
      cName: "nav-text link-items",
      path: "/settings",
      icon: (
        <img src="/MenuIcons/setting_icon.svg" alt="Settings" className="w-6" />
      ),
    },
    {
      title: "Take Tour",
      cName: "nav-text link-items",
      path: "/taketour",
      icon: (
        <img
          src="/MenuIcons/take_tour_icon.svg"
          alt="Take_Tour"
          className="w-6"
        />
      ),
    },
    {
      title: "Trash",
      cName: "nav-text link-items",
      path: "/trash",
      icon: <img src="/MenuIcons/Trash_icon.svg" alt="Trash" className="w-6" />,
    },
    {
      title: "Log Out",
      cName: "nav-text link-items",
      path: "/logout",
      icon: (
        <img src="/MenuIcons/logout_icon.svg" alt="LogOut" className="w-6" />
      ),
    },
  ];

  //using for screen otp modal
  const [showOTPModal, setShowOTPModal] = useState(false);

  //using for display sub menu
  const [activeSubmenu, setActiveSubmenu] = useState(false);

  //using for mobile sidebar
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const handleSidebarToggle = () => {
    setMobileSidebar(!mobileSidebar);
  };

  const [submenuStates, setSubmenuStates] = useState({});

  // Update submenu state and store in local storage
  const updateSubmenuState = (submenuTitle, isOpen) => {
    const updatedStates = { ...submenuStates, [submenuTitle]: isOpen };
    setSubmenuStates(updatedStates);
    localStorage.setItem("submenuStates", JSON.stringify(updatedStates));
  };

  // Load submenu states from local storage on component mount
  useEffect(() => {
    const storedStates = localStorage.getItem("submenuStates");
    if (storedStates) {
      setSubmenuStates(JSON.parse(storedStates));
    }
  }, []);

  return (
    <>
      {/* screen otp modal start */}
      {showOTPModal ? (
        <>
          <ScreenOTPModal setShowOTPModal={setShowOTPModal} />
        </>
      ) : null}
      {/* screen otp modal end */}

      {/* full screen sidebar start */}
      {sidebarOpen ? (
        <>
          <div className="flex">
            <div className="w-60 fixed top-0 md:left-0 lg:left-0  z-40 px-4 h-screen lg:rounded-tr-[50px] md:rounded-tr-[50px] sm:rounded-tr-[30px] bg-primary">
              <div className="flex items-center lg:py-6 md:py-6 sm:pt-6 sm:pb-3 pt">
                <img
                  src="/DisployImg/logo.svg"
                  alt="Logo"
                  className="cursor-pointer duration-500"
                />
              </div>
              <ul className="space-y-1 font-medium">
                {Menus.map((item, index) => {
                  const submenuIsOpen = submenuStates[item.title] || false; // Check if submenu is open
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
                                submenuIsOpen ? "transform rotate-180" : ""
                              } transition-transform duration-300 text-white `}
                              onClick={(e) => {
                                e.preventDefault();
                                updateSubmenuState(item.title, !submenuIsOpen);
                              }} // Update submenu state
                            />
                          </div>
                        )}
                      </div>
                      {submenuIsOpen && item.subMenus && (
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
                <li>
                  <div className="dotline my-4"></div>
                </li>
                {MenuIcons.map((item, MIindex) => {
                  return (
                    <li key={MIindex} className={item.cName}>
                      <Link to={item.path}>
                        <div>{item.icon}</div>
                        <span className="ml-5">{item.title}</span>
                      </Link>
                      {Menus.title}
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
                src="/DisployImg/logo.svg"
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
              <li>
                <div className="dotline my-4"></div>
              </li>
              {MenuIcons.map((item, MIindex) => {
                return (
                  <li key={MIindex} className={item.cName}>
                    <Link to={item.path}>
                      <div>{item.icon}</div>
                      <span className="ml-5">{item.title}</span>
                    </Link>
                    {Menus.title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      {/* mobile screen sidebar end */}
    </>
  );
};

export default Sidebar;
