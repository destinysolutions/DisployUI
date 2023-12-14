import React, { useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { AiOutlineClose } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useState } from "react";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import { Link } from "react-router-dom";
import axios from "axios";
import { SketchPicker } from "react-color";
import ReactApexChart from "react-apexcharts";
const WeatherDetail = ({ sidebarOpen, setSidebarOpen }) => {
  let api_key = "41b5176532e682fd8b4cb6a44e3bd1a4";

  const [edited, setEdited] = useState(false);
  const [loadFirst, setLoadFirst] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#4A90E2");
  const [selectedTemperature, setSelectedTemperature] = useState("Celsius");

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
  const [weatherData, setWeatherData] = useState(null);
  const [language, setLanguage] = useState("English");
  const [enabled, setEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  //  const [countryLocation,setCountryLocation]=useState("india");
  //  const [cityLocation,setCityLocation]=useState('');
  //  const [stateLocation,setStateLocation]=useState('');

  //   useEffect(() => {
  //   const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${countryLocation}&appid=${api_key}`;

  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       setWeatherData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching weather data: ", error);
  //     });
  // }, [city, api_key]);
  const handleMuteChange = () => {
    setIsMuted(!isMuted);
  };

  const convertIntoTemperatureUnits = () => {
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
        const arr = item.mainData?.list?.map((items) => {
          const convertedTemp = convertTemperature(
            items?.main?.temp,
            selectedTemperature
          );
          const convertedFeelsLike = convertTemperature(
            items?.main?.feels_like,
            selectedTemperature
          );
          if (ChartSeries?.length < 7) {
            ChartSeries?.push(convertedTemp.toFixed(2));
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
              name: "High - 2013",
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
              show: false,
            },
            xaxis: {
              categories: ["3", "7", "11", "3", "7", "11", "3"],
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
          weatherData: updatedWeatherData,
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
    setSelectedTemperature("Celsius");
  };

  useEffect(() => {
    if (loadFirst) {
      const fetchData = async () => {
        try {
          const updatedLocations = await Promise.all(
            locations.map(async (location) => {
              const { id, location: loc } = location;
              if (loc) {
                const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=${api_key}&units=metric`;
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

                const state = {
                  series: [
                    {
                      name: "High - 2013",
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
                    },
                    markers: {
                      size: 2,
                    },
                    grid: {
                      show: false,

                    },
                    dataLabels: {
                      enabled: true,
                    },
                    yaxis: {
                      show: false,
                    },
                    xaxis: {
                      categories: ["3", "7", "11", "3", "7", "11", "3"],
                    },
                  },
                };
                const Data = {
                  ...response.data,
                  list: arr,
                  Chart: state,
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

          setLocations(updatedLocations);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchData();
      setLoadFirst(false);
    }
  }, [loadFirst, locations, api_key]);

  useEffect(() => {
    convertIntoTemperatureUnits();
  }, [selectedTemperature]);

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-16 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <div className="flex items-center">
              {edited ? (
                <input
                  type="text"
                  className="w-full border border-primary rounded-md px-2 py-1"
                  placeholder="Enter schedule name"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                />
              ) : (
                <>
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                    {instanceName}
                  </h1>
                  <button onClick={() => setEdited(true)}>
                    <GoPencil className="ml-4 text-lg" />
                  </button>
                </>
              )}
            </div>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
              <button className=" flex align-middle border-primary items-center border-2 rounded-full py-1 px-4 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Preview
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle bg-primary text-white items-center rounded-full py-1 px-4 text-base hover:shadow-lg hover:shadow-primary-500/50">
                Save
              </button>
              <div className="relative">
                <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full py-[10px] px-[11px] text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <BiDotsHorizontalRounded />
                </button>
              </div>

              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full px-[10px] text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <Link to="/weather">
                  <AiOutlineClose />
                </Link>
              </button>
            </div>
          </div>
          <div className="mt-5 mb-5">
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-10 ">
                <div className="shadow-md bg-white rounded-lg p-5 h-full">
                  <div className="mb-3 w-full">
                    <label className="relative inline-flex items-center cursor-pointer w-full">
                      <span className="w-2/5 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Use screen location*:
                      </span>
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
                            onClick={() => {
                              setEnabled(!enabled);
                            }}
                            className={`w-11 h-6 ${
                              isMuted ? "bg-SlateBlue" : "bg-lightgray"
                            } rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all `}
                          ></div>
                        </label>
                      </div>
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="mb-3 relative inline-flex items-center w-full">
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
                      value={language}
                    >
                      <option value="English">English</option>
                      <option value="German">German</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>
                  {locations.map((location) => (
                    <div
                      className="mb-3 relative inline-flex items-center w-full"
                      key={location.id}
                    >
                      <label
                        htmlFor="countries"
                        className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Location {location.id}:
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={location.location}
                        value={location.location}
                        onChange={(e) =>
                          handleLocationChange(location.id, e.target.value)
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

                  <div className="mb-3 relative inline-flex items-center w-full">
                    <label
                      htmlFor="message"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Temperature Unit:
                    </label>
                    <select
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={(e) => setSelectedTemperature(e.target.value)}
                      value={selectedTemperature}
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
                      Ticker Tape View:
                    </label>
                    <select
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option selected>Today's Weather</option>
                      <option value="US">Weekly forecast Weather</option>
                    </select>
                  </div>
                  <div className="mb-3 relative inline-flex items-center w-full">
                    <label
                      htmlFor="message"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Backgound Color:
                    </label>
                    <SketchPicker
                      color={selectedColor}
                      onChange={(color) => setSelectedColor(color.hex)}
                      className="sketch-picker"
                    />
                  </div>
                  <p className="text-center pt-6">
                    If you choose to display weather in a ticker tape zone
                    layout, then this setting determines the view. If using full
                    screen as in the preview above, this setting will not alter
                    the app.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-10 ">
                <div className="shadow-md bg-white rounded-lg p-5 h-full">
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
                    <div
                      className="overflow-x-auto bg-blue border-white rounded-lg relative p-5"
                    >
                      <div className="lg:mx-auto md:mx-auto lg:max-w-5xl md:max-w-3xl sm:max-w-xl xs:w-full mx-auto bg-teal border-width-10px border-black">
                        <div className="flex flex-row text-[#ffffff]">
                          {locations?.map((item, index) => {
                            if (item?.weatherData !== null) {
                              return (
                                <div
                                  className="w-full flex flex-col"
                                  key={index}
                                >
                                  <div className="bg-teal-lighter flex-1 flex flex-col">
                                    <div className="p-3 title text-[#ffffff]">
                                      <h3 className="text-2xl font-medium text-[#ffffff]">
                                        {item?.location}
                                      </h3>
                                    </div>
                                    <div className="px-3 flex items-center text-[#ffffff]">
                                      <div className="bg-primary text-sm rounded py-2 px-3 mr-3">
                                        Today
                                      </div>
                                      <div className="text-sm">
                                        <p>
                                          {item?.weatherData?.list[0]?.Day}{" "}
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
                                        <h4 className="text-4xl flex items-start justify-end">
                                          {
                                            item?.weatherData?.list[0]?.main
                                              ?.temp
                                          }
                                          <span className="text-lg leading-3 ml-1 mt-2">
                                            {selectedTemperature ===
                                            "Fahrenheit"
                                              ? "°F"
                                              : selectedTemperature === "Kelvin"
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
                                          {selectedTemperature === "Fahrenheit"
                                            ? "°F"
                                            : selectedTemperature === "Kelvin"
                                            ? "K"
                                            : selectedTemperature === "Rankine"
                                            ? "°R"
                                            : selectedTemperature === "Reaumur"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherDetail;
