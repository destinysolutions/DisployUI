import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import ReactModal from "react-modal";

const EventEditor = ({
  isOpen,
  onClose,
  onSave,
  selectedEvent,
  selectedSlot,
  onDelete,
  assetData,
  setAssetData,
  allAssets,
}) => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4A90E2");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetPreview, setAssetPreview] = useState(null);

  // State to keep track of repeat settings modal
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);

  const handleOpenRepeatSettings = () => {
    setShowRepeatSettings(true);
  };

  // Listen for changes in selectedEvent and selectedSlot to update the title and date/time fields
  useEffect(() => {
    if (isOpen && selectedEvent) {
      setSelectedAsset(selectedEvent.asset);
      setTitle(selectedEvent.originalTitle);
      setSelectedColor(selectedEvent.color);
      setEditedStartDate(formatDate(selectedEvent.start));
      setEditedStartTime(formatTime(selectedEvent.start));
      setEditedEndDate(formatDate(selectedEvent.end));
      setEditedEndTime(formatTime(selectedEvent.end));
    } else if (isOpen && selectedSlot) {
      setSelectedAsset("");
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

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
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
            asset: selectedAsset,
            repeat: [], // Add repeat information here if needed
          });
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Save the generated events
      events.forEach((event) => {
        event.asset = selectedAsset;
        onSave(null, event);
      });
    } else {
      // If no specific days are selected, treat it as a one-time event and save it
      const eventData = {
        title: title,
        start: start,
        end: end,
        color: selectedColor,
        asset: selectedAsset,
        repeat: [], // Initialize the repeat array
      };

      // Check if the selected event is present and has the same data as the form data
      if (
        selectedEvent &&
        selectedEvent.title === title &&
        selectedEvent.start.getTime() === start.getTime() &&
        selectedEvent.end.getTime() === end.getTime() &&
        selectedEvent.color === selectedColor &&
        selectedEvent.asset === selectedAsset
      ) {
        onClose();
      } else {
        if (selectedEvent) {
          onSave(selectedEvent.id, eventData);
        } else {
          onSave(null, eventData);
        }
        onClose();
      }
    }
  };

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

  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const handelDeletedata = () => {
    let data = JSON.stringify({
      scheduleId: selectedEvent.id,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: "http://192.168.1.219/api/ScheduleMaster/AddSchedule",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        onDelete(selectedEvent.id);
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
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
        <div>
          <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737] border-b border-lightgray pb-2  ">
            Select Assets and Shedule Time
          </h1>

          <div className="grid grid-cols-12 my-6">
            <div className="lg:col-span-9 md:col-span-8 sm:col-span-12 xs:col-span-12 rounded-lg">
              <div className="mb-5 relative ">
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
                <div className="rounded-sm bg-white  shadow-2xl md:pb-1">
                  <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-fixed text-sm break-words" cellPadding={10}>
                      <thead>
                        <tr className="bg-lightgray text-left">
                          <th className="min-w-[220px] py-4 px-4 font-medium text-black md:pl-10">
                            Assets
                          </th>
                          <th className="min-w-[220px] py-4 px-4 font-medium text-black">
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
                            <td
                              className="border-b border-[#eee]"
                              onClick={() => {
                                handleAssetAdd(item);
                                setAssetPreviewPopup(true);
                              }}
                            >
                              {item.categorieType === "Online" && (
                                <>
                                  {item.details === "Video" ? (
                                    <div className="relative videobox">
                                      <video
                                        controls
                                        className="w-full rounded-2xl relative"
                                      >
                                        <source
                                          src={item.fileType}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    </div>
                                  ) : (
                                    <div className="imagebox relative">
                                      <img
                                        src={item.fileType}
                                        className="rounded-2xl"
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              {item.categorieType === "Image" && (
                                <img
                                  src={item.fileType}
                                  alt={item.name}
                                  className="imagebox relative"
                                />
                              )}
                              {item.categorieType === "Video" && (
                                <div className="relative videobox">
                                  <video
                                    controls
                                    className="w-full rounded-2xl relative"
                                  >
                                    <source
                                      src={item.fileType}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}
                              {item.categorieType === "DOC" && (
                                <a
                                  href={item.fileType}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item.name}
                                </a>
                              )}
                            </td>
                            <td className="border-b border-[#eee]">
                              <h5
                                className="font-medium text-black cursor-pointer"
                                onClick={() => {
                                  handleAssetAdd(item);
                                  setAssetPreviewPopup(true);
                                }}
                              >
                                {item.name}
                              </h5>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black">Jan 13,2023</p>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black ">
                                Schedule Name Till 28 June 2023
                              </p>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black">{item.resolutions}</p>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black">Tags, Tags</p>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td>
                            {assetPreviewPopup && (
                              <>
                                <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
                                  <div className="fixed top-1/2 left-1/2 asset-preview-popup">
                                    <div className="border-0 rounded-lg shadow-lg relative w-full bg-black outline-none focus:outline-none">
                                      <div className="p-1  rounded-full text-white bg-primary absolute top-[-15px] right-[-16px]">
                                        <button
                                          className="p-1 text-xl"
                                          onClick={() =>
                                            setAssetPreviewPopup(false)
                                          }
                                        >
                                          <AiOutlineCloseCircle className="text-2xl" />
                                        </button>
                                      </div>
                                      <div className="p-3">
                                        {assetPreview && (
                                          <>
                                            {assetPreview.categorieType ===
                                              "Online" && (
                                                <>
                                                  {assetPreview.details ===
                                                    "Video" ? (
                                                    <div className="relative videobox">
                                                      <video
                                                        controls
                                                        className="w-full rounded-2xl relative"
                                                      >
                                                        <source
                                                          src={
                                                            assetPreview.fileType
                                                          }
                                                          type="video/mp4"
                                                        />
                                                        Your browser does not
                                                        support the video tag.
                                                      </video>
                                                    </div>
                                                  ) : (
                                                    <div className="imagebox relative p-3">
                                                      <img
                                                        src={
                                                          assetPreview.fileType
                                                        }
                                                        className="rounded-2xl"
                                                      />
                                                    </div>
                                                  )}
                                                </>
                                              )}
                                            {assetPreview.categorieType ===
                                              "Image" && (
                                                <img
                                                  src={assetPreview.fileType}
                                                  alt={assetPreview.name}
                                                  className="imagebox relative"
                                                />
                                              )}
                                            {assetPreview.categorieType ===
                                              "Video" && (
                                                <video
                                                  controls
                                                  className="w-full rounded-2xl relative h-56"
                                                >
                                                  <source
                                                    src={assetPreview.fileType}
                                                    type="video/mp4"
                                                  />
                                                  Your browser does not support
                                                  the video tag.
                                                </video>
                                              )}
                                            {assetPreview.categorieType ===
                                              "DOC" && (
                                                <a
                                                  href={assetPreview.fileType}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  {assetPreview.name}
                                                </a>
                                              )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
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
                        className="bg-lightgray rounded-full px-3 py-2 w-full"
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
                        className="bg-lightgray rounded-full px-3 py-2 w-full"
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
                          className="bg-lightgray rounded-full px-3 py-2 w-full"
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
                          className="bg-lightgray rounded-full px-3 py-2 w-full"
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
                      className={`daysbtn ${(selectAllDays || selectedDays[index]) &&
                        isDayInRange(index)
                        ? " bg-SlateBlue border-white"
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
                  <div className="border-b-2 border-lightgray"></div>
                  <div className="p-3">
                    <input
                      type="text"
                      value={selectedAsset ? selectedAsset.name : "Set Media"}
                      readOnly
                      className="bg-lightgray rounded-full px-3 py-2 w-full"
                      onClick={() => setAssetPreviewPopup(true)}
                    />
                    <button
                      className="border border-primary rounded-full px-4 py-1 ml-3 mt-2"
                      onClick={() => setSelectedAsset(null)}
                    >
                      Clear Media
                    </button>
                  </div>
                  <div className="border-b-2 border-lightgray"></div>
                  <div className="p-3">
                    <div className="mb-2">Schedule Date time</div>
                    <div>
                      <ul className="border-2 border-lightgray rounded">
                        <li className="border-b-2 border-lightgray p-3">
                          <h3>Start Date:</h3>
                          <div className="mt-2">
                            <input
                              type="date"
                              value={editedStartDate}
                              onChange={handleStartDateChange}
                              className="bg-lightgray rounded-full px-3 py-2 w-full"
                            />
                          </div>
                        </li>
                        <li className="border-b-2 border-lightgray p-3">
                          <h3>End Date:</h3>
                          <div className="mt-2">
                            <input
                              type="date"
                              value={editedStartDate}
                              readOnly
                              className="bg-lightgray rounded-full px-3 py-2 w-full"
                            />
                          </div>
                        </li>
                        <li className="border-b-2 border-lightgray p-3">
                          <h3>Start Time:</h3>
                          <div className="mt-2">
                            <input
                              type="time"
                              value={editedStartTime}
                              onChange={handleStartTimeChange}
                              className="bg-lightgray rounded-full px-3 py-2 w-full"
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
                              className="bg-lightgray rounded-full px-3 py-2 w-full"
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
              className="border-2 border-lightgray hover:bg-primary hover:text-white   px-5 py-2 rounded-full"
              onClick={() => {
                onClose();
                setShowRepeatSettings(false);
              }}
            >
              Cancel
            </button>

            <button
              className="border-2 border-lightgray hover:bg-primary hover:text-white bg-SlateBlue  px-6 py-2 rounded-full ml-3"
              onClick={() => {
                handleSave();
                setShowRepeatSettings(false);
              }}
            >
              Save
            </button>
            {isEditMode && (
              <button
                className="border-2 border-lightgray hover:bg-primary hover:text-white   px-6 py-2 rounded-full ml-3"
                onClick={() => {
                  handelDeletedata();
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
