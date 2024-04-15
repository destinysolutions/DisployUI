import ReactApexChart from "react-apexcharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  GET_ALL_COUNTRY,
  GET_SELECT_BY_CITY,
  GET_SELECT_BY_STATE,
  USERDASHBOARD,
} from "../../../Pages/Api";
import RevenueTable from "../RevenueTable";
import MarkerClusterGroup from "react-leaflet-cluster";
import mapImg from "../../../images/DisployImg/mapImg.png";
import flagUmg from "../../../images/DisployImg/flag.png";
import youtube from "../../../images/AppsImg/youtube.svg";
import weather from "../../../images/AppsImg/weather.svg";
import textscroll from "../../../images/AppsImg/text-scroll-icon.svg";
import More from "../../../images/AppsImg/app4.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleGetAllApps } from "../../../Redux/AppsSlice";
import axios from "axios";

//for sales revenue chart options
const SalesOptions = {
  colors: ["#404f8b"],
  chart: {
    type: "basic-bar",
  },

  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
};

const stateVlaue = {
  series: [
    {
      name: "Sales",
      data: [44, 55, 41, 67, 22, 43, 65, 25, 80, 60, 40, 15],
    },
  ],
};

//for Company Growth chart options
const CompanyGrowthOption = {
  series: [40],
  chart: {
    height: 150,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      startAngle: -180,
      endAngle: 180,
      dataLabels: {
        name: {
          fontSize: "16px",
          color: undefined,
        },
        value: {
          offsetY: 16,
          fontSize: "18px",
          color: undefined,
          formatter: function (val) {
            return val + "%";
          },
        },
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      shadeIntensity: 0.15,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91],
    },
  },
  stroke: {
    dashArray: 10,
  },
  labels: ["Growth"],
  colors: ["#41479b"],
};

