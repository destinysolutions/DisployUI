import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { Radio } from "@material-tailwind/react";

const NewScreenDetail = ({ sidebarOpen, setSidebarOpen }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [showTagBox, setShowTagBox] = useState(false);

  const handleTagBoxClick = (e) => {
    e.stopPropagation();
    setShowTagBox(!showProfileBox);
  };
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              New Screens Details
            </h1>
            <div className="lg:flex md:flex sm:block">
              <button className="flex align-middle border-primary items-center border rounded-full lg:px-9 sm:px-7 sm-mt-2 py-2 sm:mt-2  text-base mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Edit
              </button>
            </div>
          </div>
          <div className="shadow-md p-5 rounded-md bg-white flex items-center justify-between mt-7">
            <form className="w-full">
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-full">
                  <label className="text-[#001737] font-medium text-lg mb-1 md:mb-0">
                    Screen Name:
                  </label>
                </div>
                <div className="md:w-full">
                  <input
                    className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Screen Name"
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-full">
                  <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
                    Google Location:
                  </label>
                </div>
                <div className="md:w-full">
                  <input
                    className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="132, My Street, Kingston, New York 12401."
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-full">
                  <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
                    Time Zone:
                  </label>
                </div>
                <div className="md:w-full">
                  <select className=" px-4 py-2 border-[1px] border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="-12:00">
                      (GMT -12:00) Eniwetok, Kwajalein
                    </option>
                    <option value="-11:00">
                      (GMT -11:00) Midway Island, Samoa
                    </option>
                    <option value="-10:00">(GMT -10:00) Hawaii</option>
                    <option value="-09:50">(GMT -9:30) Taiohae</option>
                    <option value="-09:00">(GMT -9:00) Alaska</option>
                  </select>
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-full">
                  <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
                    Screen Orientation:
                  </label>
                </div>
                <div className="md:w-full">
                  <div className="border-[1px] border-[#D5E3FF] rounded w-full px-4 py-2 ">
                    <input
                      type="radio"
                      value="0"
                      checked={selectedValue === "0"}
                      onChange={handleRadioChange}
                      className="ml-4"
                    />
                    <label className="ml-2">0</label>

                    <input
                      type="radio"
                      value="90"
                      checked={selectedValue === "90"}
                      onChange={handleRadioChange}
                      className="ml-4"
                    />
                    <label className="ml-2">90</label>

                    <input
                      type="radio"
                      value="180"
                      checked={selectedValue === "180"}
                      onChange={handleRadioChange}
                      className="ml-4"
                    />
                    <label className="ml-2">180</label>

                    <input
                      type="radio"
                      value="270"
                      checked={selectedValue === "270"}
                      onChange={handleRadioChange}
                      className="ml-4"
                    />
                    <label className="ml-2">270</label>
                  </div>
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-full">
                  <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
                    Screen Resolution:
                  </label>
                </div>
                <div className="md:w-full">
                  <div className="border-[1px] border-[#D5E3FF] rounded w-full px-4 py-2 ">
                    <input
                      type="radio"
                      value="Fit to Screen"
                      checked={selectedValue === "Fit to Screen"}
                      onChange={handleRadioChange}
                      className="ml-4"
                    />
                    <label className="ml-2">Fit to Screen</label>

                    <input
                      type="radio"
                      value="Actual Size"
                      checked={selectedValue === "Actual Size"}
                      onChange={handleRadioChange}
                      className="ml-4"
                    />
                    <label className="ml-2">Actual Size</label>

                    <input
                      type="radio"
                      value="Zoom Screen"
                      checked={selectedValue === "Zoom Screen"}
                      onChange={handleRadioChange}
                      className="ml-4"
                    />
                    <label className="ml-2">Zoom Screen</label>
                  </div>
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-full">
                  <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
                    Type:
                  </label>
                </div>
                <div className="md:w-full">
                  <select className=" px-4 py-2 border-[1px] border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Assets</option>
                    <option>Playlist</option>
                    <option>Schedule</option>
                  </select>
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-full">
                  <label className=" text-[#001737] font-medium text-lg  mb-1 md:mb-0">
                    Tags:
                  </label>
                </div>
                <div className="md:w-full">
                  {/* <input
                    className="bg-gray-200 appearance-none border-[1px] border-[#D5E3FF] rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                  /> */}
                  <div className="border-[1px] border-[#D5E3FF] rounded w-full px-4 py-2 relative flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTagBox(true)}
                      // className="inline-flex items-center justify-center h-full px-2 text-gray-600 border-l border-gray-100 hover:text-gray-700 rounded-r-md hover:bg-gray-50"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315ZM10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0ZM11 11C11 10.4477 10.5523 10 10 10C9.44771 10 9 10.4477 9 11V14C9 14.5523 9.44771 15 10 15C10.5523 15 11 14.5523 11 14V11ZM9.94922 4.75C9.25886 4.75 8.69922 5.30964 8.69922 6C8.69922 6.69036 9.25886 7.25 9.94922 7.25H10.0492C10.7396 7.25 11.2992 6.69036 11.2992 6C11.2992 5.30964 10.7396 4.75 10.0492 4.75H9.94922Z"
                          fill="#515151"
                        />
                      </svg>
                    </button>
                    {showTagBox && (
                      <>
                       <div className="absolute top-[47px] right-[65px]  text-[35px]  z-20">
            <img
              src="/DisployImg/Polygon.svg"
              alt="notification"
              className="cursor-pointer tagPopup"
            />
          </div>
                        <div className="absolute top-[42px] right-0 bg-white rounded-lg border border-[#635b5b] shadow-lg z-10">
                          <div className="lg:flex md:flex sm:block">
                         
                            <div className="p-3">
                                <h6 className="flex justify-center">Give a Tag Name Such</h6>
                               <div className="flex">
                               <div className="p-2 rounded bg-[#EFF5FF] m-2">Corporate</div>
                                <div className="p-2 rounded bg-[#EFF5FF] m-2">DMB</div>
                                <div className="p-2 rounded bg-[#EFF5FF] m-2">Marketing</div>
                                <div className="p-2 rounded bg-[#EFF5FF] m-2">Lobby</div>
                                <div className="p-2 rounded bg-[#EFF5FF] m-2">Conference Room</div>
                               </div>
                            </div>
                          </div>
                          
                        </div>
                      </>
                    )}
                    {/* <div className="absolute right-0 z-10 w-56 mt-9 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg">
                      <div className="p-2">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                        >
                          ReactJS Dropdown 1
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                        >
                          ReactJS Dropdown 2
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
                        >
                          ReactJS Dropdown 3
                        </a>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="md:flex md:items-center">
                <div className="md:w-full"></div>
                <div className="md:w-full">
                  <button
                    className="shadow bg-primary focus:shadow-outline focus:outline-none text-white font-medium py-2 px-9 rounded-full"
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewScreenDetail;
