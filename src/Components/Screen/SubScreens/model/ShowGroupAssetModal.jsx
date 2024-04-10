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
import ShowAppsModal from "../../../ShowAppsModal";
import { handleGetAllAssets } from "../../../../Redux/Assetslice";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../../../Redux/AppsSlice";
import { useDispatch } from "react-redux";
import { handleGetCompositions } from "../../../../Redux/CompositionSlice";
import { handleGetAllSchedule } from "../../../../Redux/ScheduleSlice";
import PreviewAssets from "../../../Common/PreviewAssets";

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
  type,
  handleSave,
}) => {
  const { user, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();

  const [filteredData, setFilteredData] = useState([]);
  const [searchAssest, setSearchAssest] = useState("");
  const [searchComposition, setSearchComposition] = useState("");
  const [showAppModal, setShowAppModal] = useState(false);
  const [searchApps, setSearchApps] = useState("");
  const [appsData, setAppsData] = useState([]);

  const { assets } = useSelector((s) => s.root.asset);
  const { compositions } = useSelector((s) => s.root.composition);

  const modalRef = useRef(null);

  useEffect(() => {
    // load composition
    dispatch(handleGetCompositions({ token }));

    // get all assets files
    dispatch(handleGetAllAssets({ token }));

    // get all schedule
    dispatch(handleGetAllSchedule({ token }));

    // get youtube data and textscroll data
    Promise.all([
      dispatch(handleGetYoutubeData({ token })),
      dispatch(handleGetTextScrollData({ token }))
    ])
      .then(([youtubeResponse, textScrollResponse]) => {
        const youtubeData = youtubeResponse?.payload?.data || [];
        const textScrollData = textScrollResponse?.payload?.data || [];
    
        const combinedData = [...youtubeData, ...textScrollData];
        setAppsData(combinedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    
  }, []);

  const handleOnConfirm = async () => {
    await handleSave();
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
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const isClosed = localStorage.getItem("isWindowClosed");
      if (isClosed === "true") {
        dispatch(handleGetCompositions({ token }));
        dispatch(handleGetAllAssets({ token }));
        dispatch(handleGetYoutubeData({ token }));
        dispatch(handleGetTextScrollData({ token }));
        localStorage.setItem("isWindowClosed", "false");
        // window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleAppsSearch = (event) => {
    setSearchApps(event.target.value);
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery === "") {
      setAppsData(appsData);
    } else {
      const filteredScreen = appsData.filter((entry) =>
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
            onClick={() => setShowAssetModal(false)}
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

            <div className="lg:p-10 md:p-10 sm:p-2 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl flex-1 w-full">
              <div className={popupActiveTab !== 1 && "hidden"}>
                <div className="flex flex-wrap w-full items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center mb-3">
                  <div className="mb-3 relative ">
                    <AiOutlineSearch className="absolute top-2 left-3 w-5 h-5 z-10 text-gray" />
                    <input
                      type="text"
                      placeholder="Search Assest"
                      className="border border-primary rounded-full pl-9 py-2 search-user w-56"
                      value={searchAssest}
                      onChange={(e) => handleSearchAssest(e, "asset")}
                    />
                  </div>
                  <Link to="/fileupload" target="_blank">
                    <button
                      className="flex lg:mb-0 md:mb-0 sm:mb-2 mb-2 align-middle  items-center rounded-full xs:px-3 xs:py-2 sm:px-3 md:px-4 sm:py-2 text-sm hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                      onClick={() => {
                        localStorage.setItem("isWindowClosed", "false");
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
                    {filteredData.length === 0
                      ? assets
                          .filter((asset) => {
                            return (
                              asset.assetType !== "Folder" 
                            );
                          })
                          .map((asset) => (
                            <tbody key={asset.assetID}>
                              <tr
                                className={`${
                                  selectedAsset === asset ||
                                  selectedAsset === asset?.assetName
                                    ? "bg-[#f3c953]"
                                    : ""
                                } border-b border-[#eee] text-center cursor-pointer hover:bg-black hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50`}
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
                      : filteredData
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
                                } border-b border-[#eee] text-center cursor-pointer hover:bg-black hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50`}
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
                          ))}
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
                      onChange={(e) => handleSearchAssest(e, "composition")}
                    />
                  </div>
                  <Link to="/addcomposition" target="_blank">
                    <button
                      className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                      onClick={() => {
                        localStorage.setItem("isWindowClosed", "false");
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
                    {filteredData.length === 0
                      ? compositions.map((composition) => (
                          <tbody key={composition.compositionID}>
                            <tr
                              className={`${
                                selectedComposition === composition
                                  ? "bg-[#f3c953]"
                                  : ""
                              } border-b border-[#eee] text-center cursor-pointer hover:bg-black hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50`}
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
                                  .utc(composition?.duration * 1000)
                                  .format("HH:mm:ss")}
                              </td>
                            </tr>
                          </tbody>
                        ))
                      : filteredData.map((composition) => (
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
                        ))}
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
                      </tr>
                    </thead>

                    {appsData?.length > 0 ? (
                      appsData.map((instance, index) => (
                        <tbody key={index}>
                          <tr
                            className={`${
                              selectedTextScroll === instance ||
                              selectedYoutube === instance
                                ? "bg-[#f3c953]"
                                : ""
                            } border-b border-[#eee]`}
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
          </div>
        </div>

        <div
          className={`${
            showAppModal ? "hidden" : ""
          } lg:flex justify-between items-center pl-5 pr-5 pb-4`}
        >
          <p className="text-black text-left">
            Content will always be playing Confirm
          </p>
          <p className="text-right">
            <button
              className="bg-primary text-white rounded-full px-5 py-2"
              onClick={() => {
                handleOnConfirm();
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
