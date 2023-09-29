import { useEffect, useState } from "react";
import "../../Styles/screen.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  MdLiveTv,
  MdOutlineCalendarMonth,
  MdOutlineModeEdit,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MdOutlineAddToQueue } from "react-icons/md";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { VscVmActive } from "react-icons/vsc";
import { VscVmConnect } from "react-icons/vsc";
import PropTypes from "prop-types";
import ScreenOTPModal from "./ScreenOTPModal";
import AssetModal from "../Assests/AssetModal";
import { SlScreenDesktop } from "react-icons/sl";
import { RiArrowDownSLine } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsCollectionPlay, BsPencilSquare } from "react-icons/bs";
import Footer from "../Footer";
import { BiFilterAlt } from "react-icons/bi";
import { RxTimer } from "react-icons/rx";
import { Tooltip } from "@material-tailwind/react";
import { useUser } from "../../UserContext";
import { SELECT_BY_USER_SCREENDETAIL } from "../../Pages/Api";
import axios from "axios";

const Screens = ({ sidebarOpen, setSidebarOpen }) => {
  Screens.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setCheckboxChecked(event.target.checked);
  };

  const [moreModal, setMoreModal] = useState(false);
  const [moreCheckboxClick, setMoreCheckboxClick] = useState(false);
  const [locCheckboxClick, setLocCheckboxClick] = useState(false);
  const handleCheckboxClick = () => {
    setLocCheckboxClick(!locCheckboxClick);
  };
  const handleUpdateButtonClick = () => {
    if (locCheckboxClick) {
      setMoreCheckboxClick(true);
    } else {
      setMoreCheckboxClick(false);
    }
  };

  const { user } = useUser();
  const userId = user ? user.userID : null;

  useEffect(() => {
    axios
      .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${userId}`)
      .then((response) => {
        const fetchedData = response.data.data;
        console.log(fetchedData, "--fetchedData");
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="justify-between flex items-center">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
              Screens
            </h1>

            <div className="flex items-center sm:mt-3 flex-wrap">
              <Tooltip
                content="Connect Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                >
                  <VscVmConnect className="p-1 text-3xl text-primary hover:text-white" />
                </button>
              </Tooltip>
              <Tooltip
                content="New Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                  onClick={() => setShowOTPModal(true)}
                >
                  <MdOutlineAddToQueue className="p-1 text-3xl hover:text-white text-primary" />
                </button>
              </Tooltip>
              {showOTPModal ? (
                <>
                  <ScreenOTPModal setShowOTPModal={setShowOTPModal} />
                </>
              ) : null}
              <Tooltip
                content="New Screen Group"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                >
                  <HiOutlineRectangleGroup className="p-1 text-3xl hover:text-white text-primary" />
                </button>
              </Tooltip>
              <Tooltip
                content="Deactivate/Activate"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                >
                  <VscVmActive className="p-1 text-3xl hover:text-white text-primary" />
                </button>
              </Tooltip>
              <div className="relative">
                <Tooltip
                  content="More"
                  placement="bottom-end"
                  className=" bg-SlateBlue text-white z-10 ml-5"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 1, y: 10 },
                  }}
                >
                  <button
                    type="button"
                    className="border rounded-full mr-2 hover:shadow-xl hover:bg-SlateBlue border-gray"
                    onClick={() => setMoreModal(true)}
                  >
                    <RiArrowDownSLine className="p-1 text-3xl hover:text-white text-primary" />
                  </button>
                </Tooltip>
                {moreModal && (
                  <div className="moredw">
                    <ul>
                      <li className="flex text-sm items-center ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          defaultChecked
                        />
                        Screen
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          defaultChecked
                        />
                        Status
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          defaultChecked
                        />
                        Last Seen
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          defaultChecked
                        />
                        Now Playing
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          defaultChecked
                        />
                        Current Schedule
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={locCheckboxClick}
                          onChange={handleCheckboxClick}
                        />
                        Google Location
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          defaultChecked
                        />
                        Tags
                      </li>
                      <li className="flex text-sm justify-end mt-2 ">
                        <button
                          className="bg-lightgray text-primary px-4 py-2 rounded-full"
                          onClick={handleUpdateButtonClick}
                        >
                          Update
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <Tooltip
                content="Select All Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button type="button">
                  <input type="checkbox" className="h-7 w-7" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl mt-8 shadow">
            <table
              className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                  <th className=" text-[#5A5881] text-base font-semibold">
                    <div className="flex  items-center ">
                      <SlScreenDesktop className="mr-2 text-xl" />
                      Screen
                    </div>
                  </th>
                  {moreCheckboxClick && (
                    <th className=" text-[#5A5881] text-base font-semibold">
                      <div className="flex  items-center justify-center ">
                        <HiOutlineLocationMarker className="mr-2 text-xl" />
                        Google Location
                      </div>
                    </th>
                  )}
                  <th className=" text-[#5A5881] text-base font-semibold">
                    <div className="flex  items-center justify-center  mx-auto ">
                      <MdLiveTv className="mr-2 text-xl" />
                      status
                      <BiFilterAlt className="ml-1 text-lg" />
                    </div>
                  </th>
                  <th className=" text-[#5A5881] text-base font-semibold">
                    <div className="flex  items-center justify-center   mx-auto">
                      <RxTimer className="mr-2 text-xl" />
                      Last Seen
                      <BiFilterAlt className="ml-1 text-lg" />
                    </div>
                  </th>
                  <th className=" text-[#5A5881] text-base font-semibold">
                    <div className="flex  items-center justify-center  mx-auto">
                      <BsCollectionPlay className="mr-2 text-xl" />
                      Now Playing
                    </div>
                  </th>
                  <th className=" text-[#5A5881] text-base font-semibold">
                    <div className=" flex  items-center mx-auto justify-center">
                      <MdOutlineCalendarMonth className="mr-2 text-xl" />
                      Current Schedule
                    </div>
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold">
                    <div className=" flex mx-auto items-center justify-center">
                      <BsPencilSquare className="mr-2 text-xl" />
                      Tags
                      <BiFilterAlt className="ml-1 text-lg" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-b-[#E4E6FF]">
                  <td className="flex items-center ">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={checkboxChecked}
                      onChange={handleCheckboxChange}
                    />

                    <div>
                      <Link to="/screensplayer">My Screen 1</Link>
                      <button>
                        <MdOutlineModeEdit className="text-sm ml-2 hover:text-primary" />
                      </button>
                    </div>
                  </td>
                  {moreCheckboxClick && (
                    <td className="p-2 break-words  w-[150px]">
                      132, My Street, Kingston, New York 12401.
                    </td>
                  )}
                  <td className="p-2 text-center">
                    <button className="rounded-full px-6 py-1 text-white text-center bg-[#3AB700]">
                      Live
                    </button>
                  </td>
                  <td className="p-2 text-center">25 May 2023</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => setShowAssetModal(true)}
                      className="flex  items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2  lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      Asset Name
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                    {showAssetModal ? (
                      <>
                        <AssetModal setShowAssetModal={setShowAssetModal} />
                      </>
                    ) : null}
                  </td>
                  <td className="break-words	w-[150px] p-2 text-center">
                    Schedule Name Till 28 June 2023
                  </td>
                  <td className="p-2 text-center">Tags, Tags</td>
                </tr>
                <tr className="border-0">
                  <td className="flex items-center ">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={checkboxChecked}
                      onChange={handleCheckboxChange}
                    />
                    <div>
                      <div>
                        <Link to="/screensplayer">My Screen 2</Link>
                        <button>
                          <MdOutlineModeEdit className="text-sm ml-2 hover:text-primary" />
                        </button>
                      </div>
                    </div>
                  </td>
                  {moreCheckboxClick && (
                    <td className="p-2 break-words  w-[150px]">
                      132, My Street, Kingston, New York 12401.
                    </td>
                  )}
                  <td className="p-2 text-center">
                    <button className="rounded-full px-6 py-1 text-white text-center bg-[#3AB700]">
                      Live
                    </button>
                  </td>
                  <td className="p-1 text-center">25 May 2023</td>
                  <td className="p-1 text-center">
                    <button
                      onClick={() => setShowAssetModal(true)}
                      className="flex  items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2  lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      {" "}
                      Asset Name
                      <AiOutlineCloudUpload className="ml-2 text-lg" />
                    </button>
                    {showAssetModal ? (
                      <>
                        <AssetModal setShowAssetModal={setShowAssetModal} />
                      </>
                    ) : null}
                  </td>
                  <td className="break-words	w-[150px] p-2 text-center">
                    Schedule Name Till 28 June 2023
                  </td>
                  <td className="p-2 text-center">Tags, Tags</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Screens;
