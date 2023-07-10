import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbAppsFilled } from "react-icons/tb";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { TbBoxMultiple } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../../Styles/apps.css";
import { Link } from "react-router-dom";

const Apps = ({ sidebarOpen, setSidebarOpen }) => {
  Apps.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const AddedApps = [
    {
      id: 1,
      Image: "../../../AppsImg/youtube.svg",
      appName: "YouTube",
    },
    {
      id: 2,
      Image: "../../../AppsImg/weather.svg",
      appName: "Weather",
    },
    {
      id: 3,
      Image: "../../../AppsImg/coffee-tea.svg",
      appName: "Coffee Tea",
    },
    {
      id: 4,
      Image: "../../../AppsImg/foods.svg",
      appName: "Foods",
    },
    {
      id: 5,
      Image: "../../../AppsImg/noticeboard.svg",
      appName: "Noticeboard",
    },
  ];

  const MostPopularApps = [
    {
      id: 1,
      Image: "../../../AppsImg/youtube.svg",
      appName: "YouTube",
    },
    {
      id: 2,
      Image: "../../../AppsImg/weather.svg",
      appName: "Weather",
    },
    {
      id: 3,
      Image: "../../../AppsImg/coffee-tea.svg",
      appName: "Coffee Tea",
    },
  ];

  const FeatuardApps = [
    {
      id: 1,
      Image: "../../../AppsImg/slack.svg",
      appName: "Slack",
    },
    {
      id: 2,
      Image: "../../../AppsImg/slack.svg",
      appName: "Weather",
    },
    {
      id: 3,
      Image: "../../../AppsImg/slack.svg",
      appName: "Coffee Tea",
    },
    {
      id: 4,
      Image: "../../../AppsImg/slack.svg",
      appName: "Foods",
    },
    {
      id: 5,
      Image: "../../../AppsImg/slack.svg",
      appName: "Noticeboard",
    },
    {
      id: 6,
      Image: "../../../AppsImg/slack.svg",
      appName: "Slack",
    },
    {
      id: 7,
      Image: "../../../AppsImg/slack.svg",
      appName: "Weather",
    },
    {
      id: 8,
      Image: "../../../AppsImg/slack.svg",
      appName: "Coffee Tea",
    },
    {
      id: 9,
      Image: "../../../AppsImg/slack.svg",
      appName: "Foods",
    },
    {
      id: 10,
      Image: "../../../AppsImg/slack.svg",
      appName: "Noticeboard",
    },
    {
      id: 11,
      Image: "../../../AppsImg/slack.svg",
      appName: "Slack",
    },
    {
      id: 12,
      Image: "../../../AppsImg/slack.svg",
      appName: "Weather",
    },
    {
      id: 13,
      Image: "../../../AppsImg/slack.svg",
      appName: "Coffee Tea",
    },
    {
      id: 14,
      Image: "../../../AppsImg/slack.svg",
      appName: "Foods",
    },
    {
      id: 15,
      Image: "../../../AppsImg/slack.svg",
      appName: "Noticeboard",
    },
  ];

  const [appDropDown, setAppDropDown] = useState(null);
  const handleAppDropDownClick = (id) => {
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
          <div className="lg:flex lg:justify-between sm:flex sm:justify-between xs:block items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Apps
            </h1>
            <button className="flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 xs:mt-2 sm:mt-0 text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
              <TbAppsFilled className="text-2xl mr-2 bg-primary text-white rounded-full p-1" />
              New Instance
            </button>
          </div>
          <div className="mt-5 mb-5">
            <div className="grid grid-cols-10 gap-4">
              {AddedApps.map((app, id) => (
                <div
                  className="lg:col-span-2 md:col-span-5 sm:col-span-10 xs:col-span-10 "
                  key={id}
                >
                  <div className="shadow-md bg-white rounded-lg p-3">
                    <div className="relative">
                      <button className="float-right">
                        <BiDotsHorizontalRounded
                          className="text-2xl"
                          onClick={() => handleAppDropDownClick(id)}
                        />
                      </button>
                      {appDropDown === id && (
                        <div className="appdw">
                          <ul>
                            <li className="flex text-sm items-center">
                              <FiUpload className="mr-2 text-lg" />
                              Set to Screen
                            </li>
                            <li className="flex text-sm items-center">
                              <MdPlaylistPlay className="mr-2 text-lg" />
                              Add to Playlist
                            </li>
                            <li className="flex text-sm items-center">
                              <TbBoxMultiple className="mr-2 text-lg" />
                              Duplicate
                            </li>
                            <li className="flex text-sm items-center">
                              <RiDeleteBin5Line className="mr-2 text-lg" />
                              Delete App
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <Link to="/appdetail">
                      <div className="text-center clear-both">
                        <img
                          src={app.Image}
                          alt="Logo"
                          className="cursor-pointer mx-auto h-20 w-20"
                        />
                        <h4 className="text-lg font-medium mt-3">
                          {app.appName}
                        </h4>
                        <h4 className="text-sm font-normal ">Added</h4>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 mb-5">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] mb-4 ">
              Featured Apps
            </h1>
            <div className="grid grid-cols-12 gap-4">
              {FeatuardApps.map((featuardApp, id) => (
                <div
                  className="lg:col-span-4 md:col-span-6 sm:col-span-12 "
                  key={id}
                >
                  <div className="shadow-md  bg-white rounded-lg p-5">
                    <div className="lg:flex md:flex sm:flex xs:block ">
                      <img
                        src={featuardApp.Image}
                        alt="Logo"
                        className="cursor-pointer h-20 w-20"
                      />
                      <div className="lg:ml-5 sm:ml-5 xs:mt-6 sm:mt-0">
                        <h4 className="text-lg font-medium mt-3">
                          {featuardApp.appName}
                        </h4>
                        <h4 className="text-sm font-normal ">
                          Internal Communications
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 mb-5">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] mb-4 ">
              Most Popular Apps
            </h1>
            <div className="grid grid-cols-12 gap-4">
              {MostPopularApps.map((mostpopularApp, id) => (
                <div
                  className="lg:col-span-4 md:col-span-6 sm:col-span-12 "
                  key={id}
                >
                  <div className="shadow-md  bg-white rounded-lg p-5">
                    <div className="lg:flex md:flex sm:flex xs:block">
                      <img
                        src={mostpopularApp.Image}
                        alt="Logo"
                        className="cursor-pointer h-20 w-20"
                      />
                      <div className="lg:ml-5 sm:ml-5 xs:mt-6 sm:mt-0">
                        <h4 className="text-lg font-medium mt-3">
                          {mostpopularApp.appName}
                        </h4>
                        <h4 className="text-sm font-normal ">
                          Internal Communications
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
        </div>
      </div>
    </>
  );
};

export default Apps;
