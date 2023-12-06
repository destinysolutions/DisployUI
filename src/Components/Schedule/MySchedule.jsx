import React, { useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { BiAddToQueue } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { useState } from "react";
import "../../Styles/schedule.css";
import {
  AiOutlineCloseCircle,
  AiOutlinePlusCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import Footer from "../Footer";
import {
  ADD_SCHEDULE,
  GET_ALL_SCHEDULE,
  SCHEDULE_EVENT_SELECT_BY_ID,
  SELECT_BY_USER_SCREENDETAIL,
  SIGNAL_R,
  UPDATE_SCREEN_ASSIGN,
} from "../../Pages/Api";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { MdOutlineModeEdit } from "react-icons/md";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import toast from "react-hot-toast";
import ScreenAssignModal from "../ScreenAssignModal";

const MySchedule = ({ sidebarOpen, setSidebarOpen }) => {
  //for action popup
  const [showActionBox, setShowActionBox] = useState(false);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [selectedScreens, setSelectedScreens] = useState([]);
  const selectedScreenIdsString = Array.isArray(selectedScreens)
    ? selectedScreens.join(",")
    : "";
  const [scheduleId, setScheduleId] = useState("");
  const [searchSchedule, setSearchSchedule] = useState("");
  const [scheduleAllData, setScheduleAllData] = useState([]);
  const [connection, setConnection] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [filteredScheduleData, setFilteredScheduleData] = useState([]);
  const [updateTagSchedule, setUpdateTagSchedule] = useState(null);
  const [tags, setTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);

  const addScreenRef = useRef(null);
  const selectScreenRef = useRef(null);
  const showActionModalRef = useRef(null);

  const loadScheduleData = () => {
    axios
      .get(GET_ALL_SCHEDULE, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        // console.log(fetchedData, "schedule data");
        setScheduleData(fetchedData);
        setScheduleAllData(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    setScheduleId(scheduleId);
    setShowActionBox((prevState) => {
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === scheduleId ? !prevState[key] : false;
        return acc;
      }, {});
      return { ...updatedState, [scheduleId]: !prevState[scheduleId] };
    });
  };

  const handelDeleteSchedule = (scheduleId) => {
    if (!window.confirm("Are you sure?")) return;
    let data = JSON.stringify({
      scheduleId: scheduleId,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: ADD_SCHEDULE,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
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
    if (!window.confirm("Are you sure?")) return;
    let data = JSON.stringify({
      operation: "ALLDelete",
    });

    let config = {
      method: "post",
      url: ADD_SCHEDULE,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        setScheduleData([]);
        setSelectAll(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateScreenAssign = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${UPDATE_SCREEN_ASSIGN}?ScheduleID=${scheduleId}&ScreenID=${selectedScreenIdsString}`,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          if (connection) {
            connection
              .invoke("ScreenConnected")
              .then(() => {
                // console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setSelectScreenModal(false);
          setAddScreenModal(false);
          setShowActionBox(false);
          loadScheduleData();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearchSchedule = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchSchedule(searchQuery);

    if (searchQuery === "") {
      setFilteredScheduleData([]);
    } else {
      const filteredSchedule = scheduleAllData.filter((entry) =>
        Object.values(entry).some((val) => {
          if (typeof val === "string") {
            const keyWords = searchQuery.split(" ");
            for (let i = 0; i < keyWords.length; i++) {
              return (
                val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                val.toLocaleLowerCase().includes(keyWords[i]) ||
                val.toLocaleLowerCase().includes(searchQuery)
              );
            }
          }
        })
      );
      if (filteredSchedule.length > 0) {
        setFilteredScheduleData(filteredSchedule);
      } else {
        setFilteredScheduleData([]);
      }
    }
  };

  const handleFetchScheduleByID = (scheduleId) => {
    axios
      .get(`${SCHEDULE_EVENT_SELECT_BY_ID}?ID=${scheduleId}`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        const fetchedEvents = fetchedData.map((item) => ({
          id: item.eventId,
          title: item.title,
          start: new Date(item.cStartDate),
          end: new Date(item.cEndDate),
          color: item.color,
          asset: item.asset,
          repeatDay: item.repeatDay,
          isfutureDateExists: item.isfutureDateExists,
          actualEndDate: item.actualEndDate,
        }));
        // console.log(response?.data?.data);
        // setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpadteScheduleTags = (tags) => {
    let data = JSON.stringify({
      scheduleId: updateTagSchedule?.scheduleId,
      scheduleName: updateTagSchedule?.scheduleName,
      screenAssigned: updateTagSchedule?.screenAssigned,
      startDate: updateTagSchedule?.startDate,
      endDate: updateTagSchedule?.endDate,
      operation: "Insert",
      tags: tags,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_SCHEDULE,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        if (response.data.status === 200) {
          const updatedSchedule = scheduleData.map((i) => {
            if (i?.scheduleId === response?.data?.data?.model?.scheduleId) {
              return { ...i, tags: response?.data?.data?.model?.tags };
            } else {
              return i;
            }
          });
          const updateFilteredSchedule = filteredScheduleData.map((i) => {
            if (i?.scheduleId === response?.data?.data?.model?.scheduleId) {
              return { ...i, tags: response?.data?.data?.model?.tags };
            } else {
              return i;
            }
          });
          if (updatedSchedule.length > 0) {
            setScheduleData(updatedSchedule);
          }
          if (updateFilteredSchedule.length > 0) {
            setFilteredScheduleData(updateFilteredSchedule);
          }
          // navigate("/myschedule");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadScheduleData();

    const newConnection = new HubConnectionBuilder()
      .withUrl(SIGNAL_R)
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.on("ScreenConnected", (screenConnected) => {
      // console.log("ScreenConnected", screenConnected);
    });

    newConnection
      .start()
      .then(() => {
        // console.log("Connection established");
        setConnection(newConnection);
      })
      .catch((error) => {
        console.error("Error starting connection:", error);
      });

    return () => {
      if (newConnection) {
        newConnection
          .stop()
          .then(() => {
            // console.log("Connection stopped");
          })
          .catch((error) => {
            console.error("Error stopping connection:", error);
          });
      }
    };
  }, []);

  // add screen modal
  useEffect(() => {
    const handleClickOutsideAddScreenModal = (event) => {
      if (
        addScreenRef.current &&
        !addScreenRef.current.contains(event?.target)
      ) {
        setAddScreenModal(false);
      }
    };
    document.addEventListener("click", handleClickOutsideAddScreenModal, true);
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsideAddScreenModal,
        true
      );
    };
  }, [handleClickOutsideAddScreenModal]);

  function handleClickOutsideAddScreenModal() {
    setAddScreenModal(false);
  }

  // select screen modal
  useEffect(() => {
    const handleClickOutsideSelectScreenModal = (event) => {
      if (
        selectScreenRef.current &&
        !selectScreenRef.current.contains(event?.target)
      ) {
        setSelectScreenModal(false);
        setAddScreenModal(false);
      }
    };
    document.addEventListener(
      "click",
      handleClickOutsideSelectScreenModal,
      true
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsideSelectScreenModal,
        true
      );
    };
  }, [handleClickOutsideSelectScreenModal]);

  function handleClickOutsideSelectScreenModal() {
    setSelectScreenModal(false);
    setAddScreenModal(false);
  }

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (
        showActionModalRef.current &&
        !showActionModalRef.current.contains(event?.target)
      ) {
        // window.document.body.style.overflow = "unset";
        setShowActionBox(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowActionBox(false);
  }

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
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search schedule"
                  className="border border-primary rounded-full pl-10 py-1.5 search-user"
                  value={searchSchedule}
                  onChange={handleSearchSchedule}
                />
              </div>
              {/* <Link to="/weatherschedule">
                <button className=" flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-3 sm:py-2 text-sm   hover:text-white hover:bg-primary   hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                  <TiWeatherSunny className="text-lg mr-1" />
                  Weather Schedule
                </button>
              </Link> */}
              <Link to="/addschedule">
                <button className="sm:ml-2 xs:ml-1  flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-3 sm:py-2 text-sm   hover:text-white hover:bg-primary   hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                  <BiAddToQueue className="text-lg mr-1" />
                  New Schedule
                </button>
              </Link>
              {/* <button className="sm:ml-2 xs:ml-1 flex align-middle bg-SlateBlue text-white items-center  border-SlateBlue hover: rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <FiUpload className="text-lg" />
              </button> */}
              <button
                className="sm:ml-2 xs:ml-1 flex align-middle bg-red text-white items-center  border-SlateBlue hover: rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={handelDeleteAllSchedule}
                style={{ display: selectAll ? "block" : "none" }}
              >
                <RiDeleteBin5Line className="text-lg" />
              </button>
              {/* <button className="sm:ml-2 xs:ml-1 flex align-middle  bg-SlateBlue text-white items-center  border-SlateBlue hover: rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <HiMagnifyingGlass className="text-lg" />
              </button> */}
              <button className="flex align-middle   text-white items-center  rounded-full p-2 text-base">
                <input
                  type="checkbox"
                  className="w-7 h-6"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </button>
            </div>
          </div>
          {/* add screen modal start */}
          {addScreenModal && (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div
                ref={addScreenRef}
                className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
              >
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
                      New schedule would be applied. Do you want to proceed?
                    </p>
                  </div>
                  <div className="pb-6 flex justify-center">
                    <button
                      className="bg-primary text-white px-8 py-2 rounded-full"
                      onClick={() => {
                        setSelectScreenModal(true);
                        setAddScreenModal(false);
                      }}
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
            <ScreenAssignModal
              setAddScreenModal={setAddScreenModal}
              setSelectScreenModal={setSelectScreenModal}
              handleUpdateScreenAssign={handleUpdateScreenAssign}
              selectedScreens={selectedScreens}
              setSelectedScreens={setSelectedScreens}
            />
          )}
          <div className="schedual-table bg-white rounded-xl mt-8 shadow">
            <table
              className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Schedule Name
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Time Zones
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Date Added
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    start date
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    End date
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    screens Assigned
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Tags
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.length === 0 ? (
                  <td colSpan={7} className="font-semibold text-center text-xl">No Schedule here.</td>
                ) : filteredScheduleData.length === 0 &&
                  searchSchedule !== "" ? (
                  <td colSpan="8" className="text-center font-semibold text-xl">
                    Schedule not found
                  </td>
                ) : filteredScheduleData.length === 0 ? (
                  scheduleData.map((schedule) => (
                    <tr
                      className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                      key={schedule.scheduleId}
                    >
                      <td className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="mr-3"
                          style={{ display: selectAll ? "block" : "none" }}
                          checked={schedule.isChecked || false}
                          onChange={() =>
                            handleCheckboxChange(schedule.scheduleId)
                          }
                        />
                        {schedule.scheduleName}
                      </td>
                      <td className="text-center">{schedule.timeZoneName}</td>
                      <td className="text-center">
                        {moment(schedule.createdDate).format(
                          "YYYY-MM-DD hh:mm"
                        )}
                      </td>
                      <td className="text-center">
                        {moment(schedule.startDate).format("YYYY-MM-DD hh:mm")}
                      </td>

                      <td className="text-center">
                        {moment(schedule.endDate).format("YYYY-MM-DD hh:mm")}
                      </td>
                      <td className="text-center">{schedule.screenAssigned}</td>
                      <td className="text-center flex items-center justify-center gap-2 w-full flex-wrap">
                        {(schedule?.tags === "" || schedule?.tags === null) && (
                          <span>
                            <AiOutlinePlusCircle
                              size={30}
                              className="mx-auto cursor-pointer"
                              onClick={() => {
                                setShowTagModal(true);
                                schedule.tags === "" || schedule?.tags === null
                                  ? setTags([])
                                  : setTags(schedule?.tags?.split(","));
                                handleFetchScheduleByID(schedule?.scheduleId);
                                setUpdateTagSchedule(schedule);
                              }}
                            />
                          </span>
                        )}
                        {schedule.tags !== null
                          ? schedule.tags
                              .split(",")
                              .slice(
                                0,
                                schedule.tags.split(",").length > 2
                                  ? 3
                                  : schedule.tags.split(",").length
                              )
                              .join(",")
                          : ""}
                        {schedule?.tags !== "" && schedule?.tags !== null && (
                          <MdOutlineModeEdit
                            onClick={() => {
                              setShowTagModal(true);
                              schedule.tags === "" || schedule?.tags === null
                                ? setTags([])
                                : setTags(schedule?.tags?.split(","));
                              handleFetchScheduleByID(schedule?.scheduleId);
                              setUpdateTagSchedule(schedule);
                            }}
                            className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                          />
                        )}
                        {/* add or edit tag modal */}
                        {showTagModal && (
                          <AddOrEditTagPopup
                            setShowTagModal={setShowTagModal}
                            tags={tags}
                            setTags={setTags}
                            handleUpadteScheduleTags={handleUpadteScheduleTags}
                            from="schedule"
                            setUpdateTagSchedule={setUpdateTagSchedule}
                          />
                        )}
                      </td>
                      <td className="text-center relative">
                        <div className="relative">
                          <button
                            className="ml-3 relative"
                            onClick={() => {
                              handleScheduleItemClick(schedule.scheduleId);
                            }}
                          >
                            <HiDotsVertical />
                          </button>
                          {/* action popup start */}
                          {showActionBox[schedule.scheduleId] && (
                            <div
                              ref={showActionModalRef}
                              className="scheduleAction z-10 "
                            >
                              <div className="my-1">
                                <Link
                                  to={`/addschedule?scheduleId=${schedule.scheduleId}&scheduleName=${schedule.scheduleName}&timeZoneName=${schedule.timeZoneName}`}
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
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredScheduleData.map((schedule) => (
                    <tr
                      className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                      key={schedule.scheduleId}
                    >
                      <td className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="mr-3"
                          style={{ display: selectAll ? "block" : "none" }}
                          checked={schedule.isChecked || false}
                          onChange={() =>
                            handleCheckboxChange(schedule.scheduleId)
                          }
                        />
                        {schedule.scheduleName}
                      </td>
                      <td className="text-center">{schedule.timeZoneName}</td>
                      <td className="text-center">
                        {moment(schedule.createdDate).format(
                          "YYYY-MM-DD hh:mm"
                        )}
                      </td>
                      <td className="text-center">
                        {moment(schedule.startDate).format("YYYY-MM-DD hh:mm")}
                      </td>

                      <td className="text-center">
                        {moment(schedule.endDate).format("YYYY-MM-DD hh:mm")}
                      </td>
                      <td className="text-center">{schedule.screenAssigned}</td>
                      <td className="text-center flex items-center justify-center gap-2 w-full flex-wrap">
                        {(schedule?.tags === "" || schedule?.tags === null) && (
                          <span>
                            <AiOutlinePlusCircle
                              size={30}
                              className="mx-auto cursor-pointer"
                              onClick={() => {
                                setShowTagModal(true);
                                schedule.tags === "" || schedule?.tags === null
                                  ? setTags([])
                                  : setTags(schedule?.tags?.split(","));
                                handleFetchScheduleByID(schedule?.scheduleId);
                                setUpdateTagSchedule(schedule);
                              }}
                            />
                          </span>
                        )}
                        {schedule.tags !== null
                          ? schedule.tags
                              .split(",")
                              .slice(
                                0,
                                schedule.tags.split(",").length > 2
                                  ? 3
                                  : schedule.tags.split(",").length
                              )
                              .join(",")
                          : ""}
                        {schedule?.tags !== "" && schedule?.tags !== null && (
                          <MdOutlineModeEdit
                            onClick={() => {
                              setShowTagModal(true);
                              schedule.tags === "" || schedule?.tags === null
                                ? setTags([])
                                : setTags(schedule?.tags?.split(","));
                              handleFetchScheduleByID(schedule?.scheduleId);
                              setUpdateTagSchedule(schedule);
                            }}
                            className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                          />
                        )}
                        {/* add or edit tag modal */}
                        {showTagModal && (
                          <AddOrEditTagPopup
                            setShowTagModal={setShowTagModal}
                            tags={tags}
                            setTags={setTags}
                            handleUpadteScheduleTags={handleUpadteScheduleTags}
                            from="schedule"
                            setUpdateTagSchedule={setUpdateTagSchedule}
                          />
                        )}
                      </td>
                      <td className="text-center relative">
                        <div className="relative">
                          <button
                            className="ml-3 relative"
                            onClick={() => {
                              handleScheduleItemClick(schedule.scheduleId);
                            }}
                          >
                            <HiDotsVertical />
                          </button>
                          {/* action popup start */}
                          {showActionBox[schedule.scheduleId] && (
                            <div
                              ref={showActionModalRef}
                              className="scheduleAction z-10 "
                            >
                              <div className="my-1">
                                <Link
                                  to={`/addschedule?scheduleId=${schedule.scheduleId}&scheduleName=${schedule.scheduleName}&timeZoneName=${schedule.timeZoneName}`}
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
