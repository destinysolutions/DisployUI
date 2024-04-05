import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getOrgUsersRole,
  getUsersRoles,
  handleUserRoleById,
} from "../../Redux/SettingUserSlice";
import { BiEdit } from "react-icons/bi";
import ReactTooltip from "react-tooltip";
import { getUserRoleData, roleBaseUserFind } from "../../Redux/UserRoleSlice";
import ShowUserScreen from "./ShowUserScreen";
import AddEditUserRole from "./AddEditUserRole";
import { ADD_UPDATE_ORGANIZATION_USER_ROLE } from "../../Pages/Api";
import { useSelector } from "react-redux";
import { combineUserroleObjects } from "../Common/Common";

const Userrole = ({ searchValue, sidebarOpen }) => {
  const { token } = useSelector((state) => state.root.auth);
  const [userRoleData, setUserRoleData] = useState();
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();
  const showUsersRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [heading, setHeading] = useState("Add");

  const [nextbutton, setNextButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [moduleTitle, setModuleTitle] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [roleuserList, setRoleUserList] = useState([]);
  const [userDisable, setUserDisable] = useState();
  const [allUserRoleData, setAllUserRoleData] = useState({
    userRoleData: [],
    SearchData: [],
  });

  // Filter data based on search term
  const filteredData = allUserRoleData?.SearchData?.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

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
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue])

  // Handle sorting when a table header is clicked
  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  const fetchUserRole = () => {
    const payload = {
      mode: "Selectlist",
    };
    setLoading(true);
    dispatch(getUsersRoles(payload))
      .then((res) => {
        setAllUserRoleData({
          userRoleData: res?.payload?.data,
          SearchData: res?.payload?.data,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  const handleRoleBasedUserGet = (userRoleID) => {
    setShowUsers(true);
    setUserLoading(true);
    dispatch(roleBaseUserFind(userRoleID))?.then((res) => {
      setUserList(res?.payload?.data);
      setUserLoading(false);
    });
  };

  useEffect(() => {
    Promise.all([dispatch(getOrgUsersRole()), dispatch(getUserRoleData())])
      .then(([orgUsersRoleRes, userRoleDataRes]) => {
        // Process orgUsersRoleRes
        const filteredOrgUsersRoleData = orgUsersRoleRes.payload.data.filter(
          (item) => item.moduleID !== 9 && item.moduleID !== 22
        );
        setModuleTitle(filteredOrgUsersRoleData);

        // Process userRoleDataRes
        setRoleUserList(userRoleDataRes?.payload?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
    setUserDisable();
    setUserRoleData();
  };

  const handleSelectByID = (user_role_id) => {
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

    dispatch(handleUserRoleById({ config }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          const selectedRole = res?.payload?.data;
          const data = combineUserroleObjects(selectedRole);
          setNextButton(false);
          setUserRoleData(data);
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      <div className="p-5">
        <div className="flex justify-between">
          <h2 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
            Roles List
          </h2>
          <button
            className="flex align-middle items-center float-right bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
            onClick={() => {
              setUserDisable();
              setShowModal(true);
              setHeading("Add");
              setUserRoleData();
              setNextButton(false);
            }}
          >
            Add New Role
          </button>
        </div>

        <div className="clear-both">
          <div className="bg-white rounded-xl lg:mt-6 md:mt-6 mt-4 shadow screen-section ">
            <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
              <table
                className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                cellPadding={15}
              >
                <thead>
                  <tr className="items-center table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold text-center flex items-center">
                      <div className="flex w-full items-center justify-center">
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
                      </div>
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold text-center">
                      View Users
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold text-center">
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
                    allUserRoleData?.SearchData &&
                    sortedAndPaginatedData?.length > 0 &&
                    sortedAndPaginatedData.map((item, index) => {
                      return (
                        <tr className="border-b border-b-[#E4E6FF]" key={index}>
                          <td className="text-[#5E5E5E] text-center">
                            {item?.orgUserRole}
                          </td>
                          <td
                            className="text-[#5E5E5E] text-center cursor-pointer"
                            onClick={() => {
                              handleRoleBasedUserGet(item.orgUserRoleID);
                            }}
                          >
                            {item?.userCount}
                          </td>
                          <td className="text-center">
                            <div className="flex justify-center gap-4">
                              <>
                                <div
                                  data-tip
                                  data-for="Edit"
                                  className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                  onClick={() => {
                                    setHeading("Update")
                                    handleSelectByID(item.orgUserRoleID);
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {!loading &&
                    allUserRoleData?.SearchData &&
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
            <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
              <div className="flex items-center">
                <span className="text-gray-500">{`Total ${allUserRoleData?.SearchData?.length} User Role`}</span>
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
                  disabled={(currentPage === totalPages) || (allUserRoleData?.SearchData?.length === 0)}
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
      {showUsers && (
        <ShowUserScreen
          showUsersRef={showUsersRef}
          setShowUsers={setShowUsers}
          loading={userLoading}
          userList={userList}
        />
      )}
      {showModal && (
        <AddEditUserRole
          heading={heading}
          toggleModal={toggleModal}
          moduleTitle={moduleTitle}
          allUserRoleData={allUserRoleData}
          setNextButton={setNextButton}
          nextbutton={nextbutton}
          roleuserList={roleuserList}
          fetchUserRole={fetchUserRole}
          userRoleData={userRoleData}
          setShowModal={setShowModal}
          authToken={authToken}
          setUserDisable={setUserDisable}
          userDisable={userDisable}
          setUserRoleData={setUserRoleData}
          dispatch={dispatch}
        />
      )}
    </>
  );
};

export default Userrole;
