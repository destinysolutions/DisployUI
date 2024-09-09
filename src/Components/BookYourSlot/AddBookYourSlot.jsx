import React, { useState } from 'react'
import Loading from '../Loading'
import Sidebar from '../Sidebar'
import Navbar from '../Navbar'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { buttons, constructTimeObjects, Frequent, greenOptions, kilometersToMeters, multiOptions } from '../Common/Common';
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
import { PAYMENT_INTENT_CREATE_REQUEST, stripePromise } from '../../Pages/Api';
import { handlePaymentIntegration } from '../../Redux/PaymentSlice';
import { useDispatch } from 'react-redux';
import { Elements } from "@stripe/react-stripe-js";
import AddPayment from '../Screen/SubScreens/BookSlot/AddPayment';
import ThankYouPage from '../Screen/SubScreens/BookSlot/ThankYouPage';
import ImageUploadPopup from '../Screen/SubScreens/BookSlot/ImageUploadPopup';
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
    const [temperature, setTemprature] = useState("");
    const [temperatureUnit, setTempratureUnit] = useState("Hour");
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
    const [states, setStates] = useState([]);
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

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };
    const handleBack = () => {
        setPage(page - 1);
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

    const handleBookSlot = () => {
        // setPage(page + 1);

        const hasMissingImages = getallTime.some((item) => { return !item.verticalImage && !item.horizontalImage });
        if (hasMissingImages) {
            return toast.error("Please upload valid Vertical and Horizontal images.");
        } else {
            console.log("getallTime", getallTime);
            setPage(page + 1);
        }
    };

    // page 2
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

                // FetchScreen(Params);
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

    const handleScreenClick = (screen) => {
        setSelectedScreen(screen);
    };

    const handleNext = () => {
        setPage(page + 1);
        return
        let total = ""
        if (selectedScreens?.length === 0) {
            return toast.error("Please Select Screen");
        } else {
            let Price = 0;
            selectedScreens?.map((item) => {
                Price = Price + item?.Price;
            });
            setTotalPrice(Price);
            // setTotalCost(totalDuration * Price);
            // total = totalDuration * Price
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

    const handlePopupSubmit = (index, verticalImage, horizontalImage) => {
        const updatedItems = [...getallTime];
        updatedItems[index] = { ...updatedItems[index], verticalImage: verticalImage, horizontalImage: horizontalImage };
        setGetAllTime(updatedItems);
    };

    return (
        <div>
            <div className="flex bg-white border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>

            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain ">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="grid grid-cols-12 lg:mt-5">
                        <div className="lg:col-span-9 md:col-span-12 sm:col-span-12 xs:col-span-12 flex flex-col gap-2 items-start mb-3">
                            <p className="text-xl font-semibold ">Book your slot</p>
                        </div>
                    </div>
                    {page === 1 && (
                        <div className="w-full h-full p-5 flex items-center justify-center">
                            <div className="lg:w-[1000px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
                                <div className="grid grid-cols-4 gap-4 w-full h-full">
                                    <div className="col-span-4">
                                        <div className="rounded-lg shadow-md bg-white p-5 flex flex-col gap-4 h-full">
                                            <div className="grid grid-cols-4 gap-4">
                                                <div className="relative w-full col-span-2">
                                                    <label className="text-base font-medium">
                                                        Start Date:
                                                    </label>

                                                    <input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={handleStartDateChange}
                                                        className="formInput"
                                                    />
                                                </div>
                                                <div className="relative w-full col-span-2">
                                                    <label className="text-base font-medium">End Date:</label>
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        className="formInput"
                                                        onChange={handleEndDateChange}
                                                    // disabled={!repeat}
                                                    />
                                                </div>
                                            </div>

                                            {/* {repeat && (
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
                                        )} */}

                                            <div>
                                                <div className="overflow-auto max-h-80">
                                                    {getallTime?.map((item, index) => {

                                                        return (
                                                            <div
                                                                className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 gap-4 mb-3"
                                                                key={index}
                                                            >

                                                                <div className="relative w-full col-span-1">

                                                                    <input
                                                                        type="time"
                                                                        name={`startTime${index}`}
                                                                        id="name"
                                                                        value={item?.startTime}
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
                                                                        value={item?.endTime}
                                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                                        placeholder="Time"
                                                                        required=""
                                                                        onChange={(e) => handleEndTimeChange(e, index)}
                                                                    />

                                                                </div>


                                                                <div className="relative w-full col-span-1 flex gap-4 items-center">
                                                                    <div className="relative w-full col-span-1">
                                                                        <select
                                                                            className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                                                                            id="selectOption"
                                                                            value={item.sequence}
                                                                            onChange={(e) => handleSequenceChange(index, e.target.value)}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            {Frequent?.map((item) => {
                                                                                return (
                                                                                    <option
                                                                                        value={item.id}
                                                                                        key={item.id}
                                                                                    >
                                                                                        {item.value}
                                                                                    </option>
                                                                                );
                                                                            })}
                                                                        </select>
                                                                    </div>

                                                                    <button onClick={() => handleOpenImagePopup(index)}>
                                                                        <MdCloudUpload size={30} />
                                                                    </button>

                                                                    <FaPlusCircle
                                                                        className="cursor-pointer"
                                                                        size={30}
                                                                        onClick={() => {
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
                                                                        }}
                                                                    />
                                                                    {getallTime.length > 1 && (
                                                                        <RiDeleteBin5Line
                                                                            className="cursor-pointer"
                                                                            size={30}
                                                                            onClick={() => setGetAllTime(getallTime.filter((_, i) => i !== index))}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {/* {!repeat && (
                                                    <div className="flex gap-3 items-center mt-2">
                                                        <input
                                                            className='outline-none'
                                                            type="checkbox"
                                                            id='Repetition'
                                                            onChange={() => setRepeat(true)}
                                                        />
                                                        <label for='Repetition'>Repetition Days</label>
                                                    </div>
                                                )} */}
                                                    <div className="flex flex-col gap-3 mt-2">
                                                        <div className=" text-black font-medium text-lg">
                                                            {/* <label>Repeating {countAllDaysInRange()} Day(s)</label> */}
                                                        </div>
                                                        <div className="flex flex-row gap-3 items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectAllDays}
                                                                onChange={handleCheckboxChange}
                                                                id="repeat_all_day"
                                                                className='outline-none border-none h-4 w-4'
                                                            />
                                                            <label for='repeat_all_day'
                                                                className="ml-3 select-none"
                                                                htmlFor="repeat_all_day"
                                                            >
                                                                Repeat for All Day
                                                            </label>
                                                        </div>
                                                        <div>
                                                            {buttons.map((label, index) => (
                                                                <button
                                                                    className={`border border-primary px-3 py-1 mr-2 mb-2 rounded-full ${selectedDays[index] && "bg-SlateBlue border-white"} `}
                                                                    key={index}
                                                                    onClick={() => handleDayButtonClick(index, label)}
                                                                >
                                                                    {label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <label className="text-base font-medium">Repetition Duration</label>
                                                        <div className="mt-3">
                                                            <label className="text-base font-medium">
                                                                After every :
                                                            </label>
                                                            <div className="grid grid-cols-4 gap-4">
                                                                <div>
                                                                    <input
                                                                        className="block w-full p-2 text-gray-900 border border-gray-300  bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                                        type="number"
                                                                        value={temperature}
                                                                        onChange={(e) => {
                                                                            setTemprature(e.target.value);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex">
                                                                    <div className="ml-2 flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            value={temperatureUnit}
                                                                            checked={temperatureUnit === "Hour"}
                                                                            name="Cel"
                                                                            id='Hour'
                                                                            onChange={() => setTempratureUnit("Hour")}
                                                                        />
                                                                        <label for='Hour' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                                                            Hour
                                                                        </label>
                                                                    </div>
                                                                    <div className="ml-3 flex items-center">
                                                                        <input
                                                                            id='Minute'
                                                                            type="radio"
                                                                            value={temperatureUnit}
                                                                            checked={temperatureUnit === "Minute"}
                                                                            name="Cel"
                                                                            onChange={() => setTempratureUnit("Minute")}
                                                                        />
                                                                        <label for='Minute' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                                                            Minute
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/* {repeat && (
                                                )} */}
                                            </div>
                                            <div className="w-full ">
                                                <div className="flex justify-center h-full items-end">
                                                    <button
                                                        className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                                        onClick={() => navigate('/book-your-slot')}
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
                    {page === 2 && (
                        <>
                            <div className="w-full h-full p-5 flex items-center justify-center ">
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
                            </div>
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
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
