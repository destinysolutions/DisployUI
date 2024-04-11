import React, { Suspense, useEffect, useState } from "react";
import Loading from "../../../Loading";
import PropTypes from "prop-types";
import Sidebar from "../../../Sidebar";
import { MapContainer, TileLayer } from "react-leaflet";
import { AiOutlineSearch } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { IoEarthSharp } from "react-icons/io5";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Navbar";
import { SCREEN_LIST } from "../../../../Pages/Api";
import axios from "axios";
import Select from "react-select";
import { multiOptions } from "../../../Common/Common";
const BookSlot = ({ sidebarOpen, setSidebarOpen }) => {
  BookSlot.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const navigate = useNavigate();
  const center = [20.5937, 78.9629];
  const [sidebarload, setSidebarLoad] = useState(false);
  const [rangeValue, setRangeValue] = useState(5);
  const [Open, setOpen] = useState(false);
  const [screenData, setScreenData] = useState([]);
  const [selectedScreens, setSelectedScreens] = useState([]);



  const handleRangeChange = (e) => {
    setRangeValue(parseInt(e.target.value));
  };
  // const options = [
  //   { label: "Option 1", value: "option1" },
  //   { label: "Option 2", value: "option2" },
  //   { label: "Option 3", value: "option3" },
  // ];

  const options = multiOptions(screenData);

  const FetchScreen = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: SCREEN_LIST,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        setScreenData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    FetchScreen();
  }, []);


  const handleSelectChange = (selected) => {
    setSelectedScreens(selected);
  };

  return (
    <>
      {sidebarload && <Loading />}

      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
            <div className="p-1">
              <div>
                <h1 className="text-3xl py-5">Book Your Slot</h1>
              </div>
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-2 rounded-lg bg-white p-5">
                  <div className="flex flex-col gap-2">
                    <div>TimeZone</div>
                    <div className="flex items-center gap-2">
                      <IoEarthSharp />
                      {new Date()
                        .toLocaleDateString(undefined, {
                          day: "2-digit",
                          timeZoneName: "long",
                        })
                        .substring(4)}
                    </div>
                    <div>India</div>
                    <div className="flex flex-row gap-2 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <span className="flex items-center ">
                        <FiMapPin className="w-5 h-5 text-black " />
                      </span>
                      <div className="text-base flex items-center">
                        <h2>Navrangpura, Ahmedabad, Gujarat, India</h2>
                      </div>

                      <span className="flex items-center justify-end">
                        <div className=" flex flex-row items-center border rounded-lg">
                          <div
                            className="flex items-center"
                            onClick={() => setOpen(!Open)}
                          >
                            <div className="text-black p-1 px-2 no-underline hidden md:block lg:block cursor-pointer">
                              +20 km
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                    <div>United States</div>
                    <div className="flex flex-row gap-2 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <span className="flex items-center ">
                        <FiMapPin className="w-5 h-5 text-black " />
                      </span>
                      <div className="text-base flex items-center">
                        <h2>Chicago, New Chicago, New York, USA</h2>
                      </div>

                      <span className="flex items-center justify-end">
                        <div className=" flex flex-row items-center border rounded-lg">
                          <div
                            className="flex items-center"
                            onClick={() => setOpen(!Open)}
                          >
                            <div className="text-black p-1 px-2 no-underline hidden md:block lg:block cursor-pointer">
                              +30 km
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <select className="border border-primary rounded-lg px-4 pl-2 py-2 search-user w-full">
                        <option value="">Include</option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="relative col-span-2">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMapPin className="w-5 h-5 text-black " />
                        </span>
                        <input
                          type="text"
                          placeholder="Search" //location ,screen, tag
                          className="border border-primary rounded-lg px-7 pl-10 py-2 search-user w-full"
                        />
                      </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg mt-9">
                      <div className="lg:p-9 md:p-6 sm:p-3 xs:p-2">
                        <MapContainer
                          center={center}
                          zoom={4}
                          maxZoom={18}
                          style={{
                            width: "100%",
                            height: "460px",
                            zIndex: 0,
                          }}
                        >
                          <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>
                        </MapContainer>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-5 flex flex-col gap-2">
                  <div>Reach</div>
                  <div className="text-2xl">17 Screens</div>
                  <div>
                    Do you want to book your slot for all screens or any
                    particular screen?
                  </div>

                  <div className="grid grid-cols-4 gap-4 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <div className="col-span-3">
                      <h2>All Screen</h2>
                    </div>

                    <span className="col-span-1 flex items-center justify-end">
                      <input type="checkbox" className="cursor-pointer" />
                    </span>
                  </div>
                  <Select
                    defaultValue={selectedScreens}
                    onChange={handleSelectChange}
                    options={options}
                    isMulti
                  />
                  <div className="flex justify-center">
                    <button
                      className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                      onClick={() => navigate("/bookingslot")}
                    >
                      Book Your Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
          {Open && (
            <div
              id="ProfileDropDown"
              className={`rounded ${
                Open ? "none" : "hidden"
              } shadow-md bg-white absolute mt-44 z-[9999] w-48`}
            >
              <div>
                <div className="border-b flex justify-center">
                  <div className="p-2">Current city only</div>
                </div>
                <div className="p-2 flex gap-2 items-center">
                  <BsCheckCircleFill className="text-blue-6 00" />
                  Cities Within Radius
                </div>
                <div className="relative mb-8 mx-2">
                  <div>
                    <input
                      id="labels-range-input"
                      type="range"
                      min="0"
                      max="30"
                      step="5"
                      value={rangeValue}
                      onChange={handleRangeChange}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
                      5
                    </span>

                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                      30
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Suspense>
      )}
    </>
  );
};

export default BookSlot;
