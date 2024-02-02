import { Option } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import {
  GET_ALL_COMPOSITIONS,
  GET_ALL_FILES,
  GET_DEFAULT_ASSET,
  SAVE_DEFAULT_ASSET,
} from "../../Pages/Api";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { useRef } from "react";
import toast from "react-hot-toast";
import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";

const Defaultmedia = () => {
  const [mediaTabs, setMediaTabs] = useState(1);
  function updateMediaTab(id) {
    setMediaTabs(id);
  }
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [assetAllData, setAssetAllData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({
    assetName: "",
    assetID: "",
  });
  const [assetName, setAssetName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [searchAssest, setSearchAssest] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [searchComposition, setSearchComposition] = useState("");
  const [compositionData, setCompositionData] = useState([]);
  const [selectedComposition, setSelectedComposition] = useState({
    compositionName: "",
  });
  const [assetPreview, setAssetPreview] = useState("");

  const modalRef = useRef(null);

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
        setAssetAllData(allAssets);
        setFilteredData(allAssets);
        setFilteredData(allAssets);
        setShowAssetModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };
  const [searchAsset, setSearchAsset] = useState("");

  const handleFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);
    if (searchQuery === "") {
      setFilteredData([]);
    }
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
      setFilteredData(filteredScreen);
    } else {
      toast.remove();
      toast.error("asset not found!!");
      setFilteredData([]);
    }
  };

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

  const loadComposition = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_COMPOSITIONS,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setCompositionData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCompositionsAdd = (composition) => {
    setSelectedComposition(composition);
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

  const handleOnConfirm = () => {
    setShowAssetModal(false);
    // handleAssetUpdate();
    handleChangeMedia();
    setAssetPreviewPopup(false);
    setSearchAssest("");
  };

  useEffect(() => {
    handleGetAsset();
    loadComposition();
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
        setSearchAsset("");
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
    setSearchAsset("");
    setSearchAssest("");
    setFilteredData([]);
  }

  const handleSearchAssest = (event, from) => {
    // setTags([])
    const searchQuery = event.target.value.toLowerCase();
    if (from === "asset") {
      setSearchAssest(searchQuery);
    } else {
      setSearchComposition(searchQuery);
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
      } else {
        const filteredScreen = compositionData.filter((entry) =>
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
          {/* <li
              className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium  w-1/2 text-center"
              onClick={() => updateMediaTab(1)}
            >
              <button
                className={
                  mediaTabs === 1
                    ? "Mediatabshow mediatabactive rounded-tl-xl "
                    : "Mediatab"
                }
              >
                Default Media
              </button>
            </li> */}
          {/* <li
              className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium   w-1/2 text-center"
              onClick={() => updateMediaTab(2)}
            >
              <button
                className={
                  mediaTabs === 2
                    ? "Mediatabshow mediatabactive rounded-tr-xl"
                    : "Mediatab"
                }
              >
                Emergency Media
              </button>
            </li> */}
        </ul>
      </div>
      {mediaTabs === 1 && (
        <div className="grid lg:grid-cols-2 w-full h-auto place-items-center items-center p-6 ">
          <div className="lg:w-1/2 w-full">
            <div className="flex items-center justify-center mb-5 flex-wrap">
              <label className="mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2">
                Asset / Playing:
              </label>
              <button
                onClick={(e) => {
                  AssetModelOpen();
                  setSelectedAsset({
                    ...selectedAsset,
                    assetName: e.target.value,
                  });
                }}
                className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm line-clamp-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                <p className="line-clamp-3">
                  {assetName === "" ? "No image" : assetName}
                </p>
                <AiOutlineCloudUpload className="ml-2 min-w-[1.5rem] min-h-[1.5rem]" />
              </button>
              {showAssetModal && (
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                  <div
                    // ref={modalRef}
                    className={`relative w-[70vw] h-auto lg:p-6 md:p-6 sm:p-2 xs:p-1 flex items-start gap-2 bg-white rounded-2xl`}
                  >
                    <div className="flex absolute top-0 left-0 h-fit w-full z-10 items-start justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black">
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
                      onClick={() =>
                        assetPreviewPopup && setAssetPreviewPopup(false)
                      }
                      className="lg:flex mt-8 lg:flex-wrap lg:items-center  w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
                      {/* left side tabs */}
                      <div className="flex-initial">
                        <nav
                          className="flex flex-col space-y-2 "
                          aria-label="Tabs"
                          role="tablist"
                          data-hs-tabs-vertical="true"
                        >
                          <button
                            type="button"
                            className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${popupActiveTab === 1 ? "active" : ""
                              }`}
                            onClick={() => setPopupActiveTab(1)}
                          >
                            <span
                              className={`p-1 rounded ${popupActiveTab === 1
                                  ? "bg-primary text-white"
                                  : "bg-lightgray"
                                } `}
                            >
                              <IoBarChartSharp size={15} />
                            </span>
                            Assets
                          </button>
                          {/* <button
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
                              </button> */}
                          {/* <button
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
                      </button> */}
                        </nav>
                      </div>

                      <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl flex-1">
                        <div className={popupActiveTab !== 1 && "hidden"}>
                          <div className="flex flex-wrap w-full items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                            <div className="mb-5 relative ">
                              <AiOutlineSearch className="absolute top-2.5 left-2 w-5 h-5 z-10 text-gray" />
                              <input
                                type="text"
                                placeholder="Search Assest"
                                className="border border-primary rounded-full pl-8 py-2 search-user"
                                value={searchAssest}
                                onChange={(e) => handleSearchAssest(e, "asset")}
                              />
                            </div>
                            <button
                              className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                              onClick={() => {
                                window.open(
                                  window.location.origin.concat("/fileupload")
                                );
                                localStorage.setItem("isWindowClosed", "false");
                                // setShowAssetModal(false);
                                setSearchAssest("");
                              }}
                            >
                              Upload
                            </button>
                          </div>
                          <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover w-full addmedia-table sc-scrollbar rounded-lg">
                            <table
                              style={{
                                borderCollapse: "collapse",
                                borderSpacing: " 0 10px",
                              }}
                              className="w-full"
                            >
                              <thead className="sticky top-0">
                                <tr className="table-head-bg">
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
                                      className={`${selectedAsset?.assetID ===
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

                          </div>
                        </div>
                        <div className={popupActiveTab !== 2 && "hidden"}>
                          <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                            <div className="mb-5 relative w-fit">
                              <AiOutlineSearch className="absolute top-2.5 left-2 w-6 h-5 z-10 text-gray" />
                              <input
                                type="text"
                                placeholder="Search Composition"
                                className="border border-primary rounded-full pl-8 py-2 search-user w-full"
                                value={searchComposition}
                                onChange={(e) =>
                                  handleSearchAssest(e, "composition")
                                }
                              />
                            </div>
                            <Link to="/addcomposition">
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
                                  <th className="p-3 w-80 text-left">
                                    Composition Name
                                  </th>
                                  <th>Date Added</th>
                                  <th className="p-3">Resolution</th>
                                  <th className="p-3">Duration</th>
                                </tr>
                              </thead>
                              {filteredData.length === 0
                                ? compositionData.map((composition) => (
                                  <tbody key={composition.compositionID}>
                                    <tr
                                      className={`${selectedComposition === composition
                                          ? "bg-[#f3c953]"
                                          : ""
                                        } border-b border-[#eee] `}
                                      onClick={() => {
                                        handleCompositionsAdd(composition);
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
                                      <td className="p-3">
                                        {composition.resolution}
                                      </td>
                                      <td className="p-3">
                                        {moment
                                          .utc(composition.duration * 1000)
                                          .format("hh:mm:ss")}
                                      </td>
                                    </tr>
                                  </tbody>
                                ))
                                : filteredData.map((composition) => (
                                  <tbody key={composition.compositionID}>
                                    <tr
                                      className={`${selectedComposition === composition
                                          ? "bg-[#f3c953]"
                                          : ""
                                        } border-b border-[#eee] `}
                                      onClick={() => {
                                        handleCompositionsAdd(composition);
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
                                      <td className="p-3">
                                        {composition.resolution}
                                      </td>
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
            {/* <div className="text-center">
                    <button className="bg-white text-primary lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-6 md:px-6 sm:px-4 xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2">
                      Cancel
                    </button>
                    <button className="bg-primary text-white lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-8 md:px-8 sm:px-6 xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary">
                      Save
                    </button>
                  </div> */}
          </div>
          <div className=" w-[576px] h-[324px]">
            {filePath &&
              (Object.values(filePath).includes("Video") ||
                Object.values(filePath).includes("OnlineVideo")) && (
                <ReactPlayer
                  url={filePath?.assetFolderPath}
                  className="relative w-[576px] h-[324px] z-20 min-h-80 default-media "
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
                  <img src="../../../Settings/media2.png" className="w-full" />
                </div>
              </div>
            </div>
          </>
        )} */}

      {assetPreviewPopup && (
        <div className="fixed left-1/2 top-1/4 -translate-x-1/2 w-[960px] h-[540px] bg-black z-50 inset-0">
          {/* btn */}
          <div className="fixed w-full h-full z-40">
            <button
              className="fixed cursor-pointer -top-3 -right-3 rounded-full bg-black text-white"
              onClick={() => setAssetPreviewPopup(false)}
            >
              <AiOutlineCloseCircle size={30} />
            </button>
          </div>
          <div className="fixed h-full w-full">
            {assetPreview && (
              <>
                {assetPreview.assetType === "OnlineImage" && (
                  <div className="imagebox p-3">
                    <img
                      src={assetPreview.assetFolderPath}
                      alt={assetPreview.assetName}
                      className="imagebox w-full h-full object-cover top-0 left-0 z-50 fixed"
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
                    className="imagebox w-full h-full object-cover top-0 left-0 z-50 fixed"
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

  );
};

export default Defaultmedia;
