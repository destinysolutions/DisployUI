import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsTags } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import {
  MdDateRange,
  MdKeyboardArrowLeft,
  MdOutlinePermMedia,
} from "react-icons/md";
import { VscCompass } from "react-icons/vsc";
import { Link } from "react-router-dom";

const EventEditor = () => {
  return (
    <>
      <div className="pt-6 px-5">
        <div className="flex items-center lg:mb-0 md:mb-0 sm:mb-4">
          <Link to={"/addschedule"}>
            <MdKeyboardArrowLeft className="text-4xl text-primary" />
          </Link>
          <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
            Select Assets and Shedule Time
          </h1>
        </div>
        <div className="grid grid-cols-12 mt-9">
          <div className="lg:col-span-10 md:col-span-8 sm:col-span-12 xs:col-span-12 bg-white shadow-md rounded-lg p-4">
            <div className="mr-5 relative sm:mr-0">
              <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
              <input
                type="text"
                placeholder=" Search by Name"
                className="border border-primary rounded-full px-7 py-2 search-user"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="mt-9 w-full sm:mt-3">
                <thead>
                  <tr className="flex justify-between items-center">
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <MdOutlinePermMedia className="mr-2 text-xl" />
                        Assets
                      </button>
                    </th>
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <MdDateRange className="mr-2 text-xl" />
                        Date Added
                      </button>
                    </th>
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <GrSchedules className="mr-2 text-xl" />
                        Associated Schedule
                      </button>
                    </th>
                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                        <VscCompass className="mr-2 text-xl" />
                        orientation
                      </button>
                    </th>

                    <th className="p-3 font-medium text-[14px]">
                      <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                        <BsTags className="mr-2 text-xl" />
                        Tags
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                    <td className="py-2">Assets Name 1</td>
                    <td className="py-2">25 May 2023</td>
                    <td className="break-words	w-[150px] py-2">
                      Schedule Name Till 28 June 2023
                    </td>
                    <td className="py-2">0</td>

                    <td className="py-2">Tags, Tags</td>
                  </tr>
                  <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                    <td className="py-2">Assets Name 2</td>
                    <td className="py-2">25 May 2023</td>
                    <td className="break-words	w-[150px] py-2">
                      Schedule Name Till 28 June 2023
                    </td>
                    <td className="py-2">90</td>

                    <td className="py-2">Tags, Tags</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" bg-white shadow-md ml-5 rounded-lg lg:col-span-2 md:col-span-4 sm:col-span-12 xs:col-span-12 ">
            <div className="p-3">
              <span className="text-xl">Assets Name</span>
            </div>
            <div className="border-b-2 border-[#D5E3FF]"></div>
            <div className="p-3">
              <div className="mb-2">Schedule Date time</div>
              <div>
                <ul className="border-2 border-[#D5E3FF] rounded">
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>Start Date:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>End Date:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className="border-b-2 border-[#D5E3FF] p-3">
                    <h3>Start Time:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                  <li className=" p-3">
                    <h3>End Time:</h3>
                    <div className="bg-[#E4E6FF] rounded-full px-3 py-2 mt-2">
                      01 / 06 /2023, 05:02 PM
                    </div>
                  </li>
                </ul>
              </div>
              <div className="p-3">
                <div>Repeat Multiple Day</div>

                <div className="flex justify-between">
                  <label>Repeat</label>
                  <input type="checkbox" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventEditor;
