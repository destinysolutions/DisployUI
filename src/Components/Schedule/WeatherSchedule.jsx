import React, { useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { BiAddToQueue, BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
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
  DELETE_SCHEDULE,
  SET_TO_SCREEN_WEATHER,
  UPDATE_SCREEN_ASSIGN,
} from "../../Pages/Api";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineResetTv } from "react-icons/md";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import toast, { CheckmarkIcon } from "react-hot-toast";
import ScreenAssignModal from "../ScreenAssignModal";
import {
  handleChangeSchedule,
  handleDeleteScheduleAll,
  handleGetAllSchedule,
} from "../../Redux/ScheduleSlice";
import { connection } from "../../SignalR";
import Swal from "sweetalert2";
import ReactTooltip from "react-tooltip";
import { socket } from "../../App";
import { deletedData, getData } from "../../Redux/WeatherSlice";

const WeatherSchedule = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [weatherScheduleId, setWeatherScheduleId] = useState();
  const [searchSchedule, setSearchSchedule] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [filteredScheduleData, setFilteredScheduleData] = useState([]);
  const [updateTagSchedule, setUpdateTagSchedule] = useState(null);
  const [tags, setTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [screenSelected, setScreenSelected] = useState([]);
  const [selectdata, setSelectData] = useState({});
  const store = useSelector((state) => state.root.weather);

  const { token } = useSelector((state) => state.root.auth);
  const { loading, successMessage, type } = useSelector((s) => s.root.schedule);
  const authToken = `Bearer ${token}`;

  const addScreenRef = useRef(null);
  const selectScreenRef = useRef(null);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectcheck, setSelectCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedField, setSortedField] = useState(null);
  const [weatherScheduleData, setWeatherScheduleData] = useState([]);
  const [loadFist, setLoadFist] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleGetAllSchedule({ token }));

    if (successMessage && type === "DELETE") {
      toast.success(successMessage);
    }
  }, [successMessage]);

  // Filter data based on search term
  const filteredData = Array.isArray(store?.data?.model)
    ? store.data.model.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(searchSchedule.toLowerCase())
        )
      )
    : [];

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  // Function to sort the data based on a field and order
  const sortData = (data, field, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    return sortedData;
  };

  const sortedAndPaginatedData = sortData(
    filteredData,
    sortedField,
    sortOrder
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sorting when a table header is clicked
  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  useEffect(() => {
    if (loadFist) {
      dispatch(getData());
      setLoadFist(false);
    }
  }, [loadFist, store]);

  const handleGetAll = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/WeatherScheduling/GetWeatherScheduling",
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then((response) => {
        setWeatherScheduleData(response?.data?.data?.model);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleGetAll();

    if (store && store.status === "deleted") {
      toast.success(store.message);
      setLoadFist(true);
    }
  }, [store]);

  const handleSelectAll = () => {
    setSelectAllChecked(!selectAllChecked);
    if (selectedItems.length === store?.data?.model?.length) {
      setSelectedItems([]);
    } else {
      const allIds = store?.data?.model.map(
        (schedule) => schedule.weatherSchedulingID
      );
      setSelectedItems(allIds);
    }
  };

  const handleCheckboxChange = (weatherSchedulingID) => {
    setSelectAllChecked(false);
    setSelectCheck(true);
    if (selectedItems.includes(weatherSchedulingID)) {
      setSelectedItems(
        selectedItems.filter((id) => id !== weatherSchedulingID)
      );
    } else {
      setSelectedItems([...selectedItems, weatherSchedulingID]);
    }
  };

  useEffect(() => {
    if (selectcheck && weatherScheduleData?.length > 0) {
      if (selectedItems?.length === weatherScheduleData?.length) {
        setSelectAllChecked(true);
      }
    }
  }, [selectcheck, selectedItems]);

  const handelDeleteAllSchedule = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletedData(selectedItems));
        setSelectAllChecked(false);
        setSelectedItems([]);
      }
      const Params = {
        id: socket.id,
        connection: socket.connected,
        macId: weatherScheduleData
          ?.map((item) => item?.maciDs)
          .join(",")
          .replace(/^\s+/g, ""),
      };
      socket.emit("ScreenConnected", Params);
      if (connection.state == "Disconnected") {
        connection
          .start()
          .then((res) => {
            console.log("signal connected");
          })
          .then(() => {
            connection
              .invoke(
                "ScreenConnected",
                weatherScheduleData
                  ?.map((item) => item?.maciDs)
                  .join(",")
                  .replace(/^\s+/g, "")
              )
              .then(() => {
                console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          });
      } else {
        connection
          .invoke(
            "ScreenConnected",
            weatherScheduleData
              ?.map((item) => item?.maciDs)
              .join(",")
              .replace(/^\s+/g, "")
          )
          .then(() => {
            console.log("SignalR method invoked after screen update");
          })
          .catch((error) => {
            console.error("Error invoking SignalR method:", error);
          });
      }
    });
  };

  const handleUpdateScreenAssign = (screenIds, macids) => {
    let idS = "";
    let count = 0;

    for (const key in screenIds) {
      if (screenIds[key] === true) {
        if (count > 0) {
          idS += ",";
        }
        idS += key;
        count++;
      }
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SET_TO_SCREEN_WEATHER}?WeatherSchedulingId=${weatherScheduleId}&ScreenID=${idS}`,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    };
    toast.loading("Saving...");
    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          try {
            if (macids?.includes(",")) {
              let allMacIDs = macids?.split(",");
              allMacIDs?.map((item) => {
                let Params = {
                  id: socket.id,
                  connection: socket.connected,
                  macId: item,
                };
                socket.emit("ScreenConnected", Params);
              });
            } else {
              const Params = {
                id: socket.id,
                connection: socket.connected,
                macId: macids,
              };
              socket.emit("ScreenConnected", Params);
            }
            setTimeout(() => {
              toast.remove();
              setSelectScreenModal(false);
              setAddScreenModal(false);
            }, 2000);
            if (connection.state == "Disconnected") {
              connection
                .start()
                .then((res) => {
                  console.log("signal connected");
                })
                .then(() => {
                  connection
                    .invoke("ScreenConnected", macids)
                    .then(() => {
                      console.log("func. invoked");
                    })
                    .catch((err) => {
                      toast.remove();
                      toast.error("Something went wrong, try again");
                    });
                });
            } else {
              connection
                .invoke("ScreenConnected", macids)
                .then(() => {
                  console.log("func. invoked");
                })
                .catch((err) => {
                  toast.remove();
                  toast.error("Something went wrong, try again");
                });
            }
          } catch (error) {
            toast.error("Something went wrong, try again");
            toast.remove();
          }
        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handleSearchSchedule = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchSchedule(searchQuery);
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
          const updatedSchedule = weatherScheduleData.map((i) => {
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
            dispatch(handleChangeSchedule(updatedSchedule));
          }
          if (updateFilteredSchedule.length > 0) {
            setFilteredScheduleData(updateFilteredSchedule);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  return (
    <>
      {/* navbar and sidebar start */}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {/* navbar and sidebar end */}
      <div className="pt-24 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              Weather Schedule
            </h1>
            <div className=" items-center flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn ">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-primary rounded-full pl-10 py-1.5 search-user"
                  value={searchSchedule}
                  onChange={handleSearchSchedule}
                />
              </div>

              <Link to="/addweatherschedule">
                <button className="sm:ml-2 xs:ml-1  flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-3 sm:py-2 text-sm   hover:text-white hover:bg-primary   hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                  <BiAddToQueue className="text-lg mr-1" />
                  New Weather Schedule
                </button>
              </Link>
              <button
                data-tip
                data-for="Delete"
                className="sm:ml-2 xs:ml-1 flex align-middle bg-red text-white items-center  border-SlateBlue hover: rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={handelDeleteAllSchedule}
                style={{ display: selectAllChecked ? "block" : "none" }}
              >
                <RiDeleteBin5Line className="text-lg" />
                <ReactTooltip
                  id="Delete"
                  place="bottom"
                  type="warning"
                  effect="solid"
                >
                  <span>Delete</span>
                </ReactTooltip>
              </button>

              {/* multipal remove */}
              {selectedItems.length !== 0 && !selectAllChecked && (
                <button
                  data-tip
                  data-for="Delete"
                  className="sm:ml-2 xs:ml-1 flex align-middle bg-red text-white items-center  border-SlateBlue hover: rounded-full xs:px-2 xs:py-1 sm:py-1 sm:px-3 md:p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  onClick={handelDeleteAllSchedule}
                >
                  <RiDeleteBin5Line className="text-lg" />
                  <ReactTooltip
                    id="Delete"
                    place="bottom"
                    type="warning"
                    effect="solid"
                  >
                    <span>Delete</span>
                  </ReactTooltip>
                </button>
              )}

              <button
                data-tip
                data-for="Select All"
                className="flex align-middle   text-white items-center  rounded-full p-2 text-base"
              >
                <input
                  type="checkbox"
                  className="lg:w-7 lg:h-6 w-5 h-5"
                  checked={selectAllChecked}
                  onChange={handleSelectAll}
                />
                <ReactTooltip
                  id="Select All"
                  place="bottom"
                  type="warning"
                  effect="solid"
                >
                  <span>Select All</span>
                </ReactTooltip>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl mt-8 shadow screen-section">
            <div className="schedual-tabl mt-5 overflow-x-scroll sc-scrollbar rounded-lg">
              <table
                className="screen-table w-full bg-white lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
                cellPadding={15}
              >
                <thead>
                  <tr className="items-center table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center flex items-center">
                      Weather Schedule Name
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        onClick={() => handleSort("name")}
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Date Added
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Start Date
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      End Date
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Screens Assigned
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Tags
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex text-center m-5 justify-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="#1C64F2"
                            />
                          </svg>
                        
                        </div>
                      </td>
                    </tr>
                  ) : weatherScheduleData &&
                    sortedAndPaginatedData?.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="flex text-center m-5 justify-center">
                          <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2">
                            No Data Available
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {weatherScheduleData &&
                        sortedAndPaginatedData.length > 0 &&
                        sortedAndPaginatedData.map((schedule, index) => {
                          return (
                            <tr
                              className="border-b-[#E4E6FF] border-b"
                              key={index}
                            >
                              <td className="text-[#5E5E5E] text-center">
                                <div className="flex gap-1">
                                  {selectAll ? (
                                    <CheckmarkIcon className="w-5 h-5" />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      checked={selectedItems.includes(
                                        schedule.weatherSchedulingID
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(
                                          schedule.weatherSchedulingID
                                        )
                                      }
                                    />
                                  )}
                                  {schedule.name}
                                </div>
                              </td>

                              <td className="text-center text-[#5E5E5E]">
                                {moment(schedule.createdDate).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </td>
                              <td className="text-center text-[#5E5E5E]">
                                {moment(schedule.startDate).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </td>
                              <td className="text-center text-[#5E5E5E]">
                                {moment(schedule.endDate).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </td>
                              <td className="text-center text-[#5E5E5E]">
                                {schedule.screenAssigned}
                              </td>

                              <td
                                title={schedule?.tags && schedule?.tags}
                                className="text-center text-[#5E5E5E]"
                              >
                                <div className="flex items-center justify-center gap-2 w-full flex-wrap">
                                  {(schedule?.tags === "" ||
                                    schedule?.tags === null) && (
                                    <span>
                                      <AiOutlinePlusCircle
                                        size={30}
                                        className="mx-auto cursor-pointer"
                                        onClick={() => {
                                          setShowTagModal(true);
                                          schedule.tags === "" ||
                                          schedule?.tags === null
                                            ? setTags([])
                                            : setTags(
                                                schedule?.tags?.split(",")
                                              );
                                          setUpdateTagSchedule(schedule);
                                        }}
                                      />
                                    </span>
                                  )}
                                  {schedule.tags !== null
                                    ? schedule.tags
                                        ?.split(",")
                                        .slice(
                                          0,
                                          schedule.tags?.split(",").length > 2
                                            ? 3
                                            : schedule.tags?.split(",").length
                                        )
                                        .map((text) => {
                                          if (text.toString().length > 10) {
                                            return text
                                              ?.split("")
                                              .slice(0, 10)
                                              .concat("...")
                                              .join("");
                                          }
                                          return text;
                                        })
                                        .join(",")
                                    : ""}
                                  {schedule?.tags !== "" &&
                                    schedule?.tags !== null && (
                                      <AiOutlinePlusCircle
                                        onClick={() => {
                                          setShowTagModal(true);
                                          schedule.tags === "" ||
                                          schedule?.tags === null
                                            ? setTags([])
                                            : setTags(
                                                schedule?.tags?.split(",")
                                              );
                                          setUpdateTagSchedule(schedule);
                                        }}
                                        className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                                      />
                                    )}
                                  {showTagModal && (
                                    <AddOrEditTagPopup
                                      setShowTagModal={setShowTagModal}
                                      tags={tags}
                                      setTags={setTags}
                                      handleUpadteScheduleTags={
                                        handleUpadteScheduleTags
                                      }
                                      from="schedule"
                                      setUpdateTagSchedule={
                                        setUpdateTagSchedule
                                      }
                                    />
                                  )}
                                </div>
                              </td>

                              <td className="text-center relative">
                                <div className="flex justify-center gap-2 items-center">
                                  <div className="relative">
                                    <button
                                      data-tip
                                      data-for="Edit"
                                      type="button"
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                      onClick={() =>
                                        navigate(
                                          `/addweatherschedule?weatherScheduleId=${schedule.weatherSchedulingID}`
                                        )
                                      }
                                    >
                                      <BiEdit />
                                      <ReactTooltip
                                        id="Edit"
                                        place="bottom"
                                        type="warning"
                                        effect="solid"
                                      >
                                        <span>Edit</span>
                                      </ReactTooltip>
                                    </button>
                                  </div>
                                  <div className="relative mx-3">
                                    <button
                                      data-tip
                                      data-for="Set to Screen"
                                      type="button"
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                      onClick={() => {
                                        setWeatherScheduleId(
                                          schedule.weatherSchedulingID
                                        );
                                        setAddScreenModal(true);
                                        setScreenSelected(
                                          schedule?.screenAssigned?.split(",")
                                        );
                                        setSelectData(schedule);
                                      }}
                                    >
                                      <MdOutlineResetTv />
                                      <ReactTooltip
                                        id="Set to Screen"
                                        place="bottom"
                                        type="warning"
                                        effect="solid"
                                      >
                                        <span>Set to Screen</span>
                                      </ReactTooltip>
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 5H1m0 0 4 4M1 5l4-4"
                  />
                </svg>
                {sidebarOpen ? "Previous" : ""} 
              </button>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
             {sidebarOpen ? "Next" : ""}
                <svg
                  className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Model */}

      {/* add screen modal start */}
      {addScreenModal && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
          <div
            ref={addScreenRef}
            className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
          >
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                <div className="flex items-center">
                  <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                    Select the Screen you want Schedule add
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
                <p className="break-words w-[280px] text-base text-black text-center">
                  New schedule would be applied. Do you want to proceed?
                </p>
              </div>
              <div className="pb-6 flex justify-center">
                <button
                  className="bg-primary text-white px-8 py-2 rounded-full"
                  onClick={() => {
                    if (selectdata?.screenIDs) {
                      let arr = [selectdata?.screenIDs];
                      let newArr = arr[0]
                        ?.split(",")
                        .map((item) => parseInt(item.trim()));
                      setSelectedScreens(newArr);
                    }
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
          screenSelected={screenSelected}
          sidebarOpen={sidebarOpen}
        />
      )}
    </>
  );
};

export default WeatherSchedule;
