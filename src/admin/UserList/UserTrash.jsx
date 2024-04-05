import moment from "moment";
import React, { useEffect, useState } from "react";
import { CgYoutube } from "react-icons/cg";
import { FaUserCheck } from "react-icons/fa6";
import { FiImage } from "react-icons/fi";
import { HiDocument, HiFolder, HiVideoCamera } from "react-icons/hi";
import { MdDeleteForever, MdRestore } from "react-icons/md";

const UserTrash = ({ selectUser, TrashData ,sidebarOpen}) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  // Filter data based on search term
  const filteredData = TrashData?.deletedData?.filter((item) =>
    Object.values(item).some((value) => value && value.toString().toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  return (
    <div className="w-full mt-8">
      <div className="block bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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
            <div className="overflow-x-scroll sc-scrollbar rounded-lg">
              <table
                className="screeen-table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                cellPadding={15}
              >
                <thead>
                  <tr className="items-center table-head-bg">
                    <th className=" sticky top-0th-bg-100 text-md font-semibold flex items-center justify-left">
                      Name
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        onClick={() => handleSort("assetName")}
                      >
                        <path
                          strokeWidth="2"
                          strokeLinecap="round"
                          d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                        />
                      </svg>
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                      File location
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                      Date deleted
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                      Size
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                      Item type
                    </th>
                    {/* <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                                Action
                    </th>*/}
                  </tr>
                </thead>
                <tbody>
                  {TrashData.isLoading ? (
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
                  ) : TrashData && sortedAndPaginatedData?.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex text-center m-5 justify-center">
                          <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                            No Data Available
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedAndPaginatedData.length &&
                    sortedAndPaginatedData?.map((item, i) => (
                      <tr
                        key={i}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className=" border-b border-lightgray text-sm ">
                          <div className="flex gap-2 items-center justify-start">
                            {item.assetType === "Folder" && (
                              <span className="w-30 h-30  flex items-center justify-center">
                                <HiFolder />
                              </span>
                            )}
                            {item.assetType === "Image" && (
                              <span>
                                <FiImage />
                              </span>
                            )}
                            {item.assetType === "OnlineImage" && (
                              <span>
                                <FiImage />
                              </span>
                            )}
                            {item.assetType === "OnlineVideo" && (
                              <span>
                                <CgYoutube />
                              </span>
                            )}
                            {item.assetType === "DOC" && (
                              <span>
                                <HiDocument />
                              </span>
                            )}
                            {item.assetType === "Video" && (
                              <span>
                                <HiVideoCamera />
                              </span>
                            )}
                            {item.assetName}
                          </div>
                        </td>
                        {/* <td className=" border-b border-lightgray text-sm ">{item.assetFolderPath}</td> */}
                        <td className=" border-b border-lightgray text-sm ">
                          {item.folderPath}
                        </td>
                        <td className=" border-b border-lightgray text-sm ">
                          {moment(item.deleteDate).format(
                            "DD/MM/YY, h:mm:ss a"
                          )}
                        </td>
                        <td className=" border-b border-lightgray text-sm ">
                          {item.fileSize}
                        </td>
                        <td className=" border-b border-lightgray text-sm ">
                          {item.assetType}
                        </td>
                        {/*<td className="border-b border-lightgray text-sm">
                                    <div className="cursor-pointer text-xl flex gap-4 ">
                                      <button
                                        type="button"
                                        className="rounded-full px-2 py-2 text-white text-center bg-[#FF0000] mr-3"
                                      >
                                        <MdDeleteForever />
                                      </button>
                                        <button
                                          type="button"
                                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                          
                                        >
                                          <MdRestore />
                                        </button>
                                    </div>
                                    </td>*/}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
            <div className="flex items-center">
              <span className="text-gray-500">{`Total ${TrashData?.deletedData?.length} Trash`}</span>
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
                disabled={(currentPage === totalPages) || (TrashData?.deletedData?.length === 0)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default UserTrash;
