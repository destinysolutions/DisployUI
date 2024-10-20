import React, { useEffect, useState } from 'react'
import moment from 'moment';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Elements } from "@stripe/react-stripe-js";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { handleAllTimeZone } from '../../../Redux/CommonSlice';
import BookSlotTimeZone from '../../Screen/SubScreens/BookSlot/BookSlotTimeZone';
import BookSlotMap from '../../Screen/SubScreens/BookSlot/BookSlotMap';
import AddPayment from '../../Screen/SubScreens/BookSlot/AddPayment';
import ImageUploadPopup from '../../Screen/SubScreens/BookSlot/ImageUploadPopup';
import ThankYouPage from '../../Screen/SubScreens/BookSlot/ThankYouPage';
import { ADDUPDATESLOT, GET_TIMEZONE_TOKEN, PAYMENT_INTENT_CREATE_REQUEST, SCREEN_LIST, stripePromise } from '../../../Pages/Api';
import { handlePaymentIntegration } from '../../../Redux/PaymentSlice';
import { buttons, constructTimeObjects, filterScreensDistance, getCurrentTimewithSecound, multiOptions, removeDuplicates, timeDifferenceInSeconds, timeDifferenceInSequence } from '../Common';
import { socket } from '../../../App';

export default function CustomerBookslot({ sidebarOpen }) {

    const timeZoneName = new Date().toLocaleDateString(undefined, { day: "2-digit", timeZoneName: "long" }).substring(4);
    const { user, userDetails } = useSelector((state) => state.root.auth);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [page, setPage] = useState(1);

    // page 1
    const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
    const [selectedDays, setSelectedDays] = useState(new Array(buttons.length).fill(false));
    const [selectAllDays, setSelectAllDays] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [day, setDay] = useState([]);
    const [repeatDays, setRepeatDays] = useState([]);
    const [selectedVal, setSelectedVal] = useState("");
    const [selectedValue, setSelectedValue] = useState(1);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [dayDifference, setDayDifference] = useState(0);
    const [getallTime, setGetAllTime] = useState([
        {
            startTime: getCurrentTimewithSecound(),
            horizontalImage: "",
            verticalImage: "",
            endTime: getCurrentTimewithSecound(),
            sequence: '', //In every Minute
            afterevent: '',
            aftereventType: '',
            verticalFileName: '',
            horizontalFileName: '',
            SqunceDuration: 0
        },
    ]);

    // page 2
    const [allArea, setAllArea] = useState([]);
    const [Open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const [selectedTimeZone, setSelectedTimeZone] = useState();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [allTimeZone, setAllTimeZone] = useState([]);
    const [screenArea, setScreenArea] = useState([]);
    const [screenData, setScreenData] = useState([]);
    const [selectedScreens, setSelectedScreens] = useState([]);
    const [selectedScreen, setSelectedScreen] = useState("");
    const [selectAllScreen, setSelectAllScreen] = useState(false);
    const Screenoptions = multiOptions(screenData);

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [clientSecret, setClientSecret] = useState("");
    const [totalDuration, setTotalDuration] = useState(0);

    useEffect(() => {
        let Price = 0;
        selectedScreens?.map((item) => {
            Price = Price + item?.Price;
        });
        setTotalPrice(Price);
        setTotalCost(totalDuration * Price);
    }, [selectedScreens, totalDuration]);



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

    const handleBack = () => {
        setPage(page - 1);
    };

    const handleSelectTimeZoneChange = (event) => { setSelectedTimeZone(event?.target.value); };

    const handleStartDateChange = (event) => {
        if (!repeat) {
            setEndDate(event.target.value);
        }
        setStartDate(event.target.value);
    };
    const handleEndDateChange = (event) => {
        const value = event.target.value
        const difDate = startDate < value
        setEndDate(difDate ? value : startDate);
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

    const handleOpenImagePopup = (index) => {
        setCurrentIndex(index);
        setPopupVisible(true);
    }

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

    useEffect(() => {
        let arr = [];
        let count = 0;

        getallTime?.forEach((item) => {
            let start = `${item?.startTime}`;
            let end = `${item?.endTime}`;
            let sequence = `${item?.sequence}`;
            let obj = {
                ...item, Duration: timeDifferenceInSeconds(start, end),
                SqunceDuration: timeDifferenceInSequence(start, end,
                    item?.Duration,
                    sequence,
                    item?.aftereventType,
                    item?.afterevent,
                    dayDifference)
            };

            count += obj?.SqunceDuration ? Math.floor(obj?.SqunceDuration) : Math.floor(obj?.Duration);
            arr.push(obj);

        });

        if (!repeat) {
            setTotalDuration(count);
        } else if (repeat) {
            const totalDays = countAllDaysInRange();

            setTotalDuration(count);
        }

        setGetAllTime(arr);
    }, [JSON.stringify(getallTime), endDate, repeat, startDate, selectAllDays, dayDifference]);

    useEffect(() => {
        if (repeat) {
            handleCheckboxChange();
        }
    }, [endDate, startDate, repeat]);


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

    const handleBookSlot = () => {
        const sameTimeZone = getallTime.some((item) => {
            return item.startTime === item.endTime
        });

        const hasMissingImages = getallTime.some((item) => {
            return !item.verticalImage && !item.horizontalImage
        });

        if (sameTimeZone) {
            return toast.error('End Time must be greater than start Time.');
        } else if (hasMissingImages) {
            return toast.error("Please upload valid Vertical and Horizontal images.");
        } else {
            setPage(page + 1);
        }
    };


    // page 2

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

    const handleRangeChange = (e, item) => {
        e.preventDefault();
        let arr = allArea.map((item1) => {
            if (item1?.searchValue === item?.searchValue) {
                let Params = {
                    latitude: item?.latitude,
                    longitude: item?.longitude,
                    distance: parseInt(item1?.area),
                    unit: item?.unit,
                    dates: constructTimeObjects(
                        getallTime,
                        startDate,
                        endDate,
                        repeat,
                        day,
                        selectedTimeZone,
                        allTimeZone,
                        // allSlateDetails,
                        // selectedCountry,
                        // selecteStates,
                    ),
                };

                FetchScreen(Params);
                return {
                    searchValue: item?.searchValue,
                    include: Number(item?.include),
                    area: parseInt(item1?.area), // Assuming you want to modify the 'area' property of the matched item
                    latitude: item?.latitude,
                    longitude: item?.longitude,
                    unit: item?.unit,
                };
            } else {
                return item1;
            }
        });
        setAllArea(arr);
        setOpen(false);

    };


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
        const params = {
            "items": {
                "id": "0",
                "amount": total
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

    const handleSelectChange = (selected) => {
        setSelectedScreens(selected);
        if (selected?.length === screenData?.length) {
            setSelectAllScreen(true);
        } else {
            setSelectAllScreen(false);
        }
    };

    const handlePopupSubmit = (index, verticalImage, horizontalImage) => {
        const updatedItems = [...getallTime];
        updatedItems[index] = { ...updatedItems[index], verticalImage: verticalImage, horizontalImage: horizontalImage, };
        setGetAllTime(updatedItems);
    };

    const handleRemoveItem = (index) => {
        setGetAllTime(getallTime.filter((_, i) => i !== index));
    };


    const handleAddItem = () => {
        setGetAllTime([
            ...getallTime,
            {
                startTime: moment().format("hh:mm:ss"),
                verticalImage: "",
                horizontalImage: "",
                sequence: '',
                endTime: moment().format("hh:mm:ss")
            },
        ]);
    };

    const handleSelectunit = (index, selectedData) => {
        const updatedItems = [...allArea];
        updatedItems[index] = { ...updatedItems[index], unit: selectedData?.unit, area: selectedData?.area, };
        setAllArea(updatedItems);
        const item = updatedItems[index];


        // if (item?.area === '' || !(item?.area)) {
        //     return setError(true)
        // } else {
        //     setError(false)
        // }

        const Params = {
            latitude: item?.latitude,
            longitude: item?.longitude,
            distance: parseInt(item.area),
            unit: item?.unit,
            dates: constructTimeObjects(
                getallTime,
                startDate,
                endDate,
                repeat,
                day,
                selectedTimeZone,
                allTimeZone,
                // allSlateDetails,
                // selectedCountry,
                // selecteStates,
            ),
        };
        setOpen(false)

        FetchScreen(Params);
    };

    const getSelectedVal = (value) => {

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
            dates: constructTimeObjects(
                getallTime,
                startDate,
                endDate,
                repeat,
                day,
                selectedTimeZone,
                allTimeZone,
                // allSlateDetails,
                // selectedCountry,
                // selecteStates,
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

    const closeRepeatDay = () => {
        setEndDate(startDate)
        setRepeat(false)
        setDay([])
    }

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
            // name: Name,
            email: user?.isAdvCustomer ? user?.emailID : null,
            // phoneNumber: PhoneNumber,
            bookSlot: {
                bookingSlotCustomerID: 0,
                userID: user?.userID,
                isAdvCustomer: user?.isAdvCustomer,
                startDate: startDate,
                endDate: endDate,
                event: EventDetails,
                PaymentDetails: {
                    ...paymentMethod,
                    AutoPay: true,
                    type: "Book Slot",
                },
                isRepeat: repeat,
                repeatDays: day ? day.join(", ") : moment().format('dddd'),
                screenIDs: selectedScreens?.map((item) => item?.output).join(", "),
                totalCost: totalCost,
                timezoneID: selectedTimeZone,
                // CountryID: selectedCountry,
                // otherIndustry: allSlateDetails?.otherIndustry,
                // purpose: allSlateDetails?.selecteScreens?.map((item) => item).join(', '),
                // text: allSlateDetails?.purposeText,
                // referralCode: allSlateDetails?.refVale || 0,
                // industryID: allSlateDetails?.Industry?.value,
                totalDuration: Math.floor(totalDuration),
                // StatesID: selecteStates,
                systemTimeZone: new Date()
                    .toLocaleDateString(undefined, {
                        day: "2-digit",
                        timeZoneName: "long",
                    })
                    .substring(4),
            },
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
                const allScreenMacids = selectedScreens?.map((item) => item?.macid).join(", ")
                const Params = {
                    id: socket.id,
                    connection: socket.connected,
                    macId: allScreenMacids,
                };
                socket.emit("ScreenConnected", Params);
                setPage(page + 1);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <div className={`${sidebarOpen ? "ml-60" : "ml-0"} `}>
                <div className=" m-auto mt-10">
                    <h1 className="text-2xl font-semibold text-center">Book your slot</h1>
                </div>
                {page === 1 && (
                    <>
                        <BookSlotTimeZone
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
                            type={'BookYourSlot'}
                        />
                    </>
                )}

                {page === 2 && (
                    <>
                        <BookSlotMap
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
                            handleRangeChange={handleRangeChange}
                            Open={Open}
                            setOpen={setOpen}
                            setSelectedScreens={setSelectedScreens}
                            setSelectedScreen={setSelectedScreen}
                            screenData={screenData}
                            handleNext={handleNext}
                            handleSelectChange={handleSelectChange}
                            Screenoptions={Screenoptions}
                            selectAllScreen={selectAllScreen}
                            selectedScreen={selectedScreen}
                            selectedScreens={selectedScreens}
                            setSelectAllScreen={setSelectAllScreen}
                            setScreenData={setScreenData}
                            handleSelectunit={handleSelectunit}
                            Error={Error}
                            totalCost={totalCost}
                            timeZoneName={timeZoneName}
                        />

                    </>
                )}
                {/* clientSecret && */}
                {page === 3 && (
                    <div className="w-full h-full p-5 flex items-center justify-center">
                        <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
                            <Elements
                                // options={options} 
                                stripe={stripePromise || ''}
                            >
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
                {page === 4 && <ThankYouPage navigate={navigate} />}
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
            </div>
        </>
    )
}
