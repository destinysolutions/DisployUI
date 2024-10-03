import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../Sidebar";
import Footer from "../../Footer";
import Navbar from "../../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ClockImg from "../../../images/Assets/Clock.png";
import { TbAppsFilled } from "react-icons/tb";
import { MdArrowBackIosNew, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";

const Clock = ({ sidebarOpen, setSidebarOpen }) => {
  const { userDetails, user } = useSelector((state) => state.root.auth);
  const navigate = useNavigate();
  const appDropdownRef = useRef(null);
  const [selectAll, setselectAll] = useState(false);
  const [instanceID, setInstanceID] = useState();
  const [appDropDown, setAppDropDown] = useState(null);

  const handleSelectAll = () => {
    setselectAll((prev) => !prev);
  };

  const handleAppDropDownClick = (id) => {
    setInstanceID(id);
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appDropdownRef.current &&
        !appDropdownRef.current.contains(event?.target)
      ) {
        setAppDropDown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div
        className={
          userDetails?.isTrial && !userDetails?.isActivePlan
            ? "lg:pt-32 md:pt-32 pt-10 px-5"
            : "lg:pt-24 md:pt-24 pt-10 px-5 "
        }
      >
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Apps
            </h1>
            <div className="lg:flex">
              <Link to="/Clockdetail">
                <button className="flex items-center bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2 text-base sm:text-sm mr-3 hover:bg-primary">
                  <TbAppsFilled className="text-2xl mr-2" />
                  New Instance
                </button>
              </Link>
              <Link to="/apps">
                <button className="flex items-center bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2 text-base sm:text-sm mr-3 hover:bg-primary">
                  <MdArrowBackIosNew className="text-2xl mr-2" />
                  Back
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-5 mb-5">
            <div className="shadow-md bg-white rounded-lg p-5">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-xl text-[#001737] ">Clock</h1>
                <div className="flex items-center">
                  <button className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full px-1 text-2xl hover:bg-SlateBlue">
                    <RiDeleteBinLine className="text-xl" />
                  </button>
                  <button className="sm:ml-2 xs:ml-1 mt-1">
                    <input
                      type="checkbox"
                      className="h-7 w-7"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </button>
                </div>
              </div>

              <div className=" grid grid-cols-12 gap-4 mt-5">
                <div
                  key={""}
                  className="xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-12"
                >
                  <div className="shadow-md bg-[#EFF3FF] rounded-lg h-full">
                    <div className="relative flex justify-between">
                      <button className="float-right p-2">
                        <input
                          className="h-5 w-5"
                          type="checkbox"
                          style={{
                            display: selectAll ? "block" : "none",
                          }}
                          checked={true}
                          onChange={() =>
                            //   handleCheckboxChange(item?.weatherAppId)
                            ""
                          }
                        />
                      </button>
                      <div className="relative">
                        <button className="float-right">
                          <BiDotsHorizontalRounded
                            className="text-2xl"
                            onClick={() => handleAppDropDownClick("1")}
                          />
                        </button>
                        {appDropDown === "1" && (
                          <div ref={appDropdownRef} className="appdw">
                            <ul className="space-y-2">
                              <li
                                onClick={() => navigate(`/weatherdetail`)}
                                className="flex text-sm items-center cursor-pointer"
                              >
                                <MdOutlineEdit className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                Edit
                              </li>
                              <li
                                className="flex text-sm items-center cursor-pointer"
                                onClick={() => {
                                  // setAddScreenModal(true);

                                  // setSelectData(item);
                                  "";
                                }}
                              >
                                <FiUpload className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                Set to Screen
                              </li>
                              {/* <li className="flex text-sm items-center">
                                      <MdPlaylistPlay className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                      Add to Playlist
                                    </li> */}

                              <li
                                className="flex text-sm items-center cursor-pointer"
                                onClick={() =>
                                  // handelDeleteInstance(item.weatherAppId)
                                  ""
                                }
                              >
                                <RiDeleteBin5Line className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                Delete
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center clear-both pb-8">
                      <img
                        src={ClockImg}
                        alt="Logo"
                        className="cursor-pointer mx-auto h-20 w-20"
                        onClick={() => {
                          // handleFetchWeatherById(item?.weatherAppId);
                          // setInstanceView(true);
                          "";
                        }}
                      />
                      <h4 className="text-lg font-medium mt-3">
                        2024-09-10 06:55
                      </h4>
                      <h4
                        onClick={() => {
                          // item?.tags !== null &&
                          // item?.tags !== undefined &&
                          // item?.tags !== ""
                          //   ? setTags(item?.tags?.split(","))
                          //   : setTags([]);
                          // setShowTagModal(true);
                          // setUpdateTagWeather(item);
                          "";
                        }}
                        className="text-sm font-normal cursor-pointer"
                      >
                        Add tags +
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clock;
