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
import { deleteDate, getDateApps } from "../../../Redux/AppsSlice";
import Loading from "../../Loading";
import SweetAlert from "../../BookYourSlot/SweetAlert";


const Date = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { userDetails, user } = useSelector((state) => state.root.auth);
    const appDropdownRef = useRef(null);
    const [selectAll, setselectAll] = useState(false);
    const [instanceID, setInstanceID] = useState();
    const [appDropDown, setAppDropDown] = useState(null);
    const [AppData, setAppData] = useState([]);
    const [sidebarload, setSidebarLoad] = useState(false);
    const [loadFirst, setloadFirst] = useState(true);

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
                                                                        onClick={() => { }}
                                                                    >
                                                                        <FiUpload className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                                                        Set to Screen
                                                                    </li>
                                                                    {/* <li className="flex text-sm items-center">
                                    <MdPlaylistPlay className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                    Add to Playlist
                                  </li> */}
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
                                                            // handleFetchWeatherById(item?.weatherAppId);
                                                            // setInstanceView(true);
                                                            "";
                                                        }}
                                                    />
                                                    <h4 className="text-lg font-medium mt-3">
                                                        {item?.instanceName}
                                                        {/* {item?.dateAppId} */}
                                                    </h4>
                                                    <h4
                                                        onClick={() => {
                                                            // item?.tags !== null &&
                                                            // item?.tags !== undefined &&
                                                            // item?.tags !== ""
                                                            //   ? setTags(item?.tags?.split(","))
                                                            //   : setTags([]);
                                                            // setShowTagModal(true);
                                                            // setUpdateTagWeather(item);
                                                            "";
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Date