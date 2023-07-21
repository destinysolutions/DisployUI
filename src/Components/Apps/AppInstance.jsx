import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { GoPencil } from "react-icons/go";
import { useState } from "react";
import "../../Styles/apps.css";
import { FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { TbBoxMultiple, TbCalendarTime } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { Link } from "react-router-dom";

const AppInstance = ({ sidebarOpen, setSidebarOpen }) => {
  AppInstance.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [enabled, setEnabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSetScreenModal, setShowSetScreenModal] = useState(false);
  const [playlistDeleteModal, setPlaylistDeleteModal] = useState(false);
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <div className="flex items-center">
              <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                YouTube
              </h1>
              <GoPencil className="ml-4 text-lg" />
            </div>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
              <button className=" flex align-middle border-primary items-center border-2 rounded-full py-1 px-4 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Preview
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle bg-primary text-white items-center rounded-full py-1 px-4 text-base hover:shadow-lg hover:shadow-primary-500/50">
                Save
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowPopup(!showPopup)}
                  className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full py-[10px] px-[11px] text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                >
                  <BiDotsHorizontalRounded />
                </button>
                {showPopup && (
                  <div className="editdw">
                    <ul>
                      <li
                        className="flex text-sm items-center cursor-pointer"
                        onClick={() => setShowSetScreenModal(true)}
                      >
                        <FiUpload className="mr-2 text-lg" />
                        Set to Screen
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <MdPlaylistPlay className="mr-2 text-lg" />
                        Add to Playlist
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <TbBoxMultiple className="mr-2 text-lg" />
                        Duplicate
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <TbCalendarTime className="mr-2 text-lg" />
                        Set availability
                      </li>
                      <li
                        className="flex text-sm items-center mt-2 cursor-pointer"
                        onClick={() => setPlaylistDeleteModal(true)}
                      >
                        <RiDeleteBin5Line className="mr-2 text-lg" />
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
                {showSetScreenModal && (
                  <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                          <div className="flex items-center">
                            <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                              Select Screens to Playlist Name
                            </h3>
                          </div>
                          <button
                            className="p-1 text-xl ml-8"
                            onClick={() => setShowSetScreenModal(false)}
                          >
                            <AiOutlineCloseCircle className="text-2xl" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center p-4">
                          <div className="text-right mr-5 flex items-end justify-end relative sm:mr-0">
                            <AiOutlineSearch className="absolute top-[13px] right-[233px] z-10 text-gray searchicon" />
                            <input
                              type="text"
                              placeholder=" Search Playlist"
                              className="border border-primary rounded-full px-7 py-2 search-user"
                            />
                          </div>
                          <div className="flex items-center">
                            <button className="bg-[#E4E6FF] rounded-full px-4 py-2 text-SlateBlue">
                              Tags
                            </button>
                            <button className="flex items-center bg-[#E4E6FF] rounded-full px-4 py-2 text-SlateBlue ml-3">
                              <input type="checkbox" className="w-5 h-5 mr-2" />
                              All Clear
                            </button>
                          </div>
                        </div>
                        <div className="px-9">
                          <div className="overflow-x-auto p-4 shadow-xl bg-white rounded-lg ">
                            <table className=" w-full ">
                              <thead>
                                <tr className="flex justify-between items-center">
                                  <th className="font-medium text-[14px]">
                                    <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                                      Name
                                    </button>
                                  </th>
                                  <th className="p-3 font-medium text-[14px]">
                                    <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                                      Group
                                    </button>
                                  </th>
                                  <th className="p-3 font-medium text-[14px]">
                                    <button className="bg-[#E4E6FF] rounded-full flex  items-center justify-center px-6 py-2">
                                      Playing
                                    </button>
                                  </th>
                                  <th className="p-3 font-medium text-[14px]">
                                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                                      Status
                                    </button>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="mt-3 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                                  <td className="flex items-center ">
                                    <input type="checkbox" className="mr-3" />
                                    <div>
                                      <div>Tv 1</div>
                                    </div>
                                  </td>
                                  <td className="p-2">Marketing</td>
                                  <td className="p-2">25 May 2023</td>
                                  <td className="p-2">
                                    <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                                      Live
                                    </button>
                                  </td>
                                </tr>
                                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                                  <td className="flex items-center ">
                                    <input type="checkbox" className="mr-3" />
                                    <div>
                                      <div>Tv 1</div>
                                    </div>
                                  </td>
                                  <td className="p-2">Marketing</td>
                                  <td className="p-2">25 May 2023</td>
                                  <td className="p-2">
                                    <button className="rounded-full px-6 py-1 text-white bg-[#D40000]">
                                      Offline
                                    </button>
                                  </td>
                                </tr>
                                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                                  <td className="flex items-center ">
                                    <input type="checkbox" className="mr-3" />
                                    <div>
                                      <div>Tv 1</div>
                                    </div>
                                  </td>
                                  <td className="p-2">Marketing</td>
                                  <td className="p-2">25 May 2023</td>
                                  <td className="p-2">
                                    <button className="rounded-full px-6 py-1 text-white bg-[#D40000]">
                                      Offline
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="flex justify-between p-6">
                          <button className="border-2 border-primary px-4 py-2 rounded-full">
                            Add new Playlist
                          </button>
                          <Link to="/myplaylist">
                            <button className="bg-primary text-white px-4 py-2 rounded-full">
                              Save
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {playlistDeleteModal && (
                  <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="w-auto my-6 mx-auto lg:max-w-xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                          <div className="flex items-center">
                            <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                              Delete Playlist Name?
                            </h3>
                          </div>
                          <button
                            className="p-1 text-xl ml-8"
                            onClick={() => setPlaylistDeleteModal(false)}
                          >
                            <AiOutlineCloseCircle className="text-2xl" />
                          </button>
                        </div>
                        <div className="p-5">
                          <p>
                            Playlist Name is being used elsewhere and will be
                            removed when deleted. Please check before deleting.
                          </p>
                          <div className="flex mt-4">
                            <label className="font-medium">Playlist : </label>
                            <p className="ml-2">Ram Siya Ram</p>
                          </div>
                        </div>
                        <div className="flex justify-center items-center pb-5">
                          <button
                            className="border-2 border-primary px-4 py-1.5 rounded-full"
                            onClick={() => setPlaylistDeleteModal(false)}
                          >
                            Cencel
                          </button>
                          <Link to="/apps">
                            <button className="bg-primary text-white ml-3 px-4 py-2 rounded-full">
                              Delete
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full px-[10px] text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <AiOutlineClose />
              </button>
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5">
                <div className=" ">
                  <table
                    className="youtubetable w-full align-middle"
                    cellPadding={10}
                    cellSpacing={10}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <label className="text-base font-normal">
                            YouTube URL:
                          </label>
                        </td>
                        <td>
                          <input type="text" placeholder="www.youtube.com" />
                        </td>
                      </tr>

                      <tr className="mutebtn">
                        <td>
                          <span className="text-base font-normal">
                            Mute videos:
                          </span>
                        </td>
                        <td className="text-right  items-end">
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={enabled}
                              readOnly
                            />
                            <div
                              onClick={() => {
                                setEnabled(!enabled);
                              }}
                              className="w-11 h-6 bg-[#E4E6FF] rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all "
                            ></div>
                          </label>
                        </td>
                      </tr>
                      <tr className="mutebtn">
                        <td>
                          <span className="text-base font-normal">
                            Toggle subtitles:
                          </span>
                        </td>
                        <td className="text-right">
                          <label className="inline-flex relative items-center  cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={enabled}
                              readOnly
                            />
                            <div
                              onClick={() => {
                                setEnabled(!enabled);
                              }}
                              className="w-11 h-6 bg-[#E4E6FF] rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all "
                            ></div>
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label className="text-base font-normal">
                            Max number of videos to play
                            <br /> within a YouTube playlist:
                          </label>
                        </td>
                        <td>
                          <input type="text" placeholder="e.g.10" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label className="text-base font-normal">
                            This app&apos;s duration on screen:
                          </label>
                        </td>
                        <td>
                          <input type="text" placeholder="720" />
                        </td>
                      </tr>
                      <tr></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg flex items-center">
                <div>
                  <img src="../../../ScreenImg/dragon.svg" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppInstance;
