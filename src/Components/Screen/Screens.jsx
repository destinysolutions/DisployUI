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
import { RiArrowDownSLine, RiDeleteBin5Line } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsCollectionPlay, BsPencilSquare } from "react-icons/bs";
import Footer from "../Footer";
import { BiFilterAlt } from "react-icons/bi";
import { RxTimer } from "react-icons/rx";
import { Tooltip } from "@material-tailwind/react";
import { useUser } from "../../UserContext";
import {
  DELETE_SCREEN_BY_USERID,
  SELECT_BY_USER_SCREENDETAIL,
} from "../../Pages/Api";
import axios from "axios";

const Screens = ({ sidebarOpen, setSidebarOpen }) => {
  Screens.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);
  const [locCheckboxClick, setLocCheckboxClick] = useState(true);
  const [screenCheckboxClick, setScreenCheckboxClick] = useState(true);
  const [statusCheckboxClick, setStatusCheckboxClick] = useState(true);
  const [lastSeenCheckboxClick, setLastSeenCheckboxClick] = useState(true);
  const [nowPlayingCheckboxClick, setNowPlayingCheckboxClick] = useState(true);
  const [currScheduleCheckboxClick, setCurrScheduleCheckboxClick] =
    useState(true);
  const [tagsCheckboxClick, setTagsCheckboxClick] = useState(true);

  const [locContentVisible, setLocContentVisible] = useState(true);
  const [screenContentVisible, setScreenContentVisible] = useState(true);
  const [statusContentVisible, setStatusContentVisible] = useState(true);
  const [lastSeenContentVisible, setLastSeenContentVisible] = useState(true);
  const [nowPlayingContentVisible, setNowPlayingContentVisible] =
    useState(true);
  const [currScheduleContentVisible, setCurrScheduleContentVisible] =
    useState(true);
  const [tagsContentVisible, setTagsContentVisible] = useState(true);

  useEffect(() => {
    setLocContentVisible(locCheckboxClick);
    setScreenContentVisible(screenCheckboxClick);
    setStatusContentVisible(statusCheckboxClick);
    setLastSeenContentVisible(lastSeenCheckboxClick);
    setNowPlayingContentVisible(nowPlayingCheckboxClick);
    setCurrScheduleContentVisible(currScheduleCheckboxClick);
    setTagsContentVisible(tagsCheckboxClick);
  }, [
    locCheckboxClick,
    screenCheckboxClick,
    statusCheckboxClick,
    lastSeenCheckboxClick,
    nowPlayingCheckboxClick,
    currScheduleCheckboxClick,
    tagsCheckboxClick,
  ]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const { user } = useUser();
  const userId = user ? user.userID : null;
  const [screenData, setScreenData] = useState([]);
  useEffect(() => {
    axios
      .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${userId}`)
      .then((response) => {
        const fetchedData = response.data.data;
        setScreenData(fetchedData);
        const initialCheckboxes = {};
        fetchedData.forEach((screen) => {
          initialCheckboxes[screen.screenID] = false;
        });
        setScreenCheckboxes(initialCheckboxes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

  const handleScreenCheckboxChange = (screenID) => {
    const updatedCheckboxes = { ...screenCheckboxes };
    updatedCheckboxes[screenID] = !updatedCheckboxes[screenID];
    setScreenCheckboxes(updatedCheckboxes);

    // Check if any individual screen checkbox is unchecked
    const allChecked = Object.values(updatedCheckboxes).every(
      (isChecked) => isChecked
    );

    setSelectAllChecked(allChecked);
  };

  const handleSelectAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);

    // Set the state of all individual screen checkboxes
    const updatedCheckboxes = {};
    for (const screenID in screenCheckboxes) {
      updatedCheckboxes[screenID] = checked;
    }
    setScreenCheckboxes(updatedCheckboxes);
  };

  const handleDeleteAllScreen = () => {
    let data = JSON.stringify({
      userID: userId,
      operation: "DeleteUserIdScreenOtp",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: DELETE_SCREEN_BY_USERID,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        setScreenData([]);
        setSelectAllChecked(false);
        setScreenCheckboxes({});
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                    onClick={() => setMoreModal(!moreModal)}
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
                          checked={screenCheckboxClick}
                          onChange={() =>
                            setScreenCheckboxClick(!screenCheckboxClick)
                          }
                        />
                        Screen
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={statusCheckboxClick}
                          onChange={() =>
                            setStatusCheckboxClick(!statusCheckboxClick)
                          }
                        />
                        Status
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={lastSeenCheckboxClick}
                          onChange={() =>
                            setLastSeenCheckboxClick(!lastSeenCheckboxClick)
                          }
                        />
                        Last Seen
                      </li>
                      <li className="flex text-sm items-center mt-2">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={nowPlayingCheckboxClick}
                          onChange={() =>
                            setNowPlayingCheckboxClick(!nowPlayingCheckboxClick)
                          }
                        />
                        Now Playing
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={currScheduleCheckboxClick}
                          onChange={() =>
                            setCurrScheduleCheckboxClick(
                              !currScheduleCheckboxClick
                            )
                          }
                        />
                        Current Schedule
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={locCheckboxClick}
                          onChange={() =>
                            setLocCheckboxClick(!locCheckboxClick)
                          }
                        />
                        Google Location
                      </li>
                      <li className="flex text-sm items-center mt-2 ">
                        <input
                          type="checkbox"
                          className="mr-2 text-lg"
                          checked={tagsCheckboxClick}
                          onChange={() =>
                            setTagsCheckboxClick(!tagsCheckboxClick)
                          }
                        />
                        Tags
                      </li>
                      <li className="flex text-sm justify-end mt-2 ">
                        <button
                          className="bg-lightgray text-primary px-4 py-2 rounded-full"
                          onClick={() => setMoreModal(false)}
                        >
                          Update
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <Tooltip
                content="Delete"
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
                  onClick={handleDeleteAllScreen}
                  style={{ display: selectAllChecked ? "block" : "none" }}
                >
                  <RiDeleteBin5Line className="p-1 text-3xl hover:text-white text-primary" />
                </button>
              </Tooltip>
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
                  <input
                    type="checkbox"
                    className="h-7 w-7"
                    onChange={handleSelectAllCheckboxChange}
                    checked={selectAllChecked}
                  />
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
                  {screenContentVisible && (
                    <th className=" text-[#5A5881] text-base font-semibold">
                      <div className="flex  items-center ">
                        <SlScreenDesktop className="mr-2 text-xl" />
                        Screen
                      </div>
                    </th>
                  )}
                  {locContentVisible && (
                    <th className=" text-[#5A5881] text-base font-semibold">
                      <div className="flex  items-center justify-center ">
                        <HiOutlineLocationMarker className="mr-2 text-xl" />
                        Google Location
                      </div>
                    </th>
                  )}
                  {statusContentVisible && (
                    <th className=" text-[#5A5881] text-base font-semibold">
                      <div className="flex  items-center justify-center  mx-auto ">
                        <MdLiveTv className="mr-2 text-xl" />
                        status
                        <BiFilterAlt className="ml-1 text-lg" />
                      </div>
                    </th>
                  )}
                  {lastSeenContentVisible && (
                    <th className=" text-[#5A5881] text-base font-semibold">
                      <div className="flex  items-center justify-center   mx-auto">
                        <RxTimer className="mr-2 text-xl" />
                        Last Seen
                        <BiFilterAlt className="ml-1 text-lg" />
                      </div>
                    </th>
                  )}
                  {nowPlayingContentVisible && (
                    <th className=" text-[#5A5881] text-base font-semibold">
                      <div className="flex  items-center justify-center  mx-auto">
                        <BsCollectionPlay className="mr-2 text-xl" />
                        Now Playing
                      </div>
                    </th>
                  )}
                  {currScheduleContentVisible && (
                    <th className=" text-[#5A5881] text-base font-semibold">
                      <div className=" flex  items-center mx-auto justify-center">
                        <MdOutlineCalendarMonth className="mr-2 text-xl" />
                        Current Schedule
                      </div>
                    </th>
                  )}
                  {tagsContentVisible && (
                    <th className="text-[#5A5881] text-base font-semibold">
                      <div className=" flex mx-auto items-center justify-center">
                        <BsPencilSquare className="mr-2 text-xl" />
                        Tags
                        <BiFilterAlt className="ml-1 text-lg" />
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              {screenData.map((screen) => (
                <tbody key={screen.screenID}>
                  <tr className="border-b border-b-[#E4E6FF]">
                    {screenContentVisible && (
                      <td className="flex items-center ">
                        <input
                          type="checkbox"
                          className="mr-3"
                          onChange={() =>
                            handleScreenCheckboxChange(screen.screenID)
                          }
                          checked={screenCheckboxes[screen.screenID]}
                        />

                        <div>
                          <Link to="/screensplayer">{screen.screenName}</Link>
                          <button>
                            <MdOutlineModeEdit className="text-sm ml-2 hover:text-primary" />
                          </button>
                        </div>
                      </td>
                    )}
                    {locContentVisible && (
                      <td className="p-2 break-words w-[150px]">
                        {screen.googleLocation}
                      </td>
                    )}
                    {statusContentVisible && (
                      <td className="p-2 text-center">
                        <button className="rounded-full px-6 py-1 text-white text-center bg-[#3AB700]">
                          Live
                        </button>
                      </td>
                    )}
                    {lastSeenContentVisible && (
                      <td className="p-2 text-center">25 May 2023</td>
                    )}
                    {nowPlayingContentVisible && (
                      <td className="p-2 text-center">
                        <button
                          onClick={() => setShowAssetModal(true)}
                          className="flex  items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2  lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                        >
                          Asset
                          <AiOutlineCloudUpload className="ml-2 text-lg" />
                        </button>
                        {showAssetModal ? (
                          <>
                            <AssetModal setShowAssetModal={setShowAssetModal} />
                          </>
                        ) : null}
                      </td>
                    )}
                    {currScheduleContentVisible && (
                      <td className="break-words	w-[150px] p-2 text-center">
                        Schedule Name Till 28 June 2023
                      </td>
                    )}
                    {tagsContentVisible && (
                      <td className="p-2 text-center">{screen.tags}</td>
                    )}
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Screens;
