import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Loading from '../Loading';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { getMenuAll, getMenuPermission } from '../../Redux/SidebarSlice';
import { TbAppsFilled } from 'react-icons/tb';
import { MdArrowBackIosNew, MdOutlineEdit } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ADD_TAGS_DIGITAL_MENU, ASSIGN_SCREEN_DIGITAL_MENU, DELETE_DIGITAL_MENU, GET_ALL_DIGITAL_MENU, GET_DIGITAL_MENU_BY_ID } from '../../Pages/Api';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiUpload } from 'react-icons/fi';
import { RiDeleteBin5Line, RiDeleteBinLine } from 'react-icons/ri';
import digitalMenuLogo from "../../images/AppsImg/foods.svg";
import Digital_Menu from "../../images/AppsImg/Digital_Menu.jpg"
import AddOrEditTagPopup from '../AddOrEditTagPopup';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { socket } from '../../App';
import ScreenAssignModal from '../ScreenAssignModal';
import { BsInfoLg } from 'react-icons/bs';

const DigitalMenuBoard = ({ sidebarOpen, setSidebarOpen }) => {
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appDropdownRef = useRef(null);
  const addScreenRef = useRef(null);

  const [sidebarload, setSidebarLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [instanceData, setInstanceData] = useState([]);
  const [appDropDown, setAppDropDown] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [updateDigitalMenuTag, setUpdateDigitalMenuTag] = useState(null);
  const [instanceView, setInstanceView] = useState(false);
  const [instanceName, setInstanceName] = useState("");
  const [showTags, setShowTags] = useState(null);
  const [screenAssignName, setScreenAssignName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectdata, setSelectData] = useState({});
  const [addScreenModal, setAddScreenModal] = useState(false);
  const [screenSelected, setScreenSelected] = useState([]);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);

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

  const FetchData = () => {
    setLoading(true);
    axios
      .get(GET_ALL_DIGITAL_MENU, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        setInstanceData(response?.data?.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  const handleUpdateTagsDitigitalMenu = (tags) => {

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ADD_TAGS_DIGITAL_MENU}?DigitalMenuAppId=${updateDigitalMenuTag?.digitalMenuAppId}&Tags=${tags?.length === 0 ? "" : tags}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          const updatedData = instanceData.map((item) => {
            if (item?.digitalMenuAppId === updateDigitalMenuTag?.digitalMenuAppId) {
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

  const handleSelectAll = () => {
    const updatedInstance = instanceData.map((instance) => ({
      ...instance,
      isChecked: !selectAll,
    }));
    setInstanceData(updatedInstance);
    setSelectAll(!selectAll);
  };

  const handelDeleteAllInstance = () => {

    let arr = [];
    instanceData?.map((item) => {
      arr?.push(item?.digitalMenuAppId)
    })
    if (!window.confirm("Are you sure?")) return;
    toast.loading("Deleting...");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${DELETE_DIGITAL_MENU}?DigitalMenuAppIds=${arr?.join(",")}`,
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

  const handleCheckboxChange = (instanceId) => {
    const updatedInstance = instanceData.map((instance) =>
      instance.digitalMenuAppId === instanceId
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

  const handleAppDropDownClick = (id) => {
    if (appDropDown === id) {
      setAppDropDown(null);
    } else {
      setAppDropDown(id);
    }
  };

  const handelDeleteInstance = (scrollId, maciDs) => {
    if (!window.confirm("Are you sure?")) return;

    toast.loading("Deleting...");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${DELETE_DIGITAL_MENU}?DigitalMenuAppIds=${scrollId}`,
      headers: {
        Authorization: authToken,
      },
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
        const updatedInstanceData = instanceData.filter(
          (instanceData) => instanceData.digitalMenuAppId !== scrollId
        );
        setInstanceData(updatedInstanceData);
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handleFetchDigitalMenuById = (id, showpopup) => {
    let config = {
      method: "get",
      url: `${GET_DIGITAL_MENU_BY_ID}?DigitalMenuAppId=${id}`,
      headers: {
        Authorization: authToken,
      },
    };

    toast.loading("Fetching Data....");
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status === true) {
          const data = response?.data?.data;
          if (showpopup) {
            setInstanceView(true);
          }
          setInstanceName(data?.appName);
          setScreenAssignName(data?.screens);
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
  const handleUpdateScreenAssign = (screenIds, macids) => {
    let arr = [];
    for (const key in screenIds) {
      if (screenIds[key] === true) {
        arr?.push(key)
      }
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ASSIGN_SCREEN_DIGITAL_MENU}?DigitalMenuAppId=${selectdata?.digitalMenuAppId}&ScreenID=${arr?.join(",")}`,
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

        }
      })
      .catch((error) => {
        toast.remove();
        console.log(error);
      });
  };


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
                      <Link to="/digital-menu-detail">
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
                        Digital Menu Board
                      </h1>
                      <div className="flex items-center">
                        {/*<button className="w-8 h-8 ml-2 border-primary items-center border-2 rounded-full p-1 text-xl  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                          <BsInfoLg />
                    </button>*/}
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
                            key={instance.digitalMenuAppId}
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
                                        instance.digitalMenuAppId
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
                                              instance.digitalMenuAppId
                                            )
                                          }
                                        />
                                      </button>
                                    )}
                                  {appDropDown === instance.digitalMenuAppId && (
                                    <div className="appdw" ref={appDropdownRef}>
                                      <ul className="space-y-2">
                                        {permissions.isSave && (
                                          <div>
                                            <li
                                              onClick={() => {
                                                navigate(
                                                  `/digital-menu-detail/${instance?.digitalMenuAppId}`
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
                                                instance.digitalMenuAppId,
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
                                    handleFetchDigitalMenuById(
                                      instance?.digitalMenuAppId,
                                      true
                                    )
                                  }
                                >
                                  <img
                                    src={digitalMenuLogo}
                                    alt="Logo"
                                    className="mx-auto h-30 w-30"
                                  />
                                  <h4 className="text-lg font-medium mt-3">
                                    {instance.appName}
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
                                    setUpdateDigitalMenuTag(instance);
                                  }}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  Add tags +
                                </h4>
                              </div>
                            </div>
                          </div>
                        ))}
                        {showTagModal && (
                          <AddOrEditTagPopup
                            setShowTagModal={setShowTagModal}
                            tags={tags}
                            setTags={setTags}
                            handleUpdateTagsDitigitalMenu={
                              handleUpdateTagsDitigitalMenu
                            }
                            from="digitalMenu"
                            setUpdateDigitalMenuTag={
                              setUpdateDigitalMenuTag
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
                                      <img src={digitalMenuLogo} className="w-10" />
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
                                <div className="bg-black flex justify-center items-center md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 flex items-center">
                                  <img src={Digital_Menu} />
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
                      <p>No Digital Menu Board data available.</p>
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
  )
}

export default DigitalMenuBoard
