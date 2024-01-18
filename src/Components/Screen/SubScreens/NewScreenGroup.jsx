import React, { useEffect, useState } from "react";
import "../../../Styles/sidebar.css";
import "../../../Styles/screen.css";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { TbUpload } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdDeleteForever, MdOutlineModeEdit } from "react-icons/md";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { IoMdRefresh } from "react-icons/io";
import PropTypes from "prop-types";
import Footer from "../../Footer";
import { connection } from "../../../SignalR";
import { AiOutlineCloudUpload, AiOutlinePlusCircle } from "react-icons/ai";
import { Tooltip } from "@material-tailwind/react";
import ScreenGroupModal from "./ScreenGroupModal";
import ShowAssetModal from "./model/ShowGroupAssetModal";
import { useDispatch, useSelector } from "react-redux";
// import { handleGetScreen } from "../../../Redux/Screenslice";
import { handleGetAllAssets } from "../../../Redux/Assetslice";
import { handleGetAllSchedule } from "../../../Redux/ScheduleSlice";
import { handleGetCompositions } from "../../../Redux/CompositionSlice";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../../Redux/AppsSlice";
import { BiEdit, BiSave } from "react-icons/bi";
import { addTagsAndUpdate, getGroupData, groupAssetsInUpdateScreen, groupInScreenDelete, openPriviewModel, resetStatus, saveGroupData, screenGroupDelete, screenGroupDeleteAll, updateGroupData } from "../../../Redux/ScreenGroupSlice";
import toast, { CheckmarkIcon } from "react-hot-toast";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import AddOrEditTagPopup from "../../AddOrEditTagPopup";
import { UPDATE_NEW_SCREEN } from "../../../Pages/Api";
import { handleChangeScreens } from "../../../Redux/Screenslice";
import PreviewModel from "./model/previewModel";
import ReactTooltip from 'react-tooltip';

