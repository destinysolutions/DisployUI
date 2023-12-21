import moment from "moment";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import EventEditor from "./EventEditor";
import axios from "axios";
import "../../Styles/schedule.css";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { SlCalender, SlScreenDesktop } from "react-icons/sl";
import { BiFilterAlt } from "react-icons/bi";
import { BsTags } from "react-icons/bs";

import {
  ADD_EVENT,
  GET_ALL_FILES,
  ADD_SCHEDULE,
  SCHEDULE_EVENT_SELECT_BY_ID,
  GET_TIMEZONE,
  UPDATED_SCHEDULE_DATA,
  SIGNAL_R,
  SELECT_BY_USER_SCREENDETAIL,
  UPDATE_SCREEN_ASSIGN,
  GET_SCEDULE_TIMEZONE,
  UPDATE_TIMEZONE,
  GET_ALL_EVENTS,
} from "../../Pages/Api";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import SaveAssignScreenModal from "./SaveAssignScreenModal";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineGroups, MdSave } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { handleGetAllAssets } from "../../Redux/Assetslice";
import { handleUpdateTimezone } from "../../Redux/ScheduleSlice";
import { handleGetScreen } from "../../Redux/Screenslice";
import ScreenAssignModal from "../ScreenAssignModal";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../Redux/AppsSlice";
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const AddSchedule = ({ sidebarOpen, setSidebarOpen }) => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [myEvents, setEvents] = useState([]);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [scheduleAsset, setScheduleAsset] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const current_date = new Date();
  const [createdScheduleId, setCreatedScheduleId] = useState("");

  const [searchParams] = useSearchParams();
  const getScheduleId = searchParams.get("scheduleId");
  const isEditingSchedule = !!getScheduleId;
  const getScheduleName = searchParams.get("scheduleName");
  const [newScheduleNameInput, setNewScheduleNameInput] = useState(
    getScheduleName
      ? getScheduleName
      : moment(current_date).format("YYYY-MM-DD hh:mm")
  );
  const [screenData, setScreenData] = useState([]);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [getTimezone, setTimezone] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState();
  const [connection, setConnection] = useState(null);

  const addedTimezoneName = searchParams.get("timeZoneName");
  const selectedScreenIdsString = selectedScreens.join(",");

  const { user, token } = useSelector((s) => s.root.auth);
  const { assets } = useSelector((s) => s.root.asset);

  const authToken = `Bearer ${token}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#4A90E2";
    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "Black",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedSlot({ start, end });
    setCreatePopupOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    // console.log("running",event);
    setSelectedEvent(event);
    setCreatePopupOpen(true);
  }, []);

  // Fetch events associated with the scheduleId
  const loadEventsForSchedule = (scheduleId) => {
    axios
      .get(`${SCHEDULE_EVENT_SELECT_BY_ID}?ID=${scheduleId}`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setScheduleAsset(response.data.data);
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
        setEvents(fetchedEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (getScheduleId) {
      loadEventsForSchedule(getScheduleId);
    }
  }, [getScheduleId]);

  const handleTimezoneSelect = (e) => {
    if (e.target.value != selectedTimezoneName && isEditingSchedule) {
      if (!window.confirm("Are you sure?")) return;
      setSelectedTimezoneName(e.target.value);
      const id = isEditingSchedule ? getScheduleId : createdScheduleId;

      dispatch(
        handleUpdateTimezone({
          id,
          timeZoneName: e.target.value,
          userID: user?.userID,
          token,
        })
      );
    } else {
      setSelectedTimezoneName(e.target.value);
      const id = isEditingSchedule ? getScheduleId : createdScheduleId;

      dispatch(
        handleUpdateTimezone({
          id,
          timeZoneName: e.target.value,
          userID: user?.userID,
          token,
        })
      );
    }
  };

  const getOverallEventTimes = (events) => {
    if (events.length === 0) return null;

    let earliestStartTime = events[0].start;
    let latestEndTime = events[0].end;

    for (const event of events) {
      if (event.start < earliestStartTime) {
        earliestStartTime = event.start;
      }

      if (event.end > latestEndTime) {
        latestEndTime = event.end;
      }
    }

    return {
      earliestStartTime,
      latestEndTime,
    };
  };
  const overallEventTimes = getOverallEventTimes(myEvents);

  const saveEditedSchedule = () => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;
    let data = JSON.stringify({
      scheduleId: scheduleIdToUse,
      scheduleName: newScheduleNameInput,
      screenAssigned: selectedScreenIdsString,
      startDate: overallEventTimes.earliestStartTime.toLocaleString(),
      endDate: overallEventTimes.latestEndTime.toLocaleString(),
      operation: "Insert",
      tags: "tags",
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

    toast.loading("Saving...");
    axios
      .request(config)
      .then((response) => {
        if (response.data.status === 200) {
          toast.remove();
          navigate("/myschedule");
        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handleUpdateScreenAssign = () => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${UPDATE_SCREEN_ASSIGN}?ScheduleID=${scheduleIdToUse}&ScreenID=${selectedScreenIdsString}`,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        //console.log(JSON.stringify(response.data));
        setSelectScreenModal(false);
        if (connection) {
          connection
            .invoke("ScreenConnected")
            .then(() => {
              console.log("SignalR method invoked after screen update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSaveEvent = (eventId, eventData, updateAllValue) => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;
    if (isEditingSchedule) {
      toast.loading("Updating Events...");
    } else {
      toast.loading("Creating Events...");
    }
    const data = {
      startDate: eventData.start,
      endDate: eventData.end,
      asset: eventData.asset ? eventData.asset.assetID : null,
      title: eventData.title,
      color: eventData.color,
      repeatDay: eventData.repeatDay,
      operation: "Insert",
      scheduleId: scheduleIdToUse,
      UpdateALL: updateAllValue,
    };

    if (eventId) {
      data.eventId = eventId;
    }

    const config = {
      method: "post",
      url: ADD_EVENT,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const fetchedData = response.data.data.eventTables;
          const updateEvent = fetchedData.map((item) => ({
            id: item.eventId,
            title: item.title,
            start: new Date(item.cStartDate),
            end: new Date(item.cEndDate),
            color: item.color,
            repeatDay: item.repeatDay,
            day: item.day,
            asset: item.asset,
          }));
          toast.remove();

          loadEventsForSchedule(scheduleIdToUse);
          // console.log(fetchedData);

          // console.log(updateEvent);
          // setEvents(updateEvent)
          // // Sending a SignalR message for the updated event
          if (eventId) {
            const updatedEvent = fetchedData.find(
              (event) => event.eventId === eventId
            );

            // console.log(updatedEvent, "updateEvent");
            // if (updatedEvent && connection) {
            //   connection
            //     .invoke(
            //       "SendMessage",
            //       updatedEvent.cEndDate,
            //       updatedEvent.cStartDate,
            //       fileType
            //     )
            //     .then(() => {
            //       console.log("SignalR message sent for updated event");
            //     })
            //     .catch((error) => {
            //       console.error("Error sending SignalR message:", error);
            //     });
            // }
            if (connection) {
              connection
                .invoke("ScreenConnected")
                .then(() => {
                  console.log("SignalR method invoked after screen update");
                })
                .catch((error) => {
                  console.error("Error invoking SignalR method:", error);
                });
            }
          }

          if (eventId) {
            const updatedEventsMap = Object.fromEntries(
              updateEvent.map((event) => [event.id, event])
            );
            const updatedMyEvents = myEvents.map((event) => {
              const updatedEvent = updatedEventsMap[event.id];
              return updatedEvent ? { ...event, ...updatedEvent } : event;
            });
            // console.log(updatedMyEvents,myEvents);
            setEvents(updatedMyEvents);

            if (selectedEvent && selectedEvent.eventId === eventId) {
              const updatedEvent = fetchedData.find(
                (event) => event.eventId === eventId
              );
              if (updatedEvent) {
                setSelectedEvent(updatedEvent);
              }
            }
          } else {
            // Add new event to events
            setEvents((prevEvents) => [...prevEvents, ...updateEvent]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
    setSelectedSlot(null);
    setSelectedEvent(null);
    setCreatePopupOpen(false);
  };

  // Function to handle event drag and drop
  const handleEventDrop = ({ event, start, end }) => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;
    const previousSelectedAsset = allAssets.find(
      (asset) => asset.assetID === event.asset
    );
    const updatedEventData = {
      ...event,
      start,
      end,
      asset: previousSelectedAsset,
      scheduleId: scheduleIdToUse,
    };

    handleSaveEvent(updatedEventData.id, updatedEventData);
  };

  // Function to handle event resize
  const handleEventResize = ({ event, start, end }) => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;
    const previousSelectedAsset = allAssets.find(
      (asset) => asset.assetID === event.asset
    );

    const resizedEvent = {
      ...event,
      start,
      end,
      asset: previousSelectedAsset,
      scheduleId: scheduleIdToUse,
    };
    handleSaveEvent(resizedEvent.id, resizedEvent);
  };

  const handleCloseCreatePopup = () => {
    setSelectedSlot(null);
    setSelectedEvent(null);
    setCreatePopupOpen(false);
    setAllAssets([...assets]);
  };

  // Function to handle the deletion of an event
  const handleEventDelete = (eventId) => {
    const updatedEvents = myEvents.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(null);
      setCreatePopupOpen(false);
    }
  };

  const handleAssetChange = (event) => {
    const selectedName = event.target.value;
    const selectedAsset = assetData.find(
      (item) => item.assetName === selectedName
    );
    setSelectedAsset(selectedAsset);
  };

  useEffect(() => {
    if (user) {
      const response = dispatch(handleGetScreen({ token }));

      if (response) {
        response
          .then((response) => {
            const fetchedData = response?.payload?.data;
            const initialCheckboxes = {};
            if (Array.isArray(fetchedData)) {
              fetchedData.forEach((screen) => {
                initialCheckboxes[screen.screenID] = false;
              });
              setScreenCheckboxes(initialCheckboxes);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [user]);

  //socket signal-RRR && fetch data
  useEffect(() => {
    axios
      .get(GET_SCEDULE_TIMEZONE, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((TIMEZONEresponse) => {
        setTimezone(TIMEZONEresponse.data.data);

        const timezone = isEditingSchedule
          ? addedTimezoneName
          : TIMEZONEresponse.data.data[92].timeZoneName;

        setSelectedTimezoneName(timezone);
        if (!isEditingSchedule) {
          axios
            .post(
              ADD_SCHEDULE,
              {
                scheduleName: newScheduleNameInput,
                timeZoneName: TIMEZONEresponse.data.data[92].timeZoneName,
                screenAssigned: selectedScreenIdsString,
                operation: "Insert",
              },
              {
                headers: {
                  Authorization: authToken,
                },
              }
            )
            .then((response) => {
              const newScheduleId = response.data.data.model.scheduleId;
              setCreatedScheduleId(newScheduleId);
            })
            .catch((error) => {
              console.error("Error creating a new schedule:", error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    const newConnection = new HubConnectionBuilder()
      .withUrl(SIGNAL_R)
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.on("ScreenConnected", (screenConnected) => {
      console.log("ScreenConnected", screenConnected);
    });

    newConnection
      .start()
      .then(() => {
        console.log("Connection established");
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
            console.log("Connection stopped");
          })
          .catch((error) => {
            console.error("Error stopping connection:", error);
          });
      }
    };
  }, []);

  useEffect(() => {
    dispatch(handleGetAllAssets({ token }));
    dispatch(handleGetYoutubeData({ token }));
    dispatch(handleGetTextScrollData({ token }));
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: UPDATED_SCHEDULE_DATA,
      headers: { Authorization: authToken },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data, "response.data[0]");
        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          // const { cEndDate, cStartDate, fileType } = response.data.data[0];
          // setFileType(fileType);
          // if (connection) {
          //   // Send the API response to SignalR when the connection is established
          //   connection
          //     .invoke("SendMessage", cEndDate, cStartDate, fileType)
          //     .then(() => {
          //       console.log("Message sent:", cEndDate, cStartDate, fileType);
          //     })
          //     .catch((error) => {
          //       console.error("Error sending message:", error);
          //     });
          // } else {
          //   console.warn("Connection is not established yet.");
          // }
          if (connection) {
            connection
              .invoke("ScreenConnected")
              .then(() => {
                console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
        } else {
          console.warn("No data in the response");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [connection]);

  const handleScreenCheckboxChange = (screenID) => {
    const updatedCheckboxes = { ...screenCheckboxes };
    updatedCheckboxes[screenID] = !updatedCheckboxes[screenID];
    setScreenCheckboxes(updatedCheckboxes);

    // Create a copy of the selected screens array
    const updatedSelectedScreens = [...selectedScreens];

    // If the screenID is already in the array, remove it; otherwise, add it
    if (updatedSelectedScreens.includes(screenID)) {
      const index = updatedSelectedScreens.indexOf(screenID);
      updatedSelectedScreens.splice(index, 1);
    } else {
      updatedSelectedScreens.push(screenID);
    }

    // Update the selected screens state
    setSelectedScreens(updatedSelectedScreens);

    // Check if any individual screen checkbox is unchecked
    const allChecked = Object.values(updatedCheckboxes).every(
      (isChecked) => isChecked
    );

    setSelectAllChecked(allChecked);
  };

  const handleSelectAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);

    // Set the state of all individual screen checkboxes
    const updatedCheckboxes = {};
    for (const screenID in screenCheckboxes) {
      updatedCheckboxes[screenID] = checked;
    }
    setScreenCheckboxes(updatedCheckboxes);

    // Update the selected screens state based on whether "All Select" is checked
    if (checked) {
      const allScreenIds = screenData.map((screen) => screen.screenID);
      setSelectedScreens(allScreenIds);
    } else {
      setSelectedScreens([]);
    }
  };

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>

      <div className="pt-16 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="grid grid-cols-12 mt-5">
            <div className="lg:col-span-9 md:col-span-7 sm:col-span-6 xs:col-span-12 flex flex-col gap-2 items-start">
              <p className="text-xl font-semibold ">Schedule Name</p>
              <div className="flex justify-center items-center">
                <input
                  type="text"
                  className="w-full border border-primary rounded-md px-2 py-1"
                  placeholder="Enter schedule name"
                  value={newScheduleNameInput}
                  onChange={(e) => setNewScheduleNameInput(e.target.value)}
                />
                {/* <button
                  onClick={() => setShowScreenNameEdit(!showScreenNameEdit)}
                  className="ml-3 h-6 w-6"
                >
                  {showScreenNameEdit ? (
                    <MdSave className="w-full h-full" />
                  ) : (
                    <BsPencilFill className="w-full h-full" />
                  )}
                </button> */}
              </div>
            </div>

            <div className="lg:col-span-3 md:col-span-5 sm:col-span-6 xs:col-span-12 ml-5">
              <select
                className="w-full paymentlabel relative"
                value={selectedTimezoneName}
                onChange={(e) => handleTimezoneSelect(e)}
              >
                {getTimezone.map((timezone) => (
                  <option
                    value={timezone.timeZoneName}
                    key={timezone.timeZoneID}
                  >
                    {timezone.timeZoneName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 mt-5">
            <div className="bg-white lg:col-span-9 md:col-span-7 sm:col-span-12 xs:col-span-12 p-3 ">
              <DragAndDropCalendar
                selectable
                localizer={localizer}
                events={myEvents}
                defaultView={Views.DAY}
                startAccessor="start"
                endAccessor="end"
                onEventDrop={handleEventDrop}
                resizable
                onEventResize={handleEventResize}
                step={30}
                showMultiDayTimes
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                eventPropGetter={eventStyleGetter}
                length={31}
              />
              <EventEditor
                isOpen={isCreatePopupOpen}
                onClose={handleCloseCreatePopup}
                onSave={handleSaveEvent}
                onDelete={handleEventDelete}
                selectedSlot={selectedSlot}
                selectedEvent={selectedEvent}
                assetData={assetData}
                setAssetData={setAssetData}
                allAssets={allAssets}
                setAllAssets={setAllAssets}
                setSelectedEvent={setSelectedEvent}
                handleAssetChange={handleAssetChange}
                scheduleAsset={scheduleAsset}
                myEvents={myEvents}
              />
            </div>
            <div className=" bg-white lg:ml-5 md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-5 sm:col-span-12 xs:col-span-12 lg:mt-0 md:mt-0 sm:mt-3 xs:mt-3 ">
              {/* <div className="flex justify-center my-3 text-black font-semibold text-xl">
                Schedule Name
              </div> */}

              {/* <div className="flex justify-center items-center px-5">
                <input
                  type="text"
                  className="w-full border border-primary rounded-md px-2 py-1"
                  placeholder="Enter schedule name"
                  value={newScheduleNameInput}
                  onChange={(e) => setNewScheduleNameInput(e.target.value)}
                />
              </div> */}

              <div className="border-b-2 border-lightgray mt-3"></div>
              <div className="p-3">
                <div className="mb-2">Schedule Date time</div>
                <div>
                  <ul className="border-2 border-lightgray">
                    <li className="border-b-2 border-lightgray p-3">
                      <h3>Start Date & Time:</h3>
                      <div className="bg-lightgray rounded-full px-3 py-2 mt-2">
                        {overallEventTimes
                          ? overallEventTimes.earliestStartTime.toLocaleString()
                          : "No events found"}
                        {/* {myEvents.length > 0
                          ? moment(myEvents[0]?.startDate).format("lll")
                          : "No events found"} */}
                      </div>
                    </li>
                    <li className="border-b-2 border-lightgray p-3">
                      <h3>End Date & Time:</h3>
                      <div className="bg-lightgray rounded-full px-3 py-2 mt-2">
                        {/* {myEvents.length > 0
                          ? moment(
                              myEvents[myEvents.length - 1]?.actualEndDate
                            ).format("lll")
                          : "No events found"} */}
                        {overallEventTimes
                          ? overallEventTimes.latestEndTime.toLocaleString()
                          : "No events found"}
                      </div>
                    </li>
                    <li className="p-3">
                      <select
                        className="w-full paymentlabel relative"
                        onChange={handleAssetChange}
                      >
                        <option value="">Select an asset</option>

                        {Array.from(
                          new Set(
                            Array.isArray(scheduleAsset)
                              ? scheduleAsset.map((asset) => asset.asset)
                              : [scheduleAsset]
                          )
                        ).map((uniqueId, index) => {
                          const foundAsset = allAssets.find(
                            (asset) => asset.assetID === uniqueId
                          );

                          if (foundAsset) {
                            return (
                              <option key={index} value={foundAsset.assetName}>
                                {foundAsset.assetName}
                              </option>
                            );
                          }

                          return null;
                        })}
                      </select>
                    </li>

                    {selectedAsset && (
                      <>
                        {selectedAsset.assetType === "OnlineImage" && (
                          <img
                            src={selectedAsset.assetFolderPath}
                            alt={selectedAsset.assetName}
                            className="imagebox relative"
                          />
                        )}
                        {selectedAsset.assetType === "OnlineVideo" && (
                          <video
                            controls
                            className="w-full rounded-2xl relative h-56"
                          >
                            <source
                              src={selectedAsset.assetFolderPath}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {selectedAsset.assetType === "Image" && (
                          <img
                            src={selectedAsset.assetFolderPath}
                            alt={selectedAsset.assetName}
                            className="imagebox relative"
                          />
                        )}
                        {selectedAsset.assetType === "Video" && (
                          <video
                            controls
                            className="w-full rounded-2xl relative h-56"
                          >
                            <source
                              src={selectedAsset.assetFolderPath}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {selectedAsset.assetType === "DOC" && (
                          <a
                            href={selectedAsset.assetFolderPath}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedAsset.assetName}
                          </a>
                        )}
                      </>
                    )}
                  </ul>
                </div>
                {assetData.length === 0 && (
                  <div className="flex mt-4">
                    <div className="mt-1">
                      <button>
                        <IoArrowBackOutline />
                      </button>
                    </div>
                    <p className="mx-3">
                      No Associated Assets. Start by selecting a date & time on
                      the calendar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-wrap mt-5">
            <Link to="/myschedule">
              <button className="mb-3 border-2 border-gray bg-lightgray hover:bg-primary hover:text-white  px-5 py-2 rounded-full">
                Cancel
              </button>
            </Link>

            <button
              className="mb-3 border-2 border-gray bg-lightgray hover:bg-primary hover:text-white  px-6 py-2 rounded-full ml-3"
              onClick={() =>
                // isEditingSchedule
                //   ? saveEditedSchedule()
                //   : createdScheduleId
                //   ? navigate("/myschedule")
                //   : handleSaveNewSchedule()
                saveEditedSchedule()
              }
            >
              Save
            </button>

            <button
              className="mb-3 border-2 border-lightgray bg-SlateBlue text-white hover:bg-primary hover:text-white   px-4 py-2 rounded-full ml-3"
              onClick={() => setSelectScreenModal(true)}
            >
              Assign screen
            </button>
            {selectScreenModal && (
              <ScreenAssignModal
                setAddScreenModal={setAddScreenModal}
                setSelectScreenModal={setSelectScreenModal}
                handleUpdateScreenAssign={handleUpdateScreenAssign}
                selectedScreens={selectedScreens}
                setSelectedScreens={setSelectedScreens}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSchedule;
