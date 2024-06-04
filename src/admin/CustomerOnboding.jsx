import React, { lazy, useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllCustomerDetails, handleRemoveUser } from "../Redux/admin/OnBodingSlice";
import { useSelector } from "react-redux";
import { RiUser3Fill } from "react-icons/ri";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";
import { extractSubstring, getDaysPassed, getDifferenceInDays } from "../Components/Common/Common";
import { CANCEL_SUBSCRIPTION, GET_USER_BILLING_DETAILS, INCREASE_TRIAL_DAYS } from "../Pages/Api";
import { IncreaseTrialDays, handleCancelSubscription } from "../Redux/PaymentSlice";
import { GetBillingDetails } from "../Redux/SettingUserSlice";
import toast from "react-hot-toast";
import moment from "moment";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

// const AdminNavbar = lazy(() => import('./AdminNavbar'));
// const AdminSidebar = lazy(() => import('./AdminSidebar'));

const CustomerOnboding = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const store = useSelector((state) => state.root.onBoding.getCustomerItems);
  const [activeTab, setActiveTab] = useState("users");
  const [loadFist, setLoadFist] = useState(true);
  const [userPlan, setUserPlan] = useState({});
  const [rangeValue, setRangeValue] = useState(getDaysPassed(userPlan?.startDate, new Date()));

  const getUserBilling = () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_USER_BILLING_DETAILS}?Email=${params?.email}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        },
      }
      dispatch(GetBillingDetails({ config })).then((res) => {
        if (res?.payload?.status) {
          setUserPlan(res?.payload?.data)
          setLoadFist(false)
        } else {
          setLoadFist(false)
        }
      })
    } catch (error) {
      toast.error('Error fetching cards');
    }
  }

  useEffect(() => {
    if (loadFist) {
      dispatch(getAllCustomerDetails({ Email: params?.email, OrgID: params?.id }))
      getUserBilling()
    }
  }, [loadFist]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setLoadFist(false)
  };

  const handleDelete = (organizationID) => {
    const payload = {
      organizationID: organizationID,
      operation: "Delete",
    };
    try {
      Swal.fire({
        title: "Delete Permanently",
        text: "Are you sure you want to delete this user",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(handleRemoveUser(payload)).then((res) => {
            if (res?.payload?.status === 200) {
              navigate("/onboarded")
            }
          }).catch((error) => {
            console.log('error', error)
          });
        }
      });
    } catch (error) {
      console.log("error handleDeletePermanently Singal --- ", error);
    }
  };

  const handleChange = (event) => {
    // Extract the value from the event
    const value = event.target.value;
    // Update the state with the new value
    setRangeValue(value);
  };


  const handleIncreaseTrial = () => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${INCREASE_TRIAL_DAYS}?Email=${params?.email}&Days=${rangeValue}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }
    dispatch(IncreaseTrialDays({ config }))
      .then((res) => {
        if (res?.payload?.status) {
          toast.error(res?.payload?.message)
        } else {
          toast.error(res?.payload?.message)
        }
      })
      .catch((error) => console.log('error', error))
  }


  const CancelSubscription = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${CANCEL_SUBSCRIPTION}?Email=${params?.email}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }
    dispatch(handleCancelSubscription({ config }))
      .then((res) => {
        if (res?.payload?.status) {
          toast.success(res?.payload?.message)
        } else {
          toast.error(res?.payload?.message)
        }
      })
      .catch((error) => console.log('error', error))
  }



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
          {loadFist && (
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
          )}
          {!loadFist && (
            <>
              <div className="flex items-center justify-between mx-2 mb-5 mt-3">
                <div className="title">
                  <Link
                    to="/onboarded"
                    className="font-bold text-xl flex gap-2 cursor-pointer"
                  >
                    <IoChevronBack size={30} />
                    Customer Details
                  </Link>
                </div>
              </div>

              <div className="mt-5 mb-10">
                <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
                  <div className="flex flex-wrap mt-2">
                    <div className="w-full lg:w-1/2 pl-5 pr-3 mb-4">
                      <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 min-h-full m-1">
                        <div className="user-details text-center border-b border-light-blue mb-4">
                          <span className="user-img">
                            <img src={store.data?.profilePhoto} alt="Profile Not Found" />
                          </span>
                          <span className="user-name my-2">{store.data?.firstName + " " + store.data?.lastName}</span>
                          {/*<span className="user-designation">Super Admin</span>*/}
                          <div className="total-screens-count mt-2 mb-4">
                            <span className="screen-icon mr-3">
                              <i className="fa fa-tv text-blue text-2xl"></i>
                            </span>
                            <span className="screen-count text-center">
                              <strong>{store.data?.userRoleName}</strong>
                              <p>Total Screens</p>
                              <p>{store?.data?.totalScreens}</p>
                            </span>
                          </div>
                        </div>
                        <div className="user-pro-details text-base">
                          <h3 className="user-name my-2">Details</h3>
                          <div className="flex mb-2">
                            <label>User ID:</label>
                            <span>{store.data?.userId}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>User Name:</label>
                            <span>{store.data?.firstName + " " + store.data?.lastName}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>Company Name:</label>
                            <span>{store.data?.company}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>Email:</label>
                            <span>{store.data?.email}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>Status:</label>
                            <span className="user-designation">Active</span>
                          </div>
                          <div className="flex mb-2">
                            <label>Role::</label>
                            <span>{store.data?.userRoleName}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>Contact:</label>
                            <span>{store.data?.phone}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>Language:</label>
                            <span>{store.data?.languageName}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>Country:</label>
                            <span>{store.data?.countryName}</span>
                          </div>
                          <div className="flex mb-2">
                            <label>State :</label>
                            <span>{store.data?.stateName}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <button className="hover:text-#ffbebe px-8 py-3 border border-red shadow-md rounded-full text-red-600 text-1xl font-semibold bg-[#ffbebe] "
                            onClick={() =>
                              handleDelete(params?.id)
                            }
                          >
                            Delete Customer
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-1/2 pr-5 pl-3 mb-4 ">
                      <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 ">
                        <div className="user-pro-details text-base">
                          <h3 className="user-name my-2">Current Plan</h3>
                          <h4 className="text-base font-medium">Your Current Plan {extractSubstring(userPlan?.description)}</h4>
                          <p className="mb-4">A simple start for everyone</p>
                          <h4 className="text-base font-medium">Active until {moment(
                            userPlan?.endDate
                          ).format("LL")}</h4>
                          <p className="mb-4">
                            We will send you a notification upon Subscription
                            expiration.
                          </p>
                          <div className="w-full mb-4">
                            <div className="flex justify-between">
                              <span>Days</span>
                              <span>{getDaysPassed(userPlan?.startDate, new Date())} of {getDifferenceInDays(userPlan?.startDate, userPlan?.endDate)} Days</span>
                            </div>
                            <input
                              id="customRange1"
                              className="w-full form-range"
                              type="range"
                              value={rangeValue}
                              onChange={handleChange}
                              min={0}
                              disabled={store?.data?.isActivePlan}
                              max={getDifferenceInDays(userPlan?.startDate, userPlan?.endDate)}
                            />
                          </div>

                          <div className="flex justify-center w-full mb-5">
                          {!store?.data?.isActivePlan && (
                            <button
                              className="mr-3 text-white bg-blue-700 hover:bg-blue-800 rounded-full text-base px-3 py-2 text-center"
                              onClick={() => handleIncreaseTrial(params?.email)}
                            >
                              Increase Trial Days
                            </button>
                          )}
                            <button
                              className="bg-[#FF0000] rounded-full px-3 py-2 text-white hover:bg-primary text-base"
                              onClick={() => {
                                CancelSubscription(params?.email)
                              }}
                            >
                              Cancel Subscription
                            </button>
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
                                        {store?.storage?.totalStorage} GB
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
                                          {store?.storage?.consumedSpace} GB
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
                                        {store?.storage?.availableSpace} GB
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      {store?.storage?.usedInPercentage} %
                                    </td>
                                  </tr>
                                </tbody>

                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full pl-3 p-2">
                    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 ">
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
                                {store && store.orgUserMaster && store.orgUserMaster.length > 0 ? (
                                  store.orgUserMaster.map((item, index) => (
                                    <tr
                                      className="border-b border-b-[#E4E6FF]"
                                      key={index}
                                    >
                                      <td className="text-[#5E5E5E] text-center flex">
                                        {item?.profilePhoto !== null ? (
                                          <img
                                            className="w-10 h-10 rounded-full"
                                            src={item?.profilePhoto}
                                            alt="User image"
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
                                        <button>
                                          {item?.count}
                                        </button>
                                      </td>
                                      <td className="text-[#5E5E5E] text-center">
                                        <span>
                                          {item?.isActive === 1 ? (
                                            <span
                                              style={{ backgroundColor: "#cee9d6" }}
                                              className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4 text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                            >
                                              Active
                                            </span>
                                          ) : (
                                            <span
                                              style={{ backgroundColor: "#f1b2b2" }}
                                              className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#FF0000] font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                            >
                                              Inactive
                                            </span>
                                          )}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5}>
                                      <div className="flex text-center justify-center">
                                        <span className="text-2xl  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full text-green-800 me-2 dark:bg-green-900 dark:text-green-300">
                                          No Data Available
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                )}
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
                                {store &&
                                  store.roles?.length > 0 &&
                                  store.roles.map((item, index) => {
                                    return (
                                      <tr className="border-b border-b-[#E4E6FF]" key={index}>
                                        <td className="text-[#5E5E5E] text-left">
                                          {item?.text}
                                        </td>
                                        <td
                                          className="text-[#5E5E5E] text-left cursor-pointer"
                                        >
                                          {item?.value}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                {store.roles?.length === 0 && (
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
                                  {store.default &&
                                    (Object.values(store.default).includes("Video") ||
                                      Object.values(store.default).includes("OnlineVideo")) && (
                                      <ReactPlayer
                                        url={store.default?.assetFolderPath}
                                        className="relative w-full h-[300px] z-20 admin-media "
                                        controls={true}
                                        playing={true}
                                        muted
                                      />
                                    )}

                                  {store.default &&
                                    (Object.values(store.default).includes("OnlineImage") ||
                                      Object.values(store.default).includes("Image")) && (
                                      <img
                                        src={store.default?.assetFolderPath}
                                        alt="Media"
                                        className="w-[576px] h-[324px] mx-auto object-cover min-h-80"
                                      />
                                    )}
                                </div>
                                {/* <span className="mr-3 text-primary sm:text-base xs:text-base font-medium py-2 p-2">
                              Asset / Playing:- {store.default?.assetName}
                            </span> */}
                              </div>

                              <div>
                                <button className="Mediatabshow mediatabactive rounded-tl-md">
                                  Emergency Media
                                </button>
                                {/* <span className=" text-primary sm:text-base xs:text-base font-medium py-2">
                              Asset / Playing:- {store.emergency?.assetName}
                            </span> */}
                                <div className="w-full mt-4">
                                  {store.emergency &&
                                    (Object.values(store.emergency).includes("Video") ||
                                      Object.values(store.emergency).includes("OnlineVideo")) && (
                                      <ReactPlayer
                                        url={store.emergency?.assetFolderPath}
                                        className="relative w-full h-[300px] z-20 admin-media "
                                        controls={true}
                                        playing={true}
                                        muted
                                      />
                                    )}

                                  {store.emergency &&
                                    (Object.values(store.emergency).includes("OnlineImage") ||
                                      Object.values(store.emergency).includes("Image")) && (
                                      <img
                                        src={store.emergency?.assetFolderPath}
                                        alt="Media"
                                        className="w-[576px] h-[324px] mx-auto object-cover min-h-80"
                                      />
                                    )}
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
          )}
        </div>
      </div >
    </>
  );
};

export default CustomerOnboding;
