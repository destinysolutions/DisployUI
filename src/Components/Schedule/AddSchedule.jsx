import moment from "moment/moment";
import { useState } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import { BsPencilFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import EventEditor from "./EventEditor";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);
const AddSchedule = () => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const events = [
    {
      title: "Event 1",
      start: new Date(),
      end: new Date(),
    },
    {
      title: "Event 2",
      start: new Date(),
      end: new Date(),
    },
    // Add more events as needed
  ];
  const [myEvents, setEvents] = useState(events);
  const [isCreatePopupOpen, setCreatePopupOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedSlot({ start, end });
    setCreatePopupOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setCreatePopupOpen(true);
  }, []);

  const handleCreateEvent = (eventData) => {
    // Save the event data to your events list
    const newEvent = { ...eventData, id: Math.random() }; // Add a unique id to the new event
    setEvents((prev) => [...prev, newEvent]);
    setSelectedSlot(null);
    setSelectedEvent(null);
    setCreatePopupOpen(false);
  };


  const handleCloseCreatePopup = () => {
    setSelectedSlot(null);
    setSelectedEvent(null);
    setCreatePopupOpen(false);
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
              defaultView={Views.DAY}
              events={myEvents}
              localizer={localizer}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
            />
            <EventEditor
              isOpen={isCreatePopupOpen}
              onClose={handleCloseCreatePopup}
              onSave={handleCreateEvent}
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
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>End Date & Time:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
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
