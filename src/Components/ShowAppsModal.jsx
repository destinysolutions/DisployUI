import React, { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { handleGetAllApps } from "../Redux/AppsSlice";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { handleChangeNavigateFromComposition } from "../Redux/globalStates";

const ShowAppsModal = ({ setShowAppModal }) => {
  const { token } = useSelector((s) => s.root.auth);
  const { allApps } = useSelector((s) => s.root.apps);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(handleGetAllApps({ token }));
  }, []);

  function linkForApps(appName) {
    dispatch(handleChangeNavigateFromComposition(true));
    setTimeout(() => {
      let url = "";
  
      switch (appName) {
        case "Youtube":
          url = "/youtubedetail";
          break;
        case "Weather":
          url = "/weatherdetail";
          break;
        case "text-scroll":
          url = "/textscrolldetail";
          break;
        default:
          return;
      }
  
      window.open(url, "_blank");
      localStorage.setItem('isWindowClosed', 'false');
      setShowAppModal(false);
    }, 500);
  }  

  return (
    <>
      <div
        className="bg-black/30 inset-0 fixed w-screen h-screen z-30"
        onClick={() => setShowAppModal(false)}
      />
      <div className="w-[80vw] h-[70vh] overflow-y-auto bg-white fixed top-1/2 z-[9999] left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg">
        <div
          className="flex items-start justify-between p-4 px-6 border-b-2 border-slate-200 rounded-t text-black"
        >
          <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
            Apps 
          </h3>
          <button
            className="p-1 text-xl"
            onClick={() => {
              setShowAppModal(false);
            }}
          >
            <AiOutlineCloseCircle className="text-2xl" />
          </button>
        </div>

        <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 p-5 items-center gap-5 place-items-center overflow-y-auto">
          {allApps?.loading ? (
            <div className="text-center col-span-full font-semibold text-xl">
              Loading...
            </div>
          ) : allApps?.data.length === 0 && !allApps?.loading ? (
            <div className="w-full text-center font-semibold text-xl col-span-full">
              No Apps here.
            </div>
          ) : (
            allApps?.data.map(
              (app) =>
                app.appType == "Apps" && app.appName !== "Weather" && (
                  <div className="w-full" key={app.app_Id}>
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
                      {/* <Link to={`/${app.appName}`}> */}
                      <div
                        onClick={() => linkForApps(app?.appName)}
                        className="text-center clear-both"
                      >
                        <img
                          src={app.appPath}
                          alt="Logo"
                          className="cursor-pointer mx-auto h-20 w-20"
                        />
                        <h4 className="text-lg font-medium mt-3">
                          {app.appName}
                        </h4>
                        <h4 className="text-sm font-normal ">{app.appUse}</h4>
                      </div>
                      {/* </Link> */}
                    </div>
                  </div>
                )
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ShowAppsModal;
