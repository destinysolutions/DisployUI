import React, { useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdOutlineGroups, MdSave } from "react-icons/md";
import { useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import SaveAssignScreenModal from "./SaveAssignScreenModal";
import Footer from "../Footer";
import dragon from "../../images/ScreenImg/dragon.svg";
import moment from "moment";
import { GoPencil } from "react-icons/go";
import toast from "react-hot-toast";
import { GET_ALL_FILES } from "../../Pages/Api";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoBarChartSharp } from "react-icons/io5";
import ReactTooltip from "react-tooltip";
import ReactPlayer from "react-player";

const AddWeatherSchedule = ({ sidebarOpen, setSidebarOpen }) => {
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();
  const currentDate = new Date();
  const [weatherScheduleName, setWeatherScheduleName] = useState(
    moment(currentDate).format("YYYY-MM-DD hh:mm")
  );
  const [edited, setEdited] = useState(false);
  const [searchAssest, setSearchAssest] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [assetPreview, setAssetPreview] = useState("");
  const [temperatureUnit, setTempratureUnit] = useState("C");
  const [isAbove, setIsAbove] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [temperature, setTemprature] = useState("");
  const [searchParams] = useSearchParams();
  const getWeatherScheduleId = searchParams.get("weatherScheduleId");

  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleOnSaveWeatherScheduleName = (e) => {
    if (!weatherScheduleName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter at least minimum 1 character.");
    }
    setEdited(false);
  };

  const AssetModelOpen = () => {
    axios
      .get(GET_ALL_FILES, { headers: { Authorization: authToken } })
      .then((response) => {
        const fetchedData = response.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(allAssets);
        setFilteredData(allAssets);
        setShowAssetModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnConfirm = () => {
    setShowAssetModal(false);
    setAssetPreviewPopup(false);
    setSearchAssest("");
  };

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleSearchAssest = (event, from) => {
    // setTags([])
    const searchQuery = event.target.value.toLowerCase();
    if (from === "asset") {
      setSearchAssest(searchQuery);
    }

    if (searchQuery === "") {
      setFilteredData(assetData);
    } else {
      if (from === "asset") {
        const filteredScreen = assetData.filter((entry) =>
          Object.values(entry).some((val) => {
            if (typeof val === "string") {
              const keyWords = searchQuery.split(" ");
              for (let i = 0; i < keyWords.length; i++) {
                return (
                  val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                  val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                  val.toLocaleLowerCase().includes(keyWords[i]) ||
                  val.toLocaleLowerCase().includes(searchQuery)
                );
              }
            }
          })
        );
        if (filteredScreen.length > 0) {
          toast.remove();
          setFilteredData(filteredScreen);
        } else {
          toast.remove();
          // toast.error("asset not found!!");
          setFilteredData([]);
        }
      }
    }
  };

  const handleSave = () => {
    let data = JSON.stringify({
      weatherSchedulingID: getWeatherScheduleId || 0,
      name: weatherScheduleName,
      mediaID: selectedAsset.assetID,
      mediaTypeID: 1,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      tempUnit: temperatureUnit,
      temperature: temperature,
      isAbove: isAbove,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/WeatherScheduling/AddorUpdateWeatherScheduling",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.status == 200) {
          toast.success(response?.data?.message);
          navigate("/weatherschedule");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectById = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/WeatherScheduling/GetWeatherScheduling?WeatherSchedulingID=${getWeatherScheduleId}`,
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        const fetchData = response?.data?.data?.model;
        setWeatherScheduleName(fetchData.name);
        setStartDate(moment(fetchData.startDate).format("YYYY-MM-DD"));
        setStartTime(fetchData.startTime);
        setEndDate(moment(fetchData.endDate).format("YYYY-MM-DD"));
        setEndTime(fetchData.endTime);
        setTempratureUnit(fetchData.tempUnit);
        setTemprature(fetchData.temperature);
        setIsAbove(fetchData.isAbove);
        let assetId = fetchData.mediaID;
        // console.log("asset", assetAllData);
        // const previousSelectedAsset = assetAllData.find(
        //   (asset) => asset?.assetID === assetId
        // );
        // console.log(previousSelectedAsset, "previousSelectedAsset");
        // setSelectedAsset(previousSelectedAsset);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    selectById();
  }, []);

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-24 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <div className="flex items-center">
              {edited ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full border border-primary rounded-md px-2 py-1"
                    placeholder="Enter schedule name"
                    value={weatherScheduleName}
                    onChange={(e) => {
                      setWeatherScheduleName(e.target.value);
                    }}
                  />
                  <button data-tip data-for="Save">
                    <MdSave
                      onClick={() => handleOnSaveWeatherScheduleName()}
                      className="min-w-[1.5rem] min-h-[1.5rem] cursor-pointer"
                    />
                    <ReactTooltip
                      id="Save"
                      place="bottom"
                      type="warning"
                      effect="float"
                    >
                      <span>Save</span>
                    </ReactTooltip>
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                    {weatherScheduleName}
                  </h1>
                  <button
                    onClick={() => setEdited(true)}
                    data-tip
                    data-for="Edit Weather Schedule Name"
                  >
                    <GoPencil className="ml-4 text-lg" />
                    <ReactTooltip
                      id="Edit Weather Schedule Name"
                      place="bottom"
                      type="warning"
                      effect="float"
                    >
                      <span>Edit Weather Schedule Name</span>
                    </ReactTooltip>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="lg:col-span-6 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5">
                <div className="flex items-center p-2">
                  <label className="text-base font-medium">
                    Asset / Playing :
                  </label>
                  <div className="p-2 ml-4">
                    <button
                      onClick={(e) => {
                        AssetModelOpen();
                        setSelectedAsset({
                          ...selectedAsset,
                          assetName: e.target.value,
                        });
                      }}
                      className="flex items-center border border-[#D5E3FF] rounded-full py-1.5 px-2 text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    >
                      <AiOutlineCloudUpload className="min-w-[1.5rem] min-h-[1.5rem]" />
                    </button>
                    {showAssetModal && (
                      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                        <div
                          ref={modalRef}
                          onClick={() =>
                            assetPreviewPopup && setAssetPreviewPopup(false)
                          }
                          className="relative w-[70vw] h-auto lg:p-6 md:p-6 sm:p-2 xs:p-1 flex items-start gap-2 bg-white rounded-2xl"
                        >
                          <div className="flex absolute top-0 left-0 h-fit w-full z-10 items-start justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black">
                            <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                              Add Media
                            </h3>
                            <button
                              className="p-1 text-xl"
                              onClick={() => {
                                setShowAssetModal(false);
                                setSearchAssest("");
                              }}
                            >
                              <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                          </div>
                          <div className="lg:flex mt-8 lg:flex-wrap lg:items-center  w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
                            <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-xl bg-white rounded-3xl flex-1">
                              <div>
                                <div className="flex flex-wrap w-full items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                                  <div className="mb-5 relative ">
                                    <AiOutlineSearch className="absolute top-2.5 left-2 w-5 h-5 z-10 text-gray" />
                                    <input
                                      type="text"
                                      placeholder="Search Assest"
                                      className="border border-primary rounded-full pl-8 py-2 search-user"
                                      value={searchAssest}
                                      onChange={(e) =>
                                        handleSearchAssest(e, "asset")
                                      }
                                    />
                                  </div>
                                  <button
                                    className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                                    onClick={() => {
                                      window.open(
                                        window.location.origin.concat(
                                          "/fileupload"
                                        )
                                      );
                                      localStorage.setItem(
                                        "isWindowClosed",
                                        "false"
                                      );
                                      // setShowAssetModal(false);
                                      setSearchAssest("");
                                    }}
                                  >
                                    Upload
                                  </button>
                                </div>
                                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover w-full addmedia-table">
                                  <table
                                    style={{
                                      borderCollapse: "separate",
                                      borderSpacing: " 0 10px",
                                    }}
                                    className="w-full"
                                  >
                                    <thead className="sticky top-0">
                                      <tr className="bg-lightgray">
                                        <th className="p-3 w-80 text-left">
                                          Media Name
                                        </th>
                                        <th className="p-3">Date Added</th>
                                        <th className="p-3">Size</th>
                                        <th className="p-3">Type</th>
                                      </tr>
                                    </thead>
                                    {filteredData.length > 0 ? (
                                      filteredData.map((asset) => (
                                        <tbody key={asset.assetID}>
                                          <tr
                                            className={`${
                                              selectedAsset?.assetID ===
                                              asset?.assetID
                                                ? "bg-[#f3c953]"
                                                : ""
                                            } border-b border-[#eee] `}
                                            onClick={() => {
                                              handleAssetAdd(asset);
                                              setAssetPreviewPopup(true);
                                            }}
                                          >
                                            <td className="p-3 text-left">
                                              {asset.assetName}
                                            </td>
                                            <td className="p-3 text-center">
                                              {moment(asset.createdDate).format(
                                                "YYYY-MM-DD hh:mm"
                                              )}
                                            </td>
                                            <td className="p-3 text-center">
                                              {asset.fileSize}
                                            </td>
                                            <td className="p-3 text-center">
                                              {asset.assetType}
                                            </td>
                                          </tr>
                                        </tbody>
                                      ))
                                    ) : (
                                      <div>No data Found</div>
                                    )}
                                  </table>
                                  {assetPreviewPopup && (
                                    <div className="fixed left-1/2 -translate-x-1/2 w-10/12 h-10/12 top-10 bg-black z-50 inset-0">
                                      <div className="p-1 rounded-full text-white bg-primary absolute -top-3 -right-3">
                                        <button
                                          className="text-xl"
                                          onClick={() =>
                                            setAssetPreviewPopup(false)
                                          }
                                        >
                                          <AiOutlineCloseCircle className="text-2xl" />
                                        </button>
                                      </div>
                                      <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[90%] w-[90%]">
                                        {assetPreview && (
                                          <>
                                            {assetPreview.assetType ===
                                              "OnlineImage" && (
                                              <div className="imagebox p-3">
                                                <img
                                                  src={
                                                    assetPreview.assetFolderPath
                                                  }
                                                  alt={assetPreview.assetName}
                                                  className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                                />
                                              </div>
                                            )}

                                            {assetPreview.assetType ===
                                              "OnlineVideo" && (
                                              <div className="relative videobox">
                                                <video
                                                  controls
                                                  className="w-full rounded-2xl h-full"
                                                >
                                                  <source
                                                    src={
                                                      assetPreview.assetFolderPath
                                                    }
                                                    type="video/mp4"
                                                  />
                                                  Your browser does not support
                                                  the video tag.
                                                </video>
                                              </div>
                                            )}
                                            {assetPreview.assetType ===
                                              "Image" && (
                                              <img
                                                src={
                                                  assetPreview.assetFolderPath
                                                }
                                                alt={assetPreview.assetName}
                                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                              />
                                            )}
                                            {assetPreview.assetType ===
                                              "Video" && (
                                              <video
                                                controls
                                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                              >
                                                <source
                                                  src={
                                                    assetPreview.assetFolderPath
                                                  }
                                                  type="video/mp4"
                                                />
                                                Your browser does not support
                                                the video tag.
                                              </video>
                                            )}
                                            {assetPreview.assetType ===
                                              "DOC" && (
                                              <a
                                                href={
                                                  assetPreview.assetFolderPath
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                              >
                                                {assetPreview.assetName}
                                              </a>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center p-5 w-full">
                              <p className="text-black">
                                Content will always be playing Confirm
                              </p>
                              <button
                                className="bg-primary text-white rounded-full px-5 py-2"
                                onClick={() => {
                                  handleOnConfirm();
                                }}
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:flex items-center p-2">
                  <label className="text-base font-medium">
                    Duration Date:
                  </label>
                  <div className=" p-2 ml-4">
                    <input
                      data-tip
                      data-for="Start Date"
                      type="date"
                      value={startDate}
                      // min={today}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-[#D5E3FF] px-3 py-2 w-full"
                    />
                    <ReactTooltip
                      id="Start Date"
                      place="bottom"
                      type="warning"
                      effect="float"
                    >
                      <span>Start Date</span>
                    </ReactTooltip>
                  </div>
                  <label className="text-base font-medium ml-3">To</label>
                  <div className="p-2 ml-4">
                    <input
                      data-tip
                      data-for="End Date"
                      type="date"
                      value={endDate}
                      // min={today}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-[#D5E3FF] px-3 py-2 w-full"
                    />
                    <ReactTooltip
                      id="End Date"
                      place="bottom"
                      type="warning"
                      effect="float"
                    >
                      <span>End Date</span>
                    </ReactTooltip>
                  </div>
                </div>
                <div className="lg:flex items-center p-2">
                  <label className="text-base font-medium">
                    Duration Time:
                  </label>
                  <div className="p-2 ml-4">
                    <input
                      data-tip
                      data-for="Start Time"
                      type="time"
                      value={startTime}
                      // min={today}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border border-[#D5E3FF] px-3 py-2 w-full"
                    />
                    <ReactTooltip
                      id="Start Time"
                      place="bottom"
                      type="warning"
                      effect="float"
                    >
                      <span>Start Time</span>
                    </ReactTooltip>
                  </div>
                  <label className="text-base font-medium ml-3">To</label>
                  <div className="p-2 ml-4">
                    <input
                      data-tip
                      data-for="End Time"
                      type="time"
                      value={endTime}
                      // min={today}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border border-[#D5E3FF] px-3 py-2 w-full"
                    />
                    <ReactTooltip
                      id="End Time"
                      place="bottom"
                      type="warning"
                      effect="float"
                    >
                      <span>End Time</span>
                    </ReactTooltip>
                  </div>
                </div>
                <div className="flex items-center p-2">
                  <label className="text-base font-medium">
                    Temperature Unit :
                  </label>
                  <div className="flex items-center p-2">
                    <div className="ml-2 flex items-center">
                      <input
                        type="radio"
                        value={temperatureUnit}
                        checked={temperatureUnit === "C"}
                        name="Cel"
                        onChange={() => setTempratureUnit("C")}
                      />
                      <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                        ℃
                      </label>
                    </div>
                    <div className="ml-3 flex items-center">
                      <input
                        type="radio"
                        value={temperatureUnit}
                        checked={temperatureUnit === "F"}
                        name="Cel"
                        onChange={() => setTempratureUnit("F")}
                      />
                      <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                        ℉
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center p-2">
                    <div className="flex">
                      <input
                        type="radio"
                        name="Above_Below"
                        value={isAbove}
                        checked={isAbove == true}
                        onChange={() => setIsAbove(true)}
                      />
                      <label className="ml-3 lg:text-base md:text-base sm:text-xs xs:text-xs font-medium">
                        play When temp goes above:
                      </label>
                    </div>

                    {isAbove && (
                      <div className="border border-[#D5E3FF] p-2 ml-8">
                        <input
                          type="number"
                          value={temperature}
                          onChange={(e) => {
                            setTemprature(e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center p-2">
                    <div className="flex">
                      <input
                        type="radio"
                        name="Above_Below"
                        onChange={() => setIsAbove(false)}
                        checked={isAbove == false}
                        value={isAbove}
                      />
                      <label className="ml-3 lg:text-base md:text-base sm:text-xs xs:text-xs font-medium">
                        play When temp goes Below:
                      </label>
                    </div>

                    {!isAbove && (
                      <div className="border border-[#D5E3FF] p-2 ml-9 ">
                        <input
                          type="number"
                          value={temperature}
                          onChange={(e) => {
                            setTemprature(e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg flex items-center">
                <div>
                  <div className="w-full">
                    {selectedAsset &&
                      (Object.values(selectedAsset).includes("Video") ||
                        Object.values(selectedAsset).includes(
                          "OnlineVideo"
                        )) && (
                        <ReactPlayer
                          url={selectedAsset?.assetFolderPath}
                          className="w-full"
                          controls={true}
                          playing={true}
                        />
                      )}

                    {selectedAsset &&
                      (Object.values(selectedAsset).includes("OnlineImage") ||
                        Object.values(selectedAsset).includes("Image")) && (
                        <img
                          src={selectedAsset?.assetFolderPath}
                          alt="Media"
                          className="w-full"
                        />
                      )}
                    {!selectedAsset && (
                      <img src={dragon} alt="Default" className="w-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-9">
              <Link to="/weatherschedule">
                <button className="border-2 border-primary px-5 py-2 rounded-full">
                  Cancel
                </button>
              </Link>
              <button
                className="border-2 border-primary px-5 py-2 rounded-full ml-3"
                onClick={() => handleSave()}
              >
                Save
              </button>
              {/* </Link> */}
              <button
                className="border-2 border-primary px-5 py-2 rounded-full ml-3"
                onClick={() => setSelectScreenModal(true)}
              >
                Save & Assign screen
              </button>
              {selectScreenModal && (
                <SaveAssignScreenModal
                  setSelectScreenModal={setSelectScreenModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddWeatherSchedule;
