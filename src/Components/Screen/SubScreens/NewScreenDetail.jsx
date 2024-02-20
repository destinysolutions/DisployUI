import { useRef, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "../../../Styles/screen.css";
import { GrScheduleNew } from "react-icons/gr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../../Footer";
import { useEffect } from "react";
import axios from "axios";
import {
  GET_ALL_COMPOSITIONS,
  GET_ALL_FILES,
  GET_ALL_SCHEDULE,
  GET_ALL_SCREEN_ORIENTATION,
  GET_ALL_SCREEN_RESOLUTION,
  GET_ALL_TAGS,
  GET_SCREEN_TIMEZONE,
  GET_SCREEN_TYPE,
  SIGNAL_R,
  UPDATE_NEW_SCREEN,
} from "../../../Pages/Api";
import {
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineDollar,
  AiOutlinePlusCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { RiAppsFill, RiComputerLine } from "react-icons/ri";
import moment from "moment";
import { BsFillInfoCircleFill, BsTags } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import { TbCalendarStats, TbCalendarTime } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../../Assests/FileUpload";
import ploygon from "../../../images/DisployImg/Polygon.svg";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../../Redux/AppsSlice";
import AddOrEditTagPopup from "../../AddOrEditTagPopup";
import toast from "react-hot-toast";
import { MdOutlineModeEdit } from "react-icons/md";
import ShowAssetModal from "../../ShowAssetModal";
import { handleUpdateScreenAsset } from "../../../Redux/Screenslice";
import { handleGetCompositions } from "../../../Redux/CompositionSlice";
import { handleGetAllAssets } from "../../../Redux/Assetslice";
import { handleGetAllSchedule } from "../../../Redux/ScheduleSlice";
import { connection } from "../../../SignalR";
import { socket } from "../../../App";
import { FaPercentage } from "react-icons/fa";
import { BiSolidDollarCircle } from "react-icons/bi";

const NewScreenDetail = ({ sidebarOpen, setSidebarOpen }) => {
  NewScreenDetail.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const { allAppsData } = useSelector((s) => s.root.apps);

  const [appDatas, setAppDatas] = useState();
  const [tagName, setTagName] = useState("");
  const [showTagBox, setShowTagBox] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");

  const [getSelectedScreenTypeOption, setGetSelectedScreenTypeOption] =
    useState([]);
  const [getTimezone, setTimezone] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState("");
  const [getScreenOrientation, setScreenOrientation] = useState([]);
  const [getScreenResolution, setScreenResolution] = useState([]);
  const [selectedScreenTypeOption, setSelectedScreenTypeOption] = useState("");
  const [selectScreenOrientation, setSelectScreenOrientation] = useState();
  const [selectScreenResolution, setSelectScreenResolution] = useState();
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCompositionModal, setShowCompositionModal] = useState(false);
  const [showAppsModal, setShowAppsModal] = useState(false);
  const { otpData, message } = useLocation().state;
  const [otpMessageVisible, setOTPMessageVisible] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [assetAllData, setAssetAllData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedDefaultAsset, setSelectedDefaultAsset] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedComposition, setSelectedComposition] = useState();
  const [selectedApps, setSelectedApps] = useState();
  const [assetPreview, setAssetPreview] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [screenName, setScreenName] = useState("");
  const [screenRatePerSec, setScreenRatePerSec] = useState("");
  const [screenMargin, setScreenMargin] = useState("");

  const [scheduleData, setScheduleData] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [compositionData, setCompositionData] = useState([]);
  const [allcompositionData, setAllCompositionData] = useState([]);
  const [searchAsset, setSearchAsset] = useState("");
  const [showAssestOptionsPopup, setShowAssestOptionsPopup] = useState(false);
  const [confirmForComposition, setConfirmForComposition] = useState(false);
  const [confirmForApps, setConfirmForApps] = useState(false);
  const [saveForSchedule, setSaveForSchedule] = useState(false);
  const [showUploadAssestModal, setShowUploadAssestModal] = useState(false);
  const [selectedYoutube, setSelectedYoutube] = useState();
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const ScreenTags = tags.join(", ");
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [setscreenMacID, setSetscreenMacID] = useState("");
  const [assetScreenID, setAssetScreenID] = useState(null);
  const [tagUpdateScreeen, setTagUpdateScreeen] = useState(null);

  const [screenNameError, setScreenNameError] = useState("");
  const [screenRatePerSecondError, setScreenRatePerSecondError] = useState("");
  const [screenMarginError, setScreenMarginError] = useState("");

  const { screens } = useSelector((s) => s.root.screen);

  const dispatch = useDispatch();
  const history = useNavigate();

  const modalRef = useRef(null);
  const modalPreviewRef = useRef(null);
  const scheduleRef = useRef(null);
  const compositionRef = useRef(null);
  const appRef = useRef(null);

  // console.log(otpData);

  // useEffect(() => {
  //   // get youtube data
  //   dispatch(handleGetYoutubeData({ token }));

  //   //get text scroll data
  //   dispatch(handleGetTextScrollData({ token }));
  // }, []);

  useEffect(() => {
    setAppDatas(allAppsData);
  }, [allAppsData]);

  function handleScreenOrientationRadio(e, optionId) {
    setSelectScreenOrientation(optionId);
  }

  function handleScreenResolutionRadio(e, optionId) {
    setSelectScreenResolution(optionId);
  }

  const handleTagNameChange = (event) => {
    const value = event.target.value;
    setTagName(value);
    setSelectedTag("");
  };

  const handleTagsUpdate = () => {};

  const handleSuggestionClick = (suggestedTag) => {
    const allTags = tags;
    allTags?.push(suggestedTag);
    setTagName(suggestedTag);
    setTags(allTags);
    setSelectedTag(suggestedTag); // Track the selected tag separately
  };

  const handleOptionChange = (e) => {
    if (e.target.value == "Select Asset") {
      setShowAssetModal(true);
      setSelectedDefaultAsset("");
      return;
    } else if (e.target.value == "Default Media") {
      setSelectedDefaultAsset("Default Asset");
      setSelectedApps("");
      setSelectedComposition("");
      setSelectedAsset("");
      setSelectedSchedule("");
      setSelectedTextScroll("");
      setSelectedYoutube("");
      return;
    }
    return console.log(e.target.value);
    setSelectedScreenTypeOption(e.target.value);
    setSelectedComposition("");
    setSelectedApps("");
    setSelectedAsset("");
    setAssetPreview("");
    setSelectedSchedule("");
    setSelectedDefaultAsset("");
    setSelectedYoutube();
    setSelectedTextScroll();
    setConfirmForComposition(false);
    setSaveForSchedule(false);
    setConfirmForApps(false);
  };

  // Trigger the file input click event programmatically
  const handleIconClick = () => {
    document.getElementById("file-input").click();
  };

  const handleAssetAdd = (asset) => {
    setAssetPreview(asset);
    setSelectedAsset(asset);
  };

  const handleScheduleAdd = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleCompositionsAdd = (composition) => {
    setSelectedComposition(composition);
  };

  const handleAppsAdd = (apps) => {
    setSelectedYoutube(apps);
    setSelectedTextScroll(apps);
  };

  const handleFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setAssetData(assetAllData);
    } else {
      // const filteredData = assetData.filter((item) => {
      //   const itemName = item.assetName ? item.assetName.toLowerCase() : "";
      //   return itemName.includes(searchQuery);
      // });
      const filteredData = assetAllData.filter((item) =>
        item?.assetName.toLocaleLowerCase().includes(searchQuery)
      );
      setAssetData(filteredData);
    }
  };

  const signalROnConfirm = () => {
    console.log("run signal r");
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: otpData[0]?.MACID,
    };
    socket.emit("ScreenConnected", Params);
    setTimeout(() => {
      setShowAssetModal(false);
      setSearchAsset("");
      setSelectedAsset(assetPreview);
      setShowAssestOptionsPopup(false);
    }, 1000);
    // let config = {
    //   method: 'put',
    //   maxBodyLength: Infinity,
    //   url: `https://disployapi.thedestinysolutions.com/api/NewScreen/SendTvStatus?status=${socket.connected === true ? true : false}&MacID=${otpData[0]?.MACID}`,
    // };
    // axios.request(config)
    // .then((response) => {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

    try {
      if (connection.state == "Disconnected") {
        connection
          .start()
          .then((res) => {
            console.log("signal connected");
          })
          .then(() => {
            connection.invoke("ScreenConnected", otpData[0]?.MACID).then(() => {
              console.log("invoked");
              console.log("Message sent:", otpData[0]?.MACID);
              // setShowAssetModal(false);
              // setSearchAsset("");
              // setSelectedAsset(assetPreview);
              // setShowAssestOptionsPopup(false);
            });
          });
      } else {
        connection.invoke("ScreenConnected", otpData[0]?.MACID).then(() => {
          console.log("invoked");
          console.log("Message sent:", otpData[0]?.MACID);
          // setShowAssetModal(false);
          // setSearchAsset("");
          // setSelectedAsset(assetPreview);
          // setShowAssestOptionsPopup(false);
        });
      }
    } catch (error) {
      console.error("Error during connection:", error);
    }
  };

  const handleScreenDetail = () => {
    if (screenName.trim() === "") {
      setScreenNameError("Screen name is required");
      return;
    }
    // else if (screenRatePerSec.trim() === "") {
    //   setScreenRatePerSecondError('Screen Rate is required')
    // } else if (screenMargin.trim() === "") {
    //   setScreenMargin('Screen margin is required')
    // }
    else {
      setScreenNameError("");
      setScreenRatePerSecondError("");
      setScreenMargin("");
      // let mediaType = selectedDefaultAsset ? 0 : selectedScreenTypeOption || 0;
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
        : selectedSchedule?.scheduleId !== null &&
          selectedSchedule?.scheduleId !== undefined
        ? 2
        : selectedDefaultAsset
        ? 0
        : 0;

      let getScreenID = otpData.map((item) => item.ScreenID);
      let screen_id = getScreenID[0];
      let moduleID =
        selectedAsset?.assetID ||
        selectedSchedule?.scheduleId ||
        selectedComposition?.compositionID ||
        selectedYoutube?.youtubeId ||
        selectedTextScroll?.textScroll_Id;
      let data = JSON.stringify({
        screenID: screen_id,
        screenOrientation: selectScreenOrientation,
        screenResolution: selectScreenResolution,
        timeZone: selectedTimezoneName,
        mediaType: mediaType,
        tags: ScreenTags,
        screenName: screenName,
        ScreenRatePerSec: screenRatePerSec,
        ScreenMargin: screenMargin,
        mediaDetailID: moduleID || 0,
        operation: "Update",
        UpdatedDate: new Date().toISOString().split("T")[0],
      });
      // return console.log(data);
      toast.loading("Saving...");
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
          if (response.data.status === 200) {
            signalROnConfirm();
            setTimeout(() => {
              toast.remove();
              history("/screens");
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.remove();
        });
    }
  };

  const handleOnSaveSchedule = () => {
    setShowScheduleModal(false);
    if (selectedSchedule !== "") {
      setSaveForSchedule(true);
    }
  };

  const handleConfirmOnComposition = () => {
    setShowCompositionModal(false);
    setSearchAsset("");
    if (selectedComposition !== "") setConfirmForComposition(true);
  };

  const handleConfirmOnApps = () => {
    setShowAppsModal(false);
    setShowAppsModal("");
    setSearchAsset("");
    if (selectedTextScroll !== "" || selectedYoutube !== "")
      setConfirmForApps(true);
  };

  const handleFetchAssestFiles = async () => {
    await axios
      .get(GET_ALL_FILES, {
        headers: { Authorization: authToken },
      })
      .then((res) => {
        const fetchedData = res?.data;
        const data = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(data);
        setAssetAllData(data);
      });
  };

  useEffect(() => {
    // Define an array of axios requests
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

    const axiosRequests = [
      // axios.get(GET_ALL_FILES, {
      //   headers: { Authorization: authToken },
      // }),
      axios.get(GET_SCREEN_TYPE, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_SCREEN_ORIENTATION, {
        headers: { Authorization: authToken },
      }),
      axios.get(GET_ALL_SCREEN_RESOLUTION, {
        headers: { Authorization: authToken },
      }),
      axios.get(GET_SCREEN_TIMEZONE, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_SCHEDULE, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_TAGS, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_COMPOSITIONS, {
        headers: { Authorization: authToken },
      }),
    ];

    // Use Promise.all to send all requests concurrently
    Promise.all(axiosRequests)
      .then((responses) => {
        const [
          // filesResponse,
          screenTypeResponse,
          screenOrientationResponse,
          screenResolutionResponse,
          timezoneResponse,
          scheduleResponse,
          tagsResponse,
          compositionResponse,
        ] = responses;

        // Process each response and set state accordingly
        // const fetchedData = filesResponse.data;
        // const allAssets = [
        //   ...(fetchedData.image ? fetchedData.image : []),
        //   ...(fetchedData.video ? fetchedData.video : []),
        //   ...(fetchedData.doc ? fetchedData.doc : []),
        //   ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
        //   ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        // ];

        // setAssetData(allAssets);
        // setAssetAllData(allAssets);
        const CurrentTimeZone = new Date()
          .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
          })
          .substring(4);
        timezoneResponse.data.data?.map((item) => {
          if (item?.timeZoneName === CurrentTimeZone) {
            setSelectedTimezoneName(item?.timeZoneID);
          }
        });
        setGetSelectedScreenTypeOption(screenTypeResponse.data.data);
        setScreenOrientation(screenOrientationResponse.data.data);
        setScreenResolution(screenResolutionResponse.data.data);
        setTimezone(timezoneResponse.data.data);
        // setSelectedTimezoneName(timezoneResponse.data.data[92].timeZoneID);
        setScheduleData(scheduleResponse.data.data);
        setTagsData(tagsResponse.data.data);
        setCompositionData(compositionResponse.data.data);
        setAllCompositionData(compositionResponse.data.data);
        // console.log(tagsResponse);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (showAssetModal) {
      handleFetchAssestFiles();
    }
  }, [showAssetModal]);

  // close modal assets
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setShowAssetModal(false);
        setSearchAsset("");
        setAssetPreviewPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowAssetModal(false);
    setSearchAsset("");
    setAssetPreviewPopup(false);
  }

  // close modal preview assets
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalPreviewRef.current &&
        !modalPreviewRef.current.contains(event?.target)
      ) {
        setAssetPreviewPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setAssetPreviewPopup(false);
  }

  // close modal schedule
  useEffect(() => {
    const handleClickOutsideSchedule = (event) => {
      if (scheduleRef.current && !scheduleRef.current.contains(event?.target)) {
        setShowScheduleModal(false);
        if (!saveForSchedule) {
          setSelectedSchedule("");
        }
      }
    };
    document.addEventListener("click", handleClickOutsideSchedule, true);
    return () => {
      document.removeEventListener("click", handleClickOutsideSchedule, true);
    };
  }, [handleClickOutsideSchedule]);

  function handleClickOutsideSchedule() {
    setShowScheduleModal(false);
    if (!saveForSchedule) {
      setSelectedSchedule("");
    }
  }

  // close modal composition
  useEffect(() => {
    const handleClickOutsideComposition = (event) => {
      if (
        compositionRef.current &&
        !compositionRef.current.contains(event?.target)
      ) {
        setShowCompositionModal(false);
        setSearchAsset("");
        if (!confirmForComposition) {
          setSelectedComposition("");
        }
      }
    };
    document.addEventListener("click", handleClickOutsideComposition, true);
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsideComposition,
        true
      );
    };
  }, [handleClickOutsideComposition]);

  function handleClickOutsideComposition() {
    setShowCompositionModal(false);
    setSearchAsset("");
    if (!confirmForComposition) {
      setSelectedComposition("");
    }
  }

  useEffect(() => {
    const handleClickOutsideApp = (event) => {
      if (appRef.current && !appRef.current.contains(event?.target)) {
        setShowAppsModal(false);
        setSearchAsset("");
        if (!confirmForApps) {
          setSelectedApps("");
        }
      }
    };
    document.addEventListener("click", handleClickOutsideApp, true);
    return () => {
      document.removeEventListener("click", handleClickOutsideApp, true);
    };
  }, [handleClickOutsideApp]);

  function handleClickOutsideApp() {
    setShowAppsModal(false);
    setSearchAsset("");
    if (!confirmForApps) {
      setSelectedApps("");
    }
  }

  const handleCompositionFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setCompositionData(allcompositionData);
    } else {
      const filteredData = allcompositionData.filter((item) =>
        item?.compositionName.toLocaleLowerCase().includes(searchQuery)
      );
      setCompositionData(filteredData);
    }
  };

  const handleAppFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setAppDatas(allAppsData);
    } else {
      const filteredData = allAppsData.filter((item) =>
        item?.instanceName.toLocaleLowerCase().includes(searchQuery)
      );
      setAppDatas(filteredData);
    }
  };

  const handleAssetUpdate = () => {
    let moduleID =
      selectedAsset?.assetID ||
      selectedComposition?.compositionID ||
      selectedYoutube?.youtubeId ||
      selectedTextScroll?.textScroll_Id;
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
    let data = {
      ...otpData[0],
      screenID: assetScreenID,
      mediaType: mediaType,
      mediaDetailID: moduleID,
      operation: "Update",
    };
    toast.loading("Updating...");
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: otpData[0]?.MACID,
    };
    socket.emit("ScreenConnected", Params);
    setTimeout(() => {
      const response = dispatch(
        handleUpdateScreenAsset({
          mediaName,
          dataToUpdate: data,
          token,
        })
      );
      if (!response) return;
      response
        .then((response) => {
          toast.remove();
          toast.success("Media Updated.");
        })
        .catch((error) => {
          toast.remove();
          console.log(error);
        });
    }, 1000);
    if (connection.state == "Disconnected") {
      connection
        .start()
        .then((res) => {
          console.log("signal connected");
        })
        .then(() => {
          connection
            .invoke("ScreenConnected")
            .then(() => {
              console.log("SignalR method invoked after Asset update");
              // const response = dispatch(
              //   handleUpdateScreenAsset({
              //     mediaName,
              //     dataToUpdate: data,
              //     token,
              //   })
              // );
              // if (!response) return;
              // response
              //   .then((response) => {
              //     toast.remove();
              //     toast.success("Media Updated.");
              //   })
              //   .catch((error) => {
              //     toast.remove();
              //     console.log(error);
              //   });
            })
            .catch((error) => {
              toast.remove();
              console.error("Error invoking SignalR method:", error);
            });
        });
    } else {
      connection
        .invoke("ScreenConnected")
        .then(() => {
          console.log("SignalR method invoked after Asset update");
          // const response = dispatch(
          //   handleUpdateScreenAsset({ mediaName, dataToUpdate: data, token })
          // );
          // if (!response) return;
          // response
          //   .then((response) => {
          //     toast.remove();
          //     toast.success("Media Updated.");
          //   })
          //   .catch((error) => {
          //     toast.remove();
          //     console.log(error);
          //   });
        })
        .catch((error) => {
          toast.remove();
          console.error("Error invoking SignalR method:", error);
        });
    }
  };

  return (
    <>
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
          setAssetScreenID={setAssetScreenID}
          from="new_screen"
          setSelectedAsset={setSelectedAsset}
        />
      )}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {otpMessageVisible && (
        <div
          className="bg-[#fff2cd] px-5 py-3 border-b-2 border-SlateBlue shadow-md"
          style={{
            position: "fixed",
            top: "16px",
            right: "20px",
            zIndex: "999999",
          }}
        >
          <div className="flex text-SlateBlue  text-base font-normal items-center relative">
            <BsFillInfoCircleFill className="mr-1" />
            {message}
            <button
              className="absolute top-[-26px] right-[-26px] bg-white rounded-full p-1 "
              onClick={() => setOTPMessageVisible(false)}
            >
              <AiOutlineClose className="text-xl  text-SlateBlue " />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4">
              New Screens Details
            </h1>
          </div>
          <div className="shadow-md lg:p-5  md:p-5 sm:p:2 rounded-md bg-white flex items-center justify-between mt-7 w-full">
            <form className="w-full newscreen-details">
              <table className="screen-details max-w-[700px]" cellPadding={15}>
                {otpData.map((otpData) => (
                  <tbody key={otpData.ScreenID}>
                    <tr>
                      <td className="lg:w-[200px] md:w-[200px] sm:w-[200px] xs:w-auto">
                        <label className="text-[#001737] lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mb-1 md:mb-0">
                          Screen Name:
                        </label>
                      </td>
                      <td>
                        <input
                          className=" appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3 capitalize"
                          type="text"
                          placeholder="Screen Name"
                          value={screenName}
                          onChange={(e) => {
                            setScreenName(e.target.value);
                            setScreenNameError("");
                          }}
                        />
                        {screenNameError && (
                          <div className="text-red">{screenNameError}</div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Google Location:
                        </label>
                      </td>
                      <td>
                        <h4 className=" appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3">
                          {otpData.GoogleLocation}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Time Zone:
                        </label>
                      </td>
                      <td>
                        <select
                          className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedTimezoneName}
                          onChange={(e) =>
                            setSelectedTimezoneName(e.target.value)
                          }
                        >
                          {getTimezone.map((timezone) => (
                            <option
                              value={timezone.timeZoneID}
                              key={timezone.timeZoneID}
                            >
                              {timezone.timeZoneName}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Screen Orientation:
                        </label>
                      </td>
                      <td>
                        <div className="border border-[#D5E3FF] rounded w-full px-3 py-2 lg:flex  md:flex sm:block xs:block flex-wrap align-center">
                          {getScreenOrientation.map((option) => (
                            <div key={option.orientationID} className="flex">
                              <input
                                type="radio"
                                value={option.orientationID}
                                checked={
                                  option.orientationID ===
                                  selectScreenOrientation
                                }
                                onChange={(e) =>
                                  handleScreenOrientationRadio(
                                    e,
                                    option.orientationID
                                  )
                                }
                              />
                              <label className="ml-1 mr-4 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                {option.orientationName}
                              </label>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Screen Resolution:
                        </label>
                      </td>
                      <td>
                        <div className="border border-[#D5E3FF] rounded w-full px-3 py-2 flex align-center lg:flex  md:flex sm:block xs:block flex-wrap align-center">
                          {getScreenResolution.map((option) => (
                            <div key={option.resolutionsID}>
                              <input
                                type="radio"
                                value={option.resolutionsID}
                                checked={
                                  option.resolutionsID ===
                                  selectScreenResolution
                                }
                                onChange={(e) =>
                                  handleScreenResolutionRadio(
                                    e,
                                    option.resolutionsID
                                  )
                                }
                              />
                              <label className="ml-1 mr-4 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                {option.resolutionsName}
                              </label>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {user?.userDetails?.isRetailer && (
                      <>
                        <tr>
                          <td>
                            <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                              Screen Rate Per Second:
                            </label>
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-4">
                              <input
                                className=" appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3"
                                type="number"
                                placeholder="Screen Rate Per Second"
                                value={screenRatePerSec}
                                onChange={(e) => {
                                  setScreenRatePerSec(e.target.value);
                                  setScreenRatePerSecondError("");
                                }}
                              />
                              <div className="border border-[#D5E3FF] rounded">
                                <BiSolidDollarCircle
                                  size={30}
                                  className="text-black p-[2px]"
                                />
                              </div>
                            </div>
                            {screenRatePerSecondError && (
                              <div className="text-red">
                                {screenRatePerSecondError}
                              </div>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                              Screen Margin:
                            </label>
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-4">
                              <input
                                className=" appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3"
                                type="number"
                                placeholder="Screen Margin"
                                maxLength="3"
                                value={screenMargin}
                                onChange={(e) => {
                                  if (e.target.value.length <= 3) {
                                    setScreenMargin(e.target.value);
                                    setScreenMarginError("");
                                  }
                                }}
                              />
                              <div className="border border-[#D5E3FF] rounded">
                                <FaPercentage
                                  size={30}
                                  className="text-black p-1"
                                />
                              </div>
                            </div>
                            {screenMarginError && (
                              <div className="text-red">
                                {screenMarginError}
                              </div>
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Type:
                        </label>
                      </td>
                      <td
                        className="flex items-center gap-3"
                        // onClick={() => setShowAssetModal(true)}
                      >
                        <label
                          onClick={() => {
                            setShowAssetModal(true);
                            setSelectedDefaultAsset("");
                          }}
                          htmlFor="select_asset"
                          className="flex items-center gap-1"
                        >
                          <input type="radio" name="type" id="select_asset" />
                          Select type
                        </label>
                        <label
                          htmlFor="default_asset"
                          onClick={() => {
                            setSelectedDefaultAsset("Default Asset");
                            setSelectedApps("");
                            setSelectedComposition("");
                            setSelectedAsset("");
                            setSelectedSchedule("");
                            setSelectedTextScroll("");
                            setSelectedYoutube("");
                          }}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="radio"
                            defaultChecked
                            name="type"
                            id="default_asset"
                          />
                          Default Asset
                        </label>
                        {/* Select Asset */}
                        {/* <select
                          className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          // value={selectedScreenTypeOption}
                          onChange={handleOptionChange}
                        >
                          {(selectedAsset ||
                            selectedComposition ||
                           
                            selectedTextScroll ||
                            selectedYoutube) && (
                            <option
                              label={
                                selectedAsset?.assetName ||
                                selectedComposition?.compositionName ||
                               
                                selectedTextScroll?.text ||
                                selectedYoutube?.youtubeId
                              }
                            >
                              {selectedAsset?.assetName ||
                                selectedComposition?.composition ||
                               
                                selectedTextScroll?.text ||
                                selectedYoutube?.youtubeId}
                            </option>
                          )}
                          <option label={` Select Type`}></option>
                          <option value="Select Asset">Select Asset</option>
                          <option value="Default Media">Default Media</option>
                          {/* {getSelectedScreenTypeOption.map((option) => (
                            <option
                              key={option.mediaTypeId}
                              value={option.mediaTypeId}
                            >
                              {option.mediaTypeName}
                            </option>
                          ))} */}
                        {/* </select> */}
                      </td>
                    </tr>
                    {(selectedAsset ||
                      selectedComposition ||
                      selectedTextScroll ||
                      selectedYoutube) && (
                      <tr>
                        <td>
                          <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                            select type:
                          </label>
                        </td>
                        <td className="border border-[#D5E3FF] rounded-lg">
                          {selectedAsset?.assetName ||
                            selectedComposition?.compositionName ||
                            selectedTextScroll?.instanceName ||
                            selectedYoutube?.youtubeId}
                        </td>
                      </tr>
                    )}

                    {selectedScreenTypeOption === "1" && (
                      <tr className={`display-none`}>
                        <td></td>
                        <td className="relative">
                          <input
                            className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={
                              selectedAsset.assetName || selectedDefaultAsset
                            }
                            readOnly
                            placeholder="Select option"
                            onChange={(e) =>
                              setSelectedAsset({
                                ...selectedAsset,
                                assetName: e.target.value,
                              })
                            }
                            onClick={() =>
                              setShowAssestOptionsPopup(!showAssestOptionsPopup)
                            }
                          />

                          {showAssestOptionsPopup && (
                            <>
                              <div className="absolute left-[10%] bottom-[-3px]  text-[35px]  z-20">
                                <img
                                  src={ploygon}
                                  alt="notification"
                                  className="cursor-pointer assestPopup"
                                />
                              </div>
                              <div className="absolute left-[2%] bottom-[-74px] bg-white rounded-lg border border-[#635b5b] shadow-lg z-10  pr-16">
                                <div
                                  className="text-sm mb-1 mt-2 ml-3 cursor-pointer"
                                  onClick={() => {
                                    setShowAssetModal(true);
                                    setAssetData(assetAllData);
                                    setShowAssestOptionsPopup(false);
                                  }}
                                >
                                  Browse
                                </div>

                                <div
                                  className="text-sm mb-3 mt-3 ml-3 cursor-pointer"
                                  onClick={() => {
                                    setSelectedDefaultAsset("Default Asset");
                                    setShowAssestOptionsPopup(false);
                                  }}
                                >
                                  Default Assets
                                </div>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    )}

                    {showUploadAssestModal && <FileUpload />}

                    {selectedScreenTypeOption === "2" && (
                      <tr>
                        <td></td>
                        <td>
                          <div className="flex">
                            <input
                              className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none"
                              value={
                                selectedSchedule !== ""
                                  ? selectedSchedule.scheduleName
                                  : ""
                              }
                              placeholder="Set Schedule"
                              readOnly
                              onChange={(e) =>
                                setSelectedSchedule({
                                  ...selectedSchedule,
                                  scheduleName: e.target.value,
                                })
                              }
                            />
                            <div className="flex items-center ml-5">
                              <span className="bg-lightgray p-2 rounded cursor-pointer">
                                <GrScheduleNew
                                  size={20}
                                  onClick={() => setShowScheduleModal(true)}
                                />
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {showScheduleModal && (
                      <tr>
                        <td>
                          <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                            <div
                              ref={scheduleRef}
                              className="w-auto my-6 mx-auto lg:max-w-6xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
                            >
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                                  <div className="flex items-center">
                                    <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                      Set Schedule
                                    </h3>
                                  </div>
                                  <button
                                    className="p-1 text-xl"
                                    onClick={() => {
                                      setShowScheduleModal(false);
                                      setSelectedSchedule("");
                                    }}
                                  >
                                    <AiOutlineCloseCircle className="text-2xl" />
                                  </button>
                                </div>
                                <div className="overflow-x-auto mt-8 px-5 Set-Schedule-popup">
                                  <table
                                    className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto set-schedule-table"
                                    cellPadding={15}
                                  >
                                    <thead className="sticky top-0">
                                      <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                                        <th className="text-[#444] text-sm font-semibold p-2">
                                          <div className="flex items-center">
                                            <TbCalendarTime className="mr-2 text-xl" />
                                            Schedule Name
                                          </div>
                                        </th>
                                        <th className="text-[#444] text-sm font-semibold p-2">
                                          <div className="flex items-center">
                                            <TbCalendarTime className="mr-2 text-xl" />
                                            Time Zones
                                          </div>
                                        </th>
                                        <th className="text-[#444] text-sm font-semibold p-2">
                                          <div className=" flex  items-center justify-center mx-auto">
                                            <VscCalendar className="mr-2 text-xl" />
                                            Date Added
                                          </div>
                                        </th>
                                        <th className="text-[#444] text-sm font-semibold p-2">
                                          <div className=" flex  items-center justify-center mx-auto">
                                            <TbCalendarStats className="mr-2 text-xl" />
                                            start date
                                          </div>
                                        </th>
                                        <th className="text-[#444] text-sm font-semibold p-2">
                                          <div className=" flex  items-center justify-center mx-auto">
                                            <TbCalendarStats className="mr-2 text-xl" />
                                            End date
                                          </div>
                                        </th>
                                        <th className="text-[#444] text-sm font-semibold p-2">
                                          <div className=" flex  items-center justify-center mx-auto">
                                            <RiComputerLine className="mr-2 text-xl" />
                                            screens Assigned
                                          </div>
                                        </th>
                                        <th className="text-[#444] text-sm font-semibold p-2">
                                          <div className="flex  items-center justify-center mx-auto">
                                            <BsTags className="mr-2 text-xl" />
                                            Tags
                                          </div>
                                        </th>
                                        <th className="w-[100px]"></th>
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
                                              checked={
                                                selectedSchedule?.scheduleId ===
                                                schedule?.scheduleId
                                              }
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
                                            ).format("YYYY-MM-DD hh:mm")}
                                          </td>
                                          <td className="text-center">
                                            {moment(schedule.startDate).format(
                                              "YYYY-MM-DD hh:mm"
                                            )}
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
                                            <button
                                              className="ml-3 relative"
                                              onClick={() => {
                                                window.open(
                                                  window.location.origin.concat(
                                                    "/myschedule"
                                                  )
                                                );
                                                setShowScheduleModal(false);
                                                setSelectedSchedule("");
                                              }}
                                            >
                                              <HiDotsVertical />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="py-2 flex justify-center">
                                  <button
                                    onClick={() => {
                                      handleOnSaveSchedule();
                                    }}
                                    className="border-2 border-SlateBlue bg-SlateBlue hover:bg-primary hover:border-white px-5 py-2 rounded-full ml-3 text-white"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {selectedScreenTypeOption === "3" && (
                      <>
                        <tr>
                          <td></td>
                          <td>
                            <div className="flex">
                              <input
                                className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={
                                  selectedComposition !== ""
                                    ? selectedComposition.compositionName
                                    : ""
                                }
                                placeholder="Set Composition"
                                readOnly
                                onChange={(e) =>
                                  setSelectedComposition({
                                    ...selectedComposition,
                                    compositionName: e.target.value,
                                  })
                                }
                              />

                              <div
                                className="flex items-center ml-5"
                                onClick={() => {
                                  setShowCompositionModal(true);
                                  setCompositionData(allcompositionData);
                                  // setConfirmForComposition(false);
                                }}
                              >
                                <span className="bg-lightgray p-2 rounded">
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0.961295 0.0665965C0.610654 0.137625 0.274179 0.398062 0.0970872 0.736291L0.015625 0.89526V3.29669C0.015625 5.69136 0.015625 5.69812 0.0935454 5.85709C0.206884 6.09724 0.458355 6.334 0.716909 6.44561C1.02151 6.5809 1.41111 6.58429 1.698 6.45576C1.99905 6.32047 5.27879 4.22006 5.40984 4.078C5.81715 3.63492 5.82424 2.98552 5.43109 2.53567C5.32484 2.41729 1.91405 0.228947 1.68029 0.13086C1.50674 0.0564494 1.16318 0.0260091 0.961295 0.0665965Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M7.25131 0.0883092C7.08502 0.17676 6.95765 0.417348 6.97888 0.601327C7.00011 0.767615 7.08148 0.891447 7.22654 0.979898C7.33622 1.04712 7.43529 1.05066 11.0087 1.05066H14.6741L14.7874 0.95867C15.0846 0.70393 15.0669 0.289978 14.7449 0.0953853C14.6317 0.0246242 14.5574 0.0246242 11.0016 0.0246242C7.55912 0.0246242 7.36806 0.0281622 7.25131 0.0883092Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M7.25126 2.87848C7.08851 2.95985 6.9576 3.20398 6.97883 3.39149C7.00006 3.55778 7.08143 3.68161 7.22649 3.7736C7.33617 3.84083 7.42108 3.84083 11.0264 3.83375L14.7095 3.82314L14.805 3.73468C15.0845 3.47287 15.0562 3.07661 14.7448 2.88555C14.6316 2.81479 14.5573 2.81479 11.0016 2.81479C7.61921 2.81479 7.36801 2.81833 7.25126 2.87848Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M7.23694 5.669C6.89729 5.8742 6.9079 6.3943 7.25463 6.57474C7.34308 6.62073 7.84548 6.62781 10.9943 6.62781C14.5607 6.62781 14.635 6.62781 14.7482 6.55705C15.0843 6.35184 15.0843 5.87774 14.7482 5.67253C14.635 5.60177 14.5607 5.60177 10.9873 5.60177C7.49875 5.60177 7.33954 5.60531 7.23694 5.669Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M0.255992 8.46306C-0.0801225 8.66827 -0.0801225 9.14237 0.255992 9.34757C0.372748 9.41833 0.450585 9.41833 7.50192 9.41833C14.5533 9.41833 14.6311 9.41833 14.7479 9.34757C15.084 9.14237 15.084 8.66827 14.7479 8.46306C14.6311 8.3923 14.5533 8.3923 7.50192 8.3923C0.450585 8.3923 0.372748 8.3923 0.255992 8.46306Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M0.319748 11.2081C0.291443 11.2187 0.227758 11.2612 0.185302 11.3036C-0.0835903 11.5477 -0.0482098 11.9511 0.256063 12.1386C0.36928 12.2094 0.44358 12.2094 4.70693 12.2094C8.97028 12.2094 9.04458 12.2094 9.1578 12.1386C9.34178 12.0254 9.41962 11.8697 9.40193 11.6468C9.39131 11.477 9.37362 11.4416 9.24271 11.3178L9.09765 11.1833L4.73524 11.1869C2.33644 11.1869 0.348052 11.1975 0.319748 11.2081Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M12.758 11.3597C12.5549 11.494 12.5205 11.6111 12.5205 12.1483V12.6235H12.0489C11.6668 12.6235 11.5497 12.6338 11.4534 12.6854C11.0781 12.8714 11.085 13.4189 11.4637 13.5876C11.5807 13.6427 11.6909 13.6565 12.0661 13.6565H12.5205V14.1317C12.5205 14.6482 12.5549 14.7722 12.7339 14.9065C12.9542 15.0683 13.3122 14.9994 13.4568 14.7618C13.5291 14.6517 13.536 14.5862 13.5463 14.1489L13.5601 13.6634L14.0454 13.6496C14.4826 13.6393 14.548 13.6324 14.6582 13.5601C14.8957 13.4155 14.9645 13.0573 14.8027 12.837C14.6685 12.6579 14.5446 12.6235 14.0282 12.6235H13.5532V12.1655C13.5532 11.6386 13.4981 11.4699 13.3053 11.3494C13.147 11.253 12.9095 11.2564 12.758 11.3597Z"
                                      fill="#41479B"
                                    />
                                    <path
                                      d="M0.211504 14.0658C-0.0856924 14.3206 -0.0680021 14.7345 0.253961 14.9291C0.367178 14.9999 0.441477 14.9999 4.70483 14.9999C8.96818 14.9999 9.04248 14.9999 9.1557 14.9291C9.4812 14.731 9.49535 14.2392 9.18046 14.0446C9.06725 13.9738 9.01417 13.9738 4.69421 13.9738H0.324722L0.211504 14.0658Z"
                                      fill="#41479B"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}

                    {showCompositionModal && (
                      <tr>
                        <td>
                          <div className="bg-black bg-opacity-50 w-screen justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none myplaylist-popup">
                            <div
                              ref={compositionRef}
                              className="relative w-[90vw] left-1/2 -translate-x-1/3 my-2 myplaylist-popup-details"
                            >
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup newScreenDetails">
                                <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                                  <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                    Set Content to Add Media
                                  </h3>
                                  <button
                                    className="p-1 text-xl"
                                    onClick={() => {
                                      setShowCompositionModal(false);
                                      setSearchAsset("");
                                    }}
                                  >
                                    <AiOutlineCloseCircle className="text-2xl" />
                                  </button>
                                </div>

                                <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto">
                                  <div className="bg-white rounded-[30px]">
                                    <div>
                                      <div className="lg:flex lg:flex-wrap lg:items-center md:flex md:flex-wrap md:items-center sm:block xs:block">
                                        <div className="lg:p-10 md:p-10 sm:p-10 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl w-full">
                                          <div>
                                            <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center mb-3">
                                              <div className="mb-5 relative ">
                                                <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                                                <input
                                                  type="text"
                                                  placeholder=" Search by Name"
                                                  className="border border-primary rounded-full px-7 py-2 search-user"
                                                  value={searchAsset}
                                                  onChange={
                                                    handleCompositionFilter
                                                  }
                                                />
                                              </div>
                                              <button
                                                className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm lg:mb-0 mb-3  hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                                                onClick={() => {
                                                  window.open(
                                                    window.location.origin.concat(
                                                      "/addcomposition"
                                                    )
                                                  );
                                                  setShowCompositionModal(
                                                    false
                                                  );
                                                  setSearchAsset("");
                                                }}
                                              >
                                                Add New Composition
                                              </button>
                                            </div>
                                            <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table">
                                              <table
                                                style={{
                                                  borderCollapse: "separate",
                                                  borderSpacing: " 0 10px",
                                                  width: "100%",
                                                }}
                                              >
                                                <thead className="sticky top-0">
                                                  <tr className="bg-lightgray">
                                                    <th className="p-3 w-80 text-left">
                                                      Composition Name
                                                    </th>
                                                    <th>Date Added</th>
                                                    <th className="p-3">
                                                      Resolution
                                                    </th>
                                                    <th className="p-3">
                                                      Duration
                                                    </th>
                                                  </tr>
                                                </thead>
                                                {compositionData?.length > 0 ? (
                                                  compositionData.map(
                                                    (composition) => (
                                                      <tbody
                                                        key={
                                                          composition.compositionID
                                                        }
                                                      >
                                                        <tr
                                                          className={`${
                                                            selectedComposition?.compositionName ===
                                                            composition?.compositionName
                                                              ? "bg-[#f3c953]"
                                                              : ""
                                                          } border-b border-[#eee] `}
                                                          onClick={() => {
                                                            handleCompositionsAdd(
                                                              composition
                                                            );
                                                          }}
                                                        >
                                                          <td className="p-3 text-left">
                                                            {
                                                              composition.compositionName
                                                            }
                                                          </td>
                                                          <td className="p-3">
                                                            {moment(
                                                              composition.dateAdded
                                                            ).format(
                                                              "YYYY-MM-DD hh:mm"
                                                            )}
                                                          </td>
                                                          <td className="p-3">
                                                            {
                                                              composition.resolution
                                                            }
                                                          </td>
                                                          <td className="p-3">
                                                            {moment
                                                              .utc(
                                                                composition.duration *
                                                                  1000
                                                              )
                                                              .format(
                                                                "hh:mm:ss"
                                                              )}
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    )
                                                  )
                                                ) : (
                                                  <div className="p-3">
                                                    <p>No Composition Found</p>
                                                  </div>
                                                )}
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pl-5 pr-5 pb-4">
                                  <p className="text-black text-left">
                                    Content will always be playing Confirm
                                  </p>
                                  <p className="text-right">
                                    <button
                                      className="bg-primary text-white rounded-full px-5 py-2"
                                      onClick={() => {
                                        // setShowCompositionModal(false);
                                        handleConfirmOnComposition();
                                      }}
                                    >
                                      Confirm
                                    </button>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {selectedScreenTypeOption === "4" && (
                      <>
                        <tr>
                          <td></td>
                          <td>
                            <div className="flex">
                              <input
                                className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={
                                  selectedTextScroll !== "" ||
                                  selectedYoutube !== ""
                                    ? selectedTextScroll?.instanceName ||
                                      selectedYoutube?.instanceName
                                    : ""
                                }
                                placeholder="Set Apps"
                                readOnly
                                onChange={(e) => {
                                  setSelectedTextScroll({
                                    ...selectedTextScroll,
                                    instanceName: e.target.value,
                                  });
                                  setSelectedYoutube({
                                    ...selectedYoutube,
                                    instanceName: e.target.value,
                                  });
                                }}
                              />

                              <div
                                className="flex items-center ml-5"
                                onClick={() => {
                                  setAppDatas(allAppsData);
                                  setShowAppsModal(true);
                                }}
                              >
                                <RiAppsFill className="border border-[#D5E3FF] p-2 text-4xl rounded" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                    {showAppsModal && (
                      <tr>
                        <td>
                          <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none myplaylist-popup">
                            <div
                              ref={appRef}
                              className="relative w-auto my-6 mx-auto myplaylist-popup-details"
                            >
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup newScreenDetails">
                                <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                                  <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                    Set Content to Add Media
                                  </h3>
                                  <button
                                    className="p-1 text-xl"
                                    onClick={() => {
                                      setShowAppsModal(false);
                                      setSearchAsset("");
                                    }}
                                  >
                                    <AiOutlineCloseCircle className="text-2xl" />
                                  </button>
                                </div>

                                <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto">
                                  <div className="bg-white rounded-[30px]">
                                    <div>
                                      <div className="lg:flex lg:flex-wrap lg:items-center md:flex md:flex-wrap md:items-center sm:block xs:block">
                                        <div className="lg:p-10 md:p-10 sm:p-10 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl w-full">
                                          <div>
                                            <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center mb-3">
                                              <div className="mb-5 relative ">
                                                <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                                                <input
                                                  type="text"
                                                  placeholder=" Search by Name"
                                                  className="border border-primary rounded-full px-7 py-2 search-user"
                                                  value={searchAsset}
                                                  onChange={handleAppFilter}
                                                />
                                              </div>
                                              <button
                                                className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm  hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                                                onClick={() => {
                                                  window.open(
                                                    window.location.origin.concat(
                                                      "/apps"
                                                    )
                                                  );
                                                  setShowAppsModal(false);
                                                  setSearchAsset("");
                                                }}
                                              >
                                                Add New App
                                              </button>
                                            </div>
                                            <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table">
                                              <table
                                                style={{
                                                  borderCollapse: "separate",
                                                  borderSpacing: " 0 10px",
                                                  width: "100%",
                                                }}
                                                className="w-full"
                                              >
                                                <thead className="sticky top-0">
                                                  <tr className="bg-lightgray">
                                                    <th className="p-3 w-80 text-left">
                                                      Instance Name
                                                    </th>
                                                    <th className="p-3">
                                                      App Type
                                                    </th>
                                                    {/*<th className="p-3">Resolution</th>
                        <th className="p-3">Duration</th> */}
                                                  </tr>
                                                </thead>

                                                {appDatas?.length > 0 ? (
                                                  appDatas.map(
                                                    (instance, index) => (
                                                      <tbody key={index}>
                                                        <tr
                                                          className={`${
                                                            selectedTextScroll ===
                                                              instance ||
                                                            selectedYoutube ===
                                                              instance
                                                              ? "bg-[#f3c953]"
                                                              : ""
                                                          } border-b border-[#eee] `}
                                                          onClick={() => {
                                                            handleAppsAdd(
                                                              instance
                                                            );
                                                          }}
                                                        >
                                                          <td className="p-3 text-left">
                                                            {
                                                              instance.instanceName
                                                            }
                                                          </td>
                                                          <td className="p-3 text-center">
                                                            {instance.youTubePlaylist
                                                              ? "Youtube Video"
                                                              : "Text scroll"}
                                                          </td>
                                                          {/* <td className="p-3">{composition.resolution}</td>
                              <td className="p-3">
                                {moment
                                  .utc(composition.duration * 1000)
                                  .format("hh:mm:ss")}
                              </td> */}
                                                        </tr>
                                                      </tbody>
                                                    )
                                                  )
                                                ) : (
                                                  <div className="p-3">
                                                    <p>No Data Found</p>
                                                  </div>
                                                )}
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pl-5 pr-5 pb-4">
                                  <p className="text-black text-left">
                                    Content will always be playing Confirm
                                  </p>
                                  <p className="text-right">
                                    <button
                                      className="bg-primary text-white rounded-full px-5 py-2"
                                      onClick={() => {
                                        handleConfirmOnApps();
                                      }}
                                    >
                                      Confirm
                                    </button>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Tags:
                        </label>
                      </td>
                      <td>
                        <div className="md:w-full flex">
                          {/* <div className="relative flex justify-end">
                            <input
                              type="text"
                              className="border border-[#D5E3FF] rounded w-full px-2 py-2"
                              placeholder="Enter tag..."
                              value={selectedTag || tagName}
                              onChange={handleTagNameChange}
                            />
                            <button
                              type="button"
                              onClick={() => setShowTagBox(!showTagBox)}
                              className="ml-2"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315ZM10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0ZM11 11C11 10.4477 10.5523 10 10 10C9.44771 10 9 10.4477 9 11V14C9 14.5523 9.44771 15 10 15C10.5523 15 11 14.5523 11 14V11ZM9.94922 4.75C9.25886 4.75 8.69922 5.30964 8.69922 6C8.69922 6.69036 9.25886 7.25 9.94922 7.25H10.0492C10.7396 7.25 11.2992 6.69036 11.2992 6C11.2992 5.30964 10.7396 4.75 10.0492 4.75H9.94922Z"
                                  fill="#515151"
                                />
                              </svg>
                            </button>
                            </div>*/}
                          {tags?.length === 0 && (
                            <span className="ml-2">
                              <AiOutlinePlusCircle
                                size={30}
                                className="mx-auto cursor-pointer"
                                onClick={() => {
                                  setShowTagModal(true);
                                }}
                              />
                            </span>
                          )}
                          <p>
                            {ScreenTags !== null
                              ? ScreenTags.split(",")
                                  .slice(
                                    0,
                                    ScreenTags.split(",").length > 2
                                      ? 3
                                      : ScreenTags.split(",").length
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
                          </p>

                          {ScreenTags !== "" && ScreenTags !== null && (
                            <MdOutlineModeEdit
                              onClick={() => {
                                setShowTagModal(true);
                                // screen.tags === "" || screen?.tags === null
                                //   ? setTags([])
                                //   : setTags(screen?.tags?.split(","));
                                // setTagUpdateScreeen(screen);
                              }}
                              className="w-5 h-5 cursor-pointer"
                            />
                          )}

                          {showTagBox && (
                            <>
                              <div className=" tagname absolute top-[45px] right-[-8px] bg-white rounded-lg border border-[#635b5b] shadow-lg z-10 max-w-[250px]">
                                <div className="lg:flex md:flex sm:block">
                                  <div className="p-2">
                                    <h6 className="text-center text-sm mb-1">
                                      Give a Tag Name Such
                                    </h6>
                                    <div className="flex flex-wrap">
                                      {tagsData.map((tag) => (
                                        <div
                                          key={tag.tagID}
                                          className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light cursor-pointer"
                                          onClick={() =>
                                            handleSuggestionClick(tag.tagName)
                                          }
                                        >
                                          {tag.tagName}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className=" lg:block md:block sm:hidden"></td>
                      <td>
                        <button
                          className="shadow bg-SlateBlue focus:shadow-outline focus:outline-none text-white font-medium py-2 px-9 rounded-full hover:bg-primary"
                          type="button"
                          onClick={handleScreenDetail}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      {showTagModal && (
        <AddOrEditTagPopup
          setShowTagModal={setShowTagModal}
          tags={tags}
          setTags={setTags}
          handleTagsUpdate={handleTagsUpdate}
          from="screen"
          action="create"
          setTagUpdateScreeen={setTagUpdateScreeen}
        />
      )}
    </>
  );
};

export default NewScreenDetail;
