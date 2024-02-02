import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { getOnBodingData, handlAcceptedRequest, handleRemoveUser, resetStatus } from "../Redux/admin/OnBodingSlice";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";


const OnBoding = ({ sidebarOpen, setSidebarOpen }) => {

  const store = useSelector((state) => state.root.onBoding);
  const dispatch = useDispatch();
  const [loadFist, setLoadFist] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [search, setSearch] = useState('');


  useEffect(() => {
    if (loadFist) {
      dispatch(getOnBodingData());
      setLoadFist(false)
    }

    if (store && store.status === "failed") {
      toast.error(store.error);
    }

    if (store && store.status === "succeeded") {
      toast.success(store.message);
      setLoadFist(true)
    }

    if (store && store.status) {
      dispatch(resetStatus());
    }

  }, [loadFist, store]);

  // Filter data based on search term
  const filteredData = Array.isArray(store?.data)
    ? store?.data?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase())
      )
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

  // Handle sorting when a table header is clicked
  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  const handleChange = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearch(searchQuery);
  };


  const handleDelete = (organizationID) => {
    const payload = {
      organizationID: organizationID,
      operation: "Delete",
    }
    try {
      Swal.fire({
        title: "Delete Permanently",
        text: "Are you sure you want to delete this user",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(handleRemoveUser(payload));
        }
      });
    } catch (error) {
      console.log("error handleDeletePermanently Singal --- ", error);
    }
  };

  const handleClick = (organizationID) => {
    const payload = {OrganizationId: organizationID}
    Swal.fire({
      title: "Are you sure storage request accept ?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Accept it!",
      customClass: {
        text: "swal-text-bold",
        content: "swal-text-color",
        confirmButton: "swal-confirm-button-color",
      },
      confirmButtonColor: "#008000",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(handlAcceptedRequest(payload));
      }
    });
  };

  return (
    <>
      <div>
        <div className="flex border-b border-gray">
          <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <AdminNavbar />
        </div>
        <div className="pt-16 px-5 page-contain">
          <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
            <div className="lg:flex lg:justify-between sm:block items-center">
              <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
                Users
              </h1>
              <div className="m-5 flex gap-4 items-center">
                <div className="flex gap-3">
                  <div className="text-right mb-5 mr-5 relative sm:mr-0">
                    <div>
                      <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
                      <input
                        type="text"
                        placeholder=" Search user"
                        className="border border-gray rounded-full px-7 py-2 search-user"
                        value={search}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
              <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                <table
                  className="screeen-table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  cellPadding={20}
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="items-center table-head-bg capitalize" >
                      <th className=" sticky top-0th-bg-100 text-md font-semibold flex items-center justify-left">
                        Name
                        <svg
                          className="w-3 h-3 ms-1.5 cursor-pointer"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          onClick={() => handleSort("firstName")}
                        >
                          <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                          />
                        </svg>
                      </th>

                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Google Location
                      </th>
                      <th scope="col" className="px-6 py-3">
                        PhoneNo
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Organization Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Trial Day
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Screen
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Storage Request
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {store?.data?.length > 0 && sortedAndPaginatedData.map((item) => {
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.firstName + ' ' + item.lastName}
                          </th>
                          <td className="px-6 py-4">
                            {item.email}
                          </td>
                          <td className="px-6 py-4">
                            {item.googleLocation}
                          </td>
                          <td className="px-6 py-4">
                            {item.phone}
                          </td>

                          <td className="px-6 py-4 capitalize">
                            {item.organizationName}
                          </td>

                          <td className="px-6 py-4 capitalize">
                            {item.trialDays}
                          </td>

                          <td className="px-6 py-4 capitalize">
                            {item.screen}
                          </td>

                          <td className="px-6 py-4 capitalize">
                            {item.isIncreaseRequest === true && (
                              <span
                                onClick={() => handleClick(item.organizationID)}
                                className="capitalize cursor-pointer text-xs bg-gray-300 hover:bg-gray-400 text-[#000] font-semibold px-4 text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                              >
                                  {!item.increaseSize == 0 && `${item.increaseSize} GB`} View Request
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 capitalize">
                            <span>
                              {item?.isActive ? (
                                <span
                                  style={{ backgroundColor: "#cee9d6" }}
                                  className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4 text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                  Active
                                </span>
                              ) : (
                                <span
                                  style={{ backgroundColor: "#cee9d6" }}
                                  className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                  Inactive
                                </span>
                              )}
                            </span>

                          </td>
                          <td className="px-6 py-4">

                            <div className="cursor-pointer text-xl flex gap-4 ">
                              <button
                                type="button"
                                className="rounded-full px-2 py-2 text-white text-center bg-[#FF0000] mr-3"
                                onClick={() => handleDelete(item.organizationID)}
                              >
                                <MdDeleteForever />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-end p-5"
                aria-label="Table navigation"
              >
                <ul className="-space-x-px rtl:space-x-reverse text-sm h-8 flex justify-end mt-2">
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
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
      </div>
    </>
  )
}

export default OnBoding