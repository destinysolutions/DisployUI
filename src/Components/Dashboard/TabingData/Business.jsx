import ReactApexChart from "react-apexcharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

const optionsBar = {
  colors: ["#3C50E0", "#80CAEE"],
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
    categories: ["M", "T", "W", "T", "F", "S", "S"],
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
};

const optionsRadialBar = {
  series: [67],
  chart: {
    height: 350,
    type: "radialBar",
    offsetY: -10,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: "16px",
          color: undefined,
          offsetY: 120,
        },
        value: {
          offsetY: 76,
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
    dashArray: 4,
  },
  labels: ["Median Ratio"],
};

const Business = () => {
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

  const center = [20.5937, 78.9629];
  const centerUSA = [37.0902, -95.7129];
  const blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  const [showStore, setShowStore] = useState(false);
  const handleMarkerClick = () => {
    setShowStore(true);
  };
  const markerEventHandlers = {
    click: handleMarkerClick,
  };
  const [selectState, setSelectState] = useState(false);
  return (
    <>
      <div className="bg-white shadow-md rounded-lg">
        <div className="h-96 p-3">
          <MapContainer
            center={center}
            zoom={2}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "360px" }}
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
              <div className="relative">
                <div className="border border-primary rounded-full flex items-center px-5 py-1 mr-10 ">
                  Select State
                  <div className="relative">
                    <button onClick={() => setSelectState(true)}>
                      <MdOutlineKeyboardArrowDown className="ml-5 text-2xl mt-1" />
                    </button>
                    {selectState && (
                      <div className="statePopup mt-4">
                        <div className="text-right mb-5 mr-5 flex items-end justify-end relative sm:mr-0">
                          <AiOutlineSearch className="absolute top-[13px] right-[220px] z-10 text-gray searchicon" />
                          <input
                            type="text"
                            placeholder=" Search State "
                            className="border border-gray rounded-full px-7 py-2"
                            //onChange={handleFilter}
                          />
                        </div>
                        <div className="px-2 flex justify-between items-center">
                          <label>Maharashtra</label>
                          <input type="checkbox" />
                        </div>
                        <div className="px-2 flex justify-between items-center">
                          <label>Andhra Pradesh</label>
                          <input type="checkbox" />
                        </div>
                        <div className="px-2 flex justify-between items-center">
                          <label>Gujrat</label>
                          <input type="checkbox" />
                        </div>
                        <div className="px-2 flex justify-between items-center">
                          <label>Madhya Pradesh</label>
                          <input type="checkbox" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className=" mt-5 ">
        <div className="grid grid-cols-12 gap-4">
          <div className="lg:col-span-9  md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-lg rounded-md">
            <div className="mb-4 justify-between gap-4 sm:flex mt-3">
              <div>
                <h4 className="text-xl font-semibold text-black dark:text-white ml-3">
                  Profit this week
                </h4>
              </div>
              <div>
                <div className="relative z-20 inline-block">
                  <select
                    name="#"
                    id="#"
                    className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
                  >
                    <option value="">This Week</option>
                    <option value="">Last Week</option>
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
                  options={optionsBar}
                  series={stateVlaue.series}
                  type="bar"
                  height="300px"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 md:col-span-6 sm:col-span-12 bg-white p-7.5 shadow-lg rounded-md">
            <div id="chart">
              <ReactApexChart
                options={optionsRadialBar}
                series={optionsRadialBar.series}
                type="radialBar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
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
