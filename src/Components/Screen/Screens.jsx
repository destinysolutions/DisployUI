import { useEffect, useState } from "react";
import "../../Styles/screen.css";
import {
  AiOutlineAppstoreAdd,
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineSave,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  MdLiveTv,
  MdOutlineCalendarMonth,
  MdOutlineModeEdit,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MdOutlineAddToQueue } from "react-icons/md";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { VscCalendar, VscVmActive } from "react-icons/vsc";
import { VscVmConnect } from "react-icons/vsc";
import PropTypes from "prop-types";
import ScreenOTPModal from "./ScreenOTPModal";
import AssetModal from "../Assests/AssetModal";
import { SlScreenDesktop } from "react-icons/sl";
import {
  RiArrowDownSLine,
  RiComputerLine,
  RiDeleteBin5Line,
  RiPlayListFill,
} from "react-icons/ri";
import { HiDotsVertical, HiOutlineLocationMarker } from "react-icons/hi";
import { BsCollectionPlay, BsPencilSquare, BsTags } from "react-icons/bs";
import Footer from "../Footer";
import { BiAnchor, BiFilterAlt } from "react-icons/bi";
import { RxTimer } from "react-icons/rx";
import { Tooltip } from "@material-tailwind/react";

import {
  DELETE_SCREEN_BY_USERID,
  GET_ALL_FILES,
  GET_ALL_SCHEDULE,
  SCREEN_GROUP,
  SELECT_BY_USER_SCREENDETAIL,
  UPDATE_NEW_SCREEN,
} from "../../Pages/Api";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { IoBarChartSharp } from "react-icons/io5";
import { TbCalendarStats, TbCalendarTime } from "react-icons/tb";

