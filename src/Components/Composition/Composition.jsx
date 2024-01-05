import { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import {
  AiOutlineCloseCircle,
  AiOutlinePlusCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import "../../Styles/playlist.css";
import { HiDotsVertical, HiOutlineLocationMarker } from "react-icons/hi";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import {
  ADDPLAYLIST,
  COMPOSITION_BY_ID,
  DELETE_ALL_COMPOSITIONS,
  DELETE_COMPOSITION,
  DELETE_COMPOSITION_BY_ID,
  GET_ALL_COMPOSITIONS,
  SELECT_BY_LIST,
  SELECT_BY_USER_SCREENDETAIL,
  SIGNAL_R,
} from "../../Pages/Api";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import toast, { CheckmarkIcon } from "react-hot-toast";
import PreviewModal from "./PreviewModel";
import { RxCrossCircled } from "react-icons/rx";
import Carousel from "./DynamicCarousel";
import { MdOutlineGroups, MdOutlineModeEdit } from "react-icons/md";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import ScreenAssignModal from "../ScreenAssignModal";
import { connection } from "../../SignalR";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  handleDeleteAll,
  handleGetCompositions,
  resetStatus,
} from "../../Redux/CompositionSlice";

const Composition = ({ sidebarOpen, setSidebarOpen }) => {
  const { token } = useSelector((state) => state.root.auth);
  const { successMessage, error, type } = useSelector(
    (state) => state.root.composition
  );

  const authToken = `Bearer ${token}`;

  const navigation = useNavigate();

  const [showActionBox, setShowActionBox] = useState(false);
  const [compositionData, setCompositionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [compositionByIdLoading, setCompositionByIdLoading] = useState(false);
  const [previewModalData, setPreviewModalData] = useState([]);
  const [layotuDetails, setLayotuDetails] = useState(null);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const selectedScreenIdsString = Array.isArray(selectedScreens)
    ? selectedScreens.join(",")
    : "";
  const [compositionId, setCompositionId] = useState("");
  const [searchComposition, setSearchComposition] = useState("");
  const [compostionAllData, setCompostionAllData] = useState([]);
  const [filteredCompositionData, setFilteredCompositionData] = useState([]);
  const [tags, setTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [screenType, setScreenType] = useState("");
  const [updateTagComposition, setUpdateTagComposition] = useState(null);
  const [screenSelected, setScreenSelected] = useState([]);
  const [screenMacids, setScreenMacids] = useState(null);
  const [selectdata, setSelectData] = useState({});
  const modalRef = useRef(null);
  const addScreenRef = useRef(null);
  const selectScreenRef = useRef(null);
  const showActionModalRef = useRef(null);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const [selectedItems, setSelectedItems] = useState([]); // Multipal check

  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = compositionData?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Filter data based on search term
  const filteredData = compositionData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchComposition.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
  const dispatch = useDispatch();

  const loadComposition = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_COMPOSITIONS,
      headers: {
        Authorization: authToken,
      },
    };
    setLoading(true);
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          setCompositionData(response.data.data);
          setCompostionAllData(response.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onClickMoreComposition = (compositionID) => {
    setCompositionId(compositionID);
    setShowActionBox((prevState) => {
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === compositionID ? !prevState[key] : false;
        return acc;
      }, {});
      return { ...updatedState, [compositionID]: !prevState[compositionID] };
    });
  };

  const handelDeleteComposition = (com_id, maciDs) => {
    if (!window.confirm("Are you sure?")) return;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${DELETE_COMPOSITION_BY_ID}?ID=${com_id}`,
      headers: {
        Authorization: authToken,
      },
    };
    toast.loading("Deleting...");
    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        if (response.data.status == 200) {
          if (connection.state == "Disconnected") {
            connection
              .start()
              .then((res) => {
                console.log("signal connected");
              })
              .then(() => {
                connection
                  .invoke("ScreenConnected", maciDs.replace(/^\s+/g, ""))
                  .then(() => {
                    console.log("SignalR method invoked after screen update");
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke("ScreenConnected", maciDs.replace(/^\s+/g, ""))
              .then(() => {
                console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setSelectScreenModal(false);
          setAddScreenModal(false);
        }
        const newArr = compositionData.filter(
          (item) => item?.compositionID !== com_id
        );
        setCompositionData(newArr);
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handleSelectComposition = (compositionID) => {
    setCompositionData((prevCompositionData) => {
      const updatedComposition = prevCompositionData.map((composition) =>
        composition.compositionID === compositionID
          ? { ...composition, isChecked: !composition.isChecked }
          : composition
      );

      // Check if all checkboxes are checked or not
      const allChecked = updatedComposition.every(
        (composition) => composition.isChecked
      );
      setSelectAll(allChecked);

      return updatedComposition;
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    if (selectedItems.length === compositionData.length) {
      setSelectedItems([]);
    } else {
      const allIds = compositionData.map(
        (composition) => composition.compositionID
      );
      setSelectedItems(allIds);
    }
  };

  // Multipal check
  const handleCheckboxChange = (compositionID) => {
    if (selectedItems.includes(compositionID)) {
      setSelectedItems(selectedItems.filter((id) => id !== compositionID));
    } else {
      setSelectedItems([...selectedItems, compositionID]);
    }
  };

  // const handleDeleteAllCompositions = () => {
  //   if (!window.confirm("Are you sure?")) return;
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: DELETE_ALL_COMPOSITIONS,
  //     headers: {
  //       Authorization: authToken,
  //     },
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       if (response.data.status == 200) {
  //         if (connection.state == "Disconnected") {
  //           connection
  //             .start()
  //             .then((res) => {
  //               console.log("signal connected");
  //             })
  //             .then(() => {
  //               connection
  //                 .invoke(
  //                   "ScreenConnected",
  //                   compositionData
  //                     ?.map((item) => item?.maciDs)
  //                     .join(",")
  //                     .replace(/^\s+/g, "")
  //                 )
  //                 .then(() => {
  //                   console.log("SignalR method invoked after screen update");
  //                 })
  //                 .catch((error) => {
  //                   console.error("Error invoking SignalR method:", error);
  //                 });
  //             });
  //         } else {
  //           connection
  //             .invoke(
  //               "ScreenConnected",
  //               compositionData
  //                 ?.map((item) => item?.maciDs)
  //                 .join(",")
  //                 .replace(/^\s+/g, "")
  //             )
  //             .then(() => {
  //               console.log("SignalR method invoked after screen update");
  //             })
  //             .catch((error) => {
  //               console.error("Error invoking SignalR method:", error);
  //             });
  //         }
  //         setSelectScreenModal(false);
  //         setAddScreenModal(false);
  //       }
  //       console.log(JSON.stringify(response.data));
  //       loadComposition();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleDeleteAllCompositions = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${DELETE_COMPOSITION}?CompositionIds=${selectedItems}`,
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
        dispatch(handleDeleteAll({ config }));
        setSelectAll(false);
        setSelectedItems([]);
        dispatch(handleGetCompositions({ token }));
      }

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
                compositionData
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
            compositionData
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
      setSelectScreenModal(false);
      setAddScreenModal(false);
    });
  };

  const handleFetchCompositionById = async (id, from) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${COMPOSITION_BY_ID}?ID=${id}`,
      headers: {
        Authorization: authToken,
      },
    };
    if (from === "tags") {
      axios
        .request(config)
        .then((response) => {
          if (response?.data?.status == 200) {
            setUpdateTagComposition(response?.data?.data[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.loading("Fetching...");
      setCompositionByIdLoading(true);
      axios
        .request(config)
        .then((response) => {
          if (response?.data?.status == 200) {
            const data = response?.data?.data[0]?.sections;
            let obj = {};
            for (const [key, value] of data.entries()) {
              if (obj[value?.sectionID]) {
                obj[value?.sectionID].push(value);
              } else {
                obj[value?.sectionID] = [value];
              }
            }
            const newdd = Object.entries(obj).map(([k, i]) => ({ [k]: i }));
            setPreviewModalData(newdd);
            openModal();
          }
          toast.remove();
          setCompositionByIdLoading(false);
        })
        .catch((error) => {
          toast.remove();
          setCompositionByIdLoading(false);
          console.log(error);
        });
    }
  };

  const handleUpdateTagsOfComposition = async (tags) => {
    let data = JSON.stringify({
      compositionID: Number(updateTagComposition?.compositionID),
      compositionName: updateTagComposition?.compositionName,
      resolution: updateTagComposition?.resolution,
      tags: tags,
      layoutID: updateTagComposition?.layoutID,
      userID: updateTagComposition?.userID,
      duration: updateTagComposition?.duration,
      dateAdded: updateTagComposition?.dateAdded,
      sections: updateTagComposition?.sections,
    });

    let config = {
      method: "post",
      url: ADDPLAYLIST,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data,
    };
    await axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const upadatedComposition = compositionData.map((item) => {
            if (response?.data?.data?.compositionID === item?.compositionID) {
              return { ...item, tags: response?.data?.data?.tags };
            } else {
              return item;
            }
          });
          const upadatedFilteredComposition = filteredCompositionData.map(
            (item) => {
              if (response?.data?.data?.compositionID === item?.compositionID) {
                return { ...item, tags: response?.data?.data?.tags };
              } else {
                return item;
              }
            }
          );
          if (upadatedComposition.length > 0) {
            setCompositionData(upadatedComposition);
          }

          if (upadatedFilteredComposition.length > 0) {
            setFilteredCompositionData(upadatedFilteredComposition);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const handleFetchLayoutById = (id) => {
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
          setLayotuDetails(response.data?.data[0]);
          setScreenType(response?.data?.data[0]?.screenType);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateScreenAssign = (screenIds, macids) => {
    let idS = "";
    for (const key in screenIds) {
      if (screenIds[key] === true) {
        idS += `${key},`;
      }
    }
    // if (idS === "") {
    //   toast.remove();
    //   return toast.error("Please Select Screen.");
    // }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/CompositionMaster/AssignCompoitiontoScreen?CompositionID=${compositionId}&ScreenID=${idS}`,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    };

    toast.loading("Saving...");
    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          try {
            // Invoke ScreenConnected method
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
                      console.log("func. invoked");
                      toast.remove();
                      loadComposition();
                    })
                    .catch((err) => {
                      toast.remove();
                      console.log("error from invoke", err);
                      toast.error("Something went wrong, try again");
                    });
                });
            } else {
              connection
                .invoke("ScreenConnected", macids)
                .then(() => {
                  console.log("func. invoked");
                  toast.remove();
                  loadComposition();
                })
                .catch((err) => {
                  toast.remove();
                  console.log("error from invoke", err);
                  toast.error("Something went wrong, try again");
                });
            }
          } catch (error) {
            console.error("Error during connection:", error);
            toast.error("Something went wrong, try again");
            toast.remove();
          }
          setSelectScreenModal(false);
          setAddScreenModal(false);
          setShowActionBox(false);
          loadComposition();
          toast.remove();
        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handleSearchComposition = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchComposition(searchQuery);
  };

  useEffect(() => {
    loadComposition();
    if (successMessage && type === "DELETE") {
      toast.success(successMessage);
      dispatch(resetStatus());
    }

    if (error && type === "ERROR") {
      toast.error(error);
      dispatch(resetStatus());
    }
  }, [successMessage, error]);

  // preview modal
  useEffect(() => {
    const handleClickOutsidePreviewModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        closeModal();
      }
    };
    document.addEventListener("click", handleClickOutsidePreviewModal, true);
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsidePreviewModal,
        true
      );
    };
  }, [handleClickOutsidePreviewModal]);

  function handleClickOutsidePreviewModal() {
    closeModal();
  }

  // add screen modal
  useEffect(() => {
    const handleClickOutsideAddScreenModal = (event) => {
      if (
        addScreenRef.current &&
        !addScreenRef.current.contains(event?.target)
      ) {
        setAddScreenModal(false);
      }
    };
    document.addEventListener("click", handleClickOutsideAddScreenModal, true);
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsideAddScreenModal,
        true
      );
    };
  }, [handleClickOutsideAddScreenModal]);

  function handleClickOutsideAddScreenModal() {
    setAddScreenModal(false);
  }

  // select screen modal
  useEffect(() => {
    const handleClickOutsideSelectScreenModal = (event) => {
      if (
        selectScreenRef.current &&
        !selectScreenRef.current.contains(event?.target)
      ) {
        setSelectScreenModal(false);
      }
    };
    document.addEventListener(
      "click",
      handleClickOutsideSelectScreenModal,
      true
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsideSelectScreenModal,
        true
      );
    };
  }, [handleClickOutsideSelectScreenModal]);

  function handleClickOutsideSelectScreenModal() {
    setSelectScreenModal(false);
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

  return (
    <>
      <div className="flex bg-white border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>

      <div className="pt-24 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 "></h1>
            <div className="flex md:mt-5 lg:mt-0 sm:flex-wrap md:flex-nowrap xs:flex-wrap playlistbtn">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search composition"
                  className="border border-primary rounded-full pl-10 py-2 search-user"
                  value={searchComposition}
                  onChange={handleSearchComposition}
                />
              </div>
              <button
                onClick={() => navigation("/addcomposition")}
                className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                Add Composition
              </button>
              {compositionData?.length > 0 && (
                <>
                  <button
                    onClick={handleDeleteAllCompositions}
                    className="sm:ml-2 xs:ml-1  flex align-middle bg-red text-white items-center  rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    style={{ display: selectAll ? "block" : "none" }}
                  >
                    <RiDeleteBinLine />
                  </button>

                  {/* multipal remove */}
                  {selectedItems.length !== 0 && !selectAll && (
                    <button
                      className="sm:ml-2 xs:ml-1  flex align-middle bg-red text-white items-center  rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                      onClick={handleDeleteAllCompositions}
                    >
                      <RiDeleteBinLine />
                    </button>
                  )}

                  <button className="sm:ml-2 xs:ml-1  flex align-middle text-white items-center  rounded-full p-2 text-base ">
                    <input
                      type="checkbox"
                      className="w-7 h-6"
                      checked={selectAll}
                      onChange={() => handleSelectAll()}
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl mt-5 mb-6  overflow-x-auto shadow-md sm:rounded-lg">
            <table
              className="w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF]  bg-[#e6e6e6]">
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center flex items-center">
                    Composition Name
                    <svg
                      className="w-3 h-3 ms-1.5 cursor-pointer"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      onClick={() => handleSort("compositionName")}
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Date Added
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Resolution
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Duration
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Screen Assign
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
                    <td colSpan={8}>
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
                        <span className="text-2xl  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full text-green-800  me-2 px dark:bg-green-900 dark:text-green-300">
                          Loading...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : compositionData && sortedAndPaginatedData?.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex text-center m-5 justify-center">
                        <span className="text-4xl text-gray-800 font-semibold py-2 px-4 rounded-full text-red-800 me-2 dark:bg-red-900 dark:text-red-300">
                          Data Not Found
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {compositionData &&
                      sortedAndPaginatedData.length > 0 &&
                      sortedAndPaginatedData.map((composition, index) => {
                        return (
                          <tr
                            className="border-b border-b-[#E4E6FF] "
                            key={composition?.compositionID}
                          >
                            <td className="text-[#5E5E5E] text-center">
                              <div className="flex gap-1">
                                {selectAll ? (
                                  <CheckmarkIcon className="w-5 h-5" />
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(
                                      composition?.compositionID
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        composition?.compositionID
                                      )
                                    }
                                  />
                                )}
                                {composition?.compositionName}
                              </div>
                            </td>
                            <td className="text-center text-[#5E5E5E]">
                              {moment(composition?.dateAdded).format("LLL")}
                            </td>
                            <td className="text-center text-[#5E5E5E]">
                              {composition?.resolution}
                            </td>
                            <td className="text-center text-[#5E5E5E]">
                              {moment
                                .utc(composition?.duration * 1000)
                                .format("HH:mm:ss")}
                            </td>
                            <td className="text-center text-[#5E5E5E]">
                              {composition?.screenNames}
                            </td>
                            <td
                              title={composition?.tags && composition?.tags}
                              className="text-center flex items-center justify-center w-full flex-wrap gap-2"
                            >
                              {(composition?.tags === "" ||
                                composition?.tags === null) && (
                                <span>
                                  <AiOutlinePlusCircle
                                    size={30}
                                    className="mx-auto cursor-pointer"
                                    onClick={() => {
                                      setShowTagModal(true);
                                      composition?.tags === "" ||
                                      composition?.tags === null
                                        ? setTags([])
                                        : setTags(
                                            composition?.tags?.split(",")
                                          );
                                      handleFetchCompositionById(
                                        composition?.compositionID,
                                        "tags"
                                      );
                                    }}
                                  />
                                </span>
                              )}
                              {composition?.tags !== null
                                ? composition?.tags
                                    .split(",")
                                    .slice(
                                      0,
                                      composition?.tags.split(",").length > 2
                                        ? 3
                                        : composition?.tags.split(",").length
                                    )
                                    .map((text) => {
                                      if (text.toString().length > 10) {
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
                              {composition?.tags !== "" &&
                                composition?.tags !== null && (
                                  <MdOutlineModeEdit
                                    onClick={() => {
                                      setShowTagModal(true);
                                      composition?.tags === "" ||
                                      composition?.tags === null
                                        ? setTags([])
                                        : setTags(
                                            composition?.tags?.split(",")
                                          );
                                      handleFetchCompositionById(
                                        composition?.compositionID,
                                        "tags"
                                      );
                                    }}
                                    className="w-5 h-5 cursor-pointer"
                                  />
                                )}
                              {/* add or edit tag modal */}
                              {showTagModal && (
                                <AddOrEditTagPopup
                                  setShowTagModal={setShowTagModal}
                                  tags={tags}
                                  setTags={setTags}
                                  handleUpdateTagsOfComposition={
                                    handleUpdateTagsOfComposition
                                  }
                                  from="composition"
                                  setUpdateTagComposition={
                                    setUpdateTagComposition
                                  }
                                />
                              )}
                            </td>

                            <td className="text-center relative">
                              <div className="">
                                <button
                                  className="ml-3 "
                                  onClick={() => {
                                    onClickMoreComposition(
                                      composition.compositionID
                                    );
                                  }}
                                >
                                  <HiDotsVertical />
                                </button>
                                {/* action popup start */}
                                {showActionBox[composition.compositionID] && (
                                  <div
                                    ref={showActionModalRef}
                                    className="scheduleAction z-20"
                                  >
                                    <div className="my-1">
                                      <button
                                        onClick={() =>
                                          navigation(
                                            `/editcomposition/${composition?.compositionID}/${composition?.layoutID}`
                                          )
                                        }
                                      >
                                        Edit
                                      </button>
                                    </div>
                                    <div className=" mb-1">
                                      <button
                                        onClick={() => {
                                          handleFetchCompositionById(
                                            composition?.compositionID
                                          );
                                          handleFetchLayoutById(
                                            composition?.layoutID
                                          );
                                        }}
                                      >
                                        Preview
                                      </button>
                                    </div>
                                    {/* <div className=" mb-1">
                                <button>Duplicate</button>
                              </div> */}
                                    <div className=" mb-1">
                                      <button
                                        onClick={() => {
                                          setAddScreenModal(true);
                                          setSelectData(composition);
                                          setScreenSelected(
                                            composition?.screenNames?.split(",")
                                          );
                                          setScreenMacids(composition?.maciDs);
                                        }}
                                      >
                                        Set to Screens
                                      </button>
                                    </div>
                                    <div className="mb-1 border border-[#F2F0F9]"></div>
                                    <div className=" mb-1 text-[#D30000]">
                                      <button
                                        onClick={() =>
                                          handelDeleteComposition(
                                            composition.compositionID,
                                            composition?.maciDs
                                          )
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
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

          <div className="flex justify-end mt-2">
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
            {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
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
                    Select the screen to set the composition
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
                  New composition would be applied. Do you want to proceed?
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
          screenSelected={screenSelected}
        />
      )}

      <PreviewModal show={modalVisible} onClose={closeModal}>
        <div
          className={`fixed left-1/2 -translate-x-1/2 ${
            screenType === "portrait"
              ? "min-h-[90vh] max-h-[90vh] min-w-[30vw] max-w-[30vw]"
              : "min-h-[90vh] max-h-[90vh] min-w-[80vw] max-w-[80vw]"
          }  `}
          ref={modalRef}
        >
          <div style={{ padding: "15px", backgroundColor: "white" }}>
            <RxCrossCircled
              className="fixed z-50 text-4xl p-1 m-2 rounded-full top-[-27px] right-[-23px] cursor-pointer bg-black text-white"
              onClick={closeModal}
            />

            {!loading &&
              layotuDetails?.lstLayloutModelList.length > 0 &&
              layotuDetails?.lstLayloutModelList?.map((obj, index) => (
                <div
                  key={index}
                  style={{
                    position: "fixed",
                    left: obj.leftside + "%",
                    top: obj.topside + "%",
                    width: obj?.width + "%",
                    height: obj?.height + "%",
                    // backgroundColor: obj.fill,
                  }}
                >
                  {modalVisible && (
                    <Carousel
                      items={previewModalData[index][index + 1]}
                      composition={obj}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </PreviewModal>

      <Footer />
    </>
  );
};

export default Composition;
