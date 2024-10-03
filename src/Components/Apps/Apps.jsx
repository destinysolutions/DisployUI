import PropTypes from "prop-types";
import { Suspense, lazy, useEffect, useState } from "react";
import "../../Styles/apps.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllApps } from "../../Redux/AppsSlice";


import Footer from "../Footer";
import Loading from "../Loading";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PurchasePlanWarning from "../Common/PurchasePlan/PurchasePlanWarning";

// const Footer = lazy(() => import('../Footer'));
// const Loading = lazy(() => import('../Loading'));
// const Navbar = lazy(() => import('../Navbar'));
// const Sidebar = lazy(() => import('../Sidebar'));
// const PurchasePlanWarning = lazy(() => import('../Common/PurchasePlan/PurchasePlanWarning'));

const Apps = ({ sidebarOpen, setSidebarOpen }) => {
  Apps.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [appDropDown, setAppDropDown] = useState(null);
  const [sidebarload, setSidebarLoad] = useState(true)
  const {user,userDetails, token } = useSelector((state) => state.root.auth);
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
            <div className={userDetails?.isTrial && user?.userDetails?.isRetailer === false && !userDetails?.isActivePlan ?"lg:pt-32 md:pt-32 sm:pt-20 xs:pt-20 px-5 page-contain" : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"}>
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                <div className="lg:flex lg:justify-between sm:flex sm:justify-between xs:block items-center">
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                    Apps
                  </h1>
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
              </div>
            </div>
            <Footer />
          </>
        </Suspense>
      )}

      {(userDetails?.isTrial=== false) && (userDetails?.isActivePlan=== false) && (user?.userDetails?.isRetailer === false) && (
        <PurchasePlanWarning />
      )}
    </>
  );
};

export default Apps;
