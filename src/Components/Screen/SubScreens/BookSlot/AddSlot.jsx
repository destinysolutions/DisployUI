/* eslint-disable react/jsx-pascal-case */
import React, { Suspense, useEffect, useRef, useState } from "react";
import Loading from "../../../Loading";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIosNew, MdCloudUpload } from "react-icons/md";
import { FaPlusCircle, } from "react-icons/fa";
import {
  buttons,
  constructTimeObjects,
  getCurrentTimewithSecound,
  getTodayDate,
  multiOptions,
  removeDuplicates,
} from "../../../Common/Common";
import {
  ADDALLEVENT,
  ADDUPDATESLOT,
  GET_ALL_COUNTRY,
  GET_TIMEZONE_TOKEN,
  PAYMENT_INTENT_CREATE_REQUEST,
  SCREEN_LIST,
  stripePromise,
} from "../../../../Pages/Api";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import ThankYouPage from "./ThankYouPage";
import AddPayment from "./AddPayment";
import { Elements } from "@stripe/react-stripe-js";
import { handlePaymentIntegration } from "../../../../Redux/PaymentSlice";
import { useDispatch } from "react-redux";
import { handleAllTimeZone } from "../../../../Redux/CommonSlice";
import { RiDeleteBin5Line } from "react-icons/ri";
import ImageUploadPopup from "./ImageUploadPopup";
import { customTimeOrhour } from "../../../Common/Util";
import { handleGetState } from "../../../../Redux/SettingUserSlice";
import 'react-time-picker/dist/TimePicker.css';
import AddSoltPage_2 from "./AddSoltPage_2";
import BookSlotMap from "./BookSlotMap";


