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
              <div className="flex text-center m-5 justify-center">
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
