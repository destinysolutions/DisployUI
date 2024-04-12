import React, { useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdArrowBackIosNew, MdSave } from "react-icons/md";
import { useState } from "react";
import SaveAssignScreenModal from "../ScreenAssignModal";
import Footer from "../Footer";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import ReactPlayer from "react-player";
import AssetModal from "../Screen/SubScreens/model/ShowMergeAssetModal";
import { useDispatch } from "react-redux";
import { connection } from "../../SignalR";
import { socket } from "../../App";
import { addData, getByIdData, resetStatus } from "../../Redux/WeatherSlice";
import { GET_SCEDULE_TIMEZONE, SET_TO_SCREEN_WEATHER } from "../../Pages/Api";
import axios from "axios";

const AddWeatherSchedule = ({ sidebarOpen, setSidebarOpen }) => {
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const store = useSelector((state) => state.root.weather);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const TodayDate = new Date();

  function getTimeFromDate(date) {
    const hours = String(date.getHours()).padStart(2, "0"); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure two digits
    const time = `${hours}:${minutes}`;
    return time;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const currentTime = getTimeFromDate(TodayDate);
  const currentDate = formatDate(TodayDate);

  const queryParams = new URLSearchParams(window.location.search);
  const weatherScheduleId = queryParams.get("weatherScheduleId");

  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [weatherScheduleName, setWeatherScheduleName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm")
  );
  const [edited, setEdited] = useState(false);
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [temperatureUnit, setTempratureUnit] = useState("C");
  const [isAbove, setIsAbove] = useState(true);
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [startTime, setStartTime] = useState(currentTime);
  const [endTime, setEndTime] = useState(currentTime);
  const [temperature, setTemprature] = useState("");
  const [searchParams] = useSearchParams();
  const getWeatherScheduleId = searchParams.get("weatherScheduleId");
  const [label, setLabel] = useState("Save");
  const [urlParth, setUrlParth] = useState({});
  const [selectedTimezoneName, setSelectedTimezoneName] = useState();
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });
  const [assetPreview, setAssetPreview] = useState("");
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [getTimezone, setTimezone] = useState([]);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [screenSelected, setScreenSelected] = useState([]);

  useEffect(() => {
    if (store && store.status === "succeeded") {
      toast.success(store.message);
      navigate("/weatherschedule");
      dispatch(resetStatus());
    }
  }, [store]);

  useEffect(() => {
    axios
      .get(GET_SCEDULE_TIMEZONE, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        setTimezone(response.data.data);
        const timezone = new Date()
          .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
          })
          .substring(4);
        setSelectedTimezoneName(timezone);
      })
  }, [])

  useEffect(() => {
    if (weatherScheduleId) {
      setLabel("Update");
      dispatch(getByIdData(weatherScheduleId)).then((items) => {
        const data = items.payload.data.model;
        if (data) {
          setWeatherScheduleName(data.name);
          setStartDate(moment(data.startDate).format("YYYY-MM-DD"));
          setEndDate(moment(data.endDate).format("YYYY-MM-DD"));
          setStartTime(data.startTime);
          setEndTime(data.endTime);
          setTempratureUnit(data.tempUnit);
          setTemprature(data.temperature);
          setIsAbove(data.isAbove);
          const timeZone = getTimezone?.filter((item) => item?.timeZoneID === data?.timeZoneID)
          setSelectedTimezoneName(timeZone?.[0]?.timeZoneName)
          setSelectedAsset({ assetName: data.assetName });
          setUrlParth({
            assetID: data.mediaID,
            assetFolderPath: data.assetFolderPath,
            assetType: data.assetType,
          });
        }
      });
    }
  }, [weatherScheduleId]);



  // Model Function
  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleSave = () => {
    setUrlParth({
      assetID: selectedAsset.assetID,
      assetFolderPath: selectedAsset.assetFolderPath,
      assetType: selectedAsset.assetType,
    });
  };

  const handleAssetUpdate = () => { };

  const handleSubmit = () => {
    const timeZone = getTimezone?.filter((item) => item?.timeZoneName === selectedTimezoneName)
    let data = {
      weatherSchedulingID: Number(weatherScheduleId) || 0,
      name: weatherScheduleName,
      mediaID: urlParth.assetID,
      mediaTypeID: 1,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      tempUnit: temperatureUnit,
      temperature: Number(temperature),
      isAbove: isAbove,
      timeZoneID: timeZone?.[0]?.timeZoneID,
    };
    dispatch(addData(data));
  };

  const handleUpdateScreenAssign = (screenIds, macids) => {
    let idS = "";
    let count = 0;

    for (const key in screenIds) {
      if (screenIds[key] === true) {
        if (count > 0) {
          idS += ",";
        }
        idS += key;
        count++;
      }
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SET_TO_SCREEN_WEATHER}?WeatherSchedulingId=${weatherScheduleId}&ScreenID=${idS}`,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    };

    toast.loading("Saving...");
    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          try {
            if (macids?.includes(",")) {
              let allMacIDs = macids?.split(",");
              allMacIDs?.map((item) => {
                let Params = {
                  id: socket.id,
                  connection: socket.connected,
                  macId: item,
                };
                socket.emit("ScreenConnected", Params);
              });
            } else {
              const Params = {
                id: socket.id,
                connection: socket.connected,
                macId: macids,
              };
              socket.emit("ScreenConnected", Params);
            }
            setTimeout(() => {
              toast.remove();
              setSelectScreenModal(false);
              setAddScreenModal(false);
            }, 2000);
            if (connection.state == "Disconnected") {
              connection
                .start()
                .then((res) => {
                  console.log("signal connected");
                })
                .then(() => {
                  connection
                    .invoke("ScreenConnected", macids)
                    .then(() => {
                      console.log("func. invoked");
                    })
                    .catch((err) => {
                      toast.remove();
                      toast.error("Something went wrong, try again");
                    });
                });
            } else {
              connection
                .invoke("ScreenConnected", macids)
                .then(() => {
                  console.log("func. invoked");
                })
                .catch((err) => {
                  toast.remove();
                  toast.error("Something went wrong, try again");
                });
            }
          } catch (error) {
            toast.error("Something went wrong, try again");
            toast.remove();
          }
        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handleTimezoneSelect = (e) => {
    setSelectedTimezoneName(e.target.value);
  };

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-24 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <div className="flex items-center">
              {edited ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full border border-primary rounded-md px-2 py-1 capitalize"
                    placeholder="Enter schedule name"
                    value={weatherScheduleName}
                    onChange={(e) => {
                      setWeatherScheduleName(e.target.value);
                    }}
                  />
                  <button data-tip data-for="Save">
                    <MdSave
                      onClick={() => handleSubmit()}
                      className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                    />
                    <ReactTooltip
                      id="Save"
                      place="bottom"
                      type="warning"
                      effect="solid"
                    >
                      <span>Save</span>
                    </ReactTooltip>
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                    {weatherScheduleName}
                  </h1>
                  <button
                    onClick={() => setEdited(true)}
                    data-tip
                    data-for="Edit Weather Schedule Name"
                  >
                    <GoPencil className="ml-4 text-lg" />
                    <ReactTooltip
                      id="Edit Weather Schedule Name"
                      place="bottom"
                      type="warning"
                      effect="solid"
                    >
                      <span>Edit Weather Schedule Name</span>
                    </ReactTooltip>
                  </button>
                </div>
              )}
            </div>
            <Link to="/weatherschedule">
              <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <MdArrowBackIosNew className="text-2xl mr-2 text-white rounded-full p-1" />
                Back
              </button>
            </Link>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-12 gap-4 ">
              <div className="lg:col-span-6 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5">
                <div>
                  <label className="text-base font-medium">
                    TimeZone : </label>
                  <select
                    className="w-full paymentlabel relative"
                    value={selectedTimezoneName}
                    onChange={(e) => handleTimezoneSelect(e)}
                  >
                    {getTimezone.map((timezone) => (
                      <option
                        value={timezone.timeZoneName}
                        key={timezone.timeZoneID}
                      >
                        {timezone.timeZoneName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center p-2">
                  <label className="text-base font-medium">
                    Asset / Playing :
                  </label>
                  <div className="p-2 ml-4" style={{ wordBreak: "break-all" }}>
                    <div
                      onClick={(e) => {
                        setShowAssetModal(true);
                      }}
                      className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      <p className="line-clamp-1">
                        {selectedAsset.assetName
                          ? selectedAsset.assetName
                          : "Select Asset Name"}
                      </p>
                      <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium">
                    Duration Date:
                  </label>
                  <div class="grid gap-4 grid-cols-2">
                    <div>
                      <label className="text-base font-medium">
                        Start Date:
                      </label>
                      <input
                        data-tip
                        data-for="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-[#D5E3FF] px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-base font-medium">End Date:</label>
                      <input
                        data-tip
                        data-for="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-[#D5E3FF] px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-base font-medium">
                    Duration Time:
                  </label>
                  <div class="grid gap-4 grid-cols-2">
                    <div>
                      <label className="text-base font-medium">
                        Start Time :
                      </label>
                      <input
                        data-tip
                        data-for="Start Time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border border-[#D5E3FF] px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-base font-medium">End Time:</label>
                      <input
                        data-tip
                        data-for="End Time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border border-[#D5E3FF] px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-base font-medium">
                    Temperature Unit :
                  </label>
                  <div class="grid grid-cols-4 gap-4">
                    <div>
                      <input
                        className="block w-full p-2 text-gray-900 border border-gray-300  bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        type="number"
                        value={temperature}
                        onChange={(e) => {
                          setTemprature(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex">
                      <div className="ml-2 flex items-center">
                        <input
                          type="radio"
                          value={temperatureUnit}
                          checked={temperatureUnit === "C"}
                          name="Cel"
                          onChange={() => setTempratureUnit("C")}
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                          ℃
                        </label>
                      </div>
                      <div className="ml-3 flex items-center">
                        <input
                          type="radio"
                          value={temperatureUnit}
                          checked={temperatureUnit === "F"}
                          name="Cel"
                          onChange={() => setTempratureUnit("F")}
                        />
                        <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                          ℉
                        </label>
                      </div>
                    </div>
                    <div className="flex">
                      <input
                        type="radio"
                        name="Above_Below"
                        value={isAbove}
                        checked={isAbove == true}
                        onChange={() => setIsAbove(true)}
                      />
                      <label className="ml-3 lg:text-base md:text-base sm:text-xs xs:text-xs font-medium">
                        play When temp goes above:
                      </label>
                    </div>
                    <div className="flex">
                      <input
                        type="radio"
                        name="Above_Below"
                        onChange={() => setIsAbove(false)}
                        checked={isAbove == false}
                        value={isAbove}
                      />
                      <label className="ml-3 lg:text-base md:text-base sm:text-xs xs:text-xs font-medium">
                        play When temp goes Below:
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-9">
                    <button
                      className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                      onClick={() => handleSubmit()}
                    >
                      {label}
                    </button>
                    {weatherScheduleId && (
                      <button
                        className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                        onClick={() => setSelectScreenModal(true)}
                      >
                        Save & Assign screen
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 relative md:h-[324px] sm:h-[216px] lg:h-[540px] w-full h-72">
                <div className="videoplayer relative bg-white w-full h-full">
                  {urlParth.assetType === 'OnlineImage' && (
                    <div className="flex items-center justify-center h-full">
                      <img src={urlParth.assetFolderPath} className="m-auto" />
                    </div>
                  )}

                  {urlParth.assetType === "Image" && (
                    <div className="flex items-center justify-center h-full">
                      <img src={urlParth.assetFolderPath} className="m-auto" />
                    </div>
                  )}

                  {urlParth.assetType === "Video" && (
                    <ReactPlayer
                      url={urlParth.assetFolderPath}
                      width={"100%"}
                      height={"100%"}
                      className="w-full relative z-20 videoinner"
                      controls={true}
                    />
                  )}

                  {urlParth.assetType === "OnlineVideo" && (
                    <ReactPlayer
                      url={urlParth.assetFolderPath}
                      width={"100%"}
                      height={"100%"}
                      className="w-full relative z-20 videoinner"
                      controls={true}
                    />
                  )}

                  {urlParth.assetType === "Youtube" && (
                    <ReactPlayer
                      url={urlParth.assetFolderPath}
                      width={"100%"}
                      height={"100%"}
                      className="w-full relative z-20 videoinner"
                      controls={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAssetModal && (
        <AssetModal
          handleAssetAdd={handleAssetAdd}
          popupActiveTab={popupActiveTab}
          setAssetPreviewPopup={setAssetPreviewPopup}
          setPopupActiveTab={setPopupActiveTab}
          setShowAssetModal={setShowAssetModal}
          assetPreviewPopup={assetPreviewPopup}
          assetPreview={assetPreview}
          handleAssetUpdate={handleAssetUpdate}
          selectedAsset={selectedAsset}
          type="Weather"
          handleSave={handleSave}
        />
      )}

      {selectScreenModal && (
        <SaveAssignScreenModal
          setAddScreenModal={setAddScreenModal}
          setSelectScreenModal={setSelectScreenModal}
          handleUpdateScreenAssign={handleUpdateScreenAssign}
          selectedScreens={selectedScreens}
          setSelectedScreens={setSelectedScreens}
          screenSelected={screenSelected}
        />
      )}

      <Footer />
    </>
  );
};

export default AddWeatherSchedule;
