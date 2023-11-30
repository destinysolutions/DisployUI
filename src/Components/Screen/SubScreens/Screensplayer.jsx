import { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "../../../Styles/screen.css";
import { IoMdRefresh } from "react-icons/io";
import { MdArrowBackIosNew } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdElectricBolt } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import { FiPlus } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Footer from "../../Footer";
import {
  GET_ALL_FILES,
  GET_ALL_SCREEN_ORIENTATION,
  GET_ALL_TAGS,
  GET_CURRENT_ASSET,
  GET_SCREEN_TIMEZONE,
  SCREEN_PREVIEW,
  SELECT_BY_SCREENID_SCREENDETAIL,
  UPDATE_NEW_SCREEN,
} from "../../../Pages/Api";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import Carousel from "../../Composition/DynamicCarousel";
import toast from "react-hot-toast";
const Screensplayer = ({ sidebarOpen, setSidebarOpen }) => {
  Screensplayer.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [searchParams] = useSearchParams();
  const getScreenID = searchParams.get("screenID");
  const [screenData, setScreenData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [getScreenOrientation, setScreenOrientation] = useState([]);
  const [getTimezone, setTimezone] = useState([]);
  const [selectScreenOrientation, setSelectScreenOrientation] = useState();
  const [selectedTag, setSelectedTag] = useState("");
  const [tagsData, setTagsData] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState("");
  const [googleLoc, setGoogleLoc] = useState("");
  // swich on-off
  const [enabled, setEnabled] = useState(false);
  const [mediadw, setMediadw] = useState(false);
  const [showhoursModal, setshowhoursModal] = useState(false);
  const [hoursdw, setshowhoursdw] = useState(false);
  const [paymentpop, setPaymentpop] = useState(false);
  const [toggle, setToggle] = useState(1);
  const [sync, setsyncToggle] = useState(1);
  const [playerData, setPlayerData] = useState();
  const [buttonStates, setButtonStates] = useState(Array(3).fill(false));
  const [screenPreviewData, setScreenPreviewData] = useState({
    data: [],
    myComposition: [],
  });
  const [compositionData, setCompositionData] = useState([]);

  let currentDate = new Date();
  let formatedate = moment(currentDate).format("YYYY-MM-DD hh:mm");

  const isVideo = playerData && /\.(mp4|webm|ogg)$/i.test(playerData);

  const buttons = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // console.log("formatedate", formatedate);

  function handleScreenOrientationRadio(e, optionId) {
    setSelectScreenOrientation(optionId);
  }

  function updatetoggle(id) {
    setToggle(id);
  }

  function updatesynctoggle(id) {
    setsyncToggle(id);
  }

  const handleButtonClick = (index) => {
    setButtonStates((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleFetchPreviewScreen = async (macId) => {
    // console.log(macId);
    let data = JSON.stringify({
      // tempId: 0,
      // otp: "string",
      // googleLocation: "string",
      // timeZone: "string",
      // screenOrientation: "string",
      // screenResolution: "string",
      // screenID: 0,
      // macid: "76:39:AB:FA:C1:7A",
      macid: macId,
      // ipAddress: "string",
      // postalCode: "string",
      // latitude: "string",
      // longitude: "string",
      // userID: 0,
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

    toast.loading("Fetching Data...");
    await axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const { data, myComposition } = response?.data;
          setScreenPreviewData({ data, myComposition });
          handleChangePreviewScreen();
          // console.log(response?.data);
          toast.remove();
        }
        // if (response?.data?.data.length > 1) {
        //   // find current schedule & set data
        //   console.log(data);
        // } else {
        //   console.log(data);
        //   // set default assest
        // }
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  function handleChangePreviewScreen() {
    const { data, myComposition } = screenPreviewData;

    const findCurrentSchedule = data.find((item) => {
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
      return setPlayerData(findCurrentSchedule?.fileType);
    } else if (myComposition[0]?.compositionPossition.length > 0) {
      let obj = {};
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
        // console.log(arr);
        obj[key + 1] = [...arr];
      }
      const newdd = Object.entries(obj).map(([k, i]) => ({ [k]: i }));
      return setCompositionData(newdd);
    } else {
      const findDefaultAsset = data.find(
        (item) => item?.isdefaultAsset == "true"
      );
      return setPlayerData(findDefaultAsset?.fileType);
    }
    // if (data.length > 1 || myComposition[0]?.compositionPossition.length > 0) {
    // }
    //  else {
    //   const findDefaultAsset = data.find(
    //     (item) => item?.isdefaultAsset == "true"
    //   );
    //   console.log(findDefaultAsset);
    //   if (findDefaultAsset) {
    //     return setPlayerData(findDefaultAsset?.fileType);
    //   }
    // }
  }

  var interval;

  function runFunEverySecForPreview() {
    // if (
    //   screenPreviewData.data.length === 0 &&
    //   screenPreviewData.myComposition[0]?.compositionPossition === 0
    // ) {
    //   return true;
    // }
    interval = window.setInterval(() => {
      handleChangePreviewScreen();
    }, 1000);
  }

  useEffect(() => {
    runFunEverySecForPreview();
    return () => {
      clearInterval(interval);
    };
  }, [screenPreviewData]);

  const handleScreenDetail = () => {
    if (getScreenID) {
      const {
        otp,
        screenResolution,
        macid,
        ipAddress,
        postalCode,
        latitude,
        longitude,
        userID,
        tvTimeZone,
        tvScreenOrientation,
        tvScreenResolution,
        screenName,
        mediaDetailID,
        mediaType,
        googleLocation,
      } = getScreenID;

      let data = JSON.stringify({
        screenID: getScreenID,
        otp,
        timeZone: selectedTimezoneName,
        screenOrientation: selectScreenOrientation,
        screenResolution,
        macid,
        ipAddress,
        postalCode,
        latitude,
        longitude,
        userID,
        mediaType,
        tags: selectedTag,
        mediaDetailID,
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
          Authorization: authToken,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log("response", response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.error("Screen not update");
    }
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
      .then((response) => {
        // setPlayerData(response.data.data[0].fileType);
        // console.log(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Define an array of axios requests
    const axiosRequests = [
      axios.get(GET_ALL_FILES, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_SCREEN_ORIENTATION, {
        headers: { Authorization: authToken },
      }),
      axios.get(GET_SCREEN_TIMEZONE, { headers: { Authorization: authToken } }),
    ];

    // Use Promise.all to send all requests concurrently
    Promise.all(axiosRequests)
      .then((responses) => {
        const [filesResponse, screenOrientationResponse, timezoneResponse] =
          responses;

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

        setScreenOrientation(screenOrientationResponse.data.data);

        setTimezone(timezoneResponse.data.data);
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
        handleFetchPreviewScreen(fetchedData[0]?.macid);
        setScreenData(fetchedData);
        setSelectScreenOrientation(fetchedData[0].screenOrientation);
        setSelectedTimezoneName(fetchedData[0].timeZone);
        setSelectedTag(fetchedData[0].tags);
        setGoogleLoc(fetchedData[0].googleLocation);
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

  const heightOfDiv = compositionData.reduce((acc, curr) => {
    let height = 0;
    for (const iterator in curr) {
      if (curr[iterator][0]?.left === 0) {
        height += curr[iterator][0]?.height;
      }
    }
    return acc + height;
  }, 0);

  const widthOfDiv = compositionData.reduce((acc, curr) => {
    let width = 0;
    for (const iterator in curr) {
      if (curr[iterator][0]?.top === 0) {
        width += curr[iterator][0]?.width;
      }
    }
    return acc + width;
  }, 0);

  // console.log(screenData);
  // console.log(playerData);
  // console.log(screenPreviewData.myComposition);
  // console.log(compositionData.map((item, i) => item[i]));
  // console.log(compositionData);
  // console.log(screenPreviewData.data.length);

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="pt-6 lg:px-5 md:px-5 sm:px-2 xs:px-1">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="justify-between flex items-center xs-block">
              <div className="section-title">
                <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl sm:mb-4  text-[#001737]">
                  Screen Player
                </h1>
              </div>
              <div className="icons flex  items-center">
                <div>
                  <Link to={"../screens"}>
                    <button className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                      <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                    </button>
                  </Link>
                </div>
                {/* <div>
                  <button className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                    <IoMdRefresh className="p-1 px-2 text-4xl text-white hover:text-white" />
                  </button>
                </div> */}

                {/* <div>
                  <div>
                    <button className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                      <RiDeleteBin5Line className="p-1 px-2 text-4xl text-white hover:text-white" />
                    </button>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="relative bg-white shadow-lg rounded-e-md screenplayer-section">
              <div className="screen-palyer-img ">
                {/* playerData && isVideo ? (
                  <ReactPlayer
                    url={playerData}
                    className="max-w-full max-h-full reactplayer min-w-full"
                    controls={true} // Add controls for video
                    width="100%"
                    height="100%"
                  />
                ) : */}
                {compositionData.length > 0 ? (
                  <div
                    className="relative z-0 border-2 border-black/10 rounded-lg p-4"
                    style={{
                      height: heightOfDiv + "px",
                      width: widthOfDiv + "px",
                    }}
                  >
                    {compositionData.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="absolute "
                          // className="w-full h-full"
                          style={{
                            width:
                              compositionData[index][index + 1][0]?.width +
                              "px",
                            height:
                              compositionData[index][index + 1][0]?.height +
                              "px",
                            top:
                              compositionData[index][index + 1][0]?.top + "px",
                            left:
                              compositionData[index][index + 1][0]?.left + "px",
                          }}
                        >
                          <Carousel
                            from="screen"
                            items={compositionData[index][index + 1]}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <img
                    src={playerData}
                    alt="Media"
                    className="max-w-full max-h-full min-h-[10rem] min-w-[10rem]"
                  />
                )}
              </div>

              <div className="grid  grid-cols-12 screen-player-details pb-7 sm:pb-0 border-b border-[#D5E3FF]">
                <div className="default-media flex items-center xs-block justify-between bg-lightgray py-2 px-5 rounded-md lg:col-start-4 lg:col-span-6 md:col-start-3 md:col-span-8  sm:col-start-1 sm:col-span-12">
                  <div>
                    <p className="text-primary text-sm font-light">
                      Now Playing
                    </p>
                    <h4 className="text-primary text-lg">
                      {compositionData.length > 0 &&
                        screenPreviewData.data.length === 1 &&
                        "Composition"}
                      {screenPreviewData.data.length > 1 && "Schedule"}
                      {screenPreviewData.data.length === 1 &&
                        compositionData.length === 0 &&
                        "Default Media"}
                    </h4>
                  </div>

                  {/* <div className="relative">
                    <div className="relative">
                      <button
                        className="bg-white p-1 rounded-md shadow mr-2 hover:bg-SlateBlue relative"
                        onClick={() => setMediadw((prev) => !prev)}
                      >
                        <HiOutlineChevronDown className="text-primary text-lg hover:text-white" />
                      </button>
                      <button className="bg-white p-1 rounded-md shadow hover:bg-SlateBlue">
                        <AiOutlineCloudUpload className="text-primary text-lg hover:text-white" />
                      </button>
                    </div>
                    {mediadw && (
                      <div className="mediadw">
                        <ul>
                          <li className="flex text-sm  items-center">
                            <MdElectricBolt className="mr-2 text-lg" />
                            Default Media
                          </li>
                          <li className="flex text-sm items-center">
                            <AiOutlineCloudUpload className="mr-2 text-lg" />
                            Browse More
                          </li>
                        </ul>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>

              <div className="grid  grid-cols-12">
                <div className="lg:col-start-4 lg:col-span-6 md:col-start-1 md:col-span-12  sm:col-start-1 sm:col-span-12 text-center">
                  <ul className="inline-flex items-center justify-center border border-gray rounded-full my-4 shadow-xl">
                    <li className="text-sm firstli">
                      {" "}
                      <button
                        className={toggle === 1 ? "tabshow tabactive" : "tab"}
                        onClick={() => updatetoggle(1)}
                      >
                        Info
                      </button>
                    </li>
                    <li className="text-sm">
                      {" "}
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
                              <td className="text-right lg:w-2/4 md:w-2/4 sm:w-full">
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
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Screen Details:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Sony, S01-5000035, 5120 x 2880, (Ultrawide 5K)
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
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
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Operating System:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Apple TV
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
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
                              <td className="text-right">
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
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Tags:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  {screen.tags}
                                </p>
                              </td>
                            </tr>
                            {/* <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Connected Since:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Jun 5, 2023, 8:16 PM
                                </p>
                              </td>
                            </tr> */}
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
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
                            {/* <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Operating Hours:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Always on
                                </p>
                              </td>
                            </tr> */}
                            {/* <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  payment method:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  **** **** **** 2222
                                </p>
                              </td>
                            </tr> */}

                            {/* <tr>
                          <td colSpan={2}>
                            <div className="flex items-center justify-center">
                              {" "}
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mr-2">
                                Do you want to run the App at boot up time :
                              </p>
                              <label className="inline-flex relative items-center  cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={enabled}
                                  readOnly
                                />
                                <div
                                  onClick={() => {
                                    setEnabled(!enabled);
                                  }}
                                  className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                                    enabled
                                      ? " bg-gray text-left pl-2 text-white text-sm"
                                      : "bg-gray text-right pr-2 text-white text-sm"
                                  }`}
                                >
                                  {enabled ? "On" : "Off"}
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr> */}
                          </tbody>
                        ))}
                    </table>
                    {/* <div className="text-right my-5">
                      <button className="bg-primary text-base px-5 py-2 rounded-full text-white">
                        Save
                      </button>
                    </div> */}
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
                    >
                      <tbody>
                        <tr className="border-b border-[#D5E3FF]">
                          <td className="lg:text-right md:text-right sm:text-left xs:text-left lg:w-2/4  md:w-2/4 sm:w-full">
                            <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                              Orientation:
                            </p>
                          </td>
                          <td className="text-left">
                            <div className="flex lg:justify-center md:justify-start sm:justify-start xs:justify-start lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                              {getScreenOrientation.map((option) => (
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
                        <tr>
                          {/* <td className="lg:text-right md:text-right sm:text-left xs:text-left pb-0">
                            <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                              Playback Mode:
                            </p>
                          </td> */}
                          {/* <td className="text-left pb-0">
                            <ul className="inline-flex items-center justify-center  my-4 lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                              <li className="text-sm">
                                {" "}
                                <button
                                  className={
                                    sync === 1
                                      ? "tabsyncshow tabsyncactive"
                                      : "synctab "
                                  }
                                  onClick={() => updatesynctoggle(1)}
                                >
                                  sync
                                </button>
                              </li>
                              <li className="text-sm">
                                {" "}
                                <button
                                  className={
                                    sync === 2
                                      ? "tabsyncshow tabsyncactive"
                                      : "synctab "
                                  }
                                  onClick={() => updatesynctoggle(2)}
                                >
                                  Unsync
                                </button>
                              </li>
                            </ul>
                          </td> */}
                        </tr>
                        <tr
                        // className={
                        //   sync === 1
                        //     ? "show-togglesynccontent active w-full"
                        //     : "togglesynccontent"
                        // }
                        >
                          <td colSpan={2}>
                            <table
                              cellPadding={10}
                              className="sync-table w-full responsive-table"
                            >
                              <tbody>
                                {/* <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-center pt-0" colSpan={2}>
                                    <p className="text-primary text-sm font-medium">
                                      Sync mode will keep your screens in sync
                                      with each other when playing the same
                                      content
                                    </p>
                                  </td>
                                </tr> */}
                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Google Location:
                                    </p>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      //placeholder="132, My Street, Kingston, New York..."
                                      value={googleLoc}
                                      readOnly
                                    />
                                  </td>
                                </tr>

                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Overwrite Time Zone:
                                    </p>
                                  </td>
                                  <td className="relative">
                                    <select
                                      className="relative"
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

                                {/* <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Screen Group:
                                    </p>
                                  </td>
                                  <td>
                                    <select>
                                      <option>Ungrouped</option>
                                      <option>grouped</option>
                                    </select>
                                  </td>
                                </tr> */}

                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Tags
                                    </p>
                                  </td>
                                  <td>
                                    <select
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
                                    </select>
                                  </td>
                                </tr>

                                {/* <tr className="border-b border-[#D5E3FF] relative">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Operating Hours:
                                    </p>
                                  </td>
                                  <td>
                                    <div className="paymentlabel relative">
                                      <span
                                        className="flex justify-between"
                                        onClick={() => setshowhoursdw(!hoursdw)}
                                      >
                                        <label> Operating Hours</label>
                                        <MdOutlineKeyboardArrowDown className=" text-xl font-black cursor-pointer" />
                                      </span>
                                    </div>
                                    {hoursdw && (
                                      <div className="hoursdw relative">
                                        <ul className=" absolute top-0 left-0 bg-white rounded-xl w-full drop-shadow-xl z-10 border-[#ddd] border">
                                          <li className="px-3 py-1 text-sm hover:rounded-tl-xl hover:rounded-tr-xl text-left">
                                            Always On
                                          </li>
                                          <li
                                            className="px-3  py-1 text-sm  hover:rounded-bl-xl hover:rounded-br-xl text-left"
                                            onClick={() =>
                                              setshowhoursModal(true)
                                            }
                                          >
                                            <button>Custom</button>
                                          </li>
                                        </ul>
                                      </div>
                                    )}
                                  </td>
                                </tr> */}

                                {showhoursModal && (
                                  <>
                                    <div className="backdrop">
                                      <div className="hours-model rounded-lg">
                                        <div className="hours-heading flex  justify-between items-center p-5 border-b border-gray">
                                          <h1>Custom Operating Hours</h1>
                                          <AiOutlineCloseCircle
                                            className="text-primary text-3xl"
                                            onClick={() =>
                                              setshowhoursModal(false)
                                            }
                                          />
                                        </div>
                                        <hr className="border-gray " />
                                        <div className="model-body lg:p-5 md:p-5 sm:p-5 xs:p-4 ">
                                          <div className="model-details shadow-2xl lg:p-3 md:p-5 sm:p-5 xs:py-3 xs:px-1 text-left rounded-2xl">
                                            <label className="text-base font-medium">
                                              Hours:
                                            </label>
                                            <div className="flex justify-between items-center mt-3">
                                              <input
                                                type="time"
                                                placeholder="From Time"
                                              />
                                              <label className="lg:px-3 md:px-3 sm:px-1 xs:px-1 text-base">
                                                To
                                              </label>
                                              <input
                                                type="time"
                                                placeholder="To Time"
                                              />
                                            </div>
                                            <div className="pt-5 text-center">
                                              {buttons.map((label, index) => (
                                                <button
                                                  className="daysbtn"
                                                  key={index}
                                                  onClick={() =>
                                                    handleButtonClick(index)
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      buttonStates[index]
                                                        ? "#fff"
                                                        : " #00072e",
                                                    color: buttonStates[index]
                                                      ? "#41479b"
                                                      : "#fff",
                                                  }}
                                                >
                                                  {label}
                                                </button>
                                              ))}
                                            </div>

                                            <div className="formgroup lg:flex md:flex sm:flex xs:block justify-between items-center mt-5">
                                              <label className="lg:text-base md:text-base sm:text-base xs:text-xs  lg:ml-0 md:ml-0 sm:ml-0  xs:ml-3 font-medium mr-3">
                                                Action
                                              </label>
                                              <select>
                                                <option>Select Action</option>
                                                <option>Shut Down</option>
                                                <option>Sleep</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right mt-0 pr-5">
                                          <button className="bg-primary  text-white lg:px-8 md:px-8 sm:px-5 xs:px-5 lg:py-3 md:py-3 sm:py-2 xs:py-2 text-base rounded-full mb-5 drop-shadow-xl ">
                                            Apply
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {/* 
                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Payment method:
                                    </p>
                                  </td>
                                  <td className="relative">
                                    <div className="paymentlabel relative">
                                      <span
                                        className="flex justify-between"
                                        onClick={() =>
                                          setPaymentpop(!paymentpop)
                                        }
                                      >
                                        <label>Select Card</label>
                                        <MdOutlineKeyboardArrowDown className=" text-xl font-black cursor-pointer" />
                                      </span>

                                      {paymentpop && (
                                        <div className="payment-dropdown">
                                          <ul>
                                            <li className="flex items-center justify-between my-3 p-2  border-2 rounded-md border-[#E4E6FF] ">
                                              <label className="lg:flex md:flex sm:block xs:block items-center lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                                <img
                                                  src="../../../../ScreenImg/logos_mastercard.png"
                                                  className="mr-3"
                                                />
                                                Axis Bank **** **** **** 8395
                                              </label>
                                              <input
                                                type="radio"
                                                name="payment"
                                                id="1"
                                              />
                                            </li>
                                            <li className="flex items-center justify-between my-3 p-2 border-2 rounded-md border-[#E4E6FF]">
                                              <label className="lg:flex md:flex sm:block xs:block items-center lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                                <img
                                                  src="../../../../ScreenImg/Vector(3).png"
                                                  className="mr-3"
                                                />
                                                HDFC Bank **** **** **** 6246
                                              </label>{" "}
                                              <input
                                                type="radio"
                                                name="payment"
                                                id="2"
                                              />
                                            </li>
                                            <li className="border-2 my-1 p-2 rounded-md border-[#E4E6FF]">
                                              <button className="flex items-center">
                                                <FiPlus className="bg-lightgray text-SlateBlue text-2xl p-1 rounded-md mr-3" />
                                                <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                                  Add New Card
                                                </span>
                                              </button>
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr> */}

                                {/* <tr>
                                  <td colSpan={2}>
                                    <div className="flex items-center justify-center">
                                      {" "}
                                      <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mr-2">
                                        Do you want to run the App at boot up
                                        time :
                                      </p>
                                      <label className="inline-flex relative items-center  cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className="sr-only peer"
                                          checked={enabled}
                                          readOnly
                                        />
                                        <div
                                          onClick={() => {
                                            setEnabled(!enabled);
                                          }}
                                          className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                                            enabled
                                              ? " bg-gray text-left pl-2 text-white text-sm"
                                              : "bg-gray text-right pr-2 text-white text-sm"
                                          }`}
                                        >
                                          {enabled ? "On" : "Off"}
                                        </div>
                                      </label>
                                    </div>
                                  </td>
                                </tr> */}
                              </tbody>
                            </table>
                            <div className="text-right mt-3">
                              <button
                                onClick={handleScreenDetail}
                                className="bg-primary text-base px-5 py-2 rounded-full text-white hover:bg-SlateBlue"
                              >
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <Footer />
    </>
  );
};

export default Screensplayer;
