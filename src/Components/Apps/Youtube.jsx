import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbAppsFilled } from "react-icons/tb";
import { useState } from "react";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import { BsCameraVideo, BsInfoLg } from "react-icons/bs";
import { TbExclamationMark } from "react-icons/tb";
import { VscBook } from "react-icons/vsc";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import { useEffect } from "react";
import axios, { all } from "axios";
import {
  GET_ALL_YOUTUBEDATA,
  YOUTUBEDATA_ALL_DELETE,
  YOUTUBE_INSTANCE_ADD_URL,
} from "../../Pages/Api";
import ReactPlayer from "react-player";
import { FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSelector } from "react-redux";

const Youtube = ({ sidebarOpen, setSidebarOpen }) => {
  Youtube.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  

  const [appDetailModal, setAppDetailModal] = useState(false);

  const [youtubeData, setYoutubeData] = useState([]);

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    axios
      .get(GET_ALL_YOUTUBEDATA,{ headers: {
        Authorization: authToken,
      },})
      .then((response) => {
        const fetchedData = response.data.data;
        setYoutubeData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching deleted data:", error);
      });
  }, []);

  const handelDeleteInstance = (youtubeId) => {
    let data = JSON.stringify({
      youtubeId: youtubeId,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: YOUTUBE_INSTANCE_ADD_URL,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response, "response");
        const updatedInstanceData = youtubeData.filter(
          (instanceData) => instanceData.youtubeId !== youtubeId
        );
        setYoutubeData(updatedInstanceData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheckboxChange = (instanceId) => {
    const updatedInstance = youtubeData.map((youtube) =>
      youtube.youtubeId === instanceId
        ? {
            ...youtube,
            isChecked: !youtube.isChecked,
          }
        : youtube
    );

    setYoutubeData(updatedInstance);

    const allChecked = updatedInstance.every((youtube) => youtube.isChecked);
    setSelectAll(allChecked);
  };

  // Function to handle the "Select All" checkbox change
  const handleSelectAll = (e) => {
    const updatedInstance = youtubeData.map((youtube) => ({
      ...youtube,
      isChecked: !selectAll,
    }));
    setYoutubeData(updatedInstance);
    setSelectAll(!selectAll);
  };

  const handelDeleteAllInstance = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: YOUTUBEDATA_ALL_DELETE,
      headers: {Authorization: authToken},
    };

    axios
      .request(config)
      .then(() => {
        setSelectAll(false);
        setYoutubeData([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [appDropDown, setAppDropDown] = useState(null);
  const handleAppDropDownClick = (id) => {
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

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
            <Link to="/youtubedetail">
              <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbAppsFilled className="text-2xl mr-2 text-white" />
                New Instance
              </button>
            </Link>
          </div>
          <div className="mt-5 mb-5">
            <div className="shadow-md bg-white rounded-lg p-5">
              <div className="flex justify-between items-center">
                <h1 className="not-italic font-medium text-xl text-[#001737] ">
                  YouTube
                </h1>
                <div className="flex items-center">
                  <button
                    onClick={() => setAppDetailModal(true)}
                    className="w-8 h-8 ml-2 border-primary hover:bg-SlateBlue hover:border-SlateBlue items-center border-2 rounded-full p-1 text-xl   hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    <BsInfoLg />
                  </button>
                  {appDetailModal && (
                    <>
                      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                        <div className="relative w-auto my-6 mx-auto">
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none md:max-w-xl sm:max-w-sm xs:max-w-xs">
                            <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7] border-slate-200 rounded-t">
                              <div className="flex items-center">
                                <div>
                                  <img
                                    src="../../../AppsImg/youtube.svg"
                                    className="w-10"
                                  />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-lg font-medium">
                                    YouTube
                                  </h4>
                                  <h4 className="text-sm font-normal ">
                                    Internal Communications
                                  </h4>
                                </div>
                              </div>
                              <button
                                className="p-1 text-3xl"
                                onClick={() => setAppDetailModal(false)}
                              >
                                <AiOutlineCloseCircle />
                              </button>
                            </div>
                            <div className="p-2">
                              <ReactPlayer
                                url="https://www.youtube.com/watch?v=WKOYp_7P71Y"
                                className="app-instance-preview"
                              />
                            </div>
                            <p className="max-w-xl px-6">
                              Lorem Ipsum is simply dummy text of the printing
                              and typesetting industry. Lorem Ipsum has been the
                              industry&apos;s standard dummy text ever since the
                              1500s, when an unknown printer took a galley of
                              type and scrambled it to make a type specimen
                              book.
                            </p>
                            <div className="py-2 px-6">
                              <p>- Add videos by YouTube URL</p>
                              <p>- Mute videos</p>
                              <p>- Choose to play with or without subtitles</p>
                            </div>
                            <div className="flex items-center justify-center p-5">
                              <button className="border-primary border-2 text-primary py-1.5 px-5 rounded-full hover:bg-primary hover:text-white">
                                App Guide
                              </button>
                              <button
                                className="bg-primary text-white rounded-full py-2 px-5 ml-5"
                                onClick={() => setAppDetailModal(false)}
                              >
                                Go to App
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <button
                    onClick={handelDeleteAllInstance}
                    className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full p-1 text-xl  hover:text-white hover:border-SlateBlue hover:bg-SlateBlue hover:shadow-lg hover:shadow-primary-500/50"
                    style={{ display: selectAll ? "block" : "none" }}
                  >
                    <RiDeleteBinLine />
                  </button>

                  <button className="sm:ml-2 xs:ml-1 mt-1">
                    <input
                      type="checkbox"
                      className="h-7 w-7"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </button>
                </div>
              </div>
              <div>
                {Array.isArray(youtubeData) && youtubeData.length > 0 ? (
                  <div className=" grid grid-cols-10 gap-4 mt-5">
                    {youtubeData.map((item) => (
                      <div
                        key={item.youtubeId}
                        className="lg:col-span-2 md:col-span-5 sm:col-span-10"
                      >
                        <div className="shadow-md bg-[#EFF3FF] rounded-lg">
                          <div className="relative flex justify-between">
                            <button className="float-right p-2">
                              <input
                                className="h-5 w-5"
                                type="checkbox"
                                checked={item.isChecked || false}
                                onChange={() =>
                                  handleCheckboxChange(item.youtubeId)
                                }
                              />
                            </button>
                            <div className="relative">
                              <button className="float-right">
                                <BiDotsHorizontalRounded
                                  className="text-2xl"
                                  onClick={() =>
                                    handleAppDropDownClick(item.youtubeId)
                                  }
                                />
                              </button>
                              {appDropDown === item.youtubeId && (
                                <div className="appdw">
                                  <ul>
                                    <li className="flex text-sm items-center">
                                      <FiUpload className="mr-2 text-lg" />
                                      Set to Screen
                                    </li>
                                    <li className="flex text-sm items-center">
                                      <MdPlaylistPlay className="mr-2 text-lg" />
                                      Add to Playlist
                                    </li>

                                    <li
                                      className="flex text-sm items-center cursor-pointer"
                                      onClick={() =>
                                        handelDeleteInstance(item.youtubeId)
                                      }
                                    >
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Delete
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-center clear-both pb-8">
                            <img
                              src="../../../public/AppsImg/youtube.svg"
                              alt="Logo"
                              className="cursor-pointer mx-auto h-20 w-20"
                            />
                            <h4 className="text-lg font-medium mt-3">
                              {item.instanceName}
                            </h4>
                            <h4 className="text-sm font-normal ">Add tags</h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No YouTube data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Youtube;
