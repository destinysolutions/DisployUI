import { Suspense, useEffect, useRef, useState } from "react";
import "../../Styles/screen.css";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlinePlusCircle,
  AiOutlineSave,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { MdOutlineAddToQueue } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import PropTypes from "prop-types";
import ScreenOTPModal from "./ScreenOTPModal";
import { RiArrowDownSLine, RiDeleteBin5Line } from "react-icons/ri";
import Footer from "../Footer";

import { PAYMENT_INTENT_CREATE_REQUEST, SCREEN_DELETE_ALL, SCREEN_GROUP, stripePromise } from "../../Pages/Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ShowAssetModal from "../ShowAssetModal";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import toast, { CheckmarkIcon } from "react-hot-toast";
import {
  handleChangeScreens,
  handleDeleteAllScreen,
  handleDeleteScreenById,
  handleGetScreen,
  handleUpdateScreenAsset,
  handleUpdateScreenName,
  handleUpdateScreenSchedule,
  screenDeactivateActivate,
} from "../../Redux/Screenslice";
import { handleGetAllAssets } from "../../Redux/Assetslice";
import { handleGetAllSchedule } from "../../Redux/ScheduleSlice";
import { handleGetCompositions } from "../../Redux/CompositionSlice";
import {
  handleGetTextScrollData,
  handleGetYoutubeData,
} from "../../Redux/AppsSlice";
import { connection } from "../../SignalR";
import Swal from "sweetalert2";
import { addTagsAndUpdate, resetStatus } from "../../Redux/ScreenGroupSlice";
import { BiEdit, BiSolidPurchaseTag } from "react-icons/bi";
import ReactTooltip from "react-tooltip";
import { socket } from "../../App";
import { getMenuAll, getMenuPermission } from "../../Redux/SidebarSlice";
import Loading from "../Loading";
import { Pagination } from "../Common/Common";
import PurchaseScreen from "./SubScreens/PurchaseScreen";
import { Elements } from "@stripe/react-stripe-js";
import PaymentDialog from "../Common/PaymentDialog";
import { round } from "lodash";
import { loadStripe } from "@stripe/stripe-js";
import { handlePaymentIntegration } from "../../Redux/PaymentSlice";

