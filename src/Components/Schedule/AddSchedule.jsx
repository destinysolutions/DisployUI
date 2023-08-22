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
import { GET_ALL_FILES } from "../../Pages/Api";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const AddSchedule = () => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const events = [
    {
      id: 1,
      title: "Event 1",
      start: new Date(),
      end: new Date(),
      color: "#ff5722",
      asset: null,
    },
    {
      id: 2,
      title: "Event 2",
      start: new Date(),
      end: new Date(),
      color: "#e91e63",
      asset: null,
    },
    {
      id: 3,
      title: "Long Event",
      start: new Date(2023, 7, 16, 10),
      end: new Date(2023, 7, 16, 12),
      color: "#e91e63",
      asset: null,
    },
  ];

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

  const [myEvents, setEvents] = useState(events);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

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

  const handleCreateEvent = (eventId, eventData) => {
    if (eventId === null) {
      // Creating a new event with repeat settings
      const newEvent = {
        ...eventData,
        id: Math.random(),
        repeatSettings: currentEventRepeatSettings,
      };
      setEvents((prev) => [...prev, newEvent]);
    } else {
      // Updating an existing event with repeat settings
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? {
                ...event,
                ...eventData,
                repeatSettings: currentEventRepeatSettings,
              }
            : event
        )
      );
    }
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

  const updateEvent = (data) => {
    const allEvents = [...events];
    let index = allEvents.findIndex((event) => event.id === data.id);
    allEvents.splice(index, 1, data);
    setEvents([...allEvents]);
  };

  // Function to handle event drag and drop
  const handleEventDrop = ({ event, start, end }) => {
    const data = {
      ...event,
      start,
      end,
    };
    updateEvent(data);
  };

  // Function to handle event resize
  const handleEventResize = ({ event, start, end }) => {
    // Create a new event with the updated start and end times
    const resizedEvent = {
      ...event,
      start,
      end,
    };
    updateEvent(resizedEvent);
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
    console.log(selectedName);
    setSelectedAsset(selectedAsset);

    if (selectedEvent) {
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        asset: selectedAsset,
      }));
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex items-center mt-5">
            <h1 className="text-xl font-semibold">Create Schedule</h1>
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
              onSave={handleCreateEvent}
              onDelete={handleEventDelete}
              selectedSlot={selectedSlot}
              selectedEvent={selectedEvent}
              assetData={assetData}
              setAssetData={setAssetData}
              allAssets={allAssets}
              setSelectedEvent={setSelectedEvent}
              //handleAssetChange={handleAssetChange}
              // setSelectedAsset={setSelectedAsset}
              // selectedAsset={selectedAsset}
            />
          </div>
          <div className=" bg-white shadow-2xl lg:ml-5 md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 lg:mt-0 md:mt-0 sm:mt-3 xs:mt-3 ">
            <div className="p-3">
              <span className="text-xl">Schedule Name</span>
            </div>
            <div className="border-b-2 border-[#D5E3FF]"></div>
            <div className="p-3">
              <div className="mb-2">Schedule Date time</div>
              <div>
                <ul className="border-2 border-[#D5E3FF] rounded">
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>Start Date & Time:</h3>
                    <div className="bg-lightgray rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>End Date & Time:</h3>
                    <div className="bg-lightgray rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className="p-3">
                    <select className="w-full" onChange={handleAssetChange}>
                      <option value="">Select an asset</option>
                      {assetData.map((asset) => (
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
                    No Associated Assets. Start by selecting a date & time on
                    the calendar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <Link to="/myschedule">
            <button className="border-2 border-primary  px-5 py-2 rounded-full">
              Cancel
            </button>{" "}
          </Link>
          <Link to="/myschedule">
            <button className="border-2 border-primary  px-6 py-2 rounded-full ml-3">
              Save
            </button>
          </Link>
          <button
            className="border-2 border-primary  px-4 py-2 rounded-full ml-3"
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
    </>
  );
};

export default AddSchedule;
