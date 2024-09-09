import React, { useEffect, useState } from "react";
import "../../Styles/Report.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { LuDownload } from "react-icons/lu";
import { CiFilter } from "react-icons/ci";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";
import { PageNumber } from "../Common/Common";

const Mediareport = ({
  allReportData,
  debouncedOnChange,
  exportDataToCSV,
  loading,
  sidebarOpen,
}) => {

  const { user, token, userDetails } = useSelector((state) => state.root.auth);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allReportData?.allData?.length / pageSize);
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
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <div className="flex items-center lg:mb-0 md:mb-0 sm:mb-4">
              <Link to={"/reports"}>
                <MdKeyboardArrowLeft className="text-4xl text-primary" />
              </Link>
              <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                Asset Reports
              </h1>
            </div>

            <div className="rightbtn flex items-center flex-wrap pr-4">
              {/*<ul className="p-0 m-0 lg:flex md:flex sm:block xs:block items-center border rounded-md border-primary  lg:mr-3 md:mr-3 sm:mr-2 xs:mr-0 lg:w-auto md:w-auto sm:w-auto xs:w-full">
                <li className="bg-primary text-white py-1 px-4 font-light-[26px] rounded-tl-md rounded-tb-md">
                  <label className=" leading-8">Daily</label>
                </li>
                <li>
                  <input
                    type="date"
                    className="date-formate px-2 py-1 bg-[transparent] text-base lg:w-auto md:w-auto sm:w-full xs:w-full"
                  />
                </li>
  </ul>*/}

              <div className=" flex items-end justify-end relative sm:mr-0">
                <AiOutlineSearch className="absolute top-[13px] left-[10px] z-10 text-primary searchicon" />
                <input
                  type="text"
                  placeholder=" Search"
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

          <div className="sectiondetails mt-5 bg-white p-5 drop-shadow-sm ">
            <div className="overflow-x-scroll sc-scrollbar rounded-lg">
              <table
                className="screen-table w-full text-[#5E5E5E]"
                cellPadding={15}
              >
                <thead>
                  <tr className="table-head-bg rounded-md">
                    <th className="flex items-center font-medium p-3">
                      Screen Name
                      <CiFilter className="text-sm text-primary ml-2" />
                    </th>
                    <th className=" font-medium text-center p-3">
                      Google Location
                    </th>
                    <th className=" font-medium text-center p-3">
                      Assets Name
                    </th>
                    <th className=" font-medium text-center p-3">
                      Streaming Hours
                    </th>
                    <th className=" font-medium text-center p-3">
                      Loop Counter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr className="text-center col-span-full font-semibold text-xl">
                      <td colSpan={5}>
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
                          <td className="text-left">
                            <p>{item?.screenName}</p>
                          </td>
                          <td className="text-center">
                            <p>{item?.googleLocation}</p>
                          </td>
                          <td className="text-center">
                            <p>{item?.assetsName}</p>
                          </td>
                          <td className="text-center">
                            <span className="bg-lightgray px-4 py-2 text-base rounded-md">
                              {item?.streamingHours}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="bg-lightgray px-4 py-2 text-base rounded-md">
                              {item?.loopCounter}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  {sortedAndPaginatedData?.length === 0 && !loading && (
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
                </tbody>
              </table>
            </div>
            {sortedAndPaginatedData?.length !== 0 && (
              <div className="flex border-b border-gray lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                <div className="flex items-center">
                  <span className="text-gray-500">{`Total ${allReportData?.allData?.length} Asset Reports`}</span>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mediareport;
