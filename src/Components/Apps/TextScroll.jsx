import React, {useEffect, useRef} from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import {TbAppsFilled, TbSolarPanel} from "react-icons/tb";
import {Link, useNavigate} from "react-router-dom";
import {BsInfoLg} from "react-icons/bs";
import {RiDeleteBin5Line, RiDeleteBinLine} from "react-icons/ri";
import axios from "axios";
import {
  DELETE_ALL_TEXT_SCROLL,
  GET_ALL_TEXT_SCROLL_INSTANCE,
  SCROLL_ADD_TEXT,
  SIGNAL_R,
} from "../../Pages/Api";
import {useState} from "react";
import {
  MdArrowBackIosNew,
  MdOutlineEdit,
  MdOutlineModeEdit,
} from "react-icons/md";
import {FiUpload} from "react-icons/fi";
import {BiDotsHorizontalRounded} from "react-icons/bi";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {AiOutlineCloseCircle} from "react-icons/ai";
import ScreenAssignModal from "../ScreenAssignModal";
import AddOrEditTagPopup from "../AddOrEditTagPopup";
import ReactPlayer from "react-player";
import textScrollLogo from "../../images/AppsImg/text-scroll-icon.svg";
import {HiBackward} from "react-icons/hi2";
import {connection} from "../../SignalR";

const TextScroll = ({sidebarOpen, setSidebarOpen}) => {
  const {token} = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

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

  const navigate = useNavigate();
  const addScreenRef = useRef(null);
  const appDropdownRef = useRef(null);

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
      url: `https://disployapi.thedestinysolutions.com/api/YoutubeApp/AssignTextScrollToScreen?TextScrollId=${textScrollId}&ScreenID=${idS}`,
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
                    setSelectScreenModal(false);
                    setAddScreenModal(false);
                    FetchData();
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
                setSelectScreenModal(false);
                setAddScreenModal(false);
                FetchData();
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
      headers: {Authorization: authToken},
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
      url: `https://disployapi.thedestinysolutions.com/api/YoutubeApp/AddTextScrollTags?TextScrollId=${
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
              return {...item, tags: tags};
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
      url: `https://disployapi.thedestinysolutions.com/api/YoutubeApp/SelectByTextScrollId?ID=${id}`,
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
      <div className="flex border-b border-gray bg-white">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-20 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block  items-center">
            <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
              Apps
            </h1>
            <div className="lg:flex">
              <Link to="/textscrolldetail">
                <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                  <TbAppsFilled className="text-2xl mr-2 text-white" />
                  New Instance
                </button>
              </Link>
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
                    style={{display: selectAll ? "block" : "none"}}
                    className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full px-1 text-2xl  hover:text-white hover:border-SlateBlue hover:bg-SlateBlue hover:shadow-lg hover:shadow-primary-500/50">
                    <RiDeleteBinLine className="text-xl" />
                  </button>
                  {instanceData.length > 0 && (
                    <button className="sm:ml-2 xs:ml-1 mt-2 ">
                      <input
                        type="checkbox"
                        className="h-7 w-7"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </button>
                  )}
                </div>
              </div>
              {loading ? (
                <div className="font-semibold text-center text-2xl w-full col-span-full">
                  Loading...
                </div>
              ) : instanceData.length > 0 ? (
                <div className="grid grid-cols-12 gap-4 mt-5">
                  {instanceData.map((instance) => (
                    <div
                      className="xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-12"
                      key={instance.textScroll_Id}>
                      <div className="shadow-md bg-[#EFF3FF] rounded-lg">
                        <div className="relative flex justify-between">
                          <button className="float-right p-2">
                            <input
                              style={{display: selectAll ? "block" : "none"}}
                              className="h-5 w-5"
                              type="checkbox"
                              checked={instance.isChecked || false}
                              onChange={() =>
                                handleCheckboxChange(instance.textScroll_Id)
                              }
                            />
                          </button>
                          <div className="relative">
                            <button className="float-right">
                              <BiDotsHorizontalRounded
                                className="text-2xl"
                                onClick={() =>
                                  handleAppDropDownClick(instance.textScroll_Id)
                                }
                              />
                            </button>
                            {appDropDown === instance.textScroll_Id && (
                              <div className="appdw" ref={appDropdownRef}>
                                <ul className="space-y-2">
                                  <li
                                    onClick={() => {
                                      navigate(
                                        `/textscrolldetail/${instance?.textScroll_Id}`
                                      );
                                    }}
                                    className="flex text-sm items-center cursor-pointer">
                                    <MdOutlineEdit className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                    Edit
                                  </li>
                                  <li
                                    className="flex text-sm items-center cursor-pointer"
                                    onClick={() => {
                                      // handleFetchTextscrollById(
                                      //   instance?.textScroll_Id,
                                      //   false
                                      // );
                                      setAddScreenModal(true);
                                      setSelectData(instance);
                                    }}>
                                    <FiUpload className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                    Set to Screen
                                  </li>
                                  {/* <li className="flex text-sm items-center">
                                      <MdPlaylistPlay className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                      Add to Playlist
                                    </li> */}

                                  <li
                                    className="flex text-sm items-center cursor-pointer"
                                    onClick={() =>
                                      handelDeleteInstance(
                                        instance.textScroll_Id,
                                        instance?.maciDs
                                      )
                                    }>
                                    <RiDeleteBin5Line className="mr-2 min-w-[1.5rem] min-h-[1.5rem]" />
                                    Delete
                                  </li>
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
                            }>
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
                            className="text-sm font-normal cursor-pointer">
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
                          {showTagModal && (
                            <AddOrEditTagPopup
                              setShowTagModal={setShowTagModal}
                              tags={tags}
                              setTags={setTags}
                              handleUpdateTagsTextScroll={
                                handleUpdateTagsTextScroll
                              }
                              from="textscroll"
                              setUpdateTextscrollTag={setUpdateTextscrollTag}
                            />
                          )}
                        </div>
                        {instanceView && (
                          <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div
                              ref={appDropdownRef}
                              className="w-[600px] my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7]  rounded-t">
                                  <div className="flex items-center">
                                    <div>
                                      <img
                                        src={textScrollLogo}
                                        className="w-10"
                                      />
                                    </div>
                                    <div className="ml-3">
                                      <h4 className="text-lg font-medium">
                                        {instanceName}
                                      </h4>
                                    </div>
                                  </div>
                                  <button
                                    className="p-1 text-3xl"
                                    onClick={() => setInstanceView(false)}>
                                    <AiOutlineCloseCircle />
                                  </button>
                                </div>
                                <div className="bg-lightgray min-h-[8rem] flex items-center">
                                  <marquee
                                    direction={
                                      scrollType == 1 ? "right" : "left"
                                    }>
                                    {textScrollData}
                                  </marquee>
                                </div>

                                <div className="py-2 px-6 space-y-3">
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
                    </div>
                  ))}
                </div>
              ) : (
                <p>No Text Scroll data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {addScreenModal && (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div
            ref={addScreenRef}
            className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                <div className="flex items-center">
                  <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                    Select the screen to set the App
                  </h3>
                </div>
                <button
                  className="p-1 text-xl ml-8"
                  onClick={() => setAddScreenModal(false)}>
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
                  }}>
                  OK
                </button>

                <button
                  className="bg-primary text-white px-4 py-2 rounded-full ml-3"
                  onClick={() => setAddScreenModal(false)}>
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
        />
      )}
    </>
  );
};

export default TextScroll;
