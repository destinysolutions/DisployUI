import { useEffect, useRef, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "../../../Styles/screen.css";
import { MdArrowBackIosNew, MdOutlineModeEdit } from "react-icons/md";
import { RiAppsFill, RiComputerLine } from "react-icons/ri";
import { AiOutlinePlusCircle, AiOutlineSearch } from "react-icons/ai";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GrScheduleNew } from "react-icons/gr";
import {
  COMPOSITION_BY_ID,
  GET_ALL_COMPOSITIONS,
  GET_ALL_FILES,
  GET_ALL_SCHEDULE,
  GET_ALL_SCREEN_ORIENTATION,
  GET_ALL_SCREEN_RESOLUTION,
  GET_ALL_TAGS,
  GET_CURRENT_ASSET,
  GET_SCREEN_TYPE,
  SCREEN_PREVIEW,
  SELECT_BY_LIST,
  SELECT_BY_SCREENID_SCREENDETAIL,
  UPDATE_NEW_SCREEN,
} from "../../../Pages/Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Carousel from "../../Composition/DynamicCarousel";
import toast from "react-hot-toast";
import { TbCalendarStats, TbCalendarTime } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import { BsTags } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import AddOrEditTagPopup from "../../AddOrEditTagPopup";
import FileUpload from "../../Assests/FileUpload";
import ploygon from "../../../images/DisployImg/Polygon.svg";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../../Redux/AppsSlice";

