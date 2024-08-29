import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createImageFromInitials } from "../../Components/Navbar";

import AdminNavbar from '../AdminNavbar'
import AdminSidebar from '../AdminSidebar'

const RetailerDetails = ({ sidebarOpen, setSidebarOpen }) => {
  const color = "#e4aa07";
  const { user, token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("users");
  const [loadFist, setLoadFist] = useState(true);
  const [userPlan, setUserPlan] = useState({});

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setLoadFist(false)
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
          {/* {loadFist && (
            <div className="flex text-center m-5 justify-center">
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-10 h-10 me-3 text-black animate-spin dark:text-gray-600"
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
          )} */}

          <>
            <div className="flex items-center justify-between mx-2 mb-5 mt-3">
              <div className="title">
                <Link
                  to="/retailer"
                  className="font-bold text-xl flex gap-2 cursor-pointer"
                >
                  <IoChevronBack size={30} />
                  Retailer Details
                </Link>
              </div>
            </div>

            <div className="mt-5 mb-10">
              <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
                <div className="flex flex-wrap mt-2">
                  <div className="w-full  pl-5 pr-3 mb-4">

                    <div class="grid grid-cols-1 sm:grid-cols-3 bg-white shadow-xl rounded-xl p-5 border border-gray-200 pl-3">
                      <div class="mb-3 text-gray-500 dark:text-gray-400">
                        <div className="user-details text-center mt-4">
                          <span className="user-img flex w-full items-center justify-center">
                            {/* {!store.data?.profilePhoto ? ( */}
                            <img
                              src={createImageFromInitials(500, 'Jignesh', color)}
                              alt="profile"
                              className=" profile w-30 h-20 rounded"
                            />
                            {/* ) : (
                              <img
                                src={store.data?.profilePhoto}
                                alt="profile"
                                className="profile rounded-full"
                              />
                            )} */}
                          </span>
                          <span className="user-name my-2">Jignesh Lakum</span>
                          <div className="total-screens-count mt-2 mb-4">
                            <span className="screen-icon mr-3">
                              <i className="fa fa-tv text-blue text-2xl"></i>
                            </span>
                            <span className="screen-count text-center">
                              <strong>Retailer</strong>
                              <p>Total Screens : - 30</p>
                            </span>
                          </div>
                          <div className="flex items-center justify-center">
                            <button className="hover:text-#ffbebe px-8 py-3 border border-red shadow-md rounded-full text-red-600 text-1xl font-semibold bg-[#ffbebe] ">
                              Delete Retailer
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="col-span-2">
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-3">
                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">User ID</label>
                              <input
                                type="text"
                                placeholder="User ID"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>

                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">User Name</label>
                              <input
                                type="text"
                                placeholder="User Name"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>
                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">Company Name</label>
                              <input
                                type="text"
                                placeholder="Company Name"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>
                        </div>


                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-3">
                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">Email</label>
                              <input
                                type="text"
                                placeholder="Email"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>

                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">Status</label>
                              <input
                                type="text"
                                placeholder="Status"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>
                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">Role</label>
                              <input
                                type="text"
                                placeholder="Role"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>
                        </div>


                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-3">
                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">Contact</label>
                              <input
                                type="text"
                                placeholder="Contact"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>

                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">Language</label>
                              <input
                                type="text"
                                placeholder="Language"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>
                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">Country</label>
                              <input
                                type="text"
                                placeholder="Country"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>

                          <p class="mb-3 text-gray-500 dark:text-gray-400">
                            <div className="relative">
                              <label className="formLabel">State</label>
                              <input
                                type="text"
                                placeholder="State"
                                name="PlanName"
                                className="formInput text-xs"
                                disabled
                              />
                            </div>
                          </p>

                        </div>

                    </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 mt-2">
                      <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2 mt-5">
                        <h1 className="font-medium lg:text-1xl md:text-2xl sm:text-xl mb-5">
                          Storage Limit
                        </h1>
                      </div>
                      <div className=" sm:px-2 xs:px-2 pb-5 ">
                        <div className="rounded-xl shadow">
                          <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                            <table
                              className="w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                              cellPadding={15}
                            >
                              <thead>
                                <tr className="table-head-bg">
                                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                    Total Space
                                  </th>
                                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                    Consumed Space
                                  </th>
                                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                    Available Space
                                  </th>
                                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                    Used in Percentage
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td className="text-[#5E5E5E] text-center flex justify-center">
                                    <span
                                      style={{
                                        background: "#E4E6FF",
                                        padding: "10px 15px",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      panding GB
                                    </span>
                                  </td>
                                  <td className="text-[#5E5E5E] text-center">
                                    <div className="flex justify-center">
                                      <span
                                        style={{
                                          background: "#E4E6FF",
                                          padding: "10px 15px",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        panding GB
                                      </span>

                                    </div>
                                  </td>
                                  <td className="text-[#5E5E5E] text-center flex justify-center">
                                    <span
                                      style={{
                                        background: "#E4E6FF",
                                        padding: "10px 15px",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      panding GB
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    panding
                                  </td>
                                </tr>
                              </tbody>

                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 mt-3 ">

                      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <ul
                          className="flex flex-wrap -mb-px text-sm font-medium text-center"
                          id="default-tab"
                          data-tabs-toggle="#default-tab-content"
                          role="tablist"
                        >
                          <li className="me-2" role="presentation">
                            <button
                              className={`inline-block p-4 rounded-t-lg ${activeTab === "users" ? "bg-[##e4e6ff] font-bold border-b-2" : "bg-white"}`}
                              id="users-tab"
                              onClick={() => handleTabClick("users")}
                              type="button"
                              role="tab"
                              aria-controls="users"
                              aria-selected="false"
                            >
                              Users
                            </button>
                          </li>

                          <li className="me-2" role="presentation">
                            <button
                              className={`inline-block p-4  rounded-t-lg ${activeTab === "usersRole" ? "bg-[##e4e6ff] font-bold border-b-2" : "bg-white"}`}
                              id="usersRole-tab"
                              onClick={() => handleTabClick("usersRole")}
                              type="button"
                              role="tab"
                              aria-controls="usersRole"
                              aria-selected="false"
                            >
                              Users Role
                            </button>
                          </li>

                          <li className="me-2" role="presentation">
                            <button
                              className={`inline-block p-4  rounded-t-lg ${activeTab === "defaultMedia" ? "bg-[##e4e6ff] font-bold border-b-2" : "bg-white"}`}
                              id="defaultMedia-tab"
                              onClick={() => handleTabClick("defaultMedia")}
                              type="button"
                              role="tab"
                              aria-controls="defaultMedia"
                              aria-selected="false"
                            >
                              Default Media
                            </button>
                          </li>

                        </ul>
                      </div>
                      <div id="default-tab-content">
                        <div
                          className={`p-4 rounded-lg ${activeTab === "users" ? "block" : "hidden"} bg-gray-50 dark:bg-gray-800`}
                          id="users"
                          role="tabpanel"
                          aria-labelledby="users-tab"
                        >
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
                                </tr>
                              </thead>

                              <tbody>
                                <tr
                                  className="border-b border-b-[#E4E6FF]"
                                >
                                  <td className="text-[#5E5E5E] text-center flex">
                                    <div className="ps-3 flex text-center">
                                      <div className="font-normal text-gray-500 mt-2">
                                        panding
                                      </div>
                                    </div>
                                  </td>

                                  <td className="text-[#5E5E5E] text-center">
                                    panding
                                  </td>
                                  <td className="text-[#5E5E5E] text-center">
                                    <button>
                                      panding
                                    </button>
                                  </td>
                                  <td className="text-[#5E5E5E] text-center">
                                    panding
                                  </td>
                                </tr>


                              </tbody>

                            </table>
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-lg ${activeTab === "usersRole" ? "block" : "hidden"} bg-gray-50 dark:bg-gray-800`}
                          id="usersRole"
                          role="tabpanel"
                          aria-labelledby="usersRole-tab"
                        >

                          <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                            <table
                              className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                              cellPadding={15}
                            >
                              <thead>
                                <tr className="items-center table-head-bg">
                                  <th className="text-[#5A5881] text-base font-semibold text-left  ">
                                    Role Name
                                  </th>
                                  <th className="text-[#5A5881] text-base font-semibold text-left ">
                                    View Users
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <td>panding</td>
                                <td> panding</td>
                              </tbody>

                            </table>
                          </div>

                        </div>


                        <div
                          className={`p-4 rounded-lg ${activeTab === "defaultMedia" ? "block" : "hidden"} bg-gray-50 dark:bg-gray-800`}
                          id="usersRole"
                          role="tabpanel"
                          aria-labelledby="usersRole-tab"
                        >
                          <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                            <div className="grid gap-4 grid-cols-2">

                              <div>
                                <button className="Mediatabshow mediatabactive rounded-tl-md">
                                  Media
                                </button>
                                <div className="w-full mt-4">
                                  panding
                                </div>
                              </div>

                              <div>
                                <button className="Mediatabshow mediatabactive rounded-tl-md">
                                  Emergency Media
                                </button>
                                <div className="w-full mt-4">
                                  panding
                                </div>

                              </div>

                            </div>
                          </div>
                        </div>


                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </>

        </div>
      </div>
    </>
  );
};

export default RetailerDetails;
