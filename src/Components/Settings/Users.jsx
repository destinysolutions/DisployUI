import { useState, useRef } from "react";
import React from "react";
import { BiEdit, BiSolidUser, BiUserPlus } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../Styles/Settings.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CHNAGE_PASSWORD,
  DELETE_ORG_USER,
  GET_ORG_USERS,
  SELECT_BY_USER_SCREENDETAIL,
  UPDATE_USER,
} from "../../Pages/Api";
import { RiUser3Fill } from "react-icons/ri";
import { IoIosArrowRoundBack, IoMdNotificationsOutline } from "react-icons/io";
import { MdDeleteForever, MdLockOutline } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import toast from "react-hot-toast";
import { BsEyeFill, BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import {
  handleGetCountries,
  handleUserDelete,
  resetStatus,
  handleAddNewUser,
  userScreens,
  getUsersRoles,
  handleGetState,
  getOrgUsers,
  handleSelectUserById,
} from "../../Redux/SettingUserSlice";
import link_icon from "../../images/Settings/link-icon.svg";
import deleteImg from "../../images/Settings/delete.svg";
import google_logo from "../../images/Settings/Google__G__Logo.svg";
import slack from "../../images/Settings/Slack_Technologies_Logo.svg";
import facebook from "../../images/Settings/facebook-logo.svg";
import twitter from "../../images/Settings/twitter-logo.svg";
import dribble from "../../images/Settings/dribbble-logo.svg";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import "../../Styles/Settings.css";
import ReactTooltip from "react-tooltip";

const Users = ({ searchValue, permissions, sidebarOpen }) => {
  const [loadFist, setLoadFist] = useState(true);
  const [selectScreenModal, setSelectScreenModal] = useState(false);
  const [showuserModal, setshowuserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userRoleData, setUserRoleData] = useState([]);
  const [selectRoleID, setSelectRoleID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(0);
  const [countryID, setCountryID] = useState(0);
  const [company, setCompany] = useState("");
  const [userData, setUserData] = useState([]);
  const [userID, setUserID] = useState();
  const [UserMasterID, setUserMasterID] = useState();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userDetailData, setUserDetailData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [file, setFile] = useState();
  const [fileEdit, setFileEdit] = useState("");
  const [labelTitle, setLabelTitle] = useState("Add New User");
  const [zipCode, setZipCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);
  const [screenData, setScreenData] = useState([]);
  const [currentPasswordShow, setCurrentPassword] = useState(false);
  const [newPasswordShow, setNewPassword] = useState(false);
  const [confirmPasswordShow, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [editProfile, setEditProfile] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [screenAccessModal, setScreenAccessModal] = useState(false);
  const [userScreenData, setUserScreenData] = useState([]);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "",
  });
  const { token, user } = useSelector((state) => state.root.auth);
  const { Countries } = useSelector((s) => s.root.settingUser);
  const store = useSelector((state) => state.root.settingUser);
  const authToken = `Bearer ${token}`;

  const hiddenFileInput = useRef(null);
  const modalRef = useRef(null);
  const selectScreenRef = useRef(null);
  const screenAccessModalRef = useRef(null);

  const dispatch = useDispatch();

  // Filter data based on search term
  const filteredData = userData?.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue])

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

  useEffect(() => {
    dispatch(handleGetCountries());
  }, []);

  useEffect(() => {
    if (countryID) {
      dispatch(handleGetState(countryID))?.then((res) => {
        setStates(res?.payload?.data);
      });
    }
  }, [countryID]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    let data = {
      mode: "Selectlist",
    };
    dispatch(getUsersRoles(data))?.then((res) => {
      setUserRoleData(res?.payload?.data);
    });
  };

  const getUsersScreens = (orgUserSpecificID) => {
    setLoading(true);
    dispatch(userScreens(orgUserSpecificID))?.then((res) => {
      setUserScreenData(res?.payload?.data);
      setLoading(false);
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let newErrors = {};

    if (labelTitle !== "Update User") {
      //newErrors.email = !emailRegex.test(email) ? "Not a valid email" || !email ? "Email is required" : "";
      newErrors.email = !email
        ? "Email is required"
        : !emailRegex.test(email)
          ? "Please Enter Valid Email"
          : "";

      newErrors.password = !password ? "Password is required" : "";
    }

    newErrors.firstName = !firstName ? "First Name is required" : "";
    newErrors.lastName = !lastName ? "Last Name is required" : "";
    newErrors.role = !selectRoleID ? "Please select a role" : "";

    // Update errors state
    setErrors(newErrors);

    // Check if any errors exist
    const hasError = Object.values(newErrors).some((error) => error !== "");

    return hasError;
  };

  const handleAddUser = () => {
    let data = new FormData();
    const hasError = validateForm();

    // If there are errors, prevent form submission
    if (hasError) {
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
    data.append("ScreenAssignUser", selectedScreens?.join(","));
    data.append("IsFromUserMaster", 1);
    data.append("operation", "Save");
    data.append("company", company);
    toast.loading("User Creating..");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${UPDATE_USER}`,
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
      toast.remove();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdateUser = () => {
    const hasError = validateForm();

    // If there are errors, prevent form submission
    if (hasError) {
      return;
    }

    let data = new FormData();
    data.append("orgUserSpecificID", userID);
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("phone", phone);
    data.append("isActive", isActive);
    data.append("orgUserID", 0);
    data.append("userRole", selectRoleID);
    data.append("countryID", countryID ? countryID : 0);
    data.append("StateId", selectedState ? selectedState : 0);
    data.append("company", company);
    data.append("ZipCode", zipCode ? zipCode : 0);
    data.append("File", file ? file : fileEdit);
    data.append("ScreenAssignUser", selectedScreens?.join(","));
    data.append("languageId", 0);
    data.append("timeZoneId", 0);
    data.append("currencyId", 0);
    data.append("IsFromUserMaster", 1);
    data.append("operation", "Save");
    toast.loading("User Updating..");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${UPDATE_USER}`,
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then(() => {
        selectUserById(userID);
        handleGetOrgUsers();
        handleCancelPopup();
        setshowuserModal(false);
        toast.remove();
        getUsersScreens(userID);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetOrgUsers = () => {
    setLoading(true);
    dispatch(getOrgUsers())?.then((res) => {
      setUserData(res?.payload?.data);
      setLoading(false);
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
      url: `${DELETE_ORG_USER}?OrgUserSpecificID=${orgUserSpecificID}`,
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
    dispatch(handleSelectUserById(OrgUserSpecificID))?.then((res) => {
      const fetchedData = res?.payload?.data;
      setUserDetailData(fetchedData);
      setFirstName(fetchedData?.firstName);
      setLastName(fetchedData?.lastName);
      setPassword("");
      setFileEdit(fetchedData?.profilePhoto);
      setPhone(fetchedData?.phone);
      setEmail(fetchedData?.email);
      setCompany(fetchedData?.company);
      setCountryID(fetchedData?.countryID);
      setSelectedState(fetchedData?.stateId);
      setSelectRoleID(fetchedData?.userRole);
      setIsActive(fetchedData?.isActive);
      setZipCode(fetchedData?.zipCode);
      setEditProfile(1);
      const screenIdsArray = fetchedData?.screenIds
        ?.split(",")
        .map((id) => parseInt(id.trim()));

      const updatedCheckboxes = {};
      screenData?.map((item) => {
        if (screenIdsArray?.includes(item?.screenID)) {
          updatedCheckboxes[item?.screenID] = true;
        } else {
          updatedCheckboxes[item?.screenID] = false;
        }
      });
      setScreenCheckboxes(updatedCheckboxes);
      setSelectedScreens(screenIdsArray);
    });
  };

  const handleCancelPopup = () => {
    setLabelTitle("Add New User");
    setErrors({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "",
    });
    setshowuserModal(false);
    setFirstName("");
    setLastName("");
    setPassword("");
    setFileEdit(null);
    setFile(null);
    setPhone("");
    setEmail("");
    setCompany("");
    setZipCode("");
    setCountryID("");
    setSelectedState("");
    setSelectRoleID("");
    setIsActive(0);
    setLabelTitle("Add New User");
    getUsers();
    setSelectedScreens([]);
    setScreenCheckboxes({});
    setEditProfile();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileEdit(null);
    setEditProfile();
  };

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        // setshowuserModal(false);
        // handleCancelPopup();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    // setshowuserModal(false);
    // handleCancelPopup();
  }

  useEffect(() => {
    const handleClickOutsideSelectScreenModal = (event) => {
      if (
        selectScreenRef.current &&
        !selectScreenRef.current.contains(event?.target)
      ) {
        setSelectScreenModal(false);
      }
    };
    document.addEventListener(
      "click",
      handleClickOutsideSelectScreenModal,
      true
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickOutsideSelectScreenModal,
        true
      );
    };
  }, [handleClickOutsideSelectScreenModal]);

  function handleClickOutsideSelectScreenModal() {
    setSelectScreenModal(false);
  }

  useEffect(() => {
    const handleClickOutsideScreen = (event) => {
      if (
        screenAccessModalRef.current &&
        !screenAccessModalRef.current.contains(event?.target)
      ) {
        setScreenAccessModal(false);
      }
    };
    document.addEventListener("click", handleClickOutsideScreen, true);
    return () => {
      document.removeEventListener("click", handleClickOutsideScreen, true);
    };
  }, [handleClickOutsideScreen]);

  function handleClickOutsideScreen() {
    setScreenAccessModal(false);
  }

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          userID: UserMasterID,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };
        const config = {
          method: "post",
          url: `${CHNAGE_PASSWORD}userID=${payload.userID}&OldPassowrd=${payload.currentPassword}&NewPassword=${payload.newPassword}`, // Assuming CHNAGE_PASSWORD is your API endpoint
          headers: {
            Authorization: authToken,
          },
          maxBodyLength: Infinity,
        };
        const response = await axios.request(config);
        if (response?.data?.status === true) {
          formik.resetForm();
          toast.success(response?.data?.message);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        console.error("Error updating password:", error.message);
        toast.error("Error updating password. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (user?.userID) {
      setLoading(true);
      axios
        .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          const fetchedData = response.data.data;
          setScreenData(fetchedData);
          setLoading(false);
          const initialCheckboxes = {};
          if (Array.isArray(fetchedData)) {
            fetchedData.forEach((screen) => {
              initialCheckboxes[screen.screenID] = selectedScreens?.includes(
                screen.screenID
              )
                ? true
                : false;
            });
            setScreenCheckboxes(initialCheckboxes);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, []);

  const handleScreenCheckboxChange = (screenID) => {
    const updatedCheckboxes = { ...screenCheckboxes };
    updatedCheckboxes[screenID] = !updatedCheckboxes[screenID];
    setScreenCheckboxes(updatedCheckboxes);

    // Create a copy of the selected screens array
    let updatedSelectedScreens = [];
    if (selectedScreens?.length > 0) {
      updatedSelectedScreens = [...selectedScreens];
    }

    // If the screenID is already in the array, remove it; otherwise, add it
    if (updatedSelectedScreens?.includes(screenID)) {
      const index = updatedSelectedScreens.indexOf(screenID);
      updatedSelectedScreens.splice(index, 1);
    } else {
      updatedSelectedScreens.push(screenID);
    }
    // Update the selected screens state
    setSelectedScreens(updatedSelectedScreens);

    // Check if any individual screen checkbox is unchecked
    const allChecked = Object.values(updatedCheckboxes).every(
      (isChecked) => isChecked
    );

    setSelectAllChecked(allChecked);
  };

  const handleSelectAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    // Set the state of all individual screen checkboxes
    const updatedCheckboxes = {};
    for (const screenID in screenCheckboxes) {
      updatedCheckboxes[screenID] = checked;
    }
    setScreenCheckboxes(updatedCheckboxes);
    // Update the selected screens state based on whether "All Select" is checked
    if (checked) {
      const allScreenIds = screenData.map((screen) => screen.screenID);

      setSelectedScreens(allScreenIds);
    } else {
      setSelectedScreens([]);
    }
  };
  return (
    <>
      {showuserModal && (
        <div className="backdrop z-9990">
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
            <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2">
              <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 max-h-96 vertical-scroll-inner text-left rounded-2xl">
                <div className="grid grid-cols-12 gap-6">
                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="relative">
                      <label className="formLabel">First Name</label>
                      <input
                        type="text"
                        placeholder="Enter User Name"
                        name="fname"
                        className="formInput user-Input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      {errors?.firstName && (
                        <p className="error">{errors?.firstName}</p>
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
                        className="formInput user-Input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      {errors?.lastName && (
                        <p className="error">{errors?.lastName}</p>
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
                            className="formInput user-Input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          {errors?.email && (
                            <p className="error">{errors?.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                        <div className="relative">
                          <label className="formLabel">Password</label>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter User Password"
                            name="fname"
                            className="formInput user-Input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />

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
                        {errors?.password && (
                          <p className="error">{errors?.password}</p>
                        )}
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
                        className="formInput user-Input"
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
                        className="formInput user-Input"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="relative">
                      <label className="formLabel">Zip Code</label>
                      <input
                        type="number"
                        placeholder="Enter zip code"
                        name="zipcode"
                        className="formInput user-Input"
                        value={zipCode}
                        maxLength="10"
                        onChange={(e) => {
                          if (e.target.value.length <= 10) {
                            setZipCode(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12">
                    <div className="relative">
                      <label className="formLabel">Country</label>
                      <select
                        className="formInput user-Input bg-white"
                        value={countryID}
                        onChange={(e) => setCountryID(e.target.value)}
                      >
                        {labelTitle !== "Update User" && (
                          <option label="Select Country"></option>
                        )}
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
                        className="formInput user-Input bg-white"
                        onChange={(e) => setSelectedState(e.target.value)}
                        value={selectedState}
                      >
                        {labelTitle !== "Update User" && (
                          <option label="Select State"></option>
                        )}
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
                        className="formInput user-Input bg-white"
                        value={selectRoleID}
                        onChange={(e) => setSelectRoleID(e.target.value)}
                      >
                        {labelTitle !== "Update User" && (
                          <option label="Select User Role"></option>
                        )}
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
                      {errors?.role && <p className="error">{errors?.role}</p>}
                    </div>
                  </div>

                  <div className="lg:col-span-4 md:col-span-12 sm:col-span-12 xs:col-span-12">
                    <div className="mt-3 flex items-center">
                      <input
                        className="border border-primary mr-3 rounded h-6 w-6"
                        type="checkbox"
                        checked={isActive === 1}
                        onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
                      />
                      <label>isActive</label>
                    </div>
                  </div>
                  <div className="lg:col-span-8 md:col-span-12 sm:col-span-12 xs:col-span-12">
                    <div className="flex items-center justify-end lg:flex-row md:flex-row sm:flex-row flex-col gap-2 ">
                      <div className="flex items-center justify-center">

                        <div className="layout-img me-3">
                          {file && editProfile !== 1 ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Uploaded"
                              className="w-10 rounded-lg"
                            />
                          ) : null}
                          {editProfile === 1 && fileEdit !== null ? (
                            <img
                              src={fileEdit}
                              alt="Uploaded"
                              className="w-10 rounded-lg"
                            />
                          ) : null}
                        </div>
                        <div className="layout-detaills me-3">
                          <button
                            className="lg:px-5 md:px-5 px-2 bg-primary text-white rounded-full py-2 border border-primary "
                            onClick={handleClick}
                          >
                            Profile photo
                          </button>
                          <input
                            type="file"
                            id="upload-button"
                            style={{ display: "none" }}
                            ref={hiddenFileInput}
                            accept="image/*"
                            onChange={(e) => handleFileChange(e)}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectScreenModal(true)}
                        className="lg:px-5 md:px-5 px-2 bg-primary text-white rounded-full py-2 border border-primary me-3 "
                      >
                        Screen Access
                      </button>
                    </div>
                  </div>
                  {selectScreenModal && (
                    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                      <div
                        ref={selectScreenRef}
                        className="w-auto mx-auto lg:max-w-2xl md:max-w-sm sm:max-w-xs max-w-xs"
                      >
                        <div className="border-0 rounded-lg min-w-[20vw] overflow-y-auto shadow-lg relative flex flex-col bg-white outline-none focus:outline-none min-h-[350px] max-h-[550px]">
                          <div className="flex sticky top-0 bg-white z-10 items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <div className="flex items-center">
                              <div className=" mt-1.5">
                                <input
                                  type="checkbox"
                                  className="w-5 h-5"
                                  onChange={handleSelectAllCheckboxChange}
                                  checked={
                                    selectAllChecked ||
                                    (Object.values(screenCheckboxes)?.length >
                                      0 &&
                                      Object.values(screenCheckboxes).every(
                                        (e) => {
                                          return e == true;
                                        }
                                      ))
                                  }
                                />
                              </div>
                              <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium ml-3">
                                All Select 
                              </h3>
                            </div>
                            <button
                              className="p-1 text-xl"
                              onClick={() => {
                                setSelectScreenModal(false);
                              }}
                            >
                              <AiOutlineCloseCircle className="text-3xl" />
                            </button>
                          </div>
                          <div className="schedual-table bg-white rounded-xl mt-2 shadow p-3 w-full max-h-96 vertical-scroll-inner">
                            <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                              <table
                                className="screen-table w-full"
                                cellPadding={15}
                              >
                                <thead>
                                  <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-left">
                                      Screen
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                      Status
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                      Google Location
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                      Associated Schedule
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                      Tags
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {loading ? (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="text-center font-semibold text-lg"
                                      >
                                        Loading...
                                      </td>
                                    </tr>
                                  ) : !loading && screenData?.length > 0 ? (
                                    screenData.map((screen) => (
                                      <tr
                                        key={screen.screenID}
                                        className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                                      >
                                        <td className="flex items-center">
                                          <input
                                            type="checkbox"
                                            className="mr-3"
                                            onChange={() =>
                                              handleScreenCheckboxChange(
                                                screen.screenID
                                              )
                                            }
                                            checked={
                                              screenCheckboxes[screen.screenID]
                                            }
                                          />

                                          {screen.screenName}
                                        </td>

                                        <td className="text-center">
                                          <span
                                            id={`changetvstatus${screen.macid}`}
                                            className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
                                                ? "bg-[#3AB700]"
                                                : "bg-[#FF0000]"
                                              }`}
                                          >
                                            {screen.screenStatus == 1
                                              ? "Live"
                                              : "offline"}
                                          </span>
                                        </td>
                                        <td className="text-center break-words">
                                          {screen.googleLocation}
                                        </td>

                                        <td className="text-center break-words">
                                          {screen.scheduleName == ""
                                            ? ""
                                            : `${screen.scheduleName} Till
                                    ${moment(screen.endDate).format(
                                              "YYYY-MM-DD hh:mm"
                                            )}`}
                                        </td>
                                        <td className="text-center break-words">
                                          {screen?.tags !== null
                                            ? screen?.tags
                                              .split(",")
                                              .slice(
                                                0,
                                                screen?.tags.split(",")
                                                  .length > 2
                                                  ? 3
                                                  : screen?.tags.split(",")
                                                    .length
                                              )
                                              .map((text) => {
                                                if (
                                                  text.toString().length > 10
                                                ) {
                                                  return text
                                                    .split("")
                                                    .slice(0, 10)
                                                    .concat("...")
                                                    .join("");
                                                }
                                                return text;
                                              })
                                              .join(",")
                                            : ""}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={6}>
                                        <p className="text-center p-2">
                                          No Screen available.
                                        </p>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="py-4 flex justify-center sticky bottom-0 z-10 bg-white">
                            <button
                              className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
                              onClick={() => {
                                setSelectScreenModal(false);
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12 p-5 text-center">
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
                    setSelectedScreens([]);
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
      )}

      {showUserProfile ? (
        <>
          <div className="lg:p-4 md:p-4 sm:p-2 xs:p-2 mt-3">
            <h1
              onClick={() => {
                setShowUserProfile(false);
                setLoadFist(true);
                setUserScreenData([]);
                setUserID();
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
                      {userDetailData?.profilePhoto !== null ? (
                        <img
                          src={userDetailData?.profilePhoto}
                          className="w-30 h-25 mb-3 rounded shadow-lg"
                          style={{ width: "200px", height: "185px" }}
                        />
                      ) : (
                        <BiSolidUser className="w-[200px] h-[185px]" />
                      )}
                    </span>
                    <span className="user-name text-gray-900 dark:text-white font-semibold capitalize">
                      {userDetailData?.firstName} {userDetailData?.lastName}
                    </span>
                    <div className="user-designation my-2">
                      <span
                        style={{ backgroundColor: "#cee9d6" }}
                        className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                      >
                        {userDetailData?.userRoleName}
                      </span>
                    </div>
                  </div>
                  <div className="user-pro-details mt-10">
                    <h3 className="user-name my-2">Details</h3>
                    <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 mt-4">
                      <div className="font-semibold">
                        <span>User ID : </span>
                      </div>
                      <div className="col-span-2">
                        <span>{userDetailData?.orgUserSpecificID}</span>
                      </div>
                      <div className="font-semibold">
                        <span>User Name : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span>
                          {userDetailData?.firstName} {userDetailData?.lastName}
                        </span>
                      </div>
                      <div className="font-semibold">
                        <span>Company Name : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span className="break-all">
                          {" "}
                          {userDetailData?.company}
                        </span>
                      </div>
                      <div className="font-semibold">
                        <span className="break-all">Email : </span>
                      </div>
                      <div className="col-span-2">
                        <span className="break-all">
                          {" "}
                          {userDetailData?.email}
                        </span>
                      </div>
                      <div className="font-semibold">
                        <span>Status : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span>
                          {userDetailData?.isActive == 1 ? (
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
                      </div>
                      <div className="font-semibold">
                        <span>Role : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData?.userRoleName}</span>
                      </div>
                      <div className="font-semibold">
                        <span>Contact : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData?.phone}</span>
                      </div>
                      <div className="font-semibold">
                        <span>Language : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span>
                          {userDetailData?.languageName
                            ? userDetailData?.languageName
                            : "English"}
                        </span>
                      </div>
                      <div className="font-semibold">
                        <span>Country : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData?.countryName}</span>
                      </div>

                      <div className="font-semibold">
                        <span>State : </span>
                      </div>
                      <div className="col-span-2 capitalize">
                        <span> {userDetailData?.stateName}</span>
                      </div>
                    </div>

                    <div className="flex justify-center w-full mt-10">
                      <button
                        onClick={() => {
                          selectUserById(userDetailData?.orgUserSpecificID);
                          setshowuserModal(true);
                        }}
                        className="me-3 hover:bg-white hover:text-primary text-base px-8 py-2 border border-primary  shadow-md rounded-full bg-primary text-white "
                      >
                        Edit Profile
                      </button>
                      {/* <button className="hover:text-#ffbebe px-8 py-3 border border-red shadow-md rounded-full text-red-600 text-1xl font-semibold bg-[#ffbebe] ">
                        Suspend
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <div className="card-shadow pt-6 h-full">
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
                    {/* <li>
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
                    </li> */}
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
                                  onClick={() =>
                                    setCurrentPassword(!currentPasswordShow)
                                  }
                                />
                              ) : (
                                <BsFillEyeSlashFill
                                  onClick={() =>
                                    setCurrentPassword(!currentPasswordShow)
                                  }
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
                              value={formik.values.newPassword}
                            />
                            <div className="icon mt-3">
                              {newPasswordShow ? (
                                <BsFillEyeFill
                                  onClick={() =>
                                    setNewPassword(!newPasswordShow)
                                  }
                                />
                              ) : (
                                <BsFillEyeSlashFill
                                  onClick={() =>
                                    setNewPassword(!newPasswordShow)
                                  }
                                />
                              )}
                            </div>
                          </div>
                          {formik.touched.newPassword &&
                            formik.errors.newPassword ? (
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
                              value={formik.values.confirmPassword}
                            />
                            <div className="icon mt-3">
                              {confirmPasswordShow ? (
                                <BsFillEyeFill
                                  onClick={() =>
                                    setConfirmPassword(!confirmPasswordShow)
                                  }
                                />
                              ) : (
                                <BsFillEyeSlashFill
                                  onClick={() =>
                                    setConfirmPassword(!confirmPasswordShow)
                                  }
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
                          <div className="md:w-full flex justify-center pt-7">
                            <button
                              className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                              disabled={!formik.isValid || formik.isSubmitting}
                            >
                              Save Changes
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
                        <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                          <table className="screen-table min-w-full leading-normal bg-white mb-8">
                            <thead>
                              <tr className="table-head-bg rounded-lg">
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
                                  <label
                                    className="checkbox"
                                    htmlFor="offline1"
                                  >
                                    <span className="checkbox__label"></span>
                                    <input type="checkbox" id="offline1" />
                                    <div className="checkbox__indicator"></div>
                                  </label>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                  <label
                                    className="checkbox"
                                    htmlFor="offline2"
                                  >
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
                                    htmlFor="purchased-plan1"
                                  >
                                    <span className="checkbox__label"></span>
                                    <input
                                      type="checkbox"
                                      id="purchased-plan1"
                                    />
                                    <div className="checkbox__indicator"></div>
                                  </label>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                  <label
                                    className="checkbox"
                                    htmlFor="purchased-plan2"
                                  >
                                    <span className="checkbox__label"></span>
                                    <input
                                      type="checkbox"
                                      id="purchased-plan2"
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
                                  <label
                                    className="checkbox"
                                    htmlFor="added-users1"
                                  >
                                    <span className="checkbox__label"></span>
                                    <input type="checkbox" id="added-users1" />
                                    <div className="checkbox__indicator"></div>
                                  </label>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                  <label
                                    className="checkbox"
                                    htmlFor="added-users2"
                                  >
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
                                    htmlFor="changing-details1"
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
                                    htmlFor="changing-details2"
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
                                  <label
                                    className="checkbox"
                                    htmlFor="Playlist1"
                                  >
                                    <span className="checkbox__label"></span>
                                    <input type="checkbox" id="Playlist1" />
                                    <div className="checkbox__indicator"></div>
                                  </label>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                  <label
                                    className="checkbox"
                                    htmlFor="Playlist2"
                                  >
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
                                  <label className="checkbox" htmlFor="Assets1">
                                    <span className="checkbox__label"></span>
                                    <input type="checkbox" id="Assets1" />
                                    <div className="checkbox__indicator"></div>
                                  </label>
                                </td>
                                <td className="px-5 py-3 text-sm">
                                  <label className="checkbox" htmlFor="Assets2">
                                    <span className="checkbox__label"></span>
                                    <input type="checkbox" id="Assets2" />
                                    <div className="checkbox__indicator"></div>
                                  </label>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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

                        <div className="buttonWrapper flex justify-center w-full">
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
          </div>
          <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2 w-full">
            <h3 className="user-name mb-4">Selected Screens</h3>
            <div className="overflow-x-scroll sc-scrollbar rounded-lg shadow">
              <table className="w-full" cellPadding={15}>
                <thead>
                  <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Screen
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Status
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Google Location
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Associated Schedule
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center font-semibold text-lg"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : !loading && userScreenData?.length > 0 ? (
                    userScreenData.map((screen) => (
                      <tr
                        key={screen.screenID}
                        className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                      >
                        <td className="text-center">{screen.screenName}</td>

                        <td className="text-center">
                          <span
                            id={`changetvstatus${screen.macid}`}
                            className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
                                ? "bg-[#3AB700]"
                                : "bg-[#FF0000]"
                              }`}
                          >
                            {screen.screenStatus == 1 ? "Live" : "offline"}
                          </span>
                        </td>
                        <td className="text-center break-words">
                          {screen.googleLocation}
                        </td>
                        <td className="text-center break-words">
                          {screen.scheduleName == ""
                            ? ""
                            : `${screen.scheduleName} Till
                    ${moment(screen.endDate).format("YYYY-MM-DD hh:mm")}`}
                        </td>
                        <td className="text-center break-words">
                          {screen?.tags !== null
                            ? screen?.tags
                              .split(",")
                              .slice(
                                0,
                                screen?.tags.split(",").length > 2
                                  ? 3
                                  : screen?.tags.split(",").length
                              )
                              .map((text) => {
                                if (text.toString().length > 10) {
                                  return text
                                    .split("")
                                    .slice(0, 10)
                                    .concat("...")
                                    .join("");
                                }
                                return text;
                              })
                              .join(",")
                            : ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <p className="text-center p-2">No Screen available.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
            <div>
              {permissions.isSave && (
                <button
                  className="flex align-middle items-center float-right bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 lg:mb-5 lg:mt-0 mt-3 mb-4 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                  onClick={() => {
                    setUserDetailData([]);
                    setFirstName("");
                    setLastName("");
                    setPassword("");
                    setFileEdit(null);
                    setPhone("");
                    setEmail("");
                    setCompany("");
                    setCountryID(0);
                    setSelectedState("");
                    setSelectRoleID("");
                    setIsActive(0);
                    setZipCode("");
                    setEditProfile();
                    setshowuserModal(true);
                  }}
                >
                  <BiUserPlus className="text-2xl mr-1" />
                  Add New User
                </button>
              )}
            </div>
            <div className="clear-both">
              <div className="bg-white rounded-xl lg:mt-8 shadow screen-section ">
                <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                  <table
                    className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                    cellPadding={15}
                  >
                    <thead>
                      <tr className="items-center table-head-bg">
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center items-center">
                          <div className="flex w-full items-center justify-start">
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
                          </div>
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Roles
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Screen Access
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Status
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
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
                            <tr
                              className="border-b border-b-[#E4E6FF]"
                              key={index}
                            >
                              <td className="text-[#5E5E5E] text-center flex">
                                {item?.profilePhoto !== null ? (
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
                              </td>

                              <td className="text-[#5E5E5E] text-center">
                                {item?.userRoleName}
                              </td>
                              <td className="text-[#5E5E5E] text-center">
                                <button
                                  onClick={() => {
                                    setScreenAccessModal(true);
                                    getUsersScreens(item?.orgUserSpecificID);
                                  }}
                                >
                                  {item?.count}
                                </button>
                              </td>
                              <td className="text-[#5E5E5E] text-center">
                                {item.isActive == 1 ? (
                                  <span className="bg-[#3AB700] rounded-full px-6 py-1 text-white hover:bg-primary text-sm">
                                    Active
                                  </span>
                                ) : (
                                  <span className="bg-[#FF0000] rounded-full px-6 py-1 text-white hover:bg-primary text-sm">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td className="text-center">
                                <div className="flex justify-center gap-4">
                                  {permissions.isSave && (
                                    <>
                                      <div
                                        data-tip
                                        data-for="View"
                                        className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => {
                                          setUserID(item.orgUserSpecificID);
                                          selectUserById(
                                            item.orgUserSpecificID
                                          );
                                          setUserMasterID(item.userMasterID);
                                          setShowUserProfile(true);
                                          getUsersScreens(
                                            item.orgUserSpecificID
                                          );
                                        }}
                                      >
                                        <BsEyeFill />
                                        <ReactTooltip
                                          id="View"
                                          place="bottom"
                                          type="warning"
                                          effect="solid"
                                        >
                                          <span>View</span>
                                        </ReactTooltip>
                                      </div>

                                      <div
                                        data-tip
                                        data-for="Edit"
                                        className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={() => {
                                          setUserID(item.orgUserSpecificID);
                                          selectUserById(
                                            item.orgUserSpecificID
                                          );
                                          setUserMasterID(item.userMasterID);
                                          setshowuserModal(true);
                                        }}
                                      >
                                        <BiEdit />
                                        <ReactTooltip
                                          id="Edit"
                                          place="bottom"
                                          type="warning"
                                          effect="solid"
                                        >
                                          <span>Edit</span>
                                        </ReactTooltip>
                                      </div>
                                    </>
                                  )}

                                  {permissions.isDelete && (
                                    <div
                                      data-tip
                                      data-for="Delete"
                                      className="cursor-pointer text-xl flex gap-3 rounded-full px-2 py-2 text-white text-center bg-[#FF0000]"
                                      onClick={() =>
                                        handleDeleteUser(item.orgUserSpecificID)
                                      }
                                    >
                                      <MdDeleteForever />
                                      <ReactTooltip
                                        id="Delete"
                                        place="bottom"
                                        type="warning"
                                        effect="solid"
                                      >
                                        <span>Delete</span>
                                      </ReactTooltip>
                                    </div>
                                  )}
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
                              <td colSpan={5}>
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
                {screenAccessModal && (
                  <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                    <div
                      ref={screenAccessModalRef}
                      className="w-auto mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
                    >
                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="relative w-full cursor-pointer z-40 rounded-full">
                          <button
                            className="text-xl absolute -right-3 -top-4 bg-black text-white rounded-full"
                            onClick={() => {
                              setScreenAccessModal(false);
                            }}
                          >
                            <AiOutlineCloseCircle className="text-3xl" />
                          </button>
                        </div>
                        <div className="schedual-table bg-white mt-8 shadow p-3 w-full overflow-x-scroll sc-scrollbar rounded-lg">
                          <table
                            className="screen-table w-full"
                            cellPadding={15}
                          >
                            <thead>
                              <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                                <th className="text-[#5A5881] text-base font-semibold w-fit text-left">
                                  Screen
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                  Status
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                  Google Location
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                  Associated Schedule
                                </th>
                                <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                  Tags
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {loading ? (
                                <tr>
                                  <td
                                    colSpan={6}
                                    className="text-center font-semibold text-lg"
                                  >
                                    Loading...
                                  </td>
                                </tr>
                              ) : !loading && userScreenData?.length > 0 ? (
                                userScreenData.map((screen) => (
                                  <tr
                                    key={screen.screenID}
                                    className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                                  >
                                    <td className="text-center">
                                      {screen.screenName}
                                    </td>

                                    <td className="text-center">
                                      <span
                                        id={`changetvstatus${screen.macid}`}
                                        className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
                                            ? "bg-[#3AB700]"
                                            : "bg-[#FF0000]"
                                          }`}
                                      >
                                        {screen.screenStatus == 1
                                          ? "Live"
                                          : "offline"}
                                      </span>
                                    </td>
                                    <td className="text-center break-words">
                                      {screen.googleLocation}
                                    </td>
                                    <td className="text-center break-words">
                                      {screen.scheduleName == ""
                                        ? ""
                                        : `${screen.scheduleName} Till
                                ${moment(screen.endDate).format(
                                          "YYYY-MM-DD hh:mm"
                                        )}`}
                                    </td>
                                    <td className="text-center break-words">
                                      {screen?.tags !== null
                                        ? screen?.tags
                                          .split(",")
                                          .slice(
                                            0,
                                            screen?.tags.split(",").length > 2
                                              ? 3
                                              : screen?.tags.split(",").length
                                          )
                                          .map((text) => {
                                            if (text.toString().length > 10) {
                                              return text
                                                .split("")
                                                .slice(0, 10)
                                                .concat("...")
                                                .join("");
                                            }
                                            return text;
                                          })
                                          .join(",")
                                        : ""}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={6}>
                                    <p className="text-center p-2">
                                      No Screen available.
                                    </p>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
        </>
      )}
    </>
  );
};

export default Users;
