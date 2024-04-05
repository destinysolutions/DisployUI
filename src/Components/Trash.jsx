import React, { Suspense, useEffect, useState } from "react";
import PropTypes, { array } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  All_DELETED_TRASH,
  GET_ALL_TRASHDATA,
  RESTORE_TRASH,
  SINGL_DELETED_TRASH,
} from "../Pages/Api";
import {
  handleGetTrash,
  handleTrash,
  handleTrashAll,
  handleTrashRestore,
} from "../Redux/Trash";
import toast, { CheckmarkIcon } from "react-hot-toast";
import moment from "moment";
import { CgFolder, CgYoutube } from "react-icons/cg";
import { HiDocument } from "react-icons/hi";
import { HiFolder, HiVideoCamera } from "react-icons/hi2";
import { FiImage } from "react-icons/fi";
import { MdDeleteForever, MdRestore } from "react-icons/md";
import Swal from "sweetalert2";
import { RiDeleteBin5Line } from "react-icons/ri";
import ReactTooltip from "react-tooltip";
import { getMenuAll, getMenuPermission } from "../Redux/SidebarSlice";
import Loading from "./Loading";

const Trash = ({ sidebarOpen, setSidebarOpen }) => {
  Trash.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [sidebarload, setSidebarLoad] = useState(true);
  const [loadFist, setLoadFist] = useState(true);
  // Use Redux state instead of local state
  const store = useSelector((state) => state.root.trashData);
  const [permissions, setPermissions] = useState({
    isDelete: false,
    isSave: false,
    isView: false,
  });
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectcheck, setSelectCheck] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = store.deletedData?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const [selectedItems, setSelectedItems] = useState([]); // Multipal check

  // Filter data based on search term
  const filteredData = store.deletedData?.filter((item) =>
    Object.values(item).some((value) => value && value.toString().toLowerCase())
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

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_TRASHDATA,
      headers: { Authorization: authToken },
    };

    if (loadFist) {
      // Fetch deleted data when the component mounts
      dispatch(handleGetTrash({ config }));
      setLoadFist(false);
    }

    if (
      store &&
      store.successMessage &&
      store.successMessage !== "DELETE" &&
      store.successMessage !== "RESTORE"
    ) {
      toast.success(store.successMessage);
      setLoadFist(true);
    }

    if (
      (store && store.successMessage && store.successMessage === "DELETE") ||
      store.successMessage === "RESTORE"
    ) {
      setLoadFist(true);
    }

    if (store && store.error) {
      toast.error(`Error: ${store.error}`);
    }
  }, [loadFist, store]); // Make sure to include dispatch as a dependency if you're using it in the effect

  useEffect(() => {
    dispatch(getMenuAll()).then((item) => {
      const findData = item.payload.data.bottummenu.find(
        (e) => e.pageName === "Trash"
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

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);

    if (selectedItems.length === sortedAndPaginatedData?.length) {
      setSelectedItems([]);
    } else {
      const allIds =
        sortedAndPaginatedData?.map((item) => ({
          assetID: item.assetID,
          assetType: item.assetType,
        })) || [];
      setSelectedItems(allIds);
    }
  };

  const handleDeleteAllPermanently = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${All_DELETED_TRASH}`,
      headers: { Authorization: authToken },
      data: selectedItems,
    };
    Swal.fire({
      title: "Delete Permanently",
      text: "Are you sure you want to delete this item permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(handleTrashAll({ config }));
        Swal.fire({
          title: "Deleted Permanently",
          icon: "success",
          timer: 2000, // Set the duration for the success message to be displayed (in milliseconds)
          showConfirmButton: false, // Hide the "OK" button
        });
        setSelectAllChecked(false);
        setSelectCheck(false);
        setSelectedItems([]);
      }
    });
  };

  const handleDeletePermanently = (id, type) => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${SINGL_DELETED_TRASH}?assetID=${id}&assetType=${type}`,
      headers: { Authorization: authToken },
    };
    try {
      Swal.fire({
        title: "Delete Permanently",
        text: "Are you sure you want to delete this item permanently?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(handleTrash({ config }));
          Swal.fire({
            title: "Deleted Permanently",
            icon: "success",
            timer: 1500, // Set the duration for the success message to be displayed (in milliseconds)
            showConfirmButton: false, // Hide the "OK" button
          });
        }
      });
    } catch (error) {
      console.log("error handleDeletePermanently Singal --- ", error);
    }
  };

  // // Multipal check
  const handleCheckboxChange = (item) => {
    setSelectAllChecked(false);
    setSelectCheck(true);
    const isItemSelected = selectedItems.some(
      (selectedItem) =>
        selectedItem.assetID === item.assetID &&
        selectedItem.assetType === item.assetType
    );

    if (isItemSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter(
          (selectedItem) =>
            selectedItem.assetID !== item.assetID ||
            selectedItem.assetType !== item.assetType
        )
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, item]);
    }
  };

  useEffect(() => {
    if (selectcheck) {
      if (selectedItems?.length === sortedAndPaginatedData?.length) {
        setSelectAllChecked(true);
      }
    }
  }, [selectcheck, selectedItems]);

  const handleRestore = (id, type) => {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${RESTORE_TRASH}?assetID=${id}&assetType=${type}`,
        headers: { Authorization: authToken },
      };
      Swal.fire({
        title: "Restore Item",
        text: "Are you sure you want to restore this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4caf50",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, restore it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(handleTrashRestore({ config }));
          Swal.fire({
            title: "Restored Successfully",
            icon: "success",
            timer: 1500, // Set the duration for the success message to be displayed (in milliseconds)
            showConfirmButton: false, // Hide the "OK" button
          });
          setLoadFist(true);
        }
      });
    } catch (error) {
      console.log(" handleRestore --- ", error);
    }
  };

  return (
    <>
      {sidebarload && <Loading />}
      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <div>
            <div className="flex">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Navbar />
            </div>
            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
              <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                <div className="flex justify-between items-center mb-5 ">
                  <h1 className="not-italic font-medium text-2xl text-[#001737]">
                    Trash
                  </h1>
                  <div className="flex items-center justify-center gap-2">
                    {selectedItems?.length > 0 && (
                      <button
                        data-tip
                        data-for="Delete"
                        className="p-2 rounded-full text-base bg-red sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                        onClick={handleDeleteAllPermanently}
                      >
                        <RiDeleteBin5Line className="text-lg" />
                        <ReactTooltip
                          id="Delete"
                          place="bottom"
                          type="warning"
                          effect="solid"
                        >
                          <span>Delete</span>
                        </ReactTooltip>
                      </button>
                    )}

                    {permissions.isDelete && (
                      <input
                        data-tip
                        data-for="Select All"
                        type="checkbox"
                        className="lg:w-7 lg:h-6 w-5 h-5"
                        checked={selectAllChecked}
                        onChange={handleSelectAllChange}
                      />
                    )}
                    <ReactTooltip
                      id="Select All"
                      place="bottom"
                      type="warning"
                      effect="solid"
                    >
                      <span>Select All</span>
                    </ReactTooltip>
                  </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative p-5">
                  <div>
                    <h4 className="text-1xl font-bold dark:text-white m-3 text-center">
                      This data is stored upto 30 days after that it will get
                      auto deleted.
                    </h4>
                  </div>

                  <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                    <table
                      className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                      cellPadding={15}
                    >
                      <thead>
                        <tr className="items-center table-head-bg">
                          <th className="sticky top-0th-bg-100 text-md font-semibold ">
                            <div className="flex justify-start items-center w-full">
                              Name
                              <svg
                                className="w-3 h-3 ms-1.5 cursor-pointer"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                onClick={() => handleSort("assetName")}
                              >
                                <path
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                                />
                              </svg>
                            </div>
                          </th>
                          <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                            File location
                          </th>
                          <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                            Date deleted
                          </th>
                          <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                            Size
                          </th>
                          <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                            Item type
                          </th>
                          <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.isLoading ? (
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
                               
                              </div>
                            </td>
                          </tr>
                        ) : store && sortedAndPaginatedData?.length === 0 ? (
                          <tr>
                            <td colSpan={6}>
                              <div className="flex text-center m-5 justify-center">
                                <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                  No Data Available
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          sortedAndPaginatedData.length &&
                          sortedAndPaginatedData?.map((item, i) => (
                            <tr
                              key={i}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              <td className=" border-b border-lightgray text-sm ">
                                <div className="flex gap-2 text-[#5E5E5E] items-center justify-start">
                                  {permissions.isDelete && (
                                    <>
                                      {selectAll ? (
                                        <CheckmarkIcon />
                                      ) : (
                                        <button>
                                          <input
                                            type="checkbox"
                                            className="mx-1"
                                            checked={selectedItems.some(
                                              (selectedItem) =>
                                                selectedItem.assetID ===
                                                  item.assetID &&
                                                selectedItem.assetType ===
                                                  item.assetType
                                            )}
                                            onChange={() =>
                                              handleCheckboxChange({
                                                assetID: item.assetID,
                                                assetType: item.assetType,
                                              })
                                            }
                                          />
                                        </button>
                                      )}
                                    </>
                                  )}
                                  {item.assetType === "Folder" && (
                                    <span className="w-30 h-30 text-[#5E5E5E] flex items-center justify-center">
                                      <HiFolder />
                                    </span>
                                  )}
                                  {item.assetType === "Image" && (
                                    <span className="text-[#5E5E5E]">
                                      <FiImage />
                                    </span>
                                  )}
                                  {item.assetType === "OnlineImage" && (
                                    <span className="text-[#5E5E5E]">
                                      <FiImage />
                                    </span>
                                  )}
                                  {item.assetType === "OnlineVideo" && (
                                    <span className="text-[#5E5E5E]">
                                      <CgYoutube />
                                    </span>
                                  )}
                                  {item.assetType === "DOC" && (
                                    <span className="text-[#5E5E5E]">
                                      <HiDocument />
                                    </span>
                                  )}
                                  {item.assetType === "Video" && (
                                    <span className="text-[#5E5E5E]">
                                      <HiVideoCamera />
                                    </span>
                                  )}
                                  {item.assetName}
                                </div>
                              </td>
                              {/* <td className=" border-b border-lightgray text-sm ">{item.assetFolderPath}</td> */}
                              <td className=" border-b text-[#5E5E5E] border-lightgray text-sm ">
                                {item.folderPath}
                              </td>
                              <td className=" border-b text-[#5E5E5E] border-lightgray text-sm ">
                                {moment(item.deleteDate).format(
                                  "DD/MM/YY, h:mm:ss a"
                                )}
                              </td>
                              <td className=" border-b text-[#5E5E5E] border-lightgray text-sm ">
                                {item.fileSize}
                              </td>
                              <td className=" border-b text-[#5E5E5E] border-lightgray text-sm ">
                                {item.assetType}
                              </td>
                              <td className="border-b border-lightgray text-sm">
                                <div className="cursor-pointer text-xl flex gap-4 ">
                                  {permissions.isDelete && (
                                    <button
                                      type="button"
                                      className="rounded-full px-2 py-2 text-white text-center bg-[#FF0000] mr-3"
                                      onClick={() =>
                                        handleDeletePermanently(
                                          item.assetID,
                                          item.assetType
                                        )
                                      }
                                    >
                                      <MdDeleteForever />
                                    </button>
                                  )}
                                  {permissions.isSave && (
                                    <button
                                      type="button"
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                      onClick={() =>
                                        handleRestore(
                                          item.assetID,
                                          item.assetType
                                        )
                                      }
                                    >
                                      <MdRestore />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                    <div className="flex items-center">
                      <span className="text-gray-500">{`Total ${store?.deletedData?.length} Trash`}</span>
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
                        disabled={(currentPage === totalPages) || (store?.deletedData?.length === 0)}
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
                 
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </>
  );
};

export default Trash;
