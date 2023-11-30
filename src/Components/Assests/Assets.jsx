import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TiFolderOpen } from "react-icons/ti";
import { AiOutlineCloudUpload, AiOutlineUnorderedList } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import "../../Styles/assest.css";
import { FiUpload } from "react-icons/fi";
import { MdPlaylistPlay } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { RiDeleteBin5Line, RiDeleteBin6Line } from "react-icons/ri";
import { CgMoveRight } from "react-icons/cg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Footer from "../Footer";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RiGalleryFill } from "react-icons/ri";
import { HiDocumentDuplicate } from "react-icons/hi";

import {
  ADD_TRASH,
  ALL_FILES_UPLOAD,
  CREATE_NEW_FOLDER,
  DeleteAllData,
  FetchdataFormFolder,
  GET_ALL_FILES,
  GET_ALL_NEW_FOLDER,
  MOVE_TO_FOLDER,
  SELECT_BY_ASSET_ID,
} from "../../Pages/Api";
import { FcOpenedFolder } from "react-icons/fc";
import { useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";

const Assets = ({ sidebarOpen, setSidebarOpen }) => {
  Assets.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const history = useNavigate();
  const [asstab, setTogglebtn] = useState(1);
  const updatetoggle = (id) => {
    setTogglebtn(id);
  };

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

  /* tab1 threedot dwopdown */

  const [assetsdw, setassetsdw] = useState(null);

  const updateassetsdw = (id) => {
    if (assetsdw === id) {
      setassetsdw(null);
    } else {
      setassetsdw(id);
    }
  };

  /* tab2 threedot dwopdown */

  const [assetsdw2, setassetsdw2] = useState(null);
  const updateassetsdw2 = (id) => {
    if (assetsdw2 === id) {
      setassetsdw2(null);
    } else {
      setassetsdw2(id);
    }
  };

  /*checkedbox */

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

  /*API */

  const [activetab, setActivetab] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [newFolder, setNewfolder] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

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
        setTableData(sortedAssets);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    handleActiveBtnClick(1);
  }, []);

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
      setTableData(allAssets);
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
      setTableData(tableData);
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
      setTableData(tableData);
    } else if (btnNumber === 4) {
      setGridData(originalData.doc ? originalData.doc : []);
      setTableData(originalData.doc ? originalData.doc : []);
    } else if (btnNumber === 5) {
    }
  };
  // Delete API

  const [trashData, setTrashData] = useState([]);

  const handelDeletedata = (assetId) => {
    console.log("idid", assetId);

    const formData = new FormData();
    formData.append("AssetID", assetId);
    formData.append("Operation", "Delete");
    formData.append("IsActive", "true");
    formData.append("IsDelete", "false");
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
        console.log("response", response);
        // const deletedWithInfo = {
        //   id: id,
        //   deletedDate: new Date(),
        //   name: deletedItem.assetName,
        //   categorieType: deletedItem.assetType,
        //   fileType: deletedItem.assetFolderPath,
        //   fileSize: deletedItem.fileSize,
        // };

        // setTrashData([...trashData, deletedWithInfo]);

        const updatedGridData = gridData.filter(
          (item) => item.assetID !== assetId
        );
        setGridData(updatedGridData);
        setTableData(updatedGridData);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  // useEffect(() => {
  //   let data = JSON.stringify({
  //     trashId: trashData.id,
  //     fileName: trashData.name,
  //     fileLocation: trashData.fileType,
  //     dateDeleted: trashData.deletedDate,
  //     fileSize: trashData.fileSize,
  //     itemType: trashData.categorieType,
  //     dateModified: "",
  //     operation: "Insert",
  //   });

  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: ADD_TRASH,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {})
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  // select All checkbox

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...gridData]);
    }
    setSelectAll(!selectAll);
  };
  const handleDelete = () => {
    let data = JSON.stringify({
      operation: "ALLDelete",
    });

    let config = {
      method: "get",
      url: DeleteAllData,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        setGridData([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createFolder = () => {
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
            fetchData();
          })
          .catch((error) => {
            console.error("Error creating folder:", error);
          });
      }
    };

    // Function to check if the folder name already exists in the data
    const folderNameExists = (name) => {
      return originalData.folder.some((folder) => folder.assetName === name);
    };

    checkFolderNameAndCreate();
  };
  //Delete new folder
  const deleteFolder = (folderID) => {
    const data = JSON.stringify({
      folderID: folderID,
      operation: "Delete",
    });

    axios
      .post(CREATE_NEW_FOLDER, data, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response, "response");
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [deleteMessage, setDeleteMessage] = useState(false);

  const handleWarning = (assetId) => {
    console.log("wZAn id:", assetId);
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
        if (response.data.data == true) {
          setDeleteMessage(true);
        } else {
          handelDeletedata(assetId);
        }
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

  const handleKeyDown = (e, folderID) => {
    if (e.key === "Enter") {
      saveFolderName(folderID, folderName);
    } else if (e.key === "Escape") {
      setEditMode(null);
    }
  };

  const updateFolderNameInAPI = async (folderID, newName) => {
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
      fetchData();
      console.log("Folder name updated:", updatedFolder);
    } catch (error) {
      console.error("Error updating folder name:", error);
    }
  };

  const saveFolderName = (folderID, newName) => {
    updateFolderNameInAPI(folderID, newName);
    setEditMode(null);
  };

  // move to data in folder

  const [isMoveToOpen, setIsMoveToOpen] = useState(false);

  const toggleMoveTo = () => {
    setIsMoveToOpen(!isMoveToOpen);
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

      updateFolderContent(folderId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleMoveTo = (folderId) => {
    selectedItems.forEach((item) => {
      moveDataToFolder(item.assetID, folderId, item.assetType);
    });
  };
  const updateFolderContent = (folderId) => {
    try {
      axios.get(`${FetchdataFormFolder}?ID=${folderId}`).then((response) => {
        console.log(response.data);
        setGridData(response.data);
        fetchData();
      });
    } catch (error) {
      console.error("Error updating folder content:", error);
    }
  };
  const navigateToFolder = (folderId, selectedData) => {
    console.log("selectedData before navigation:", selectedData);
    history(`/NewFolderDialog/${folderId}`, { selectedData });
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
                {/* <button
                  onClick={handleSelectAll}
                  className="flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                >
                  <input
                    type="checkbox"
                    className="w-6 h-5"
                    readOnly
                    checked={selectAll}
                  />
                </button> */}

                {/* {selectedItems.length > 0 && (
                  <button
                    onClick={handleDelete}
                    className="rounded-full px-2 py-2 m-1 text-center border hover:text-white hover:bg-red hover:border-red"
                  >
                    <RiDeleteBin5Line className=" text-lg" />
                  </button>
                )} */}
              </div>
            </div>

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
              {/* <button className={activetab === 5 ? "tabactivebtn " : "tabbtn"}>
                App
              </button> */}
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
                      key={`tabitem-grid-${item.assetID}-${index}`}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, item.assetID)
                      }
                      className="relative list-none assetsbox"
                    >
                      {item.assetType === "Folder" && (
                        <div
                          onDragOver={handleDragOver}
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
                          className={`imagebox relative ${
                            selectedItems.includes(item)
                              ? "active opacity-1 w-full rounded-2xl"
                              : "opacity-1 w-full rounded-2xl"
                          }`}
                        />
                      )}

                      {item.assetType === "OnlineImage" && (
                        <img
                          src={item.assetFolderPath}
                          alt={item.assetName}
                          className={`imagebox relative ${
                            selectedItems.includes(item)
                              ? "active opacity-1 w-full rounded-2xl"
                              : "opacity-1 w-full rounded-2xl"
                          }`}
                        />
                      )}

                      {item.assetType === "OnlineVideo" && (
                        <video
                          controls
                          className="w-full rounded-2xl relative h-56"
                        >
                          <source src={item.assetFolderPath} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      {item.assetType === "Video" && (
                        <video
                          controls
                          className="w-full rounded-2xl relative h-56"
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

                      {/*start checkbox*/}

                      <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
                        <input
                          type="checkbox"
                          className="w-[20px] h-[20px] relative"
                          checked={selectAll || selectedItems.includes(item)}
                          onChange={() => handleCheckboxChange(item)}
                        />
                        <button
                          onClick={() => updateassetsdw(item)}
                          className="relative"
                        >
                          <BsThreeDots className="text-2xl" />
                        </button>
                        {assetsdw === item && selectedItems.includes(item) && (
                          <div className="assetsdw">
                            <ul>
                              {/* <li className="flex text-sm items-center">
                                <FiUpload className="mr-2 text-lg" />
                                Set to Screen
                              </li> */}
                              {/* <li className="flex text-sm items-center">
                                <MdPlaylistPlay className="mr-2 text-lg" />
                                Add to Playlist
                              </li> */}
                              {item.assetType === "Image" && (
                                <li className="flex text-sm items-center">
                                  <FiDownload className="mr-2 text-lg" />
                                  <a href={item.assetFolderPath} download>
                                    Download
                                  </a>
                                </li>
                              )}

                              {item.assetType === "Video" && (
                                <li className="flex text-sm items-center">
                                  <FiDownload className="mr-2 text-lg" />
                                  <a href={item.assetFolderPath} download>
                                    Download
                                  </a>
                                </li>
                              )}
                              {item.assetType === "OnlineImage" && (
                                <li className="flex text-sm items-center">
                                  <FiDownload className="mr-2 text-lg" />
                                  <a href={item.assetFolderPath} download>
                                    Download
                                  </a>
                                </li>
                              )}

                              {item.assetType === "OnlineVideo" && (
                                <li className="flex text-sm items-center">
                                  <FiDownload className="mr-2 text-lg" />
                                  <a href={item.assetFolderPath} download>
                                    Download
                                  </a>
                                </li>
                              )}
                              {item.assetType === "DOC" && (
                                <li className="flex text-sm items-center">
                                  <FiDownload className="mr-2 text-lg" />
                                  <a href={item.assetFolderPath} download>
                                    Download
                                  </a>
                                </li>
                              )}
                              <li className="flex text-sm items-center relative">
                                {selectedItems.length > 0 && (
                                  <div className="move-to-button relative">
                                    <button
                                      onClick={toggleMoveTo}
                                      className="flex relative"
                                    >
                                      <CgMoveRight className="mr-2 text-lg" />
                                      Move to
                                    </button>

                                    {isMoveToOpen && (
                                      <div className="move-to-dropdown">
                                        <ul>
                                          {originalData.folder.map((folder) => (
                                            // Check if the folder is not in the selectedItems array
                                            <>
                                              {selectedItems.every(
                                                (item) =>
                                                  item.assetID !==
                                                  folder.assetID
                                              ) && (
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
                                              )}
                                            </>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    handleWarning(item.assetID);
                                    deleteFolder(item.assetID);
                                  }}
                                  className="flex text-sm items-center"
                                >
                                  <RiDeleteBin5Line className="mr-2 text-lg" />
                                  Move to Trash
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                        {deleteMessage && (
                          <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-full max-w-xl max-h-full">
                              <div className="relative bg-white rounded-lg shadow">
                                <div className="py-6 text-center">
                                  <RiDeleteBin6Line className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
                                  <h3 className="mb-5 text-xl text-primary  px-5">
                                    Are you sure you want to delete this Asset?
                                    Because this Asset is being use in another
                                    place.If you click on yes it will get
                                    removed from the places where the asset is
                                    used.
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
                                        handelDeletedata(item.assetID);
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
                      </div>

                      {/*end of checkbox*/}
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
              <div className="assetstable">
                <table className="w-full text-left" cellPadding={15}>
                  <thead>
                    <tr className=" bg-lightgray rounded-xl">
                      <th className="text-black font-medium">Recent</th>
                      <th className="text-black font-medium">Duration</th>
                      <th className="text-black font-medium">Resolution</th>
                      <th className="text-black font-medium">Type</th>
                      <th className="text-black font-medium">Size</th>
                      {/* <th></th> */}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr
                          key={`tabitem-table-${item.assetID}-${index}`}
                          className=" mt-2 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] shadow-inner"
                        >
                          <td className="flex items-center relative">
                            {item.assetType === "Folder" && (
                              <div
                                onDragOver={handleDragOver}
                                onDrop={(event) =>
                                  handleDrop(event, item.assetID)
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
                              <div className="imagebox relative">
                                <img
                                  src={item.assetFolderPath}
                                  className="rounded-2xl"
                                />
                                <div className="tabicon text-center absolute left-[6px] top-[-25px]">
                                  {item.assetType === "Image" && (
                                    <RiGalleryFill className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            {item.assetType === "Video" && (
                              <div className="relative videobox">
                                <video
                                  controls
                                  className="w-full rounded-2xl relative"
                                >
                                  <source
                                    src={item.assetFolderPath}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                <div className="tabicon text-center absolute left-[6px] top-[-25px]">
                                  {item.assetType === "Video" && (
                                    <HiOutlineVideoCamera className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            {item.assetType === "OnlineImage" && (
                              <div className="imagebox relative">
                                <img
                                  src={item.assetFolderPath}
                                  className="rounded-2xl"
                                />
                                <div className="tabicon text-center absolute left-[6px] top-[-25px]">
                                  {item.assetType === "OnlineImage" && (
                                    <RiGalleryFill className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            {item.assetType === "OnlineVideo" && (
                              <div className="relative videobox">
                                <video
                                  controls
                                  className="w-full rounded-2xl relative"
                                >
                                  <source
                                    src={item.assetFolderPath}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                <div className="tabicon text-center absolute left-[6px] top-[-25px]">
                                  {item.assetType === "OnlineVideo" && (
                                    <HiOutlineVideoCamera className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="ml-2">
                              <h1 className="font-medium lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                {item.assetName}
                              </h1>
                            </div>
                          </td>

                          <td>{item.durations}</td>
                          <td>{item.resolutions}</td>
                          <td className=" break-all max-w-sm">
                            {item.assetType}
                          </td>
                          <td>{item.fileSize}</td>

                          {/* <td>
                            <input
                              type="checkbox"
                              className="w-[20px] h-[20px]"
                            />
                          </td> */}
                          <td className="relative w-[40px]">
                            <button
                              onClick={() => updateassetsdw2(item)}
                              className="relative"
                            >
                              <BsThreeDotsVertical className="text-2xl relative" />
                            </button>
                            {assetsdw2 === item && (
                              <div className="assetsdw">
                                <ul>
                                  {/* <li className="flex text-sm items-center">
                                    <FiUpload className="mr-2 text-lg" />
                                    Set to Screen
                                  </li>
                                  <li className="flex text-sm items-center">
                                    <MdPlaylistPlay className="mr-2 text-lg" />
                                    Add to Playlist
                                  </li> */}
                                  <li className="flex text-sm items-center">
                                    <FiDownload className="mr-2 text-lg" />
                                    <a href={item.assetFolderPath} download>
                                      Download
                                    </a>
                                  </li>
                                  {/* <li className="flex text-sm items-center">
                                    <CgMoveRight className="mr-2 text-lg" />
                                    Move to
                                  </li> */}
                                  {/* <li className="flex text-sm items-center relative">
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
                                            {originalData.folder.map(
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
                                  </li> */}
                                  <li>
                                    <button
                                      onClick={() => {
                                        handleWarning(item.assetID);
                                        deleteFolder(item.assetID);
                                      }}
                                      className="flex text-sm items-center"
                                    >
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Move to Trash
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                            {deleteMessage && (
                              <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div className="relative w-full max-w-xl max-h-full">
                                  <div className="relative bg-white rounded-lg shadow">
                                    <div className="py-6 text-center">
                                      <RiDeleteBin6Line className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
                                      <h3 className="mb-5 text-xl text-primary">
                                        Are you sure you want to delete this
                                        Asset?
                                      </h3>
                                      <div className="flex justify-center items-center space-x-4">
                                        <button
                                          className="border-primary border rounded text-primary px-5 py-2 font-bold text-lg"
                                          onClick={() =>
                                            setDeleteMessage(false)
                                          }
                                        >
                                          No, cancel
                                        </button>

                                        <button
                                          className="text-white bg-[#F21E1E] rounded text-lg font-bold px-5 py-2"
                                          onClick={() => {
                                            handelDeletedata(item.assetID);
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

            {/*End of List View */}

            {/* sucess popup */}
          </div>
        </div>
      }
      <Footer />
    </>
  );
};

export default Assets;
