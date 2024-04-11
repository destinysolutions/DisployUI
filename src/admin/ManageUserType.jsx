import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getManageUserData,
  handleAddEdit,
  handleRemoveManageUser,
} from "../Redux/admin/ManageUserSlice";
import toast from "react-hot-toast";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import Swal from "sweetalert2";
import AddEditManageUserType from "./AddEditManageUserType";

const ManageUserType = ({ sidebarOpen, setSidebarOpen }) => {
  const store = useSelector((state) => state.root.ManageUser);
  const dispatch = useDispatch();
  const [loadFist, setLoadFist] = useState(true);
  const [addUsertypeModal, setAddUserTypeModal] = useState(false);
  const [userType, setUserType] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [search, setSearch] = useState("");
  const [heading, setHeading] = useState("Add");
  const [selectData, setSelectData] = useState("");
  useEffect(() => {
    if (loadFist) {
      dispatch(getManageUserData());
      setLoadFist(false);
    }
  }, [loadFist, store]);

  const filteredData = Array.isArray(store?.data)
    ? store?.data?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(search.toLowerCase())
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

  const handleDelete = (userTypeID) => {
    let payload = JSON.stringify({
      userTypeID: userTypeID,
      operation: "Delete",
    });
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
          dispatch(handleRemoveManageUser(payload))
            .then((res) => {
              if (res?.payload?.status === 200) {
                toast.success("Delete data successFully");
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
          setLoadFist(true);
        }
      });
    } catch (error) {
      console.log("error handleDeletePermanently Singal --- ", error);
    }
  };

  const handleChange = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearch(searchQuery);
  };

  const toggleModal = () => {
    setAddUserTypeModal(!addUsertypeModal);
  };

  const HandleSubmit = () => {
    let data = JSON.stringify({
      isActive: isActive,
      userType: userType,
      operation: editMode ? "Update" : "Insert",
      userTypeID: editMode ? selectData?.userTypeID : 0,
    });
    dispatch(handleAddEdit(data))
      .then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(getManageUserData());
          if (editMode) {
            toast.success("Update data successFully");
          } else {
            toast.success("Add data successFully");
          }
          setAddUserTypeModal(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setAddUserTypeModal(false);
      });
  };

  
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  return (
    <>
      <div className="flex border-b border-gray ">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <AdminNavbar />
      </div>
      <div className="pt-6 px-5 page-contain ">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="grid lg:grid-cols-3 gap-2">
            <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3 sm:text-xl">
              Manage User Type
            </h1>
            <div className="lg:col-span-2 lg:flex items-center md:mt-0 lg:mt-0 md:justify-end sm:mt-3 flex-wrap">
              <div className="relative md:mr-2 lg:mr-2 lg:mb-0 md:mb-0 mb-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>

                <input
                  type="text"
                  placeholder="Search UserType"
                  className="border border-gray rounded-full px-7 py-2 search-user"
                  value={search}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => {
                    setHeading("Add");
                    setAddUserTypeModal(true);
                    setUserType("");
                    setIsActive(false);
                    setEditMode(false);
                    setSelectData("");
                  }}
                  className="flex align-middle items-center float-right bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 py-3 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                >
                  Add User Type
                </button>
              </div>
            </div>
          </div>

          <div className="lg:mt-7 mt-5">
            <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
              <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                <table
                  className="screeen-table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  cellPadding={15}
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="items-center table-head-bg capitalize">
                      <th className=" sticky top-0th-bg-100 text-md font-semibold flex items-center justify-left">
                        User Type
                        <svg
                          className="w-3 h-3 ms-1.5 cursor-pointer"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          onClick={() => handleSort("userType")}
                        >
                          <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                          />
                        </svg>
                      </th>

                      <th scope="col" className="px-6 py-4">
                        Active
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!store?.loading &&
                      store?.data?.length > 0 &&
                      sortedAndPaginatedData.map((item, index) => {
                        return (
                          <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            key={index}
                          >
                            <td
                              scope="row"
                              className="px-3.5 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white capitalize"
                            >
                              {item.userType}
                            </td>
                            <td className="px-3.5 py-2 capitalize">
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
                                      style={{ backgroundColor: "#f1b2b2" }}
                                      className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#FF0000] font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                    >
                                      Inactive
                                    </span>
                                  )}
                                </span>
                              </td>
                            <td className="px-3.5 py-2">
                              <div className="flex items-center gap-4">
                                  <button
                                    type="button"
                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={() => {
                                      setAddUserTypeModal(true);
                                      setEditMode(true);
                                      setSelectData(item);
                                      setHeading("Update");
                                      setIsActive(item?.isActive);
                                      setUserType(item?.userType);
                                    }}
                                  >
                                    <MdModeEditOutline />
                                  </button>
                                
                                  <button
                                    type="button"
                                    className="rounded-full text-lg p-2.5 text-white text-center bg-[#FF0000] "
                                    onClick={() =>
                                      handleDelete(item?.userTypeID)
                                    }
                                  >
                                    <MdDeleteForever />
                                  </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    {store?.loading && (
                      <tr>
                        <td colSpan={3}>
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
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                <div className="flex items-center">
                  <span className="text-gray-500">{`Total ${store?.data?.length} User Type`}</span>
                </div>
                <div className="flex justify-end">
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
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || (store?.data?.length === 0)}
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
            </div>
          </div>
        </div>
      </div>

      {addUsertypeModal && (
        <AddEditManageUserType
          setUserType={setUserType}
          userType={userType}
          heading={heading}
          toggleModal={toggleModal}
          isActive={isActive}
          setIsActive={setIsActive}
          HandleSubmit={HandleSubmit}
        />
      )}
    </>
  );
};

export default ManageUserType;
