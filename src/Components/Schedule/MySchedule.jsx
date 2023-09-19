import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TiWeatherSunny } from "react-icons/ti";
import { BiAddToQueue } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import { RiComputerLine, RiDeleteBin5Line } from "react-icons/ri";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { TbCalendarStats, TbCalendarTime } from "react-icons/tb";
import { VscCalendar } from "react-icons/vsc";
import { BsTags } from "react-icons/bs";
import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { useState } from "react";
import "../../Styles/schedule.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Footer from "../Footer";
import { ADD_SCHEDULE, GET_ALL_SCHEDULE } from "../../Pages/Api";
import { useEffect } from "react";
import axios from "axios";
import SaveAssignScreenModal from "./SaveAssignScreenModal";

const MySchedule = ({ sidebarOpen, setSidebarOpen }) => {
  //for action popup
  const [showActionBox, setShowActionBox] = useState(false);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectScreenModal, setSelectScreenModal] = useState(false);

  useEffect(() => {
    axios
      .get(GET_ALL_SCHEDULE)
      .then((response) => {
        const fetchedData = response.data.data;
        setScheduleData(fetchedData);
        console.log(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function formatDate(date) {
    const formattedDate = date.toLocaleDateString();
    return formattedDate;
  }

  // Initialize state for the "Select All" checkbox
  const [selectAll, setSelectAll] = useState(false);

  // Function to handle the "Select All" checkbox change
  const handleSelectAll = () => {
    const updatedScheduleAsset = scheduleData.map((schedule) => ({
      ...schedule,
      isChecked: !selectAll,
    }));
    setScheduleData(updatedScheduleAsset);
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (scheduleId) => {
    const updatedScheduleAsset = scheduleData.map((schedule) =>
      schedule.scheduleId === scheduleId
        ? { ...schedule, isChecked: !schedule.isChecked }
        : schedule
    );
    setScheduleData(updatedScheduleAsset);

    // Check if all checkboxes are checked or not
    const allChecked = updatedScheduleAsset.every(
      (schedule) => schedule.isChecked
    );
    setSelectAll(allChecked);
  };

  const handleScheduleItemClick = (scheduleId) => {
    // Toggle the action menu for the clicked schedule item
    setShowActionBox((prevState) => ({
      ...prevState,
      [scheduleId]: !prevState[scheduleId] || false,
    }));
  };

  const handelDeleteSchedule = (scheduleId) => {
    let data = JSON.stringify({
      scheduleId: scheduleId,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: ADD_SCHEDULE,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response, "response");
        const updatedScheduleData = scheduleData.filter(
          (scheduleData) => scheduleData.scheduleId !== scheduleId
        );
        setScheduleData(updatedScheduleData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelDeleteAllSchedule = () => {
    let data = JSON.stringify({
      operation: "ALLDelete",
    });

    let config = {
      method: "post",
      url: ADD_SCHEDULE,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        setScheduleData([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {/* navbar and sidebar start */}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {/* navbar and sidebar end */}
      <div className="pt-6 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              My Schedule
            </h1>
            <div className=" items-center flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn ">
              <Link to="/weatherschedule">
                <button className=" flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-3 sm:py-2 text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                  <TiWeatherSunny className="text-lg mr-1" />
                  Weather Schedule
                </button>
              </Link>
              <Link to="/addschedule">
                <button className="sm:ml-2 xs:ml-1  flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-3 sm:py-2 text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                  <BiAddToQueue className="text-lg mr-1" />
                  New Schedule
                </button>
              </Link>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-gray items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <FiUpload className="text-lg" />
              </button>
              <button
                className="sm:ml-2 xs:ml-1 flex align-middle border-gray items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={handelDeleteAllSchedule}
                style={{ display: selectAll ? "block" : "none" }}
              >
                <RiDeleteBin5Line className="text-lg" />
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-gray items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <HiMagnifyingGlass className="text-lg" />
              </button>
              <button className="sm:ml-2 xs:ml-1 mt-1">
                <input
                  type="checkbox"
                  className="h-7 w-7 "
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </button>
            </div>
          </div>
          <div className="Schedule-table bg-white rounded-xl mt-8 shadow">
            <table
              className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="border-b border-lightgray">
                  <th className="font-medium text-[14px]">
                    <button className=" flex  items-center justify-center">
                      <TbCalendarTime className="mr-2 text-xl" />
                      Schedule Name
                    </button>
                  </th>
                  <th className="font-medium text-[14px]">
                    <button className=" flex  items-center justify-center mx-auto">
                      <VscCalendar className="mr-2 text-xl" />
                      Date Added
                    </button>
                  </th>
                  <th className="font-medium text-[14px]">
                    <button className=" flex  items-center justify-center mx-auto">
                      <TbCalendarStats className="mr-2 text-xl" />
                      start date
                    </button>
                  </th>
                  <th className="font-medium text-[14px]">
                    <button className=" flex  items-center justify-center mx-auto">
                      <TbCalendarStats className="mr-2 text-xl" />
                      End date
                    </button>
                  </th>
                  <th className="font-medium text-[14px]">
                    <button className=" flex  items-center justify-center mx-auto">
                      <RiComputerLine className="mr-2 text-xl" />
                      screens Assigned
                    </button>
                  </th>
                  <th className="font-medium text-[14px]">
                    <button className=" flex  items-center justify-center mx-auto">
                      <BsTags className="mr-2 text-xl" />
                      Tags
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((schedule) => (
                  <tr
                    className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                    key={schedule.scheduleId}
                  >
                    <td className="flex items-center ">
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={schedule.isChecked || false}
                        onChange={() =>
                          handleCheckboxChange(schedule.scheduleId)
                        }
                      />
                      <div>
                        <div>
                          <Link to="/screensplayer">
                            {schedule.scheduleName}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="break-words w-[108px] p-2 text-center">
                      {formatDate(new Date(schedule.createdDate))}
                    </td>
                    <td className="break-words w-[108px] p-2 text-center">
                      {formatDate(new Date(schedule.startDate))}
                    </td>

                    <td className="break-words w-[108px] p-2 text-center">
                      {formatDate(new Date(schedule.endDate))}
                    </td>
                    <td className="p-2 text-center">
                      {schedule.screenAssigned}
                    </td>
                    <td className="p-2 flex items-center justify-center max-auto">
                      {schedule.tags}
                      <div className="relative">
                        <button
                          className="ml-3"
                          onClick={() =>
                            handleScheduleItemClick(schedule.scheduleId)
                          }
                        >
                          <HiDotsVertical />
                        </button>
                        {/* action popup start */}
                        {showActionBox[schedule.scheduleId] && (
                          <div className="scheduleAction z-10 ">
                            <div className="my-1">
                              <Link
                                to={`/addschedule?scheduleId=${schedule.scheduleId}&scheduleName=${schedule.scheduleName}`}
                              >
                                <button>Edit Schedule</button>
                              </Link>
                            </div>
                            <div className=" mb-1">
                              <button onClick={() => setAddScreenModal(true)}>
                                Add Screens
                              </button>
                            </div>
                            <div className="mb-1 border border-[#F2F0F9]"></div>
                            <div className=" mb-1 text-[#D30000]">
                              <button
                                onClick={() =>
                                  handelDeleteSchedule(schedule.scheduleId)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                        {/* action popup end */}
                        {/* add screen modal start */}
                        {addScreenModal && (
                          <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                                  <div className="flex items-center">
                                    <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                                      Select the Screen you want Schedule
                                      Content
                                    </h3>
                                  </div>
                                  <button
                                    className="p-1 text-xl ml-8"
                                    onClick={() => setAddScreenModal(false)}
                                  >
                                    <AiOutlineCloseCircle className="text-2xl" />
                                  </button>
                                </div>
                                <div className="flex justify-center p-9 ">
                                  <p className="break-words w-[280px] text-base text-black">
                                    New schedule would be applied. Do you want
                                    to proceed?
                                  </p>
                                </div>
                                <div className="pb-6 flex justify-center">
                                  <button
                                    className="bg-primary text-white px-8 py-2 rounded-full"
                                    onClick={() => setSelectScreenModal(true)}
                                  >
                                    OK
                                  </button>

                                  <button
                                    className="bg-primary text-white px-4 py-2 rounded-full ml-3"
                                    onClick={() => setAddScreenModal(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* add screen modal end */}
                        {selectScreenModal && (
                          <SaveAssignScreenModal
                            setSelectScreenModal={setSelectScreenModal}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MySchedule;
