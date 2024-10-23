/* eslint-disable react/jsx-pascal-case */
import React, { Suspense, useEffect, useRef, useState } from "react";
import Loading from "../../../Loading";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  buttons,
  calculateTotalDuration,
  constructTimeObjects,
  filterScreensDistance,
  getCurrentTimewithSecond,
  getCurrentTimewithTwoMinuteAddInSecound,
  getTimeZoneName,
  getTodayDate,
  getTotalDurationInSeconds,
  multiOptions,
  removeDuplicates,
  timeDifferenceInSeconds,
  timeDifferenceInSequence,
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
import { getIndustry, handleAllTimeZone } from "../../../../Redux/CommonSlice";
import ImageUploadPopup from "./ImageUploadPopup";
import { handleGetState } from "../../../../Redux/SettingUserSlice";
import 'react-time-picker/dist/TimePicker.css';
import AddSoltPage_2 from "./AddSoltPage_2";
import BookSlotMap from "./BookSlotMap";
import PhoneInput from "react-phone-input-2";
import BookSlotTimeZone from "./BookSlotTimeZone";
import logo from "../../../../images/DisployImg/Black-Logo2.png";
import { getPurposeScreens, getVaildEmail } from "../../../../Redux/admin/AdvertisementSlice";
import { socket } from "../../../../App";


