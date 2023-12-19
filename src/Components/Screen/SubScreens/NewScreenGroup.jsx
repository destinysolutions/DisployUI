import React, {useEffect, useState } from "react";
import "../../../Styles/sidebar.css";
import "../../../Styles/screen.css";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { TbUpload } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuMonitor } from "react-icons/lu";
import { TbArrowBarRight } from "react-icons/tb";
import { MdOutlineModeEdit } from "react-icons/md";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { IoMdRefresh } from "react-icons/io";
import { TbScanEye } from "react-icons/tb";
import PropTypes from "prop-types";
import Footer from "../../Footer";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { SELECT_ALL_SCREENGROUP } from "../../../Pages/Api";
import axios from "axios";
import { Tooltip } from "@material-tailwind/react";
import ScreenGroupModal from "./ScreenGroupModal";
import ShowAssetModal from "./model/ShowGroupAssetModal";
import { useDispatch, useSelector } from "react-redux";
import {handleGetScreen,} from "../../../Redux/Screenslice";
  import { handleGetAllAssets } from "../../../Redux/Assetslice";
  import { handleGetAllSchedule } from "../../../Redux/ScheduleSlice";
  import { handleGetCompositions } from "../../../Redux/CompositionSlice";
  import { handleGetTextScrollData, handleGetYoutubeData} from "../../../Redux/AppsSlice";


