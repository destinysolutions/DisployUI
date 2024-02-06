import React, { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { FaUserCheck } from 'react-icons/fa6'

const UserApp = ({ selectUser, allAppsData }) => {
  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [searchApps, setSearchApps] = useState("");
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
  const filteredData = Array.isArray(allAppsData)
    ? allAppsData?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchApps.toLowerCase())
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

  const handleAppsSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchApps(searchQuery);
  };
  return (
    <div className='w-full mt-8'>
      <div>
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          {selectUser === "" ? (
            <div className='flex flex-col items-center justify-center gap-3'>
              <FaUserCheck size={60} className='text-gray-400 dark:text-gray-500' />
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-600 dark:text-white">Please Select Client</h5>
            </div>
          ) : (
            <>
              <div>
                <div className='flex justify-end items-center'>
                  <div className="relative mr-5">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <AiOutlineSearch className="w-5 h-5 text-gray " />
                    </span>
                    <input
                      type="text"
                      placeholder="Search Apps" //location ,screen, tag
                      className="border border-primary rounded-full px-7 pl-10 py-2 search-user"
                      value={searchApps}
                      onChange={(e) => handleAppsSearch(e)}
                    />
                  </div>
                </div>
              </div>
              <div className=" bg-white rounded-xl mt-5 shadow screen-section">
                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table sc-scrollbar rounded-lg">
                  <table
                    className="screen-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                    cellPadding={20}
                  >
                    <thead className="table-head-bg screen-table-th">
                      <tr className="items-center table-head-bg ">
                        <th className="text-[#5A5881] text-base text-center font-semibold w-200">
                          <div className="flex">
                            Instance Name
                            <svg
                              className="w-3 h-3 ms-1.5 mt-2 cursor-pointer"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              onClick={() => handleSort("instanceName")}
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </div>
                        </th>
                        <th className="text-[#5A5881] text-base text-center font-semibold w-200">App Type</th>
                      </tr>
                    </thead>

                    {allAppsData?.length > 0 ? (sortedAndPaginatedData.map((instance, index) => (
                      <tbody key={index}>
                        <tr
                          className={
                            `border-b border-[#eee] text-center cursor-pointer`}
                        >
                          <td className="p-3 text-left">
                            {instance.instanceName}
                          </td>
                          <td className="p-3">
                            {instance.youTubePlaylist
                              ? "Youtube Video"
                              : "Text scroll"}
                          </td>
                        </tr>
                      </tbody>
                    ))) : (
                      <tr>
                        <td
                          className="font-semibold text-center bg-white text-lg"
                          colSpan={2}
                        >
                          No search result found.
                        </td>
                      </tr>
                    )}
                  </table>
                </div>
                <div className="flex justify-end p-5">
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
                    Previous
                  </button>
                  {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserApp
