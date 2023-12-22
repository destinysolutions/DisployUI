import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import moment from "moment";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  AiOutlineAppstoreAdd,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SIGNAL_R } from "../Pages/Api";

const ShowAssetModal = ({
  setShowAssetModal,
  handleAssetAdd,
  setAssetPreviewPopup,
  setPopupActiveTab,
  popupActiveTab,
  setSelectedComposition,
  handleAssetUpdate,
  assetPreviewPopup,
  assetPreview,
  selectedComposition,
  selectedAsset,
  handleAppsAdd,
  selectedTextScroll,
  selectedYoutube,
  setscreenMacID,
  type,
  from,
}) => {
  const { user, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [filteredData, setFilteredData] = useState([]);
  const [searchAssest, setSearchAssest] = useState("");
  const [searchComposition, setSearchComposition] = useState("");

  const { assets } = useSelector((s) => s.root.asset);
  const { compositions } = useSelector((s) => s.root.composition);
  const { allAppsData } = useSelector((s) => s.root.apps);
  const [connection, setConnection] = useState(null);
  const modalRef = useRef(null);
  console.log("setscreenMacID", setscreenMacID);

  const signalROnConfirm = () => {
    const connectSignalR = async () => {
      console.log("run signal r");
      const newConnection = new HubConnectionBuilder()
        .withUrl(SIGNAL_R)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      newConnection.on("ScreenConnected", (MacID) => {
        console.log("ScreenConnected", MacID);
      });

      try {
        await newConnection
          .start()
          .then(() => {
            console.log("Connection established");
          })
          .then(() => {
            setConnection(newConnection);
            // Invoke ScreenConnected method
            newConnection.invoke("ScreenConnected", setscreenMacID);
            console.log("Message sent:");
          });
      } catch (error) {
        console.error("Error during connection:", error);
      }
    };

    connectSignalR(); // Call the combined function

    return () => {
      if (connection) {
        connection
          .stop()
          .then(() => {
            console.log("Connection stopped");
          })
          .catch((error) => {
            console.error("Error stopping connection:", error);
          });
      }
    };
  };
  const handleOnConfirm = (setscreenMacID) => {
    setShowAssetModal(false);
    handleAssetUpdate();
    setAssetPreviewPopup(false);
  };

  const handleSearchAssest = (event, from) => {
    // setTags([])
    const searchQuery = event.target.value.toLowerCase();
    if (from === "asset") {
      setSearchAssest(searchQuery);
    } else {
      setSearchComposition(searchQuery);
    }

    if (searchQuery === "") {
      setFilteredData([]);
    } else {
      if (from === "asset") {
        const filteredScreen = assets.filter((entry) =>
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
          toast.error("asset not found!!");
          setFilteredData([]);
        }
      } else {
        const filteredScreen = compositions.filter((entry) =>
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
          toast.error("composition not found!!");
          setFilteredData([]);
        }
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setShowAssetModal(false);
        setAssetPreviewPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside, user]);

  function handleClickOutside() {
    setShowAssetModal(false);
    setAssetPreviewPopup(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        setShowAssetModal(false);
        setAssetPreviewPopup(false);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  return (
    <>
      <div className="border-0 rounded-lg shadow-lg fixed z-50 max-w-[70vw] min-w-[70vw] h-auto top-12 left-1/2 -translate-x-1/2 bg-white outline-none focus:outline-none ">
        <div className="flex items-start justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black">
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
        <div
          onClick={() => assetPreviewPopup && setAssetPreviewPopup(false)}
          className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 w-full flex items-start gap-2 bg-white rounded-2xl"
        >
          <div className="lg:flex lg:flex-wrap lg:items-center  w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
            <div className="flex-initial">
              {type !== "merged_screens" && (
                <>
                  <nav
                    className="flex flex-col space-y-2 "
                    aria-label="Tabs"
                    role="tablist"
                    data-hs-tabs-vertical="true"
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                        popupActiveTab === 1 ? "active" : ""
                      }`}
                      onClick={() => setPopupActiveTab(1)}
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
                        popupActiveTab === 2 ? "active" : ""
                      }`}
                      onClick={() => setPopupActiveTab(2)}
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
                      Compositions
                    </button>
                    {/* <button
                        type="button"
                        className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                          popupActiveTab === 3
                            ? "active"
                            : ""
                        }`}
                        onClick={() => setPopupActiveTab(3)}
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
                      </button> */}
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                        popupActiveTab === 3 ? "active" : ""
                      }`}
                      onClick={() => setPopupActiveTab(3)}
                    >
                      <span
                        className={`p-1 rounded ${
                          popupActiveTab === 3
                            ? "bg-primary text-white"
                            : "bg-lightgray"
                        } `}
                      >
                        <AiOutlineAppstoreAdd size={15} />
                      </span>
                      Apps
                    </button>
                  </nav>
                </>
              )}
            </div>

            <div className="lg:p-10 md:p-10 sm:p-10 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl flex-1">
              <div className={popupActiveTab !== 1 && "hidden"}>
                <div className="flex flex-wrap w-full items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                  <div className="mb-5 relative ">
                    <AiOutlineSearch className="absolute top-3 left-3 w-5 h-5 z-10 text-gray" />
                    <input
                      type="text"
                      placeholder="Search asset"
                      className="border border-primary rounded-full pl-9 py-2 search-user w-56"
                      value={searchAssest}
                      onChange={(e) => handleSearchAssest(e, "asset")}
                    />
                  </div>
                  <Link to="/fileupload" target="_blank">
                    <button className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                      Upload
                    </button>
                  </Link>
                </div>
                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[50vh] max-h-[50vh] object-cover w-full addmedia-table">
                  <table
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: " 0 10px",
                    }}
                    className="w-full"
                  >
                    <thead className="sticky top-0">
                      <tr className="bg-lightgray">
                        <th className="p-3 w-80 text-left">Media Name</th>
                        <th>Date Added</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Type</th>
                      </tr>
                    </thead>
                    {assets && assets.length === 0 ? (
                      <tr>
                        <td
                          className="font-semibold text-center bg-white text-lg"
                          colSpan={4}
                        >
                          No assets here.
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      assets
                        .filter((asset) => {
                          return asset.assetType !== "Folder";
                        })
                        .map((asset) => (
                          <tbody key={asset.assetID}>
                            <tr
                              className={`${
                                selectedAsset === asset ||
                                selectedAsset === asset?.assetName
                                  ? "bg-[#f3c953]"
                                  : ""
                              } border-b border-[#eee] cursor-pointer `}
                              onClick={() => {
                                handleAssetAdd(asset);
                                setAssetPreviewPopup(true);
                                setSelectedComposition("");
                                handleAppsAdd("");
                              }}
                            >
                              <td className="p-3 text-left">
                                {asset.assetName}
                              </td>
                              <td className="p-3">
                                {moment(asset.createdDate).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </td>
                              <td className="p-3">{asset.fileSize}</td>
                              <td className="p-3">{asset.assetType}</td>
                            </tr>
                          </tbody>
                        ))
                    ) : (
                      filteredData
                        .filter((asset) => {
                          return asset.assetType !== "Folder";
                        })
                        .map((asset) => (
                          <tbody key={asset.assetID}>
                            <tr
                              className={`${
                                selectedAsset === asset ||
                                selectedAsset === asset?.assetName
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
                              <td className="p-3">
                                {moment(asset.createdDate).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </td>
                              <td className="p-3">{asset.fileSize}</td>
                              <td className="p-3">{asset.assetType}</td>
                            </tr>
                          </tbody>
                        ))
                    )}
                  </table>
                  {assetPreviewPopup && (
                    <div className="fixed left-1/2 -translate-x-1/2 w-10/12 h-10/12 bg-black z-50 inset-0">
                      {/* btn */}
                      <div className="p-1 rounded-full text-white bg-primary absolute -top-3 -right-3">
                        <button
                          className="text-xl"
                          onClick={() => setAssetPreviewPopup(false)}
                        >
                          <AiOutlineCloseCircle className="text-2xl" />
                        </button>
                      </div>
                      <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[90%] w-[90%]">
                        {assetPreview && (
                          <>
                            {assetPreview.assetType === "OnlineImage" && (
                              <div className="imagebox p-3">
                                <img
                                  src={assetPreview.assetFolderPath}
                                  alt={assetPreview.assetName}
                                  className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                />
                              </div>
                            )}

                            {assetPreview.assetType === "OnlineVideo" && (
                              <div className="relative videobox">
                                <video
                                  controls
                                  className="w-full rounded-2xl h-full"
                                >
                                  <source
                                    src={assetPreview.assetFolderPath}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}
                            {assetPreview.assetType === "Image" && (
                              <img
                                src={assetPreview.assetFolderPath}
                                alt={assetPreview.assetName}
                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                              />
                            )}
                            {assetPreview.assetType === "Video" && (
                              <video
                                controls
                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                              >
                                <source
                                  src={assetPreview.assetFolderPath}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {assetPreview.assetType === "DOC" && (
                              <a
                                href={assetPreview.assetFolderPath}
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
              <div className={popupActiveTab !== 2 && "hidden"}>
                <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                  <div className="mb-5 relative">
                    <AiOutlineSearch className="absolute top-3 left-3 w-6 h-5 z-10 text-gray" />
                    <input
                      type="text"
                      placeholder="Search Composition"
                      className="border border-primary rounded-full pl-9 py-2 search-user w-56"
                      value={searchComposition}
                      onChange={(e) => handleSearchAssest(e, "composition")}
                    />
                  </div>
                  <Link to="/addcomposition" target="_blank">
                    <button className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                      Add New Composition
                    </button>
                  </Link>
                </div>
                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table">
                  <table
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: " 0 10px",
                    }}
                    className="w-full"
                  >
                    <thead className="sticky top-0">
                      <tr className="bg-lightgray">
                        <th className="p-3 w-80 text-left">Composition Name</th>
                        <th>Date Added</th>
                        <th className="p-3">Resolution</th>
                        <th className="p-3">Duration</th>
                      </tr>
                    </thead>
                    {compositions && compositions.length === 0 ? (
                      <tr>
                        <td
                          className="font-semibold text-center bg-white text-lg"
                          colSpan={4}
                        >
                          No Composition here.
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      compositions.map((composition) => (
                        <tbody key={composition.compositionID}>
                          <tr
                            className={`${
                              selectedComposition === composition
                                ? "bg-[#f3c953]"
                                : ""
                            } border-b border-[#eee] `}
                            onClick={() => {
                              setSelectedComposition(composition);
                              handleAssetAdd("");
                              handleAppsAdd("");
                            }}
                          >
                            <td className="p-3 text-left">
                              {composition.compositionName}
                            </td>
                            <td className="p-3">
                              {moment(composition.dateAdded).format(
                                "YYYY-MM-DD hh:mm"
                              )}
                            </td>
                            <td className="p-3">{composition.resolution}</td>
                            <td className="p-3">
                              {moment
                                .utc(composition.duration * 1000)
                                .format("hh:mm:ss")}
                            </td>
                          </tr>
                        </tbody>
                      ))
                    ) : (
                      filteredData.map((composition) => (
                        <tbody key={composition.compositionID}>
                          <tr
                            className={`${
                              selectedComposition === composition
                                ? "bg-[#f3c953]"
                                : ""
                            } border-b border-[#eee] `}
                            onClick={() => {
                              setSelectedComposition(composition);
                            }}
                          >
                            <td className="p-3 text-left">
                              {composition.compositionName}
                            </td>
                            <td className="p-3">
                              {moment(composition.dateAdded).format(
                                "YYYY-MM-DD hh:mm"
                              )}
                            </td>
                            <td className="p-3">{composition.resolution}</td>
                            <td className="p-3">
                              {moment
                                .utc(composition.duration * 1000)
                                .format("hh:mm:ss")}
                            </td>
                          </tr>
                        </tbody>
                      ))
                    )}
                  </table>
                </div>
              </div>

              <div className={popupActiveTab !== 3 && "hidden"}>
                <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                  <Link to="/apps">
                    <button className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                      Add New App
                    </button>
                  </Link>
                </div>
                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table">
                  <table
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: " 0 10px",
                    }}
                    className="w-full"
                  >
                    <thead className="sticky top-0">
                      <tr className="bg-lightgray">
                        <th className="p-3 w-80 text-left">Instance Name</th>
                        <th>App Type</th>
                        {/*<th className="p-3">Resolution</th>
                        <th className="p-3">Duration</th> */}
                      </tr>
                    </thead>

                    {allAppsData && allAppsData.length === 0 ? (
                      <tr>
                        <td
                          className="font-semibold text-center bg-white text-lg"
                          colSpan={4}
                        >
                          No Apps Data here.
                        </td>
                      </tr>
                    ) : (
                      allAppsData.map((instance, index) => (
                        <tbody key={index}>
                          <tr
                            className={`${
                              selectedTextScroll === instance ||
                              selectedYoutube === instance
                                ? "bg-[#f3c953]"
                                : ""
                            } border-b border-[#eee] `}
                            onClick={() => {
                              handleAppsAdd(instance);
                              handleAssetAdd("");
                              setSelectedComposition("");
                            }}
                          >
                            <td className="p-3 text-left">
                              {instance.instanceName}
                            </td>
                            <td className="p-3">
                              {instance.youTubePlaylist
                                ? "Youtube Video"
                                : "Text scroll"}
                            </td>
                            {/* <td className="p-3">{composition.resolution}</td>
                              <td className="p-3">
                                {moment
                                  .utc(composition.duration * 1000)
                                  .format("hh:mm:ss")}
                              </td> */}
                          </tr>
                        </tbody>
                      ))
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pl-5 pr-5 pb-4">
          <p className="text-black">Content will always be playing Confirm</p>
          <button
            className="bg-primary text-white rounded-full px-5 py-2"
            onClick={() => {
              handleOnConfirm(setscreenMacID);
              from !== "new_screen" && signalROnConfirm();
              from === "new_screen" && console.log("screen");
              from !== "new_screen" && console.log("screen not");
            }}
          >
            Confirm
          </button>
        </div>
      </div>
      <div
        onClick={() => handleClickOutside()}
        className="fixed inset-0 z-40 bg-black/40"
      ></div>
    </>
  );
};

export default ShowAssetModal;
