import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { MdSave } from 'react-icons/md';
import { GoPencil } from 'react-icons/go';
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineClose } from 'react-icons/ai';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DigitalMenuBoardDetail = ({ sidebarOpen, setSidebarOpen }) => {
    const { token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const history = useNavigate();

    const [saveLoading, setSaveLoading] = useState(false);
    const currentDate = new Date();
    const [instanceName, setInstanceName] = useState(
        moment(currentDate).format("YYYY-MM-DD hh:mm A")
    );
    const [edited, setEdited] = useState(false);
    const [showPreviewPopup, setShowPreviewPopup] = useState(false);


    const handleOnSaveInstanceName = (e) => {
        if (!instanceName.replace(/\s/g, "").length) {
            toast.remove();
            return toast.error("Please enter at least minimum 1 character.");
        }
        setEdited(false);
    };

      //Insert  API
  const addDigitalMenuApp = () => {
    // if (!YoutubeVideo?.includes("youtu.be")) {
    //   toast.remove();
    //   return toast.error("Please Enter Vaild Youtube URL");
    // }
    // if (instanceName === "" || YoutubeVideo === "") {
    //   toast.remove();
    //   return toast.error("Please fill all the details");
    // }
    let data = JSON.stringify({
      instanceName: instanceName,
    //   youTubeURL: YoutubeVideo,
    //   muteVideos: isMuted,
    //   toggleSubtitles: areSubtitlesOn,
    //   youTubePlaylist: maxVideos,
      operation: "Insert",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
    //   url: YOUTUBE_INSTANCE_ADD_URL,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };
    setSaveLoading(true);
    axios
      .request(config)
      .then((response) => {
        if (window.history.length === 1) {
        //   dispatch(handleNavigateFromComposition());
        //   dispatch(handleChangeNavigateFromComposition(false));
          localStorage.setItem("isWindowClosed", "true");
          window.close();
        } else {
          history("/Digital-Menu-Board");
        }
        setSaveLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setSaveLoading(false);
      });
  };

    return (
        <>
            <div className="flex border-b border-gray bg-white">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="lg:flex lg:justify-between sm:block  items-center">
                        <div className="flex items-center">
                            {edited ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="w-full border border-primary rounded-md px-2 py-1"
                                        placeholder="Enter schedule name"
                                        value={instanceName}
                                        onChange={(e) => {
                                            setInstanceName(e.target.value);
                                        }}
                                    />
                                    <MdSave
                                        onClick={() => handleOnSaveInstanceName()}
                                        className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] ">
                                        {instanceName}
                                    </h1>
                                    <button onClick={() => setEdited(true)}>
                                        <GoPencil className="ml-4 text-lg" />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap youtubebtnpopup">
                            <button
                                className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-2 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                disabled={saveLoading}
                                onClick={() => {
                                   
                                    setShowPreviewPopup(true);
                                }}
                            >
                                Preview
                            </button>
                            <button
                                className="flex align-middle border-white bg-SlateBlue text-white sm:mt-2  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 .  text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                onClick={() => addDigitalMenuApp()}
                                disabled={saveLoading}
                            >
                                {saveLoading ? "Saving..." : "Save"}
                            </button>
                            {/* <div className="relative sm:mt-2">
                  <button
                    onClick={() => setShowPopup(!showPopup)}
                    className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full p-2 text-xl  hover:bg-SlateBlue hover:text-white  hover:shadow-lg hover:shadow-primary-500/50 hover:border-white"
                  >
                    <BiDotsHorizontalRounded />
                  </button>
                  {showPopup && (
                    <div className="editdw z-30">
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
                    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
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
                              <button className="bg-lightgray rounded-full px-4 py-2 text-SlateBlue">
                                Tags
                              </button>
                              <button className="flex items-center bg-lightgray rounded-full px-4 py-2 text-SlateBlue ml-3">
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
                                      <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                        Name
                                      </button>
                                    </th>
                                    <th className="p-3 font-medium text-[14px]">
                                      <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                        Group
                                      </button>
                                    </th>
                                    <th className="p-3 font-medium text-[14px]">
                                      <button className="bg-lightgray rounded-full flex  items-center justify-center px-6 py-2">
                                        Playing
                                      </button>
                                    </th>
                                    <th className="p-3 font-medium text-[14px]">
                                      <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
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
                            <Link to="/composition">
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
                    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
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
                </div> */}

                            <Link to="/Digital-Menu-Board">
                                <button className="sm:ml-2 xs:ml-1 sm:mt-2 border-primary items-center border-2  rounded-full text-xl  hover:text-white hover:bg-SlateBlue hover:border-white hover:shadow-lg hover:shadow-primary-500/50 p-2 ">
                                    <AiOutlineClose />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DigitalMenuBoardDetail
