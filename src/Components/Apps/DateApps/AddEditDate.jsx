import React from "react";
import { useState, } from "react";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineClose, } from "react-icons/ai";
import { MdSave } from "react-icons/md";
import { useSelector } from "react-redux";

import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { getDaysInMonth, getFirstDayOfMonthforsunday, getFirstDayOfMonthmonday } from "../../Common/Common";
import { useDispatch } from "react-redux";
import { handleAddDateApps } from "../../../Redux/AppsSlice";
import { logRoles } from "@testing-library/react";

const AddEditDate = ({ sidebarOpen, setSidebarOpen }) => {
    const currentDate = new Date();
    const navigate = useNavigate()
    const { user, userDetails } = useSelector((state) => state.root.auth);
    const [edited, setEdited] = useState(false);
    const [SelectLayout, setSelectLayout] = useState({
        Startweek: "SunDay",
    });
    const [showPreview, setShowPreview] = useState(false);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const now = currentDate.getDate();
    const dispatch = useDispatch()
    const [saveLoading, setSaveLoading] = useState(false);

    const getCurrentMonthName = () => {
        var MonthName = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return MonthName[month];
    };
    const getCurrentDayName = () => {
        const now = new Date();
        const dayIndex = now.getDay();
        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        return dayNames[dayIndex];
    };

    const currentDayName = getCurrentDayName();
    const currentMonthName = getCurrentMonthName();

    const daysInMonth = getDaysInMonth(year, month);
    console.log("daysInMonth", daysInMonth);

    const firstDay =
        SelectLayout.Startweek === "Monday"
            ? getFirstDayOfMonthmonday(year, month)
            : getFirstDayOfMonthforsunday(year, month);
    console.log("first", firstDay);

    const [instanceName, setInstanceName] = useState(
        moment(currentDate).format("YYYY-MM-DD hh:mm")
    );

    const handleOnSaveInstanceName = (e) => {
        if (!instanceName.replace(/\s/g, "").length) {
            return toast.error("Instance Name is Required.");
        }
        setEdited(false);
    };
    const handalselect = (e) => {
        const { value } = e.target;
        setSelectLayout((pre) => ({
            ...pre,
            Startweek: value,
        }));
    };
    console.log('SelectLayout :>> ', SelectLayout);
    const onSumbit = async () => {
        const Payload = {
            dateAppId: 0,
            instanceName: instanceName,
            startWeek: SelectLayout.Startweek,
            // userID: 0,
            // screens: "string",
            // screenIDs: "string",
            // maciDs: "string",
            // tags: "string"
        }
        toast.loading('Saving ...')
        setSaveLoading(true);
        try {
            await dispatch(handleAddDateApps(Payload)).then((res) => {
                toast.remove()
                setSaveLoading(false);
                navigate('/Date')
            })
        } catch (error) {
            console.log('error :>> ', error);
            setSaveLoading(false);
        }
    }


    return (
        <>
            <div className="flex border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div
                className={
                    userDetails?.isTrial &&
                        user?.userDetails?.isRetailer === false &&
                        !userDetails?.isActivePlan
                        ? "lg:pt-32 md:pt-32 sm:pt-20 xs:pt-20 px-5 page-contain"
                        : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"
                }
            >
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="px-6 page-contain">
                        <div>
                            <div className="lg:flex lg:justify-between sm:block my-4 items-center">
                                <div className="flex items-center">
                                    {edited ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="w-full border border-primary rounded-md px-2 py-1"
                                                placeholder="Enter schedule name"
                                                value={instanceName}
                                                onChange={(e) => {
                                                    setInstanceName(e.target.value);
                                                }}
                                            />
                                            <MdSave
                                                onClick={() => handleOnSaveInstanceName()}
                                                className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex">
                                            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                                                {instanceName}
                                            </h1>
                                            <button onClick={() => setEdited(true)}>
                                                <GoPencil className="ml-4 text-lg" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
                                    <button
                                        className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-2 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={() => {
                                            setShowPreview(!showPreview);
                                        }}
                                    >
                                        {showPreview ? "Edit" : "Preview"}
                                    </button>
                                    <button
                                        className="flex  align-middle border-white bg-SlateBlue text-white sm:mt-2  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 .  text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={() => onSumbit()}
                                        disabled={saveLoading}
                                    >
                                        {saveLoading ? "Saving..." : "Save"}
                                    </button>

                                    <Link to="/Date">
                                        <button className="sm:ml-2 xs:ml-1 sm:mt-2 border-primary items-center border-2  rounded-full text-xl  hover:text-white hover:bg-SlateBlue hover:border-white hover:shadow-lg hover:shadow-primary-500/50 p-2 ">
                                            <AiOutlineClose />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            {showPreview === true ? (
                                <div className="w-[90%] h-[30rem] bg-gray-50 rounded-sm shadow-md border-4 border-black bg-sky-100 flex items-center justify-center">
                                    <div className="flex items-center  h-[65%] bg-gray-100 w-[50%] ">
                                        <div className="calendar p-4 ">
                                            <h5 className=" flex justify-center mb-3  top-0 font-bold text-xl">
                                                {currentMonthName}
                                            </h5>
                                            <div className="grid grid-cols-7 gap-8 text-center text-xl">
                                                {Array.from({ length: firstDay }, (_, i) => (
                                                    <div key={`empty-${i}`} className=" "></div>
                                                ))}

                                                {Array.from({ length: daysInMonth }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        className={` text-center  ${now === i + 1
                                                            ? " bg-red text-white text-xl w-[25px] rounded-xl"
                                                            : ""
                                                            }`}
                                                    >
                                                        {i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center h-[22rem] bg-red w-[300px]">
                                            <div className="text-center">
                                                <h1 className="text-3xl font-semibold">
                                                    {currentDayName}
                                                </h1>
                                                <h1 className="text-9xl text-white mt-2">{now}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col lg:flex-row bg-white shadow-lg rounded-lg h-full">
                                    <div className="w-full lg:w-2/5 pr-0 lg:pr-4 mb-4 lg:mb-0 p-5">
                                        <div className="mb-3 relative inline-flex items-center w-full">
                                            <label
                                                htmlFor="message"
                                                className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Start the week on*
                                            </label>
                                            <select
                                                id="countries"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                defaultValue={""}
                                                value={SelectLayout.Startweek}
                                                onChange={handalselect}
                                            >
                                                <option value="Sunday">Sunday</option>
                                                <option value="Monday">Monday</option>
                                            </select>
                                        </div>

                                        {/* <div className="mb-3 relative inline-flex items-center w-full">
                    <label
                      htmlFor="message"
                      className="w-2/5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Start the week on*
                    </label>
                    <select
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={""}
                    >
                      <option value="English">English</option>
                      <option value="Span">Span</option>
                    </select>
                  </div> */}
                                    </div>

                                    <div className="border-r-0 lg:border-r-2 border-gray-300 h-auto mx-4 hidden lg:block"></div>

                                    <div className="w-full lg:w-3/5 h-[35rem] flex items-center justify-center mt-4 lg:mt-0">
                                        <div className="w-[85%] h-[25rem] bg-gray-50 rounded-sm shadow-md border-4 border-black flex items-center justify-center">
                                            <div className="flex items-center  h-[60%] bg-gray-100 w-[70%] ">
                                                <div className="calendar p-4 ">
                                                    <h5 className=" flex justify-center mb-4 top-0 font-bold">
                                                        {currentMonthName}
                                                    </h5>
                                                    <div className="grid grid-cols-7 gap-2 text-center ">
                                                        {Array.from({ length: firstDay }, (_, i) => (
                                                            <div key={`empty-${i}`} className=" "></div>
                                                        ))}

                                                        {Array.from({ length: daysInMonth }, (_, i) => (
                                                            <div
                                                                key={i}
                                                                className={` text-center  ${now === i + 1
                                                                    ? " bg-red text-white text-xl w-[25px] rounded-xl font-semibold"
                                                                    : ""
                                                                    }`}
                                                            >
                                                                {i + 1}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-center h-[18rem] bg-red w-[50%]">
                                                    <div className="text-center">
                                                        <h1 className="text-2xl font-semibold text-slate-50">
                                                            {currentDayName}
                                                        </h1>
                                                        <h1 className="text-7xl text-white mt-2 font-bold">{now}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEditDate;

