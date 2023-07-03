import React, { useState } from "react";
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

const MyPlaylist = ({ sidebarOpen, setSidebarOpen }) => {
  const [toggle, setToggle] = useState(1);
  function updatetoggle(toggleTab) {
    setToggle(toggleTab);
  }
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4">
              My Playlists
            </h1>
            <div className="lg:flex md:flex sm:block">
              <button className="flex align-middle border-primary items-center border-2 rounded-full p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbBoxMultiple />
              </button>
              <button className="ml-2 flex align-middle border-primary items-center border-2 rounded-full p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <FiUpload />
              </button>
              <button className="ml-2 flex align-middle border-primary items-center border-2 rounded-full px-6 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Preview
              </button>
              <button className="ml-2 flex align-middle border-primary items-center border-2 rounded-full px-6 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Save
              </button>
              <button className="ml-2 flex align-middle border-primary items-center border-2 rounded-full p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <RiDeleteBinLine />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-8">
            <div className="col-span-3 flex justify-start">
              <div className="bg-white shadow-2xl rounded-lg">
                <div className="relative p-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-8 pointer-events-none">
                    <AiOutlineSearch className="w-5 h-5 text-gray " />
                  </span>
                  <input
                    type="text"
                    placeholder=" Search Content "
                    className="border border-primary rounded-full px-7 py-2 block w-full p-4 pl-10"
                  />
                </div>
                <div className="border-b-[1px] border-[#8E94A9]"></div>
                <div className="p-4">
                  <button className=" border-primary border flex justify-center items-center rounded-full py-2 text-base  hover:bg-primary hover:text-white w-full">
                    <MdPlaylistAddCircle className="text-lg mr-1" />
                    Add New Playlist
                  </button>
                </div>
                <div className="border-b-[1px] border-[#8E94A9]"></div>
                <div className="bg-[#D5E3FF] flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="bg-primary p-1 rounded-md">
                      <RiPlayList2Line className="text-white text-2xl" />
                    </div>
                    <div className="ml-3">
                      <div>Playlist Name</div>
                      <div className="flex">
                        Saved <div className="ml-1"> 01:10:00</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <BsThreeDotsVertical className="text-2xl" />
                  </div>
                </div>
                <div className="border-b-[1px] border-[#8E94A9]"></div>
              </div>
            </div>
            <div className="col-span-6 flex justify-start">
              <div className="bg-white shadow-2xl rounded-lg w-full">
                <div className="flex justify-between p-2">
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
                    <button className="font-medium border-primary border flex justify-center items-center rounded-full py-2 px-4 text-base  hover:bg-primary hover:text-white w-full">
                      <MdPlaylistAddCircle className="text-3xl mr-1" />
                      Add Content
                    </button>
                  </div>
                </div>
                <div className="border-b-[1px] border-[#8E94A9]"></div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="bg-primary p-1 rounded-full">
                      <BsCameraVideo className="text-white text-2xl" />
                    </div>
                    <div className="ml-2">Media Name1</div>
                  </div>
                  <div className="text-SlateBlue">01:10:00</div>
                  <div className="text-SlateBlue">App</div>
                </div>
                <div className="border-b-[1px] border-[#8E94A9]"></div>
              </div>
            </div>
            <div className="col-span-3 flex justify-start">
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
                <div className="p-2">
                  <div className="flex items-center justify-between rounded-full px-3">
                    <div className="flex justify-center border border-[#D5E3FF] w-full py-2 ">
                      All
                    </div>
                    <div className="flex justify-center border border-[#D5E3FF] w-full py-2">
                      Assets
                    </div>
                    <div className="flex justify-center border border-[#D5E3FF] w-full py-2">
                      Studio
                    </div>
                    <div className="flex justify-center border border-[#D5E3FF] w-full py-2">
                      Apps
                    </div>
                    <div className="flex justify-center border border-[#D5E3FF] w-full py-2">
                      Links
                    </div>
                    {/* <ul className="inline-flex items-center justify-center border border-primary rounded-full my-4 shadow-xl">
                                    <li className="text-sm firstli"> <button className={toggle === 1 ? 'tabshow tabactive' : 'tab'} onClick={() => updatetoggle(1)}>Info</button></li>
                                    <li className="text-sm"> <button className={toggle === 2 ? 'tabshow tabactive' : 'tab'} onClick={() => updatetoggle(2)}>Setting</button></li>
                                    <li className="text-sm firstli"> <button className={toggle === 3 ? 'tabshow tabactive' : 'tab'} onClick={() => updatetoggle(1)}>Info</button></li>
                                    <li className="text-sm"> <button className={toggle === 4 ? 'tabshow tabactive' : 'tab'} onClick={() => updatetoggle(2)}>Setting</button></li>
                                    <li className="text-sm"> <button className={toggle === 5 ? 'tabshow tabactive' : 'tab'} onClick={() => updatetoggle(2)}>Setting</button></li>
                                </ul> */}
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

export default MyPlaylist;
