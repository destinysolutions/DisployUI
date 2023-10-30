import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { TbAppsFilled } from "react-icons/tb";
import { BsInfoLg } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";

const Weather = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Apps
            </h1>
            <Link to="/weather-detail">
              <button className="flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbAppsFilled className="text-2xl mr-2 bg-primary text-white rounded-full p-1" />
                New Instance
              </button>
            </Link>
          </div>
          <div className="mt-5 mb-5">
            <div className="shadow-md bg-white rounded-lg p-5 h-full">
              <div className="flex justify-between items-center from-blue-900 to-gray-800 text-2xl text-block">
                <h1 className="not-italic font-medium text-xl text-[#001737] ">
                  Weather Instance
                </h1>
                <div className="flex items-center">
                  <button className="w-8 h-8  ml-2 border-primary items-center border-2 rounded-full p-1 text-xl hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <BsInfoLg />
                  </button>
                  <button className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full p-1 text-xl hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-10 gap-4 mt-5">
                <div className="lg:col-span-2 md:col-span-5 sm:col-span-10 ">
                  <div className="shadow-md bg-[#EFF3FF] rounded-lg h-full">
                    <div className="relative">
                      <button className="float-right p-2">
                        <input className="h-5 w-5" type="checkbox" />
                      </button>
                    </div>
                    <div className="text-center clear-both pb-8">
                      <img
                        src="../../../public/AppsImg/weather-icon.svg"
                        alt="Logo"
                        className="cursor-pointer mx-auto h-30 w-30"
                      />
                      <h4 className="text-lg font-medium mt-3">
                        <a href="weather-appdetail.html"> Weather</a>
                      </h4>
                      <h4 className="text-sm font-normal ">Added </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weather;