const AddSlot = () => {
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm();
  const dispatch = useDispatch()
  const timeZoneName = new Date().toLocaleDateString(undefined, { day: "2-digit", timeZoneName: "long" }).substring(4);

  const Name = watch("name");
  const Email = watch("email");
  const PhoneNumber = watch("phone");
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
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
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedDays, setSelectedDays] = useState(
    new Array(buttons.length).fill(false)
  );
  const [Error, setError] = useState(false);
  // const [searchArea, setSearchArea] = useState();
  const UserName = watch('name')
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [selectAllDays, setSelectAllDays] = useState(false);
  const [repeatDays, setRepeatDays] = useState([]);
  const [allTimeZone, setAllTimeZone] = useState([]);
  const [allArea, setAllArea] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  const start = new Date(startDate);
  const end = new Date(endDate);
  const [dayDifference, setDayDifference] = useState(0);
  // const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const [selectedVal, setSelectedVal] = useState("");
  const [savedFile, setSavedFile] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const Screenoptions = multiOptions(screenData);
  const [countries, setCountries] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedItem, setSelectedItem] = useState();
  const [selecteStates, setSelecteStates] = useState("");
  const [states, setStates] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [getallTime, setGetAllTime] = useState([
    {
      startTime: getCurrentTimewithTwoMinuteAddInSecound(),
      horizontalImage: "",
      verticalImage: "",
      endTime: getCurrentTimewithTwoMinuteAddInSecound(),
      sequence: '', //In every Minute
      afterevent: '',
      aftereventType: '',
      verticalFileName: '',
      horizontalFileName: '',
      SqunceDuration: 0
    },
  ]);


  const [allSlateDetails, setallSlateDetails] = useState({
    Industry: null,
    country: null,
    selecteScreens: [],
    terms: false,
    refCode: 'NO',
    refVale: '',
    purposeText: '',
    otherIndustry: '',
  });

  const appearance = { theme: 'stripe', };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    dispatch(getIndustry({}))
    dispatch(getPurposeScreens({}))
  }, []);

  useEffect(() => {
    let Price = 0;

    selectedScreens?.forEach((item) => {
      Price += item.Price;
    });

    setTotalPrice(Price);
    setTotalCost(totalDuration * Price);
  }, [selectedScreens, totalDuration]);


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
          setStates(res?.payload?.data);
        })
        .catch((error) => {
          console.log("Error fetching states data:", error);
        });
    }
  }, [dispatch, selectedCountry]);

  useEffect(() => {
    if (selectedScreens?.length === screenData?.length) {
      setSelectAllScreen(true);
    } else {
      setSelectAllScreen(false);
    }
  }, [selectedScreens]);

  useEffect(() => {
    if (page === 3 && fileLoading && savedFile?.length === getallTime?.length) {
      setFileLoading(false);
      setPage(page + 1);
    }
  }, [fileLoading, savedFile]);

  useEffect(() => {
    if (repeat) {
      handleCheckboxChange();
    }
  }, [endDate, startDate, repeat]);



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
    // let changeDayTrueOrFalse;
    // for (let i = 0; i < days.length; i++) {
    //   changeDayTrueOrFalse = buttons.map((i) => days.includes(i));
    // }
    const changeDayTrueOrFalse = buttons.map(button => days.includes(button));

    setRepeatDays(changeDayTrueOrFalse);
    setSelectedDays(changeDayTrueOrFalse);
  }


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
    TimeZone();
  }, [])

  const handleSelectTimeZoneChange = (event) => { setSelectedTimeZone(event?.target.value); };

  const handleEndDateChange = (event) => {
    const value = event.target.value
    const difDate = startDate < value
    setEndDate(difDate ? value : startDate);
  };
  const handleSelectStatesChange = (event) => { setSelecteStates(event?.target.value); };

  const handleBack = () => {
    setPage(page - 1);
    setAllArea([]);
    setScreenData([]);
    setSelectAllScreen(false);
    setSelectedScreens([]);
  };

  const handleClick = (index) => { hiddenFileInput.current[index].click(); };

  const handleStartDateChange = (event) => {
    if (!repeat) {
      setEndDate(event.target.value);
    }
    setStartDate(event.target.value);
  };

  const closeRepeatDay = () => {
    setEndDate(startDate)
    setRepeat(false)
    setDay([])
  }



  const FetchScreen = async (Params, allArea) => {

    const toastId = toast.loading('Loading ...', {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });


    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${SCREEN_LIST}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(Params),
    };

    try {
      const response = await axios.request(config);
      if (response?.data?.status === 200) {
        toast.dismiss(toastId);
        let arr = [...screenData];
        const existingIds = new Set(arr.map(item => item.screenID));
        const newScreen = response.data.data.filter(item => !existingIds.has(item.screenID));
        let combinedArray = arr.concat(newScreen);

        let obj = {
          lat: Params?.latitude,
          lon: Params?.longitude,
          dis: Params?.distance,
        };
        let uniqueArr = removeDuplicates([obj]);

        setScreenArea(uniqueArr);
        setScreenData(combinedArray);

        const isAreaMatched = allArea.some(area =>
          area.latitude === Params?.latitude && area.longitude === Params?.longitude
        );


        if (isAreaMatched) {
          const matchingScreens = filterScreensDistance(allArea, combinedArray);
          if (matchingScreens.length > 0) {
            setScreenData(matchingScreens);
          }
        }
      }
    } catch (error) {
      // toast.dismiss(toastId);
      console.error(error);
      toast.error('Failed to load data');
    }
  };
  ///  page 4 handleNext
  const handleNext = () => {
    let total = ""
    if (selectedScreens?.length === 0) {
      return toast.error("Please Select Screen");
    } else {
      let Price = 0;
      selectedScreens.forEach((item) => { Price += item?.Price || 0; });

      setTotalPrice(totalPrice);
      setTotalCost(totalDuration * totalPrice);
      total = Number(totalDuration) * Number(totalPrice);
    }

    const TimeZone = new Date()
      .toLocaleDateString(undefined, {
        day: "2-digit",
        timeZoneName: "long",
      })
      .substring(4);
    const params = {
      "items": {
        "id": "0",
        "amount": Math.floor(total * 100)
      },
      "Currency": TimeZone?.includes("India") ? "inr" : "usd"
    }
    console.log('params :>> ', params);
    debugger
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

  // page 4 handleSelectChange
  const handleSelectChange = (selected) => {

    setSelectedScreens(selected);
    if (selected?.length === screenData?.length) {
      setSelectAllScreen(true);
    } else {
      setSelectAllScreen(false);
    }
  };

  // page 3  start
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

  const handlePopupSubmit = (index, verticalImage, horizontalImage) => {
    const updatedItems = [...getallTime];
    updatedItems[index] = { ...updatedItems[index], verticalImage: verticalImage, horizontalImage: horizontalImage, };
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
    sequence[index].aftereventType = '';
    sequence[index].afterevent = '';
    setGetAllTime(sequence);
  };

  const handleSequenceTypeChange = (index, value) => {
    const sequence = [...getallTime];
    sequence[index].aftereventType = value;
    setGetAllTime(sequence);
  };

  const handleaftereventChange = (e, index) => {
    const { value } = e.target
    const afterevent = [...getallTime];
    afterevent[index].afterevent = value;
    setGetAllTime(afterevent);
  };

  const handleAftereventTypeChange = (value, index) => {
    const aftereventType = [...getallTime];
    aftereventType[index].aftereventType = value;
    setGetAllTime(aftereventType);
  };

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
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    setDayDifference(difference);
  }, [startDate, endDate]);


  // useEffect(() => {
  //   let arr = [];
  //   let count = 0;
  //   const totalDays = countAllDaysInRange();

  //   getallTime?.forEach((item) => {
  //     let start = `${item?.startTime}`;
  //     let end = `${item?.endTime}`;
  //     let sequence = `${item?.sequence}`;
  //     let obj = {
  //       ...item, Duration: timeDifferenceInSeconds(start, end),
  //       SqunceDuration: timeDifferenceInSequence(start, end,
  //         item?.Duration,
  //         sequence,
  //         item?.aftereventType,
  //         item?.afterevent,
  //         dayDifference)
  //     };

  //     // count += timeDifferenceInSeconds(start, end, sequence);
  //     count += (obj?.SqunceDuration !== null || obj?.SqunceDuration !== undefined) ? Math.floor(obj?.SqunceDuration) : Math.floor(obj?.Duration * totalDays); 
  //     arr.push(obj);

  //   });

  //   if (!repeat) {
  //     setTotalDuration(count);
  //   } else if (repeat) {

  //     setTotalDuration(count);
  //   }

  //   setGetAllTime(arr);
  // }, [JSON.stringify(getallTime), endDate, repeat, startDate, selectAllDays, dayDifference]);

  useEffect(() => {
    let count = 0;
    const totalDays = countAllDaysInRange();
    const totalDurations = getTotalDurationInSeconds(getallTime);
    if (totalDays > 0) {
      count = totalDays * totalDurations
    } else {
      count = count + totalDurations
    }
    setTotalDuration(count)

  }, [JSON.stringify(getallTime), endDate, repeat, startDate, selectAllDays, dayDifference, selectedDays])


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

  // page 3  end 

  // page4 location search  
  const getSelectedVal = (value) => {

    const foundItem = allCity.find((item) => item?.text?.includes(value));
    // if (foundItem) {
    //   // setSearchArea(foundItem);
    // }
    let obj = {
      searchValue: value?.searchValue,
      // include: selectedValue,
      include: Number(selectedValue || 1),
      area: 5,
      latitude: value?.latitude,
      longitude: value?.longitude,
      unit: 'km'
    };
    let Params = {
      latitude: value?.latitude,
      longitude: value?.longitude,
      distance: 5,
      unit: 'km',
      SystemCurrency: getTimeZoneName(allTimeZone, selectedTimeZone)?.includes("India") ? "inr" : "usd",
      dates: constructTimeObjects(
        getallTime,
        startDate,
        endDate,
        repeat,
        day,
        selectedTimeZone,
        allTimeZone,
        allSlateDetails,
        // selectedCountry,
        // selecteStates,
      ),

    };

    let arr = [...allArea];
    arr.push(obj);
    FetchScreen(Params, arr);
    setAllArea(arr);
    setSelectedVal("");
    // setSearchArea("");
    // setSelectedValue("");
  };

  const handleSelectunit = (index, selectedData) => {
    // const { value } = e.target;
    // const updatedDis = [...allArea];

    // updatedDis[index].unit = value;
    // setAllArea(updatedDis);

    const updatedItems = [...allArea];
    updatedItems[index] = { ...updatedItems[index], unit: selectedData?.unit, area: selectedData?.area, };

    setAllArea(updatedItems);
    const item = updatedItems[index];


    if (item?.area === '' || !(item?.area)) {
      return setError(true)
    } else {
      setError(false)
    }

    const TimeZone = new Date()
      .toLocaleDateString(undefined, {
        day: "2-digit",
        timeZoneName: "long",
      })
      .substring(4);

    const Params = {
      latitude: item?.latitude,
      longitude: item?.longitude,
      distance: parseInt(item.area),
      unit: item?.unit,
      SystemCurrency: TimeZone?.includes("India") ? "inr" : "usd",
      dates: constructTimeObjects(
        getallTime,
        startDate,
        endDate,
        repeat,
        day,
        selectedTimeZone,
        allTimeZone,
        allSlateDetails,
        selectedCountry,
        selecteStates,
      ),
    };
    setOpen(false)

    FetchScreen(Params, updatedItems);
    setAllArea(updatedItems);
  };


  // page 5 
  const handlebook = (paymentMethod) => {
    let EventDetails = [];
    getallTime?.map((item) => {
      let obj = {
        bookingSlotCustomerEventID: 0,
        startTime: item?.startTime,
        endTime: item?.endTime,
        sequence: item?.sequence,
        customSequence: item?.afterevent || 0,
        isHour: item?.aftereventType === "Hour" ? true : false,
        isHorizontal: item?.horizontalImage ? true : false,
        assetType: '',
        filePathHorizontal: item?.horizontalImage,
        filePathVertical: item?.verticalImage,
      };
      EventDetails?.push(obj);
    })
    const TimeZone = new Date()
      .toLocaleDateString(undefined, {
        day: "2-digit",
        timeZoneName: "long",
      })
      .substring(4);
    let Params = JSON.stringify({
      advBookslotCustomerID: 0,
      name: Name,
      email: Email,
      phoneNumber: PhoneNumber,
      bookSlot: {
        currency: TimeZone?.includes("India") ? "inr" : "usd",
        bookingSlotCustomerID: 0,
        startDate: startDate,
        IsAdvCustomer: true,
        endDate: endDate,
        event: EventDetails,
        PaymentDetails: {
          ...paymentMethod,
          AutoPay: false,
          type: "Book Slot",
        },
        isRepeat: repeat,
        repeatDays: day.join(", "),
        screenIDs: selectedScreens?.map((item) => item?.output).join(", "),
        totalCost: totalCost,
        timezoneID: selectedTimeZone,
        CountryID: selectedCountry,
        otherIndustry: allSlateDetails?.otherIndustry,
        purpose: allSlateDetails?.selecteScreens?.map((item) => item).join(', '),
        text: allSlateDetails?.purposeText,
        referralCode: allSlateDetails?.refVale || null,
        totalDuration: Math.floor(totalDuration),
        industryID: allSlateDetails?.Industry?.value,
        // StatesID: selecteStates,
        systemTimeZone: new Date()
          .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
          })
          .substring(4),
      },
    });
    // return
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
        if (response?.data?.status) {
          const allScreenMacids = selectedScreens?.map((item) => item?.macid).join(", ")
          const Params = {
            id: socket.id,
            connection: socket.connected,
            macId: allScreenMacids,
          };
          socket.emit("ScreenConnected", Params);
          setPage(page + 1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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

  // page 3 handleBookSlot

  // const handleBookSlot = () => {
  //   const currentTimeStr = getCurrentTimewithSecond();
  //   const currentTime = new Date(`${today}T${currentTimeStr}`);

  //   const sameTimeZone = getallTime.some((item) => {
  //     return item.startTime > item.endTime
  //   });
  //   const sameTime = getallTime.some((item) => {
  //     return item.startTime == item.endTime
  //   });

  //   const hasMissingImages = getallTime.some((item) => {
  //     return !item.verticalImage && !item.horizontalImage
  //   });

  //   const PastStartTime = getallTime.some((item) => {
  //     const start = new Date(`${today}T${item.startTime}`);
  //     return start < currentTime;
  //   });

  //   const PastStartAndEndTime = getallTime.some((item) => {
  //     const start = new Date(`${today}T${item.startTime}`);
  //     const end = new Date(`${today}T${item.endTime}`);
  //     return start < currentTime && end < currentTime;
  //   });

  //   if(PastStartAndEndTime){
  //     return toast.error('Start and End Time must be greater than Current Time.');
  //   } else if (PastStartTime) {
  //     return toast.error('Start Time must be greater than Current Time.');
  //   } else if (sameTimeZone) {
  //     return toast.error('End Time must be greater than start Time.');
  //   } else if (sameTime) {
  //     return toast.error('Start Time and Time Time both are same.');
  //   } else if (hasMissingImages) {
  //     return toast.error("Please upload valid Vertical and Horizontal images.");
  //   } else {
  //     setPage(page + 1);
  //   }
  // };

  const handleBookSlot = () => {
    const currentTimeStr = getCurrentTimewithSecond();
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date(`${today}T${currentTimeStr}`);

    const errors = {
      sameTimeZone: 'End Time must be greater than Start Time.',
      sameTime: 'Start Time and End Time both are the same.',
      missingImages: 'Please upload valid Vertical and Horizontal images.',
      pastStartAndEndTime: 'Start and End Time must be greater than Current Time.',
      pastStartTime: 'Start Time must be greater than Current Time.'
    };

    for (const item of getallTime) {
      const start = new Date(`${today}T${item.startTime}`);
      const end = new Date(`${today}T${item.endTime}`);

      if (start < currentTime && end < currentTime) {
        return toast.error(errors.pastStartAndEndTime);
      }
      if (start < currentTime) {
        return toast.error(errors.pastStartTime);
      }
      if (start >= end) {
        return toast.error(errors.sameTimeZone);
      }
      if (start.getTime() === end.getTime()) {
        return toast.error(errors.sameTime);
      }
      if (!item.verticalImage && !item.horizontalImage) {
        return toast.error(errors.missingImages);
      }
    }

    setPage(page + 1);
  };




  const onSubmit = (data) => {
    dispatch(getVaildEmail(data?.email)).then((res) => {
      if (res?.payload?.data == true) {
        return toast.error(res?.payload?.message)
      } else {
        setPage(page + 1)
      }
    })
  }

  return (
    <>
      {sidebarload && <Loading />}

      {!sidebarload && <Suspense fallback={<Loading />}></Suspense>}
      <div className="h-screen w-screen">
        {fileLoading && <Loading />}
        {page === 1 && (
          <>
            <div className="w-full h-full p-5 flex items-center justify-center">
              <div className="bg-white lg:px-36 lg:py-10 md:px-28 md:py-8 sm:px-16 sm:py-4 p-3 shadow-xl rounded-xl">
                {/* <div className="text-2xl font-semibold">Book Slot</div>*/}
                <div className="flex items-center justify-center mb-6">
                  <img
                    alt="Logo"
                    src={logo}
                    className="cursor-pointer duration-500 w-52"
                  />
                </div>
                <div>
                  <form
                    className="flex flex-col gap-6 items-center"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className={`${errors?.name ? "bookslot" : "bookslot-input"}`}>
                      <input
                        {...register("name", {
                          required: "Name is required",
                        })}
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter Your Name"
                        className={` bg-transparent placeholder-slate-400 focus:border-none focus:shadow-none border-black border-current w-full p-3 rounded-xl`}
                        style={{ border: `${errors?.name ? "1px solid red" : "none"}` }}
                      />
                    </div>
                    {/* <label
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
                    )}*/}
                    <div className={`${errors?.email ? "bookslot" : "bookslot-input"}`}>
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
                        className={`bookslot-input bg-transparent placeholder-slate-400 focus:border-none focus:shadow-none border-black  border-current w-full p-3 rounded-xl`}
                        style={{ border: `${errors?.email ? "1px solid red" : "none"}` }}
                      />
                    </div>
                    {/* <label
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
                    )}*/}

                    {/*<label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number *
                    </label>*/}
                    <div className={`${errors?.phone ? "bookslot" : "bookslot-phone-input"}`}>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: 'Phone Number is required',
                          validate: (value) => {
                            // You can add additional validation logic here if needed
                            if (!value || value.length < 10) {
                              return "Invalid phone number";
                            }
                            return true; // Valid number
                          },
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <PhoneInput
                            autocompleteSearch={true}
                            countryCodeEditable={false}
                            enableSearch={false}
                            value={value}
                            onChange={(phone, countryData, event, isValid) => {
                              onChange(phone); // Update the value in the Controller
                            }}
                            id="phone"
                            country={'in'}
                            inputProps={{
                              name: 'phone',
                              country: 'in',
                              required: true,
                              autoFocus: true,
                            }}
                          />
                        )}
                      />

                    </div>

                    {/*{errors.phone && (
                      <span className="error">{errors.phone.message}</span>
                    )}*/}
                    <div>
                      <div className="flex justify-end h-full items-end">
                        <button
                          className="flex align-middle bg-SlateBlue text-white items-center rounded-full xs:px-3 xs:py-1 sm:px-4 md:px-8 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
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
          <AddSoltPage_2
            page={page}
            setPage={setPage}
            countries={countries}
            setallSlateDetails={setallSlateDetails}
            allSlateDetails={allSlateDetails}
            UserName={UserName}
          />
        )}

        {page === 3 && (
          <BookSlotTimeZone
            Isshow="True"
            handleAddItem={handleAddItem}
            handleSequenceChange={handleSequenceChange}
            handleSequenceTypeChange={handleSequenceTypeChange}
            handleaftereventChange={handleaftereventChange}
            handleAftereventTypeChange={handleAftereventTypeChange}
            allTimeZone={allTimeZone}
            selectedTimeZone={selectedTimeZone}
            selectedDays={selectedDays}
            countAllDaysInRange={countAllDaysInRange}
            handleSelectTimeZoneChange={handleSelectTimeZoneChange}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            repeat={repeat}
            startDate={startDate}
            endDate={endDate}
            setRepeat={setRepeat}
            handleEndTimeChange={handleEndTimeChange}
            handleDayButtonClick={handleDayButtonClick}
            setPage={setPage}
            handleBookSlot={handleBookSlot}
            page={page}
            getallTime={getallTime}
            handleStartTimeChange={handleStartTimeChange}
            handleOpenImagePopup={handleOpenImagePopup}
            handleRemoveItem={handleRemoveItem}
            handleCheckboxChange={handleCheckboxChange}
            selectAllDays={selectAllDays}
            totalDuration={totalDuration}
            closeRepeatDay={closeRepeatDay}
          />
        )}

        {page === 4 && (
          <>
            <BookSlotMap
              Isshow="True"
              totalPrice={totalPrice}
              totalDuration={totalDuration}
              // selectedCountry={selectedCountry} 
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              // handleSelectCountries={handleSelectCountries}  
              // locationDis={locationDis}
              setSelectedValue={setSelectedValue}
              screenArea={screenArea}
              handleBack={handleBack}
              setAllArea={setAllArea}
              selectedVal={selectedVal}
              setSelectedVal={setSelectedVal}
              getSelectedVal={getSelectedVal}
              allArea={allArea}
              Open={Open}
              setOpen={setOpen}
              setSelectedScreens={setSelectedScreens}
              setSelectedScreen={setSelectedScreen}
              screenData={screenData}
              handleNext={handleNext}
              countries={countries}
              handleSelectChange={handleSelectChange}
              Screenoptions={Screenoptions}
              selectAllScreen={selectAllScreen}
              selectedScreen={selectedScreen}
              selectedScreens={selectedScreens}
              setSelectAllScreen={setSelectAllScreen}
              setAllCity={setAllCity}
              setScreenData={setScreenData}
              handleSelectunit={handleSelectunit}
              Error={Error}
              totalCost={totalCost}
              timeZoneName={timeZoneName}
            />
          </>
        )}

        {popupVisible && (
          <ImageUploadPopup
            isOpen={popupVisible}
            index={currentIndex}
            onClose={() => setPopupVisible(false)}
            onSubmit={handlePopupSubmit}
            getallTime={getallTime}
            setGetAllTime={setGetAllTime}

          />
        )}
        {/* clientSecret */}
        {page === 5 && clientSecret && (
          <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[700px] md:w-[500px] w-full bg-white lg:p-6 p-3 rounded-xl shadow-lg overflow-auto">
              <Elements options={options} stripe={stripePromise}>
                <AddPayment
                  Isshow="true"
                  clientSecret={clientSecret}
                  selectedScreens={selectedScreens}
                  totalDuration={totalDuration}
                  totalPrice={totalPrice}
                  totalCost={totalCost}
                  handlebook={handlebook}
                  Name={Name}
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
        {page === 6 && <ThankYouPage navigate={navigate} Name={Name} bookslot={true} isCustomer={false} />}
      </div>
    </>
  );
};

export default AddSlot;
