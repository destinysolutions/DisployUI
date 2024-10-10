import React from "react";
import { useState, useEffect, useRef } from "react";
// import moment from "moment";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { GoPencil } from "react-icons/go";
import { Link, } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AiOutlineClose,
} from "react-icons/ai";
import { MdSave } from "react-icons/md";
import { useSelector } from "react-redux";
import * as moment from "moment-timezone";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

const ct = require("countries-and-timezones");
const libraries = ["places"];

const ClockDetail = ({ sidebarOpen, setSidebarOpen }) => {
  const currentDate = new Date();
  const inputRef = useRef(null);
  const { user, token, userDetails } = useSelector((state) => state.root.auth);

  const [instanceName, setInstanceName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm")
  );

  const [edited, setEdited] = useState(false);
  const [toggle, settoggle] = useState({
    hoursformat: false,
    Displaydate: false,
    Displayseconds: false,
  });
  const [Clock, setClock] = useState({
    Style: "Simple",
    hoursformat12: "",
    Displaydate: "",
    Displayseconds: "",
    Location: "",
  });

  const [time, setTime] = useState(moment());
  const [selectclock, setselectclock] = useState("1");
  const [countryCode, setCountryCode] = useState("");
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState();
  const country = ct.getCountry(countryCode);


  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = moment().format("ddd");
  const date = moment().format("DD");
  const AmPm = moment().format("A");

  const formattedTime = moment(time).format(Clock.hoursformat12 ? Clock.Displayseconds ? "hh:mm:ss " : "hh:mm " : Clock.Displayseconds ? "HH:mm:ss" : "HH:mm");


  useEffect(() => {
    setLocation(country?.timezones[0]);
  }, [country]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(moment().tz(location) || new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [location]);

  const handleOnSaveInstanceName = (e) => {
    if (!instanceName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter at least minimum 1 character.");
    }
    setEdited(false);
  };
  const handleMuteChange = (e) => {
    console.log(e, "e");
    const { name, checked } = e.target;
    setClock((pre) => ({
      ...pre,
      [name]: checked,
    }));
  };


  const handleselectclock = (e) => {
    const { value } = e.target;
    setselectclock(value);

    setClock((pre) => ({
      ...pre,
      Style: value === null ? "Simple" : value, // Conditional update for Style
    }));
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && map) {
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );
      setPlacesService(new window.google.maps.places.PlacesService(map));
    }
  }, [isLoaded, map]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setDescription(input);

    if (input && autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input },
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (placeId, description) => {
    setDescription(description);
    setClock((pre) => ({
      ...pre,
      Location: description,
    }));
    setSuggestions([]);

    if (placesService) {
      placesService.getDetails({ placeId }, (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place.geometry
        ) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          // Reverse Geocode to get country code and city details
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
              const countryResult = results[0].address_components.find(
                (component) => component.types.includes("country")
              );
              if (countryResult) {
                setCountryCode(countryResult.short_name); // Short name like "US" or "IN"
              }
            } else {
              setCountryCode("Not Found");
            }
          });
        }
      });
    }
  };

  const handlesave = () => {
    alert("save");
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  const formattedCurrentTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
  const targetTime = new Date(Date.now() + 24 * 3600 * 1000 + 5000);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      {/* {sidebarload && <Loading />} */}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div
        className={
          userDetails?.isTrial &&
            user?.userDetails?.isRetailer === false &&
            !userDetails?.isActivePlan
            ? "lg:pt-32 md:pt-32 sm:pt-20 xs:pt-20 px-5 page-contain"
            : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"
        }
      >
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
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
                      setShowPreview(!showPreview);
                    }}
                  >
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                  <button
                    className="flex align-middle border-white bg-SlateBlue text-white sm:mt-2  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 .  text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    onClick={() => handlesave()}
                    disabled={showPreview}
                  >
                    {/* {saveLoading ? "Saving..." : "Save"} */}
                    Save
                  </button>

                  <Link to="/Clock">
                    <button className="sm:ml-2 xs:ml-1 sm:mt-2 border-primary items-center border-2  rounded-full text-xl  hover:text-white hover:bg-SlateBlue hover:border-white hover:shadow-lg hover:shadow-primary-500/50 p-2 ">
                      <AiOutlineClose />
                    </button>
                  </Link>
                </div>

              </div>

              <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg h-full">
                <div className="w-full lg:w-2/5 pr-0 lg:pr-4 p-5">
                  <div className="mb-3 relative inline-flex items-center w-full">
                    <label
                      htmlFor="message"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Clock Style*
                    </label>
                    <select
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={Clock.Style}
                      onChange={handleselectclock}
                    >
                      <option value="Simple">Simple</option>
                      <option value="Digital">Digital</option>
                      <option value="Flip">Flip</option>
                    </select>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <label
                      htmlFor="message"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      12 hours format
                    </label>
                    <div className="text-right">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          readOnly
                          name="hoursformat12"
                          checked={Clock.hoursformat12}
                          onChange={(e) => handleMuteChange(e)}
                        />
                        <div
                          className={`w-11 h-6 ${Clock.hoursformat12 ? "bg-SlateBlue" : "bg-gray-300"} rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <label
                      htmlFor="message"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Display date
                    </label>
                    <div className="text-right">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          readOnly
                          name="Displaydate"
                          checked={Clock.Displaydate}
                          onChange={(e) => handleMuteChange(e)}
                        />
                        <div
                          className={`w-11 h-6 ${Clock.Displaydate ? "bg-SlateBlue" : "bg-gray-300"
                            } rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <label
                      htmlFor="message"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Display seconds
                    </label>
                    <div className="text-right">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          readOnly
                          name="Displayseconds"
                          checked={Clock.Displayseconds}
                          onChange={(e) => handleMuteChange(e)}
                        />
                        <div
                          className={`w-11 h-6 ${Clock.Displayseconds
                            ? "bg-SlateBlue"
                            : "bg-gray-300"
                            } rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                        ></div>
                      </label>
                    </div>
                  </div>

                  <div className="mb-3 relative inline-flex items-center w-full">
                    <label
                      htmlFor="countries"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Location
                    </label>

                    <input
                      ref={inputRef}
                      value={description}
                      type="text"
                      id="first_name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select Location"
                      onChange={handleInputChange}
                    />
                    {suggestions.length > 0 && (
                      <ul
                        style={{
                          position: "absolute",
                          top: "45px",
                          left: 0,
                          width: "100%",
                          maxHeight: "150px",
                          overflowY: "auto",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                          zIndex: 1000,
                        }}
                      >
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            onClick={() =>
                              handleSuggestionClick(
                                suggestion.place_id,
                                suggestion.description
                              )
                            }
                            style={{
                              padding: "10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className=" hidden">
                      <GoogleMap onLoad={(map) => setMap(map)}></GoogleMap>
                    </div>
                  </div>
                </div>

                <div className="border-r-0 lg:border-r-2 border-gray-300 h-auto mx-4 hidden lg:block"></div>
                <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                <div className="w-full lg:w-3/5 sm:h-[50vh] xl:h-[75vh]  flex items-center justify-center mt-4 lg:mt-0">
                  <div className="w-[95%] h-[200px] xl:h-[400px] sm:h[500px] bg-gray-50 rounded-sm shadow-md border-4 border-black flex items-center justify-center min-h-[100px] max-w-[1200px] mx-auto ">

                    <div className=" flex flex-col">
                      <div className="flex items-center space-x-5">

                        <div className="date-section">
                          {Clock.Displaydate && (
                            <div className=" ml-1 mb-3">
                              <div className=" sm:text-sm xl:text-lg text-gray-500">
                                Date
                              </div>
                              <div className="sm:text-sm xl:text-xl text-gray-600">
                                {date}
                              </div>
                            </div>
                          )}
                        </div>

                        <p
                          className="xl:text-6xl font-bold"
                          style={{ fontFamily: Clock.Style === "Digital" ? "digital" : "inherit" }}
                        >
                          {formattedTime}
                        </p>


                        {Clock.hoursformat12 &&
                          <span className="xl:text-lg sm:text-sm text-gray-700 mb-7">
                            {AmPm}
                          </span>
                        }
                      </div>
                      <h1>Current Time: {formattedCurrentTime}</h1>

                      <FlipClockCountdown
                        to={targetTime}
                        labels={['HOURS', 'MINUTES']}
                        labelStyle={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}
                        digitBlockStyle={{ width: 40, height: 60, fontSize: 30 }}
                        dividerStyle={{ color: 'white', height: 1 }}
                        separatorStyle={{ color: 'red', size: '6px' }}
                        duration={0.5}
                        className='flip-clock'
                      />

                      <div className="flex space-x-2 items-center justify-center mt-3">
                        {daysOfWeek.map((day, index) => (
                          <span
                            key={index}
                            className={`text-xs sm:text-sm xl:text-lg ${day === dayOfWeek.toUpperCase()
                              ? "text-blue-500 font-semibold"
                              : ""
                              }`}
                          >
                            {day}
                          </span>
                        ))}

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

export default ClockDetail;
