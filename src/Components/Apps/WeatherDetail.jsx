import React, { useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import {
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useState } from "react";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SketchPicker } from "react-color";
import ReactApexChart from "react-apexcharts";
import { debounce } from "lodash";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TbBoxMultiple, TbCalendarTime } from "react-icons/tb";
import { MdPlaylistPlay, MdSave } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { GET_WEATHER_BY_ID, WEATHER_APP } from "../../Pages/Api";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
const WeatherDetail = ({ sidebarOpen, setSidebarOpen }) => {
  let api_key = "41b5176532e682fd8b4cb6a44e3bd1a4";
  const { id } = useParams();
  const history = useNavigate();
  const { user } = useSelector((state) => state.root.auth);
  const moreModalRef = useRef(null);
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [GPSLocation, setGPSLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [edited, setEdited] = useState(false);
  const [loadFirst, setLoadFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#4A90E2");
  const [selectedTemperature, setSelectedTemperature] = useState("Celsius");
  const [selectedLayout, setSelectedLayout] = useState("Landscape");
  const [selectedTickerView, setSelectedTickerView] =
    useState("Today's Weather");
  const [selectedPreview, setSelectedPreview] = useState(false);
  const [showSetScreenModal, setShowSetScreenModal] = useState(false);
  const currentDate = new Date();
  const [instanceName, setInstanceName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm")
  );
  const currentTime = moment().format("hh:mm A");
  const [locations, setLocations] = useState([
    { id: 1, location: "Ahmedabad", weatherData: null, mainData: null },
    { id: 2, location: "", weatherData: null, mainData: null },
    { id: 3, location: "", weatherData: null, mainData: null },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [playlistDeleteModal, setPlaylistDeleteModal] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isMuted, setIsMuted] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoadingEdit(true);
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_WEATHER_BY_ID}ID=${id}`,
        headers: {
          Authorization: authToken,
        },
      };
      toast.loading("Fetching Data....");
      axios
        .request(config)
        .then((response) => {
          setInstanceName(response?.data?.data?.name);
          setIsMuted(response?.data?.data?.usescreenlocation);
          setSelectedColor(response?.data?.data?.bgColor);
          setSelectedLayout(response?.data?.data?.layout);
          setSelectedTemperature(response?.data?.data?.temperatureUnit);
          setSelectedTickerView(response?.data?.data?.tickerTapeView);
          setGPSLocation({
            latitude: response?.data?.data?.latitude,
            longitude: response?.data?.data?.longitude,
          });
          setLocations([
            {
              id: 1,
              location:
                response?.data?.data?.location1 !== "null"
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
          toast.remove();
          setLoadingEdit(false);
          setLoadFirst(true);
        })
        .catch((error) => {
          console.log(error);
          setLoadingEdit(false);
          toast.remove();
        });
    }
  }, [id]);
  useEffect(() => {
    const filteredLocations =
      locations?.filter(
        (item) => item?.location === "" || item?.location === null
      ) || [];
    setErrorList(filteredLocations);
  }, [locations]);

  useEffect(() => {
    if (isMuted && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGPSLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocations([
            { id: 1, location: "Ahmedabad", weatherData: null, mainData: null },
            { id: 2, location: "", weatherData: null, mainData: null },
            { id: 3, location: "", weatherData: null, mainData: null },
          ]);
          setSelectedLayout("Landscape");
          setLoadFirst(true);
        },
        (error) => {
          console.error("Error getting the location:", error);
        }
      );
    } else {
      setLoadFirst(true);
    }
  }, [isMuted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreModalRef.current &&
        !moreModalRef.current.contains(event?.target)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowPopup(false);
  }

  const handleMuteChange = () => {
    setIsMuted(!isMuted);
    setGPSLocation({ latitude: null, longitude: null });
  };

  const handleOnSaveInstanceName = (e) => {
    if (!instanceName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter at least minimum 1 character.");
    }
    setEdited(false);
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
            selectedTemperature
          );
          const convertedFeelsLike = convertTemperature(
            items?.main?.feels_like,
            selectedTemperature
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

  const handleLocationChange = (id, newLocation) => {
    setLoadFirst(true);
    setLocations((prevLocations) =>
      prevLocations.map((location) =>
        location.id === id ? { ...location, location: newLocation } : location
      )
    );
    // setSelectedTemperature("Celsius");
  };

  useEffect(() => {
    if (loadFirst) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const updatedLocations = await Promise.all(
            locations.map(async (location) => {
              const { id, location: loc } = location;
              if (loc) {
                let apiUrl = "";
                if (isMuted) {
                  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${GPSLocation?.latitude}&lon=${GPSLocation?.longitude}&appid=${api_key}&units=metric`;
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
                };
              }
              return location;
            })
          );
          convertIntoTemperatureUnits(updatedLocations);
          // setLocations(updatedLocations);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setLoading(false);
        }
      };
      fetchData();
      setLoadFirst(false);
    }
  }, [loadFirst, locations, api_key, isMuted, loadingEdit]);

  useEffect(() => {
    setLoading(true);
    convertIntoTemperatureUnits(locations);
    setLoading(false);
  }, [selectedTemperature]);

  const debouncedOnChange = debounce(handleLocationChange, 1000);

  const handleSave = () => {
    if (locations?.length === errorList?.length) {
      toast.error("Please fill all the details.");
      return;
    }
    let data = new FormData();
    data.append("WeatherAppId", id ? id : "0");
    data.append("Name", instanceName);
    data.append("Location1", !isMuted ? locations[0]?.location : "");
    data.append("Location2", !isMuted ? locations[1]?.location : "");
    data.append("Location3", !isMuted ? locations[2]?.location : "");
    data.append("TemperatureUnit", selectedTemperature);
    data.append("TickerTapeView", selectedTickerView);
    data.append("BGColor", selectedColor);
    data.append("Usescreenlocation", isMuted);
    data.append("latitude", GPSLocation.latitude);
    data.append("longitude", GPSLocation.longitude);
    data.append("Layout", selectedLayout);
    data.append("UserID", user?.userID);
    data.append("Operation", "Save");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: WEATHER_APP,
      headers: {
        Authorization: authToken,
      },
      data: data,
    };

    setSaveLoading(true);

    axios
      .request(config)
      .then((response) => {
        if (response.data.status === 200) {
          if (window.history.length === 1) {
            localStorage.setItem("isWindowClosed", "true");
            window.close();
          } else {
            history("/weather");
          }
        }
        setSaveLoading(false);
      })
      .catch((error) => {
        setSaveLoading(false);
        console.log(error);
      });
  };

  const handleLayout = (e) => {
    setLoading(true);
    setSelectedLayout(e.target.value);
    setLoading(false);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
  };

  // console.log(locations);

  return (
    <>
      {/* <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div> */}
      {id && loadingEdit ? (
        <div className="text-center font-semibold text-2xl h-[80vh] flex items-center justify-center w-[100vw]">
          Loading...
        </div>
      ) : (
        <div className="px-6 page-contain">
          <div>
            <div className="lg:flex lg:justify-between sm:block my-4 items-center">
              <div className="flex items-center">
                {edited ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full border border-primary rounded-md px-2 py-1"
                      placeholder="Enter schedule name"
                      value={instanceName}
                      onChange={(e) => {
                        setInstanceName(e.target.value);
                      }}
                    />
                    <MdSave
                      onClick={() => handleOnSaveInstanceName()}
                      className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="flex">
                    <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                      {instanceName}
                    </h1>
                    <button onClick={() => setEdited(true)}>
                      <GoPencil className="ml-4 text-lg" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
                <button
                  className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-2 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  onClick={() => {
                    if (locations?.length === errorList?.length) {
                      toast.error("Please Enter any Location");
                      return;
                    }
                    setSelectedPreview(!selectedPreview);
                    setSelectedLayout("Landscape");
                  }}
                >
                  {selectedPreview ? "Edit" : "Preview"}
                </button>
                <button
                  className="flex align-middle border-white bg-SlateBlue text-white sm:mt-2  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 .  text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  onClick={handleSave}
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : "Save"}
                </button>
                {/* <div className="relative">
                  <button
                    className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full py-[10px] px-[11px] text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    onClick={() => setShowPopup(!selectedPreview && !showPopup)}
                  >
                    <BiDotsHorizontalRounded />
                  </button>
                </div>*/}

                <Link to="/weather">
                  <button className="sm:ml-2 xs:ml-1 sm:mt-2 border-primary items-center border-2  rounded-full text-xl  hover:text-white hover:bg-SlateBlue hover:border-white hover:shadow-lg hover:shadow-primary-500/50 p-2 ">
                    <AiOutlineClose />
                  </button>
                </Link>
              </div>
            </div>
            <div className="mt-5 mb-5">
              <div className="grid grid-cols-12 gap-6 mt-5">
                {!selectedPreview && (
                  <div className="lg:col-span-4 md:col-span-5 sm:col-span-12 ">
                    <div className="shadow-md bg-white rounded-lg p-5 h-fit">
                      <div className="mb-6 w-full">
                        <div className="relative inline-flex items-center h-full w-full justify-between">
                          <label className="w-2/5 text-lg font-semibold text-gray-900 dark:text-gray-300">
                            Use screen location :
                          </label>
                          <div className="text-right  items-end">
                            <label className="inline-flex relative items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                readOnly
                                checked={isMuted}
                                onChange={handleMuteChange}
                              />
                              <div
                                className={`w-11 h-6 ${
                                  isMuted ? "bg-SlateBlue" : "bg-lightgray"
                                } rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all `}
                              ></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* <div className="mb-3 relative inline-flex items-center w-full">
                        <label
                          htmlFor="message"
                          className="w-2/5 mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Language*:
                        </label>
                        <select
                          id="languages"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={(e) => setLanguage(e.target.value)}
                          // value={language}
                          defaultValue={language}
                        >
                          <option value="English">English</option>
                          <option value="German">German</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Arabic">Arabic</option>
                        </select>
                              </div> */}

                      {!isMuted &&
                        locations.map((location) => (
                          <div
                            className="mb-3 relative inline-flex items-center w-full"
                            key={location.id}
                          >
                            <label
                              htmlFor="countries"
                              className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Location{location.id === 1 && "*"} {location.id}:
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder={location.location}
                              onChange={(e) =>
                                debouncedOnChange(location.id, e.target.value)
                              }
                            />
                            {/* {location.weatherData ? (
                            <div>
                              <h3>City: {location.weatherData.name}</h3>
                              <p>Temperature: {location.weatherData.main.temp} K</p>
                              <p>
                                Weather:
                                {location.weatherData.weather[0].description}
                              </p>
                            </div>
                          ) : (
                            <p>No weather data available for this location.</p>
                          )} */}
                          </div>
                        ))}
                      {/* {!isMuted && (
                        <div className="mb-3 relative inline-flex items-center w-full">
                          <label
                            htmlFor="message"
                            className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Layout*
                          </label>
                          <select
                            id="layout"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => handleLayout(e)}
                            // value={selectedLayout}
                            defaultValue={selectedLayout}
                          >
                            <option value="Landscape">Landscape</option>
                            <option value="Portrait">Portrait</option>
                          </select>
                        </div>
                     )}*/}

                      <div className="mb-3 relative inline-flex items-center w-full">
                        <label
                          htmlFor="message"
                          className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Temperature Unit*
                        </label>
                        <select
                          id="countries"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={(e) =>
                            setSelectedTemperature(e.target.value)
                          }
                          // value={selectedTemperature}
                          defaultValue={selectedTemperature}
                        >
                          <option value="Celsius">Celsius</option>
                          <option value="Fahrenheit">Fahrenheit</option>
                          <option value="Kelvin">Kelvin</option>
                          <option value="Rankine">Rankine</option>
                          <option value="Reaumur">Reaumur</option>
                        </select>
                      </div>
                      <div className="mb-3 relative inline-flex items-center w-full">
                        <label
                          htmlFor="message"
                          className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Ticker Tape View*
                        </label>
                        <select
                          id="countries"
                          defaultValue={selectedTickerView}
                          // value={selectedTickerView}
                          onChange={(e) =>
                            setSelectedTickerView(e.target.value)
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="Today's Weather">
                            Today's Weather
                          </option>
                          <option value="Weekly forecast Weather">
                            Weekly forecast Weather
                          </option>
                        </select>
                      </div>
                      <div className="mb-3 relative inline-flex items-center w-full">
                        <label
                          htmlFor="message"
                          className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Background Color:
                        </label>
                        <SketchPicker
                          color={selectedColor}
                          onChange={(color) => setSelectedColor(color.hex)}
                          className="sketch-picker-weather"
                        />
                      </div>
                      <p className="text-center pt-6">
                        If you choose to display weather in a ticker tape zone
                        layout, then this setting determines the view. If using
                        full screen as in the preview above, this setting will
                        not alter the app.
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className={`${
                    selectedPreview
                      ? "lg:col-span-12 md:col-span-12"
                      : "lg:col-span-8 md:col-span-7"
                  } sm:col-span-12`}
                >
                  <div className="shadow-md bg-white rounded-lg p-5 h-full">
                    {/*{selectedPreview && (
                      <div className="m-2 flex justify-end h-full w-full">
                        <select
                          id="layout"
                          className="w-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={(e) => setSelectedLayout(e.target.value)}
                          // value={selectedLayout}
                          defaultValue={selectedLayout}
                        >
                          <option value="Landscape">Landscape</option>
                          <option value="Portrait">Portrait</option>
                        </select>
                      </div>
                    )}*/}
                    <div
                      className="w-full flex items-center justify-center"
                      style={{
                        borderRadius: "0.625rem",
                        border: "2px solid #FFF",
                        background: `${selectedColor}`,
                        boxShadow: "0px 10px 15px 0px rgba(0, 0, 0, 0.25)",
                        height: "100%",
                      }}
                    >
                      {loading ? (
                        <div className="self-start font-semibold text-2xl m-3">
                          Loading...
                        </div>
                      ) : (
                        <div className="overflow-x-auto bg-blue border-white rounded-lg relative p-5">
                          <div className="lg:mx-auto md:mx-auto lg:max-w-5xl md:max-w-3xl sm:max-w-xl xs:w-full mx-auto bg-teal border-width-10px border-black">
                            <div
                              className={`flex ${
                                selectedLayout === "Landscape"
                                  ? "flex-row"
                                  : "flex-col"
                              } text-[#ffffff]`}
                            >
                              {locations?.map((item, index) => {
                                if (item?.weatherData !== null) {
                                  return (
                                    <div
                                      className={`w-full flex flex-col ${
                                        selectedLayout === "Landscape"
                                          ? " border-r-2 "
                                          : " border-b-2 "
                                      }last:border-none`}
                                      key={index}
                                    >
                                      <div className="bg-teal-lighter flex-1 flex flex-col">
                                        <div className="p-3 title text-[#ffffff]">
                                          <h3 className="sm:text-xl md:text-2xl lg:text-4xl font-medium text-[#ffffff] capitalize">
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
                                            <h4 className="sm:text-xl md:text-2xl lg:text-4xl flex items-start justify-end">
                                              {
                                                item?.weatherData?.list[0]?.main
                                                  ?.temp
                                              }
                                              <span className="text-lg leading-3 ml-1 mt-2">
                                                {selectedTemperature ===
                                                "Fahrenheit"
                                                  ? "°F"
                                                  : selectedTemperature ===
                                                    "Kelvin"
                                                  ? "K"
                                                  : selectedTemperature ===
                                                    "Rankine"
                                                  ? "°R"
                                                  : selectedTemperature ===
                                                    "Reaumur"
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
                                              {selectedTemperature ===
                                              "Fahrenheit"
                                                ? "°F"
                                                : selectedTemperature ===
                                                  "Kelvin"
                                                ? "K"
                                                : selectedTemperature ===
                                                  "Rankine"
                                                ? "°R"
                                                : selectedTemperature ===
                                                  "Reaumur"
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
                                                    className="w-1/2 flex flex-col p-3"
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
                                                          {
                                                            items?.main
                                                              ?.feels_like
                                                          }
                                                          °
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
                                            series={
                                              item?.weatherData?.Chart?.series
                                            }
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSetScreenModal && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-9990 outline-none focus:outline-none">
          <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="max-h-80 vertical-scroll-inner">
                <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                  <div className="flex items-center">
                    <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                      Select Screens to Playlist Name
                    </h3>
                  </div>
                  <button
                    className="p-1 text-xl ml-8"
                    onClick={() => setShowSetScreenModal(false)}
                  >
                    <AiOutlineCloseCircle className="text-2xl" />
                  </button>
                </div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-right mr-5 flex items-end justify-end relative sm:mr-0">
                    <AiOutlineSearch className="absolute top-[13px] right-[233px] z-10 text-gray searchicon" />
                    <input
                      type="text"
                      placeholder=" Search Playlist"
                      className="border border-primary rounded-full px-7 py-2 search-user"
                    />
                  </div>
                  <div className="flex items-center">
                    <button className="bg-lightgray rounded-full px-4 py-2 text-SlateBlue">
                      Tags
                    </button>
                    <button className="flex items-center bg-lightgray rounded-full px-4 py-2 text-SlateBlue ml-3">
                      <input type="checkbox" className="w-5 h-5 mr-2" />
                      All Clear
                    </button>
                  </div>
                </div>
                <div className="px-9">
                  <div className="overflow-x-auto p-4 shadow-xl bg-white rounded-lg ">
                    <table className=" w-full ">
                      <thead>
                        <tr className="flex justify-between items-center">
                          <th className="font-medium text-[14px]">
                            <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                              Name
                            </button>
                          </th>
                          <th className="p-3 font-medium text-[14px]">
                            <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                              Group
                            </button>
                          </th>
                          <th className="p-3 font-medium text-[14px]">
                            <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                              Playing
                            </button>
                          </th>
                          <th className="p-3 font-medium text-[14px]">
                            <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                              Status
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="mt-3 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                          <td className="flex items-center ">
                            <input type="checkbox" className="mr-3" />
                            <div>
                              <div>Tv 1</div>
                            </div>
                          </td>
                          <td className="p-2">Marketing</td>
                          <td className="p-2">25 May 2023</td>
                          <td className="p-2">
                            <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                              Live
                            </button>
                          </td>
                        </tr>
                        <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                          <td className="flex items-center ">
                            <input type="checkbox" className="mr-3" />
                            <div>
                              <div>Tv 1</div>
                            </div>
                          </td>
                          <td className="p-2">Marketing</td>
                          <td className="p-2">25 May 2023</td>
                          <td className="p-2">
                            <button className="rounded-full px-6 py-1 text-white bg-[#D40000]">
                              Offline
                            </button>
                          </td>
                        </tr>
                        <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                          <td className="flex items-center ">
                            <input type="checkbox" className="mr-3" />
                            <div>
                              <div>Tv 1</div>
                            </div>
                          </td>
                          <td className="p-2">Marketing</td>
                          <td className="p-2">25 May 2023</td>
                          <td className="p-2">
                            <button className="rounded-full px-6 py-1 text-white bg-[#D40000]">
                              Offline
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex justify-between p-6">
                <button className="border-2 border-primary px-4 py-2 rounded-full">
                  Add new Playlist
                </button>
                <Link to="/composition">
                  <button className="bg-primary text-white px-4 py-2 rounded-full">
                    Save
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {playlistDeleteModal && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-9990 outline-none focus:outline-none">
          <div className="w-auto my-6 mx-auto lg:max-w-xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              
            <div className="max-h-80 vertical-scroll-inner">
              <div className="flex items-start justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black">
                <div className="flex items-center">
                  <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                    Delete Playlist Name?
                  </h3>
                </div>
                <button
                  className="p-1 text-xl ml-8"
                  onClick={() => setPlaylistDeleteModal(false)}
                >
                  <AiOutlineCloseCircle className="text-2xl" />
                </button>
              </div>
              <div className="p-5">
                <p>
                  Playlist Name is being used elsewhere and will be removed when
                  deleted. Please check before deleting.
                </p>
                <div className="flex mt-4">
                  <label className="font-medium">Playlist : </label>
                  <p className="ml-2">Ram Siya Ram</p>
                </div>
              </div>
              </div>


              <div className="flex justify-center items-center pb-5">
                <button
                  className="border-2 border-primary px-4 py-1.5 rounded-full"
                  onClick={() => setPlaylistDeleteModal(false)}
                >
                  Cencel
                </button>
                <Link to="/apps">
                  <button className="bg-primary text-white ml-3 px-4 py-2 rounded-full">
                    Delete
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*{showPopup && (
        <div ref={moreModalRef} className="editdw-weather z-0">
          <ul>
            <li
              className="flex text-sm items-center cursor-pointer"
              onClick={() => setShowSetScreenModal(true)}
            >
              <FiUpload className="mr-2 text-lg" />
              Set to Screen
            </li>
            <li className="flex text-sm items-center mt-2 cursor-pointer">
              <MdPlaylistPlay className="mr-2 text-lg" />
              Add to Playlist
            </li>
            <li className="flex text-sm items-center mt-2 cursor-pointer">
              <TbBoxMultiple className="mr-2 text-lg" />
              Duplicate
            </li>
            <li className="flex text-sm items-center mt-2 cursor-pointer">
              <TbCalendarTime className="mr-2 text-lg" />
              Set availability
            </li>
            <li
              className="flex text-sm items-center mt-2 cursor-pointer"
              onClick={() => setPlaylistDeleteModal(true)}
            >
              <RiDeleteBin5Line className="mr-2 text-lg" />
              Delete
            </li>
          </ul>
        </div>
      )}*/}
    </>
  );
};

export default WeatherDetail;
