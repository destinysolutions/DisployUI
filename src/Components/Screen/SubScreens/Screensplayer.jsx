import React, { useState, useEffect } from "react";
import Sidebar from "../../Sidebar"
import Navbar from "../../Navbar";
import { GrRefresh } from 'react-icons/gr'
import { MdArrowBackIosNew } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'

const Screensplayer = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarOverlap, setsidebarOverlap] = useState(true);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 780) {
                setsidebarOverlap(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOverlap={sidebarOverlap}
                />
                <Navbar />
            </div>
            {<div className="pt-6 px-5">
                <div className={`${sidebarOpen ? (sidebarOverlap ? "ml-60" : "") : "ml-2"}`}>
                    <div className="justify-between flex items-center">
                        <div className="section-title">
                            <h1 className="not-italic font-medium text-2xl text-[#001737]">Screen Player</h1>
                        </div>
                        <div className="icons flex  items-center">
                            <div className="px-2">
                                <button className="border rounded-full "><GrRefresh className="text-3xl p-1" /></button>
                            </div>
                            <div className="px-1">
                                <button className="border rounded-full "><MdArrowBackIosNew /></button>
                            </div>
                            <div className="px-2">
                                <button ><RiDeleteBin5Line /></button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>}
        </>
    )
}

export default Screensplayer
