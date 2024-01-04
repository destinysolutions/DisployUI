import React, { useEffect, useState } from "react";
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

const Trash = ({ sidebarOpen, setSidebarOpen }) => {
  Trash.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    setSidebarOpen: PropTypes.func.isRequired,
  };

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [loadFist, setLoadFist] = useState(true);

  // Use Redux state instead of local state
  const store = useSelector((state) => state.root.trashData);

  const [selectAll, setSelectAll] = useState(false);

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

  console.log("store.successMessage", store.successMessage);

  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
  };

  const handleDeleteAllPermanently = () => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: All_DELETED_TRASH,
      headers: { Authorization: authToken },
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
        setSelectAll(false);
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
    <div>
      <div className="flex border-b border-gray mt-5">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      <div className="pt-16 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
              Trash
            </h1>
            <div className="m-5 flex gap-4">
              <button
                className="p-2 rounded-full text-base bg-red sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={handleDeleteAllPermanently}
                style={{ display: selectAll ? "block" : "none" }}
              >
                <RiDeleteBin5Line className="text-lg" />
              </button>
              <input
                type="checkbox"
                className="w-8 h-8"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
            <table
              className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                  <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold flex items-center justify-left">
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
                  </th>
                  <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                    File location
                  </th>
                  <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                    Date deleted
                  </th>
                  <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                    Size
                  </th>
                  <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                    Item type
                  </th>
                  <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                    Date modified
                  </th>
                  <th className=" sticky top-0 border-b border-lightgray th-bg-100 text-md font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {store.isLoading ? (
                  <tr>
                    <td colSpan={6}>
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
                        <span className="text-4xl  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                          Loading...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : store && sortedAndPaginatedData?.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex text-center m-5 justify-center">
                        <span className="text-4xl text-gray-800 font-semibold py-2 px-4 rounded-full text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                          Data Not Found
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
                        <div className="flex gap-2">
                          {selectAll && <CheckmarkIcon />}
                          {item.assetType === "Folder" && (
                            <span>
                              <HiFolder />{" "}
                            </span>
                          )}
                          {item.assetType === "Image" && (
                            <span>
                              {" "}
                              <FiImage />{" "}
                            </span>
                          )}
                          {item.assetType === "OnlineImage" && (
                            <span>
                              {" "}
                              <FiImage />{" "}
                            </span>
                          )}
                          {item.assetType === "OnlineVideo" && (
                            <span>
                              {" "}
                              <CgYoutube />{" "}
                            </span>
                          )}
                          {item.assetType === "DOC" && (
                            <span>
                              {" "}
                              <HiDocument />{" "}
                            </span>
                          )}
                          {item.assetType === "Video" && (
                            <span>
                              {" "}
                              <HiVideoCamera />{" "}
                            </span>
                          )}{" "}
                          {item.assetName}
                        </div>
                      </td>
                      {/* <td className=" border-b border-lightgray text-sm ">{item.assetFolderPath}</td> */}
                      <td className=" border-b border-lightgray text-sm ">
                        Not Found
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {moment(item.createdDate).format("DD/MM/YY, h:mm:ss a")}{" "}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.fileSize}{" "}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.assetType}{" "}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {" "}
                        {moment(item.createdDate).format(
                          "DD/MM/YY, h:mm:ss a"
                        )}{" "}
                      </td>
                      <td className="border-b border-lightgray text-sm">
                        <div className="cursor-pointer text-xl flex gap-4 ">
                          <MdDeleteForever
                            className="text-[#EE4B2B]"
                            onClick={() =>
                              handleDeletePermanently(
                                item.assetID,
                                item.assetType
                              )
                            }
                          />
                          <MdRestore
                            className="text-[#2563eb]"
                            onClick={() =>
                              handleRestore(item.assetID, item.assetType)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-end pt-4"
            aria-label="Table navigation"
          >
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 flex justify-end mt-2">
              <li className="">
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 5H1m0 0 4 4M1 5l4-4"
                    />
                  </svg>
                  Previous
                </button>
              </li>

              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                  <svg
                    className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Trash;
