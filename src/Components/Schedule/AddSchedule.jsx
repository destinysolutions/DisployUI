import moment from "moment";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import EventEditor from "./EventEditor";
import axios from "axios";
import "../../Styles/schedule.css";
import { ADD_SCHEDULE, GET_ALL_FILES, GET_ALL_SCHEDULE } from "../../Pages/Api";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import SaveAssignScreenModal from "./SaveAssignScreenModal";
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const AddSchedule = ({ sidebarOpen, setSidebarOpen }) => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  const [myEvents, setEvents] = useState([]);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [scheduleAsset, setScheduleAsset] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [allSchedule, setAllSchedule] = useState([]);
  const [selectedScheduleName, setSelectedScheduleName] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isCreatingNewSchedule, setIsCreatingNewSchedule] = useState(false);
  const [newScheduleNameInput, setNewScheduleNameInput] = useState("");

  // Function to start editing an existing schedule
  const startEditingSchedule = () => {
    setIsEditingSchedule(true);
  };
  const handleScheduleNameChange = (event) => {
    const selectedScheduleName = event.target.value;
    //console.log(selectedScheduleName, "selectedScheduleName");

    // Find the selected schedule by name and retrieve its ID
    const selectedSchedule = allSchedule.find(
      (schedule) => schedule.scheduleName === selectedScheduleName
    );
    console.log(selectedSchedule, "selectedScheduleselectedSchedule");
    if (selectedSchedule) {
      const selectedScheduleId = selectedSchedule.scheduleId;
      setSelectedScheduleName(selectedScheduleName);
      setSelectedScheduleId(selectedScheduleId);
      //console.log(selectedScheduleId, "selectedScheduleId");
    }
  };
  // Function to save changes when editing an existing schedule
  const saveEditedSchedule = () => {
    //debugger;
    console.log(selectedScheduleId, "selectedScheduleIdselectedScheduleId");
    let data = JSON.stringify({
      scheduleId: 17,
      scheduleName: selectedScheduleName,
      // "screenAssigned": "string",
      // "tags": "string",
      // "startDate": "2023-09-13T12:47:34.476Z",
      // "endDate": "2023-09-13T12:47:34.476Z",
      // "createdDate": "2023-09-13T12:47:34.476Z",
      operation: "Update",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://192.168.1.219/api/Schedule/AddSchedule",
      headers: {
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
    setIsEditingSchedule(false); // Exit edit mode
  };

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
      .get("http://192.168.1.219/api/Schedule/GetAllSchedule")
      .then((response) => {
        const fetchedData = response.data.data;
        setAllSchedule(fetchedData);
        console.log(fetchedData, "fetchedData");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCreateNewSchedule = (e) => {
    //setIsCreatingNewSchedule(true);
    setNewScheduleNameInput(e.target.value);
  };

  // Function to handle saving the new schedule
  const handleSaveNewSchedule = () => {
    // Check if the entered schedule name is not empty
    if (newScheduleNameInput.trim() !== "") {
      axios
        .post("http://192.168.1.219/api/Schedule/AddSchedule", {
          scheduleName: newScheduleNameInput,
          startDate: dayStartTime,
          endDate: dayEndTime,
          operation: "Insert",
        })
        .then((response) => {
          const newScheduleId = response.data.data.model.scheduleId;
          setSelectedScheduleName(response.data.data.model.scheduleName);
          setSelectedScheduleId(newScheduleId);
          setAllSchedule([...allSchedule, response.data.data.model]);
          setNewScheduleNameInput("");
          setIsCreatingNewSchedule(false);
        })
        .catch((error) => {
          console.error("Error creating a new schedule:", error);
        });
    } else {
      // Handle the case where the user entered an empty schedule name or canceled
      // You can display an error message or take appropriate action
    }
  };

  useEffect(() => {
    axios
      .get(GET_ALL_SCHEDULE)
      .then((response) => {
        const fetchedData = response.data.data;
        setScheduleAsset(response.data.data);
        if (Array.isArray(fetchedData)) {
          const fetchedEvents = fetchedData.map((item) => ({
            id: item.eventId,
            title: item.title,
            start: new Date(item.startDate),
            end: new Date(item.endDate),
            color: item.color,
            asset: item.asset,
          }));

          setEvents(fetchedEvents);
        } else {
          console.log("Fetched data is not an array:", fetchedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Function to handle event drag and drop
  const handleEventDrop = ({ event, start, end }) => {
    const previousSelectedAsset = allAssets.find(
      (asset) => asset.id === event.asset
    );

    const updatedEventData = {
      ...event,
      start,
      end,
      asset: previousSelectedAsset,
    };
    handleSaveEvent(updatedEventData.id, updatedEventData);
  };

  // Function to handle event resize
  const handleEventResize = ({ event, start, end }) => {
    const previousSelectedAsset = allAssets.find(
      (asset) => asset.id === event.asset
    );
    const resizedEvent = {
      ...event,
      start,
      end,
      asset: previousSelectedAsset,
    };
    handleSaveEvent(resizedEvent.id, resizedEvent);
  };

  // Function to handle saving or updating events
  const handleSaveEvent = (eventId, eventData) => {
    let data = {
      startDate: eventData.start,
      endDate: eventData.end,
      asset: eventData.asset.id,
      title: eventData.title,
      color: eventData.color,
      repeatDay: eventData.repeatDay,
      operation: eventId ? "Update" : "Insert",
      //scheduleName: selectedScheduleId,
    };
    if (eventId) {
      data.eventId = eventId;
    }

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
        console.log(response.data, "response");
        const updatedEvent = {
          ...eventData,
          asset: response.data.data.model.asset,
          id: eventId || response.data.data.model.eventId,
          repeatDay: response.data.data.model.repeatDay,
          //scheduleName: response.data.data.model.scheduleName,
        };
        console.log(updatedEvent, "updatedEventupdatedEvent====");
        if (eventId) {
          // Update the event with the provided eventId
          const updatedEvents = myEvents.map((event) =>
            event.id === eventId ? updatedEvent : event
          );
          setEvents(updatedEvents);
          console.log(updatedEvents, "updatedEvents====");
          // If this is the selectedEvent, update it as well
          if (selectedEvent && selectedEvent.eventId === eventId) {
            console.log(selectedEvent, "selectedEvent====");
            setSelectedEvent(updatedEvent);
          }
          console.log(selectedEvent, "selectedEvent====");
        } else {
          // Insert the new event into myEvents

          setEvents((prev) => [...prev, updatedEvent]);
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

  useEffect(() => {
    axios
      .get(GET_ALL_FILES)
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

  const handleAssetChange = (event) => {
    const selectedName = event.target.value;
    const selectedAsset = assetData.find((item) => item.name === selectedName);
    setSelectedAsset(selectedAsset);
  };

  const getEarliestStartTime = (events) => {
    if (events.length === 0) return null;
    return events.reduce((earliest, event) => {
      return event.start < earliest ? event.start : earliest;
    }, events[0].start);
  };

  const getLatestEndTime = (events) => {
    if (events.length === 0) return null;
    return events.reduce((latest, event) => {
      return event.end > latest ? event.end : latest;
    }, events[0].end);
  };

  const today = new Date();
  const eventsForToday = myEvents.filter((event) =>
    moment(event.start).isSame(today, "day")
  );
  const getDayEventTimes = (events, selectedDate) => {
    const eventsForSelectedDay = events.filter(
      (event) =>
        moment(event.start).isSame(selectedDate, "day") ||
        moment(event.end).isSame(selectedDate, "day")
    );

    const earliestStartTime = getEarliestStartTime(eventsForSelectedDay);
    const latestEndTime = getLatestEndTime(eventsForSelectedDay);

    return {
      earliestStartTime,
      latestEndTime,
    };
  };
  const dayStartTime = getDayEventTimes(
    eventsForToday,
    today
  ).earliestStartTime;
  const dayEndTime = getDayEventTimes(eventsForToday, today).latestEndTime;

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className=" px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <div className="">
            <div className="flex justify-between">
              <div className="flex items-center mt-5">
                <h1 className="text-xl font-semibold ">Create Schedule</h1>
                <button className="ml-3 text-sm">
                  <BsPencilFill />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-5">
              <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 ">
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
              <div className=" bg-white lg:ml-5 md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 lg:mt-0 md:mt-0 sm:mt-3 xs:mt-3 ">
                <div className="p-3">schedule Name</div>

                <div className="px-3">
                  {isCreatingNewSchedule ? (
                    <div>
                      <input
                        type="text"
                        className="w-full paymentlabel relative border border-gray-300 rounded-md px-2 py-1"
                        placeholder="Enter new schedule name"
                        value={newScheduleNameInput}
                        onChange={handleCreateNewSchedule}
                      />
                      <button
                        className="text-black px-2 py-1 rounded border border-primary mt-3 ml-1"
                        onClick={handleSaveNewSchedule}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      {selectedScheduleName ? (
                        <div>
                          <input
                            type="text"
                            className="w-full paymentlabel relative border border-gray-300 rounded-md px-2 py-1 mt-3"
                            value={selectedScheduleName}
                            onChange={(e) =>
                              setSelectedScheduleName(e.target.value)
                            }
                          />
                          <button
                            className="text-black px-2 py-1 rounded border border-primary mt-3 ml-2"
                            onClick={saveEditedSchedule}
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <select
                          className="w-full paymentlabel relative"
                          // onChange={(e) => {
                          //   const selectedValue = e.target.value;
                          //   if (selectedValue === "") {
                          //     // If an empty option is selected, enter create mode
                          //     setIsCreatingNewSchedule(true);
                          //   } else {
                          //     // Otherwise, enter edit mode with  the selected value
                          //     setIsCreatingNewSchedule(false);
                          //     setSelectedScheduleName(selectedValue); // Update the selected schedule name
                          //   }
                          // }}
                          onChange={handleScheduleNameChange}
                          value={selectedScheduleName}
                        >
                          <option value="">Select a schedule Name</option>
                          {allSchedule.map((schedule) => (
                            <option
                              value={schedule.scheduleName}
                              key={schedule.scheduleId}
                            >
                              {schedule.scheduleName}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        className="text-black px-2 py-1 rounded border border-primary mt-3 ml-2"
                        onClick={() => setIsCreatingNewSchedule(true)}
                      >
                        Create New
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-b-2 border-lightgray mt-3"></div>
                <div className="p-3">
                  <div className="mb-2">Schedule Date time</div>
                  <div>
                    <ul className="border-2 border-lightgray">
                      <li className="border-b-2 border-lightgray p-3">
                        <h3>Start Date & Time:</h3>
                        <div className="bg-lightgray rounded-full px-3 py-2 mt-2">
                          {dayStartTime?.toLocaleString()}
                        </div>
                      </li>
                      <li className="border-b-2 border-lightgray p-3">
                        <h3>End Date & Time:</h3>
                        <div className="bg-lightgray rounded-full px-3 py-2 mt-2">
                          {dayEndTime?.toLocaleString()}
                        </div>
                      </li>
                      <li className="p-3">
                        <select
                          className="w-full paymentlabel relative"
                          onChange={handleAssetChange}
                        >
                          <option value="">Select an asset</option>
                          {scheduleAsset
                            .filter(
                              (asset, index, self) =>
                                self.findIndex((a) => a.id === asset.id) ===
                                index
                            )
                            .map((asset) => (
                              <option key={asset.id} value={asset.name}>
                                {asset.name}
                              </option>
                            ))}
                        </select>
                      </li>

                      {selectedAsset && (
                        <>
                          {selectedAsset.categorieType === "OnlineImage" && (
                            <img
                              src={selectedAsset.fileType}
                              alt={selectedAsset.name}
                              className="imagebox relative"
                            />
                          )}
                          {selectedAsset.categorieType === "OnlineVideo" && (
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
                          {selectedAsset.categorieType === "Image" && (
                            <img
                              src={selectedAsset.fileType}
                              alt={selectedAsset.name}
                              className="imagebox relative"
                            />
                          )}
                          {selectedAsset.categorieType === "Video" && (
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
                          {selectedAsset.categorieType === "DOC" && (
                            <a
                              href={selectedAsset.fileType}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {selectedAsset.name}
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
                        No Associated Assets. Start by selecting a date & time
                        on the calendar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <Link to="/myschedule">
                <button className="border-2 border-gray bg-lightgray hover:bg-primary hover:text-white  px-5 py-2 rounded-full">
                  Cancel
                </button>{" "}
              </Link>
              <Link to="/myschedule">
                <button className="border-2 border-gray bg-lightgray hover:bg-primary hover:text-white  px-6 py-2 rounded-full ml-3">
                  Save
                </button>
              </Link>
              <button
                className="border-2 border-lightgray bg-SlateBlue text-white hover:bg-primary hover:text-white   px-4 py-2 rounded-full ml-3"
                onClick={() => setSelectScreenModal(true)}
              >
                Save & Assign screen
              </button>
              {selectScreenModal && (
                <SaveAssignScreenModal
                  setSelectScreenModal={setSelectScreenModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSchedule;
