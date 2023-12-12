import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbBoxMultiple } from "react-icons/tb";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { MdOutlineWidgets } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../../Styles/apps.css";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllApps } from "../../Redux/AppsSlice";

const Apps = ({ sidebarOpen, setSidebarOpen }) => {
  Apps.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [appDropDown, setAppDropDown] = useState(null);

  const { token } = useSelector((state) => state.root.auth);
  const {
    loading,
    allApps: { allApps },
  } = useSelector((state) => state.root.apps);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleGetAllApps({ token }));
  }, []);

  const handleAppDropDownClick = (id) => {
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-24 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:flex sm:justify-between xs:block items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Apps
            </h1>
            {/* <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
              <MdOutlineWidgets className="text-2xl mr-2 text-white" />
              New Instance
            </button> */}
          </div>
          <div className="mt-5 mb-5">
            <div className="grid grid-cols-10 gap-4">
              {loading ? (
                <div className="text-center col-span-full font-semibold text-xl">
                  Loading...
                </div>
              ) : allApps.length === 0 ? (
                <div className="w-full text-center font-semibold text-xl col-span-full">
                  No Apps here.
                </div>
              ) : (
                allApps.map(
                  (app) =>
                    app.appType == "Apps" && (
                      <div
                        className="lg:col-span-2 md:col-span-5 sm:col-span-10 xs:col-span-10 "
                        key={app.app_Id}
                      >
                        <div className="shadow-md bg-white rounded-lg p-3">
                          {/* <div className="relative">
                          <button className="float-right">
                            <BiDotsHorizontalRounded
                              className="text-2xl"
                              onClick={() => handleAppDropDownClick(app.app_Id)}
                            />
                          </button>
                          {appDropDown === app.app_Id && (
                            <div className="appdw">
                              <ul>
                                <li className="flex text-sm items-center">
                                  <FiUpload className="mr-2 text-lg" />
                                  Set to Screen
                                </li>
                                <li className="flex text-sm items-center">
                                  <MdPlaylistPlay className="mr-2 text-lg" />
                                  Add to Playlist
                                </li>
                                <li className="flex text-sm items-center">
                                  <TbBoxMultiple className="mr-2 text-lg" />
                                  Duplicate
                                </li>
                                <li className="flex text-sm items-center">
                                  <RiDeleteBin5Line className="mr-2 text-lg" />
                                  Delete App
                                </li>
                              </ul>
                            </div>
                          )}
                        </div> */}
                          <Link to={`/${app.appName}`}>
                            <div className="text-center clear-both">
                              <img
                                src={app.appPath}
                                alt="Logo"
                                className="cursor-pointer mx-auto h-20 w-20"
                              />
                              <h4 className="text-lg font-medium mt-3">
                                {app.appName}
                              </h4>
                              <h4 className="text-sm font-normal ">
                                {app.appUse}
                              </h4>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )
                )
              )}
            </div>
          </div>
          {/* <div className="mt-5 mb-5">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] mb-4 ">
              Featured Apps
            </h1>
            <div className="grid grid-cols-12 gap-4">
              {appData.map(
                (featuardApp) =>
                  featuardApp.appType == "Featured Apps" && (
                    <div
                      className="lg:col-span-4 md:col-span-6 sm:col-span-12 "
                      key={featuardApp.app_Id}
                    >
                      <div className="shadow-md  bg-white rounded-lg p-5">
                        <div className="lg:flex md:flex sm:flex xs:block ">
                          <img
                            src={featuardApp.appPath}
                            alt="Logo"
                            className="cursor-pointer h-20 w-20"
                          />
                          <div className="lg:ml-5 sm:ml-5 xs:mt-6 sm:mt-0">
                            <h4 className="text-lg font-medium mt-3">
                              {featuardApp.appName}
                            </h4>
                            <h4 className="text-sm font-normal ">
                              {featuardApp.appUse}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
          <div className="mt-5 mb-5">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] mb-4 ">
              Most Popular Apps
            </h1>
            <div className="grid grid-cols-12 gap-4">
              {appData.map(
                (most_popular_app) =>
                  most_popular_app.appType == "Most Popular Apps" && (
                    <div
                      className="lg:col-span-4 md:col-span-6 sm:col-span-12 "
                      key={most_popular_app.app_Id}
                    >
                      <div className="shadow-md  bg-white rounded-lg p-5">
                        <div className="lg:flex md:flex sm:flex xs:block ">
                          <img
                            src={most_popular_app.appPath}
                            alt="Logo"
                            className="cursor-pointer h-20 w-20"
                          />
                          <div className="lg:ml-5 sm:ml-5 xs:mt-6 sm:mt-0">
                            <h4 className="text-lg font-medium mt-3">
                              {most_popular_app.appName}
                            </h4>
                            <h4 className="text-sm font-normal ">
                              {most_popular_app.appUse}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Apps;
