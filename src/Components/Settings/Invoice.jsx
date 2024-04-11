import React, { useEffect, useRef, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { FaDownload, FaEye } from "react-icons/fa";
import InvoiceBilling from "./InvoiceBilling";
import { IoIosArrowRoundBack } from "react-icons/io";
import { GET_ALL_INVOICE, GET_INVOICE_BY_ID } from "../../Pages/Api";
import { handleAllInvoice, handleInvoiceById } from "../../Redux/PaymentSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";

const Invoice = ({
  permissions,
  showInvoice,
  setShowInvoice,
  InvoiceRef,
  DownloadInvoice,
  sidebarOpen,
  setInvoiceID
}) => {
  const dispatch = useDispatch()
  const { user, token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [invoiceData, setInvoiceData] = useState([])
  const [selectData, setSelectData] = useState(null)
  const [selectInvoiceId, setInvoiceId] = useState("")
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoiceData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(invoiceData?.length / itemsPerPage);
  const fetchAllInvoice = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_ALL_INVOICE}?Role=${user?.role === "1" ? "S" : "User"}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }
    dispatch(handleAllInvoice({ config })).then((res) => {
      // setInvoiceData(res?.payload?.data)
      setLoading(false)
    })
  }

  const fetchInvoiceById = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_INVOICE_BY_ID}?ID=${selectInvoiceId}&Role=${user?.role === "1" ? "S" : "User"}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }
    dispatch(handleInvoiceById({ config })).then((res) => {
      setSelectData(res?.payload?.data)
    })
  }

  useEffect(() => {
    fetchAllInvoice()
  }, [])

  useEffect(() => {
    if (selectInvoiceId) {
      fetchInvoiceById()
    }
  }, [selectInvoiceId])



  return (
    <>
      {!showInvoice && (
        <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
          <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2">
            <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl mb-5">
              Invoice
            </h1>
          </div>
          <div className="clear-both">
            <div className="bg-white rounded-xl mt-8 shadow screen-section ">
              <div className="rounded-xl mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg">
                <table
                  className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                  cellPadding={15}
                >
                  <thead className="items-center table-head-bg">
                    <tr>
                      <th className="text-[#5A5881] text-base font-semibold text-left">
                        Client Name
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold text-center">
                        Total
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold text-center">
                        Issued Date
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold text-center">
                        Status
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && currentItems.length === 0 && (
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
                      invoiceData && currentItems?.map((item, index) => {
                        return (
                          <tr className="border-b border-gray-200 bg-white" key={index} >
                            <td className="px-5 py-3 text-lg">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10">
                                  <img
                                    className="w-full h-full rounded-full"
                                    src={item?.profilePic}
                                    alt={item?.name}
                                  />
                                </div>
                                {/*                              <div className="ml-3">
                                <p className="text-blue-900 whitespace-no-wrap">
                                  #5036
                                </p>
                      </div>*/}

                                <div className="ml-3">
                                  <p className="text-blue-900 whitespace-no-wrap">
                                    {item?.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {/*<td className="px-5 py-3 text-lg">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {item?.name}
                            </p>
                    </td>*/}
                            <td className="px-5 py-3 text-lg text-center">
                              <p className="text-gray-900 whitespace-no-wrap">${(item?.totalAmount) / 100}</p>
                            </td>
                            <td className="px-5 py-3 text-lg text-center">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {moment(
                                  item?.issuedDate
                                ).format("LLL")}

                              </p>
                            </td>
                            <td className="px-5 py-3 text-lg text-center">
                              {item?.status === "Completed" && (
                                <span className="relative inline-block px-3 py-1 font-semibold bg-lime-300 text-green leading-tight rounded-full">
                                  {item?.status}
                                </span>
                              )}
                              {item?.status !== "Completed" && (
                                <span className="relative inline-block px-3 py-1 font-semibold bg-orange-200 text-orange-400 leading-tight rounded-full">
                                  {item?.status}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-lg text-center">
                              <div className="flex gap-4 justify-center">
                                <>
                                  <div
                                    data-tip
                                    data-for="View"
                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={() => { setShowInvoice(true); setInvoiceId(item?.id) }}
                                  >
                                    <BsEyeFill />
                                  </div>

                                  <div
                                    data-tip
                                    data-for="Edit"
                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={() => { DownloadInvoice(); setInvoiceId(item?.id); setInvoiceID(item?.id); }}
                                  >
                                    <FaDownload />
                                  </div>
                                </>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    {!loading &&
                      invoiceData &&
                      invoiceData?.length === 0 && (
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
                  <span className="text-gray-500">{`Total ${invoiceData?.length} Invoice`}</span>
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
                    <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
                  </div>
                  {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={(currentPage === totalPages) || (invoiceData?.length === 0)}
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
        </div >
      )}
      {
        showInvoice && (
          <div className="p-4 flex justify-start items-center gap-2">
            <IoIosArrowRoundBack
              size={36}
              className="cursor-pointer"
              onClick={() => setShowInvoice(false)}
            />
            <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
              Invoice
            </h1>
          </div>
        )
      }
      <div className={`${showInvoice ? "" : "hidden"}`}>
        <InvoiceBilling
          InvoiceRef={InvoiceRef}
          setShowInvoice={setShowInvoice}
          selectData={selectData}
        />
      </div>
    </>
  );
};

export default Invoice;
