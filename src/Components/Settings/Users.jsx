import { useState, useRef } from "react";
import React from "react";
import { BiEdit, BiSolidUser, BiUserPlus } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../Styles/Settings.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CHNAGE_PASSWORD, GET_ALL_COUNTRY, GET_SELECT_BY_STATE, USER_UPDATE_PASSWORD } from "../../Pages/Api";
import {
  RiUser3Fill,
} from "react-icons/ri";
import { IoIosArrowRoundBack, IoMdNotificationsOutline } from "react-icons/io";
import {
  MdDeleteForever,
  MdLockOutline,
} from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import toast from "react-hot-toast";
import {
  BsEye,
  BsEyeFill,
  BsFillEyeFill,
  BsFillEyeSlashFill,
} from "react-icons/bs";
import {
  handleGetCountries,
  handleUserDelete,
  resetStatus,
  handleAddNewUser,
} from "../../Redux/SettingUserSlice";
import user_pic from "../../images/Settings/3user-img.png";
import link_icon from "../../images/Settings/link-icon.svg";
import deleteImg from "../../images/Settings/delete.svg";
import google_logo from "../../images/Settings/Google__G__Logo.svg";
import slack from "../../images/Settings/Slack_Technologies_Logo.svg";
import facebook from "../../images/Settings/facebook-logo.svg";
import twitter from "../../images/Settings/twitter-logo.svg";
import dribble from "../../images/Settings/dribbble-logo.svg";
import Swal from "sweetalert2";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { FiPauseCircle } from "react-icons/fi";


