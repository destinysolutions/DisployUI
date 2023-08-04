import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { AiOutlineSearch } from "react-icons/ai";
import { BsTags } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { MdDateRange, MdOutlinePermMedia } from "react-icons/md";
import { VscCompass } from "react-icons/vsc";
import ReactModal from "react-modal";
import RepeatSettings from "./RepeatSettings.JSX";
const EventEditor = ({
  isOpen,
  onClose,
  onSave,
  selectedEvent,
  selectedSlot,
  onDelete
}) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4A90E2");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");

  // Listen for changes in selectedEvent and selectedSlot to update the title and date/time fields
  useEffect(() => {
    if (isOpen && selectedEvent) {
      setTitle(selectedEvent.title);
      setEditedStartDate(formatDate(selectedEvent.start));
      setEditedStartTime(formatTime(selectedEvent.start));
      setEditedEndDate(formatDate(selectedEvent.end));
      setEditedEndTime(formatTime(selectedEvent.end));
    } else if (isOpen && selectedSlot) {
      setTitle("");
      setEditedStartDate(formatDate(selectedSlot.start));
      setEditedStartTime(formatTime(selectedSlot.start));
      setEditedEndDate(formatDate(selectedSlot.end));
      setEditedEndTime(formatTime(selectedSlot.end));
    }
  }, [isOpen, selectedEvent, selectedSlot]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setEditedStartDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setEditedStartTime(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEditedEndDate(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEditedEndTime(e.target.value);
  };

  // State to keep track of repeat settings modal
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);

  const handleOpenRepeatSettings = () => {
    setShowRepeatSettings(true);
  };

  // State to store the repeat settings data
  const [currentEventRepeatSettings, setCurrentEventRepeatSettings] =
    useState(null);

  // Function to handle saving repeat settings
  const handleSaveRepeatSettings = (repeatSettingsData) => {
    // Save the repeat settings data to state
    setCurrentEventRepeatSettings(repeatSettingsData);
    // Close the repeat settings modal
    setShowRepeatSettings(false);
  };

  const handleSave = () => {
    // Convert edited dates and times to actual Date objects
    const start = new Date(editedStartDate + " " + editedStartTime);
    const end = new Date(editedEndDate + " " + editedEndTime);

    // Perform validation and create the new event data
    const eventData = {
      title: title,
      start: start,
      end: end,
      color: selectedColor,
    };

    // Check if the selected event is present and has the same data as the form data
    if (
      selectedEvent &&
      selectedEvent.title === title &&
      selectedEvent.start.getTime() === start.getTime() &&
      selectedEvent.end.getTime() === end.getTime()
    ) {
      // If the data is the same, simply close the modal without creating/updating a new event
      onClose();
    } else {
      // If selectedEvent is present, it means we are editing an existing event
      if (selectedEvent) {
        // Call the onSave function with the selectedEvent's id and the updated eventData
        onSave(selectedEvent.id, eventData);
      } else {
        // Otherwise, we are creating a new event, so call the onSave function with null as id
        onSave(null, eventData);
      }
      onClose();
    }
  };

  // Create a variable to check if the modal is in "edit" mode
  const isEditMode = !!selectedEvent;
  const handleDelete = () => {
    if (selectedEvent && selectedEvent.id) {
      onDelete(selectedEvent.id);
      onClose(); // Close the modal after deleting the event.
    }
  };

  // Helper functions to format dates and times
  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Event Create Popup"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="px-5">
          <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
            Select Assets and Shedule Time
          </h1>

          <div className="grid grid-cols-12 my-6">
            <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 bg-white shadow-2xl rounded-lg p-4">
              <div className="mr-5 relative sm:mr-0">
                <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                <input
                  type="text"
                  placeholder=" Search by Name"
                  className="border border-primary rounded-full px-7 py-2 search-user"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="mt-9 w-full sm:mt-3">
                  <thead>
                    <tr className="flex justify-between items-center">
                      <th className="p-3 font-medium text-[14px]">
                        <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                          <MdOutlinePermMedia className="mr-2 text-xl" />
                          Assets
                        </button>
                      </th>
                      <th className="p-3 font-medium text-[14px]">
                        <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                          <MdDateRange className="mr-2 text-xl" />
                          Date Added
                        </button>
                      </th>
                      <th className="p-3 font-medium text-[14px]">
                        <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                          <GrSchedules className="mr-2 text-xl" />
                          Associated Schedule
                        </button>
                      </th>
                      <th className="p-3 font-medium text-[14px]">
                        <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                          <VscCompass className="mr-2 text-xl" />
                          orientation
                        </button>
                      </th>

                      <th className="p-3 font-medium text-[14px]">
                        <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                          <BsTags className="mr-2 text-xl" />
                          Tags
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                      <td className="py-2">Assets Name 1</td>
                      <td className="py-2">25 May 2023</td>
                      <td className="break-words	w-[150px] py-2">
                        Schedule Name Till 28 June 2023
                      </td>
                      <td className="py-2">0</td>

                      <td className="py-2">Tags, Tags</td>
                    </tr>
                    <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                      <td className="py-2">Assets Name 2</td>
                      <td className="py-2">25 May 2023</td>
                      <td className="break-words	w-[150px] py-2">
                        Schedule Name Till 28 June 2023
                      </td>
                      <td className="py-2">90</td>

                      <td className="py-2">Tags, Tags</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="  md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 xs:mt-9 sm:mt-9 lg:mt-0 md:mt-0">
              <div className="bg-white shadow-2xl">
                <div className="p-3">
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter Title"
                  />
                </div>
                <div className="border-b-2 border-[#D5E3FF]"></div>
                <div className="p-3">
                  <div className="mb-2">Schedule Date time</div>
                  <div>
                    <ul className="border-2 border-[#D5E3FF] rounded">
                      <li className="border-b-2 border-[#D5E3FF] p-3">
                        <h3>Start Date:</h3>
                        <div className="mt-2">
                          <input
                            type="date"
                            value={editedStartDate}
                            onChange={handleStartDateChange}
                            className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                          />
                        </div>
                      </li>
                      <li className="border-b-2 border-[#D5E3FF] p-3">
                        <h3>End Date:</h3>
                        <div className="mt-2">
                          <input
                            type="date"
                            value={editedEndDate}
                            onChange={handleEndDateChange}
                            className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                          />
                        </div>
                      </li>
                      <li className="border-b-2 border-[#D5E3FF] p-3">
                        <h3>Start Time:</h3>
                        <div className="mt-2">
                          <input
                            type="time"
                            value={editedStartTime}
                            onChange={handleStartTimeChange}
                            className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                          />
                        </div>
                      </li>
                      <li className=" p-3">
                        <h3>End Time:</h3>
                        <div className="mt-2">
                          <input
                            type="time"
                            value={editedEndTime}
                            onChange={handleEndTimeChange}
                            className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="p-3">
                    <div>Repeat Multiple Day</div>

                    <div className="flex justify-between">
                      {/* <label>Repeat</label>
                      <input type="checkbox" /> */}
                      <button onClick={handleOpenRepeatSettings}>Repeat</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-2xl mt-4 ">
                <div className="p-3 w-full">
                  <h3>Select Color :</h3>
                  <div className="mt-2">
                    <SketchPicker
                      color={selectedColor}
                      onChange={(color) => setSelectedColor(color.hex)}
                      className="sketch-picker"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <button
              className="border-2 border-primary  px-5 py-2 rounded-full"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="border-2 border-primary  px-6 py-2 rounded-full ml-3"
              onClick={handleSave}
            >
              Save
            </button>
            {isEditMode && (
              <button
                className="border-2 border-primary  px-6 py-2 rounded-full ml-3"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            {/* <button
            className="border-2 border-primary  px-4 py-2 rounded-full ml-3"
            onClick={() => setSelectScreenModal(true)}
          >
            Save & Assign screen
          </button>
          {selectScreenModal && (
            <SaveAssignScreenModal
              setSelectScreenModal={setSelectScreenModal}
            />
          )} */}
          </div>
        </div>
        {showRepeatSettings && (
          <RepeatSettings
            repeatSettings={currentEventRepeatSettings}
            onSaveRepeatSettings={handleSaveRepeatSettings}
            onClose={() => setShowRepeatSettings(false)}
          />
        )}
      </ReactModal>
    </>
  );
};

export default EventEditor;
