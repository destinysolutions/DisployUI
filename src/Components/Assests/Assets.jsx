import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"
import Navbar from "../Navbar";
import { TiFolderOpen } from 'react-icons/ti'
import { AiOutlineCloudUpload, AiOutlineUnorderedList } from 'react-icons/ai'
import { RxDashboard } from 'react-icons/rx'
const Assets = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            {<div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-[13rem]" : "ml-16"}`}>
                    <div className="lg:flex lg:justify-between sm:block items-center">
                        <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
                            Assets
                        </h1>
                        <div className="lg:flex md:flex sm:block lg:mt-0 md:mt-0 sm:mt-3">
                            <button className=" dashboard-btn  flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5  py-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                <TiFolderOpen className="text-2xl rounded-full mr-1 bg-primary text-white p-1" />
                                New Folder
                            </button>
                            <button className=" dashboard-btn flex align-middle items-center text-primary rounded-full  text-base border border-primary lg:px-9 sm:px-5  mr-3  py-2 sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                <AiOutlineCloudUpload className="text-2xl rounded-full mr-1 bg-primary text-white p-1" />
                                Upload
                            </button>

                            <ul className="flex items-center  mr-3  rounded-full  border border-primary">
                                <li className="flex items-center"><button className="px-2"><RxDashboard className="text-primary text-lg" /></button></li>
                                <li className="flex items-center"><button className="px-2"><AiOutlineUnorderedList /></button></li>

                            </ul>
                            <button>
                                <input type="checkbox" className=" mx-1 w-6 h-5 mt-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default Assets
