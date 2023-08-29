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

  // State to store repeat settings for the currently edited event
  const [currentEventRepeatSettings, setCurrentEventRepeatSettings] =
    useState(null);

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
      .get(GET_ALL_SCHEDULE)
      .then((response) => {
        const fetchedData = response.data.data;
        setScheduleAsset(response.data.data);
        if (Array.isArray(fetchedData)) {
          const fetchedEvents = fetchedData.map((item) => ({
            id: item.scheduleId,
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

  const handleSaveEvent = (eventId, eventData) => {
    console.log(eventData, "eventData");
    let data = {
      startDate: eventData.start,
      endDate: eventData.end,
      asset: eventData.asset.id,
      title: eventData.title,
      color: eventData.color,
      operation: eventId ? "Update" : "Insert",
    };

    if (eventId) {
      data.scheduleId = eventId;
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
        console.log(response.data, "update");
        const updatedEvent = {
          ...eventData,
          scheduleId: response.data.data.model.scheduleId,
          repeatSettings: currentEventRepeatSettings,
        };

        if (eventId) {
          const updatedEvents = myEvents.map((event) =>
            event.id === eventId ? updatedEvent : event
          );
          console.log(updatedEvents, "updatedEvents");
          setEvents(updatedEvents);
        } else {
          setEvents((prev) => [...prev, updatedEvent]);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedSlot(null);
    setSelectedEvent(null);
    setCurrentEventRepeatSettings(null);
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

  // Function to handle event drag and drop
  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = {
      ...event,
      start,
      end,
    };
    handleSaveEvent(updatedEvent.id, updatedEvent);
  };

  // Function to handle event resize
  const handleEventResize = ({ event, start, end }) => {
    const resizedEvent = {
      ...event,
      start,
      end,
    };
    console.log(resizedEvent, "eventeventevent");
    handleSaveEvent(resizedEvent.id, resizedEvent);
  };

  const [assetData, setAssetData] = useState([]);
  const [allAssets, setAllAssets] = useState([]);

  useEffect(() => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.images ? fetchedData.images : []),
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
                />
              </div>
              <div className=" bg-white lg:ml-5 md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 lg:mt-0 md:mt-0 sm:mt-3 xs:mt-3 ">
                <div className="p-3">
                  <span className="lg:text-lg md:text-md sm:text-sm xs:text-sm ">
                    Schedule Name
                  </span>
                </div>
                <div className="border-b-2 border-lightgray"></div>
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
                          {selectedAsset.categorieType === "Online" && (
                            <>
                              {selectedAsset.details === "Video" ? (
                                <div className="relative videobox">
                                  <video
                                    controls
                                    className="w-full rounded-2xl relative"
                                  >
                                    <source
                                      src={selectedAsset.fileType}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              ) : (
                                <div className="imagebox relative p-3">
                                  <img
                                    src={selectedAsset.fileType}
                                    className="rounded-2xl"
                                  />
                                </div>
                              )}
                            </>
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