const Screensplayer = ({ sidebarOpen, setSidebarOpen }) => {
  Screensplayer.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [searchParams] = useSearchParams();
  const getScreenID = searchParams.get("screenID");
  const [screenData, setScreenData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [assetAllData, setAssetAllData] = useState([]);
  const [getScreenOrientation, setScreenOrientation] = useState([]);
  const [selectScreenOrientation, setSelectScreenOrientation] = useState();
  const [selectedTag, setSelectedTag] = useState("");
  const [tagsData, setTagsData] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState("");
  const [googleLoc, setGoogleLoc] = useState("");
  const [toggle, setToggle] = useState(1);
  const [sync, setsyncToggle] = useState(1);
  const [playerData, setPlayerData] = useState(null);
  const [buttonStates, setButtonStates] = useState(Array(3).fill(false));
  const [screenPreviewData, setScreenPreviewData] = useState({
    data: [],
    myComposition: [],
  });
  const [screenName, setScreenName] = useState("");
  const [selectScreenResolution, setSelectScreenResolution] = useState();
  const [getScreenResolution, setScreenResolution] = useState([]);
  const [compositionData, setCompositionData] = useState([]);
  const [allcompositionData, setAllCompositionData] = useState([]);
  const [compositionAPIData, setCompositionAPIData] = useState([]);
  const [selectedComposition, setSelectedComposition] = useState();
  const [selectedScreenTypeOption, setSelectedScreenTypeOption] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetPreview, setAssetPreview] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [confirmForComposition, setConfirmForComposition] = useState(false);
  const [saveForSchedule, setSaveForSchedule] = useState(false);
  const [getSelectedScreenTypeOption, setGetSelectedScreenTypeOption] =
    useState([]);
  const [showCompositionModal, setShowCompositionModal] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [showUploadAssestModal, setShowUploadAssestModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDefaultAsset, setSelectedDefaultAsset] = useState("");
  const [showAssestOptionsPopup, setShowAssestOptionsPopup] = useState(false);
  const [searchAsset, setSearchAsset] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagUpdateScreeen, setTagUpdateScreeen] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYoutube, setSelectedYoutube] = useState();
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [confirmForApps, setConfirmForApps] = useState(false);
  const [previewModalData, setPreviewModalData] = useState([]);
  const [screenType, setScreenType] = useState("");
  const [layotuDetails, setLayotuDetails] = useState(null);
  const [fetchLayoutLoading, setFetchLayoutLoading] = useState(false);
  const [selectedApps, setSelectedApps] = useState();
  const [appDatas, setAppDatas] = useState();


  const dispatch = useDispatch();

  const { timezones } = useSelector((s) => s.root.globalstates);
  const { allAppsData } = useSelector((s) => s.root.apps);

  const modalRef = useRef(null);
  const modalPreviewRef = useRef(null);
  const scheduleRef = useRef(null);
  const compositionRef = useRef(null);
  const appRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // get youtube data
    dispatch(handleGetYoutubeData({ token }));

    //get text scroll data
    dispatch(handleGetTextScrollData({ token }));
  }, []);

  useEffect(() => {
    setAppDatas(allAppsData);
  }, [allAppsData]);

  const handleFilter = (event, from) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setFilteredData(compositionAPIData);
    } else {
      // if (from !== "composition") {
      //   const filteredScreen = assetData.filter((entry) =>
      //     Object.values(entry).some((val) => {
      //       if (typeof val === "string") {
      //         const keyWords = searchQuery.split(" ");
      //         for (let i = 0; i < keyWords.length; i++) {
      //           return (
      //             val.toLocaleLowerCase().startsWith(keyWords[i]) ||
      //             val.toLocaleLowerCase().endsWith(keyWords[i]) ||
      //             val.toLocaleLowerCase().includes(keyWords[i]) ||
      //             val.toLocaleLowerCase().includes(searchQuery)
      //           );
      //         }
      //       }
      //     })
      //   );
      //   if (filteredScreen.length > 0) {
      //     toast.remove();
      //     setFilteredData(filteredScreen);
      //   } else {
      //     toast.remove();
      //     toast.error("asset not found!!");
      //     setFilteredData([]);
      //   }
      // } else {
      const filteredScreen = compositionAPIData.filter((entry) =>
        Object.values(entry).some((val) => {
          if (typeof val === "string") {
            const keyWords = searchQuery.split(" ");
            for (let i = 0; i < keyWords.length; i++) {
              return (
                val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                val.toLocaleLowerCase().includes(keyWords[i]) ||
                val.toLocaleLowerCase().includes(searchQuery)
              );
            }
          }
        })
      );
      if (filteredScreen.length > 0) {
        toast.remove();
        setFilteredData(filteredScreen);
      } else {
        // toast.remove();
        // toast.error("composition not found!!");
        setFilteredData([]);
      }
      // }
    }
  };

  const handleAssetFilter = (event) => {
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

  const handleAssetAdd = (asset) => {
    setAssetPreview(asset);
  };

  const handleCompositionsAdd = (composition) => {
    setSelectedComposition(composition);
  };

  const handleOnConfirm = () => {
    setShowAssetModal(false);
    setSearchAsset("");
    setSelectedAsset(assetPreview);
    setShowAssestOptionsPopup(false);
  };

  const handleScheduleAdd = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleOnSaveSchedule = () => {
    setShowScheduleModal(false);
    if (selectedSchedule !== "") {
      setSaveForSchedule(true);
    }
  };

  const handleAppsAdd = (apps) => {
    setSelectedYoutube(apps);
    setSelectedTextScroll(apps);
  };

  const handleOptionChange = (e) => {
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
  };

  const handleConfirmOnComposition = () => {
    setShowCompositionModal(false);
    setSearchAsset("");
    setSelectedDefaultAsset("");
    if (selectedComposition !== "") setConfirmForComposition(true);
  };

  const handleConfirmOnApps = () => {
    setShowAppsModal(false);
    setSearchAsset("");
    if (selectedTextScroll !== "" || selectedYoutube !== "")
      setConfirmForApps(true);
  };

  let currentDate = new Date();
  let formatedate = moment(currentDate).format("YYYY-MM-DD hh:mm");

  function handleScreenOrientationRadio(e, optionId) {
    setSelectScreenOrientation(optionId);
  }

  function handleScreenResolutionRadio(e, optionId) {
    setSelectScreenResolution(optionId);
  }

  function updatetoggle(id) {
    setToggle(id);
  }

  const handleFetchLayoutById = (id) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_LIST}?LayoutID=${id}`,
      headers: { Authorization: authToken },
      data: "",
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          setLayotuDetails(response.data?.data[0]);
          setScreenType(response?.data?.data[0]?.screenType);
          setFetchLayoutLoading(false);
        }
      })
      .catch((error) => {
        setFetchLayoutLoading(false);
        console.log(error);
      });
  };

  const handleFetchPreviewScreen = async (macId) => {
    let data = JSON.stringify({
      macid: macId,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${SCREEN_PREVIEW}`,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data,
    };
    setLoading(true);
    await axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const { data, myComposition } = response?.data;
          setScreenPreviewData({ data, myComposition });
          if (myComposition.length > 0) {
            setFetchLayoutLoading(true);
            handleFetchLayoutById(myComposition[0]?.layoutID);
          }
          handleChangePreviewScreen();
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  function handleChangePreviewScreen() {
    const { data, myComposition } = screenPreviewData;
    const findCurrentSchedule = data.find((item) => {
      // for schedule
      if (
        moment(moment().format("LLL")).isBetween(
          moment(item?.cStartDate).format("LLL"),
          moment(item?.cEndDate).format("LLL")
        ) ||
        (moment(moment().format("LLL")).isSameOrAfter(
          moment(item?.cStartDate).format("LLL")
        ) &&
          moment(moment().format("LLL")).isSameOrBefore(
            moment(item?.cEndDate).format("LLL")
          ))
      ) {
        return item;
      }
    });
    if (findCurrentSchedule !== undefined && findCurrentSchedule !== null) {
      setPlayerData(findCurrentSchedule);
      setCompositionData([]);
      return true;
    } else if (
      (findCurrentSchedule === null || findCurrentSchedule === undefined) &&
      myComposition[0]?.compositionPossition.length > 0
    ) {
      let obj = {};
      // if (previewModalData.length === 0) {
      //   handleFetchCompositionById(myComposition?.layoutID);
      // }
      for (const [
        key,
        value,
      ] of myComposition[0]?.compositionPossition.entries()) {
        const arr = value?.schedules.map((item) => {
          return {
            ...item,
            width: value?.width,
            height: value?.height,
            top: value?.top,
            left: value?.left,
          };
        });
        obj[key + 1] = [...arr];
      }
      const newdd = Object.entries(obj).map(([k, i]) => ({ [k]: i }));
      if (compositionData.length === 0) {
        setCompositionData(newdd);
        setAllCompositionData(newdd);
        setPlayerData(null);
      }
      return true;
    } else {
      const findDefaultAsset = data.find(
        (item) => item?.isdefaultAsset == "true"
      );
      setPlayerData(findDefaultAsset);
      setCompositionData([]);
      return true;
    }
  }

  var interval;

  function runFunEverySecForPreview() {
    interval = window.setInterval(() => {
      handleChangePreviewScreen();
    }, 1000);
    handleChangePreviewScreen();
  }

  useEffect(() => {
    runFunEverySecForPreview();
    return () => {
      clearInterval(interval);
    };
  }, [screenPreviewData, playerData]);

  const handleScreenDetail = () => {
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
    let moduleID =
      selectedAsset?.assetID ||
      selectedSchedule?.scheduleId ||
      selectedComposition?.compositionID ||
      selectedYoutube?.youtubeId ||
      selectedTextScroll?.textScroll_Id;

    let data = JSON.stringify({
      screenID: getScreenID,
      timeZone: selectedTimezoneName,
      screenOrientation: selectScreenOrientation,
      screenResolution: selectScreenResolution,
      mediaType: mediaType,
      tags: selectedTag,
      mediaDetailID: moduleID || 0,
      screenName: screenName,
      operation: "Update",
    });
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
      .then(() => {
        navigate("/screens");
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_CURRENT_ASSET}?ScreenID=${getScreenID}&CurrentDateTime=${formatedate}`,
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    // Define an array of axios requests
    const axiosRequests = [
      axios.get(GET_ALL_FILES, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_SCREEN_ORIENTATION, {
        headers: { Authorization: authToken },
      }),
      axios.get(GET_ALL_SCREEN_RESOLUTION, {
        headers: { Authorization: authToken },
      }),
      axios.get(GET_SCREEN_TYPE, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_SCHEDULE, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_COMPOSITIONS, {
        headers: { Authorization: authToken },
      }),
    ];

    // Use Promise.all to send all requests concurrently
    Promise.all(axiosRequests)
      .then((responses) => {
        const [
          filesResponse,
          screenOrientationResponse,
          screenResolutionResponse,
          screenTypeResponse,
          scheduleResponse,
          compositionResponse,
        ] = responses;

        // Process each response and set state accordingly
        const fetchedData = filesResponse.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(allAssets);
        setAssetAllData(allAssets);
        setScreenOrientation(screenOrientationResponse.data.data);
        setScreenResolution(screenResolutionResponse.data.data);
        setGetSelectedScreenTypeOption(screenTypeResponse.data.data);
        setScheduleData(scheduleResponse.data.data);
        setCompositionAPIData(compositionResponse.data.data);
        setFilteredData(compositionResponse.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
    // get screen by id
    axios
      .get(`${SELECT_BY_SCREENID_SCREENDETAIL}?ScreenID=${getScreenID}`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        if (response.data?.data !== "Data Is Not Found") {
          handleFetchPreviewScreen(fetchedData[0]?.macid);
          setScreenData(fetchedData);
          setSelectScreenOrientation(fetchedData[0].screenOrientation);
          setSelectScreenResolution(fetchedData[0].screenResolution);
          setSelectedTimezoneName(fetchedData[0].timeZone);
          setSelectedTag(fetchedData[0].tags);
          setGoogleLoc(fetchedData[0].googleLocation);
          setScreenName(fetchedData[0].screenName);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // get all tags
    axios
      .get(GET_ALL_TAGS, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setTagsData(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
    } = screenData[0];

    let data = JSON.stringify({
      screenID: screenData[0]?.screenID,
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
      screenName: screenData[0]?.editedScreenName,
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
        const updatedScreenData = screenData.map((screen) => {
          if (response?.data?.data?.model.screenID === screen?.screenID) {
            return {
              ...screen,
              tags: tags,
            };
          }
          return screen;
        });

        if (updatedScreenData.length > 0) {
          setScreenData(updatedScreenData);
        }
        setTagUpdateScreeen(response?.data?.data?.model);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setShowAssetModal(false);
        setAssetPreviewPopup(false);
        setFilteredData([]);
        setSearchAsset("");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowAssetModal(false);
    setAssetPreviewPopup(false);
    setFilteredData([]);
    setSearchAsset("");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (scheduleRef.current && !scheduleRef.current.contains(event?.target)) {
        setShowScheduleModal(false);
        setSelectedSchedule("");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowScheduleModal(false);
    setSelectedSchedule("");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        compositionRef.current &&
        !compositionRef.current.contains(event?.target)
      ) {
        setShowCompositionModal(false);
        setFilteredData([]);
        setSearchAsset("");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowCompositionModal(false);
    setSearchAsset("");
    setFilteredData([]);
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

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="pt-24 lg:px-5 md:px-5 sm:px-2 xs:px-1">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="justify-between flex items-center xs-block">
              <div className="section-title">
                <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl sm:mb-4  text-[#001737]">
                  Screen Player
                </h1>
              </div>
              <div className="icons flex  items-center">
                <div>
                  <Link to="/screens">
                    <button className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                      <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative screenplayer-section w-[60vw] h-[90vh] mx-auto">
              <div className="w-full h-full pb-5 mx-auto">
                {loading ? (
                  <div className="text-center font-semibold text-2xl">
                    Loading...
                  </div>
                ) : (
                  compositionData.length > 0 &&
                  !loading && (
                    <div className="relative z-0 mx-auto rounded-lg p-4 h-full w-full ">
                      {!fetchLayoutLoading &&
                        !loading &&
                        layotuDetails !== null &&
                        layotuDetails?.lstLayloutModelList.length > 0 &&
                        layotuDetails?.lstLayloutModelList?.map(
                          (data, index) => {
                            return (
                              <div
                                key={index}
                                className="absolute"
                                // style={{
                                //   width:
                                //     compositionData[index][index + 1][0]?.width +
                                //     "px",
                                //   height:
                                //     compositionData[index][index + 1][0]?.height +
                                //     "px",
                                //   top:
                                //     compositionData[index][index + 1][0]?.top +
                                //     "px",
                                //   left:
                                //     compositionData[index][index + 1][0]?.left +
                                //     "px",
                                // }}
                                style={{
                                  // position: "fixed",
                                  left: data.leftside + "%",
                                  top: data.topside + "%",
                                  width: data?.width + "%",
                                  height: data?.height + "%",
                                  backgroundColor: data.fill,
                                }}
                              >
                                <Carousel
                                  from="screen"
                                  items={compositionData[index][index + 1]}
                                />
                              </div>
                            );
                          }
                        )}
                    </div>
                    // null
                  )
                )}
                {!loading &&
                  compositionData.length === 0 &&
                  playerData !== null &&
                  playerData !== undefined &&
                  (Object.values(playerData).includes("Video") ||
                    Object.values(playerData).includes("OnlineVideo")) && (
                    <ReactPlayer
                      url={playerData?.fileType}
                      className="w-full relative z-20 videoinner"
                      controls={true}
                      playing={true}
                    />
                  )}

                {!loading &&
                  compositionData.length === 0 &&
                  playerData !== null &&
                  playerData !== undefined &&
                  (Object.values(playerData).includes("OnlineImage") ||
                    Object.values(playerData).includes("Image")) && (
                    <img
                      src={playerData?.fileType}
                      alt="Media"
                      className="w-full h-full mx-auto object-fill"
                    />
                  )}
              </div>

              {showUploadAssestModal && <FileUpload />}
              {showAssetModal && (
                <tr>
                  <td>
                    <div className="bg-black bg-opacity-50 justify-center items-center w-screen h-screen flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                      <div
                        ref={modalRef}
                        className="relative my-6 mx-auto myplaylist-popup-details w-[70vw] h-[60vh]-top-28 "
                      >
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                          <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                              Set Content to Add Media
                            </h3>
                            <button
                              className="p-1 text-xl"
                              onClick={() => {
                                setShowAssetModal(false);
                                setSearchAsset("");
                              }}
                            >
                              <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                          </div>

                          <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto w-full">
                            <div className="bg-white rounded-[30px] w-full">
                              <div className="lg:flex lg:flex-wrap lg:items-center w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
                                <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl w-full">
                                  <div className="w-full">
                                    <div className="flex border-b border-lightgray w-full flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                                      <div className="mb-5 relative">
                                        <AiOutlineSearch className="absolute top-3 left-2 w-5 h-5 z-10 text-gray" />
                                        <input
                                          type="text"
                                          placeholder="Search"
                                          className="border border-primary rounded-full py-2 search-user"
                                          style={{
                                            paddingLeft: "2rem",
                                          }}
                                          value={searchAsset}
                                          onChange={handleAssetFilter}
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          window.open(
                                            window.location.origin.concat(
                                              "/fileupload"
                                            )
                                          );
                                          setShowAssetModal(false);
                                          setSearchAsset("");
                                        }}
                                        className="flex align-middle border-SlateBlue bg-SlateBlue text-white items-center border rounded-full px-4 py-2 text-sm  hover:text-white hover:bg-primary hover:shadow-lg hover:shadow-primary-500/50 hover:border-white"
                                      >
                                        Upload
                                      </button>
                                    </div>
                                    <div className="md:overflow-x-auto w-full sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover">
                                      <table
                                        className="AddMedia-table w-full"
                                        style={{
                                          borderCollapse: "separate",
                                          borderSpacing: " 0 10px",
                                          width: "100%",
                                        }}
                                      >
                                        <thead className="sticky top-0">
                                          <tr className="bg-lightgray">
                                            <th className="p-3 w-80 text-left">
                                              Media Name
                                            </th>
                                            <th>Date Added</th>
                                            <th className="p-3">Size</th>
                                            <th className="p-3">Type</th>
                                          </tr>
                                        </thead>
                                        {/*{filteredData.length === 0
                                          ? assetData.map((asset) => (
                                              <tbody key={asset.assetID}>
                                                <tr
                                                  className={`${
                                                    assetPreview?.assetID ===
                                                          asset?.assetID
                                                      ? "bg-[#f3c953]"
                                                      : ""
                                                  } border-b border-[#eee] `}
                                                  onClick={() => {
                                                    handleAssetAdd(asset);
                                                    setAssetPreviewPopup(true);
                                                  }}
                                                >
                                                  <td className="p-3">
                                                    {asset.assetName}
                                                  </td>
                                                  <td className="p-3">
                                                    {moment(
                                                      asset.createdDate
                                                    ).format(
                                                      "YYYY-MM-DD hh:mm"
                                                    )}
                                                  </td>
                                                  <td className="p-3">
                                                    {asset.fileSize}
                                                  </td>
                                                  <td className="p-3">
                                                    {asset.assetType}
                                                  </td>
                                                </tr>
                                              </tbody>
                                            ))
                                          : filteredData.map((asset) => (
                                              <tbody key={asset.assetID}>
                                                <tr
                                                  className={`${
                                                    selectedAsset === asset
                                                      ? "bg-[#f3c953]"
                                                      : ""
                                                  } border-b border-[#eee] `}
                                                  onClick={() => {
                                                    handleAssetAdd(asset);
                                                    setAssetPreviewPopup(true);
                                                  }}
                                                >
                                                  <td className="p-3">
                                                    {asset.assetName}
                                                  </td>
                                                  <td className="p-3">
                                                    {moment(
                                                      asset.createdDate
                                                    ).format(
                                                      "YYYY-MM-DD hh:mm"
                                                    )}
                                                  </td>
                                                  <td className="p-3">
                                                    {asset.fileSize}
                                                  </td>
                                                  <td className="p-3">
                                                    {asset.assetType}
                                                  </td>
                                                </tr>
                                              </tbody>
                                                    ))}*/}

                                        {assetData?.length > 0 ? (
                                          assetData.map((asset) => (
                                            <tbody key={asset.assetID}>
                                              <tr
                                                className={`${
                                                  assetPreview?.assetID ===
                                                  asset?.assetID
                                                    ? "bg-[#f3c953]"
                                                    : ""
                                                } border-b border-[#eee] `}
                                                onClick={() => {
                                                  handleAssetAdd(asset);
                                                  setAssetPreviewPopup(true);
                                                }}
                                              >
                                                <td className="p-3">
                                                  {asset.assetName}
                                                </td>
                                                <td className="p-3 text-center">
                                                  {moment(
                                                    asset.createdDate
                                                  ).format("YYYY-MM-DD hh:mm")}
                                                </td>
                                                <td className="p-3 text-center">
                                                  {asset.fileSize}
                                                </td>
                                                <td className="p-3 text-center">
                                                  {asset.assetType}
                                                </td>
                                              </tr>
                                            </tbody>
                                          ))
                                        ) : (
                                          <div className="p-3">
                                            <p>No Assets Found</p>
                                          </div>
                                        )}
                                      </table>
                                      {assetPreviewPopup && (
                                        <div
                                          ref={modalPreviewRef}
                                          className="fixed left-1/2 -translate-x-1/2 w-10/12 h-10/12 bg-black z-50 inset-0"
                                        >
                                          <div className="p-1 rounded-full text-white bg-primary absolute -top-3 -right-3">
                                            <button
                                              className="text-xl"
                                              onClick={() =>
                                                setAssetPreviewPopup(false)
                                              }
                                            >
                                              <AiOutlineCloseCircle className="text-2xl" />
                                            </button>
                                          </div>
                                          <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[90%] w-[90%]">
                                            {assetPreview && (
                                              <>
                                                {assetPreview.assetType ===
                                                  "OnlineImage" && (
                                                  <div className="imagebox p-3">
                                                    <img
                                                      src={
                                                        assetPreview.assetFolderPath
                                                      }
                                                      alt={
                                                        assetPreview.assetName
                                                      }
                                                      className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                                    />
                                                  </div>
                                                )}

                                                {assetPreview.assetType ===
                                                  "OnlineVideo" && (
                                                  <div className="relative videobox">
                                                    <video
                                                      controls
                                                      className="w-full rounded-2xl h-full"
                                                    >
                                                      <source
                                                        src={
                                                          assetPreview.assetFolderPath
                                                        }
                                                        type="video/mp4"
                                                      />
                                                      Your browser does not
                                                      support the video tag.
                                                    </video>
                                                  </div>
                                                )}
                                                {assetPreview.assetType ===
                                                  "Image" && (
                                                  <img
                                                    src={
                                                      assetPreview.assetFolderPath
                                                    }
                                                    alt={assetPreview.assetName}
                                                    className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                                  />
                                                )}
                                                {assetPreview.assetType ===
                                                  "Video" && (
                                                  <video
                                                    controls
                                                    className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                                  >
                                                    <source
                                                      src={
                                                        assetPreview.assetFolderPath
                                                      }
                                                      type="video/mp4"
                                                    />
                                                    Your browser does not
                                                    support the video tag.
                                                  </video>
                                                )}
                                                {assetPreview.assetType ===
                                                  "DOC" && (
                                                  <a
                                                    href={
                                                      assetPreview.assetFolderPath
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                                  >
                                                    {assetPreview.assetName}
                                                  </a>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )}
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
                              className="bg-SlateBlue text-white rounded-full px-5 py-2 hover:bg-primary text-sm"
                              onClick={() => {
                                handleOnConfirm();
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {showScheduleModal && (
                <tr>
                  <td>
                    <div className="bg-black bg-opacity-50 justify-center items-center flex w-screen h-screen overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      <div
                        ref={scheduleRef}
                        className="my-6 mx-auto lg:max-w-6xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
                      >
                        <div className="border-0 rounded-lg shadow-lg w-full h-full relative flex flex-col bg-white outline-none focus:outline-none">
                          <div className="flex items-start justify-between p-4 px-6 w-full border-b border-[#A7AFB7] rounded-t text-black">
                            <div className="flex items-center  w-full">
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
                          <div className="overflow-x-auto mt-8 px-5 Set-Schedule-popup  w-full h-full">
                            <table
                              className=" w-full h-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto set-schedule-table overflow-y-scroll"
                              cellPadding={20}
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
                                      <div>{schedule.scheduleName}</div>
                                    </td>
                                    <td className="text-center">
                                      {schedule.timeZoneName}
                                    </td>
                                    <td className="text-center">
                                      {moment(schedule.createdDate).format(
                                        "YYYY-MM-DD hh:mm"
                                      )}
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

              {showCompositionModal && (
                <tr>
                  <td>
                    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                      <div
                        ref={compositionRef}
                        className="relative w-auto my-6 mx-auto myplaylist-popup-details"
                      >
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
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
                                  <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                                    <div>
                                      <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                                        <div className="mb-5 relative ">
                                          <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                                          <input
                                            type="text"
                                            placeholder=" Search"
                                            className="border border-primary rounded-full pl-8 py-2 search-user"
                                            value={searchAsset}
                                            onChange={(e) => {
                                              handleFilter(e, "composition");
                                            }}
                                          />
                                        </div>
                                        <button
                                          className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                                          onClick={() => {
                                            window.open(
                                              window.location.origin.concat(
                                                "/addcomposition"
                                              )
                                            );
                                            setShowCompositionModal(false);
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
                                              <th className="p-3">Duration</th>
                                            </tr>
                                          </thead>
                                          {filteredData.length > 0 ? (
                                            filteredData.map((composition) => (
                                              <tbody
                                                key={composition.compositionID}
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
                                                  <td className="p-3 text-center">
                                                    {moment(
                                                      composition.dateAdded
                                                    ).format(
                                                      "YYYY-MM-DD hh:mm"
                                                    )}
                                                  </td>
                                                  <td className="p-3 text-center">
                                                    {composition.resolution}
                                                  </td>
                                                  <td className="p-3 text-center">
                                                    {moment
                                                      .utc(
                                                        composition.duration *
                                                          1000
                                                      )
                                                      .format("hh:mm:ss")}
                                                  </td>
                                                </tr>
                                              </tbody>
                                            ))
                                          ) : (
                                            <div className="pl-2">
                                              No Composition Found
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
                          <div className="flex justify-between items-center p-5">
                            <p className="text-black">
                              Content will always be playing Confirm
                            </p>
                            <button
                              className="bg-primary text-white rounded-full px-5 py-2"
                              onClick={() => {
                                handleConfirmOnComposition();
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </div>

            <div className="grid grid-cols-12 screen-player-details min-w-full pb-7 sm:pb-0 border-b border-[#D5E3FF]">
              <div className="default-media w-full flex items-center xs-block justify-between bg-lightgray py-2 px-5 rounded-md lg:col-start-4 lg:col-span-6 md:col-start-3 md:col-span-8  sm:col-start-1 sm:col-span-12">
                <div className="w-full">
                  <p className="text-primary text-sm font-light">Now Playing</p>
                  <h4 className="text-primary text-lg">
                    {compositionData.length > 0 &&
                      playerData === null &&
                      "Composition"}
                    {screenPreviewData.data.length > 1 &&
                      playerData !== null &&
                      "Schedule"}
                    {screenPreviewData.data.length === 1 &&
                      compositionData.length === 0 &&
                      "Default Media"}
                  </h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 info-table">
              <div className="lg:col-start-4 lg:col-span-6 md:col-start-1 md:col-span-12  sm:col-start-1 sm:col-span-12 text-center">
                <ul className="inline-flex items-center justify-center border border-gray rounded-full my-4 shadow-xl">
                  <li className="text-sm firstli">
                    <button
                      className={toggle === 1 ? "tabshow tabactive" : "tab"}
                      onClick={() => updatetoggle(1)}
                    >
                      Info
                    </button>
                  </li>
                  <li className="text-sm">
                    <button
                      className={toggle === 2 ? "tabshow tabactive" : "tab"}
                      onClick={() => updatetoggle(2)}
                    >
                      Setting
                    </button>
                  </li>
                </ul>
                <div
                  className={
                    toggle === 1
                      ? "show-togglecontent active mb-5"
                      : "togglecontent"
                  }
                >
                  <table
                    cellPadding={10}
                    className="w-full border-[#D5E3FF] border rounded-xl screen-status"
                  >
                    {Array.isArray(screenData) &&
                      screenData.map((screen) => (
                        <tbody key={screen.screenID}>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Screen Status:
                              </p>
                            </td>
                            <td className="text-left">
                              <button className="bg-gray py-2 px-8 rounded-full text-primary hover:bg-primary hover:text-white">
                                Offline
                              </button>
                            </td>
                          </tr>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Screen Details:
                              </p>
                            </td>
                            <td className="text-left">
                              <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                {screen.screendetails}
                              </p>
                            </td>
                          </tr>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Mac ID:
                              </p>
                            </td>
                            <td className="text-left">
                              <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                {screen.macid}
                              </p>
                            </td>
                          </tr>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Operating System:
                              </p>
                            </td>
                            <td className="text-left">
                              <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                {screen.os}
                              </p>
                            </td>
                          </tr>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Google Location:
                              </p>
                            </td>
                            <td className="text-left">
                              <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                {screen.googleLocation}
                              </p>
                            </td>
                          </tr>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Time Zone:
                              </p>
                            </td>
                            <td className="text-left">
                              <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                {screen.timeZoneName}
                              </p>
                            </td>
                          </tr>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Tags:
                              </p>
                            </td>
                            <td className="text-left">
                              <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                {screen && screen?.tags !== null
                                  ? screen &&
                                    screen?.tags
                                      .split(",")
                                      .slice(
                                        0,
                                        screen &&
                                          screen?.tags.split(",").length > 2
                                          ? 3
                                          : screen &&
                                              screen?.tags.split(",").length
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
                            </td>
                          </tr>
                          <tr className="border-b border-[#D5E3FF]">
                            <td className="text-left pl-10">
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                Connected By:
                              </p>
                            </td>
                            <td className="text-left">
                              <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                {screen.userName}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                  </table>
                </div>

                <div
                  className={
                    toggle === 2
                      ? "show-togglecontent active mb-5"
                      : "togglecontent"
                  }
                >
                  <table
                    cellPadding={10}
                    className="w-full border-[#D5E3FF] border rounded-xl synctable responsive-table"
                    onClick={() => {
                      assetPreviewPopup && setAssetPreviewPopup(false);
                    }}
                  >
                    <tbody>
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Screen Name:
                          </p>
                        </td>
                        <td className="text-left">
                          <input
                            type="text"
                            className="border border-[#D5E3FF] rounded-full px-3 py-2.5"
                            onChange={(e) => {
                              setScreenName(e.target.value);
                            }}
                            value={screenName}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Orientation:
                          </p>
                        </td>
                        <td className="text-left">
                          <div className="flex lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
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
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Resolution:
                          </p>
                        </td>
                        <td className="text-left">
                          <div className="flex lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                            {getScreenResolution.map((option) => (
                              <div key={option.resolutionsID} className="flex">
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
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Overwrite Time Zone:
                          </p>
                        </td>
                        <td className="text-left">
                          <select
                            className="px-2 py-2 border border-[#D5E3FF] w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                            value={selectedTimezoneName}
                            onChange={(e) =>
                              setSelectedTimezoneName(e.target.value)
                            }
                          >
                            {timezones.map((timezone) => (
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

                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Tags:
                          </p>
                        </td>
                        <td className="flex items-center gap-2">
                          {((screenData.length > 0 &&
                            screenData[0]?.tags === "") ||
                            (screenData.length > 0 &&
                              screenData[0]?.tags === null)) && (
                            <span>
                              <AiOutlinePlusCircle
                                size={30}
                                className="mx-auto cursor-pointer"
                                onClick={() => {
                                  setShowTagModal(true);
                                  screenData[0].tags === "" ||
                                  screenData[0]?.tags === null
                                    ? setTags([])
                                    : setTags(screenData[0]?.tags?.split(","));
                                  setTagUpdateScreeen(screenData[0]);
                                }}
                              />
                            </span>
                          )}

                          {screenData?.length > 0 &&
                          screenData[0]?.tags !== null
                            ? screenData.length > 0 &&
                              screenData[0]?.tags
                                .split(",")
                                .slice(
                                  0,
                                  screenData.length > 0 &&
                                    screenData[0]?.tags.split(",").length > 2
                                    ? 3
                                    : screenData.length > 0 &&
                                        screenData[0]?.tags.split(",").length
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
                          {screenData.length > 0 &&
                            screenData[0]?.tags !== "" &&
                            screenData.length > 0 &&
                            screenData[0]?.tags !== null && (
                              <MdOutlineModeEdit
                                onClick={() => {
                                  setShowTagModal(true);
                                  (screenData.length > 0 &&
                                    screenData[0].tags === "") ||
                                  (screenData.length > 0 &&
                                    screenData[0]?.tags === null)
                                    ? setTags([])
                                    : setTags(
                                        screenData.length > 0 &&
                                          screenData[0]?.tags?.split(",")
                                      );
                                  setTagUpdateScreeen(
                                    screenData.length > 0 && screenData[0]
                                  );
                                }}
                                className="w-5 h-5 cursor-pointer"
                              />
                            )}
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
                          {/* <select
                                      value={selectedTag}
                                      onChange={(e) =>
                                        setSelectedTag(e.target.value)
                                      }
                                    >
                                      {tagsData.map((tag) => (
                                        <option
                                          key={tag.tagID}
                                          value={tag.tagName}
                                        >
                                          {tag.tagName}
                                        </option>
                                      ))}
                                    </select> */}
                        </td>
                      </tr>
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Type
                          </p>
                        </td>
                        <td>
                          <select
                            className="px-2 py-2 border border-[#D5E3FF] w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                            value={selectedScreenTypeOption}
                            onChange={handleOptionChange}
                          >
                            <option label="Select Type"></option>
                            {getSelectedScreenTypeOption.map((option) => (
                              <option
                                key={option.mediaTypeId}
                                value={option.mediaTypeId}
                              >
                                {option.mediaTypeName}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {selectedScreenTypeOption === "1" && (
                        <tr
                          className={`display-none border-b border-[#D5E3FF]`}
                        >
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
                                setShowAssestOptionsPopup(
                                  !showAssestOptionsPopup
                                )
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
                                      setSelectedAsset("");
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
                      {selectedScreenTypeOption === "2" && (
                        <>
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
                        </>
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
                                    setFilteredData(compositionAPIData);
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
                            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                              <div
                                ref={appRef}
                                className="relative w-auto my-6 mx-auto myplaylist-popup-details"
                              >
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
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
                                          <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                                            <div>
                                              <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
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
                                                  className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
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
                                                      <th>App Type</th>
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
                                                    <div className="p-3 text-left">
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
                                  <div className="flex justify-between items-center p-5">
                                    <p className="text-black">
                                      Content will always be playing Confirm
                                    </p>
                                    <button
                                      className="bg-primary text-white rounded-full px-5 py-2"
                                      onClick={() => {
                                        handleConfirmOnApps();
                                      }}
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="flex justify-center my-3">
                    <button
                      onClick={handleScreenDetail}
                      className="bg-primary text-base px-5 py-2 rounded-full text-white hover:bg-SlateBlue"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {/* <Footer /> */}
    </>
  );
};

export default Screensplayer;
