import React, { useEffect, useState } from "react";
import "../../Styles/Report.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { LuDownload } from "react-icons/lu";
import { CiFilter } from "react-icons/ci";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";
import moment from "moment";
import { PageNumber } from "../Common/Common";

const Auditlogreport = ({
  allReportData,
  debouncedOnChange,
  exportDataToCSV,
  loading,
  sidebarOpen, setType, type
}) => {
  const { user, token, userDetails } = useSelector((state) => state.root.auth);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allReportData?.SearchData?.length / pageSize);
  const sortedAndPaginatedData = allReportData?.SearchData?.length > 0 ? allReportData?.SearchData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  
  useEffect(() => {
    setCurrentPage(1)
  }, [allReportData?.SearchData]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className={userDetails?.isTrial && user?.userDetails?.isRetailer === false && !userDetails?.isActivePlan ? "lg:pt-32 md:pt-32 sm:pt-20 xs:pt-20 px-5 page-contain" : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"}>
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center ">
            <div className="flex items-center lg:mb-0 md:mb-0 sm:mb-4 ">
              <Link to={"/reports"}>
                <MdKeyboardArrowLeft className="text-4xl text-primary" />
              </Link>
              <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                Audit Log Reports
              </h1>
            </div>

            <div className=" flex items-center flex-wrap  gap-3">
              {/* <ul className="p-0 m-0 lg:flex md:flex sm:block xs:block items-center border rounded-md border-primary  lg:mr-3 md:mr-3 sm:mr-2 xs:mr-0 lg:w-auto md:w-auto sm:w-auto xs:w-full">
                <li className="bg-primary text-white py-1 px-4 font-light-[26px] rounded-tl-md rounded-tb-md">
                  <label className=" leading-8">Daily</label>
                </li>
                <li>
                  <input
                    type="date"
                    className=" date-formate px-2 py-1 bg-[transparent] text-base lg:w-auto md:w-auto sm:w-full xs:w-full"
                  />
                </li>
  </ul> */}

              <div className=" flex items-end justify-end relative sm:mr-0">
                <select
                  className="border border-primary rounded-lg px-4 pl-2 py-2 "
                  id="selectOption"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option className='hidden'>Select Type</option>
                  <option value="">All</option>
                  <option value="Asset">Asset</option>
                  <option value="Folder">Folder</option>
                  <option value="Apps">Apps</option>
                  <option value="Composition">Composition</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Weather Schedule">Weather Schedule</option>
                </select>
              </div>
              <div className=" flex items-end justify-end relative sm:mr-0">
                <AiOutlineSearch className="absolute top-[13px] left-[10px] z-10 text-primary searchicon" />
                <input
                  type="text"
                  placeholder=" Search "
                  className="border border-primary rounded-full bg-[transparent] pl-8 py-2 search-user placeholder:text-primary"
                  onChange={(e) => debouncedOnChange(e)}
                />
              </div>

              <div className="ml-2">
                <div
                  data-tip
                  data-for="Download"
                  className="cursor-pointer text-white bg-SlateBlue hover:bg-primary focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => exportDataToCSV()}
                >
                  <LuDownload />
                  <ReactTooltip
                    id="Download"
                    place="bottom"
                    type="warning"
                    effect="solid"
                  >
                    <span>Download</span>
                  </ReactTooltip>
                </div>
              </div>
            </div>
          </div>

          <div className="sectiondetails mt-5 bg-white p-5 rounded-lg drop-shadow-sm ">
            <div className="overflow-x-scroll sc-scrollbar rounded-lg">
              <table
                className="screen-table w-full text-[#5E5E5E]"
                cellPadding={15}
              >
                <thead>
                  <tr className="table-head-bg rounded-md">
                    <th className="flex items-center font-medium p-3">
                      Performed By
                    </th>
                    <th className=" font-medium text-center p-3">
                      Performed on
                    </th>
                    <th className=" font-medium text-center p-3">Message</th>
                    <th className=" font-medium text-center p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr className="text-center col-span-full font-semibold text-xl">
                      <td colSpan={4}>
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
                      </td>
                    </tr>
                  )}
                  {sortedAndPaginatedData?.length > 0 &&
                    !loading &&
                    sortedAndPaginatedData?.map((item, index) => {
                      return (
                        <tr
                          className=" align-middle border-b border-[#E4E6FF]"
                          key={index}
                        >
                          <td>
                            <p>{item?.performedBy}</p>
                          </td>
                          <td className="text-center">
                            <span className=" px-4 py-2 text-base ">
                              {moment(item?.performedOn).format('MMMM D, YYYY h:mm:ss A')}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className=" px-4 py-2 text-base">
                              {item?.message}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className=" px-4 py-2 text-base ">
                              {item?.action}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  {sortedAndPaginatedData?.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4}>
                        <div className="flex text-center m-5 justify-center">
                          <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                            No Data Available
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {
              sortedAndPaginatedData?.length > 0 && (
                <div className="flex border-b border-gray lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                  <div className="flex items-center">
                    <span className="text-gray-500">{`Total ${allReportData?.allData?.length} Audit Log Reports`}</span>
                  </div>
                  <div className="flex justify-end ">
                    <select className='px-1 mr-2 border border-gray rounded-lg'
                      value={pageSize}
                      onChange={(e) => { setPageSize(e.target.value); setCurrentPage(1) }}
                    >
                      {PageNumber.map((x) => (
                        <option value={x}>{x}</option>
                      ))}
                    </select>
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
                      disabled={(currentPage === totalPages)}
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
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Auditlogreport;
