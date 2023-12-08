import React, { useState, useEffect } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiDeleteBin5Line, RiGalleryFill } from "react-icons/ri";
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
  CREATE_NEW_FOLDER,
  FetchdataFormFolder,
  GET_ALL_FILES,
  MOVE_TO_FOLDER,
} from "../../Pages/Api";
import { TiFolderOpen } from "react-icons/ti";
import { FcOpenedFolder } from "react-icons/fc";
import { CgMoveRight } from "react-icons/cg";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ShowAssetImageModal from "./ShowAssetImageModal";
const NewFolderDialog = ({ sidebarOpen, setSidebarOpen }) => {
  NewFolderDialog.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  // folder wise show asset
  const [folderData, setFolderData] = useState([]);
  const [folderNames, setFolderNames] = useState([]);
  const [NestedNewFolder, setNestedNewFolder] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [showImageAssetModal, setShowImageAssetModal] = useState(false);
  const [imageAssetModal, setImageAssetModal] = useState(null);

  const location = useLocation();
  const folderId = location.pathname.split("/").pop();

  const history = useNavigate();
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

  const updateassetsdw = (id) => {
    if (assetsdw === id) {
      setassetsdw(null);
    } else {
      setassetsdw(id);
    }
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const [selectAll, setSelectAll] = useState(false);

  // delete data

  const handleMoveToTrash = (assetId, assetType) => {
    let data = JSON.stringify({
      assetID: assetId,
      type: assetType == "Folder" ? "Folder" : "Image",
      operation: "Delete",
      userID: 0,
    });

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
        const updateAsset = folderData.filter(
          (asset) => asset.assetID !== assetId
        );
        setFolderData(updateAsset);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    selectedItems.forEach((item) => {
      moveDataToFolder(item.assetID, folderId, item.assetType);
    });
  };
  const moveDataToFolder = async (dataId, folderId, assetType) => {
    let data = JSON.stringify({
      folderID: folderId,
      assetID: dataId,
      type: assetType == "Folder" ? "Folder" : "Image",
      operation: "Insert",
    });

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

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      loadFolderByID(folderId);
      updateFolderContent(folderId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateFolderContent = (folderId) => {
    try {
      axios.get(`${FetchdataFormFolder}?ID=${folderId}`).then((response) => {
        const responseData = response.data;
        const folderDataArray = Array.isArray(responseData)
          ? responseData
          : [responseData];

        setFolderData(folderDataArray);
      });
    } catch (error) {
      console.error("Error updating folder content:", error);
    }
  };

  // Function to handle drop into folder
  const handleDrop = (event, folderId) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain");

    // Move the data item to the folder (you'll need to implement this logic)
    moveDataToFolder(itemId, folderId);
  };
  const navigateToFolder = (folderId, selectedData) => {
    console.log("selectedData before navigation:", selectedData);
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
      const updatedFolder = response.data.data.model;
      loadFolderByID(folderID);

      setEditMode(null);
      console.log("Folder name updated:", updatedFolder);
    } catch (error) {
      setEditMode(null);
      console.error("Error updating folder name:", error);
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
                <hr className="border-b border-lightgray" />
                <div className=" page-content grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section mt-4">
                  {Array.isArray(folderData) &&
                    folderData.map((folderAsset, index) => (
                      <div
                        key={folderAsset.assetID}
                        draggable
                        onDragStart={(event) =>
                          handleDragStart(event, folderAsset.assetID)
                        }
                      >
                        <div className="relative assetsbox">
                          {folderAsset.assetType === "OnlineImage" && (
                            <img
                              src={folderAsset.assetFolderPath}
                              alt={folderAsset.assetName}
                              className="imagebox relative opacity-1 w-full rounded-2xl h-full object-fill"
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(
                                  folderAsset?.assetFolderPath
                                );
                              }}
                            />
                          )}

                          {folderAsset.assetType === "OnlineVideo" && (
                            <video
                              controls
                              className="w-full rounded-2xl relative imagebox"
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(
                                  folderAsset?.assetFolderPath
                                );
                              }}
                            >
                              <source
                                src={folderAsset.assetFolderPath}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {folderAsset.assetType === "Image" && (
                            <img
                              src={folderAsset.assetFolderPath}
                              alt={folderAsset.assetName}
                              className="imagebox relative opacity-1 w-full rounded-2xl"
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(
                                  folderAsset?.assetFolderPath
                                );
                              }}
                            />
                          )}
                          {folderAsset.assetType === "Video" && (
                            <video
                              controls
                              className="w-full rounded-2xl relative h-56  list-none imagebox"
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(
                                  folderAsset?.assetFolderPath
                                );
                              }}
                            >
                              <source
                                src={folderAsset.assetFolderPath}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {folderAsset.assetType === "DOC" && (
                            <a
                              href={folderAsset.fileType}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="imagebox relative opacity-1 w-full rounded-2xl"
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(
                                  folderAsset?.assetFolderPath
                                );
                              }}
                            >
                              {folderAsset.name}
                            </a>
                          )}
                          {folderAsset.assetType === "Folder" && (
                            <div
                              onDragOver={handleDragOver}
                              onDrop={(event) =>
                                handleDrop(event, folderAsset.assetID)
                              }
                              className="text-center relative list-none bg-lightgray rounded-md px-3 py-7 flex justify-center items-center flex-col"
                            >
                              <FcOpenedFolder
                                className="text-8xl text-center mx-auto"
                                onClick={() =>
                                  navigateToFolder(folderAsset.assetID)
                                }
                              />

                              {editMode === folderAsset.assetID ? (
                                <input
                                  type="text"
                                  value={folderName}
                                  className="w-full"
                                  onChange={(e) =>
                                    setFolderName(e.target.value)
                                  }
                                  onBlur={() => {
                                    saveFolderName(
                                      folderAsset.assetID,
                                      folderName
                                    );
                                    setEditMode(null);
                                  }}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, folderAsset.assetID, index)
                                  }
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <span
                                    onClick={() => {
                                      setEditMode(folderAsset.assetID);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    {folderAsset.assetName}
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          <div
                            className="tabicon text-center absolute left-2/4 bottom-[0px] z-10"
                            onMouseEnter={() => setHoveredTabIcon(folderAsset)}
                            onMouseLeave={() => setHoveredTabIcon(null)}
                            onClick={() => handleIconClick(folderAsset)}
                          >
                            {folderAsset.assetType === "Image" && (
                              <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                            )}

                            {folderAsset.assetType === "Video" && (
                              <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                            )}

                            {folderAsset.assetType === "OnlineImage" && (
                              <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                            )}

                            {folderAsset.assetType === "OnlineVideo" && (
                              <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                            )}
                          </div>

                          {hoveredTabIcon === folderAsset && (
                            <div className="vdetails">
                              <div className="flex justify-end">
                                <div className="storage mb-1">
                                  {/* <span className="bg-white text-primary rounded-sm p-1 text-sm">
                                {folderAsset.fileSize}
                              </span> */}
                                </div>
                              </div>
                              <div className="text-center clickdetail">
                                <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                                  {folderAsset.name}
                                </h3>
                                {/*<p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {item.details}
                            </p> */}
                                <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                                  {folderAsset.createdDate}
                                </h6>
                                <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                  {folderAsset.assetType}
                                </span>
                                <span>,</span>
                                <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                  {folderAsset.fileSize}
                                </h6>

                                <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                  {folderAsset.resolutions}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                            <input
                              type="checkbox"
                              className="w-[20px] h-[20px]"
                              checked={
                                selectAll || selectedItems.includes(folderAsset)
                              }
                              onChange={() => handleCheckboxChange(folderAsset)}
                            />
                            <button onClick={() => updateassetsdw(folderAsset)}>
                              <BsThreeDots className="text-2xl" />
                            </button>
                            {assetsdw === folderAsset &&
                              selectedItems.includes(folderAsset) && (
                                <div className="assetsdw">
                                  <ul>
                                    <li className="flex text-sm items-center">
                                      <FiUpload className="mr-2 text-lg" />
                                      Set to Screen
                                    </li>
                                    <li className="flex text-sm items-center">
                                      <MdPlaylistPlay className="mr-2 text-lg" />
                                      Add to Playlist
                                    </li>
                                    {folderAsset.assetType === "Image" && (
                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href={folderAsset.fileType} download>
                                          Download
                                        </a>
                                      </li>
                                    )}

                                    {folderAsset.assetType === "Video" && (
                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href={folderAsset.fileType} download>
                                          Download
                                        </a>
                                      </li>
                                    )}
                                    {folderAsset.assetType ===
                                      "OnlineImage" && (
                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href={folderAsset.fileType} download>
                                          Download
                                        </a>
                                      </li>
                                    )}

                                    {folderAsset.assetType ===
                                      "OnlineVideo" && (
                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href={folderAsset.fileType} download>
                                          Download
                                        </a>
                                      </li>
                                    )}
                                    {folderAsset.assetType === "DOC" && (
                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href={folderAsset.fileType} download>
                                          Download
                                        </a>
                                      </li>
                                    )}
                                    <li className="flex text-sm items-center relative">
                                      {selectedItems.length > 0 && (
                                        <div className="move-to-button">
                                          <button
                                            onClick={toggleMoveTo}
                                            className="flex"
                                          >
                                            <CgMoveRight className="mr-2 text-lg" />
                                            Move to
                                          </button>

                                          {isMoveToOpen && (
                                            <div className="move-to-dropdown">
                                              <ul>
                                                {NestedNewFolder.folder.map(
                                                  (folder) => (
                                                    <li key={folder.assetID}>
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
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </li>
                                    <li>
                                      <button
                                        onClick={() =>
                                          handleMoveToTrash(
                                            folderAsset.assetID,
                                            folderAsset.assetType
                                          )
                                        }
                                        className="flex text-sm items-center"
                                      >
                                        <RiDeleteBin5Line className="mr-2 text-lg" />
                                        Move to Trash
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
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
