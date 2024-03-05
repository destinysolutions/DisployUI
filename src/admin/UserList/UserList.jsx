import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getOnBodingData } from "../../Redux/admin/OnBodingSlice";
import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";
import { MdOutlineScreenshotMonitor } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import { BiSolidPlaylist } from "react-icons/bi";
import { GrScheduleNew } from "react-icons/gr";
import { TbAppsFilled } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import UserScreen from "./UserScreen";
import UserAssets from "./UserAssets";
import UserComposition from "./UserComposition";
import UserApp from "./UserApp";
import UserSchedule from "./UserSchedule";
import UserTrash from "./UserTrash";
import { handleGetScreen } from "../../Redux/Screenslice";
import {
  ADMINUSERTOKEN,
  GET_ALL_TRASHDATA,
  GET_ASSET_DETAILS,
} from "../../Pages/Api";
import { handleGetAllAssetsTypeBase } from "../../Redux/Assetslice";
import { handleGetCompositions } from "../../Redux/CompositionSlice";
import { handleGetAllSchedule } from "../../Redux/ScheduleSlice";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../Redux/AppsSlice";
import { handleGetTrash } from "../../Redux/Trash";
import axios from "axios";
const UserList = ({ sidebarOpen, setSidebarOpen }) => {
  const store = useSelector((state) => state.root.onBoding);
  const { loading, screens } = useSelector((s) => s.root.screen);
  const Asseststore = useSelector((state) => state.root.asset);
  const { compositions } = useSelector((state) => state.root.composition);
  const storeSchedule = useSelector((s) => s.root.schedule);
  const { youtube, textScroll } = useSelector((s) => s.root.apps);
  const TrashData = useSelector((state) => state.root.trashData);
  const [compositionLoading, setCompositionLoading] = useState(false);
  const dispatch = useDispatch();
  const [loadFist, setLoadFist] = useState(true);
  const [selectUser, setSelectUser] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const allAppsData = [...youtube?.youtubeData, ...textScroll?.textScrollData];
  const [token, setToken] = useState("");
  const [userloading, setUserLoading] = useState(false);
  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  useEffect(() => {
    if (loadFist) {
      dispatch(getOnBodingData());
      setLoadFist(false);
    }
  }, [loadFist, store]);
  useEffect(() => {
    if (selectUser !== "") {
      let data = JSON.stringify({
        id: 0,
        emailID: selectUser,
        password: "string",
        googleID: "string",
        systemTimeZone: new Date()
          .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
          })
          .substring(4),
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: ADMINUSERTOKEN,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          setToken(response?.data?.data?.token); // Set token into state
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectUser]);

  useEffect(() => {
    if (token !== "") {
      setUserLoading(true);
      const authToken = `Bearer ${token}`;
      const query = `ScreenType=ALL&searchAsset=`;
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_ASSET_DETAILS}?${query}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        data: query,
      };
      setCompositionLoading(true);
      dispatch(handleGetScreen({ token }));
      dispatch(handleGetAllAssetsTypeBase({ config }));
      dispatch(handleGetCompositions({ token }));
      dispatch(handleGetAllSchedule({ token }));
      // get youtube data
      dispatch(handleGetYoutubeData({ token }));
      //get text scroll data
      dispatch(handleGetTextScrollData({ token }));
      setCompositionLoading(false);
      setUserLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token !== null) {
      const authToken = `Bearer ${token}`;
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: GET_ALL_TRASHDATA,
        headers: { Authorization: authToken },
      };
      dispatch(handleGetTrash({ config }));
    }
  }, [token]);

  return (
    <>
      <div>
        <div className="flex border-b border-gray">
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <AdminNavbar />
        </div>
        <div className="pt-6 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="grid lg:grid-cols-3 gap-2">
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 lg:w-60">
                <div className="relative">
                  <select
                    className="formInput"
                    style={{ padding: "8px" }}
                    value={selectUser}
                    onChange={(e) => setSelectUser(e.target.value)}
                  >
                    <option label="Select Client"></option>
                    {store?.data?.map((item, index) => (
                      <option key={index} value={item.email}>
                        {item.firstName + " " + item.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mt-4">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li className="me-2">
                  <div
                    className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${
                      activeTab === 0
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(0)}
                  >
                    <div
                      className={`w-6 h-6 me-2 ${
                        activeTab === 0
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      <MdOutlineScreenshotMonitor
                        className={`w-6 h-6 me-2 ${
                          activeTab === 0
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span>Screens</span>
                  </div>
                </li>
                <li className="me-2">
                  <div
                    className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${
                      activeTab === 1
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(1)}
                  >
                    <div
                      className={`w-6 h-6 me-2 ${
                        activeTab === 1
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      <BsImages
                        className={`w-6 h-6 me-2 ${
                          activeTab === 1
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span>Assets</span>
                  </div>
                </li>
                <li className="me-2">
                  <div
                    className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${
                      activeTab === 2
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(2)}
                  >
                    <div
                      className={`w-6 h-6 me-2 ${
                        activeTab === 2
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      <BiSolidPlaylist
                        className={`w-6 h-6 me-2 ${
                          activeTab === 2
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span>Compositions</span>
                  </div>
                </li>
                <li className="me-2">
                  <div
                    className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${
                      activeTab === 3
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(3)}
                  >
                    <div
                      className={`w-6 h-6 me-2 ${
                        activeTab === 3
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      <GrScheduleNew
                        className={`w-6 h-6 me-2 ${
                          activeTab === 3
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span>Schedules</span>
                  </div>
                </li>
                <li className="me-2">
                  <div
                    className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${
                      activeTab === 4
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(4)}
                  >
                    <div
                      className={`w-6 h-6 me-2 ${
                        activeTab === 4
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      <TbAppsFilled
                        className={`w-6 h-6 me-2 ${
                          activeTab === 4
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span>Apps</span>
                  </div>
                </li>
                <li className="me-2">
                  <div
                    className={`inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg ${
                      activeTab === 5
                        ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                        : "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                    }`}
                    onClick={() => handleTabClick(5)}
                  >
                    <div
                      className={`w-6 h-6 me-2 ${
                        activeTab === 5
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      <RiDeleteBin6Line
                        className={`w-6 h-6 me-2 ${
                          activeTab === 5
                            ? "text-blue-600 dark:text-blue-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    </div>
                    <span>Trash</span>
                  </div>
                </li>
              </ul>
            </div>
            {activeTab === 0 && (
              <UserScreen
                selectUser={selectUser}
                screens={screens}
                loading={loading}
                sidebarOpen={sidebarOpen}
              />
            )}
            {activeTab === 1 && (
              <UserAssets selectUser={selectUser} Asseststore={Asseststore} sidebarOpen={sidebarOpen}/>
            )}
            {activeTab === 2 && (
              <UserComposition
                selectUser={selectUser}
                compositions={compositions}
                loading={compositionLoading}
                sidebarOpen={sidebarOpen}
              />
            )}
            {activeTab === 3 && (
              <UserSchedule
                selectUser={selectUser}
                schedules={storeSchedule?.schedules}
                loading={storeSchedule?.loading}
                sidebarOpen={sidebarOpen}
              />
            )}
            {activeTab === 4 && (
              <UserApp
                selectUser={selectUser}
                allAppsData={allAppsData}
                userloading={userloading}
                sidebarOpen={sidebarOpen}
              />
            )}
            {activeTab === 5 && (
              <UserTrash selectUser={selectUser} TrashData={TrashData} sidebarOpen={sidebarOpen}/>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
