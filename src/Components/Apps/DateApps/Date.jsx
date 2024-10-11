import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TbAppsFilled } from "react-icons/tb";
import { MdArrowBackIosNew, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiUpload } from "react-icons/fi";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { deleteDate, getDateApps, getDateById } from "../../../Redux/AppsSlice";
import Loading from "../../Loading";
import SweetAlert from "../../BookYourSlot/SweetAlert";
import AddOrEditTagPopup from "../../AddOrEditTagPopup";
import { ADD_DATE_TAGS, ASSIGN_DATE_SCREEN } from "../../../Pages/Api";
import axios from "axios";
import ScreenAssignModal from "../../ScreenAssignModal";
import { socket } from "../../../App";
import { AiOutlineCloseCircle } from "react-icons/ai";
import toast from "react-hot-toast";
import moment from "moment";
import { getDaysInMonth, getFirstDayOfMonthforsunday, getFirstDayOfMonthmonday } from "../../Common/Common";


const Date = ({ sidebarOpen, setSidebarOpen }) => {
    const { userDetails, token } = useSelector((state) => state.root.auth);
    const modalRef = useRef(null);
    const authToken = `Bearer ${token}`;
    const addScreenRef = useRef(null);
    const appDropdownRef = useRef(null);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [selectAll, setselectAll] = useState(false);
    const [instanceID, setInstanceID] = useState();
    const [appDropDown, setAppDropDown] = useState(null);
    const [AppData, setAppData] = useState([]);
    const [sidebarload, setSidebarLoad] = useState(false);
    const [loadFirst, setloadFirst] = useState(true);
    const [showTagModal, setShowTagModal] = useState(false);
    const [tags, setTags] = useState([]);
    const [updateTagDate, setUpdateTagDate] = useState(null);
    const [selectScreenModal, setSelectScreenModal] = useState(false);
    const [addScreenModal, setAddScreenModal] = useState(false);
    const [screenSelected, setScreenSelected] = useState([]);
    const [selectedScreens, setSelectedScreens] = useState([]);
    const [selectdata, setSelectData] = useState({});
    const [instanceView, setInstanceView] = useState(false);
    const [instanceName, setInstanceName] = useState();
    const [SelectLayout, setSelectLayout] = useState({ Startweek: "SunDay", });
    const [showTags, setShowTags] = useState(null);
    const [screenAssignName, setScreenAssignName] = useState("");

    // const currentDate = new Date();
    const year = moment().format('YYYY');
    const month = moment().date();
    const now = moment().date();
    const currentDayName = moment().format('dddd');
    const currentMonthName = moment().format('MMMM');
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = SelectLayout?.Startweek === "Monday" ? getFirstDayOfMonthmonday(year, month) : getFirstDayOfMonthforsunday(year, month);

    useEffect(() => {
        if (loadFirst) {
            setSidebarLoad(true)
            dispatch(getDateApps({})).then((res) => {
                setAppData(res?.payload?.data)
                setSidebarLoad(false)
            })
            setloadFirst(false)
        }
    }, [dispatch, loadFirst]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                appDropdownRef.current &&
                !appDropdownRef.current.contains(event?.target)
            ) {
                setAppDropDown(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    const handleSelectAll = () => {
        setselectAll((prev) => !prev);
    };

    const handleAppDropDownClick = (id) => {
        setInstanceID(id);
        if (appDropDown === id) {
            setAppDropDown(null);
        } else {
            setAppDropDown(id);
        }
    };

    const handlerDeleteDate = async (id) => {
        try {
            const result = await SweetAlert.confirm("Are you sure?", "Are you sure you want to delete this!");
            if (result?.isConfirmed) {
                dispatch(deleteDate(id)).then((res) => {
                    if (res?.payload?.status === true) {
                        setloadFirst(true)
                        SweetAlert.success("Deleted successfully");
                    }
                });
            }
        } catch (error) {
            console.error("Error:", error);
            SweetAlert.error("An error occurred");
        }
    }

    const handleUpdateTagsDate = (tags) => {

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${ADD_DATE_TAGS}?DateAppId=${updateTagDate?.dateAppId}&Tags=${tags.length === 0 ? "" : tags}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
            // data: data,
        };

        axios
            .request(config)
            .then((response) => {
                if (response?.data?.status === 200) {
                    const updatedData = AppData.map((item) => {
                        if (item?.dateAppId === updateTagDate?.dateAppId) {
                            return { ...item, tags: tags };
                        } else {
                            return item;
                        }
                    });
                    setAppData(updatedData);
                }
            }).catch((error) => {
                console.log(error);
            });
    };


    const handleUpdateScreenAssign = (screenIds, macids) => {
        console.log('macids :>> ', macids);

        let idS = "";
        for (const key in screenIds) {
            if (screenIds[key] === true) {
                idS += `${key},`;
            }
        }
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${ASSIGN_DATE_SCREEN}?DateAppId=${instanceID}&screenId=${idS}`,
            headers: {
                Authorization: authToken,
            },
        };

        axios
            .request(config)
            .then((response) => {
                console.log('response :>> ', response);
                if (response.data.status === 200) {
                    const Params = {
                        id: socket.id,
                        connection: socket.connected,
                        macId: macids,
                    };
                    console.log('Params :>> ', Params);
                    socket.emit("ScreenConnected", Params);
                }
                setSelectScreenModal(false);
                setAddScreenModal(false);
                setloadFirst(true)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchDatebyID = (id) => {
        toast.loading("Fetching Data....");
        dispatch(getDateById(id)).then((res) => {
            if (res?.payload?.status === 200) {
                toast.remove();
                const fetchData = res?.payload?.data
                // setEditData(fetchData)
                setScreenAssignName(fetchData?.screens);
                setShowTags(fetchData?.tags);
                setScreenSelected(fetchData?.screens?.split(","));
                setSelectLayout({ Startweek: fetchData?.startWeek })
                setInstanceName(fetchData?.instanceName)
            }
        }).catch((error) => {
            console.log('error :>> ', error);
            toast.remove();
        })
    }


    return (
        <div>
            {sidebarload && <Loading />}
            <div className="flex border-b border-gray">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div
                className={
                    userDetails?.isTrial && !userDetails?.isActivePlan
                        ? "lg:pt-32 md:pt-32 pt-10 px-5"
                        : "lg:pt-24 md:pt-24 pt-10 px-5 "
                }
            >
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="lg:flex lg:justify-between sm:block items-center">
                        <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                            Apps
                        </h1>
                        <div className="lg:flex">
                            <Link to="/Datedetails">
                                <button className="flex items-center bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2 text-base sm:text-sm mr-3 hover:bg-primary">
                                    <TbAppsFilled className="text-2xl mr-2" />
                                    New Instance
                                </button>
                            </Link>
                            <Link to="/apps">
                                <button className="flex items-center bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2 text-base sm:text-sm mr-3 hover:bg-primary">
                                    <MdArrowBackIosNew className="text-2xl mr-2" />
                                    Back
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-5 mb-5">
                        <div className="shadow-md bg-white rounded-lg p-5">
                            <div className="flex justify-between items-center">
                                <h1 className="font-medium text-xl text-[#001737] "> Date</h1>
                                <div className="flex items-center">
                                    <button className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full px-1 text-2xl hover:bg-SlateBlue">
                                        <RiDeleteBinLine className="text-xl" />
                                    </button>
                                    <button className="sm:ml-2 xs:ml-1 mt-1">
                                        <input
                                            type="checkbox"
                                            className="h-7 w-7"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className=" grid grid-cols-12 gap-4 mt-5">
                                {AppData?.length > 0 ? (
                                    AppData?.map((item, index) => (
                                        <div className="xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-12" key={index}>
                                            <div className="shadow-md bg-[#EFF3FF] rounded-lg h-full">
                                                <div className="relative flex justify-between">
                                                    <button className="float-right p-2">
                                                        <input
                                                            className="h-5 w-5"
                                                            type="checkbox"
                                                            style={{ display: selectAll ? "block" : "none", }}
                                                            checked={true}
                                                            onChange={() =>
                                                                //   handleCheckboxChange(item?.weatherAppId)
                                                                ""
                                                            }
                                                        />
                                                    </button>
                                                    <div className="relative">
                                                        <button className="float-right">
                                                            <BiDotsHorizontalRounded
                                                                className="text-2xl"
                                                                onClick={() => handleAppDropDownClick(item?.dateAppId)}
                                                            />
                                                        </button>
                                                        {appDropDown === item?.dateAppId && (
                                                            <div ref={appDropdownRef} className="appdw">
                                                                <ul className="space-y-2">
                                                                    <li
                                                                        onClick={() => navigate(`/Datedetails/${item?.dateAppId}`)}
                                                                        className="flex text-sm items-center cursor-pointer"
                                                                    >
                                                                        <MdOutlineEdit className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                                                        Edit
                                                                    </li>
                                                                    <li
                                                                        className="flex text-sm items-center cursor-pointer"
                                                                        onClick={() => {
                                                                            setAddScreenModal(true);
                                                                            setSelectData(item);
                                                                        }}
                                                                    >
                                                                        <FiUpload className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                                                        Set to Screen
                                                                    </li>
                                                                    <li className="flex text-sm items-center cursor-pointer"
                                                                        onClick={() => handlerDeleteDate(item?.dateAppId)}
                                                                    >
                                                                        <RiDeleteBin5Line className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                                                        Delete
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-center clear-both pb-8">
                                                    <img
                                                        src="https://app-registry-assets.screencloudapp.com/icons/img_app_icon_date.png"
                                                        alt="Logo"
                                                        className="cursor-pointer mx-auto h-20 w-20"
                                                        onClick={() => {
                                                            fetchDatebyID(item?.dateAppId);
                                                            setInstanceView(true);
                                                        }}
                                                    />
                                                    <h4 className="text-lg font-medium mt-3">
                                                        {item?.instanceName}
                                                        {/* {item?.dateAppId} */}
                                                    </h4>
                                                    <h4
                                                        onClick={() => {
                                                            item?.tags !== null &&
                                                                item?.tags !== undefined &&
                                                                item?.tags !== ""
                                                                ? setTags(item?.tags?.split(","))
                                                                : setTags([]);
                                                            setShowTagModal(true);
                                                            setUpdateTagDate(item);
                                                        }}
                                                        className="text-sm font-normal cursor-pointer"
                                                    >
                                                        Add tags +
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center font-semibold text-xl col-span-full">
                                        No Apps here.
                                    </div>
                                )}
                            </div>
                            {instanceView && (
                                <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-9990 outline-none focus:outline-none">
                                    <div ref={modalRef}>
                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                                            <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7]  rounded-t">
                                                <div className="flex items-center">
                                                    <div>
                                                        <img
                                                            src="https://app-registry-assets.screencloudapp.com/icons/img_app_icon_date.png"
                                                            alt="Logo"
                                                            className="cursor-pointer mx-auto h-10 w-10"
                                                        />
                                                    </div>
                                                    <div className="ml-3">
                                                        <h4 className="text-lg font-medium whitespace-wrap  w-[900px]">{instanceName}</h4>
                                                    </div>
                                                </div>
                                                <button
                                                    className="p-1 text-3xl"
                                                    onClick={() => setInstanceView(false)}
                                                >
                                                    <AiOutlineCloseCircle />
                                                </button>
                                            </div>
                                            {/* custom-scrollbar */}
                                            <div className="">
                                                <div className="w-full h-[30rem] bg-gray-50 rounded-sm shadow-md border-4 border-black bg-sky-100 flex items-center justify-center overscroll-none ">
                                                    <div className="flex items-center  h-[65%]  bg-white shadow-lg  w-[60%]    py-5">
                                                        <div className="calendar py-3 p-4 ">
                                                            <h5 className=" flex justify-center my-3   text-xl font-semibold text-black">
                                                                {currentMonthName}
                                                            </h5>
                                                            <div className="grid grid-cols-7 gap-x-10 gap-y-3 text-center text-xl my-5 ">
                                                                {Array.from({ length: firstDay }, (_, i) => (
                                                                    <div key={`empty-${i}`} className=" "></div>
                                                                ))}

                                                                {Array.from({ length: daysInMonth }, (_, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={` text-center  ${now === i + 1 ? " bg-red text-white text-xl h-8 w-8 pt-0.5 rounded-full" : ""}`}
                                                                    >
                                                                        {i + 1}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-center h-[22rem] bg-red w-[300px]  ml-8">
                                                            <div className="text-center">
                                                                <h1 className="text-2xl font-semibold text-white  ">
                                                                    {currentDayName}
                                                                </h1>
                                                                <h1 className="text-9xl text-white mt-2 ">{now}</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2 px-6">
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className="font-semibold w-fit">
                                                        Tags:-
                                                    </div>
                                                    <div className=" w-full">{showTags}</div>
                                                </div>
                                                <div>
                                                    <label className="font-semibold">
                                                        Screen Assign :
                                                    </label>
                                                    {screenAssignName == "" ? " No Screen" : screenAssignName}
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

            {addScreenModal && (
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                    <div
                        ref={addScreenRef}
                        className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
                    >
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                                <div className="flex items-center">
                                    <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                                        Select the screen to set the App
                                    </h3>
                                </div>
                                <button
                                    className="p-1 text-xl ml-8"
                                    onClick={() => setAddScreenModal(false)}
                                >
                                    <AiOutlineCloseCircle className="text-2xl" />
                                </button>
                            </div>
                            <div className="flex justify-center p-9 ">
                                <p className="break-words w-[280px] text-base text-black text-center">
                                    New Text-Scroll App Instance would be applied. Do you want to
                                    proceed?
                                </p>
                            </div>
                            <div className="pb-6 flex justify-center">
                                <button
                                    className="bg-primary text-white px-8 py-2 rounded-full"
                                    onClick={() => {
                                        if (selectdata?.screenIDs) {
                                            let arr = [selectdata?.screenIDs];
                                            let newArr = arr[0]
                                                .split(",")
                                                .map((item) => parseInt(item.trim()));
                                            setSelectedScreens(newArr);
                                        }
                                        setSelectScreenModal(true);
                                        setAddScreenModal(false);
                                    }}
                                >
                                    OK
                                </button>

                                <button
                                    className="bg-primary text-white px-4 py-2 rounded-full ml-3"
                                    onClick={() => setAddScreenModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectScreenModal && (
                <ScreenAssignModal
                    setAddScreenModal={setAddScreenModal}
                    setSelectScreenModal={setSelectScreenModal}
                    handleUpdateScreenAssign={handleUpdateScreenAssign}
                    selectedScreens={selectedScreens}
                    setSelectedScreens={setSelectedScreens}
                    screenSelected={screenSelected}
                    sidebarOpen={sidebarOpen}
                />
            )}

            {showTagModal && (
                <AddOrEditTagPopup
                    setShowTagModal={setShowTagModal}
                    tags={tags}
                    setTags={setTags}
                    handleUpdateTagsDate={handleUpdateTagsDate}
                    from="Date"
                    setUpdateTagDate={setUpdateTagDate}
                />
            )}
        </div>
    )
}

export default Date