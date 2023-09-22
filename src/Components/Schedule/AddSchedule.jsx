import moment from "moment";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import EventEditor from "./EventEditor";
import axios from "axios";
import "../../Styles/schedule.css";
import {
  ADD_EVENT,
  GET_ALL_FILES,
  ADD_SCHEDULE,
  SCHEDULE_EVENT_SELECT_BY_ID,
  GET_TIMEZONE,
} from "../../Pages/Api";
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
  const [newScheduleNameInput, setNewScheduleNameInput] = useState("");
  const [showScheduleName, setShowScheduleName] = useState(false);
  const [createdScheduleId, setCreatedScheduleId] = useState("");
  const [searchParams] = useSearchParams();
  const getScheduleId = searchParams.get("scheduleId");
  const isEditingSchedule = !!getScheduleId;
  const getScheduleName = searchParams.get("scheduleName");
  const [editScheduleName, setEditScheduleName] = useState(getScheduleName);
  const [getTimezone, setTimezone] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState("");
  const [addedTimezoneName, setAddedTimezoneName] = useState("");

  console.log(selectedTimezoneName, "selectedTimezone");
  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedSlot({ start, end });
    setCreatePopupOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setCreatePopupOpen(true);
  }, []);

  // Function to handle saving the new schedule
  const handleSaveNewSchedule = () => {
    axios
      .post(ADD_SCHEDULE, {
        scheduleName: newScheduleNameInput,
        operation: "Insert",
      })
      .then((response) => {
        const newScheduleId = response.data.data.model.scheduleId;
        setCreatedScheduleId(newScheduleId);
        setShowScheduleName(true);
      })
      .catch((error) => {
        console.error("Error creating a new schedule:", error);
      });
  };

  const saveEditedSchedule = () => {
    let data = JSON.stringify({
      scheduleId: getScheduleId,
      scheduleName: editScheduleName,
      startDate: overallEventTimes.earliestStartTime.toLocaleString(),
      endDate: overallEventTimes.latestEndTime.toLocaleString(),
      operation: "Update",
    });
    console.log(getScheduleId, "scheduleIdscheduleIdscheduleIdscheduleId");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_SCHEDULE,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const updatedScheduleName = response.data.data.model.scheduleName;
        setEditScheduleName(updatedScheduleName);
        setShowScheduleName(true);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch events associated with the scheduleId
  const loadEventsForSchedule = (scheduleId) => {
    axios
      .get(`${SCHEDULE_EVENT_SELECT_BY_ID}?ID=${scheduleId}`)
      .then((response) => {
        const fetchedData = response.data.data;
        const previousTimezone = fetchedData.map((item) => item.timeZoneName);
        setAddedTimezoneName(previousTimezone[0]);
        console.log(previousTimezone[0], "fetchedData");
        setScheduleAsset(response.data.data);
        const fetchedEvents = fetchedData.map((item) => ({
          id: item.eventId,
          title: item.title,
          start: new Date(item.cStartDate),
          end: new Date(item.cEndDate),
          color: item.color,
          asset: item.asset,
          repeatDay: item.repeatDay,
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
    } else {
      setEvents([]);
    }
  }, [getScheduleId]);

  useEffect(() => {
    axios
      .get(GET_TIMEZONE)
      .then((response) => {
        console.log(response.data.data);
        setTimezone(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Function to handle event drag and drop
  const handleEventDrop = ({ event, start, end }) => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;
    const previousSelectedAsset = allAssets.find(
      (asset) => asset.id === event.asset
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
      (asset) => asset.id === event.asset
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

  // Function to handle saving or updating events
  const handleSaveEvent = (eventId, eventData) => {
    const scheduleIdToUse = isEditingSchedule
      ? getScheduleId
      : createdScheduleId;
    const timezoneNameToUse = isEditingSchedule
      ? addedTimezoneName
      : selectedTimezoneName;
    console.log(eventData, "eventtt");

    const data = {
      startDate: eventData.start,
      endDate: eventData.end,
      asset: eventData.asset ? eventData.asset.id : null,
      title: eventData.title,
      color: eventData.color,
      repeatDay: eventData.repeatDay,
      operation: eventId ? "Update" : "Insert",
      scheduleId: scheduleIdToUse,
      timeZoneName: timezoneNameToUse,
    };

    if (eventId) {
      data.eventId = eventId;
    }

    const config = {
      method: "post",
      url: ADD_EVENT,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data, "response");
        const updatedEvent = {
          ...eventData,
          asset: response.data.data.model.asset,
          id: eventId || response.data.data.model.eventId,
          repeatDay: response.data.data.model.repeatDay,
          timeZoneName: timezoneNameToUse,
          // cEndDate: response.data.data.eventTables.cEndDate,
          // cStartDate: response.data.data.eventTables.cStartDate,
          scheduleId: scheduleIdToUse, // Use the appropriate scheduleId
        };
        console.log(updatedEvent, "updatedEventupdatedEvent====");
        if (eventId) {
          const updatedEvents = myEvents.map((event) =>
            event.id === eventId ? updatedEvent : event
          );
          setEvents(updatedEvents);
          if (selectedEvent && selectedEvent.eventId === eventId) {
            setSelectedEvent(updatedEvent);
          }
        } else {
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

  const handleTimezoneChange = (e) => {
    if (isEditingSchedule) {
      setSelectedTimezoneName(addedTimezoneName);
    } else {
      setSelectedTimezoneName(e.target.value);
    }
  };

  return (
    <>
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className=" px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="grid grid-cols-12 mt-5">
            <div className="lg:col-span-9 md:col-span-7 sm:col-span-6 xs:col-span-12 flex items-center">
              <h1 className="text-xl font-semibold ">Create Schedule</h1>
              <button className="ml-3 text-sm">
                <BsPencilFill />
              </button>
            </div>
            <div className="lg:col-span-3 md:col-span-5 sm:col-span-6 xs:col-span-12">
              <select
                className="w-full paymentlabel relative"
                value={
                  isEditingSchedule ? addedTimezoneName : selectedTimezoneName
                }
                onChange={handleTimezoneChange}
              >
                {getTimezone.map((timezone) => (
                  <option
                    value={timezone.timeZoneName}
                    key={timezone.timeZoneId}
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
            <div className=" bg-white lg:ml-5 md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-4 sm:col-span-12 xs:col-span-12 lg:mt-0 md:mt-0 sm:mt-3 xs:mt-3 ">
              <div className="flex justify-center my-3 text-black font-semibold text-xl">
                Schedule Name
              </div>

              {isEditingSchedule ? (
                <>
                  {showScheduleName ? (
                    <h1 className="flex justify-center text-3xl">
                      {editScheduleName}
                    </h1>
                  ) : (
                    <div className="flex justify-center items-center px-5">
                      <input
                        type="text"
                        className="w-full border border-primary rounded-md px-2 py-1"
                        value={editScheduleName}
                        onChange={(e) => setEditScheduleName(e.target.value)}
                      />
                      <button
                        className="text-black px-2 py-1 rounded border border-primary ml-1"
                        onClick={saveEditedSchedule}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {showScheduleName ? (
                    <h1 className="flex justify-center text-3xl">
                      {newScheduleNameInput}
                    </h1>
                  ) : (
                    <div className="flex justify-center items-center px-5">
                      <input
                        type="text"
                        className="w-full border border-primary rounded-md px-2 py-1"
                        placeholder="Enter schedule name"
                        value={newScheduleNameInput}
                        onChange={(e) =>
                          setNewScheduleNameInput(e.target.value)
                        }
                      />
                      <button
                        className="text-black px-2 py-1 rounded border border-primary ml-1"
                        onClick={handleSaveNewSchedule}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </>
              )}

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
                            Array.isArray(scheduleAsset) // Check if scheduleAsset is an array
                              ? scheduleAsset.map((asset) => asset.asset)
                              : [scheduleAsset] // Convert to an array with a single item
                          )
                        ).map((uniqueId, index) => {
                          // Find the asset with the uniqueId in allAssets
                          const foundAsset = allAssets.find(
                            (asset) => asset.id === uniqueId
                          );

                          if (foundAsset) {
                            return (
                              <option key={index} value={foundAsset.name}>
                                {foundAsset.name}
                              </option>
                            );
                          }

                          return null; // Handle the case where no asset is found with the id
                        })}
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
            <Link to="/myschedule">
              <button className="mb-3 border-2 border-gray bg-lightgray hover:bg-primary hover:text-white  px-6 py-2 rounded-full ml-3">
                Save
              </button>
            </Link>
            <button
              className="mb-3 border-2 border-lightgray bg-SlateBlue text-white hover:bg-primary hover:text-white   px-4 py-2 rounded-full ml-3"
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
    </>
  );
};

export default AddSchedule;
