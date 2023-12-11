import { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { RiDeleteBinLine } from "react-icons/ri";
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
  DELETE_COMPOSITION_BY_ID,
  GET_ALL_COMPOSITIONS,
  SELECT_BY_LIST,
  SELECT_BY_USER_SCREENDETAIL,
  SIGNAL_R,
} from "../../Pages/Api";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import PreviewModal from "./PreviewModel";
import { RxCrossCircled } from "react-icons/rx";
import Carousel from "./DynamicCarousel";
import { MdOutlineGroups, MdOutlineModeEdit } from "react-icons/md";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import ScreenAssignModal from "../ScreenAssignModal";

const Composition = ({ sidebarOpen, setSidebarOpen }) => {
  const { token } = useSelector((state) => state.root.auth);
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
  const [connection, setConnection] = useState(null);
  const [filteredCompositionData, setFilteredCompositionData] = useState([]);
  const [tags, setTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [updateTagComposition, setUpdateTagComposition] = useState(null);

  const modalRef = useRef(null);
  const addScreenRef = useRef(null);
  const selectScreenRef = useRef(null);
  const showActionModalRef = useRef(null);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

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

  const handelDeleteComposition = (com_id) => {
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
        console.log(JSON.stringify(response.data));
        if (response.data.status == 200) {
          if (connection) {
            connection
              .invoke("ScreenConnected")
              .then(() => {
                // console.log("SignalR method invoked after screen update");
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
    setCompositionData((prevCompositionData) => {
      const updatedComposition = prevCompositionData.map((composition) => ({
        ...composition,
        isChecked: !selectAll,
      }));

      setSelectAll(!selectAll);

      return updatedComposition;
    });
  };

  const handleDeleteAllCompositions = () => {
    if (!window.confirm("Are you sure?")) return;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: DELETE_ALL_COMPOSITIONS,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          if (connection) {
            connection
              .invoke("ScreenConnected")
              .then(() => {
                // console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setSelectScreenModal(false);
          setAddScreenModal(false);
        }
        console.log(JSON.stringify(response.data));
        loadComposition();
      })
      .catch((error) => {
        console.log(error);
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
            // if (response?.data?.data[0]?.tags === null) {
            //   setTags([]);
            // } else {
            //   setTags(response?.data?.data[0]?.tags.split(","));
            // }
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
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateScreenAssign = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/CompositionMaster/AssignCompoitiontoScreen?CompositionID=${compositionId}&ScreenID=${selectedScreenIdsString}`,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log("response:", response.data.data);
        if (response.data.status == 200) {
          if (connection) {
            connection
              .invoke("ScreenConnected")
              .then(() => {
                console.log("SignalR method invoked after screen update");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
          setSelectScreenModal(false);
          setAddScreenModal(false);
          setShowActionBox(false);
          loadComposition();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearchComposition = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchComposition(searchQuery);

    if (searchQuery === "") {
      setFilteredCompositionData([]);
    } else {
      const filteredComposition = compositionData.filter((entry) =>
        Object.values(entry).some((val) => {
          if (typeof val === "string") {
            const keyWords = searchQuery.split(" ");
            for (let i = 0; i < keyWords.length; i++) {
              return (
                val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                val.toLocaleLowerCase().includes(keyWords[i]) ||
                val.toLocaleLowerCase().includes(searchQuery)
              );
            }
          }
        })
      );
      if (filteredComposition.length > 0) {
        setFilteredCompositionData(filteredComposition);
      } else {
        setFilteredCompositionData([]);
      }
    }
  };

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(SIGNAL_R)
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.on("ScreenConnected", (screenConnected) => {
      console.log("ScreenConnected", screenConnected);
    });

    newConnection
      .start()
      .then(() => {
        console.log("Connection established");
        setConnection(newConnection);
      })
      .catch((error) => {
        console.error("Error starting connection:", error);
      });

    loadComposition();
    return () => {
      if (newConnection) {
        newConnection
          .stop()
          .then(() => {
            console.log("Connection stopped");
          })
          .catch((error) => {
            console.error("Error stopping connection:", error);
          });
      }
    };
  }, []);

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

  // console.log(layotuDetails);
  // console.log(compositionData);
  // console.log(updateTagComposition);
  // console.log(previewModalData);

  // console.log(tags);

  return (
    <>
      <div className="flex bg-white py-3 border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>

      <div className="pt-20 px-5 page-contain">
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
              {/* <button className="sm:ml-2 xs:ml-1 flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                Preview
              </button> */}
              <button
                onClick={() => navigation("/addcomposition")}
                className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
              >
                Add Composition
              </button>
              <button
                onClick={handleDeleteAllCompositions}
                className="sm:ml-2 xs:ml-1  flex align-middle bg-red text-white items-center  rounded-full xs:px-2 xs:py-1 sm:py-2 sm:px-3 md:p-3 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                style={{ display: selectAll ? "block" : "none" }}
              >
                <RiDeleteBinLine />
              </button>
              <button className="sm:ml-2 xs:ml-1  flex align-middle text-white items-center  rounded-full p-2 text-base ">
                <input
                  type="checkbox"
                  className="w-7 h-6"
                  checked={selectAll}
                  onChange={() => handleSelectAll()}
                />
              </button>
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
            />
          )}
          <div className="rounded-xl mt-8 shadow bg-white mb-6">
            <table
              className="w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Composition Name
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="text-center justify-center font-semibold text-lg w-full">
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : compositionData.length > 0 && !loading ? (
                  filteredCompositionData.length === 0 &&
                  searchComposition !== "" ? (
                    <td
                      colSpan="6"
                      className="font-semibold text-center text-2xl"
                    >
                      Composition Not found
                    </td>
                  ) : filteredCompositionData.length === 0 ? (
                    compositionData.map((composition) => (
                      <tr
                        className="border-b border-b-[#E4E6FF] "
                        key={composition?.compositionID}
                      >
                        <td className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-6 h-5 mr-2"
                            style={{ display: selectAll ? "block" : "none" }}
                            checked={composition?.isChecked || false}
                            onChange={() =>
                              handleSelectComposition(
                                composition?.compositionID
                              )
                            }
                          />
                          {composition?.compositionName}
                        </td>
                        <td className="text-center">
                          {moment(composition?.dateAdded).format(
                            "YYYY-MM-DD hh:mm"
                          )}
                        </td>
                        <td className="text-center ">
                          {composition?.resolution}
                        </td>
                        <td className="text-center">
                          {moment
                            .utc(composition?.duration * 1000)
                            .format("HH:mm:ss")}
                        </td>
                        <td className="text-center">{composition.screenIDs}</td>
                        <td className="text-center flex items-center justify-center w-full flex-wrap gap-2">
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
                                    : setTags(composition?.tags?.split(","));
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
                                    : setTags(composition?.tags?.split(","));
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
                              setUpdateTagComposition={setUpdateTagComposition}
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
                                    Edit{" "}
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
                                    onClick={() => setAddScreenModal(true)}
                                  >
                                    Set to Screens
                                  </button>
                                </div>{" "}
                                <div className="mb-1 border border-[#F2F0F9]"></div>
                                <div className=" mb-1 text-[#D30000]">
                                  <button
                                    onClick={() =>
                                      handelDeleteComposition(
                                        composition.compositionID
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

                        <PreviewModal show={modalVisible} onClose={closeModal}>
                          <div
                            className={`fixed  left-1/2 -translate-x-1/2 min-h-[80vh] max-h-[80vh] min-w-[90vh] max-w-[90vh] `}
                            ref={modalRef}
                            //   maxWidth: `${layotuDetails?.screenWidth}px`,
                            //   minWidth: `${layotuDetails?.screenWidth}px`,
                            //   maxHeight: `${layotuDetails?.screenHeight}px`,
                            //   minHeight: `${layotuDetails?.screenHeight}px`,
                            // }}
                          >
                            <RxCrossCircled
                              className="fixed z-50 w-[30px] h-[30px] text-white hover:bg-black/50 bg-black/20 rounded-full top-1 right-1 cursor-pointer"
                              onClick={closeModal}
                            />

                            {!loading &&
                              layotuDetails?.lstLayloutModelList.length > 0 &&
                              layotuDetails?.lstLayloutModelList?.map(
                                (obj, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      position: "fixed",
                                      left: obj.leftside + "%",
                                      top: obj.topside + "%",
                                      width: obj?.width + "%",
                                      height: obj?.height + "%",
                                      backgroundColor: obj.fill,
                                    }}
                                  >
                                    {modalVisible && (
                                      <Carousel
                                        items={
                                          previewModalData[index][index + 1]
                                        }
                                        composition={obj}
                                      />
                                    )}
                                  </div>
                                )
                              )}
                          </div>
                        </PreviewModal>
                      </tr>
                    ))
                  ) : (
                    filteredCompositionData.map((composition) => (
                      <tr
                        className="border-b border-b-[#E4E6FF] "
                        key={composition?.compositionID}
                      >
                        <td className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-6 h-5 mr-2"
                            style={{ display: selectAll ? "block" : "none" }}
                            checked={composition?.isChecked || false}
                            onChange={() =>
                              handleSelectComposition(
                                composition?.compositionID
                              )
                            }
                          />
                          {composition?.compositionName}
                        </td>
                        <td className="text-center">
                          {moment(composition?.dateAdded).format(
                            "YYYY-MM-DD hh:mm"
                          )}
                        </td>
                        <td className="text-center ">
                          {composition?.resolution}
                        </td>
                        <td className="text-center">
                          {moment
                            .utc(composition?.duration * 1000)
                            .format("HH:mm:ss")}
                        </td>
                        <td className="text-center">{composition.screenIDs}</td>
                        <td className="text-center flex items-center justify-center w-full flex-wrap gap-2">
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
                                    : setTags(composition?.tags?.split(","));
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
                                    : setTags(composition?.tags?.split(","));
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
                              setUpdateTagComposition={setUpdateTagComposition}
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
                                    Edit{" "}
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
                                    onClick={() => setAddScreenModal(true)}
                                  >
                                    Set to Screens
                                  </button>
                                </div>{" "}
                                <div className="mb-1 border border-[#F2F0F9]"></div>
                                <div className=" mb-1 text-[#D30000]">
                                  <button
                                    onClick={() =>
                                      handelDeleteComposition(
                                        composition.compositionID
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

                        <PreviewModal show={modalVisible} onClose={closeModal}>
                          <div
                            className={`absolute  left-1/2 -translate-x-1/2 min-h-[80vh] max-h-[80vh] min-w-[90vh] max-w-[90vh] `}
                            ref={modalRef}

                            //   maxWidth: `${layotuDetails?.screenWidth}px`,
                            //   minWidth: `${layotuDetails?.screenWidth}px`,
                            //   maxHeight: `${layotuDetails?.screenHeight}px`,
                            //   minHeight: `${layotuDetails?.screenHeight}px`,
                            // }}
                          >
                            <RxCrossCircled
                              className="absolute z-50 w-[30px] h-[30px] text-white hover:bg-black/50 bg-black/20 rounded-full top-1 right-1 cursor-pointer"
                              onClick={closeModal}
                            />

                            {!loading &&
                              layotuDetails?.lstLayloutModelList?.map(
                                (obj, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      position: "absolute",
                                      left: obj.leftside + "%",
                                      top: obj.topside + "%",
                                      width: obj?.width + "%",
                                      height: obj?.height + "%",
                                      // width: obj?.width + "px",
                                      // height: obj?.height + "px",
                                      backgroundColor: obj.fill,
                                    }}
                                  >
                                    {modalVisible && (
                                      <Carousel
                                        items={
                                          previewModalData[index][index + 1]
                                        }
                                        composition={obj}
                                      />
                                    )}
                                  </div>
                                )
                              )}
                          </div>
                        </PreviewModal>
                      </tr>
                    ))
                  )
                ) : (
                  <tr className="text-center p-2 font-semibold w-full">
                    <td colSpan="6" className="p-3 text-center">
                      No CompositionData here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Composition;
