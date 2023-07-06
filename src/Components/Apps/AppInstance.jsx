import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { GoPencil } from "react-icons/go";
import { useState } from "react";
import "../../Styles/apps.css";

const AppInstance = ({ sidebarOpen, setSidebarOpen }) => {
  AppInstance.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
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
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <BiDotsHorizontalRounded />
              </button>
              <button className="sm:ml-2 xs:ml-1 flex align-middle border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                <GrClose />
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
                  </table>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5">
                <div className="">
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
