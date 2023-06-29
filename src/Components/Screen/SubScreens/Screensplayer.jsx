import React, { useState, useEffect } from "react";
import Sidebar from "../../Sidebar"
import Navbar from "../../Navbar";
import { IoMdRefresh } from 'react-icons/io'
import { MdArrowBackIosNew } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'

const Screensplayer = ({ sidebarOpen, setSidebarOpen }) => {


    return (
        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            {<div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-56" : "ml-16"}`}>
                    <div className="justify-between flex items-center">
                        <div className="section-title">
                            <h1 className="not-italic font-medium text-2xl text-[#001737]">Screen Player</h1>
                        </div>
                        <div className="icons flex  items-center">
                            <div className="px-2">
                                <button className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-SlateBlue ">
                                    <IoMdRefresh className="p-1 text-3xl text-SlateBlue hover:text-white " />
                                </button>
                            </div>
                            <div>
                                <button className="border rounded-full "><MdArrowBackIosNew /></button>
                            </div>
                            <div >
                                <div>
                                    <button className="rounded-full mx-1 border hover:bg-red hover:border-red">
                                        <RiDeleteBin5Line className="text-2xl p-1 hover:text-white" />
                                    </button>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>}
        </>
    )
}

export default Screensplayer
