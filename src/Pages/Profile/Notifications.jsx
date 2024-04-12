import React, { useEffect, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { BsEyeFill } from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import { AiOutlineSearch } from "react-icons/ai";
import AssetsPreview from "../../Components/Common/AssetsPreview";
import AddPriceForAds from "../../Components/Common/AddPriceForAds";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateAdsRate,
  getNotificationData,
  resetStatus,
} from "../../Redux/admin/AdvertisementSlice";
import moment from "moment/moment";
import toast from "react-hot-toast";
import { handleGetAllNotifications } from "../../Redux/NotificationSlice";
import { GET_ALL_NOTIFICATIONS } from "../Api";

const Notifications = ({ sidebarOpen }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notification.slice(indexOfFirstItem, indexOfLastItem);
  const fetchNotifications = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_NOTIFICATIONS,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }

    dispatch(handleGetAllNotifications({ config })).then((res) => {
      setNotification(res?.payload?.data)
      setLoading(false)
    }).catch((error) => {
      console.log('error', error)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <>
      <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">

   
        <div className="clear-both">
          <div className="bg-white rounded-xl lg:mt-6 md:mt-6 mt-4 shadow screen-section ">
            <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
              <table
                className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                cellPadding={15}
              >
                <thead>
                  <tr className="items-center table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Screen Name
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Message
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      GoogleLocation
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && currentItems.length > 0 && (
                    currentItems.map((item, index) => (
                      <tr className="border-b border-b-[#E4E6FF]" key={index}>
                        <td className="text-[#5E5E5E] ">
                          <div className="text-base text-center font-medium capitalize">
                            {item?.screenName}
                          </div>
                        </td>
                        <td className="text-[#5E5E5E]">
                          <div className="text-base text-center font-medium">
                            {item?.message}
                          </div>
                        </td>
                        <td className="text-[#5E5E5E]">
                          <div className="text-base text-center font-medium">
                            {item?.location}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {!loading && currentItems.length === 0 && (
                    <tr>
                      <td
                        className="text-[#5E5E5E] font-semibold text-center text-2xl"
                        colSpan={3}
                      >
                        Data Not found !
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={3}>
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
                </tbody>
              </table>
            </div>
            <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
              <div className="flex items-center">
                <span className="text-gray-500">{`Total ${notification?.length} Notifications`}</span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
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
                  <span className="text-gray-500">{`Page ${currentPage} of ${Math.ceil(notification?.length / itemsPerPage)}`}</span>
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(notification.length / itemsPerPage)
                  }
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
  );
};

export default Notifications;
