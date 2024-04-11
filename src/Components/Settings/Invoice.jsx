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
}) => {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [invoiceData, setInvoiceData] = useState([])
  const [selectData, setSelectData] = useState(null)
  const [selectInvoiceId, setInvoiceId] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoiceData.slice(indexOfFirstItem, indexOfLastItem);
  console.log('currentItems', currentItems)

  const fetchAllInvoice = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_INVOICE,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }
    dispatch(handleAllInvoice({ config })).then((res) => {
      console.log('res', res)
      setInvoiceData(res?.payload?.data)
    })
  }

  const fetchInvoiceById = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_INVOICE_BY_ID}?InvoiceId=${selectInvoiceId}`,
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
                      <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                        Profile Pic
                      </th>
                      <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                        Client Name
                      </th>
                      <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                        Total
                      </th>
                      <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                        Issued Date
                      </th>
                      <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                        Status{" "}
                      </th>
                      <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems?.map((item, index) => {
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
                            </div>
                          </td>
                          <td className="px-5 py-3 text-lg">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {item?.name}
                            </p>
                          </td>
                          <td className="px-5 py-3 text-lg">
                            <p className="text-gray-900 whitespace-no-wrap">${(item?.totalAmount) / 100}</p>
                          </td>
                          <td className="px-5 py-3 text-lg">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {moment(
                                item?.issuedDate
                              ).format("LLL")}

                            </p>
                          </td>
                          <td className="px-5 py-3 text-lg">
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
                          <td className="px-5 py-3 text-lg">
                            <div className="flex gap-4">
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
                                  onClick={() => { DownloadInvoice(); setInvoiceId(item?.id) }}
                                >
                                  <FaDownload />
                                </div>
                              </>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {invoiceData.length > 0 && (
                <div className="mt-2 flex justify-end p-5">
                  <div className="flex justify-end mar-btm-15">
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
                      Previous
                    </button>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(invoiceData.length / itemsPerPage)
                      }
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
              )}
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
