import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import axios from "axios";
import DataTable from "react-data-table-component";
import { CiMenuKebab } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import "../Styles/admin.css";
import {
  ADD_USER_MASTER,
  GET_ALL_USER_MASTER,
  GET_ALL_USER_TYPE_MASTER,
} from "./AdminAPI";
import AddEditUser from "./AddEditUser";
import ReactTooltip from "react-tooltip";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";

const User = ({ sidebarOpen, setSidebarOpen }) => {
  const [addUserModal, setAddUserModal] = useState(false);
  const [userType, setUserType] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [userTypeData, setUserTypeData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showActionBox, setShowActionBox] = useState(false);
  const [deletePopup, setdeletePopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [selectData, setSelectData] = useState()
  const handleActionClick = (rowId) => {
    setShowActionBox(rowId);
  };

  const handleCheckboxChange = (event) => {
    setIsActive(event.target.checked);
  };

  const handleInsertUser = () => {
    let data = JSON.stringify({
      userName: userName,
      password: password,
      isActive: isActive,
      userType: selectedUserType || 0,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phoneNumber,
      operation: editMode ? "Update" : "Insert",
      userID: editMode ? editUserId : 0,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_USER_MASTER,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        fetchUserData();

        if (!editMode) {
          setUserData((prevData) => [
            ...prevData,
            {
              userID: response.data.data.model.userID,
              userName,
              password,
              isActive,
              userType,
              firstName,
              lastName,
              email,
              phoneNumber,
            },
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });

    setUserName("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setEmail("");
    setSelectedUserType("");
    setIsActive("");
    setEditMode(false);
    setEditUserId("");
    setAddUserModal(false);
  };

  const handleEditClick = (user) => {
    setUserName(user.userName);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhoneNumber(user.phone);
    setEmail(user.email);
    setSelectedUserType(user.userType);
    setIsActive(user.isActive);
    setEditMode(true);
    setEditUserId(user.userID);
    setAddUserModal(true);
  };

  const fetchUserTypeData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_USER_TYPE_MASTER,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setUserTypeData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUserData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_USER_MASTER,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setUserData(response.data.data);
        setOriginalUserData(response.data.data);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserTypeData();
    fetchUserData();
  }, []);

  const handleDelete = (userID) => {
    let data = JSON.stringify({
      userID: userID,
      operation: "Delete",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_USER_MASTER,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        fetchUserData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filteredData = userData?.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );
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

  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue])

  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  function handleFilter(event) {
    const searchValue = event.target.value.toLowerCase();
    setSearchValue(searchValue)
  }

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
              Users
            </h1>
            <div className="lg:col-span-2 lg:flex items-center md:mt-0 lg:mt-0 md:justify-end sm:mt-3 flex-wrap">
              <div className="relative md:mr-2 lg:mr-2 lg:mb-0 md:mb-0 mb-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray" />
                </span>
                <input
                  type="text"
                  placeholder="Search Users"
                  className="border border-gray rounded-full px-7 py-2 search-user"
                  onChange={handleFilter}
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setAddUserModal(true)}
                  className="flex align-middle items-center float-right bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 py-3 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
          <div className="clear-both">
            <div className="bg-white rounded-xl lg:mt-6 md:mt-6 mt-4 shadow screen-section ">
              <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                <table
                  className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                  cellPadding={15}
                >
                  <thead>
                    <tr className="text-left table-head-bg">
                      <th className="text-[#5A5881] text-base font-semibold ">
                        <div className="flex w-full items-center">
                          User Name
                          <svg
                            className="w-3 h-3 ms-1.5 cursor-pointer"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            onClick={() => handleSort("userName")}
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </div>
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold ">
                        First Name
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold ">
                        Last Name
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold ">
                        Phone Number
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold ">
                        User Type
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold ">
                        Email
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold ">
                        Active
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold ">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && sortedAndPaginatedData.length === 0 && (
                      <tr>
                        <td colSpan={5}>
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
                    {!loading &&
                      userData &&
                      sortedAndPaginatedData?.length > 0 &&
                      sortedAndPaginatedData.map((item, index) => {
                        return (
                          <tr className="border-b border-b-[#E4E6FF]" key={index}>
                            <td className="mw-200 text-[#5E5E5E] ">
                              {item?.userName}
                            </td>
                            <td
                              className="mw-200 text-[#5E5E5E] "
                            >
                              {item?.firstName}
                            </td>
                            <td
                              className="mw-200 text-[#5E5E5E] "
                            >
                              {item?.lastName}
                            </td>
                            <td
                              className="mw-200 text-[#5E5E5E] "
                            >
                              {item?.phone}
                            </td>
                            <td
                              className="mw-200 text-[#5E5E5E] "
                            >
                              {item?.userTypeName}
                            </td>
                            <td
                              className="mw-200 text-[#5E5E5E] "
                            >
                              {item?.email}
                            </td>
                            <td className="mw-200 px-6 py-4 capitalize">
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

                            <td className="mw-200 px-6 py-4">
                              <div className="flex gap-2">
                                <div className="cursor-pointer text-xl flex gap-4">
                                  <button
                                    type="button"
                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={() => {
                                      handleEditClick(item);
                                    }}
                                  >
                                    <MdModeEditOutline />
                                  </button>
                                </div>
                                <div className="cursor-pointer text-xl flex gap-4 ">
                                  <button
                                    type="button"
                                    className="rounded-full px-2 py-2 text-white text-center bg-[#FF0000] mr-2"
                                    onClick={() => {
                                      setdeletePopup(true);
                                      setSelectData(item);
                                    }
                                    }
                                  >
                                    <MdDeleteForever />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    {!loading &&
                      userData &&
                      sortedAndPaginatedData?.length === 0 && (
                        <>
                          <tr>
                            <td colSpan={8}>
                              <div className="flex text-center justify-center">
                                <span className="text-2xl  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full text-green-800 me-2 dark:bg-green-900 dark:text-green-300">
                                  No Data Available
                                </span>
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                  </tbody>
                </table>
              </div>
              <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                <div className="flex items-center">
                  <span className="text-gray-500">{`Total ${userData?.length} Users`}</span>
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
                    disabled={(currentPage === totalPages) || (userData?.length === 0)}
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
      {deletePopup ? (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
          <div className="relative w-full max-w-xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="py-6 text-center">
                <RiDeleteBin6Line className="mx-auto mb-4 text-[#F21E1E] w-14 h-14" />
                <h3 className="mb-5 text-xl text-primary">
                  Are you sure you want to delete this User?
                </h3>
                <div className="flex justify-center items-center space-x-4">
                  <button
                    className="border-primary border rounded text-primary px-5 py-2 font-bold text-lg"
                    onClick={() => setdeletePopup(false)}
                  >
                    No, cancel
                  </button>

                  <button
                    className="text-white bg-[#F21E1E] rounded text-lg font-bold px-5 py-2"
                    onClick={() => {
                      handleDelete(selectData?.userID);
                      setdeletePopup(false);
                      setAddUserModal(false);
                    }}
                  >
                    Yes, I'm sure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {addUserModal && (
        <AddEditUser
          editMode={editMode}
          setAddUserModal={setAddUserModal}
          setUserName={setUserName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPhoneNumber={setPhoneNumber}
          setEmail={setEmail}
          setSelectedUserType={setSelectedUserType}
          setIsActive={setIsActive}
          setEditMode={setEditMode}
          setEditUserId={setEditUserId}
          setShowPassword={setShowPassword}
          showPassword={showPassword}
          selectedUserType={selectedUserType}
          userName={userName}
          firstName={firstName}
          lastName={lastName}
          phoneNumber={phoneNumber}
          email={email}
          password={password}
          userTypeData={userTypeData}
          isActive={isActive}
          handleCheckboxChange={handleCheckboxChange}
          handleInsertUser={handleInsertUser}
          setPassword={setPassword}
        />
      )}
    </>
  );
};

export default User;
