import { useState } from "react";
import React from "react";
import { BiUserPlus } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import "../../Styles/Settings.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { GET_ALL_COUNTRY } from "../../Pages/Api";
import { CiMenuKebab } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import DataTable from "react-data-table-component";
const Users = () => {
  const [users, setUsers] = useState([
    {
      name: "Dhara",
      phoneEnabled: false,
      emailEnabled: true,
      roles: "Manager",
      screen: "Screen Access",
    },
    {
      name: "Dhara",
      phoneEnabled: false,
      emailEnabled: true,
      roles: "Manager",
      screen: "Screen Access",
    },
    {
      name: "Dhara",
      phoneEnabled: true,
      emailEnabled: false,
      roles: "Manager",
      screen: "Screen Access",
    },
    {
      name: "Dhara",
      phoneEnabled: false,
      emailEnabled: true,
      roles: "Manager",
      screen: "Screen Access",
    },
    // Add more users here...
  ]);

  const handlePhoneToggle = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].phoneEnabled = !updatedUsers[index].phoneEnabled;
    setUsers(updatedUsers);
  };

  const handleEmailToggle = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].emailEnabled = !updatedUsers[index].emailEnabled;
    setUsers(updatedUsers);
  };
  {
    /*model */
  }
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [showuserModal, setshowuserModal] = useState(false);
  const [userRoleData, setUserRoleData] = useState([]);
  const [selectRoleID, setSelectRoleID] = useState("");
  const [countries, setCountries] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(0);
  const [countryID, setCountryID] = useState(0);
  const [company, setCompany] = useState("");
  const [userData, setUserData] = useState([]);
  const [showActionBox, setShowActionBox] = useState(false);
  const [deletePopup, setdeletePopup] = useState(false);
  const [userID, setUserID] = useState("");
  const handleActionClick = (rowId) => {
    setUserID(rowId);
    setShowActionBox(rowId);
  };

  useEffect(() => {
    fetch(GET_ALL_COUNTRY)
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.data);
      })
      .catch((error) => {
        console.log("Error fetching country data:", error);
      });
  }, []);

  useEffect(() => {
    let data = JSON.stringify({
      mode: "Selectlist",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/OrganizationUsersRole/AddUpdateOrganizationUsersRole",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setUserRoleData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAddUser = () => {
    let data = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      isActive: isActive,
      orgUserID: 0,
      userRole: selectRoleID,
      countryID: countryID,
      company: company,
      operation: "Save",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/AddOrgUserMaster",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setshowuserModal(false);
        handleGetOrgUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleUpdateUser = () => {
    let data = JSON.stringify({
      orgUserSpecificID: userID,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      isActive: isActive,
      orgUserID: 0,
      userRole: selectRoleID,
      countryID: countryID,
      company: company,
      operation: "Save",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/AddOrgUserMaster",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setshowuserModal(false);
        handleGetOrgUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleGetOrgUsers = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/GetOrgUsers",
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        setUserData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleGetOrgUsers();
  }, []);
  const handleDeleteUser = (orgUserSpecificID) => {
    let data = JSON.stringify({
      orgUserSpecificID: orgUserSpecificID,
      operation: "DeleteByID",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/AddOrgUserMaster",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        handleGetOrgUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const selectUserById = (OrgUserSpecificID) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/UserMaster/GetOrgUsers?OrgUserSpecificID=${OrgUserSpecificID}`,
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const fetchedData = response.data.data;
        console.log(fetchedData);
        setFirstName(fetchedData.firstName);
        setLastName(fetchedData.lastName);
        setPhone(fetchedData.phone);
        setEmail(fetchedData.email);
        setCompany(fetchedData.company);
        setCountryID(fetchedData.countryID);
        setSelectRoleID(fetchedData.userRole);
        setIsActive(fetchedData.isActive);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },

    {
      name: "Roles",
      selector: (row) => row.userRoleName,
      sortable: true,
    },
    {
      name: "Notification",
      //selector: (row) => row.googleLocation,
      sortable: true,
    },
    {
      name: "Screen Access",
      //selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.isActive,
      sortable: true,
      cell: (row) => (
        <div>
          {row.isActive == 1 ? (
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
          <button onClick={() => handleActionClick(row.orgUserSpecificID)}>
            <CiMenuKebab />
          </button>
          {showActionBox === row.orgUserSpecificID && (
            <>
              <div className="actionpopup z-10 ">
                <button
                  onClick={() => setShowActionBox(false)}
                  className="bg-white absolute top-[-14px] left-[-8px] z-10  rounded-full drop-shadow-sm p-1"
                >
                  <AiOutlineClose />
                </button>

                <div className=" my-1">
                  <button
                    onClick={() => {
                      selectUserById(row.orgUserSpecificID);
                      setshowuserModal(true);
                    }}
                  >
                    Edit User
                  </button>
                </div>
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
                              handleDeleteUser(row.orgUserSpecificID);
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
  return (
    <>
      <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
        <div>
          <button
            className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 mb-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
            onClick={() => setshowuserModal(true)}
          >
            <BiUserPlus className="text-2xl mr-1" />
            Add New Users
          </button>
        </div>
        <div className="clear-both overflow-x-auto">
          <DataTable
            columns={columns}
            data={userData}
            fixedHeader
            pagination
            paginationPerPage={10}
          ></DataTable>
        </div>
      </div>

      {showuserModal && (
        <>
          <div className="backdrop">
            <div className="user-model">
              <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                <h1 className="text-lg font-medium text-primary">
                  Add New User
                </h1>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => setshowuserModal(false)}
                />
              </div>
              <hr className="border-gray " />
              <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">First Name</label>
                        <input
                          type="text"
                          placeholder="Enter User Name"
                          name="fname"
                          className="formInput"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter User Name"
                          name="lname"
                          className="formInput"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">Phone No</label>
                        <input
                          type="number"
                          placeholder="Enter Phone No"
                          name="phoneno"
                          className="formInput"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">Email</label>
                        <input
                          type="email"
                          placeholder="Enter Email Address"
                          name="email"
                          className="formInput"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">Company</label>
                        <input
                          type="text"
                          placeholder="Enter Company Name"
                          name="cname"
                          className="formInput"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">Country</label>
                        <select
                          className="formInput"
                          value={countryID}
                          onChange={(e) => setCountryID(e.target.value)}
                        >
                          <option label="select Country"></option>
                          {countries.map((country) => (
                            <option
                              key={country.countryID}
                              value={country.countryID}
                            >
                              {country.countryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">Screen Access</label>
                        <input
                          type="text"
                          placeholder="Enter Screen Access"
                          name="screenaccess"
                          className="formInput"
                        />
                      </div>
                    </div> */}
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="relative">
                        <label className="formLabel">Roles</label>
                        <select
                          className="formInput"
                          value={selectRoleID}
                          onChange={(e) => setSelectRoleID(e.target.value)}
                        >
                          <option label="select User Role"></option>
                          {userRoleData.map((userrole) => (
                            <option
                              key={userrole.orgUserRoleID}
                              value={userrole.orgUserRoleID}
                            >
                              {userrole.orgUserRole}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                      <div className="mt-3 flex items-center">
                        <label>isActive :</label>
                        <input
                          className="border border-primary ml-8 rounded h-6 w-6"
                          type="checkbox"
                          checked={isActive === 1}
                          onChange={(e) =>
                            setIsActive(e.target.checked ? 1 : 0)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-12 text-center">
                      <button
                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        onClick={() => setshowuserModal(false)}
                      >
                        Cancel
                      </button>
                      {userID == "" ? (
                        <button
                          onClick={() => {
                            handleAddUser();
                            setshowuserModal(false);
                          }}
                          className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleUpdateUser();
                            setshowuserModal(false);
                          }}
                          className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Users;
