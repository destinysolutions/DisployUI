


import React, { useEffect, useState } from 'react'
import "../Styles/sidebar.css";
import * as FiIcons from "react-icons/fi";
import { ImStack } from "react-icons/im";
import PropTypes from "prop-types";
import * as AiIcons from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/DisployImg/White-Logo2.png";
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
// import { handleLogout } from '../Redux/Authslice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { LiaCalendarWeekSolid, LiaFileInvoiceSolid } from "react-icons/lia";
import { MdOutlineLogout } from 'react-icons/md';
import { handleLogout } from '../Redux/Authslice';
import reportIcon from "../images/MenuIcons/reports_icon.svg";

const AdvertismentSidebar = ({ sidebarOpen }) => {
    AdvertismentSidebar.propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
    };
    const navigation = useNavigate();
    const dispatch = useDispatch();
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

    //using for mobile sidebar
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const handleSidebarToggle = () => {
        setMobileSidebar(!mobileSidebar);
    };

    const Menus = [
        {
            title: "Current booking",
            cName: "nav-text link-items",
            path: "/dashboard",
            icon: <LiaCalendarWeekSolid className="text-[30px] font-bold" />,
        },
        {
            title: "Reports",
            cName: "nav-text link-items",
            path: "/report",
            icon: <img src={reportIcon} alt="Reports" className="w-6" />
        },
        {
            title: "Invoice",
            cName: "nav-text link-items",
            path: "/invoice",
            icon: <LiaFileInvoiceSolid className="text-3xl font-bold" />,
        },

        {
            title: "Log Out",
            cName: "nav-text link-items",
            path: "/",
            icon: <MdOutlineLogout className="text-2xl font-bold" />,
        },
    ];

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

                                                <div
                                                    className="flex"
                                                    onClick={() => {
                                                        handleChangeRoute(item.title, item.path);
                                                    }}
                                                >
                                                    <div className='text-[#8E94A9]'>{item.icon}</div>
                                                    <span className="ml-5 text-[#8E94A9]">
                                                        {item.title}
                                                    </span>
                                                </div>
                                                {item.subMenus && (
                                                    <div className="ml-5 absolute right-0">
                                                        <FiIcons.FiChevronDown
                                                            className={`${submenuIsOpen ? "transform rotate-180" : ""
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
                        className={` text-SlateBlue text-3xl ${mobileSidebar && "hidden"} ${mobileSidebar ? "ml-0" : "ml-5"
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
                                                <div
                                                    className="flex"
                                                    onClick={() => {
                                                        handleChangeRoute(item.title, item.path);
                                                    }}
                                                >
                                                    <div className='text-[#8E94A9]'>{item.icon}</div>
                                                    <span className="ml-5 text-[#8E94A9]">
                                                        {item.title}
                                                    </span>
                                                </div>
                                                {item.subMenus && (
                                                    <div className="ml-5 absolute right-0">
                                                        <FiIcons.FiChevronDown
                                                            className={`${activeSubmenu ? "transform rotate-180" : ""
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
    )
}

export default AdvertismentSidebar
