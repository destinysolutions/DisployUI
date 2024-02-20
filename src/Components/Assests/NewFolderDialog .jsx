import React, { useState, useEffect, useRef } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { HiDocumentDuplicate } from "react-icons/hi";
import {
  RiDeleteBin5Line,
  RiDeleteBin6Line,
  RiGalleryFill,
} from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { FiDownload, FiUpload } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { MdArrowBackIosNew } from "react-icons/md";
import {
  ALL_FILES_UPLOAD,
  ASSIGN_ASSET_TO_SCREEN,
  CREATE_NEW_FOLDER,
  GET_ALL_FILES,
  MOVE_TO_FOLDER,
  SELECT_BY_ASSET_ID,
} from "../../Pages/Api";
import { TiFolderOpen } from "react-icons/ti";
import { FcOpenedFolder } from "react-icons/fc";
import { CgMoveRight } from "react-icons/cg";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ShowAssetImageModal from "./ShowAssetImageModal";
import moment from "moment";
import ScreenAssignModal from "../ScreenAssignModal";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { connection } from "../../SignalR";
import PreviewDoc from "./PreviewDoc";
import { socket } from "../../App";
const NewFolderDialog = ({ sidebarOpen, setSidebarOpen }) => {
  NewFolderDialog.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  // folder wise show asset
  const [folderData, setFolderData] = useState([]);
  const [NestedNewFolder, setNestedNewFolder] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [showImageAssetModal, setShowImageAssetModal] = useState(false);
  const [imageAssetModal, setImageAssetModal] = useState(null);
  const [clickedTabIcon, setClickedTabIcon] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteAssetID, setDeleteAssetID] = useState();
  const [screenAssetID, setScreenAssetID] = useState();
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [hoveredTabIcon, setHoveredTabIcon] = useState(null);
  const [assetsdw, setassetsdw] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMoveToOpen, setIsMoveToOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [FolderDisable, setFolderDisable] = useState(false);
  const [selectdata, setSelectData] = useState({});
  const [previewDoc, setPreviewDoc] = useState(false);
  const [selectDoc, setSelectDoc] = useState(null);
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const location = useLocation();
  const folderId = location.pathname.split("/").pop();

  const actionBoxRef = useRef(null);
  const addScreenRef = useRef(null);
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
      url: `${ASSIGN_ASSET_TO_SCREEN}?AssetId=${screenAssetID}&ScreenID=${idS}`,
      headers: {
        Authorization: authToken,
      },
    };
    toast.loading("Saving...");
    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          const Params = {
            id: socket.id,
            connection: socket.connected,
            macId: macids,
          };
          socket.emit("ScreenConnected", Params);
          setTimeout(() => {
            toast.remove();
            setSelectScreenModal(false);
            setAddScreenModal(false);
          }, 1000);
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
                    // setSelectScreenModal(false);
                    // setAddScreenModal(false);
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
                // setSelectScreenModal(false);
                // setAddScreenModal(false);
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

  const loadFolderByID = (folderId) => {
    setLoading(true);
    axios
      .get(`${GET_ALL_FILES}?FolderID=${folderId}`, {
        headers: { Authorization: authToken },
      })
      .then((response) => {
        const fetchedData = response.data;
        setNestedNewFolder(fetchedData);
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
          ...(fetchedData.folder ? fetchedData.folder : []),
        ];
        setFolderData(allAssets);
        setLoading(false);
        setFolderDisable(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    let FilteredFolder = [];
    let FilteredAllAssests = [];
    folderData?.map((item) => {
      if (item?.assetType === "Folder") {
        if (item?.assetID !== selectedItems?.assetID) {
          FilteredFolder.push(item);
        }
        FilteredAllAssests.push(item);
      }
    });
    const obj = {
      status: 200,
      folder:
        selectedItems?.assetType === "Folder"
          ? FilteredFolder
          : FilteredAllAssests,
      image: NestedNewFolder?.image,
      doc: NestedNewFolder?.doc,
      video: NestedNewFolder?.video,
      onlineimages: NestedNewFolder?.onlineimages,
      onlinevideo: NestedNewFolder?.onlinevideo,
      onlinedoc: NestedNewFolder?.onlinedoc,
      perentIDData: NestedNewFolder?.perentIDData,
    };
    setNestedNewFolder(obj);
  }, [selectedItems]);

  useEffect(() => {
    if (folderId) {
      loadFolderByID(folderId);
    }
  }, [folderId]);

  const handleIconClick = (item) => {
    if (clickedTabIcon === item) {
      setClickedTabIcon(null);
    } else {
      setClickedTabIcon(item);
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

  const createNestedFolder = () => {
    setFolderDisable(true);
    let baseFolderName = "New Folder";
    let folderNameToCheck = baseFolderName;
    let counter = 1;

    const checkFolderNameAndCreate = () => {
      // Check if the folder name exists in the list of folders
      if (folderNameExists(folderNameToCheck)) {
        counter++;
        folderNameToCheck = `${baseFolderName} ${counter}`;
        checkFolderNameAndCreate(); // Recursively check the next name
      } else {
        // The folder name doesn't exist, so create it
        const formData = new FormData();
        formData.append("parentID", folderId);
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
            loadFolderByID(folderId);
          })
          .catch((error) => {
            console.error("Error creating folder:", error);
          });
      }
    };

    // Function to check if the folder name already exists in the data
    const folderNameExists = (name) => {
      return NestedNewFolder.folder.some((folder) => folder.assetName === name);
    };

    checkFolderNameAndCreate();
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
        if (response?.data?.status == 200) {
          setIsMoveToOpen(false);
          toast.remove();
          const updatedData = folderData.filter((item) => {
            return item.assetID != dataId;
          });
          setFolderData(updatedData);
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
    if (
      Number(itemId) !== folderId ||
      (Number(itemId) === folderId && asset_type !== "Folder")
    ) {
      moveDataToFolder(itemId, folderId, asset_type);
    }
  };

  const navigateToFolder = (folderId, selectedData) => {
    history(`/NewFolderDialog/${folderId}`, { selectedData });
  };

  // Handle going back to the parent folder
  const navigateBack = () => {
    history(-1);
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
      loadFolderByID(folderId);
      setEditMode(null);
    } catch (error) {
      console.error("Error updating folder name:", error);
      setEditMode(null);
    }
  };

  const saveFolderName = (folderID, newName) => {
    updateFolderNameInAPI(folderID, newName); // Use newName instead of folderName
  };

  const handleWarning = (assetId) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_ASSET_ID}?Id=${assetId}&AssetType=Image`,
      headers: { Authorization: authToken },
    };
    toast.loading("Deleting");
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.data == true) {
          setassetsdw(null);
          setDeleteMessage(true);
        } else {
          handelDeletedata();
        }
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const deleteFolder = (folderID) => {
    const data = JSON.stringify({
      folderID: folderID,
      operation: "Delete",
      AssetType: "Folder",
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
        loadFolderByID(folderId);
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handelDeletedata = () => {
    const formData = new FormData();
    formData.append("AssetID", deleteAssetID);
    formData.append("Operation", "Delete");
    formData.append("IsActive", "true");
    formData.append("IsDelete", "true");
    formData.append("FolderID", "0");
    formData.append("UserID", "0");
    formData.append("AssetType", "Image");
    formData.append("DeleteDate", new Date().toISOString().split("T")[0]);
    axios
      .post(ALL_FILES_UPLOAD, formData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response?.data?.data === true) {
          const updatedData = folderData.filter((item) => {
            return item.assetID !== deleteAssetID;
          });
          setFolderData(updatedData);
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const HandleClose = () => {
    setPreviewDoc(false);
  };

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
            <div className="w-full">
              <div className="flex justify-between items-center">
                <button onClick={navigateBack}>
                  <MdArrowBackIosNew className="text-4xl rounded-full p-2 b order border-gray mb-2 hover:bg-SlateBlue hover:text-white" />
                </button>
                <button
                  onClick={createNestedFolder}
                  disabled={FolderDisable}
                  className="flex align-middle text-white bg-SlateBlue items-center border rounded-full lg:px-6 sm:px-2 py-2 xs:px-1 text-base sm:text-sm xs:mr-1 mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                >
                  <TiFolderOpen className="text-2xl rounded-full mr-1  text-white p-1" />
                  New Folder
                </button>
              </div>
              <hr className="border-b border-lightgray mb-5 mt-3" />
              <div
                className={
                  "page-content grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section"
                }
              >
                {loading ? (
                  <div className="text-center font-semibold text-2xl col-span-full">
                    Loading...
                  </div>
                ) : folderData.length > 0 ? (
                  folderData.map((item, index) => (
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
                                  setFolderName(item?.assetName);
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
                                        {NestedNewFolder.folder?.length > 0 ? (
                                          NestedNewFolder.folder.map(
                                            (folder) => (
                                              <div key={folder.assetID}>
                                                {folder.assetID && (
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
                                          <div className="w-full text-left">
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
                      {deleteMessage && (
                        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                          <div className="relative w-full max-w-xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                              <div className="py-6 text-center">
                                <RiDeleteBin6Line className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
                                <h3 className="mb-5 text-xl text-primary  px-5">
                                  Are you sure you want to delete this Asset?
                                  Because this Asset is being use in another
                                  place.If you click on yes it will get removed
                                  from the places where the asset is used.
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
                      {item.assetType === "DOC" && (
                        <div className="bg-white px-4 py-5 rounded-lg shadow-lg h-full">
                          {item.assetType === "DOC" && (
                            <HiDocumentDuplicate className=" text-primary text-4xl mt-10" />
                          )}
                          {item.assetType === "DOC" && (
                            <a
                              className="cursor-pointer"
                              onClick={() => {
                                setPreviewDoc(true);
                                setSelectDoc(item);
                              }}
                              // href={item.assetFolderPath}
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
            </div>
          </div>
          {addScreenModal && (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
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
          {selectScreenModal && (
            <ScreenAssignModal
              setAddScreenModal={setAddScreenModal}
              setSelectScreenModal={setSelectScreenModal}
              handleUpdateScreenAssign={handleUpdateScreenAssign}
              selectedScreens={selectedScreens}
              setSelectedScreens={setSelectedScreens}
              sidebarOpen={sidebarOpen}
            />
          )}
        </div>
      </div>
      {previewDoc && (
        <PreviewDoc
          HandleClose={HandleClose}
          fileType={selectDoc?.fileExtention}
          assetFolderPath={selectDoc?.assetFolderPath}
        />
      )}
    </>
  );
};

export default NewFolderDialog;