//for Screen chart options
const ScreenOption = {
  chart: {
    type: "donut",
  },
  series: [80, 25, 37, 18],
  colors: ["#404f8b", "#59709a", "#8ca0b9", "#b2c7d0"],
  labels: ["Android", "Tizen", "Webos", "Raspberry", "Fire Stick"],
  legend: {
    show: true,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

//for Stores chart options
var StoreOptions = {
  chart: {
    type: "radialBar",
  },
  series: [80],
  colors: ["#404f8b"],
  labels: ["Stores"],
};

const Business = ({ setSidebarLoad, dashboardData, setDashboardData }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.root.auth);
  const { allApps } = useSelector((state) => state.root.apps);
  const authToken = `Bearer ${token}`;
  //for map store icon
  const center = [20.5937, 78.9629];
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedScreen, setSelectedScreen] = useState("");

  const [cities, setCities] = useState([]);
  const [showCityStores, setshowCityStores] = useState(false);
  const [selectedStateName, setSelectedStateName] = useState("");
  const [showStore, setShowStore] = useState(false);
  const [showCitydw, setShowCityDw] = useState(false);

  const [allApp, setAllApp] = useState({
    AppLists: [],
    AppPercentages: [],
    AppOnlines: [],
    AppOnlinePercentages: [],
  });

  useEffect(() => {
    let AppList = [];
    let AppPercentage = [];
    let AppOnline = [];
    let AppOnlinePercentage = [];
    dashboardData?.totalScreen?.map((item) => {
      AppList?.push(item?.name);
      AppPercentage?.push(Number(item?.percentage));
    });
    dashboardData?.totalStore?.map((item) => {
      AppOnline?.push(item?.name);
      AppOnlinePercentage?.push(Number(item?.percentage));
    });
    setAllApp({
      ...allApp,
      AppLists: AppList,
      AppPercentages: AppPercentage,
      AppOnlines: AppOnline,
      AppOnlinePercentages: AppOnlinePercentage,
    });
  }, [dashboardData]);

  const ScreenAppOption = {
    chart: {
      type: "donut",
    },
    series: allApp?.AppPercentages,
    colors: ["#404f8b", "#59709a", "#8ca0b9", "#b2c7d0", "#141e4a"],
    labels: allApp?.AppLists,
    legend: {
      show: true,
      position: "bottom",
    },

    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const ScreenAppOnlineOfflineOption = {
    chart: {
      type: "donut",
    },
    series: allApp?.AppOnlinePercentages,
    colors: ["#FF0000", "#3AB700"],
    labels: allApp?.AppOnlines,
    legend: {
      show: true,
      position: "bottom",
    },

    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };
  useEffect(() => {
    dispatch(handleGetAllApps({ token }));
  }, []);

  // Fetch country data from the API
  useEffect(() => {
    fetch(GET_ALL_COUNTRY)
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.data);
      })
      .catch((error) => {
        console.log("Error fetching country data:", error);
      });
  }, []);

  // Fetch states based on the selected country
  useEffect(() => {
    if (selectedCountry !== "") {
      fetch(`${GET_SELECT_BY_STATE}?CountryID=${selectedCountry?.countryID}`)
        .then((response) => response.json())
        .then((data) => {
          setStates(data.data);
        })
        .catch((error) => {
          console.log("Error fetching states data:", error);
        });
    }
  }, [selectedCountry]);

  // Fetch cities based on the selected state
  useEffect(() => {
    if (selectedState !== "") {
      fetch(`${GET_SELECT_BY_CITY}?StateId=${selectedState}`)
        .then((response) => response.json())
        .then((data) => {
          setCities(data.data);
        })
        .catch((error) => {
          console.log("Error fetching cities data:", error);
        });
    }
  }, [selectedState]);

  //for marker click event
  const handleMarkerClick = (country) => {
    setSelectedCountry(country);
    setShowStore(true);
  };

  const handleStateMarker = (state) => {
    setSelectedState(state.stateId);
    setSelectedStateName(state.stateName);
    setShowCityDw(true);
    setShowStore(false);
  };

  const handleCityMarker = (city) => {
    setSelectedCity(city?.cityName);
    setshowCityStores(true);
  };
  const customIcon = new L.Icon({
    iconUrl: mapImg,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  const handleScreenClick = (screen) => {
    setSelectedScreen(screen);
  };

  return (
    <>
      {/* google map start */}
      {/* {(user?.userRole === "1" || user?.userRole === 1) && (
        <div className="bg-white shadow-md rounded-lg mt-9">
          <div className="lg:p-9 md:p-6 sm:p-3 xs:p-2">
            <MapContainer
              center={center}
              zoom={4}
              maxZoom={18}
              style={{ width: "100%", height: "560px", zIndex: 0 }}
            >
              <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>

              <MarkerClusterGroup>
                {countries.map((country) => (
                  <Marker
                    key={country.countryID}
                    position={[country.latitude, country.longitude]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () =>
                        handleMarkerClick && handleMarkerClick(country),
                    }}
                  >
                    <Popup>
                      <h3 className="flex flex-row gap-1">
                        <span>Country :</span>
                        <span>{selectedCountry?.countryName}</span>
                      </h3>
                      <div className="flex flex-col">
                        <h5 className="flex flex-row gap-2">
                          <span>latitude :</span>
                          <span>{selectedCountry?.latitude}</span>
                        </h5>
                        <h5 className="flex flex-row gap-2">
                          <span>longitude :</span>
                          <span>{selectedCountry?.longitude}</span>
                        </h5>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {selectedCountry !== "" &&
                  states.map((state) => (
                    <Marker
                      key={state.stateId}
                      position={[state.latitude, state.longitude]}
                      icon={customIcon}
                      eventHandlers={{
                        click: () =>
                          handleStateMarker && handleStateMarker(state),
                      }}
                    ></Marker>
                  ))}
                {selectedState !== "" &&
                  cities.map((city) => (
                    <Marker
                      key={city.cityID}
                      icon={customIcon}
                      position={[city.latitude, city.longitude]}
                      eventHandlers={{
                        click: () => handleCityMarker && handleCityMarker(city),
                      }}
                    ></Marker>
                  ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        </div>
      )} */}

      <div className="bg-white shadow-md rounded-lg mt-5">
        <div className="lg:p-5 md:p-4 sm:p-3 xs:p-2">
          <MapContainer
            center={center}
            zoom={4}
            maxZoom={18}
            style={{ width: "100%", height: "560px", zIndex: 0 }}
          >
            <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>

            <MarkerClusterGroup>
              {dashboardData?.screen?.map((screen, index) => (
                <Marker
                  key={index}
                  position={[screen.lattitude, screen.longituted]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleScreenClick && handleScreenClick(screen),
                  }}
                >
                  <Popup>
                    <h3 className="flex flex-row gap-1">
                      <span>Location :</span>
                      <span>{selectedScreen?.location}</span>
                    </h3>
                    <div className="flex flex-col">
                      <h5 className="flex flex-row gap-2">
                        <span>Total Screen :</span>
                        <span>{selectedScreen?.screen}</span>
                      </h5>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
      {/* google map end */}
      {/* country store popup start */}
      {showStore && (
        <>
          <div className="bg-white shadow-md rounded-lg mt-5 ">
            <div className="p-3 lg:flex md:flex sm:flex xs:block items-center">
              <div className="flex flex-row items-center lg:mb-0 md:mb-0 sm:mb-0 xs:mb-2">
                <img
                  src={selectedCountry?.countryFlag}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-2 mr-6 font-semibold">
                  {selectedCountry?.countryName}
                </div>
              </div>
              <div>
                <Select
                  id="state"
                  options={states.map((state) => ({
                    value: state.stateId,
                    label: state.stateName,
                  }))}
                  onChange={(selectedOption) => {
                    setSelectedState(selectedOption.value);
                    setSelectedStateName(selectedOption.label);
                    setShowCityDw(true);
                    setShowStore(false);
                  }}
                  placeholder="Select State"
                  className=" placeholder:text-sm z-10"
                />
              </div>
            </div>
          </div>
        </>
      )}
      {/* country store popup end */}
      {/* city store popup start */}
      {showCitydw && (
        <div className="bg-white shadow-md rounded-lg mt-5">
          <div className="p-5 lg:flex md:flex sm:flex xs:block ">
            <div className="mr-5">
              <Select
                id="state"
                options={states.map((state) => ({
                  value: state.stateId,
                  label: state.stateName,
                }))}
                onChange={(selectedOption) => {
                  setSelectedState(selectedOption.value);
                }}
                placeholder={selectedStateName}
              />
            </div>
            <div className="lg:mt-0 md:mt-0 sm:mt-0 xs:mt-3 ">
              <Select
                id="city"
                options={cities.map((city) => ({
                  value: city.cityID,
                  label: city.cityName,
                }))}
                onChange={(selectedOption) => {
                  setSelectedCity(selectedOption?.label);
                  setshowCityStores(true);
                }}
                placeholder={selectedCity === "" ? "Select City" : selectedCity}
                className="z-10"
              />
            </div>
          </div>
          {showCityStores && (
            <>
              <div className="pb-4 ">
                <div>
                  <label className="p-5 text-lg font-semibold">
                    {selectedCity}
                  </label>
                </div>
                <div className="mt-6">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="lg:col-span-4 md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md p-4">
                      <h5 className="text-xl font-semibold text-black dark:text-white">
                        Total Stores
                      </h5>

                      <div className="relative aspect-w-1 aspect-h-1 md:mt-11">
                        <ReactApexChart
                          options={StoreOptions}
                          series={StoreOptions.series}
                          type="radialBar"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-8 md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md p-4 ">
                      <h5 className="text-xl font-semibold text-black dark:text-white">
                        Total Screens
                      </h5>
                      <div className="flex items-center justify-center flex-wrap">
                        <div className="mb-2 mt-9">
                          <div className="mx-auto flex justify-center">
                            <ReactApexChart
                              options={ScreenOption}
                              series={ScreenOption.series}
                              type="donut"
                            />
                          </div>
                        </div>

                        <div>
                          <table cellPadding={15}>
                            <tbody>
                              <tr>
                                <td className="flex items-center">
                                  <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#404f8b]"></span>
                                  Android
                                </td>
                                <td>65%</td>
                              </tr>
                              <tr>
                                <td className="flex items-center">
                                  <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#59709a]"></span>
                                  Tizen
                                </td>
                                <td>34%</td>
                              </tr>
                              <tr>
                                <td className="flex items-center">
                                  <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#8ca0b9]"></span>
                                  Webos
                                </td>
                                <td>45% </td>
                              </tr>
                              <tr>
                                <td className="flex items-center">
                                  <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#b2c7d0]"></span>
                                  Raspberry
                                </td>
                                <td>12%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* city store popup end */}
      {/* {(user?.userRole === "1" || user?.userRole === 1) && (
        <div className=" mt-5 ">
          <div className="grid grid-cols-12 gap-4">
            <div className="lg:col-span-6  md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-lg rounded-md">
              <div className="mb-4 justify-between items-center gap-4 sm:flex mt-3">
                <div>
                  <h4 className="text-xl font-semibold text-black dark:text-white ml-7 mt-4">
                    Total Revenue
                  </h4>
                </div>
                <div>
                  <div className="xs:ml-7">
                    <select className=" border border-primary mr-5 mt-2 px-2 rounded-full">
                      <option value="">2023</option>
                      <option value="">2022</option>
                      <option value="">2021</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div id="chartTwo" className="ml-5 mb-5">
                  <ReactApexChart
                    options={SalesOptions}
                    series={stateVlaue.series}
                    type="bar"
                    height="380px"
                  />
                </div>
              </div>
            </div>
          
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 bg-white shadow-lg rounded-md ">
              <RevenueTable />
            </div>
          </div>
        </div>
      )} */}
      {allApp?.AppLists?.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md p-4">
              <h5 className="text-xl font-semibold text-black dark:text-white">
                Total Stores
              </h5>

              <div className="flex items-center justify-center flex-wrap">
                <div className="mb-2 mt-9">
                  <div className="mx-auto flex justify-center">
                    <ReactApexChart
                      options={ScreenAppOnlineOfflineOption}
                      series={ScreenAppOnlineOfflineOption.series}
                      type="donut"
                    />
                  </div>
                </div>

                <div>
                  <table cellPadding={15}>
                    <tbody>
                      <tr>
                        <td className="flex items-center">
                          <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#3AB700]"></span>
                          {dashboardData?.totalStore?.[1]?.name}
                        </td>
                        <td>{dashboardData?.totalStore?.[1]?.percentage}%</td>
                      </tr>
                      <tr>
                        <td className="flex items-center">
                          <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#FF0000]"></span>
                          {dashboardData?.totalStore?.[0]?.name}
                        </td>
                        <td>{dashboardData?.totalStore?.[0]?.percentage}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md p-4 ">
              <h5 className="text-xl font-semibold text-black dark:text-white">
                Total Screens
              </h5>
              <div className="flex items-center justify-center flex-wrap">
                <div className="mb-2 mt-9">
                  <div className="mx-auto flex justify-center">
                    <ReactApexChart
                      options={ScreenAppOption}
                      series={ScreenAppOption.series}
                      type="donut"
                    />
                  </div>
                </div>

                <div>
                  <table cellPadding={15}>
                    <tbody>
                      <tr>
                        <td className="flex items-center">
                          <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#404f8b]"></span>
                          {dashboardData?.totalScreen?.[0]?.name}
                        </td>
                        <td>{dashboardData?.totalScreen?.[0]?.percentage}%</td>
                      </tr>
                      <tr>
                        <td className="flex items-center">
                          <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#59709a]"></span>
                          {dashboardData?.totalScreen?.[1]?.name}
                        </td>
                        <td>{dashboardData?.totalScreen?.[1]?.percentage}%</td>
                      </tr>
                      <tr>
                        <td className="flex items-center">
                          <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#8ca0b9]"></span>
                          {dashboardData?.totalScreen?.[2]?.name}
                        </td>
                        <td>{dashboardData?.totalScreen?.[2]?.percentage}%</td>
                      </tr>
                      <tr>
                        <td className="flex items-center">
                          <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#b2c7d0]"></span>
                          {dashboardData?.totalScreen?.[3]?.name}
                        </td>
                        <td>{dashboardData?.totalScreen?.[3]?.percentage}%</td>
                      </tr>
                      <tr>
                        <td className="flex items-center">
                          <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#141e4a]"></span>
                          {dashboardData?.totalScreen?.[4]?.name}
                        </td>
                        <td>{dashboardData?.totalScreen?.[4]?.percentage}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* app store start*/}
      <div className="mt-5 mb-5">
        <div className="grid grid-cols-12 gap-4">
          {allApps?.loading && (
            <div className="text-center col-span-full font-semibold text-xl">
              <>
                <div>
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
              </>
            </div>
          )}
          {allApps?.data.length === 0 && !allApps?.loading && (
            <div className="w-full text-center font-semibold text-xl col-span-full">
              No Apps here.
            </div>
          )}
          {!allApps?.loading &&
            allApps?.data.length > 0 &&
            allApps?.data?.slice(0, 4)?.map(
              (app) =>
                app.appType == "Apps" && (
                  <div
                    className="lg:col-span-3 md:col-span-6 sm:col-span-12 "
                    key={app.app_Id}
                  >
                    <Link to={`/${app.appURL}`}>
                      <div className="shadow-md  bg-white rounded-lg text-center py-10">
                        <img
                          src={app.appPath}
                          alt="Logo"
                          className="cursor-pointer mx-auto h-16 w-16 pb-2"
                        />
                        <h4 className="text-size-md font-semibold py-2">
                          {app.appName}
                        </h4>
                        <h4 className="text-sm font-normal ">{app.appUse}</h4>
                      </div>
                    </Link>
                  </div>
                )
            )}
          {/* {!allApps?.loading && allApps?.data.length > 0 && (
            <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
              <div className="shadow-md  bg-white rounded-lg text-center py-10">
                <img
                  src={More}
                  alt="Logo"
                  className="cursor-pointer mx-auto h-16 w-16"
                />
                <h4 className="text-size-md font-semibold py-5">And many more</h4>
              </div>
            </div>
         )}*/}
        </div>
      </div>
      {/* app store end*/}
    </>
  );
};

export default Business;
