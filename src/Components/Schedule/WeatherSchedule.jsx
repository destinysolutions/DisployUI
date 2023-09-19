import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { MdOutlineGroups } from "react-icons/md";
import { useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import SaveAssignScreenModal from "./SaveAssignScreenModal";
import Footer from "../Footer";

const WeatherSchedule = ({ sidebarOpen, setSidebarOpen }) => {
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <div className="flex items-center">
              <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                weather schedule
              </h1>
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="lg:col-span-6 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5">
                <div className="p-2">
                  <label className="text-base font-medium">
                    weather schedule Name :
                  </label>
                </div>
                <div className="flex items-center p-2">
                  <label className="text-base font-medium">
                    Asset / Playing :
                  </label>
                  <div className="p-2 ml-4">
                    <button className="border border-[#D5E3FF] px-5 py-2">
                      Set to screen
                    </button>
                  </div>
                </div>
                <div className="lg:flex items-center p-2">
                  <label className="text-base font-medium">Duration :</label>
                  <div className=" p-2 ml-4">
                    <div className="border border-[#D5E3FF] px-5 py-2">
                      Start date
                    </div>
                  </div>
                  <label className="text-base font-medium ml-3">To</label>
                  <div className="p-2 ml-4">
                    <div className="border border-[#D5E3FF] px-5 py-2">
                      End date
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-2">
                  <label className="text-base font-medium">
                    Temperature Unit :
                  </label>
                  <div className="flex items-center p-2">
                    <div className="ml-2 flex items-center">
                      <input type="radio" value="C" name="Cel" />
                      <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                        ℃
                      </label>
                    </div>
                    <div className="ml-3 flex items-center">
                      <input type="radio" value="F" name="Cel" />
                      <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                        ℉
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center p-2">
                    <div className="flex">
                      <input type="radio" value="C" name="Cel" />
                      <label className="ml-3 lg:text-base md:text-base sm:text-xs xs:text-xs font-medium">
                        play When temp goes above:
                      </label>
                    </div>

                    <div className="border border-[#D5E3FF] p-2 ml-8">
                      <select>
                        <option>25℃</option>
                        <option>30℃</option>
                        <option>35℃</option>
                        <option>40℃</option>
                        <option>45℃</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center p-2">
                    <div className="flex">
                      <input type="radio" value="C" name="Cel" />
                      <label className="ml-3 lg:text-base md:text-base sm:text-xs xs:text-xs font-medium">
                        play When temp goes Below:
                      </label>
                    </div>
                    <div className="border border-[#D5E3FF] p-2 ml-9">
                      <select>
                        <option>20℉</option>
                        <option>25℉</option>
                        <option>30℉</option>
                        <option>35℉</option>
                        <option>40℉</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg flex items-center">
                <div>
                  <img src="../../../ScreenImg/dragon.svg" className="w-full" />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-9">
              <Link to="/myschedule">
                <button className="border-2 border-primary px-5 py-2 rounded-full">
                  Cancel
                </button>
              </Link>
              <Link to="/myschedule">
                <button className="border-2 border-primary px-5 py-2 rounded-full ml-3">
                  Save
                </button>{" "}
              </Link>
              <button
                className="border-2 border-primary px-5 py-2 rounded-full ml-3"
                onClick={() => setSelectScreenModal(true)}
              >
                Save & Assign screen
              </button>
              {selectScreenModal && (
                <SaveAssignScreenModal
                  setSelectScreenModal={setSelectScreenModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WeatherSchedule;
