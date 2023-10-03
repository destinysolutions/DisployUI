import { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import "../../../Styles/screen.css";
import { GrScheduleNew } from "react-icons/gr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../../Footer";
import { useEffect } from "react";
import axios from "axios";
import {
  GET_ALL_FILES,
  GET_ALL_SCREEN_ORIENTATION,
  GET_ALL_SCREEN_RESOLUTION,
  GET_SCREEN_TYPE,
  GET_TIMEZONE,
  UPDATE_NEW_SCREEN,
} from "../../../Pages/Api";
import {
  AiOutlineAppstoreAdd,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { BiAnchor } from "react-icons/bi";
import moment from "moment";
import { BsFillInfoCircleFill } from "react-icons/bs";

const NewScreenDetail = ({ sidebarOpen, setSidebarOpen }) => {
  NewScreenDetail.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [tagName, setTagName] = useState("");

  const handleTagNameChange = (event) => {
    setTagName(event.target.value);
  };

  const [getSelectedScreenTypeOption, setGetSelectedScreenTypeOption] =
    useState([]);
  const [getTimezone, setTimezone] = useState([]);
  const [selectedTimezoneName, setSelectedTimezoneName] = useState("");
  const [getScreenOrientation, setScreenOrientation] = useState([]);
  const [getScreenResolution, setScreenResolution] = useState([]);
  const [selectedScreenTypeOption, setSelectedScreenTypeOption] = useState("");
  const [selectScreenOrientation, setSelectScreenOrientation] = useState();
  const [selectScreenResolution, setSelectScreenResolution] = useState();

  function handleScreenOrientationRadio(e, optionId) {
    setSelectScreenOrientation(optionId);
  }

  function handleScreenResolutionRadio(e, optionId) {
    setSelectScreenResolution(optionId);
  }

  const handleOptionChange = (e) => {
    setSelectedScreenTypeOption(e.target.value);
  };

  // Trigger the file input click event programmatically
  const handleIconClick = () => {
    document.getElementById("file-input").click();
  };

  const [showAssetModal, setShowAssetModal] = useState(false);
  const location = useLocation();
  const otpData = location?.state?.otpData || null;
  const message = location?.state?.message || null;
  const [otpMessageVisible, setOTPMessageVisible] = useState(false);

  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [assetData, setAssetData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetPreview, setAssetPreview] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [screenName, setScreenName] = useState("");

  useEffect(() => {
    // Define an array of axios requests
    const axiosRequests = [
      axios.get(GET_ALL_FILES),
      axios.get(GET_SCREEN_TYPE),
      axios.get(GET_ALL_SCREEN_ORIENTATION),
      axios.get(GET_ALL_SCREEN_RESOLUTION),
      axios.get(GET_TIMEZONE),
    ];

    // Use Promise.all to send all requests concurrently
    Promise.all(axiosRequests)
      .then((responses) => {
        const [
          filesResponse,
          screenTypeResponse,
          screenOrientationResponse,
          screenResolutionResponse,
          timezoneResponse,
        ] = responses;

        // Process each response and set state accordingly
        const fetchedData = filesResponse.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];

        setAssetData(allAssets);
        setGetSelectedScreenTypeOption(screenTypeResponse.data.data);
        setScreenOrientation(screenOrientationResponse.data.data);
        setScreenResolution(screenResolutionResponse.data.data);
        setTimezone(timezoneResponse.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const [searchAsset, setSearchAsset] = useState("");
  const handleFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setAssetData(assetData);
    } else {
      const filteredData = assetData.filter((item) => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        return itemName.includes(searchQuery);
      });
      setAssetData(filteredData);
    }
  };
  const history = useNavigate();
  const [screenNameError, setScreenNameError] = useState("");
  const handleScreenDetail = () => {
    if (screenName.trim() === "") {
      // If screenName is empty, set an error message
      setScreenNameError("Screen name is required");
    } else {
      // If screenName is not empty, clear any previous error message
      setScreenNameError("");

      // Continue with the API call or other logic here
      let getScreenID = otpData.map((item) => item.ScreenID);
      let screen_id = getScreenID[0];

      let data = JSON.stringify({
        screenID: screen_id,
        screenOrientation: selectScreenOrientation,
        screenResolution: selectScreenResolution,
        timeZone: selectedTimezoneName,
        screenType: selectedScreenTypeOption,
        tags: tagName,
        screenName: screenName,
        moduleID: selectedAsset.id,
        operation: "Update",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: UPDATE_NEW_SCREEN,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.status === 200) {
            history("/screens");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {otpMessageVisible && (
        <div
          className="bg-[#fff2cd] px-5 py-3 border-b-2 border-SlateBlue shadow-md"
          style={{
            position: "fixed",
            top: "16px",
            right: "20px",
            zIndex: "999999",
          }}
        >
          <div className="flex text-SlateBlue  text-base font-normal items-center relative">
            <BsFillInfoCircleFill className="mr-1" />
            {message}
            <button
              className="absolute top-[-26px] right-[-26px] bg-white rounded-full p-1 "
              onClick={() => setOTPMessageVisible(false)}
            >
              <AiOutlineClose className="text-xl  text-SlateBlue " />
            </button>
          </div>
        </div>
      )}

      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4">
              New Screens Details
            </h1>
            <div className="lg:flex md:flex sm:block">
              <button className="flex align-middle border-primary items-center border rounded-full px-8 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Edit
              </button>
            </div>
          </div>
          <div className="shadow-md lg:p-5  md:p-5 sm:p:2 rounded-md bg-white flex items-center justify-between mt-7">
            <form className="">
              <table className="screen-details" cellPadding={10}>
                {otpData.map((otpData) => (
                  <tbody key={otpData.ScreenID}>
                    <tr>
                      <td>
                        <label className="text-[#001737] lg:text-lg md:text-lg font-medium sm:font-base xs:font-base mb-1 md:mb-0">
                          Screen Name:
                        </label>
                      </td>
                      <td>
                        <input
                          className="bg-gray-200 appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3"
                          type="text"
                          placeholder="Screen Name"
                          onChange={(e) => {
                            setScreenName(e.target.value);
                            setScreenNameError("");
                          }}
                        />
                        {screenNameError && (
                          <div className="text-red">{screenNameError}</div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Google Location:
                        </label>
                      </td>
                      <td>
                        <h4 className="bg-gray-200 appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3">
                          {otpData.GoogleLocation}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Time Zone:
                        </label>
                      </td>
                      <td>
                        <select
                          className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedTimezoneName}
                          onChange={(e) =>
                            setSelectedTimezoneName(e.target.value)
                          }
                        >
                          {getTimezone.map((timezone) => (
                            <option
                              value={timezone.timeZoneName}
                              key={timezone.timeZoneId}
                            >
                              {timezone.timeZoneName}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Screen Orientation:
                        </label>
                      </td>
                      <td>
                        <div className="border border-[#D5E3FF] rounded w-full px-3 py-2">
                          {getScreenOrientation.map((option) => (
                            <div
                              key={option.screenOrientationId}
                              className="flex"
                            >
                              <input
                                type="radio"
                                value={option.screenOrientationId}
                                checked={
                                  option.screenOrientationId ===
                                  selectScreenOrientation
                                }
                                onChange={(e) =>
                                  handleScreenOrientationRadio(
                                    e,
                                    option.screenOrientationId
                                  )
                                }
                              />
                              <label className="ml-1 mr-4 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                {option.screenOrientation}
                              </label>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Screen Resolution:
                        </label>
                      </td>
                      <td>
                        <div className="border border-[#D5E3FF] rounded w-full px-3 py-2">
                          {getScreenResolution.map((option) => (
                            <>
                              <input
                                type="radio"
                                value={option.screenResolutionId}
                                checked={
                                  option.screenResolutionId ===
                                  selectScreenResolution
                                }
                                onChange={(e) =>
                                  handleScreenResolutionRadio(
                                    e,
                                    option.screenResolutionId
                                  )
                                }
                              />
                              <label className="ml-1 mr-4 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                {option.screenResolutionName}
                              </label>
                            </>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Type:
                        </label>
                      </td>
                      <td>
                        <select
                          className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedScreenTypeOption}
                          onChange={handleOptionChange}
                        >
                          <option value="">Select Type</option>
                          {getSelectedScreenTypeOption.map((option) => (
                            <option
                              key={option.screenTypeId}
                              value={option.screenTypeId}
                            >
                              {option.screenTypeName}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {selectedScreenTypeOption === "1" && (
                      <>
                        <tr>
                          <td></td>
                          <td className="relative">
                            <input
                              className=" px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={selectedAsset.name}
                              placeholder="Asset"
                            />

                            {selectedAsset.name ? null : (
                              <>
                                <div className="absolute left-[10%] bottom-[-3px]  text-[35px]  z-20">
                                  <img
                                    src="/DisployImg/Polygon.svg"
                                    alt="notification"
                                    className="cursor-pointer assestPopup"
                                  />
                                </div>
                                <div className="absolute left-[2%] bottom-[-74px] bg-white rounded-lg border border-[#635b5b] shadow-lg z-10  pr-16">
                                  <div
                                    className="text-sm mb-1 mt-2 ml-3 cursor-pointer"
                                    onClick={() => setShowAssetModal(true)}
                                  >
                                    Browse
                                  </div>

                                  <div className="text-sm mb-3 mt-3 ml-3 cursor-pointer">
                                    Default Assets
                                  </div>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td>
                        {showAssetModal ? (
                          <>
                            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                              <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                                  <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                                    <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                                      Set Content to Add Media
                                    </h3>
                                    <button
                                      className="p-1 text-xl"
                                      onClick={() => setShowAssetModal(false)}
                                    >
                                      <AiOutlineCloseCircle className="text-2xl" />
                                    </button>
                                  </div>

                                  <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto">
                                    <div className="bg-white rounded-[30px]">
                                      <div className="">
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
                                                className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                  popupActiveTab === 1
                                                    ? "active"
                                                    : ""
                                                }`}
                                                // onClick={() => handleTabClick(1)}
                                              >
                                                <span
                                                  className={`p-1 rounded ${
                                                    popupActiveTab === 1
                                                      ? "bg-primary text-white"
                                                      : "bg-lightgray"
                                                  } `}
                                                >
                                                  <IoBarChartSharp size={15} />
                                                </span>
                                                Assets
                                              </button>
                                              <button
                                                type="button"
                                                className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                  popupActiveTab === 2
                                                    ? "active"
                                                    : ""
                                                }`}
                                                //onClick={() => handleTabClick(2)}
                                              >
                                                <span
                                                  className={`p-1 rounded ${
                                                    popupActiveTab === 2
                                                      ? "bg-primary text-white"
                                                      : "bg-lightgray"
                                                  } `}
                                                >
                                                  <RiPlayListFill size={15} />
                                                </span>
                                                Playlist
                                              </button>
                                              <button
                                                type="button"
                                                className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                  popupActiveTab === 3
                                                    ? "active"
                                                    : ""
                                                }`}
                                                // onClick={() => handleTabClick(3)}
                                              >
                                                <span
                                                  className={`p-1 rounded ${
                                                    popupActiveTab === 3
                                                      ? "bg-primary text-white"
                                                      : "bg-lightgray"
                                                  } `}
                                                >
                                                  <BiAnchor size={15} />
                                                </span>
                                                Disploy Studio
                                              </button>
                                              <button
                                                type="button"
                                                className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                                                  popupActiveTab === 4
                                                    ? "active"
                                                    : ""
                                                }`}
                                                // onClick={() => handleTabClick(4)}
                                              >
                                                <span
                                                  className={`p-1 rounded ${
                                                    popupActiveTab === 4
                                                      ? "bg-primary text-white"
                                                      : "bg-lightgray"
                                                  } `}
                                                >
                                                  <AiOutlineAppstoreAdd
                                                    size={15}
                                                  />
                                                </span>
                                                Apps
                                              </button>
                                            </nav>
                                          </div>

                                          <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                                            <div
                                              className={
                                                popupActiveTab === 1
                                                  ? ""
                                                  : "hidden"
                                              }
                                            >
                                              <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                                                <div className="mb-5 relative ">
                                                  <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                                                  <input
                                                    type="text"
                                                    placeholder=" Search by Name"
                                                    className="border border-primary rounded-full px-7 py-2 search-user"
                                                    value={searchAsset}
                                                    onChange={handleFilter}
                                                  />
                                                </div>
                                                <Link to="/fileupload">
                                                  <button className="flex align-middle border-primary items-center border rounded-full px-8 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                                    Upload
                                                  </button>
                                                </Link>
                                              </div>
                                              <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover">
                                                <table
                                                  style={{
                                                    borderCollapse: "separate",
                                                    borderSpacing: " 0 10px",
                                                  }}
                                                >
                                                  <thead className="sticky top-0">
                                                    <tr className="bg-lightgray">
                                                      <th className="p-3 w-80 text-left">
                                                        Media Name
                                                      </th>
                                                      <th className="">
                                                        Date Added
                                                      </th>
                                                      <th className="p-3">
                                                        Size
                                                      </th>
                                                      <th className="p-3">
                                                        Type
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  {assetData.map((asset) => (
                                                    <tbody key={asset.id}>
                                                      <tr
                                                        className={`${
                                                          selectedAsset ===
                                                          asset
                                                            ? "bg-[#f3c953]"
                                                            : ""
                                                        } border-b border-[#eee] `}
                                                        onClick={() => {
                                                          handleAssetAdd(asset);
                                                          setAssetPreviewPopup(
                                                            true
                                                          );
                                                        }}
                                                      >
                                                        <td className="p-3">
                                                          {asset.name}
                                                        </td>
                                                        <td className="p-3">
                                                          {moment(
                                                            asset.createdDate
                                                          ).format(
                                                            "YYYY-MM-DD"
                                                          )}
                                                        </td>
                                                        <td className="p-3">
                                                          {asset.fileSize}
                                                        </td>
                                                        <td className="p-3">
                                                          {asset.categorieType}
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  ))}
                                                </table>
                                                {assetPreviewPopup && (
                                                  <>
                                                    <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
                                                      <div className="fixed top-1/2 left-1/2 asset-preview-popup">
                                                        <div className="border-0 rounded-lg shadow-lg relative w-full bg-black outline-none focus:outline-none">
                                                          <div className="p-1  rounded-full text-white bg-primary absolute top-[-15px] right-[-16px]">
                                                            <button
                                                              className="p-1 text-xl"
                                                              onClick={() =>
                                                                setAssetPreviewPopup(
                                                                  false
                                                                )
                                                              }
                                                            >
                                                              <AiOutlineCloseCircle className="text-2xl" />
                                                            </button>
                                                          </div>
                                                          <div className="p-3 flex justify-center  items-center min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px]">
                                                            {assetPreview && (
                                                              <>
                                                                {assetPreview.categorieType ===
                                                                  "OnlineImage" && (
                                                                  <div className="imagebox relative p-3">
                                                                    <img
                                                                      src={
                                                                        assetPreview.fileType
                                                                      }
                                                                      alt={
                                                                        assetPreview.name
                                                                      }
                                                                      className="rounded-2xl"
                                                                    />
                                                                  </div>
                                                                )}

                                                                {assetPreview.categorieType ===
                                                                  "OnlineVideo" && (
                                                                  <div className="relative videobox">
                                                                    <video
                                                                      controls
                                                                      className="w-full rounded-2xl relative"
                                                                    >
                                                                      <source
                                                                        src={
                                                                          assetPreview.fileType
                                                                        }
                                                                        type="video/mp4"
                                                                      />
                                                                      Your
                                                                      browser
                                                                      does not
                                                                      support
                                                                      the video
                                                                      tag.
                                                                    </video>
                                                                  </div>
                                                                )}
                                                                {assetPreview.categorieType ===
                                                                  "Image" && (
                                                                  <img
                                                                    src={
                                                                      assetPreview.fileType
                                                                    }
                                                                    alt={
                                                                      assetPreview.name
                                                                    }
                                                                    className="imagebox relative flex justify-center  items-center min-w-[250px] max-w-[250px] min-h-[250px] max-h-[250px]"
                                                                  />
                                                                )}
                                                                {assetPreview.categorieType ===
                                                                  "Video" && (
                                                                  <video
                                                                    controls
                                                                    className="w-full rounded-2xl relative h-56"
                                                                  >
                                                                    <source
                                                                      src={
                                                                        assetPreview.fileType
                                                                      }
                                                                      type="video/mp4"
                                                                    />
                                                                    Your browser
                                                                    does not
                                                                    support the
                                                                    video tag.
                                                                  </video>
                                                                )}
                                                                {assetPreview.categorieType ===
                                                                  "DOC" && (
                                                                  <a
                                                                    href={
                                                                      assetPreview.fileType
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                  >
                                                                    {
                                                                      assetPreview.name
                                                                    }
                                                                  </a>
                                                                )}
                                                              </>
                                                            )}
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
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center p-5">
                                    <p className="text-black">
                                      Content will always be playing Confirm
                                    </p>
                                    <button
                                      className="bg-primary text-white rounded-full px-5 py-2 hover:bg-SlateBlue"
                                      onClick={() => setShowAssetModal(false)}
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </td>
                    </tr>
                    {selectedScreenTypeOption === "Playlist" && (
                      <>
                        <tr>
                          <td></td>
                          <td>
                            <div className="flex">
                              <span
                                className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onClick={handleIconClick}
                              >
                                Set a Playlist
                              </span>
                              <input
                                id="file-input"
                                type="file"
                                style={{ display: "none" }}
                              />
                              <Link to="/myplaylist">
                                <div className="flex items-center ml-5">
                                  <span className="bg-lightgray p-2 rounded">
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 15 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0.961295 0.0665965C0.610654 0.137625 0.274179 0.398062 0.0970872 0.736291L0.015625 0.89526V3.29669C0.015625 5.69136 0.015625 5.69812 0.0935454 5.85709C0.206884 6.09724 0.458355 6.334 0.716909 6.44561C1.02151 6.5809 1.41111 6.58429 1.698 6.45576C1.99905 6.32047 5.27879 4.22006 5.40984 4.078C5.81715 3.63492 5.82424 2.98552 5.43109 2.53567C5.32484 2.41729 1.91405 0.228947 1.68029 0.13086C1.50674 0.0564494 1.16318 0.0260091 0.961295 0.0665965Z"
                                        fill="#41479B"
                                      />
                                      <path
                                        d="M7.25131 0.0883092C7.08502 0.17676 6.95765 0.417348 6.97888 0.601327C7.00011 0.767615 7.08148 0.891447 7.22654 0.979898C7.33622 1.04712 7.43529 1.05066 11.0087 1.05066H14.6741L14.7874 0.95867C15.0846 0.70393 15.0669 0.289978 14.7449 0.0953853C14.6317 0.0246242 14.5574 0.0246242 11.0016 0.0246242C7.55912 0.0246242 7.36806 0.0281622 7.25131 0.0883092Z"
                                        fill="#41479B"
                                      />
                                      <path
                                        d="M7.25126 2.87848C7.08851 2.95985 6.9576 3.20398 6.97883 3.39149C7.00006 3.55778 7.08143 3.68161 7.22649 3.7736C7.33617 3.84083 7.42108 3.84083 11.0264 3.83375L14.7095 3.82314L14.805 3.73468C15.0845 3.47287 15.0562 3.07661 14.7448 2.88555C14.6316 2.81479 14.5573 2.81479 11.0016 2.81479C7.61921 2.81479 7.36801 2.81833 7.25126 2.87848Z"
                                        fill="#41479B"
                                      />
                                      <path
                                        d="M7.23694 5.669C6.89729 5.8742 6.9079 6.3943 7.25463 6.57474C7.34308 6.62073 7.84548 6.62781 10.9943 6.62781C14.5607 6.62781 14.635 6.62781 14.7482 6.55705C15.0843 6.35184 15.0843 5.87774 14.7482 5.67253C14.635 5.60177 14.5607 5.60177 10.9873 5.60177C7.49875 5.60177 7.33954 5.60531 7.23694 5.669Z"
                                        fill="#41479B"
                                      />
                                      <path
                                        d="M0.255992 8.46306C-0.0801225 8.66827 -0.0801225 9.14237 0.255992 9.34757C0.372748 9.41833 0.450585 9.41833 7.50192 9.41833C14.5533 9.41833 14.6311 9.41833 14.7479 9.34757C15.084 9.14237 15.084 8.66827 14.7479 8.46306C14.6311 8.3923 14.5533 8.3923 7.50192 8.3923C0.450585 8.3923 0.372748 8.3923 0.255992 8.46306Z"
                                        fill="#41479B"
                                      />
                                      <path
                                        d="M0.319748 11.2081C0.291443 11.2187 0.227758 11.2612 0.185302 11.3036C-0.0835903 11.5477 -0.0482098 11.9511 0.256063 12.1386C0.36928 12.2094 0.44358 12.2094 4.70693 12.2094C8.97028 12.2094 9.04458 12.2094 9.1578 12.1386C9.34178 12.0254 9.41962 11.8697 9.40193 11.6468C9.39131 11.477 9.37362 11.4416 9.24271 11.3178L9.09765 11.1833L4.73524 11.1869C2.33644 11.1869 0.348052 11.1975 0.319748 11.2081Z"
                                        fill="#41479B"
                                      />
                                      <path
                                        d="M12.758 11.3597C12.5549 11.494 12.5205 11.6111 12.5205 12.1483V12.6235H12.0489C11.6668 12.6235 11.5497 12.6338 11.4534 12.6854C11.0781 12.8714 11.085 13.4189 11.4637 13.5876C11.5807 13.6427 11.6909 13.6565 12.0661 13.6565H12.5205V14.1317C12.5205 14.6482 12.5549 14.7722 12.7339 14.9065C12.9542 15.0683 13.3122 14.9994 13.4568 14.7618C13.5291 14.6517 13.536 14.5862 13.5463 14.1489L13.5601 13.6634L14.0454 13.6496C14.4826 13.6393 14.548 13.6324 14.6582 13.5601C14.8957 13.4155 14.9645 13.0573 14.8027 12.837C14.6685 12.6579 14.5446 12.6235 14.0282 12.6235H13.5532V12.1655C13.5532 11.6386 13.4981 11.4699 13.3053 11.3494C13.147 11.253 12.9095 11.2564 12.758 11.3597Z"
                                        fill="#41479B"
                                      />
                                      <path
                                        d="M0.211504 14.0658C-0.0856924 14.3206 -0.0680021 14.7345 0.253961 14.9291C0.367178 14.9999 0.441477 14.9999 4.70483 14.9999C8.96818 14.9999 9.04248 14.9999 9.1557 14.9291C9.4812 14.731 9.49535 14.2392 9.18046 14.0446C9.06725 13.9738 9.01417 13.9738 4.69421 13.9738H0.324722L0.211504 14.0658Z"
                                        fill="#41479B"
                                      />
                                    </svg>
                                  </span>
                                </div>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                    {selectedScreenTypeOption === "Schedule" && (
                      <>
                        <tr>
                          <td></td>
                          <td>
                            <div className="flex">
                              <span className="px-2 py-2 border border-[#D5E3FF] bg-white rounded w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                Set a schedule
                              </span>
                              <div className="flex items-center ml-5">
                                <span className="bg-lightgray p-2 rounded">
                                  <GrScheduleNew size={20} />
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}

                    <tr>
                      <td>
                        <label className=" text-[#001737]  lg:text-lg md:text-lg font-medium sm:font-base xs:font-base  mb-1 md:mb-0">
                          Tags:
                        </label>
                      </td>
                      <td>
                        <div className="md:w-full">
                          <div className="relative flex justify-end">
                            <input
                              type="text"
                              className="border border-[#D5E3FF] rounded w-full px-2 py-2"
                              placeholder="Enter tag..."
                              value={tagName}
                              onChange={handleTagNameChange}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className=" lg:block md:block sm:hidden"></td>
                      <td>
                        <button
                          className="shadow bg-primary focus:shadow-outline focus:outline-none text-white font-medium py-2 px-9 rounded-full hover:bg-SlateBlue"
                          type="button"
                          onClick={handleScreenDetail}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewScreenDetail;
