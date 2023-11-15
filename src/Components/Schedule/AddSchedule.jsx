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
import { MdOutlineGroups } from "react-icons/md";
import { useSelector } from "react-redux";
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const AddSchedule = ({ sidebarOpen, setSidebarOpen }) => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);

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
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [scheduleMessageVisible, setScheduleMessageVisible] = useState(false);
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
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [getTimezone, setTimezone] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState();

  const addedTimezoneName = searchParams.get("timeZoneName");
  const selectedScreenIdsString = selectedScreens.join(",");

  const navigate = useNavigate();

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedSlot({ start, end });
    setCreatePopupOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setCreatePopupOpen(true);
  }, []);

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
  }, []);

  useEffect(() => {
    axios
      .get(GET_ALL_FILES, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(allAssets);
        setAllAssets(allAssets);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //socket signal-RRR
  // const [connection, setConnection] = useState(null);
  // const [fileType, setFileType] = useState();
  // useEffect(() => {
  //   const newConnection = new HubConnectionBuilder()
  //     .withUrl(SIGNAL_R)
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //   newConnection.on("ReceiveMessage", (endDate, startDate, type) => {
  //     console.log("end date", endDate);
  //     console.log("start date:", startDate);
  //     console.log("asset:", type);
  //   });

  //   newConnection
  //     .start()
  //     .then(() => {
  //       console.log("Connection established");
  //       setConnection(newConnection);
  //     })
  //     .catch((error) => {
  //       console.error("Error starting connection:", error);
  //     });

  //   return () => {
  //     if (newConnection) {
  //       newConnection
  //         .stop()
  //         .then(() => {
  //           console.log("Connection stopped");
  //         })
  //         .catch((error) => {
  //           console.error("Error stopping connection:", error);
  //         });
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: UPDATED_SCHEDULE_DATA,
  //     headers: {},
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(response.data, "response.data[0]");
  //       if (
  //         Array.isArray(response.data.data) &&
  //         response.data.data.length > 0
  //       ) {
  //         const { cEndDate, cStartDate, fileType } = response.data.data[0];
  //         setFileType(fileType);
  //         if (connection) {
  //           // Send the API response to SignalR when the connection is established
  //           connection
  //             .invoke("SendMessage", cEndDate, cStartDate, fileType)
  //             .then(() => {
  //               console.log("Message sent:", cEndDate, cStartDate, fileType);
  //             })
  //             .catch((error) => {
  //               console.error("Error sending message:", error);
  //             });
  //         } else {
  //           console.warn("Connection is not established yet.");
  //         }
  //       } else {
  //         console.warn("No data in the response");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [connection]);

  useEffect(() => {
    if (getScheduleId) {
      loadEventsForSchedule(getScheduleId);
    }
  }, [getScheduleId, myEvents]);

  const handleTimezoneSelect = (e) => {
    if (e.target.value != selectedTimezoneName && isEditingSchedule) {
      alert("change");
      setSelectedTimezoneName(e.target.value);
      handleTimezone(e.target.value);
    } else {
      setSelectedTimezoneName(e.target.value);
      handleTimezone(e.target.value);
    }
  };

  const handleTimezone = (timezonename) => {
    console.log(timezonename);
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;

    let data = JSON.stringify({
      scheduleId: scheduleIdToUse,
      timeZoneName: timezonename,
      userID: 0,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: UPDATE_TIMEZONE,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle saving the new schedule
  // const handleSaveNewSchedule = () => {
  //   axios
  //     .post(
  //       ADD_SCHEDULE,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       },
  //       {
  //         scheduleName: newScheduleNameInput,
  //         timeZoneName: selectedTimezoneName,
  //         screenAssigned: selectedScreenIdsString,
  //         operation: "Insert",
  //       }
  //     )
  //     .then((response) => {
  //       const newScheduleId = response.data.data.model.scheduleId;
  //       setCreatedScheduleId(newScheduleId);
  //       console.log(response.data);
  //       return newScheduleId;
  //     })
  //     .catch((error) => {
  //       console.error("Error creating a new schedule:", error);
  //     });
  // };

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
          navigate("/myschedule");
        }
      })
      .catch((error) => {
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
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Function to handle event drag and drop
  const handleEventDrop = ({ event, start, end }) => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;
    const previousSelectedAsset = allAssets.find(
      (asset) => asset.assetID === event.asset
    );
    console.log("previousSelectedAsset", previousSelectedAsset);
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
        // console.log("event data : ", fetchedData);
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
  // console.log(selectedEvent?.isfutureDateExists, "selectdfg");
  //   useEffect(()=>{
  // if(selectedEvent?.isfutureDateExists == 1){
  //   console.log('yes');
  // }
  //   },[])
  const handleSaveEvent = (eventId, eventData, updateAllValue) => {
    // debugger;
    console.log(updateAllValue, "eventData");
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;

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

    if (data.asset === null) {
      let messge = "Please Select Asset";
      setScheduleMessage(messge);
      setScheduleMessageVisible(true);
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
        const fetchedData = response.data.data.eventTables;
        console.log(fetchedData, "fetchedData");
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
        console.log(updateEvent, "updateEvent");
        // // Sending a SignalR message for the updated event
        // if (eventId) {
        //   const updatedEvent = fetchedData.find(
        //     (event) => event.eventId === eventId
        //   );
        //   if (updatedEvent && connection) {
        //     connection
        //       .invoke(
        //         "SendMessage",
        //         updatedEvent.cEndDate,
        //         updatedEvent.cStartDate,
        //         fileType
        //       )
        //       .then(() => {
        //         console.log("SignalR message sent for updated event");
        //       })
        //       .catch((error) => {
        //         console.error("Error sending SignalR message:", error);
        //       });
        //   }
        // }
        if (eventId) {
          const updatedEventsMap = Object.fromEntries(
            updateEvent.map((event) => [event.id, event])
          );
          const updatedMyEvents = myEvents.map((event) => {
            const updatedEvent = updatedEventsMap[event.id];
            return updatedEvent ? { ...event, ...updatedEvent } : event;
          });

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
      })
      .catch((error) => {
        console.log(error);
      });
    setSelectedSlot(null);
    setSelectedEvent(null);
    setCreatePopupOpen(false);
  };

  const handleCloseCreatePopup = () => {
    setSelectedSlot(null);
    setSelectedEvent(null);
    setCreatePopupOpen(false);
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
    const selectedAsset = assetData.find((item) => item.name === selectedName);
    setSelectedAsset(selectedAsset);
  };

  useEffect(() => {
    if (UserData.user?.userID) {
      axios
        .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${UserData.user?.userID}`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          const fetchedData = response.data.data;
          console.log(fetchedData, "dsdsdsdsds");
          setScreenData(fetchedData);
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
  }, [UserData.user?.userID]);

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

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {scheduleMessageVisible && (
        <div
          className="bg-[#fff2cd] px-5 py-3 border-b-2 border-SlateBlue shadow-md"
          style={{
            position: "fixed",
            top: "16px",
            right: "20px",
            zIndex: "999999",
          }}
        >
          <div className="flex text-SlateBlue  text-base font-normal items-center relative">
            <BsFillInfoCircleFill className="mr-1" />
            {scheduleMessage}
            <button
              className="absolute top-[-26px] right-[-26px] bg-white rounded-full p-1 "
              onClick={() => setScheduleMessageVisible(false)}
            >
              <AiOutlineClose className="text-xl  text-SlateBlue " />
            </button>
          </div>
        </div>
      )}

      <div className=" px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="grid grid-cols-12 mt-5">
            <div className="lg:col-span-9 md:col-span-7 sm:col-span-6 xs:col-span-12 flex items-center">
              <h1 className="text-xl font-semibold ">Create Schedule</h1>
              <button className="ml-3 text-sm">
                <BsPencilFill />
              </button>
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
                setSelectedEvent={setSelectedEvent}
                handleAssetChange={handleAssetChange}
                scheduleAsset={scheduleAsset}
              />
            </div>
            <div className=" bg-white lg:ml-5 md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-5 sm:col-span-12 xs:col-span-12 lg:mt-0 md:mt-0 sm:mt-3 xs:mt-3 ">
              <div className="flex justify-center my-3 text-black font-semibold text-xl">
                Schedule Name
              </div>

              <div className="flex justify-center items-center px-5">
                <input
                  type="text"
                  className="w-full border border-primary rounded-md px-2 py-1"
                  placeholder="Enter schedule name"
                  value={newScheduleNameInput}
                  onChange={(e) => setNewScheduleNameInput(e.target.value)}
                />
              </div>

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
                      </div>
                    </li>
                    <li className="border-b-2 border-lightgray p-3">
                      <h3>End Date & Time:</h3>
                      <div className="bg-lightgray rounded-full px-3 py-2 mt-2">
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
                              <option key={index} value={foundAsset.name}>
                                {foundAsset.name}
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
                            src={selectedAsset.fileType}
                            alt={selectedAsset.name}
                            className="imagebox relative"
                          />
                        )}
                        {selectedAsset.assetType === "OnlineVideo" && (
                          <video
                            controls
                            className="w-full rounded-2xl relative h-56"
                          >
                            <source
                              src={selectedAsset.fileType}
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
              Save & Assign screen
            </button>
            {selectScreenModal && (
              <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                      <div className="flex items-center">
                        <div className=" mt-1.5">
                          <input
                            type="checkbox"
                            className="w-5 h-5"
                            onChange={handleSelectAllCheckboxChange}
                            checked={selectAllChecked}
                          />
                        </div>
                        <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium ml-3">
                          All Select
                        </h3>
                      </div>
                      <button
                        className="p-1 text-xl"
                        onClick={() => setSelectScreenModal(false)}
                      >
                        <AiOutlineCloseCircle className="text-2xl" />
                      </button>
                    </div>
                    <div className="overflow-x-auto p-4">
                      <table className="mt-9 w-full sm:mt-3">
                        <thead>
                          <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left ">
                            <th className="text-[#444] text-sm font-semibold p-2">
                              <button className=" flex  items-center justify-center px-6 py-2">
                                <SlScreenDesktop className="mr-2" />
                                Screen
                              </button>
                            </th>
                            <th className="text-[#444] text-sm font-semibold p-2">
                              <button className=" flex  items-center justify-center px-6 py-2">
                                <SlCalender className="mr-2" />
                                status
                                <BiFilterAlt className="ml-1 text-xs" />
                              </button>
                            </th>
                            <th className="text-[#444] text-sm font-semibold p-2">
                              <button className=" flex  items-center justify-center px-6 py-2">
                                <HiOutlineLocationMarker className="mr-2 text-xl" />
                                Google Location
                              </button>
                            </th>
                            <th className="text-[#444] text-sm font-semibold p-2">
                              <button className=" px-6 py-2 flex  items-center justify-center">
                                <SlCalender className="mr-2" />
                                associated Schedule
                              </button>
                            </th>
                            <th className="text-[#444] text-sm font-semibold p-2">
                              <button className=" px-6 py-2 flex  items-center justify-center">
                                <BsTags className="mr-2" />
                                Tags
                                <BiFilterAlt className="ml-1 text-xs" />
                              </button>
                            </th>
                            <th className="text-[#444] text-sm font-semibold p-2">
                              <button className=" flex  items-center justify-center px-6 py-2">
                                <MdOutlineGroups className="mr-2 text-lg" />
                                Group
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(screenData) &&
                            screenData.map((screen) => (
                              <tr
                                key={screen.screenID}
                                className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2"
                              >
                                <td className="flex items-center ">
                                  <input
                                    type="checkbox"
                                    className="mr-3"
                                    onChange={() =>
                                      handleScreenCheckboxChange(
                                        screen.screenID
                                      )
                                    }
                                    checked={screenCheckboxes[screen.screenID]}
                                  />
                                  <div>
                                    <div> {screen.screenName}</div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                                    Live
                                  </button>
                                </td>
                                <td className="p-2 break-words w-[180px]">
                                  {screen.googleLocation}
                                </td>

                                <td className="break-words w-[150px] p-2">
                                  Schedule Name Till 28 June 2023
                                </td>
                                <td className="p-2">{screen.tags}</td>
                                <td className="p-2">Group Name</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="py-4 flex justify-center">
                      <button
                        className="border-2 border-primary px-5 py-2 rounded-full ml-3"
                        onClick={() => {
                          setSelectScreenModal(false);
                          handleUpdateScreenAssign();
                        }}
                      >
                        Save
                      </button>
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

export default AddSchedule;
