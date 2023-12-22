import axios from "axios";
import moment from "moment";
import React, { useRef } from "react";
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
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
const EventEditor = ({
  isOpen,
  onClose,
  onSave,
  selectedEvent,
  selectedSlot,
  onDelete,
  allAssets,
  myEvents,
  setAllAssets,
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
  const [showRepeatSettings, setShowRepeatSettings] = useState(false);
  const [repeatDayWarning, setRepeatDayWarning] = useState(false);
  const [searchAsset, setSearchAsset] = useState("");
  const [repeatDays, setRepeatDays] = useState([]);

  const { token } = useSelector((s) => s.root.auth);
  const { assets, loading } = useSelector((s) => s.root.asset);
  const { allAppsData, youtube, textScroll } = useSelector((s) => s.root.apps);
  const authToken = `Bearer ${token}`;

  const modalRef = useRef(null);

  // console.log("editedStartTime",editedStartTime);
  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    if (newStartTime < editedEndTime) {
      setEditedStartTime(newStartTime);
    } else {
      toast.error("Please change End Time.");
      console.log("Select start time must be after or equal to current date");
    }
  };

  // console.log("newEndTime",editedEndTime);
  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    if (newEndTime > editedStartTime) {
      setEditedEndTime(newEndTime);
    } else {
      console.log("Select End time must be after or equal to start time");
      toast.error("Please change Start Time.");
    }
  };

  const currentDate = moment();
  const today = moment().format("YYYY-MM-DD");
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    const givenDate = moment(newStartDate);
    if (givenDate.isSameOrAfter(currentDate, "day")) {
      // Calculate and update the end date based on the new start date
      if (!showRepeatSettings) {
        setEditedStartDate(newStartDate);
        const newEndDate = calculateEndDate(newStartDate, editedStartTime);
        setEditedEndDate(newEndDate);
      }

      if (showRepeatSettings && newStartDate <= editedEndDate) {
        setEditedStartDate(newStartDate);
      } else if (showRepeatSettings) {
        toast.error("Please change End Date.");
      }
    } else {
      toast.error("Please select a date in the present or future.");
    }
  };

  const handleEndDateChange = (e) => {
    const newStartDate = e.target.value;
    if (newStartDate > editedStartDate) {
      setEditedEndDate(newStartDate);
    }

    // Calculate and update the end date based on the new start date
    // const newEndDate = calculateEndDate(newStartDate, editedStartTime);
    // setEditedEndDate(newEndDate);
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

  // for select all days to repeat day
  function handleCheckboxChange() {
    if (
      moment(selectedSlot?.end).format("YYYY-MM-DD") === editedEndDate &&
      selectAllDays &&
      !isEditMode
    ) {
      toast.remove();
      toast.error("Please change End Date");
      setSelectAllDays(false);
      return;
    }
    const daysDiff = moment(endDate).diff(startDate, "days");
    if (daysDiff >= 6 && !selectAllDays) {
      setSelectAllDays(true);
    } else if (daysDiff < 6 && selectAllDays) {
      setSelectAllDays(false);
    }

    // if(isEditMode)
    let days = [];
    for (let i = 0; i < daysDiff; i++) {
      days[i] = moment(moment(startDate).add(i, "day")).format("dddd");
    }
    days[days.length] = moment(endDate).format("dddd");
    let changeDayTrueOrFalse;

    for (let i = 0; i < days.length; i++) {
      changeDayTrueOrFalse = buttons.map((i) => days.includes(i));
    }
    setRepeatDays(changeDayTrueOrFalse);
    setSelectedDays(changeDayTrueOrFalse);
  }

  // for select repeat day
  const handleDayButtonClick = (index, label) => {
    if (!repeatDays[index]) {
      toast.remove();
      return toast.error("Please change end date");
    }
    // if (isDayInRange(index)) {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !selectedDays[index];
    // Check if all individual days are selected, then check the "Repeat for All Day" checkbox.
    const newSelectAllDays = newSelectedDays.every((day) => day === true);

    if (
      moment(selectedSlot?.end).format("YYYY-MM-DD") === editedEndDate &&
      newSelectedDays[index]
    ) {
      toast.remove();
      toast.error("Please change End Date");
      return;
    }

    // console.log(newSelectedDays,newSelectAllDays);
    setSelectedDays(newSelectedDays);
    setSelectAllDays(newSelectAllDays);

    // }
  };

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleWarn = () => {
    if (selectedEvent.isfutureDateExists == 1) {
      setRepeatDayWarning(true);
    }
  };

  const handleSave = (updateAllValue) => {
    if (!title) {
      toast.remove();
      toast.error("Please enter a title for the event.");
      return;
    }
    if (!selectedAsset) {
      toast.remove();
      toast.error("Please select Asset");
      return;
    }
    if (
      !editedStartTime ||
      editedStartTime == "00:00" ||
      !editedEndTime ||
      editedEndTime == "00:00"
    ) {
      toast.remove();
      return toast.error("Please enter start time & end time");
    }
    toast.remove();
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

    if (
      moment(selectedEvent?.end).format("YYYY-MM-DD") !== editedEndDate &&
      !selectAllDays && // Check if no checkbox is selected
      !areSpecificDaysSelected // Check if no individual day is selected
    ) {
      toast.remove();
      toast.error("Please select repeat for all days otherwise anyone day");
      return;
    }
    // Check if the end date is modified
    // const isEndDateModified =
    //   selectedEvent?.end && selectedEvent.end.getTime() !== end.getTime();
    // if (isEndDateModified) {
    //   if (!areSpecificDaysSelected && !selectAllDays) {
    //     alert("Please select repeat for all days otherwise anyone day");
    //   }
    // }

    let eventData = {
      title: title,
      start: start,
      end: end,
      color: selectedColor,
      asset: selectedAsset,
      UpdateALL: updateAllValue
        ? updateAllValue
        : selectedRepeatDay.length > 0
        ? 1
        : 0,
    };
    let updateAllValueFlag = updateAllValue
      ? updateAllValue
      : repeatDayValue !== null
      ? 1
      : 0;
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
      setSelectedDays([]);
      setSelectedRepeatDay("");
    } else {
      if (selectedEvent) {
        onSave(
          selectedEvent?.id || selectedEvent?.eventId,
          eventData,
          updateAllValueFlag,
          setShowRepeatSettings(false)
        );
      } else {
        onSave(
          null,
          eventData,
          updateAllValueFlag,
          setShowRepeatSettings(false)
        );
      }
      onClose();
      setSelectedRepeatDay("");
      setSelectedDays([]);
    }

    // Check if the repeat days have changed and show the message
    if (
      !JSON.stringify(selectedEvent?.repeatDay) ===
      JSON.stringify(selectedRepeatDay)
    ) {
      toast.remove();
      toast.error("Repeat Day has changed!");
    }
    // Clear the selected repeat days after saving the event
    setSelectAllDays(false);
    setSelectedDays(new Array(buttons.length).fill(false));
  };

  const handleFilter = (value) => {
    if (value === "") {
      setSearchAsset("");
      setAllAssets([...assets]);
    } else {
      setSearchAsset(value);
      const filteredData = allAssets.filter((item) => {
        const itemAssetName = item.assetName
          ? item.assetName.toLowerCase()
          : "";
        const itemInstanceName = item.instanceName
          ? item.instanceName.toLowerCase()
          : "";
        return (
          itemAssetName.includes(value) || itemInstanceName.includes(value)
        );
      });
      setAllAssets(filteredData);
    }
  };
  const debounceForSearchAsset = debounce(handleFilter, 500);

  const handelDeletedata = () => {
    toast.loading("Deleting...");
    let data = JSON.stringify({
      eventId: selectedEvent.id,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: ADD_EVENT,
      headers: {
        Authorization: authToken,
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
        toast.remove();
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setAssetPreviewPopup(false);
        setSearchAsset("");
        setAllAssets([...assets]);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setAssetPreviewPopup(false);
    setSearchAsset("");
    setAllAssets([...assets]);
  }

  const daysDiff = moment(selectedEvent?.actualEndDate).diff(
    myEvents[0]?.start,
    "days"
  );

  const DAYS = new Promise((resolve, reject) => {
    let days = [];
    for (let i = 0; i < daysDiff; i++) {
      days[i] = moment(moment(myEvents[0]?.start).add(i, "day")).format("dddd");
      if (days.length === daysDiff) {
        days.push(moment(selectedEvent?.actualEndDate).format("dddd"));
      }
    }
    if (
      days.length == selectedEvent?.repeatDay?.split(",").length &&
      days.length < buttons.length
    ) {
      let data;
      for (let i = 0; i < selectedEvent?.repeatDay?.split(",").length; i++) {
        data = buttons.map((i) => days.includes(i));
      }
      return resolve(data);
    } else if (days.length > buttons.length) {
      return resolve(buttons);
    } else {
      // return reject("error");
    }
  });

  useEffect(() => {
    if (myEvents.length > 0) {
      // handleCheckboxChange();
      // console.log(myEvents[myEvents.length - 1]?.end);
      setEditedEndDate(myEvents[myEvents.length - 1]?.end);
    }
  }, [myEvents]);

  useEffect(() => {
    if (selectedEvent?.isfutureDateExists == 1) {
      setShowRepeatSettings(true);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (!isNaN(daysDiff)) {
      DAYS.then((res) => {
        setSelectedDays(res);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [daysDiff]);

  useEffect(() => {
    if (showRepeatSettings) {
      handleCheckboxChange();
    }
  }, [editedEndDate, editedStartDate]);

  // Listen for changes in selectedEvent and selectedSlot to update the title and date/time fields
  useEffect(() => {
    if (isOpen) {
      if (selectedEvent) {
        let assetId;

        if (selectedEvent?.asset?.assetID != undefined) {
          assetId = selectedEvent?.asset?.assetID;
        } else {
          assetId = selectedEvent.asset;
        }
        const previousSelectedAsset = allAssets.find(
          (asset) => asset.assetID === assetId
        );
        if (previousSelectedAsset) {
          setSelectedAsset(previousSelectedAsset);
          setAssetPreview(previousSelectedAsset);
        }

        setTitle(selectedEvent.title);
        setSelectedColor(selectedEvent.color);
        setEditedStartDate(moment(selectedEvent.start).format("YYYY-MM-DD"));
        setEditedStartTime(moment(selectedEvent.start).format("HH:mm"));
        setEditedEndDate(
          moment(selectedEvent.actualEndDate).format("YYYY-MM-DD")
        );
        setEditedEndTime(moment(selectedEvent.end).format("HH:mm"));
        const selectedAsset = allAssets.find(
          (asset) => selectedEvent?.asset === asset?.assetID
        );
        setSelectedAsset(selectedAsset);
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

  // for clear selectedDays
  useEffect(() => {
    setAllAssets([...assets]);
    // setAllAssets([
    //   ...youtube?.youtubeData,
    //   ...textScroll?.textScrollData,
    //   ...assets,
    // ]);
  }, [textScroll.loading, youtube.loading, loading]);

  useEffect(() => {
    return () => {
      setSelectedDays(Array(buttons.length).fill(false));
    };
  }, []);

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
        appElement={document.getElementById("root")}
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
                  onChange={(e) =>
                    debounceForSearchAsset(e.target.value.toLocaleLowerCase())
                  }
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
                        <tr className="bg-lightgray text-left mb-5">
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
                        {allAssets.length > 0 ? (
                          allAssets
                            .filter((item) => item?.assetType !== "Folder")
                            .map((item, index) => (
                              <tr
                                key={index}
                                className={`${
                                  selectedAsset === item ? "bg-[#f3c953]" : ""
                                } border-b border-[#eee] mt-5`}
                                onClick={() => {
                                  handleAssetAdd(item);
                                }}
                              >
                                <td className="border-b border-[#eee]">
                                  {item.assetType === "OnlineImage" && (
                                    <div className="imagebox relative z-0">
                                      <img
                                        src={item.assetFolderPath}
                                        alt={item.assetName}
                                        className="rounded-2xl min-h-[20vh] max-h-[20vh] w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  {item.assetType === "OnlineVideo" && (
                                    <div className="imagebox rounded-2xl z-0 relative">
                                      <video
                                        controls
                                        autoPlay={true}
                                        className="rounded-2xl min-h-[20vh] max-h-[20vh] w-full object-cover"
                                      >
                                        <source
                                          src={item.assetFolderPath}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    </div>
                                  )}
                                  {item.assetType === "Image" && (
                                    <img
                                      src={item.assetFolderPath}
                                      alt={item.assetName}
                                      className="rounded-2xl min-h-[20vh] object-cover max-h-[20vh] w-full"
                                    />
                                  )}
                                  {item.assetType === "Video" && (
                                    <div className="relative videobox z-0 w-full min-h-[20vh] max-h-[20vh]">
                                      <ReactPlayer
                                        url={item?.assetFolderPath}
                                        className="w-full rounded-2xl relative z-20 h-full videoinner object-fill"
                                        controls={false}
                                        playing={true}
                                      />
                                    </div>
                                  )}
                                  {item.youTubeURL && (
                                    <div className="relative rounded-2xl videobox z-0 w-full min-h-[20vh] max-h-[20vh]">
                                      <ReactPlayer
                                        url={item?.youTubeURL}
                                        className="w-full relative rounded-2xl z-20 h-full videoinner object-fill"
                                        controls={false}
                                        playing={true}
                                      />
                                    </div>
                                  )}
                                  {item.text && (
                                    <div className="w-full h-full ">
                                      <marquee
                                        className="text-lg h-full w-full text-black"
                                        scrollamount="10"
                                        direction={
                                          assetPreview?.scrollType == 1
                                            ? "right"
                                            : "left"
                                        }
                                      >
                                        {assetPreview?.text}
                                      </marquee>
                                    </div>
                                  )}
                                  {item.assetType === "DOC" && (
                                    <a
                                      href={item.assetFolderPath}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.assetName}
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
                                    {item.assetName && item?.assetName}
                                    {item.instanceName && item?.instanceName}
                                  </h5>
                                </td>
                                <td className="border-b border-[#eee]">
                                  <p className="text-black font-medium">
                                    {moment(item.createdDate).format(
                                      "YYYY-MM-DD HH:mm"
                                    )}
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
                            ))
                        ) : searchAsset !== "" ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center text-xl font-semibold h-60"
                            >
                              <p>No assets found related "{searchAsset}"</p>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center font-semibold h-60"
                            >
                              <p>No assets here, please upload some assets.</p>
                              <br />
                              <Link
                                to="/fileupload"
                                target="_blank"
                                className="border-2 mt-4 border-lightgray hover:bg-primary hover:text-white bg-SlateBlue  px-6 py-2 rounded-full ml-3"
                              >
                                Upload asset
                              </Link>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td>
                            {assetPreviewPopup && (
                              <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
                                <div
                                  ref={modalRef}
                                  className="fixed top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 asset-preview-popup w-full h-full flex items-end"
                                >
                                  <div className="border-0 rounded-lg shadow-lg relative min-w-[50vw] left-1/2 -translate-x-1/2 min-h-[70vh] max-h-[70vh] max-w-[80vw] bg-black outline-none focus:outline-none">
                                    <div className="p-1 z-50 rounded-full text-white bg-primary absolute top-[-15px] right-[-16px]">
                                      <button
                                        className="text-xl"
                                        onClick={() =>
                                          setAssetPreviewPopup(false)
                                        }
                                      >
                                        <AiOutlineCloseCircle className="text-2xl" />
                                      </button>
                                    </div>
                                    <div className="absolute inset-0 min-h-full min-w-full max-h-full max-w-full">
                                      {assetPreview && (
                                        <>
                                          {assetPreview?.assetType ===
                                            "OnlineImage" && (
                                            <div className="imagebox relative z-0 w-full h-full">
                                              <img
                                                src={
                                                  assetPreview.assetFolderPath
                                                }
                                                alt={assetPreview.assetName}
                                                className="imagebox relative h-full w-full"
                                              />
                                            </div>
                                          )}
                                          {assetPreview?.assetType ===
                                            "OnlineVideo" && (
                                            <div className="imagebox z-0 relative h-full">
                                              <video
                                                controls
                                                autoPlay={true}
                                                className="h-full w-full"
                                              >
                                                <source
                                                  src={
                                                    assetPreview.assetFolderPath
                                                  }
                                                  type="video/mp4"
                                                />
                                                Your browser does not support
                                                the video tag.
                                              </video>
                                            </div>
                                          )}
                                          {assetPreview?.assetType ===
                                            "Image" && (
                                            <img
                                              src={assetPreview.assetFolderPath}
                                              alt={assetPreview.assetName}
                                              className="imagebox relative h-full w-full"
                                            />
                                          )}
                                          {assetPreview?.assetType ===
                                            "Video" && (
                                            <div className="relative videobox w-full z-0">
                                              <ReactPlayer
                                                url={
                                                  assetPreview?.assetFolderPath
                                                }
                                                className="w-[90%] relative z-20 h-[90%] videoinner object-fill"
                                                controls={true}
                                                playing={true}
                                              />
                                            </div>
                                          )}
                                          {assetPreview?.youTubeURL && (
                                            <div className="relative videobox w-full">
                                              <ReactPlayer
                                                url={assetPreview?.youTubeURL}
                                                className="w-[90%] relative z-20 h-[90%] videoinner object-fill"
                                                controls={true}
                                                playing={true}
                                              />
                                            </div>
                                          )}
                                          {assetPreview?.text && (
                                            <div className="w-full h-full ">
                                              <marquee
                                                className="text-lg  h-full min-w-full max-w-full flex items-center text-white"
                                                scrollamount="10"
                                                direction={
                                                  assetPreview?.scrollType == 1
                                                    ? "right"
                                                    : "left"
                                                }
                                              >
                                                {assetPreview?.text}
                                              </marquee>
                                            </div>
                                          )}
                                          {assetPreview?.assetType ===
                                            "DOC" && (
                                            <div className="h-full flex text-white items-center justify-evenly">
                                              <a
                                                href={
                                                  assetPreview.assetFolderPath
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {assetPreview.assetName}
                                              </a>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

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
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Title"
                            className="bg-lightgray rounded-full px-3 py-2 w-full"
                          />
                        </div>
                      </li>

                      <li className="border-b-2 border-lightgray p-3">
                        <h3>Asset :</h3>
                        <div className="mt-2 ">
                          <div className="bg-lightgray rounded-full px-4 py-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                            {selectedAsset === "" && "Set Media"}
                            {selectedAsset &&
                              selectedAsset?.assetName &&
                              selectedAsset?.assetName}
                            {selectedAsset &&
                              selectedAsset?.assetName &&
                              selectedAsset?.instanceName}
                          </div>
                          <div className="flex items-center justify-center mt-4">
                            <button
                              className="border text-sm border-white bg-SlateBlue hover:bg-primary text-white rounded-full px-4 py-2 "
                              onClick={() => {
                                assetPreview && setAssetPreviewPopup(true);
                              }}
                            >
                              Preview
                            </button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {repeatDayWarning && (
                  <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full max-w-xl max-h-full">
                      <div className="relative bg-white rounded-lg shadow">
                        <div className="py-6 text-center">
                          <h3 className="mb-5 text-xl text-primary">
                            can you update all event ?
                          </h3>
                          <div className="flex justify-center items-center space-x-4">
                            <button
                              className="border-primary border rounded text-primary px-5 py-2 font-bold text-lg"
                              onClick={() => {
                                handleSave(0);
                                setRepeatDayWarning(false);
                              }}
                            >
                              No, cancel
                            </button>

                            <button
                              className="text-white bg-SlateBlue rounded text-lg font-bold px-5 py-2"
                              onClick={() => {
                                handleSave(1);
                                setRepeatDayWarning(false);
                              }}
                            >
                              Yes, I'm sure
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                              min={today}
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
                              min={editedStartDate}
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
                              // onChange={(e) => setEditedEndTime(e.target.value)}
                              className="bg-lightgray rounded-full px-3 py-2 w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <>
                        <div className="mt-5 text-black font-medium text-lg mr-2">
                          <input
                            type="checkbox"
                            checked={selectAllDays}
                            onChange={handleCheckboxChange}
                            id="repeat_all_day"
                          />
                          <label
                            className="ml-3 select-none"
                            htmlFor="repeat_all_day"
                          >
                            Repeat for All Day
                          </label>
                        </div>

                        <div>
                          {buttons.map((label, index) => (
                            <button
                              className={`border border-primary px-3 py-1 mr-2 mt-3 rounded-full ${
                                selectedDays[index] &&
                                "bg-SlateBlue border-white"
                              } 
                                `}
                              key={index}
                              onClick={() => handleDayButtonClick(index, label)}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
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
                                min={today}
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
                                // onChange={(e) =>setEditedEndTime(e.target.value)}
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
                            onClick={() => setShowRepeatSettings(true)}
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
                    setSelectedDays([]);
                    setSearchAsset("");
                    setAllAssets([...assets]);
                    setShowRepeatSettings(false);
                  }}
                >
                  Cancel
                </button>

                {isEditMode ? (
                  <button
                    className="border-2 border-lightgray hover:bg-primary hover:text-white bg-SlateBlue  px-6 py-2 rounded-full ml-3"
                    onClick={() => {
                      // handleSave()
                      // handleWarn()
                      selectedEvent?.isfutureDateExists == 0
                        ? handleSave()
                        : handleWarn();
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="border-2 border-white text-white hover:bg-primary hover:text-white bg-SlateBlue  px-6 py-2 rounded-full ml-3"
                    onClick={() => {
                      handleSave();
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
