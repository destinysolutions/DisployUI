import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { LuDownload } from "react-icons/lu";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const BillingReport = ({
  allReportData,
  debouncedOnChange,
  exportDataToCSV,
  loading,
  sidebarOpen,
}) => {
  const { user, token, userDetails } = useSelector((state) => state.root.auth);
  return (
    <>
      <div className={userDetails?.isTrial && user?.userDetails?.isRetailer === false && !userDetails?.isActivePlan ? "lg:pt-32 md:pt-32 pt-10 px-5 page-contain" : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"}>
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
            <div className="flex items-center lg:mb-0 md:mb-0 sm:mb-4">
              <Link to={"/reports"}>
                <MdKeyboardArrowLeft className="text-4xl text-primary" />
              </Link>
              <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl xs:text-xs text-[#001737]  ">
                Billing Report
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
                  placeholder="Search"
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
                className="sceen-table w-full text-[#5E5E5E]"
                cellPadding={15}
              >
                <thead>
                  <tr className="table-head-bg rounded-md">
                    <th className="flex items-center font-medium p-3">
                      Customer
                    </th>
                    <th className=" font-medium p-3 text-center">Email</th>
                    <th className=" font-medium text-center p-3">
                      Phone Number
                    </th>
                    <th className=" font-medium text-center p-3">
                      Billing cycle
                    </th>
                    <th className=" font-medium text-center p-3">
                      Google Location
                    </th>
                    <th className=" font-medium text-center p-3">
                      Total Screens
                    </th>
                    <th className=" font-medium text-center p-3">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr className="text-center col-span-full font-semibold text-xl">
                      <td colSpan={7}>
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
                  {allReportData?.SearchData?.length > 0 &&
                    !loading &&
                    allReportData?.SearchData?.map((item, index) => {
                      return (
                        <tr
                          className="align-middle border-b border-[#E4E6FF]"
                          key={index}
                        >
                          <td className="text-left">
                            <p>{item?.customer}</p>
                          </td>
                          <td className="text-center">
                            <span className="text-base">{item?.email}</span>
                          </td>
                          <td className="text-center">
                            <span className="text-base">
                              {item?.phoneNumber}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="text-base">
                              {item?.billingcycle}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="text-base">
                              {item?.googleLocation}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="text-base">
                              {item?.totalScreens}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="text-base">{item?.plan}</span>
                          </td>
                        </tr>
                      );
                    })}
                  {allReportData?.SearchData?.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7}>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingReport;
