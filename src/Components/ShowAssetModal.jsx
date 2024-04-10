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
import axios from "axios";
import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  GET_ALL_COMPOSITIONS,
  GET_ALL_FILES,
  GET_ALL_SCHEDULE,
} from "../Pages/Api";
import { connection } from "../SignalR";
import ShowAppsModal from "./ShowAppsModal";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../Redux/AppsSlice";
import { useDispatch } from "react-redux";
import { socket } from "../App";
import PreviewAssets from "./Common/PreviewAssets";
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
  setSelectedAsset,
}) => {
  const { user, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();

  const [filteredData, setFilteredData] = useState([]);
  const [searchAssest, setSearchAssest] = useState("");
  const [searchComposition, setSearchComposition] = useState("");
  const [assetData, setAssetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assetAllData, setAssetAllData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [compositionAPIData, setCompositionAPIData] = useState([]);
  const [compostionAllData, setCompostionAllData] = useState([]);
  const [searchApps, setSearchApps] = useState("");
  const [appsData, setAppsData] = useState([]);
  const [showAppModal, setShowAppModal] = useState(false);

  const { assets } = useSelector((s) => s.root.asset);
  const { compositions } = useSelector((s) => s.root.composition);
  const { youtube, textScroll } = useSelector((s) => s.root.apps);
  const allAppsData = [...youtube?.youtubeData, ...textScroll?.textScrollData];
  const modalRef = useRef(null);

  const fetchData = () => {
    setLoading(true);

    // get youtube data
    dispatch(handleGetYoutubeData({ token }));

    //get text scroll data
    dispatch(handleGetTextScrollData({ token }));
    const axiosRequests = [
      axios.get(GET_ALL_FILES, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_SCHEDULE, { headers: { Authorization: authToken } }),
      axios.get(GET_ALL_COMPOSITIONS, {
        headers: { Authorization: authToken },
      }),
    ];
    // Use Promise.all to send all requests concurrently
    Promise.all(axiosRequests)
      .then((responses) => {
        const [filesResponse, scheduleResponse, compositionResponse] =
          responses;
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
        setAssetAllData(allAssets);
        setScheduleData(scheduleResponse.data.data);
        setCompositionAPIData(compositionResponse.data.data);
        setAppsData(allAppsData);
        setCompostionAllData(compositionResponse.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  useEffect(() => {
    const handleStorageChange = () => {
      const isClosed = localStorage.getItem("isWindowClosed");
      if (isClosed === "true") {
        fetchData();
        localStorage.setItem("isWindowClosed", "false");
        // window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const signalROnConfirm = () => {
    console.log("run signal r");
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: setscreenMacID,
    };
    socket.emit("ScreenConnected", Params);
    try {
      if (connection.state == "Disconnected") {
        connection
          .start()
          .then((res) => {
            console.log("signal connected");
          })
          .then(() => {
            connection.invoke("ScreenConnected", setscreenMacID).then(() => {
              console.log("invoked");
              console.log("Message sent:");
            });
          })
          .catch((err) => {
            console.log(err, "signal error");
          });
      } else {
        connection
          .invoke("ScreenConnected", setscreenMacID)
          .then(() => {
            console.log("invoked");
            console.log("Message sent:");
          })
          .catch((err) => {
            console.log(err, "signal error");
          });
      }
    } catch (error) {
      console.error("Error during connection:", error);
    }
  };
  const handleOnConfirm = (setscreenMacID) => {
    setShowAssetModal(false);
    setSearchAssest("");
    setSelectedAsset(assetPreview);
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
        const filteredScreen = assetAllData.filter((entry) =>
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
        const filteredScreen = compositionAPIData.filter((entry) =>
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
        setSearchAssest("");
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
    setSearchAssest("");
    setAssetPreviewPopup(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        setShowAssetModal(false);
        setSearchAssest("");
        setAssetPreviewPopup(false);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  const handleAssestSearch = (event) => {
    setSearchAssest(event.target.value);
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery === "") {
      setAssetData(assetAllData);
    } else {
      const filteredScreen = assetAllData.filter((entry) =>
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
      if (filteredScreen?.length > 0) {
        setAssetData(filteredScreen);
      } else {
        setAssetData([]);
      }
    }
  };

  const handleCompositionSearch = (event) => {
    setSearchComposition(event.target.value);
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery === "") {
      setCompostionAllData(compositionAPIData);
    } else {
      const filteredScreen = compositionAPIData.filter((entry) =>
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
      if (filteredScreen?.length > 0) {
        setCompostionAllData(filteredScreen);
      } else {
        setCompostionAllData([]);
      }
    }
  };

  const handleAppsSearch = (event) => {
    setSearchApps(event.target.value);
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery === "") {
      setAppsData(allAppsData);
    } else {
      const filteredScreen = allAppsData.filter((entry) =>
        Object.values(entry).some((val) => {
          if (typeof val === "string") {
            const keyWords = searchQuery.split(" ");
            for (let i = 0; i < keyWords.length; i++) {
              return (
                // val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                // val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                // val.toLocaleLowerCase().includes(keyWords[i]) ||
                // val.toLocaleLowerCase().includes(searchQuery)
                entry?.instanceName.toLocaleLowerCase().includes(searchQuery)
              );
            }
          }
        })
      );
      if (filteredScreen?.length > 0) {
        setAppsData(filteredScreen);
      } else {
        setAppsData([]);
      }
    }
  };

  return (
    <>
      <div className="border-0 rounded-lg shadow-lg fixed fixed-popup z-9999 lg:max-w-[70vw] lg:min-w-[70vw] md:max-w-[70vw] md:min-w-[70vw] sm:max-w-[70vw] sm:min-w-[70vw] max-w-[85vw] min-w-[85vw] lg:m-auto md:m-auto sm:m-auto m-5 bg-white outline-none focus:outline-none ">
        <div
          className={`${
            showAppModal ? "hidden" : ""
          } flex items-center justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black`}
        >
          <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
            Set Content to Add Media
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
        <div
          onClick={() => assetPreviewPopup && setAssetPreviewPopup(false)}
          className={`${
            showAppModal ? "hidden" : ""
          } relative p-2 w-full flex items-start gap-2 bg-white rounded-2xl`}
        >
          <div className="lg:flex lg:flex-wrap lg:items-center  w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
            <div className="flex-initial mb-5">
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

            <div className="lg:p-4 drop-shadow-2xl bg-white rounded-3xl flex-1">
              <div className={popupActiveTab !== 1 && "hidden"}>
                <div className="flex flex-wrap w-full items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center mb-3">
                  <div className="mb-3 relative ">
                    <AiOutlineSearch className="absolute top-2 left-3 w-5 h-5 z-10 text-gray" />
                    <input
                      type="text"
                      placeholder="Search Asset"
                      className="border border-primary rounded-full pl-9 py-2 search-user w-56"
                      value={searchAssest}
                      // onChange={(e) => handleSearchAssest(e, "asset")}
                      onChange={(e) => handleAssestSearch(e)}
                    />
                  </div>
                  <Link to="/fileupload" target="_blank">
                    <button
                      className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                      onClick={() => {
                        localStorage.setItem("isWindowClosed", "false");
                        // setShowAssetModal(false)
                      }}
                    >
                      Add New Assets
                    </button>
                  </Link>
                </div>
                <div className="table-container md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto lg:min-h-[300px] lg:max-h-[300px] min-h-[200px] max-h-[200px] object-cover addmedia-table sc-scrollbar rounded-lg">
                  <table
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: " 0 10px",
                    }}
                    className="w-full"
                  >
                    <thead className="sticky top-0">
                      <tr className="table-head-bg">
                        <th className="p-3 w-80 text-left">Media Name</th>
                        <th>Date Added</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td
                            className="font-semibold text-center bg-white text-lg"
                            colSpan={4}
                          >
                            Loading...
                          </td>
                        </tr>
                      )}
                      {!loading && assetData && assetData.length === 0 ? (
                        <tr>
                          <td
                            className="font-semibold text-center bg-white text-lg"
                            colSpan={4}
                          >
                            No assets here.
                          </td>
                        </tr>
                      ) : (
                        assetData.length > 0 &&
                        assetData
                          .filter((asset) => {
                            return (
                              asset.assetType !== "Folder"
                            );
                          })
                          .map((asset) => (
                            <tr
                              key={asset.assetID}
                              className={`${
                                selectedAsset?.assetID === asset?.assetID ||
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
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={popupActiveTab !== 2 && "hidden"}>
                <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center lg:mb-0 mb-3">
                  <div className="lg:mb-5 mb-3 relative">
                    <AiOutlineSearch className="absolute top-2 left-3 w-6 h-5 z-10 text-gray" />
                    <input
                      type="text"
                      placeholder="Search Composition"
                      className="border border-primary rounded-full pl-9 py-2 search-user w-56"
                      value={searchComposition}
                      // onChange={(e) => handleSearchAssest(e, "composition")}
                      onChange={(e) => handleCompositionSearch(e)}
                    />
                  </div>
                  <Link to="/addcomposition" target="_blank">
                    <button
                      className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                      onClick={() => {
                        localStorage.setItem("isWindowClosed", "false");
                        // setShowAssetModal(false)
                      }}
                    >
                      Add New Composition
                    </button>
                  </Link>
                </div>
                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto lg:min-h-[300px] lg:max-h-[300px]  min-h-[200px] max-h-[200px] object-cover addmedia-table sc-scrollbar rounded-lg">
                  <table
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: " 0 10px",
                    }}
                    className="w-full"
                  >
                    <thead className="sticky top-0">
                      <tr className="table-head-bg">
                        <th className="p-3 w-80 text-left">Composition Name</th>
                        <th>Date Added</th>
                        <th className="p-3">Resolution</th>
                        <th className="p-3">Duration</th>
                      </tr>
                    </thead>
                    {loading && (
                      <tr>
                        <td
                          className="font-semibold text-center bg-white text-lg"
                          colSpan={4}
                        >
                          Loading...
                        </td>
                      </tr>
                    )}
                    {!loading &&
                    compostionAllData &&
                    compostionAllData.length === 0 ? (
                      <tr>
                        <td
                          className="font-semibold text-center bg-white text-lg"
                          colSpan={4}
                        >
                          No Composition here.
                        </td>
                      </tr>
                    ) : (
                      compostionAllData.length > 0 &&
                      compostionAllData.map((composition) => (
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
                            <td className="p-3 text-center">
                              {moment(composition?.dateAdded).format("LLL")}
                            </td>
                            <td className="p-3 text-center">
                              {composition.resolution}
                            </td>
                            <td className="p-3 text-center">
                              {moment
                                .utc(composition?.duration * 1000)
                                .format("HH:mm:ss")}
                            </td>
                          </tr>
                        </tbody>
                      ))
                    )}
                  </table>
                </div>
              </div>

              <div className={popupActiveTab !== 3 && "hidden"}>
                <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center lg:mb-0 mb-3">
                  <div className="lg:mb-5 mb-3 relative">
                    <AiOutlineSearch className="absolute top-2 left-3 w-6 h-5 z-10 text-gray" />
                    <input
                      type="text"
                      placeholder="Search Apps"
                      className="border border-primary rounded-full pl-9 py-2 search-user w-56"
                      value={searchApps}
                      onChange={(e) => handleAppsSearch(e)}
                    />
                  </div>
                  <button
                    onClick={() => {
                      localStorage.setItem("isWindowClosed", "false");
                      setShowAppModal(true);
                    }}
                    className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                  >
                    Add New App
                  </button>
                </div>
                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto lg:min-h-[300px] lg:max-h-[300px]  min-h-[200px] max-h-[200px] object-cover addmedia-table sc-scrollbar rounded-lg">
                  <table
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: " 0 10px",
                    }}
                    className="w-full"
                  >
                    <thead className="sticky top-0">
                      <tr className="table-head-bg">
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
                    ) : appsData.length > 0 ? (
                      appsData.map((instance, index) => (
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
                            <td className="p-3 text-center">
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
                    ) : (
                      <tr>
                        <td
                          className="font-semibold text-center bg-white text-lg"
                          colSpan={4}
                        >
                          No search result found.
                        </td>
                      </tr>
                    )}
                  </table>
                </div>
              </div>
            </div>
            {/* {assetPreviewPopup && (
              <div className="fixed left-1/2 lg:top-[12%] md:top-1/3 sm:top-1/3 top-1/3 -translate-x-1/2 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 bg-black z-9990 inset-0">
                <div className="fixed z-9999">
                  <button
                    className="fixed cursor-pointer -top-3 -right-3 rounded-full bg-black text-white"
                    onClick={() => setAssetPreviewPopup(false)}
                  >
                    <AiOutlineCloseCircle size={30} />
                  </button>
                </div>
                <div className="fixed">
                  {assetPreview && (
                    <>
                      {assetPreview.assetType === "OnlineImage" && (
                        <div>
                          <img
                            src={assetPreview.assetFolderPath}
                            alt={assetPreview.assetName}
                            className="imagebox z-50 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 fixed"
                          />
                        </div>
                      )}

                      {assetPreview.assetType === "OnlineVideo" && (
                        <div className="relative videobox">
                          <video
                            controls
                            className="rounded-2xl md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72"
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
                          className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                        />
                      )}
                      {assetPreview.assetType === "Video" && (
                        <video
                          controls
                          className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                        >
                          <source
                            src={assetPreview.assetFolderPath}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {assetPreview.assetType === "DOC" && (
                        <iframe
                          className="w-[768px] h-[432px]"
                          title="Document Viewer"
                          src={viewerSrc}
                        ></iframe>
                      )}
                    </>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>

        <div
          className={`${
            showAppModal ? "hidden" : ""
          } lg:flex justify-between items-center pl-5 pr-5 pb-4`}
        >
          <p className="text-black mb-3 text-left">
            Content will always be playing Confirm
          </p>
          <p className="text-right">
            <button
              className="bg-primary text-white rounded-full px-5 py-2"
              onClick={() => {
                handleOnConfirm(setscreenMacID);
                from !== "new_screen" && signalROnConfirm();
              }}
            >
              Confirm
            </button>
          </p>
        </div>
      </div>
      {assetPreviewPopup && (
        <PreviewAssets
          assetPreview={assetPreview}
          setAssetPreviewPopup={setAssetPreviewPopup}
        />
      )}
      {showAppModal && <ShowAppsModal setShowAppModal={setShowAppModal} />}
      <div
        onClick={() => handleClickOutside()}
        className="fixed inset-0 z-9990 bg-black/40"
      ></div>
    </>
  );
};

export default ShowAssetModal;
