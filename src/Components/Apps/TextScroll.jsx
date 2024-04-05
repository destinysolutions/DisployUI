import React, { Suspense, useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { TbAppsFilled, TbSolarPanel } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { BsInfoLg } from "react-icons/bs";
import { RiDeleteBin5Line, RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import {
  ADD_TEXTSCROLL_TAGS,
  ASSIGN_TEXTSCROLL_TO_SCREEN,
  DELETE_ALL_TEXT_SCROLL,
  GET_ALL_TEXT_SCROLL_INSTANCE,
  SCROLL_ADD_TEXT,
  SELECT_BY_TEXTSCROLL_ID,
  SIGNAL_R,
} from "../../Pages/Api";
import { useState } from "react";
import {
  MdArrowBackIosNew,
  MdOutlineEdit,
  MdOutlineModeEdit,
} from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ScreenAssignModal from "../ScreenAssignModal";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import textScrollLogo from "../../images/AppsImg/text-scroll-icon.svg";
import { HiBackward } from "react-icons/hi2";
import { connection } from "../../SignalR";
import { socket } from "../../App";
import { getMenuAll, getMenuPermission } from "../../Redux/SidebarSlice";
import Loading from "../Loading";

const TextScroll = ({ sidebarOpen, setSidebarOpen }) => {
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();

  const [instanceData, setInstanceData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [appDropDown, setAppDropDown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [textScrollId, setTextScrollId] = useState();
  const selectedScreenIdsString = Array.isArray(selectedScreens)
    ? selectedScreens.join(",")
    : "";
  const [selectdata, setSelectData] = useState({});
  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [updateTextscrollTag, setUpdateTextscrollTag] = useState(null);
  const [showTags, setShowTags] = useState(null);
  const [instanceName, setInstanceName] = useState("");
  const [textScrollData, setTextScrollData] = useState("");
  const [screenAssignName, setScreenAssignName] = useState("");
  const [instanceView, setInstanceView] = useState(false);
  const [scrollType, setScrollType] = useState(1);
  const [screenSelected, setScreenSelected] = useState([]);
  const [sidebarload, setSidebarLoad] = useState(true);
  const navigate = useNavigate();
  const addScreenRef = useRef(null);
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
      url: `${ASSIGN_TEXTSCROLL_TO_SCREEN}?TextScrollId=${textScrollId}&ScreenID=${idS}`,
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
          const Params = {
            id: socket.id,
            connection: socket.connected,
            macId: macids,
          };
          socket.emit("ScreenConnected", Params);
          setTimeout(() => {
            toast.remove();
            setSelectScreenModal(false);
            setAddScreenModal(false);
            FetchData();
          }, 1000);
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
                    // setSelectScreenModal(false);
                    // setAddScreenModal(false);
                    // FetchData();
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
                // setSelectScreenModal(false);
                // setAddScreenModal(false);
                // FetchData();
              })
              .catch((error) => {
                console.error("Error invoking SignalR method:", error);
              });
          }
        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };

  const handelDeleteInstance = (scrollId, maciDs) => {
    if (!window.confirm("Are you sure?")) return;

    toast.loading("Deleting...");
    let data = JSON.stringify({
      textScroll_Id: scrollId,
      operation: "Delete",
    });

    let config = {
      method: "post",
      url: SCROLL_ADD_TEXT,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

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
        const updatedInstanceData = instanceData.filter(
          (instanceData) => instanceData.textScroll_Id !== scrollId
        );
        setInstanceData(updatedInstanceData);
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handleCheckboxChange = (instanceId) => {
    const updatedInstance = instanceData.map((instance) =>
      instance.textScroll_Id === instanceId
        ? {
            ...instance,
            isChecked: !instance.isChecked,
          }
        : instance
    );

    setInstanceData(updatedInstance);

    const allChecked = updatedInstance.every((instance) => instance.isChecked);
    setSelectAll(allChecked);
  };

  // Function to handle the "Select All" checkbox change
  const handleSelectAll = () => {
    const updatedInstance = instanceData.map((instance) => ({
      ...instance,
      isChecked: !selectAll,
    }));
    setInstanceData(updatedInstance);
    setSelectAll(!selectAll);
  };

  const handelDeleteAllInstance = () => {
    if (!window.confirm("Are you sure?")) return;
    toast.loading("Deleting...");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: DELETE_ALL_TEXT_SCROLL,
      headers: { Authorization: authToken },
    };

    axios
      .request(config)
      .then(() => {
        setSelectAll(false);
        setInstanceData([]);
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handleAppDropDownClick = (id) => {
    setTextScrollId(id);
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

  const handleUpdateTagsTextScroll = (tags) => {
    const empty = "";
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ADD_TEXTSCROLL_TAGS}?TextScrollId=${
        updateTextscrollTag?.textScroll_Id
      }&Tags=${tags.length === 0 ? "" : tags}`,
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
          const updatedData = instanceData.map((item) => {
            if (item?.textScroll_Id === updateTextscrollTag?.textScroll_Id) {
              return { ...item, tags: tags };
            } else {
              return item;
            }
          });
          setInstanceData(updatedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFetchTextscrollById = (id, showpopup) => {
    let config = {
      method: "get",
      url: `${SELECT_BY_TEXTSCROLL_ID}?ID=${id}`,
      headers: {
        Authorization: authToken,
      },
    };

    toast.loading("Fetching Data....");
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const data = response?.data?.data[0];
          if (showpopup) {
            setInstanceView(true);
          }
          setTextScrollData(data?.text);
          setInstanceName(data?.instanceName);
          setScreenAssignName(data?.screens);
          setScrollType(data?.scrollType);
          setShowTags(data?.tags);
          setScreenSelected(data?.screens?.split(","));
          setLoading(false);
        }
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.remove();
      });
  };

  const FetchData = () => {
    setLoading(true);
    axios
      .get(GET_ALL_TEXT_SCROLL_INSTANCE, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        setInstanceData(response.data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appDropdownRef.current &&
        !appDropdownRef.current.contains(event?.target)
      ) {
        setAppDropDown(false);
        setInstanceView(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setAppDropDown(false);
    setInstanceView(false);
  }

  return (
    <>
      {sidebarload && <Loading />}
      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
            <div className="flex border-b border-gray bg-white">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Navbar />
            </div>
            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                <div className="grid lg:grid-cols-3 gap-2">
                  <h1 className="not-italic font-medium text-2xl text-[#001737] ">
                    Apps
                  </h1>
                  <div className="lg:col-span-2 flex items-center md:mt-0 lg:mt-0 justify-end flex-wrap">
                    {permissions.isSave && (
                      <Link to="/textscrolldetail">
                        <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                          <TbAppsFilled className="text-2xl mr-2 text-white" />
                          New Instance
                        </button>
                      </Link>
                    )}
                    <Link to="/apps">
                      <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                        <MdArrowBackIosNew className="text-2xl mr-2 text-white rounded-full p-1" />
                        Back
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="mt-5 mb-5">
                  <div className="shadow-md bg-white rounded-lg p-5">
                    <div className="flex justify-between items-center from-blue-900 to-gray-800 text-2xl text-block">
                      <h1 className="not-italic font-medium text-xl text-[#001737] ">
                        Text Scroll
                      </h1>
                      <div className="flex items-center">
                        {/* <button className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                    <BsInfoLg />
                  </button> */}
                        <button
                          onClick={handelDeleteAllInstance}
                          style={{ display: selectAll ? "block" : "none" }}
                          className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full px-1 text-2xl  hover:text-white hover:border-SlateBlue hover:bg-SlateBlue hover:shadow-lg hover:shadow-primary-500/50"
                        >
                          <RiDeleteBinLine className="text-xl" />
                        </button>
                        {instanceData.length > 0 && (
                          <button className="sm:ml-2 xs:ml-1 mt-2 ">
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
                    ) : instanceData.length > 0 ? (
                      <div className="grid grid-cols-12 gap-4 mt-5">
                        {instanceData.map((instance) => (
                          <div
                            className="xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-12"
                            key={instance.textScroll_Id}
                          >
                            <div className="shadow-md bg-[#EFF3FF] rounded-lg h-full">
                              <div className="relative flex justify-between">
                                <button className="float-right p-2">
                                  <input
                                    style={{
                                      display: selectAll ? "block" : "none",
                                    }}
                                    className="h-5 w-5"
                                    type="checkbox"
                                    checked={instance.isChecked || false}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        instance.textScroll_Id
                                      )
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
                                              instance.textScroll_Id
                                            )
                                          }
                                        />
                                      </button>
                                    )}
                                  {appDropDown === instance.textScroll_Id && (
                                    <div className="appdw" ref={appDropdownRef}>
                                      <ul className="space-y-2">
                                        {permissions.isSave && (
                                          <div>
                                            <li
                                              onClick={() => {
                                                navigate(
                                                  `/textscrolldetail/${instance?.textScroll_Id}`
                                                );
                                              }}
                                              className="flex text-sm items-center cursor-pointer"
                                            >
                                              <MdOutlineEdit className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                              Edit
                                            </li>
                                            <li
                                              className="flex text-sm items-center cursor-pointer"
                                              onClick={() => {
                                                setAddScreenModal(true);
                                                setSelectData(instance);
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
                                                instance.textScroll_Id,
                                                instance?.maciDs
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
                                <div
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleFetchTextscrollById(
                                      instance?.textScroll_Id,
                                      true
                                    )
                                  }
                                >
                                  <img
                                    // src="../../../AppsImg/text-scroll-icon.svg"
                                    src={textScrollLogo}
                                    alt="Logo"
                                    className="mx-auto h-30 w-30"
                                  />
                                  <h4 className="text-lg font-medium mt-3">
                                    {instance.instanceName}
                                  </h4>
                                </div>
                                <h4
                                  onClick={() => {
                                    instance?.tags !== null &&
                                    instance?.tags !== undefined &&
                                    instance?.tags !== ""
                                      ? setTags(instance?.tags?.split(","))
                                      : setTags([]);
                                    setShowTagModal(true);
                                    setUpdateTextscrollTag(instance);
                                  }}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Add tags +
                                </h4>{" "}
                                {/* {instance?.tags ? (
                            <div className="flex items-center justify-center gap-2">
                              <h4 className="text-sm font-normal cursor-pointer break-all">
                                {instance?.tags !== null
                                  ? instance.tags
                                      .split(",")
                                      .slice(
                                        0,
                                        instance.tags.split(",").length > 2
                                          ? 3
                                          : instance.tags.split(",").length
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
                                  instance?.tags !== null &&
                                  instance?.tags !== undefined &&
                                  instance?.tags !== ""
                                    ? setTags(instance?.tags?.split(","))
                                    : setTags([]);
                                  setShowTagModal(true);
                                  setUpdateTextscrollTag(instance);
                                }}
                              />
                            </div>
                          ) : (
                            <h4
                              onClick={() => {
                                instance?.tags !== null &&
                                instance?.tags !== undefined &&
                                instance?.tags !== ""
                                  ? setTags(instance?.tags?.split(","))
                                  : setTags([]);
                                setShowTagModal(true);
                                setUpdateTextscrollTag(instance);
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
                            handleUpdateTagsTextScroll={
                              handleUpdateTagsTextScroll
                            }
                            from="textscroll"
                            setUpdateTextscrollTag={
                              setUpdateTextscrollTag
                            }
                          />
                        )}
                         {instanceView && (
                            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                              <div
                                ref={appDropdownRef}
                              >
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                                  <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7]  rounded-t">
                                    <div className="flex items-center">
                                      <div>
                                        <img src={textScrollLogo} className="w-10" />
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
                                  <div className="bg-black md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 flex items-center">
                                  <marquee
                                    direction={
                                      scrollType == 1 ? "right" : "left"
                                    }
                                    style={{
                                      fontSize: "36px",
                                      color: "white",
                                    }}
                                  >
                                    {textScrollData}
                                  </marquee>
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
                      <p>No Text Scroll data available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
              <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
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
                  New Text-Scroll App Instance would be applied. Do you want to
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

export default TextScroll;
