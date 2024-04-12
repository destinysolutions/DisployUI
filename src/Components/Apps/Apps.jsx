import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbBoxMultiple } from "react-icons/tb";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Suspense, useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { MdOutlineWidgets } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../../Styles/apps.css";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllApps } from "../../Redux/AppsSlice";
import Loading from "../Loading";

const Apps = ({ sidebarOpen, setSidebarOpen }) => {
  Apps.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [appDropDown, setAppDropDown] = useState(null);
  const [sidebarload, setSidebarLoad] = useState(true)
  const { token } = useSelector((state) => state.root.auth);
  const [allApps, setAllApps] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleGetAllApps({ token })).then((res) => {
      setAllApps(res?.payload?.data);
      setSidebarLoad(false)
    }).catch((error) => {
      console.log('error', error)
      setSidebarLoad(false)

    })
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
      {sidebarload && (
        <Loading />
      )}
      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
            <div className="flex border-b border-gray">
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <Navbar />
            </div>
            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
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
                    {sidebarload ? (
                      <div className="text-center col-span-full font-semibold text-xl">
                        <>
                          <div>
                            <svg
                              aria-hidden="true"
                              role="status"
                              className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#1C64F2"
                              />
                            </svg>
                          
                          </div>
                        </>
                      </div>
                    ) : allApps?.length === 0 && !sidebarload ? (
                      <div className="w-full text-center font-semibold text-xl col-span-full">
                        No Apps here.
                      </div>
                    ) : (
                      allApps?.map(
                        (app) =>
                          app.appType === "Apps" && (
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
                                <Link to={`/${app.appURL}`}>
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
        </Suspense>
      )}
    </>
  );
};

export default Apps;
