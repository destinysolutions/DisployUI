import React, { Suspense, useEffect, useRef, useState } from "react";
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
import {
  AiOutlineCloudUpload,
  AiOutlinePlusCircle,
  AiOutlineSearch,
} from "react-icons/ai";
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
import {
  addTagsAndUpdate,
  getGroupData,
  groupAssetsInUpdateScreen,
  groupInScreenDelete,
  openPriviewModel,
  resetStatus,
  saveGroupData,
  screenGroupDelete,
  screenGroupDeleteAll,
  updateGroupData,
} from "../../../Redux/ScreenGroupSlice";
import toast, { CheckmarkIcon } from "react-hot-toast";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import AddOrEditTagPopup from "../../AddOrEditTagPopup";
import { SELECT_BY_LIST, UPDATE_NEW_SCREEN } from "../../../Pages/Api";
import { handleChangeScreens } from "../../../Redux/Screenslice";
import PreviewModel from "./model/previewModel";
import ReactTooltip from "react-tooltip";
import PreviewComposition from "../../Composition/PreviewComposition";
import axios from "axios";
import moment from "moment";
import { socket } from "../../../App";
import { getMenuAll, getMenuPermission } from "../../../Redux/SidebarSlice";
import Loading from "../../Loading";

const NewScreenGroup = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, token } = useSelector((state) => state.root.auth);
  const store = useSelector((state) => state.root.screenGroup);
  const authToken = `Bearer ${token}`;

  const dispatch = useDispatch();
  const [sidebarload, setSidebarLoad] = useState(true);
  NewScreenGroup.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };
  const modalRef = useRef(null);

  const [loadFirst, setLoadFirst] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

  // GroupNameUpdate
  const [newGroupName, setNewGroupName] = useState("");
  const [editIndex, setEditIndex] = useState(-1); // Initially no index is being edited
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Multipal check
  const [editGroupID, setEditGroupID] = useState();
  const [getGroup, setGetGroup] = useState(); // used to singl group in all screenId get and handl save asstes

  //   Model
  const [label, setLabel] = useState("");
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedComposition, setSelectedComposition] = useState({
    compositionName: "",
  });
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  // const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });
  const [assetPreview, setAssetPreview] = useState("");
  const [selectedYoutube, setSelectedYoutube] = useState();
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [allGroupScreen, setAllGroupScreen] = useState([]);
  const [editSelectedScreen, setEditSelectedScreen] = useState("");

  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagUpdateScreeen, setTagUpdateScreeen] = useState(null);
  const [loader, setLoader] = useState(false);
  //PreView model
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [loading, setLoading] = useState(false);
  const [layoutDetails, setLayoutDetails] = useState(null);
  const [permissions, setPermissions] = useState({
    isDelete: false,
    isSave: false,
    isView: false,
  });
  const [viewLoading, setViewLoading] = useState(true);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed

  useEffect(() => {
    if (loadFirst) {
      setLoader(true);
      dispatch(getGroupData()).then((res) => {
        setAllGroupScreen(res?.payload?.data);
        setLoader(false);
      });

      setLoadFirst(false);
    }

    if (store && store.status === "failed") {
      toast.error(store.error);
    }

    if (store && store.status === "succeeded") {
      toast.success(store.message);
      setLoadFirst(true);
    }

    if (store && store.status) {
      dispatch(resetStatus());
    }
  }, [dispatch, loadFirst, store]);

  const totalPages = Math.ceil(
    (Array.isArray(allGroupScreen) ? allGroupScreen?.length : 0) / itemsPerPage
  );
  const paginatedData = allGroupScreen
    ? allGroupScreen.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  useEffect(() => {
    dispatch(getMenuAll()).then((item) => {
      const findData = item.payload?.data?.menu.reduce((result, menuItem) => {
        if (menuItem.submenu && Array.isArray(menuItem.submenu)) {
          const submenuItem = menuItem.submenu.find(
            (submenuItem) => submenuItem.pageName === "New Screen Group"
          );
          if (submenuItem) {
            result = submenuItem;
          }
        }
        setViewLoading(false);
        return result;
      }, null);

      if (findData) {
        const ItemID = findData.moduleID;
        const payload = { UserRoleID: user.userRole, ModuleID: ItemID };
        dispatch(getMenuPermission(payload)).then((permissionItem) => {
          if (
            Array.isArray(permissionItem.payload.data) &&
            permissionItem.payload.data.length > 0
          ) {
            setPermissions(permissionItem.payload.data[0]);
          }
        });
      }
      setSidebarLoad(false);
    });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const callSignalR = () => {
    const macIds = allGroupScreen
      ?.map((item) => item?.screenGroupLists?.map((screen) => screen?.macID))
      .join(",")
      .replace(/^\s+/g, "");
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: macIds,
    };
    socket.emit("ScreenConnected", Params);

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
              // store?.data
              //   ?.map((item) => item?.maciDs)
              //   .join(",")
              //   .replace(/^\s+/g, "")
              macIds
            )
            .then(() => {
              console.log("SignalR method invoked");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        });
    } else {
      connection
        .invoke(
          "ScreenConnected",
          // store?.data
          //   ?.map((item) => item?.maciDs)
          //   .join(",")
          //   .replace(/^\s+/g, "")
          macIds
        )
        .then(() => {
          console.log("SignalR method invoked");
        })
        .catch((error) => {
          console.error("Error invoking SignalR method:", error);
        });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoadFirst(true);
  };

  const handleAccordionClick = (index) => {
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleRefres = () => {
    callSignalR();
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

    if (selectedItems.length === store?.data?.length) {
      setSelectedItems([]);
    } else {
      const allIds = store?.data?.map((item) => item.screenGroupID);
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

  const handleAssetUpdate = () => {};

  const editGroupName = (index) => {
    // GroupNameUpdate
    setEditIndex(index);
    setNewGroupName(allGroupScreen[index]?.screenGroupName);
    setEditGroupID(allGroupScreen[index]?.screenGroupID);
  };

  const updateGroupName = async (index) => {
    // GroupNameUpdate
    const payload = {
      ScreenGroupID: editGroupID,
      ScreenGroupName: newGroupName,
    };
    await dispatch(updateGroupData(payload));
    setEditIndex(-1);
  };

  const newAddGroup = (item) => {
    if (item) {
      setLabel("Update");
      setEditSelectedScreen(item);
    } else {
      setLabel("Save");
      setEditSelectedScreen();
    }
    setIsModalOpen(true);
  };

  // New add groupScreen
  const handleSaveNew = async (payload) => {
    await dispatch(saveGroupData(payload));
  };

  const updateScreen = async (payload) => {
    await dispatch(saveGroupData(payload));
  };

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
        dispatch(screenGroupDelete(item.screenGroupID));
        setSelectedItems([]);
        setSelectAll(false);
        // callSignalR();
        let allMacIDs = "";
        allGroupScreen?.map((items) => {
          if (items?.screenGroupID === item?.screenGroupID) {
            allMacIDs = items?.screenGroupLists
              ?.map((screen) => screen?.macID)
              .join(",")
              .replace(/^\s+/g, "");
          }
        });
        const Params = {
          id: socket.id,
          connection: socket.connected,
          macId: allMacIDs,
        };
        socket.emit("ScreenConnected", Params);
      }
    });
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
        dispatch(screenGroupDeleteAll(selectedItems));
        let arrMacIDs = [];
        allGroupScreen?.forEach((items) => {
          if (selectedItems?.includes(items?.screenGroupID)) {
            let macIDs = items?.screenGroupLists
              ?.map((screen) => screen?.macID)
              .join(",");
            arrMacIDs.push(macIDs);
          }
        });

        const macId = arrMacIDs.join(",");
        const Params = {
          id: socket.id,
          connection: socket.connected,
          macId: macId,
        };
        socket.emit("ScreenConnected", Params);
        setSelectedItems([]);
        setSelectAll(false);
        // callSignalR();
      }
    });
  };

  const deleteGroupInScreen = (screen, item) => {
    if (item?.screenGroupLists?.length > 1) {
      let payload = {
        ScreenGroupListID: screen.screenGroupListID,
      };
      dispatch(groupInScreenDelete(payload));
      const Params = {
        id: socket.id,
        connection: socket.connected,
        macId: screen.macID,
      };
      socket.emit("ScreenConnected", Params);
      if (connection.state == "Disconnected") {
        connection
          .start()
          .then((res) => {
            console.log("signal connected");
          })
          .then(() => {
            connection
              .invoke("ScreenConnected", screen.macID)
              .then(() => {
                console.log("SignalR method invoked after Asset update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          });
      } else {
        connection
          .invoke("ScreenConnected", screen.macID)
          .then(() => {
            console.log("SignalR method invoked after Asset update");
          })
          .catch((error) => {
            console.error("Error invoking SignalR method:", error);
          });
      }
    } else {
      toast.error("Can't Delete This Screen. You Need To Delete Group.");
    }
  };

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
    dispatch(addTagsAndUpdate(data));
  };

  const handleSave = () => {
    const payload = {
      GroupID: getGroup.screenGroupID,
      MediaID: "",
      MediaDetailID: "",
      AssetName: "",
      AssetType: "",
      FilePath: "",
    };
    if (selectedAsset.assetID) {
      payload.MediaID = selectedAsset.assetID;
      payload.AssetName = selectedAsset.assetName;
      payload.AssetType = selectedAsset.assetType;
      payload.FilePath = selectedAsset.assetFolderPath;
      payload.MediaDetailID = 1;
    }
    if (selectedComposition.compositionID) {
      payload.AssetName = selectedComposition.compositionName;
      payload.MediaID = selectedComposition.compositionID;
      payload.AssetType = "composition";
      payload.FilePath = "composition";
      payload.MediaDetailID = 3;
    }
    if (selectedTextScroll.textScroll_Id) {
      payload.AssetName = selectedTextScroll.instanceName;
      payload.MediaID = selectedTextScroll.textScroll_Id;
      payload.MediaDetailID = 4;
    }
    if (selectedYoutube.compositionID || selectedYoutube.youtubeId) {
      payload.AssetName = selectedYoutube.instanceName;
      payload.MediaID =
        selectedYoutube.compositionID || selectedYoutube.youtubeId;
      payload.FilePath = selectedYoutube.compositionID
        ? "composition"
        : selectedYoutube.youTubeURL;
      payload.MediaDetailID = selectedYoutube.compositionID ? 3 : 5;
    }

    const response = dispatch(groupAssetsInUpdateScreen(payload));
    if (!response) return;

    if (response) {
      let allMacIDs = "";
      allGroupScreen?.map((item) => {
        if (item?.screenGroupID === getGroup?.screenGroupID) {
          allMacIDs = item?.screenGroupLists
            ?.map((screen) => screen?.macID)
            .join(",")
            .replace(/^\s+/g, "");
        }
      });
      const Params = {
        id: socket.id,
        connection: socket.connected,
        macId: allMacIDs,
      };
      socket.emit("ScreenConnected", Params);
      // callSignalR();
    }
  };

  const handleFetchLayoutById = (id) => {
    setLoading(true);
    setIsPreviewOpen(true);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_LIST}?LayoutID=${id}`,
      headers: { Authorization: authToken },
      data: "",
    };
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          setLayoutDetails(response?.data?.data[0]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleOpenPreview = (item) => {
    setLoading(true);
    setLoadFirst(true);
    dispatch(openPriviewModel(item?.screenGroupID)).then((item) => {
      handleFetchLayoutById(item?.payload?.data?.[0]?.layoutID);
      let obj = {};
      for (const [
        key,
        value,
      ] of item.payload.data?.[0]?.compositionPossition.entries()) {
        const arr = value?.schedules.map((item) => {
          return {
            ...item,
            width: value?.width,
            height: value?.height,
            top: value?.top,
            left: value?.left,
          };
        });
        obj[key + 1] = [...arr];
      }
      const newdd = Object.entries(obj).map(([k, i]) => ({ [k]: i }));
      setPreviewData(newdd);
    });
    setLoading(false);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setLoadFirst(true);
    setLayoutDetails(null);
    setPreviewData();
  };

  return (
    <>
      {sidebarload && <Loading />}
      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
            <div className="flex border-b border-gray">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Navbar />
            </div>
            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                {viewLoading ? (
                  <div className="flex text-center m-5 justify-center">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#1C64F2"
                      />
                    </svg>
                   
                  </div>
                ) : (
                  <>
                    <div className="justify-between lg:flex md:flex items-center sm:block lg:mb-0 mb-3">
                      <div className="section-title">
                        <h1 className="not-italic font-medium text-2xl text-[#001737]">
                          Group Name
                        </h1>
                      </div>
                      <div className="flex items-center justify-end flex-wrap gap-1">
                        <button
                          data-tip
                          data-for="Refresh Screen"
                          type="button"
                          className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                          onClick={() => handleRefres()}
                        >
                          <IoMdRefresh className="p-1 px-2 text-4xl text-white hover:text-white" />
                          <ReactTooltip
                            id="Refresh Screen"
                            place="bottom"
                            type="warning"
                            effect="solid"
                          >
                            <span>Refresh Screen</span>
                          </ReactTooltip>
                        </button>
                        {permissions.isSave && (
                          <button
                            data-tip
                            data-for="Add New Group"
                            type="button"
                            className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                            onClick={() => newAddGroup()}
                          >
                            <HiOutlineRectangleGroup className="p-1 px-2 text-4xl text-white hover:text-white" />
                            <ReactTooltip
                              id="Add New Group"
                              place="bottom"
                              type="warning"
                              effect="solid"
                            >
                              <span>Add New Group</span>
                            </ReactTooltip>
                          </button>
                        )}

                        {isModalOpen && (
                          <ScreenGroupModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            handleSaveNew={handleSaveNew}
                            updateScreen={updateScreen}
                            editSelectedScreen={editSelectedScreen}
                            label={label}
                            sidebarOpen={sidebarOpen}
                          />
                        )}

                        {store?.data?.length > 0 && (
                          <div>
                            {permissions.isDelete && (
                              <button
                                data-tip
                                data-for="Select All"
                                type="button"
                                className="flex align-middle border-white text-white items-center"
                              >
                                <input
                                  type="checkbox"
                                  className="lg:w-7 lg:h-6 w-5 h-5"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                  readOnly
                                />
                              </button>
                            )}

                            <ReactTooltip
                              id="Select All"
                              place="bottom"
                              type="warning"
                              effect="solid"
                            >
                              <span>Select All</span>
                            </ReactTooltip>
                          </div>
                        )}

                        {selectedItems.length > 0 && (
                          <div>
                            <button
                              data-tip
                              data-for="All Delete"
                              className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                            >
                              <RiDeleteBin5Line
                                className="text-3xl p-1 hover:text-white"
                                onClick={() => handleDeleteGroupAll()}
                              />
                            </button>

                            <ReactTooltip
                              id="All Delete"
                              place="bottom"
                              type="warning"
                              effect="solid"
                            >
                              <span>Delete</span>
                            </ReactTooltip>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:mt-5 shadow-md lg:p-5 p-3 bg-white rounded-lg">
                      {loader && (
                        <div className="flex text-center m-5 justify-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="#1C64F2"
                            />
                          </svg>
                          
                        </div>
                      )}
                      {!loader &&
                        paginatedData.length > 0 &&
                        paginatedData.map((item, i) => {
                          const isAccordionOpen = openAccordionIndex === i;
                          return (
                            <div
                              key={i}
                              className="accordions shadow-md p-5 bg-slate-200 rounded-lg mb-4"
                            >
                              <div
                                className={`section lg:flex md:flex sm:flex ${
                                  isAccordionOpen ? "" : "flex-row flex"
                                } items-center justify-between`}
                              >
                                <div className="flex gap-2 lg:mb-0 md:mb-0 sm:mb-0 mb-2 items-center">
                                  {editIndex === i ? (
                                    <>
                                      <input
                                        type="text"
                                        name="name"
                                        className="formInput block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={newGroupName}
                                        onChange={(e) =>
                                          setNewGroupName(e.target.value)
                                        }
                                      />
                                      <div>
                                        <BiSave
                                          className="cursor-pointer text-xl text-[#0000FF]"
                                          onClick={() => updateGroupName(i)}
                                        />
                                        <IoClose
                                          className="cursor-pointer text-xl text-[#FF0000]"
                                          onClick={() => {
                                            setEditIndex(-1);
                                            setNewGroupName("");
                                          }}
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <h1 className="text-lg capitalize">
                                        {item?.screenGroupName}
                                      </h1>
                                      {permissions.isSave && (
                                        <MdOutlineModeEdit
                                          className="cursor-pointer text-xl text-[#0000FF]"
                                          onClick={() => editGroupName(i)}
                                        />
                                      )}
                                    </>
                                  )}
                                </div>

                                
                                  <div className=" flex items-center w-full justify-end">
                                    {isAccordionOpen && (                                     
                                        
                                        <div className="flex justify-end items-center">
                                        {permissions.isSave && (
                                          <button
                                            data-tip
                                            data-for="Add Screen"
                                            className="bg-SlateBlue py-2 px-2 text-sm rounded-md mr-2 hover:bg-primary text-white"
                                            onClick={() => newAddGroup(item)}
                                          >
                                            Add <b>+</b>
                                            <ReactTooltip
                                              id="Add Screen"
                                              place="bottom"
                                              type="warning"
                                              effect="solid"
                                            >
                                              <span>Add Screen</span>
                                            </ReactTooltip>
                                          </button>
                                        )}

                                        {item.isPreview && (
                                          <button
                                            data-tip
                                            data-for="Preview"
                                            className="bg-SlateBlue py-2 px-2 text-sm rounded-md mr-2 hover:bg-primary text-white"
                                            onClick={() =>
                                              handleOpenPreview(item)
                                            }
                                          >
                                            Preview
                                            <ReactTooltip
                                              id="Preview"
                                              place="bottom"
                                              type="warning"
                                              effect="solid"
                                            >
                                              <span>Preview</span>
                                            </ReactTooltip>
                                          </button>
                                        )}

                                          {permissions.isSave && (
                                            <button
                                              data-tip
                                              data-for="Upload"
                                              className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                                              onClick={() => {
                                                setShowAssetModal(true);
                                                setGetGroup(item);
                                              }}
                                            >
                                              <TbUpload className="text-3xl p-1 hover:text-white" />
                                              <ReactTooltip
                                                id="Upload"
                                                place="bottom"
                                                type="warning"
                                                effect="solid"
                                              >
                                                <span>Upload</span>
                                              </ReactTooltip>
                                            </button>
                                          )}

                                          {!selectedItems?.length && (
                                            <div className="flex items-center justify-center">
                                              {permissions.isDelete && (
                                                <button
                                                  data-tip
                                                  data-for="All Delete"
                                                  className="border rounded-full bg-red text-white hover:shadow-xl hover:bg-primary border-white shadow-lg"
                                                >
                                                  <RiDeleteBin5Line
                                                    className="text-3xl p-1 hover:text-white"
                                                    onClick={() =>
                                                      handleDeleteGroup(item)
                                                    }
                                                  />
                                                  <ReactTooltip
                                                    id="All Delete"
                                                    place="bottom"
                                                    type="warning"
                                                    effect="solid"
                                                  >
                                                    <span>Delete</span>
                                                  </ReactTooltip>
                                                </button>
                                              )}
                                            </div>
                                          )}
                                          {permissions.isDelete && (
                                            <div>
                                              {selectAll ? (
                                                <input
                                                  type="checkbox"
                                                  data-tip
                                                  data-for="Select"
                                                  className=" mx-1 w-6 h-5 mt-2"
                                                  checked={selectedItems.includes(
                                                    item?.screenGroupID
                                                  )}
                                                  onChange={() =>
                                                    handleCheckboxChange(
                                                      item?.screenGroupID
                                                    )
                                                  }
                                                />
                                              ) : (
                                                <div>
                                                  <input
                                                    type="checkbox"
                                                    data-tip
                                                    data-for="Select"
                                                    className=" mx-1 w-6 h-5 mt-2"
                                                    checked={selectedItems.includes(
                                                      item?.screenGroupID
                                                    )}
                                                    onChange={() =>
                                                      handleCheckboxChange(
                                                        item?.screenGroupID
                                                      )
                                                    }
                                                  />
                                                  <ReactTooltip
                                                    id="Select"
                                                    place="bottom"
                                                    type="warning"
                                                    effect="solid"
                                                  >
                                                    <span>Select</span>
                                                  </ReactTooltip>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                          <button>
                                            <div
                                              onClick={() =>
                                                handleAccordionClick(i)
                                              }
                                            >
                                              <IoIosArrowDropup className="text-3xl" />
                                            </div>
                                          </button>
                                        </div>
                                      
                                    )}

                                    <button>
                                      {!isAccordionOpen && (
                                        <div
                                          onClick={() =>
                                            handleAccordionClick(i)
                                          }
                                        >
                                          <IoIosArrowDropdown className="text-3xl" />
                                        </div>
                                      )}
                                    </button>
                                 
                                </div>
                              </div>

                              {isAccordionOpen && (
                                <div className="overflow-x-scroll sc-scrollbar  pt-4">
                                  <table
                                    className="screen-table border border-lightgray w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed"
                                    cellPadding={15}
                                  >
                                    <thead>
                                      <tr className="items-center table-head-bg screen-table-th text-left rounded-lg">
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
                                      {isAccordionOpen &&
                                        item &&
                                        item.screenGroupLists?.length > 0 &&
                                        item.screenGroupLists.map(
                                          (screen, index) => {
                                            return (
                                              <tr
                                                key={index}
                                                className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2"
                                              >
                                                <td className="flex items-center">
                                                  {screen.screenName}
                                                </td>

                                                <td className="p-2 text-center">
                                                  <span
                                                    id={`changetvstatus${screen.macID}`}
                                                    className={`rounded-full px-6 py-2 text-white text-center ${
                                                      screen.screenStatus == 1
                                                        ? "bg-[#3AB700]"
                                                        : "bg-[#FF0000]"
                                                    }`}
                                                  >
                                                    {screen.screenStatus == 1
                                                      ? "Live"
                                                      : "offline"}
                                                  </span>
                                                </td>
                                                <td className="p-2 text-center">
                                                  {screen?.lastSeen
                                                    ? moment(
                                                        screen?.lastSeen
                                                      ).format("LLL")
                                                    : null}
                                                </td>
                                                <td className="p-2 text-center">
                                                  <button className="flex items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto hover:bg-primary-500">
                                                    <p className="line-clamp-1">
                                                      {screen.assetName}
                                                    </p>
                                                    <AiOutlineCloudUpload className="ml-2 text-3xl" />
                                                  </button>
                                                </td>
                                                <td className="break-words	w-[150px] p-2 text-center">
                                                  {screen.scheduleName}
                                                </td>
                                                <td
                                                  title={
                                                    screen?.tags && screen?.tags
                                                  }
                                                  className="mx-auto  p-2 text-center"
                                                >
                                                  {(screen?.tags === "" ||
                                                    screen?.tags === null) && (
                                                    <span>
                                                      <AiOutlinePlusCircle
                                                        size={30}
                                                        className="mx-auto cursor-pointer"
                                                        onClick={() => {
                                                          setShowTagModal(true);
                                                          screen.tags === "" ||
                                                          screen?.tags === null
                                                            ? setTags([])
                                                            : setTags(
                                                                screen?.tags?.split(
                                                                  ","
                                                                )
                                                              );
                                                          setTagUpdateScreeen(
                                                            screen
                                                          );
                                                        }}
                                                      />
                                                    </span>
                                                  )}
                                                  {screen?.tags !== null
                                                    ? screen.tags
                                                        .split(",")
                                                        .slice(
                                                          0,
                                                          screen.tags.split(",")
                                                            .length > 2
                                                            ? 3
                                                            : screen.tags.split(
                                                                ","
                                                              ).length
                                                        )
                                                        .map((text) => {
                                                          if (
                                                            text.toString()
                                                              .length > 10
                                                          ) {
                                                            return text
                                                              .split("")
                                                              .slice(0, 10)
                                                              .concat("...")
                                                              .join("");
                                                          }
                                                          return text;
                                                        })
                                                        .join(",")
                                                    : ""}
                                                  {screen?.tags !== "" &&
                                                    screen?.tags !== null && (
                                                      <AiOutlinePlusCircle
                                                        onClick={() => {
                                                          setShowTagModal(true);
                                                          screen.tags === "" ||
                                                          screen?.tags === null
                                                            ? setTags([])
                                                            : setTags(
                                                                screen?.tags?.split(
                                                                  ","
                                                                )
                                                              );
                                                          setTagUpdateScreeen(
                                                            screen
                                                          );
                                                        }}
                                                        className="mx-auto  w-5 h-5 cursor-pointer "
                                                      />
                                                    )}

                                                  {/* add or edit tag modal */}
                                                  {showTagModal && (
                                                    <AddOrEditTagPopup
                                                      setShowTagModal={
                                                        setShowTagModal
                                                      }
                                                      tags={tags}
                                                      setTags={setTags}
                                                      handleTagsUpdate={
                                                        handleTagsUpdate
                                                      }
                                                      from="screen"
                                                      setTagUpdateScreeen={
                                                        setTagUpdateScreeen
                                                      }
                                                    />
                                                  )}
                                                </td>
                                                <td className="p-2 justify-center flex ">
                                                  {permissions.isDelete && (
                                                    <div className="cursor-pointer text-xl flex gap-3 text-right rounded-full px-2 py-2 text-white text-center bg-[#FF0000]">
                                                      <MdDeleteForever
                                                        onClick={() =>
                                                          deleteGroupInScreen(
                                                            screen,
                                                            item
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      {!loader && paginatedData?.length === 0 && (
                        <>
                          <div className="flex text-center m-5 justify-center">
                            <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2">
                              No Data Available
                            </span>
                          </div>
                        </>
                      )}

                      {/* end  pagination */}
                      {paginatedData && paginatedData.length > 0 && (
                        <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                          <div className="flex items-center">
                            <span className="text-gray-500">{`Total ${allGroupScreen?.length} Screen Group`}</span>
                          </div>
                          <div className="flex justify-end">
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
                              {sidebarOpen ? "Previous" : ""}
                            </button>
                            <div className="flex items-center me-3">
                              <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
                            </div>
                            {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={(currentPage === totalPages) || (allGroupScreen?.length === 0)}
                              className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                              {sidebarOpen ? "Next" : ""}
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
                        </div>
                      )}
                      {/* end  pagination */}
                    </div>
                  </>
                )}
              </div>
            </div>
            <Footer />
          </>
        </Suspense>
      )}

      {/* Model */}
      {showAssetModal && (
        <ShowAssetModal
          handleAssetAdd={handleAssetAdd}
          handleAssetUpdate={handleAssetUpdate} // function
          setSelectedComposition={setSelectedComposition}
          handleAppsAdd={handleAppsAdd}
          popupActiveTab={popupActiveTab}
          setAssetPreviewPopup={setAssetPreviewPopup}
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

      {isPreviewOpen && (
        <PreviewComposition
          modalRef={modalRef}
          closeModal={handleClosePreview}
          loading={loading}
          layotuDetails={layoutDetails}
          previewModalData={previewData}
          modalVisible={isPreviewOpen}
          from="screen"
        />
      )}
    </>
  );
};

export default NewScreenGroup;
