import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./adminNavbar";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useState } from "react";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  ADD_ORGANIZATION_MASTER,
  GET_ALL_ORGANIZATION_MASTER,
} from "./AdminAPI";

const OnBoding = ({ sidebarOpen, setSidebarOpen }) => {
  const [userData, setUserData] = useState([]);
  const [originalUserData, setOriginalUserData] = useState([]);
  const fetchUserData = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_ORGANIZATION_MASTER,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setUserData(response.data.data);
        setOriginalUserData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const [deletePopup, setdeletePopup] = useState(false);
  const [showActionBox, setShowActionBox] = useState(false);
  const handleActionClick = (rowId) => {
    setShowActionBox(rowId);
  };

  const columns = [
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
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Google Location",
      selector: (row) => row.googleLocation,
      sortable: true,
    },
    {
      name: "PhoneNo",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Organization Name",
      selector: (row) => row.organizationName,
      sortable: true,
    },
    {
      name: "Trial Day",
      selector: (row) => row.trialDays,
      sortable: true,
    },
    {
      name: "Screen",
      selector: (row) => row.screen,
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
          <button onClick={() => handleActionClick(row.organizationID)}>
            <CiMenuKebab />
          </button>
          {showActionBox === row.organizationID && (
            <>
              <div className="actionpopup z-10 ">
                <button
                  onClick={() => setShowActionBox(false)}
                  className="bg-white absolute top-[-14px] left-[-8px] z-10  rounded-full drop-shadow-sm p-1"
                >
                  <AiOutlineClose />
                </button>

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
                              handleDelete(row.organizationID);
                              setdeletePopup(false);
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

  const handleDelete = (organizationID) => {
    console.log(organizationID);
    let data = JSON.stringify({
      organizationID: organizationID,
      operation: "Delete",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_ORGANIZATION_MASTER,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setUserData((prevData) =>
          prevData.filter((user) => user.organizationID !== organizationID)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

            <div className="text-right mb-5 mr-5 relative sm:mr-0">
              <AiOutlineSearch className="absolute top-[13px] right-[232px] z-10 text-gray searchicon" />
              <input
                type="text"
                placeholder=" Search Users "
                className="border border-gray rounded-full px-7 py-2 search-user"
                onChange={handleFilter}
              />
            </div>
          </div>
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

export default OnBoding;
