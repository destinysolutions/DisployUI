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

const MySchedule = ({ sidebarOpen, setSidebarOpen }) => {
  //for action popup
  const [showActionBox, setShowActionBox] = useState(false);
  const [addScreenModal, setAddScreenModal] = useState(false);
  return (
    <>
      {/* navbar and sidebar start */}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {/* navbar and sidebar end */}
      <div className="pt-6 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              My Schedule
            </h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn ">
              <Link to="/weatherschedule">
                <button className=" flex align-middle border-primary items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <TiWeatherSunny className="text-lg mr-1" />
                  Weather Schedule
                </button>
              </Link>
              <Link to="/addschedule">
                <button className="sm:ml-2 xs:ml-1  flex align-middle border-primary items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <BiAddToQueue className="text-lg mr-1" />
                  New Schedule
                </button>
              </Link>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <FiUpload />
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <RiDeleteBin5Line />
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <HiMagnifyingGlass />
              </button>
              <button className="sm:ml-2 xs:ml-1 mt-1">
                <input type="checkbox" className="h-7 w-7 " />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto mt-9">
            <table className="w-full sm:mt-3">
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
                      <button
                        className="ml-3"
                        onClick={() => setShowActionBox(!showActionBox)}
                      >
                        <HiDotsVertical />
                      </button>
                      {/* action popup start */}
                      {showActionBox && (
                        <div className="scheduleAction z-10 ">
                          <div className="my-1">
                            <Link to="/addschedule">
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
                            <button>Delete</button>
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
                                    Select the Screen you want Schedule Content
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
                                  New schedule would be applied. Do you want to
                                  proceed?
                                </p>
                              </div>
                              <div className="pb-6 flex justify-center">
                                <Link to="/saveassignscreenmodal">
                                  <button className="bg-primary text-white px-8 py-2 rounded-full">
                                    OK
                                  </button>
                                </Link>
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
      <Footer />
    </>
  );
};

export default MySchedule;
