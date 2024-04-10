import { useEffect, useRef, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "../../../Styles/screen.css";
import { MdArrowBackIosNew, MdOutlineModeEdit } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
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
import ShowAssetModal from "../../ShowAssetModal";
import { handleUpdateScreenAsset } from "../../../Redux/Screenslice";
import { TvStatus, connection } from "../../../SignalR";
import { IoCloudUploadOutline } from "react-icons/io5";
import { socket } from "../../../App";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import {
  Operating_hours,
  TotalDay,
  getCurrentTime,
  getTrueDays,
  extractTime,
  Screen_Type
} from "../../Common/Common";
import OperatingHourModal from "./OperatingHourModal";
const Screensplayer = ({ sidebarOpen, setSidebarOpen }) => {
  Screensplayer.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const { token, userDetails } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [searchParams] = useSearchParams();
  const getScreenID = searchParams.get("screenID");
  const [screenData, setScreenData] = useState([]);

  const [assetData, setAssetData] = useState([]);
  const [assetAllData, setAssetAllData] = useState([]);
  const [getScreenOrientation, setScreenOrientation] = useState([]);
  const [selectScreenOrientation, setSelectScreenOrientation] = useState();
  const [orientation, setOrientation] = useState();
  const [selectedTag, setSelectedTag] = useState("");
  const [tagsData, setTagsData] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState("");
  const [selectedOperatingHour, setSelectedOperatingHour] = useState("");
  const [selectedScreenType, setSelectedScreenType] = useState("");


  const [selectedHours, setSelectedHours] = useState("");

  const [selectedOperatingHourModel, setSelectedOperatingHourModel] =
    useState(false);

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
  const [selectedComposition, setSelectedComposition] = useState("");
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
  const [selectedYoutube, setSelectedYoutube] = useState("");
  const [selectedTextScroll, setSelectedTextScroll] = useState("");
  const [showAppsModal, setShowAppsModal] = useState(false);
  const [confirmForApps, setConfirmForApps] = useState(false);
  const [previewModalData, setPreviewModalData] = useState([]);
  const [screenType, setScreenType] = useState("");
  const [layotuDetails, setLayotuDetails] = useState(null);
  const [fetchLayoutLoading, setFetchLayoutLoading] = useState(false);
  const [selectedApps, setSelectedApps] = useState();
  const [appDatas, setAppDatas] = useState();
  const [selectedmediaDetailID, setSelectedMediaDetailID] = useState();
  const [selectedmediaTypeID, setSelectedMediaTypeID] = useState();
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [setscreenMacID, setSetscreenMacID] = useState(null);
  const [isPlay, setIsPlay] = useState(true);
  const [startTime, setStartTime] = useState(getCurrentTime());
  const [endTime, setEndTime] = useState(getCurrentTime());

  console.log("isPlay", isPlay);
  const dispatch = useDispatch();
  const [selectedDays, setSelectedDays] = useState(
    new Array(TotalDay.length).fill(false)
  );
  const { timezones } = useSelector((s) => s.root.globalstates);
  const { allAppsData } = useSelector((s) => s.root.apps);

  const modalRef = useRef(null);
  const scheduleRef = useRef(null);
  const compositionRef = useRef(null);
  const appRef = useRef(null);

  const navigate = useNavigate();

  const toggleModal = () => {
    setSelectedOperatingHourModel(false);
    setSelectedOperatingHour("");
    setStartTime(getCurrentTime());
    setEndTime(getCurrentTime());
    setSelectedHours("");
    setSelectedDays(new Array(TotalDay.length).fill(false));
  };

  const getScreenByid = () => {
    axios
      .get(`${SELECT_BY_SCREENID_SCREENDETAIL}?ScreenID=${getScreenID}`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        if (response.data?.data !== "Data Is Not Found") {
          let arr = fetchedData[0]?.screenOperatingHours?.dayName.split(",");
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          console.log('fetchedData[0]?.screenOperatingHours', fetchedData[0]?.screenOperatingHours)
          const boolArr = daysOfWeek.map((day) => arr.includes(day));
          setSelectedOperatingHour(
            fetchedData[0]?.screenOperatingHours?.operatingType
          );
          setSelectedScreenType(
            fetchedData[0]?.screenType
          );
          if (fetchedData[0]?.screenOperatingHours?.operatingType !== "Always on") {
            setStartTime(extractTime(fetchedData[0]?.screenOperatingHours?.startTime));
            setEndTime(extractTime(fetchedData[0]?.screenOperatingHours?.endTime));
            setSelectedDays(boolArr);
          }
          handleFetchPreviewScreen(fetchedData[0]?.macid);
          setScreenData(fetchedData);
          setSelectScreenOrientation(fetchedData[0].screenOrientation);
          setOrientation(fetchedData[0].screenOrientation);
          setSelectScreenResolution(fetchedData[0].screenResolution);
          setSelectedTimezoneName(fetchedData[0].timeZone);
          setSelectedTag(fetchedData[0].tags);
          setGoogleLoc(fetchedData[0].googleLocation);
          setScreenName(fetchedData[0].screenName);
          setSelectedMediaDetailID(fetchedData[0].mediaDetailID);
          setSelectedMediaTypeID(fetchedData[0].mediaType);
          if (fetchedData[0].mediaType === 5) {
            setSelectedScreenTypeOption(String(fetchedData[0].mediaType - 1));
          } else {
            setSelectedScreenTypeOption(String(fetchedData[0].mediaType));
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // // load composition
    // dispatch(handleGetCompositions({ token }));

    // // get all assets files
    // dispatch(handleGetAllAssets({ token }));

    // // get all schedule
    // dispatch(handleGetAllSchedule({ token }));

    // get youtube data
    dispatch(handleGetYoutubeData({ token }));

    //get text scroll data
    dispatch(handleGetTextScrollData({ token }));
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
      .then(() => { })
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
    getScreenByid();

    // get all tags
    // axios
    //   .get(GET_ALL_TAGS, {
    //     headers: {
    //       Authorization: authToken,
    //     },
    //   })
    //   .then((response) => {
    //     const fetchedData = response.data.data;
    //     setTagsData(fetchedData);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  useEffect(() => {
    setAppDatas(allAppsData);
  }, [allAppsData]);

  const handleSelectedMedia = () => {
    let filteredData = [];

    switch (selectedmediaTypeID) {
      case 0:
        setSelectedDefaultAsset("Default Asset");
        break;

      case 1:
        filteredData = assetData?.filter(
          (item) => item?.assetID === selectedmediaDetailID
        );
        setSelectedAsset((prevAsset) => ({
          ...prevAsset,
          assetName: filteredData[0]?.assetName,
          assetID: filteredData[0]?.assetID,
        }));
        setAssetPreview(filteredData[0]);
        break;

      case 2:
        filteredData = scheduleData?.filter(
          (item) => item?.scheduleId === selectedmediaDetailID
        );
        setSelectedSchedule((prevSchedule) => ({
          ...prevSchedule,
          scheduleName: filteredData[0]?.scheduleName,
          scheduleId: filteredData[0]?.scheduleId,
        }));
        break;

      case 3:
        filteredData = compositionAPIData?.filter(
          (item) => item?.compositionID === selectedmediaDetailID
        );
        setSelectedComposition((prevComposition) => ({
          ...prevComposition,
          compositionName: filteredData[0]?.compositionName,
        }));
        break;

      case 4:
        filteredData =
          appDatas?.length > 0 &&
          appDatas?.filter(
            (item) => item?.textScroll_Id === selectedmediaDetailID
          );
        setSelectedTextScroll((prevTextScroll) => ({
          ...prevTextScroll,
          instanceName: filteredData[0]?.instanceName,
          scrollType: filteredData[0]?.scrollType,
        }));
        break;

      default:
        filteredData =
          appDatas?.length > 0 &&
          appDatas?.filter((item) => item?.youtubeId === selectedmediaDetailID);
        setSelectedYoutube((prevYoutube) => ({
          ...prevYoutube,
          instanceName: filteredData[0]?.instanceName,
          youTubePlaylist: filteredData[0]?.youTubePlaylist,
        }));
        break;
    }
  };

  useEffect(() => {
    handleSelectedMedia();
  }, [selectedmediaDetailID]);

  const handleFilter = (event, from) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setFilteredData(compositionAPIData);
    } else {
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
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleCompositionsAdd = (composition) => {
    setSelectedComposition(composition);
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
          // setScreenType(response?.data?.data[0]?.screenType);
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
      IsFromWeb: 1,
      SystemTimeZone: new Date()
        .toLocaleDateString(undefined, {
          day: "2-digit",
          timeZoneName: "long",
        })
        .substring(4),
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
          setCompositionData([]);
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
    // console.log(data,myComposition);
    const findCurrentSchedule = data?.find((item) => {
      // for schedule
      if (
        moment(moment().format("LLL")).isBetween(
          moment(item?.cStartDate).format("LLL"),
          moment(item?.cEndDate).format("LLL")
        ) ||
        (moment(moment().format("LLL")).isSameOrAfter(
          moment(item?.cStartDate).format("LLL")
        ) &&
          moment(moment().format("LLL")).isBefore(
            moment(item?.cEndDate).format("LLL")
          ))
      ) {
        return item;
      }
    });
    // for schedule set
    if (findCurrentSchedule !== undefined && findCurrentSchedule !== null) {
      setPlayerData(findCurrentSchedule);
      setSelectedDefaultAsset("");
      setCompositionData([]);
      return true;
    } else if (
      // for composition set
      (findCurrentSchedule === null || findCurrentSchedule === undefined) &&
      myComposition[0]?.compositionPossition?.length > 0
    ) {
      let obj = {};
      // if (previewModalData.length === 0) {
      //   handleFetchCompositionById(myComposition?.layoutID);
      // }
      for (const [
        key,
        value,
      ] of myComposition[0]?.compositionPossition?.entries()) {
        const arr = value?.schedules?.map((item) => {
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
      const newdd = Object.entries(obj)?.map(([k, i]) => ({ [k]: i }));
      if (compositionData?.length === 0) {
        setCompositionData(newdd);
        setAllCompositionData(newdd);
        setPlayerData(null);
        // setSelectedDefaultAsset("");
        // setSelectedAsset("");
        // setSelectedComposition("");
        // setSelectedApps("");
        // setSelectedSchedule("");
      }
      // else{
      //   setCompositionData(newdd);
      // }
      return true;
    } else {
      // for default media set
      const findDefaultAsset = data?.find(
        (item) => item?.isdefaultAsset == "true"
      );
      setPlayerData(findDefaultAsset);
      // setSelectedDefaultAsset("Default Asset");
      // setSelectedAsset("");
      // setSelectedComposition("");
      // setSelectedApps("");
      // setSelectedSchedule("");
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
    let screenOperatingHours = {
      screenOperatingHoursID: 0,
      screenID: 0,
      operatingType: selectedOperatingHour,
      startTime: selectedOperatingHour === "Custom" ? startTime : "00:00:00",
      endTime: selectedOperatingHour === "Custom" ? endTime : "00:00:00",
      dayName:
        selectedOperatingHour === "Custom"
          ? getTrueDays(selectedDays)?.join(",")
          : "",
    };
    let data = JSON.stringify({
      screenID: getScreenID,
      timeZone: selectedTimezoneName,
      screenOrientation: selectScreenOrientation,
      screenResolution: selectScreenResolution,
      mediaType: mediaType,
      tags: screenData[0]?.tags,
      mediaDetailID: moduleID || 0,
      screenName: screenName,
      operation: "Update",
      screenOperatingHours: screenOperatingHours,
      screenType: selectedScreenType
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
      .then((response) => {
        if (response?.data?.status === 200) {
          const Params = {
            id: socket.id,
            connection: socket.connected,
            macId: screenData[0]?.macid?.replace(/^\s+/g, ""),
          };
          socket.emit("ScreenConnected", Params);
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
                    screenData[0]?.macid.replace(/^\s+/g, "")
                  )
                  .then(() => {
                    console.log(
                      "SignalR method invoked after screen detail update"
                    );
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke(
                "ScreenConnected",
                screenData[0]?.macid.replace(/^\s+/g, "")
              )
              .then(() => {
                console.log(
                  "SignalR method invoked after screen detail update"
                );
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }

          navigate("/screens");

          toast.remove();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
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
      ...screenData[0],
      screenID: screenData[0]?.screenID,
      mediaType: mediaType,
      mediaDetailID: moduleID,
      operation: "Update",
    };
    toast.loading("Updating...");

    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: screenData[0]?.macid.replace(/^\s+/g, ""),
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
          getScreenByid();
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
            .invoke(
              "ScreenConnected",
              screenData[0]?.macid.replace(/^\s+/g, "")
            )
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
              //     getScreenByid()
              //   })
              //   .catch((error) => {
              //     toast.remove();
              //     console.log(error);
              //   });
            });
        });
    } else {
      connection
        .invoke("ScreenConnected", screenData[0]?.macid.replace(/^\s+/g, ""))
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
          //     getScreenByid()
          //   })
          //   .catch((error) => {
          //     toast.remove();
          //     console.log(error);
          //   });
        });
    }
    // }) .catch((error) => {
    //   console.error("Error invoking SignalR method:", error);
    // });
  };

  // console.log("selected asset",selectedAsset);
  // console.log("selected comp",selectedComposition);
  // console.log("selected schedule",selectedSchedule);
  // console.log("selected apps",selectedApps);
  // console.log("selected default",selectedDefaultAsset);

  const handleDayButtonClick = (index, item) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !selectedDays[index];
    const newSelectAllDays = newSelectedDays.every((day) => day === true);

    setSelectedDays(newSelectedDays);
  };

  const handleSaveOperatingHour = () => {
    setSelectedOperatingHourModel(false);
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
          // setAssetScreenID={setAssetScreenID}
          setSelectedAsset={setSelectedAsset}
          from="new_screen"
        />
      )}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
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

            <div className="relative screenplayer-section mx-auto">
              <div className="w-full h-full pb-5 mx-auto">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
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
                ) : (
                  compositionData?.length > 0 &&
                  !loading && (
                    <div
                      className={`relative z-0 mx-auto rounded-lg p-4
                    ${(orientation === 1 &&
                          "md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72") ||
                        (orientation === 2 &&
                          "rotate90 md:h-[576px] md:w-[576px] sm:h-[384px] sm:w-[384px] w-72 h-72") ||
                        (orientation === 3 &&
                          "rotate180 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72") ||
                        (orientation === 4 &&
                          "rotate270 md:h-[576px] md:w-[576px] sm:h-[384px] sm:w-[384px] w-72 h-72")
                        }
                    `}
                    >
                      {!fetchLayoutLoading &&
                        !loading &&
                        layotuDetails !== null &&
                        layotuDetails?.lstLayloutModelList.length > 0 &&
                        layotuDetails?.lstLayloutModelList?.map(
                          (data, index) => {
                            return (
                              <div
                                key={index}
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
                                  position: "absolute",
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
                                  isPlay={isPlay}
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
                  compositionData?.length === 0 &&
                  playerData !== null &&
                  playerData !== undefined &&
                  (Object.values(playerData).includes("Video") ||
                    Object.values(playerData).includes("OnlineVideo")) && (
                    <ReactPlayer
                      url={playerData?.fileType}
                      className={` ${(orientation === 1 &&
                        "md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72") ||
                        (orientation === 2 &&
                          "rotate90 md:h-[576px] md:w-[576px] sm:h-[384px] sm:w-[384px] w-72 h-72") ||
                        (orientation === 3 &&
                          "rotate180 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72") ||
                        (orientation === 4 &&
                          "rotate270 md:h-[576px] md:w-[576px] sm:h-[384px] sm:w-[384px] w-72 h-72")
                        } relative z-20 screenvideoinner`}
                      controls={true}
                      playing={true}
                      loop={true}
                    />
                  )}

                {!loading &&
                  compositionData?.length === 0 &&
                  playerData !== null &&
                  playerData !== undefined &&
                  (Object.values(playerData).includes("OnlineImage") ||
                    Object.values(playerData).includes("Image")) && (
                    <img
                      src={playerData?.fileType}
                      alt="Media"
                      className={` ${(orientation === 1 &&
                        "md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72") ||
                        (orientation === 2 &&
                          "rotate90 md:h-[576px] md:w-[576px] sm:h-[384px] sm:w-[384px] w-72 h-72") ||
                        (orientation === 3 &&
                          "rotate180 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72") ||
                        (orientation === 4 &&
                          "rotate270 md:h-[576px] md:w-[576px] sm:h-[384px] sm:w-[384px] w-72 h-72")
                        } mx-auto object-fill`}
                    />
                  )}
              </div>

              {showUploadAssestModal && <FileUpload />}

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
                                {scheduleData.length > 0 &&
                                  scheduleData.map((schedule) => (
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
                    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none myplaylist-popup">
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
                                                  className={`${selectedComposition?.compositionName ===
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
                            <p className="text-black text-left">
                              Content will always be playing Confirm
                            </p>
                            <p className="text-right">
                              {" "}
                              <button
                                className="bg-primary text-white rounded-full px-5 py-2"
                                onClick={() => {
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
            </div>

            <div className="grid grid-cols-12 screen-player-details min-w-full pb-7 sm:pb-0 border-b border-[#D5E3FF]">
              <div className="default-media w-full flex items-center xs-block justify-between bg-lightgray py-2 px-5 rounded-md lg:col-start-4 lg:col-span-6 md:col-start-3 md:col-span-8  sm:col-start-1 sm:col-span-12">
                <div className="w-full">
                  <p className="text-primary text-sm font-light">Now Playing</p>
                  <h4 className="text-primary text-lg">
                    {compositionData?.length > 0 &&
                      playerData === null &&
                      "Composition"}
                    {screenPreviewData?.data?.length > 1 &&
                      playerData !== null &&
                      "Schedule"}
                    {screenPreviewData?.data?.length === 1 &&
                      compositionData?.length === 0 &&
                      "Default Media"}
                  </h4>
                </div>
                <div className="w-full flex items-center gap-4 justify-end">
                  {!isPlay ? (
                    <button
                      data-tip
                      id="toggleButton"
                      data-for="Play"
                      type="button"
                      // className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                      onClick={() => {
                        // setIsPlay(!isPlay);
                        setIsPlay(prevIsPlay => !prevIsPlay);
                        const Params = {
                          play: isPlay,
                          macId: screenData[0]?.macid?.replace(/^\s+/g, ""),
                        };
                        socket.emit('play_pause', Params);
                        // socket.emit('updateTime', time);

                      }}
                    >
                      <FaPlayCircle size={24} />
                      <ReactTooltip
                        id="Play"
                        place="bottom"
                        type="warning"
                        effect="solid"
                      >
                        <span>Play</span>
                      </ReactTooltip>
                    </button>
                  ) : (
                    <button
                      data-tip
                      id="toggleButton"
                      data-for="Pause"
                      type="button"
                      // className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                      onClick={() => {
                        // setIsPlay(!isPlay);
                        setIsPlay(prevIsPlay => !prevIsPlay);
                        const Params = {
                          play: isPlay,
                          macId: screenData[0]?.macid?.replace(/^\s+/g, ""),
                        };
                        socket.emit('play_pause', Params);
                        // socket.emit('updateTime', time);
                      }}
                    >
                      <FaPauseCircle size={24} />
                      <ReactTooltip
                        id="Pause"
                        place="bottom"
                        type="warning"
                        effect="solid"
                      >
                        <span>Pause</span>
                      </ReactTooltip>
                    </button>
                  )}
                  <IoCloudUploadOutline
                    className="cursor-pointer"
                    size={24}
                    onClick={() => {
                      setShowAssetModal(true);
                      setSelectedDefaultAsset("");
                      setSetscreenMacID(screenData[0]?.macid);
                    }}
                  />
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
                    cellPadding={15}
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
                              <span
                                id={`changetvstatus${screen.macid}`}
                                className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
                                  ? "bg-[#3AB700]"
                                  : "bg-[#FF0000]"
                                  }`}
                              >
                                {screen.screenStatus == 1 ? "Live" : "offline"}
                                {/* {TvStatus} */}
                              </span>
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
                                {userDetails?.firstName} {userDetails?.lastName}
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
                    cellPadding={15}
                    className="w-full border-[#D5E3FF] border rounded-xl synctable responsive-table"
                    onClick={() => {
                      assetPreviewPopup && setAssetPreviewPopup(false);
                    }}
                  >
                    <tbody>
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left lg:py-3 md:py-2 pb-0 ">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base pb-0">
                            Screen Name:
                          </p>
                        </td>
                        <td className="text-left lg:py-3 md:py-2 pt-0">
                          <input
                            type="text"
                            className="border border-[#D5E3FF] rounded-full px-3 py-2.5 w-full "
                            onChange={(e) => {
                              setScreenName(e.target.value);
                            }}
                            value={screenName}
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left lg:py-3 md:py-2 pb-0">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Orientation:
                          </p>
                        </td>
                        <td className="text-left lg:py-3 md:py-2 pt-0">
                          <div className="flex lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                            {getScreenOrientation.length > 0 &&
                              getScreenOrientation.map((option) => (
                                <div
                                  key={option.orientationID}
                                  className="flex"
                                >
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
                        <td className="text-left lg:py-3 md:py-2 pb-0">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Resolution:
                          </p>
                        </td>
                        <td className="text-left lg:py-3 md:py-2 pt-0 pb-0">
                          <div className="flex lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                            {getScreenResolution.length > 0 &&
                              getScreenResolution.map((option) => (
                                <div
                                  key={option.resolutionsID}
                                  className="flex lg:py-3 md:py-2 pb-2"
                                >
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
                        <td className="text-left lg:py-3 md:py-2 pb-0">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Overwrite Time Zone:
                          </p>
                        </td>
                        <td className="text-left lg:py-3 md:py-2 pt-0">
                          <select
                            className="px-2 py-2 border border-[#D5E3FF] w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                            value={selectedTimezoneName}
                            onChange={(e) =>
                              setSelectedTimezoneName(e.target.value)
                            }
                          >
                            {timezones &&
                              timezones.map((timezone) => (
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

                      <tr className="border-b items-center border-[#D5E3FF]">
                        <td className="text-left lg:py-3 md:py-2 pt-1 pb-1">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Tags:
                          </p>
                        </td>
                        <td className="flex items-center gap-2 lg:py-3 md:py-2 pt-1 pb-1">
                          {((screenData.length > 0 &&
                            screenData[0]?.tags === "") ||
                            (screenData.length > 0 &&
                              screenData[0]?.tags === null)) && (
                              <span>
                                <AiOutlinePlusCircle
                                  size={30}
                                  className="cursor-pointer"
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
                        <td className="text-left lg:py-3 md:py-2 pb-0">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Operating Hours
                          </p>
                        </td>
                        <td className="text-left lg:py-3 md:py-2 pt-0">
                          <select
                            className="px-2 py-2 border border-[#D5E3FF] w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                            value={selectedOperatingHour}
                            onChange={(e) => {
                              if (e.target.value === "Custom") {
                                setSelectedOperatingHour(e.target.value);
                                setSelectedOperatingHourModel(true);
                              } else {
                                setSelectedOperatingHour(e.target.value);
                              }
                            }}
                          >
                            {Operating_hours &&
                              Operating_hours?.map((hour) => (
                                <option value={hour.value} key={hour.value}>
                                  {hour.value}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left lg:py-3 md:py-2 pb-0">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Screen Type
                          </p>
                        </td>
                        <td className="text-left lg:py-3 md:py-2 pt-0">
                          <select
                            className="px-2 py-2 border border-[#D5E3FF] w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                            value={selectedScreenType}
                            onChange={(e) => {
                              setSelectedScreenType(e.target.value);
                            }}
                          >
                            {Screen_Type &&
                              Screen_Type?.map((screen) => (
                                <option value={screen?.value} key={screen?.value}>
                                  {screen?.value}
                                </option>
                              ))}
                          </select>
                        </td>
                      </tr>

                      <tr className="border-b border-[#D5E3FF]">
                        <td className="text-left lg:py-3 md:py-2 pb-0">
                          <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                            Type
                          </p>
                        </td>
                        <td
                          className="text-left lg:py-3 md:py-2 pt-0 pb-0"
                        // onClick={() => setShowAssetModal(true)}
                        >
                          <div className="flex lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                            <label
                              onClick={() => {
                                setShowAssetModal(true);
                                setSelectedDefaultAsset("");
                                setSetscreenMacID(screenData[0]?.macid);
                              }}
                              htmlFor="select_asset"
                              className="flex items-center gap-1"
                            >
                              <input
                                type="radio"
                                // defaultChecked={selectedmediaTypeID !== 0}
                                checked={selectedDefaultAsset === ""}
                                name="type"
                                id="select_asset"
                              />
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
                              className="flex items-center gap-1 ml-3"
                            >
                              <input
                                type="radio"
                                name="type"
                                // defaultChecked={selectedmediaTypeID === 0}
                                checked={selectedDefaultAsset !== ""}
                                id="default_asset"
                              />
                              Default Asset
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="lg:py-3 md:py-2 pb-0"></td>
                        <td className="lg:py-3 md:py-2 pt-0">
                          <input
                            className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={
                              selectedAsset?.assetName ||
                              selectedComposition?.compositionName ||
                              selectedTextScroll?.instanceName ||
                              selectedYoutube?.instanceName ||
                              selectedDefaultAsset
                            }
                          />
                        </td>
                      </tr>
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

      {selectedOperatingHourModel && (
        <OperatingHourModal
          toggleModal={toggleModal}
          selectedDays={selectedDays}
          handleDayButtonClick={handleDayButtonClick}
          setSelectedHours={setSelectedHours}
          selectedHours={selectedHours}
          handleSaveOperatingHour={handleSaveOperatingHour}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          startTime={startTime}
          endTime={endTime}
        />
      )}
      {/* <Footer /> */}
    </>
  );
};

export default Screensplayer;
