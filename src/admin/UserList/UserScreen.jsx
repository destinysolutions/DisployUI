import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa6";
import {
  AiOutlineCloudUpload,
  AiOutlinePlusCircle,
  AiOutlineSave,
} from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi2";
const UserScreen = ({ selectUser, screens, loading, sidebarOpen }) => {
  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [searchScreen, setSearchScreen] = useState("");
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sorting when a table header is clicked
  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  // Filter data based on search term
  const filteredData = Array.isArray(screens)
    ? screens?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchScreen.toLowerCase())
      )
    )
    : [];

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

  const handleScreenSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchScreen(searchQuery);
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [searchScreen])

  return (
    <div className="w-full mt-8">
      <div className="block lg:p-5 p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        {selectUser === "" ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <FaUserCheck
              size={60}
              className="text-gray-400 dark:text-gray-500"
            />
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-600 dark:text-white">
              Please Select Client
            </h5>
          </div>
        ) : (
          <>
            <div className="lg:flex md:flex justify-end items-center">
              <div className="relative lg:mr-5">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search Screen" //location ,screen, tag
                  className="border border-primary rounded-full px-7 pl-10 py-2 search-user"
                  value={searchScreen}
                  onChange={(e) => {
                    handleScreenSearch(e);
                  }}
                />
              </div>
            </div>
            <div className=" bg-white rounded-xl mt-5 shadow screen-section">
              <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                <table
                  className="screen-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                  cellPadding={15}
                >
                  <thead className="table-head-bg screen-table-th">
                    <tr className="items-center table-head-bg ">
                      <th className="text-[#5A5881] text-base text-center font-semibold w-200">
                        <div className="flex">
                          Screen
                          <svg
                            className="w-3 h-3 ms-1.5 mt-2 cursor-pointer"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            onClick={() => handleSort("screenName")}
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </div>
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Google Location
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        status
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Last Seen
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Now Playing
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Current Schedule
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Tags
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                        Group Apply
                      </th>
                      {/*<th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                          Action
                  </th>*/}
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={8}>
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
                      screens &&
                      sortedAndPaginatedData?.length === 0 && (
                        <tr>
                          <td colSpan={8}>
                            <div className="flex text-center m-5 justify-center">
                              <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                No Data Available
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    {!loading &&
                      screens &&
                      sortedAndPaginatedData?.length !== 0 && (
                        <>
                          {screens &&
                            sortedAndPaginatedData?.length > 0 &&
                            sortedAndPaginatedData.map((screen, index) => {
                              return (
                                <tr key={screen.screenID}>
                                  <td className="text-[#5E5E5E]">
                                    {screen?.screenName}
                                  </td>
                                  <td className="break-words text-center text-[#5E5E5E]">
                                    {screen.googleLocation}
                                  </td>

                                  <td className="text-center">
                                    <span
                                      id={`changetvstatus${screen.macid}`}
                                      className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
                                          ? "bg-[#3AB700]"
                                          : "bg-[#FF0000]"
                                        }`}
                                    >
                                      {screen.screenStatus == 1
                                        ? "Live"
                                        : "offline"}
                                    </span>
                                  </td>

                                  <td className="p-2 text-center break-words text-[#5E5E5E]">
                                    {moment(screen?.updatedDate).format("LLL")}
                                  </td>

                                  <td
                                    className="text-center "
                                    style={{ wordBreak: "break-all" }}
                                  >
                                    <div
                                      title={screen?.assetName}
                                      className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                    >
                                      <p className="line-clamp-2">
                                        {screen.assetName}
                                      </p>
                                      <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                                    </div>
                                  </td>

                                  <td className="break-words text-center text-[#5E5E5E]">
                                    {screen.scheduleName !== "" &&
                                      `${screen.scheduleName} Till ${moment(
                                        screen.endDate
                                      ).format("YYYY-MM-DD hh:mm")}`}
                                  </td>

                                  <td
                                    // title={screen?.tags && screen?.tags}
                                    title={
                                      screen?.tags &&
                                      screen?.tags
                                        .trim()
                                        .split(",")
                                        .map((tag) => tag.trim())
                                        .join(",")
                                    }
                                    className="text-center text-[#5E5E5E]"
                                  >
                                    <div className="p-2 text-center flex flex-wrap items-center justify-center gap-2 break-all text-[#5E5E5E]">
                                      {screen?.tags !== null
                                        ? screen.tags
                                          .split(",")
                                          .slice(
                                            0,
                                            screen.tags.split(",").length > 2
                                              ? 3
                                              : screen.tags.split(",").length
                                          )
                                          .map((text) => {
                                            if (text.toString().length > 10) {
                                              return text
                                                .split("")
                                                .slice(0, 10)
                                                .concat("...")
                                                .join("");
                                            }
                                            return text;
                                          })
                                          .join(",")
                                        : ""}
                                    </div>
                                  </td>
                                  <td className="p-2 text-center  break-words">
                                    {screen.isContainGroup === 1 && (
                                      <button
                                        data-tip
                                        data-for={screen.groupName}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                      >
                                        <HiUserGroup />
                                      </button>
                                    )}
                                  </td>

                                  {/*<td className="text-center">
                                      <div className="flex justify-center gap-2 items-center">
                                        <div className="cursor-pointer text-xl">
                                          <button
                                            data-tip
                                            data-for="Edit"
                                            type="button"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                          >
                                            <BiEdit />
                                          </button>
                                        </div>

                                      </div>
                                      </td>*/}
                                </tr>
                              );
                            })}
                        </>
                      )}
                  </tbody>
                </table>
              </div>
              <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                <div className="flex items-center">
                  <span className="text-gray-500">{`Total ${screens?.length} Screens`}</span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
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
                    <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={(currentPage === totalPages) || (screens?.length === 0)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default UserScreen;