const NewScreenGroup = ({ sidebarOpen, setSidebarOpen }) => {

  const { user, token } = useSelector((state) => state.root.auth);
  const store = useSelector((state) => state.root.screenGroup);
  const authToken = `Bearer ${token}`;

  const dispatch = useDispatch();

  NewScreenGroup.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [loadFirst, setLoadFirst] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);


  // GroupNameUpdate
  const [newGroupName, setNewGroupName] = useState('');
  const [editIndex, setEditIndex] = useState(-1); // Initially no index is being edited
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Multipal check
  const [editGroupID, setEditGroupID] = useState()
  const [getGroup, setGetGroup] = useState()   // used to singl group in all screenId get and handl save asstes

  //   Model
  const [label, setLabel] = useState('');
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedComposition, setSelectedComposition] = useState({ compositionName: "", });
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  // const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });
  const [assetPreview, setAssetPreview] = useState("");
  const [selectedYoutube, setSelectedYoutube] = useState();
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);

  const [editSelectedScreen, setEditSelectedScreen] = useState('');

  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagUpdateScreeen, setTagUpdateScreeen] = useState(null);

  //PreView model
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState();


  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed

  useEffect(() => {
    if (loadFirst) {
      // get all screen group
      dispatch(getGroupData());

      // load composition
      dispatch(handleGetCompositions({ token }));

      // get all assets files
      dispatch(handleGetAllAssets({ token }));

      // get all schedule
      dispatch(handleGetAllSchedule({ token }));

      // get youtube data
      dispatch(handleGetYoutubeData({ token }));

      //get text scroll data
      dispatch(handleGetTextScrollData({ token }));
      setLoadFirst(false);
    }

    if (store && store.status === "failed") {
      toast.error(store.error)
    }


    if (store && store.status === "succeeded") {
      toast.success(store.message)
      setLoadFirst(true)
    }

    if (store && store.status) {
      dispatch(resetStatus())
    }

  }, [dispatch, loadFirst, store]);

  const totalPages = Math.ceil((Array.isArray(store?.data) ? store.data.length : 0) / itemsPerPage);
  const paginatedData = Array.isArray(store?.data) ? store.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const callSignalR = () => {
    if (connection.state === "Disconnected") {
      connection
        .start()
        .then((res) => {
          console.log("signal connected");
        })
        .then(() => {
          connection
            .invoke(
              "ScreenConnected",
              store.data
                ?.map((item) => item?.maciDs)
                .join(",")
                .replace(/^\s+/g, "")
            )
            .then(() => {
              console.log("SignalR method invoked after screen update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        });
    } else {
      connection
        .invoke(
          "ScreenConnected",
          store.data
            ?.map((item) => item?.maciDs)
            .join(",")
            .replace(/^\s+/g, "")
        )
        .then(() => {
          console.log("SignalR method invoked after screen update");
        })
        .catch((error) => {
          console.error("Error invoking SignalR method:", error);
        });
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setLoadFirst(true)
  };

  const handleAccordionClick = (index) => {
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleRefres = () => {
    callSignalR()
  };

  // Multipal check
  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((id) => id !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Function to handle the "Select All" checkbox change
  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    if (selectedItems.length === store.data?.length) {
      setSelectedItems([]);
    } else {
      const allIds = store.data?.map((item) => item.screenGroupID);
      setSelectedItems(allIds);
    }
  };

  // Model Function
  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleAppsAdd = (apps) => {
    setSelectedYoutube(apps);
    setSelectedTextScroll(apps);
  };

  const handleAssetUpdate = () => {
    // const screenToUpdate = screens.find((screen) => screen.screenID === assetScreenID);
    // let moduleID =
    //   selectedAsset?.assetID ||
    //   selectedComposition?.compositionID ||
    //   selectedYoutube?.youtubeId ||
    //   selectedTextScroll?.textScroll_Id;
    // // return console.log(moduleID, selectedComposition);
    // let mediaType = selectedAsset?.assetID
    //   ? 1
    //   : selectedTextScroll?.textScroll_Id !== null &&
    //     selectedTextScroll?.textScroll_Id !== undefined
    //   ? 4
    //   : selectedYoutube?.youtubeId !== null &&
    //     selectedYoutube?.youtubeId !== undefined
    //   ? 5
    //   : selectedComposition?.compositionID !== null &&
    //     selectedComposition?.compositionID !== undefined
    //   ? 3
    //   : 0;
    // let mediaName =
    //   selectedAsset?.assetName ||
    //   selectedComposition?.compositionName ||
    //   selectedYoutube?.instanceName ||
    //   selectedTextScroll?.instanceName;
    // if (screenToUpdate) {
    //   let data = {
    //     ...screenToUpdate,
    //     screenID: assetScreenID,
    //     mediaType: mediaType,
    //     mediaDetailID: moduleID,
    //     operation: "Update",
    //   };
    //   toast.loading("Updating...");
    //   const response = dispatch(
    //     handleUpdateScreenAsset({ mediaName, dataToUpdate: data, token })
    //   );
    //   if (!response) return;
    //   response
    //     .then((response) => {
    //       toast.remove();
    //       toast.success("Media Updated.");
    //       if (connection) {
    //         connection
    //           .invoke("ScreenConnected")
    //           .then(() => {
    //             console.log("SignalR method invoked after Asset update");
    //           })
    //           .catch((error) => {
    //             console.error("Error invoking SignalR method:", error);
    //           });
    //       }
    //       setIsEditingScreen(false);
    //     })
    //     .catch((error) => {
    //       toast.remove();
    //       console.log(error);
    //     });
    // } else {
    //   toast.remove();
    //   console.error("Asset not found for update");
    // }
  };

  const editGroupName = (index) => {     // GroupNameUpdate
    setEditIndex(index);
    setNewGroupName(store.data[index].screenGroupName);
    setEditGroupID(store.data[index].screenGroupID)
  }

  const updateGroupName = async (index) => {    // GroupNameUpdate
    const payload = {
      screenGroupID: editGroupID,
      screenGroupName: newGroupName
    }
    await dispatch(saveGroupData(payload))
    setEditIndex(-1)
  }

  const newAddGroup = (item) => {
    if (item) {
      setLabel("Update")
      setEditSelectedScreen(item)
    } else {
      setLabel("Save")
      setEditSelectedScreen()
    }
    setIsModalOpen(true)
  }

  // New add groupScreen
  const handleSaveNew = async (payload) => {
    await dispatch(saveGroupData(payload))
  };

  const updateScreen = async (payload) => {
    await dispatch(saveGroupData(payload))
  }

  const handleDeleteGroup = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(screenGroupDelete(item.screenGroupID))
        setSelectedItems([]);
        setSelectAll(false)
        callSignalR()
      }
    })
  };

  const handleDeleteGroupAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(screenGroupDeleteAll(selectedItems))
        setSelectedItems([]);
        setSelectAll(false)
        callSignalR()
      }
    })
  };

  const deleteGroupInScreen = (payload) => {
    dispatch(groupInScreenDelete(payload))
  }

  const handleTagsUpdate = (tags) => {
    const {
      otp,
      googleLocation,
      timeZone,
      screenOrientation,
      screenResolution,
      macid,
      ipAddress,
      postalCode,
      latitude,
      longitude,
      userID,
      mediaType,
      mediaDetailID,
      tvTimeZone,
      tvScreenOrientation,
      tvScreenResolution,
    } = tagUpdateScreeen;

    let data = {
      screenID: tagUpdateScreeen?.screenID,
      otp,
      googleLocation,
      timeZone,
      screenOrientation,
      screenResolution,
      macid,
      ipAddress,
      postalCode,
      latitude,
      longitude,
      userID,
      mediaType,
      tags,
      mediaDetailID,
      tvTimeZone,
      tvScreenOrientation,
      tvScreenResolution,
      screenName: null,
      operation: "Update",
    };

    dispatch(addTagsAndUpdate(data))

  };


  const handleSave = () => {
    const payload = {
      GroupID: getGroup.screenGroupID,
      MediaID: '',
      MediaDetailID: '',
      AssetName: '',
      AssetType: '',
      FilePath: '',
    };

    if (selectedAsset.assetID) {
      payload.MediaID = selectedAsset.assetID;
      payload.AssetName = selectedAsset.assetName;
      payload.AssetType = selectedAsset.assetType;
      payload.FilePath = selectedAsset.assetFolderPath;
      payload.MediaDetailID = 1;
    }

    if (selectedComposition.compositionID) {
      payload.AssetName = selectedComposition.compositionName
      payload.MediaID = selectedComposition.compositionID;
      payload.AssetType = '';
      payload.FilePath = '';
      payload.MediaDetailID = 3;
    }

    if (selectedTextScroll.textScroll_Id) {
      payload.AssetName = selectedTextScroll.instanceName
      payload.MediaID = selectedTextScroll.textScroll_Id;
      payload.AssetType = '';
      payload.FilePath = '';
      payload.MediaDetailID = 4;
    }

    if (selectedYoutube.compositionID) {
      payload.AssetName = selectedYoutube.instanceName
      payload.MediaID = selectedYoutube.compositionID;
      payload.AssetType = '';
      payload.FilePath = '';
      payload.MediaDetailID = 3;
    }

    if (selectedYoutube.youtubeId) {
      payload.MediaID = selectedYoutube.instanceName;
      payload.AssetType = '';
      payload.FilePath = '';
      payload.MediaDetailID = 5;
    }

    dispatch(groupAssetsInUpdateScreen(payload))
  }

  const handleOpenPreview = (item) => {
    setIsPreviewOpen(true);
    dispatch(openPriviewModel(item.screenGroupID))
    setPreviewData(item)
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setLoadFirst(true)
  };

  if (store.status === "priview") {
    console.log("----------- store priview -",store.data);
  }

  return (
    <>
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-16 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="justify-between lg:flex md:flex items-center sm:block">
            <div className="section-title">
              <h1 className="not-italic font-medium text-2xl text-[#001737]">
                Group Name
              </h1>
            </div>
            <div className="flex items-center sm:mt-3 flex-wrap gap-1">

              <button
                data-tip data-for="Refresh Screen"
                type="button"
                className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                onClick={() => handleRefres()}
              >
                <IoMdRefresh className="p-1 px-2 text-4xl text-white hover:text-white" />
                <ReactTooltip id="Refresh Screen" place="left" type="warning" effect="float">
                  <span>Refresh Screen</span>
                </ReactTooltip>
              </button>

              <button
                data-tip data-for="Screen Group"
                type="button"
                className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                onClick={() => newAddGroup()}
              >
                <HiOutlineRectangleGroup className="p-1 px-2 text-4xl text-white hover:text-white" />
                <ReactTooltip id="Screen Group" place="left" type="warning" effect="float">
                  <span>Screen Group</span>
                </ReactTooltip>
              </button>

              {isModalOpen && (
                <ScreenGroupModal isOpen={isModalOpen} onClose={closeModal} handleSaveNew={handleSaveNew} updateScreen={updateScreen} editSelectedScreen={editSelectedScreen} label={label} />
              )}

              {store.data?.length > 0 && (
                <div>
                  <button
                    data-tip data-for="Select All"
                    type="button"
                    className="flex align-middle border-white text-white items-center"
                  >
                    <input type="checkbox" className="w-6 h-5" checked={selectAll} onChange={handleSelectAll} readOnly />
                  </button>

                  <ReactTooltip id="Select All" place="left" type="warning" effect="float">
                    <span>Select All</span>
                  </ReactTooltip>

                </div>
              )}

              {selectedItems.length > 0 && (
                <div>
                  <button data-tip data-for="All Delete" className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                    <RiDeleteBin5Line
                      className="text-3xl p-1 hover:text-white"
                      onClick={() => handleDeleteGroupAll()}
                    />
                  </button>

                  <ReactTooltip id="All Delete" place="left" type="warning" effect="float">
                    <span>Delete</span>
                  </ReactTooltip>
                </div>
              )}

            </div>
          </div>

          {paginatedData && paginatedData.length > 0 ? paginatedData.map((item, i) => {
            const isAccordionOpen = openAccordionIndex === i;
            return (
              <div key={i} className="accordions mt-5">
                <div
                  className="section shadow-md p-5 bg-white  lg:flex md:flex  sm:block items-center justify-between" >
                  <div className="flex gap-2 items-center">
                    {editIndex === i ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          className="formInput block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <div>
                          <BiSave className="cursor-pointer text-xl text-[#0000FF]" onClick={() => updateGroupName(i)} />
                          <IoClose className="cursor-pointer text-xl text-[#FF0000]" onClick={() => { setEditIndex(-1); setNewGroupName("") }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <h1 className="text-lg capitalize">{item.screenGroupName}</h1>
                        <BiEdit className="cursor-pointer text-xl text-[#0000FF]" onClick={() => editGroupName(i)} />
                      </>
                    )}
                  </div>

                  <div className="flex items-center">
                    <div className=" flex items-center">
                      {isAccordionOpen && (
                        <>
                          <button data-tip data-for="Add Screen" className="bg-lightgray py-2 px-2 text-sm rounded-md mr-2 hover:bg-primary hover:text-white" onClick={() => newAddGroup(item)}>
                            Add <b>+</b>
                            <ReactTooltip id="Add Screen" place="left" type="warning" effect="float">
                              <span>Add Screen</span>
                            </ReactTooltip>
                          </button>


                          {!item.isPreview &&
                            <button data-tip data-for="Preview" className="bg-lightgray py-2 px-2 text-sm rounded-md mr-2 hover:bg-primary hover:text-white" onClick={() => handleOpenPreview(item)}>
                              Preview
                              <ReactTooltip id="Preview" place="left" type="warning" effect="float">
                                <span>Preview</span>
                              </ReactTooltip>
                            </button>
                          }

                          <button
                            data-tip data-for="Upload"
                            className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                            onClick={() => { setShowAssetModal(true); setGetGroup(item) }}
                          >
                            <TbUpload className="text-3xl p-1 hover:text-white" />
                            <ReactTooltip id="Upload" place="left" type="warning" effect="float">
                              <span>Upload</span>
                            </ReactTooltip>
                          </button>

                          {!selectedItems?.length && (
                            <button data-tip data-for="All Delete" className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                              <RiDeleteBin5Line
                                className="text-3xl p-1 hover:text-white"
                                onClick={() => handleDeleteGroup(item)}
                              />
                              <ReactTooltip id="All Delete" place="left" type="warning" effect="float">
                                <span>Delete</span>
                              </ReactTooltip>
                            </button>
                          )}

                        </>
                      )}

                      {selectAll ? (<CheckmarkIcon className="w-5 h-5" />) : (
                        <div>
                          <input
                            type="checkbox"
                            data-tip data-for="Select"
                            className=" mx-1 w-6 h-5 mt-2"
                            checked={selectedItems.includes(item?.mergeScreenId)}
                            onChange={() => handleCheckboxChange(item?.mergeScreenId)}
                          />
                          <ReactTooltip id="Select" place="left" type="warning" effect="float">
                            <span>Select</span>
                          </ReactTooltip>
                        </div>
                      )}

                      <button>
                        {isAccordionOpen ? (
                          <div onClick={() => handleAccordionClick(i)}>
                            <IoIosArrowDropup className="text-3xl" />
                          </div>
                        ) : (
                          <div onClick={() => handleAccordionClick(i)}>
                            <IoIosArrowDropdown className="text-3xl" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {isAccordionOpen && (
                  <div className=" relative shadow-md ">
                    <table
                      className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed"
                      cellPadding={20}
                    >
                      <thead>
                        <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className="flex items-center justify-center px-6 py-2">
                              Screen
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" flex items-center justify-center mx-auto px-6 py-2">
                              Status
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" flex items-center justify-center mx-auto px-6 py-2">
                              Last Seen
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" flex items-center justify-center mx-auto px-6 py-2">
                              Now Playing
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" px-6 py-2 flex items-center justify-center mx-auto">
                              Current Schedule
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" px-6 py-2 flex  items-center justify-center mx-auto">
                              Tags
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" px-6 py-2 flex  items-center justify-center mx-auto">
                              Action
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isAccordionOpen && item && item.screenGroupLists?.length > 0 && item.screenGroupLists.map((screen, index) => {
                          return (
                            <tr
                              key={index}
                              className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2"
                            >
                              <td className="flex items-center">
                                {screen.screenName}
                              </td>
                              <td className="p-2 text-center">
                                {screen.screenStatus === 1 ? (
                                  <button className="bg-[#3AB700] rounded-full px-6 py-1 text-white hover:bg-primary">
                                    Live
                                  </button>
                                ) : (
                                  <button className="bg-[#FF0000] rounded-full px-6 py-1 text-white">
                                    Off
                                  </button>
                                )}
                              </td>
                              <td className="p-2 text-center">
                                {screen.last_seen}
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  style={{ width: "max-content" }}
                                  className="flex items-centerborder-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto hover:bg-primary-500"
                                >
                                  {screen.assetName}
                                  <AiOutlineCloudUpload className="ml-2 text-lg" />
                                </button>
                              </td>
                              <td className="break-words	w-[150px] p-2 text-center">
                                {screen.scheduleName}
                              </td>
                              <td
                                title={screen?.tags && screen?.tags}
                                className="mx-auto  p-2 text-center">
                                {(screen?.tags === "" || screen?.tags === null) && (
                                  <span>
                                    <AiOutlinePlusCircle
                                      size={30}
                                      className="mx-auto cursor-pointer"
                                      onClick={() => {
                                        setShowTagModal(true);
                                        screen.tags === "" || screen?.tags === null
                                          ? setTags([])
                                          : setTags(screen?.tags?.split(","));
                                        setTagUpdateScreeen(screen);
                                      }}
                                    />
                                  </span>
                                )}
                                {screen?.tags !== null ? screen.tags.split(",").slice(0, screen.tags.split(",").length > 2 ? 3 : screen.tags.split(",").length)
                                  .map((text) => {
                                    if (text.toString().length > 10) {
                                      return text.split("").slice(0, 10).concat("...").join("");
                                    } return text;
                                  }).join(",") : ""}
                                {screen?.tags !== "" && screen?.tags !== null && (
                                  <AiOutlinePlusCircle
                                    onClick={() => { setShowTagModal(true); screen.tags === "" || screen?.tags === null ? setTags([]) : setTags(screen?.tags?.split(",")); setTagUpdateScreeen(screen); }}
                                    className="mx-auto  w-5 h-5 cursor-pointer "
                                  />
                                )}

                                {/* add or edit tag modal */}
                                {showTagModal && (
                                  <AddOrEditTagPopup
                                    setShowTagModal={setShowTagModal}
                                    tags={tags}
                                    setTags={setTags}
                                    handleTagsUpdate={handleTagsUpdate}
                                    from="screen"
                                    setTagUpdateScreeen={setTagUpdateScreeen}
                                  />
                                )}
                              </td>
                              <td className="p-2 justify-center flex ">
                                <div className="cursor-pointer text-xl flex gap-3 text-right">
                                  <MdDeleteForever className="text-[#EE4B2B]" onClick={() => deleteGroupInScreen({ ScreenGroupListID: screen.screenGroupListID })} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          }) : <>
            <div className="flex text-center m-5 justify-center">
              <span className="text-2xl hover:bg-gray-400 text-gray-800 mt-20 font-semibold rounded-full text-green-800 me-2 px-2.5 py-0.5 dark:bg-green-900 dark:text-green-300">
                Data not found!
              </span>
            </div>
          </>}
        </div>
        {/* end  pagination */}
        {paginatedData && paginatedData.length > 0 && (
          <div className="flex justify-end m-5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Previous
            </button>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        )}
        {/* end  pagination */}
      </div>

      {/* Model */}
      {showAssetModal && (
        <ShowAssetModal
          handleAssetAdd={handleAssetAdd}
          handleAssetUpdate={handleAssetUpdate} // function
          setSelectedComposition={
            setSelectedComposition
          }
          handleAppsAdd={handleAppsAdd}
          popupActiveTab={popupActiveTab}
          setAssetPreviewPopup={
            setAssetPreviewPopup
          }
          setPopupActiveTab={setPopupActiveTab}
          setShowAssetModal={setShowAssetModal}
          assetPreviewPopup={assetPreviewPopup}
          assetPreview={assetPreview}
          selectedComposition={selectedComposition}
          selectedTextScroll={selectedTextScroll}
          selectedYoutube={selectedYoutube}
          selectedAsset={selectedAsset}
          handleSave={handleSave} // save end of the call function confim
        />
      )}

      {isPreviewOpen && <PreviewModel open={isPreviewOpen} onClose={handleClosePreview} previewData={previewData} />}

      <Footer />
    </>
  );
};

export default NewScreenGroup;
