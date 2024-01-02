import React, { useRef } from "react";
import { useState } from "react";
import { FaCertificate } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";

const Userrole = ({ searchValue }) => {
  const [showdata, setShowdata] = useState(false);
  const handleDropupClick = () => {
    setShowdata(!showdata);
  };
  {
    /*model */
  }
  const [showuserroleModal, setshowuserroleModal] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});

  const [showPopup, setShowPopup] = useState(false); // New state to control the popup visibility
  const [selectedRows, setSelectedRows] = useState([]);
  // State to store the checkbox and dropdown states retrieved from localStorage
  const [localStorageData, setLocalStorageData] = useState({
    checkboxState: {},
    dropdownStates: {},
  });
  const [userRoleData, setUserRoleData] = useState([]);
  const [filteruserRoleData, setFilterUserRoleData] = useState([]);
  const [screenIsApprovarID, setScreenIsApprovarID] = useState("");
  const [screenIsReviwerID, setScreenIsReviwerID] = useState("");
  const [myScheduleIsApprovarID, setMyScheduleIsApprovarID] = useState("");
  const [myScheduleIsReviwerID, setMyScheduleIsReviwerID] = useState("");
  const [appsIsApprovarID, setAppsIsApprovarID] = useState("");
  const [appsIsReviwerID, setAppsIsReviwerID] = useState("");
  const [roleName, setRoleName] = useState("");
  const [userRoleID, setUserRoleID] = useState("");
  const [userData, setUserData] = useState([]);
  const [showActionBox, setShowActionBox] = useState(false);
  const [deletePopup, setdeletePopup] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({
    screenView: false,
    screenCreateEdit: false,
    screenDelete: false,
    screenApprovar: false,
    screenReviewer: false,
    myScheduleView: false,
    myScheduleCreateEdit: false,
    myScheduleDelete: false,
    myScheduleApprovar: false,
    myScheduleReviewer: false,
    appsView: false,
    appsCreateEdit: false,
    appsDelete: false,
    appsApprovar: false,
    appsReviewer: false,
  });

  const modalRef = useRef(null);
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [errorsRoleName, setErrorsRoleName] = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);
  // Sort and paginate the data

  const totalPages = Math.ceil(userData.length / itemsPerPage);

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
    userData,
    sortedField,
    sortOrder
  ).slice(indexOfFirstItem, indexOfLastItem);
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
    const searchQuery = searchValue?.toLowerCase();
    if (searchQuery) {
      const filteredUser = userRoleData?.filter((item) =>
        item?.orgUserRole?.toLocaleLowerCase()?.includes(searchQuery)
      );
      if (filteredUser.length > 0) {
        setFilterUserRoleData(filteredUser);
      } else {
        setFilterUserRoleData([]);
      }
    } else {
      setFilterUserRoleData([]);
    }
  }, [searchValue]);

  const handleActionClick = (rowId) => {
    setShowActionBox(rowId);
  };

  const handleCheckboxChange = (category, value) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [category]: value,
    }));
  };

  const handleFetchUserRoleData = () => {
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
        if (response?.data?.message !== "Data not found.") {
          setUserRoleData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSaveUserRole = () => {
    // Clear previous validation errors
    setErrorsRoleName("");
    // Check validation for RoleName
    setshowuserroleModal(true);
    if (!roleName) {
      setErrorsRoleName("Role name is required");
      return;
    }

    let data = JSON.stringify({
      orgUserRoleID: 0,
      orgUserRole: roleName,
      isActive: 1,
      userID: 0,
      mode: "Save",
      useraccess: [
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 1,
          isView: checkboxValues.screenView,
          isSave: checkboxValues.screenCreateEdit,
          isDelete: checkboxValues.screenDelete,
          isApprove: checkboxValues.screenApprovar,
          approverID: screenIsApprovarID || 0,
          isReviewer: checkboxValues.screenReviewer,
          reviewerID: screenIsReviwerID || 0,
        },
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 2,
          isView: checkboxValues.myScheduleView,
          isSave: checkboxValues.myScheduleCreateEdit,
          isDelete: checkboxValues.myScheduleDelete,
          isApprove: checkboxValues.myScheduleApprovar,
          approverID: myScheduleIsApprovarID || 0,
          isReviewer: checkboxValues.myScheduleReviewer,
          reviewerID: myScheduleIsReviwerID || 0,
        },
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 3,
          isView: checkboxValues.appsView,
          isSave: checkboxValues.appsCreateEdit,
          isDelete: checkboxValues.appsDelete,
          isApprove: checkboxValues.appsApprovar,
          approverID: appsIsApprovarID || 0,
          isReviewer: checkboxValues.appsReviewer,
          reviewerID: appsIsReviwerID || 0,
        },
      ],
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

    axios.request(config).then((response) => {
        setRoleName("");
        handleFetchUserRoleData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectByID = (user_role_id) => {
    setUserRoleID(user_role_id);
    let data = JSON.stringify({
      OrgUserRoleID: user_role_id,
      mode: "SelectByID",
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
        const selectedRole = response.data.data;
        setRoleName(selectedRole.orgUserRole);
        setCheckboxValues({
          screenView: selectedRole.useraccess[0].isView,
          screenCreateEdit: selectedRole.useraccess[0].isSave,
          screenDelete: selectedRole.useraccess[0].isDelete,
          screenApprovar: selectedRole.useraccess[0].isApprove,
          screenReviewer: selectedRole.useraccess[0].isReviewer,

          myScheduleView: selectedRole.useraccess[1].isView,
          myScheduleCreateEdit: selectedRole.useraccess[1].isSave,
          myScheduleDelete: selectedRole.useraccess[1].isDelete,
          myScheduleApprovar: selectedRole.useraccess[1].isApprove,
          myScheduleReviewer: selectedRole.useraccess[1].isReviewer,

          appsView: selectedRole.useraccess[2].isView,
          appsCreateEdit: selectedRole.useraccess[2].isSave,
          appsDelete: selectedRole.useraccess[2].isDelete,
          appsApprovar: selectedRole.useraccess[2].isApprove,
          appsReviewer: selectedRole.useraccess[2].isReviewer,
        });

        setScreenIsApprovarID(selectedRole.useraccess[0].approverID);
        setScreenIsReviwerID(selectedRole.useraccess[0].reviewerID);
        setMyScheduleIsApprovarID(selectedRole.useraccess[1].approverID);
        setMyScheduleIsReviwerID(selectedRole.useraccess[1].reviewerID);
        setAppsIsApprovarID(selectedRole.useraccess[2].approverID);
        setAppsIsReviwerID(selectedRole.useraccess[2].reviewerID);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateUserRole = () => {
    let data = JSON.stringify({
      orgUserRoleID: userRoleID,
      orgUserRole: roleName,
      isActive: 1,
      userID: 0,
      mode: "Save",
      useraccess: [
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 1,
          isView: checkboxValues.screenView,
          isSave: checkboxValues.screenCreateEdit,
          isDelete: checkboxValues.screenDelete,
          isApprove: checkboxValues.screenApprovar,
          approverID: screenIsApprovarID || 0,
          isReviewer: checkboxValues.screenReviewer,
          reviewerID: screenIsReviwerID || 0,
        },
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 2,
          isView: checkboxValues.myScheduleView,
          isSave: checkboxValues.myScheduleCreateEdit,
          isDelete: checkboxValues.myScheduleDelete,
          isApprove: checkboxValues.myScheduleApprovar,
          approverID: myScheduleIsApprovarID || 0,
          isReviewer: checkboxValues.myScheduleReviewer,
          reviewerID: myScheduleIsReviwerID || 0,
        },
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 3,
          isView: checkboxValues.appsView,
          isSave: checkboxValues.appsCreateEdit,
          isDelete: checkboxValues.appsDelete,
          isApprove: checkboxValues.appsApprovar,
          approverID: appsIsApprovarID || 0,
          isReviewer: checkboxValues.appsReviewer,
          reviewerID: appsIsReviwerID || 0,
        },
      ],
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
        handleFetchUserRoleData();
        setRoleName("");
        setCheckboxValues({
          screenView: false,
          screenCreateEdit: false,
          screenDelete: false,
          screenApprovar: false,
          screenReviewer: false,
          myScheduleView: false,
          myScheduleCreateEdit: false,
          myScheduleDelete: false,
          myScheduleApprovar: false,
          myScheduleReviewer: false,
          appsView: false,
          appsCreateEdit: false,
          appsDelete: false,
          appsApprovar: false,
          appsReviewer: false,
        });

        setScreenIsApprovarID(0);
        setScreenIsReviwerID(0);
        setMyScheduleIsApprovarID(0);
        setMyScheduleIsReviwerID(0);
        setAppsIsApprovarID(0);
        setAppsIsReviwerID(0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle the "Set Approval" button click
  const handleSetApprovalClick = (rowId) => {
    if (isAnyCheckboxChecked) {
      // If any checkbox is checked, fetch selected row names and show the popup
      const rowData = tableData.find((row) => row.id === rowId);
      setSelectedRows(rowData ? [rowData.name] : []);
      setShowPopup(true);
    }
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Check if any checkbox is checked
  const isAnyCheckboxChecked = Object.values(checkboxStates).some(
    (isChecked) => isChecked
  );

  // Destructure checkboxStates and dropdownStates from localStorageData
  const { checkboxState, dropdownStates } = localStorageData;

  // Billing
  const BillingData = [
    {
      id: 7,
      name: "Payment Method",
      create: true,
      edit: false,
      delete: true,
      proposeChanges: false,
      approveChanges: true,
    },
    {
      id: 8,
      name: "receive bank Access",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
  ];

  // content
  const contentData = [
    {
      id: 9,
      name: "Assets",
      create: true,
      edit: false,
      delete: true,
      proposeChanges: false,
      approveChanges: true,
    },
    {
      id: 10,
      name: "Disploy Studio",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 11,
      name: "Playlist",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 12,
      name: "Template",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
  ];

  const tableData = [
    {
      id: 1,
      name: "Screen",
      create: true,
      edit: false,
      delete: true,
      proposeChanges: false,
      approveChanges: true,
    },
    {
      id: 2,
      name: "My Schedule",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 3,
      name: "Apps",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 4,
      name: "Settings",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 5,
      name: "Reports",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
    {
      id: 6,
      name: "Trash",
      create: false,
      edit: true,
      delete: true,
      proposeChanges: true,
      approveChanges: false,
    },
  ];

  useEffect(() => {
    handleFetchUserRoleData();

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
        // console.log(response.data.data);
        setUserData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    const storedCheckboxStates = JSON.parse(
      localStorage.getItem("approvalReqCheckboxes")
    );
    const storedDropdownStates = JSON.parse(
      localStorage.getItem("approvalReqDropdowns")
    );

    setLocalStorageData({
      checkboxState: storedCheckboxStates || {},
      dropdownStates: storedDropdownStates || {},
    });
  }, []);

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        // window.document.body.style.overflow = "unset";
        setshowuserroleModal(false);
        setErrorsRoleName('')
        setRoleName("");
        setCheckboxValues({
          screenView: false,
          screenCreateEdit: false,
          screenDelete: false,
          screenApprovar: false,
          screenReviewer: false,
          myScheduleView: false,
          myScheduleCreateEdit: false,
          myScheduleDelete: false,
          myScheduleApprovar: false,
          myScheduleReviewer: false,
          appsView: false,
          appsCreateEdit: false,
          appsDelete: false,
          appsApprovar: false,
          appsReviewer: false,
        });
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setshowuserroleModal(false);
    setErrorsRoleName('')
    setRoleName("");
    setCheckboxValues({
      screenView: false,
      screenCreateEdit: false,
      screenDelete: false,
      screenApprovar: false,
      screenReviewer: false,
      myScheduleView: false,
      myScheduleCreateEdit: false,
      myScheduleDelete: false,
      myScheduleApprovar: false,
      myScheduleReviewer: false,
      appsView: false,
      appsCreateEdit: false,
      appsDelete: false,
      appsApprovar: false,
      appsReviewer: false,
    });
  }

  return (
    <>
      <div className="grid grid-cols-12 lg:px-5 md:px-5 sm:px-2 xs:px-2 mt-5 ">
        <div className="lg:col-span-2 md:col-span-3 sm:col-span-3 xs:col-span-6 ">
          <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl mb-5">
            Roles List
          </h1>
        </div>
        <div className="lg:col-span-10 md:col-span-9 sm:col-span-9 xs:col-span-6">
          <button
            className=" dashboard-btn  flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5  py-2 text-base sm:text-sm mb-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
            onClick={() => {setshowuserroleModal(true); setErrorsRoleName('')}}
          >
            Add New Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-5 md:px-5 sm:px-2 xs:px-2">
        {userRoleData &&
          filteruserRoleData?.length === 0 &&
          userRoleData.length > 0 &&
          userRoleData?.map((userrole) => (
            <div
              className="rounded-xl p-6 bg-[#E7EFFF] user-role-card"
              key={userrole.orgUserRoleID}
            >
              <div className="flex justify-between">
                <div className="role-name">
                  <p>Total {userrole.userCount} Users</p>
                  <h3 className="text-3xl text-primary my-2 break-words">
                    {userrole.orgUserRole}
                  </h3>
                  <button
                    onClick={() => {
                      handleSelectByID(userrole.orgUserRoleID);
                      setshowuserroleModal(true);
                    }}
                    className="bg-primary text-white items-center  rounded-full lg:px-4 sm:px-3 py-2 text-base sm:text-sm  hover:bg-white hover:text-primary  hover:shadow-lg hover:shadow-primary-500/50 border border-primary"
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            </div>
          ))}
        {filteruserRoleData &&
          filteruserRoleData?.length > 0 &&
          filteruserRoleData?.map((userrole) => (
            <div
              className="rounded-xl p-6 bg-[#E7EFFF] user-role-card"
              key={userrole.orgUserRoleID}
            >
              <div className="flex justify-between">
                <div className="role-name">
                  <p>Total {userrole.userCount} Users</p>
                  <h3 className="text-3xl text-primary my-2 break-words">
                    {userrole.orgUserRole}
                  </h3>
                  <button
                    onClick={() => {
                      handleSelectByID(userrole.orgUserRoleID);
                      setshowuserroleModal(true);
                    }}
                    className="bg-primary text-white items-center  rounded-full lg:px-4 sm:px-3 py-2 text-base sm:text-sm  hover:bg-white hover:text-primary  hover:shadow-lg hover:shadow-primary-500/50 border border-primary"
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-5">
        <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal" cellPadding={20}>
              <thead>
                <tr className="border-b border-b-[#E4E6FF] bg-[#EFF3FF]">
                  <th className="text-[#5A5881] text-base font-semibold">
                    <span className="flex items-center justify-left">
                      Name
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
                </tr>
              </thead>
              <tbody>
                {userData && sortedAndPaginatedData.length > 0 ? (
                  sortedAndPaginatedData.map((item,index) => {
                    return (
                      <tr className="border-b border-b-[#E4E6FF]" key={index}>
                        <th className="text-[#5E5E5E] text-center flex">
                          <div className="ps-3 flex text-left">
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
                              className=" text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
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
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr>
                      <td colSpan={4}>
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
                          <span className="text-4xl  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                            Loading...
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-5 mt-2">
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
      {showuserroleModal && (
        <>
          <div className="backdrop">
            <div ref={modalRef} className="user-model">
              <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                <h1 className="text-lg font-medium text-primary">
                  Add New Role
                </h1>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => {
                    setshowuserroleModal(false);
                    setUserRoleID("");
                    setRoleName("");
                    setCheckboxValues({
                      screenView: false,
                      screenCreateEdit: false,
                      screenDelete: false,
                      screenApprovar: false,
                      screenReviewer: false,
                      myScheduleView: false,
                      myScheduleCreateEdit: false,
                      myScheduleDelete: false,
                      myScheduleApprovar: false,
                      myScheduleReviewer: false,
                      appsView: false,
                      appsCreateEdit: false,
                      appsDelete: false,
                      appsApprovar: false,
                      appsReviewer: false,
                    });
                  }}
                />
              </div>
              <hr className="border-gray " />
              <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter New Role Name"
                          value={roleName}
                          className="formInput w-full"
                          onChange={(e) => setRoleName(e.target.value)}
                        />
                        {errorsRoleName && (
                          <p className="error">{errorsRoleName}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-12">
                      <h5 className="mr-2">Administrator Access</h5>
                    </div>
                    <div className="col-span-12">
                      <table
                        className="w-full"
                        cellPadding={10}
                        cellSpacing={10}
                      >
                        <thead>
                          <tr className="bg-lightgray">
                            <th></th>
                            <th>View</th>
                            <th>Create & Edit</th>
                            <th>Delete</th>
                            <th>Approval</th>
                            <th>Reviewer</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-lightgray rounded-md">
                            <td>Screen</td>
                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.screenView}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "screenView",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>

                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.screenCreateEdit}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "screenCreateEdit",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.screenDelete}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "screenDelete",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              {checkboxValues.screenApprovar == true ? (
                                <select
                                  className="formInput"
                                  value={screenIsApprovarID}
                                  onChange={(e) =>
                                    setScreenIsApprovarID(e.target.value)
                                  }
                                >
                                  <option label="select Approvar"></option>
                                  {userRoleData.map((userrole) => (
                                    <option
                                      key={userrole.orgUserRoleID}
                                      value={userrole.orgUserRoleID}
                                    >
                                      {userrole.orgUserRole}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.screenApprovar}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "screenApprovar",
                                      e.target.checked
                                    )
                                  }
                                />
                              )}
                            </td>
                            <td className="text-center">
                              {checkboxValues.screenReviewer == true ? (
                                <select
                                  className="formInput"
                                  value={screenIsReviwerID}
                                  onChange={(e) =>
                                    setScreenIsReviwerID(e.target.value)
                                  }
                                >
                                  <option label="select Reviewer"></option>
                                  {userRoleData.map((userrole) => (
                                    <option
                                      key={userrole.orgUserRoleID}
                                      value={userrole.orgUserRoleID}
                                    >
                                      {userrole.orgUserRole}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.screenReviewer}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "screenReviewer",
                                      e.target.checked
                                    )
                                  }
                                />
                              )}
                            </td>
                          </tr>

                          <tr className="border-b border-lightgray rounded-md">
                            <td>My Schedule</td>
                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.myScheduleView}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "myScheduleView",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>

                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.myScheduleCreateEdit}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "myScheduleCreateEdit",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.myScheduleDelete}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "myScheduleDelete",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              {checkboxValues.myScheduleApprovar == true ? (
                                <select
                                  className="formInput"
                                  value={myScheduleIsApprovarID}
                                  onChange={(e) =>
                                    setMyScheduleIsApprovarID(e.target.value)
                                  }
                                >
                                  <option label="select Approver"></option>
                                  {userRoleData.map((userrole) => (
                                    <option
                                      key={userrole.orgUserRoleID}
                                      value={userrole.orgUserRoleID}
                                    >
                                      {userrole.orgUserRole}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.myScheduleApprovar}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "myScheduleApprovar",
                                      e.target.checked
                                    )
                                  }
                                />
                              )}
                            </td>
                            <td className="text-center">
                              {checkboxValues.myScheduleReviewer == true ? (
                                <select
                                  className="formInput"
                                  value={myScheduleIsReviwerID}
                                  onChange={(e) =>
                                    setMyScheduleIsReviwerID(e.target.value)
                                  }
                                >
                                  <option label="select Reviewer"></option>
                                  {userRoleData.map((userrole) => (
                                    <option
                                      key={userrole.orgUserRoleID}
                                      value={userrole.orgUserRoleID}
                                    >
                                      {userrole.orgUserRole}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.myScheduleReviewer}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "myScheduleReviewer",
                                      e.target.checked
                                    )
                                  }
                                />
                              )}
                            </td>
                          </tr>

                          <tr className="border-b border-lightgray rounded-md">
                            <td>Apps</td>
                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.appsView}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "appsView",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>

                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.appsCreateEdit}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "appsCreateEdit",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.appsDelete}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "appsDelete",
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              {checkboxValues.appsApprovar == true ? (
                                <select
                                  className="formInput"
                                  value={appsIsApprovarID}
                                  onChange={(e) =>
                                    setAppsIsApprovarID(e.target.value)
                                  }
                                >
                                  <option label="select Approver"></option>
                                  {userRoleData.map((userrole) => (
                                    <option
                                      key={userrole.orgUserRoleID}
                                      value={userrole.orgUserRoleID}
                                    >
                                      {userrole.orgUserRole}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.appsApprovar}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "appsApprovar",
                                      e.target.checked
                                    )
                                  }
                                />
                              )}
                            </td>
                            <td className="text-center">
                              {checkboxValues.appsReviewer == true ? (
                                <select
                                  className="formInput"
                                  value={appsIsReviwerID}
                                  onChange={(e) =>
                                    setAppsIsReviwerID(e.target.value)
                                  }
                                >
                                  <option label="select Reviewer"></option>
                                  {userRoleData.map((userrole) => (
                                    <option
                                      key={userrole.orgUserRoleID}
                                      value={userrole.orgUserRoleID}
                                    >
                                      {userrole.orgUserRole}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="checkbox"
                                  checked={checkboxValues.appsReviewer}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      "appsReviewer",
                                      e.target.checked
                                    )
                                  }
                                />
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-span-12 text-center">
                      <button
                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        onClick={() => {
                          setUserRoleID("");
                          setRoleName("");
                          setCheckboxValues({
                            screenView: false,
                            screenCreateEdit: false,
                            screenDelete: false,
                            screenApprovar: false,
                            screenReviewer: false,
                            myScheduleView: false,
                            myScheduleCreateEdit: false,
                            myScheduleDelete: false,
                            myScheduleApprovar: false,
                            myScheduleReviewer: false,
                            appsView: false,
                            appsCreateEdit: false,
                            appsDelete: false,
                            appsApprovar: false,
                            appsReviewer: false,
                          });
                          setErrorsRoleName('')
                          setshowuserroleModal(false);
                        }}
                      >
                        Cancel
                      </button>
                      {userRoleID == "" ? (
                        <button
                          onClick={() => {
                            handleSaveUserRole();
                            setRoleName("");
                            setCheckboxValues({
                              screenView: false,
                              screenCreateEdit: false,
                              screenDelete: false,
                              screenApprovar: false,
                              screenReviewer: false,
                              myScheduleView: false,
                              myScheduleCreateEdit: false,
                              myScheduleDelete: false,
                              myScheduleApprovar: false,
                              myScheduleReviewer: false,
                              appsView: false,
                              appsCreateEdit: false,
                              appsDelete: false,
                              appsApprovar: false,
                              appsReviewer: false,
                            });
                            // setshowuserroleModal(false);
                          }}
                          className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleUpdateUserRole();
                            setRoleName("");
                            setCheckboxValues({
                              screenView: false,
                              screenCreateEdit: false,
                              screenDelete: false,
                              screenApprovar: false,
                              screenReviewer: false,
                              myScheduleView: false,
                              myScheduleCreateEdit: false,
                              myScheduleDelete: false,
                              myScheduleApprovar: false,
                              myScheduleReviewer: false,
                              appsView: false,
                              appsCreateEdit: false,
                              appsDelete: false,
                              appsApprovar: false,
                              appsReviewer: false,
                            });
                            setErrorsRoleName('')
                            setshowuserroleModal(false);
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

export default Userrole;
