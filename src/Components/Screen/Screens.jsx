import { useState } from "react";
import "../../Styles/screen.css";
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MdOutlineAddToQueue } from "react-icons/md";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { VscVmActive } from "react-icons/vsc";
import { VscVmConnect } from "react-icons/vsc";
import PropTypes from "prop-types";
import ScreenOTPModal from "./ScreenOTPModal";
import AssetModal from "../Assests/AssetModal";

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

  const [selectActiveTooltipVisible, setselectActiveTooltipVisible] =
    useState(false);

  const [showOTPModal, setShowOTPModal] = useState(false);
  //const [showOTPVerifyModal, setShowOTPVerifyModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);

  const [screenStatus, setScreenStatus] = useState("live");

  const toggleScreenStatus = () => {
    if (screenStatus === "live") {
      setScreenStatus("offline");
    } else {
      setScreenStatus("live");
    }
  };
  const [scheduleModal, setScheduleModal] = useState(false);
  const [repeatValue, setRepeatValue] = useState("");
  const [showWeeklyDays, setShowWeeklyDays] = useState(false);
  const [selectedWeeklyDays, setSelectedWeeklyDays] = useState([]);

  const handleRepeatChange = (e) => {
    const value = e.target.value;
    setRepeatValue(value);
    if (value === "weekly") {
      // Show the weekly days dropdown

      setShowWeeklyDays(true);
    } else {
      // Hide the weekly days dropdown
      setShowWeeklyDays(false);
      setSelectedWeeklyDays([]);
    }
  };

  const handleWeeklyDaysChange = (e) => {
    const selectedDays = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedWeeklyDays(selectedDays);
  };

  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
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
                    className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-SlateBlue"
                  >
                    <VscVmConnect className="p-1 text-3xl text-SlateBlue hover:text-white" />
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
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-SlateBlue"
                  onClick={() => setShowOTPModal(true)}
                >
                  <MdOutlineAddToQueue className="p-1 text-3xl hover:text-white text-SlateBlue" />
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
                    className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-SlateBlue"
                  >
                    <HiOutlineRectangleGroup className="p-1 text-3xl hover:text-white text-SlateBlue" />
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
                onMouseEnter={() => setselectActiveTooltipVisible(true)}
                onMouseLeave={() => setselectActiveTooltipVisible(false)}
              >
                <button
                  type="button"
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-SlateBlue"
                  onClick={toggleScreenStatus}
                >
                  <VscVmActive className="p-1 text-3xl hover:text-white text-SlateBlue" />
                </button>
                {selectActiveTooltipVisible && (
                  <div
                    id="tooltip-bottom"
                    role="tooltip"
                    className="absolute z-10 visible inline-block px-3 py-2 text-sm font-medium text-white  bg-SlateBlue rounded-lg shadow-sm opacity-100 tooltip bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full dark:bg-gray-700"
                  >
                    {screenStatus === "live" ? "Deactivate" : " Activate"}
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
          <div className="overflow-x-auto">
            <table className="mt-9 w-full sm:mt-3">
              <thead>
                <tr className="flex justify-between items-center">
                  <th className="p-3 font-medium text-[14px]">
                    <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2"
                      >
                        <path
                          d="M0 0.632129C0 0.283017 0.273186 0 0.59508 0H11.4049C11.7336 0 12 0.280819 12 0.632129V9.47311C12 9.82225 11.7268 10.1053 11.4049 10.1053H0.59508C0.26643 10.1053 0 9.82446 0 9.47311V0.632129ZM1.2 1.26316V8.8421H10.8V1.26316H1.2ZM1.8 10.7368H10.2V12H1.8V10.7368Z"
                          fill="#00072E"
                        />
                      </svg>
                      Screen
                    </button>
                  </th>
                  <th className="p-3 font-medium text-[14px]">
                    <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                      <svg
                        className="mr-2"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.70315 1.506C9.70315 1.22739 9.97801 1 10.3203 1C10.6627 1 10.9375 1.22614 10.9375 1.506V3.71989C10.9375 3.9985 10.6627 4.22589 10.3203 4.22589C9.97801 4.22589 9.70315 3.99975 9.70315 3.71989V1.506ZM12.4155 8.12519C12.9478 8.12519 13.4563 8.23138 13.921 8.42379C14.4045 8.62369 14.8381 8.91604 15.2004 9.27836C15.5627 9.64068 15.8551 10.0755 16.055 10.5565C16.2474 11.0212 16.3536 11.5297 16.3536 12.062C16.3536 12.5942 16.2474 13.1027 16.055 13.5675C15.8551 14.051 15.5627 14.4845 15.2004 14.8468C14.8381 15.2091 14.4033 15.5015 13.9223 15.7014C13.4575 15.8938 12.949 16 12.4168 16C11.8846 16 11.3761 15.8938 10.9113 15.7014C10.4278 15.5015 9.99425 15.2091 9.63194 14.8468C9.26962 14.4845 8.97726 14.0497 8.77736 13.5675C8.58496 13.1027 8.47876 12.5942 8.47876 12.062C8.47876 11.5297 8.58496 11.0212 8.77736 10.5565C8.97726 10.073 9.26962 9.63943 9.63194 9.27711C9.99425 8.91479 10.429 8.62244 10.91 8.42254C11.3748 8.23138 11.8821 8.12519 12.4155 8.12519ZM12.1207 10.4165C12.1207 10.3216 12.1594 10.2354 12.2219 10.1729C12.2844 10.1104 12.3706 10.0717 12.4668 10.0717C12.563 10.0717 12.6492 10.1104 12.7116 10.1729C12.7741 10.2354 12.8128 10.3216 12.8128 10.4178V12.2594L14.1897 13.0765L14.2009 13.084C14.2771 13.1327 14.3271 13.2064 14.3471 13.2876C14.3683 13.3726 14.3583 13.465 14.3121 13.545L14.3096 13.5487C14.3071 13.5537 14.3046 13.5575 14.3009 13.5612C14.2521 13.6362 14.1784 13.6862 14.0985 13.7061C14.0135 13.7274 13.921 13.7174 13.8411 13.6712L12.3019 12.7604C12.2481 12.7316 12.2032 12.6879 12.1707 12.6367C12.1382 12.5842 12.1194 12.523 12.1194 12.458L12.1207 10.4165ZM14.7119 9.76562C14.412 9.46577 14.0547 9.22464 13.6587 9.06097C13.2764 8.9023 12.8566 8.81609 12.4155 8.81609C11.9745 8.81609 11.5547 8.90355 11.1724 9.06097C10.7764 9.22464 10.419 9.46577 10.1192 9.76562C9.81934 10.0655 9.57821 10.4228 9.41454 10.8188C9.25587 11.2011 9.16967 11.6209 9.16967 12.062C9.16967 12.503 9.25712 12.9228 9.41454 13.3051C9.57821 13.7011 9.81934 14.0585 10.1192 14.3583C10.419 14.6582 10.7764 14.8993 11.1724 15.063C11.5547 15.2216 11.9745 15.3078 12.4155 15.3078C12.8566 15.3078 13.2764 15.2204 13.6587 15.063C14.0547 14.8993 14.412 14.6582 14.7119 14.3583C15.3004 13.7699 15.6627 12.959 15.6627 12.062C15.6627 11.6209 15.5752 11.2011 15.4178 10.8188C15.2529 10.4228 15.0117 10.0655 14.7119 9.76562ZM2.68041 8.16642C2.64543 8.16642 2.61419 8.01274 2.61419 7.82409C2.61419 7.63543 2.64168 7.48301 2.68041 7.48301H4.36457C4.39955 7.48301 4.43078 7.63668 4.43078 7.82409C4.43078 8.01274 4.4033 8.16642 4.36457 8.16642H2.68041ZM5.36532 8.16642C5.33034 8.16642 5.2991 8.01274 5.2991 7.82409C5.2991 7.63543 5.32659 7.48301 5.36532 7.48301H7.04948C7.08446 7.48301 7.11569 7.63668 7.11569 7.82409C7.11569 8.01274 7.08821 8.16642 7.04948 8.16642H5.36532ZM8.05023 8.16642C8.01524 8.16642 7.98401 8.01274 7.98401 7.82409C7.98401 7.63543 8.0115 7.48301 8.05023 7.48301H9.73438C9.76937 7.48301 9.8006 7.63543 9.8006 7.82284C9.63194 7.92779 9.46952 8.04273 9.31459 8.16642H8.05023ZM2.68416 10.1254C2.64918 10.1254 2.61794 9.97176 2.61794 9.78311C2.61794 9.59445 2.64543 9.44078 2.68416 9.44078H4.36832C4.4033 9.44078 4.43453 9.59445 4.43453 9.78311C4.43453 9.97176 4.40705 10.1254 4.36832 10.1254H2.68416ZM5.36907 10.1254C5.33408 10.1254 5.30285 9.97176 5.30285 9.78311C5.30285 9.59445 5.33034 9.44078 5.36907 9.44078H7.05322C7.08821 9.44078 7.11944 9.59445 7.11944 9.78311C7.11944 9.97176 7.09196 10.1254 7.05322 10.1254H5.36907ZM2.68791 12.0857C2.65292 12.0857 2.62169 11.932 2.62169 11.7434C2.62169 11.5547 2.64918 11.401 2.68791 11.401H4.37206C4.40705 11.401 4.43828 11.5547 4.43828 11.7434C4.43828 11.932 4.41079 12.0857 4.37206 12.0857H2.68791ZM5.37281 12.0857C5.33783 12.0857 5.3066 11.932 5.3066 11.7434C5.3066 11.5547 5.33408 11.401 5.37281 11.401H7.05697C7.09195 11.401 7.12319 11.5547 7.12319 11.7434C7.12319 11.932 7.0957 12.0857 7.05697 12.0857H5.37281ZM4.15967 1.506C4.15967 1.22739 4.43453 1 4.77686 1C5.11919 1 5.39405 1.22614 5.39405 1.506V3.71989C5.39405 3.9985 5.11794 4.22589 4.77686 4.22589C4.43453 4.22589 4.15967 3.99975 4.15967 3.71989V1.506ZM1.67966 5.84008H13.4338V3.29135C13.4338 3.2039 13.3988 3.12769 13.3426 3.07146C13.2864 3.01524 13.2064 2.98026 13.1227 2.98026H11.9958C11.8071 2.98026 11.6534 2.82659 11.6534 2.63793C11.6534 2.44928 11.8071 2.2956 11.9958 2.2956H13.1227C13.3988 2.2956 13.6462 2.4068 13.8273 2.58796C14.0085 2.76912 14.1197 3.01649 14.1197 3.2926V7.33933C13.8948 7.26187 13.6637 7.1994 13.4263 7.15317V6.52099H13.4338H1.67966V13.1214C1.67966 13.2089 1.71464 13.2851 1.77086 13.3413C1.82709 13.3976 1.90705 13.4325 1.99075 13.4325H7.57671C7.64043 13.6699 7.72039 13.901 7.81659 14.1234H1.997C1.72214 14.1234 1.47351 14.0122 1.29235 13.8311C1.11119 13.6512 1 13.4038 1 13.1277V3.29385C1 3.01899 1.11119 2.77036 1.29235 2.58921C1.47351 2.40805 1.72089 2.29685 1.997 2.29685H3.20015C3.38881 2.29685 3.54248 2.45052 3.54248 2.63918C3.54248 2.82784 3.38881 2.98151 3.20015 2.98151H1.997C1.90955 2.98151 1.83333 3.01649 1.77711 3.07271C1.72089 3.12894 1.68591 3.2089 1.68591 3.2926V5.84133H1.67966V5.84008ZM6.38106 2.98026C6.1924 2.98026 6.03873 2.82659 6.03873 2.63793C6.03873 2.44928 6.1924 2.2956 6.38106 2.2956H8.67491C8.86357 2.2956 9.01724 2.44928 9.01724 2.63793C9.01724 2.82659 8.86357 2.98026 8.67491 2.98026H6.38106Z"
                          fill="black"
                          stroke="black"
                          strokeWidth="0.4"
                        />
                      </svg>
                      status
                      <svg
                        className="ml-2"
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.708256 1.88333L5.33326 7.16667V15.5L8.66659 13.8333V7.16667L13.2916 1.88333C13.3973 1.76302 13.4661 1.6148 13.4897 1.45641C13.5134 1.29802 13.4909 1.13616 13.425 0.990221C13.359 0.844278 13.2524 0.720426 13.1179 0.633486C12.9834 0.546547 12.8267 0.500203 12.6666 0.5H1.33326C1.17311 0.500203 1.01641 0.546547 0.881917 0.633486C0.747423 0.720426 0.640828 0.844278 0.57489 0.990221C0.508952 1.13616 0.486463 1.29802 0.510116 1.45641C0.533768 1.6148 0.602559 1.76302 0.708256 1.88333Z"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </th>
                  <th className="p-3 font-medium text-[14px]">
                    <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                      <svg
                        className="mr-2"
                        width="16"
                        height="13"
                        viewBox="0 0 16 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.38289 1.05446C1.15837 1.15421 1 1.37998 1 1.63955V2.564H2.25444L1.38289 1.05446ZM2.50615 1L3.40915 2.564H5.67308L4.77011 1H2.50615ZM5.92481 1L6.82779 2.564H9.09175L8.18877 1H5.92481ZM9.34347 1L10.2465 2.564H12.5104L11.6074 1H9.34347ZM12.7621 1L13.6651 2.564H14.0166V1.63955C14.0166 1.28894 13.7276 1 13.377 1H12.7621ZM14.0166 3.564H1V10.756C1 11.1066 1.28894 11.3955 1.63956 11.3955H13.377C13.7276 11.3955 14.0166 11.1066 14.0166 10.756V3.564ZM0 1.63955C0 0.736657 0.736657 0 1.63956 0H13.377C14.2799 0 15.0166 0.736657 15.0166 1.63955V10.756C15.0166 11.6589 14.2799 12.3955 13.377 12.3955H1.63956C0.736657 12.3955 0 11.6589 0 10.756V1.63955ZM4.51773 5.83279C3.79278 6.31609 3.42236 6.92885 3.42236 7.53809C3.42236 8.14732 3.79278 8.76008 4.51773 9.24338C5.23919 9.72435 6.26467 10.0381 7.42236 10.0381C8.58006 10.0381 9.60554 9.72435 10.327 9.24338C11.0519 8.76008 11.4224 8.14732 11.4224 7.53809C11.4224 6.92885 11.0519 6.31609 10.327 5.83279C9.60554 5.35182 8.58006 5.03809 7.42236 5.03809C6.26467 5.03809 5.23919 5.35182 4.51773 5.83279ZM3.96303 5.00074C4.87026 4.39592 6.09478 4.03809 7.42236 4.03809C8.74995 4.03809 9.97447 4.39592 10.8817 5.00074C11.7854 5.60323 12.4224 6.49047 12.4224 7.53809C12.4224 8.5857 11.7854 9.47294 10.8817 10.0754C9.97447 10.6802 8.74995 11.0381 7.42236 11.0381C6.09478 11.0381 4.87026 10.6802 3.96303 10.0754C3.0593 9.47294 2.42236 8.5857 2.42236 7.53809C2.42236 6.49047 3.0593 5.60323 3.96303 5.00074ZM6.42236 7.82009C6.42236 7.3882 6.77248 7.03809 7.20437 7.03809C7.63626 7.03809 7.98637 7.3882 7.98637 7.82009C7.98637 8.25198 7.63626 8.60209 7.20437 8.60209C6.77248 8.60209 6.42236 8.25198 6.42236 7.82009ZM7.20437 6.03809C6.22019 6.03809 5.42236 6.83592 5.42236 7.82009C5.42236 8.80426 6.22019 9.60209 7.20437 9.60209C8.18854 9.60209 8.98637 8.80426 8.98637 7.82009C8.98637 6.83592 8.18854 6.03809 7.20437 6.03809Z"
                          fill="black"
                        />
                      </svg>
                      Last Seen
                      <svg
                        className="ml-2"
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.708256 1.88333L5.33326 7.16667V15.5L8.66659 13.8333V7.16667L13.2916 1.88333C13.3973 1.76302 13.4661 1.6148 13.4897 1.45641C13.5134 1.29802 13.4909 1.13616 13.425 0.990221C13.359 0.844278 13.2524 0.720426 13.1179 0.633486C12.9834 0.546547 12.8267 0.500203 12.6666 0.5H1.33326C1.17311 0.500203 1.01641 0.546547 0.881917 0.633486C0.747423 0.720426 0.640828 0.844278 0.57489 0.990221C0.508952 1.13616 0.486463 1.29802 0.510116 1.45641C0.533768 1.6148 0.602559 1.76302 0.708256 1.88333Z"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </th>
                  <th className="p-3 font-medium text-[14px]">
                    <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                      <svg
                        className="mr-2"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_1057_3343)">
                          <path
                            d="M13.6816 0.908203H1.31836C0.591416 0.908203 0 1.49962 0 2.22656V12.7734C0 13.5004 0.591416 14.0918 1.31836 14.0918H13.6816C14.4086 14.0918 15 13.5004 15 12.7734V2.22656C15 1.49962 14.4086 0.908203 13.6816 0.908203ZM14.1211 12.7734C14.1211 13.0158 13.924 13.2129 13.6816 13.2129H1.31836C1.07604 13.2129 0.878906 13.0158 0.878906 12.7734V11.4551H9.77285C9.95426 11.9665 10.4427 12.334 11.0156 12.334C11.5885 12.334 12.077 11.9665 12.2584 11.4551H14.1211V12.7734ZM10.5762 11.0156C10.5762 10.7733 10.7733 10.5762 11.0156 10.5762C11.2579 10.5762 11.4551 10.7733 11.4551 11.0156C11.4551 11.2579 11.2579 11.4551 11.0156 11.4551C10.7733 11.4551 10.5762 11.2579 10.5762 11.0156ZM14.1211 10.5762H12.2584C12.077 10.0647 11.5885 9.69727 11.0156 9.69727C10.4427 9.69727 9.95426 10.0647 9.77285 10.5762H0.878906V2.22656C0.878906 1.98425 1.07604 1.78711 1.31836 1.78711H13.6816C13.924 1.78711 14.1211 1.98425 14.1211 2.22656V10.5762Z"
                            fill="black"
                          />
                          <path
                            d="M10.3628 5.8048L5.9683 3.16808C5.6758 2.99268 5.30273 3.20376 5.30273 3.54492V8.81836C5.30273 9.16222 5.67832 9.36917 5.9683 9.19518L10.3628 6.55846C10.647 6.38789 10.6468 5.97522 10.3628 5.8048ZM6.18164 8.0422V4.32109L9.2826 6.18164L6.18164 8.0422Z"
                            fill="black"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1057_3343">
                            <rect width="15" height="15" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Now Playing
                    </button>
                  </th>
                  <th className="p-3 font-medium text-[14px]">
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                      <svg
                        className="mr-2"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.8636 1.57346C10.8636 1.2577 11.1751 1 11.5631 1C11.951 1 12.2625 1.25629 12.2625 1.57346V4.08254C12.2625 4.3983 11.951 4.65601 11.5631 4.65601C11.1751 4.65601 10.8636 4.39972 10.8636 4.08254V1.57346ZM13.9376 9.07521C14.5408 9.07521 15.1171 9.19557 15.6438 9.41363C16.1918 9.64018 16.6832 9.97151 17.0938 10.3821C17.5044 10.7928 17.8358 11.2855 18.0623 11.8307C18.2804 12.3574 18.4007 12.9337 18.4007 13.5369C18.4007 14.1401 18.2804 14.7164 18.0623 15.2431C17.8358 15.7911 17.5044 16.2824 17.0938 16.6931C16.6832 17.1037 16.1904 17.435 15.6453 17.6616C15.1185 17.8796 14.5422 18 13.939 18C13.3358 18 12.7595 17.8796 12.2328 17.6616C11.6848 17.435 11.1935 17.1037 10.7829 16.6931C10.3722 16.2824 10.0409 15.7897 9.81434 15.2431C9.59629 14.7164 9.47593 14.1401 9.47593 13.5369C9.47593 12.9337 9.59629 12.3574 9.81434 11.8307C10.0409 11.2827 10.3722 10.7914 10.7829 10.3807C11.1935 9.9701 11.6862 9.63876 12.2314 9.41221C12.7581 9.19557 13.333 9.07521 13.9376 9.07521ZM13.6034 11.6721C13.6034 11.5645 13.6473 11.4668 13.7181 11.396C13.7889 11.3252 13.8866 11.2813 13.9957 11.2813C14.1047 11.2813 14.2024 11.3252 14.2732 11.396C14.344 11.4668 14.3879 11.5645 14.3879 11.6735V13.7606L15.9483 14.6867L15.961 14.6952C16.0474 14.7504 16.104 14.8339 16.1267 14.926C16.1508 15.0222 16.1394 15.127 16.087 15.2176L16.0842 15.2219C16.0814 15.2276 16.0785 15.2318 16.0743 15.236C16.0191 15.321 15.9355 15.3776 15.8449 15.4003C15.7486 15.4244 15.6438 15.413 15.5532 15.3607L13.8088 14.3284C13.7479 14.2959 13.6969 14.2463 13.6601 14.1882C13.6233 14.1288 13.602 14.0594 13.602 13.9858L13.6034 11.6721ZM16.5401 10.9344C16.2003 10.5945 15.7954 10.3213 15.3465 10.1358C14.9132 9.95594 14.4374 9.85824 13.9376 9.85824C13.4378 9.85824 12.962 9.95735 12.5287 10.1358C12.0799 10.3213 11.6749 10.5945 11.3351 10.9344C10.9953 11.2742 10.722 11.6792 10.5365 12.128C10.3567 12.5613 10.259 13.0371 10.259 13.5369C10.259 14.0367 10.3581 14.5125 10.5365 14.9458C10.722 15.3946 10.9953 15.7996 11.3351 16.1394C11.6749 16.4793 12.0799 16.7525 12.5287 16.938C12.962 17.1179 13.4378 17.2156 13.9376 17.2156C14.4374 17.2156 14.9132 17.1164 15.3465 16.938C15.7954 16.7525 16.2003 16.4793 16.5401 16.1394C17.2071 15.4725 17.6177 14.5536 17.6177 13.5369C17.6177 13.0371 17.5186 12.5613 17.3402 12.128C17.1533 11.6792 16.88 11.2742 16.5401 10.9344ZM2.90446 9.12194C2.86482 9.12194 2.82942 8.94778 2.82942 8.73397C2.82942 8.52016 2.86057 8.34741 2.90446 8.34741H4.81318C4.85282 8.34741 4.88822 8.52157 4.88822 8.73397C4.88822 8.94778 4.85707 9.12194 4.81318 9.12194H2.90446ZM5.94736 9.12194C5.90771 9.12194 5.87231 8.94778 5.87231 8.73397C5.87231 8.52016 5.90347 8.34741 5.94736 8.34741H7.85607C7.89572 8.34741 7.93112 8.52157 7.93112 8.73397C7.93112 8.94778 7.89997 9.12194 7.85607 9.12194H5.94736ZM8.99026 9.12194C8.95061 9.12194 8.91521 8.94778 8.91521 8.73397C8.91521 8.52016 8.94636 8.34741 8.99026 8.34741H10.899C10.9386 8.34741 10.974 8.52016 10.974 8.73255C10.7829 8.85149 10.5988 8.98176 10.4232 9.12194H8.99026ZM2.90871 11.3422C2.86907 11.3422 2.83367 11.168 2.83367 10.9542C2.83367 10.7404 2.86482 10.5662 2.90871 10.5662H4.81743C4.85707 10.5662 4.89247 10.7404 4.89247 10.9542C4.89247 11.168 4.86132 11.3422 4.81743 11.3422H2.90871ZM5.95161 11.3422C5.91196 11.3422 5.87656 11.168 5.87656 10.9542C5.87656 10.7404 5.90771 10.5662 5.95161 10.5662H7.86032C7.89997 10.5662 7.93537 10.7404 7.93537 10.9542C7.93537 11.168 7.90422 11.3422 7.86032 11.3422H5.95161ZM2.91296 13.5638C2.87331 13.5638 2.83791 13.3896 2.83791 13.1758C2.83791 12.962 2.86907 12.7879 2.91296 12.7879H4.82167C4.86132 12.7879 4.89672 12.962 4.89672 13.1758C4.89672 13.3896 4.86557 13.5638 4.82167 13.5638H2.91296ZM5.95586 13.5638C5.91621 13.5638 5.88081 13.3896 5.88081 13.1758C5.88081 12.962 5.91196 12.7879 5.95586 12.7879H7.86457C7.90422 12.7879 7.93961 12.962 7.93961 13.1758C7.93961 13.3896 7.90846 13.5638 7.86457 13.5638H5.95586ZM4.58096 1.57346C4.58096 1.2577 4.89247 1 5.28044 1C5.66842 1 5.97993 1.25629 5.97993 1.57346V4.08254C5.97993 4.3983 5.667 4.65601 5.28044 4.65601C4.89247 4.65601 4.58096 4.39972 4.58096 4.08254V1.57346ZM1.77028 6.48542H15.0916V3.59687C15.0916 3.49775 15.052 3.41138 14.9883 3.34766C14.9245 3.28394 14.8339 3.24429 14.739 3.24429H13.4619C13.248 3.24429 13.0739 3.07013 13.0739 2.85632C13.0739 2.64251 13.248 2.46835 13.4619 2.46835H14.739C15.052 2.46835 15.3323 2.59437 15.5376 2.79968C15.743 3.005 15.869 3.28536 15.869 3.59828V8.18457C15.6141 8.09679 15.3522 8.02599 15.0831 7.9736V7.25712H15.0916H1.77028V14.7376C1.77028 14.8367 1.80993 14.9231 1.87365 14.9868C1.93736 15.0506 2.02799 15.0902 2.12286 15.0902H8.45361C8.52582 15.3592 8.61644 15.6212 8.72547 15.8732H2.12994C1.81842 15.8732 1.53665 15.7472 1.33133 15.5419C1.12602 15.338 1 15.0576 1 14.7447V3.5997C1 3.28819 1.12602 3.00641 1.33133 2.8011C1.53665 2.59579 1.81701 2.46977 2.12994 2.46977H3.4935C3.70731 2.46977 3.88148 2.64393 3.88148 2.85774C3.88148 3.07155 3.70731 3.24571 3.4935 3.24571H2.12994C2.03082 3.24571 1.94444 3.28536 1.88073 3.34908C1.81701 3.41279 1.77736 3.50342 1.77736 3.59828V6.48684H1.77028V6.48542ZM7.09853 3.24429C6.88473 3.24429 6.71056 3.07013 6.71056 2.85632C6.71056 2.64251 6.88473 2.46835 7.09853 2.46835H9.69824C9.91205 2.46835 10.0862 2.64251 10.0862 2.85632C10.0862 3.07013 9.91205 3.24429 9.69824 3.24429H7.09853Z"
                          fill="black"
                          stroke="black"
                          strokeWidth="0.4"
                        />
                      </svg>
                      Current Schedule
                    </button>
                  </th>
                  <th className="p-3 font-medium text-[14px]">
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                      <svg
                        className="mr-2"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.61928 14.8178C9.47445 14.9687 9.25215 14.9545 9.12265 14.7856C8.99315 14.6166 9.00546 14.3572 9.15029 14.2062L13.9092 9.24938L13.9107 9.24797C13.9793 9.17715 14.0307 9.10069 14.0653 9.01847C14.0992 8.93764 14.1187 8.84542 14.124 8.74207C14.1293 8.639 14.1191 8.54439 14.0933 8.45822C14.0676 8.37303 14.0242 8.29038 13.9633 8.21026L13.9575 8.20252L8.55615 1.34732C8.42436 1.18019 8.43365 0.919988 8.57691 0.766374C8.72016 0.612759 8.94307 0.62346 9.07486 0.790592L14.4766 7.64664C14.4812 7.65213 14.4856 7.65762 14.4901 7.66339C14.6113 7.82207 14.7006 7.99709 14.758 8.18816C14.8152 8.37852 14.8383 8.57916 14.8274 8.79037C14.8165 9.00115 14.7733 9.19728 14.6969 9.3792C14.621 9.55985 14.5145 9.72092 14.3768 9.86285L14.3766 9.86271L9.61928 14.8178ZM6.56336 0.440841H6.65243V0.441686C6.74753 0.441686 6.84239 0.48632 6.91179 0.574321L12.3135 7.43051C12.3181 7.436 12.3225 7.44149 12.3269 7.44726C12.4482 7.60609 12.5375 7.78096 12.5949 7.97203C12.6521 8.16239 12.6752 8.36303 12.6643 8.57438C12.6533 8.78502 12.6101 8.98129 12.5337 9.16307C12.458 9.34372 12.3514 9.50479 12.2136 9.64672L7.47165 14.5855C7.46852 14.5894 7.46502 14.5932 7.46164 14.597C7.32731 14.7423 7.17851 14.8486 7.01534 14.9161C6.85362 14.9828 6.68055 15.0098 6.49614 14.997C6.31149 14.9842 6.1418 14.9335 5.98696 14.8455C5.83164 14.7571 5.69309 14.6328 5.57096 14.4728L0.492087 7.827L0.492207 7.82686C0.43126 7.74703 0.396865 7.6396 0.403864 7.52456L0.414244 7.35827L0.000770044 0.438447C-0.000195452 0.420988 -0.000316139 0.403247 0.000770044 0.385365C0.0129594 0.158815 0.180232 -0.0135255 0.374538 0.000836259L6.45088 0.453372C6.45849 0.451964 6.46621 0.450556 6.47406 0.44943C6.50918 0.443657 6.53911 0.440841 6.56336 0.440841ZM6.50773 1.27678C6.48419 1.27945 6.46078 1.27931 6.43785 1.2765L0.732133 0.851418L1.1193 7.33209C1.12038 7.35109 1.12038 7.36996 1.11918 7.38841H1.1193L1.11797 7.40925L6.09763 13.9255C6.15774 14.0042 6.22375 14.0641 6.2958 14.1051C6.36821 14.1462 6.44871 14.1701 6.5373 14.1762C6.62636 14.1824 6.70746 14.1702 6.7806 14.1401C6.85229 14.1105 6.91927 14.0621 6.9813 13.995C6.98842 13.9872 6.99579 13.98 7.00327 13.9731L11.7458 9.03353L11.7472 9.03198L11.7471 9.03184C11.8158 8.96116 11.8673 8.8847 11.9017 8.80262C11.9357 8.72166 11.9552 8.62957 11.9606 8.52608C11.9659 8.42302 11.9555 8.3284 11.9297 8.24223C11.904 8.15704 11.8608 8.07439 11.7997 7.99428L11.7939 7.98653L6.50773 1.27678ZM2.92888 1.72256C3.10677 1.72819 3.27078 1.76972 3.42104 1.84717C3.57262 1.92531 3.70972 2.03866 3.8321 2.18692L3.83367 2.18903C3.95508 2.33575 4.0468 2.49936 4.10859 2.67972C4.17123 2.86248 4.20261 3.05707 4.20261 3.26335C4.20261 3.28123 4.20164 3.29883 4.19971 3.31615C4.19114 3.50581 4.15506 3.68293 4.0917 3.84725L4.09109 3.84866L4.0917 3.84894C4.02375 4.02508 3.92515 4.18489 3.7965 4.32823C3.78889 4.33668 3.78105 4.3447 3.77296 4.35216C3.6495 4.48212 3.51409 4.5804 3.36709 4.64644C3.2137 4.71529 3.05162 4.74782 2.8806 4.74359V4.745C2.70404 4.745 2.53809 4.70586 2.38301 4.62785C2.23034 4.55126 2.09107 4.43721 1.96555 4.28655L1.96411 4.28486C1.84004 4.13463 1.74735 3.96862 1.68604 3.78685C1.62522 3.60592 1.59698 3.41189 1.6018 3.20491C1.60651 2.99442 1.64211 2.80039 1.70946 2.6227C1.77752 2.44276 1.87685 2.28055 2.00791 2.13595C2.1356 1.99515 2.27729 1.88955 2.43285 1.81957C2.58842 1.74959 2.75388 1.71707 2.92888 1.72256ZM3.13682 2.60031C3.06803 2.56497 2.9932 2.54582 2.91234 2.54329C2.83015 2.54061 2.75485 2.55483 2.68666 2.58553C2.61811 2.6165 2.5527 2.66621 2.49054 2.73464C2.4302 2.8011 2.38506 2.87431 2.35489 2.95429C2.32387 3.03623 2.30734 3.12635 2.30517 3.22434C2.30287 3.31924 2.31542 3.40696 2.34258 3.4875C2.36961 3.5679 2.41282 3.64379 2.47159 3.71518C2.53013 3.78516 2.59349 3.83725 2.66156 3.87133C2.72709 3.90427 2.8001 3.92075 2.88048 3.92075V3.9223L2.88881 3.92244C2.97184 3.92511 3.04751 3.91089 3.11594 3.8802C3.17966 3.85161 3.24049 3.80726 3.29842 3.74742C3.3024 3.74235 3.30663 3.73757 3.31097 3.73278C3.37204 3.66477 3.41814 3.59071 3.44892 3.51088L3.4494 3.51116C3.47643 3.44047 3.49224 3.36374 3.49671 3.28081C3.49647 3.27503 3.49635 3.26912 3.49635 3.26321C3.49635 3.15901 3.48247 3.06637 3.45471 2.9854C3.42683 2.90388 3.38399 2.82841 3.32642 2.75914L3.32425 2.7566C3.26728 2.68747 3.20477 2.63537 3.13682 2.60031ZM6.3267 4.41552C6.19491 4.24839 6.2042 3.98819 6.34733 3.83458C6.49059 3.68082 6.7135 3.69166 6.84529 3.8588L9.85414 7.66607C9.98593 7.8332 9.97663 8.09326 9.83338 8.24701C9.69012 8.40077 9.46721 8.39007 9.33542 8.2228L6.3267 4.41552ZM4.88666 6.00672C4.75487 5.83959 4.76416 5.57953 4.9073 5.42578C5.05055 5.27202 5.27346 5.28272 5.40525 5.44985L8.4141 9.25712C8.54589 9.42425 8.5366 9.68431 8.39334 9.83807C8.24996 9.99183 8.02706 9.98112 7.89527 9.81399L4.88666 6.00672ZM3.38821 7.59792C3.25642 7.43079 3.26571 7.17059 3.40885 7.01697C3.5521 6.86322 3.77513 6.87406 3.9068 7.04105L6.91565 10.8483C7.04744 11.0156 7.03827 11.2755 6.89501 11.4293C6.75176 11.583 6.52885 11.5723 6.39706 11.4052L3.38821 7.59792Z"
                          fill="black"
                        />
                      </svg>
                      Tags
                      <svg
                        className="ml-2"
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.708256 1.88333L5.33326 7.16667V15.5L8.66659 13.8333V7.16667L13.2916 1.88333C13.3973 1.76302 13.4661 1.6148 13.4897 1.45641C13.5134 1.29802 13.4909 1.13616 13.425 0.990221C13.359 0.844278 13.2524 0.720426 13.1179 0.633486C12.9834 0.546547 12.8267 0.500203 12.6666 0.5H1.33326C1.17311 0.500203 1.01641 0.546547 0.881917 0.633486C0.747423 0.720426 0.640828 0.844278 0.57489 0.990221C0.508952 1.13616 0.486463 1.29802 0.510116 1.45641C0.533768 1.6148 0.602559 1.76302 0.708256 1.88333Z"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td className="flex items-center ">
                    <input type="checkbox" className="mr-3" />
                    <div>
                      <label className="text-red">
                        {screenStatus === "live" ? "" : "Deactivated"}
                      </label>
                      <div>
                        <Link to="/screensplayer">My Screen 1</Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <button
                      className={`rounded-full px-6 py-1 text-white bg-${
                        screenStatus === "live" ? "[#3AB700]" : "red"
                      }`}
                    >
                      {screenStatus === "live" ? "Live" : "Offline"}
                    </button>
                  </td>
                  <td className="p-2">25 May 2023</td>
                  <td className="p-2">
                    <button
                      onClick={() => setShowAssetModal(true)}
                      className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm   hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      Asset Name
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                    {showAssetModal ? (
                      <>
                        <AssetModal setShowAssetModal={setShowAssetModal} />
                      </>
                    ) : null}
                  </td>
                  <td className="break-words	w-[150px] p-2">
                    Schedule Name Till 28 June 2023
                  </td>
                  <td className="p-2">Tags, Tags</td>
                </tr>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm flex  justify-between items-center px-5 py-2">
                  <td className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <Link to="/screensplayer">My Screen 2</Link>
                    <button>
                      <MdOutlineModeEdit className="text-sm ml-2 hover:text-primary" />
                    </button>
                  </td>
                  <td className="p-2">
                    <button className="bg-[#3AB700] rounded-full px-6 py-1 text-white hover:bg-primary">
                      Live
                    </button>
                  </td>
                  <td className="p-2">25 May 2023</td>
                  <td className="p-2">
                    <button className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm   hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                      Asset Name
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                  </td>
                  <td className="break-words	w-[150px] p-2">
                    <button onClick={() => setScheduleModal(true)}>
                      Set Schedule
                    </button>
                  </td>
                  <td className="p-2">Tags, Tags</td>
                </tr>
              </tbody>
            </table>
            {scheduleModal && (
              <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                    <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                      <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                        Select the Date and Time
                      </h3>
                      <button
                        className="p-1 text-xl"
                        onClick={() => setScheduleModal(false)}
                      >
                        <AiOutlineCloseCircle className="text-2xl" />
                      </button>
                    </div>
                    <div className="p-4">
                      <label>Schedule : </label>
                      <div className="mt-3">
                        <select className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                          <option
                            value="-12:00"
                            className="text-base  font-normal"
                          >
                            (GMT -12:00) Eniwetok, Kwajalein
                          </option>
                          <option
                            value="-11:00"
                            className="text-base  font-normal"
                          >
                            (GMT -11:00) Midway Island, Samoa
                          </option>
                          <option
                            value="-10:00"
                            className="text-base  font-normal"
                          >
                            (GMT -10:00) Hawaii
                          </option>
                          <option
                            value="-09:50"
                            className="text-base  font-normal"
                          >
                            (GMT -9:30) Taiohae
                          </option>
                          <option
                            value="-09:00"
                            className="text-base  font-normal"
                          >
                            (GMT -9:00) Alaska
                          </option>
                        </select>
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                        <div>
                          <label>From</label>
                        </div>
                        <div className="ml-5">
                          <label className="border border-[#D5E3FF] p-2">
                            1 June 2023, 01:30PM
                          </label>
                        </div>
                        <div className="ml-5">
                          <label>To</label>
                        </div>
                        <div className="ml-5">
                          <label className="border border-[#D5E3FF] p-2">
                            30 June 2023, 01:30PM
                          </label>
                        </div>
                      </div>
                      <div className="mt-8">
                        <label>Repeat : </label>
                        <div className="mt-3">
                          <select
                            value={repeatValue}
                            onChange={handleRepeatChange}
                            className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option
                              value="Does Not Repeat"
                              className="text-base  font-normal"
                            >
                              Does Not Repeat
                            </option>
                            <option
                              value="Daily"
                              className="text-base  font-normal"
                            >
                              Daily
                            </option>
                            <option
                              value="weekly"
                              className="text-base  font-normal"
                            >
                              Weekly
                              {/* {showWeeklyDays &&
                                selectedWeeklyDays.length > 0 &&
                                `: ${selectedWeeklyDays.join(", ")}`} */}
                            </option>
                            <option
                              value="Monthly on the second"
                              className="text-base  font-normal"
                            >
                              Monthly on the second
                            </option>
                            <option
                              value="Monthly on the"
                              className="text-base  font-normal"
                            >
                              Monthly on the
                            </option>
                            <option
                              value="Every Weekday"
                              className="text-base  font-normal"
                            >
                              Every Weekday
                            </option>
                            <option
                              value="Custom"
                              className="text-base  font-normal"
                            >
                              Custom
                            </option>
                          </select>
                          {showWeeklyDays && (
                            <select
                              multiple
                              className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full mt-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={selectedWeeklyDays}
                              onChange={handleWeeklyDaysChange}
                            >
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Screens;
