import { useEffect, useRef, useState } from "react";
import "../../Styles/screen.css";
import {
  AiOutlineAppstoreAdd,
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlinePlusCircle,
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
  RiSignalTowerLine,
} from "react-icons/ri";
import { HiDotsVertical, HiOutlineLocationMarker } from "react-icons/hi";
import { BsCollectionPlay, BsPencilSquare, BsTags } from "react-icons/bs";
import Footer from "../Footer";
import { Tooltip } from "@material-tailwind/react";

import { SCREEN_GROUP, SIGNAL_R, UPDATE_NEW_SCREEN } from "../../Pages/Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { TbCalendarStats, TbCalendarTime } from "react-icons/tb";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { IoBarChartSharp } from "react-icons/io5";
import ShowAssetModal from "../ShowAssetModal";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import toast from "react-hot-toast";
import {
  handleChangeScreens,
  handleDeleteAllScreen,
  handleDeleteScreenById,
  handleGetScreen,
  handleUpdateScreenAsset,
  handleUpdateScreenName,
  handleUpdateScreenSchedule,
} from "../../Redux/Screenslice";
import { handleGetAllAssets } from "../../Redux/Assetslice";
import { handleGetAllSchedule } from "../../Redux/ScheduleSlice";
import { handleGetCompositions } from "../../Redux/CompositionSlice";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../Redux/AppsSlice";
import { TvStatus, connection } from "../../SignalR";

