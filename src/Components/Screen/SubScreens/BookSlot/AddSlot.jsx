import React, { Suspense, useEffect, useRef, useState } from "react";
import Loading from "../../../Loading";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdCloudUpload } from "react-icons/md";
import { FaPlusCircle, FaRegClock, FaRegQuestionCircle } from "react-icons/fa";
import {
  IncludeExclude,
  buttons,
  constructTimeObjects,
  getCurrentTime,
  getTimeZoneName,
  getTodayDate,
  greenOptions,
  kilometersToMeters,
  multiOptions,
  removeDuplicates,
  secondsToHMS,
  timeDifferenceInSeconds,
} from "../../../Common/Common";
import L from "leaflet";
import mapImg from "../../../../images/DisployImg/mapImg.png";
import {
  ADDALLEVENT,
  ADDUPDATESLOT,
  ALL_CITY,
  GET_TIMEZONE,
  PAYMENT_INTENT_CREATE_REQUEST,
  SCREEN_LIST,
  stripePromise,
} from "../../../../Pages/Api";
import { FiMapPin } from "react-icons/fi";
import {
  Circle,
  LayerGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import Select from "react-select";
import axios from "axios";
import { IoEarthSharp } from "react-icons/io5";
import { BsCheckCircleFill } from "react-icons/bs";
import moment from "moment";
import toast from "react-hot-toast";
import InputAuto from "../../../Common/InputAuto";
import MarkerClusterGroup from "react-leaflet-cluster";
import ThankYouPage from "./ThankYouPage";
import AddPayment from "./AddPayment";
import { Elements } from "@stripe/react-stripe-js";
import { handlePaymentIntegration } from "../../../../Redux/PaymentSlice";
import { useDispatch } from "react-redux";

const AddSlot = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const customIcon = new L.Icon({
    iconUrl: mapImg,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
  const dispatch = useDispatch()
  const Name = watch("name");
  const Email = watch("email");
  const PhoneNumber = watch("phone");
  const navigate = useNavigate();
  const optionSelect = Array.from({ length: 60 }, (_, index) => index + 1); // Create an array of numbers from 1 to 60
  const [sidebarload, setSidebarLoad] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [day, setDay] = useState([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState();
  const [repeat, setRepeat] = useState(false);
  const [page, setPage] = useState(1);
  const hiddenFileInput = useRef([]);
  const [screenData, setScreenData] = useState([]);
  const [screenArea, setScreenArea] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [city, setCity] = useState([]);
  const [Open, setOpen] = useState(false);
  const [selectAllScreen, setSelectAllScreen] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedDays, setSelectedDays] = useState(
    new Array(buttons.length).fill(false)
  );
  // const [searchArea, setSearchArea] = useState();
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [getallTime, setGetAllTime] = useState([
    {
      startTime: getCurrentTime(),
      startTimeSecond: 10,
      endTimeSecond: 15,
      file: "",
      endTime: getCurrentTime(),
    },
  ]);
  const center = [20.5937, 78.9629];
  // const [rangeValue, setRangeValue] = useState(5);
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [selectAllDays, setSelectAllDays] = useState(false);
  const [repeatDays, setRepeatDays] = useState([]);
  const [allTimeZone, setAllTimeZone] = useState([]);
  const [allArea, setAllArea] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1); // State to store the selected value
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const [selectedVal, setSelectedVal] = useState("");
  const [savedFile, setSavedFile] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const Screenoptions = multiOptions(screenData);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  const handleStartDateChange = (event) => {
    if (!repeat) {
      setEndDate(event.target.value);
    }
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const FetchAllCity = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: ALL_CITY,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        setAllCity(response.data.data);
        let arr = [];
        response.data.data?.map((item) => {
          arr.push(item?.text);
        });
        setCity(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const FetchScreen = (Params) => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${SCREEN_LIST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(Params),
    };
    axios
      .request(config)
      .then((response) => {
        if (response.data.data?.length > 0) {
          let arr = [...screenData];
          let combinedArray = arr.concat(response?.data?.data);
          let arr1 = [];
          combinedArray?.map((item) => {
            let obj = {
              let: item?.latitude,
              lon: item?.longitude,
              dis: Params?.distance,
            };
            arr1?.push(obj);
          });
          let uniqueArr = removeDuplicates(arr1);
          setScreenArea(uniqueArr);
          setScreenData(combinedArray);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    FetchAllCity();
  }, []);

  const handleNext = () => {
    let total = ""
    if (selectedScreens?.length === 0) {
      return toast.error("Please Select Screen");
    } else {
      let Price = 0;
      selectedScreens?.map((item) => {
        Price = Price + item?.Price;
      });
      setTotalPrice(Price);
      setTotalCost(totalDuration * Price);
      total = totalDuration * Price
    }
    const params = {
      "items": {
        "id": "0",
        "amount": String(total * 100)
      }
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: PAYMENT_INTENT_CREATE_REQUEST,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(params),
    }

    dispatch(handlePaymentIntegration({ config })).then((res) => {
      setClientSecret(res?.payload?.clientSecret)
      setPage(page + 1);
    }).catch((error) => {
      console.log('error', error)
    })
  };

  const onSubmit = (data) => {
    setPage(page + 1);
  };

  const handleRangeChange = (e, item) => {
    let arr = allArea.map((item1) => {
      if (item1?.searchValue?.value === item?.searchValue?.value) {
        let Params = {
          latitude: item?.searchValue?.latitude,
          longitude: item?.searchValue?.longitude,
          distance: parseInt(e.target.value),
          dates: constructTimeObjects(
            getallTime,
            startDate,
            endDate,
            repeat,
            day,
            selectedTimeZone,
            allTimeZone
          ),
        };

        FetchScreen(Params);
        return {
          searchValue: item?.searchValue,
          include: Number(item?.include),
          area: parseInt(e.target.value), // Assuming you want to modify the 'area' property of the matched item
        };
      } else {
        return item1;
      }
    });
    setAllArea(arr);
    setOpen(false);
    // setRangeValue(parseInt(e.target.value));
  };

  const handleSelectChange = (selected) => {
    setSelectedScreens(selected);
    if (selected?.length === screenData?.length) {
      setSelectAllScreen(true);
    } else {
      setSelectAllScreen(false);
    }
  };

  useEffect(() => {
    if (selectedScreens?.length === screenData?.length) {
      setSelectAllScreen(true);
    } else {
      setSelectAllScreen(false);
    }
  }, [selectedScreens]);

  const handleBack = () => {
    setPage(page - 1);
  };

  const handleClick = (index) => {
    hiddenFileInput.current[index].click();
  };

  const handleStartTimeChange = (index, value) => {
    const updatedTime = [...getallTime];
    updatedTime[index].startTime = value;
    setGetAllTime(updatedTime);
  };

  const handleStartTimeSecondChange = (index, value) => {
    const updatedTime = [...getallTime];
    updatedTime[index].startTimeSecond = value;
    setGetAllTime(updatedTime);
  };

  const handleEndTimeChange = (index, value) => {
    const updatedTime = [...getallTime];
    updatedTime[index].endTime = value;
    setGetAllTime(updatedTime);
  };

  const handleEndTimeSecondChange = (index, value) => {
    const updatedTime = [...getallTime];
    updatedTime[index].endTimeSecond = value;
    setGetAllTime(updatedTime);
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    const updatedAllTime = [...getallTime];
    updatedAllTime[index] = { ...updatedAllTime[index], file: file };
    setGetAllTime(updatedAllTime);
  };

  const FileUpload = (formData) => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADDALLEVENT}`,
      headers: {},
      data: formData,
    };
    axios
      .request(config)
      .then((response) => {
        let data = response?.data?.data;
        setSavedFile((prevSavedFiles) => [...prevSavedFiles, data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBookSlot = () => {
    const hasEmptyFile = getallTime.some((item) => item?.file === "");
    if (hasEmptyFile) {
      return toast.error("Please Upload File");
    } else {
      setFileLoading(true);
      let arr = [];
      let count = 0;
      getallTime?.map((item) => {
        let start = `${item?.startTime}:${item?.startTimeSecond}`;
        let end = `${item?.endTime}:${item?.endTimeSecond}`;
        let fileType = item?.file?.type;
        fileType = fileType.split("/");
        let obj = {
          ...item,
          Duration: timeDifferenceInSeconds(start, end),
        };
        count = count + timeDifferenceInSeconds(start, end);
        arr.push(obj);
        const formData = new FormData();
        formData.append("BookingSlotCustomerEventID", "0");
        formData.append("StartTime", start);
        formData.append("EndTime", end);
        formData.append("FilePath", "true");
        formData.append("AssetType", fileType[0]);
        formData.append("File", item?.file);
        FileUpload(formData);
      });

      if (!repeat) {
        setTotalDuration(count);
      } else {
        const total = countAllDaysInRange();
        setTotalDuration(total * count);
      }
      setGetAllTime(arr);
      // setPage(page + 1);
    }
  };

  useEffect(() => {
    if (page === 2 && fileLoading && savedFile?.length === getallTime?.length) {
      setFileLoading(false);
      setPage(page + 1);
    }
  }, [fileLoading, savedFile]);

  // for select all days to repeat day
  function handleCheckboxChange() {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = moment(end).diff(start, "days");
    if (daysDiff >= 6 && !selectAllDays) {
      setSelectAllDays(true);
    } else if (daysDiff < 6 && selectAllDays) {
      setSelectAllDays(false);
    }
    let days = [];
    for (let i = 0; i < daysDiff; i++) {
      days[i] = moment(moment(start).add(i, "day")).format("dddd");
    }
    days[days.length] = moment(end).format("dddd");
    setDay(days);
    let changeDayTrueOrFalse;
    for (let i = 0; i < days.length; i++) {
      changeDayTrueOrFalse = buttons.map((i) => days.includes(i));
    }
    setRepeatDays(changeDayTrueOrFalse);
    setSelectedDays(changeDayTrueOrFalse);
  }

  // Count the repeated days within the selected date range
  const countRepeatedDaysInRange = () => {
    let count = 0;
    for (let i = 0; i <= dayDifference; i++) {
      const dayIndex = (start.getDay() + i) % 7;
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

  useEffect(() => {
    if (repeat) {
      handleCheckboxChange();
    }
  }, [endDate, startDate]);

  // for select repeat day
  const handleDayButtonClick = (index, label) => {
    if (!repeatDays[index]) {
      toast.remove();
      return toast.error("Please change end date");
    }
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !selectedDays[index];
    const newSelectAllDays = newSelectedDays.every((day) => day === true);

    setSelectedDays(newSelectedDays);
    setSelectAllDays(newSelectAllDays);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value); // Update the state with the selected value
  };

  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter") {
  //     let obj = {
  //       searchValue: searchArea,
  //       include: Number(selectedValue),
  //       area: 20,
  //     };
  //     if (searchArea) {
  //       let arr = [...allArea];
  //       arr.push(obj);
  //       setAllArea(arr);
  //     }
  //     setSelectedVal("");
  //     setSearchArea("");
  //     setSelectedValue("");
  //   }
  // };

  const getSelectedVal = (value) => {
    const foundItem = allCity.find((item) => item?.text?.includes(value));
    if (foundItem) {
      // setSearchArea(foundItem);
      let obj = {
        searchValue: foundItem,
        include: Number(selectedValue),
        area: 20,
      };

      let Params = {
        latitude: foundItem?.latitude,
        longitude: foundItem?.longitude,
        distance: 20,
        dates: constructTimeObjects(
          getallTime,
          startDate,
          endDate,
          repeat,
          day,
          selectedTimeZone,
          allTimeZone
        ),
      };

      FetchScreen(Params);
      let arr = [...allArea];
      arr.push(obj);
      setAllArea(arr);
      setSelectedVal("");
      // setSearchArea("");
      setSelectedValue("");
    }
  };

  const getChanges = (value) => {
    console.log(value, "hello12345");
  };

  const handleScreenClick = (screen) => {
    setSelectedScreen(screen);
  };

  const handlebook = (paymentIntent) => {
    let Params = JSON.stringify({
      PaymentDetails : {
        ...paymentIntent,
        type:"Book Slot",
      },
      bookingSlotCustomerID: 0,
      name: Name,
      email: Email,
      phoneNumber: PhoneNumber,
      startDate: startDate,
      endDate: endDate,
      event: savedFile,
      isRepeat: repeat,
      repeatDays: day.join(", "),
      screenIDs: Screenoptions.map((item) => item.output).join(", "),
      totalCost: totalCost,
      timezoneID: selectedTimeZone,
      systemTimeZone: new Date()
        .toLocaleDateString(undefined, {
          day: "2-digit",
          timeZoneName: "long",
        })
        .substring(4),
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADDUPDATESLOT}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: Params,
    };
    axios
      .request(config)
      .then((response) => {
        setPage(page + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const TimeZone = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_TIMEZONE}`,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        const CurrentTimeZone = new Date()
          .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
          })
          .substring(4);
        response?.data?.data?.map((item) => {
          if (item?.timeZoneName === CurrentTimeZone) {
            setSelectedTimeZone(item?.timeZoneID);
          }
        });
        setAllTimeZone(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (page === 2) {
      TimeZone();
    }
  }, [page]);

  const handleSelectTimeZoneChange = (event) => {
    setSelectedTimeZone(event?.target.value);
  };

  return (
    <>
      {sidebarload && <Loading />}

      {!sidebarload && <Suspense fallback={<Loading />}></Suspense>}
      <div className="h-screen w-screen">
        {fileLoading && <Loading />}
        {page === 1 && (
          <>
            <div className="w-full h-full p-5 flex items-center justify-center">
              <div className="lg:w-[900px] md:w-[700px] w-full  h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg">
                <div className="text-2xl font-semibold">Book Slot</div>
                <div className="rounded-lg shadow-md bg-white p-5 h-[95%]">
                  <form
                    className="flex flex-col gap-2 h-full"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name *
                    </label>
                    <input
                      {...register("name", {
                        required: "Name is required",
                      })}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter Your Name"
                      className="formInput"
                    />
                    {errors.name && (
                      <span className="error">{errors.name.message}</span>
                    )}

                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email *
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter Your Email"
                      className="formInput"
                    />
                    {errors.email && (
                      <span className="error">{errors.email.message}</span>
                    )}

                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="number"
                      name="phone"
                      id="phone"
                      placeholder="Enter Your Phone Number"
                      {...register("phone", {
                        required: "Phone Number is required",
                        pattern: {
                          value: /^\d{10}$/, // Adjust the regular expression as per your phone number format
                          message: "Invalid phone number",
                        },
                      })}
                      className="formInput"
                    />
                    {errors.phone && (
                      <span className="error">{errors.phone.message}</span>
                    )}
                    <div className="w-full h-full">
                      <div className="flex justify-end pt-4 h-full items-end">
                        <button
                          className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                          type="submit"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
        {page === 2 && (
          <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
              <div className="grid grid-cols-4 gap-4 w-full h-full">
                <div className="col-span-4">
                  <div className="rounded-lg shadow-md bg-white p-5 flex flex-col gap-4 h-full">
                    <div>TimeZone</div>
                    <div className="flex items-center gap-2">
                      {/* <IoEarthSharp /> */}
                      <select
                        className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                        id="selectOption"
                        value={selectedTimeZone}
                        onChange={handleSelectTimeZoneChange}
                      >
                        {allTimeZone?.map((timezone) => {
                          return (
                            <option
                              value={timezone.timeZoneID}
                              key={timezone.timeZoneID}
                            >
                              {timezone.timeZoneName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {!repeat && (
                      <div className="grid grid-cols-4 gap-4">
                        <div className="relative w-full col-span-2">
                          <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="formInput"
                          />
                        </div>
                        <div className="relative w-full col-span-2">
                          <input
                            type="date"
                            value={endDate}
                            className="formInput"
                            disabled={!repeat}
                          />
                        </div>
                      </div>
                    )}
                    {repeat && (
                      <div>
                        <div className="icons flex items-center">
                          <div>
                            <button
                              className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                              onClick={() => setRepeat(false)}
                            >
                              <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="relative w-full col-span-2">
                            <input
                              type="date"
                              value={startDate}
                              onChange={handleStartDateChange}
                              className="formInput"
                            />
                          </div>
                          <div className="relative w-full col-span-2">
                            <input
                              type="date"
                              value={endDate}
                              onChange={handleEndDateChange}
                              className="formInput"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="overflow-auto max-h-80">
                        {getallTime?.map((item, index) => {
                          return (
                            <div
                              className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 gap-4 mb-3"
                              key={index}
                            >
                              <div className="relative w-full col-span-1">
                                <input
                                  value={item?.startTime}
                                  type="time"
                                  className="formInput"
                                  onChange={(e) =>
                                    handleStartTimeChange(index, e.target.value)
                                  }
                                />
                              </div>
                              <div className="relative w-full col-span-1">
                                <select
                                  value={item?.startTimeSecond}
                                  className="formInput"
                                  onChange={(e) =>
                                    handleStartTimeSecondChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option label="Select Second" value="" />
                                  {optionSelect.map((number) => (
                                    <option key={number} value={number}>
                                      {number}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="relative w-full col-span-1">
                                <input
                                  type="time"
                                  value={item?.endTime}
                                  className="formInput"
                                  onChange={(e) =>
                                    handleEndTimeChange(index, e.target.value)
                                  }
                                />
                              </div>
                              <div className="relative w-full col-span-1">
                                <select
                                  value={item?.endTimeSecond}
                                  className="formInput"
                                  onChange={(e) =>
                                    handleEndTimeSecondChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option label="Select Second" value="" />
                                  {optionSelect.map((number) => (
                                    <option key={number} value={number}>
                                      {number}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="relative w-full col-span-1 flex gap-4 items-center">
                                <input
                                  type="file"
                                  id={`upload-button-${index}`}
                                  accept="image/*, video/*"
                                  style={{ display: "none" }}
                                  ref={(input) =>
                                    (hiddenFileInput.current[index] = input)
                                  }
                                  onChange={(e) => handleFileChange(index, e)}
                                />
                                <button onClick={() => handleClick(index)}>
                                  <MdCloudUpload size={30} />
                                </button>
                                <FaPlusCircle
                                  className="cursor-pointer"
                                  size={30}
                                  onClick={() => {
                                    setGetAllTime([
                                      ...getallTime,
                                      {
                                        startTime: getCurrentTime(),
                                        startTimeSecond: 10,
                                        endTimeSecond: 15,
                                        file: "",
                                        endTime: getCurrentTime(),
                                      },
                                    ]);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {!repeat && (
                        <div className="flex gap-3 items-center mt-2">
                          <input
                            type="checkbox"
                            onChange={() => setRepeat(true)}
                          />
                          <div>Repeat</div>
                        </div>
                      )}
                      {repeat && (
                        <div className="flex flex-col gap-3 mt-2">
                          <div className=" text-black font-medium text-lg">
                            <label>
                              Repeating {countAllDaysInRange()} Day(s)
                            </label>
                          </div>
                          <div className="flex flex-row gap-3">
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
                                className={`border border-primary px-3 py-1 mr-2 mb-2 rounded-full ${selectedDays[index] &&
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
                        </div>
                      )}
                    </div>
                    <div className="w-full h-full">
                      <div className="flex justify-end h-full items-end">
                        <button
                          className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                          onClick={() => handleBookSlot()}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {page === 3 && (
          <>
            <div className="w-full h-full p-5 flex items-center justify-center ">
              <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg ">
                <div className="flex flex-row items-center gap-2">
                  <div className="icons flex items-center">
                    <div>
                      <button
                        className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                        onClick={() => handleBack()}
                      >
                        <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                      </button>
                    </div>
                  </div>
                  <div className="text-2xl font-semibold">Find Your Screen</div>
                </div>
                <div className="grid grid-cols-3 gap-4 h-[93%] overflow-auto">
                  <div className="col-span-2 rounded-lg shadow-md bg-white p-5">
                    <div className="flex flex-col gap-2 h-full">
                      <div className="flex gap-2 items-center">
                        <IoEarthSharp />
                        <span className="">
                          {getTimeZoneName(allTimeZone, selectedTimeZone)}
                        </span>
                      </div>
                      {allArea?.map((item, index) => {
                        return (
                          <div
                            className="flex flex-row gap-2 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            key={index}
                          >
                            <span className="flex items-center ">
                              <FiMapPin className="w-5 h-5 text-black " />
                            </span>
                            <div className="text-base flex items-center">
                              <h2>{item?.searchValue?.text}</h2>
                            </div>

                            <span className="flex items-center justify-end">
                              <div className=" flex flex-row items-center border rounded-lg">
                                <div
                                  className="flex items-center"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setOpen(true);
                                  }}
                                >
                                  <div className="text-black p-1 px-2 no-underline hidden md:block lg:block cursor-pointer">
                                    +{item?.area} km
                                  </div>
                                </div>
                                {selectedItem === item && Open && (
                                  <div
                                    id="ProfileDropDown"
                                    className={`rounded ${Open ? "none" : "hidden"
                                      } shadow-md bg-white absolute mt-44 z-[9999] w-48`}
                                  >
                                    <div>
                                      <div className="border-b flex justify-center">
                                        <div className="p-2">
                                          Current city only
                                        </div>
                                      </div>
                                      <div className="p-2 flex gap-2 items-center">
                                        <BsCheckCircleFill className="text-blue-6 00" />
                                        Cities Within Radius
                                      </div>
                                      <div className="relative mb-8 mx-2">
                                        <div>
                                          <input
                                            id="labels-range-input"
                                            type="range"
                                            min="0"
                                            max="30"
                                            step="5"
                                            value={item?.area}
                                            onChange={(e) =>
                                              handleRangeChange(e, item)
                                            }
                                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                          />
                                          <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
                                            5
                                          </span>

                                          <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                                            30
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </span>
                          </div>
                        );
                      })}
                      <div className="grid grid-cols-3 gap-4">
                        <select
                          className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                          value={selectedValue} // Set the selected value from state
                          onChange={handleChange} // Handle change event
                        >
                          {IncludeExclude.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <div className="col-span-2">
                          <InputAuto
                            pholder="Search"
                            data={city}
                            onSelected={getSelectedVal}
                            onChange={getChanges}
                            // handleKeyPress={handleKeyPress}
                            setSelectedVal={setSelectedVal}
                            selectedVal={selectedVal}
                          />
                        </div>
                      </div>
                      <div className="mt-5 h-full">
                        <div className="h-full">
                          <MapContainer
                            center={center}
                            zoom={4}
                            maxZoom={18}
                            style={{
                              width: "100%",
                              height: "100%",
                              zIndex: 0,
                            }}
                          >
                            <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>
                            <LayerGroup>
                              {screenArea?.map((item) => {
                                return (
                                  <Circle
                                    center={[item?.let, item?.lon]}
                                    pathOptions={greenOptions}
                                    radius={kilometersToMeters(item?.dis)}
                                  />
                                );
                              })}
                            </LayerGroup>
                            <MarkerClusterGroup>
                              {screenData.map((screen, index) => {
                                return (
                                  <>
                                    <Marker
                                      key={index}
                                      position={[
                                        screen.latitude,
                                        screen.longitude,
                                      ]}
                                      icon={customIcon}
                                      eventHandlers={{
                                        click: () =>
                                          handleScreenClick &&
                                          handleScreenClick(screen),
                                      }}
                                    >
                                      <Popup>
                                        <h3 className="flex flex-row gap-1">
                                          <span>Location :</span>
                                          <span>
                                            {selectedScreen?.googleLocation}
                                          </span>
                                        </h3>
                                      </Popup>
                                    </Marker>
                                  </>
                                );
                              })}
                            </MarkerClusterGroup>
                          </MapContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white shadow-md p-5 flex flex-col gap-2">
                    <div>Reach</div>
                    <div className="text-2xl">
                      {selectedScreens?.length} Screens
                    </div>
                    <div>
                      Do you want to book your slot for all screens or any
                      particular screen?
                    </div>

                    <div className="grid grid-cols-4 gap-4 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <div className="col-span-3">
                        <h2>All Screen</h2>
                      </div>

                      <span className="col-span-1 flex items-center justify-end">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          value={selectAllScreen}
                          disabled={screenData?.length === 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectAllScreen(true);
                              setSelectedScreens(Screenoptions);
                            } else {
                              setSelectAllScreen(false);
                              setSelectedScreens([]);
                            }
                          }}
                        />
                      </span>
                    </div>
                    <Select
                      value={selectedScreens}
                      onChange={handleSelectChange}
                      options={Screenoptions}
                      isMulti
                    />
                    <div className="h-full w-full flex justify-center items-end">
                      <div className="flex justify-center">
                        <button
                          className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                          onClick={() => handleNext()}
                        >
                          Book Your Slot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {page === 4 && clientSecret && (
          <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
              <Elements options={options} stripe={stripePromise}>
                <AddPayment
                  selectedScreens={selectedScreens}
                  totalDuration={totalDuration}
                  totalPrice={totalPrice}
                  totalCost={totalCost}
                  handlebook={handlebook}
                  handleBack={handleBack}
                  selectedTimeZone={selectedTimeZone}
                  allTimeZone={allTimeZone}
                  setPage={setPage}
                  page={page}
                />
              </Elements>
            </div>
          </div>
        )}
        {page === 5 && <ThankYouPage navigate={navigate} />}
      </div>
    </>
  );
};

export default AddSlot;
