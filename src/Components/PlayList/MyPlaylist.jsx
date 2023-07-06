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
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { BiAnchor } from "react-icons/bi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { Link } from "react-router-dom";

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
  const [popupActiveTab, setPopupActiveTab] = useState(2);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
    setPopupActiveTab(tabNumber);
  };

  const [playlistDropdown, setplaylistDropdown] = useState(false);
  const [showAppTabContent, setShowAppTabContent] = useState(false);
  const [showYoutubeContent, setShowYoutubeContent] = useState(false);
  const [showTagAdded, setShowTagAdded] = useState(false);

  const [playlists, setPlaylists] = useState([]);

  const addNewPlaylist = () => {
    // Create a new playlist object here
    const newPlaylist = {
      name: `Playlist Name ${playlists.length + 3}`,
      savedTime: "01:10:00",
    };

    // Update the playlists state with the new playlist
    setPlaylists([...playlists, newPlaylist]);
  };

  const [playlistChange, setplaylistChange] = useState(1);

  const handlePlaylistChange = (playlistNO) => {
    setplaylistChange(playlistNO);
  };

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              My Playlists
            </h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
              <button className=" flex align-middle border-primary items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Preview
              </button>
              <button className="sm:ml-2 xs:ml-1  flex align-middle border-primary items-center border-2 rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Save
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbBoxMultiple />
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <FiUpload />
              </button>
              <button className="sm:ml-2 xs:ml-1  flex align-middle border-primary items-center border-2 rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
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
                    placeholder="Search Content "
                    className="border border-primary rounded-full px-7 py-2.5 block w-full p-4 pl-10"
                  />
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
                <div className="p-4">
                  <button
                    onClick={addNewPlaylist}
                    className=" border-primary border flex justify-center items-center rounded-full py-2.5 text-base  hover:bg-primary hover:text-white w-full newplaylistbtn"
                  >
                    <MdPlaylistAddCircle className="text-lg mr-1" />
                    Add New Playlist
                  </button>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
                <div
                  className={`flex items-center justify-between p-4 ${playlistChange == 1 ? "bg-[#D5E3FF]" : "bg-white"
                    }`}
                  onClick={() => handlePlaylistChange(1)}
                >
                  <div className="flex items-center">
                    <div className="bg-primary p-1 rounded-md">
                      <RiPlayList2Line className="text-white text-2xl" />
                    </div>
                    <div className="ml-3 text-[16px]">
                      <h4 className="text-[#8E94A9] text-base">Playlist Name 1</h4>
                      <p className="text-sm">Saved <span className="bg-[#E4E6FF] rounded-md text-sm p-1">01:10:00</span></p>

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
                <div
                  className={`flex items-center justify-between p-4 ${playlistChange == 2 ? "bg-[#D5E3FF]" : "bg-white"
                    }`}
                  onClick={() => handlePlaylistChange(2)}
                >
                  <div className="flex items-center">
                    <div className="bg-primary p-1 rounded-md">
                      <RiPlayList2Line className="text-white text-2xl" />
                    </div>
                    <div className="ml-3 text-[16px]">
                      <h4 className="text-[#8E94A9] text-base">Playlist Name2</h4>
                      <p className="text-sm">Saved <span className="bg-[#E4E6FF] rounded-md text-sm p-1">01:10:00</span></p>
                    </div>
                  </div>
                  <div>
                    <BsThreeDotsVertical className="text-2xl" />
                  </div>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
                {playlists.map((playlist, index) => (
                  <>
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 ${playlistChange == index + 3
                        ? "bg-[#D5E3FF]"
                        : "bg-white"
                        }`}
                      onClick={() => handlePlaylistChange(index + 3)}
                    >
                      <div className="flex items-center">
                        <div className="bg-primary p-1 rounded-md">
                          <RiPlayList2Line className="text-white text-2xl" />
                        </div>
                        <div className="ml-3 text-[16px]">
                          <div className="text-[#8E94A9] text-base">{playlist.name}</div>
                          <div className="flex">
                            <p className="text-sm">Saved</p>
                            <div className="ml-1 bg-[#E4E6FF] rounded-md text-sm p-1">{playlist.savedTime}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <BsThreeDotsVertical className="text-2xl" />
                      </div>
                    </div>
                    <div className="border-b-[1px] border-[#D5E3FF]"></div>
                  </>
                ))}
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
                    <button
                      onClick={() => setShowPlaylistModal(true)}
                      className=" md:mt-0 sm:mt-4 font-medium border-primary border flex justify-center items-center rounded-full py-2 px-4 text-base  newplaylistbtn  hover:bg-primary hover:text-white w-full"
                    >
                      <MdPlaylistAddCircle className="lg:text-3xl md:text-2xl   mr-1" />
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
                    <div className="ml-2">
                      {playlistChange == 1 ? "Media Name1" : "Media Name2"}
                    </div>
                  </div>
                  <div className="text-SlateBlue sm:mt-3 md:mt-0">01:10:00</div>
                  <div className="text-SlateBlue sm:mt-3 md:mt-0">App</div>
                </div>
                <div className="border-b-[1px] border-[#D5E3FF]"></div>
              </div>
            </div>
            {showPlaylistModal ? (
              <>
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none  addmediapopup">
                      <div className="flex items-start justify-between p-5 border-b border-[#A7AFB7] border-slate-200 rounded-t">
                        <h3 className="text-xl font-medium">
                          Set Content to Add Media
                        </h3>
                        <button
                          className="p-1 text-xl"
                          onClick={() => setShowPlaylistModal(false)}
                        >
                          <AiOutlineCloseCircle />
                        </button>
                      </div>

                      <div className="relative p-6 flex-auto">
                        <div className="bg-white rounded-[30px]">
                          <div className="container mx-auto">
                            <div className="lg:flex lg:flex-wrap lg:items-center md:flex md:flex-wrap md:items-center sm:block xs:block">
                              <div>
                                <nav
                                  className="flex flex-col space-y-2 "
                                  aria-label="Tabs"
                                  role="tablist"
                                  data-hs-tabs-vertical="true"
                                >
                                  <button
                                    type="button"
                                    className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${popupActiveTab === 1 ? "active" : ""
                                      }`}
                                  // onClick={() => handleTabClick(1)}
                                  >
                                    <span
                                      className={`p-1 rounded ${popupActiveTab === 1
                                        ? "bg-primary text-white"
                                        : "bg-[#D5E3FF]"
                                        } `}
                                    >
                                      <IoBarChartSharp size={15} />
                                    </span>
                                    Assets
                                  </button>
                                  <button
                                    type="button"
                                    className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${popupActiveTab === 2 ? "active" : ""
                                      }`}
                                    //onClick={() => handleTabClick(2)}
                                  >
                                    <span
                                      className={`p-1 rounded ${popupActiveTab === 2
                                        ? "bg-primary text-white"
                                        : "bg-[#D5E3FF]"
                                        } `}
                                    >
                                      <RiPlayListFill size={15} />
                                    </span>
                                    Playlist
                                  </button>
                                  <button
                                    type="button"
                                    className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${popupActiveTab === 3 ? "active" : ""
                                      }`}
                                  // onClick={() => handleTabClick(3)}
                                  >
                                    <span
                                      className={`p-1 rounded ${popupActiveTab === 3
                                        ? "bg-primary text-white"
                                        : "bg-[#D5E3FF]"
                                        } `}
                                    >
                                      <BiAnchor size={15} />
                                    </span>
                                    Disploy Studio
                                  </button>
                                  <button
                                    type="button"
                                    className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${popupActiveTab === 4 ? "active" : ""
                                      }`}
                                  // onClick={() => handleTabClick(4)}
                                  >
                                    <span
                                      className={`p-1 rounded ${popupActiveTab === 4
                                        ? "bg-primary text-white"
                                        : "bg-[#D5E3FF]"
                                        } `}
                                    >
                                      <AiOutlineAppstoreAdd size={15} />
                                    </span>
                                    Apps
                                  </button>
                                </nav>
                              </div>

                              <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                                <div
                                  className={popupActiveTab === 2 ? "" : "hidden"}
                                >
                                  <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                                    <div className="text-right mb-5 mr-5 flex items-end justify-end relative sm:mr-0">
                                      <AiOutlineSearch className="absolute top-[14px] right-[230px] z-10 text-gray searchicon" />
                                      <input
                                        type="text"
                                        placeholder=" Search Playlists... "
                                        className="border border-primary rounded-full px-7 py-2 search-user"
                                      />
                                    </div>
                                    <Link to="/fileupload">
                                      <button className="flex align-middle border-primary items-center border rounded-full px-8 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                        Upload
                                      </button>
                                    </Link>
                                  </div>
                                  <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto">
                                    <table
                                      style={{
                                        borderCollapse: "separate",
                                        borderSpacing: " 0 10px",
                                      }}
                                    >
                                      <thead>
                                        <tr className="bg-[#E4E6FF]">
                                          <th className="p-3 w-80 text-left">
                                            Playlist Name
                                          </th>
                                          <th className="p-3  w-60 text-left">
                                            Date & Time Added
                                          </th>
                                          <th className="p-3">Duration</th>
                                          <th className="p-3">Media</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        <tr className="bg-[#F8F8F8]">
                                          <td className="p-3">Name</td>
                                          <td className="p-3">
                                            25 May 2023, 10:30PM
                                          </td>
                                          <td className="p-3">00:10:00</td>
                                          <td className="p-3">
                                            <svg
                                              width="52"
                                              height="25"
                                              viewBox="0 0 52 25"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="12.5"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#6C3E1E"
                                              />
                                              <circle
                                                cx="19.6426"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#0082FF"
                                              />
                                              <circle
                                                cx="26.7852"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#001737"
                                              />
                                              <path
                                                d="M22.5241 18.1392C21.8414 18.1392 21.2315 18.0215 20.6946 17.7862C20.161 17.5509 19.7384 17.2244 19.4268 16.8068C19.1186 16.3859 18.9529 15.8987 18.9297 15.3452H20.4908C20.5107 15.6468 20.6117 15.9086 20.794 16.1307C20.9796 16.3494 21.2216 16.5185 21.5199 16.6378C21.8182 16.7571 22.1496 16.8168 22.5142 16.8168C22.9152 16.8168 23.2699 16.7472 23.5781 16.608C23.8897 16.4687 24.1333 16.2749 24.3089 16.0263C24.4846 15.7744 24.5724 15.4844 24.5724 15.1562C24.5724 14.8149 24.4846 14.5149 24.3089 14.2564C24.1366 13.9946 23.883 13.7891 23.5483 13.6399C23.2169 13.4908 22.8158 13.4162 22.3452 13.4162H21.4851V12.1634H22.3452C22.723 12.1634 23.0545 12.0954 23.3395 11.9595C23.6278 11.8236 23.8532 11.6347 24.0156 11.3928C24.178 11.1475 24.2592 10.8608 24.2592 10.5327C24.2592 10.2178 24.188 9.94437 24.0455 9.71236C23.9063 9.47704 23.7074 9.29309 23.4489 9.16051C23.1937 9.02794 22.892 8.96165 22.544 8.96165C22.2126 8.96165 21.9027 9.02296 21.6143 9.1456C21.3293 9.26491 21.0973 9.43726 20.9183 9.66264C20.7393 9.88471 20.6432 10.1515 20.63 10.4631H19.1435C19.16 9.91288 19.3224 9.42898 19.6307 9.01136C19.9422 8.59375 20.3532 8.26728 20.8636 8.03196C21.3741 7.79664 21.9408 7.67898 22.5639 7.67898C23.2169 7.67898 23.7803 7.80658 24.2543 8.06179C24.7315 8.31368 25.0994 8.65009 25.358 9.07102C25.6198 9.49195 25.7491 9.95265 25.7457 10.4531C25.7491 11.0232 25.59 11.5071 25.2685 11.9048C24.9503 12.3026 24.526 12.5694 23.9957 12.7053V12.7848C24.6719 12.8875 25.1955 13.156 25.5668 13.5902C25.9413 14.0244 26.1269 14.563 26.1236 15.206C26.1269 15.7661 25.9711 16.2682 25.6562 16.7124C25.3447 17.1565 24.9188 17.5062 24.3786 17.7614C23.8383 18.0133 23.2202 18.1392 22.5241 18.1392ZM31.0156 16.2898V9.56818H32.353V16.2898H31.0156ZM28.326 13.5952V12.2628H35.0476V13.5952H28.326Z"
                                                fill="white"
                                              />
                                              <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M44 23.5C44 24.3284 43.3284 25 42.5 25C41.6716 25 41 24.3284 41 23.5C41 22.6716 41.6716 22 42.5 22C43.3284 22 44 22.6716 44 23.5ZM48 23.5C48 24.3284 47.3284 25 46.5 25C45.6716 25 45 24.3284 45 23.5C45 22.6716 45.6716 22 46.5 22C47.3284 22 48 22.6716 48 23.5ZM50.5 25C51.3284 25 52 24.3284 52 23.5C52 22.6716 51.3284 22 50.5 22C49.6716 22 49 22.6716 49 23.5C49 24.3284 49.6716 25 50.5 25Z"
                                                fill="#515151"
                                              />
                                            </svg>
                                          </td>
                                        </tr>
                                        <tr className="bg-[#F8F8F8]">
                                          <td className="p-3">Name</td>
                                          <td className="p-3">
                                            25 May 2023, 10:30PM
                                          </td>
                                          <td className="p-3">00:10:00</td>
                                          <td className="p-3">
                                            <svg
                                              width="52"
                                              height="25"
                                              viewBox="0 0 52 25"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="12.5"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#6C3E1E"
                                              />
                                              <circle
                                                cx="19.6426"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#0082FF"
                                              />
                                              <circle
                                                cx="26.7852"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#001737"
                                              />
                                              <path
                                                d="M22.5241 18.1392C21.8414 18.1392 21.2315 18.0215 20.6946 17.7862C20.161 17.5509 19.7384 17.2244 19.4268 16.8068C19.1186 16.3859 18.9529 15.8987 18.9297 15.3452H20.4908C20.5107 15.6468 20.6117 15.9086 20.794 16.1307C20.9796 16.3494 21.2216 16.5185 21.5199 16.6378C21.8182 16.7571 22.1496 16.8168 22.5142 16.8168C22.9152 16.8168 23.2699 16.7472 23.5781 16.608C23.8897 16.4687 24.1333 16.2749 24.3089 16.0263C24.4846 15.7744 24.5724 15.4844 24.5724 15.1562C24.5724 14.8149 24.4846 14.5149 24.3089 14.2564C24.1366 13.9946 23.883 13.7891 23.5483 13.6399C23.2169 13.4908 22.8158 13.4162 22.3452 13.4162H21.4851V12.1634H22.3452C22.723 12.1634 23.0545 12.0954 23.3395 11.9595C23.6278 11.8236 23.8532 11.6347 24.0156 11.3928C24.178 11.1475 24.2592 10.8608 24.2592 10.5327C24.2592 10.2178 24.188 9.94437 24.0455 9.71236C23.9063 9.47704 23.7074 9.29309 23.4489 9.16051C23.1937 9.02794 22.892 8.96165 22.544 8.96165C22.2126 8.96165 21.9027 9.02296 21.6143 9.1456C21.3293 9.26491 21.0973 9.43726 20.9183 9.66264C20.7393 9.88471 20.6432 10.1515 20.63 10.4631H19.1435C19.16 9.91288 19.3224 9.42898 19.6307 9.01136C19.9422 8.59375 20.3532 8.26728 20.8636 8.03196C21.3741 7.79664 21.9408 7.67898 22.5639 7.67898C23.2169 7.67898 23.7803 7.80658 24.2543 8.06179C24.7315 8.31368 25.0994 8.65009 25.358 9.07102C25.6198 9.49195 25.7491 9.95265 25.7457 10.4531C25.7491 11.0232 25.59 11.5071 25.2685 11.9048C24.9503 12.3026 24.526 12.5694 23.9957 12.7053V12.7848C24.6719 12.8875 25.1955 13.156 25.5668 13.5902C25.9413 14.0244 26.1269 14.563 26.1236 15.206C26.1269 15.7661 25.9711 16.2682 25.6562 16.7124C25.3447 17.1565 24.9188 17.5062 24.3786 17.7614C23.8383 18.0133 23.2202 18.1392 22.5241 18.1392ZM31.0156 16.2898V9.56818H32.353V16.2898H31.0156ZM28.326 13.5952V12.2628H35.0476V13.5952H28.326Z"
                                                fill="white"
                                              />
                                              <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M44 23.5C44 24.3284 43.3284 25 42.5 25C41.6716 25 41 24.3284 41 23.5C41 22.6716 41.6716 22 42.5 22C43.3284 22 44 22.6716 44 23.5ZM48 23.5C48 24.3284 47.3284 25 46.5 25C45.6716 25 45 24.3284 45 23.5C45 22.6716 45.6716 22 46.5 22C47.3284 22 48 22.6716 48 23.5ZM50.5 25C51.3284 25 52 24.3284 52 23.5C52 22.6716 51.3284 22 50.5 22C49.6716 22 49 22.6716 49 23.5C49 24.3284 49.6716 25 50.5 25Z"
                                                fill="#515151"
                                              />
                                            </svg>
                                          </td>
                                        </tr>
                                        <tr className="bg-[#F8F8F8]">
                                          <td className="p-3">Name</td>
                                          <td className="p-3">
                                            25 May 2023, 10:30PM
                                          </td>
                                          <td className="p-3">00:10:00</td>
                                          <td className="p-3">
                                            <svg
                                              width="52"
                                              height="25"
                                              viewBox="0 0 52 25"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="12.5"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#6C3E1E"
                                              />
                                              <circle
                                                cx="19.6426"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#0082FF"
                                              />
                                              <circle
                                                cx="26.7852"
                                                cy="12.5"
                                                r="12.5"
                                                fill="#001737"
                                              />
                                              <path
                                                d="M22.5241 18.1392C21.8414 18.1392 21.2315 18.0215 20.6946 17.7862C20.161 17.5509 19.7384 17.2244 19.4268 16.8068C19.1186 16.3859 18.9529 15.8987 18.9297 15.3452H20.4908C20.5107 15.6468 20.6117 15.9086 20.794 16.1307C20.9796 16.3494 21.2216 16.5185 21.5199 16.6378C21.8182 16.7571 22.1496 16.8168 22.5142 16.8168C22.9152 16.8168 23.2699 16.7472 23.5781 16.608C23.8897 16.4687 24.1333 16.2749 24.3089 16.0263C24.4846 15.7744 24.5724 15.4844 24.5724 15.1562C24.5724 14.8149 24.4846 14.5149 24.3089 14.2564C24.1366 13.9946 23.883 13.7891 23.5483 13.6399C23.2169 13.4908 22.8158 13.4162 22.3452 13.4162H21.4851V12.1634H22.3452C22.723 12.1634 23.0545 12.0954 23.3395 11.9595C23.6278 11.8236 23.8532 11.6347 24.0156 11.3928C24.178 11.1475 24.2592 10.8608 24.2592 10.5327C24.2592 10.2178 24.188 9.94437 24.0455 9.71236C23.9063 9.47704 23.7074 9.29309 23.4489 9.16051C23.1937 9.02794 22.892 8.96165 22.544 8.96165C22.2126 8.96165 21.9027 9.02296 21.6143 9.1456C21.3293 9.26491 21.0973 9.43726 20.9183 9.66264C20.7393 9.88471 20.6432 10.1515 20.63 10.4631H19.1435C19.16 9.91288 19.3224 9.42898 19.6307 9.01136C19.9422 8.59375 20.3532 8.26728 20.8636 8.03196C21.3741 7.79664 21.9408 7.67898 22.5639 7.67898C23.2169 7.67898 23.7803 7.80658 24.2543 8.06179C24.7315 8.31368 25.0994 8.65009 25.358 9.07102C25.6198 9.49195 25.7491 9.95265 25.7457 10.4531C25.7491 11.0232 25.59 11.5071 25.2685 11.9048C24.9503 12.3026 24.526 12.5694 23.9957 12.7053V12.7848C24.6719 12.8875 25.1955 13.156 25.5668 13.5902C25.9413 14.0244 26.1269 14.563 26.1236 15.206C26.1269 15.7661 25.9711 16.2682 25.6562 16.7124C25.3447 17.1565 24.9188 17.5062 24.3786 17.7614C23.8383 18.0133 23.2202 18.1392 22.5241 18.1392ZM31.0156 16.2898V9.56818H32.353V16.2898H31.0156ZM28.326 13.5952V12.2628H35.0476V13.5952H28.326Z"
                                                fill="white"
                                              />
                                              <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M44 23.5C44 24.3284 43.3284 25 42.5 25C41.6716 25 41 24.3284 41 23.5C41 22.6716 41.6716 22 42.5 22C43.3284 22 44 22.6716 44 23.5ZM48 23.5C48 24.3284 47.3284 25 46.5 25C45.6716 25 45 24.3284 45 23.5C45 22.6716 45.6716 22 46.5 22C47.3284 22 48 22.6716 48 23.5ZM50.5 25C51.3284 25 52 24.3284 52 23.5C52 22.6716 51.3284 22 50.5 22C49.6716 22 49 22.6716 49 23.5C49 24.3284 49.6716 25 50.5 25Z"
                                                fill="#515151"
                                              />
                                            </svg>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div
                                  className={popupActiveTab === 3 ? "" : "hidden"}
                                >
                                  <p className="text-gray-500 dark:text-gray-400">
                                    This is the
                                    <em className="font-semibold text-gray-800 dark:text-gray-200">
                                      third
                                    </em>
                                    item&apos;s tab body.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
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
                      <div className="lg:flex md:flex sm:block items-center justify-between rounded-full px-2">
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer rounded-tl-full rounded-bl-full font-light roundedbtn text-sm ${activeTab === 1
                            ? "bg-SlateBlue text-white"
                            : "border border-[#D5E3FF]"
                            } `}
                          onClick={() => handleTabClick(1)}
                        >
                          All
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${activeTab === 2
                            ? "bg-SlateBlue text-white"
                            : "border border-[#D5E3FF]"
                            }`}
                          onClick={() => handleTabClick(2)}
                        >
                          Assets
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${activeTab === 3
                            ? "bg-SlateBlue text-white "
                            : "border border-[#D5E3FF]"
                            }`}
                          onClick={() => handleTabClick(3)}
                        >
                          Studio
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${activeTab === 4
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
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm rounded-tr-full roundedbtn rounded-br-full ${activeTab === 5
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
                              <h4 className=" text-base font-medium">Media Name1</h4>
                              <p className=" text-sm font-normal">Video</p>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF]"></div>
                          <div className="flex items-center p-3">
                            <div className="bg-primary p-1.5 rounded-full">
                              <IoImageOutline className="text-white text-2xl" />
                            </div>
                            <div className="ml-3">
                              <h4 className=" text-base font-medium">Media Name1</h4>
                              <p className=" text-sm font-normal">Image</p>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF]"></div>
                          <div className="flex items-center p-3">
                            <div className="bg-primary p-1.5 rounded-full">
                              <BsCameraVideo className="text-white text-2xl" />
                            </div>
                            <div className="ml-3">
                              <h4 className=" text-base font-medium">Media Name1</h4>
                              <p className=" text-sm font-normal">Video</p>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#D5E3FF]"></div>
                          <div className="flex items-center p-3">
                            <div className="bg-primary p-1.5 rounded-full">
                              <IoImageOutline className="text-white text-2xl" />
                            </div>
                            <div className="ml-3">
                              <h4 className=" text-base font-medium">Media Name1</h4>
                              <p className=" text-sm font-normal">Image</p>
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
                            <Link to="/apps">
                              <div className="bg-[#E4E6FF] p-1.5 rounded">
                                <AiOutlinePlus />
                              </div>
                            </Link>
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
                      <div className="lg:flex md:flex sm:block xs:block items-center justify-between rounded-full px-2">
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer rounded-tl-full rounded-bl-full font-light roundedbtn text-sm ${activeTab === 1
                            ? "bg-SlateBlue text-white"
                            : "border border-[#D5E3FF]"
                            } `}
                          onClick={() => handleTabClick(1)}
                        >
                          All
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${activeTab === 2
                            ? "bg-SlateBlue text-white"
                            : "border border-[#D5E3FF]"
                            }`}
                          onClick={() => handleTabClick(2)}
                        >
                          Assets
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm ${activeTab === 3
                            ? "bg-SlateBlue text-white "
                            : "border border-[#D5E3FF]"
                            }`}
                          onClick={() => handleTabClick(3)}
                        >
                          Studio
                        </div>
                        <div
                          className={`w-full py-2 flex justify-center cursor-pointer font-light  text-sm ${activeTab === 4
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
                          className={`w-full py-2 flex justify-center cursor-pointer font-light text-sm rounded-tr-full roundedbtn rounded-br-full ${activeTab === 5
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
                        <div className="flex justify-between items-center mb-2 flex-wrap">
                          <div>Images</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center my-2  flex-wrap">
                          <div>Apps</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center my-2  flex-wrap">
                          <div>Links</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center my-2  flex-wrap">
                          <div>Dashboards</div>
                          <div>
                            <button className="bg-[#E4E6FF] px-3 py-1.5 rounded-full">
                              00:02:00
                            </button>
                          </div>
                        </div>
                        <div className="border-b-[1px] border-[#D5E3FF]"></div>
                        <div className="flex justify-between items-center mt-2  flex-wrap">
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
      </div >
    </>
  );
};

export default MyPlaylist;
