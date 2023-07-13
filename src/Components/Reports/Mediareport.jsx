import React from 'react'
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import '../../Styles/Report.css'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { AiOutlineSearch } from 'react-icons/ai'
import { LuDownload } from 'react-icons/lu'
import { FaFilter } from 'react-icons/fa'
const Mediareport = (sidebarOpen, setSidebarOpen) => {
    Mediareport.propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
        setSidebarOpen: PropTypes.func.isRequired,
    };

    return (

        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
                    <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
                        <div className='flex items-center'>
                            <MdKeyboardArrowLeft className='text-4xl text-primary' />
                            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                                Media Reports
                            </h1>
                        </div>

                        <div className='rightbtn flex items-center'>
                            <ul className='p-0 m-0 flex items-center border rounded-md border-primary mr-3'>
                                <li className='bg-primary text-white py-2 px-4 font-light-[26px] rounded-tl-md rounded-tb-md'><label>Daily</label></li>
                                <li><input type='date' className='p-2 bg-[transparent] text-base' /></li>
                            </ul>

                            <div className=" flex items-end justify-end relative sm:mr-0">
                                <AiOutlineSearch className="absolute top-[13px] left-[15px] z-10 text-primary searchicon" />
                                <input
                                    type="text"
                                    placeholder=" Search Users "
                                    className="border border-primary rounded-full bg-[transparent] pl-7 py-2 search-user placeholder:text-primary" />
                            </div>

                            <div className='ml-2'>
                                <button className="border rounded-full  hover:shadow-xl hover:bg-SlateBlue border-primary ">
                                    <LuDownload className="p-2 text-4xl text-primary hover:text-white " />
                                </button>
                            </div>


                        </div>



                    </div>

                    <div className='sectiondetails mt-5 bg-white p-5 rounded-md'>
                        <table className='w-full'>
                            <tr className='bg-[#E4E6FF]'>
                                <th className='flex items-center'>Media <FaFilter className='text-sm text-primary ml-2' /></th>
                                <th>Loop Counter</th>
                                <th>Duration</th>

                            </tr>
                        </table>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Mediareport
