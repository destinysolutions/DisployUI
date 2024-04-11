import { useEffect, useState } from "react";
import "../Styles/sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import { MdOutlineAddToQueue } from "react-icons/md";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import PropTypes from "prop-types";
import * as AiIcons from "react-icons/ai";
import ScreenOTPModal from "./Screen/ScreenOTPModal";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import toast from "react-hot-toast";
import screenIcon from "../images/MenuIcons/screens_icon.svg";
import settingIcon from "../images/MenuIcons/setting_icon.svg";
import trashIcon from "../images/MenuIcons/Trash_icon.svg";
import logoutIcon from "../images/MenuIcons/logout_icon.svg";
import assetsIcon from "../images/MenuIcons/assets_icon.svg";
import appsIcon from "../images/MenuIcons/apps_icon.svg";
import compositionIcon from "../images/MenuIcons/playlist_icon.svg";
import scheduleIcon from "../images/MenuIcons/schedule_icon.svg";
import reportIcon from "../images/MenuIcons/reports_icon.svg";
import logo from "../images/DisployImg/White-Logo2.png";
import { useDispatch } from "react-redux";
import { handleLogout } from "../Redux/Authslice";
import merge_screen from "../images/MenuIcons/merge_screen.svg";
import { useSelector } from "react-redux";
import { getMenuAll } from "../Redux/SidebarSlice";
import dashboardIcon from "../images/MenuIcons/dashboard_icon.svg";
import { BsCalendar2PlusFill } from "react-icons/bs";
const Sidebar = ({ sidebarOpen }) => {
  Sidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
  };
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [submenuStates, setSubmenuStates] = useState({});

  const [menuData, setMenuData] = useState([]);
  const [menuDataBottummenu, setMenuDataBottummenu] = useState([]);

  const store = useSelector((state) => state.root.sidebarData);


  useEffect(() => {
    dispatch(getMenuAll());
  }, []);

  useEffect(() => {
    if (store.data.menu) {
      const formattedMenuData = store.data.menu
        .map((item) => ({
          title: item.pageName,
          cName: "nav-text link-items",
          path: item.path,
          isView: item.isView,
          icon: <img src={item.icon} alt={item.alt} className="w-6" />,
          subMenus:
            item.submenu && item.submenu.length > 0
              ? item.submenu.map((submenu) => ({
                  title: submenu.pageName,
                  path: submenu.path,
                  isView: submenu.isView,
                  icon: (
                    <img src={submenu.icon} alt={submenu.alt} className="w-6" />
                  ),
                }))
              : null,
          sortBy: item.sortBy || 0, // Assuming sortBy is a numeric property
          isActive: false, // You may want to set this property as well
        }))
        .sort((a, b) => a.sortBy - b.sortBy || a.title.localeCompare(b.title)); // Sort by sortBy, then by title

      const currentPath = window.location.pathname;
      let foundActive = false;

      const updateIsActive = (menuItems) => {
        menuItems.forEach((menuItem) => {
          if (menuItem.path === currentPath) {
            menuItem.isActive = true;
            foundActive = true;
          } else if (menuItem.subMenus) {
            updateIsActive(menuItem.subMenus);
            if (menuItem.isActive) {
              foundActive = true;
            }
          }
        });
      };

      updateIsActive(formattedMenuData);

      // If no active item is found, reset all isActive properties to false
      if (!foundActive) {
        formattedMenuData.forEach((menuItem) => {
          menuItem.isActive = false;
          if (menuItem.subMenus) {
            menuItem.subMenus.forEach((submenuItem) => {
              submenuItem.isActive = false;
            });
          }
        });
      }

      const bottummenuMenuData = store.data.bottummenu
        .map((item) => ({
          title: item.pageName,
          cName: "nav-text link-items",
          path: item.path,
          icon: <img src={item.icon} alt={item.alt} className="w-6" />,
          isView: item.isView,
          subMenus:
            item.submenu && item.submenu.length > 0
              ? item.submenu.map((submenu) => ({
                  title: submenu.pageName,
                  path: submenu.path,
                  isView: submenu.isView,
                  icon: (
                    <img src={submenu.icon} alt={submenu.alt} className="w-6" />
                  ),
                }))
              : null,
          sortBy: item.sortBy || 0, // Assuming sortBy is a numeric property
          isActive: false, // You may want to set this property as well
        }))
        .sort((a, b) => a.sortBy - b.sortBy || a.title.localeCompare(b.title)); // Sort by sortBy, then by title

      setMenuData(formattedMenuData);
      setMenuDataBottummenu(bottummenuMenuData);
    }
  }, [store.data]);

  // console.log("store ------------------- ", store.data.menu, { menuData });

  // menu list
  const Menus = [
    // {
    //   title: "Dashboard",
    //   cName: "nav-text link-items",
    //   path: "/userdashboard",
    //   icon: (
    //     <img src={dashboardIcon} alt="Dashboard" className="fill-white w-6" />
    //   ),
    // },
    {
      title: "Screens",
      cName: "nav-text link-items",
      path: "/screens",
      icon: <img src={screenIcon} alt="Screens" className="w-6" />,
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
        // {
        //   title: "Merge Screens",
        //   path: "/mergescreen",
        //   icon: <img src={merge_screen} alt="" />,
        // },
        {
          title: "Book your slot",
          path: "/bookslot",
          icon: (
            <BsCalendar2PlusFill className=" text-gray text-xl opacity-60 " />
          ),
        },
      ],
    },
    {
      title: "Assets",
      cName: "nav-text link-items",
      path: "/assets",
      icon: <img src={assetsIcon} alt="Assets" className="w-6" />,
    },
    {
      title: "My Composition",
      cName: "nav-text link-items",
      path: "/composition",
      icon: <img src={compositionIcon} alt="Playlist" className="w-6" />,
    },
    // {
    //   title: "Disploy Studio",
    //   cName: "nav-text link-items",
    //   path: "/disploystudio",
    //   icon: (
    //     <img
    //       src="/MenuIcons/disploy_studio_icon.svg"
    //       alt="Disploy_Studio"
    //       className="w-6"
    //     />
    //   ),
    // },
    {
      title: "My Schedule",
      cName: "nav-text link-items",
      path: "/myschedule",
      icon: <img src={scheduleIcon} alt="My_Schedule" className="w-6" />,
    },
    {
      title: "Apps",
      cName: "nav-text link-items",
      path: "/apps",
      icon: <img src={appsIcon} alt="Apps" className="w-6" />,
    },

    // {
    //   title: "Reports",
    //   cName: "nav-text link-items",
    //   path: "/reports",
    //   icon: <img src={reportIcon} alt="Reports" className="w-6" />,
    // },
    // {
    //   title: "Approval",
    //   cName: "nav-text link-items",
    //   path: "/approval",
    //   icon: <img src={approvalIcon} alt="Approval" className="w-6" />
    // },
    // {
    //   title: "Social Media Tools",
    //   cName: "nav-text link-items",
    //   path: "/Social_Media_Tools",
    //   icon: (
    //     <img
    //       src="/MenuIcons/social-media-tools-icon.svg"
    //       alt="Social Media Tools"
    //       className="w-6"
    //     />
    //   ),
    // },
  ];
  const MenuIcons = [
    // {
    //   title: "Support",
    //   cName: "nav-text link-items",
    //   path: "/support",
    //   icon: (
    //     <img src="/MenuIcons/support_icon.svg" alt="Support" className="w-6" />
    //   ),
    // },
    {
      title: "Settings",
      cName: "nav-text link-items",
      path: "/settings",
      icon: <img src={settingIcon} alt="Settings" className="w-6" />,
    },
    // {
    //   title: "Take Tour",
    //   cName: "nav-text link-items",
    //   path: "/taketour",
    //   icon: (
    //     <img
    //       src="/MenuIcons/take_tour_icon.svg"
    //       alt="Take_Tour"
    //       className="w-6"
    //     />
    //   ),
    // },
    {
      title: "Trash",
      cName: "nav-text link-items",
      path: "/trash",
      icon: <img src={trashIcon} alt="Trash" className="w-6" />,
    },
    {
      title: "Log Out",
      cName: "nav-text link-items",
      icon: <img src={logoutIcon} alt="LogOut" className="w-6" />,
    },
  ];

  const handleSidebarToggle = () => {
    setMobileSidebar(!mobileSidebar);
  };

  // Update submenu state and store in local storage
  const updateSubmenuState = (submenuTitle, isOpen) => {
    const updatedStates = { ...submenuStates, [submenuTitle]: isOpen };
    setSubmenuStates(updatedStates);
    localStorage.setItem("submenuStates", JSON.stringify(updatedStates));
  };

  const handleChangeRoute = (title, path) => {
    if (title == "Log Out") {
      toast.loading("Logout...");
      setTimeout(() => {
        dispatch(handleLogout());
        toast.remove();
        navigation("/");
      }, 1000);
    } else {
      navigation(path);
    }
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
          <ScreenOTPModal
            showOTPModal={showOTPModal}
            setShowOTPModal={setShowOTPModal}
          />
        </>
      ) : null}
      {/* screen otp modal end */}

      {/* full screen sidebar start */}
      {sidebarOpen ? (
        <>
          <div className="flex">
            <div className="w-60 fixed top-0 md:left-0 lg:left-0 z-50 px-4 h-screen lg:rounded-tr-[50px] md:rounded-tr-[50px] sm:rounded-tr-[30px] bg-primary" >
              <div className="flex items-center lg:py-6 md:py-6 sm:pt-6 sm:pb-3 pt">
                <img
                  alt="Logo"
                  src={logo}
                  className="cursor-pointer duration-500"
                />
              </div>
              <ul className="space-y-1 font-medium">
                {menuData
                  .filter((item) => item.isView)
                  .map((item, index) => {
                    const submenuIsOpen = submenuStates[item.title] || false;
                    const isActive = window.location.pathname === item.path; // Check if the item is active
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
                            {item.subMenus
                              .filter((submenu) => submenu.isView) // Filter out submenu items where isView is false
                              .map((submenu, subIndex) => (
                                <li
                                  key={subIndex}
                                  className="p-2 relative submenu"
                                >
                                  <Link to={submenu.path}>
                                    <div>{submenu.icon}</div>
                                    {submenu.title === "New Screen" ? (
                                      <span
                                        className="ml-5"
                                        onClick={() => setShowOTPModal(true)}
                                      >
                                        {submenu.title}
                                      </span>
                                    ) : (
                                      <span className="ml-5">
                                        {submenu.title}
                                      </span>
                                    )}
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

                {menuDataBottummenu
                  .filter((item) => item.isView)
                  .map((item, MIindex) => {
                    const isActive = window.location.pathname === item.path; // Check if the item is active
                    return (
                      <li
                        key={MIindex}
                        className={`${item.cName} ${isActive ? "active" : ""}`}
                      >
                        <div
                          className="flex"
                          onClick={() => {
                            handleChangeRoute(item.title, item.path);
                          }}
                        >
                          <div>{item.icon}</div>
                          <span className="ml-5 text-[#8E94A9]">
                            {item.title}
                          </span>

                          {Menus.title}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="menu-bars self-center z-[99] min-h-[60px] max-h-[60px] flex items-center">
          <HiOutlineMenuAlt2
            onClick={handleSidebarToggle}
            className={` text-SlateBlue text-3xl fixed cursor-pointer ${
              mobileSidebar && "hidden"
            } ${mobileSidebar ? "ml-0" : "ml-5"}`}
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
                {menuData.map((item, index) => {
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
                                {submenu.title === "New Screen" ? (
                                  <span
                                    className="ml-5"
                                    onClick={() => {
                                      setShowOTPModal(true);
                                      setMobileSidebar(false);
                                    }}
                                  >
                                    {submenu.title}
                                  </span>
                                ) : (
                                  <span className="ml-5">{submenu.title}</span>
                                )}
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
                {menuDataBottummenu.map((item, MIindex) => {
                  return (
                    <li key={MIindex} className={item.cName}>
                      <div
                        className="flex"
                        onClick={() => {
                          handleChangeRoute(item.title, item.path);
                        }}
                      >
                        <div>{item.icon}</div>
                        <span className="ml-5 text-[#8E94A9]">
                          {item.title}
                        </span>

                        {Menus.title}
                      </div>
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

export default Sidebar;
