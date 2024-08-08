import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineCloudUpload, AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SelectByUserScreen } from "../../../../Redux/ScreenGroupSlice";
import { SELECT_BY_USER_SCREENDETAIL } from "../../../../Pages/Api";
import ReactTooltip from "react-tooltip";
import { HiUserGroup } from "react-icons/hi2";
import moment from "moment";
import toast from "react-hot-toast";
import { PageNumber } from "../../../Common/Common";


const ScreenMergeModal = ({
  label,
  onClose,
  handleSaveNew,
  editSelectedScreen,
  updateScreen,
  isOpen,
  sidebarOpen,
}) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.root.screenGroup.screenData);

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [loadFirst, setLoadFirst] = useState(true);
  const [selectedItems, setSelectedItems] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [searchScreen, setSearchScreen] = useState("");

  useEffect(() => {
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
    if (field !== null) {
      sortedData.sort((a, b) => {
        if (order === "asc") {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
      return sortedData;
    } else {
      return data
    }
  };

  const sortedAndPaginatedData = sortData(
    filteredData,
    sortedField,
    sortOrder
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCheckboxChange = (screenID) => {
    if (selectedItems === screenID) {
      setSelectedItems(null);
    } else {
      setSelectedItems(screenID);
    }
  };

  const handleSaveScreen = async () => {
    if (selectedItems === null) {
      toast.error("Please Select Screen");
      return;
    }
    const getName = sortedAndPaginatedData?.find(
      (item) => item.screenID === selectedItems
    );
    const payLoad = {
      screenID: selectedItems,
      screenName: getName.screenName,
      screenStatus: getName.screenStatus,
      macid: getName?.macid,
      tags: getName.tags,
    };
    await handleSaveNew(payLoad);
    setSelectedItems();
    onClose();
  };


  const handleScreenSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchScreen(searchQuery);
  };

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="modal-overlay">
          <div className="modal">
            <div className="relative p-4 lg:w-[1000px] md:w-[900px] sm:w-full max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Select Screens
                  </h3>
                  <AiOutlineCloseCircle
                    className="text-4xl text-primary cursor-pointer"
                    onClick={() => {
                      onClose();
                    }}
                  />
                </div>

                <div className="flex mt-3 justify-end mr-2">
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
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg screen-section">
                  <div className="schedual-table bg-white rounded-xl mt-5 px-3">
                    <div className="relative overflow-x-auto sc-scrollbar rounded-lg">
                      <table
                        className="screen-table min-w-full leading-normal text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed"
                        cellPadding={15}
                      >
                        <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg screen-table-th">
                            <th
                              scope="col"
                              className="text-[#5A5881] text-sm font-semibold p-2 pl-5"
                            >
                              <div className="text-left">Screen</div>
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
                                onClick={() => handleCheckboxChange(screen.screenID)}
                                className="mt-7 bg-white rounded-lg cursor-pointer font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2"
                              >
                                <td className="text-left">
                                  <div className="text-left">
                                    <input
                                      type="checkbox"
                                      className="mr-3"
                                      checked={selectedItems === screen.screenID}
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
                                    className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
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
                                  {screen.scheduleName === ""
                                    ? ""
                                    : `${screen.scheduleName} Till ${moment(
                                      screen.endDate
                                    ).format("YYYY-MM-DD hh:mm")}`}

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
                              <td colSpan={8}>
                                <div className="flex text-center m-5 justify-center">
                                  <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                    No Data Available
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                      <div className="flex items-center">
                        <span className="text-gray-500">{`Total ${store?.data?.length} Screens`}</span>
                      </div>
                      <div className="flex justify-end">
                        <select className='px-1 mr-2 border border-gray rounded-lg'
                          value={itemsPerPage}
                          onChange={(e) => setItemsPerPage(e.target.value)}
                        >
                          {PageNumber.map((x) => (
                            <option value={x}>{x}</option>
                          ))}
                        </select>
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
                          disabled={(currentPage === totalPages) || (store?.data?.length === 0)}
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

                    {/* Modal footer */}
                    <div className="flex gap-5 items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 justify-center">
                      <button
                        className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                        type="submit"
                        onClick={handleSaveScreen}
                      >
                        {label}
                      </button>
                      <button
                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        type="button"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenMergeModal;
