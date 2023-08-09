import ReactApexChart from "react-apexcharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  GET_ALL_COUNTRY,
  GET_SELECT_BY_CITY,
  GET_SELECT_BY_STATE,
} from "../../../Pages/Api";
import Screens from "./Screens";
import RevenueTable from "../RevenueTable";
import MarkerClusterGroup from "react-leaflet-cluster";

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
  labels: ["Android", "Tizen", "Webos", "Raspberry"],
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

const Business = () => {
  //for map store icon
  const center = [20.5937, 78.9629];
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

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
    if (selectedCountry) {
      fetch(`${GET_SELECT_BY_STATE}?CountryID=${selectedCountry}`)
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
    if (selectedState) {
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

  //for show country store
  const [showStore, setShowStore] = useState(false);

  //for marker click event
  const handleMarkerClick = (countryID) => {
    setSelectedCountry(countryID);
    setShowStore(true);
  };

  //for city select popup
  const [showCitydw, setShowCityDw] = useState(false);

  //for city store  popup
  const [showCityStores, setshowCityStores] = useState(false);

  const [selectedStateName, setSelectedStateName] = useState("");
  return (
    <>
      {/* google map start */}
      <div className="bg-white shadow-md rounded-lg mt-9">
        <div className="lg:p-9 md:p-6 sm:p-3 xs:p-2">
          <MapContainer
            center={center}
            zoom={4}
            maxZoom={18}
            style={{ width: "100%", height: "560px" }}
          >
            <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>

            <MarkerClusterGroup>
              {countries.map((country) => (
                <Marker
                  key={country.countryID}
                  position={[country.latitude, country.longitude]}
                  eventHandlers={{
                    click: () => handleMarkerClick(country.countryID),
                  }}
                ></Marker>
              ))}
              {selectedCountry &&
                states.map((state) => (
                  <Marker
                    key={state.stateId}
                    position={[state.latitude, state.longitude]}
                  ></Marker>
                ))}
              {selectedState &&
                cities.map((city) => (
                  <Marker
                    key={city.cityID}
                    position={[city.latitude, city.longitude]}
                  ></Marker>
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
            <div className="p-3  justify-between lg:flex md:flex sm:flex xs:block items-center">
              <div className="flex items-center lg:mb-0 md:mb-0 sm:mb-0 xs:mb-2">
                <img
                  src="../../../../DisployImg/flag.png"
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-2 font-semibold">India</div>
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
          <div className="p-5 lg:flex md:flex sm:flex xs:block justify-between ">
            <div>
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
                onChange={() => {
                  setshowCityStores(true);
                }}
                placeholder="Select City"
                className="z-10"
              />
            </div>
          </div>
          {showCityStores && (
            <>
              <div className="pb-4 ">
                <div>
                  <label className="p-5 text-lg font-semibold">Ahemdabad</label>
                </div>
                <div className="m-6">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md p-4">
                      <h5 className="text-xl font-semibold text-black dark:text-white">
                        Total Stores
                      </h5>

                      <div className="relative aspect-w-1 aspect-h-1">
                        <ReactApexChart
                          options={StoreOptions}
                          series={StoreOptions.series}
                          type="radialBar"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-6  md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md p-4">
                      <h5 className="text-xl font-semibold text-black dark:text-white">
                        Total Screens
                      </h5>

                      <div className="mb-2 mt-9">
                        <div className="mx-auto flex justify-center">
                          <ReactApexChart
                            options={ScreenOption}
                            series={ScreenOption.series}
                            type="donut"
                          />
                        </div>
                      </div>
                      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
                        <div className="w-full px-8 sm:w-1/2">
                          <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#404f8b]"></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                              <span> Android </span>
                              <span> 65% </span>
                            </p>
                          </div>
                        </div>
                        <div className="w-full px-8 sm:w-1/2">
                          <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#8ca0b9]"></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                              <span> Tizen </span>
                              <span> 34% </span>
                            </p>
                          </div>
                        </div>
                        <div className="w-full px-8 sm:w-1/2">
                          <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#8ca0b9]"></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                              <span> Webos </span>
                              <span> 45% </span>
                            </p>
                          </div>
                        </div>
                        <div className="w-full px-8 sm:w-1/2">
                          <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-3 max-w-3 rounded-full bg-[#b2c7d0]"></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                              <span> Raspberry </span>
                              <span> 12% </span>
                            </p>
                          </div>
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

      <div className=" mt-5 ">
        <div className="grid grid-cols-12 gap-4">
          {/* Revenue chart start*/}
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
                  height="300px"
                />
              </div>
            </div>
          </div>
          {/* Revenue chart end*/}
          {/* RevenueTable start*/}
          <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 bg-white shadow-lg rounded-md ">
            <RevenueTable />
          </div>
          {/* RevenueTable end*/}
        </div>
      </div>
      {/* app store start*/}
      <div className="mt-5 mb-5">
        <div className="grid grid-cols-12 gap-4">
          <div className="lg:col-span-3 md:col-span-6 sm:col-span-12 ">
            <div className="shadow-md  bg-white rounded-lg text-center py-10">
              <img
                src="/AppsImg/app1.png"
                alt="Logo"
                className="cursor-pointer mx-auto h-16 w-16"
              />
              <h4 className="text-size-md font-semibold py-5">Grafana</h4>
            </div>
          </div>
          <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
            <div className="shadow-md  bg-white rounded-lg text-center py-10">
              <img
                src="/AppsImg/app2.png"
                alt="Logo"
                className="cursor-pointer mx-auto h-16 w-16 "
              />
              <h4 className="text-size-md font-semibold py-5">Tableau</h4>
            </div>
          </div>
          <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
            <div className="shadow-md  bg-white rounded-lg text-center py-10">
              <img
                src="/AppsImg/app3.png"
                alt="Logo"
                className="cursor-pointer mx-auto h-[64px] w-[64px]"
              />
              <h4 className="text-size-md font-semibold py-5">Tableau</h4>
            </div>
          </div>
          <div className="lg:col-span-3 md:col-span-6 sm:col-span-12">
            <div className="shadow-md  bg-white rounded-lg text-center py-10">
              <img
                src="/AppsImg/app4.png"
                alt="Logo"
                className="cursor-pointer mx-auto h-16 w-16"
              />
              <h4 className="text-size-md font-semibold py-5">And many more</h4>
            </div>
          </div>
        </div>
      </div>
      {/* app store end*/}
    </>
  );
};

export default Business;
