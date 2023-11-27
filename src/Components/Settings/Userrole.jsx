import React from "react";
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
const Userrole = () => {
  const [showdata, setShowdata] = useState(false);
  const handleDropupClick = () => {
    setShowdata(!showdata);
  };
  {
    /*model */
  }
  const [showuserroleModal, setshowuserroleModal] = useState(false);
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;

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
  //   const [checkboxStates, setCheckboxStates] = useState({});

  //   const handleCheckboxChange = (id) => {
  //     setCheckboxStates((prevStates) => ({
  //       ...prevStates,
  //       [id]: !prevStates[id], // Toggle the checkbox state
  //     }));
  //   };

  const [checkboxStates, setCheckboxStates] = useState({});

  const [showPopup, setShowPopup] = useState(false); // New state to control the popup visibility
  const [selectedRows, setSelectedRows] = useState([]);
  // const handleCheckboxChange = (checkboxId, rowId) => {
  //   // Update checkbox state when clicked
  //   setCheckboxStates((prevState) => ({
  //     ...prevState,
  //     [rowId]: {
  //       ...prevState[rowId],
  //       [checkboxId]: !prevState[rowId]?.[checkboxId] || true,
  //     },
  //   }));
  // };

  // Check if any checkbox is checked
  const isAnyCheckboxChecked = Object.values(checkboxStates).some(
    (isChecked) => isChecked
  );

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

  // State to store the checkbox and dropdown states retrieved from localStorage
  const [localStorageData, setLocalStorageData] = useState({
    checkboxState: {},
    dropdownStates: {},
  });
  // Destructure checkboxStates and dropdownStates from localStorageData
  const { checkboxState, dropdownStates } = localStorageData;
  // Effect hook to retrieve data from localStorage on component mount
  useEffect(() => {
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

  const [userRoleData, setUserRoleData] = useState([]);
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
  const handleActionClick = (rowId) => {
    setShowActionBox(rowId);
  };
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
  useEffect(() => {
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
  }, []);
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
        setUserRoleData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    handleFetchUserRoleData();
  }, []);

  const handleSaveUserRole = () => {
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

    axios
      .request(config)
      .then((response) => {
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
  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },

    {
      name: "Roles",
      selector: (row) => row.userRole,
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
                  <button>Edit User</button>
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
                            // onClick={() => {
                            //   handleDelete(row.orgUserSpecificID);
                            //   setdeletePopup(false);
                            // }}
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
      <div className="grid grid-cols-12 lg:px-5 md:px-5 sm:px-2 xs:px-2 mt-5 ">
        <div className="lg:col-span-2 md:col-span-3 sm:col-span-3 xs:col-span-6 ">
          <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl mb-5">
            Roles List
          </h1>
        </div>
        <div className="lg:col-span-10 md:col-span-9 sm:col-span-9 xs:col-span-6">
          <button
            className=" dashboard-btn  flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5  py-2 text-base sm:text-sm mb-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
            onClick={() => setshowuserroleModal(true)}
          >
            Add New Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-5 md:px-5 sm:px-2 xs:px-2">
        {userRoleData.map((userrole) => (
          <div
            className="rounded-xl p-6 bg-[#E7EFFF] user-role-card"
            key={userrole.orgUserRoleID}
          >
            <div className="flex justify-between">
              <div className="role-name">
                <p>Total 5 Users</p>
                <h3 className="text-3xl text-primary my-2">
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
      {/* <div className="md:px-5 sm:px-2 xs:px-2 mt-5">
        <div className="my-2 flex sm:flex-row flex-col">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <select className="h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select className="h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="block relative">
            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current text-gray-500"
              >
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
              </svg>
            </span>
            <input
              placeholder="Search"
              className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div> */}
      {/* <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2 mt-5">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className=" bg-[#EFF3FF] border-b border-b-[#E4E6FF]">
                <th className="px-3 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-3 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-3 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Notification
                </th>

                <th className="px-3 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Screen Access
                </th>
                <th className="px-3 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-b-[#E4E6FF]">
                <td className="p-3 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-full h-full rounded-full"
                        src="../../../Settings/1user-img.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Vera Carpenter
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Manager</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Email</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">15</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <span className="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                    Active
                  </span>
                </td>
                <td className="px-3 py-6 bg-white text-sm flex ">
                  <a href="#">
                    <img src="../../../Settings/view-icon.svg" />
                  </a>
                  <a className="px-2" href="#">
                    <img src="../../../Settings/edit-icon.svg" />
                  </a>
                  <a href="#">
                    <img src="../../../Settings/delete-icon.svg" />
                  </a>
                </td>
              </tr>
              <tr className="border-b border-b-[#E4E6FF]">
                <td className="p-3 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-full h-full rounded-full"
                        src="../../../Settings/2user-img.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Vera Carpenter
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Manager</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Email</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">15</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <span className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight">
                    InActive
                  </span>
                </td>
                <td className="px-3 py-6 bg-white text-sm flex ">
                  <a href="#">
                    <img src="../../../Settings/view-icon.svg" />
                  </a>
                  <a className="px-2" href="#">
                    <img src="../../../Settings/edit-icon.svg" />
                  </a>
                  <a href="#">
                    <img src="../../../Settings/delete-icon.svg" />
                  </a>
                </td>
              </tr>
              <tr className="border-b border-b-[#E4E6FF]">
                <td className="p-3 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-full h-full rounded-full"
                        src="../../../Settings/3user-img.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Vera Carpenter
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Manager</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Email</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">15</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <span className="bg-orange-200 px-3 py-1 font-semibold text-orange-900 leading-tight">
                    Pending
                  </span>
                </td>
                <td className="px-3 py-6 bg-white text-sm flex ">
                  <a href="#">
                    <img src="../../../Settings/view-icon.svg" />
                  </a>
                  <a className="px-2" href="#">
                    <img src="../../../Settings/edit-icon.svg" />
                  </a>
                  <a href="#">
                    <img src="../../../Settings/delete-icon.svg" />
                  </a>
                </td>
              </tr>
              <tr className="border-b border-b-[#E4E6FF]">
                <td className="p-3 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-full h-full rounded-full"
                        src="../../../Settings/1user-img.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Vera Carpenter
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Manager</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Email</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">15</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <span className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight">
                    inActive
                  </span>
                </td>
                <td className="px-3 py-6 bg-white text-sm flex ">
                  <a href="#">
                    <img src="../../../Settings/view-icon.svg" />
                  </a>
                  <a className="px-2" href="#">
                    <img src="../../../Settings/edit-icon.svg" />
                  </a>
                  <a href="#">
                    <img src="../../../Settings/delete-icon.svg" />
                  </a>
                </td>
              </tr>
              <tr className="border-b border-b-[#E4E6FF]">
                <td className="p-3 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-full h-full rounded-full"
                        src="../../../Settings/1user-img.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Vera Carpenter
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Manager</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Email</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">15</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <span className="bg-orange-200 px-3 py-1 font-semibold text-orange-900 leading-tight">
                    Pending
                  </span>
                </td>
                <td className="px-3 py-6 bg-white text-sm flex ">
                  <a href="#">
                    <img src="../../../Settings/view-icon.svg" />
                  </a>
                  <a className="px-2" href="#">
                    <img src="../../../Settings/edit-icon.svg" />
                  </a>
                  <a href="#">
                    <img src="../../../Settings/delete-icon.svg" />
                  </a>
                </td>
              </tr>
              <tr className="border-b border-b-[#E4E6FF]">
                <td className="p-3 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-full h-full rounded-full"
                        src="../../../Settings/3user-img.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Vera Carpenter
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Manager</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Email</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">15</p>
                </td>
                <td className="p-3 bg-white text-sm">
                  <span className="bg-green-200 px-3 py-1 font-semibold text-green-900 leading-tight">
                    Active
                  </span>
                </td>
                <td className="px-3 py-6 bg-white text-sm flex ">
                  <a href="#">
                    <img src="../../../Settings/view-icon.svg" />
                  </a>
                  <a className="px-2" href="#">
                    <img src="../../../Settings/edit-icon.svg" />
                  </a>
                  <a href="#">
                    <img src="../../../Settings/delete-icon.svg" />
                  </a>
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
      </div> */}
      <div className="mt-7">
        <DataTable
          columns={columns}
          data={userData}
          fixedHeader
          pagination
          paginationPerPage={10}
        ></DataTable>
      </div>
      {showuserroleModal && (
        <>
          <div className="backdrop">
            <div className="user-model">
              <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                <h1 className="text-lg font-medium text-primary">
                  Add New Role
                </h1>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => {
                    setshowuserroleModal(false);
                    setUserRoleID("");
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
                          setshowuserroleModal(false);
                          setUserRoleID("");
                        }}
                      >
                        Cancel
                      </button>
                      {userRoleID == "" ? (
                        <button
                          onClick={() => {
                            handleSaveUserRole();
                            setshowuserroleModal(false);
                          }}
                          className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleUpdateUserRole();
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
