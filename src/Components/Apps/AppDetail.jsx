import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbAppsFilled } from "react-icons/tb";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsCameraVideo } from "react-icons/bs";
import { TbExclamationMark } from "react-icons/tb";
import { VscBook } from "react-icons/vsc";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import { useEffect } from "react";
import axios from "axios";
import { GET_ALL_YOUTUBEDATA } from "../../Pages/Api";


const AppDetail = ({ sidebarOpen, setSidebarOpen }) => {
  AppDetail.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
 
  const [appCheckbox, setAppCheckbox] = useState(null);
  const handleCheckboxClick = (id) => {
    if (appCheckbox === id) {
      setAppCheckbox(null);
    } else {
      setAppCheckbox(id);
    }
  };

  const [appDetailModal, setAppDetailModal] = useState(false);
// Getalldata
const [youtubeData, setYoutubeData] = useState([]);
  useEffect(() => {
    axios
      .get(GET_ALL_YOUTUBEDATA)
      .then((response) => {
        setYoutubeData(response.data.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching deleted data:", error);
      });
  }, []);
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
            <Link to="/youtube">
              <button className="flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <TbAppsFilled className="text-2xl mr-2 bg-primary text-white rounded-full p-1" />
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
                <div className="flex">
                  <button className="rounded bg-lightgray p-1">
                    <div className="flex items-center">
                      <BsCameraVideo />
                      <div className="ml-1">
                        <span>02</span>
                      </div>
                    </div>
                  </button>
                  <button className=" ml-2 border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <VscBook />
                  </button>
                  <button
                    onClick={() => setAppDetailModal(true)}
                    className="rotate-180 ml-2 border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    <TbExclamationMark />
                  </button>
                  <button className=" ml-2 border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
              <div className="">
              {Array.isArray(youtubeData) && youtubeData.length > 0 ? (
                <div className=" grid grid-cols-10 gap-4 mt-5">
                {youtubeData.map((item) => (
                  <div key={item.youtubeId} className="lg:col-span-2 md:col-span-5 sm:col-span-10">
                    <div className="shadow-md bg-[#EFF3FF] rounded-lg" >
                      <div className="relative">
                        <button className="float-right p-2">
                          <input
                            className="h-5 w-5"
                            type="checkbox"
                            onClick={() => handleCheckboxClick(id)}
                          />
                        </button>
                        {appCheckbox === item && appDetailModal && (
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
                                    <img src="../../../ScreenImg/dragon.svg" />
                                  </div>
                                  <p className="max-w-xl px-6">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry&apos;s standard
                                    dummy text ever since the 1500s, when an
                                    unknown printer took a galley of type and
                                    scrambled it to make a type specimen book.
                                  </p>
                                  <div className="py-2 px-6">
                                    <p>- Add videos by YouTube URL</p>
                                    <p>- Mute videos</p>
                                    <p>
                                      - Choose to play with or without subtitles
                                    </p>
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

export default AppDetail;
