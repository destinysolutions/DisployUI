import React, { useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { TbAppsFilled } from "react-icons/tb";
import { BsInfoLg } from "react-icons/bs";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import {
  GET_All_WEATHER,
  GET_WEATHER_BY_ID,
  SIGNAL_R,
  WEATHER_ADD_TAG,
  WEATHER_APP,
  WEATHER_ASSIGN_SECREEN,
} from "../../Pages/Api";
import axios from "axios";
import { useState } from "react";
import Weather_Img from "../../images/AppsImg/weather-icon.svg";
import { MdOutlineEdit } from "react-icons/md";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import ScreenAssignModal from "../ScreenAssignModal";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { LogLevel } from "@azure/msal-browser";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import moment from "moment";
import ReactApexChart from "react-apexcharts";

const Weather = ({ sidebarOpen, setSidebarOpen }) => {
  let api_key = "41b5176532e682fd8b4cb6a44e3bd1a4";
  const { token } = useSelector((state) => state.root.auth);
  const { user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const appDropdownRef = useRef(null);
  const addScreenRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const currentTime = moment().format("hh:mm A");

  const [WeatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [instanceID, setInstanceID] = useState();
  const [appDropDown, setAppDropDown] = useState(null);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const selectedScreenIdsString = Array.isArray(selectedScreens)
    ? selectedScreens.join(",")
    : "";
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [connection, setConnection] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [updateTagWeather, setUpdateTagWeather] = useState(null);
  const [tags, setTags] = useState([]);
  const [appDetailModal, setAppDetailModal] = useState(false);
  const [instanceView, setInstanceView] = useState(false);
  const [showTags, setShowTags] = useState(null);
  const [screenAssignName, setScreenAssignName] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [weatherData, setWeatherData] = useState("");
  const [loadFirst, setLoadFirst] = useState(false);

  const [locations, setLocations] = useState([
    { id: 1, location: "", weatherData: null, mainData: null },
    { id: 2, location: "", weatherData: null, mainData: null },
    { id: 3, location: "", weatherData: null, mainData: null },
  ]);
  console.log("locations", locations);
  const [GPS, setGPS] = useState({
    latitude: null,
    longitude: null,
  });
  const [temperatureUnit, setTemperatureUnit] = useState("");
  const [tickerTapeView, setTickerTapeView] = useState("");
  const [BackGround, setBackGround] = useState("");
  const [Layout, setLayout] = useState("");
  console.log("Layout", Layout);
  const [isMuted, setIsMuted] = useState(false);
  const [count, setCount] = useState(0);
  console.log("count", count);

  useEffect(() => {
    if (!isMuted) {
      locations?.map((item) => {
        if (item?.location) {
          setCount(count + 1);
        }
      });
    }
  }, [loadFirst]);

  useEffect(() => {
    setLoading(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_All_WEATHER,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setWeatherList(response?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loadFirst) {
      const fetchData = async () => {
        try {
          setLoadingModel(true);
          const updatedLocations = await Promise.all(
            locations.map(async (location, index) => {
              const { id, location: loc } = location;
              if (loc) {
                let apiUrl = "";
                if (isMuted) {
                  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${GPS?.latitude}&lon=${GPS?.longitude}&appid=${api_key}&units=metric`;
                } else {
                  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=${api_key}&units=metric`;
                }
                const response = await axios.get(apiUrl);
                let ChartSeries = [];
                const arr = response.data.list.map((item) => {
                  if (ChartSeries?.length < 7) {
                    ChartSeries?.push(`${item?.main?.temp}°`);
                  }
                  const milliseconds = item?.dt * 1000;
                  const date = moment.utc(milliseconds);
                  const day = date.format("dddd");
                  return {
                    ...item,
                    Day: day,
                  };
                });
                const Data = {
                  ...response.data,
                  list: arr,
                };

                return {
                  ...location,
                  weatherData: Data,
                  mainData: Data,
                  Line: id === 1 ? false : true,
                };
              }
              return location;
            })
          );
          convertIntoTemperatureUnits(updatedLocations);
          // setLocations(updatedLocations);
          setLoadingModel(false);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setLoadingModel(false);
        }
      };
      fetchData();
      setLoadFirst(false);
    }
  }, [loadFirst, isMuted]);

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        // window.document.body.style.overflow = "unset";
        setAppDetailModal(false);
        setInstanceView(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (
        appDropdownRef.current &&
        !appDropdownRef.current.contains(event?.target)
      ) {
        // window.document.body.style.overflow = "unset";
        setAppDropDown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setAppDetailModal(false);
    setInstanceView(false);
  }

  function handleClickOutside() {
    setAppDropDown(false);
  }

  // useEffect(() => {
  //   const newConnection = new HubConnectionBuilder()
  //     .withUrl(SIGNAL_R)
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //   newConnection.on("ScreenConnected", (screenConnected) => {
  //     // console.log("ScreenConnected", screenConnected);
  //   });

  //   newConnection
  //     .start()
  //     .then(() => {
  //       // console.log("Connection established");
  //       setConnection(newConnection);
  //     })
  //     .catch((error) => {
  //       console.error("Error starting connection:", error);
  //     });

  //   return () => {
  //     if (newConnection) {
  //       newConnection
  //         .stop()
  //         .then(() => {
  //           // console.log("Connection stopped");
  //         })
  //         .catch((error) => {
  //           console.error("Error stopping connection:", error);
  //         });
  //     }
  //   };
  // }, []);

  const handelDeleteAllInstance = () => {
    if (!window.confirm("Are you sure?")) return;
    const FormData = require("form-data");
    let data = new FormData();
    data.append("WeatherAppId", "0");
    data.append("Usescreenlocation", "true");
    data.append("UserID", user?.userID);
    data.append("Operation", "DeleteAll");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: WEATHER_APP,
      headers: {
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        setSelectAll(false);
        setWeatherList([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectAll = (e) => {
    const updatedInstance = WeatherList.map((Weather) => ({
      ...Weather,
      isChecked: !selectAll,
    }));
    setWeatherList(updatedInstance);
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (instanceId) => {
    const updatedInstance = WeatherList.map((weather) =>
      weather.weatherAppId === instanceId
        ? {
            ...weather,
            isChecked: !weather.isChecked,
          }
        : weather
    );

    setWeatherList(updatedInstance);

    const allChecked = updatedInstance.every((weather) => weather.isChecked);
    setSelectAll(allChecked);
  };

  const handleAppDropDownClick = (id) => {
    setInstanceID(id);
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

  const handelDeleteInstance = (id) => {
    if (!window.confirm("Are you sure?")) return;

    let data = new FormData();
    data.append("WeatherAppId", id);
    data.append("Usescreenlocation", "true");
    data.append("UserID", user?.userID);
    data.append("Operation", "Delete");

    let config = {
      method: "post",
      url: WEATHER_APP,
      headers: {
        Authorization: authToken,
      },
      data: data,
    };

    toast.loading("Deleting...");
    axios
      .request(config)
      .then((response) => {
        const updatedInstanceData = WeatherList.filter(
          (instanceData) => instanceData.weatherAppId !== id
        );
        setWeatherList(updatedInstanceData);
        toast.remove();
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handleUpdateScreenAssign = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${WEATHER_ASSIGN_SECREEN}WeatherId=${instanceID}&ScreenID=${selectedScreenIdsString}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          if (connection) {
            connection
              .invoke("ScreenConnected")
              .then(() => {
                // console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setSelectScreenModal(false);
          setAddScreenModal(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateTagsWeather = (tags) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${WEATHER_ADD_TAG}WeatherId=${
        updateTagWeather?.weatherAppId
      }&Tags=${tags.length === 0 ? "" : tags}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const updatedData = WeatherList.map((item) => {
            if (item?.weatherAppId === updateTagWeather?.weatherAppId) {
              return { ...item, tags: tags };
            } else {
              return item;
            }
          });
          setWeatherList(updatedData);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const handleFetchWeatherById = (id) => {
    let config = {
      method: "get",
      url: `${GET_WEATHER_BY_ID}ID=${id}`,
      headers: {
        Authorization: authToken,
      },
    };

    toast.loading("Fetching Data....");
    axios
      .request(config)
      .then((response) => {
        const data = response?.data?.data;
        setWeatherData(response?.data?.data);
        setLocations([
          {
            id: 1,
            location: response?.data?.data?.location1
              ? response?.data?.data?.location1
              : "Ahmedabad",
            weatherData: null,
            mainData: null,
          },
          {
            id: 2,
            location:
              response?.data?.data?.location2 !== "null"
                ? response?.data?.data?.location2
                : "",
            weatherData: null,
            mainData: null,
          },
          {
            id: 3,
            location:
              response?.data?.data?.location3 !== "null"
                ? response?.data?.data?.location3
                : "",
            weatherData: null,
            mainData: null,
          },
        ]);
        setGPS({
          latitude: response?.data?.data?.latitude,
          longitude: response?.data?.data?.longitude,
        });
        setTemperatureUnit(response?.data?.data?.temperatureUnit);
        setTickerTapeView(response?.data?.data?.tickerTapeView);
        setBackGround(response?.data?.data?.bgColor);
        setLayout(response?.data?.data?.layout);
        setIsMuted(response?.data?.data?.usescreenlocation);
        setInstanceName(data?.name);
        setScreenAssignName(data?.screens);
        setShowTags(data?.tags);
        setLoadFirst(true);
        toast.remove();
        // setLoadingModel(true);
      })
      .catch((error) => {
        console.log(error);
        // setLoadingModel(true);
        toast.remove();
      });
  };

  const convertIntoTemperatureUnits = (locations) => {
    const convertTemperature = (temp, toUnit) => {
      switch (toUnit) {
        case "Fahrenheit":
          return (temp * 9) / 5 + 32;
        case "Kelvin":
          return temp + 273.15;
        case "Rankine":
          return (temp * 9) / 5 + 491.67;
        case "Reaumur":
          return (temp * 4) / 5;
        default:
          return temp;
      }
    };

    const updatedLocations = locations?.map((item) => {
      if (item?.weatherData !== null) {
        const ChartSeries = [];
        const Days = [];
        const arr = item.mainData?.list?.map((items) => {
          const convertedTemp = convertTemperature(
            items?.main?.temp,
            temperatureUnit
          );
          const convertedFeelsLike = convertTemperature(
            items?.main?.feels_like,
            temperatureUnit
          );
          if (ChartSeries?.length < 7 && Days.length < 7) {
            ChartSeries?.push(convertedTemp.toFixed(2));
            Days?.push(items?.Day);
          }
          return {
            ...items,
            main: {
              ...items.main,
              temp: convertedTemp.toFixed(2),
              feels_like: convertedFeelsLike.toFixed(2),
            },
          };
        });

        const state = {
          series: [
            {
              name: "Weather 1",
              data: ChartSeries,
            },
          ],
          options: {
            chart: {
              height: 200,
              type: "line",
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            colors: ["#000000"],
            axisPointer: {
              show: false,
            },
            markers: {
              size: 2,
            },
            dataLabels: {
              enabled: true,
            },
            grid: {
              show: false,
            },
            yaxis: {
              labels: {
                style: {
                  colors: ["transparent"],
                },
              },
            },
            xaxis: {
              categories: Days,
              axisTicks: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              labels: {
                style: {
                  colors: ["#ffffff"],
                  fontWeight: 500,
                },
              },
            },
            tooltip: {
              enabled: false, // Set to false to disable the tooltip on hover
            },
          },
        };
        const updatedWeatherData = {
          ...item.weatherData,
          list: arr || [], // Assign an empty array if arr is falsy
          Chart: state,
        };

        return {
          ...item,
          weatherData: item?.location?.length > 0 ? updatedWeatherData : null,
        };
      }
      return item;
    });

    if (updatedLocations) {
      setLocations(updatedLocations);
    }
  };

  const HandleModel = () => {
    setLocations([
      { id: 1, location: "", weatherData: null, mainData: null },
      { id: 2, location: "", weatherData: null, mainData: null },
      { id: 3, location: "", weatherData: null, mainData: null },
    ]);
    setBackGround("");
    setInstanceView(false);
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
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Apps
            </h1>
            <Link to="/weatherdetail">
              <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbAppsFilled className="text-2xl mr-2 text-white" />
                New Instance
              </button>
            </Link>
          </div>
          <div className="mt-5 mb-5">
            <div className="shadow-md bg-white rounded-lg p-5">
              <div className="flex justify-between items-center">
                <h1 className="not-italic font-medium text-xl text-[#001737] ">
                  Weather Instance
                </h1>
                <div className="flex items-center">
                  <button
                    // onClick={() => setAppDetailModal(true)}
                    className="w-8 h-8 ml-2 border-primary hover:bg-SlateBlue hover:border-SlateBlue items-center border-2 rounded-full p-1 text-xl   hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    <BsInfoLg />
                  </button>
                  <button
                    onClick={handelDeleteAllInstance}
                    className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full px-1 text-2xl  hover:text-white hover:border-SlateBlue hover:bg-SlateBlue hover:shadow-lg hover:shadow-primary-500/50"
                    style={{ display: selectAll ? "block" : "none" }}
                  >
                    <RiDeleteBinLine />
                  </button>
                  <button className="sm:ml-2 xs:ml-1 mt-1">
                    <input
                      type="checkbox"
                      className="h-7 w-7"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </button>
                </div>
              </div>
              <div>
                {loading ? (
                  <div className="text-center font-semibold text-2xl w-full">
                    Loading...
                  </div>
                ) : WeatherList?.length > 0 ? (
                  <div className=" grid grid-cols-10 gap-4 mt-5">
                    {WeatherList?.map((item, index) => (
                      <div
                        key={item?.weatherAppId}
                        className="lg:col-span-2 md:col-span-5 sm:col-span-10"
                      >
                        <div className="shadow-md bg-[#EFF3FF] rounded-lg h-full">
                          <div className="relative flex justify-between">
                            <button className="float-right p-2">
                              <input
                                className="h-5 w-5"
                                type="checkbox"
                                style={{
                                  display: selectAll ? "block" : "none",
                                }}
                                checked={item.isChecked || false}
                                onChange={() =>
                                  handleCheckboxChange(item?.weatherAppId)
                                }
                              />
                            </button>
                            <div className="relative">
                              <button className="float-right">
                                <BiDotsHorizontalRounded
                                  className="text-2xl"
                                  onClick={() =>
                                    handleAppDropDownClick(item?.weatherAppId)
                                  }
                                />
                              </button>
                              {appDropDown === item.weatherAppId && (
                                <div ref={appDropdownRef} className="appdw">
                                  <ul className="space-y-2">
                                    <li
                                      onClick={() =>
                                        navigate(
                                          `/weatherdetail/${item?.weatherAppId}`
                                        )
                                      }
                                      className="flex text-sm items-center cursor-pointer"
                                    >
                                      <MdOutlineEdit className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                      Edit
                                    </li>
                                    <li
                                      className="flex text-sm items-center cursor-pointer"
                                      onClick={() => setAddScreenModal(true)}
                                    >
                                      <FiUpload className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                      Set to Screen
                                    </li>
                                    {/* <li className="flex text-sm items-center">
                                      <MdPlaylistPlay className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                      Add to Playlist
                                    </li> */}

                                    <li
                                      className="flex text-sm items-center cursor-pointer"
                                      onClick={() =>
                                        handelDeleteInstance(item.weatherAppId)
                                      }
                                    >
                                      <RiDeleteBin5Line className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                      Delete
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-center clear-both pb-8">
                            <img
                              src={Weather_Img}
                              alt="Logo"
                              className="cursor-pointer mx-auto h-20 w-20"
                              onClick={() => {
                                handleFetchWeatherById(item?.weatherAppId);
                                setInstanceView(true);
                              }}
                            />
                            <h4 className="text-lg font-medium mt-3">
                              {/* <a href="weather-appdetail.html">{item?.name}</a>*/}
                              {item?.name}
                            </h4>
                            <h4
                              onClick={() => {
                                item?.tags !== null &&
                                item?.tags !== undefined &&
                                item?.tags !== ""
                                  ? setTags(item?.tags?.split(","))
                                  : setTags([]);
                                setShowTagModal(true);
                                setUpdateTagWeather(item);
                              }}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Add tags +
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No Weather data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {addScreenModal && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div
            ref={addScreenRef}
            className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
          >
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                <div className="flex items-center">
                  <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                    Select the screen to set the App
                  </h3>
                </div>
                <button
                  className="p-1 text-xl ml-8"
                  onClick={() => setAddScreenModal(false)}
                >
                  <AiOutlineCloseCircle className="text-2xl" />
                </button>
              </div>
              <div className="flex justify-center p-9 ">
                <p className="break-words w-[280px] text-base text-black text-center">
                  New Weather App Instance would be applied. Do you want to
                  proceed?
                </p>
              </div>
              <div className="pb-6 flex justify-center">
                <button
                  className="bg-primary text-white px-8 py-2 rounded-full"
                  onClick={() => {
                    setSelectScreenModal(true);
                    setAddScreenModal(false);
                  }}
                >
                  OK
                </button>

                <button
                  className="bg-primary text-white px-4 py-2 rounded-full ml-3"
                  onClick={() => setAddScreenModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectScreenModal && (
        <ScreenAssignModal
          setAddScreenModal={setAddScreenModal}
          setSelectScreenModal={setSelectScreenModal}
          handleUpdateScreenAssign={handleUpdateScreenAssign}
          selectedScreens={selectedScreens}
          setSelectedScreens={setSelectedScreens}
        />
      )}
      {showTagModal && (
        <AddOrEditTagPopup
          setShowTagModal={setShowTagModal}
          tags={tags}
          setTags={setTags}
          handleUpdateTagsWeather={handleUpdateTagsWeather}
          from="weather"
          setUpdateTagWeather={setUpdateTagWeather}
        />
      )}
      {appDetailModal && (
        <>
          <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div ref={modalRef} className="relative w-auto my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none md:max-w-xl sm:max-w-sm xs:max-w-xs">
                <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7] border-slate-200 rounded-t">
                  <div className="flex items-center">
                    <div>
                      <img src={Weather_Img} className="w-10" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-medium">Weather</h4>
                      <h4 className="text-sm font-normal ">
                        Internal Communications
                      </h4>
                    </div>
                  </div>
                  <button
                    className="p-1 text-3xl"
                    onClick={() => setAppDetailModal(false)}
                  >
                    <AiOutlineCloseCircle />
                  </button>
                </div>
                <div className="p-2">
                  {/* <ReactPlayer
                    url="https://www.youtube.com/watch?v=WKOYp_7P71Y"
                    className="app-instance-preview"
                  />*/}
                </div>
                <p className="max-w-xl px-6">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book.
                </p>
                <div className="py-2 px-6">
                  <p>- Add videos by Weather URL</p>
                  <p>- Mute videos</p>
                  <p>- Choose to play with or without subtitles</p>
                </div>
                <div className="flex items-center justify-center p-5">
                  <button className="border-primary border-2 text-primary py-1.5 px-5 rounded-full hover:bg-primary hover:text-white">
                    App Guide
                  </button>
                  <button
                    className="bg-primary text-white rounded-full py-2 px-5 ml-5"
                    onClick={() => setAppDetailModal(false)}
                  >
                    Go to App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {instanceView && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div
            ref={modalRef}
            className="w-[600px] my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
          >
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7]  rounded-t">
                <div className="flex items-center">
                  <div>
                    <img src={Weather_Img} className="w-10" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium">{instanceName}</h4>
                  </div>
                </div>
                <button className="p-1 text-3xl" onClick={() => HandleModel()}>
                  <AiOutlineCloseCircle />
                </button>
              </div>
              <div className="p-2">
                {loadingModel ? (
                  <div className="self-start font-semibold text-2xl m-3">
                    Loading...
                  </div>
                ) : (
                  <div
                    className="overflow-x-auto bg-blue border-white rounded-lg relative p-5"
                    style={{ backgroundColor: BackGround, height: "400px" }}
                  >
                    <div className="lg:mx-auto md:mx-auto lg:max-w-5xl md:max-w-3xl sm:max-w-xl xs:w-full mx-auto bg-teal border-width-10px border-black">
                      <div
                        className={`flex ${
                          Layout === "Landscape" ? "flex-row" : "flex-col"
                        } text-[#ffffff]`}
                      >
                        {locations?.map((item, index) => {
                          if (item?.weatherData !== null) {
                            return (
                              <div
                                className="w-full flex flex-col"
                                key={index}
                                // style={{
                                //   borderBottom:
                                //     Layout === "Portrait"
                                //       ? "1px solid"
                                //       : "none",
                                //   borderRight:
                                //     Layout === "Landscape"
                                //       ? "1px solid"
                                //       : "none",
                                // }}
                              >
                                <div className="bg-teal-lighter flex-1 flex flex-col">
                                  <div className="p-3 title text-[#ffffff]">
                                    <h3 className="sm:text-base md:text-xl lg:text-2xl font-medium text-[#ffffff] capitalize">
                                      {item?.weatherData?.city?.name}
                                    </h3>
                                  </div>
                                  <div className="px-3 flex items-center text-[#ffffff]">
                                    <div className="bg-primary text-sm rounded py-2 px-3 mr-3">
                                      Today
                                    </div>
                                    <div className="text-sm">
                                      <p>
                                        {item?.weatherData?.list[0]?.Day}
                                        <br />
                                        {currentTime}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="p-3 flex justify-between items-center">
                                    <div className="icons">
                                      <img
                                        src={
                                          "https://openweathermap.org/img/wn/" +
                                          `${item?.weatherData?.list[0]?.weather[0]?.icon}` +
                                          ".png"
                                        }
                                        alt="Logo"
                                        className="w-16"
                                      />
                                      <div className="px-3 ">
                                        <p>
                                          {
                                            item?.weatherData?.list[0]
                                              ?.weather[0]?.main
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <h4 className="sm:text-base md:text-xl lg:text-2xl flex items-start justify-end">
                                        {item?.weatherData?.list[0]?.main?.temp}
                                        <span className="text-lg leading-3 ml-1 mt-2">
                                          {temperatureUnit === "Fahrenheit"
                                            ? "°F"
                                            : temperatureUnit === "Kelvin"
                                            ? "K"
                                            : temperatureUnit === "Rankine"
                                            ? "°R"
                                            : temperatureUnit === "Reaumur"
                                            ? "°Re"
                                            : "°C"}
                                        </span>
                                      </h4>
                                      <p className="flex items-start justify-end">
                                        Feels like{" "}
                                        {
                                          item?.weatherData?.list[0]?.main
                                            ?.feels_like
                                        }
                                        {temperatureUnit === "Fahrenheit"
                                          ? "°F"
                                          : temperatureUnit === "Kelvin"
                                          ? "K"
                                          : temperatureUnit === "Rankine"
                                          ? "°R"
                                          : temperatureUnit === "Reaumur"
                                          ? "°Re"
                                          : "°C"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-3 flex justify-between items-center">
                                    <div className="flex flex-wrap -m-3 text-[#ffffff]">
                                      {item?.weatherData?.list
                                        ?.slice(1, 5)
                                        ?.map((items, index) => {
                                          return (
                                            <div
                                              className="w-1/2 flex flex-col p-2"
                                              key={index}
                                            >
                                              <div className="bg-primary rounded p-2 flex justify-between items-center">
                                                <div className="text">
                                                  <h5
                                                    style={{
                                                      fontSize: "10px",
                                                    }}
                                                  >
                                                    {items?.Day}
                                                  </h5>
                                                  <p className="flex items-start text-xs">
                                                    {items?.main?.temp}° /
                                                    {items?.main?.feels_like}°
                                                  </p>
                                                </div>
                                                <div className="w-icon">
                                                  <img
                                                    src={
                                                      "https://openweathermap.org/img/wn/" +
                                                      `${items?.weather[0]?.icon}` +
                                                      ".png"
                                                    }
                                                    alt="Logo"
                                                    className="w-8"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                  </div>
                                  <div id="chart" className="p-3">
                                    <ReactApexChart
                                      options={
                                        item?.weatherData?.Chart?.options
                                      }
                                      series={item?.weatherData?.Chart?.series}
                                      height={200}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="py-2 px-6">
                <div className="flex items-center gap-2 w-full">
                  <div className="font-semibold w-fit">Tags:-</div>
                  <div className=" w-full">{showTags}</div>
                </div>
                <div>
                  <label className="font-semibold">Screen Assign :</label>
                  {screenAssignName == "" ? " No Screen" : screenAssignName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Weather;
