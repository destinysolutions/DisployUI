import React, { useEffect } from "react";
import { useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  GET_ALL_FILES,
  GET_DEFAULT_ASSET,
  GET_EMERGENCY_ASSET,
  SAVE_DEFAULT_ASSET,
  SAVE_EMERGENCY_ASSET,
} from "../../Pages/Api";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { useRef } from "react";
import toast from "react-hot-toast";
import { IoBarChartSharp } from "react-icons/io5";
import PreviewAssets from "../Common/PreviewAssets";
import { socket } from "../../App";
import DefaultMediaAsset from "./DefaultMediaAsset";
const Defaultmedia = ({ permissions }) => {
  const [mediaTabs, setMediaTabs] = useState(1);
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [assetAllData, setAssetAllData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({
    assetName: "",
    assetID: "",
  });
  const [selectedEmergencyAsset, setSelectedEmergencyAsset] = useState({
    assetName: "",
    assetID: "",
  });
  const [assetName, setAssetName] = useState("");
  const [emergencyassetName, setEmergencyAssetName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [emergencyfilePath, setEmergencyFilePath] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [searchAssest, setSearchAssest] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [assetPreview, setAssetPreview] = useState("");
  const modalRef = useRef(null);

  function updateMediaTab(id) {
    setMediaTabs(id);
    setSearchAssest("");
    setSelectedAsset({
      assetName: "",
      assetID: "",
    });
  }

  const AssetModelOpen = () => {
    axios
      .get(GET_ALL_FILES, { headers: { Authorization: authToken } })
      .then((response) => {
        setShowAssetModal(true);
        const fetchedData = response.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          // ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(allAssets);
        setAssetAllData(allAssets);
        setFilteredData(allAssets);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAssetAdd = (asset) => {
    if (mediaTabs === 1) {
      setSelectedAsset(asset);
    } else {
      setSelectedEmergencyAsset(asset);
    }
    setAssetPreview(asset);
  };
  let viewerSrc = "";

  if (
    assetPreview?.fileExtention === ".pdf" ||
    assetPreview?.fileExtention === ".txt"
  ) {
    viewerSrc = assetPreview?.assetFolderPath;
  } else if (assetPreview?.fileExtention === ".csv") {
    viewerSrc = `https://docs.google.com/gview?url=${assetPreview?.assetFolderPath}&embedded=true`;
  } else if (
    assetPreview?.fileExtention === ".pptx" ||
    assetPreview?.fileExtention === ".ppt" ||
    assetPreview?.fileExtention === ".docx" ||
    assetPreview?.fileExtention === ".doc" ||
    assetPreview?.fileExtention === ".xlsx" ||
    assetPreview?.fileExtention === ".xls"
  ) {
    // viewerSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${assetPreview?.assetFolderPath}`;
    viewerSrc = `https://docs.google.com/viewer?url=${assetPreview?.assetFolderPath}&embedded=true`

  }

  const handleGetAsset = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${GET_DEFAULT_ASSET}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.data !== null) {
          setAssetName(response.data.data.assetName);
          setSelectedAsset({
            assetName: response.data.data.assetName,
            assetID: response.data.data.assetID,
          });
          setFilePath(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetEmergencyAsset = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${GET_EMERGENCY_ASSET}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.data !== null) {
          setEmergencyAssetName(response.data.data.assetName);
          setSelectedEmergencyAsset({
            assetName: response.data.data.assetName,
            assetID: response.data.data.assetID,
          });
          setEmergencyFilePath(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeMedia = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${SAVE_DEFAULT_ASSET}?AssetID=${selectedAsset.assetID}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        handleGetAsset();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeEmergencyMedia = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${SAVE_EMERGENCY_ASSET}?AssetID=${selectedEmergencyAsset.assetID}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const Params = {
          assetFolderPath: response?.data?.data?.assetFolderPath,
          assetType: response?.data?.data?.assetType,
        };
        socket.emit("EmergencyAsset", Params);
        handleGetEmergencyAsset();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnConfirm = () => {
    setShowAssetModal(false);
    // handleAssetUpdate();
    setAssetPreviewPopup(false);
    if (mediaTabs === 1) {
      handleChangeMedia();
    } else {
      handleChangeEmergencyMedia();
    }
    setSearchAssest("");
  };

  useEffect(() => {
    handleGetAsset();
    handleGetEmergencyAsset();
  }, []);

  const isVideo = filePath && /\.(mp4|webm|ogg)$/i.test(filePath);

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        // window.document.body.style.overflow = "unset";
        setShowAssetModal(false);
        setFilteredData([]);
        setAssetPreviewPopup(false);
        setSearchAssest("");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowAssetModal(false);
    setAssetPreviewPopup(false);
    setSearchAssest("");
    setFilteredData([]);
  }

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

  useEffect(() => {
    const handleStorageChange = () => {
      const isClosed = localStorage.getItem("isWindowClosed");
      if (isClosed === "true") {
        AssetModelOpen();
        localStorage.setItem("isWindowClosed", "false");
        // window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <div className="Tabbutton">
        <ul className="flex items-center w-full">
          <li
            className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium w-1/2 text-center"
            onClick={() => updateMediaTab(1)}
          >
            <button
              className={
                mediaTabs === 1
                  ? "Mediatabshow mediatabactive rounded-tl-md "
                  : "Mediatab rounded-tl-md"
              }
            >
              Default Media
            </button>
          </li>
          <li
            className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium w-1/2 text-center"
            onClick={() => updateMediaTab(2)}
          >
            <button
              className={
                mediaTabs === 2
                  ? "Mediatabshow mediatabactive rounded-tr-md "
                  : "Mediatab rounded-tr-md"
              }
            >
              Emergency Media
            </button>
          </li>
        </ul>
      </div>
      {mediaTabs === 1 && (
        <div className="grid lg:grid-cols-2 w-full h-auto place-items-center items-center p-6 ">
          <div className="w-full">
            <div className="text-center mb-5 flex-wrap">
              <h6 className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                Asset / Playing:
              </h6>
              {permissions.isSave ? (
                <p className="pr-5">
                  <button
                    onClick={(e) => {
                      AssetModelOpen();
                      setSelectedAsset({
                        ...selectedAsset,
                        assetName: e.target.value,
                      });
                    }}
                    className="flex mx-auto items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm line-clamp-1 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    <p className="line-clamp-1">
                      {assetName === "" ? "No image" : assetName}
                    </p>
                    <AiOutlineCloudUpload className="ml-2 min-w-[1.5rem] min-h-[1.5rem]" />
                  </button>
                </p>
              ) : (
                <p className="pr-5">
                  <button className="flex mx-auto items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm line-clamp-1 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <p className="line-clamp-1">
                      {assetName === "" ? "No image" : assetName}
                    </p>
                    <AiOutlineCloudUpload className="ml-2 min-w-[1.5rem] min-h-[1.5rem]" />
                  </button>
                </p>
              )}
            </div>
            {/* <div className="text-center">
                    <button className="bg-white text-primary lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-6 md:px-6 sm:px-4 xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2">
                      Cancel
                    </button>
                    <button className="bg-primary text-white lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-8 md:px-8 sm:px-6 xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary">
                      Save
                    </button>
                  </div> */}
          </div>
          <div className="w-full">
            {filePath &&
              (Object.values(filePath).includes("Video") ||
                Object.values(filePath).includes("OnlineVideo")) && (
                <ReactPlayer
                  url={filePath?.assetFolderPath}
                  className="relative w-full h-full z-20"
                  controls={true}
                  playing={true}
                />
              )}

            {filePath &&
              (Object.values(filePath).includes("OnlineImage") ||
                Object.values(filePath).includes("Image")) && (
                <img
                  src={filePath?.assetFolderPath}
                  alt="Media"
                  className="w-[576px] h-[324px] mx-auto object-cover min-h-80"
                />
              )}
          </div>
        </div>
      )}

      {/* {mediaTabs === 2 && (
        <>
          <div>
            <div className="grid grid-cols-12 items-center">
              <div className=" lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 p-3">
                <div className="flex items-center  mb-5 flex-wrap">
                  <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                    Asset / Playing:
                  </label>
                  <button className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm   hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    Asset Name
                    <AiOutlineCloudUpload className="ml-2 text-lg" />
                  </button>
                </div>

                <div className="flex items-center  mb-5 flex-wrap">
                    <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                      Condition:
                    </label>
                    <label className="border border-[#D5E3FF] rounded-lg  text-base text-[#515151] p-3">
                      sunny, rainy, windy, stormy
                    </label>
                  </div>

                  <div className="flex items-center  mb-5 flex-wrap">
                    <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                      Play When temp goes above:
                    </label>
                    <div className="formgroup border-[#D5E3FF]">
                      <select className="formInput">
                        <option>40C</option>
                        <option>45C</option>
                        <option>50C</option>
                        <option>55C</option>
                        <option>60C</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>

                <div className="">
                    <button className="bg-white text-primary lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-6 md:px-6 sm:px-4 xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2">
                      Cancel
                    </button>
                    <button className="bg-primary text-white lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-8 md:px-8 sm:px-6 xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary">
                      Save
                    </button>
                  </div>
              </div>
              <div className=" lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                <img src={emergency} className="w-full" />
              </div>
            </div>
          </div>
        </>
      )} */}

      {mediaTabs === 2 && (
        <div className="grid lg:grid-cols-2 w-full h-auto place-items-center items-center p-6 ">
          <div className="w-full">
            <div className="text-center mb-5 flex-wrap">
              <h6 className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                Asset / Playing:
              </h6>
              {permissions.isSave ? (
                <p className="pr-5">
                  <button
                    onClick={(e) => {
                      AssetModelOpen();
                      setSelectedEmergencyAsset({
                        ...selectedEmergencyAsset,
                        assetName: e.target.value,
                      });
                    }}
                    className="flex mx-auto items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm line-clamp-1 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  >
                    <p className="line-clamp-1">
                      {emergencyassetName === ""
                        ? "No image"
                        : emergencyassetName}
                    </p>
                    <AiOutlineCloudUpload className="ml-2 min-w-[1.5rem] min-h-[1.5rem]" />
                  </button>
                </p>
              ) : (
                <p className="pr-5">
                  <button className="flex mx-auto items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm line-clamp-1 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <p className="line-clamp-1">
                      {emergencyassetName === ""
                        ? "No image"
                        : emergencyassetName}
                    </p>
                    <AiOutlineCloudUpload className="ml-2 min-w-[1.5rem] min-h-[1.5rem]" />
                  </button>
                </p>
              )}
            </div>
          </div>
          <div className="w-full">
            {emergencyfilePath &&
              (Object.values(emergencyfilePath).includes("Video") ||
                Object.values(emergencyfilePath).includes("OnlineVideo")) && (
                <ReactPlayer
                  url={emergencyfilePath?.assetFolderPath}
                  className="relative w-full h-full z-20 "
                  controls={true}
                  playing={true}
                />
              )}

            {emergencyfilePath &&
              (Object.values(emergencyfilePath).includes("OnlineImage") ||
                Object.values(emergencyfilePath).includes("Image")) && (
                <img
                  src={emergencyfilePath?.assetFolderPath}
                  alt="Media"
                  className="w-[576px] h-[324px] mx-auto object-cover min-h-80"
                />
              )}
          </div>
        </div>
      )}
      {showAssetModal && (
        <DefaultMediaAsset setShowAssetModal={setShowAssetModal} handleOnConfirm={handleOnConfirm} setAssetPreviewPopup={setAssetPreviewPopup} handleAssetAdd={handleAssetAdd} selectedEmergencyAsset={selectedEmergencyAsset} mediaTabs={mediaTabs} selectedAsset={selectedAsset} filteredData={filteredData} setSearchAssest={setSearchAssest} searchAssest={searchAssest} handleSearchAssest={handleSearchAssest} setPopupActiveTab={setPopupActiveTab} popupActiveTab={popupActiveTab} assetPreviewPopup={assetPreviewPopup} />
      )}

      {assetPreviewPopup && (
        <PreviewAssets
          assetPreview={assetPreview}
          setAssetPreviewPopup={setAssetPreviewPopup}
        />
      )}
    </div>
  );
};

export default Defaultmedia;
