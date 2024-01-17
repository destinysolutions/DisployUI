import React from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";

const AddMergeScreen = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <>
            <div className="flex border-b border-gray bg-white">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>

            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="justify-between lg:flex md:flex items-center sm:block">
                        <div className="section-title">
                            <h1 className="not-italic font-medium text-2xl text-[#001737]">
                                Add Merge Screens
                            </h1>
                        </div>
                        <Link to="/mergescreen">
                            <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                <MdArrowBackIosNew className="text-2xl mr-2 text-white rounded-full p-1" />
                                Back
                            </button>
                        </Link>
                    </div>
                    <div className="lg:flex lg:justify-between sm:block mt-5 items-center">
                            <div className="w-full p-4 bg-white border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                                add +
                            </div>
                        </div>
                </div>
            </div>

        </>
    )
}

export default AddMergeScreen