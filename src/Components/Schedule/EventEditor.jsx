import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { AiOutlineSearch } from "react-icons/ai";
import { BsTags } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import { MdDateRange, MdOutlinePermMedia } from "react-icons/md";
import { IoTvOutline } from "react-icons/io5";
import ReactModal from "react-modal";
import { Link } from "react-router-dom";
import { GET_ALL_FILES } from "../../Pages/Api";
import axios from "axios";

const EventEditor = ({
  isOpen,
  onClose,
  onSave,
  selectedEvent,
  selectedSlot,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4A90E2");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");

  // State to keep track of repeat settings modal
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);

  const handleOpenRepeatSettings = () => {
    setShowRepeatSettings(true);
  };

  // Listen for changes in selectedEvent and selectedSlot to update the title and date/time fields
  useEffect(() => {
    if (isOpen && selectedEvent) {
      setTitle(selectedEvent.title);
      setSelectedColor(selectedEvent.color);
      setEditedStartDate(formatDate(selectedEvent.start));
      setEditedStartTime(formatTime(selectedEvent.start));
      setEditedEndDate(formatDate(selectedEvent.end));
      setEditedEndTime(formatTime(selectedEvent.end));
    } else if (isOpen && selectedSlot) {
      setTitle("");
      setSelectedColor("");
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

  const startDate = new Date(editedStartDate);
  const endDate = new Date(editedEndDate);
  const dayDifference = Math.floor(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
  );

  const buttons = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const [selectAllDays, setSelectAllDays] = useState(false);
  const [selectedDays, setSelectedDays] = useState(
    new Array(buttons.length).fill(false)
  );

  // Count the repeated days within the selected date range
  const countRepeatedDaysInRange = () => {
    let count = 0;
    for (let i = 0; i <= dayDifference; i++) {
      const dayIndex = (startDate.getDay() + i) % 7;
      if (selectedDays[dayIndex]) {
        count++;
      }
    }
    return count;
  };

  // Helper function to check if a given day is within the start and end date range
  const isDayInRange = (dayIndex) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayIndex);
    return currentDate >= startDate && currentDate <= endDate;
  };

  const handleSave = () => {
    // Convert edited dates and times to actual Date objects
    const start = new Date(editedStartDate + " " + editedStartTime);
    const end = new Date(editedEndDate + " " + editedEndTime);

    // Determine if any specific days are selected (excluding the "Repeat for All Day" option)
    const areSpecificDaysSelected = selectedDays.some(
      (isSelected) => isSelected
    );

    if (areSpecificDaysSelected || selectAllDays) {
      // Create events for selected days within the date range
      const events = [];
      let currentDate = new Date(start);

      while (currentDate <= end) {
        if (selectAllDays || selectedDays[currentDate.getDay()]) {
          const eventStart = new Date(currentDate);
          eventStart.setHours(start.getHours(), start.getMinutes());

          const eventEnd = new Date(currentDate);
          eventEnd.setHours(end.getHours(), end.getMinutes());

          events.push({
            title: title,
            start: eventStart,
            end: eventEnd,
            color: selectedColor,
            repeat: [], // Add repeat information here if needed
          });
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Save the generated events
      events.forEach((event) => {
        onSave(null, event);
      });
    } else {
      // If no specific days are selected, treat it as a one-time event and save it
      const eventData = {
        title: title,
        start: start,
        end: end,
        color: selectedColor,
        repeat: [], // Initialize the repeat array
      };

      // Check if the selected event is present and has the same data as the form data
      if (
        selectedEvent &&
        selectedEvent.title === title &&
        selectedEvent.start.getTime() === start.getTime() &&
        selectedEvent.end.getTime() === end.getTime() &&
        selectedEvent.color === selectedColor
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
    }
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

  const [searchAsset, setSearchAsset] = useState("");
  function handleFilter(event) {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setAssetData(allAssets);
    } else {
      const filteredData = allAssets.filter((item) => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        return itemName.includes(searchQuery);
      });
      setAssetData(filteredData);
    }
  }

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
            <div className="lg:col-span-9 md:col-span-8 sm:col-span-12 xs:col-span-12 bg-white shadow-2xl rounded-lg p-4">
              <div className="mr-5 relative sm:mr-0">
                <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                <input
                  type="text"
                  placeholder=" Search by Name"
                  className="border border-primary rounded-full px-7 py-2 search-user"
                  value={searchAsset}
                  onChange={handleFilter}
                />
              </div>
              <div className="overflow-x-auto">
                <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-2xl sm:px-7 md:pb-1">
                  <div className="max-w-full overflow-x-auto max-h-[810px] overflow-y-auto">
                    <table className="w-full ">
                      <thead>
                        <tr className="bg-[#E4E6FF] text-left">
                          <th className="min-w-[220px] py-4 px-4 font-medium text-black md:pl-10">
                            Assets
                          </th>
                          <th className="min-w-[150px] py-4 px-4 font-medium text-black">
                            Date Added
                          </th>
                          <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                            Associated Schedule
                          </th>
                          <th className="py-4 px-4 font-medium text-black">
                            Resolution
                          </th>
                          <th className="py-4 px-4 font-medium text-black">
                            Tags
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetData.map((item) => (
                          <tr key={item.id}>
                            <td className="border-b border-[#eee] py-5 px-4 pl-9 md:pl-10">
                              <h5 className="font-medium text-black">
                                {item.name}
                              </h5>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 ">
                              <p className="text-black">Jan 13,2023</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 ">
                              <p className="text-black ">
                                Schedule Name Till 28 June 2023
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 ">
                              <p className="text-black">{item.resolutions}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 ">
                              <p className="text-black">Tags, Tags</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {showRepeatSettings ? (
              <div className="md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-4 sm:col-span-12 xs:col-span-12 xs:mt-9 sm:mt-9 lg:mt-0 md:mt-0 bg-white shadow-2xl p-4">
                <div className="">
                  <div className="flex mt-5 items-center">
                    <label>Start Date:</label>
                    <div className="ml-3">
                      <input
                        type="date"
                        value={editedStartDate}
                        onChange={handleStartDateChange}
                        className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex mt-5 items-center">
                    <label>End Date:</label>
                    <div className="ml-5">
                      <input
                        type="date"
                        value={editedEndDate}
                        onChange={handleEndDateChange}
                        className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-black font-medium text-lg">
                  <label>Repeating {countRepeatedDaysInRange()} Day(s)</label>
                </div>

                <div className="flex mt-5">
                  <div>
                    <div>
                      <label className="ml-2">Start Time</label>
                      <div>
                        <input
                          type="time"
                          value={editedStartTime}
                          onChange={handleStartTimeChange}
                          className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-9">
                    <div>
                      <label className="ml-2">End Time</label>
                      <div>
                        <input
                          type="time"
                          value={editedEndTime}
                          onChange={handleEndTimeChange}
                          className="bg-[#E4E6FF] rounded-full px-3 py-2 w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-black font-medium text-lg">
                  <input
                    type="checkbox"
                    checked={selectAllDays}
                    onChange={() => setSelectAllDays(!selectAllDays)}
                  />
                  <label className="ml-3">Repeat for All Day</label>
                </div>

                <div>
                  {buttons.map((label, index) => (
                    <button
                      className={`daysbtn ${
                        (selectAllDays || selectedDays[index]) &&
                        isDayInRange(index)
                          ? "bg-red"
                          : ""
                      }`}
                      key={index}
                      disabled={!isDayInRange(index)}
                      onClick={() => {
                        if (isDayInRange(index)) {
                          const newSelectedDays = [...selectedDays];
                          newSelectedDays[index] = !newSelectedDays[index];
                          setSelectedDays(newSelectedDays);
                        }
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-4 sm:col-span-12 xs:col-span-12 xs:mt-9 sm:mt-9 lg:mt-0 md:mt-0">
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
                              value={editedStartDate}
                              readOnly
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
                    <div className="p-3 flex justify-between items-center">
                      <div>Repeat Multiple Day</div>

                      <div>
                        <button
                          onClick={handleOpenRepeatSettings}
                          className="border border-primary rounded-full px-4 py-1"
                        >
                          Repeat
                        </button>
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
            )}
          </div>
          <div className="flex justify-center mt-16">
            <button
              className="border-2 border-primary  px-5 py-2 rounded-full"
              onClick={() => {
                onClose();
                setShowRepeatSettings(false);
              }}
            >
              Cancel
            </button>

            <button
              className="border-2 border-primary  px-6 py-2 rounded-full ml-3"
              onClick={() => {
                handleSave();
                setShowRepeatSettings(false);
              }}
            >
              Save
            </button>
            {isEditMode && (
              <button
                className="border-2 border-primary  px-6 py-2 rounded-full ml-3"
                onClick={() => {
                  handleDelete();
                  setShowRepeatSettings(false);
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default EventEditor;
