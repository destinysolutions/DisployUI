import "../Styles/sidebar.css";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import * as AiIcons from "react-icons/ai";

import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useState } from "react";

const AdminSidebar = ({ sidebarOpen }) => {
  const navigation = useNavigate();

  AdminSidebar.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
  };

  //for menu list
  const Menus = [
    {
      title: "User",
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
      title: "OnBoding",
      cName: "nav-text link-items",
      path: "/onboding",
      icon: (
        <img src="/MenuIcons/assets_icon.svg" alt="Assets" className="w-6" />
      ),
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
                  src="/DisployImg/logo.svg"
                  alt="Logo"
                  className="cursor-pointer duration-500"
                />
              </div>
              <ul className="space-y-1 font-medium">
                {Menus.map((item, MIindex) => {
                  return (
                    <li key={MIindex} className={item.cName}>
                      <div
                        className="flex"
                        onClick={() => {
                          if (item.title == "Log Out") {
                            localStorage.setItem("role_access", "");
                            window.location.reload();
                            navigation("/");
                            auth.signOut();
                          } else {
                            navigation(item.path);
                          }
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
              {Menus.map((item, MIindex) => {
                return (
                  <li key={MIindex} className={item.cName}>
                    <div
                      className="flex"
                      onClick={() => {
                        if (item.title == "Log Out") {
                          localStorage.setItem("role_access", "");
                          window.location.reload();
                          navigation("/");
                          auth.signOut();
                        } else {
                          navigation(item.path);
                        }
                      }}
                    >
                      <div>{item.icon}</div>
                      <span className="ml-5 text-[#8E94A9]">{item.title}</span>

                      {Menus.title}
                    </div>
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

export default AdminSidebar;
