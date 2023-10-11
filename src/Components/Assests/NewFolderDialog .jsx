import React, { useState, useEffect, useRef } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiDeleteBin5Line, RiGalleryFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { FiDownload, FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import PropTypes from "prop-types";
import { MdArrowBackIosNew } from "react-icons/md";
import { HiDocumentDuplicate } from "react-icons/hi";
import {
  FetchdataFormFolder,
  DeleteAllData,
  MOVE_TO_FOLDER,
  GET_ALL_NEW_FOLDER,
  CREATE_NEW_FOLDER,
} from "../../Pages/Api";
import { TiFolderOpen } from "react-icons/ti";
import { FcOpenedFolder } from "react-icons/fc";
const NewFolderDialog = ({ sidebarOpen, setSidebarOpen }) => {
  NewFolderDialog.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const [folderName, setFolderName] = useState("New Folder");
  const [searchParams] = useSearchParams();
  // const folderId = searchParams.get("folderId");

  // const selectedData = location.state?.selectedData;

  // folder wise show asset
  const [folderData, setFolderData] = useState([]);
  const [folderAsset, setFolderAsset] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [newSubFolder, setNewSubfolder] = useState([]);
  const [folderNames, setFolderNames] = useState([]);
  const location = useLocation();
  const folderId = location.pathname.split("/").pop();



  const loadFolderByID = (folderId) => {
    axios.get(`${FetchdataFormFolder}?ID=${folderId}`).then((response) => {
      const fetchedData = response.data.data;
      console.log(fetchedData, 'fetchedData');
      const assetList = fetchedData?.map((item) => item.asset);
      setFolderData(fetchedData);
      setFolderAsset(fetchedData);
      setNewSubfolder(fetchedData)
      // console.log(assetList, "assetList");
    });
  };

  useEffect(() => {
    if (folderId) {
      loadFolderByID(folderId);
    }
  }, [folderId]);



  const [hoveredTabIcon, setHoveredTabIcon] = useState(null);
  const handleIconClick = (item) => {
    // Toggle the visibility of the details for the clicked item
    if (clickedTabIcon === item) {
      setClickedTabIcon(null); // If the same item is clicked again, hide its details
    } else {
      setClickedTabIcon(item); // Otherwise, show the details of the clicked item
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
  // console.log(selectedItems, "selectedItems");
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

  const handleMoveToTrash = (assetId) => {
    // console.log(assetId, "ID");
    let data = JSON.stringify({
      asset: assetId,
      operation: "Delete",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: MOVE_TO_FOLDER,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        const updateAsset = folderData.filter((asset) => asset.id !== assetId);
        setFolderData(updateAsset);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const createSubFolder = () => {
    let subFolderName = folderName;
    let counter = 1;

    while (folderNames.includes(subFolderName)) {
      counter++;
      subFolderName = `${folderName} ${counter}`;
    }
    let data = JSON.stringify({
      "folderName": subFolderName,
      "operation": "Insert",
      "parentId": folderId
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: CREATE_NEW_FOLDER,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);
        loadFolderByID(folderId);
        //setNewSubfolder(response.data.model)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // new folder dropdown
  const [openAssetsdwId, setOpenAssetsdwId] = useState(null);
  const toggleAssetsdw = (folderId) => {
    if (openAssetsdwId === folderId) {
      setOpenAssetsdwId(null);
    } else {
      setOpenAssetsdwId(folderId);
    }
  };

  const [openAssetsdwIdList, setOpenAssetsdwIdList] = useState(null);
  const toggleAssetsdwList = (folderId) => {
    if (openAssetsdwIdList === folderId) {
      setOpenAssetsdwIdList(null);
    } else {
      setOpenAssetsdwIdList(folderId);
    }
  };

  // edit folder Name
  const [editMode, setEditMode] = useState(null);

  const handleKeyDown = (e, folderID, index) => {
    if (e.key === "Enter") {
      // Save the folder name on Enter key press
      const newName = folderNames[index];
      saveFolderName(folderID, newName);

    } else if (e.key === "Escape") {
      // Cancel editing on Escape key press
      setEditMode(null);
    }
  };

  const updateFolderNameInAPI = async (folderID, newName) => {
    console.log(folderID, 'folderIDfolderID');
    console.log(newName, 'newNamenewName');
    try {
      const formData = new FormData();
      formData.append("folderID", folderID);
      formData.append("operation", "Update");
      formData.append("folderName", newName);

      const response = await axios.post(CREATE_NEW_FOLDER, formData, {
        headers: { "Content-Type": "application/json" },
      });
      const updatedFolder = response.data.data.model;
      // Create a new array with updated folder names
      const updatedNewSubFolder = newSubFolder.map((item) => {
        if (item.folderID === updatedFolder.folderID) {
          // Replace the folder name for the specific folder ID
          return {
            ...item,
            folderName: updatedFolder.folderName,
          };
        } else {
          return item;
        }
      });

      // Set the updated array as the new state
      setNewSubfolder(updatedNewSubFolder);
      console.log("Folder name updated:", updatedFolder);
    } catch (error) {
      console.error("Error updating folder name:", error);
    }
  };

  const saveFolderName = (folderID, newName) => {
    updateFolderNameInAPI(folderID, newName); // Use newName instead of folderName
    setEditMode(null);
  };

  // move to data in folder

  const [isMoveToOpen, setIsMoveToOpen] = useState(false);

  const toggleMoveTo = () => {
    setIsMoveToOpen(!isMoveToOpen);
  };

  const moveDataToFolder = async (dataId, folderId) => {
    let data = JSON.stringify({
      folderID: folderId,
      asset: dataId,
      operation: "Insert",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: MOVE_TO_FOLDER,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));

      updateFolderContent(folderId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoveTo = (folderId) => {
    selectedItems.forEach((item) => {
      moveDataToFolder(item.id, folderId);

      setGridData((prevGridData) =>
        prevGridData.filter((image) => image.id !== item.id)
      );
    });
  };

  const updateFolderContent = (folderId) => {
    try {
      axios
        .get(
          `${FetchdataFormFolder}?ID=${folderId}`
        )
        .then((response) => {
          console.log(response.data);
          setGridData(response.data);
        });
    } catch (error) {
      console.error("Error updating folder content:", error);
    }
  };

  const navigateToFolder = (folderId, selectedData) => {
    console.log("selectedData before navigation:", selectedData);
    history(`/NewSubFolderDialog/${folderId}`, { selectedData });
  };

  // dragdrop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, itemId) => {
    event.dataTransfer.setData("text/plain", itemId);
  };

  // Function to handle drop into folder
  const handleDrop = (event, folderId) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain");

    // Move the data item to the folder (you'll need to implement this logic)
    moveDataToFolder(itemId, folderId);
  };

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {
        <div className="pt-6 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="lg:flex lg:justify-between sm:block items-center">
              <div>
                <div className=" flex-wrap flex  lg:mt-0 md:mt-0 sm:mt-3">
                  <Link to={"/assets"}>
                    <MdArrowBackIosNew className="text-4xl rounded-full p-2 b order border-gray mb-2 hover:bg-SlateBlue hover:text-white" />
                  </Link>
                  <button
                    className=" dashboard-btn  flex align-middle border-white text-white bg-SlateBlue items-center border rounded-full lg:px-6 sm:px-2 py-2 xs:px-1 text-base sm:text-sm xs:mr-1 mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    onClick={createSubFolder}
                  >
                    <TiFolderOpen className="text-2xl rounded-full mr-1  text-white p-1" />
                    New Folder
                  </button>
                </div>
                <hr className="border-b border-lightgray" />

                <div
                  className={
                    "page-content grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section"
                  }
                >
                  {newSubFolder.map((folder, index) =>
                  (
                    <>
                      {
                        folder.type === "Folder" && (

                          <li
                            key={`folder-${folder.folderID}`}
                            onDragOver={handleDragOver} // Allow drops on folders
                            onDrop={(event) => handleDrop(event, folder.folderID)} // Handle drop into folder
                            className="text-center relative list-none bg-lightgray rounded-md px-3 py-7 flex justify-center items-center flex-col"
                          >
                            <FcOpenedFolder
                              className="text-8xl text-center mx-auto"
                              onClick={() => navigateToFolder(folder.folderID)}
                            />


                            {editMode === folder.folderID ? (
                              <input
                                type="text"
                                value={folderNames[index]}
                                className="w-full"
                                onChange={(e) => {
                                  const newSubFolderNames = [...folderNames];
                                  newSubFolderNames[index] = e.target.value;
                                  setFolderNames(newSubFolderNames);
                                  console.log(newSubFolderNames);
                                }}
                                onBlur={() => {
                                  saveFolderName(folder.folderID, folderNames[index]);
                                  setEditMode(null);
                                }}
                                onKeyDown={(e) => handleKeyDown(e, folder.folderID, index)}
                                autoFocus
                              />
                            ) : (
                              <>
                                <span
                                  onClick={() => {
                                    setEditMode(folder.folderID);
                                  }}
                                  className="cursor-pointer"
                                >
                                  {folderNames[index]}
                                </span>
                                <button
                                  onClick={() => toggleAssetsdw(folder.folderID)}
                                  className="absolute right-4 top-2"
                                >
                                  <BsThreeDots className="text-2xl relative" />
                                </button>
                                {openAssetsdwId === folder.folderID && (
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

                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href="#">Download</a>
                                      </li>
                                      <li className="flex text-sm items-center">
                                        <CgMoveRight className="mr-2 text-lg" />
                                        Move to
                                      </li>
                                      <li>
                                        <button
                                          className="flex text-sm items-center"
                                          onClick={() =>
                                            deleteFolder(folder.folderID)}
                                        >
                                          <RiDeleteBin5Line className="mr-2 text-lg" />
                                          Move to Trash
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}

                            {/* {folderModals[folder.folderID] && (
                       
                        <NewSubFolderDialog
                          onClose={() => closeModal(folder.folderID)}
                          folderId={folder.folderID}
                          onCreate={(folderName) => {
                            closeModal(folder.folderID);
                          }}
                          selectedData={selectedItems}
                          />
                       
                        )} */}

                          </li>

                        )
                      }
                    </>
                  )

                  )}

                  {gridData.length > 0 ? (
                    gridData.map((item, index) => (
                      <li
                        key={`tabitem-grid-${item.id}-${index}`}
                        draggable
                        onDragStart={(event) => handleDragStart(event, item.id)} // Initiate drag
                        className="relative list-none assetsbox"
                      >
                        {item.categorieType === "Image" && (
                          <img
                            src={item.fileType}
                            alt={item.name}
                            className={`imagebox relative ${selectedItems.includes(item)
                              ? "active opacity-1 w-full rounded-2xl"
                              : "opacity-1 w-full rounded-2xl"
                              }`}
                          />
                        )}

                        {item.categorieType === "OnlineImage" && (
                          <img
                            src={item.fileType}
                            alt={item.name}
                            className={`imagebox relative ${selectedItems.includes(item)
                              ? "active opacity-1 w-full rounded-2xl"
                              : "opacity-1 w-full rounded-2xl"
                              }`}
                          />
                        )}

                        {item.categorieType === "OnlineVideo" && (
                          <video
                            controls
                            className="w-full rounded-2xl relative h-56"
                          >
                            <source src={item.fileType} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}

                        {item.categorieType === "Video" && (
                          <video
                            controls
                            className="w-full rounded-2xl relative h-56"
                          >
                            <source src={item.fileType} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}

                        <div
                          className="tabicon text-center absolute left-2/4 bottom-[0px] z-10"
                          onMouseEnter={() => setHoveredTabIcon(item)}
                          onMouseLeave={() => setHoveredTabIcon(null)}
                          onClick={() => handleIconClick(item)}
                        >
                          {item.categorieType === "Image" && (
                            <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {item.categorieType === "Video" && (
                            <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {item.categorieType === "OnlineImage" && (
                            <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {item.categorieType === "OnlineVideo" && (
                            <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}
                        </div>

                        {/*start hover icon details */}
                        {hoveredTabIcon === item && (
                          <div className="vdetails">
                            <div className="flex justify-end">
                              <div className="storage mb-1">
                                {/* <span className="bg-white text-primary rounded-sm p-1 text-sm">
                                {item.fileSize}
                              </span> */}
                              </div>
                            </div>
                            <div className="text-center clickdetail">
                              <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                                {item.name}
                              </h3>
                              {/*<p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                              {item.details}
                            </p> */}
                              <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                                {item.createdDate}
                              </h6>
                              <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {item.categorieType}
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

                        {/*start checkbox*/}

                        {/* <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                          <input
                            type="checkbox"
                            className="w-[20px] h-[20px]"
                            checked={selectAll || selectedItems.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                          />
                          <button onClick={() => updateassetsdw(item)}>
                            <BsThreeDots className="text-2xl" />
                          </button>
                          {assetsdw === item && selectedItems.includes(item) && (
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
                                {item.categorieType === "Image" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}

                                {item.categorieType === "Video" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                                {item.categorieType === "OnlineImage" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}

                                {item.categorieType === "OnlineVideo" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                                {item.categorieType === "DOC" && (
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.fileType} download>
                                      Download
                                    </a>
                                  </li>
                                )}
                                <li className="flex text-sm items-center relative">
                                  {selectedItems.length > 0 && (
                                    <div className="move-to-button">
                                      <button onClick={toggleMoveTo}>
                                        <CgMoveRight className="mr-2 text-lg" />
                                        Move to
                                      </button>


                                      {isMoveToOpen && (
                                        <div className="move-to-dropdown">
                                          <ul>
                                            {newSubFolder.map((folder) => (
                                              <li key={folder.folderID}>
                                                <button
                                                  onClick={() =>
                                                    handleMoveTo(folder.folderID)
                                                  }
                                                >
                                                  {folder.folderName}
                                                </button>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </li>
                                <li>
                                  <button
                                    onClick={() => handelDeletedata(item.id)}
                                    className="flex text-sm items-center"
                                  >
                                    <RiDeleteBin5Line className="mr-2 text-lg" />
                                    Move to Trash
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div> */}

                        {/*end of checkbox*/}
                        {item.categorieType === "DOC" && (
                          <div className="bg-white px-4 py-5 rounded-lg shadow-lg h-full">
                            {item.categorieType === "DOC" && (
                              <HiDocumentDuplicate className=" text-primary text-4xl mt-10" />
                            )}
                            {item.categorieType === "DOC" && (
                              <a
                                href={item.fileType}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.name}
                              </a>
                            )}
                            {item.categorieType === "DOC" && (
                              <p>{item.details}</p>
                            )}
                          </div>
                        )}
                      </li>
                    ))
                  ) : (
                    <p>Not Assets Found</p>
                  )}
                </div>

                <div className=" page-content grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-8 mb-5 assets-section">
                  {folderData.map((folderAsset) => (
                    <>
                      <div key={folderAsset.id} className="relative assetsbox">
                        {folderAsset.categorieType === "OnlineImage" && (
                          <img
                            src={folderAsset.fileType}
                            alt={folderAsset.name}
                            className="imagebox relative opacity-1 w-full rounded-2xl"
                          />
                        )}

                        {folderAsset.categorieType === "OnlineVideo" && (
                          <video
                            controls
                            className="w-full rounded-2xl relative imagebox"
                          >
                            <source
                              src={folderAsset.fileType}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {folderAsset.categorieType === "Image" && (
                          <img
                            src={folderAsset.fileType}
                            alt={folderAsset.name}
                            className="imagebox relative opacity-1 w-full rounded-2xl"
                          />
                        )}
                        {folderAsset.categorieType === "Video" && (
                          <video
                            controls
                            className="w-full rounded-2xl relative h-56  list-none imagebox"
                          >
                            <source
                              src={folderAsset.fileType}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {folderAsset.categorieType === "DOC" && (
                          <a
                            href={folderAsset.fileType}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="imagebox relative opacity-1 w-full rounded-2xl"
                          >
                            {folderAsset.name}
                          </a>
                        )}

                        <div
                          className="tabicon text-center absolute left-2/4 bottom-[0px] z-10"
                          onMouseEnter={() => setHoveredTabIcon(folderAsset)}
                          onMouseLeave={() => setHoveredTabIcon(null)}
                          onClick={() => handleIconClick(folderAsset)}
                        >
                          {folderAsset.categorieType === "Image" && (
                            <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {folderAsset.categorieType === "Video" && (
                            <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {folderAsset.categorieType === "OnlineImage" && (
                            <RiGalleryFill className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}

                          {folderAsset.categorieType === "OnlineVideo" && (
                            <HiOutlineVideoCamera className="bg-primary text-white text-3xl p-3 rounded-full  xs:min-w-[50px]  xs:min-h-[50px] sm:min-w-[60px]  sm:min-h-[60px] md:min-w-[50px] md:min-h-[50px]  lg:min-w-[60px]  lg:min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer " />
                          )}
                        </div>

                        {hoveredTabIcon === folderAsset && (
                          <div className="vdetails">
                            <div className="flex justify-end">
                              <div className="storage mb-1">
                                {/* <span className="bg-white text-primary rounded-sm p-1 text-sm">
                                {item.fileSize}
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
                                {folderAsset.categorieType}
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

                        {/*start hover icon details */}
                        {hoveredTabIcon === folderAsset && (
                          <div className="vdetails">
                            <div className="flex justify-end">
                              <div className="storage mb-1">
                                {/* <span className="bg-white text-primary rounded-sm p-1 text-sm">
                        {item.fileSize}
                      </span> */}
                              </div>
                            </div>
                            <div className="text-center clickdetail">
                              <h3 className="lg:text-base md:text-sm sm:text-sm xs:text-xs  mb-1">
                                {folderAsset.name}
                              </h3>
                              {/*<p className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                      {folderAsset.details}
                    </p> */}
                              <h6 className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light">
                                {folderAsset.createdDate}
                              </h6>
                              <span className="lg:text-base md:text-sm sm:text-sm xs:text-xs font-light m-0">
                                {folderAsset.categorieType}
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
                                  {folderAsset.categorieType === "Image" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={folderAsset.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}

                                  {folderAsset.categorieType === "Video" && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a href={folderAsset.fileType} download>
                                        Download
                                      </a>
                                    </li>
                                  )}
                                  {folderAsset.categorieType ===
                                    "OnlineImage" && (
                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href={folderAsset.fileType} download>
                                          Download
                                        </a>
                                      </li>
                                    )}

                                  {folderAsset.categorieType ===
                                    "OnlineVideo" && (
                                      <li className="flex text-sm items-center">
                                        <FiDownload className="mr-2 text-lg" />
                                        <a href={folderAsset.fileType} download>
                                          Download
                                        </a>
                                      </li>
                                    )}
                                  {folderAsset.categorieType === "DOC" && (
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
                                        <button onClick={toggleMoveTo}>
                                          <CgMoveRight className="mr-2 text-lg" />
                                          Move to
                                        </button>


                                        {isMoveToOpen && (
                                          <div className="move-to-dropdown">
                                            <ul>
                                              {newFolder.map((folder) => (
                                                <li key={folder.folderID}>
                                                  <button
                                                    onClick={() =>
                                                      handleMoveTo(folder.folderID)
                                                    }
                                                  >
                                                    {folder.folderName}
                                                  </button>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </li>
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleMoveToTrash(folderAsset.id)
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
                    </>
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
