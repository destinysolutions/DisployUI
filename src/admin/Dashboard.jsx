import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import mapImg from "../images/DisployImg/mapImg.png";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import ReactApexChart from "react-apexcharts";
import RevenueTable from "../Components/Dashboard/RevenueTable";
import axios from "axios";
import { useSelector } from "react-redux";
import { ADMINDASHBOARD } from "../Pages/Api";

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

const Dashboard = () => {
  const customIcon = new L.Icon({
    iconUrl: mapImg,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
  const center = [20.5937, 78.9629];
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [allApp, setAllApp] = useState({
    AppLists: [],
    AppPercentages: [],
    AppOnlines: [],
    AppOnlinePercentages: [],
  });

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ADMINDASHBOARD}`,
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then((data) => {
        setDashboardData(data?.data?.data);
      })
      .catch((error) => {
        console.log("Error fetching states data:", error);
      });
  }, []);

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
    colors: ["#404f8b", "#59709a", "#8ca0b9", "#b2c7d0","#141e4a"],
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

  const handleScreenClick = (screen) => {
    setSelectedScreen(screen);
  };
  return (
    <div>
      {/* google map start */}
      <div className="bg-white shadow-md rounded-lg mt-5">
        <div className="lg:p-5 md:p-4 sm:p-3 xs:p-2">
          <MapContainer
            center={center}
            zoom={4}
            maxZoom={18}
            style={{ width: "100%", height: "460px", zIndex: 0 }}
          >
            <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>

            <MarkerClusterGroup>
              {dashboardData?.screen.map((screen, index) => (
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

      {allApp?.AppLists?.length > 0 && (
        <div className="my-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 bg-white dark:bg-black p-7.5 shadow-2xl rounded-md p-4">
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

            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 bg-white dark:bg-black p-7.5 shadow-2xl rounded-md p-4 ">
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

      {/* <div className=" mt-5 ">
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
      </div>*/}
    </div>
  );
};

export default Dashboard;
