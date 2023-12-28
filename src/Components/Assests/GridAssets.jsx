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
import { BsFillCameraVideoFill, BsImage, BsThreeDots } from "react-icons/bs";
import "../../Styles/assest.css";
import { FiDownload, FiUpload } from "react-icons/fi";
import { RiDeleteBin5Line, RiDeleteBin6Line } from "react-icons/ri";
import { CgMoveRight } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { HiDocument, HiOutlineVideoCamera } from "react-icons/hi2";
import { RiGalleryFill } from "react-icons/ri";
import { HiDocumentDuplicate, HiDotsVertical } from "react-icons/hi";

import {
  ALL_FILES_UPLOAD,
  CREATE_NEW_FOLDER,
  DeleteAllData,
  GET_ALL_FILES,
  MOVE_TO_FOLDER,
  SELECT_BY_ASSET_ID,
  SIGNAL_R,
} from "../../Pages/Api";
import { FcFolder, FcOpenedFolder, FcVideoFile } from "react-icons/fc";
import moment from "moment";
import toast from "react-hot-toast";
import ShowAssetImageModal from "./ShowAssetImageModal";
import ScreenAssignModal from "../ScreenAssignModal";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
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

const Assets = ({ sidebarOpen, setSidebarOpen }) => {
  Assets.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  // move to data in folder

  const [isMoveToOpen, setIsMoveToOpen] = useState(false);
  const [asstab, setTogglebtn] = useState(2);
  const [hoveredTabIcon, setHoveredTabIcon] = useState(null);
  const [assetsdw, setassetsdw] = useState(null);
  const [assetsdw2, setassetsdw2] = useState(null);
  const [selectedItems, setSelectedItems] = useState();
  const [originalData, setOriginalData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [deleteAssetID, setDeleteAssetID] = useState();
  const [showImageAssetModal, setShowImageAssetModal] = useState(false);
  const [imageAssetModal, setImageAssetModal] = useState(null);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [connection, setConnection] = useState(null);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [FolderDisable, setFolderDisable] = useState(false);
  const [searchAsset, setSearchAsset] = useState(""); // used
  const [filteredAssetData, setFilteredAssetData] = useState([]);

  const [selectdata, setSelectData] = useState({});

  const selectedScreenIdsString = Array.isArray(selectedScreens)? selectedScreens.join(",") : "";

  const [clickedTabIcon, setClickedTabIcon] = useState(null);

  const actionBoxRef = useRef(null);
  const addScreenRef = useRef(null);
  const { token } = useSelector((state) => state.root.auth);

  const [screenAssetID, setScreenAssetID] = useState();
  const authToken = `Bearer ${token}`;

  const history = useNavigate();
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(SIGNAL_R)
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.on("ScreenConnected", (screenConnected) => {
      // console.log("ScreenConnected", screenConnected);
    });

    newConnection
      .start()
      .then(() => {
        // console.log("Connection established");
        setConnection(newConnection);
      })
      .catch((error) => {
        console.error("Error starting connection:", error);
      });

    return () => {
      if (newConnection) {
        newConnection
          .stop()
          .then(() => {
            // console.log("Connection stopped");
          })
          .catch((error) => {
            console.error("Error stopping connection:", error);
          });
      }
    };
  }, []);

  const handleUpdateScreenAssign = () => {

    if (selectedScreenIdsString === "") {
      toast.remove();
      return toast.error("Please Select Screen.");
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/AssetMaster/AssignAssetToScreen?AssetId=${screenAssetID}&ScreenID=${selectedScreenIdsString}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          toast.success("Asset added to Screen Successfully");
          setLoadFist(true);
          if (connection) {
            connection
              .invoke("ScreenConnected")
              .then(() => {
                // console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setSelectScreenModal(false);
          setAddScreenModal(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatetoggle = (id) => {
    setTogglebtn(id);
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
    setDeleteAssetID(item.assetID);
    setScreenAssetID(item.assetID);
    if (assetsdw === item) {
      setassetsdw(null);
    } else {
      setassetsdw(item);
    }
  };

  const updateassetsdw2 = (item) => {
    setDeleteAssetID(item.assetID);
    setScreenAssetID(item.assetID);
    if (assetsdw2 === item) {
      setassetsdw2(null);
    } else {
      setassetsdw2(item);
    }
    setIsMoveToOpen(false)
  };

  const fetchData = () => {
    setLoading(true);
    axios
      .get(GET_ALL_FILES, { headers: { Authorization: authToken } })
      .then((response) => {
        const fetchedData = response.data;
        setOriginalData(fetchedData);

        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
          ...(fetchedData.folder ? fetchedData.folder : []),
        ];
        // console.log(allAssets);
        const sortedAssets = allAssets
          // .filter((asset) => {
          //   if (asset.assetType != "Folder") {
          //     return asset;
          //   }
          // })
          .sort((a, b) => {
            return new Date(b.createdDate) - new Date(a.createdDate);
          });
        // console.log(sortedAssets);
        const data = [];

        sortedAssets.map((arr, i) => {
          if (arr?.assetType === "Folder") {
            return data.unshift(arr);
          } else {
            return data.push(arr);
          }
        });

        // console.log(data);
        setGridData(data);
        setLoading(false);
        setFolderDisable(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleActiveBtnClick = (btnNumber) => {
    // setActivetab(btnNumber);
    const gridData = [];

    if (btnNumber === 1) {
      const allAssets = [
        ...(originalData.image ? originalData.image : []),
        ...(originalData.video ? originalData.video : []),
        ...(originalData.doc ? originalData.doc : []),
        ...(originalData.onlineimages ? originalData.onlineimages : []),
        ...(originalData.onlinevideo ? originalData.onlinevideo : []),
        ...(originalData.folder ? originalData.folder : []),
      ];
      setGridData(allAssets);

      // fetchData();
    } else if (btnNumber === 2) {
      if (originalData.image) {
        gridData.push(...originalData.image);
      }

      if (originalData.onlineimages) {
        gridData.push(...originalData.onlineimages);
      }
      setGridData(gridData);
    } else if (btnNumber === 3) {
      if (originalData.video) {
        gridData.push(...originalData.video);
      }

      if (originalData.onlinevideo) {
        gridData.push(...originalData.onlinevideo);
      }
      setGridData(gridData);
    } else if (btnNumber === 4) {
      setGridData(originalData.doc ? originalData.doc : []);
    } else if (btnNumber === 5) {
      if (originalData?.folder) {
        gridData.push(...originalData.folder);
        setGridData(gridData);
      }
    }
  };

  const folderNameExists = (name) => {
    return originalData.folder.some((folder) => folder.assetName === name);
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
    moveDataToFolder(selectedItems?.assetID,folderId,selectedItems?.assetType);
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
    if (Number(itemId) !== folderId) {
      moveDataToFolder(itemId, folderId, asset_type);
    }
  };

  const navigateToFolder = (folderId, selectedData) => {
    history(`/NewFolderDialog/${folderId}`, { selectedData });
  };

  useEffect(() => {
    // fetchData();
    // handleActiveBtnClick(1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionBoxRef.current &&
        !actionBoxRef.current.contains(event?.target)
      ) {
        setassetsdw(null);
        setassetsdw2(null);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setassetsdw2(null);
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
      toast.loading("Please wait...")
      dispatch(handleGetAllAssetsTypeBase({ config }))
      .then(() => {
        setFolderDisable(false);
        setOriginalData(store.data);
        setLoadFist(false);
      })
      .finally(() => toast.remove());
    }
  }, [loadFist, activeTab, searchAsset.store, store.data, store.folders]);


  useEffect(() => {
    if (store && store.status === "succeeded") {
      toast.success(store.message);
      setLoadFist(true);
      setFolderDisable(false)
      dispatch(resetStatus());
    }

    if (store && store.status === "failed") {
      toast.error(store.error); // Assuming you store the error message in the error property
    }
  }, [store]);


  useEffect(() => {
    if (store.folders && store.folders.length > 0) {
      const filteredFolders = store.folders.filter(folder => selectedItems?.assetID !== folder.assetID);
      setFolderElements(filteredFolders);
    } else {
      console.log('No folders, create a new folder.');
    }

  }, [store.folders, selectedItems]);


  const cardTableDisplay = () => {
    navigate("/assets");
  };

  const handleTabClick = (tab) => {
    localStorage.setItem("tabs", tab);
      setActiveTab(tab);
      setLoadFist(true);
  };


  const handleSearchAsset = (event) => {
    toast.loading("Searching...")
    const searchQuery = event.target.value;
    setSearchAsset(searchQuery);
    setLoadFist(true);
    setTimeout(() => {
      toast.remove()
    }, 1000);
  };

  const checkFolderImage = async (assetId) => {
    try {
      setLoadFist(true)
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${SELECT_BY_ASSET_ID}?Id=${assetId}&AssetType=Image`,
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

  const checkFolder = async (assetId) => {
    try {
      setLoadFist(true)
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
      toast.loading("please wait....") 
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
    }finally {
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
        headers: {"Content-Type": "multipart/form-data",Authorization: authToken,},data: formData};

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
            setLoadFist(true); // Trigger your action on cancel
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
    setGridData(updatedAsset);

    // Check if all checkboxes are checked or not
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
        setLoadFist(true); // Trigger your action on cancel
        setSelectAll(false);
      }
    });
  };

  const createFolder = async () => {

    let folderNameToCheck = "New Folder";

    const formData = new FormData();
    formData.append("operation", "Insert");
    formData.append("folderName", folderNameToCheck);
    // formData.append("folderNumber", Number(folderNumber));

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

const moveTo = (item) =>{
  toggleMoveTo()
  setSelectedItems(item)
}

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

      <div className="pt-24 px-5 page-contain">
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
                  // value={searchAsset}
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
                      asstab === 1 ? "tabshow tabassactive " : "asstab"
                    }
                    onClick={() => cardTableDisplay()}
                  >
                    <RxDashboard className="text-primary text-lg" />
                  </button>
                </li>
                <li className="flex items-center ">
                  <button
                    className={
                      asstab === 2 ? "tabshow tabassactive right " : "asstab "
                    }
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
              <button className="flex align-middle text-white items-center  rounded-full p-2 text-base">
                <input
                  type="checkbox"
                  className="w-7 h-6"
                  checked={selectAll}
                  onChange={() => handleSelectAll()}
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
            <div
              className={
                asstab === 2
                  ? "show-togglecontent active w-full tab-details mt-10"
                  : "togglecontent"
              }
            >
              <div className="page-content grid  gap-8 mb-5 assets-section">
                <div className="relative list-none assetsbox">
                  <div class="relative shadow-md sm:rounded-lg">
                    <table
                      cellPadding={20}
                      class="w-full text-sm lg:table-auto text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="items-center border-b border-b-[#E4E6FF] bg-gray-50 table-head-bg">
                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                            Preview
                          </th>
                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                            Name
                          </th>

                          {activeTab === "ALL" && (
                            <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                              Duration
                            </th>
                          )}

                          {activeTab === "VIDEO" && (
                            <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                              Duration
                            </th>
                          )}

                          {activeTab !== "FOLDER" && (
                            <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                              Resolution
                            </th>
                          )}

                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                            Type
                          </th>
                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                            Size
                          </th>
                          <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      {store && store.data && store.data.length > 0 ? (
                        <tbody>
                          {store.data.map((item, index) => (
                            <tr
                              key={index}
                              className="mt-7 hover:bg-gray-50 dark:hover:bg-gray-600 bg-white rounded-lg border border-gray-200 dark:border-gray-700 shadow font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                              draggable
                              onDragStart={(event) =>
                                handleDragStart(event, item.assetID, item)
                              }
                            >
                              <td className="text-center flex justify-center">
                                {item.assetType === "Folder" && (
                                  <div
                                    onDragOver={(event) =>
                                      handleDragOver(event)
                                    }
                                    onDrop={(event) =>
                                      handleDrop(event, item.assetID)
                                    }
                                    className="text-center relative list-none rounded-md flex justify-center items-center flex-col h-full "
                                  >
                                    <FcOpenedFolder
                                      className="text-8xl text-center mx-auto"
                                      onClick={() =>
                                        navigateToFolder(item.assetID)
                                      }
                                    />
                                    {editMode === item.assetID ? (
                                      <input
                                        type="text"
                                        value={folderName}
                                        className="w-full"
                                        onChange={(e) =>
                                          setFolderName(e.target.value)
                                        }
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
                                  <div className="img-cover ivratio img-cover-ratio text-center">
                                    <div>
                                      <img
                                        src={item.assetFolderPath}
                                        alt={item.assetName}
                                        onClick={() => {
                                          setShowImageAssetModal(true);
                                          setImageAssetModal(item);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {item.assetType === "Video" && (
                                  <div className="img-cover ivratio img-cover-ratio">
                                    <div>
                                      <video
                                        controls
                                        onClick={() => {
                                          setShowImageAssetModal(true);
                                          setImageAssetModal(item);
                                        }}
                                      >
                                        <source
                                          src={item.assetFolderPath}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    </div>
                                  </div>
                                )}

                                {item.assetType === "OnlineImage" && (
                                  <div className="img-cover ivratio img-cover-ratio text-center">
                                    <div>
                                      <img
                                        src={item.assetFolderPath}
                                        onClick={() => {
                                          setShowImageAssetModal(true);
                                          setImageAssetModal(item);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {item.assetType === "OnlineVideo" && (
                                  <div className="img-cover ivratio img-cover-ratio">
                                    <div>
                                      <video
                                        controls
                                        onClick={() => {
                                          setShowImageAssetModal(true);
                                          setImageAssetModal(item);
                                        }}
                                      >
                                        <source
                                          src={item.assetFolderPath}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    </div>
                                  </div>
                                )}

                                {item.assetType === "DOC" && (
                                  <div className="items-center flex justify-center">
                                    <HiDocumentDuplicate className=" text-primary text-4xl mt-10 " />
                                  </div>
                                )}
                              </td>

                              <td className="text-center break-words">
                                {item.assetType === "Folder" && item.assetName}
                              </td>

                              <>
                                {activeTab === "ALL" && (
                                  <td className="text-center">
                                    {item.durations}
                                  </td>
                                )}

                                {activeTab === "VIDEO" && (
                                  <td className="text-center">
                                    {item.durations}
                                  </td>
                                )}
                                {activeTab !== "FOLDER" && (
                                  <td className="text-center">
                                    {item.resolutions}
                                  </td>
                                )}
                              </>

                              <td className=" break-all max-w-sm text-center">
                                {item.assetType}
                              </td>
                              <td className="text-center">{item.fileSize}</td>

                              <td className="text-center relative">
                                <div className="relative">
                                  <button
                                    onClick={() => updateassetsdw2(item)}
                                    className="ml-3 relative"
                                  >
                                    <HiDotsVertical />
                                  </button>

                                  {assetsdw2 === item && (
                                    <div
                                      ref={actionBoxRef}
                                      className="scheduleAction z-10"
                                    >
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
                                          <li className="flex text-sm items-center">
                                            <div className="move-to-button relative">
                                              <button
                                                className="flex relative w-full"
                                                onClick={() => {
                                                  setAddScreenModal(true);
                                                  setassetsdw(null);
                                                }}
                                              >
                                                <FiUpload className="mr-2 text-lg" />
                                                Set to Screen
                                              </button>
                                            </div>
                                          </li>
                                        )}

                                        <li className="flex text-sm items-center relative">
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
                                                    folderElements?.map(
                                                      (folder) => {
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
                                                                {
                                                                  folder.assetName
                                                                }
                                                              </button>
                                                            </>
                                                          </li>
                                                        );
                                                      }
                                                    )
                                                  ) : (
                                                    <li className="w-full">
                                                      No folders, create a new
                                                      folder.
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
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <div className="text-center font-semibold text-2xl col-span-full p-5">
                          {store?.data?.length === 0 ? (
                            <div className="text-center">Data not Found!</div>
                          ) : (
                            <> Loading... </>
                          )}
                        </div>
                      )}
                    </table>
                  </div>
                </div>
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