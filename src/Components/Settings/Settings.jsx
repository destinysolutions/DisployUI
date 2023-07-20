import React from "react";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { BsInfoCircle } from 'react-icons/bs'
import { FaCertificate } from 'react-icons/fa'
import { HiOutlineUsers } from 'react-icons/hi'
import { MdOutlineStorage } from 'react-icons/md'
import { BsFileText } from 'react-icons/bs'
import { MdOutlineDiscount } from 'react-icons/md'
import { SiMediamarkt } from 'react-icons/si'
import { SlCalender } from 'react-icons/sl'
import { FiUserCheck } from 'react-icons/fi'
import { RiEyeLine } from 'react-icons/ri'
import { AiOutlineSearch } from 'react-icons/ai'
import DataTable from "react-data-table-component";

import Userrole from "./Userrole";
import Users from "./Users";
import ScreenAuthorize from "./ScreenAuthorize";
import Billing from "./Billing";
import Myplan from "./Myplan";
import Discount from "./Discount";
import Storagelimit from "./Storagelimit";
import '../../Styles/Settings.css'

const Settings = ({ sidebarOpen, setSidebarOpen }) => {
    Settings.propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
        setSidebarOpen: PropTypes.func.isRequired,
    };
    const [STabs, setSTabs] = useState(1);
    function updateTab(id) {
        setSTabs(id);
    }

    {/* switch on off*/ }
    function handleFilter(event) {
        const newData = data.map((row) => {
            if (row.cname.toLowerCase().includes(event.target.value.toLowerCase())) {
                return { ...row }; // Preserve the row
            } else {
                return { ...row, enabled: false }; // Set enabled to false for rows that don't match the filter
            }
        });
        setRecords(newData);
    }

    {/* Data Table */ }
    const column = [
        {
            name: "Company Name",
            selector: (row) => row.cname,
            sortable: true,
        },
        {
            name: "Total Screen",
            selector: (row) => row.totalscreen,
            sortable: true,
        },
        {
            name: "Location",
            selector: (row) => row.location,
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => (
                <label className="inline-flex relative items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={row.enabled}
                        onChange={() => {
                            const newData = data.map((rowData) => {
                                if (rowData.id === row.id) {
                                    return { ...rowData, enabled: !rowData.enabled };
                                }
                                return rowData;
                            });
                            setRecords(newData);
                        }}
                    />
                    <div
                        onClick={() => {
                            const newData = data.map((rowData) => {
                                if (rowData.id === row.id) {
                                    return { ...rowData, enabled: !rowData.enabled };
                                }
                                return rowData;
                            });
                            setRecords(newData);
                        }}
                        className={`w-10 h-5 bg-gray rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${row.enabled ? "peer-checked:bg-[#009618]" : ""
                            }`}
                    ></div>
                </label>
            ),
        },
        {
            name: "",
            selector: (row) => row.show,
            sortable: true,
        },
    ];
    const data = [
        {
            id: 1,
            cname: "Company 1",
            totalscreen: <label className="text-base bg-[#E4E6FF] p-3 rounded-xl">15</label>,
            location: "India, USA ",
            enabled: true,
            show: <button><RiEyeLine className="text-xl text-[#8E94A9]" /></button>
        },
        {
            id: 2,
            cname: "Patels",
            totalscreen: <label className="text-base bg-[#E4E6FF] p-3 rounded-xl">25</label>,
            location: "India, USA ",
            enabled: false,
            show: <button><RiEyeLine className="text-xl text-[#8E94A9]" /></button>
        },
        {
            id: 3,
            cname: "Sundari",
            totalscreen: <label className="text-base bg-[#E4E6FF] p-3 rounded-xl">55</label>,
            location: "India, USA ",
            enabled: false,
            show: <button><RiEyeLine className="text-xl text-[#8E94A9]" /></button>
        },
        {
            id: 4,
            cname: "Company 4",
            totalscreen: <label className="text-base bg-[#E4E6FF] p-3 rounded-xl">45</label>,
            location: "India, USA ",
            enabled: true,
            show: <button><RiEyeLine className="text-xl text-[#8E94A9]" /></button>
        },
        {
            id: 5,
            cname: "Company 5",
            totalscreen: <label className="text-base bg-[#E4E6FF] p-3 rounded-xl">105</label>,
            location: "India, USA ",
            enabled: false,
            show: <button><RiEyeLine className="text-xl text-[#8E94A9]" /></button>

        },
        {
            id: 6,
            cname: "Company 6",
            totalscreen: <label className="text-base bg-[#E4E6FF] p-3 rounded-xl">15</label>,
            location: "India, USA ",
            enabled: false,
            show: <button><RiEyeLine className="text-xl text-[#8E94A9]" /></button>

        },
        {
            id: 7,
            cname: "Company 7",
            totalscreen: <label className="text-base bg-[#E4E6FF] p-3 rounded-xl">45</label>,
            location: "India, USA ",
            enabled: true,
            show: <button><RiEyeLine className="text-xl text-[#8E94A9]" /></button>
        },

    ]
    const [records, setRecords] = useState(data);

    function handleFilter(event) {
        const newData = data.filter((row) => {
            return row.cname.toLowerCase().includes(event.target.value.toLowerCase());
        });
        setRecords(newData);
    }

    {/*User roles*/ }


    return (
        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>



            <div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
                    <div className="lg:flex justify-between sm:flex xs:block  items-center mb-5 ">
                        <div className=' lg:mb-0 md:mb-0 sm:mb-4'>
                            <h1 className="not-italic font-medium lg:text-2xl  md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                                Settings
                            </h1>
                        </div>

                        {/* company info search */}
                        <div className={STabs === 1 ? "" : "hidden"} >
                            <div className="text-right flex items-end justify-end relative" >

                                <AiOutlineSearch className="absolute top-[13px] lg:right-[234px] md:right-[234px] sm:right-[234px] xs:right-auto xs:left-3 z-10 text-[#6e6e6e]" />
                                <input
                                    type="text"
                                    placeholder=" Search Company Name"
                                    className="border border-gray rounded-full px-7 py-2 setting-searchbtn w-full"
                                    onChange={handleFilter}
                                />
                            </div>
                        </div>
                        {/* User Roles search */}
                        <div className={STabs === 2 ? "" : "hidden"} >
                            <div className="text-right flex items-end justify-end relative" >

                                <AiOutlineSearch className="absolute top-[13px] lg:right-[234px] md:right-[234px] sm:right-[234px] xs:right-auto xs:left-3 z-10 text-[#6e6e6e]" />
                                <input
                                    type="text"
                                    placeholder=" Search User Role"
                                    className="border border-gray rounded-full px-7 py-2 setting-searchbtn w-full"

                                />
                            </div>
                        </div>

                        {/* Screen Authorize */}
                        <div className={STabs === 4 ? "" : "hidden"} >
                            <div className="text-right flex items-end justify-end relative" >

                                <AiOutlineSearch className="absolute top-[13px] lg:right-[234px] md:right-[234px] sm:right-[234px] xs:right-auto xs:left-3 z-10 text-[#6e6e6e]" />
                                <input
                                    type="text"
                                    placeholder=" Search User Name"
                                    className="border border-gray rounded-full px-7 py-2 setting-searchbtn w-full"

                                />
                            </div>
                        </div>

                        {/* Billing */}
                        <div className={STabs === 5 ? "" : "hidden"} >
                            <div className="text-right flex items-end justify-end relative" >

                                <AiOutlineSearch className="absolute top-[13px] lg:right-[234px] md:right-[234px] sm:right-[234px] xs:right-auto xs:left-3 z-10 text-[#6e6e6e]" />
                                <input
                                    type="text"
                                    placeholder=" Search User Name"
                                    className="border border-gray rounded-full px-7 py-2 setting-searchbtn w-full"

                                />
                            </div>
                        </div>

                        {/* My Plan */}
                        <div className={STabs === 6 ? "" : "hidden"} >
                            <div className="text-right flex items-end justify-end relative" >

                                <AiOutlineSearch className="absolute top-[13px] lg:right-[234px] md:right-[234px] sm:right-[234px] xs:right-auto xs:left-3 z-10 text-[#6e6e6e]" />
                                <input
                                    type="text"
                                    placeholder=" Search Plan"
                                    className="border border-gray rounded-full px-7 py-2 setting-searchbtn w-full"

                                />
                            </div>
                        </div>


                    </div>

                    <div className="grid grid-cols-12">
                        {/*Tab*/}
                        <div className='mainsettingtab  lg:col-span-2 md:col-span-3 sm:col-span-3 xs:col-span-12  p-0 '>
                            <ul className="w-full">
                                <li className="">

                                    <button
                                        className={STabs === 1 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(1)}>
                                        <BsInfoCircle className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /> <span className="text-base text-primary">Company Info</span>
                                    </button>
                                </li>
                                <li className="">

                                    <button
                                        className={STabs === 2 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(2)}><FaCertificate className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /><span className="text-base text-primary">User Role</span>
                                    </button>
                                </li>
                                <li className="">

                                    <button
                                        className={STabs === 3 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(3)}><HiOutlineUsers className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /> <span className="text-base text-primary">Users</span>
                                    </button>
                                </li>

                                <li className="">

                                    <button
                                        className={STabs === 4 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(4)}><FiUserCheck className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /> <span className="text-base text-primary">Authorized Screen</span></button>
                                </li>


                                <li className="">

                                    <button
                                        className={STabs === 5 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(5)}><BsFileText className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /><span className="text-base text-primary">Billing</span>
                                    </button>
                                </li>


                                <li className="">

                                    <button
                                        className={STabs === 6 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(6)}><SlCalender className=" text-3xl  text-white bg-primary rounded-md p-2 mr-2" /> <span className="text-base text-primary"> My Plan</span>
                                    </button>
                                </li>

                                <li className="">

                                    <button
                                        className={STabs === 7 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(7)}><MdOutlineDiscount className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /> <span className="text-base text-primary">Discount</span>
                                    </button>
                                </li>

                                <li className="">

                                    <button
                                        className={STabs === 8 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(8)}><MdOutlineStorage className="bg-primary text-white text-3xl rounded-md p-1 mr-2" /> <span className="text-base text-primary"> Storage Limit</span>
                                    </button>
                                </li>

                                <li className="">

                                    <button
                                        className={STabs === 9 ? "stabshow settingtabactive" : "settingtab"}
                                        onClick={() => updateTab(9)}><SiMediamarkt className="bg-primary text-white text-3xl rounded-md p-1 mr-2" />  <span className="text-base text-primary">Default Media</span>
                                    </button>
                                </li>



                            </ul>
                        </div>

                        {/*Tab details*/}
                        <div className="lg:col-span-10 md:col-span-9 sm:col-span-9 xs:col-span-12 bg-white lg:p-5 md:p-5 sm:p-2 xs:p-2 tabdetails rounded-md relative">
                            <div className={STabs === 1 ? "" : "hidden"}>
                                <DataTable
                                    columns={column}
                                    data={records}
                                    fixedHeader
                                    fixedHeaderScrollHeight="500px">
                                </DataTable>

                            </div>
                            {/*End of company info details*/}
                            <div className={STabs === 2 ? "" : "hidden"}>
                                <Userrole />
                            </div>
                            {/*End of userrole details*/}
                            <div className={STabs === 3 ? "" : "hidden"}>
                                <Users />
                            </div>
                            {/*End of users details*/}

                            <div className={STabs === 4 ? "" : "hidden"}>
                                <ScreenAuthorize />
                            </div>
                            {/*End of users details*/}
                            <div className={STabs === 5 ? "" : "hidden"}>
                                <Billing />
                            </div>
                            {/*End of Billing*/}
                            <div className={STabs === 6 ? "" : "hidden"}>
                                <Myplan />
                            </div>
                            {/*End of Plan*/}
                            <div className={STabs === 7 ? "" : "hidden"}>
                                <Discount />
                            </div>
                            {/*End of Plan*/}
                            <div className={STabs === 8 ? "" : "hidden"}>
                                <Storagelimit />
                            </div>
                            {/*Storage Limits*/}
                        </div>
                    </div>



                </div>
            </div>
        </>
    )
}

export default Settings