const Screens = ({ sidebarOpen, setSidebarOpen }) => {
  Screens.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);
  const [locCheckboxClick, setLocCheckboxClick] = useState(true);
  const [screenCheckboxClick, setScreenCheckboxClick] = useState(true);
  const [statusCheckboxClick, setStatusCheckboxClick] = useState(true);
  const [lastSeenCheckboxClick, setLastSeenCheckboxClick] = useState(true);
  const [nowPlayingCheckboxClick, setNowPlayingCheckboxClick] = useState(true);
  const [currScheduleCheckboxClick, setCurrScheduleCheckboxClick] =
    useState(true);
  const [tagsCheckboxClick, setTagsCheckboxClick] = useState(true);
  const [groupCheckboxClick, setGroupCheckboxClick] = useState(true);

  const [locContentVisible, setLocContentVisible] = useState(true);
  const [screenContentVisible, setScreenContentVisible] = useState(true);
  const [statusContentVisible, setStatusContentVisible] = useState(true);
  const [lastSeenContentVisible, setLastSeenContentVisible] = useState(true);
  const [nowPlayingContentVisible, setNowPlayingContentVisible] =
    useState(true);
  const [currScheduleContentVisible, setCurrScheduleContentVisible] =
    useState(true);
  const [tagsContentVisible, setTagsContentVisible] = useState(true);
  const [groupContentVisible, setGroupContentVisible] = useState(true);
  const [showActionBox, setShowActionBox] = useState(false);
  const [isEditingScreen, setIsEditingScreen] = useState(false);
  const [assetScreenID, setAssetScreenID] = useState(null);
  const [scheduleScreenID, setScheduleScreenID] = useState();
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [openPayment, setOpenPayment] = useState(false)
  const [editedScreenName, setEditedScreenName] = useState("");

  const [editingScreenID, setEditingScreenID] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState({
    scheduleName: "",
  });
  const [searchScreen, setSearchScreen] = useState("");

  const { user, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [groupName, setGroupName] = useState("");
  const [selectedAsset, setSelectedAsset] = useState({
    assetName: "",
    assetID: "",
  });
  const [assetPreview, setAssetPreview] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [selectedComposition, setSelectedComposition] = useState({
    compositionName: "",
  });
  const [discountCoupon, setDiscountCoupon] = useState("")
  const [showNewScreenGroupPopup, setShowNewScreenGroupPopup] = useState(false);
  const [selectedCheckboxIDs, setSelectedCheckboxIDs] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagUpdateScreeen, setTagUpdateScreeen] = useState(null);
  const [selectedYoutube, setSelectedYoutube] = useState();
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [setscreenMacID, setSetscreenMacID] = useState("");
  const { loading, screens } = useSelector((s) => s.root.screen);
  const store = useSelector((state) => state.root.screenGroup);
  const { schedules } = useSelector((s) => s.root.schedule);
  const { compositions } = useSelector((s) => s.root.composition);
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]); // Multipal check
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [loadFist, setLoadFist] = useState(true);
  const selectedScreenIdsString = Array.isArray(selectedCheckboxIDs)
    ? selectedCheckboxIDs.join(",")
    : "";
  const [selectcheck, setSelectCheck] = useState(false);
  const [sidebarload, setSidebarLoad] = useState(true);
  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [permissions, setPermissions] = useState({
    isDelete: false,
    isSave: false,
    isView: false,
  });
  const [openScreen, setOpenScreen] = useState(false)
  const [addScreen, setAddScreen] = useState(1)
  const [clientSecret, setClientSecret] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const moreModalRef = useRef(null);
  const showActionModalRef = useRef(null);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };
  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleAppsAdd = (apps) => {
    setSelectedYoutube(apps);
    setSelectedTextScroll(apps);
  };

  useEffect(() => {
    if (loadFist) {
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
      // get screen
      dispatch(handleGetScreen({ token }));
      if (sidebarload) {
      }
      setLoadFist(false);
    }

    if (store && store.status === "succeeded") {
      toast.success(store.message);
      setLoadFist(true);
    }

    if (store && store.status) {
      dispatch(resetStatus());
    }
  }, [dispatch, loadFist, store]);

  // Filter data based on search term
  const filteredData = Array.isArray(screens)
    ? screens?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchScreen.toLowerCase())
      )
    )
    : [];

  useEffect(() => {
    setCurrentPage(1)
  }, [searchScreen])

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  // Function to sort the data based on a field and order
  const sortData = (data, field, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    return sortedData;
  };

  const sortedAndPaginatedData = sortData(
    filteredData,
    sortedField,
    sortOrder
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const endPage = currentPage * sortedAndPaginatedData?.length;
  const startPage = Pagination(currentPage, sortedAndPaginatedData?.length);

  useEffect(() => {
    dispatch(getMenuAll()).then((item) => {
      const findData = item.payload.data.menu.find(
        (e) => e.pageName === "Screens"
      );
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

  // Handle sorting when a table header is clicked
  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };
  // Pagination End

  const handleScreenClick = (screenId) => {
    setShowActionBox((prevState) => {
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === screenId ? !prevState[key] : false;
        return acc;
      }, {});
      return { ...updatedState, [screenId]: !prevState[screenId] };
    });
  };

  //  multipal select
  const handleScreenCheckboxChange = (screenID) => {
    setSelectAllChecked(false);
    setSelectCheck(true);
    if (selectedItems.includes(screenID)) {
      setSelectedItems(selectedItems.filter((id) => id !== screenID));
    } else {
      setSelectedItems([...selectedItems, screenID]);
    }
  };

  useEffect(() => {
    if (selectcheck && screens?.length > 0) {
      if (selectedItems?.length === screens?.length) {
        setSelectAllChecked(true);
      }
    }
  }, [selectcheck, selectedItems]);

  // all select
  const handleSelectAllCheckboxChange = (e) => {
    setSelectAllChecked(!selectAllChecked);
    if (selectedItems.length === screens.length) {
      setSelectedItems([]);
    } else {
      const allIds = screens.map((item) => item.screenID);
      setSelectedItems(allIds);
    }
  };

  const handleDeleteAllscreen = () => {
    const allScreenMacids = screens.map((i) => i?.macid).join(",");

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${SCREEN_DELETE_ALL}?ScreenIds=${selectedItems}`,
      headers: { Authorization: authToken },
    };

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
        dispatch(handleDeleteAllScreen({ config }));
        dispatch(handleChangeScreens([]));
        setSelectedItems([]);
        setSelectAllChecked(false);
        setScreenCheckboxes({});
        toast.remove();
        setLoadFist(true);
        toast.success("Screen deleted Successfully!");
        const Params = {
          id: socket.id,
          connection: socket.connected,
          macId: allScreenMacids,
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
                .invoke("ScreenConnected", allScreenMacids)
                .then(() => {
                  console.log("SignalR method invoked after Asset update");
                })
                .catch((error) => {
                  console.error("Error invoking SignalR method:", error);
                });
            });
        } else {
          connection
            .invoke("ScreenConnected", allScreenMacids)
            .then(() => {
              console.log("SignalR method invoked after Asset update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        }
      }
    });
  };

  const handelDeleteScreen = (screenId, MACID) => {
    if (!window.confirm("Are you sure?")) return;
    toast.loading("Deleting...");
    console.log("signal r");
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: MACID,
    };
    socket.emit("ScreenConnected", Params);
    setTimeout(() => {
      const response = dispatch(
        handleDeleteScreenById({ screenID: screenId, token })
      );
      if (response) {
        response
          .then((res) => {
            toast.remove();
            toast.success("Deleted Successfully.");
          })
          .catch((error) => {
            toast.remove();
            console.log(error);
          });
      }
    }, 1000);
    if (connection.state == "Disconnected") {
      connection
        .start()
        .then((res) => {
          console.log("signal connected");
        })
        .then(() => {
          connection
            .invoke("ScreenConnected", MACID)
            .then(() => {
              // const response = dispatch(
              //   handleDeleteScreenById({ screenID: screenId, token })
              // );
              // if (response) {
              //   response
              //     .then((res) => {
              //       toast.remove();
              //       toast.success("Deleted Successfully.");
              //       console.log(MACID);
              //     })
              //     .catch((error) => {
              //       toast.remove();
              //       console.log(error);
              //     });
              // }
              console.log("SignalR method invoked after Asset update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        });
    } else {
      connection
        .invoke("ScreenConnected", MACID)
        .then(() => {
          // const response = dispatch(
          //   handleDeleteScreenById({ screenID: screenId, token })
          // );
          // if (response) {
          //   response
          //     .then((res) => {
          //       toast.remove();
          //       toast.success("Deleted Successfully.");
          //       console.log(MACID);
          //     })
          //     .catch((error) => {
          //       toast.remove();
          //       console.log(error);
          //     });
          // }
          console.log("SignalR method invoked after Asset update");
        })
        .catch((error) => {
          console.error("Error invoking SignalR method:", error);
        });
    }
  };

  const handleScheduleAdd = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleScreenNameUpdate = (screenId) => {
    const screenToUpdate = screens.find(
      (screen) => screen.screenID === screenId
    );
    if (editedScreenName.trim() === "") {
      toast.remove();
      return toast.error("Please enter a screen name");
    } else {
      if (screenToUpdate) {
        toast.loading("Updating Name...");
        let data = {
          ...screenToUpdate,
          screenID: screenId,
          screenName: editedScreenName,
          operation: "Update",
        };

        const response = dispatch(
          handleUpdateScreenName({ dataToUpdate: data, token })
        );
        if (!response) return;
        response.then((response) => {
          toast.remove();
          if (response?.payload?.status == 200) {
            toast.success("Name Updated");
            setIsEditingScreen(false);
            setEditingScreenID(null);
            setEditedScreenName("");
          }
        });
      } else {
        toast.remove();
        console.error("Screen not found for update");
      }
    }
  };

  const handleAssetUpdate = () => {
    const screenToUpdate = screens.find(
      (screen) => screen.screenID === assetScreenID
    );
    let moduleID =
      selectedAsset?.assetID ||
      selectedComposition?.compositionID ||
      selectedYoutube?.youtubeId ||
      selectedTextScroll?.textScroll_Id;
    // return console.log(moduleID, selectedComposition);
    let mediaType = selectedAsset?.assetID
      ? 1
      : selectedTextScroll?.textScroll_Id !== null &&
        selectedTextScroll?.textScroll_Id !== undefined
        ? 4
        : selectedYoutube?.youtubeId !== null &&
          selectedYoutube?.youtubeId !== undefined
          ? 5
          : selectedComposition?.compositionID !== null &&
            selectedComposition?.compositionID !== undefined
            ? 3
            : 0;

    let mediaName =
      selectedAsset?.assetName ||
      selectedComposition?.compositionName ||
      selectedYoutube?.instanceName ||
      selectedTextScroll?.instanceName;

    if (screenToUpdate) {
      let data = {
        ...screenToUpdate,
        screenID: assetScreenID,
        mediaType: mediaType,
        mediaDetailID: moduleID,
        operation: "Update",
      };
      toast.loading("Updating...");
      const response = dispatch(
        handleUpdateScreenAsset({ mediaName, dataToUpdate: data, token })
      );

      if (!response) return;
      response
        .then((response) => {
          toast.remove();
          const Params = {
            id: socket.id,
            connection: socket.connected,
            macId: screenToUpdate?.macid.replace(/^\s+/g, ""),
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
                  .invoke(
                    "ScreenConnected",
                    screenToUpdate?.macid.replace(/^\s+/g, "")
                  )
                  .then(() => {
                    toast.success("Media Updated.");
                    console.log("SignalR method invoked after Asset update");
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke(
                "ScreenConnected",
                screenToUpdate?.macid.replace(/^\s+/g, "")
              )
              .then(() => {
                toast.success("Media Updated.");
                console.log("SignalR method invoked after Asset update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setIsEditingScreen(false);
        })
        .catch((error) => {
          toast.remove();
          console.log(error);
        });
    } else {
      toast.remove();
      console.error("Asset not found for update");
    }
  };

  const handleScheduleUpdate = () => {
    const screenToUpdate = screens.find(
      (screen) => screen?.screenID === scheduleScreenID
    );
    let moduleID = selectedSchedule?.scheduleId;
    if (!moduleID) {
      toast.remove();
      return toast.error("Please Select Schedule.");
    }
    if (screenToUpdate) {
      let data = {
        ...screenToUpdate,
        screenID: scheduleScreenID,
        mediaType: 2,
        mediaDetailID: moduleID,
        operation: "Update",
      };

      toast.loading("Schedule assinging...");
      const response = dispatch(
        handleUpdateScreenSchedule({
          schedule: selectedSchedule,
          dataToUpdate: data,
          token,
        })
      );
      if (!response) return;
      response
        .then((response) => {
          toast.remove();
          toast.success("Schedule assinged to screen.");
          setShowScheduleModal(false);
          const Params = {
            id: socket.id,
            connection: socket.connected,
            macId: screenToUpdate?.macid.replace(/^\s+/g, ""),
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
                  .invoke(
                    "ScreenConnected",
                    screenToUpdate?.macid.replace(/^\s+/g, "")
                  )
                  .then(() => {
                    console.log("SignalR method invoked after Schedule update");
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke(
                "ScreenConnected",
                screenToUpdate?.macid.replace(/^\s+/g, "")
              )
              .then(() => {
                console.log("SignalR method invoked after Schedule update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setIsEditingScreen(false);
        })
        .catch((error) => {
          console.log(error);
          toast.remove();
        });
    } else {
      toast.remove();
      console.error("Screen not found for update");
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

  const handleNewScreenGroupClick = () => {
    const checkedIDs = Object.keys(screenCheckboxes).filter(
      (screenID) => screenCheckboxes[screenID]
    );
    setSelectedCheckboxIDs(checkedIDs);

    setShowNewScreenGroupPopup(!showNewScreenGroupPopup);
  };

  const handleScreenGroup = () => {
    let data = JSON.stringify({
      GroupName: groupName,
      ScreenIds: selectedScreenIdsString,
      operation: "Insert",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: SCREEN_GROUP,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => { })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleScreenSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchScreen(searchQuery);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreModalRef.current &&
        !moreModalRef.current.contains(event?.target)
      ) {
        // setMoreModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    // setMoreModal(false);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showActionModalRef.current &&
        !showActionModalRef.current.contains(event?.target)
      ) {
        setShowActionBox(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowActionBox(false);
  }

  const handleToggleActivation = async (value) => {
    const allScreenMacids = screens.map((i) => i?.macid).join(",");
    const payload = { ScreenIds: value.screenID, IsActive: "" };

    if (value.isActive === true) {
      payload.IsActive = false;
    }
    if (value.isActive === false) {
      payload.IsActive = true;
    }

    dispatch(screenDeactivateActivate(payload));
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: allScreenMacids,
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
            .invoke("ScreenConnected", allScreenMacids)
            .then(() => {
              console.log("SignalR method invoked after Asset update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        });
    } else {
      connection
        .invoke("ScreenConnected", allScreenMacids)
        .then(() => {
          console.log("SignalR method invoked after Asset update");
        })
        .catch((error) => {
          console.error("Error invoking SignalR method:", error);
        });
    }
  };

  const handleUpdateMenu = () => {
    setLocContentVisible(locCheckboxClick);
    setScreenContentVisible(screenCheckboxClick);
    setStatusContentVisible(statusCheckboxClick);
    setLastSeenContentVisible(lastSeenCheckboxClick);
    setNowPlayingContentVisible(nowPlayingCheckboxClick);
    setCurrScheduleContentVisible(currScheduleCheckboxClick);
    setTagsContentVisible(tagsCheckboxClick);
    setGroupContentVisible(groupCheckboxClick);
    setMoreModal(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const isClosed = localStorage.getItem("isWindowClosed");
      if (isClosed === "true") {
        dispatch(handleGetAllSchedule({ token }));
        localStorage.setItem("isWindowClosed", "false");
        // window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handlePay = () => {
    const price = round((addScreen * 10), 2);
    const params = {
      "items": {
        "id": "0",
        "amount": String(round(price * 100))
      }
    }
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: PAYMENT_INTENT_CREATE_REQUEST,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(params),
    }

    dispatch(handlePaymentIntegration({ config })).then((res) => {
      setClientSecret(res?.payload?.clientSecret)
    })
    setOpenPayment(true)
  }

  const togglePaymentModal = () => {
    setOpenPayment(!openPayment)
  }

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
                <div className="grid lg:grid-cols-3 gap-2">
                  <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
                    Screens
                  </h1>

                  <div className="lg:col-span-2 lg:flex items-center md:mt-0 lg:mt-0 md:justify-end sm:mt-3 flex-wrap">
                    <div className="relative md:mr-2 lg:mr-2 lg:mb-0 md:mb-0 mb-3">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <AiOutlineSearch className="w-5 h-5 text-gray " />
                      </span>
                      <input
                        type="text"
                        placeholder="Search Screen" //location ,screen, tag
                        className="border border-primary rounded-full px-7 pl-10 py-2 search-user sm:w-52 xs:w-52"
                        value={searchScreen}
                        onChange={(e) => {
                          handleScreenSearch(e);
                        }}
                      />
                    </div>


                    {/* 
              <button
                type="button"
                className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
              >
                <VscVmConnect className="p-1 px-2 text-4xl text-white hover:text-white" />
              </button>
            */}
                    <div className="flex items-center justify-end">
                    {!user?.userDetails?.isRetailer && (
                        <button
                          onClick={() => setOpenScreen(true)}
                          className="sm:mx-2 xs:mx-1 flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                        >
                          Purchase Screen
                        </button>
                      )}
                      {permissions.isSave && (
                        <button
                          data-tip
                          data-for="New Screen"
                          type="button"
                          className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                          onClick={() => setShowOTPModal(true)}
                        >
                          <MdOutlineAddToQueue className="p-1 px-2 text-4xl text-white hover:text-white" />
                          <ReactTooltip
                            id="New Screen"
                            place="bottom"
                            type="warning"
                            effect="solid"
                          >
                            <span>New Screen</span>
                          </ReactTooltip>
                        </button>
                      )}

                      {showOTPModal ? (
                        <>
                          <ScreenOTPModal
                            showOTPModal={showOTPModal}
                            setShowOTPModal={setShowOTPModal}
                          />
                        </>
                      ) : null}
                      {showNewScreenGroupPopup && (
                        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
                          <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
                              <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                                <button
                                  className="p-1 text-xl"
                                  onClick={() =>
                                    setShowNewScreenGroupPopup(false)
                                  }
                                >
                                  <AiOutlineCloseCircle className="text-2xl" />
                                </button>
                              </div>
                              <div className="p-3">
                                <label>Enter Group Name : </label>
                                <input
                                  type="text"
                                  onChange={(e) => {
                                    setGroupName(e.target.value);
                                  }}
                                  className="border border-primary m-5"
                                />
                              </div>
                              <div className="flex justify-center">
                                <button
                                  className="mb-4 border border-primary py-2 px-3"
                                  onClick={handleScreenGroup}
                                >
                                  create
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        data-tip
                        data-for="Delete"
                        type="button"
                        className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                        onClick={handleDeleteAllscreen}
                        style={{ display: selectAllChecked ? "block" : "none" }}
                      >
                        <RiDeleteBin5Line className="p-1 px-2 text-4xl text-white hover:text-white" />
                        <ReactTooltip
                          id="Delete"
                          place="bottom"
                          type="warning"
                          effect="solid"
                        >
                          <span>Delete</span>
                        </ReactTooltip>
                      </button>

                      {/* multipal remove */}
                      {selectedItems?.length !== 0 && !selectAllChecked && (
                        <button
                          className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                          onClick={handleDeleteAllscreen}
                        >
                          <RiDeleteBin5Line className="p-1 px-2 text-4xl text-white hover:text-white" />
                        </button>
                      )}

                      <div className="relative mt-1">
                        <button
                          data-tip
                          data-for="More"
                          type="button"
                          className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary shadow-lg"
                          onClick={() => setMoreModal(!moreModal)}
                        >
                          <RiArrowDownSLine className="p-1 px-2 text-4xl text-white hover:text-white" />
                          <ReactTooltip
                            id="More"
                            place="bottom"
                            type="warning"
                            effect="solid"
                          >
                            <span>More</span>
                          </ReactTooltip>
                        </button>

                        {moreModal && (
                          <div ref={moreModalRef} className="moredw">
                            <ul>
                              <li className="flex text-sm items-center ">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={screenCheckboxClick}
                                  onChange={() =>
                                    setScreenCheckboxClick(!screenCheckboxClick)
                                  }
                                />
                                Screen
                              </li>
                              <li className="flex text-sm items-center mt-2 ">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={locCheckboxClick}
                                  onChange={() =>
                                    setLocCheckboxClick(!locCheckboxClick)
                                  }
                                />
                                Google Location
                              </li>
                              <li className="flex text-sm items-center mt-2">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={statusCheckboxClick}
                                  onChange={() =>
                                    setStatusCheckboxClick(!statusCheckboxClick)
                                  }
                                />
                                Status
                              </li>
                              <li className="flex text-sm items-center mt-2">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={lastSeenCheckboxClick}
                                  onChange={() =>
                                    setLastSeenCheckboxClick(
                                      !lastSeenCheckboxClick
                                    )
                                  }
                                />
                                Last Seen
                              </li>
                              <li className="flex text-sm items-center mt-2">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={nowPlayingCheckboxClick}
                                  onChange={() =>
                                    setNowPlayingCheckboxClick(
                                      !nowPlayingCheckboxClick
                                    )
                                  }
                                />
                                Now Playing
                              </li>
                              <li className="flex text-sm items-center mt-2 ">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={currScheduleCheckboxClick}
                                  onChange={() =>
                                    setCurrScheduleCheckboxClick(
                                      !currScheduleCheckboxClick
                                    )
                                  }
                                />
                                Current Schedule
                              </li>
                              <li className="flex text-sm items-center mt-2 ">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={tagsCheckboxClick}
                                  onChange={() =>
                                    setTagsCheckboxClick(!tagsCheckboxClick)
                                  }
                                />
                                Tags
                              </li>
                              <li className="flex text-sm items-center mt-2 ">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-lg"
                                  checked={groupCheckboxClick}
                                  onChange={() =>
                                    setGroupCheckboxClick(!groupCheckboxClick)
                                  }
                                />
                                Group Apply
                              </li>
                              <li className="flex text-sm justify-end mt-2 ">
                                <button
                                  className="bg-lightgray text-primary px-4 py-2 rounded-full"
                                  onClick={() => {
                                    handleUpdateMenu();
                                  }}
                                >
                                  Update
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {permissions.isDelete && (
                        <button
                          data-tip
                          data-for="Select All"
                          type="button"
                          className="flex align-middle text-white items-center rounded-full p-2 text-base  "
                        >
                          <input
                            type="checkbox"
                            className="lg:w-7 lg:h-6 w-5 h-5"
                            onChange={handleSelectAllCheckboxChange}
                            checked={selectAllChecked}
                          />
                          <ReactTooltip
                            id="Select All"
                            place="bottom"
                            type="warning"
                            effect="solid"
                          >
                            <span>Select All</span>
                          </ReactTooltip>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" bg-white rounded-xl lg:mt-8 mt-5 shadow screen-section">
                  <div className="overflow-x-scroll sc-scrollbar rounded-lg ">
                    <table
                      className="screen-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                      cellPadding={15}
                    >
                      <thead className="table-head-bg screen-table-th">
                        <tr className="items-center table-head-bg ">
                          {screenContentVisible && (
                            <th className="text-[#5A5881] text-base text-center font-semibold w-200">
                              <div className="flex">
                                Screen
                                <svg
                                  className="w-3 h-3 ms-1.5 mt-2 cursor-pointer"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  onClick={() => handleSort("screenName")}
                                >
                                  <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                </svg>
                              </div>
                            </th>
                          )}
                          {locContentVisible && (
                            <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                              Google Location
                            </th>
                          )}
                          {statusContentVisible && (
                            <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                              status
                            </th>
                          )}
                          {lastSeenContentVisible && (
                            <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                              Last Seen
                            </th>
                          )}
                          {nowPlayingContentVisible && (
                            <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                              Now Playing
                            </th>
                          )}
                          {currScheduleContentVisible && (
                            <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                              Current Schedule
                            </th>
                          )}
                          {tagsContentVisible && (
                            <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                              Tags
                            </th>
                          )}
                          {groupContentVisible && (
                            <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                              Group Apply
                            </th>
                          )}
                          <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && (
                          <tr>
                            <td colSpan={9}>
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
                            </td>
                          </tr>
                        )}
                        {!loading &&
                          screens &&
                          sortedAndPaginatedData?.length === 0 && (
                            <tr>
                              <td colSpan={9}>
                                <div className="flex text-center m-5 justify-center">
                                  <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                    No Data Available
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                        {!loading &&
                          screens &&
                          sortedAndPaginatedData?.length !== 0 && (
                            <>
                              {screens &&
                                sortedAndPaginatedData?.length > 0 &&
                                sortedAndPaginatedData.map((screen, index) => {
                                  return (
                                    <tr key={screen.screenID}>
                                      {screenContentVisible && (
                                        <td className="text-[#5E5E5E]">
                                          <div className="flex items-center">
                                            <div>
                                              {permissions.isDelete && (
                                                <input
                                                  type="checkbox"
                                                  className="mr-2"
                                                  onChange={() =>
                                                    handleScreenCheckboxChange(
                                                      screen.screenID
                                                    )
                                                  }
                                                  checked={selectedItems.includes(
                                                    screen.screenID
                                                  )}
                                                />
                                              )}
                                            </div>
                                            {isEditingScreen &&
                                              editingScreenID ===
                                              screen.screenID ? (
                                              <div className="flex items-center gap-2">
                                                <input
                                                  type="text"
                                                  className="border border-primary rounded-md w-full"
                                                  value={editedScreenName}
                                                  onChange={(e) => {
                                                    setEditedScreenName(
                                                      e.target.value
                                                    );
                                                  }}
                                                />
                                                <button
                                                  onClick={() => {
                                                    handleScreenNameUpdate(
                                                      screen.screenID
                                                    );
                                                  }}
                                                >
                                                  <AiOutlineSave className="text-2xl ml-1 hover:text-primary" />
                                                </button>
                                              </div>
                                            ) : (
                                              <div
                                                className="flex items-center gap-1"
                                                style={{ width: "max-content" }}
                                              >
                                                {permissions.isSave ? (
                                                  <div className="flex gap-1">
                                                    <Link
                                                      to={`/screensplayer?screenID=${screen.screenID}`}
                                                    >
                                                      {screen.screenName}
                                                    </Link>
                                                    <button
                                                      onClick={() => {
                                                        setIsEditingScreen(
                                                          true
                                                        );
                                                        setEditingScreenID(
                                                          screen.screenID
                                                        );
                                                        setEditedScreenName(
                                                          screen?.screenName
                                                        );
                                                      }}
                                                    >
                                                      <MdOutlineModeEdit className="w-6 h-5 hover:text-primary text-[#0000FF]" />
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <>

                                                    {screen.screenName}
                                                  </>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      )}
                                      {locContentVisible && (
                                        <td className="break-words text-center text-[#5E5E5E]">
                                          {screen.googleLocation}
                                        </td>
                                      )}

                                      {statusContentVisible && (
                                        <td className="text-center">
                                          <span
                                            id={`changetvstatus${screen.macid}`}
                                            className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
                                              ? "bg-[#3AB700]"
                                              : "bg-[#FF0000]"
                                              }`}
                                          >
                                            {screen.screenStatus == 1
                                              ? "Live"
                                              : "offline"}
                                          </span>
                                        </td>
                                      )}

                                      {lastSeenContentVisible && (
                                        <td className="p-2 text-center break-words text-[#5E5E5E]">
                                          {screen?.lastSeen
                                            ? moment(screen?.lastSeen).format(
                                              "LLL"
                                            )
                                            : null}
                                        </td>
                                      )}

                                      {nowPlayingContentVisible && (
                                        <td
                                          className="text-center "
                                          style={{ wordBreak: "break-all" }}
                                        >
                                          <div
                                            onClick={(e) => {
                                              setAssetScreenID(screen.screenID);
                                              setSetscreenMacID(screen.macid);
                                              setShowAssetModal(true);
                                              setSelectedAsset({
                                                ...selectedAsset,
                                                assetName: screen?.assetName,
                                                assetID: screen?.mediaDetailID,
                                              });
                                              // setSelectedAsset(screen?.assetName);
                                            }}
                                            title={screen?.assetName}
                                            className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                          >
                                            <p className="line-clamp-1">
                                              {screen.assetName}
                                            </p>
                                            <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                                          </div>
                                        </td>
                                      )}

                                      {currScheduleContentVisible && (
                                        <td className="break-words text-center text-[#5E5E5E]">
                                          {screen.scheduleName == "" ? (
                                            <button
                                              onClick={() => {
                                                setShowScheduleModal(true);
                                                setScheduleScreenID(
                                                  screen.screenID
                                                );
                                              }}
                                            >
                                              Set a schedule
                                            </button>
                                          ) : (
                                            `${screen.scheduleName
                                            } Till ${moment(
                                              screen.endDate
                                            ).format("YYYY-MM-DD hh:mm")}`
                                          )}
                                        </td>
                                      )}

                                      {tagsContentVisible && (
                                        <td
                                          // title={screen?.tags && screen?.tags}
                                          title={
                                            screen?.tags &&
                                            screen?.tags
                                              .trim()
                                              .split(",")
                                              .map((tag) => tag.trim())
                                              .join(",")
                                          }
                                          className="text-center text-[#5E5E5E]"
                                        >
                                          <div className="p-2 text-center flex flex-wrap items-center justify-center gap-2 break-all text-[#5E5E5E]">
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
                                                      setTagUpdateScreeen(screen);
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
                                                    : screen.tags.split(",")
                                                      .length
                                                )
                                                .map((text) => {
                                                  if (
                                                    text.toString().length >
                                                    10
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
                                                    setTagUpdateScreeen(screen);
                                                  }}
                                                  className="w-5 h-5 cursor-pointer"
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
                                          </div>
                                        </td>
                                      )}
                                      {groupContentVisible && (
                                        <td className="p-2 text-center  break-words">
                                          {screen.isContainGroup === 1 && (
                                            <button
                                              data-tip
                                              data-for={screen.groupName}
                                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                              <HiUserGroup />
                                              <ReactTooltip
                                                id={screen.groupName}
                                                place="bottom"
                                                type="warning"
                                                effect="solid"
                                              >
                                                <span>{screen.groupName}</span>
                                              </ReactTooltip>
                                            </button>
                                          )}
                                        </td>
                                      )}

                                      <td className="text-center">
                                        <div className="flex justify-center gap-2 items-center">
                                          {/* <div className="cursor-pointer text-sm">
                                    {screen.isActive === true ? (
                                      <button
                                        onClick={() =>
                                          handleToggleActivation(screen)
                                        }
                                        className="rounded-full px-4 py-2 text-white text-center bg-[#3AB700]"
                                      >
                                        Activate
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleToggleActivation(screen)
                                        }
                                        className="rounded-full px-4 py-2 text-white text-center bg-[#FF0000]"
                                      >
                                        Deactivate
                                      </button>
                                    )}
                                  </div> */}

                                          <div className="cursor-pointer text-xl">
                                            {permissions.isSave && (
                                              <Link
                                                to={`/screensplayer?screenID=${screen.screenID}`}
                                              >
                                                <button
                                                  data-tip
                                                  data-for="Edit"
                                                  type="button"
                                                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                  <BiEdit />
                                                  <ReactTooltip
                                                    id="Edit"
                                                    place="bottom"
                                                    type="warning"
                                                    effect="solid"
                                                  >
                                                    <span>Edit</span>
                                                  </ReactTooltip>
                                                </button>
                                              </Link>
                                            )}
                                          </div>
                                          {/* <div className="cursor-pointer text-xl text-[#EE4B2B]">
                                  <MdDeleteForever
                                    onClick={() =>
                                      handelDeleteScreen(
                                        screen.screenID,
                                        screen?.macid
                                      )
                                    }
                                  />
                                </div> */}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </>
                          )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                    <div className="flex items-center">
                      <span className="text-gray-500">{`Total ${screens?.length} Screens`}</span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
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
                        disabled={(currentPage === totalPages) || (screens?.length === 0)}
                        className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
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
                </div>
              </div>
            </div>
            <Footer />
          </>
        </Suspense>
      )}

      {showScheduleModal && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
          <div className="w-auto my-6 mx-auto lg:max-w-6xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                <div>Select Schedule</div>

                <div>
                  <button
                    className="p-1"
                    onClick={() => setShowScheduleModal(false)}
                  >
                    <AiOutlineCloseCircle className="text-3xl" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end mt-3 mr-5">
                <Link to="/addschedule" target="_blank">
                  <button
                    className="bg-SlateBlue text-white px-5 py-2 rounded-full ml-3"
                    onClick={() => {
                      localStorage.setItem("isWindowClosed", "false");
                    }}
                  >
                    Set New Schedule
                  </button>
                </Link>
              </div>
              <div className=" overflow-x-scroll sc-scrollbar mt-5 px-5 min-h-[400px] max-h-[400px] ">
                <table
                  className="w-full lg:table-fixed md:table-auto sm:table-auto xs:table-auto bg-white shadow-2xl p-2 mb-3"
                  cellPadding={15}
                >
                  <thead>
                    <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Schedule Name
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Time Zones
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Date Added
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        start date
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        End date
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        screens Assigned
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Tags
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center font-semibold text-xl"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      schedules.map((schedule) => (
                        <tr
                          className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                          key={schedule.scheduleId}
                        >
                          <td className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-3"
                              onChange={() => handleScheduleAdd(schedule)}
                            />
                            <div>
                              <div>{schedule.scheduleName}</div>
                            </div>
                          </td>
                          <td className="text-center">
                            {schedule.timeZoneName}
                          </td>
                          <td className="text-center">
                            {moment(schedule.createdDate).format(
                              "YYYY-MM-DD hh:mm"
                            )}
                          </td>
                          <td className="text-center">
                            {moment(schedule.startDate).format(
                              "YYYY-MM-DD hh:mm"
                            )}
                          </td>

                          <td className="text-center">
                            {moment(schedule.endDate).format(
                              "YYYY-MM-DD hh:mm"
                            )}
                          </td>
                          <td className="p-2 text-center">
                            {schedule.screenAssigned}
                          </td>
                          <td className="p-2 text-center">{schedule.tags}</td>
                          <td className="text-center">
                            <Link
                              to={`/addschedule?scheduleId=${schedule.scheduleId}&scheduleName=${schedule.scheduleName}&timeZoneName=${schedule.timeZoneName}`}
                              target="_blank"
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              <BiEdit />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="py-4 flex justify-center">
                <button
                  onClick={() => {
                    handleScheduleUpdate(scheduleScreenID);
                  }}
                  className="border border-primary rounded-full px-6 py-2 not-italic font-medium text-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAssetModal && (
        <ShowAssetModal
          handleAssetAdd={handleAssetAdd}
          handleAssetUpdate={handleAssetUpdate}
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
          setscreenMacID={setscreenMacID}
          setSelectedAsset={setSelectedAsset}
        />
      )}
      {openScreen && (
        <PurchaseScreen
          openScreen={openScreen}
          setOpenScreen={setOpenScreen}
          addScreen={addScreen}
          setAddScreen={setAddScreen}
          handlePay={handlePay}
          setDiscountCoupon={setDiscountCoupon}
          discountCoupon={discountCoupon}
        />
      )}

      {openPayment && clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <PaymentDialog openPayment={openPayment} setOpenPayment={setOpenPayment} togglePaymentModal={togglePaymentModal} clientSecret={clientSecret} type="Screen" PaymentValue={addScreen} />
        </Elements>
      )}
    </>
  );
};

export default Screens;
