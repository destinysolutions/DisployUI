import { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "../../../Styles/screen.css";
import { IoMdRefresh } from "react-icons/io";
import { MdArrowBackIosNew } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdElectricBolt } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import { FiPlus } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Footer from "../../Footer";
import { SELECT_BY_SCREENID_SCREENDETAIL } from "../../../Pages/Api";
import axios from "axios";
import { useSelector } from "react-redux";
const Screensplayer = ({ sidebarOpen, setSidebarOpen }) => {
  Screensplayer.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [searchParams] = useSearchParams();
  const getScreenID = searchParams.get("screenID");
  const [screenData, setScreenData] = useState([]);
  useEffect(() => {
    axios
      .get(`${SELECT_BY_SCREENID_SCREENDETAIL}?ScreenID=${getScreenID}`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        console.log(fetchedData, "fetchedData");
        setScreenData(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const [toggle, setToggle] = useState(1);
  function updatetoggle(id) {
    setToggle(id);
  }
  const [sync, setsyncToggle] = useState(1);
  function updatesynctoggle(id) {
    setsyncToggle(id);
  }
  // swich on-off
  const [enabled, setEnabled] = useState(false);
  const [mediadw, setMediadw] = useState(false);

  {
    /*payment dw */
  }
  {
    /* custome operating hours popup*/
  }
  const [showhoursModal, setshowhoursModal] = useState(false);
  const [hoursdw, setshowhoursdw] = useState(false);
  const [paymentpop, setPaymentpop] = useState(false);

  const [buttonStates, setButtonStates] = useState(Array(3).fill(false));
  const handleButtonClick = (index) => {
    setButtonStates((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };
  const buttons = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="pt-6 lg:px-5 md:px-5 sm:px-2 xs:px-1">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="justify-between flex items-center xs-block">
              <div className="section-title">
                <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl sm:mb-4  text-[#001737]">
                  Screen Player
                </h1>
              </div>
              <div className="icons flex  items-center">
                <div>
                  <Link to={"../screens"}>
                    <button className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                      <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                    </button>
                  </Link>
                </div>
                <div>
                  <button className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                    <IoMdRefresh className="p-1 px-2 text-4xl text-white hover:text-white" />
                  </button>
                </div>

                <div>
                  <div>
                    <button className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                      <RiDeleteBin5Line className="p-1 px-2 text-4xl text-white hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-white shadow-lg rounded-e-md screenplayer-section">
              <div className="screen-palyer-img ">
                <ReactPlayer
                  url={[
                    "https://www.youtube.com/watch?v=oUFJJNQGwhk",
                    "https://www.youtube.com/watch?v=jNgP6d9HraI",
                  ]}
                  className="max-w-full max-h-full reactplayer min-w-full"
                />
              </div>

              <div className="grid  grid-cols-12  screen-player-details pb-7 sm:pb-0 border-b border-[#D5E3FF]">
                <div className="default-media flex items-center xs-block justify-between bg-lightgray py-2 px-5 rounded-md lg:col-start-4 lg:col-span-6 md:col-start-3 md:col-span-8  sm:col-start-1 sm:col-span-12">
                  <div>
                    <p className="text-primary text-sm font-light">
                      Now Playing
                    </p>
                    <h4 className="text-primary text-lg">Default Media</h4>
                  </div>

                  <div className="relative">
                    <div className="relative">
                      <button
                        className="bg-white p-1 rounded-md shadow mr-2 hover:bg-SlateBlue relative"
                        onClick={() => setMediadw((prev) => !prev)}
                      >
                        <HiOutlineChevronDown className="text-primary text-lg hover:text-white" />
                      </button>
                      <button className="bg-white p-1 rounded-md shadow hover:bg-SlateBlue">
                        <AiOutlineCloudUpload className="text-primary text-lg hover:text-white" />
                      </button>
                    </div>
                    {mediadw && (
                      <div className="mediadw">
                        <ul>
                          <li className="flex text-sm  items-center">
                            <MdElectricBolt className="mr-2 text-lg" />
                            Default Media
                          </li>
                          <li className="flex text-sm items-center">
                            <AiOutlineCloudUpload className="mr-2 text-lg" />
                            Browse More
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid  grid-cols-12">
                <div className="lg:col-start-4 lg:col-span-6 md:col-start-1 md:col-span-12  sm:col-start-1 sm:col-span-12 text-center">
                  <ul className="inline-flex items-center justify-center border border-gray rounded-full my-4 shadow-xl">
                    <li className="text-sm firstli">
                      {" "}
                      <button
                        className={toggle === 1 ? "tabshow tabactive" : "tab"}
                        onClick={() => updatetoggle(1)}
                      >
                        Info
                      </button>
                    </li>
                    <li className="text-sm">
                      {" "}
                      <button
                        className={toggle === 2 ? "tabshow tabactive" : "tab"}
                        onClick={() => updatetoggle(2)}
                      >
                        Setting
                      </button>
                    </li>
                  </ul>
                  <div
                    className={
                      toggle === 1
                        ? "show-togglecontent active"
                        : "togglecontent"
                    }
                  >
                    <table
                      cellPadding={10}
                      className="w-full border-[#D5E3FF] border rounded-xl screen-status"
                    >
                      {Array.isArray(screenData) &&
                        screenData.map((screen) => (
                          <tbody key={screen.screenID}>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right lg:w-2/4 md:w-2/4 sm:w-full">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Screen Status:
                                </p>
                              </td>
                              <td className="text-left">
                                <button className="bg-gray py-2 px-8 rounded-full text-primary hover:bg-primary hover:text-white">
                                  Offline
                                </button>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Screen Details:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Sony, S01-5000035, 5120 x 2880, (Ultrawide 5K)
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Mac ID:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  {screen.macid}
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Operating System:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Apple TV
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Google Location:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  {screen.googleLocation}
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Time Zone:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  {screen.timeZone}
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Tags:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  {screen.tags}
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Connected Since:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Jun 5, 2023, 8:16 PM
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Connected By:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  User Name
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  Operating Hours:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  Always on
                                </p>
                              </td>
                            </tr>
                            <tr className="border-b border-[#D5E3FF]">
                              <td className="text-right">
                                <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                  payment method:
                                </p>
                              </td>
                              <td className="text-left">
                                <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                  **** **** **** 2222
                                </p>
                              </td>
                            </tr>

                            {/* <tr>
                          <td colSpan={2}>
                            <div className="flex items-center justify-center">
                              {" "}
                              <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mr-2">
                                Do you want to run the App at boot up time :
                              </p>
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
                                  className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                                    enabled
                                      ? " bg-gray text-left pl-2 text-white text-sm"
                                      : "bg-gray text-right pr-2 text-white text-sm"
                                  }`}
                                >
                                  {enabled ? "On" : "Off"}
                                </div>
                              </label>
                            </div>
                          </td>
                        </tr> */}
                          </tbody>
                        ))}
                    </table>
                    <div className="text-right my-5">
                      <button className="bg-primary text-base px-5 py-2 rounded-full text-white">
                        Save
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      toggle === 2
                        ? "show-togglecontent active"
                        : "togglecontent"
                    }
                  >
                    <table
                      cellPadding={10}
                      className="w-full border-[#D5E3FF] border rounded-xl synctable responsive-table"
                    >
                      <tbody>
                        <tr className="border-b border-[#D5E3FF]">
                          <td className="lg:text-right md:text-right sm:text-left xs:text-left lg:w-2/4  md:w-2/4 sm:w-full">
                            <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                              Orientation:
                            </p>
                          </td>
                          <td className="text-left">
                            <div className="flex lg:justify-center md:justify-start sm:justify-start xs:justify-start lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                              <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                <input
                                  className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                  type="radio"
                                  name="inlineRadioOptions"
                                  id="inlineRadio1"
                                  value="option1"
                                />
                                <label
                                  className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                  htmlFor="inlineRadio1"
                                >
                                  0
                                </label>
                              </div>

                              <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                <input
                                  className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                  type="radio"
                                  name="inlineRadioOptions"
                                  id="inlineRadio1"
                                  value="option1"
                                />
                                <label
                                  className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                  htmlFor="inlineRadio1"
                                >
                                  90
                                </label>
                              </div>

                              <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                <input
                                  className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                  type="radio"
                                  name="inlineRadioOptions"
                                  id="inlineRadio1"
                                  value="option1"
                                />
                                <label
                                  className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                  htmlFor="inlineRadio1"
                                >
                                  180
                                </label>
                              </div>

                              <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                                <input
                                  className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                  type="radio"
                                  name="inlineRadioOptions"
                                  id="inlineRadio1"
                                  value="option1"
                                />
                                <label
                                  className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer"
                                  htmlFor="inlineRadio1"
                                >
                                  270
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="lg:text-right md:text-right sm:text-left xs:text-left pb-0">
                            <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                              Playback Mode:
                            </p>
                          </td>
                          <td className="text-left pb-0">
                            <ul className="inline-flex items-center justify-center  my-4 lg:flex-nowrap md:flex-nowrap sm:flex-wrap xs:flex-wrap">
                              <li className="text-sm">
                                {" "}
                                <button
                                  className={
                                    sync === 1
                                      ? "tabsyncshow tabsyncactive"
                                      : "synctab "
                                  }
                                  onClick={() => updatesynctoggle(1)}
                                >
                                  sync
                                </button>
                              </li>
                              <li className="text-sm">
                                {" "}
                                <button
                                  className={
                                    sync === 2
                                      ? "tabsyncshow tabsyncactive"
                                      : "synctab "
                                  }
                                  onClick={() => updatesynctoggle(2)}
                                >
                                  Unsync
                                </button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                        <tr
                          className={
                            sync === 1
                              ? "show-togglesynccontent active w-full"
                              : "togglesynccontent"
                          }
                        >
                          <td colSpan={2}>
                            <table
                              cellPadding={10}
                              className="sync-table w-full responsive-table"
                            >
                              <tbody>
                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-center pt-0" colSpan={2}>
                                    <p className="text-primary text-sm font-medium">
                                      Sync mode will keep your screens in sync
                                      with each other when playing the same
                                      content
                                    </p>
                                  </td>
                                </tr>
                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Google Location:
                                    </p>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      placeholder="132, My Street, Kingston, New York..."
                                    />
                                  </td>
                                </tr>

                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Overwrite Time Zone:
                                    </p>
                                  </td>
                                  <td className="relative">
                                    <select className="relative">
                                      <option>Asia/Calcutta</option>
                                      <option>Asia/Calcutta</option>
                                    </select>
                                  </td>
                                </tr>

                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Screen Group:
                                    </p>
                                  </td>
                                  <td>
                                    <select>
                                      <option>Ungrouped</option>
                                      <option>grouped</option>
                                    </select>
                                  </td>
                                </tr>

                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Tags
                                    </p>
                                  </td>
                                  <td>
                                    <select>
                                      <option>Marketing</option>
                                    </select>
                                  </td>
                                </tr>

                                <tr className="border-b border-[#D5E3FF] relative">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Operating Hours:
                                    </p>
                                  </td>
                                  <td>
                                    <div className="paymentlabel relative">
                                      <span
                                        className="flex justify-between"
                                        onClick={() => setshowhoursdw(!hoursdw)}
                                      >
                                        <label> Operating Hours</label>
                                        <MdOutlineKeyboardArrowDown className=" text-xl font-black cursor-pointer" />
                                      </span>
                                    </div>
                                    {hoursdw && (
                                      <div className="hoursdw relative">
                                        <ul className=" absolute top-0 left-0 bg-white rounded-xl w-full drop-shadow-xl z-10 border-[#ddd] border">
                                          <li className="px-3 py-1 text-sm hover:rounded-tl-xl hover:rounded-tr-xl text-left">
                                            Always On
                                          </li>
                                          <li
                                            className="px-3  py-1 text-sm  hover:rounded-bl-xl hover:rounded-br-xl text-left"
                                            onClick={() =>
                                              setshowhoursModal(true)
                                            }
                                          >
                                            <button>Custom</button>
                                          </li>
                                        </ul>
                                      </div>
                                    )}
                                  </td>
                                </tr>

                                {showhoursModal && (
                                  <>
                                    <div className="backdrop">
                                      <div className="hours-model rounded-lg">
                                        <div className="hours-heading flex  justify-between items-center p-5 border-b border-gray">
                                          <h1>Custom Operating Hours</h1>
                                          <AiOutlineCloseCircle
                                            className="text-primary text-3xl"
                                            onClick={() =>
                                              setshowhoursModal(false)
                                            }
                                          />
                                        </div>
                                        <hr className="border-gray " />
                                        <div className="model-body lg:p-5 md:p-5 sm:p-5 xs:p-4 ">
                                          <div className="model-details shadow-2xl lg:p-3 md:p-5 sm:p-5 xs:py-3 xs:px-1 text-left rounded-2xl">
                                            <lable className="text-base font-medium">
                                              Hours:
                                            </lable>
                                            <div className="flex justify-between items-center mt-3">
                                              <input
                                                type="time"
                                                placeholder="From Time"
                                              />
                                              <lable className="lg:px-3 md:px-3 sm:px-1 xs:px-1 text-base">
                                                To
                                              </lable>
                                              <input
                                                type="time"
                                                placeholder="To Time"
                                              />
                                            </div>
                                            <div className="pt-5 text-center">
                                              {buttons.map((label, index) => (
                                                <button
                                                  className="daysbtn"
                                                  key={index}
                                                  onClick={() =>
                                                    handleButtonClick(index)
                                                  }
                                                  style={{
                                                    backgroundColor:
                                                      buttonStates[index]
                                                        ? "#fff"
                                                        : " #00072e",
                                                    color: buttonStates[index]
                                                      ? "#41479b"
                                                      : "#fff",
                                                  }}
                                                >
                                                  {label}
                                                </button>
                                              ))}
                                            </div>

                                            <div className="formgroup lg:flex md:flex sm:flex xs:block justify-between items-center mt-5">
                                              <label className="lg:text-base md:text-base sm:text-base xs:text-xs  lg:ml-0 md:ml-0 sm:ml-0  xs:ml-3 font-medium mr-3">
                                                Action
                                              </label>
                                              <select>
                                                <option>Select Action</option>
                                                <option>Shut Down</option>
                                                <option>Sleep</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right mt-0 pr-5">
                                          <button className="bg-primary  text-white lg:px-8 md:px-8 sm:px-5 xs:px-5 lg:py-3 md:py-3 sm:py-2 xs:py-2 text-base rounded-full mb-5 drop-shadow-xl ">
                                            Apply
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                <tr className="border-b border-[#D5E3FF]">
                                  <td className="text-right">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                      Payment method:
                                    </p>
                                  </td>
                                  <td className="relative">
                                    <div className="paymentlabel relative">
                                      <span
                                        className="flex justify-between"
                                        onClick={() =>
                                          setPaymentpop(!paymentpop)
                                        }
                                      >
                                        <label>Select Card</label>
                                        <MdOutlineKeyboardArrowDown className=" text-xl font-black cursor-pointer" />
                                      </span>

                                      {paymentpop && (
                                        <div className="payment-dropdown">
                                          <ul>
                                            <li className="flex items-center justify-between my-3 p-2  border-2 rounded-md border-[#E4E6FF] ">
                                              <label className="lg:flex md:flex sm:block xs:block items-center lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                                <img
                                                  src="../../../../ScreenImg/logos_mastercard.png"
                                                  className="mr-3"
                                                />
                                                Axis Bank **** **** **** 8395
                                              </label>
                                              <input
                                                type="radio"
                                                name="payment"
                                                id="1"
                                              />
                                            </li>
                                            <li className="flex items-center justify-between my-3 p-2 border-2 rounded-md border-[#E4E6FF]">
                                              <label className="lg:flex md:flex sm:block xs:block items-center lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                                <img
                                                  src="../../../../ScreenImg/Vector(3).png"
                                                  className="mr-3"
                                                />
                                                HDFC Bank **** **** **** 6246
                                              </label>{" "}
                                              <input
                                                type="radio"
                                                name="payment"
                                                id="2"
                                              />
                                            </li>
                                            <li className="border-2 my-1 p-2 rounded-md border-[#E4E6FF]">
                                              <button className="flex items-center">
                                                <FiPlus className="bg-lightgray text-SlateBlue text-2xl p-1 rounded-md mr-3" />
                                                <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                                  Add New Card
                                                </span>
                                              </button>
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>

                                <tr>
                                  <td colSpan={2}>
                                    <div className="flex items-center justify-center">
                                      {" "}
                                      <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mr-2">
                                        Do you want to run the App at boot up
                                        time :
                                      </p>
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
                                          className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                                            enabled
                                              ? " bg-gray text-left pl-2 text-white text-sm"
                                              : "bg-gray text-right pr-2 text-white text-sm"
                                          }`}
                                        >
                                          {enabled ? "On" : "Off"}
                                        </div>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="text-right my-5">
                              <button className="bg-primary text-base px-5 py-2 rounded-full text-white hover:bg-SlateBlue">
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>

                        <tr
                          className={
                            sync === 2
                              ? "show-togglesynccontent active w-full"
                              : "togglesynccontent"
                          }
                        >
                          <td colSpan={2}>
                            <table
                              cellPadding={10}
                              className="sync-table  w-full responsive-table"
                            >
                              <tr className="border-b border-[#D5E3FF]">
                                <td className="text-center pt-0" colSpan={2}>
                                  <p className="text-primary text-sm font-medium">
                                    Unsync mode will play your content from the
                                    beginning each time and won&apos;t keep this
                                    screen in sync
                                  </p>
                                </td>
                              </tr>
                              <tr className="border-b border-[#D5E3FF]">
                                <td className="text-right">
                                  <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                    Google Location
                                  </p>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="132, My Street, Kingston, New York..."
                                  />
                                </td>
                              </tr>

                              <tr className="border-b border-[#D5E3FF]">
                                <td className="text-right">
                                  <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                    Select Time Zone
                                  </p>
                                </td>
                                <td className="relative">
                                  <select className="relative">
                                    <option>Asia/Calcutta</option>
                                    <option>Asia/Calcutta</option>
                                  </select>
                                </td>
                              </tr>

                              <tr className="border-b border-[#D5E3FF]">
                                <td className="text-right">
                                  <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                    Screen Group
                                  </p>
                                </td>
                                <td>
                                  <select>
                                    <option>Ungrouped</option>
                                    <option>grouped</option>
                                  </select>
                                </td>
                              </tr>

                              <tr className="border-b border-[#D5E3FF]">
                                <td className="text-right">
                                  <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                    Tags
                                  </p>
                                </td>
                                <td>
                                  <select>
                                    <option>Marketing</option>
                                  </select>
                                </td>
                              </tr>

                              <tr className="border-b border-[#D5E3FF]">
                                <td className="text-right">
                                  <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                    Operating Hours:
                                  </p>
                                </td>
                                <td>
                                  <select className="relative">
                                    <option>Always On</option>
                                    <option>
                                      <button>Custom</button>
                                    </option>
                                  </select>
                                </td>
                              </tr>

                              <tr className="border-b border-[#D5E3FF]">
                                <td className="text-right">
                                  <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base">
                                    payment method:
                                  </p>
                                </td>
                                <td className="text-left">
                                  <p className="lg:text-base md:text-base sm:text-sm xs:text-sm text-[#515151]">
                                    **** **** **** 2222
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={2}>
                                  <div className="flex items-center justify-center">
                                    <p className="text-primary lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mr-2">
                                      Do you want to run the App at boot up time
                                      :
                                    </p>
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
                                        className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                                          enabled
                                            ? " bg-gray text-left pl-2 text-white text-sm"
                                            : "bg-gray text-right pr-2 text-white text-sm"
                                        }`}
                                      >
                                        {enabled ? "On" : "Off"}
                                      </div>
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <div className="text-right my-5">
                              <button className="bg-primary text-base px-5 py-2 rounded-full text-white hover:bg-SlateBlue">
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <Footer />
    </>
  );
};

export default Screensplayer;
