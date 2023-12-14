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
} from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import "../../Styles/assest.css";
import { FiDownload, FiUpload } from "react-icons/fi";
import { RiDeleteBin5Line, RiDeleteBin6Line } from "react-icons/ri";
import { CgMoveRight } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiGalleryFill } from "react-icons/ri";
import { HiDocumentDuplicate, HiDotsVertical } from "react-icons/hi";

import {
  ALL_FILES_UPLOAD,
  CREATE_NEW_FOLDER,
  GET_ALL_FILES,
  MOVE_TO_FOLDER,
  SELECT_BY_ASSET_ID,
  SIGNAL_R,
} from "../../Pages/Api";
import { FcOpenedFolder } from "react-icons/fc";
import { useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import ShowAssetImageModal from "./ShowAssetImageModal";
import ScreenAssignModal from "../ScreenAssignModal";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

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
  const [assetsdw2, setassetsdw2] = useState(null);
  const [selectedItems, setSelectedItems] = useState();
  const [activetab, setActivetab] = useState(1);
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
  const selectedScreenIdsString = Array.isArray(selectedScreens)
    ? selectedScreens.join(",")
    : "";
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

  /* tab2 threedot dwopdown */

  const updateassetsdw2 = (item) => {
    setDeleteAssetID(item.assetID);
    setScreenAssetID(item.assetID);
    if (assetsdw2 === item) {
      setassetsdw2(null);
    } else {
      setassetsdw2(item);
    }
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

        const sortedAssets = allAssets.sort((a, b) => {
          return new Date(b.createdDate) - new Date(a.createdDate);
        });

        setGridData(sortedAssets);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleActiveBtnClick = (btnNumber) => {
    setActivetab(btnNumber);
    const gridData = [];
    const tableData = [];

    if (btnNumber === 1) {
      const allAssets = [
        ...(originalData.image ? originalData.image : []),
        ...(originalData.video ? originalData.video : []),
        ...(originalData.doc ? originalData.doc : []),
        ...(originalData.onlineimages ? originalData.onlineimages : []),
        ...(originalData.onlinevideo ? originalData.onlinevideo : []),
      ];
      setGridData(allAssets);

      fetchData();
    } else if (btnNumber === 2) {
      if (originalData.image) {
        gridData.push(...originalData.image);
        tableData.push(...originalData.image);
      }

      if (originalData.onlineimages) {
        gridData.push(...originalData.onlineimages);
        tableData.push(...originalData.onlineimages);
      }
      setGridData(gridData);
    } else if (btnNumber === 3) {
      if (originalData.video) {
        gridData.push(...originalData.video);
        tableData.push(...originalData.video);
      }

      if (originalData.onlinevideo) {
        gridData.push(...originalData.onlinevideo);
        tableData.push(...originalData.onlinevideo);
      }
      setGridData(gridData);
    } else if (btnNumber === 4) {
      setGridData(originalData.doc ? originalData.doc : []);
    } else if (btnNumber === 5) {
      setGridData(originalData?.folder ? originalData?.folder : []);
    }
  };
  // Delete API

  const handelDeletedata = () => {
    const formData = new FormData();
    formData.append("AssetID", deleteAssetID);
    formData.append("Operation", "Delete");
    formData.append("IsActive", "true");
    formData.append("IsDelete", "true");
    formData.append("FolderID", "0");
    formData.append("UserID", "0");
    formData.append("AssetType", "Image");

    axios
      .post(ALL_FILES_UPLOAD, formData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response?.data?.data === true) {
          const updatedGridData = gridData.filter((item) => {
            return item.assetID !== deleteAssetID;
          });
          setGridData(updatedGridData);
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const createFolder = () => {
    let baseFolderName = "New Folder";
    let folderNameToCheck = baseFolderName;
    let counter = 1;

    toast.loading("Creating Folder...");
    const checkFolderNameAndCreate = () => {
      // Check if the folder name exists in the list of folders
      if (folderNameExists(folderNameToCheck)) {
        counter++;
        folderNameToCheck = `${baseFolderName} ${counter}`;
        checkFolderNameAndCreate(); // Recursively check the next name
      } else {
        // The folder name doesn't exist, so create it
        const formData = new FormData();
        formData.append("operation", "Insert");
        formData.append("folderName", folderNameToCheck);
        axios
          .post(CREATE_NEW_FOLDER, formData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
          })
          .then((response) => {
            console.log("Folder created:", response.data);
            toast.remove();
            fetchData();
          })
          .catch((error) => {
            console.error("Error creating folder:", error);
            toast.remove();
          });
      }
    };

    // Function to check if the folder name already exists in the data
    const folderNameExists = (name) => {
      return originalData.folder.some((folder) => folder.assetName === name);
    };

    checkFolderNameAndCreate();
  };

  const handleWarning = (assetId) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_ASSET_ID}?Id=${assetId}`,
      headers: { Authorization: authToken },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        if (response?.data?.data == true) {
          setassetsdw(null);
          setassetsdw2(null);
          setDeleteMessage(true);
        } else {
          handelDeletedata();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteFolder = (folderID) => {
    const data = JSON.stringify({
      folderID: folderID,
      operation: "Delete",
    });
    toast.loading("Deleting...");
    axios
      .post(CREATE_NEW_FOLDER, data, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        fetchData();
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handleKeyDown = (e, folderID) => {
    if (e.key === "Enter") {
      saveFolderName(folderID, folderName);
    } else if (e.key === "Escape") {
      setEditMode(null);
    }
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
      fetchData();
      setEditMode(null);
    } catch (error) {
      console.error("Error updating folder name:", error);
      setEditMode(null);
    }
  };

  const saveFolderName = (folderID, newName) => {
    updateFolderNameInAPI(folderID, newName);
  };

  const moveDataToFolder = async (dataId, folderId, assetType) => {
    let data = JSON.stringify({
      folderID: folderId,
      assetID: dataId,
      type: assetType === "Folder" ? "Folder" : "Image",
      operation: "Insert",
    });
    toast.loading("Data move to Folder...");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: MOVE_TO_FOLDER,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        if (response?.data?.status == 200) {
          setIsMoveToOpen(false);
          toast.remove();
          const updatedGridData = gridData.filter((item) => {
            return item.assetID != dataId;
          });
          setGridData(updatedGridData);
        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
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
    moveDataToFolder(itemId, folderId, asset_type);
  };

  const navigateToFolder = (folderId, selectedData) => {
    history(`/NewFolderDialog/${folderId}`, { selectedData });
  };

  useEffect(() => {
    fetchData();
    handleActiveBtnClick(1);
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
              <button
                className=" dashboard-btn  flex align-middle border-white text-white bg-SlateBlue items-center border rounded-full lg:px-6 sm:px-2 py-2 xs:px-1 text-base sm:text-sm xs:mr-1 mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={createFolder}
              >
                <TiFolderOpen className="text-2xl rounded-full mr-1  text-white p-1" />
                New Folder
              </button>
              <Link to={"/FileUpload"}>
                <button className=" dashboard-btn flex align-middle items-center  rounded-full  text-base border border-white text-white bg-SlateBlue lg:px-9 sm:px-2   xs:px-1 xs:mr-1 mr-3  py-2 sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <AiOutlineCloudUpload className="text-2xl rounded-full mr-1  text-white p-1" />
                  Upload
                </button>
              </Link>

              <ul className="flex items-center xs:mt-2 sm:mt-0 md:mt-0  lg:mt-0  xs:mr-1  mr-3  rounded-full  border-2 border-SlateBlue">
                <li className="flex items-center ">
                  <button
                    className={
                      asstab === 1 ? "tabshow tabassactive " : "asstab "
                    }
                    onClick={() => updatetoggle(1)}
                  >
                    <RxDashboard className="text-primary text-lg" />
                  </button>
                </li>
                <li className="flex items-center ">
                  <button
                    className={
                      asstab === 2 ? "tabshow tabassactive right " : "asstab "
                    }
                    onClick={() => updatetoggle(2)}
                  >
                    <AiOutlineUnorderedList className="text-primary text-lg" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {deleteMessage && (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-full max-w-xl max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                  <div className="py-6 text-center">
                    <RiDeleteBin6Line className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
                    <h3 className="mb-5 text-xl text-primary  px-5">
                      Are you sure you want to delete this Asset? Because this
                      Asset is being use in another place.If you click on yes it
                      will get removed from the places where the asset is used.
                    </h3>
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        className="border-primary border rounded text-primary px-5 py-2 font-bold text-lg"
                        onClick={() => setDeleteMessage(false)}
                      >
                        No, cancel
                      </button>
                      <button
                        className="text-white bg-[#F21E1E] rounded text-lg font-bold px-5 py-2"
                        onClick={() => {
                          handelDeletedata();
                          setDeleteMessage(false);
                        }}
                      >
                        Yes, I'm sure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="tabs lg:mt-5 md:mt-5  sm:mt-5 xs:mt-0 ">
            <button
              className={activetab === 1 ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleActiveBtnClick(1)}
            >
              All
            </button>
            <button
              className={activetab === 2 ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleActiveBtnClick(2)}
            >
              Images
            </button>
            <button
              className={activetab === 3 ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleActiveBtnClick(3)}
            >
              Video
            </button>
            <button
              className={activetab === 4 ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleActiveBtnClick(4)}
            >
              Doc
            </button>
            <button
              className={activetab === 5 ? "tabactivebtn " : "tabbtn"}
              onClick={() => handleActiveBtnClick(5)}
            >
              Folder
            </button>
          </div>

          {/*start grid view */}

          <div
            className={
              asstab === 1
                ? "show-togglecontent active w-full tab-details mt-10"
                : "togglecontent"
            }
          >
            <div
              className={
                "page-content grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section"
              }
            >
              {loading ? (
                <div className="text-center font-semibold text-2xl col-span-full">
                  Loading...
                </div>
              ) : gridData.length > 0 ? (
                gridData.map((item, index) => (
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
                        className="text-center relative list-none bg-lightgray rounded-md px-3 py-7 flex justify-center items-center flex-col"
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
                              saveFolderName(item.assetID, folderName);
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
                                setEditMode(item.assetID);
                              }}
                              className="cursor-pointer"
                            >
                              {item.assetName}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    {item.assetType === "Image" && (
                      <img
                        src={item.assetFolderPath}
                        alt={item.assetName}
                        onClick={() => {
                          setShowImageAssetModal(true);
                          setImageAssetModal(item);
                        }}
                      />
                    )}

                    {item.assetType === "OnlineImage" && (
                      <img
                        src={item.assetFolderPath}
                        alt={item.assetName}
                        onClick={() => {
                          setShowImageAssetModal(true);
                          setImageAssetModal(item);
                        }}
                      />
                    )}

                    {item.assetType === "OnlineVideo" && (
                      <video
                        controls
                        className="w-full rounded-2xl relative h-56 border border-slate-200"
                        onClick={() => {
                          setShowImageAssetModal(true);
                          setImageAssetModal(item);
                        }}
                      >
                        <source src={item.assetFolderPath} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    {item.assetType === "Video" && (
                      <video
                        controls
                        className="w-full rounded-2xl relative h-56 border border-slate-200"
                        onClick={() => {
                          setShowImageAssetModal(true);
                          setImageAssetModal(item);
                        }}
                      >
                        <source src={item.assetFolderPath} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}

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

                    <div className="flex justify-end absolute top-5 px-4 w-full">
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
                                  onClick={() => {
                                    toggleMoveTo();
                                    setSelectedItems(item);
                                  }}
                                  className="flex relative w-full"
                                >
                                  <CgMoveRight className="mr-2 text-lg" />
                                  Move to
                                </button>

                                {isMoveToOpen && (
                                  <div className="move-to-dropdown">
                                    <ul className="space-y-3">
                                      {originalData.folder?.length > 0 ? (
                                        originalData.folder.map((folder) => (
                                          <div key={folder.assetID}>
                                            {selectedItems?.assetID !==
                                              folder.assetID && (
                                              <li className="hover:bg-black hover:text-white">
                                                <button
                                                  onClick={() =>
                                                    handleMoveTo(folder.assetID)
                                                  }
                                                >
                                                  {folder.assetName}
                                                </button>
                                              </li>
                                            )}
                                          </div>
                                        ))
                                      ) : (
                                        <div className="w-full">
                                          No folders, Please create a new
                                          folder.
                                        </div>
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

                    {item.assetType === "DOC" && (
                      <div className="bg-white px-4 py-5 rounded-lg shadow-lg h-full">
                        {item.assetType === "DOC" && (
                          <HiDocumentDuplicate className=" text-primary text-4xl mt-10" />
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
                  </li>
                ))
              ) : (
                <p>Not Assets Found</p>
              )}
            </div>
            <div></div>
          </div>

          {/*End of grid view */}

          {/*start List View */}
          <div
            className={
              asstab === 2
                ? "show-togglecontent active w-full tab-details mt-10"
                : "togglecontent"
            }
          >
            <div className="schedual-table bg-white rounded-xl mt-8 shadow">
              <table
                className="w-full  lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                cellPadding={20}
              >
                <thead>
                  <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Preview
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Name
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Duration
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Resolution
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Type
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Size
                    </th>

                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="text-center font-semibold text-2xl col-span-full">
                        Loading...
                      </td>
                    </tr>
                  ) : gridData.length > 0 ? (
                    gridData.map((item, index) => (
                      <tr
                        key={index}
                        className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                        draggable
                        onDragStart={(event) =>
                          handleDragStart(event, item.assetID, item)
                        }
                      >
                        <td className="text-center">
                          {item.assetType === "Folder" && (
                            <div
                              onDragOver={(event) => handleDragOver(event)}
                              onDrop={(event) =>
                                handleDrop(event, item.assetID)
                              }
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
                                  onChange={(e) =>
                                    setFolderName(e.target.value)
                                  }
                                  onBlur={() => {
                                    saveFolderName(item.assetID, folderName);
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
                                      setEditMode(item.assetID);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    {item.assetName}
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          {item.assetType === "Image" && (
                            <div className="img-cover ivratio img-cover-ratio">
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
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            </div>
                          )}

                          {item.assetType === "OnlineImage" && (
                            <div className="img-cover ivratio img-cover-ratio">
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
                                  Your browser does not support the video tag.
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
                          {item.assetType !== "Folder" && item.assetName}
                        </td>
                        <td className="text-center">{item.durations}</td>
                        <td className="text-center">{item.resolutions}</td>
                        <td className=" break-all max-w-sm">
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
                                        onClick={() => {
                                          toggleMoveTo();
                                          setSelectedItems(item);
                                        }}
                                        className="flex relative w-full"
                                      >
                                        <CgMoveRight className="mr-2 text-lg" />
                                        Move to
                                      </button>

                                      {isMoveToOpen && (
                                        <div className="move-to-dropdown">
                                          <ul className="space-y-3">
                                            {originalData.folder?.length > 0 ? (
                                              originalData.folder.map(
                                                (folder) => (
                                                  <div key={folder.assetID}>
                                                    {selectedItems?.assetID !==
                                                      folder.assetID && (
                                                      <li className="hover:bg-black hover:text-white">
                                                        <button
                                                          onClick={() =>
                                                            handleMoveTo(
                                                              folder.assetID
                                                            )
                                                          }
                                                        >
                                                          {folder.assetName}
                                                        </button>
                                                      </li>
                                                    )}
                                                  </div>
                                                )
                                              )
                                            ) : (
                                              <div className="w-full">
                                                No folders, Please create a new
                                                folder.
                                              </div>
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
                    ))
                  ) : (
                    <tr>
                      <td>Not Assets Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
          {selectScreenModal && (
            <ScreenAssignModal
              setAddScreenModal={setAddScreenModal}
              setSelectScreenModal={setSelectScreenModal}
              handleUpdateScreenAssign={handleUpdateScreenAssign}
              selectedScreens={selectedScreens}
              setSelectedScreens={setSelectedScreens}
            />
          )}
          {/*End of List View */}

          {/* sucess popup */}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Assets;