const NewScreenGroup = ({ sidebarOpen, setSidebarOpen }) => {

const { user, token } = useSelector((state) => state.root.auth);
const authToken = `Bearer ${token}`;
const dispatch = useDispatch();

  NewScreenGroup.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const [loadFirst, setLoadFirst] = useState(true);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

//   Model
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [selectedComposition, setSelectedComposition] = useState({ compositionName: "" });
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [selectedTextScroll, setSelectedTextScroll] = useState();
  const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });
  const [assetPreview, setAssetPreview] = useState("");
  const [selectedYoutube, setSelectedYoutube] = useState();
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);



  useEffect(() => {
    // const query = { ID : user.userID, sort: sortOrder, col: sortColumn };
    if (loadFirst) {
      console.log(" ---- loadFirst --- ");
      setLoadFirst(false);
    }

  }, [loadFirst]);


    // fetch all data
    useEffect(() => {
        if (user && loadFirst) {
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
    
          // get screens
          const response = dispatch(handleGetScreen({ token }));
          if (response) {
            response.then((res) => {
              if (res?.payload?.status === 200) {
                const fetchedData = res?.payload.data;
                const initialCheckboxes = {};
                if (Array.isArray(fetchedData)) {
                  fetchedData.forEach((screen) => {
                    initialCheckboxes[screen.screenID] = false;
                  }); 
                  setScreenCheckboxes(initialCheckboxes);
                }
              }
            });
          }
        }
        setLoadFirst(false);
      },[user,loadFirst]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMouseOver = () => {
    if (openAccordionIndex !== null) {
      setIsHovering(true);
    }
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleAccordionClick = (index) => {
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleRefres = () => {
    setLoadFirst(true)
  };

  const handleDeleteGroup = (id) => {
    console.log("---- loadFirst ---- Id --- Delete Group ---- ",id);
    setLoadFirst(true)
  };


  // Model Function

  const handleAssetAdd = (asset) => {
    console.log(" get image ---- >",asset);
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const handleAppsAdd = (apps) => {
    console.log(" get apps ---- >",apps); 
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

  const handleSave = () =>{
    console.log("------------------------------------  End of call function    ------------------");
  }

  const DataGroup = [
    {
      id: 1,
      name: "Test 1",
      arrayGroup: [
        {
          id: 1,
          screen: " Fist ",
          status: 0,
          last_seen: " Today ",
          current_Schedule: "Today",
        },
        {
          id: 2,
          screen: " Secound ",
          status: 1,
          last_seen: " Today ",
          current_Schedule: "Today",
        },
      ],
    },

    {
      id: 2,
      name: "Test 2",
      arrayGroup: [
        {
          id: 1,
          screen: " Secound",
          status: 1,
          last_seen: " Today ",
          current_Schedule: "Today",
        },
        {
          id: 2,
          screen: " For ",
          status: 0,
          last_seen: " Today ",
          current_Schedule: "Today",
        },
      ],
    },
  ];

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
            <div className="flex items-center sm:mt-3 flex-wrap">
              <Tooltip
                content="Refresh Screen"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                  onClick={() => handleRefres()}
                >
                  <IoMdRefresh className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>
              <Tooltip
                content="Screen Group"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                  onClick={() => setIsModalOpen(true)}
                >
                  <HiOutlineRectangleGroup className="p-1 px-2 text-4xl text-white hover:text-white" />
                </button>
              </Tooltip>

              {isModalOpen && (
                <ScreenGroupModal isOpen={isModalOpen} onClose={closeModal} />
              )}

              <Tooltip
                content="Select All ScreenGroup"
                placement="bottom-end"
                className=" bg-SlateBlue text-white z-10 ml-5"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 1, y: 10 },
                }}
              >
                <button
                  type="button"
                  className="flex align-middle border-white bg-SlateBlue text-white items-center border-2 rounded-full p-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                >
                  <input type="checkbox" className="w-6 h-5" />
                </button>
              </Tooltip>
            </div>
          </div>

          {DataGroup && DataGroup.length  && DataGroup.map((item,i)=>{ 
            const isAccordionOpen = openAccordionIndex === i;
            return (
              <div key={i} className="accordions mt-5">
                <div
                  className="section shadow-md p-5 rounded-md bg-white  lg:flex md:flex  sm:block items-center justify-between"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <h1 className="text-lg">{item.name}</h1>
                  <div className="flex items-center">
                    <div className=" flex items-center">
                      {isAccordionOpen && (
                        <>
                          <button className="bg-lightgray py-2 px-2 text-sm rounded-md mr-2 hover:bg-primary hover:text-white">
                            Preview
                          </button>
                          <button
                            className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                            onClick={() => setShowAssetModal(true)}
                          >
                            <TbUpload className="text-3xl p-1 hover:text-white" />
                          </button>
                          <button className="border rounded-full bg-red text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg">
                            <RiDeleteBin5Line
                              className="text-3xl p-1 hover:text-white"
                              onClick={() => handleDeleteGroup(item)}
                            />
                          </button>
                        </>
                      )}

                      <button>
                        <input type="checkbox" className=" mx-1 w-6 h-5 mt-2" />
                      </button>

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
                  <div className="overflow-x-auto">
                    <table
                      className="mt-9 w-full sm:mt-3 lg:table-fixed md:table-auto sm:table-auto xs:table-auto bg-white merged-table"
                      cellPadding={20}
                    >
                      <thead>
                        <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" flex  items-center justify-center px-6 py-2">
                              Screen
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" flex  items-center justify-center mx-auto px-6 py-2">
                              Status
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" flex  items-center justify-center mx-auto px-6 py-2">
                              Last Seen
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" flex  items-center justify-center mx-auto px-6 py-2">
                              Now Playing
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" px-6 py-2 flex  items-center justify-center mx-auto">
                              Current Schedule
                            </button>
                          </th>
                          <th className="text-[#444] text-sm font-semibold p-2">
                            <button className=" px-6 py-2 flex  items-center justify-center mx-auto">
                              Tags
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isAccordionOpen &&
                          item &&
                          item.arrayGroup.length &&
                          item.arrayGroup.map((groupItem, index) => {
                            return (
                              <tr
                                key={index}
                                className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2"
                              >
                                <td className="flex items-center ">
                                  <input type="checkbox" className="mr-3" />
                                  {groupItem.screen}
                                </td>
                                <td className="p-2 text-center">
                                  {groupItem.status === 0 ? (
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
                                  {" "}
                                  {groupItem.last_seen}
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => setShowAssetModal(true)}
                                    className="flex  items-center border-gray bg-lightgray border rounded-full lg:px-3 sm:px-1 xs:px-1 py-2  lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                  >
                                    Asset Name
                                    <AiOutlineCloudUpload className="ml-2 text-lg" />
                                  </button>

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
                                      handleSave={handleSave}  // save end of the call function confim 
                                    />
                                  )}
                                </td>
                                <td className="break-words	w-[150px] p-2 text-center">
                                  {groupItem.current_Schedule}
                                </td>
                                <td className="p-2 text-center">Tags, Tags</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewScreenGroup;
