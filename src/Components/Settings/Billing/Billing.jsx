import React, { useEffect, useState } from "react";

import ConfirmationDialog from "../../Common/ConfirmationDialog";
import { BiUserPlus } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";
import { BsEyeFill } from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import { AiOutlineSearch } from "react-icons/ai";
import UserInfo from "./UserInfo";
import { GET_ALL_BILLING, GET_BILLING_BY_ID, GET_ALL_CARD, GET_USER_BILLING_DETAILS } from "../../../Pages/Api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleGetAllBillings, handleGetBillingByID } from "../../../Redux/AdminSettingSlice";
import { GetAllCardList } from "../../../Redux/CardSlice.js"
import { GetBillingDetails } from "../../../Redux/SettingUserSlice.js"
import toast from "react-hot-toast";
import { getAllCustomerDetails } from "../../../Redux/admin/OnBodingSlice.js";

const Billing = ({ sidebarOpen }) => {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  // pagination Start
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [billingList, setBillingList] = useState([])
  const [cardList, setCardList] = useState([])
  const [userPlan, setUserPlan] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [showBillingProfile, setShowBillingProfile] = useState(false);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = billingList?.slice(indexOfFirstItem, indexOfLastItem);


  const fetchAllBilling = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_ALL_BILLING}`,
      headers: {
        Authorization: authToken
      },
    }
    dispatch(handleGetAllBillings({ config })).then((res) => {
      if (res?.payload?.status) {
        setBillingList(res?.payload?.data)
      }
    }).catch((error) => console.log('error', error))
  }

  useEffect(() => {
    fetchAllBilling()
  }, [])

  const fetchCards = async (email) => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_ALL_CARD}?Email=${email}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        },
      }
      dispatch(GetAllCardList({ config })).then((res) => {
        if (res?.payload?.status) {
          setCardList(res?.payload?.data);
        }
      })
    } catch (error) {
      toast.error('Error fetching cards');
    }
  };


  const getUserBilling = (email) => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_USER_BILLING_DETAILS}?Email=${email}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        },
      }
      dispatch(GetBillingDetails({ config })).then((res) => {
        if (res?.payload?.status) {
          setUserPlan(res?.payload?.data)
          setShowBillingProfile(true)
        }
      })
    } catch (error) {
      toast.error('Error fetching cards');
    }
  }

  const handleViewProfile = async (email) => {
    toast.loading("fetching data...")
    await fetchCards(email)
    await getUserBilling(email)
    dispatch(getAllCustomerDetails({ Email: email, OrgID: 0 }))
      .then((res) => {
        setCustomerData(res?.payload?.data);
        toast.remove()
      })
      .catch((err) => {
        console.log('err', err)
        toast.remove()
      })
  }

  return (
    <>
      {showBillingProfile ? (
        <UserInfo
          setShowBillingProfile={setShowBillingProfile}
          showBillingProfile={showBillingProfile}
          cardList={cardList}
          userPlan={userPlan}
          customerData={customerData}
        />
      ) : (
        <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
          {/*<div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <AiOutlineSearch className="w-5 h-5 text-gray" />
              </span>
              <input
                type="text"
                placeholder="Searching.."
                className="border border-primary rounded-lg pl-10 py-1.5 search-user"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
      </div>*/}

          <div className="clear-both">
            <div className="bg-white rounded-xl mt-8 shadow screen-section ">
              <div className="rounded-xl mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg">
                <table
                  className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                  cellPadding={15}
                >
                  <thead>
                    <tr className="items-center table-head-bg">
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center flex items-center">
                        Customer Name
                        {/*<svg
                          className="w-3 h-3 ms-1.5 cursor-pointer"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        // onClick={() => handleSort("compositionName")}
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
    </svg>*/}
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Plan
                      </th>
                      {/* <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Billing
  </th>*/}
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Status
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr className="border-b border-b-[#E4E6FF]" key={index}>
                        <td className="text-[#5E5E5E] text-center flex">
                          {/* {item?.profilePhoto !== null ? (
                            <img
                              className="w-10 h-10 rounded-full"
                              src={item?.profilePhoto}
                              alt="Jese image"
                            />
                          ) : (
                            <RiUser3Fill className="w-10 h-10" />
                          )}*/}
                          <div className="ps-3 flex text-center">
                            <div className="font-normal text-gray-500 mt-2">
                              {item?.customer_name}
                            </div>
                          </div>
                        </td>

                        <td className="text-[#5E5E5E] text-center">
                          {item?.plan}
                        </td>

                        {/*<td className="text-[#5E5E5E] text-center">
                          {item?.cardNumber ? `**** **** **** ${item?.cardNumber}` : ""}
                        </td>*/}

                        <td className="text-[#5E5E5E] text-center">
                          {item.status === "Paid" ? (
                            <span className="bg-[#3AB700] rounded-full px-6 py-1 text-white hover:bg-primary text-sm">
                              Active
                            </span>
                          ) : (
                            <span className="bg-[#FF0000] rounded-full px-6 py-1 text-white hover:bg-primary text-sm">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="text-[#5E5E5E] text-center">
                          <div className="flex justify-center gap-4">
                            <div
                              data-tip
                              data-for="View"
                              className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              onClick={() => handleViewProfile(item?.customer_email)}
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
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (

                    <tr>
                      <td colSpan={5}>
                        <div className="flex text-center m-5 justify-center">
                          <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                            No Data Available
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </table>
              </div>
              <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                <div className="flex items-center">
                  <span className="text-gray-500">{`Total ${billingList?.length} Biils`}</span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
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
                    <span className="text-gray-500">{`Page ${currentPage} of ${Math.ceil(billingList?.length / itemsPerPage)}`}</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(billingList?.length / itemsPerPage)
                    }
                    className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 "
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
      )}
    </>
  );
};

export default Billing;
