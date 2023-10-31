import axios from "axios";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";
import {
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import ReactModal from "react-modal";
import { ADD_EVENT } from "../../Pages/Api";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { BsFillInfoCircleFill } from "react-icons/bs";
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
  const [assetPreview, setAssetPreview] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const buttons = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [selectAllDays, setSelectAllDays] = useState(false);
  const [selectedDays, setSelectedDays] = useState(
    new Array(buttons.length).fill(false)
  );
  const [selectedRepeatDay, setSelectedRepeatDay] = useState("");
  const [previousSetedRepeatDay, setPreviousSetedRepeatDay] = useState("");
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);
  const [repeatDayMessage, setRepeatDayMessage] = useState("");
  const [repeatDayMessageVisible, setRepeatDayMessageVisible] = useState(false);
  const [emptyTitleMessage, setEmptyTitleMessage] = useState("");
  const [emptyTitleMessageVisible, setEmptyTitleMessageVisible] =
    useState(false);
  const [repeatDayMessageShown, setRepeatDayMessageShown] = useState(false);
  const handleOpenRepeatSettings = () => {
    setShowRepeatSettings(true);
  };

  // Listen for changes in selectedEvent and selectedSlot to update the title and date/time fields
  useEffect(() => {
    if (isOpen) {
      if (selectedEvent) {
        let assetId;
        if (selectedEvent?.asset?.id != undefined) {
          assetId = selectedEvent?.asset?.id;
        } else {
          assetId = selectedEvent.asset;
        }
        const previousSelectedAsset = allAssets.find(
          (asset) => asset.id === assetId
        );
        if (previousSelectedAsset) {
          setSelectedAsset(previousSelectedAsset);
          setAssetPreview(previousSelectedAsset);
        }
        // const previousSelectedDay = selectedEvent.repeatDay;

        // setSelectedRepeatDay(previousSelectedDay);

        // console.log(previousSelectedDay, "previousSelectedDay");
        // const previousSelectedDayss = buttons.find((previousSelected) => {
        //   return previousSelected === previousSelectedDay;
        // });
        // console.log(previousSelectedDayss, "previousSelectedDay");

        // setSelectedRepeatDay(selectedEvent.repeatDay || "");
        if (selectedEvent.repeatDay !== "") {
          setShowRepeatSettings(true);
          setPreviousSetedRepeatDay(selectedEvent.repeatDay);
        }
        setTitle(selectedEvent.title);
        setSelectedColor(selectedEvent.color);
        setEditedStartDate(moment(selectedEvent.start).format("YYYY-MM-DD"));
        setEditedStartTime(moment(selectedEvent.start).format("HH:mm"));
        setEditedEndDate(moment(selectedEvent.end).format("YYYY-MM-DD"));
        setEditedEndTime(moment(selectedEvent.end).format("HH:mm"));
      } else if (selectedSlot) {
        setSelectedRepeatDay("");
        setSelectedAsset(null);
        setAssetPreview(null);
        setTitle("");
        setSelectedColor("");
        setEditedStartDate(moment(selectedSlot.start).format("YYYY-MM-DD"));
        setEditedStartTime(moment(selectedSlot.start).format("HH:mm"));
        setEditedEndDate(moment(selectedSlot.end).format("YYYY-MM-DD"));
        setEditedEndTime(moment(selectedSlot.end).format("HH:mm"));
      }
    }
  }, [isOpen, selectedEvent, selectedSlot, allAssets]);
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setEditedStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEditedEndTime(e.target.value);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setEditedStartDate(newStartDate);

    // Calculate and update the end date based on the new start date
    const newEndDate = calculateEndDate(newStartDate, editedStartTime);
    setEditedEndDate(newEndDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEditedEndDate(newEndDate);
  };

  // Function to calculate the end date based on start date and time
  const calculateEndDate = (startDate, startTime) => {
    // Parse the start date and time to create a new Date object
    const startDateObj = new Date(startDate + "T" + startTime);

    // Calculate the end date by adding a default duration (e.g., 1 hour)
    const endDateObj = new Date(startDateObj);
    endDateObj.setHours(startDateObj.getHours() + 1); // You can adjust this as needed

    // Format the end date to match your desired format
    const formattedEndDate = moment(endDateObj).format("YYYY-MM-DD");

    return formattedEndDate;
  };

  // Create a variable to check if the modal is in "edit" mode
  const isEditMode = !!selectedEvent;

  const startDate = new Date(editedStartDate);
  const endDate = new Date(editedEndDate);
  const dayDifference = Math.floor(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
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

  const countAllDaysInRange = () => {
    if (selectAllDays) {
      return dayDifference + 1; // All days in the date range
    } else {
      return countRepeatedDaysInRange(); // Only selected days
    }
  };

  // Helper function to check if a given day is within the start and end date range
  const isDayInRange = (dayIndex) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayIndex);
    return currentDate >= startDate && currentDate <= endDate;
  };
  const handleCheckboxChange = () => {
    const newSelectAllDays = !selectAllDays;
    setSelectAllDays(newSelectAllDays);
    const newSelectedDays = newSelectAllDays
      ? Array(buttons.length).fill(true)
      : Array(buttons.length).fill(false);
    setSelectedDays(newSelectedDays);
  };

  const handleDayButtonClick = (index) => {
    if (isDayInRange(index)) {
      const newSelectedDays = [...selectedDays];
      newSelectedDays[index] = !selectedDays[index];

      // Check if all individual days are selected, then check the "Repeat for All Day" checkbox.
      const newSelectAllDays = newSelectedDays.every((day) => day === true);

      setSelectedDays(newSelectedDays);
      setSelectAllDays(newSelectAllDays);

      // Update previousSetedRepeatDay based on the selected days
      let newPreviousSetedRepeatDay = [];
      for (let i = 0; i < newSelectedDays.length; i++) {
        if (newSelectedDays[i]) {
          newPreviousSetedRepeatDay.push(buttons[i]);
        }
      }
      // Compare the old and new values of newPreviousSetedRepeatDay
      // if (
      //   JSON.stringify(newPreviousSetedRepeatDay) !==
      //   JSON.stringify(previousSetedRepeatDay)
      // ) {
      //   if (!repeatDayMessageShown) {
      //     let messge = "RepeatDay has changed!";
      //     setRepeatDayMessage(messge);
      //     setRepeatDayMessageVisible(true);
      //     setRepeatDayMessageShown(true); // Mark the message as shown
      //   }
      // }
      setPreviousSetedRepeatDay(newPreviousSetedRepeatDay);
    }
  };

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleSave = () => {
    // Check if the title is empty
    if (!title) {
      setEmptyTitleMessage("Please enter a title for the event.");
      setEmptyTitleMessageVisible(true);
      return;
    }

    // Convert edited dates and times to actual Date objects
    const start = new Date(editedStartDate + " " + editedStartTime);
    const end = new Date(editedEndDate + " " + editedEndTime);

    const selectedDaysInNumber = selectedDays
      .map((isSelected, index) => (isSelected ? index : null))
      .filter((index) => index !== null);
    const selectedDaysInString = selectedDaysInNumber.map(
      (index) => buttons[index]
    );
    // Determine if any specific days are selected (excluding the "Repeat for All Day" option)
    const areSpecificDaysSelected = selectedDays.some(
      (isSelected) => isSelected
    );

    let repeatDayValue = null;
    if (areSpecificDaysSelected || selectAllDays) {
      repeatDayValue = selectAllDays
        ? buttons.map((dayName) => dayName)
        : selectedDaysInString;
      setSelectedRepeatDay(repeatDayValue);
    }

    let eventData = {
      title: title,
      start: start,
      end: end,
      color: selectedColor,
      asset: selectedAsset,
    };

    if (areSpecificDaysSelected || selectAllDays) {
      eventData.repeatDay = repeatDayValue;
    }

    // Check if the selected event is present and has the same data as the form data
    if (
      selectedEvent &&
      selectedEvent.title === title &&
      selectedEvent.start.getTime() === start.getTime() &&
      selectedEvent.end.getTime() === end.getTime() &&
      selectedEvent.color === selectedColor &&
      selectedEvent.asset === selectedAsset &&
      selectedEvent.repeatDay === selectedRepeatDay
    ) {
      onClose();
    } else {
      if (selectedEvent) {
        onSave(selectedEvent?.id || selectedEvent?.eventId, eventData);
      } else {
        onSave(null, eventData);
      }
      onClose();
    }
    // Check if the repeat days have changed and show the message
    if (
      !JSON.stringify(selectedEvent?.repeatDay) ===
      JSON.stringify(selectedRepeatDay)
    ) {
      let message = "Repeat Day has changed!";
      setRepeatDayMessage(message);
      setRepeatDayMessageVisible(true);
    }
    // Clear the selected repeat days after saving the event
    setSelectAllDays(false);
    setSelectedDays(new Array(buttons.length).fill(false));
  };

  const [searchAsset, setSearchAsset] = useState("");
  const handleFilter = (event) => {
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
  };

  const handelDeletedata = () => {
    let data = JSON.stringify({
      eventId: selectedEvent.id,
      operation: "Delete",
    });

    let config = {
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
        console.log(response, "responsedelete");
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
        <div className="relative">
          <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737] border-b border-lightgray pb-2  ">
            Select Assets and Schedule Time
          </h1>

          <div className="grid grid-cols-12 relative">
            <div className="lg:col-span-9 md:col-span-8 sm:col-span-12 xs:col-span-12 rounded-lg">
              <div className="my-2 relative ">
                <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                <input
                  type="text"
                  placeholder=" Search by Name"
                  className="border border-primary rounded-full px-7 py-2 search-user"
                  value={searchAsset}
                  onChange={handleFilter}
                />
              </div>
              <div className="overflow-auto">
                <div className="rounded-sm bg-white shadow-2xl md:pb-1">
                  <div className="max-w-full overflow-auto max-h-[1340px]">
                    <table
                      className="w-full lg:table-fixed md:table-fixed sm:table-auto xs:table-auto text-sm break-words schedualtime-table"
                      cellPadding={10}
                    >
                      <thead>
                        <tr className="bg-lightgray text-left">
                          <th className="min-w-[220px] py-4 px-4 font-semibold text-black md:pl-10">
                            Assets
                          </th>
                          <th className="min-w-[220px] py-4 px-4 font-semibold text-black">
                            Assets Name
                          </th>
                          <th className="min-w-[150px] py-4 px-4 font-semibold text-black">
                            Date Added
                          </th>
                          <th className="min-w-[120px] py-4 px-4 font-semibold text-black">
                            Associated Schedule
                          </th>
                          <th className="py-4 px-4 font-semibold text-black">
                            Resolution
                          </th>
                          <th className="py-4 px-4 font-semibold text-black">
                            Tags
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetData.map((item) => (
                          <tr
                            key={item.id}
                            className={`${
                              selectedAsset === item ? "bg-[#f3c953]" : ""
                            } border-b border-[#eee] `}
                            onClick={() => {
                              handleAssetAdd(item);
                              // setAssetPreviewPopup(true);
                            }}
                          >
                            <td className="border-b border-[#eee]">
                              {item.categorieType === "OnlineImage" && (
                                <div className="imagebox relative">
                                  <img
                                    src={item.fileType}
                                    alt={item.name}
                                    className="rounded-2xl h-24 w-28"
                                  />
                                </div>
                              )}

                              {item.categorieType === "OnlineVideo" && (
                                <div className="imagebox relative">
                                  <video
                                    controls
                                    className="rounded-2xl h-24 w-28"
                                  >
                                    <source
                                      src={item.fileType}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}
                              {item.categorieType === "Image" && (
                                <img
                                  src={item.fileType}
                                  alt={item.name}
                                  className="imagebox relative h-24 w-28"
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
                                }}
                              >
                                {item.name}
                              </h5>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black font-medium">
                                {moment(item.createdDate).format("YYYY-MM-DD")}
                              </p>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black font-medium">
                                Schedule Name Till 28 June 2023
                              </p>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black font-medium">
                                {item.resolutions}
                              </p>
                            </td>
                            <td className="border-b border-[#eee]">
                              <p className="text-black font-medium">
                                Tags, Tags
                              </p>
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
                                      <div className="p-3 flex justify-center  items-center min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px]">
                                        {assetPreview && (
                                          <>
                                            {assetPreview.categorieType ===
                                              "OnlineImage" && (
                                              <div className="imagebox relative p-3">
                                                <img
                                                  src={assetPreview.fileType}
                                                  alt={assetPreview.name}
                                                  className="rounded-2xl "
                                                />
                                              </div>
                                            )}

                                            {assetPreview.categorieType ===
                                              "OnlineVideo" && (
                                              <div className="relative videobox">
                                                <video
                                                  controls
                                                  className="w-full rounded-2xl relative"
                                                >
                                                  <source
                                                    src={assetPreview.fileType}
                                                    type="video/mp4"
                                                  />
                                                  Your browser does not support
                                                  the video tag.
                                                </video>
                                              </div>
                                            )}
                                            {assetPreview.categorieType ===
                                              "Image" && (
                                              <img
                                                src={assetPreview.fileType}
                                                alt={assetPreview.name}
                                                className="imagebox relative flex justify-center  items-center min-w-[250px] max-w-[250px] min-h-[250px] max-h-[250px]"
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
            {emptyTitleMessageVisible && (
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
                  {emptyTitleMessage}
                  <button
                    className="absolute top-[-26px] right-[-26px] bg-white rounded-full p-1 "
                    onClick={() => setEmptyTitleMessageVisible(false)}
                  >
                    <AiOutlineClose className="text-xl  text-SlateBlue " />
                  </button>
                </div>
              </div>
            )}
            {repeatDayMessageVisible && (
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
                  {repeatDayMessage}
                  <button
                    className="absolute top-[-26px] right-[-26px] bg-white rounded-full p-1 "
                    onClick={() => setRepeatDayMessageVisible(false)}
                  >
                    <AiOutlineClose className="text-xl  text-SlateBlue " />
                  </button>
                </div>
              </div>
            )}

            <div className="md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-4 sm:col-span-12 xs:col-span-12 xs:mt-9 sm:mt-9 lg:mt-0 md:mt-0">
              <div className="bg-white shadow-2xl">
                <div className="p-3">
                  <div>
                    <ul className="border-2 border-lightgray rounded">
                      <li className="border-b-2 border-lightgray p-3">
                        <h3>Title :</h3>
                        <div className="mt-2">
                          <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter Title"
                            className="bg-lightgray rounded-full px-3 py-2 w-full"
                          />
                        </div>
                      </li>

                      <li className="border-b-2 border-lightgray p-3">
                        <h3>Asset :</h3>
                        <div className="mt-2 ">
                          <div className="bg-lightgray rounded-full px-4 py-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                            {selectedAsset ? selectedAsset.name : "Set Media"}
                          </div>
                          <div className="flex items-center justify-center mt-4">
                            <button
                              className="border border-primary rounded-full px-4 py-1 "
                              onClick={() => setAssetPreviewPopup(true)}
                            >
                              Preview
                            </button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {showRepeatSettings ? (
                  <>
                    <div className="relative md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-4 sm:col-span-12 xs:col-span-12 xs:mt-9 sm:mt-9 lg:mt-0 md:mt-0  p-4">
                      <div className="backbtn absolute top-[5px] left-[-10px] ">
                        <button
                          className="border border-SlateBlue rounded-full p-1 bg-SlateBlue"
                          onClick={() => setShowRepeatSettings(false)}
                        >
                          <MdOutlineArrowBackIosNew className="text-white" />
                        </button>
                      </div>
                      <div className="mt-3">
                        <div>
                          <label>Start Date:</label>
                          <div className="mt-1">
                            <input
                              type="date"
                              value={editedStartDate}
                              onChange={handleStartDateChange}
                              className="bg-lightgray rounded-full px-3 py-2 w-full"
                            />
                          </div>
                        </div>
                        <div className=" mt-5">
                          <label>End Date:</label>
                          <div className="mt-1">
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
                        <label>Repeating {countAllDaysInRange()} Day(s)</label>
                      </div>

                      <div className="lg:flex md:block sm:block xs:block items-center mt-5 lg:flex-nowrap md:flex-wrap sm:flex-wrap">
                        <div className="mr-2 w-full">
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

                        <div className="w-full">
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

                      <div className="mt-5 text-black font-medium text-lg mr-2">
                        <input
                          type="checkbox"
                          checked={selectAllDays}
                          onChange={handleCheckboxChange}
                        />
                        <label className="ml-3">Repeat for All Day</label>
                      </div>

                      <div>
                        {buttons.map((label, index) => (
                          <button
                            // className={`border border-primary px-3 py-1 mr-2 mt-3 rounded-full ${
                            //   (selectAllDays || selectedDays[index]) &&
                            //   isDayInRange(index) &&
                            //   previousSetedRepeatDay
                            //     ? "bg-SlateBlue border-white"
                            //     : ""
                            // }`}
                            className={`border border-primary px-3 py-1 mr-2 mt-3 rounded-full ${
                              (selectAllDays || selectedDays[index]) &&
                              isDayInRange(index)
                                ? "bg-SlateBlue border-white"
                                : ""
                            } ${
                              previousSetedRepeatDay.includes(label) // Check if label is in previousSetedRepeatDay
                                ? "bg-SlateBlue border-white"
                                : ""
                            }`}
                            key={index}
                            disabled={!isDayInRange(index)}
                            onClick={() => handleDayButtonClick(index)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border-b-2 border-lightgray mt-2"></div>
                  </>
                ) : (
                  <>
                    <div className="border-b-2 border-lightgray mt-2"></div>
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
                            <div className="mt-2 bg-lightgray rounded-full px-3 py-2 w-full">
                              {moment(editedStartDate).format("DD-MM-YYYY")}
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
                  </>
                )}
                <div className="border-b-2 border-lightgray"></div>
                <div className="bg-white shadow-2xl mt-4 ">
                  <div className="p-3 w-full">
                    <h3>Select Color :</h3>
                    {selectedColor !== null && (
                      <div className="mt-2">
                        <SketchPicker
                          color={selectedColor}
                          onChange={(color) => setSelectedColor(color.hex)}
                          className="sketch-picker"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 bg-white schedual-btn">
              <div className="flex justify-center ">
                <button
                  className="border-2 border-lightgray hover:bg-primary hover:text-white   px-5 py-2 rounded-full"
                  onClick={() => {
                    onClose();
                    setShowRepeatSettings(false);
                  }}
                >
                  Cancel
                </button>

                {isEditMode ? (
                  <button
                    className="border-2 border-lightgray hover:bg-primary hover:text-white bg-SlateBlue  px-6 py-2 rounded-full ml-3"
                    onClick={() => {
                      handleSave();
                      setShowRepeatSettings(false);
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="border-2 border-lightgray hover:bg-primary hover:text-white bg-SlateBlue  px-6 py-2 rounded-full ml-3"
                    onClick={() => {
                      handleSave();
                      setShowRepeatSettings(false);
                    }}
                  >
                    Save
                  </button>
                )}
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
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default EventEditor;
