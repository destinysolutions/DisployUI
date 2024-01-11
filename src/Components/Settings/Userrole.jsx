import React, { useRef } from "react";
import { useState } from "react";
import { FaCertificate } from "react-icons/fa";
import {
  MdDeleteForever,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { AiOutlineClose, AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import { BiEdit } from "react-icons/bi";
import toast from "react-hot-toast";

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
  const [selectRoleID, setSelectRoleID] = useState("");
  const [showActionBox, setShowActionBox] = useState(false);
  const [deletePopup, setdeletePopup] = useState(false);
  const [selectedRoleIDs, setSelectedRoleIDs] = useState([]);
  const [storeArray, setStoreArray] = useState([]);

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
  const [roleMethod, setRoleMethod] = useState("Add New Role");
  const [moduleTitle, setModuleTitle] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [levelOfApproval, setLevelOfApproval] = useState({});
  const [selectedLevel, setSelectedLevel] = useState({});
  const [showDynamicComponent, setShowDynamicComponent] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/OrganizationUsersRole/ListOfModule",
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setModuleTitle(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const handleCheckboxChange = (moduleId, moduleName, checkboxType) => {
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      const moduleCheckboxes = prevSelectedCheckboxes[moduleId] || {};

      const pageCheckboxes = moduleCheckboxes[moduleName] || {};

      const updatedCheckboxes = {
        ...prevSelectedCheckboxes,
        [moduleId]: {
          ...moduleCheckboxes,
          [moduleName]: {
            ...pageCheckboxes,
            [checkboxType]: !pageCheckboxes[checkboxType],
          },
        },
      };

      return updatedCheckboxes;
    });
  };

  const handleSetApprovalChange = (moduleId) => {
    setLevelOfApproval((prevLevelOfApproval) => ({
      ...prevLevelOfApproval,
      [moduleId]: prevLevelOfApproval[moduleId] ? null : 1,
    }));
  };

  const handleFetchUserRoleData = () => {
    let data = JSON.stringify({
      mode: "Selectlist",
      UserIDs: "1,2",
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
    if (!roleName) {
      toast.error("Role name is required");
    }
    let data = JSON.stringify({
      orgUserRoleID: userRoleID || 0,
      orgUserRole: roleName,
      isActive: 1,
      userID: 0,
      mode: "Save",
      userCount: 0,
      useraccess: [
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 1,
          isView: selectedCheckboxes[1]?.Module1?.View || false,
          isSave: selectedCheckboxes[1]?.Module1?.CreateEdit || false,
          isDelete: selectedCheckboxes[1]?.Module1?.Delete || false,
          isApprove: selectedCheckboxes[1]?.Module1?.Approval || false,
          noofApproval: selectedLevel[1],
          listApproverDetails: [
            {
              appoverId: 0,
              userId: selectedRoleIDs[1][0] || 0,
              levelNo: 1,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[1][1] || 0,
              levelNo: 2,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[1][2] || 0,
              levelNo: 3,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[1][3] || 0,
              levelNo: 4,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[1][4] || 0,
              levelNo: 5,
            },
          ],
        },
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 2,
          isView: selectedCheckboxes[2]?.Module2?.View || false,
          isSave: selectedCheckboxes[2]?.Module2?.CreateEdit || false,
          isDelete: selectedCheckboxes[2]?.Module2?.Delete || false,
          isApprove: selectedCheckboxes[2]?.Module2?.Approval || false,
          noofApproval: selectedLevel[2],
          listApproverDetails: [
            {
              appoverId: 0,
              userId: selectedRoleIDs[2][0] || 0,
              levelNo: 1,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[2][1] || 0,
              levelNo: 2,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[2][2] || 0,
              levelNo: 3,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[2][3] || 0,
              levelNo: 4,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[2][4] || 0,
              levelNo: 5,
            },
          ],
        },
        {
          userAccessID: 0,
          userRoleID: 0,
          moduleID: 3,
          isView: selectedCheckboxes[3]?.Module3?.View || false,
          isSave: selectedCheckboxes[3]?.Module3?.CreateEdit || false,
          isDelete: selectedCheckboxes[3]?.Module3?.Delete || false,
          isApprove: selectedCheckboxes[3]?.Module3?.Approval || false,
          noofApproval: selectedLevel[3],
          listApproverDetails: [
            {
              appoverId: 0,
              userId: selectedRoleIDs[3][0] || 0,
              levelNo: 1,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[3][1] || 0,
              levelNo: 2,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[3][2] || 0,
              levelNo: 3,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[3][3] || 0,
              levelNo: 4,
            },
            {
              appoverId: 0,
              userId: selectedRoleIDs[3][4] || 0,
              levelNo: 5,
            },
          ],
        },
      ],
    });
    toast.loading("saving..");
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
        console.log(JSON.stringify(response.data));
        if (response?.data?.status == 200) {
          setshowuserroleModal(false);
          handleFetchUserRoleData();
          setSelectedLevel({});
        }
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const handleSelectByID = (user_role_id) => {
    setUserRoleID(user_role_id);
    let data = JSON.stringify({
      orgUserRoleID: user_role_id,
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
        console.log(response.data);
        const selectedRole = response.data.data;
        setRoleName(selectedRole.orgUserRole);
        // Update checkboxes based on the selected role data
        const updatedCheckboxes = {};
        const updatedLevelOfApproval = {};
        const updatedSelectedRoleIDs = {};

        selectedRole.useraccess.forEach((access) => {
          const {
            moduleID,
            isView,
            isSave,
            isDelete,
            isApprove,
            noofApproval,
            listApproverDetails,
          } = access;

          // Use a default name for the module if pageName is not provided
          const moduleName = `Module${moduleID}`;

          updatedCheckboxes[moduleID] = {
            ...updatedCheckboxes[moduleID],
            [moduleName]: {
              View: isView,
              CreateEdit: isSave,
              Delete: isDelete,
              Approval: isApprove,
            },
          };

          // Update level of approval if it's not null
          if (noofApproval !== null) {
            updatedLevelOfApproval[moduleID] = noofApproval;
          }

          // Update selected role IDs
          const roleIDs = listApproverDetails.map(
            (approver) => approver.userId
          );
          updatedSelectedRoleIDs[moduleID] = roleIDs;
        });

        setSelectedCheckboxes(updatedCheckboxes);
        setLevelOfApproval(updatedLevelOfApproval);
        setSelectedLevel(updatedLevelOfApproval); // Set selected level
        setSelectedRoleIDs(updatedSelectedRoleIDs); // Set selected role IDs
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(levelOfApproval, "levelOfApproval");
  console.log(selectedRoleIDs, "selectedRoleIDs");
  const handleUpdateUserRole = () => {
    if (!roleName) {
      setErrorsRoleName("Role name is required");
      return;
    }

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
        setshowuserroleModal(false);
        setErrorsRoleName("");
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
        setErrorsRoleName("");
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
    setErrorsRoleName("");
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

  const handleDeleteRole = () => {};

  const handleRoleChange = (moduleID, index, value) => {
    setSelectedRoleIDs((prevSelectedRoleIDs) => {
      const newRoleIDs = {
        ...prevSelectedRoleIDs,
        [moduleID]: [...(prevSelectedRoleIDs[moduleID] || [])],
      };

      const roleId = parseInt(value, 10);

      const existingIndex = newRoleIDs[moduleID].indexOf(roleId);

      if (existingIndex === -1) {
        newRoleIDs[moduleID][index] = roleId;
      } else {
        toast.error("User ID already selected within this module");
      }

      return newRoleIDs;
    });
  };

  const DynamicDesignComponent = ({
    length,
    selectedRoleIDs,
    handleRoleChange,
    userRoleData,
    moduleID,
  }) => {
    const array = Array.from({ length }, (_, index) => index + 1);
    // useEffect(() => {
    //   if (array) {
    //     setStoreArray(array);
    //   }
    // }, []);

    return (
      <tr>
        <td className="flex items-center text-center">
          {array.map((item) => (
            <div key={item}>
              <select
                className="ml-3 border border-primary rounded-lg px-2 py-1"
                value={
                  selectedRoleIDs[moduleID] &&
                  selectedRoleIDs[moduleID][item - 1]
                }
                onChange={(e) =>
                  handleRoleChange(moduleID, item - 1, e.target.value)
                }
              >
                <option value="" label="Select User Role"></option>
                {userRoleData.map((userrole) => (
                  <option
                    key={userrole?.orgUserRoleID}
                    value={userrole?.orgUserRoleID}
                  >
                    {userrole.orgUserRole}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </td>
      </tr>
    );
  };

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
            onClick={() => {
              setshowuserroleModal(true);
              setRoleMethod("Add New Role");
              setShowDynamicComponent(false);
              setSelectedCheckboxes({});
              setRoleName("");
              setSelectedLevel({});
            }}
          >
            Add New Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-5 md:px-5 sm:px-2 xs:px-2 ">
        {userRoleData &&
          filteruserRoleData?.length === 0 &&
          userRoleData.length > 0 &&
          userRoleData?.map((userrole) => (
            <div
              className="rounded-xl p-6 bg-[#e6e6e6]"
              key={userrole.orgUserRoleID}
            >
              <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-3 text-[#5E5E5E] h-20">
                <div className="font-semibold">
                  <p>Total {userrole.userCount} Users </p>
                  <p className="text-1xl text-gray-900 dark:text-white capitalize mt-2 w-80">
                    {userrole.orgUserRole}
                  </p>

                  <div className="flex justify-left items-center mt-2 gap-3">
                    <div className="cursor-pointer text-2xl text-[#0000FF]">
                      <BiEdit
                        className=""
                        onClick={() => {
                          handleSelectByID(userrole.orgUserRoleID);
                          setshowuserroleModal(true);
                          setRoleMethod("Update Role");
                        }}
                      />
                    </div>
                    <div className="cursor-pointer text-2xl text-[#EE4B2B]">
                      <MdDeleteForever
                        onClick={() => handleDeleteRole(userrole.orgUserRoleID)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="role-user flex justify-end">
                    {userrole?.profilePics?.slice(0, 3)?.map((item, index) => {
                      return (
                        <span key={index}>
                          <img
                            className="w-5 h-5 rounded-full"
                            src={item}
                            alt="Not Image"
                          ></img>
                        </span>
                      );
                    })}
                    {userrole?.profilePics?.length > 2 && (
                      <span
                        style={{ backgroundColor: "#41479b" }}
                        className="text-white text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold text-green-800  me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                      >
                        3+
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {filteruserRoleData &&
          filteruserRoleData?.length > 0 &&
          filteruserRoleData?.map((userrole) => (
            <div
              className="rounded-xl p-6 bg-[#E7EFFF]"
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
                <tr className="border-b border-b-[#E4E6FF] bg-[#e6e6e6]">
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
                  sortedAndPaginatedData.map((item, index) => {
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
                              className="text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                            >
                              Active
                            </span>
                          ) : (
                            <span
                              style={{ backgroundColor: "#d1d5db" }}
                              className="text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
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
                          <span className="text-2xl  hover:bg-gray-400 text-gray-800 font-semibold rounded-full text-green-800 me-2 px-2.5 py-0.5 dark:bg-green-900 dark:text-green-300">
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
      {showuserroleModal && (
        <>
          <div className="backdrop">
            <div ref={modalRef} className="user-model">
              <div className="hours-heading flex justify-between items-center p-5 border-b border-gray">
                <h1 className="text-lg font-medium text-primary">
                  {roleMethod}
                </h1>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => {
                    setshowuserroleModal(false);
                    setShowDynamicComponent(false);
                    setSelectedLevel({});
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
                            {!showDynamicComponent ? (
                              <>
                                <th></th>
                                <th>View</th>
                                <th>Create & Edit</th>
                                <th>Delete</th>
                              </>
                            ) : (
                              <>
                                <th></th>
                                <th>Set Approval</th>
                                <th>Level Of Approval</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {moduleTitle.map((title) => {
                            const moduleName = `Module${title.moduleID}`;
                            return (
                              title.isForApproval === true && (
                                <tr
                                  className="border-b border-lightgray rounded-md"
                                  key={title.moduleID}
                                >
                                  <td>{title.pageName}</td>
                                  {!showDynamicComponent && (
                                    <>
                                      <td className="text-center">
                                        <div>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedCheckboxes[
                                                title.moduleID
                                              ]?.[moduleName]?.View || false
                                            }
                                            onChange={() =>
                                              handleCheckboxChange(
                                                title.moduleID,
                                                moduleName,
                                                "View"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedCheckboxes[
                                                title.moduleID
                                              ]?.[moduleName]?.CreateEdit ||
                                              false
                                            }
                                            onChange={() =>
                                              handleCheckboxChange(
                                                title.moduleID,
                                                moduleName,
                                                "CreateEdit"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedCheckboxes[
                                                title.moduleID
                                              ]?.[moduleName]?.Delete || false
                                            }
                                            onChange={() =>
                                              handleCheckboxChange(
                                                title.moduleID,
                                                moduleName,
                                                "Delete"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </>
                                  )}
                                  {showDynamicComponent && (
                                    <>
                                      <td className="text-center">
                                        <input
                                          type="checkbox"
                                          checked={
                                            selectedCheckboxes[
                                              title.moduleID
                                            ]?.[moduleName]?.Approval || false
                                          }
                                          onChange={() => {
                                            handleSetApprovalChange(
                                              title.moduleID
                                            );
                                            handleCheckboxChange(
                                              title.moduleID,
                                              moduleName,
                                              "Approval"
                                            );
                                          }}
                                        />
                                      </td>
                                      <td className="text-center">
                                        <select
                                          className="border border-primary rounded-lg px-4 py-1"
                                          disabled={
                                            !levelOfApproval[title.moduleID]
                                          }
                                          value={
                                            selectedLevel[title.moduleID] || ""
                                          }
                                          onChange={(e) => {
                                            const moduleId = title.moduleID;
                                            const level = parseInt(
                                              e.target.value,
                                              10
                                            );
                                            setSelectedLevel(
                                              (prevSelectedLevel) => ({
                                                ...prevSelectedLevel,
                                                [moduleId]: level,
                                              })
                                            );
                                          }}
                                        >
                                          <option
                                            value=""
                                            label="-- Select --"
                                            disabled
                                          ></option>
                                          <option
                                            value="1"
                                            disabled={userRoleData.length < 1}
                                          >
                                            1
                                          </option>
                                          <option
                                            value="2"
                                            disabled={userRoleData.length < 2}
                                          >
                                            2
                                          </option>
                                          <option
                                            value="3"
                                            disabled={userRoleData.length < 3}
                                          >
                                            3
                                          </option>
                                          <option
                                            value="4"
                                            disabled={userRoleData.length < 4}
                                          >
                                            4
                                          </option>
                                          <option
                                            value="5"
                                            disabled={userRoleData.length < 5}
                                          >
                                            5
                                          </option>
                                        </select>
                                      </td>

                                      <DynamicDesignComponent
                                        moduleID={title.moduleID}
                                        length={selectedLevel?.[title.moduleID]}
                                        selectedRoleIDs={selectedRoleIDs}
                                        handleRoleChange={handleRoleChange}
                                        userRoleData={userRoleData}
                                      />
                                    </>
                                  )}
                                </tr>
                              )
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-span-12 text-center">
                      <button
                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        onClick={() => {
                          setshowuserroleModal(false);
                          setShowDynamicComponent(false);
                          setSelectedLevel({});
                        }}
                      >
                        Cancel
                      </button>

                      {showDynamicComponent ? (
                        <button
                          onClick={() => {
                            handleSaveUserRole();
                            setShowDynamicComponent(false);
                          }}
                          className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowDynamicComponent(true);
                          }}
                          className="bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white"
                        >
                          Next
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