const Screens = ({ sidebarOpen, setSidebarOpen }) => {
  Screens.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
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
  const [assetScreenID, setAssetScreenID] = useState(null);
  const [scheduleScreenID, setScheduleScreenID] = useState();

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

  const [editedScreenName, setEditedScreenName] = useState("");

  const [editingScreenID, setEditingScreenID] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState({
    scheduleName: "",
  });
  const [searchScreen, setSearchScreen] = useState("");

  const { user, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [groupName, setGroupName] = useState("");
  const [selectedAsset, setSelectedAsset] = useState({
    assetName: "",
    assetID: "",
  });
  const [assetPreview, setAssetPreview] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [selectedComposition, setSelectedComposition] = useState({
    compositionName: "",
  });

  const [showNewScreenGroupPopup, setShowNewScreenGroupPopup] = useState(false);
  const [selectedCheckboxIDs, setSelectedCheckboxIDs] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [filteredScreenData, setFilteredScreenData] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagUpdateScreeen, setTagUpdateScreeen] = useState(null);
  const [selectedYoutube, setSelectedYoutube] = useState();
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [setscreenMacID, setSetscreenMacID] = useState("");
  const { loading, screens, deleteLoading } = useSelector((s) => s.root.screen);
  const { schedules } = useSelector((s) => s.root.schedule);
  const { compositions } = useSelector((s) => s.root.composition);
  const dispatch = useDispatch();

  const selectedScreenIdsString = Array.isArray(selectedCheckboxIDs)
    ? selectedCheckboxIDs.join(",")
    : "";

  const moreModalRef = useRef(null);
  const showActionModalRef = useRef(null);

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleAppsAdd = (apps) => {
    setSelectedYoutube(apps);
    setSelectedTextScroll(apps);
  };

  const handleScreenClick = (screenId) => {
    setShowActionBox((prevState) => {
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === screenId ? !prevState[key] : false;
        return acc;
      }, {});
      return { ...updatedState, [screenId]: !prevState[screenId] };
    });
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

  const handleDeleteAllscreen = () => {
    if (window.confirm("Are you sure?") == false) return;
    if (deleteLoading) return;
    toast.loading("Deleting...");

    const allScreenMacids = screens.map((i) => i?.macid).join(",");
    // console.log(allScreenMacids);

    const response = dispatch(
      handleDeleteAllScreen({ userID: user?.userID, token })
    );

    if (!response) return;
    console.log("signal r");
    response
      .then(() => {
        if (connection.state == "Disconnected") {
          connection
            .start()
            .then((res) => {
              console.log("signal connected");
            })
            .then(() => {
              connection
                .invoke("ScreenConnected", allScreenMacids)
                .then(() => {
                  console.log("SignalR method invoked after Asset update");
                })
                .catch((error) => {
                  console.error("Error invoking SignalR method:", error);
                });
            });
        } else {
          connection
            .invoke("ScreenConnected", allScreenMacids)
            .then(() => {
              console.log("SignalR method invoked after Asset update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        }
        setTimeout(() => {
          dispatch(handleChangeScreens([]));
          setSelectAllChecked(false);
          setScreenCheckboxes({});
          toast.remove();
          toast.success("Deleted Successfully.");
        }, 1000);
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handelDeleteScreen = (screenId, MACID) => {
    if (!window.confirm("Are you sure?")) return;
    if (deleteLoading) return;
    toast.loading("Deleting...");
    console.log("signal r");
    if (connection.state == "Disconnected") {
      connection
        .start()
        .then((res) => {
          console.log("signal connected");
        })
        .then(() => {
          connection
            .invoke("ScreenConnected", MACID)
            .then(() => {
              const response = dispatch(
                handleDeleteScreenById({ screenID: screenId, token })
              );
              if (response) {
                response
                  .then((res) => {
                    toast.remove();
                    toast.success("Deleted Successfully.");
                    console.log(MACID);
                  })
                  .catch((error) => {
                    toast.remove();
                    console.log(error);
                  });
              }
              console.log("SignalR method invoked after Asset update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        });
    } else {
      connection
        .invoke("ScreenConnected", MACID)
        .then(() => {
          const response = dispatch(
            handleDeleteScreenById({ screenID: screenId, token })
          );
          if (response) {
            response
              .then((res) => {
                toast.remove();
                toast.success("Deleted Successfully.");
                console.log(MACID);
              })
              .catch((error) => {
                toast.remove();
                console.log(error);
              });
          }
          console.log("SignalR method invoked after Asset update");
        })
        .catch((error) => {
          console.error("Error invoking SignalR method:", error);
        });
    }
  };

  const handleScheduleAdd = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleScreenNameUpdate = (screenId) => {
    const screenToUpdate = screens.find(
      (screen) => screen.screenID === screenId
    );
    if (editedScreenName.trim() === "") {
      toast.remove();
      return toast.error("Please enter a screen name");
    } else {
      if (screenToUpdate) {
        toast.loading("Updating Name...");
        let data = {
          ...screenToUpdate,
          screenID: screenId,
          screenName: editedScreenName,
          operation: "Update",
        };

        const response = dispatch(
          handleUpdateScreenName({ dataToUpdate: data, token })
        );
        if (!response) return;
        response.then((response) => {
          toast.remove();
          if (response?.payload?.status == 200) {
            toast.success("Name Updated");
            setIsEditingScreen(false);
            setEditingScreenID(null);
            setEditedScreenName("");
          }
        });
      } else {
        toast.remove();
        console.error("Screen not found for update");
      }
    }
  };

  const handleAssetUpdate = () => {
    const screenToUpdate = screens.find(
      (screen) => screen.screenID === assetScreenID
    );
    let moduleID =
      selectedAsset?.assetID ||
      selectedComposition?.compositionID ||
      selectedYoutube?.youtubeId ||
      selectedTextScroll?.textScroll_Id;
    // return console.log(moduleID, selectedComposition);
    let mediaType = selectedAsset?.assetID
      ? 1
      : selectedTextScroll?.textScroll_Id !== null &&
        selectedTextScroll?.textScroll_Id !== undefined
      ? 4
      : selectedYoutube?.youtubeId !== null &&
        selectedYoutube?.youtubeId !== undefined
      ? 5
      : selectedComposition?.compositionID !== null &&
        selectedComposition?.compositionID !== undefined
      ? 3
      : 0;

    let mediaName =
      selectedAsset?.assetName ||
      selectedComposition?.compositionName ||
      selectedYoutube?.instanceName ||
      selectedTextScroll?.instanceName;

    if (screenToUpdate) {
      let data = {
        ...screenToUpdate,
        screenID: assetScreenID,
        mediaType: mediaType,
        mediaDetailID: moduleID,
        operation: "Update",
      };
      toast.loading("Updating...");
      const response = dispatch(
        handleUpdateScreenAsset({ mediaName, dataToUpdate: data, token })
      );

      if (!response) return;
      response
        .then((response) => {
          toast.remove();
          if (connection.state == "Disconnected") {
            connection
              .start()
              .then((res) => {
                console.log("signal connected");
              })
              .then(() => {
                connection
                  .invoke(
                    "ScreenConnected",
                    screenToUpdate?.macid.replace(/^\s+/g, "")
                  )
                  .then(() => {
                    toast.success("Media Updated.");
                    console.log("SignalR method invoked after Asset update");
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke(
                "ScreenConnected",
                screenToUpdate?.macid.replace(/^\s+/g, "")
              )
              .then(() => {
                toast.success("Media Updated.");
                console.log("SignalR method invoked after Asset update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setIsEditingScreen(false);
        })
        .catch((error) => {
          toast.remove();
          console.log(error);
        });
    } else {
      toast.remove();
      console.error("Asset not found for update");
    }
  };

  const handleScheduleUpdate = () => {
    const screenToUpdate = screens.find(
      (screen) => screen?.screenID === scheduleScreenID
    );
    let moduleID = selectedSchedule?.scheduleId;
    if (!moduleID) {
      toast.remove();
      return toast.error("Please Select Schedule.");
    }
    if (screenToUpdate) {
      let data = {
        ...screenToUpdate,
        screenID: scheduleScreenID,
        mediaType: 2,
        mediaDetailID: moduleID,
        operation: "Update",
      };

      toast.loading("Schedule assinging...");
      const response = dispatch(
        handleUpdateScreenSchedule({
          schedule: selectedSchedule,
          dataToUpdate: data,
          token,
        })
      );
      if (!response) return;
      response
        .then((response) => {
          toast.remove();
          toast.success("Schedule assinged to screen.");
          setShowScheduleModal(false);
          if (connection.state == "Disconnected") {
            connection
              .start()
              .then((res) => {
                console.log("signal connected");
              })
              .then(() => {
                connection
                  .invoke(
                    "ScreenConnected",
                    screenToUpdate?.macid.replace(/^\s+/g, "")
                  )
                  .then(() => {
                    console.log("SignalR method invoked after Schedule update");
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke(
                "ScreenConnected",
                screenToUpdate?.macid.replace(/^\s+/g, "")
              )
              .then(() => {
                console.log("SignalR method invoked after Schedule update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setIsEditingScreen(false);
        })
        .catch((error) => {
          console.log(error);
          toast.remove();
        });
    } else {
      toast.remove();
      console.error("Screen not found for update");
    }
  };

  const handleTagsUpdate = (tags) => {
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
      mediaType,
      mediaDetailID,
      tvTimeZone,
      tvScreenOrientation,
      tvScreenResolution,
    } = tagUpdateScreeen;

    let data = JSON.stringify({
      screenID: tagUpdateScreeen?.screenID,
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
      mediaType,
      tags,
      mediaDetailID,
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
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const updatedScreenData = screens.map((screen) => {
          if (response?.data?.data?.model.screenID === screen?.screenID) {
            return {
              ...screen,
              tags: tags,
            };
          }
          return screen;
        });

        const updatedScreenDataFilter = filteredScreenData.map((screen) => {
          if (response?.data?.data?.model.screenID === screen?.screenID) {
            return {
              ...screen,
              tags: tags,
            };
          }
          return screen;
        });
        if (updatedScreenDataFilter.length > 0) {
          setFilteredScreenData(updatedScreenDataFilter);
        }
        if (updatedScreenData.length > 0) {
          dispatch(handleChangeScreens(updatedScreenData));
        }
        setTagUpdateScreeen(response?.data?.data?.model);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewScreenGroupClick = () => {
    const checkedIDs = Object.keys(screenCheckboxes).filter(
      (screenID) => screenCheckboxes[screenID]
    );
    setSelectedCheckboxIDs(checkedIDs);

    setShowNewScreenGroupPopup(!showNewScreenGroupPopup);
  };

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
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleScreenSearch = (event) => {
    // setTags([])
    const searchQuery = event.target.value.toLowerCase();
    setSearchScreen(searchQuery);

    if (searchQuery === "") {
      setFilteredScreenData([]);
    } else {
      const filteredScreen = screens.filter((entry) =>
        Object.values(entry).some((val) => {
          if (typeof val === "string") {
            const keyWords = searchQuery.split(" ");
            for (let i = 0; i < keyWords.length; i++) {
              return val.toLocaleLowerCase().includes(searchQuery);
            }
          }
        })
      );
      if (filteredScreen.length > 0) {
        setFilteredScreenData(filteredScreen);
      } else {
        setFilteredScreenData([]);
      }
    }
  };

  // chagne live status
  // useEffect(() => {
  //   // console.log("run signal r");
  //   connection.on("ScreenConnected", (screenConnected) => {
  //     setScreenConnected(screenConnected);
  //   });

  //   connection.on("TvStatus", (UserID, ScreenID, status) => {
  //     var b = document.getElementById("changetvstatus" + ScreenID);
  //     b.setAttribute(
  //       "class",
  //       "rounded-full px-6 py-2 text-white text-center " +
  //         (status == true ? "bg-[#3AB700]" : "bg-[#FF0000]")
  //     );
  //     b.textContent = status == true ? "Live" : "offline";
  //   });
  // }, []);

  // fetch all data
  useEffect(() => {
    if (user) {
      // load composition
      dispatch(handleGetCompositions({ token }));

      // get all assets files
      dispatch(handleGetAllAssets({ token }));

      // get all schedule
      dispatch(handleGetAllSchedule({ token }));

      // get youtube data
      dispatch(handleGetYoutubeData({ token }));

      //get text scroll data
      dispatch(handleGetTextScrollData({ token }));

      // get screens
      const response = dispatch(handleGetScreen({ token }));
      if (response) {
        response.then((res) => {
          if (res?.payload?.status == 200) {
            const fetchedData = res?.payload.data;
            const initialCheckboxes = {};
            if (Array.isArray(fetchedData)) {
              fetchedData.forEach((screen) => {
                initialCheckboxes[screen.screenID] = false;
              });
              setScreenCheckboxes(initialCheckboxes);
            }
          }
        });
      }
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreModalRef.current &&
        !moreModalRef.current.contains(event?.target)
      ) {
        setMoreModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setMoreModal(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showActionModalRef.current &&
        !showActionModalRef.current.contains(event?.target)
      ) {
        setShowActionBox(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowActionBox(false);
  }

  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [sortColumn, setSortColumn] = useState(null); // column name or null if not sorted
  const handleSort = (column) => {
    // Toggle sorting order if the same column is clicked
    const newSortOrder =
      column === sortColumn && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(column);

    // Sort the data based on the selected column and order
    const sortedData = [...screens].sort((a, b) => {
      // Implement your sorting logic here based on the column
      // Example: Sort by screenName
      const aValue = a[column];
      const bValue = b[column];
      return newSortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    // Update the state with the sorted data
    dispatch(handleChangeScreens(sortedData));
  };

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          {/* top div */}
          <div className="justify-between flex items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              Screens
            </h1>

            <div className="flex items-center sm:mt-3 flex-wrap">
              <div className="relative mr-5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search screen" //location ,screen, tag
                  className="border border-primary rounded-full px-7 pl-10 py-2 search-user"
                  value={searchScreen}
                  onChange={(e) => {
                    handleScreenSearch(e);
                  }}
                />
              </div>
              {/* <Tooltip
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
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                >
                  <VscVmConnect className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip> */}
              <Tooltip
                content="New Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}>
                <button
                  type="button"
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                  onClick={() => setShowOTPModal(true)}>
                  <MdOutlineAddToQueue className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>
              {showOTPModal ? (
                <>
                  <ScreenOTPModal
                    showOTPModal={showOTPModal}
                    setShowOTPModal={setShowOTPModal}
                  />
                </>
              ) : null}
              {/* <Tooltip
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
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                  onClick={handleNewScreenGroupClick}
                >
                  <HiOutlineRectangleGroup className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip> */}
              {showNewScreenGroupPopup && (
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                  <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                      <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                        <button
                          className="p-1 text-xl"
                          onClick={() => setShowNewScreenGroupPopup(false)}>
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
                          onClick={handleScreenGroup}>
                          create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <Tooltip
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
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                >
                  <RiSignalTowerLine className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip> */}
              <Tooltip
                content="Delete"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}>
                <button
                  type="button"
                  className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                  onClick={handleDeleteAllscreen}
                  style={{ display: selectAllChecked ? "block" : "none" }}>
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
                  }}>
                  <button
                    type="button"
                    className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                    onClick={() => setMoreModal(!moreModal)}>
                    <RiArrowDownSLine className="p-1 px-2 text-4xl text-white hover:text-white" />
                  </button>
                </Tooltip>
                {moreModal && (
                  <div ref={moreModalRef} className="moredw">
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
                      {/* <li className="flex text-sm items-center mt-2">
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
                      </li> */}
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
                          onClick={() => setMoreModal(false)}>
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
                }}>
                <button
                  type="button"
                  className="flex align-middle text-white items-center rounded-full p-2 text-base  ">
                  <input
                    type="checkbox"
                    className="w-7 h-6"
                    onChange={handleSelectAllCheckboxChange}
                    checked={selectAllChecked}
                  />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className=" bg-white rounded-xl mt-8 shadow screen-section">
            <table
              className="w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}>
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                  {screenContentVisible && (
                    <th
                      className="text-[#5A5881] text-base font-semibold w-fit text-center"
                      onClick={() => handleSort("screenName")}>
                      Screen
                      {sortColumn === "screenName" && (
                        <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                      )}
                    </th>
                  )}
                  {locContentVisible && (
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Google Location
                    </th>
                  )}
                  {statusContentVisible && (
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      status
                    </th>
                  )}
                  {/* {lastSeenContentVisible && (
                    <th className=" text-[#444] text-sm font-semibold p-2">
                      <div className="flex  items-center justify-center   mx-auto">
                        <RxTimer className="mr-2 text-xl" />
                        Last Seen
                        <BiFilterAlt className="ml-1 text-lg" />
                      </div>
                    </th>
                  )} */}
                  {nowPlayingContentVisible && (
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Now Playing
                    </th>
                  )}
                  {currScheduleContentVisible && (
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Current Schedule
                    </th>
                  )}
                  {tagsContentVisible && (
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Tags
                    </th>
                  )}
                  <th className="w-4"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="text-center justify-center font-semibold text-lg w-full">
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : screens?.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="font-semibold text-center text-2xl">
                      No Screens
                    </td>
                  </tr>
                ) : filteredScreenData.length === 0 && searchScreen !== "" ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="font-semibold text-center text-2xl">
                      screen not found
                    </td>
                  </tr>
                ) : filteredScreenData?.length === 0 ? (
                  screens?.map((screen) => (
                    <tr
                      className="border-b border-b-[#E4E6FF]"
                      key={screen.screenID}>
                      {screenContentVisible && (
                        <td className="flex items-center ">
                          <input
                            type="checkbox"
                            className="mr-3"
                            style={{
                              display: selectAllChecked ? "block" : "none",
                            }}
                            onChange={() =>
                              handleScreenCheckboxChange(screen.screenID)
                            }
                            checked={screenCheckboxes[screen.screenID]}
                          />

                          {isEditingScreen &&
                          editingScreenID === screen.screenID ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className="border border-primary rounded-md w-full"
                                value={editedScreenName}
                                onChange={(e) => {
                                  setEditedScreenName(e.target.value);
                                }}
                              />
                              <button
                                onClick={() => {
                                  handleScreenNameUpdate(screen.screenID);
                                }}>
                                <AiOutlineSave className="text-2xl ml-1 hover:text-primary" />
                              </button>
                              {/* {screenNameError && (
                                <div className="text-red">
                                  {screenNameError}
                                </div>
                              )} */}
                            </div>
                          ) : (
                            <div className="flex items-center  gap-2">
                              <Link
                                to={`/screensplayer?screenID=${screen.screenID}`}>
                                {screen?.screenName?.length > 10
                                  ? screen?.screenName.slice(0, 10) + "..."
                                  : screen.screenName}
                              </Link>
                              <button
                                onClick={() => {
                                  setIsEditingScreen(true);
                                  setEditingScreenID(screen.screenID);
                                  setEditedScreenName(screen?.screenName);
                                }}>
                                <MdOutlineModeEdit className="w-6 h-6 hover:text-primary" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                      {locContentVisible && (
                        <td className="break-words text-center">
                          {screen.googleLocation}
                        </td>
                      )}

                      {statusContentVisible && (
                        <td className="text-center">
                          <span
                            id={`changetvstatus${screen.screenID}`}
                            className={`rounded-full px-6 py-2 text-white text-center ${
                              screen.screenStatus == 1
                                ? "bg-[#3AB700]"
                                : "bg-[#FF0000]"
                            }`}>
                            {screen.screenStatus == 1 ? "Live" : "offline"}
                          </span>
                        </td>
                      )}
                      {/* {lastSeenContentVisible && (
                        <td className="p-2 text-center break-words">
                          25 May 2023
                        </td>
                      )} */}
                      {nowPlayingContentVisible && (
                        <td
                          className="text-center "
                          style={{ wordBreak: "break-all" }}>
                          <div
                            onClick={(e) => {
                              setAssetScreenID(screen.screenID);
                              setSetscreenMacID(screen.macid);
                              setShowAssetModal(true);
                              setSelectedAsset({
                                ...selectedAsset,
                                assetName: screen?.assetName,
                                assetID: screen?.mediaDetailID,
                              });
                              // setSelectedAsset(screen?.assetName);
                            }}
                            title={screen?.assetName}
                            className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                            <p className="line-clamp-3">{screen.assetName}</p>
                            <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                          </div>
                        </td>
                      )}
                      {currScheduleContentVisible && (
                        <td className="break-words text-center">
                          {screen.scheduleName == "" ? (
                            <button
                              onClick={() => {
                                setShowScheduleModal(true);
                                setScheduleScreenID(screen.screenID);
                              }}>
                              Set a schedule
                            </button>
                          ) : (
                            `${screen.scheduleName} Till
                          ${moment(screen.endDate).format("YYYY-MM-DD hh:mm")}`
                          )}

                          {showScheduleModal && (
                            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                              <div className="w-auto my-6 mx-auto lg:max-w-6xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                  <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                                    <div className="flex items-center">
                                      <Link to="/addschedule" target="_blank">
                                        <h3 className="bg-SlateBlue text-white px-5 py-2 rounded-full ml-3">
                                          Set New Schedule
                                        </h3>
                                      </Link>
                                    </div>
                                    <button
                                      className="p-1"
                                      onClick={() =>
                                        setShowScheduleModal(false)
                                      }>
                                      <AiOutlineCloseCircle className="text-3xl" />
                                    </button>
                                  </div>
                                  <div className="overflow-x-auto mt-8 px-5 min-h-[400px] max-h-[400px] ">
                                    <table
                                      className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto bg-white shadow-2xl p-2"
                                      cellPadding={20}>
                                      <thead>
                                        <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Schedule Name
                                          </th>
                                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Time Zones
                                          </th>
                                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Date Added
                                          </th>
                                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            start date
                                          </th>
                                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            End date
                                          </th>
                                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            screens Assigned
                                          </th>
                                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Tags
                                          </th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {loading ? (
                                          <tr>
                                            <td
                                              colSpan={8}
                                              className="text-center font-semibold text-xl">
                                              Loading...
                                            </td>
                                          </tr>
                                        ) : (
                                          schedules.map((schedule) => (
                                            <tr
                                              className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                                              key={schedule.scheduleId}>
                                              <td className="flex items-center">
                                                <input
                                                  type="checkbox"
                                                  className="mr-3"
                                                  onChange={() =>
                                                    handleScheduleAdd(schedule)
                                                  }
                                                />
                                                <div>
                                                  <div>
                                                    {schedule.scheduleName}
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="text-center">
                                                {schedule.timeZoneName}
                                              </td>
                                              <td className="text-center">
                                                {moment(
                                                  schedule.createdDate
                                                ).format("YYYY-MM-DD hh:mm")}
                                              </td>
                                              <td className="text-center">
                                                {moment(
                                                  schedule.startDate
                                                ).format("YYYY-MM-DD hh:mm")}
                                              </td>

                                              <td className="text-center">
                                                {moment(
                                                  schedule.endDate
                                                ).format("YYYY-MM-DD hh:mm")}
                                              </td>
                                              <td className="p-2 text-center">
                                                {schedule.screenAssigned}
                                              </td>
                                              <td className="p-2 text-center">
                                                {schedule.tags}
                                              </td>
                                              <td className="text-center">
                                                <Link
                                                  to={`/addschedule?scheduleId=${schedule.scheduleId}&scheduleName=${schedule.scheduleName}&timeZoneName=${schedule.timeZoneName}`}
                                                  target="_blank">
                                                  <button
                                                    className="ml-3 relative"
                                                    onClick={() =>
                                                      setShowScheduleModal(
                                                        false
                                                      )
                                                    }>
                                                    <HiDotsVertical />
                                                  </button>
                                                </Link>
                                              </td>
                                            </tr>
                                          ))
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="py-4 flex justify-center">
                                    <button
                                      onClick={() => {
                                        handleScheduleUpdate(screen.screenID);
                                      }}
                                      className="border-2 border-primary px-5 py-2 rounded-full ml-3">
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      )}

                      {tagsContentVisible && (
                        <td
                          title={screen?.tags && screen?.tags}
                          className="p-2 text-center flex flex-wrap items-center justify-center gap-2 mt-6 break-all">
                          {(screen?.tags === "" || screen?.tags === null) && (
                            <span>
                              <AiOutlinePlusCircle
                                size={30}
                                className="mx-auto cursor-pointer"
                                onClick={() => {
                                  setShowTagModal(true);
                                  screen.tags === "" || screen?.tags === null
                                    ? setTags([])
                                    : setTags(screen?.tags?.split(","));
                                  setTagUpdateScreeen(screen);
                                }}
                              />
                            </span>
                          )}

                          {screen?.tags !== null
                            ? screen.tags
                                .split(",")
                                .slice(
                                  0,
                                  screen.tags.split(",").length > 2
                                    ? 3
                                    : screen.tags.split(",").length
                                )
                                .map((text) => {
                                  if (text.toString().length > 10) {
                                    return text
                                      .split("")
                                      .slice(0, 10)
                                      .concat("...")
                                      .join("");
                                  }
                                  return text;
                                })
                                .join(",")
                            : ""}
                          {screen?.tags !== "" && screen?.tags !== null && (
                            <MdOutlineModeEdit
                              onClick={() => {
                                setShowTagModal(true);
                                screen.tags === "" || screen?.tags === null
                                  ? setTags([])
                                  : setTags(screen?.tags?.split(","));
                                setTagUpdateScreeen(screen);
                              }}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}

                          {/* add or edit tag modal */}
                          {showTagModal && (
                            <AddOrEditTagPopup
                              setShowTagModal={setShowTagModal}
                              tags={tags}
                              setTags={setTags}
                              handleTagsUpdate={handleTagsUpdate}
                              from="screen"
                              setTagUpdateScreeen={setTagUpdateScreeen}
                            />
                          )}
                        </td>
                      )}

                      <td className="p-2 text-center relative">
                        <div className="relative">
                          <button
                            className="ml-3 relative"
                            onClick={() => handleScreenClick(screen.screenID)}>
                            <HiDotsVertical />
                          </button>
                          {/* action popup start */}
                          {showActionBox[screen.screenID] && (
                            <div
                              ref={showActionModalRef}
                              className="scheduleAction">
                              <div className="my-1">
                                <Link
                                  to={`/screensplayer?screenID=${screen.screenID}`}>
                                  <button className="text-sm">
                                    Edit Screen
                                  </button>
                                </Link>
                              </div>

                              <div className="mb-1 border border-[#F2F0F9]"></div>
                              <div className=" mb-1 text-[#D30000]">
                                <button
                                  onClick={() =>
                                    handelDeleteScreen(
                                      screen.screenID,
                                      screen?.macid
                                    )
                                  }
                                  className="text-sm text-left">
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredScreenData.map((screen) => (
                    // <tbody key={screen.screenID}>
                    <tr
                      key={screen.screenID}
                      className="border-b border-b-[#E4E6FF]">
                      {screenContentVisible && (
                        <td className="flex items-center ">
                          <input
                            type="checkbox"
                            className="mr-3"
                            style={{
                              display: selectAllChecked ? "block" : "none",
                            }}
                            onChange={() =>
                              handleScreenCheckboxChange(screen.screenID)
                            }
                            checked={screenCheckboxes[screen.screenID]}
                          />

                          {isEditingScreen &&
                          editingScreenID === screen.screenID ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className="border border-primary rounded-md w-full"
                                value={editedScreenName}
                                onChange={(e) => {
                                  setEditedScreenName(e.target.value);
                                }}
                              />
                              <button
                                onClick={() => {
                                  handleScreenNameUpdate(screen.screenID);
                                }}>
                                <AiOutlineSave className="text-2xl ml-1 hover:text-primary" />
                              </button>
                              {/* {screenNameError && (
                              <div className="text-red">
                                {screenNameError}
                              </div>
                            )} */}
                            </div>
                          ) : (
                            <div className="flex items-center  gap-2">
                              <Link
                                to={`/screensplayer?screenID=${screen.screenID}`}>
                                {screen?.screenName?.length > 10
                                  ? screen?.screenName.slice(0, 10) + "..."
                                  : screen.screenName}
                              </Link>
                              <button
                                onClick={() => {
                                  setIsEditingScreen(true);
                                  setEditingScreenID(screen.screenID);
                                  setEditedScreenName(screen?.screenName);
                                }}>
                                <MdOutlineModeEdit className="w-6 h-6 hover:text-primary" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                      {locContentVisible && (
                        <td className="p-2 break-words text-center">
                          {screen.googleLocation}
                        </td>
                      )}

                      {statusContentVisible && (
                        <td className="p-2 text-center">
                          <button
                            id={`changetvstatus${screen.screenID}`}
                            className={`rounded-full px-6 py-2 text-white text-center ${
                              screen.screenStatus == 1
                                ? "bg-[#3AB700]"
                                : "bg-[#FF0000]"
                            }`}>
                            {screen.screenStatus == 1 ? "Live" : "offline"}
                          </button>
                        </td>
                      )}
                      {/* {lastSeenContentVisible && (
                      <td className="p-2 text-center break-words">
                        25 May 2023
                      </td>
                    )} */}
                      {nowPlayingContentVisible && (
                        <td
                          className="p-2 text-center "
                          style={{ wordBreak: "break-all" }}>
                          <div
                            onClick={(e) => {
                              setAssetScreenID(screen.screenID);
                              setShowAssetModal(true);
                              setSelectedAsset({
                                ...selectedAsset,
                                assetName: screen?.assetName,
                                assetID: screen?.mediaDetailID,
                              });
                              // setSelectedAsset(screen?.assetName);
                            }}
                            title={screen?.assetName}
                            className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                            <p className="line-clamp-3">{screen.assetName}</p>
                            <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                          </div>
                        </td>
                      )}
                      {currScheduleContentVisible && (
                        <td className="break-words	w-[150px] p-2 text-center">
                          {screen.scheduleName == "" ? (
                            <button
                              onClick={() => {
                                setShowScheduleModal(true);
                                setScheduleScreenID(screen.screenID);
                              }}>
                              Set a schedule
                            </button>
                          ) : (
                            `${screen.scheduleName} Till
                        ${moment(screen.endDate).format("YYYY-MM-DD hh:mm")}`
                          )}

                          {showScheduleModal && (
                            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                              <div className="w-auto my-6 mx-auto lg:max-w-6xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                  <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                                    <div className="flex items-center">
                                      <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                        Set Schedule
                                      </h3>
                                    </div>
                                    <button
                                      className="p-1 text-xl"
                                      onClick={() =>
                                        setShowScheduleModal(false)
                                      }>
                                      <AiOutlineCloseCircle className="text-2xl" />
                                    </button>
                                  </div>
                                  <div className="overflow-x-auto mt-8 px-5">
                                    <table
                                      className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
                                      cellPadding={20}>
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
                                        {schedules.map((schedule) => (
                                          <tr
                                            className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                                            key={schedule.scheduleId}>
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
                                                  {schedule.scheduleName}
                                                </div>
                                              </div>
                                            </td>
                                            <td className="text-center">
                                              {schedule.timeZoneName}
                                            </td>
                                            <td className="text-center">
                                              {moment(
                                                schedule.createdDate
                                              ).format("YYYY-MM-DD hh:mm")}
                                            </td>
                                            <td className="text-center">
                                              {moment(
                                                schedule.startDate
                                              ).format("YYYY-MM-DD hh:mm")}
                                            </td>

                                            <td className="text-center">
                                              {moment(schedule.endDate).format(
                                                "YYYY-MM-DD hh:mm"
                                              )}
                                            </td>
                                            <td className="p-2 text-center">
                                              {schedule.screenAssigned}
                                            </td>
                                            <td className="p-2 text-center">
                                              {schedule.tags}
                                            </td>
                                            <td className="text-center">
                                              <Link
                                                to={`/addschedule?scheduleId=${schedule.scheduleId}&scheduleName=${schedule.scheduleName}&timeZoneName=${schedule.timeZoneName}`}
                                                target="_blank">
                                                <button
                                                  className="ml-3 relative"
                                                  onClick={() =>
                                                    setShowScheduleModal(false)
                                                  }>
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
                                      className="bg-SlateBlue border-primary px-5 py-2 rounded-full ml-3">
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      )}

                      {tagsContentVisible && (
                        <td
                          title={screen?.tags && screen?.tags}
                          className="p-2 text-center flex flex-wrap items-center justify-center gap-2 mt-6 break-all">
                          {(screen?.tags === "" || screen?.tags === null) && (
                            <span>
                              <AiOutlinePlusCircle
                                size={30}
                                className="mx-auto cursor-pointer"
                                onClick={() => {
                                  setShowTagModal(true);
                                  screen.tags === "" || screen?.tags === null
                                    ? setTags([])
                                    : setTags(screen?.tags?.split(","));
                                  setTagUpdateScreeen(screen);
                                }}
                              />
                            </span>
                          )}

                          {screen?.tags !== null
                            ? screen.tags
                                .split(",")
                                .slice(
                                  0,
                                  screen.tags.split(",").length > 2
                                    ? 3
                                    : screen.tags.split(",").length
                                )
                                .map((text) => {
                                  if (text.toString().length > 10) {
                                    return text
                                      .split("")
                                      .slice(0, 10)
                                      .concat("...")
                                      .join("");
                                  }
                                  return text;
                                })
                                .join(",")
                            : ""}
                          {screen?.tags !== "" && screen?.tags !== null && (
                            <MdOutlineModeEdit
                              onClick={() => {
                                setShowTagModal(true);
                                screen.tags === "" || screen?.tags === null
                                  ? setTags([])
                                  : setTags(screen?.tags?.split(","));
                                setTagUpdateScreeen(screen);
                              }}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}

                          {/* add or edit tag modal */}
                          {showTagModal && (
                            <AddOrEditTagPopup
                              setShowTagModal={setShowTagModal}
                              tags={tags}
                              setTags={setTags}
                              handleTagsUpdate={handleTagsUpdate}
                              from="screen"
                              setTagUpdateScreeen={setTagUpdateScreeen}
                            />
                          )}
                        </td>
                      )}

                      <td className="p-2 text-center relative">
                        <div className="relative">
                          <button
                            className="ml-3 relative"
                            onClick={() => handleScreenClick(screen.screenID)}>
                            <HiDotsVertical />
                          </button>
                          {/* action popup start */}
                          {showActionBox[screen.screenID] && (
                            <div
                              ref={showActionModalRef}
                              className="scheduleAction">
                              <div className="my-1">
                                <Link
                                  to={`/screensplayer?screenID=${screen.screenID}`}>
                                  <button className="text-sm">
                                    Edit Screen
                                  </button>
                                </Link>
                              </div>

                              <div className="mb-1 border border-[#F2F0F9]"></div>
                              <div className=" mb-1 text-[#D30000]">
                                <button
                                  onClick={() =>
                                    handelDeleteScreen(
                                      screen.screenID,
                                      screen?.macid
                                    )
                                  }
                                  className="text-sm text-left">
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    // </tbody>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showAssetModal && (
        <ShowAssetModal
          handleAssetAdd={handleAssetAdd}
          handleAssetUpdate={handleAssetUpdate}
          setSelectedComposition={setSelectedComposition}
          handleAppsAdd={handleAppsAdd}
          popupActiveTab={popupActiveTab}
          setAssetPreviewPopup={setAssetPreviewPopup}
          setPopupActiveTab={setPopupActiveTab}
          setShowAssetModal={setShowAssetModal}
          assetPreviewPopup={assetPreviewPopup}
          assetPreview={assetPreview}
          selectedComposition={selectedComposition}
          selectedTextScroll={selectedTextScroll}
          selectedYoutube={selectedYoutube}
          selectedAsset={selectedAsset}
          setscreenMacID={setscreenMacID}
          setSelectedAsset={setSelectedAsset}
        />
      )}
      <Footer />
    </>
  );
};

export default Screens;
