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

const WeatherDetail = ({ sidebarOpen, setSidebarOpen }) => {
  let api_key = "41b5176532e682fd8b4cb6a44e3bd1a4";

  const [edited, setEdited] = useState(false);
  const currentDate = new Date();
  const [instanceName, setInstanceName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm")
  );
  const [weatherData, setWeatherData] = useState(null);
  const [language, setLanguage] = useState("");
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
  const [locations, setLocations] = useState([
    { id: 1, location: "india", weatherData: null },
    { id: 2, location: "", weatherData: null },
    { id: 3, location: "", weatherData: null },
  ]);
  const handleLocationChange = (id, newLocation) => {
    setLocations((prevLocations) =>
      prevLocations.map((location) =>
        location.id === id ? { ...location, location: newLocation } : location
      )
    );
  };
  useEffect(() => {
    // Fetch weather data for each location
    locations.forEach((location) => {
      const { id, location: loc } = location;
      if (loc) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${api_key}`;

        axios
          .get(apiUrl)
          .then((response) => {
            // Update weather data for the specific location
            setLocations((prevLocations) => {
              const updatedLocations = prevLocations.map((prevLocation) =>
                prevLocation.id === id
                  ? { ...prevLocation, weatherData: response.data }
                  : prevLocation
              );
              return updatedLocations;
            });
            console.log(response.data);
          })
          .catch((error) => {
            console.error(
              `Error fetching weather data for location ${loc}: `,
              error
            );
          });
      }
    });
  }, [locations, api_key]);
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
                            //   checked={isMuted}
                            //   onChange={handleMuteChange}
                          />
                          <div
                            //   onClick={() => {
                            //     setEnabled(!enabled);
                            //   }}
                            className="w-11 h-6 bg-lightgray rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all "
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
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option selected>English</option>
                      <option value="US">German</option>
                      <option value="CA">Germany</option>
                      <option value="FR">France</option>
                      <option value="DE">Arabic</option>
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
                        onChange={(e) =>
                          handleLocationChange(location.id, e.target.value)
                        }
                      />
                      {/* {location.weatherData ? (
                        <div>
                          <h3>City: {location.weatherData.name}</h3>
                          <p>Temperature: {location.weatherData.main.temp} K</p>
                          <p>
                            Weather:{" "}
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
                    >
                      <option selected>Celsius</option>
                      <option value="US">Fahrenheit</option>
                      <option value="CA">Kelvin</option>
                      <option value="FR">Rankie</option>
                      <option value="DE">Reaumur</option>
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
                    className="w-full p-12 flex items-center justify-center"
                    style={{
                      borderRadius: "0.625rem",
                      border: "2px solid #FFF",
                      background:
                        "linear-gradient(190deg, #3844B0 36.01%, #5D55BA 53.12%, #5261C6 76.59%)",
                      boxShadow: "0px 10px 15px 0px rgba(0, 0, 0, 0.25)",
                      height: "100%",
                    }}
                  ></div>
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
