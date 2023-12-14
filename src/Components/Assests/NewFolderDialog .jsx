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
import { MdPlaylistPlay } from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { MdArrowBackIosNew } from "react-icons/md";
import {
  ALL_FILES_UPLOAD,
  CREATE_NEW_FOLDER,
  FetchdataFormFolder,
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
const NewFolderDialog = ({ sidebarOpen, setSidebarOpen }) => {
  NewFolderDialog.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  // folder wise show asset
  const [folderData, setFolderData] = useState([]);
  const [folderNames, setFolderNames] = useState([]);
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

  const location = useLocation();
  const folderId = location.pathname.split("/").pop();
  const actionBoxRef = useRef(null);
  const history = useNavigate();

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
      });
  };

  useEffect(() => {
    if (folderId) {
      loadFolderByID(folderId);
    }
  }, [folderId]);

  const [hoveredTabIcon, setHoveredTabIcon] = useState(null);
  const handleIconClick = (item) => {
    if (clickedTabIcon === item) {
      setClickedTabIcon(null);
    } else {
      setClickedTabIcon(item);
      setassetsdw(null);
    }
  };
  const [assetsdw, setassetsdw] = useState(null);

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

  const [selectedItems, setSelectedItems] = useState([]);

  const createNestedFolder = () => {
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
            console.log("Folder created:", response.data);
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
  const handleMoveTo = (folderId) => {
    moveDataToFolder(
      selectedItems?.assetID,
      folderId,
      selectedItems?.assetType
    );
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

  // Function to handle drop into folder
  const handleDrop = (event, folderId, assetType) => {
    const itemId = event.dataTransfer.getData("text/plain");
    console.log(assetType);
    let asset_type = assetType == "Folder" ? "Folder" : "Image";
    moveDataToFolder(itemId, folderId, asset_type);
  };

  const navigateToFolder = (folderId, selectedData) => {
    history(`/NewFolderDialog/${folderId}`, { selectedData });
  };

  // Handle going back to the parent folder
  const navigateBack = () => {
    history(-1);
  };

  // edit folder Name
  const [editMode, setEditMode] = useState(null);

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

  const [isMoveToOpen, setIsMoveToOpen] = useState(false);

  const toggleMoveTo = () => {
    setIsMoveToOpen(!isMoveToOpen);
  };
  // dragdrop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, itemId) => {
    event.dataTransfer.setData("text/plain", itemId);
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
      {
        <div className="pt-24 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="lg:flex lg:justify-between sm:block items-center">
              <div>
                <div className="flex justify-between items-center">
                  <button onClick={navigateBack}>
                    <MdArrowBackIosNew className="text-4xl rounded-full p-2 b order border-gray mb-2 hover:bg-SlateBlue hover:text-white" />
                  </button>
                  <button
                    onClick={createNestedFolder}
                    className="flex align-middle border-white text-white bg-SlateBlue items-center border rounded-full lg:px-6 sm:px-2 py-2 xs:px-1 text-base sm:text-sm xs:mr-1 mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
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
                          handleDragStart(event, item.assetID)
                        }
                        className="relative list-none assetsbox"
                      >
                        {item.assetType === "Folder" && (
                          <div
                            onDragOver={(event) => handleDragOver(event)}
                            onDrop={(event) =>
                              handleDrop(event, item.assetID, item.assetType)
                            }
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
                            <source
                              src={item.assetFolderPath}
                              type="video/mp4"
                            />
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
                            <source
                              src={item.assetFolderPath}
                              type="video/mp4"
                            />
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
                                          {NestedNewFolder.folder?.length >
                                          0 ? (
                                            NestedNewFolder.folder.map(
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
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default NewFolderDialog;
