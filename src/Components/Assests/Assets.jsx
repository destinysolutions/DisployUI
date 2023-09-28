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
import { RiDeleteBin5Line } from "react-icons/ri";
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
  GET_ALL_FILES,
  GET_ALL_NEW_FOLDER,
  MOVE_TO_FOLDER,
} from "../../Pages/Api";
import { FcOpenedFolder } from "react-icons/fc";

const Assets = ({ sidebarOpen, setSidebarOpen }) => {
  Assets.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const history = useNavigate();

  {
    /* video btn */
  }
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

  {
    /* tab1 threedot dwopdown */
  }
  const [assetsdw, setassetsdw] = useState(null);

  const updateassetsdw = (id) => {
    if (assetsdw === id) {
      setassetsdw(null);
    } else {
      setassetsdw(id);
    }
  };
  {
    /* tab2 threedot dwopdown */
  }
  const [assetsdw2, setassetsdw2] = useState(null);
  const updateassetsdw2 = (id) => {
    if (assetsdw2 === id) {
      setassetsdw2(null);
    } else {
      setassetsdw2(id);
    }
  };

  {
    /*checkedbox */
  }
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

  const fetchData = () => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;
        console.log(fetchedData);
        setOriginalData(fetchedData);
        const allAssets = [
          
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        const sortedAssets = allAssets.sort((a, b) => {
          return new Date(b.createdDate) - new Date(a.createdDate);
        });
        
        setGridData(sortedAssets);
        setTableData(sortedAssets);
      })
      .catch((error) => {
        console.log(error);
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
    // Ensure that originalData is available before updating tabitems
    if (btnNumber === 1) {
      // Merge all types of assets into a single array
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

  const [trashData, setTrashData] = useState([]); // Array to store deleted items
  const handelDeletedata = (id) => {
    const deletedItem = gridData.find((item) => item.id === id); // Find the item to be deleted

    if (deletedItem) {
      const formData = new FormData();
      formData.append("Id", id);
      formData.append("operation", "Delete");
      formData.append("CategorieType", deletedItem.categorieType);

      axios
        .post(ALL_FILES_UPLOAD, formData)
        .then((response) => {
          // console.log("Data deleted successfully:", response.data);

          // Add the deleted item to the trashData array with necessary information
          const deletedWithInfo = {
            id: id,
            deletedDate: new Date(),
            name: deletedItem.name,
            categorieType: deletedItem.categorieType,
            fileType: deletedItem.fileType, // Set this to "Not available" when the source is not available
            fileSize: deletedItem.fileSize, // Retrieve and store the file size
            // You may add other properties here as needed
          };

          // Move the deleted item to the trash component by adding it to the trashData state
          setTrashData([...trashData, deletedWithInfo]);
          // console.log("data moved to trash");

          // Update the gridData to exclude the deleted item
          const updatedGridData = gridData.filter((item) => item.id !== id);
          setGridData(updatedGridData);
          setTableData(updatedGridData);
        })
        .catch((error) => {
          // Handle error
          console.error("Error deleting data:", error);
        });
    }
  };

  useEffect(() => {
    let data = JSON.stringify({
      trashId: trashData.id,
      fileName: trashData.name,
      fileLocation: trashData.fileType,
      dateDeleted: trashData.deletedDate,
      fileSize: trashData.fileSize,
      itemType: trashData.categorieType,
      dateModified: "",
      operation: "Insert",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_TRASH,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data, "response.data"));
      })
      .catch((error) => {
        console.log(error);
      });
  });


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
        setGridData([])
      })
      .catch((error) => {
        console.log(error);
      });
  };


  // New folder
  const [newFolder, setNewfolder] = useState([]);
  const [folderNames, setFolderNames] = useState([]);

  const folderName = "New Folder"
  // Define the fetchFolderDetails function
  const fetchFolderDetails = () => {
    axios
      .get(GET_ALL_NEW_FOLDER)
      .then((response) => {
        const fetchedData = response.data.data.filter(folder => !folder.deleted);
        setNewfolder(fetchedData);
        setFolderNames(fetchedData.map((folder) => folder.folderName));

        console.log(fetchedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchFolderDetails();
  }, []);

  const createFolder = () => {
    let nextFolderName = folderName;
    let counter = 1;

    while (folderNames.includes(nextFolderName)) {
      counter++;
      nextFolderName = `${folderName} ${counter}`;
    }
    const formData = new FormData();
    formData.append("operation", "Insert");
    formData.append("folderName", nextFolderName);
    axios
      .post(CREATE_NEW_FOLDER, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Folder created:", response.data);

        fetchFolderDetails();
      })
      .catch((error) => {
        console.error("Error creating folder:", error);
      });
  };

  //Delete new folder
  const deleteFolder = (folderID) => {
    console.log(folderID, 'folderID');
    const data = JSON.stringify({
      folderID: folderID,
      operation: "Delete",
    });

    axios
      .post(CREATE_NEW_FOLDER, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response, 'response');
        fetchFolderDetails();
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
      const updatedNewFolder = newFolder.map((item) => {
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
      setNewfolder(updatedNewFolder);
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

                <ul className="flex items-center xs:mt-2 sm:mt-0 md:mt-0  lg:mt-0  xs:mr-1  mr-3  rounded-full  border border-primary">
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
                      <AiOutlineUnorderedList />
                    </button>
                  </li>
                </ul>
                <button onClick={handleSelectAll}>
                  <input
                    type="checkbox"
                    className=" mx-1 w-6 h-5 mt-2"
                    checked={selectAll}
                    readOnly
                  />
                </button>

                {selectedItems.length > 0 && (
                  <button
                    onClick={handleDelete}
                    className="rounded-full px-2 py-2 m-1 text-center border hover:text-white hover:bg-red hover:border-red"
                  >
                    <RiDeleteBin5Line className=" text-lg" />
                  </button>
                )}
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
              <button
                className={activetab === 5 ? "tabactivebtn " : "tabbtn"}
              // onClick={() => handleActiveBtnClick(5)}
              >
                App
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
                {/*new folder*/}

                {newFolder.map((folder, index) => {
                  // const index = folderNames.findIndex((name) => name === folder.folderName);

                  return (
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
                            const newFolderNames = [...folderNames];
                            newFolderNames[index] = e.target.value;
                            setFolderNames(newFolderNames);
                            console.log(newFolderNames);
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
                       
                        <NewFolderDialog
                          onClose={() => closeModal(folder.folderID)}
                          folderId={folder.folderID}
                          onCreate={(folderName) => {
                            closeModal(folder.folderID);
                          }}
                          selectedData={selectedItems}
                          />
                       
                        )} */}
                    </li>
                  );
                })}

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

                      <div className="checkbox flex justify-between absolute top-5 px-4 w-full">
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
                      </div>

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
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newFolder.map((folder) => (
                      <>
                        <tr
                          key={`folder-${folder.folderID}`}
                          className="bg-white rounded-lg font-normal text-[14px] text-[#5E5E5E] shadow-sm newfolder"
                        >
                          <td className="flex items-center relative">
                            <div>
                              <FcOpenedFolder className="text-8xl text-center mx-auto" />
                            </div>
                            <div className="ml-3">
                              <h1 className="font-medium text-base">
                                {folder.folderName}
                              </h1>
                            </div>
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{folder.fileSize}</td>
                          <td>
                            <input
                              type="checkbox"
                              className="w-[20px] h-[20px]"
                            />
                          </td>
                          <td className="relative w-[40px]">
                            <button
                              onClick={() =>
                                toggleAssetsdwList(folder.folderID)
                              }
                              className="absolute right-4 top-[37%]"
                            >
                              <BsThreeDotsVertical className="text-2xl relative" />
                            </button>
                            {openAssetsdwIdList === folder.folderID && (
                              <div className="assetsdw bottom-[-90px]">
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
                                        DeleteFolder(folder.folderID)
                                      }
                                    >
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Move to Trash
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </td>
                        </tr>

                        <tr>
                          <div className="mb-2"></div>
                        </tr>
                      </>
                    ))}

                    {tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr
                          key={`tabitem-table-${item.id}-${index}`}
                          className=" mt-2 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] shadow-inner"
                        >
                          <td className="flex items-center relative">
                            {item.categorieType === "Image" && (
                              <div className="imagebox relative">
                                <img
                                  src={item.fileType}
                                  className="rounded-2xl"
                                />
                                <div className="tabicon text-center absolute right-0 bottom-[25px]">
                                  {item.categorieType === "Image" && (
                                    <RiGalleryFill className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            {item.categorieType === "Video" && (
                              <div className="relative videobox">
                                <video
                                  controls
                                  className="w-full rounded-2xl relative"
                                >
                                  <source
                                    src={item.fileType}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                <div className="tabicon text-center absolute left-10 top-3">
                                  {item.categorieType === "Video" && (
                                    <HiOutlineVideoCamera className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            {item.categorieType === "OnlineImage" && (
                              <div className="imagebox relative">
                                <img
                                  src={item.fileType}
                                  className="rounded-2xl"
                                />
                                <div className="tabicon text-center absolute right-0 bottom-[25px]">
                                  {item.categorieType === "Image" && (
                                    <RiGalleryFill className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            {item.categorieType === "OnlineVideo" && (
                              <div className="relative videobox">
                                <video
                                  controls
                                  className="w-full rounded-2xl relative"
                                >
                                  <source
                                    src={item.fileType}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                                <div className="tabicon text-center absolute left-10 top-3">
                                  {item.categorieType === "Video" && (
                                    <HiOutlineVideoCamera className="bg-primary text-white p-2 text-3xl rounded-full shadow-lg" />
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="ml-2">
                              <h1 className="font-medium lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                {item.name}
                              </h1>
                              <p className="max-w-[250px] lg:text-base md:text-sm sm:text-sm xs:text-xs">
                                {item.details}
                              </p>
                            </div>
                          </td>

                          <td>{item.durations}</td>
                          <td>{item.resolutions}</td>
                          <td className=" break-all max-w-sm">
                            {item.categorieType}
                          </td>
                          <td>{item.fileSize}</td>

                          <td>
                            <input
                              type="checkbox"
                              className="w-[20px] h-[20px]"
                            />
                          </td>
                          <td className="relative w-[40px]">
                            <button onClick={() => updateassetsdw2(item)}>
                              <BsThreeDotsVertical className="text-2xl relative" />
                            </button>
                            {assetsdw2 === item && (
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
                                    Download
                                  </li>
                                  <li className="flex text-sm items-center">
                                    <CgMoveRight className="mr-2 text-lg" />
                                    Move to
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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>Loading data...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/*End of List View */}
            {/* <h2>Trash</h2> */}

            {/* sucess popup */}
          </div>
        </div>
      }
      <Footer />
    </>
  );
};

export default Assets;