const Users = ({ searchValue }) => {
  const [loadFist, setLoadFist] = useState(true);

  const [showuserModal, setshowuserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userRoleData, setUserRoleData] = useState([]);
  const [selectRoleID, setSelectRoleID] = useState("");
  const [countries, setCountries] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(0);
  const [countryID, setCountryID] = useState(0);
  const [company, setCompany] = useState("");
  const [userData, setUserData] = useState([]);
  const [showActionBox, setShowActionBox] = useState(false);
  const [deletePopup, setdeletePopup] = useState(false);
  const [userID, setUserID] = useState();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userDetailData, setUserDetailData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [file, setFile] = useState();
  const [fileEdit, setFileEdit] = useState("");
  const [labelTitle, setLabelTitle] = useState("Add New User");
  const [zipCode, setZipCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);

  // Error
  const [passowrdErrors, setErrorsPassword] = useState("");
  const [emailErrors, setErrorsEmail] = useState("");
  const [errorsFirstName, setErrorsFirstName] = useState("");
  const [errorsLastName, setErrorsLastName] = useState("");
  const [errorsRole, setErrorsRole] = useState("");

  const { token } = useSelector((state) => state.root.auth);
  const { Countries } = useSelector((s) => s.root.settingUser);
  const store = useSelector((state) => state.root.settingUser);
  const authToken = `Bearer ${token}`;

  const [currentPasswordShow, setCurrentPassword] = useState(false);
  const [newPasswordShow, setNewPassword] = useState(false);
  const [confirmPasswordShow, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const hiddenFileInput = useRef(null);
  const modalRef = useRef(null);
  const actionPopupRef = useRef(null);

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);

  // Filter data based on search term
  const filteredData = userData.filter((item) =>
    Object.values(item).some((value) => value && value.toString().toLowerCase().includes(searchValue.toLowerCase())));
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


  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      )
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm New Password is required"),
  });

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

  const handleActionClick = (rowId) => {
    if (!showActionBox) {
      setUserID(rowId);
    } else {
      setUserID();
    }
    setShowActionBox(!showActionBox);
  };

  useEffect(() => {
    dispatch(handleGetCountries());
  }, []);

  useEffect(() => {
    if (countryID) {
      fetch(`${GET_SELECT_BY_STATE}?CountryID=${countryID}`)
        .then((response) => response.json())
        .then((data) => {
          setStates(data.data);
        })
        .catch((error) => {
          console.log("Error fetching states data:", error);
        });
    }
  }, [countryID]);

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
    // Clear previous validation errors
    setErrorsFirstName("");
    setErrorsLastName("");
    setErrorsPassword("");
    setErrorsEmail("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let data = new FormData();

    if (!password) {
      setErrorsPassword("Password is required");
      return;
    }

    // Check validation for firstName
    if (!firstName) {
      setErrorsFirstName("First Name is required");
      return;
    }

    // Check validation for lastName
    if (!lastName) {
      setErrorsLastName("Last Name is required");
      return;
    }

    // Check validation for password
    if (!password) {
      setErrorsPassword("Password is required");
      return;
    }

    // Check validation for email format
    if (!emailRegex.test(email)) {
      setErrorsEmail("Not a valid email");
      return;
    }

    // Check validation for role
    if (!selectRoleID) {
      setErrorsRole("Please select a role");
      return;
    }

    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("password", password);
    data.append("email", email);
    data.append("phone", phone);
    data.append("isActive", isActive);
    data.append("orgUserID", 0);
    data.append("userRole", selectRoleID);
    data.append("countryID", countryID ? countryID : 0);
    data.append("StateId", selectedState ? selectedState : 0);
    data.append("ZipCode", zipCode ? zipCode : 0);
    data.append("File", file);
    data.append("languageId", 0);
    data.append("timeZoneId", 0);
    data.append("currencyId", 0);
    data.append("IsFromUserMaster", 1);
    data.append("operation", "Save");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/AddOrgUserMaster",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: authToken,
      },
      data: data,
    };

    try {
      dispatch(handleAddNewUser({ config }));
      setshowuserModal(false);
      handleCancelPopup();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdateUser = () => {
    // Clear previous validation errors
    setErrorsFirstName("");
    setErrorsLastName("");
    setErrorsRole("")

    // Check validation for firstName
    if (!firstName) {
      setErrorsFirstName("First Name is required");
      return;
    }

    // Check validation for lastName
    if (!lastName) {
      setErrorsLastName("Last Name is required");
      return;
    }

    // Check validation for role
    if (!selectRoleID) {
      setErrorsRole("Please select a role");
      return;
    }

    let data = new FormData();
    data.append("orgUserSpecificID", userID);
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    // data.append("password", password);
    // data.append("email", email);
    data.append("phone", phone);
    data.append("isActive", isActive);
    data.append("orgUserID", 0);
    data.append("userRole", selectRoleID);
    data.append("countryID", countryID ? countryID : 0);
    data.append("StateId", selectedState ? selectedState : 0);
    data.append("company", company);
    data.append("ZipCode", zipCode ? zipCode : 0);
    data.append("File", file);
    data.append("languageId", 0);
    data.append("timeZoneId", 0);
    data.append("currencyId", 0);
    data.append("IsFromUserMaster", 1);
    data.append("operation", "Save");

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/AddOrgUserMaster",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setshowuserModal(false);
        selectUserById(userID)
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
        setUserData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (loadFist) {
      handleGetOrgUsers();
      setLoadFist(false);
    }

    if (store && store.status) {
      setLoadFist(true);
      dispatch(resetStatus());
    }

    if (store && store.status === "succeeded") {
      toast.success(store.message);
    }

    if (store && store.status === "failed") {
      toast.error(store.message);
    }
  }, [loadFist, store, dispatch]);

  const handleDeleteUser = (orgUserSpecificID) => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://disployapi.thedestinysolutions.com/api/UserMaster/DeleteOrgUser?OrgUserSpecificID=${orgUserSpecificID}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    };

    Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this User?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel",
      confirmButtonText: "Yes, I'm sure",
      customClass: {
        text: "swal-text-bold",
        content: "swal-text-color",
        confirmButton: "swal-confirm-button-color",
      },
      confirmButtonColor: "#ff0000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(handleUserDelete({ config }));
      } else {
        // User clicked "No, cancel" button
        setLoadFist(true); // Trigger your action on cancel
      }
    });
  };

  const selectUserById = (OrgUserSpecificID) => {
    setLabelTitle("Update User");
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
          setPassword("");
          setFileEdit(fetchedData.profilePhoto);
          setIsImageUploaded(true);
          setPhone(fetchedData.phone);
          setEmail(fetchedData.email);
          setCompany(fetchedData.company);
          setCountryID(fetchedData.countryID);
          setSelectedState(fetchedData.stateId);
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
    setLabelTitle("Add New User");
    setUserID();
    setshowuserModal(false);
    setFirstName("");
    setLastName("");
    setPassword("");
    setFileEdit();
    setFile(null);
    setIsImageUploaded(false);
    setPhone("");
    setEmail("");
    setCompany("");
    setZipCode("");
    setCountryID("");
    setSelectedState("");
    setSelectRoleID("");
    setIsActive(0);
    setLabelTitle("Add New User")
    setLoadFist(true)
  };


  const handleFileChange = (e) => {
    setFileEdit();
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setIsImageUploaded(true);
  };

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setshowuserModal(false);
        handleCancelPopup();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setshowuserModal(false);
    handleCancelPopup();
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionPopupRef.current &&
        !actionPopupRef.current.contains(event?.target)
      ) {
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


  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          userID: userID,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };

        const config = {
          method: "post", // Change method to 'put' for changing the password
          url: USER_UPDATE_PASSWORD, // Assuming CHNAGE_PASSWORD is your API endpoint
          headers: {
            Authorization: authToken,
          },
          params: {
            userID: payload.userID,
            OldPassowrd: payload.currentPassword, // Note: Typo in OldPassword corrected
            NewPassword: payload.newPassword,
          },
          maxBodyLength: Infinity,
        };

        const response = await axios.request(config);
        if (response.status) {
          formik.resetForm()
          toast.success("Password Update")
        }
      } catch (error) {
        console.error("Error updating password:", error.message);
        toast.error("Error updating password. Please try again.");
      } finally {
        console.log("------------- YES --------------- Password Update ");
      }
    },
  });


  return (
    <>
      {showuserModal && (
        <div className="backdrop">
          <div ref={modalRef} className="user-model">
            <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
              <h1 className="text-lg font-medium text-primary">{labelTitle}</h1>
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
                      {errorsFirstName && (
                        <p className="error">{errorsFirstName}</p>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="relative">
                      <label className="formLabel">Last Name </label>
                      <input
                        type="text"
                        placeholder="Enter User Name"
                        name="lname"
                        className="formInput"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      {errorsLastName && (
                        <p className="error">{errorsLastName}</p>
                      )}
                    </div>
                  </div>

                  {labelTitle !== "Update User" && (
                    <>
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
                          {emailErrors ? (
                            <p className="error">{emailErrors}</p>
                          ) : null}
                        </div>
                      </div>

                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter User Password"
                            name="fname"
                            className="formInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          {passowrdErrors ? (
                            <p className="error">{passowrdErrors}</p>
                          ) : null}
                          <div className="icon">
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
                        </div>
                      </div>
                    </>
                  )}

                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="relative">
                      <label className="formLabel">Phone No</label>
                      <input
                        type="number"
                        placeholder="Enter Phone No"
                        name="phoneno"
                        className="formInput"
                        value={phone}
                        maxLength="10"
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setPhone(e.target.value);
                          }
                        }}
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
                      <label className="formLabel">Zip Code</label>
                      <input
                        type="text"
                        placeholder="Enter zip code"
                        name="zipcode"
                        className="formInput"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
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
                        {Countries.map((country) => (
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
                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="relative">
                      <label className="formLabel">State</label>
                      <select
                        className="formInput"
                        onChange={(e) => setSelectedState(e.target.value)}
                        value={selectedState}
                      >
                        <option label="select State"></option>
                        {countryID &&
                          Array.isArray(states) &&
                          states.map((state) => (
                            <option key={state.stateId} value={state.stateId}>
                              {state.stateName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="relative">
                      <label className="formLabel">Roles</label>
                      <select
                        className="formInput"
                        value={selectRoleID}
                        onChange={(e) => setSelectRoleID(e.target.value)}
                      >
                        <option label="select User Role"></option>
                        {userRoleData && userRoleData?.length > 0 ? (
                          userRoleData.map((userrole) => (
                            <option
                              key={userrole?.orgUserRoleID}
                              value={userrole?.orgUserRoleID}
                            >
                              {userrole.orgUserRole}
                            </option>
                          ))
                        ) : (
                          <div>Data not here.</div>
                        )}
                      </select>
                      {errorsRole && <p className="error">{errorsRole}</p>}
                    </div>
                  </div>

                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="flex items-center">
                      <div className="layout-img me-5">
                        {file ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded"
                            className="w-10 rounded-lg"
                          />
                        ) : null}

                        {fileEdit && userID ? (
                          <img
                            src={fileEdit}
                            alt="Uploaded"
                            className="w-10 rounded-lg"
                          />
                        ) : null}
                      </div>

                      <div className="layout-detaills">
                        <div className="flex">
                          <button
                            className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3 "
                            onClick={handleClick}
                          >
                            Profile photo
                          </button>
                          <input
                            type="file"
                            id="upload-button"
                            style={{ display: "none" }}
                            ref={hiddenFileInput}
                            onChange={(e) => handleFileChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="mt-3 flex items-center">
                      <label>isActive :</label>
                      <input
                        className="border border-primary ml-8 rounded h-6 w-6"
                        type="checkbox"
                        checked={isActive === 1}
                        onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 text-center">
                    <button
                      className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                      onClick={() => {
                        setshowuserModal(false);
                        handleCancelPopup();
                      }}
                    >
                      Cancel
                    </button>
                    {labelTitle !== "Update User" ? (
                      <button
                        onClick={() => {
                          handleAddUser();
                        }}
                        className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleUpdateUser();
                        }}
                        className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUserProfile ? (
        <>
          <div className="lg:p-4 md:p-4 sm:p-2 xs:p-2 ">
            <h1
              onClick={() => {
                setShowUserProfile(false);
                setLoadFist(true);
              }}
              className="font-medium flex cursor-pointer w-fit items-center lg:text-2xl md:text-2xl sm:text-xl mb-5"
            >
              <IoIosArrowRoundBack size={30} />
              User Information
            </h1>
            <div className="full flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <div className="card-shadow pt-6 text-[#5E5E5E]">
                  <div className="user-details text-center border-b border-b-[#E4E6FF]">
                    <span className="user-img flex justify-center mb-3">
                      {userDetailData.profilePhoto ? (
                        <img
                          src={userDetailData?.profilePhoto}
                          className="w-30 h-25 mb-3 rounded shadow-lg"
                          style={{ width: '200px', height: '185px' }}
                        />
                      ) : (
                        <BiSolidUser className="w-20 h-20" />
                      )}
                    </span>
                    <span className="user-name text-gray-900 dark:text-white font-semibold capitalize">
                      {userDetailData.firstName} {userDetailData.lastName}
                    </span>
                    <div className="user-designation my-2">
                      <span
                        style={{ backgroundColor: "#cee9d6" }}
                        className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                      >
                        {userDetailData.userRoleName}
                      </span>
                    </div>
                  </div>
                  <div className="user-pro-details mt-10">
                    <h3 className="user-name my-2">Details</h3>

                    <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 mt-4">
                      {/* User ID : */}
                      <div className="font-semibold">
                        <span>User ID : </span>
                      </div>
                      <div className="col-span-2">
                        <span>{userDetailData.orgUserSpecificID}</span>
                      </div>
                      {/* User Name  */}
                      <div className="font-semibold">
                        <span>User Name : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData.firstName} {userDetailData.lastName}</span>
                      </div>

                      {/* Company Name  */}
                      <div className="font-semibold">
                        <span>Company Name : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData.company}</span>
                      </div>

                      {/* Email   */}
                      <div className="font-semibold">
                        <span>Email : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData.email}</span>
                      </div>

                      {/* Status   */}
                      <div className="font-semibold">
                        <span>Status : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span>
                          {userDetailData.isActive == 1 ? (
                            <span
                              style={{ backgroundColor: "#cee9d6" }}
                              className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                            >
                              Active
                            </span>
                          ) : (
                            <span
                              style={{ backgroundColor: "#cee9d6" }}
                              className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                            >
                              Inactive
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Role   */}
                      <div className="font-semibold">
                        <span>Role : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData.userRoleName}</span>
                      </div>

                      {/* Contact   */}
                      <div className="font-semibold">
                        <span>Contact : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData.phone}</span>
                      </div>

                       {/* language */}
                       <div className="font-semibold">
                        <span>Language : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span>English</span>
                      </div>

                      {/* Country   */}
                      <div className="font-semibold">
                        <span>Country : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData.countryName}</span>
                      </div>

                    </div>


                    <div className="flex justify-center w-full mt-10">
                      <button
                        onClick={() => {
                          setshowuserModal(true);
                          selectUserById(userDetailData.orgUserSpecificID);
                        }}
                        className="me-3 hover:bg-white hover:text-primary text-base px-8 py-2 border border-primary  shadow-md rounded-full bg-primary text-white ">
                        Edit Profile
                      </button>
                      <button className="hover:text-#ffbebe px-8 py-3 border border-red shadow-md rounded-full text-red-600 text-1xl font-semibold bg-[#ffbebe] ">
                        Suspend
                      </button>
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
                          className="space-y-2"
                          action="#"
                          onSubmit={formik.handleSubmit}
                        >
                          <div className="relative">
                            <label className="label_top text-sm font-medium text-gray-900 dark:text-white">
                              Current Password
                            </label>
                            <input
                              type={currentPasswordShow ? "text" : "password"}
                              name="currentPassword"
                              id="currentPassword"
                              className=" border  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Enter Current Password"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.currentPassword}
                            />
                            <div className="icon mt-3">
                              {currentPasswordShow ? (
                                <BsFillEyeFill
                                  onClick={() => setCurrentPassword(!currentPasswordShow)}
                                />
                              ) : (
                                <BsFillEyeSlashFill
                                  onClick={() => setCurrentPassword(!currentPasswordShow)}
                                />
                              )}
                            </div>
                          </div>
                          {formik.touched.currentPassword &&
                            formik.errors.currentPassword ? (
                            <div className="text-red-500 error">
                              {formik.errors.currentPassword}
                            </div>
                          ) : null}
                          <div className="relative">
                            <label className="label_top text-sm font-medium text-gray-900 dark:text-white">
                              New Password
                            </label>
                            <input
                              type={newPasswordShow ? "text" : "password"}
                              name="newPassword"
                              id="newPassword"
                              placeholder="Enter New Password"
                              className=" border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.password}
                            />
                            <div className="icon mt-3">
                              {newPasswordShow ? (
                                <BsFillEyeFill
                                  onClick={() => setNewPassword(!newPasswordShow)}
                                />
                              ) : (
                                <BsFillEyeSlashFill
                                  onClick={() => setNewPassword(!newPasswordShow)}
                                />
                              )}
                            </div>
                          </div>
                          {formik.touched.newPassword && formik.errors.newPassword ? (
                            <div className="text-red-500 error">
                              {formik.errors.newPassword}
                            </div>
                          ) : null}
                          <div className="relative">
                            <label className="label_top text-sm font-medium text-gray-900 dark:text-white">
                              Confirm password
                            </label>
                            <input
                              type={confirmPasswordShow ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              placeholder="Enter Confirm New Password"
                              className=" border  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.password}
                            />
                            <div className="icon mt-3">
                              {confirmPasswordShow ? (
                                <BsFillEyeFill
                                  onClick={() => setConfirmPassword(!confirmPasswordShow)}
                                />
                              ) : (
                                <BsFillEyeSlashFill
                                  onClick={() => setConfirmPassword(!confirmPasswordShow)}
                                />
                              )}
                            </div>
                          </div>
                          {formik.touched.confirmPassword &&
                            formik.errors.confirmPassword ? (
                            <div className="text-red-500 error">
                              {formik.errors.confirmPassword}
                            </div>
                          ) : null}
                          <div className="md:w-full flex pt-7">
                            <button
                              className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                              disabled={loading}
                            >
                              {loading ? "Saving..." : "Save Changes"}
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
                        <table className="min-w-full leading-normal border border-[#E4E6FF] bg-white mb-8">
                          <thead>
                            <tr className="border-b border-b-[#E4E6FF]">
                              <th className="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Send alerts
                              </th>
                              <th className="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-5 py-4 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                                Phone
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-3 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Screen Offline
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <div className="relative ">
                                  <select
                                    className="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Select </option>
                                    <option value="1">Item 1</option>
                                    <option value="2">Item 2</option>
                                    <option value="3">Item 3</option>
                                  </select>
                                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      className="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="offline1">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="offline1" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="offline2">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="offline2" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-3 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Purchased Plan
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <div className="relative ">
                                  <select
                                    className="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Instant </option>
                                    <option value="1">Item 1</option>
                                    <option value="2">Item 2</option>
                                    <option value="3">Item 3</option>
                                  </select>
                                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      className="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label
                                  className="checkbox"
                                  for="purchased-plan1"
                                >
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="purchased-plan1" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label
                                  className="checkbox"
                                  for="purchased-plan2"
                                >
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="purchased-plan2" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-3 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Added Users
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <div className="relative ">
                                  <select
                                    className="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">15 Minute </option>
                                    <option value="1">20 Minute</option>
                                    <option value="2">25 Minute</option>
                                    <option value="3">30 Minute</option>
                                  </select>
                                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      className="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="added-users1">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="added-users1" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="added-users2">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="added-users2" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-3 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Changing Details
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <div className="relative ">
                                  <input
                                    type="text"
                                    className="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    placeholder="Enter time (Minute)"
                                  />
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label
                                  className="checkbox"
                                  for="changing-details1"
                                >
                                  <span className="checkbox__label"></span>
                                  <input
                                    type="checkbox"
                                    id="changing-details1"
                                  />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label
                                  className="checkbox"
                                  for="changing-details2"
                                >
                                  <span className="checkbox__label"></span>
                                  <input
                                    type="checkbox"
                                    id="changing-details2"
                                  />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-3 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Playlist
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <div className="relative ">
                                  <select
                                    className="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Select </option>
                                    <option value="1">Playlist 1</option>
                                    <option value="2">Playlist 2</option>
                                    <option value="3">Playlist 3</option>
                                  </select>
                                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      className="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="Playlist1">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="Playlist1" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="Playlist2">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="Playlist2" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-3 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Assets
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <div className="relative ">
                                  <select
                                    className="appearance-none w-full py-1 px-2 border border-[#E4E6FF] rounded-md bg-white"
                                    name="whatever"
                                    id="frm-whatever"
                                  >
                                    <option value="">Select </option>
                                    <option value="1">Assets 1</option>
                                    <option value="2">Assets 2</option>
                                    <option value="3">Assets 3</option>
                                  </select>
                                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 ">
                                    <svg
                                      className="h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="Assets1">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="Assets1" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                              <td className="px-5 py-3 text-sm">
                                <label className="checkbox" for="Assets2">
                                  <span className="checkbox__label"></span>
                                  <input type="checkbox" id="Assets2" />
                                  <div className="checkbox__indicator"></div>
                                </label>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="buttonWrapper flex justify-center  w-full">
                          <button
                            type="submit"
                            id="submitButton"
                            onclick="validateSignupForm()"
                            className="me-3 hover:bg-white hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
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
                        <table className="min-w-full leading-normal border border-[#E4E6FF] bg-white mb-4">
                          <thead>
                            <tr className="border-b border-b-[#E4E6FF]">
                              <th className="px-5 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                Apps
                              </th>
                              <th className="px-5 py-3 text-right text-lg font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-2 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-10 h-10">
                                    <img
                                      className="w-full h-full rounded-full"
                                      src={google_logo}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-3 text-left">
                                    <strong>Google</strong>
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Calendar and contacts
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-2 text-sm text-right">
                                <span className="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight rounded-full">
                                  Connect
                                </span>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-2 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-10 h-10">
                                    <img
                                      className="w-full h-full rounded-full"
                                      src={slack}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-3 text-left">
                                    <strong>Slack</strong>
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Communication
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-2 text-sm text-right">
                                <span className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full">
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

                        <table className="min-w-full leading-normal border border-[#E4E6FF] bg-white mb-6">
                          <tbody>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-3 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-10 h-10">
                                    <img
                                      className="w-full h-full rounded-full"
                                      src={facebook}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-3 text-left">
                                    <strong>Facebook</strong>
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Not connected
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-2 text-sm">
                                <a href="#" className="link-icon-bg">
                                  <img src={link_icon} />
                                </a>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-2 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-10 h-10">
                                    <img
                                      className="w-full h-full rounded-full"
                                      src={twitter}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-3 text-left">
                                    <strong>Twitter</strong>
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      @Pixinvent
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-2 text-sm">
                                <a href="#" className="delete-icon-bg">
                                  <img src={deleteImg} />
                                </a>
                              </td>
                            </tr>
                            <tr className="border-b border-b-[#E4E6FF] bg-white">
                              <td className="px-5 py-2 bg-white text-sm">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-10 h-10">
                                    <img
                                      className="w-full h-full rounded-full"
                                      src={dribble}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-3 text-left">
                                    <strong>Dribbble</strong>
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      Not connected
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-2 text-sm">
                                <a href="#" className="delete-icon-bg">
                                  <img src={deleteImg} />
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="buttonWrapper flex justify-center  w-full">
                          <button
                            type="submit"
                            id="submitButton"
                            onclick="validateSignupForm()"
                            className="me-3 hover:bg-white hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
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
          </div >
          <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2 w-full">
            <h3 className="user-name my-4">Selected Screens</h3>
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className=" bg-[#EFF3FF] border-b border-b-[#E4E6FF]">
                    <th className="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Screen Name
                    </th>
                    <th className="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Google Location
                    </th>
                    <th className="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Associated Schedule
                    </th>

                    <th className="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-3 py-6 text-left text-md font-semibold text-gray-600 uppercase tracking-wider">
                      Group
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td className="p-3 bg-white text-sm">
                      <label className="checkbox" for="screen1">
                        <span className="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen1" />
                        <div className="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <span className="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">Add Tags</td>
                    <td className="px-3 py-6 bg-white text-sm flex ">
                      Group Name
                    </td>
                  </tr>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td className="p-3 bg-white text-sm">
                      <label className="checkbox" for="screen2">
                        <span className="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen2" />
                        <div className="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <span className="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">Add Tags</td>
                    <td className="px-3 py-6 bg-white text-sm flex ">
                      Group Name
                    </td>
                  </tr>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td className="p-3 bg-white text-sm">
                      <label className="checkbox" for="screen3">
                        <span className="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen3" />
                        <div className="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <span className="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">Add Tags</td>
                    <td className="px-3 py-6 bg-white text-sm flex ">
                      Group Name
                    </td>
                  </tr>
                  <tr className="border-b border-b-[#E4E6FF]">
                    <td className="p-3 bg-white text-sm">
                      <label className="checkbox" for="screen4">
                        <span className="checkbox__label">Harry McCall</span>
                        <input type="checkbox" id="screen4" />
                        <div className="checkbox__indicator"></div>
                      </label>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        132, My Street, Kingston, New York 12401.
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Schedule Name Till 28 June 2023
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <span className="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                          Live
                        </span>
                      </p>
                    </td>
                    <td className="p-3 bg-white text-sm">Add Tags</td>
                    <td className="px-3 py-6 bg-white text-sm flex ">
                      Group Name
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="px-5 py-5 bg-white flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing 1 to 4 of 50 Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                    Prev
                  </button>
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
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
              <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2">
                {/* <div>
                  <input
                    type="text"
                    id="small-input"
                    placeholder="Search User Name..."
                    class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div> */}

                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal" cellPadding={20}>
                    <thead>
                      <tr className="border-b border-b-[#E4E6FF] bg-[#EFF3FF]">
                        <th className="text-[#5A5881] text-base font-semibold">
                          <span className="flex items-center justify-left">
                            UserName
                            <svg
                              className="w-3 h-3 ms-1.5 cursor-pointer"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              onClick={() => handleSort("firstName")}
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </span>
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold">
                          <span className="flex items-center justify-center">
                            Roles
                          </span>
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold">
                          <div className="flex items-center justify-center">
                            Status
                          </div>
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold">
                          <div className="flex items-center justify-center">
                            Action
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData && sortedAndPaginatedData.length > 0 ? (
                        sortedAndPaginatedData.map((item, index) => {
                          return (
                            <tr className="border-b border-b-[#E4E6FF] p-4 mb-4 rounded-lg bg-white shadow-md" key={index}>
                              <th className="text-[#5E5E5E] text-center flex">
                                {item?.profilePhoto ? (
                                  <img
                                    className="w-10 h-10 rounded-full"
                                    src={item?.profilePhoto}
                                    alt="Jese image"
                                  />
                                ) : (
                                  <RiUser3Fill className="w-10 h-10" />
                                )}
                                <div className="ps-3 flex text-center">
                                  <div className="font-normal text-gray-500 mt-2">
                                    {item.firstName + " " + item.lastName}
                                  </div>
                                </div>
                              </th>

                              <td className="text-[#5E5E5E] text-center">
                                {item?.userRoleName}
                              </td>
                              <td className="text-[#5E5E5E] text-center">
                                {item.isActive == 1 ? (
                                  <span
                                    style={{ backgroundColor: "#cee9d6" }}
                                    className=" text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                  >
                                    Active
                                  </span>
                                ) : (
                                  <span
                                    style={{ backgroundColor: "" }}
                                    className=" text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4  text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                  >
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td className="text-center">
                                <div className="flex justify-center gap-4">
                                  <div className="cursor-pointer text-[#0000FF] text-xl">
                                    <BsEyeFill
                                      onClick={() => {
                                        setUserID(item.orgUserSpecificID);
                                        selectUserById(item.orgUserSpecificID);
                                        setShowUserProfile(true);
                                      }}
                                    />
                                  </div>
                                  <div className="cursor-pointer text-xl text-[#0000FF]">
                                    <BiEdit
                                      onClick={() => {
                                        setUserID(item.orgUserSpecificID);
                                        selectUserById(item.orgUserSpecificID);
                                        setshowuserModal(true);
                                      }}
                                    />
                                  </div>
                                  <div className="cursor-pointer text-xl text-[#EE4B2B]">
                                    <MdDeleteForever
                                      onClick={() =>
                                        handleDeleteUser(item.orgUserSpecificID)
                                      }
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <>
                          <tr>
                            <td colSpan={4}>
                              <div className="flex text-center justify-center">
                                <span className="text-4xl  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                  No user Found
                                </span>
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-2">
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
