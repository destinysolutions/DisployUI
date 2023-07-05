import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbBoxMultiple } from "react-icons/tb";
import { FiUpload } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdPlaylistAddCircle } from "react-icons/md";
import { RiPlayList2Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import "../../Styles/playlist.css";
import { TfiYoutube } from "react-icons/tfi";
import { TbCoffee } from "react-icons/tb";
import { TiWeatherSunny } from "react-icons/ti";
import { HiOutlineAnnotation } from "react-icons/hi";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdArrowForwardIos } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { SlArrowDown } from "react-icons/sl";
import PropTypes from "prop-types";

const MyPlaylist = ({ sidebarOpen, setSidebarOpen }) => {
  MyPlaylist.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [toggle, setToggle] = useState(1);
  function updatetoggle(toggleTab) {
    setToggle(toggleTab);
  }
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const [playlistDropdown, setplaylistDropdown] = useState(false);
  const [showAppTabContent, setShowAppTabContent] = useState(false);
  const [showYoutubeContent, setShowYoutubeContent] = useState(false);
  const [showTagAdded, setShowTagAdded] = useState(false);

  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              My Playlists
            </h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap">
              <button className="flex align-middle border-primary items-center border-2 rounded-full xs:p-0.5 sm:p-1 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbBoxMultiple />
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full xs:p-0.5 sm:p-1 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <FiUpload />
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full xs:px-1 sm:px-3 md:px-6 md:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Preview
              </button>
              <button className="sm:ml-2 xs:ml-1  flex align-middle border-primary items-center border-2 rounded-full xs:px-1 sm:px-3 md:px-6 md:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Save
              </button>
              <button className="sm:ml-2 xs:ml-1  flex align-middle border-primary items-center border-2 rounded-full xs:p-0.5 sm:p-1 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <RiDeleteBinLine />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-8">
            <div className="lg:col-span-3 flex justify-start md:col-span-6 sm:col-span-12 xs:col-span-12">
              <div className="bg-white shadow-2xl rounded-lg w-full">
                <div className="relative p-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-8 pointer-events-none">
                    <AiOutlineSearch className="w-5 h-5 text-gray " />
                  </span>
                  <input
                    type="text"
                    placeholder=" Search Content "
                    className="border border-primary rounded-full px-7 py-2.5 block w-full p-4 pl-10"
                  />
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
                <div className="p-4">
                  <button className=" border-primary border flex justify-center items-center rounded-full py-2.5 text-base  hover:bg-primary hover:text-white w-full">
                    <MdPlaylistAddCircle className="text-lg mr-1" />
                    Add New Playlist
                  </button>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
                <div className="bg-white flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="bg-primary p-1 rounded-md">
                      <RiPlayList2Line className="text-white text-2xl" />
                    </div>
                    <div className="ml-3 text-[16px]">
                      <div>Playlist Name</div>
                      <div className="flex">
                        Saved <div className="ml-1"> 01:10:00</div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setplaylistDropdown(!playlistDropdown)}
                    >
                      <BsThreeDotsVertical className="text-2xl" />
                    </button>

                    {playlistDropdown && (
                      <div className="playlistdw">
                        <ul>
                          <li className="flex text-sm items-center py-2">
                            <FiUpload className="mr-2 text-lg" />
                            Set to Screen
                          </li>
                          <li className="flex text-sm items-center py-2">
                            <TbBoxMultiple className="mr-2 text-lg" />
                            Duplicate
                          </li>
                          <li className="flex text-sm items-center py-2">
                            <RiDeleteBinLine className="mr-2 text-lg" />
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
                <div className="bg-[#D5E3FF] flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="bg-primary p-1 rounded-md">
                      <RiPlayList2Line className="text-white text-2xl" />
                    </div>
                    <div className="ml-3 text-[16px]">
                      <div>Playlist Name 2</div>
                      <div className="flex">
                        Saved <div className="ml-1"> 01:10:00</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <BsThreeDotsVertical className="text-2xl" />
                  </div>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
              </div>
            </div>
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 flex justify-start xs:col-span-12">
              <div className="bg-white shadow-2xl rounded-lg w-full">
                <div className="md:flex md:justify-between sm:block p-4">
                  <div className="flex items-center">
                    <div className="font-medium text-[#515151] text-base">
                      Total
                    </div>
                    <div className="m-1">
                      <button className="bg-[#E4E6FF] text-SlateBlue py-1 px-2 rounded-full text-sm font-normal">
                        01:10:00
                      </button>
                    </div>
                  </div>
                  <div>
                    <button className=" md:mt-0 sm:mt-4 font-medium border-primary border flex justify-center items-center rounded-full py-2 px-4 text-base  hover:bg-primary hover:text-white w-full">
                      <MdPlaylistAddCircle className="text-3xl mr-1" />
                      Add Content
                    </button>
                  </div>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
                <div className="md:flex items-center md:justify-between px-6 py-5 sm:block">
                  <div className="flex items-center">
                    <div className="bg-primary p-1.5 rounded-full">
                      <BsCameraVideo className="text-white text-2xl" />
                    </div>
                    <div className="ml-2">Media Name1</div>
                  </div>
                  <div className="text-SlateBlue sm:mt-3 md:mt-0">01:10:00</div>
                  <div className="text-SlateBlue sm:mt-3 md:mt-0">App</div>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
              </div>
            </div>
            <div className="lg:col-span-3 flex justify-start md:col-span-12 sm:col-span-12 xs:col-span-12">
              <div className="bg-white shadow-2xl rounded-lg w-full">
                <ul className="flex">
                  <li className="text-lg  min-w-[50%]">
                    <button
                      className={
                        toggle === 1
                          ? "bg-primary text-white rounded-tl-lg py-2 w-full border border-primary"
                          : "py-2 w-full border border-primary rounded-tl-lg text-primary"
                      }
                      onClick={() => updatetoggle(1)}
                    >
                      Content
                    </button>
                  </li>
                  <li className="text-lg  min-w-[50%]">
                    <button
                      className={
                        toggle === 2
                          ? "bg-primary text-white  rounded-tr-lg py-2 w-full border border-primary"
                          : "py-2 w-full border border-primary rounded-tr-lg text-primary"
                      }
                      onClick={() => updatetoggle(2)}
                    >
                      Setting
                    </button>
                  </li>
                </ul>

                {toggle == 1 && (
                  <>
                    <div className="mt-5">
                      <div className="flex items-center justify-between rounded-full px-2">
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer rounded-tl-full rounded-bl-full font-light text-sm ${
                            activeTab === 1
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          } `}
                          onClick={() => handleTabClick(1)}
                        >
                          All
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${
                            activeTab === 2
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => handleTabClick(2)}
                        >
                          Assets
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${
                            activeTab === 3
                              ? "bg-SlateBlue text-white "
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => handleTabClick(3)}
                        >
                          Studio
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${
                            activeTab === 4
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => {
                            handleTabClick(4);
                            setShowAppTabContent(true);
                          }}
                        >
                          Apps
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm rounded-tr-full rounded-br-full ${
                            activeTab === 5
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => handleTabClick(5)}
                        >
                          Links
                        </div>
                      </div>
                    </div>
                    {activeTab == 1 && (
                      <>
                        <div className="relative mt-5 px-2">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                            <AiOutlineSearch className="w-5 h-5 text-gray " />
                          </span>
                          <input
                            type="text"
                            placeholder=" Search Content "
                            className="border border-primary rounded-full px-7 py-2 block w-full p-4 pl-10"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center p-3">
                            <div className="bg-primary p-1.5 rounded-full">
                              <BsCameraVideo className="text-white text-2xl" />
                            </div>
                            <div className="ml-3">
                              <div>Media Name1</div>
                              <div>Video</div>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF]"></div>
                          <div className="flex items-center p-3">
                            <div className="bg-primary p-1.5 rounded-full">
                              <IoImageOutline className="text-white text-2xl" />
                            </div>
                            <div className="ml-3">
                              <div>Media Name2</div>
                              <div>Image</div>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF]"></div>
                          <div className="flex items-center p-3">
                            <div className="bg-primary p-1.5 rounded-full">
                              <BsCameraVideo className="text-white text-2xl" />
                            </div>
                            <div className="ml-3">
                              <div>Media Name3</div>
                              <div>Video</div>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF]"></div>
                          <div className="flex items-center p-3">
                            <div className="bg-primary p-1.5 rounded-full">
                              <IoImageOutline className="text-white text-2xl" />
                            </div>
                            <div className="ml-3">
                              <div>Media Name4</div>
                              <div>Image</div>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        </div>
                      </>
                    )}
                    {activeTab == 4 && showAppTabContent && (
                      <>
                        <div className="relative mt-5 px-2">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                            <AiOutlineSearch className="w-5 h-5 text-gray " />
                          </span>
                          <input
                            type="text"
                            placeholder=" Search Content "
                            className="border border-primary rounded-full px-7 py-2 block w-full p-4 pl-10"
                          />
                        </div>
                        <div className="p-4">
                          <h2 className="font-semibold text-base">My Apps</h2>
                          <div className="flex justify-between mt-3">
                            <div
                              className="flex items-center"
                              onClick={() => {
                                setShowYoutubeContent(true);
                                setShowAppTabContent(false);
                              }}
                            >
                              <div className="bg-primary p-1.5 rounded-full">
                                <TfiYoutube className="text-white text-2xl" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">
                                  YouTube
                                </div>
                                <div className="font-normal text-xs">
                                  Internal Communications
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-[#73C36C] text-white px-2 py-0.5 rounded-full font-normal text-xs">
                                Added
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center">
                              <div className="bg-primary p-1.5 rounded-full">
                                <TiWeatherSunny className="text-white text-2xl" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">
                                  Weather
                                </div>
                                <div className="font-normal text-xs">
                                  Internal Communications
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-[#73C36C] text-white px-2 py-0.5 rounded-full font-normal text-xs">
                                Added
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center">
                              <div className="bg-primary p-1.5 rounded-full">
                                <TbCoffee className="text-white text-2xl" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">
                                  Coffee Tea
                                </div>
                                <div className="font-normal text-xs">
                                  Internal Communications
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-[#73C36C] text-white px-2 py-0.5 rounded-full font-normal text-xs">
                                Added
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                        </div>
                        <div className="px-4">
                          <h2 className="font-semibold text-base">
                            Other Apps
                          </h2>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center">
                              <div className="bg-primary p-1.5 rounded-full">
                                <IoFastFoodOutline className="text-white text-2xl" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">Foods</div>
                                <div className="font-normal text-xs">
                                  Internal Communications
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-primary text-white px-4 py-0.5 rounded-full font-normal text-xs">
                                Get
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center">
                              <div className="bg-primary p-1.5 rounded-full">
                                <HiOutlineAnnotation className="text-white text-2xl rotate-180" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">
                                  Noticeboard
                                </div>
                                <div className="font-normal text-xs">
                                  Internal Communications
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-primary text-white px-4 py-0.5 rounded-full font-normal text-xs">
                                Get
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                          <div className="p-2"></div>
                        </div>
                      </>
                    )}
                    {showYoutubeContent && (
                      <>
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div className="font-semibold text-base flex items-center">
                              App <MdArrowForwardIos /> YouTube
                            </div>
                            <div className="bg-[#E4E6FF] p-1.5 rounded">
                              <AiOutlinePlus />
                            </div>
                          </div>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center">
                              <div className="bg-primary p-1.5 rounded-full">
                                <BsCameraVideo className="text-white text-2xl" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">
                                  Media Name1
                                </div>
                                <div className="font-normal text-xs">
                                  App / YouTube
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-[#73C36C] text-white px-2 py-0.5 rounded-full font-normal text-xs">
                                Added
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center">
                              <div className="bg-primary p-1.5 rounded-full">
                                <BsCameraVideo className="text-white text-2xl" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">
                                  Media Name2
                                </div>
                                <div className="font-normal text-xs">
                                  App / YouTube
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-[#73C36C] text-white px-2 py-0.5 rounded-full font-normal text-xs">
                                Added
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                          <div className="flex justify-between mt-3">
                            <div className="flex items-center">
                              <div className="bg-primary p-1.5 rounded-full">
                                <BsCameraVideo className="text-white text-2xl" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-sm">
                                  Media Name3
                                </div>
                                <div className="font-normal text-xs">
                                  App / YouTube
                                </div>
                              </div>
                            </div>
                            <div>
                              <button className="bg-[#73C36C] text-white px-2 py-0.5 rounded-full font-normal text-xs">
                                Added
                              </button>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF] mt-2"></div>
                        </div>
                      </>
                    )}
                  </>
                )}
                {toggle == 2 && (
                  <>
                    <div className="mt-5 px-3">
                      <button className="w-full border border-[#D5E3FF] rounded-full py-1.5 text-start flex pl-4">
                        <div className="bg-[#CA0712] rounded-full w-6 h-6 mr-3"></div>
                        Change Color
                      </button>
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center justify-between rounded-full px-2">
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer rounded-tl-full rounded-bl-full font-light text-sm ${
                            activeTab === 1
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          } `}
                          onClick={() => handleTabClick(1)}
                        >
                          All
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${
                            activeTab === 2
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => handleTabClick(2)}
                        >
                          Assets
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${
                            activeTab === 3
                              ? "bg-SlateBlue text-white "
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => handleTabClick(3)}
                        >
                          Studio
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${
                            activeTab === 4
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => {
                            handleTabClick(4);
                            setShowAppTabContent(true);
                          }}
                        >
                          Apps
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm rounded-tr-full rounded-br-full ${
                            activeTab === 5
                              ? "bg-SlateBlue text-white"
                              : "border border-[#D5E3FF]"
                          }`}
                          onClick={() => handleTabClick(5)}
                        >
                          Links
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 px-3">
                      <h3>Tags</h3>
                      <div className="relative">
                        <button
                          className="w-full border border-[#D5E3FF] rounded-full py-1.5 justify-between items-center flex pl-4 mt-2"
                          onClick={() => setShowTagAdded(!showTagAdded)}
                        >
                          No tags added yet
                          <SlArrowDown className="mr-4" />
                        </button>
                        {showTagAdded && (
                          <div className="tagAdded">
                            <div className="lg:flex md:flex sm:block">
                              <div className="p-2">
                                <h6 className="text-center text-sm mb-1">
                                  Give a Tag Name Such
                                </h6>
                                <div className="flex flex-wrap">
                                  <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                    Corporate
                                  </div>
                                  <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm  font-light">
                                    DMB
                                  </div>
                                  <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                    Marketing
                                  </div>
                                  <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                    Lobby
                                  </div>
                                  <div className="p-1 rounded bg-[#EFF5FF] m-1 text-sm font-light">
                                    Conference Room
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-5 px-3">
                      <h3>Default Duration</h3>
                      <div className="border border-[#D5E3FF] p-3 m-2">
                        <div className="flex justify-between items-center mb-2">
                          <div>Images</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center my-2">
                          <div>Apps</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center my-2">
                          <div>Links</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center my-2">
                          <div>Dashboards</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center mt-2">
                          <div>Documents</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPlaylist;
