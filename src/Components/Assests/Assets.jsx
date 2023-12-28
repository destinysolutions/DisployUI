import React, { useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TiFolderOpen } from "react-icons/ti";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineUnorderedList,
  AiOutlineSearch,
} from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import "../../Styles/assest.css";
import { FiDownload, FiUpload } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CgMoveRight } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiGalleryFill } from "react-icons/ri";
import { HiDocumentDuplicate } from "react-icons/hi";

import {
  ALL_FILES_UPLOAD,
  CREATE_NEW_FOLDER,
  MOVE_TO_FOLDER,
  SELECT_BY_ASSET_ID,
} from "../../Pages/Api";
import { FcOpenedFolder } from "react-icons/fc";
import moment from "moment";
import toast from "react-hot-toast";
import ShowAssetImageModal from "./ShowAssetImageModal";
import ScreenAssignModal from "../ScreenAssignModal";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  handelAllDelete,
  handelCreateFolder,
  handelDeletedataAssets,
  handelMoveDataToFolder,
  handleCheckFolderImage,
  handleDeleteFolder,
  handleGetAllAssetsTypeBase,
  resetStatus,
} from "../../Redux/Assetslice";
import { debounce } from "lodash";
import { connection } from "../../SignalR";

const Assets = ({ sidebarOpen, setSidebarOpen }) => {
  Assets.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  // move to data in folder

  const [isMoveToOpen, setIsMoveToOpen] = useState(false);
  const [asstab, setTogglebtn] = useState(1);
  const [hoveredTabIcon, setHoveredTabIcon] = useState(null);
  const [assetsdw, setassetsdw] = useState(null);
  const [selectedItems, setSelectedItems] = useState();
  const [folderName, setFolderName] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [showImageAssetModal, setShowImageAssetModal] = useState(false);
  const [imageAssetModal, setImageAssetModal] = useState(null);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [FolderDisable, setFolderDisable] = useState(false);
  const [searchAsset, setSearchAsset] = useState("");
  const [selectdata, setSelectData] = useState({});
  const [clickedTabIcon, setClickedTabIcon] = useState(null);

  const actionBoxRef = useRef(null);
  const addScreenRef = useRef(null);
  const { token } = useSelector((state) => state.root.auth);

  const [screenAssetID, setScreenAssetID] = useState();
  const authToken = `Bearer ${token}`;

  const history = useNavigate();

  const handleUpdateScreenAssign = (screenIds, macids) => {
    let idS = "";
    for (const key in screenIds) {
      if (screenIds[key] === true) {
        idS += `${key},`;
      }
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/AssetMaster/AssignAssetToScreen?AssetId=${screenAssetID}&ScreenID=${idS}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          if (connection.state == "Disconnected") {
            connection
              .start()
              .then((res) => {
                console.log("signal connected");
              })
              .then(() => {
                connection
                  .invoke("ScreenConnected", macids)
                  .then(() => {
                    console.log(" method invoked");
                    setSelectScreenModal(false);
                    setAddScreenModal(false);
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke("ScreenConnected", macids)
              .then(() => {
                console.log(" method invoked");
                setSelectScreenModal(false);
                setAddScreenModal(false);
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handleIconClick = (item) => {
    // Toggle the visibility of the details for the clicked item
    if (clickedTabIcon === item) {
      setClickedTabIcon(null); // If the same item is clicked again, hide its details
    } else {
      setClickedTabIcon(item); // Otherwise, show the details of the clicked item
      setassetsdw(null);
    }
  };

  const updateassetsdw = (item) => {
    if (isMoveToOpen) {
      setIsMoveToOpen(false);
    }
    setScreenAssetID(item.assetID);
    if (assetsdw === item) {
      setassetsdw(null);
    } else {
      setassetsdw(item);
    }
  };

  const handleKeyDown = (e, folderID) => {
    if (e.key === "Enter") {
      saveFolderName(folderID, folderName.trim());
    } else if (e.key === "Escape") {
      setEditMode(null);
    }
    setLoadFist(true);
  };

  const updateFolderNameInAPI = async (folderID, newName) => {
    if (!newName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter a character");
    }
    try {
      const formData = new FormData();
      formData.append("folderID", folderID);
      formData.append("operation", "Update");
      formData.append("folderName", newName);

      const response = await axios.post(CREATE_NEW_FOLDER, formData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });
      setLoadFist(true);
      setEditMode(null);
    } catch (error) {
      console.error("Error updating folder name:", error);
      setEditMode(null);
    }
  };

  const saveFolderName = (folderID, newName) => {
    updateFolderNameInAPI(folderID, newName);
  };

  const toggleMoveTo = () => {
    setIsMoveToOpen(!isMoveToOpen);
  };

  const handleMoveTo = (folderId) => {
    moveDataToFolder(
      selectedItems?.assetID,
      folderId,
      selectedItems?.assetType
    );
    setLoadFist(true);
  };

  // dragdrop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, itemId, item) => {
    event.dataTransfer.setData("text/plain", itemId);
    setSelectedItems(item);
  };

  // Function to handle drop into folder
  const handleDrop = (event, folderId) => {
    const itemId = event.dataTransfer.getData("text/plain");
    let asset_type = selectedItems.assetType == "Folder" ? "Folder" : "Image";
    if (Number(itemId) === folderId && asset_type !== "Folder") {
      moveDataToFolder(itemId, folderId, asset_type);
    }
  };

  const navigateToFolder = (folderId, selectedData) => {
    history(`/NewFolderDialog/${folderId}`, { selectedData });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionBoxRef.current &&
        !actionBoxRef.current.contains(event?.target)
      ) {
        setassetsdw(null);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setassetsdw(null);
  }

  // Start
  // get tabs New change
  const tabs = localStorage.getItem("tabs");
  const [loadFist, setLoadFist] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs ? tabs : "ALL"); // Set the default active tab
  const [tabsDelete, setTabsDelete] = useState(Array);
  const [folderElements, setFolderElements] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const store = useSelector((state) => state.root.asset);

  useEffect(() => {
    const query = `ScreenType=${activeTab}&searchAsset=${searchAsset}`;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/AssetMaster/GetAssetDetails?${query}`,
      headers: { "Content-Type": "application/json", Authorization: authToken },
      data: query,
    };

    if (loadFist) {
      dispatch(handleGetAllAssetsTypeBase({ config })).then(() => {
        setFolderDisable(false);
        setLoadFist(false);
      });
    }
  }, [loadFist, activeTab, searchAsset.store, store.data, store.folders]);

  useEffect(() => {
    if (store && store.status === "succeeded") {
      toast.success(store.message);
      setLoadFist(true);
      setFolderDisable(false);
      dispatch(resetStatus());
    }

    if (store && store.status === "failed") {
      toast.error(store.error); // Assuming you store the error message in the error property
    }
  }, [store]);

  useEffect(() => {
    if (store.folders && store.folders.length > 0) {
      const filteredFolders = store.folders.filter(
        (folder) => selectedItems?.assetID !== folder.assetID
      );
      setFolderElements(filteredFolders);
    } else {
      console.log("No folders, create a new folder.");
    }
  }, [store.folders, selectedItems]);

  const gridTableDisplay = () => {
    navigate("/assets-grid");
  };

  const handleTabClick = (tab) => {
    localStorage.setItem("tabs", tab);
    setActiveTab(tab);
    setLoadFist(true);
  };

  const handleSearchAsset = (event) => {
    const searchQuery = event.target.value;
    setSearchAsset(searchQuery);
    setLoadFist(true);
  };

  const checkFolderImage = async (assetId) => {
    try {
      setLoadFist(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${SELECT_BY_ASSET_ID}?Id=${assetId}&AssetType=Image`,
        headers: { Authorization: authToken },
      };
      const response = await dispatch(handleCheckFolderImage({ config }));
      return response.payload;
    } catch (error) {
      console.error("Error in checkFolderImage:", error);
      throw error; // Rethrow the error to handle it outside this function
    }
  };

  const checkFolder = async (assetId) => {
    try {
      setLoadFist(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${SELECT_BY_ASSET_ID}?Id=${assetId}&AssetType=Folder`,
        headers: { Authorization: authToken },
      };
      const response = await dispatch(handleCheckFolderImage({ config }));
      return response.payload;
    } catch (error) {
      // Handle errors if needed
      console.error("Error in checkFolderImage:", error);
      throw error; // Rethrow the error to handle it outside this function
    }
  };

  const deleteFolder = async (folderID) => {
    try {
      const dataPayload = { folderID: folderID, operation: "Delete" };
      const checkImage = await checkFolder(folderID);
      const config2 = {
        method: "post",
        maxBodyLength: Infinity,
        url: CREATE_NEW_FOLDER,
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        data: dataPayload,
      };
      if (checkImage.data) {
        Swal.fire({
          title: "Delete Confirmation",
          text: checkImage.message,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "No, cancel",
          confirmButtonText: "Yes, Im sure",
          customClass: {
            text: "swal-text-bold",
            content: "swal-text-color",
            confirmButton: "swal-confirm-button-color", // Apply custom color and style
          },
          confirmButtonColor: "#ff0000",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await dispatch(handleDeleteFolder({ config2 }));
          } else {
            setLoadFist(true); // Trigger your action on cancel
          }
        });
      } else {
        await dispatch(handleDeleteFolder({ config2 }));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadFist(true);
    }
  };

  const handleWarning = async (assetId) => {
    try {
      const checkImage = await checkFolderImage(assetId);
      const formData = new FormData();
      formData.append("AssetID", assetId);
      formData.append("Operation", "Delete");
      formData.append("IsActive", "true");
      formData.append("IsDelete", "true");
      formData.append("FolderID", "0");
      formData.append("UserID", "0");
      formData.append("AssetType", "Image");
      formData.append("IsDeleteFromALL", checkImage.data);

      const config2 = {
        method: "post",
        maxBodyLength: Infinity,
        url: ALL_FILES_UPLOAD,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: authToken,
        },
        data: formData,
      };

      if (checkImage.data) {
        Swal.fire({
          title: "Delete Confirmation",
          text: checkImage.message,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "No, cancel",
          confirmButtonText: "Yes, I'm sure",
          customClass: {
            text: "swal-text-bold",
            content: "swal-text-color",
            confirmButton: "swal-confirm-button-color",
          },
          confirmButtonColor: "#ff0000",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await dispatch(handelDeletedataAssets(config2));
          } else {
            setLoadFist(true);
          }
        });
      } else {
        const config2 = {
          method: "post",
          maxBodyLength: Infinity,
          url: ALL_FILES_UPLOAD,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authToken,
          },
          data: formData,
        };
        await dispatch(handelDeletedataAssets(config2));
      }
    } catch (error) {
      console.error("Error in handleWarning:", error);
    }
  };

  const handleSelectAll = () => {
    const updatedAsset = store.data.map((asset) => ({
      ...asset,
      isChecked: !selectAll,
    }));

    // Get the IDs of all selected assets
    const selectedIds = updatedAsset
      .filter((asset) => asset.isChecked)
      .map((asset) => asset.assetID);
    const payload = {
      tabs: activeTab,
      selectedIds: selectedIds,
    };
    console.log("Selected IDs:", payload);
    setTabsDelete(payload);
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (assetID) => {
    const updatedAsset = store.data.map((asset) =>
      asset.assetID === assetID
        ? { ...asset, isChecked: !asset.isChecked }
        : asset
    );
    const allChecked = updatedAsset.every((asset) => asset.isChecked);
    setSelectAll(allChecked);
  };

  const handleDeleteAll = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/AssetMaster/DeleteAllAsset?IsDeleteFromAll=true&AssetType=${activeTab}`,
      headers: { Authorization: authToken },
    };

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        text: "swal-text-bold",
        content: "swal-text-color",
        confirmButton: "swal-confirm-button-color",
      },
      confirmButtonColor: "#ff0000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(handelAllDelete(config));
        setSelectAll(false);
      } else {
        setLoadFist(true);
        setSelectAll(false);
      }
    });
  };

  const createFolder = async () => {
    setFolderDisable(true);
    let folderNameToCheck = "New Folder";

    const formData = new FormData();
    formData.append("operation", "Insert");
    formData.append("folderName", folderNameToCheck);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: CREATE_NEW_FOLDER,
      headers: { "Content-Type": "application/json", Authorization: authToken },
      data: formData,
    };
    try {
      await dispatch(handelCreateFolder(config));
    } catch (error) {
      console.error(" -- createFolder -- Error creating folder:", error);
    }
  };

  const moveTo = (item) => {
    toggleMoveTo();
    setSelectedItems(item);
  };

  const moveDataToFolder = async (dataId, folderId, assetType) => {
    let data = JSON.stringify({
      folderID: folderId,
      assetID: dataId,
      type: assetType === "Folder" ? "Folder" : "Image",
      operation: "Insert",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: MOVE_TO_FOLDER,
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      data: data,
    };

    try {
      await dispatch(handelMoveDataToFolder(config));
    } catch (error) {
      toast.remove();
      console.error(error);
    } finally {
      setIsMoveToOpen(false);
    }
  };

  const debouncedOnChange = debounce(handleSearchAsset, 1000);

  return (
    <>
      {showImageAssetModal && (
        <ShowAssetImageModal
          setImageAssetModal={setImageAssetModal}
          setShowImageAssetModal={setShowImageAssetModal}
          showImageAssetModal={showImageAssetModal}
          imageAssetModal={imageAssetModal}
        />
      )}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>

      <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
              Assets
            </h1>
            <div className=" flex-wrap flex  lg:mt-0 md:mt-0 sm:mt-3">
              <div className="relative pr-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search Asset"
                  className="border border-primary rounded-full pl-10 py-2 search-user"
                  onChange={debouncedOnChange}
                />
              </div>
              <button
                className=" dashboard-btn lg:mt-0 md:mt-0 sm:mt-3 flex align-middle border-white text-white bg-SlateBlue items-center border rounded-full lg:px-6 sm:px-2 py-2 xs:px-1 text-base sm:text-sm xs:mr-1 mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={createFolder}
                disabled={FolderDisable}
              >
                <TiFolderOpen className="text-2xl rounded-full mr-1  text-white p-1" />
                New Folder
              </button>
              <Link to={"/FileUpload"}>
                <button className=" dashboard-btn lg:mt-0 md:mt-0 sm:mt-3 flex align-middle items-center  rounded-full  text-base border border-white text-white bg-SlateBlue lg:px-9 sm:px-2   xs:px-1 xs:mr-1 mr-3  py-2 sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <AiOutlineCloudUpload className="text-2xl rounded-full mr-1  text-white p-1" />
                  Upload
                </button>
              </Link>

              <ul className="flex items-center  xs:mt-2 sm:mt-2 md:mt-0 lg:mt-0 xs:mr-1 mr-3 rounded-full border-2 border-SlateBlue">
                <li className="flex items-center ">
                  <button
                    className={
                      asstab === 1 ? "tabshow tabassactive " : "asstab "
                    }
                  >
                    <RxDashboard className="text-primary text-lg" />
                  </button>
                </li>
                <li className="flex items-center ">
                  <button
                    className={asstab === 2 ? "tabshow right " : "asstab "}
                    onClick={() => gridTableDisplay()}
                  >
                    <AiOutlineUnorderedList className="text-primary text-lg" />
                  </button>
                </li>
              </ul>
              <button
                className="p-3 rounded-full text-base bg-red sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={handleDeleteAll}
                style={{ display: selectAll ? "block" : "none" }}
              >
                <RiDeleteBin5Line className="text-lg" />
              </button>
              <button className="flex align-middle   text-white items-center  rounded-full p-2 text-base">
                <input
                  type="checkbox"
                  className="w-7 h-6"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </button>
            </div>
          </div>

          <div className="tabs lg:mt-5 md:mt-5  sm:mt-5 xs:mt-0">
            <button
              className={activeTab === "ALL" ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleTabClick("ALL")}
            >
              All
            </button>
            <button
              className={activeTab === "IMAGE" ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleTabClick("IMAGE")}
            >
              Images
            </button>
            <button
              className={activeTab === "VIDEO" ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleTabClick("VIDEO")}
            >
              Video
            </button>
            <button
              className={activeTab === "DOCUMENT" ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleTabClick("DOCUMENT")}
            >
              Doc
            </button>
            <button
              className={activeTab === "FOLDER" ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleTabClick("FOLDER")}
            >
              Folder
            </button>

            {/* start grid view  */}
            <div className="show-togglecontent active w-full tab-details mt-10">
              <div
                className={
                  "page-content grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section"
                }
              >
                {store && store.data && store.data.length > 0 ? (
                  store.data.map((item, index) => (
                    <div key={index} className="relative list-none assetsbox">
                      <li
                        key={index}
                        draggable
                        onDragStart={(event) =>
                          handleDragStart(event, item.assetID, item)
                        }
                        className="relative list-none assetsbox"
                      >
                        {item.assetType === "Folder" && (
                          <div
                            onDragOver={(event) => handleDragOver(event)}
                            onDrop={(event) => handleDrop(event, item.assetID)}
                            className="text-center relative list-none bg-lightgray rounded-md px-3 py-7 flex justify-center items-center flex-col h-full shadow border border-gray-200 dark:border-gray-700"
                          >
                            <FcOpenedFolder
                              className="text-8xl text-center mx-auto"
                              onClick={() => navigateToFolder(item.assetID)}
                            />
                            {editMode === item.assetID ? (
                              <input
                                type="text"
                                value={folderName}
                                className="w-full"
                                onChange={(e) => setFolderName(e.target.value)}
                                onBlur={() => {
                                  setEditMode(null);
                                }}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, item.assetID, index)
                                }
                                autoFocus
                              />
                            ) : (
                              <>
                                <span
                                  onClick={() => {
                                    setEditMode(item?.assetID);
                                    setFolderName(item?.assetName);
                                  }}
                                  className="cursor-pointer w-full flex-wrap break-all inline-flex justify-center"
                                >
                                  {item.assetName}
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {item.assetType === "Image" && (
                          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <img
                              className="h-auto max-w-full rounded-t-lg"
                              src={item.assetFolderPath}
                              alt={item.assetName}
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            />
                          </div>
                        )}

                        {item.assetType === "OnlineImage" && (
                          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <img
                              className="h-auto max-w-full rounded-t-lg"
                              src={item.assetFolderPath}
                              alt={item.assetName}
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            />
                          </div>
                        )}

                        {item.assetType === "OnlineVideo" && (
                          <div className="max-w-sm bg-white border border-slate-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <video
                              controls
                              className="w-full relative rounded-lg h-56 border border-slate-200"
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            >
                              <source
                                src={item.assetFolderPath}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}

                        {item.assetType === "Video" && (
                          <div className="max-w-sm bg-white border border-slate-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <video
                              controls
                              className="w-full relative h-56 rounded-lg border border-slate-200"
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            >
                              <source
                                src={item.assetFolderPath}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}

                        {item.assetType === "DOC" && (
                          <div className="bg-white px-4 py-5 rounded-lg shadow-lg h-full break-words">
                            {item.assetType === "DOC" && (
                              <HiDocumentDuplicate className=" text-primary text-4xl mt-10 " />
                            )}
                            {item.assetType === "DOC" && (
                              <a
                                href={item.assetFolderPath}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.assetName}
                              </a>
                            )}
                            {item.assetType === "DOC" && <p>{item.details}</p>}
                          </div>
                        )}

                        {/* Start Icon display */}
                        <div
                          className="tabicon text-center absolute left-2/4 bottom-[0px] z-10"
                          onMouseEnter={() => setHoveredTabIcon(item)}
                          onMouseLeave={() => setHoveredTabIcon(null)}
                          onClick={() => handleIconClick(item)}
                        >
                          {item.assetType === "Image" && (
                            <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {item.assetType === "Video" && (
                            <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {item.assetType === "OnlineImage" && (
                            <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {item.assetType === "OnlineVideo" && (
                            <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}
                        </div>
                        {/* End Icon display */}

                        {/*start hover icon details */}
                        {hoveredTabIcon === item && (
                          <div className="vdetails">
                            <div className="flex justify-end"></div>
                            <div className="text-center clickdetail">
                              <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs mb-1 break-words">
                                {item.assetName}
                              </h3>
                              <p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                Uploaded By {item.userName}
                              </p>
                              <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                                {moment(item.createdDate).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </h6>
                              <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {item.assetType}
                              </span>
                              <span>,</span>
                              <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {item.fileSize}
                              </h6>

                              <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {item.resolutions}
                              </span>
                            </div>
                          </div>
                        )}
                        {/*End hover icon details */}

                        <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                          <input
                            type="checkbox"
                            className="w-[20px] h-[20px] relative"
                            style={{ display: selectAll ? "block" : "none" }}
                            checked={selectAll || false}
                            onChange={() => handleCheckboxChange(item.assetID)}
                          />

                          <div
                            style={{
                              float: "right",
                              width: "100%",
                              textAlign: "right",
                            }}
                          >
                            <button
                              onClick={() => updateassetsdw(item)}
                              className="relative"
                            >
                              <BsThreeDots className="text-xl bg-SlateBlue rounded" />
                            </button>

                            {assetsdw === item && (
                              <div ref={actionBoxRef} className="assetsdw">
                                <ul className="space-y-2">
                                  {item.assetType !== "Folder" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a
                                        href={item.assetFolderPath}
                                        target="_blank"
                                        download
                                      >
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  {item.assetType !== "Folder" && (
                                    <li className="flex text-sm items-center relative w-full">
                                      <div className="move-to-button relative">
                                        <button
                                          className="flex relative w-full"
                                          onClick={() => {
                                            setAddScreenModal(true);
                                            setassetsdw(null);
                                            setSelectData(item);
                                          }}
                                        >
                                          <FiUpload className="mr-2 text-lg" />
                                          Set to Screen
                                        </button>
                                      </div>
                                    </li>
                                  )}

                                  <li className="flex text-sm items-center relative w-full">
                                    <div className="move-to-button relative">
                                      <button
                                        onClick={() => moveTo(item)}
                                        className="flex relative w-full"
                                      >
                                        <CgMoveRight className="mr-2 text-lg" />
                                        Move to
                                      </button>
                                      {isMoveToOpen && (
                                        <div className="move-to-dropdown">
                                          <ul className="space-y-3">
                                            {folderElements &&
                                            folderElements?.length > 0 ? (
                                              folderElements?.map((folder) => {
                                                return (
                                                  <li
                                                    key={folder.assetID}
                                                    className="hover:bg-black hover:text-white text-left"
                                                  >
                                                    <>
                                                      <button
                                                        className="break-words w-32"
                                                        onClick={() =>
                                                          handleMoveTo(
                                                            folder.assetID
                                                          )
                                                        }
                                                      >
                                                        {folder.assetName}
                                                      </button>
                                                    </>
                                                  </li>
                                                );
                                              })
                                            ) : (
                                              <li className="w-full">
                                                No folders, create a new folder.
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                  {item.assetType === "Folder" ? (
                                    <li>
                                      <button
                                        onClick={() => {
                                          deleteFolder(item.assetID);
                                        }}
                                        className="flex text-sm items-center"
                                      >
                                        <RiDeleteBin5Line className="mr-2 text-lg" />
                                        Move to Trash
                                      </button>
                                    </li>
                                  ) : (
                                    <li>
                                      <button
                                        onClick={() => {
                                          handleWarning(item.assetID);
                                        }}
                                        className="flex text-sm items-center"
                                      >
                                        <RiDeleteBin5Line className="mr-2 text-lg" />
                                        Move to Trash
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                      {/* start grid view  */}
                    </div>
                  ))
                ) : (
                  <div className="text-center font-semibold text-2xl col-span-full">
                    {store?.data?.length === 0 ? (
                      <> Data not Found! </>
                    ) : (
                      <> Loading... </>
                    )}
                  </div>
                )}
              </div>

              {/* Model */}
              {selectScreenModal && (
                <ScreenAssignModal
                  setAddScreenModal={setAddScreenModal}
                  setSelectScreenModal={setSelectScreenModal}
                  handleUpdateScreenAssign={handleUpdateScreenAssign}
                  selectedScreens={selectedScreens}
                  setSelectedScreens={setSelectedScreens}
                />
              )}

              {addScreenModal && (
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div
                    ref={addScreenRef}
                    className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
                  >
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                        <div className="flex items-center">
                          <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                            Select the screen to set the Asset
                          </h3>
                        </div>
                        <button
                          className="p-1 text-xl ml-8"
                          onClick={() => setAddScreenModal(false)}
                        >
                          <AiOutlineCloseCircle className="text-2xl" />
                        </button>
                      </div>
                      <div className="flex justify-center p-9 ">
                        <p className="break-words w-[280px] text-base text-black text-center">
                          New Asset would be applied. Do you want to proceed?
                        </p>
                      </div>
                      <div className="pb-6 flex justify-center">
                        <button
                          className="bg-primary text-white px-8 py-2 rounded-full"
                          onClick={() => {
                            if (selectdata?.screenIDs) {
                              let arr = [selectdata?.screenIDs];
                              let newArr = arr[0]
                                .split(",")
                                .map((item) => parseInt(item.trim()));
                              setSelectedScreens(newArr);
                            }
                            setSelectScreenModal(true);
                            setAddScreenModal(false);
                          }}
                        >
                          OK
                        </button>

                        <button
                          className="bg-primary text-white px-4 py-2 rounded-full ml-3"
                          onClick={() => setAddScreenModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Assets;
