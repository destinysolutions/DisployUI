import axios from "axios";
import moment from "moment";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { ADD_EVENT } from "../../Pages/Api";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { handleGetAllAssets } from "../../Redux/Assetslice";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../Redux/AppsSlice";
import { useDispatch } from "react-redux";
import PreviewAssets from "../Common/PreviewAssets";
import { CurrentDateFormat } from "../Common/Common";
import { HiDocumentDuplicate } from "react-icons/hi2";
const AddEventScheduleEditors = ({
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
  const dispatch = useDispatch();
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

  // useEffect(() => {
  //   const handleDocumentClick = () => {
  //     onClose();
  //   };

  //   document.addEventListener("click", handleDocumentClick);

  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // }, []);

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setEditedStartTime(newStartTime);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEditedEndTime(newEndTime);
  };

  const currentDate = moment();
  // const today = moment().format("YYYY-MM-DD");

  let currTimestamp = Date.now();
  const todaydate = (new Date(currTimestamp)).toUTCString();
  const today = CurrentDateFormat(todaydate)
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (!showRepeatSettings) {
      setEditedStartDate(newStartDate);
      const newEndDate = calculateEndDate(newStartDate, editedStartTime);
      setEditedEndDate(newEndDate);
    }

    if (showRepeatSettings) {
      setEditedStartDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newStartDate = e.target.value;
    setEditedEndDate(newStartDate);
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
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !selectedDays[index];
    const newSelectAllDays = newSelectedDays.every((day) => day === true);

    if (
      moment(selectedSlot?.end).format("YYYY-MM-DD") === editedEndDate &&
      newSelectedDays[index]
    ) {
      toast.remove();
      toast.error("Please change End Date");
      return;
    }
    setSelectedDays(newSelectedDays);
    setSelectAllDays(newSelectAllDays);
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
    // if (editedStartDate < currentDate.format("YYYY-MM-DD")) {
    if (editedStartDate < today) {
      toast.remove();
      toast.error("Please Change Start Date.");
      return;
    } else if (showRepeatSettings) {
      // if (editedEndDate < currentDate.format("YYYY-MM-DD")) {
      if (editedEndDate < today) {
        toast.remove();
        toast.error("Please Change End Date.");
        return;
      } else if (editedEndDate < editedStartDate) {
        toast.remove();
        toast.error("Please Change End Date.");
        return;
      } else if (editedStartTime > editedEndTime) {
        toast.remove();
        toast.error("Please Change End Time.");
        return;
      }
    } else if (editedEndTime < editedStartTime) {
      toast.remove();
      toast.error("Please Change End Time.");
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
      setSelectedAsset(null);
      setTitle("");
      onClose();
      setSelectedRepeatDay("");
      setSelectedDays([]);
    }
    if (
      !JSON.stringify(selectedEvent?.repeatDay) ===
      JSON.stringify(selectedRepeatDay)
    ) {
      toast.remove();
      toast.error("Repeat Day has changed!");
    }
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
      .then(() => {
        onDelete(selectedEvent.id, selectedEvent?.macids);
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
    }
  });

  useEffect(() => {
    if (myEvents.length > 0) {
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
          (asset) =>
            asset.assetID === assetId && asset?.assetName !== "New Folder"
        );
        if (previousSelectedAsset) {
          setSelectedAsset(previousSelectedAsset);
          setAssetPreview(previousSelectedAsset);
        }

        setTitle(selectedEvent.title);
        setSelectedColor(selectedEvent.color);
        setEditedStartDate(moment(selectedEvent.start).format("YYYY-MM-DD"));
        setEditedStartTime(moment(selectedEvent.start).format("HH:mm"));
        setEditedEndDate(moment(selectedEvent.end).format("YYYY-MM-DD"));
        setEditedEndTime(moment(selectedEvent.end).format("HH:mm"));
        const selectedAsset = allAssets.find(
          (asset) =>
            selectedEvent?.asset === asset?.assetID &&
            asset?.assetName !== "New Folder"
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
  }, [isOpen, selectedEvent, selectedSlot]);

  // for clear selectedDays
  useEffect(() => {
    setAllAssets([...assets]);
  }, [textScroll.loading, youtube.loading, loading]);

  useEffect(() => {
    return () => {
      setSelectedDays(Array(buttons.length).fill(false));
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const isClosed = localStorage.getItem("isWindowClosed");
      if (isClosed === "true") {
        dispatch(handleGetAllAssets({ token }));
        dispatch(handleGetYoutubeData({ token }));
        dispatch(handleGetTextScrollData({ token }));
        localStorage.setItem("isWindowClosed", "false");
        // window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  let viewerSrc = "";

  if (
    assetPreview?.fileExtention === ".pdf" ||
    assetPreview?.fileExtention === ".txt"
  ) {
    viewerSrc = assetPreview?.assetFolderPath;
  } else if (assetPreview?.fileExtention === ".csv") {
    viewerSrc = `https://docs.google.com/gview?url=${assetPreview?.assetFolderPath}&embedded=true`;
  } else if (
    assetPreview?.fileExtention === ".pptx" ||
    assetPreview?.fileExtention === ".ppt" ||
    assetPreview?.fileExtention === ".docx" ||
    assetPreview?.fileExtention === ".doc" ||
    assetPreview?.fileExtention === ".xlsx" ||
    assetPreview?.fileExtention === ".xls"
  ) {
    // viewerSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${assetPreview?.assetFolderPath}`;
    viewerSrc = `https://docs.google.com/viewer?url=${assetPreview?.assetFolderPath}&embedded=true`

  }

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-8xl">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="relative">
              <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select Assets and Schedule Time
                </h3>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => {
                    onClose();
                  }}
                />
              </div>

              <div className="grid grid-cols-12 relative max-h-[400px] vertical-scroll-inner p-5">
                <div className="lg:col-span-9 md:col-span-8 sm:col-span-12 xs:col-span-12 rounded-lg">
                  <div className="my-4 relative ">
                    <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                    <input
                      type="text"
                      placeholder=" Search by Asset"
                      className="border border-primary rounded-full px-7 py-2 search-user"
                      onChange={(e) =>
                        debounceForSearchAsset(
                          e.target.value.toLocaleLowerCase()
                        )
                      }
                    />
                  </div>
                  
                    <div className="overflow-x-scroll sc-scrollbar rounded-lg bg-white shadow-2xl md:pb-1">
                      <div className="max-w-full custom-scrollbar max-h-[400px]">
                        <table
                          className="w-full lg:table-fixed md:table-fixed sm:table-auto xs:table-auto text-sm break-words "
                          cellPadding={15}
                        >
                          <thead className="sticky z-20">
                            <tr className="table-head-bg text-left mb-5">
                              <th className="py-4 px-4 font-semibold text-black md:pl-10">
                                Assets
                              </th>
                              <th className="py-4 px-4 font-semibold text-black">
                                Assets Name
                              </th>
                              <th className="py-4 px-4 font-semibold text-black">
                                Date Added
                              </th>
                              {/* <th className="min-w-[120px] py-4 px-4 font-semibold text-black">
                            Associated Schedule
                          </th> */}
                              <th className="py-4 px-4 font-semibold text-black">
                                Resolution
                              </th>
                              {/* <th className="py-4 px-4 font-semibold text-black">
                            Tags
                          </th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {allAssets.length > 0 ? (
                              allAssets
                                .filter(
                                  (item) =>
                                    item?.assetType !== "Folder" 
                                )
                                .map((item, index) => (
                                  <tr
                                    key={index}
                                    className={`${selectedAsset === item
                                        ? "bg-[#f3c953]"
                                        : ""
                                      } border-b border-[#eee] mt-5`}
                                    onClick={() => {
                                      handleAssetAdd(item);
                                    }}
                                  >
                                    <td className="w-full flex justify-center items-center">
                                      {item.assetType === "OnlineImage" && (
                                        <div className="imagebox relative z-0">
                                          <img
                                            src={item.assetFolderPath}
                                            alt={item.assetName}
                                            className="videoTab rounded-2xl object-cover"
                                          />
                                        </div>
                                      )}

                                      {item.assetType === "Image" && (
                                        <img
                                          src={item.assetFolderPath}
                                          alt={item.assetName}
                                          className="videoTab rounded-2xl object-cover"
                                        />
                                      )}
                                      {(item.assetType === "Video" ||
                                        item.assetType === "OnlineVideo") && (
                                          <div>
                                            <ReactPlayer
                                              url={item?.assetFolderPath}
                                              className="rounded-2xl videoTab w-full h-full"
                                              controls={false}
                                              playing={false}
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
                                     {/* {item.assetType === "DOC" && (
                                        <a
                                          href={item.assetFolderPath}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {item.assetName}
                                        </a>
                                     )}*/}

                                     {item.assetType === "DOC" && (
                                      <div className="flex justify-center items-center">
                                      <HiDocumentDuplicate className=" text-primary text-4xl"/>
                                      </div>
                                    )}
                                    </td>
                                    <td className="text-center">
                                      <h5
                                        className="font-medium text-black cursor-pointer"
                                        onClick={() => {
                                          handleAssetAdd(item);
                                        }}
                                      >
                                        {item.assetName && item?.assetName}
                                        {item.instanceName &&
                                          item?.instanceName}
                                      </h5>
                                    </td>
                                    <td className="text-center">
                                      <p className="text-black font-medium">
                                        {moment(item.createdDate).format(
                                          "DD-MM-YYYY HH:mm"
                                        )}
                                      </p>
                                    </td>
                                    {/* <td className="">
                                  <p className="text-black font-medium">
                                    Schedule Name Till 28 June 2023
                                  </p>
                                </td> */}
                                    <td className="text-center">
                                      <p className="text-black font-medium">
                                        {item.resolutions}
                                      </p>
                                    </td>
                                    {/* <td className="">
                                  <p className="text-black font-medium">
                                    Tags, Tags
                                  </p>
                                </td> */}
                                  </tr>
                                ))
                            ) : searchAsset !== "" ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center text-xl font-semibold h-60"
                                >
                                  <p>No assets found related "{searchAsset}"</p>
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center font-semibold h-60"
                                >
                                  <p>
                                    No assets here, please upload some assets.
                                  </p>
                                  <br />
                                  <Link
                                    to="/fileupload"
                                    target="_blank"
                                    className="border-2 mt-4 border-lightgray hover:bg-primary hover:text-white bg-SlateBlue  px-6 py-2 rounded-full ml-3"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        localStorage.setItem(
                                          "isWindowClosed",
                                          "false"
                                        );
                                      }}
                                    >
                                      Upload asset
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                </div>

                <div className="md:ml-5 sm:ml-0 xs:ml-0 rounded-lg lg:col-span-3 md:col-span-4 sm:col-span-12 xs:col-span-12 xs:mt-9 sm:mt-9 lg:mt-4 md:mt-4">
                  <div className="bg-white shadow-2xl rounded-md max-h-[450px] vertical-scroll-inner">
                    <div className="p-3">
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
                    {repeatDayWarning && (
                      <div className="bg-black bg-opacity-50 justify-center ite
                      
                      ms-center flex vertical-scroll-inner fixed inset-0 z-9990 outline-none focus:outline-none">
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
                        <div className="relative rounded-lg lg:col-span-3 md:col-span-4 sm:col-span-12 xs:col-span-12 xs:mt-9 sm:mt-9 lg:mt-0 md:mt-0  p-4">
                          <div className="backbtn absolute top-[5px] left-[5px] ">
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
                            <label>
                              Repeating {countAllDaysInRange()} Day(s)
                            </label>
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
                                  className={`border border-primary px-3 py-1 mr-2 mt-3 rounded-full ${selectedDays[index] &&
                                    "bg-SlateBlue border-white"
                                    } 
                                `}
                                  key={index}
                                  onClick={() =>
                                    handleDayButtonClick(index, label)
                                  }
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
                                <div className="mt-2">
                                  <input
                                    type="date"
                                    value={editedStartDate}
                                    className="bg-lightgray rounded-full px-3 py-2 w-full"
                                    readOnly
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

                          <div className="p-3">
                            <div className="mb-2">Repeat Multiple Day</div>
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
              </div>
              <div className="col-span-12 bg-white schedual-btn">
                <div className="flex justify-center ">
                  <button
                    className="border-2 border-lightgray hover:bg-primary hover:text-white   px-5 py-2 rounded-full"
                    onClick={() => {
                      onClose();
                      setSelectedDays([]);
                      setSearchAsset("");
                      setSelectedAsset(null);
                      setTitle("");
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
        </div>
      </div>

      {assetPreviewPopup && (
        <PreviewAssets
          assetPreview={assetPreview}
          setAssetPreviewPopup={setAssetPreviewPopup}
        />
      )}
    </>
  );
};

export default AddEventScheduleEditors;
