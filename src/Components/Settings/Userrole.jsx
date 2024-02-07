import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUserRoleData, roleBaseUserFind } from "../../Redux/UserRoleSlice";
import { BiEdit } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { RiUser3Fill } from "react-icons/ri";
import {
  ADD_UPDATE_ORGANIZATION_USER_ROLE,
  GET_ORG_USERS,
  USER_ROLE_GET,
} from "../../Pages/Api";
import ReactTooltip from "react-tooltip";
import { getMenuAll } from "../../Redux/SidebarSlice";

const Userrole = ({ searchValue, permissions }) => {
  const store = useSelector((state) => state.root.userRole);
  console.log('store', store)
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [showuserroleModal, setshowuserroleModal] = useState(false);
  const [userRoleData, setUserRoleData] = useState([]);
  const [filteruserRoleData, setFilterUserRoleData] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [userRoleID, setUserRoleID] = useState("");
  const [userData, setUserData] = useState([]);
  const [selectedRoleIDs, setSelectedRoleIDs] = useState([]);
  const [moduleTitle, setModuleTitle] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedField, setSortedField] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [levelOfApproval, setLevelOfApproval] = useState({});
  const [selectedLevel, setSelectedLevel] = useState({});
  const [showDynamicComponent, setShowDynamicComponent] = useState(false);
  const [firstLoad, setLoadFirst] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const [userList, setUserList] = useState([]);
  const [roleuserList, setRoleUserList] = useState([]);

  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);
  const showUsersRef = useRef(null);
  const dispatch = useDispatch();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(userRoleData.length / itemsPerPage);

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
    filteruserRoleData?.length > 0 ? filteruserRoleData : userRoleData,
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
      url: `${USER_ROLE_GET}`,
      headers: {
        Authorization: authToken,
      },
    };
    axios
      .request(config)
      .then((response) => {
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
      url: `${ADD_UPDATE_ORGANIZATION_USER_ROLE}`,
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
  const handleRoleBasedUserGet = (userRoleID) => {
    setShowUsers(true);
    dispatch(roleBaseUserFind(userRoleID))?.then((res) => {
      setUserList(res?.payload?.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (firstLoad) {
      dispatch(getUserRoleData()).then((res)=>{
        setRoleUserList(res?.payload?.data)
      }).catch((error)=>{
        console.log('error', error)
      });
      setLoadFirst(false);
    }
  }, [firstLoad, store]);

  const handleSaveUserRole = () => {
    if (!roleName) {
      toast.error("Role name is required");
      return;
    }

    let isAtLeastOneCheckboxChecked = false;

    let data = JSON.stringify({
      orgUserRoleID: userRoleID || 0,
      orgUserRole: roleName,
      isActive: 1,
      userID: 0,
      mode: "Save",
      userCount: 0,
      useraccess: moduleTitle
        .map((title) => {
          const moduleId = title.moduleID;
          const moduleName = `Module${moduleId}`;

          const isView =
            selectedCheckboxes[moduleId]?.[moduleName]?.View || false;
          const isSave =
            selectedCheckboxes[moduleId]?.[moduleName]?.CreateEdit || false;
          const isDelete =
            selectedCheckboxes[moduleId]?.[moduleName]?.Delete || false;
          const isApprove =
            selectedCheckboxes[moduleId]?.[moduleName]?.Approval || false;

          // Check if at least one checkbox is checked for each module
          if (isApprove || isView || isSave || isDelete) {
            isAtLeastOneCheckboxChecked = true;
          }

          // Check if only the "Approval" checkbox is checked
          if (isApprove && !(isView || isSave || isDelete)) {
            isAtLeastOneCheckboxChecked = false;
            return null;
          }

          return {
            moduleID: moduleId,
            isView: isView,
            isSave: isSave,
            isDelete: isDelete,
            isApprove: isApprove,
            noofApproval: selectedLevel[moduleId],
            listApproverDetails: Array.from({ length: 5 }, (_, index) => ({
              appoverId: 0,
              userId: selectedRoleIDs[moduleId]?.[index] || 0,
              levelNo: index + 1,
            })),
          };
        })
        .filter(Boolean), // Remove null values

      // Save data only if the validation passes
    });

    if (!isAtLeastOneCheckboxChecked) {
      toast.error("Please select at least one checkbox for each module");
      return; // Don't proceed with saving
    }

    toast.loading("saving..");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADD_UPDATE_ORGANIZATION_USER_ROLE}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == 200) {
          setshowuserroleModal(false);
          handleFetchUserRoleData();
          setSelectedLevel({});
          dispatch(getMenuAll());
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
      url: `${ADD_UPDATE_ORGANIZATION_USER_ROLE}`,
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

  useEffect(() => {
    handleFetchUserRoleData();

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${GET_ORG_USERS}`,
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
  }, []);

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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setshowuserroleModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);
  function handleClickOutside() {
    setshowuserroleModal(false);
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showUsersRef.current &&
        !showUsersRef.current.contains(event.target)
      ) {
        setShowUsers(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  function handleClickOutside() {
    setShowUsers(false);
  }

  const DynamicDesignComponent = ({
    length,
    selectedRoleIDs,
    handleRoleChange,
    moduleID,
  }) => {
    const array = Array.from({ length }, (_, index) => index + 1);

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
                {roleuserList?.map((userrole) => (
                  <option key={userrole?.value} value={userrole?.value}>
                    {userrole?.text}
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
         {permissions.isSave && 
          <button
          className="flex align-middle items-center float-right bg-SlateBlue  text-white rounded-full lg:px-6 sm:px-5  py-2 text-base sm:text-sm mb-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
            onClick={() => {
              setshowuserroleModal(true);
              setShowDynamicComponent(false);
              setSelectedCheckboxes({});
              setRoleName("");
              setSelectedLevel({});
            }}
            >
            Add New Role
          </button>
          }
        </div>
      </div>

      <div className="px-5 pb-6 mt-2">
        <div className="rounded-xl shadow ">
          <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
            <table
              className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
              cellPadding={20}
            >
              <thead>
                <tr className="items-center table-head-bg">
                  <th className="text-[#5A5881] text-base font-semibold flex items-center justify-center">
                    Role Name
                    <svg
                      className="w-3 h-3 ms-1.5 cursor-pointer"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      onClick={() => handleSort("orgUserRole")}
                    >
                      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                    </svg>
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold text-center">
                    View Users
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteruserRoleData && sortedAndPaginatedData.length > 0 ? (
                  sortedAndPaginatedData.map((item, index) => {
                    return (
                      <tr className="border-b border-b-[#E4E6FF]" key={index}>
                        <td className="text-center text-[#5A5881] text-base">
                          {item.orgUserRole}
                        </td>

                        <td
                          className="text-center text-[#5A5881] text-base"
                          onClick={() => {
                            handleRoleBasedUserGet(item.orgUserRoleID);
                          }}
                        >
                          <button>{item.userCount}</button>
                        </td>

                        <td className="text-center text-[#5A5881] text-base">
                          {permissions.isSave &&
                            <button
                              data-tip
                              data-for="Edit"
                              onClick={() => {
                                handleSelectByID(item.orgUserRoleID);
                                setshowuserroleModal(true);
                              }}
                              className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              <BiEdit />
                              <ReactTooltip
                                id="Edit"
                                place="bottom"
                                type="warning"
                                effect="float"
                              >
                                <span>Edit</span>
                              </ReactTooltip>
                            </button>
                          }
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

          <div className="flex justify-end mar-btm-15">
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
            <div ref={modalRef} className="user-model ">
              <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">
                  <div className="grid grid-cols-12 gap-6">
                    {!showDynamicComponent && (
                      <>
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
                      </>
                    )}
                    <div className="col-span-12">
                      <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                        <table
                          className="screen-table w-full"
                          cellPadding={10}
                          cellSpacing={10}
                        >
                          <thead>
                            <tr className="table-head-bg">
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
                                // title.isForApproval === true && (
                                <tr
                                  className="border-b border-lightgray rounded-md"
                                  key={title.moduleID}
                                >
                                  {showDynamicComponent &&
                                    title.isForApproval === true && (
                                      <td>{title.pageName}</td>
                                    )}
                                  {!showDynamicComponent && (
                                    <>
                                      <td>{title.pageName}</td>
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
                                  {title.isForApproval === true &&
                                    showDynamicComponent && (
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
                                              selectedLevel[title.moduleID] ||
                                              ""
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
                                              disabled={store?.data?.length < 1}
                                            >
                                              1
                                            </option>
                                            <option
                                              value="2"
                                              disabled={store?.data?.length < 2}
                                            >
                                              2
                                            </option>
                                            <option
                                              value="3"
                                              disabled={store?.data?.length < 3}
                                            >
                                              3
                                            </option>
                                            <option
                                              value="4"
                                              disabled={store?.data?.length < 4}
                                            >
                                              4
                                            </option>
                                            <option
                                              value="5"
                                              disabled={store?.data?.length < 5}
                                            >
                                              5
                                            </option>
                                          </select>
                                        </td>

                                        <DynamicDesignComponent
                                          moduleID={title.moduleID}
                                          length={
                                            selectedLevel?.[title.moduleID]
                                          }
                                          selectedRoleIDs={selectedRoleIDs}
                                          handleRoleChange={handleRoleChange}
                                          userRoleData={userRoleData}
                                        />
                                      </>
                                    )}
                                </tr>
                              );
                              // );
                            })}
                          </tbody>
                        </table>
                      </div>
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

      {showUsers && (
        <div>
          <div className="bg-black bg-opacity-20 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              ref={showUsersRef}
              className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="relative w-full cursor-pointer z-40 rounded-full">
                  <button
                    className="text-xl absolute -right-3 -top-4 bg-black text-white rounded-full"
                    onClick={() => {
                      setShowUsers(false);
                    }}
                  >
                    <AiOutlineCloseCircle className="text-3xl" />
                  </button>
                </div>
                <div className="schedual-table bg-white shadow p-3 rounded-lg">
                  <table className="w-full p-4 rounded-lg" cellPadding={20}>
                    <thead>
                      <tr className="items-center table-head-bg">
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          UserName
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Role
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center font-semibold text-lg"
                          >
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
                      )}
                      {!loading &&
                        userList?.length > 0 &&
                        store?.getUserData?.map((item, index) => (
                          // {store?.getUserData?.map(
                          // (item, index) => (
                          <tr
                            key={index}
                            className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                          >
                            <td className="text-[#5E5E5E] text-center flex">
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
                            </td>
                            <td className="text-[#5E5E5E] text-center">
                              {item?.userRoleName}
                            </td>
                            <td className="text-[#5E5E5E] text-center">
                              {item.isActive == 1 ? (
                                <span
                                  style={{
                                    backgroundColor: "#cee9d6",
                                  }}
                                  className=" text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                  Active
                                </span>
                              ) : (
                                <span
                                  style={{
                                    backgroundColor: "#d1d5db",
                                  }}
                                  className="bg-[#FF0000] rounded-full px-6 py-1 text-white hover:bg-primary text-sm"
                                >
                                  Inactive
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      {!loading && userList?.length === 0 && (
                        <tr>
                          <td colSpan={6}>
                            <p className="text-center p-2">
                              No Users available.
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
        </div>
      )}
    </>
  );
};

export default Userrole;