const AddSlot = () => {
  const { register, handleSubmit, watch, formState: { errors }, } = useForm();

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
  const [countries, setCountries] = useState([]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selecteStates, setSelecteStates] = useState("");
  const [states, setStates] = useState([]);

  const [allCity, setAllCity] = useState([]);

  const [getallTime, setGetAllTime] = useState([
    {
      startTime: getCurrentTimewithSecound(),
      startTimeSecond: 10,
      endTimeSecond: 15,
      horizontalImage: "",
      verticalImage: "",
      endTime: getCurrentTimewithSecound(),
      sequence: '',
      afterevent: '',
      aftereventType: '',
    },
  ]);

  const [allSlateDetails, setallSlateDetails] = useState({
    Industry: null,
    country: null,
    selecteScreens: [],
    terms: false,
    refCode: 'NO',
    refVale: ''
  });
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
    fetch(GET_ALL_COUNTRY)
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.data);
      })
      .catch((error) => {
        console.log("Error fetching countryID data:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry !== "") {
      dispatch(handleGetState(selectedCountry))
        ?.then((res) => {
          console.log('res :>> ', res);
          setStates(res?.payload?.data);
        })
        .catch((error) => {
          console.log("Error fetching states data:", error);
        });
    }
  }, [selectedCountry]);

  const handleNext = () => {
    console.log('selectedScreens :>> ', selectedScreens);
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
    console.log('params :>> ', params);


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
    console.log('data :>> ', data);
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
            allTimeZone,
            selectedCountry,
            selecteStates,
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

  const handleAddItem = () => {
    setGetAllTime([
      ...getallTime,
      {
        startTime: moment().format("hh:mm:ss"),
        startTimeSecond: 10,
        endTimeSecond: 15,
        verticalImage: "",
        horizontalImage: "",
        sequence: '',
        endTime: moment().format("hh:mm:ss")
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setGetAllTime(getallTime.filter((_, i) => i !== index));
  };

  const handleOpenImagePopup = (index) => {
    setCurrentIndex(index);
    setPopupVisible(true);
  }

  const handleClick = (index) => {
    hiddenFileInput.current[index].click();
  };

  const handlePopupSubmit = (index, verticalImage, horizontalImage) => {
    const updatedItems = [...getallTime];
    updatedItems[index] = { ...updatedItems[index], verticalImage: verticalImage, horizontalImage: horizontalImage };
    setGetAllTime(updatedItems);
  };

  const handleStartTimeChange = (e, index) => {
    const { value } = e.target
    const updatedTime = [...getallTime];
    updatedTime[index].startTime = value;
    setGetAllTime(updatedTime);

  };

  const handleEndTimeChange = (e, index) => {
    const { value } = e.target
    const updatedTime = [...getallTime];
    updatedTime[index].endTime = value;
    setGetAllTime(updatedTime);
  };

  const handleSequenceChange = (index, value) => {
    const sequence = [...getallTime];
    sequence[index].sequence = value;
    setGetAllTime(sequence);
  };

  const handleaftereventChange = (e, index) => {
    const { value } = e.target
    const afterevent = [...getallTime];
    afterevent[index].afterevent = value;
    setGetAllTime(afterevent);
  };

  const handleAftereventTypeChange = (value, index) => {
    // const { value } = e.target
    const aftereventType = [...getallTime];
    aftereventType[index].aftereventType = value;
    setGetAllTime(aftereventType);
  };

  const FileUpload = (formData) => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADDALLEVENT}`,
      headers: {},
      data: formData,
    };
    axios.request(config).then((response) => {
      let data = response?.data?.data;
      setSavedFile((prevSavedFiles) => [...prevSavedFiles, data]);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  // const handleBookSlot = () => {
  //   const hasMissingImages = getallTime.some((item) => { return !item.verticalImage && !item.horizontalImage });
  //   if (hasMissingImages) {
  //     return toast.error("Please upload valid Vertical and Horizontal images.");
  //   } else {
  //     setFileLoading(true);
  //     let arr = [];
  //     let count = 0;
  //     getallTime?.map((item) => {

  //       let start = `${item?.startTime}:${item?.startTimeSecond}`;
  //       let end = `${item?.endTime}:${item?.endTimeSecond}`;
  //       let horizontalfileType = item?.horizontalImage?.type || null;
  //       let verticalImagefileType = item?.verticalImage?.type || null;

  //       horizontalfileType = horizontalfileType?.split("/");
  //       verticalImagefileType = verticalImagefileType?.split("/");
  //       let obj = { ...item, Duration: timeDifferenceInSeconds(start, end) };

  //       count = count + timeDifferenceInSeconds(start, end);
  //       arr.push(obj);
  //       const formData = new FormData();
  //       formData.append("BookingSlotCustomerEventID", "0");
  //       formData.append("StartTime", start);
  //       formData.append("EndTime", end);
  //       formData.append("FilePath", "true");
  //       formData.append("horizontalfileType", horizontalfileType);
  //       formData.append("verticalImagefileType", verticalImagefileType);
  //       formData.append("File", item?.file);
  //       formData.append("horizontalFile", item?.horizontalImage || null);
  //       formData.append("verticalFile", item?.verticalImage || null);
  //       FileUpload(formData);
  //     });

  //     if (!repeat) {
  //       setTotalDuration(count);
  //     } else {
  //       const total = countAllDaysInRange();
  //       setTotalDuration(total * count);
  //     }
  //     setGetAllTime(arr);
  //     setPage(page + 1);
  //   }
  // };

  const handleBookSlot = () => {
    const hasMissingImages = getallTime.some((item) => { return !item.verticalImage && !item.horizontalImage });
    if (hasMissingImages) {
      return toast.error("Please upload valid Vertical and Horizontal images.");
    } else {
      setPage(page + 1);
      console.log("getallTime", getallTime);
    }
  };

  useEffect(() => {
    if (page === 3 && fileLoading && savedFile?.length === getallTime?.length) {
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
          allTimeZone,
          selectedCountry,
          selecteStates,
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





  const handlebook = (paymentMethod) => {
    console.log('allSlateDetails :>> ', allSlateDetails);
    let Params = JSON.stringify({
      PaymentDetails: {
        ...paymentMethod,
        AutoPay: true,
        type: "Book Slot",
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
      CountryID: selectedCountry,
      StatesID: selecteStates,
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
      url: GET_TIMEZONE_TOKEN,
      headers: {
        "Content-Type": "application/json",
      },
    }

    dispatch(handleAllTimeZone({ config }))
      .then((response) => {
        const CurrentTimeZone = new Date()
          .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
          })
          .substring(4);
        response?.payload?.data?.map((item) => {
          if (item?.timeZoneName === CurrentTimeZone) {
            setSelectedTimeZone(item?.timeZoneID);
          }
        });
        setAllTimeZone(response?.payload?.data);
      })
      .catch((error) => {
        console.log('error', error)
      })
  };

  useEffect(() => {
    if (page === 3) {
      TimeZone();
    }
  }, [page]);

  const handleSelectTimeZoneChange = (event) => {
    setSelectedTimeZone(event?.target.value);
  };

  const handleSelectCountries = (event) => {
    setSelectedCountry(event?.target.value);
  };

  const handleSelectStatesChange = (event) => {
    setSelecteStates(event?.target.value);
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
              <div className="lg:w-[900px] md:w-[700px] w-full  h-[90vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg">
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
        {page === 2 && (<AddSoltPage_2 page={page} setPage={setPage} countries={countries} setallSlateDetails={setallSlateDetails} allSlateDetails={allSlateDetails} />)}

        {page === 3 && (
          <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[1000px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
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
                    {/* Country start */}
                    {!repeat && (
                      <div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="relative w-full col-span-2">
                            <select
                              className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                              id="selectOption"
                              value={selectedCountry}
                              onChange={handleSelectCountries}
                            >
                              {countries?.map((country) => {
                                return (
                                  <option
                                    value={country.countryID}
                                    key={country.countryID}
                                  >
                                    {country.countryName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="relative w-full col-span-2">
                            <select
                              className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                              id="selectOption"
                              value={selecteStates}
                              onChange={handleSelectStatesChange}
                            >
                              {states && states?.map((timezone) => {
                                return (
                                  <option
                                    value={timezone.stateId}
                                    key={timezone.stateId}
                                  >
                                    {timezone.stateName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Country end */}


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
                              className="flex items-center justify-center gap-4 mb-3"
                              // className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 gap-4 mb-3"
                              key={index}
                            >
                              <div className="relative w-full col-span-1">
                                <input
                                  type="time"
                                  name={`startTime${index}`}
                                  id="name"
                                  value={item.startTime}
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Time"
                                  required=""
                                  onChange={(e) => handleStartTimeChange(e, index)}
                                />
                              </div>

                              <div className="relative w-full col-span-1">
                                <input
                                  type="time"
                                  name={`endTime${index}`}
                                  id="name"
                                  value={item.endTime}
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Time"
                                  required=""
                                  onChange={(e) => handleEndTimeChange(e, index)}
                                />
                              </div>


                              <div className="relative  col-span-4 flex justify-center items-center gap-4">
                                <div className="relative  col-span-1 " >
                                  <select
                                    className="border border-primary rounded-lg pl-2 py-2 w-40"
                                    id="selectOption"
                                    value={item.sequence}
                                    onChange={(e) => handleSequenceChange(index, e.target.value)}
                                  >
                                    <option value="">Select</option>
                                    {customTimeOrhour?.map((item) => {
                                      return (
                                        <option
                                          value={item.id}
                                          key={item.id}
                                        >
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                                {item?.sequence === "Custom" && (
                                  <div className="  flex items-center   justify-center ">
                                    <label className="text-sm font-medium w-20 mr-2">After every:</label>
                                    <div className="flex justify-center items-center  ">
                                      <div>
                                        <input
                                          className="block w-20 p-2 text-gray-900 border border-gray-300  bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                          type="number"
                                          value={item?.afterevent}
                                          onChange={(e) => { handleaftereventChange(e, index) }}
                                        />
                                      </div>
                                      <div className="flex">
                                        <div className="ml-2 flex items-center">
                                          <input
                                            type="radio"
                                            value={item?.aftereventType}
                                            checked={item?.aftereventType === "Hour"}
                                            name="Cel"
                                            id='Hour'
                                            onChange={() => handleAftereventTypeChange("Hour", index)}
                                          />
                                          <label for='Hour' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">
                                            Hour
                                          </label>
                                        </div>
                                        <div className="ml-3 flex items-center">
                                          <input
                                            id='Minute'
                                            type="radio"
                                            value={item?.aftereventType}
                                            checked={item?.aftereventType === "Minute"}
                                            name="Cel"
                                            onChange={() => handleAftereventTypeChange("Minute", index)}
                                          />
                                          <label for='Minute' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">
                                            Minute
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleOpenImagePopup(index)}>
                                    <MdCloudUpload size={20} />
                                  </button>

                                  <FaPlusCircle
                                    className="cursor-pointer"
                                    size={17}
                                    onClick={handleAddItem}
                                  />
                                  {getallTime.length > 1 && (
                                    <RiDeleteBin5Line
                                      className="cursor-pointer"
                                      size={17}
                                      onClick={() => handleRemoveItem(index)}
                                    />
                                  )}
                                </div>
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
                          onClick={() => setPage(page - 1)}
                        >
                          Back
                        </button>
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
        {page === 4 && (
          <>
            <BookSlotMap setSelectedValue={setSelectedValue} handleBack={handleBack} selectedVal={selectedVal} setSelectedVal={setSelectedVal} setOpen={setOpen} getSelectedVal={getSelectedVal} allArea={allArea} handleRangeChange={handleRangeChange} selectedItem={selectedItem} Open={Open} setSelectedItem={setSelectedItem} setSelectedScreens={setSelectedScreens} setSelectedScreen={setSelectedScreen} screenData={screenData} screenArea={screenArea} handleNext={handleNext} countries={countries} handleSelectChange={handleSelectChange} Screenoptions={Screenoptions} selectAllScreen={selectAllScreen} selectedScreen={selectedScreen} selectedScreens={selectedScreens} setSelectAllScreen={setSelectAllScreen} setAllCity={setAllCity} />
          </>
        )}

        {popupVisible && (
          <ImageUploadPopup
            isOpen={popupVisible}
            index={currentIndex}
            onClose={() => setPopupVisible(false)}
            onSubmit={handlePopupSubmit}
          />
        )}

        {page === 5 && clientSecret && (
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
        {page === 6 && <ThankYouPage navigate={navigate} />}
      </div>
    </>
  );
};

export default AddSlot;
