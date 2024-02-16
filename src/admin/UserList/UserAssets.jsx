import React, { useState } from "react";
import { FaUserCheck } from "react-icons/fa6";
import { AiOutlineSearch } from "react-icons/ai";
import { FcOpenedFolder } from "react-icons/fc";
import { HiDocumentDuplicate } from "react-icons/hi";

const UserAssets = ({ selectUser, Asseststore, loading }) => {
  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [searchAsset, setSearchAsset] = useState("");
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
  const filteredData = Array.isArray(Asseststore?.data)
    ? Asseststore?.data?.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchAsset.toLowerCase())
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

  const handleAssetSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);
  };
  return (
    <div className="w-full mt-8">
      <div>
        <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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
              <div className="flex justify-end items-center">
                <div className="relative mr-5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <AiOutlineSearch className="w-5 h-5 text-gray " />
                  </span>
                  <input
                    type="text"
                    placeholder="Search Asset" //location ,screen, tag
                    className="border border-primary rounded-full px-7 pl-10 py-2 search-user"
                    value={searchAsset}
                    onChange={(e) => {
                      handleAssetSearch(e);
                    }}
                  />
                </div>
              </div>
              <div className=" bg-white rounded-xl mt-5 shadow screen-section">
                <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                  <table
                    className="screen-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                    cellPadding={20}
                  >
                    <thead className="table-head-bg screen-table-th">
                      <tr className="items-center table-head-bg ">
                        <th className="text-[#5A5881] text-base text-center font-semibold w-200">
                          Preview
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                          <div className="flex">
                            Name
                            <svg
                              className="w-3 h-3 ms-1.5 mt-2 cursor-pointer"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              onClick={() => handleSort("assetName")}
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </div>
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                          Duration
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                          Resolution
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                          Type
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                          Size
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td colSpan={6}>
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
                              <span className="text-2xl  hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full text-green-800  me-2 px dark:bg-green-900 dark:text-green-300">
                                Loading...
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                      {!loading &&
                        Asseststore &&
                        sortedAndPaginatedData?.length === 0 && (
                          <tr>
                            <td colSpan={6}>
                              <div className="flex text-center m-5 justify-center">
                                <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                  No Data Available
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                      {!loading &&
                        Asseststore &&
                        sortedAndPaginatedData?.length !== 0 && (
                          <>
                            {Asseststore &&
                              sortedAndPaginatedData?.length > 0 &&
                              sortedAndPaginatedData.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="text-[#5E5E5E]">
                                      {item.assetType === "Folder" && (
                                        <div className="text-center relative list-none rounded-md flex justify-center items-center flex-col h-full ">
                                          <FcOpenedFolder className="text-8xl text-center mx-auto" />
                                          <span className="cursor-pointer w-full flex-wrap break-all inline-flex justify-center">
                                            {item.assetName}
                                          </span>
                                        </div>
                                      )}

                                      {item.assetType === "Image" && (
                                        <div className="img-cover ivratio img-cover-ratio text-center">
                                          <div>
                                            <img
                                              src={item.assetFolderPath}
                                              alt={item.assetName}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {item.assetType === "Video" && (
                                        <div className="img-cover ivratio img-cover-ratio">
                                          <div>
                                            <video controls>
                                              <source
                                                src={item.assetFolderPath}
                                                type="video/mp4"
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          </div>
                                        </div>
                                      )}

                                      {item.assetType === "OnlineImage" && (
                                        <div className="img-cover ivratio img-cover-ratio text-center">
                                          <div>
                                            <img src={item.assetFolderPath} />
                                          </div>
                                        </div>
                                      )}

                                      {item.assetType === "OnlineVideo" && (
                                        <div className="img-cover ivratio img-cover-ratio">
                                          <div>
                                            <video controls>
                                              <source
                                                src={item.assetFolderPath}
                                                type="video/mp4"
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          </div>
                                        </div>
                                      )}
                                      {item.assetType === "DOC" && (
                                        <div className="items-center flex justify-center cursor-pointer">
                                          <HiDocumentDuplicate className=" text-primary text-4xl mt-10 " />
                                        </div>
                                      )}
                                    </td>
                                    <td className="text-center text-[#5E5E5E]">
                                      {item.assetName}
                                    </td>

                                    <td className="text-center text-[#5E5E5E]">
                                      <span>{item.durations}</span>
                                    </td>
                                    <td className="text-center text-[#5E5E5E]">
                                      {item.resolutions}
                                    </td>
                                    <td className="text-center text-[#5E5E5E]">
                                      {item.assetType}
                                    </td>
                                    <td className="text-center text-[#5E5E5E]">
                                      {item.fileSize}
                                    </td>
                                  </tr>
                                );
                              })}
                          </>
                        )}
                    </tbody>
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
  );
};

export default UserAssets;
