import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { buttons, constructTimeObjects, Frequent, greenOptions, kilometersToMeters, multiOptions, removeDuplicates, timeDifferenceInSeconds } from '../Common/Common';
import moment from 'moment';
import { MdArrowBackIosNew, MdCloudUpload } from 'react-icons/md';
import { FaPlusCircle } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import { FiMapPin } from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { Circle, LayerGroup, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from "leaflet";
import mapImg from "../../../src/images/DisployImg/mapImg.png";
import { GET_ALL_COUNTRY, GET_TIMEZONE_TOKEN, PAYMENT_INTENT_CREATE_REQUEST, SCREEN_LIST, stripePromise } from '../../Pages/Api';
import { handlePaymentIntegration } from '../../Redux/PaymentSlice';
import { useDispatch } from 'react-redux';
import { Elements } from "@stripe/react-stripe-js";
import AddPayment from '../Screen/SubScreens/BookSlot/AddPayment';
import ThankYouPage from '../Screen/SubScreens/BookSlot/ThankYouPage';
import ImageUploadPopup from '../Screen/SubScreens/BookSlot/ImageUploadPopup';
import { customTimeOrhour } from '../Common/Util';
import BookSlotMap from '../Screen/SubScreens/BookSlot/BookSlotMap';
import axios from 'axios';
import BookSlotTimeZone from '../Screen/SubScreens/BookSlot/BookSlotTimeZone';
import { handleAllTimeZone } from '../../Redux/CommonSlice';
// import mapImg from "../../../../images/DisployImg/mapImg.png";
export default function AddBookYourSlot({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate()
    const customIcon = new L.Icon({
        iconUrl: mapImg,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
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
    const [verticalFileName, setVerticalFileName] = useState('');
    const [horizontalFileName, setHorizontalFileName] = useState('');
    const [temperature, setTemprature] = useState("");
    const [temperatureUnit, setTempratureUnit] = useState("Hour");
    const [selectedVal, setSelectedVal] = useState("");
    const [selectedValue, setSelectedValue] = useState(1);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24));

    const [getallTime, setGetAllTime] = useState([
        {
            startTime: moment().format("hh:mm:ss"),
            startTimeSecond: 10,
            endTimeSecond: 15,
            horizontalImage: "",
            verticalImage: "",
            endTime: moment().format("hh:mm:ss"),
            sequence: '',
        },
    ]);

    // page 2
    const center = [20.5937, 78.9629];
    const [allArea, setAllArea] = useState([]);
    const [Open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const [selectedTimeZone, setSelectedTimeZone] = useState();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selecteStates, setSelecteStates] = useState("");
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
    const [countries, setCountries] = useState([]);

    const appearance = {
        theme: 'stripe',
    };
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
        setTotalCost(Price)

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
                console.log('response', response)
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
        setEndDate(event.target.value);
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

    // const handleBookSlot = () => {
    //     // setPage(page + 1);

    //     const hasMissingImages = getallTime.some((item) => { console.log('item :>> ', item); return !item.verticalImage && !item.horizontalImage });
    //     if (hasMissingImages) {
    //         return toast.error("Please upload valid Vertical and Horizontal images.");
    //     } else {
    //         setPage(page + 1);
    //     }
    // };

    const handleBookSlot = () => {

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


    // page 2

    const FetchScreen = (Params) => {
        toast.loading('Loading ...')
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

                    const existingIds = new Set(arr.map(item => (item.screenID)));

                    const newData = response.data.data.filter(item => !existingIds.has(item.screenID));

                    let combinedArray = arr.concat(newData);

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
    };

    const handleScreenClick = (screen) => {
        setSelectedScreen(screen);
    };

    const handleNext = () => {
        let total = ""
        if (selectedScreens?.length === 0) {
            return toast.error("Please Select Screen");
        } else {
            let Price = 0;
            selectedScreens.forEach((item) => { Price += item?.Price || 0; });

            setTotalPrice(Price);
            setTotalCost(totalDuration * Price);
            setTotalCost(totalDuration * Price)

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
        updatedItems[index] = { ...updatedItems[index], verticalImage: verticalImage, horizontalImage: horizontalImage };
        setGetAllTime(updatedItems);
    };

    const handleRemoveItem = (index) => {
        setGetAllTime(getallTime.filter((_, i) => i !== index));
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

    const handleSelectunit = (e, index) => {
        const { value } = e.target;
        const updatedDis = [...allArea];

        updatedDis[index].unit = value;
        setAllArea(updatedDis);

        const item = updatedDis[index];
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
                null,
                selectedCountry,
                selecteStates,
            ),
        };

        FetchScreen(Params);
    };

    const getSelectedVal = (value) => {


        let obj = {
            searchValue: value?.searchValue,
            // include: Number(selectedValue),
            area: 20,
            latitude: value?.latitude,
            longitude: value?.longitude,
        };
        let Params = {
            latitude: value?.latitude,
            longitude: value?.longitude,
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
        // setSelectedValue("");
    };

    return (
        <div>
            <div className="flex bg-white border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>

            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain ">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    {/* <div className=" flex items-start mb-3 border">
                        <p className="text-xl font-semibold text-center">Book your slot</p>
                    </div> */}

                    {page === 1 && (
                        <>
                            <BookSlotTimeZone
                                handleAddItem={handleAddItem}
                                handleSequenceChange={handleSequenceChange}
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
                                // setSelectedItem={setSelectedItem}
                                // selectedItem={selectedItem}
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
                                // Open={Open} 
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
                                setScreenData={setScreenData}
                                handleSelectunit={handleSelectunit}
                            />
                            {/* <div className="w-full h-full p-5 flex items-center justify-center ">
                                <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg ">
                                    <div className="flex flex-row items-center gap-2">
                                        <div className="icons flex items-center">
                                            <div>
                                                <button
                                                    className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                                                    onClick={() => setPage(page - 1)}
                                                >
                                                    <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-semibold">Find Your Screen</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 h-[93%] overflow-auto">
                                        <div className="col-span-2 rounded-lg shadow-md bg-white p-5">
                                            <div>
                                                <Select
                                                    placeholder=' Country'
                                                // value={selectedScreens}
                                                // onChange={handleSelectChange}
                                                // options={Screenoptions}

                                                />
                                                <Select
                                                    placeholder=' Loaction'
                                                    className='my-3'
                                                // value={selectedScreens}
                                                // onChange={handleSelectChange}
                                                // options={Screenoptions}

                                                />
                                                <div className='flex items-center justify-center gap-3'>
                                                    <div className='w-full'>

                                                        <Select
                                                            placeholder='Code'

                                                        // value={selectedScreens}
                                                        // onChange={handleSelectChange}
                                                        // options={Screenoptions}

                                                        />
                                                    </div>
                                                    <div className='w-full'>
                                                        <input type='text' placeholder='Seacrh' className='w-full border-b border-gray-300 text-gray-400' />
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 ">


                                                {allArea?.map((item, index) => {
                                                    return (
                                                        <div
                                                            className=" flex flex-row gap-2 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                                                                                            onChange={(e) => handleRangeChange(e, item)}
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

                                                <div className="mt-5 h-80">
                                                    <div className="h-80">
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
                                                // value={selectedScreens}
                                                // onChange={handleSelectChange}
                                                // options={Screenoptions}
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
                            </div> */}
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
                                        // handlebook={handlebook}
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
            </div>
        </div>
    )
}
