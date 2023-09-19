import { useState } from "react";
import "../../Styles/screen.css";
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from "react-icons/ai";
import {
  MdLiveTv,
  MdOutlineCalendarMonth,
  MdOutlineModeEdit,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MdOutlineAddToQueue } from "react-icons/md";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { VscCalendar, VscVmActive } from "react-icons/vsc";
import { VscVmConnect } from "react-icons/vsc";
import PropTypes from "prop-types";
import ScreenOTPModal from "./ScreenOTPModal";
import AssetModal from "../Assests/AssetModal";
import { SlArrowDown, SlScreenDesktop } from "react-icons/sl";
import { RiArrowDownSLine, RiComputerLine } from "react-icons/ri";
import { HiDotsVertical, HiOutlineLocationMarker } from "react-icons/hi";
import { TbCalendarStats, TbCalendarTime } from "react-icons/tb";
import { BsCollectionPlay, BsPencilSquare, BsTags } from "react-icons/bs";
import Footer from "../Footer";
import { BiFilterAlt } from "react-icons/bi";
import { RxTimer } from "react-icons/rx";

const Screens = ({ sidebarOpen, setSidebarOpen }) => {
  Screens.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [connectScreenTooltipVisible, setConnectScreenTooltipVisible] =
    useState(false);
  const [newScreenTooltipVisible, setNewScreenTooltipVisible] = useState(false);
  const [screenGroupTooltipVisible, setScreenGroupTooltipVisible] =
    useState(false);
  const [selectAllTooltipVisible, setselectAllTooltipVisible] = useState(false);
  const [moreTooltipVisible, setMoreTooltipVisible] = useState(false);

  const [showOTPModal, setShowOTPModal] = useState(false);
  //const [showOTPVerifyModal, setShowOTPVerifyModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);

  const [screenStatus, setScreenStatus] = useState("live");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [selectActiveTooltipVisible, setSelectActiveTooltipVisible] =
    useState(true);

  const handleCheckboxChange = (event) => {
    setCheckboxChecked(event.target.checked);
  };

  const handleConfirmDeactivation = () => {
    const newStatus = screenStatus === "live" ? "deactivated" : "live";
    setScreenStatus(newStatus);

    if (newStatus === "live") {
      setCheckboxChecked(false);
    }

    // Show the tooltip again after deactivation or activation
    setSelectActiveTooltipVisible(true);
  };
  const [scheduleModal, setScheduleModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);
  const [moreCheckboxClick, setMoreCheckboxClick] = useState(false);
  const [locCheckboxClick, setLocCheckboxClick] = useState(false);
  const handleCheckboxClick = () => {
    setLocCheckboxClick(!locCheckboxClick);
  };
  const handleUpdateButtonClick = () => {
    if (locCheckboxClick) {
      setMoreCheckboxClick(true);
    } else {
      setMoreCheckboxClick(false);
    }
  };
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              Screens
            </h1>

            <div className="flex items-center sm:mt-3 flex-wrap">
              <div
                className="relative"
                onMouseEnter={() => setConnectScreenTooltipVisible(true)}
                onMouseLeave={() => setConnectScreenTooltipVisible(false)}
              >
                <Link to="/mergescreen">
                  <button
                    type="button"
                    className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                  >
                    <VscVmConnect className="p-1 text-3xl text-primary hover:text-white" />
                  </button>
                </Link>
                {connectScreenTooltipVisible && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className="absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700"
                  >
                    Connect Screen
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                )}
              </div>
              <div
                className="relative"
                onMouseEnter={() => setNewScreenTooltipVisible(true)}
                onMouseLeave={() => setNewScreenTooltipVisible(false)}
              >
                <button
                  type="button"
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                  onClick={() => setShowOTPModal(true)}
                >
                  <MdOutlineAddToQueue className="p-1 text-3xl hover:text-white text-primary" />
                </button>
                {newScreenTooltipVisible && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className="absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700"
                  >
                    New Screen
                  </div>
                )}
                {showOTPModal ? (
                  <>
                    <ScreenOTPModal setShowOTPModal={setShowOTPModal} />
                  </>
                ) : null}
              </div>
              <div
                className="relative"
                onMouseEnter={() => setScreenGroupTooltipVisible(true)}
                onMouseLeave={() => setScreenGroupTooltipVisible(false)}
              >
                <Link to="/newscreengroup">
                  <button
                    type="button"
                    className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                  >
                    <HiOutlineRectangleGroup className="p-1 text-3xl hover:text-white text-primary" />
                  </button>
                </Link>
                {screenGroupTooltipVisible && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className="absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white  bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700"
                  >
                    New Screen Group
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setSelectActiveTooltipVisible(true)}
                onMouseLeave={() => setSelectActiveTooltipVisible(false)}
              >
                <button
                  type="button"
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                  onClick={handleConfirmDeactivation}
                  disabled={!checkboxChecked}
                >
                  <VscVmActive className="p-1 text-3xl hover:text-white text-primary" />
                </button>

                {checkboxChecked && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className={`absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700 ${
                      selectActiveTooltipVisible ? "" : "hidden"
                    }`}
                  >
                    {screenStatus === "live" ? "Deactivate" : "Activate"}
                  </div>
                )}
                {!checkboxChecked && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className={`absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700 ${
                      selectActiveTooltipVisible && screenStatus === "live"
                        ? "hidden"
                        : ""
                    }`}
                  >
                    {screenStatus === "live" ? "First select screen" : ""}
                  </div>
                )}

                {selectActiveTooltipVisible && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className={`absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700 `}
                  >
                    {!checkboxChecked ? "Deactivate/Activate" : ""}
                  </div>
                )}
              </div>
              <div
                className="relative"
                onMouseEnter={() => setMoreTooltipVisible(true)}
                onMouseLeave={() => setMoreTooltipVisible(false)}
              >
                <div className="relative">
                  <button
                    type="button"
                    className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                    onClick={() => setMoreModal(true)}
                  >
                    <RiArrowDownSLine className="p-1 text-3xl hover:text-white text-primary" />
                  </button>
                  {moreModal && (
                    <div className="moredw">
                      <ul>
                        <li className="flex text-sm items-center ">
                          <input
                            type="checkbox"
                            className="mr-2 text-lg"
                            defaultChecked
                          />
                          Screen
                        </li>
                        <li className="flex text-sm items-center mt-2">
                          <input
                            type="checkbox"
                            className="mr-2 text-lg"
                            defaultChecked
                          />
                          Status
                        </li>
                        <li className="flex text-sm items-center mt-2">
                          <input
                            type="checkbox"
                            className="mr-2 text-lg"
                            defaultChecked
                          />
                          Last Seen
                        </li>
                        <li className="flex text-sm items-center mt-2">
                          <input
                            type="checkbox"
                            className="mr-2 text-lg"
                            defaultChecked
                          />
                          Now Playing
                        </li>
                        <li className="flex text-sm items-center mt-2 ">
                          <input
                            type="checkbox"
                            className="mr-2 text-lg"
                            defaultChecked
                          />
                          Current Schedule
                        </li>
                        <li className="flex text-sm items-center mt-2 ">
                          <input
                            type="checkbox"
                            className="mr-2 text-lg"
                            checked={locCheckboxClick}
                            onChange={handleCheckboxClick}
                          />
                          Google Location
                        </li>
                        <li className="flex text-sm items-center mt-2 ">
                          <input
                            type="checkbox"
                            className="mr-2 text-lg"
                            defaultChecked
                          />
                          Tags
                        </li>
                        <li className="flex text-sm justify-end mt-2 ">
                          <button
                            className="bg-lightgray text-primary px-4 py-2 rounded-full"
                            onClick={handleUpdateButtonClick}
                          >
                            Update
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {moreTooltipVisible && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className="absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white  bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700"
                  >
                    More
                  </div>
                )}
              </div>
              <div
                className="flex items-center mt-1 relative"
                onMouseEnter={() => setselectAllTooltipVisible(true)}
                onMouseLeave={() => setselectAllTooltipVisible(false)}
              >
                <button type="button">
                  <input type="checkbox" className="h-7 w-7 " />
                </button>
                {selectAllTooltipVisible && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className=" select-all-screen absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700"
                  >
                    Select All Screen
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl mt-8 shadow">
            <table
              className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="border-b border-lightgray">
                  <th className=" font-medium text-[14px]">
                    <button className="flex  items-center justify-center ">
                      <SlScreenDesktop className="mr-2 text-xl" />
                      Screen
                    </button>
                  </th>
                  {moreCheckboxClick && (
                    <th className=" font-medium text-[14px]">
                      <button className="flex  items-center justify-center ">
                        <HiOutlineLocationMarker className="mr-2 text-xl" />
                        Google Location
                      </button>
                    </th>
                  )}
                  <th className=" font-medium text-[14px]">
                    <button className="flex  items-center justify-center  mx-auto ">
                      <MdLiveTv className="mr-2 text-xl" />
                      status
                      <BiFilterAlt className="ml-1 text-lg" />
                    </button>
                  </th>
                  <th className=" font-medium text-[14px]">
                    <button className="flex  items-center justify-center   mx-auto">
                      <RxTimer className="mr-2 text-xl" />
                      Last Seen
                      <BiFilterAlt className="ml-1 text-lg" />
                    </button>
                  </th>
                  <th className=" font-medium text-[14px]">
                    <button className="flex  items-center justify-center  mx-auto">
                      <BsCollectionPlay className="mr-2 text-xl" />
                      Now Playing
                    </button>
                  </th>
                  <th className=" font-medium text-[14px]">
                    <button className=" flex  items-center mx-auto justify-center">
                      <MdOutlineCalendarMonth className="mr-2 text-xl" />
                      Current Schedule
                    </button>
                  </th>
                  <th className="font-medium text-[14px]">
                    <button className=" flex mx-auto items-center justify-center">
                      <BsPencilSquare className="mr-2 text-xl" />
                      Tags
                      <BiFilterAlt className="ml-1 text-lg" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2">
                  <td className="flex items-center ">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={checkboxChecked}
                      onChange={handleCheckboxChange}
                    />
                    <div>
                      <label className="text-red">
                        {screenStatus === "live" ? "" : "Deactivated"}
                      </label>
                      <div>
                        <Link to="/screensplayer">My Screen 1</Link>
                        <button>
                          <MdOutlineModeEdit className="text-sm ml-2 hover:text-primary" />
                        </button>
                      </div>
                    </div>
                  </td>
                  {moreCheckboxClick && (
                    <td className="p-2 break-words  w-[150px]">
                      132, My Street, Kingston, New York 12401.
                    </td>
                  )}
                  <td className="p-2 text-center">
                    <button
                      className={`rounded-full px-6 py-1 text-white text-center bg-${
                        screenStatus === "live" ? "[#3AB700]" : "red"
                      }`}
                    >
                      {screenStatus === "live" ? "Live" : "Offline"}
                    </button>
                  </td>
                  <td className="p-2 text-center">25 May 2023</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => setShowAssetModal(true)}
                      className="flex  items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2  lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      {" "}
                      Asset Name
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                    {showAssetModal ? (
                      <>
                        <AssetModal setShowAssetModal={setShowAssetModal} />
                      </>
                    ) : null}
                  </td>
                  <td className="break-words	w-[150px] p-2 text-center">
                    Schedule Name Till 28 June 2023
                  </td>
                  <td className="p-2 text-center">Tags, Tags</td>
                </tr>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2">
                  <td className="flex items-center ">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={checkboxChecked}
                      onChange={handleCheckboxChange}
                    />
                    <div>
                      <label className="text-red">
                        {screenStatus === "live" ? "" : "Deactivated"}
                      </label>
                      <div>
                        <Link to="/screensplayer">My Screen 2</Link>
                        <button>
                          <MdOutlineModeEdit className="text-sm ml-2 hover:text-primary" />
                        </button>
                      </div>
                    </div>
                  </td>
                  {moreCheckboxClick && (
                    <td className="p-2 break-words  w-[150px]">
                      132, My Street, Kingston, New York 12401.
                    </td>
                  )}
                  <td className="p-2 text-center">
                    <button
                      className={`rounded-full px-6 py-1 text-white text-center bg-${
                        screenStatus === "live" ? "[#3AB700]" : "red"
                      }`}
                    >
                      {screenStatus === "live" ? "Live" : "Offline"}
                    </button>
                  </td>
                  <td className="p-1 text-center">25 May 2023</td>
                  <td className="p-1 text-center">
                    <button
                      onClick={() => setShowAssetModal(true)}
                      className="flex  items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2  lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      {" "}
                      Asset Name
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                    {showAssetModal ? (
                      <>
                        <AssetModal setShowAssetModal={setShowAssetModal} />
                      </>
                    ) : null}
                  </td>
                  <td className="break-words	w-[150px] p-2 text-center">
                    Schedule Name Till 28 June 2023
                  </td>
                  <td className="p-2 text-center">Tags, Tags</td>
                </tr>
              </tbody>
            </table>
            {scheduleModal && (
              <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                    <div className="flex items-start justify-between p-4 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                      <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                        Set Schedule
                      </h3>
                      <button
                        className="p-1 text-xl"
                        onClick={() => setScheduleModal(false)}
                      >
                        <AiOutlineCloseCircle className="text-2xl" />
                      </button>
                    </div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="flex justify-between items-center">
                            <th className="p-3 font-medium text-[14px]">
                              <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                <TbCalendarTime className="mr-2" />
                                Schedule Name
                              </button>
                            </th>
                            <th className="p-3 font-medium text-[14px]">
                              <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                <VscCalendar className="mr-2" />
                                Date Added
                              </button>
                            </th>
                            <th className="p-3 font-medium text-[14px]">
                              <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                <TbCalendarStats className="mr-2" />
                                start date
                              </button>
                            </th>
                            <th className="p-3 font-medium text-[14px]">
                              <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                <TbCalendarStats className="mr-2" />
                                End date
                              </button>
                            </th>
                            <th className="p-3 font-medium text-[14px]">
                              <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                                <RiComputerLine className="mr-2" />
                                screens Assigned
                              </button>
                            </th>
                            <th className="p-3 font-medium text-[14px]">
                              <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                                <BsTags className="mr-2" />
                                Tags
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                            <td className="flex items-center ">
                              <input type="checkbox" className="mr-3" />
                              <div>
                                <div>
                                  <Link to="/screensplayer">Schedule Name</Link>
                                </div>
                              </div>
                            </td>
                            <td className="break-words w-[108px] p-2">
                              10 May 2023 10:30AM
                            </td>
                            <td className="break-words w-[108px] p-2">
                              05 June 2023 01:30PM
                            </td>

                            <td className="break-words w-[108px] p-2">
                              25 June 2023 03:30PM
                            </td>
                            <td className="p-2">1</td>
                            <td className="p-2 flex items-center">
                              Tags, Tags{" "}
                              <div className="relative">
                                <button className="ml-3">
                                  <HiDotsVertical />
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                            <td className="flex items-center ">
                              <input type="checkbox" className="mr-3" />
                              <div>
                                <div>
                                  <Link to="/screensplayer">Schedule Name</Link>
                                </div>
                              </div>
                            </td>
                            <td className="break-words w-[108px] p-2">
                              10 May 2023 10:30AM
                            </td>
                            <td className="break-words w-[108px] p-2">
                              05 June 2023 01:30PM
                            </td>

                            <td className="break-words w-[108px] p-2">
                              25 June 2023 03:30PM
                            </td>
                            <td className="p-2">1</td>
                            <td className="p-2 flex items-center">
                              Tags, Tags{" "}
                              <button className="ml-3">
                                <HiDotsVertical />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Screens;
