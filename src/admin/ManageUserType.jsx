import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./adminNavbar";
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
import { ADD_USER_TYPE_MASTER, GET_ALL_USER_TYPE_MASTER } from "./AdminAPI";

const ManageUserType = ({ sidebarOpen, setSidebarOpen }) => {
  const [addUsertypeModal, setAddUserTypeModal] = useState(false);
  const [userType, setUserType] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [userTypeData, setUserTypeData] = useState([]);
  const [showActionBox, setShowActionBox] = useState(false);
  const [deletePopup, setdeletePopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [originalUserTypeData, setOriginalUserTypeData] = useState([]);
  const handleActionClick = (rowId) => {
    setShowActionBox(rowId);
  };

  const handleCheckboxChange = (event) => {
    setIsActive(event.target.checked);
  };

  const handleInsertUserType = () => {
    let data = JSON.stringify({
      isActive: isActive,
      userType: userType,
      operation: editMode ? "Update" : "Insert",
      userTypeID: editMode ? editUserId : 0,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_USER_TYPE_MASTER,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        fetchUserTypeData();
        if (!editMode) {
          setUserTypeData((prevData) => [
            ...prevData,
            {
              userTypeID: response.data.userTypeID,
              isActive,
              userType,
            },
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // Reset form fields
    setUserType("");
    setIsActive(false);
    setEditMode(false);
    setEditUserId(null);
    setAddUserTypeModal(false);
  };
  const handleEditClick = (userType) => {
    setUserType(userType.userType);
    setIsActive(userType.isActive);
    setEditMode(true);
    setEditUserId(userType.userTypeID);
    setAddUserTypeModal(true);
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
        console.log(response.data);
        setUserTypeData(response.data.data);
        setOriginalUserTypeData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserTypeData();
  }, []);

  const handleDelete = (userTypeID) => {
    let data = JSON.stringify({
      userTypeID: userTypeID,
      operation: "Delete",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_USER_TYPE_MASTER,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        fetchUserTypeData();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const columns = [
    {
      name: "User Type",
      selector: (row) => row.userType,
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
          <button onClick={() => handleActionClick(row.userTypeID)}>
            <CiMenuKebab />
          </button>
          {showActionBox === row.userTypeID && (
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
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
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
                              handleDelete(row.userTypeID);
                              setdeletePopup(false);
                              setAddUserTypeModal(false);
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
      setUserTypeData(originalUserTypeData);
    } else {
      const newData = userTypeData.filter((row) => {
        return row.userType.toLowerCase().includes(searchValue);
      });
      setUserTypeData(newData);
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
              Manage User Type
            </h1>

            <div className="text-right mb-5 mr-5 relative sm:mr-0">
              <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
              <input
                type="text"
                placeholder=" Search Users "
                className="border border-gray rounded-full px-7 py-2 search-user"
                onChange={handleFilter}
              />
            </div>
            <div className="lg:flex md:flex sm:block">
              <button
                onClick={() => setAddUserTypeModal(true)}
                className="border border-primary rounded-full px-3 py-2 not-italic font-medium"
              >
                Add User Type
              </button>
              {addUsertypeModal && (
                <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
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
                          onClick={() => setAddUserTypeModal(false)}
                        >
                          <AiOutlineCloseCircle className="text-2xl" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div>
                          <label>User Type :</label>
                          <input
                            className="border border-primary ml-4 rounded py-2"
                            type="text"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                          />
                        </div>
                        <div className="mt-3 flex items-center">
                          <label>isActive :</label>
                          <input
                            className="border border-primary ml-8 rounded h-6 w-6"
                            type="checkbox"
                            checked={isActive}
                            onChange={handleCheckboxChange}
                          />
                        </div>
                        <div className="flex justify-center items-center mt-5">
                          <button
                            onClick={handleInsertUserType}
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
            </div>
          </div>
          <div className="mt-7">
            <DataTable
              columns={columns}
              data={userTypeData}
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

export default ManageUserType;
