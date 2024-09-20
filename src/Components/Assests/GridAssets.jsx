import React, { useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "../../Styles/assest.css";
import { FiDownload, FiUpload } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CgMoveRight } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { HiDocumentDuplicate, HiDotsVertical } from "react-icons/hi";
import {
  ALL_FILES_UPLOAD,
  CREATE_NEW_FOLDER,
  MOVE_TO_FOLDER,
  SELECT_BY_ASSET_ID,
} from "../../Pages/Api";
import { FcOpenedFolder } from "react-icons/fc";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  handelDeletedataAssets,
  handelMoveDataToFolder,
  handleCheckFolderImage,
  handleDeleteFolder,
  resetStatus,
} from "../../Redux/Assetslice";

const GridAssets = ({ activeTab, setScreenAssetID, folderElements, tabsDelete, handleCheckboxChange, selectAll, handleSelectAll, sidebarOpen, store, loadFist, setLoadFist, permissions, setAddScreenModal, setShowImageAssetModal, setImageAssetModal, setSelectScreenModal, setFolderDisable, setPreviewDoc, setSelectDoc }) => {
  GridAssets.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const dispatch = useDispatch();
  const history = useNavigate();
  const videoRef = useRef(null);
  const actionBoxRef = useRef(null);
  const { token, user, userDetails } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [isInView, setIsInView] = useState(false);
  const [isMoveToOpen, setIsMoveToOpen] = useState(false);
  const [assetsdw2, setassetsdw2] = useState(null);
  const [selectedItems, setSelectedItems] = useState();
  const [folderName, setFolderName] = useState("");
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(videoRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef?.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef?.current);
      }
    };
  }, [videoRef]);


  const updateassetsdw2 = (item) => {
    setScreenAssetID(item.assetID);
    if (assetsdw2 === item) {
      setassetsdw2(null);
    } else {
      setassetsdw2(item);
    }
    setIsMoveToOpen(false);
  };

  const handleKeyDown = (e, folderID) => {
    if (e.key === "Enter") {
      saveFolderName(folderID, folderName.trim());
      setLoadFist(true);
    } else if (e.key === "Escape") {
      setEditMode(null);
    }
  };

  const updateFolderNameInAPI = async (folderID, newName) => {
    if (!newName.replace(/\s/g, "").length) {
      toast.remove();
      return toast.error("Please enter a character");
    }
    try {
      const formData = new FormData();
      formData.append("folderID", folderID);
      formData.append("operation", "Update");
      formData.append("folderName", newName);

      const response = await axios.post(CREATE_NEW_FOLDER, formData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });
      setLoadFist(true);
      setEditMode(null);
    } catch (error) {
      console.error("Error updating folder name:", error);
      setEditMode(null);
    }
  };

  const saveFolderName = (folderID, newName) => {
    updateFolderNameInAPI(folderID, newName);
  };

  const toggleMoveTo = () => {
    setIsMoveToOpen(!isMoveToOpen);
  };

  const handleMoveTo = (folderId) => {
    moveDataToFolder(
      selectedItems?.assetID,
      folderId,
      selectedItems?.assetType
    );
    setLoadFist(true);
  };

  // dragdrop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, itemId, item) => {
    event.dataTransfer.setData("text/plain", itemId);
    setSelectedItems(item);
  };

  // Function to handle drop into folder
  const handleDrop = (event, folderId) => {
    const itemId = event.dataTransfer.getData("text/plain");
    let asset_type = selectedItems.assetType == "Folder" ? "Folder" : "Image";
    if (
      Number(itemId) !== folderId ||
      (Number(itemId) === folderId && asset_type !== "Folder")
    ) {
      moveDataToFolder(itemId, folderId, asset_type);
    }
  };

  const navigateToFolder = (folderId, selectedData) => {
    history(`/NewFolderDialog/${folderId}`, { selectedData });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionBoxRef.current &&
        !actionBoxRef.current.contains(event?.target)
      ) {
        setassetsdw2(null);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setassetsdw2(null);
  }


  useEffect(() => {
    if (store && store.status === "succeeded") {
      // toast.success(store.message);
      setLoadFist(true);
      setFolderDisable(false);
      dispatch(resetStatus());
    }

    if (store && store.status === "failed") {
      toast.error(store.error); // Assuming you store the error message in the error property
    }
  }, [store]);


  const checkFolderImage = async (assetId) => {
    try {
      setLoadFist(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${SELECT_BY_ASSET_ID}?Id=${assetId}&AssetType=Image`,
        headers: { Authorization: authToken },
      };
      const response = await dispatch(handleCheckFolderImage({ config }));
      return response.payload;
    } catch (error) {
      // Handle errors if needed
      console.error("Error in checkFolderImage:", error);
      throw error; // Rethrow the error to handle it outside this function
    }
  };

  const checkFolder = async (assetId) => {
    try {
      setLoadFist(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${SELECT_BY_ASSET_ID}?Id=${assetId}&AssetType=Folder`,
        headers: { Authorization: authToken },
      };
      const response = await dispatch(handleCheckFolderImage({ config }));

      return response.payload;
    } catch (error) {
      console.error("Error in checkFolderImage:", error);
      throw error; // Rethrow the error to handle it outside this function
    }
  };


  const deleteFolder = async (folderID) => {
    try {
      const checkImage = await checkFolder(folderID);
      const dataPayload = { folderID: folderID, operation: "Delete" };
      const config2 = {
        method: "post",
        maxBodyLength: Infinity,
        url: CREATE_NEW_FOLDER,
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        data: dataPayload,
      };
      toast.loading("please wait....");
      if (checkImage.status) {
        Swal.fire({
          title: "Delete Confirmation",
          text: checkImage.message,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "No, cancel",
          confirmButtonText: "Yes, Im sure",
          customClass: {
            text: "swal-text-bold",
            content: "swal-text-color",
            confirmButton: "swal-confirm-button-color", // Apply custom color and style
          },
          confirmButtonColor: "#ff0000",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await dispatch(handleDeleteFolder({ config2 }));
          } else {
            setLoadFist(true); // Trigger your action on cancel
          }
        });
      } else {
        await dispatch(handleDeleteFolder({ config2 }));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadFist(true);
    }
  };

  const handleWarning = async (assetId) => {
    try {
      const checkImage = await checkFolderImage(assetId);
      const formData = new FormData();
      formData.append("AssetID", assetId);
      formData.append("Operation", "Delete");
      formData.append("IsActive", "true");
      formData.append("IsDelete", "true");
      formData.append("FolderID", "0");
      formData.append("UserID", "0");
      formData.append("AssetType", "Image");
      formData.append("IsDeleteFromALL", checkImage.data);
      formData.append("DeleteDate", new Date().toISOString().split("T")[0]);

      const config2 = {
        method: "post",
        maxBodyLength: Infinity,
        url: ALL_FILES_UPLOAD,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: authToken,
        },
        data: formData,
      };

      if (checkImage.data) {
        Swal.fire({
          title: "Delete Confirmation",
          text: checkImage.message,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "No, cancel",
          confirmButtonText: "Yes, I'm sure",
          customClass: {
            text: "swal-text-bold",
            content: "swal-text-color",
            confirmButton: "swal-confirm-button-color",
          },
          confirmButtonColor: "#ff0000",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await dispatch(handelDeletedataAssets(config2));
          } else {
            setLoadFist(true); // Trigger your action on cancel
          }
        });
      } else {
        const config2 = {
          method: "post",
          maxBodyLength: Infinity,
          url: ALL_FILES_UPLOAD,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: authToken,
          },
          data: formData,
        };
        await dispatch(handelDeletedataAssets(config2));
      }
    } catch (error) {
      console.error("Error in handleWarning:", error);
    }
  };

  const moveTo = (item) => {
    toggleMoveTo();
    setSelectedItems(item);
  };

  const moveDataToFolder = async (dataId, folderId, assetType) => {
    let data = JSON.stringify({
      folderID: folderId,
      assetID: dataId,
      type: assetType === "Folder" ? "Folder" : "Image",
      operation: "Insert",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: MOVE_TO_FOLDER,
      headers: { Authorization: authToken, "Content-Type": "application/json" },
      data: data,
    };

    try {
      await dispatch(handelMoveDataToFolder(config));
    } catch (error) {
      toast.remove();
      console.error(error);
    } finally {
      setIsMoveToOpen(false);
    }
  };

  return (
    <>
      <div className={`mt-10 `}>
        <div className="relative shadow-md sm:rounded-lg p-4 overflow-x-scroll sc-scrollbar">
          <table
            cellPadding={15}
            className="screen-table w-full text-sm lg:table-auto text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="items-center border-b border-b-[#E4E6FF] bg-gray-50 table-head-bg">
                {store.data?.length > 0 && (
                  <>
                    {permissions.isDelete && (
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                    )}
                  </>
                )}
                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                  Preview
                </th>
                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                  Name
                </th>

                {activeTab === "ALL" && (
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Duration
                  </th>
                )}

                {activeTab === "VIDEO" && (
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Duration
                  </th>
                )}

                {activeTab !== "FOLDER" && (
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Resolution
                  </th>
                )}

                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                  Type
                </th>
                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                  Size
                </th>
                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                  Action
                </th>
              </tr>
            </thead>
            {!loadFist && store && store.data && store.data.length > 0 ? (
              <tbody>
                {store.data.map((item, index) => (
                  <tr
                    key={index}
                    className="mt-7 hover:bg-gray-50 dark:hover:bg-gray-600 bg-white rounded-lg border border-gray-200 dark:border-gray-700 shadow font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, item.assetID, item)
                    }
                  >
                    {permissions.isDelete && (
                      <td className="text-left gap-4">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-[15px] h-[15px] relative"
                            checked={tabsDelete?.selectedIds?.includes(item.assetID)}
                            onChange={() =>
                              handleCheckboxChange(item.assetID)
                            }
                          />
                        </div>
                      </td>
                    )}
                    <td className="text-left">
                      {item.assetType === "Folder" && (
                        <div
                          onDragOver={(event) =>
                            handleDragOver(event)
                          }
                          onDrop={(event) =>
                            handleDrop(event, item.assetID)
                          }
                          className="text-center relative list-none rounded-md flex justify-center items-center flex-col h-full "
                        >
                          <FcOpenedFolder
                            className="text-8xl text-center mx-auto"
                            onClick={() =>
                              navigateToFolder(item.assetID)
                            }
                          />
                          {editMode === item.assetID ? (
                            <input
                              type="text"
                              value={folderName}
                              className="w-full"
                              onChange={(e) =>
                                setFolderName(e.target.value)
                              }
                              onBlur={() => {
                                setEditMode(null);
                              }}
                              onKeyDown={(e) =>
                                handleKeyDown(
                                  e,
                                  item.assetID,
                                  index
                                )
                              }
                              autoFocus
                            />
                          ) : (
                            <span
                              onClick={() => {
                                setEditMode(item?.assetID);
                                setFolderName(item?.assetName);
                              }}
                              className="cursor-pointer w-full flex-wrap break-all inline-flex justify-center"
                            >
                              {item.assetName}
                            </span>
                          )}
                        </div>
                      )}

                      {item.assetType === "Image" && (
                        <div className="img-cover ivratio img-cover-ratio text-center">
                          <div>
                            <img
                              src={item.assetFolderPath}
                              alt={item.assetName}
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {item.assetType === "Video" && (
                        <div className="img-cover ivratio img-cover-ratio">
                          <div>
                            <video
                              ref={videoRef}
                              controls
                              autoPlay={isInView}

                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            >
                              <source
                                src={item.assetFolderPath}
                                type="video/mp4"
                              />

                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </div>
                      )}

                      {item.assetType === "OnlineImage" && (
                        <div className="img-cover ivratio img-cover-ratio text-center">
                          <div>
                            <img
                              src={item.assetFolderPath}
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {item.assetType === "OnlineVideo" && (
                        <div className="img-cover ivratio img-cover-ratio">
                          <div>
                            <video
                              controls
                              onClick={() => {
                                setShowImageAssetModal(true);
                                setImageAssetModal(item);
                              }}
                            >
                              <source
                                src={item.assetFolderPath}
                                type="video/mp4"
                              />
                              Your browser does not support the
                              video tag.
                            </video>
                          </div>
                        </div>
                      )}

                      {item.assetType === "DOC" && (
                        <div
                          className="items-center flex justify-center cursor-pointer"
                          onClick={() => {
                            setPreviewDoc(true);
                            setSelectDoc(item);
                          }}
                        >
                          <HiDocumentDuplicate className=" text-primary text-4xl my-5 " />
                        </div>
                      )}
                    </td>

                    <td className="text-center break-words">
                      {item.assetName}
                    </td>

                    {activeTab === "ALL" && (
                      <td className="text-center">
                        {item.durations}
                      </td>
                    )}

                    {activeTab === "VIDEO" && (
                      <td className="text-center">
                        {item.durations}
                      </td>
                    )}
                    {activeTab !== "FOLDER" && (
                      <td className="text-center">
                        {item.resolutions}
                      </td>
                    )}

                    <td className=" break-all max-w-sm text-center">
                      {item.assetType}
                    </td>
                    <td className="text-center">{item.fileSize}</td>

                    <td className="text-center relative">
                      <div className="relative">
                        {permissions.isSave &&
                          permissions.isDelete && (
                            <button
                              onClick={() => updateassetsdw2(item)}
                              className="ml-3 relative"
                            >
                              <HiDotsVertical />
                            </button>
                          )}
                        {assetsdw2 === item && (
                          <div
                            ref={actionBoxRef}
                            className="scheduleAction z-[9999]  "
                          >
                            <ul className="space-y-2">
                              {item.assetType !== "Folder" && (
                                <div>
                                  {permissions.isView && (
                                    <li className="flex text-sm items-center">
                                      <FiDownload className="mr-2 text-lg" />
                                      <a
                                        href={item.assetFolderPath}
                                        target="_blank"
                                        download
                                      >
                                        Download
                                      </a>
                                    </li>
                                  )}
                                </div>
                              )}
                              {item.assetType !== "Folder" && (
                                <li className="flex text-sm items-center">
                                  {permissions.isSave && (
                                    <div className="move-to-button relative">
                                      <button
                                        className="flex relative w-full"
                                        onClick={() => {
                                          setAddScreenModal(true);
                                        }}
                                      >
                                        <FiUpload className="mr-2 text-lg" />
                                        Set to Screen
                                      </button>
                                    </div>
                                  )}
                                </li>
                              )}

                              <li className="flex text-sm items-center relative">
                                <div className="move-to-button relative">
                                  {permissions.isSave && (
                                    <button
                                      onClick={() => moveTo(item)}
                                      className="flex relative w-full"
                                    >
                                      <CgMoveRight className="mr-2 text-lg" />
                                      Move to
                                    </button>
                                  )}
                                  {isMoveToOpen && (
                                    <div className="move-to-dropdown">
                                      <ul className="space-y-3">
                                        {folderElements &&
                                          folderElements?.length >
                                          0 ? (
                                          folderElements?.map(
                                            (folder) => {
                                              return (
                                                <li
                                                  key={
                                                    folder.assetID
                                                  }
                                                  className="hover:bg-black hover:text-white text-left"
                                                >
                                                  <>
                                                    <button
                                                      className="break-words w-32"
                                                      onClick={() =>
                                                        handleMoveTo(folder.assetID)
                                                      }
                                                    >
                                                      {folder.assetName}
                                                    </button>
                                                  </>
                                                </li>
                                              );
                                            }
                                          )
                                        ) : (
                                          <li className="w-full">No folders, create a new  folder.</li>
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </li>
                              {item.assetType === "Folder" ? (
                                <li>
                                  {permissions?.isDelete && (
                                    <button
                                      onClick={() => {
                                        deleteFolder(item.assetID);
                                      }}
                                      className="flex text-sm items-center"
                                    >
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Move to Trash
                                    </button>
                                  )}
                                </li>
                              ) : (
                                <li>
                                  {permissions?.isDelete && (
                                    <button
                                      onClick={() => {
                                        handleWarning(item.assetID);
                                      }}
                                      className="flex text-sm items-center"
                                    >
                                      <RiDeleteBin5Line className="mr-2 text-lg" />
                                      Move to Trash
                                    </button>
                                  )}
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr className="text-center font-semibold text-2xl col-span-full">
                <td colSpan={8} className="text-center">
                  {!loadFist && store?.data?.length === 0 && (
                    <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2">
                      No Data Available
                    </span>
                  )}
                  {loadFist && (
                    <>
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
                    </>
                  )}
                </td>
              </tr>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default GridAssets;