const Screens = ({ sidebarOpen, setSidebarOpen }) => {
  Screens.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [moreModal, setMoreModal] = useState(false);
  const [locCheckboxClick, setLocCheckboxClick] = useState(true);
  const [screenCheckboxClick, setScreenCheckboxClick] = useState(true);
  const [statusCheckboxClick, setStatusCheckboxClick] = useState(true);
  const [lastSeenCheckboxClick, setLastSeenCheckboxClick] = useState(true);
  const [nowPlayingCheckboxClick, setNowPlayingCheckboxClick] = useState(true);
  const [currScheduleCheckboxClick, setCurrScheduleCheckboxClick] =
    useState(true);
  const [tagsCheckboxClick, setTagsCheckboxClick] = useState(true);

  const [locContentVisible, setLocContentVisible] = useState(true);
  const [screenContentVisible, setScreenContentVisible] = useState(true);
  const [statusContentVisible, setStatusContentVisible] = useState(true);
  const [lastSeenContentVisible, setLastSeenContentVisible] = useState(true);
  const [nowPlayingContentVisible, setNowPlayingContentVisible] =
    useState(true);
  const [currScheduleContentVisible, setCurrScheduleContentVisible] =
    useState(true);
  const [tagsContentVisible, setTagsContentVisible] = useState(true);
  const [showActionBox, setShowActionBox] = useState(false);
  const [isEditingScreen, setIsEditingScreen] = useState(false);

  useEffect(() => {
    setLocContentVisible(locCheckboxClick);
    setScreenContentVisible(screenCheckboxClick);
    setStatusContentVisible(statusCheckboxClick);
    setLastSeenContentVisible(lastSeenCheckboxClick);
    setNowPlayingContentVisible(nowPlayingCheckboxClick);
    setCurrScheduleContentVisible(currScheduleCheckboxClick);
    setTagsContentVisible(tagsCheckboxClick);
  }, [
    locCheckboxClick,
    screenCheckboxClick,
    statusCheckboxClick,
    lastSeenCheckboxClick,
    nowPlayingCheckboxClick,
    currScheduleCheckboxClick,
    tagsCheckboxClick,
  ]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});

  const [screenData, setScreenData] = useState([]);

  const [editedScreenName, setEditedScreenName] = useState("");

  const [editingScreenID, setEditingScreenID] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState({
    scheduleName: "",
  });
  const UserData = useSelector((Alldata) => Alldata.user);
  const [groupName, setGroupName] = useState("");
  useEffect(() => {
    if (UserData.user?.userID) {
      axios
        .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${UserData.user?.userID}`)
        .then((response) => {
          const fetchedData = response.data.data;
          console.log(fetchedData, "dsdsdsdsds");
          setScreenData(fetchedData);
          const initialCheckboxes = {};
          if (Array.isArray(fetchedData)) {
            fetchedData.forEach((screen) => {
              initialCheckboxes[screen.screenID] = false;
            });
            setScreenCheckboxes(initialCheckboxes);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [UserData.user?.userID]);
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [assetData, setAssetData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({ name: "" });
  const [assetPreview, setAssetPreview] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  console.log(selectedAsset.name);
  useEffect(() => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(allAssets);
        console.log(allAssets, "allAssets");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(GET_ALL_SCHEDULE)
      .then((response) => {
        const fetchedData = response.data;

        setScheduleData(response.data.data);
        console.log(fetchedData, "allAssets");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const [searchAsset, setSearchAsset] = useState("");
  const handleFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setAssetData(assetData);
    } else {
      const filteredData = assetData.filter((item) => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        return itemName.includes(searchQuery);
      });
      setAssetData(filteredData);
    }
  };

  const handleScreenClick = (screenId) => {
    // Toggle the action menu for the clicked schedule item
    setShowActionBox((prevState) => ({
      ...prevState,
      [screenId]: !prevState[screenId] || false,
    }));
  };
  const handleScreenNameClick = (screenId) => {
    setEditingScreenID(screenId);
  };

  const handleScreenCheckboxChange = (screenID) => {
    const updatedCheckboxes = { ...screenCheckboxes };
    updatedCheckboxes[screenID] = !updatedCheckboxes[screenID];
    setScreenCheckboxes(updatedCheckboxes);

    // Check if any individual screen checkbox is unchecked
    const allChecked = Object.values(updatedCheckboxes).every(
      (isChecked) => isChecked
    );

    setSelectAllChecked(allChecked);
  };

  const handleSelectAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);

    // Set the state of all individual screen checkboxes
    const updatedCheckboxes = {};
    for (const screenID in screenCheckboxes) {
      updatedCheckboxes[screenID] = checked;
    }
    setScreenCheckboxes(updatedCheckboxes);
  };

  const handleDeleteAllScreen = () => {
    let data = JSON.stringify({
      userID: UserData.user?.userID,
      operation: "DeleteUserIdScreenOtp",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: DELETE_SCREEN_BY_USERID,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        setScreenData([]);
        setSelectAllChecked(false);
        setScreenCheckboxes({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelDeleteScreen = (screenId) => {
    let data = JSON.stringify({
      screenID: screenId,
      operation: "DeleteScreenOtp",
    });

    let config = {
      method: "post",
      url: UPDATE_NEW_SCREEN,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const updatedScreenData = screenData.filter(
          (screenData) => screenData.screenID !== screenId
        );
        setScreenData(updatedScreenData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleScheduleAdd = (schedule) => {
    setSelectedSchedule(schedule);
  };
  const handleScreenNameUpdate = (screenId) => {
    const screenToUpdate = screenData.find(
      (screen) => screen.screenID === screenId
    );

    if (screenToUpdate) {
      const {
        otp,
        googleLocation,
        timeZone,
        screenOrientation,
        screenResolution,
        macid,
        ipAddress,
        postalCode,
        latitude,
        longitude,
        userID,
        screenType,
        tags,
        moduleID,
        tvTimeZone,
        tvScreenOrientation,
        tvScreenResolution,
      } = screenToUpdate;

      let data = JSON.stringify({
        screenID: screenId,
        otp,
        googleLocation,
        timeZone,
        screenOrientation,
        screenResolution,
        macid,
        ipAddress,
        postalCode,
        latitude,
        longitude,
        userID,
        screenType,
        tags,
        moduleID,
        tvTimeZone,
        tvScreenOrientation,
        tvScreenResolution,
        screenName: editedScreenName,
        operation: "Update",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: UPDATE_NEW_SCREEN,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          const updatedScreenData = screenData.map((screen) => {
            if (screen.screenID === screenId) {
              return {
                ...screen,
                screenName: editedScreenName,
              };
            }
            return screen;
          });

          setScreenData(updatedScreenData);
          setIsEditingScreen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.error("Screen not found for update");
    }
  };
  const handleAssetUpdate = (screenId) => {
    let moduleID = selectedAsset.id;

    let data = JSON.stringify({
      // screenID: screenId,
      // otp,
      // googleLocation,
      // timeZone,
      // screenOrientation,
      // screenResolution,
      // macid,
      // ipAddress,
      // postalCode,
      // latitude,
      // longitude,
      // userID,
      // screenType: 1,
      // tags,
      // moduleID: moduleID,
      // tvTimeZone,
      // tvScreenOrientation,
      // tvScreenResolution,
      // screenName,
      // operation: "Update",

      screenType: 1,
      screenID: screenId,
      moduleID: moduleID,
      userID: UserData.user?.userID,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: UPDATE_NEW_SCREEN,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        const updatedScreenData = screenData.map((screen) => {
          if (screen.screenID === screenId) {
            return {
              ...screen,
              name: selectedAsset.name,
            };
          }
          return screen;
        });

        setScreenData(updatedScreenData);
        setIsEditingScreen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleScheduleUpdate = (screenId) => {
    const screenToUpdate = screenData.find(
      (screen) => screen.screenID === screenId
    );
    let moduleID = selectedSchedule.scheduleId;
    if (screenToUpdate) {
      const {
        otp,
        googleLocation,
        timeZone,
        screenOrientation,
        screenResolution,
        macid,
        ipAddress,
        postalCode,
        latitude,
        longitude,
        userID,
        tags,
        tvTimeZone,
        tvScreenOrientation,
        tvScreenResolution,
        screenName,
      } = screenToUpdate;

      let data = JSON.stringify({
        screenID: screenId,
        otp,
        googleLocation,
        timeZone,
        screenOrientation,
        screenResolution,
        macid,
        ipAddress,
        postalCode,
        latitude,
        longitude,
        userID,
        screenType: 2,
        tags,
        moduleID: moduleID,
        tvTimeZone,
        tvScreenOrientation,
        tvScreenResolution,
        screenName,
        operation: "Update",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: UPDATE_NEW_SCREEN,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          const updatedScreenData = screenData.map((screen) => {
            if (screen.screenID === screenId) {
              return {
                ...screen,
                name: selectedSchedule.name,
              };
            }
            return screen;
          });

          setScreenData(updatedScreenData);
          setIsEditingScreen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.error("Screen not found for update");
    }
  };
  const [showNewScreenGroupPopup, setShowNewScreenGroupPopup] = useState(false);
  const [selectedCheckboxIDs, setSelectedCheckboxIDs] = useState([]);

  const handleNewScreenGroupClick = () => {
    const checkedIDs = Object.keys(screenCheckboxes).filter(
      (screenID) => screenCheckboxes[screenID]
    );
    setSelectedCheckboxIDs(checkedIDs);

    setShowNewScreenGroupPopup(!showNewScreenGroupPopup);
  };

  const selectedScreenIdsString = Array.isArray(selectedCheckboxIDs)
    ? selectedCheckboxIDs.join(",")
    : "";
  console.log(selectedCheckboxIDs, "selectedCheckboxIDs");

  const handleScreenGroup = () => {
    let data = JSON.stringify({
      GroupName: groupName,
      ScreenIds: selectedScreenIdsString,
      operation: "Insert",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: SCREEN_GROUP,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="justify-between flex items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              Screens
            </h1>

            <div className="flex items-center sm:mt-3 flex-wrap">
              <Tooltip
                content="Connect Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                >
                  <VscVmConnect className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>
              <Tooltip
                content="New Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                  onClick={() => setShowOTPModal(true)}
                >
                  <MdOutlineAddToQueue className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>
              {showOTPModal ? (
                <>
                  <ScreenOTPModal setShowOTPModal={setShowOTPModal} />
                </>
              ) : null}
              <Tooltip
                content="New Screen Group"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                  onClick={handleNewScreenGroupClick}
                >
                  <HiOutlineRectangleGroup className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>
              {showNewScreenGroupPopup && (
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                  <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                      <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                        <button
                          className="p-1 text-xl"
                          onClick={() => setShowNewScreenGroupPopup(false)}
                        >
                          <AiOutlineCloseCircle className="text-2xl" />
                        </button>
                      </div>
                      <div className="p-3">
                        <label>Enter Group Name : </label>
                        <input
                          type="text"
                          onChange={(e) => {
                            setGroupName(e.target.value);
                          }}
                          className="border border-primary m-5"
                        />
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="mb-4 border border-primary py-2 px-3"
                          onClick={handleScreenGroup}
                        >
                          create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Tooltip
                content="Deactivate/Activate"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                >
                  <VscVmActive className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>
              <Tooltip
                content="Delete"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                  onClick={handleDeleteAllScreen}
                  style={{ display: selectAllChecked ? "block" : "none" }}
                >
                  <RiDeleteBin5Line className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>
              <div className="relative mt-1">
                <Tooltip
                  content="More"
                  placement="bottom-end"
                  className=" bg-SlateBlue text-white z-10 ml-5"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 1, y: 10 },
                  }}
                >
                  <button
                    type="button"
                    className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                    onClick={() => setMoreModal(!moreModal)}
                  >
                    <RiArrowDownSLine className="p-1 px-2 text-4xl text-white hover:text-white" />
                  </button>
                </Tooltip>
                {moreModal && (
                  <div className="moredw">
                    <ul>
                      <li className="flex text-sm items-center ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={screenCheckboxClick}
                          onChange={() =>
                            setScreenCheckboxClick(!screenCheckboxClick)
                          }
                        />
                        Screen
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={statusCheckboxClick}
                          onChange={() =>
                            setStatusCheckboxClick(!statusCheckboxClick)
                          }
                        />
                        Status
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={lastSeenCheckboxClick}
                          onChange={() =>
                            setLastSeenCheckboxClick(!lastSeenCheckboxClick)
                          }
                        />
                        Last Seen
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={nowPlayingCheckboxClick}
                          onChange={() =>
                            setNowPlayingCheckboxClick(!nowPlayingCheckboxClick)
                          }
                        />
                        Now Playing
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={currScheduleCheckboxClick}
                          onChange={() =>
                            setCurrScheduleCheckboxClick(
                              !currScheduleCheckboxClick
                            )
                          }
                        />
                        Current Schedule
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={locCheckboxClick}
                          onChange={() =>
                            setLocCheckboxClick(!locCheckboxClick)
                          }
                        />
                        Google Location
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={tagsCheckboxClick}
                          onChange={() =>
                            setTagsCheckboxClick(!tagsCheckboxClick)
                          }
                        />
                        Tags
                      </li>
                      <li className="flex text-sm justify-end mt-2 ">
                        <button
                          className="bg-lightgray text-primary px-4 py-2 rounded-full"
                          onClick={() => setMoreModal(false)}
                        >
                          Update
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <Tooltip
                content="Select All Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button type="button">
                  <input
                    type="checkbox"
                    className="h-7 w-7"
                    onChange={handleSelectAllCheckboxChange}
                    checked={selectAllChecked}
                  />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className=" bg-white rounded-xl mt-8 shadow screen-section">
            <table
              className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto screen-table"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                  {screenContentVisible && (
                    <th className=" text-[#444] text-sm font-semibold p-2">
                      <div className="flex  items-center ">
                        <SlScreenDesktop className="mr-2 text-xl" />
                        Screen
                      </div>
                    </th>
                  )}
                  {locContentVisible && (
                    <th className=" text-[#444] text-sm font-semibold p-2">
                      <div className="flex  items-center justify-center ">
                        <HiOutlineLocationMarker className="mr-2 text-xl" />
                        Google Location
                      </div>
                    </th>
                  )}
                  {statusContentVisible && (
                    <th className=" text-[#444] text-sm font-semibold p-2">
                      <div className="flex  items-center justify-center  mx-auto ">
                        <MdLiveTv className="mr-2 text-xl" />
                        status
                        <BiFilterAlt className="ml-1 text-lg" />
                      </div>
                    </th>
                  )}
                  {lastSeenContentVisible && (
                    <th className=" text-[#444] text-sm font-semibold p-2">
                      <div className="flex  items-center justify-center   mx-auto">
                        <RxTimer className="mr-2 text-xl" />
                        Last Seen
                        <BiFilterAlt className="ml-1 text-lg" />
                      </div>
                    </th>
                  )}
                  {nowPlayingContentVisible && (
                    <th className=" text-[#444] text-sm font-semibold p-2">
                      <div className="flex  items-center justify-center  mx-auto">
                        <BsCollectionPlay className="mr-2 text-xl" />
                        Now Playing
                      </div>
                    </th>
                  )}
                  {currScheduleContentVisible && (
                    <th className=" text-[#444] text-sm font-semibold p-2">
                      <div className=" flex  items-center mx-auto justify-center">
                        <MdOutlineCalendarMonth className="mr-2 text-xl" />
                        Current Schedule
                      </div>
                    </th>
                  )}
                  {tagsContentVisible && (
                    <th className="text-[#444] text-sm font-semibold p-2">
                      <div className=" flex mx-auto items-center justify-center">
                        <BsPencilSquare className="mr-2 text-xl" />
                        Tags
                        <BiFilterAlt className="ml-1 text-lg" />
                      </div>
                    </th>
                  )}
                  <th className="w-4"></th>
                </tr>
              </thead>
              {Array.isArray(screenData) &&
                screenData.map((screen) => (
                  <tbody key={screen.screenID}>
                    <tr className="border-b border-b-[#E4E6FF]">
                      {screenContentVisible && (
                        <td className="flex items-center ">
                          <input
                            type="checkbox"
                            className="mr-3"
                            onChange={() =>
                              handleScreenCheckboxChange(screen.screenID)
                            }
                            checked={screenCheckboxes[screen.screenID]}
                          />

                          {isEditingScreen &&
                          editingScreenID === screen.screenID ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                className="border border-primary rounded-md w-full"
                                value={editedScreenName}
                                onChange={(e) =>
                                  setEditedScreenName(e.target.value)
                                }
                              />
                              <button
                                onClick={() => {
                                  handleScreenNameUpdate(screen.screenID);
                                  setEditingScreenID(null);
                                }}
                              >
                                <AiOutlineSave className="text-2xl ml-1 hover:text-primary" />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <Link
                                to={`/screensplayer?screenID=${screen.screenID}`}
                              >
                                {screen.screenName}
                              </Link>
                              <button
                                onClick={() => {
                                  setIsEditingScreen(true);
                                  handleScreenNameClick(screen.screenID);
                                }}
                              >
                                <MdOutlineModeEdit className="text-sm ml-2 hover:text-primary" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                      {locContentVisible && (
                        <td className="p-2 break-words w-[150px] text-center">
                          {screen.googleLocation}
                        </td>
                      )}
                      {statusContentVisible && (
                        <td className="p-2 text-center">
                          <button className="rounded-full px-6 py-1 text-white text-center bg-[#3AB700]">
                            Live
                          </button>
                        </td>
                      )}
                      {lastSeenContentVisible && (
                        <td className="p-2 text-center">25 May 2023</td>
                      )}
                      {nowPlayingContentVisible && (
                        <td className="p-2 text-center">
                          <button
                            onClick={(e) => {
                              setShowAssetModal(true);
                              setSelectedAsset({
                                ...selectedAsset,
                                name: e.target.value,
                              });
                            }}
                            className="flex  items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2  lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                          >
                            {screen.screenType == 1 ? `${screen.name} ` : ""}
                            <AiOutlineCloudUpload className=" text-lg" />
                          </button>
                          {showAssetModal && (
                            <>
                              <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                                <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                                    <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                                      <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                        Set Content to Add Media
                                      </h3>
                                      <button
                                        className="p-1 text-xl"
                                        onClick={() => setShowAssetModal(false)}
                                      >
                                        <AiOutlineCloseCircle className="text-2xl" />
                                      </button>
                                    </div>

                                    <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto">
                                      <div className="bg-white rounded-[30px]">
                                        <div>
                                          <div className="lg:flex lg:flex-wrap lg:items-center md:flex md:flex-wrap md:items-center sm:block xs:block">
                                            <div>
                                              <nav
                                                className="flex flex-col space-y-2 "
                                                aria-label="Tabs"
                                                role="tablist"
                                                data-hs-tabs-vertical="true"
                                              >
                                                <button
                                                  type="button"
                                                  className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                    popupActiveTab === 1
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  // onClick={() => handleTabClick(1)}
                                                >
                                                  <span
                                                    className={`p-1 rounded ${
                                                      popupActiveTab === 1
                                                        ? "bg-primary text-white"
                                                        : "bg-lightgray"
                                                    } `}
                                                  >
                                                    <IoBarChartSharp
                                                      size={15}
                                                    />
                                                  </span>
                                                  Assets
                                                </button>
                                                <button
                                                  type="button"
                                                  className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                    popupActiveTab === 2
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  //onClick={() => handleTabClick(2)}
                                                >
                                                  <span
                                                    className={`p-1 rounded ${
                                                      popupActiveTab === 2
                                                        ? "bg-primary text-white"
                                                        : "bg-lightgray"
                                                    } `}
                                                  >
                                                    <RiPlayListFill size={15} />
                                                  </span>
                                                  Playlist
                                                </button>
                                                <button
                                                  type="button"
                                                  className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                    popupActiveTab === 3
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  // onClick={() => handleTabClick(3)}
                                                >
                                                  <span
                                                    className={`p-1 rounded ${
                                                      popupActiveTab === 3
                                                        ? "bg-primary text-white"
                                                        : "bg-lightgray"
                                                    } `}
                                                  >
                                                    <BiAnchor size={15} />
                                                  </span>
                                                  Disploy Studio
                                                </button>
                                                <button
                                                  type="button"
                                                  className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                    popupActiveTab === 4
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  // onClick={() => handleTabClick(4)}
                                                >
                                                  <span
                                                    className={`p-1 rounded ${
                                                      popupActiveTab === 4
                                                        ? "bg-primary text-white"
                                                        : "bg-lightgray"
                                                    } `}
                                                  >
                                                    <AiOutlineAppstoreAdd
                                                      size={15}
                                                    />
                                                  </span>
                                                  Apps
                                                </button>
                                              </nav>
                                            </div>

                                            <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                                              <div
                                                className={
                                                  popupActiveTab === 1
                                                    ? ""
                                                    : "hidden"
                                                }
                                              >
                                                <div className="flex flex-wrap items-start lg:justify-between border-b border-lightgray  md:justify-center sm:justify-center xs:justify-center">
                                                  <div className="mb-5 relative searchbox">
                                                    <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                                                    <input
                                                      type="text"
                                                      placeholder=" Search by Name"
                                                      className="border border-primary rounded-full px-7 py-2 search-user"
                                                      value={searchAsset}
                                                      onChange={handleFilter}
                                                    />
                                                  </div>
                                                  <Link to="/fileupload">
                                                    <button className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                                                      Upload
                                                    </button>
                                                  </Link>
                                                </div>
                                                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table">
                                                  <table
                                                    style={{
                                                      borderCollapse:
                                                        "separate",
                                                      borderSpacing: " 0 10px",
                                                    }}
                                                  >
                                                    <thead className="sticky top-0">
                                                      <tr className="bg-lightgray">
                                                        <th className="p-3 w-80 text-left">
                                                          Media Name
                                                        </th>
                                                        <th>Date Added</th>
                                                        <th className="p-3">
                                                          Size
                                                        </th>
                                                        <th className="p-3">
                                                          Type
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    {assetData.map((asset) => (
                                                      <tbody key={asset.id}>
                                                        <tr
                                                          className={`${
                                                            selectedAsset ===
                                                            asset
                                                              ? "bg-[#f3c953]"
                                                              : ""
                                                          } border-b border-[#eee] `}
                                                          onClick={() => {
                                                            handleAssetAdd(
                                                              asset
                                                            );
                                                            setAssetPreviewPopup(
                                                              true
                                                            );
                                                          }}
                                                        >
                                                          <td className="p-3 text-left">
                                                            {asset.name}
                                                          </td>
                                                          <td className="p-3">
                                                            {moment(
                                                              asset.createdDate
                                                            ).format(
                                                              "YYYY-MM-DD"
                                                            )}
                                                          </td>
                                                          <td className="p-3">
                                                            {asset.fileSize}
                                                          </td>
                                                          <td className="p-3">
                                                            {
                                                              asset.categorieType
                                                            }
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    ))}
                                                  </table>
                                                  {assetPreviewPopup && (
                                                    <>
                                                      <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
                                                        <div className="fixed top-1/2 left-1/2 asset-preview-popup">
                                                          <div className="border-0 rounded-lg shadow-lg relative w-full bg-black outline-none focus:outline-none">
                                                            <div className="p-1  rounded-full text-white bg-primary absolute top-[-15px] right-[-16px]">
                                                              <button
                                                                className="p-1 text-xl"
                                                                onClick={() =>
                                                                  setAssetPreviewPopup(
                                                                    false
                                                                  )
                                                                }
                                                              >
                                                                <AiOutlineCloseCircle className="text-2xl" />
                                                              </button>
                                                            </div>
                                                            <div className="p-3 flex justify-center  items-center min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px]">
                                                              {assetPreview && (
                                                                <>
                                                                  {assetPreview.categorieType ===
                                                                    "OnlineImage" && (
                                                                    <div className="imagebox relative p-3">
                                                                      <img
                                                                        src={
                                                                          assetPreview.fileType
                                                                        }
                                                                        alt={
                                                                          assetPreview.name
                                                                        }
                                                                        className="rounded-2xl"
                                                                      />
                                                                    </div>
                                                                  )}

                                                                  {assetPreview.categorieType ===
                                                                    "OnlineVideo" && (
                                                                    <div className="relative videobox">
                                                                      <video
                                                                        controls
                                                                        className="w-full rounded-2xl relative"
                                                                      >
                                                                        <source
                                                                          src={
                                                                            assetPreview.fileType
                                                                          }
                                                                          type="video/mp4"
                                                                        />
                                                                        Your
                                                                        browser
                                                                        does not
                                                                        support
                                                                        the
                                                                        video
                                                                        tag.
                                                                      </video>
                                                                    </div>
                                                                  )}
                                                                  {assetPreview.categorieType ===
                                                                    "Image" && (
                                                                    <img
                                                                      src={
                                                                        assetPreview.fileType
                                                                      }
                                                                      alt={
                                                                        assetPreview.name
                                                                      }
                                                                      className="imagebox relative flex justify-center  items-center min-w-[250px] max-w-[250px] min-h-[250px] max-h-[250px]"
                                                                    />
                                                                  )}
                                                                  {assetPreview.categorieType ===
                                                                    "Video" && (
                                                                    <video
                                                                      controls
                                                                      className="w-full rounded-2xl relative h-56"
                                                                    >
                                                                      <source
                                                                        src={
                                                                          assetPreview.fileType
                                                                        }
                                                                        type="video/mp4"
                                                                      />
                                                                      Your
                                                                      browser
                                                                      does not
                                                                      support
                                                                      the video
                                                                      tag.
                                                                    </video>
                                                                  )}
                                                                  {assetPreview.categorieType ===
                                                                    "DOC" && (
                                                                    <a
                                                                      href={
                                                                        assetPreview.fileType
                                                                      }
                                                                      target="_blank"
                                                                      rel="noopener noreferrer"
                                                                    >
                                                                      {
                                                                        assetPreview.name
                                                                      }
                                                                    </a>
                                                                  )}
                                                                </>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center p-5">
                                      <p className="text-black">
                                        Content will always be playing Confirm
                                      </p>
                                      <button
                                        className="bg-primary text-white rounded-full px-5 py-2 hover:bg-SlateBlue"
                                        onClick={() => {
                                          setShowAssetModal(false);
                                          handleAssetUpdate(screen.screenID);
                                        }}
                                      >
                                        Confirm
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </td>
                      )}
                      {currScheduleContentVisible && (
                        <td className="break-words	w-[150px] p-2 text-center">
                          {screen.screenType == 2 ? (
                            `${screen.name} Till
                          ${moment(screen.endDate).format("YYYY-MM-DD hh:mm")}`
                          ) : (
                            <button onClick={() => setShowScheduleModal(true)}>
                              Set a schedule
                            </button>
                          )}
                          {showScheduleModal && (
                            <>
                              <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div className="w-auto my-6 mx-auto lg:max-w-6xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                                      <div className="flex items-center">
                                        <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                          Set Schedule
                                        </h3>
                                      </div>
                                      <button
                                        className="p-1 text-xl"
                                        onClick={() =>
                                          setShowScheduleModal(false)
                                        }
                                      >
                                        <AiOutlineCloseCircle className="text-2xl" />
                                      </button>
                                    </div>
                                    <div className="overflow-x-auto mt-8 px-5">
                                      <table
                                        className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
                                        cellPadding={20}
                                      >
                                        <thead>
                                          <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                                            <th className="font-medium text-[14px]">
                                              <div className="flex items-center">
                                                <TbCalendarTime className="mr-2 text-xl" />
                                                Schedule Name
                                              </div>
                                            </th>
                                            <th className="font-medium text-[14px]">
                                              <div className="flex items-center">
                                                <TbCalendarTime className="mr-2 text-xl" />
                                                Time Zones
                                              </div>
                                            </th>
                                            <th className="font-medium text-[14px]">
                                              <div className=" flex  items-center justify-center mx-auto">
                                                <VscCalendar className="mr-2 text-xl" />
                                                Date Added
                                              </div>
                                            </th>
                                            <th className="font-medium text-[14px]">
                                              <div className=" flex  items-center justify-center mx-auto">
                                                <TbCalendarStats className="mr-2 text-xl" />
                                                start date
                                              </div>
                                            </th>
                                            <th className="font-medium text-[14px]">
                                              <div className=" flex  items-center justify-center mx-auto">
                                                <TbCalendarStats className="mr-2 text-xl" />
                                                End date
                                              </div>
                                            </th>
                                            <th className="font-medium text-[14px]">
                                              <div className=" flex  items-center justify-center mx-auto">
                                                <RiComputerLine className="mr-2 text-xl" />
                                                screens Assigned
                                              </div>
                                            </th>
                                            <th className="font-medium text-[14px]">
                                              <div className="flex  items-center justify-center mx-auto">
                                                <BsTags className="mr-2 text-xl" />
                                                Tags
                                              </div>
                                            </th>
                                            <th></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {scheduleData.map((schedule) => (
                                            <tr
                                              className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                                              key={schedule.scheduleId}
                                            >
                                              <td className="flex items-center ">
                                                <input
                                                  type="checkbox"
                                                  className="mr-3"
                                                  onChange={() =>
                                                    handleScheduleAdd(schedule)
                                                  }
                                                />
                                                <div>
                                                  <div>
                                                    <Link to="/screensplayer">
                                                      {schedule.scheduleName}
                                                    </Link>
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-center">
                                                {schedule.timeZoneName}
                                              </td>
                                              <td className="text-center">
                                                {moment(
                                                  schedule.createdDate
                                                ).format("YYYY-MM-DD")}
                                              </td>
                                              <td className="text-center">
                                                {moment(
                                                  schedule.startDate
                                                ).format("YYYY-MM-DD")}
                                              </td>

                                              <td className="text-center">
                                                {moment(
                                                  schedule.endDate
                                                ).format("YYYY-MM-DD")}
                                              </td>
                                              <td className="p-2 text-center">
                                                {schedule.screenAssigned}
                                              </td>
                                              <td className="p-2 text-center">
                                                {schedule.tags}
                                              </td>
                                              <td className="text-center">
                                                <Link to="/myschedule">
                                                  <button className="ml-3 relative">
                                                    <HiDotsVertical />
                                                  </button>
                                                </Link>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="py-4 flex justify-center">
                                      <button
                                        onClick={() => {
                                          setShowScheduleModal(false);
                                          handleScheduleUpdate(screen.screenID);
                                        }}
                                        className="border-2 border-primary px-5 py-2 rounded-full ml-3"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </td>
                      )}

                      {tagsContentVisible && (
                        <td className="p-2 text-center">{screen.tags}</td>
                      )}
                      <td className="p-2 text-center relative">
                        <div className="relative">
                          <button
                            className="ml-3 relative"
                            onClick={() => handleScreenClick(screen.screenID)}
                          >
                            <HiDotsVertical />
                          </button>
                          {/* action popup start */}
                          {showActionBox[screen.screenID] && (
                            <div className="scheduleAction z-10 ">
                              <div className="my-1">
                                <Link
                                  to={`/screensplayer?screenID=${screen.screenID}`}
                                >
                                  <button className="text-sm">
                                    Edit Screen
                                  </button>
                                </Link>
                              </div>

                              <div className="mb-1 border border-[#F2F0F9]"></div>
                              <div className=" mb-1 text-[#D30000]">
                                <button
                                  onClick={() =>
                                    handelDeleteScreen(screen.screenID)
                                  }
                                  className="text-sm text-left"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Screens;
