import React, { useEffect, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SelectByUserScreen } from "../../../Redux/ScreenGroupSlice";
import { SELECT_BY_USER_SCREENDETAIL } from "../../../Pages/Api";
import moment from "moment";
import { HiUserGroup } from "react-icons/hi2";
import { Tooltip } from "@material-tailwind/react";
import ReactTooltip from "react-tooltip";
import { socket } from "../../../App";

const ScreenGroupModal = ({
  label,
  onClose,
  handleSaveNew,
  editSelectedScreen,
  updateScreen,
  sidebarOpen,
}) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.root.screenGroup.screenData);

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [loadFirst, setLoadFirst] = useState(true);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  // const [screenData, setScreenData] = useState([ ]);

  const [screenGroupName, setScreenGroupName] = useState("");
  const [screenGroupNameError, setScreenGroupNameError] = useState(""); // Name validationError check
  const [searchScreen, setSearchScreen] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  useEffect(() => {
    // const query = { ID : user.userID, sort: sortOrder, col: sortColumn };
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`,
      headers: {
        Authorization: authToken,
      },
    };

    if (loadFirst) {
      dispatch(SelectByUserScreen({ config }));
      setLoadFirst(false);
    }
  }, [dispatch, loadFirst, store]);
  const filteredData = Array.isArray(store.data)
    ? store.data?.filter((item) =>
        item?.screenName?.toLowerCase()?.includes(searchScreen?.toLowerCase())
      )
    : [];

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  const handleScreenGroupNameChange = (e) => {
    const value = e.target.value;
    setScreenGroupName(value);
    // Validate screenGroupName on change
    if (!value.trim()) {
      setScreenGroupNameError("Screen Group Name is required");
    } else {
      setScreenGroupNameError("");
    }
  };

  const handleCheckboxChange = (screenID) => {
    const updatedSelection = [...selectedItems];
    const index = updatedSelection.indexOf(screenID);

    if (index === -1) {
      updatedSelection.push(screenID);
    } else {
      updatedSelection.splice(index, 1);
    }

    setSelectedItems(updatedSelection);
  };

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);

    if (!selectAllChecked) {
      const allScreenIDs = store.data.map((screen) => screen.screenID);
      setSelectedItems(allScreenIDs);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSaveScreen = async () => {
    // Validate screenGroupName before saving
    if (!screenGroupName.trim()) {
      setScreenGroupNameError("Screen Group Name is required");
      return; // Do not proceed with saving if validation fails
    }
    const payLoad = {
      screenGroupName: screenGroupName,
      screenGroupLists: selectedItems.map((itemID) => ({
        screenGroupListID: 0,
        groupID: 0,
        userID: 0,
        mode: "Save",
        screenID: itemID,
      })),
      userID: 0,
    };
    let allMacID = [];
    store?.data?.map((item) => {
      if (selectedItems?.includes(item?.screenID)) {
        allMacID.push(item?.macid);
      }
    });
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: allMacID?.join(","),
    };
    if (editSelectedScreen && editSelectedScreen.screenGroupID) {
      payLoad.screenGroupID = editSelectedScreen.screenGroupID;
      await updateScreen(payLoad);
      socket.emit("ScreenConnected", Params);
    } else {
      payLoad.screenGroupID = 0;
      await handleSaveNew(payLoad);
      // socket.emit("ScreenConnected", Params);
    }
    onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode === "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode === 27) {
        onClose();
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  useEffect(() => {
    if (editSelectedScreen) {
      setScreenGroupName(editSelectedScreen.screenGroupName || "");
      const selectedScreenIDs = editSelectedScreen.screenGroupLists?.map(
        (group) => group.screenID
      );
      const selectedScreens = store?.data?.filter((screen) =>
        selectedScreenIDs.includes(screen.screenID)
      );
      const selectedItemsIDs = selectedScreens?.map(
        (screen) => screen.screenID
      );
      setSelectedItems(selectedItemsIDs || []);
    }
  }, [editSelectedScreen, store]);

  const handleScreenSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchScreen(searchQuery);
  };

  return (
    <div>
      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
              <div className="flex items-center">
                <div className=" mt-1.5">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={selectAllChecked}
                    onChange={handleSelectAllChange}
                  />
                </div>
                <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium ml-3">
                  All Select 
                </h3>
              </div>
              <button className="p-1 text-xl" onClick={onClose}>
                <AiOutlineCloseCircle className="text-3xl" />
              </button>
            </div>

            <div className="p-2">
              <label
                for="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Screen Group Name *
              </label>
            </div>
            <div className="flex lg:justify-end lg:flex-row md:flex-row md:justify-end sm:flex-col flex-col gap-4 px-3">
              <input
                type="name"
                name="name"
                id="name"
                onChange={handleScreenGroupNameChange}
                value={screenGroupName}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                placeholder="Enter Screen Group Name"
              />
              {screenGroupNameError && (
                <p className="text-red-500 text-sm mt-1 error">
                  {screenGroupNameError}
                </p>
              )}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search Screen" //location ,screen, tag
                  className="border border-primary rounded-full px-7 pl-10 py-2 search-user sm:w-64 xs:w-64"
                  value={searchScreen}
                  onChange={(e) => {
                    handleScreenSearch(e);
                  }}
                />
              </div>
            </div>

            <div className="p-2 relative overflow-x-auto shadow-md sm:rounded-lg col-span-2 sm:col-span-2 max-h-325 mt-4">
              <div className="relative overflow-x-auto sc-scrollbar rounded-lg shadow">
                <table
                  className="screen-table min-w-full leading-normal text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed"
                  cellPadding={15}
                >
                  <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg screen-table-th">
                      <th
                        scope="col"
                        className="text-[#5A5881] text-sm font-semibold p-2"
                      >
                        <div className="text-left px-5">Screen</div>
                      </th>

                      <th
                        scope="col"
                        className="text-[#5A5881] text-sm font-semibold p-2"
                      >
                        <div className="text-center">Google Location</div>
                      </th>

                      <th
                        scope="col"
                        className="text-[#5A5881] text-sm font-semibold p-2"
                      >
                        <div className="text-center">Status</div>
                      </th>

                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Last Seen
                      </th>

                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Now Playing
                      </th>

                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Current Schedule
                      </th>

                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Tags
                      </th>

                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Group Apply
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {store && sortedAndPaginatedData?.length > 0 ? (
                      sortedAndPaginatedData?.map((screen) => (
                        <tr
                          key={screen.screenID}
                          className="mt-7 bg-white rounded-lg font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                        >
                          <td>
                            <div className="text-left">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedItems.includes(
                                  screen.screenID
                                )}
                                onChange={() =>
                                  handleCheckboxChange(screen.screenID)
                                }
                              />
                              {screen.screenName}
                            </div>
                          </td>

                          <td className="text-center break-words">
                            {screen.googleLocation}
                          </td>

                          <td className="text-center">
                            <span
                              id={`changetvstatus${screen.macid}`}
                              className={`rounded-full px-6 py-2 text-white text-center ${
                                screen.screenStatus == 1
                                  ? "bg-[#3AB700]"
                                  : "bg-[#FF0000]"
                              }`}
                            >
                              {screen.screenStatus == 1 ? "Live" : "offline"}
                            </span>
                          </td>

                          <td className="p-2 text-center break-words">
                            {moment(screen?.updatedDate).format("LLL")}
                          </td>

                          <td
                            className="text-center "
                            style={{ wordBreak: "break-all" }}
                          >
                            <div className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-aut hover:shadow-primary-500/50">
                              <p className="line-clamp-1">{screen.assetName}</p>
                              <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                            </div>
                          </td>

                          <td className="text-center break-words">
                            {screen.scheduleName == ""
                              ? ""
                              : `${screen.scheduleName} Till
                      ${moment(screen.endDate).format("YYYY-MM-DD hh:mm")}`}
                          </td>

                          <td className="text-center break-words">
                            {screen.tags}
                          </td>

                          <td className="p-2 text-center  break-words">
                            {screen.isContainGroup === 1 && (
                              <button
                                data-tip
                                data-for="show in screen"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                <HiUserGroup />
                                <ReactTooltip
                                  id="show in screen"
                                  place="bottom"
                                  type="warning"
                                  effect="solid"
                                >
                                  <span>{screen.groupName}</span>
                                </ReactTooltip>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          {store && store.data?.length === 0 ? (
                            "No data found"
                          ) : (
                            <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2">
                              No Data Available
                            </span>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
              <div className="flex items-center">
                <span className="text-gray-500">{`Total ${store?.data?.length} Screen`}</span>
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
                  disabled={(currentPage === totalPages) || (store?.data?.length === 0)}
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

              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 justify-start">
                <button
                  data-modal-hide="static-modal"
                  type="button"
                  className="border-2 border-primary  rounded-lg ml-3 text-white bg-primary  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleSaveScreen}
                >
                  {label}
                </button>
                <button
                  data-modal-hide="static-modal"
                  type="button"
                  className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenGroupModal;
