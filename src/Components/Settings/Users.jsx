import { useState, useRef } from "react";
import React from "react";
import { BiLeftArrow, BiUserPlus } from "react-icons/bi";
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
import { IoIosArrowRoundBack, IoMdNotificationsOutline } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import toast from "react-hot-toast";

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
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userDetailData, setUserDetailData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  const modalRef = useRef(null);
  const actionPopupRef = useRef(null)

  const handleActionClick = (rowId) => {
    if (!showActionBox) {
      setUserID(rowId);
    } else {
      setUserID("");
    }
    setShowActionBox(!showActionBox);
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
    toast.loading("Fetching Data...");
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
        if (response?.data?.status == 200) {
          const fetchedData = response.data.data;
          setUserDetailData(fetchedData);
          setFirstName(fetchedData.firstName);
          setLastName(fetchedData.lastName);
          setPhone(fetchedData.phone);
          setEmail(fetchedData.email);
          setCompany(fetchedData.company);
          setCountryID(fetchedData.countryID);
          setSelectRoleID(fetchedData.userRole);
          setIsActive(fetchedData.isActive);
        }
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handleCancelPopup = () => {
    setshowuserModal(false);
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setCountryID("");
    setSelectRoleID("");
    setIsActive(0);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.firstName,
      sortable: true,
    },

    {
      name: "Roles",
      selector: (row) => row.userRoleName,
      sortable: true,
    },
    // {
    //   name: "Notification",
    //   //selector: (row) => row.googleLocation,
    //   sortable: true,
    // },
    // {
    //   name: "Screen Access",
    //   //selector: (row) => row.phone,
    //   sortable: true,
    // },
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
      name: "",
      cell: (row) => (
        <div className="relative">
          <button
            onClick={() => {
              handleActionClick(row.orgUserSpecificID);
            }}
          >
            <CiMenuKebab />
          </button>
          {showActionBox && userID === row.orgUserSpecificID && (
            <>
              <div ref={actionPopupRef} className="actionpopup z-10 ">
                {/* <button
                  onClick={() => setShowActionBox(false)}
                  className="bg-white absolute top-[-14px] left-[-8px] z-10  rounded-full drop-shadow-sm p-1"
                >
                  <AiOutlineClose />
                </button> */}
                <div  className=" my-1">
                  <button
                    onClick={() => {
                      selectUserById(row.orgUserSpecificID);
                      setShowUserProfile(true);
                    }}
                  >
                    View User
                  </button>
                </div>
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

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        // window.document.body.style.overflow = "unset";
        setshowuserModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setshowuserModal(false);
  }

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (
        actionPopupRef.current &&
        !actionPopupRef.current.contains(event?.target)
      ) {
        // window.document.body.style.overflow = "unset";
        setShowActionBox(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowActionBox(false);
  }

  return (
    <>
      {showuserModal && (
        <>
          <div className="backdrop">
            <div ref={modalRef} className="user-model">
              <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                <h1 className="text-lg font-medium text-primary">
                  Add New User
                </h1>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => {
                    handleCancelPopup();
                  }}
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
      {showUserProfile ? (
        <>
          <div className="lg:p-4 md:p-4 sm:p-2 xs:p-2 ">
            <h1
              onClick={() => setShowUserProfile(false)}
              className="font-medium flex cursor-pointer w-fit items-center lg:text-2xl md:text-2xl sm:text-xl mb-5"
            >
              <IoIosArrowRoundBack size={30} />
              User Information
            </h1>
            <div className="full flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <div className="card-shadow pt-6">
                  <div className="user-details text-center border-b border-b-[#E4E6FF]">
                    <span className="user-img flex justify-center mb-3">
                      <img src="../../../Settings/3user-img.png" />
                    </span>
                    <span className="user-name">
                      {userDetailData.firstName} {userDetailData.lastName}
                    </span>
                    <div className="user-designation my-2">
                      {userDetailData.userRoleName}
                    </div>
                    {/* <div className="total-screens-count my-4">
                      <span className="screen-icon me-3">
                        <img src="../../../Settings/screen-icon.svg" alt="" />
                      </span>
                      <span className="screen-count text-left">
                        <strong>50</strong>
                        <p>Total Screens</p>
                      </span>
                    </div> */}
                  </div>
                  <div className="user-pro-details">
                    <h3 className="user-name my-2">Details</h3>
                    <div className="flex">
                      <label className="font-semibold">User ID :</label>
                      <span className="ml-2">
                        {userDetailData.orgUserSpecificID}
                      </span>
                    </div>
                    <div className="flex">
                      <label className="font-semibold">User Name :</label>
                      <span className="ml-2">
                        {userDetailData.firstName} {userDetailData.lastName}
                      </span>
                    </div>
                    <div className="flex">
                      <label className="font-semibold">Company Name :</label>
                      <span className="ml-2">{userDetailData.company}</span>
                    </div>

                    <div className="flex">
                      <label className="font-semibold">Email :</label>
                      <span className="ml-2">{userDetailData.email}</span>
                    </div>

                    <div className="flex">
                      <label className="font-semibold">Status :</label>

                      {userDetailData.isActive == 1 ? (
                        <span className="ml-2 bg-lime-700 px-3 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="ml-2 bg-red px-3 rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex">
                      <label className="font-semibold">Role :</label>
                      <span className="ml-2">
                        {userDetailData.userRoleName}
                      </span>
                    </div>

                    {/* <div className="flex">
                      <label>Tax ID:</label>
                      <span>Tax-8894</span>
                    </div> */}
                    <div className="flex">
                      <label className="font-semibold">Contact :</label>
                      <span className="ml-2">{userDetailData.phone}</span>
                    </div>
                    {/* <div className="flex">
                      <label>Language:</label>
                      <span>English</span>
                    </div> */}
                    <div className="flex">
                      <label className="font-semibold">Country :</label>
                      <span className="ml-2">{userDetailData.countryName}</span>
                    </div>
                    <div className="flex justify-center w-full">
                      <button
                        onClick={() => {
                          setshowuserModal(true);
                          selectUserById(userDetailData.orgUserSpecificID);
                        }}
                        className="me-3 hover:bg-white hover:text-primary text-base px-8 py-2 border border-primary  shadow-md rounded-full bg-primary text-white "
                      >
                        Edit
                      </button>

                      {/* <button className="hover:bg-white hover:text-primary text-base px-8 py-3 border border-red shadow-md rounded-full text-red-900  bg-red-200 ">
                   
                        Suspend
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <div className="card-shadow pt-6">
                  <ul className="flex flex-wrap gap-3 items-center xs:mt-2 sm:mt-0 md:mt-0  lg:mt-0  xs:mr-1  mr-3  ">
                    <li>
                      <button
                        className={`inline-flex items-center
                          ${activeTab === 1 ? "tabactivebtn" : "tabbtn "}
                        `}
                        onClick={() => setActiveTab(1)}
                      >
                        <MdLockOutline className="text-primary text-lg mr-1" />
                        Security
                      </button>
                    </li>
                    <li>
                      <button
                        className={`inline-flex items-center
                          ${activeTab === 2 ? "tabactivebtn" : "tabbtn "}
                        `}
                        onClick={() => setActiveTab(2)}
                      >
                        <IoMdNotificationsOutline className="text-primary text-lg mr-1" />
                        Notifications
                      </button>
                    </li>
                    <li>
                      <button
                        className={`inline-flex items-center
                          ${activeTab === 3 ? "tabactivebtn" : "tabbtn "}
                        `}
                        onClick={() => setActiveTab(3)}
                      >
                        <IoIosLink className="text-primary text-lg mr-1" />
                        Connections
                      </button>
                    </li>
                  </ul>
                  <div className={activeTab === 1 ? "" : "hidden"}>
                    <div className="user-pro-details security-tab">
                      <h3 className="user-name my-6">Change Password</h3>
                      <div className="w-full py-9 mb-8 bg-light-red text-center">
                        <p className="mb-3">
                          <b>Ensure that these Requirements are met</b>
                        </p>
                        <p className=""> Minimum 8 characters long,</p>
                        <p> uppercase & symbol</p>
                      </div>
                      <div className="w-full mb-4">
                        <form
                          action=""
                          method="post"
                          name="signupForm"
                          id="signupForm"
                        >
                          <div class="inputDiv relative mb-5">
                            <label class="w-full inputLabel" for="password">
                              Old Password
                            </label>
                            <input
                              type="password"
                              className="w-full border border-[#D5E3FF] rounded-xl p-2"
                              con
                              id="password"
                              name="password"
                              required
                            />
                          </div>
                          <div class="inputDiv relative mb-5">
                            <label class="w-full inputLabel" for="password">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full border border-[#D5E3FF] rounded-xl p-2"
                              con
                              id="password"
                              name="password"
                              required
                            />
                          </div>

                          <div class="inputDiv relative mb-5">
                            <label class="inputLabel" for="confirmPassword">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              className="w-full border border-[#D5E3FF] rounded-xl p-2"
                              id="confirmPassword"
                              name="confirmPassword"
                            />
                          </div>

                          <div class="buttonWrapper">
                            <button
                              type="submit"
                              id="submitButton"
                              onclick="validateSignupForm()"
                              class="me-3 hover:bg-white hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
                            >
                              <span>Change Password</span>
                              <span id="loader"></span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className={activeTab === 2 ? "" : "hidden"}>
                    <div className="user-pro-details notifications-tab mt-4">
                      <h3 className="user-name ">Notifications</h3>
                      <p className="mb-3">
                        You will receive notification for the below selected
                        items.
                      </p>

                      <div className="w-full my-6">
                        <table class="min-w-full leading-normal border border-[#E4E6FF] bg-white mb-8">
                          <thead>
                            <tr className="border-b border-b-[#E4E6FF]">
                              <th class="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Type
                              </th>
                              <th class="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Send alerts
                              </th>
                              <th class="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                              </th>
                              <th class="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Phone
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-3 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="ml-3">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Screen Offline
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <div class="relative ">
                                  <select
                                    class="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Select </option>
                                    <option value="1">Item 1</option>
                                    <option value="2">Item 2</option>
                                    <option value="3">Item 3</option>
                                  </select>
                                  <div class="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="offline1">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="offline1" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="offline2">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="offline2" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-3 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="ml-3">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Purchased Plan
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <div class="relative ">
                                  <select
                                    class="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Instant </option>
                                    <option value="1">Item 1</option>
                                    <option value="2">Item 2</option>
                                    <option value="3">Item 3</option>
                                  </select>
                                  <div class="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="purchased-plan1">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="purchased-plan1" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="purchased-plan2">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="purchased-plan2" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-3 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="ml-3">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Added Users
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <div class="relative ">
                                  <select
                                    class="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">15 Minute </option>
                                    <option value="1">20 Minute</option>
                                    <option value="2">25 Minute</option>
                                    <option value="3">30 Minute</option>
                                  </select>
                                  <div class="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="added-users1">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="added-users1" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="added-users2">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="added-users2" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-3 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="ml-3">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Changing Details
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <div class="relative ">
                                  <input
                                    type="text"
                                    className="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    placeholder="Enter time (Minute)"
                                  />
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="changing-details1">
                                  <span class="checkbox__label"></span>
                                  <input
                                    type="checkbox"
                                    id="changing-details1"
                                  />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="changing-details2">
                                  <span class="checkbox__label"></span>
                                  <input
                                    type="checkbox"
                                    id="changing-details2"
                                  />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-3 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="ml-3">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Playlist
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <div class="relative ">
                                  <select
                                    class="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Select </option>
                                    <option value="1">Playlist 1</option>
                                    <option value="2">Playlist 2</option>
                                    <option value="3">Playlist 3</option>
                                  </select>
                                  <div class="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="Playlist1">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="Playlist1" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="Playlist2">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="Playlist2" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-3 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="ml-3">
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Assets
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <div class="relative ">
                                  <select
                                    class="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Select </option>
                                    <option value="1">Assets 1</option>
                                    <option value="2">Assets 2</option>
                                    <option value="3">Assets 3</option>
                                  </select>
                                  <div class="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      class="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="Assets1">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="Assets1" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td class="px-5 py-3 text-sm">
                                <label class="checkbox" for="Assets2">
                                  <span class="checkbox__label"></span>
                                  <input type="checkbox" id="Assets2" />
                                  <div class="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div class="buttonWrapper flex justify-center  w-full">
                          <button
                            type="submit"
                            id="submitButton"
                            onclick="validateSignupForm()"
                            class="me-3 hover:bg-white hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
                          >
                            <span>Save Change</span>
                          </button>
                          <button className="hover:bg-white hover:text-primary text-base px-8 py-3 border border-red shadow-md rounded-full text-red-900  bg-red-200 ">
                            Discard
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={activeTab === 3 ? "" : "hidden"}>
                    <div className="user-pro-details connections-tab mt-3">
                      <h3 className="user-name ">Connected Accounts</h3>
                      <p className="mb-2">
                        Display content from your connected accounts on your
                        site.
                      </p>

                      <div className="w-full my-6">
                        <table class="min-w-full leading-normal border border-[#E4E6FF] bg-white mb-4">
                          <thead>
                            <tr className="border-b border-b-[#E4E6FF]">
                              <th class="px-5 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                Apps
                              </th>
                              <th class="px-5 py-3 text-right text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-2 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="flex-shrink-0 w-10 h-10">
                                    <img
                                      class="w-full h-full rounded-full"
                                      src="../../../Settings/Google__G__Logo.svg"
                                      alt=""
                                    />
                                  </div>
                                  <div class="ml-3 text-left">
                                    <strong>Google</strong>
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Calendar and contacts
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-2 text-sm text-right">
                                <span class="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight rounded-full">
                                  Connect
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-2 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="flex-shrink-0 w-10 h-10">
                                    <img
                                      class="w-full h-full rounded-full"
                                      src="../../../Settings/Slack_Technologies_Logo.svg"
                                      alt=""
                                    />
                                  </div>
                                  <div class="ml-3 text-left">
                                    <strong>Slack</strong>
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Communication
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-2 text-sm text-right">
                                <span class="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full">
                                  Disconnect
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <h3 className="user-name ">Social Accounts</h3>
                        <p className="mb-3">
                          Display content from social accounts on your site.
                        </p>

                        <table class="min-w-full leading-normal border border-[#E4E6FF] bg-white mb-6">
                          <tbody>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-3 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="flex-shrink-0 w-10 h-10">
                                    <img
                                      class="w-full h-full rounded-full"
                                      src="../../../Settings/facebook-logo.svg"
                                      alt=""
                                    />
                                  </div>
                                  <div class="ml-3 text-left">
                                    <strong>Facebook</strong>
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Not connected
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-2 text-sm">
                                <a href="#" className="link-icon-bg">
                                  <img src="../../../Settings/link-icon.svg" />
                                </a>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-2 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="flex-shrink-0 w-10 h-10">
                                    <img
                                      class="w-full h-full rounded-full"
                                      src="../../../Settings/twitter-logo.svg"
                                      alt=""
                                    />
                                  </div>
                                  <div class="ml-3 text-left">
                                    <strong>Twitter</strong>
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      @Pixinvent
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-2 text-sm">
                                <a href="#" className="delete-icon-bg">
                                  <img src="../../../Settings/delete.svg" />
                                </a>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td class="px-5 py-2 bg-white text-sm">
                                <div class="flex items-center">
                                  <div class="flex-shrink-0 w-10 h-10">
                                    <img
                                      class="w-full h-full rounded-full"
                                      src="../../../Settings/dribbble-logo.svg"
                                      alt=""
                                    />
                                  </div>
                                  <div class="ml-3 text-left">
                                    <strong>Dribbble</strong>
                                    <p class="text-gray-900 whitespace-no-wrap">
                                      Not connected
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td class="px-5 py-2 text-sm">
                                <a href="#" className="delete-icon-bg">
                                  <img src="../../../Settings/delete.svg" />
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div class="buttonWrapper flex justify-center  w-full">
                          <button
                            type="submit"
                            id="submitButton"
                            onclick="validateSignupForm()"
                            class="me-3 hover:bg-white hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
                          >
                            <span>Save Change</span>
                          </button>
                          <button className="hover:bg-white hover:text-primary text-base px-8 py-3 border border-red shadow-md rounded-full text-red-900  bg-red-200 ">
                            Discard
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2 w-full">
            <h3 class="user-name my-4">Selected Screens</h3>
            <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table class="min-w-full leading-normal">
                <thead>
                  <tr className=" bg-[#EFF3FF] border-b border-b-[#E4E6FF]">
                    <th class="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Screen Name
                    </th>
                    <th class="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Google Location
                    </th>
                    <th class="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Associated Schedule
                    </th>

                    <th class="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Tags
                    </th>
                    <th class="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Group
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td class="p-3 bg-white text-sm">
                      <label class="checkbox" for="screen1">
                        <span class="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen1" />
                        <div class="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span class="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">Add Tags</td>
                    <td class="px-3 py-6 bg-white text-sm flex ">Group Name</td>
                  </tr>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td class="p-3 bg-white text-sm">
                      <label class="checkbox" for="screen2">
                        <span class="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen2" />
                        <div class="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span class="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">Add Tags</td>
                    <td class="px-3 py-6 bg-white text-sm flex ">Group Name</td>
                  </tr>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td class="p-3 bg-white text-sm">
                      <label class="checkbox" for="screen3">
                        <span class="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen3" />
                        <div class="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span class="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">Add Tags</td>
                    <td class="px-3 py-6 bg-white text-sm flex ">Group Name</td>
                  </tr>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td class="p-3 bg-white text-sm">
                      <label class="checkbox" for="screen4">
                        <span class="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen4" />
                        <div class="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">
                      <p class="text-gray-900 whitespace-no-wrap">
                        <span class="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td class="p-3 bg-white text-sm">Add Tags</td>
                    <td class="px-3 py-6 bg-white text-sm flex ">Group Name</td>
                  </tr>
                </tbody>
              </table>
              <div class="px-5 py-5 bg-white flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span class="text-xs xs:text-sm text-gray-900">
                  Showing 1 to 4 of 50 Entries
                </span>
                <div class="inline-flex mt-2 xs:mt-0">
                  <button class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                    Prev
                  </button>
                  <button class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
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
        </>
      )}
    </>
  );
};

export default Users;
