/* eslint-disable react/jsx-pascal-case */
import React, { Suspense, useEffect, useRef, useState } from "react";
import Loading from "../../../Loading";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  buttons,
  constructTimeObjects,
  filterScreensDistance,
  getCurrentTimewithSecound,
  getTodayDate,
  multiOptions,
  removeDuplicates,
  timeDifferenceInSeconds,
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
import ImageUploadPopup from "./ImageUploadPopup";
import { handleGetState } from "../../../../Redux/SettingUserSlice";
import 'react-time-picker/dist/TimePicker.css';
import AddSoltPage_2 from "./AddSoltPage_2";
import BookSlotMap from "./BookSlotMap";
import PhoneInput from "react-phone-input-2";
import BookSlotTimeZone from "./BookSlotTimeZone";


const AddSlot = () => {
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm();

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
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedDays, setSelectedDays] = useState(
    new Array(buttons.length).fill(false)
  );

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
      verticalFileName: '',
      horizontalFileName: ''
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
    let Price = 0;
    selectedScreens?.map((item) => {
      Price = Price + item?.Price;
    });
    setTotalPrice(Price);
  }, [selectedScreens]);

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
  }, [endDate, startDate]);


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

  const handleSelectTimeZoneChange = (event) => { setSelectedTimeZone(event?.target.value); };
  const handleEndDateChange = (event) => { setEndDate(event.target.value); };
  const handleSelectStatesChange = (event) => { setSelecteStates(event?.target.value); };
  const handleBack = () => { setPage(page - 1); };
  const handleClick = (index) => { hiddenFileInput.current[index].click(); };

  const handleStartDateChange = (event) => {
    if (!repeat) {
      setEndDate(event.target.value);
    }
    setStartDate(event.target.value);
  };


  const FetchScreen = async (Params) => {

    const toastId = toast.loading('Loading ...');

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${SCREEN_LIST}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(Params),
    };
    console.log('toastId :>> ', toastId);
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
      toast.dismiss(toastId);
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

      setTotalPrice(Price);
      setTotalCost(totalDuration * Price);

      total = Number(totalDuration) * Number(Price);
    }
    const params = {
      "items": {
        "id": "0",
        "amount": Number(totalPrice * 100)
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
    };
    let Params = {
      latitude: value?.latitude,
      longitude: value?.longitude,
      distance: 5,
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
    // setSelectedValue("");
  };


  // page 4 handleRangeChange
  const handleRangeChange = (e, item) => {
    e.preventDefault();
    let arr = allArea.map((item1) => {
      if (item1?.searchValue === item?.searchValue) {
        let Params = {
          latitude: item?.latitude,
          longitude: item?.longitude,
          distance: parseInt(item1?.area),
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
          area: parseInt(item1?.area), // Assuming you want to modify the 'area' property of the matched item
          latitude: item?.latitude,
          longitude: item?.longitude,
        };
      } else {
        return item1;
      }
    });
    setAllArea(arr);
    setOpen(false);
    // setRangeValue(parseInt(e.target.value));
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
    let Params = JSON.stringify({
      advBookslotCustomerID: 0,
      name: Name,
      email: Email,
      phoneNumber: PhoneNumber,
      bookSlot: {
        bookingSlotCustomerID: 0,
        startDate: startDate,
        endDate: endDate,
        event: EventDetails,
        PaymentDetails: {
          ...paymentMethod,
          AutoPay: true,
          type: "Book Slot",
        },
        isRepeat: repeat,
        repeatDays: day.join(", "),
        screenIDs: Screenoptions.map((item) => item.output).join(", "),
        totalCost: totalCost,
        timezoneID: selectedTimeZone,
        CountryID: selectedCountry,
        otherIndustry: allSlateDetails?.otherIndustry,
        purpose: allSlateDetails?.selecteScreens?.map((item) => item).join(', '),
        text: allSlateDetails?.purposeText,
        referralCode: allSlateDetails?.refVale || 0,
        totalDuration: totalDuration,
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
        console.log('response :>> ', response);
        setPage(page + 1);
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

  const handleBookSlot = () => {
    console.log('getallTime :>> ', getallTime);


    // setPage(page + 1)
    // return
    const hasMissingImages = getallTime.some((item) => { return !item.verticalImage && !item.horizontalImage });
    if (hasMissingImages) {
      return toast.error("Please upload valid Vertical and Horizontal images.");
    } else {

      let arr = [];
      let count = 0;

      getallTime?.map((item) => {

        let start = `${item?.startTime}`;
        let end = `${item?.endTime}`;
        let obj = { ...item, Duration: timeDifferenceInSeconds(start, end) };

        count = count + timeDifferenceInSeconds(start, end);
        arr.push(obj);

      });

      if (!repeat) {
        setTotalDuration(count);
      } else {
        const total = countAllDaysInRange();
        setTotalDuration(total * count);
      }

      setGetAllTime(arr);
      setPage(page + 1);
    }
  };

  const handleSelectCountries = (event) => {

    setSelectedCountry(event?.target.value);

    let Params = {
      latitude: 0,
      longitude: 0,
      distance: 0,
      // startDate: startDate,
      // endDate: endDate,
      // country: selectedCountry,
      // systemTimeZone: selectedTimeZone,
      // isRepeat: repeat,
      // repeatDays: day,
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

  };

  const onSubmit = () => {
    setPage(page + 1)
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
                    {/* <Controller
                      name="phone"
                      control={control}
                      rules={{
                        validate: (value) => isValidPhoneNumber(value),
                      }}
                      render={({ field: { onChange, value, country } }) => (
                        <PhoneInput
                          country={"in"}
                          onChange={(phoneNumber) => {
                            const formattedNumber = "+" + phoneNumber;
                            onChange(formattedNumber); // Update the value directly
                            setPhoneNumber(formattedNumber); // Update the state to reflect the phone number
                          }}
                          value={value || phoneNumber}
                          autocompleteSearch={true}
                          countryCodeEditable={false}
                          enableSearch={true}
                          inputStyle={{
                            width: "100%",
                            background: "white",
                            padding: "25px 0 25px 3rem",
                            borderRadius: "10px",
                            fontSize: "1rem",
                            border: "1px solid #000",
                          }}
                          dropdownStyle={{
                            color: "#000",
                            fontWeight: "600",
                            padding: "0px 0px 0px 10px",
                          }}
                        />
                      )}
                    /> */}

                    <Controller
                      name="phone"
                      control={control}
                      rules={{ required: 'Phone Number is required' }}
                      // rules={{
                      //   validate: (value) => isValidPhoneNumber(value),
                      // }}
                      render={({ field: { onChange, value } }) => (
                        <PhoneInput
                          autocompleteSearch={true}
                          countryCodeEditable={false}
                          enableSearch={true}
                          value={value}
                          onChange={onChange}
                          id="phone"
                          country={'in'}
                          error={true}
                          inputProps={{
                            name: 'phone',
                            country: 'in',
                            required: true,
                            autoFocus: true,
                            style: { width: '100%', border: "1px solid #e4e4e7" },
                          }}
                        />
                      )}
                    />
                    {/* {isValidPhoneNumber && (
                      <span className="error">Invalid Phone Number.</span>
                    )} */}
                    {/* {errors?.phone && <p className="text-red-500 text-xs ">{errors?.phone?.message}</p>} */}
                    {/* <input
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
                    /> */}
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
        {page === 2 && (<AddSoltPage_2 page={page} setPage={setPage} countries={countries} setallSlateDetails={setallSlateDetails} allSlateDetails={allSlateDetails} UserName={UserName} />)}

        {page === 3 && (
          <>
            <BookSlotTimeZone
              handleAddItem={handleAddItem} handleSequenceChange={handleSequenceChange} handleaftereventChange={handleaftereventChange} handleAftereventTypeChange={handleAftereventTypeChange}
              allTimeZone={allTimeZone} selectedTimeZone={selectedTimeZone} selectedDays={selectedDays} countAllDaysInRange={countAllDaysInRange}
              handleSelectTimeZoneChange={handleSelectTimeZoneChange} handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange} repeat={repeat} startDate={startDate} endDate={endDate} setRepeat={setRepeat}
              handleEndTimeChange={handleEndTimeChange} handleDayButtonClick={handleDayButtonClick} setPage={setPage} handleBookSlot={handleBookSlot} page={page}
              getallTime={getallTime} handleStartTimeChange={handleStartTimeChange} handleOpenImagePopup={handleOpenImagePopup} handleRemoveItem={handleRemoveItem}
              handleCheckboxChange={handleCheckboxChange} selectAllDays={selectAllDays}
            />
          </>
        )}

        {page === 4 && (
          <>
            <BookSlotMap totalPrice={totalPrice} totalDuration={totalDuration}
              // selectedCountry={selectedCountry} setSelectedItem={setSelectedItem} selectedItem={selectedItem}
              // handleSelectCountries={handleSelectCountries}  locationDis={locationDis}    setSelectedValue={setSelectedValue} screenArea={screenArea}
              handleBack={handleBack}
              setAllArea={setAllArea}
              selectedVal={selectedVal} setSelectedVal={setSelectedVal}
              getSelectedVal={getSelectedVal}
              allArea={allArea} handleRangeChange={handleRangeChange}
              // Open={Open} setOpen={setOpen}
              setSelectedScreens={setSelectedScreens} setSelectedScreen={setSelectedScreen}
              screenData={screenData} handleNext={handleNext}
              countries={countries} handleSelectChange={handleSelectChange}
              Screenoptions={Screenoptions} selectAllScreen={selectAllScreen}
              selectedScreen={selectedScreen} selectedScreens={selectedScreens}
              setSelectAllScreen={setSelectAllScreen} setAllCity={setAllCity}
              setScreenData={setScreenData}
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
            <div className="lg:w-[700px] md:w-[500px] w-full h-[60vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
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
