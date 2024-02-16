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

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "User Type",
      selector: (row) => row.userTypeName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: "Active",
      selector: (row) => row.isActive,
      sortable: true,
      cell: (row) => (
        <div>
          {row.isActive ? (
            <span style={{ color: "green" }}>Active</span>
          ) : (
            <span style={{ color: "red" }}>Inactive</span>
          )}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="relative">
          <button onClick={() => handleActionClick(row.userID)}>
            <CiMenuKebab />
          </button>
          {showActionBox === row.userID && (
            <>
              <div className="actionpopup z-10 ">
                <button
                  onClick={() => setShowActionBox(false)}
                  className="bg-white absolute top-[-14px] left-[-8px] z-10  rounded-full drop-shadow-sm p-1"
                >
                  <AiOutlineClose />
                </button>

                <div className=" my-1">
                  <button onClick={() => handleEditClick(row)}>Edit</button>
                </div>

                <div className="mb-1 border border-[#F2F0F9]"></div>

                <div className=" mb-1 text-[#D30000]">
                  <button onClick={() => setdeletePopup(true)}>Delete</button>
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
                              handleDelete(row.userID);
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
            </>
          )}
        </div>
      ),
    },
  ];

  function handleFilter(event) {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue === "") {
      setUserData(originalUserData);
    } else {
      const newData = userData.filter((row) => {
        return row.firstName.toLowerCase().includes(searchValue);
      });
      setUserData(newData);
    }
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
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ">
              Users
            </h1>
            <div className="flex gap-4">
              <div className="text-right mb-5 mr-5 relative sm:mr-0">
                <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
                <input
                  type="text"
                  placeholder="Search Users"
                  className="border border-gray rounded-full px-7 py-2 search-user"
                  onChange={handleFilter}
                />
              </div>
              <div className="lg:flex md:flex sm:block mb-5">
                <button
                  onClick={() => setAddUserModal(true)}
                  className="border border-primary rounded-full px-3 py-2 not-italic font-medium"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
          {addUserModal && (
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
              <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
                    <div className="flex items-center">
                      <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                        Add User Type
                      </h3>
                    </div>
                    <button
                      className="p-1 text-xl ml-8"
                      onClick={() => setAddUserModal(false)}
                    >
                      <AiOutlineCloseCircle className="text-2xl" />
                    </button>
                  </div>
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="User Name"
                      className="formInput"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="First Name"
                      className="formInput mt-4"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="formInput mt-4"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="formInput mt-4"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {!editMode && (
                      <>
                        <input
                          type="email"
                          placeholder="Email"
                          className="formInput mt-4"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="formInput mt-4"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="eyeIcon">
                          {showPassword ? (
                            <BsFillEyeFill
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <BsFillEyeSlashFill
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </div>
                      </>
                    )}
                    <select
                      onChange={(e) => setSelectedUserType(e.target.value)}
                      value={selectedUserType}
                      className="formInput mt-4"
                    >
                      {userTypeData.map((user) => (
                        <option key={user.userTypeID} value={user.userTypeID}>
                          {user.userType}
                        </option>
                      ))}
                    </select>
                    <div className="mt-5 flex items-center">
                      <input
                        className="border border-primary mr-3 ml-1 rounded h-6 w-6"
                        type="checkbox"
                        checked={isActive}
                        onChange={handleCheckboxChange}
                      />
                      <label>isActive </label>
                    </div>

                    <div className="flex justify-center items-center mt-5">
                      <button
                        onClick={handleInsertUser}
                        className="border border-primary rounded-full px-6 py-2 not-italic font-medium"
                      >
                        {editMode ? "Edit" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-7">
            <DataTable
              columns={columns}
              data={userData}
              fixedHeader
              pagination
              paginationPerPage={10}
            ></DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
