import ReactApexChart from "react-apexcharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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

//for sales revenue chart options
const SalesOptions = {
  colors: ["#41479b", "#d1d5db"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ["Jan", "Feb", "March", "April", "May", "June", "July"],
  },

  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        // Modify the formatter function according to your desired format
        return value + "k";
      },
    },
  },
};

const stateVlaue = {
  series: [
    {
      name: "Sales",
      data: [44, 55, 41, 67, 22, 43, 65],
    },
    {
      name: "Revenue",
      data: [13, 23, 20, 8, 13, 27, 15],
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
          fontSize: "22px",
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
  labels: ["Android", "Tizen", "Webos", "Raspberry"],
  colors: ["#6418c3", "#b270ec", "#ebcffc", "#e5e7eb"], // Set custom colors
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: false, // Hide the inner label (percentage value)
        },
      },
    },
  },
  dataLabels: {
    enabled: false, // Hide all data labels including the inner label
  },
};

//for Stores chart options
var StoreOptions = {
  chart: {
    height: 280,
    type: "radialBar",
  },

  series: [80],

  plotOptions: {
    radialBar: {
      hollow: {
        margin: 15,
        size: "70%",
      },

      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: true,
          color: "#888",
          fontSize: "23px",
        },
        value: {
          color: "#111",
          fontSize: "30px",
          show: true,
          formatter: function (val) {
            return val.toFixed(0);
          },
        },
      },
    },
  },
  colors: ["#6418c3"],
  stroke: {
    lineCap: "round",
  },
  labels: ["Stores"],
};

const Business = () => {
  //for map store icon
  const center = [20.5937, 78.9629];
  const centerUSA = [37.0902, -95.7129];
  const blueIcon = new L.Icon({
    iconUrl: "../../../../DisployImg/mapImg.png",
    iconSize: [35, 35],
    iconAnchor: [12, 41],
  });

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
  const handleMarkerClick = () => {
    setShowStore(true);
    setSelectedCountry(1);
  };
  const markerEventHandlers = {
    click: handleMarkerClick,
  };

  //for city select popup
  const [showCitydw, setShowCityDw] = useState(false);

  //for city store  popup
  const [showCityStores, setshowCityStores] = useState(false);
  return (
    <>
      {/* google map start */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-9">
          <MapContainer
            center={center}
            zoom={2}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "560px" }}
          >
            <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>

            <Marker
              position={center}
              icon={blueIcon}
              eventHandlers={markerEventHandlers}
            />

            <Marker position={centerUSA} icon={blueIcon} />
          </MapContainer>
        </div>
      </div>
      {/* google map end */}
      {/* country store popup start */}
      {showStore && (
        <>
          <div className="bg-white shadow-md rounded-lg mt-5 ">
            <div className="p-3 flex justify-between">
              <div className="flex items-center">
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
                    setShowCityDw(true);
                    setShowStore(false);
                  }}
                  placeholder="Select State"
                />
                {/* <select
                  id="state"
                  value={selectedState}
                  onChange={(selectedOption) => {
                    setSelectedState(selectedOption.value);
                    setShowCityDw(true);
                    setShowStore(false);
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </option>
                  ))}
                </select> */}
              </div>
            </div>
          </div>
        </>
      )}
      {/* country store popup end */}
      {/* city store popup start */}
      {showCitydw && (
        <div className="bg-white shadow-md rounded-lg mt-5">
          <div className="p-5 flex">
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
                placeholder="Select State"
              />
            </div>
            <div className="ml-5">
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
              />
              {/* <select
                id="city"
                onChange={(e) => {
                  setshowCityStores(true);
                }}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.cityID} value={city.cityID}>
                    {city.cityName}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
          {showCityStores && (
            <>
              <div className="pb-4">
                <div>
                  <label className="p-5 text-lg font-semibold">Ahemdabad</label>
                </div>
                <div className="m-6">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md">
                      <div className="p-3">
                        <label className="text-lg font-semibold">
                          Total Stores
                        </label>
                      </div>
                      <div id="chart">
                        <ReactApexChart
                          options={StoreOptions}
                          series={StoreOptions.series}
                          type="radialBar"
                          height={300}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-9  md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-2xl rounded-md">
                      <div className="p-3">
                        <label className="text-lg font-semibold">
                          Total Screens
                        </label>
                      </div>
                      <div className="flex justify-center">
                        <ReactApexChart
                          options={ScreenOption}
                          series={ScreenOption.series}
                          type="donut"
                          width="380"
                        />
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
          <div className="lg:col-span-9  md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-lg rounded-md">
            <div className="mb-4 justify-between gap-4 sm:flex mt-3">
              <div>
                <h4 className="text-xl font-semibold text-black dark:text-white ml-3">
                  Total Revenue
                </h4>
              </div>
              <div>
                <div className="relative z-20 inline-block">
                  <select
                    name="#"
                    id="#"
                    className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
                  >
                    <option value="">2023</option>
                    {/* <option value="">Last Week</option> */}
                  </select>
                  <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                        fill="#637381"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                        fill="#637381"
                      />
                    </svg>
                  </span>
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
          {/* Company Growth start*/}
          <div className="lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white shadow-lg rounded-md">
            <div id="chart">
              <ReactApexChart
                options={CompanyGrowthOption}
                series={CompanyGrowthOption.series}
                type="radialBar"
                height={350}
              />
            </div>
            <label className="flex justify-center text-sm font-semibold">
              40% Company Growth
            </label>
            {/* <div className="border border-b border-[#d1d5db] mt-3"></div> */}
          </div>
          {/* Company Growth end*/}
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
      <div className="dashboard-footer text-center lg:text-base md:text-base  z-10 my-4 sm:text-sm  py-2 ">
        <h6 className="font-medium">
          Securely display dashboards from any application
        </h6>
        <p>
          Find out more at <Link to="/">disploy.com</Link>
        </p>
      </div>
    </>
  );
};

export default Business;
