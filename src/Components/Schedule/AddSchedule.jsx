import moment from "moment";
import { useState } from "react";
import { useCallback } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventEditor from "./EventEditor";

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
    },
    {
      id: 2,
      title: "Event 2",
      start: new Date(),
      end: new Date(),
      color: "#e91e63",
    },
    {
      id: 3,
      title: "Long Event",
      start: new Date(2023, 7, 4, 10),
      end: new Date(2023, 7, 4, 12),
      color: "#e91e63",
    },
  ];

  const eventStyleGetter = (event, start, end, isSelected) => {
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
    setCurrentEventRepeatSettings(null); // Reset repeat settings after save
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
    const updatedEvent = { ...event, start, end };
    setEvents((prev) =>
      prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  };

  // Function to handle event resize
  const handleEventResize = ({ event, start, end }) => {
    // Update the event's start and end times after resizing
    const updatedEvent = { ...event, start, end };
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
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
              onEventDrop={handleEventDrop}
              resizable
              onEventResize={handleEventResize}
              defaultView={Views.DAY}
              startAccessor="start"
              endAccessor="end"
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
                    <select className="w-full">
                      <option>Associated Assets</option>
                      <option> Assets Name 1</option>
                      <option> Assets Name 2</option>
                      <option> Assets Name 3</option>
                    </select>
                  </li>
                </ul>
              </div>
              <div className="flex mt-4">
                <div className="mt-1">
                  <button>
                    <IoArrowBackOutline />
                  </button>
                </div>
                <p className="mx-3">
                  No Associated Assets start by select date & time on calendar.
                </p>
              </div>
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
