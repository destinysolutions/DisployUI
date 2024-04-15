import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbAppsFilled } from "react-icons/tb";
import { Suspense, useState } from "react";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import { BsInfoLg } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { useEffect } from "react";
import axios from "axios";
import {
  ADD_YOUTUBE_TAGS,
  ASSIGN_YOUTUBE_TO_SCREEN,
  GET_ALL_YOUTUBEDATA,
  GET_YOUTUBEDATA_BY_ID,
  SIGNAL_R,
  YOUTUBEDATA_ALL_DELETE,
  YOUTUBE_INSTANCE_ADD_URL,
} from "../../Pages/Api";
import ReactPlayer from "react-player";
import { FiUpload } from "react-icons/fi";
import {
  MdArrowBackIosNew,
  MdOutlineEdit,
  MdOutlineModeEdit,
} from "react-icons/md";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import youtube from "../../images/AppsImg/youtube.svg";
import { useRef } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ScreenAssignModal from "../ScreenAssignModal";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import { HiBackward } from "react-icons/hi2";
import { connection } from "../../SignalR";
import { socket } from "../../App";
import { getMenuAll, getMenuPermission } from "../../Redux/SidebarSlice";
import Loading from "../Loading";

const Youtube = ({ sidebarOpen, setSidebarOpen }) => {
  Youtube.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [appDetailModal, setAppDetailModal] = useState(false);
  const [youtubeData, setYoutubeData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appDropDown, setAppDropDown] = useState(null);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [instanceView, setInstanceView] = useState(false);
  const [instanceID, setInstanceID] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [selectdata, setSelectData] = useState({});
  const selectedScreenIdsString = Array.isArray(selectedScreens)
    ? selectedScreens.join(",")
    : "";
  const [instanceName, setInstanceName] = useState("");
  const [screenAssignName, setScreenAssignName] = useState("");
  const [YoutubeVideo, setYoutubeVideo] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [updateTagYoutube, setUpdateTagYoutube] = useState(null);
  const [showTags, setShowTags] = useState(null);
  const [screenSelected, setScreenSelected] = useState([]);
  const [sidebarload, setSidebarLoad] = useState(true);
  const navigate = useNavigate();
  const addScreenRef = useRef(null);
  const modalRef = useRef(null);
  const appDropdownRef = useRef(null);

  const [permissions, setPermissions] = useState({
    isDelete: false,
    isSave: false,
    isView: false,
  });

  useEffect(() => {
    dispatch(getMenuAll()).then((item) => {
      const findData = item.payload.data.menu.find(
        (e) => e.pageName === "Apps"
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

  const handleUpdateScreenAssign = (screenIds, macids) => {
    let idS = "";
    for (const key in screenIds) {
      if (screenIds[key] === true) {
        idS += `${key},`;
      }
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ASSIGN_YOUTUBE_TO_SCREEN}?YoutubeId=${instanceID}&ScreenID=${idS}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.status == 200) {
          const Params = {
            id: socket.id,
            connection: socket.connected,
            macId: macids,
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
                  .invoke("ScreenConnected", macids)
                  .then(() => {
                    console.log(" method invoked");
                  })
                  .catch((error) => {
                    console.error("Error invoking SignalR method:", error);
                  });
              });
          } else {
            connection
              .invoke("ScreenConnected", macids)
              .then(() => {
                console.log(" method invoked");
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
        }
        setSelectScreenModal(false);
        setAddScreenModal(false);
        FetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelDeleteInstance = (youtubeId, maciDs) => {
    if (!window.confirm("Are you sure?")) return;
    let data = JSON.stringify({
      youtubeId: youtubeId,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: YOUTUBE_INSTANCE_ADD_URL,
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      data: data,
    };
    toast.loading("Deleting...");
    axios
      .request(config)
      .then((response) => {
        const Params = {
          id: socket.id,
          connection: socket.connected,
          macId: maciDs,
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
                .invoke("ScreenConnected", maciDs)
                .then(() => {
                  console.log("SignalR method invoked after youtube update");
                })
                .catch((error) => {
                  console.error("Error invoking SignalR method:", error);
                });
            });
        } else {
          connection
            .invoke("ScreenConnected", maciDs)
            .then(() => {
              console.log("SignalR method invoked after youtube update");
            })
            .catch((error) => {
              console.error("Error invoking SignalR method:", error);
            });
        }
        const updatedInstanceData = youtubeData.filter(
          (instanceData) => instanceData.youtubeId !== youtubeId
        );

        setYoutubeData(updatedInstanceData);
        toast.remove();
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handleCheckboxChange = (instanceId) => {
    const updatedInstance = youtubeData.map((youtube) =>
      youtube.youtubeId === instanceId
        ? {
            ...youtube,
            isChecked: !youtube.isChecked,
          }
        : youtube
    );

    setYoutubeData(updatedInstance);

    const allChecked = updatedInstance.every((youtube) => youtube.isChecked);
    setSelectAll(allChecked);
  };

  // Function to handle the "Select All" checkbox change
  const handleSelectAll = (e) => {
    const updatedInstance = youtubeData.map((youtube) => ({
      ...youtube,
      isChecked: !selectAll,
    }));
    setYoutubeData(updatedInstance);
    setSelectAll(!selectAll);
  };

  const handelDeleteAllInstance = () => {
    if (!window.confirm("Are you sure?")) return;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: YOUTUBEDATA_ALL_DELETE,
      headers: { Authorization: authToken },
    };

    axios
      .request(config)
      .then(() => {
        setSelectAll(false);
        setYoutubeData([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAppDropDownClick = (id) => {
    setInstanceID(id);
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

  function handleClickOutside() {
    setAppDetailModal(false);
    setInstanceView(false);
  }

  function handleClickOutside() {
    setAppDropDown(false);
  }

  const handleFetchYoutubeById = (id) => {
    let config = {
      method: "get",
      url: `${GET_YOUTUBEDATA_BY_ID}?ID=${id}`,
      headers: {
        Authorization: authToken,
      },
    };

    toast.loading("Fetching Data....");
    axios
      .request(config)
      .then((response) => {
        const data = response?.data?.data[0];
        setYoutubeVideo(data?.youTubeURL);
        setInstanceName(data?.instanceName);
        setScreenAssignName(data?.screens);
        setShowTags(data?.tags);
        setScreenSelected(data?.screens?.split(","));
        setIsMuted(data?.muteVideos);
        toast.remove();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.remove();
      });
  };

  const handleUpdateTagsYoutube = (tags) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ADD_YOUTUBE_TAGS}?YoutubeId=${updateTagYoutube?.youtubeId}&Tags=${
        tags.length === 0 ? "" : tags
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      // data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const updatedData = youtubeData.map((item) => {
            if (item?.youtubeId === updateTagYoutube?.youtubeId) {
              return { ...item, tags: tags };
            } else {
              return item;
            }
          });
          setYoutubeData(updatedData);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const FetchData = () => {
    setLoading(true);
    axios
      .get(GET_ALL_YOUTUBEDATA, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        const fetchedData = response.data.data;
        setLoading(false);
        setYoutubeData(fetchedData);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching deleted data:", error);
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        // window.document.body.style.overflow = "unset";
        setAppDetailModal(false);
        setInstanceView(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appDropdownRef.current &&
        !appDropdownRef.current.contains(event?.target)
      ) {
        setAppDropDown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

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
                    Apps
                  </h1>
                  <div className="lg:col-span-2 flex items-center md:mt-0 lg:mt-0 justify-end flex-wrap">
                    {permissions.isSave && (
                      <Link to="/youtubedetail">
                        <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                          <TbAppsFilled className="text-2xl mr-2 text-white" />
                          New Instance
                        </button>
                      </Link>
                    )}
                    <Link to="/apps">
                      <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 text-base sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                        <MdArrowBackIosNew className="text-2xl mr-2 text-white rounded-full p-1" />
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="mt-5 mb-5">
                  <div className="shadow-md bg-white rounded-lg p-5">
                    <div className="flex justify-between items-center">
                      <h1 className="not-italic font-medium text-xl text-[#001737] ">
                        YouTube
                      </h1>
                      <div className="flex items-center">
                        <button
                          onClick={() => setAppDetailModal(true)}
                          className="w-8 h-8 ml-2 border-primary hover:bg-SlateBlue hover:border-SlateBlue items-center border-2 rounded-full p-1 text-xl   hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                        >
                          <BsInfoLg />
                        </button>
                        {appDetailModal && (
                          <>
                            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none ">
                              <div
                                ref={modalRef}
                                className="relative w-auto my-6 mx-auto"
                              >
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none md:max-w-xl sm:max-w-sm xs:max-w-xs">
                                  <div className="flex items-center justify-between p-5 border-b border-slate-200 rounded-t">
                                    <div className="flex items-center">
                                      <div>
                                        <img src={youtube} className="w-10" />
                                      </div>
                                      <div className="ml-3">
                                        <h4 className="text-lg font-medium">
                                          YouTube
                                        </h4>
                                        <h4 className="text-sm font-normal ">
                                          Internal Communications
                                        </h4>
                                      </div>
                                    </div>
                                    <button
                                      className="p-1 text-3xl"
                                      onClick={() => setAppDetailModal(false)}
                                    >
                                      <AiOutlineCloseCircle />
                                    </button>
                                  </div>
                                  <div className="p-2 max-h-96 vertical-scroll-inner">
                                    <div className="py-2">
                                      <ReactPlayer
                                        url="https://www.youtube.com/watch?v=WKOYp_7P71Y"
                                        className="app-instance-preview"
                                        loop={true}
                                        controls={true}
                                      />
                                    </div>
                                    <p className="max-w-xl px-6">
                                      Lorem Ipsum is simply dummy text of the
                                      printing and typesetting industry. Lorem
                                      Ipsum has been the industry&apos;s
                                      standard dummy text ever since the 1500s,
                                      when an unknown printer took a galley of
                                      type and scrambled it to make a type
                                      specimen book.
                                    </p>
                                    <div className="py-2 px-6">
                                      <p>- Add videos by YouTube URL</p>
                                      <p>- Mute videos</p>
                                      <p>
                                        - Choose to play with or without
                                        subtitles
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center p-5">
                                    <button className="border-primary border-2 text-primary py-1.5 px-5 rounded-full hover:bg-primary hover:text-white">
                                      App Guide
                                    </button>
                                    <button
                                      className="bg-primary text-white rounded-full py-2 px-5 ml-5"
                                      onClick={() => setAppDetailModal(false)}
                                    >
                                      Go to App
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <button
                          onClick={handelDeleteAllInstance}
                          className="w-8 h-8 ml-1 border-primary items-center border-2 rounded-full px-1 text-2xl  hover:text-white hover:border-SlateBlue hover:bg-SlateBlue hover:shadow-lg hover:shadow-primary-500/50"
                          style={{ display: selectAll ? "block" : "none" }}
                        >
                          <RiDeleteBinLine className="text-xl" />
                        </button>
                        {Array.isArray(youtubeData) &&
                          youtubeData.length > 0 && (
                            <button className="sm:ml-2 xs:ml-1 mt-1">
                              {permissions.isDelete && (
                                <input
                                  type="checkbox"
                                  className="h-7 w-7"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                />
                              )}
                            </button>
                          )}
                      </div>
                    </div>
                    <div>
                      {loading ? (
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
                      ) : Array.isArray(youtubeData) &&
                        youtubeData.length > 0 ? (
                        <div className=" grid grid-cols-12 gap-4 mt-5">
                          {youtubeData.map((item) => (
                            <div
                              key={item.youtubeId}
                              className="xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-12"
                            >
                              <div className="shadow-md bg-[#EFF3FF] rounded-lg h-full">
                                <div className="relative flex justify-between">
                                  <button className="float-right p-2">
                                    <input
                                      className="h-5 w-5"
                                      type="checkbox"
                                      style={{
                                        display: selectAll ? "block" : "none",
                                      }}
                                      checked={item.isChecked || false}
                                      onChange={() =>
                                        handleCheckboxChange(item.youtubeId)
                                      }
                                    />
                                  </button>
                                  <div className="relative">
                                    {permissions.isSave &&
                                      permissions.isDelete && (
                                        <button className="float-right">
                                          <BiDotsHorizontalRounded
                                            className="text-2xl"
                                            onClick={() =>
                                              handleAppDropDownClick(
                                                item.youtubeId
                                              )
                                            }
                                          />
                                        </button>
                                      )}
                                    {appDropDown === item.youtubeId && (
                                      <div
                                        ref={appDropdownRef}
                                        className="appdw"
                                      >
                                        <ul className="space-y-2">
                                          {permissions.isSave && (
                                            <div>
                                              <li
                                                onClick={() =>
                                                  navigate(
                                                    `/youtubedetail/${item?.youtubeId}`
                                                  )
                                                }
                                                className="flex text-sm items-center cursor-pointer"
                                              >
                                                <MdOutlineEdit className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                                Edit
                                              </li>
                                              <li
                                                className="flex text-sm items-center cursor-pointer"
                                                onClick={() => {
                                                  setAddScreenModal(true);
                                                  // handleFetchYoutubeById(item?.youtubeId);
                                                  setSelectData(item);
                                                }}
                                              >
                                                <FiUpload className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                                Set to Screen
                                              </li>
                                            </div>
                                          )}

                                          {permissions.isDelete && (
                                            <li
                                              className="flex text-sm items-center cursor-pointer"
                                              onClick={() =>
                                                handelDeleteInstance(
                                                  item.youtubeId,
                                                  item?.maciDs
                                                )
                                              }
                                            >
                                              <RiDeleteBin5Line className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                              Delete
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-center clear-both pb-8">
                                  <img
                                    src={youtube}
                                    alt="Logo"
                                    className="mx-auto h-20 w-20 cursor-pointer "
                                    onClick={() => {
                                      handleFetchYoutubeById(item.youtubeId);
                                      setInstanceView(true);
                                    }}
                                  />
                                  <h4 className="text-lg font-medium mt-3">
                                    {item.instanceName}
                                  </h4>
                                  <h4
                                    onClick={() => {
                                      item?.tags !== null &&
                                      item?.tags !== undefined &&
                                      item?.tags !== ""
                                        ? setTags(item?.tags?.split(","))
                                        : setTags([]);
                                      setShowTagModal(true);
                                      setUpdateTagYoutube(item);
                                    }}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    Add tags +
                                  </h4>
                                  {/*   {item?.tags ? (
                              <div className="flex items-center justify-center gap-2">
                                <h4 className="text-sm font-normal cursor-pointer break-all">
                                  {item?.tags !== null
                                    ? item.tags
                                        .split(",")
                                        .slice(
                                          0,
                                          item.tags.split(",").length > 2
                                            ? 3
                                            : item.tags.split(",").length
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
                                </h4>
                                <MdOutlineModeEdit
                                  className="w-5 h-5 cursor-pointer"
                                  onClick={() => {
                                    item?.tags !== null &&
                                    item?.tags !== undefined &&
                                    item?.tags !== ""
                                      ? setTags(item?.tags?.split(","))
                                      : setTags([]);
                                    setShowTagModal(true);
                                    setUpdateTagYoutube(item);
                                  }}
                                />
                              </div>
                            ) : (
                              <h4
                                onClick={() => {
                                  item?.tags !== null &&
                                  item?.tags !== undefined &&
                                  item?.tags !== ""
                                    ? setTags(item?.tags?.split(","))
                                    : setTags([]);
                                  setShowTagModal(true);
                                  setUpdateTagYoutube(item);
                                }}
                                className="text-sm font-normal cursor-pointer"
                              >
                                Add tags +
                              </h4>
                              )}*/}
                                </div>
                              </div>
                            </div>
                          ))}
                          {showTagModal && (
                            <AddOrEditTagPopup
                              setShowTagModal={setShowTagModal}
                              tags={tags}
                              setTags={setTags}
                              handleUpdateTagsYoutube={handleUpdateTagsYoutube}
                              from="youtube"
                              setUpdateTagYoutube={setUpdateTagYoutube}
                            />
                          )}
                          {instanceView && (
                            <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-9990 outline-none focus:outline-none">
                              <div ref={modalRef}>
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                                  <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7]  rounded-t">
                                    <div className="flex items-center">
                                      <div>
                                        <img src={youtube} className="w-10" />
                                      </div>
                                      <div className="ml-3">
                                        <h4 className="text-lg font-medium">
                                          {instanceName} 
                                        </h4>
                                      </div>
                                    </div>
                                    <button
                                      className="p-1 text-3xl"
                                      onClick={() => setInstanceView(false)}
                                    >
                                      <AiOutlineCloseCircle />
                                    </button>
                                  </div>
                                  <div className="max-h-96 custom-scrollbar">
                                    <div className="p-2 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72">
                                      <ReactPlayer
                                        url={YoutubeVideo}
                                        className="youtube-preview"
                                        muted={isMuted}
                                        controls={true}
                                        loop={true}
                                      />
                                    </div>
                                  </div>
                                  <div className="py-2 px-6">
                                    <div className="flex items-center gap-2 w-full">
                                      <div className="font-semibold w-fit">
                                        Tags:-
                                      </div>
                                      <div className=" w-full">{showTags}</div>
                                    </div>
                                    <div>
                                      <label className="font-semibold">
                                        Screen Assign :
                                      </label>
                                      {screenAssignName == ""
                                        ? " No Screen"
                                        : screenAssignName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p>No YouTube data available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </>
        </Suspense>
      )}
      {addScreenModal && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
          <div
            ref={addScreenRef}
            className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
          >
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                <div className="flex items-center">
                  <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                    Select the screen to set the App
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
                  New Youtube App Instance would be applied. Do you want to
                  proceed?
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
      {/* add screen modal end */}
      {selectScreenModal && (
        <ScreenAssignModal
          setAddScreenModal={setAddScreenModal}
          setSelectScreenModal={setSelectScreenModal}
          handleUpdateScreenAssign={handleUpdateScreenAssign}
          selectedScreens={selectedScreens}
          setSelectedScreens={setSelectedScreens}
          screenSelected={screenSelected}
          sidebarOpen={sidebarOpen}
        />
      )}
    </>
  );
};

export default Youtube;
