import React, { useEffect, useState } from "react";

import ConfirmationDialog from "../../Common/ConfirmationDialog";
import { BiUserPlus } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";
import { BsEyeFill } from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import { AiOutlineSearch } from "react-icons/ai";
import UserInfo from "./UserInfo";

const Data = [
  {
    id: "1",
    profilePhoto: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
    name: "test 1",
    Plan: "Basic",
    Billing: "Axis Bank **** **** **** 8395",
    Status: 1,
  },
  {
    id: "2",
    profilePhoto: "https://cdn-icons-png.flaticon.com/128/6997/6997662.png",
    name: "test 2",
    Plan: "Basic",
    Billing: "Axis Bank **** **** **** 8395",
    Status: 0,
  },
  {
    id: "3",
    profilePhoto: "https://cdn-icons-png.flaticon.com/128/14507/14507916.png",
    name: "test 3",
    Plan: "Basic",
    Billing: "Axis Bank **** **** **** 8395",
    Status: 0,
  },
  {
    id: "4",
    profilePhoto: "https://cdn-icons-png.flaticon.com/128/9408/9408175.png",
    name: "test 4",
    Plan: "Basic",
    Billing: "Axis Bank **** **** **** 8395",
    Status: 1,
  },
  {
    id: "5",
    profilePhoto: "https://cdn-icons-png.flaticon.com/128/219/219970.png",
    name: "test 5",
    Plan: "Basic",
    Billing: "Axis Bank **** **** **** 8395",
    Status: 1,
  },
];

const Billing = () => {
  // pagination Start
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  // Filter data based on search term
  const filteredData = Data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination when search term changes
  };
  // pagination End

  const [showBillingProfile, setShowBillingProfile] = useState(false);

  return (
    <>
      {showBillingProfile ? (
        <UserInfo
          setShowBillingProfile={setShowBillingProfile}
          showBillingProfile={showBillingProfile}
        />
      ) : (
        <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <AiOutlineSearch className="w-5 h-5 text-gray" />
              </span>
              <input
                type="text"
                placeholder="Searching.."
                className="border border-primary rounded-lg pl-10 py-1.5 search-user"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="clear-both">
            <div className="bg-white rounded-xl mt-8 shadow screen-section ">
              <div className="rounded-xl mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg">
                <table
                  className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                  cellPadding={15}
                >
                  <thead>
                    <tr className="items-center table-head-bg">
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center flex items-center">
                        Customer Name
                        <svg
                          className="w-3 h-3 ms-1.5 cursor-pointer"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          // onClick={() => handleSort("compositionName")}
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Plan
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Billing
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Status
                      </th>
                      <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr className="border-b border-b-[#E4E6FF]" key={index}>
                        <td className="text-[#5E5E5E] text-center flex">
                          {item?.profilePhoto !== null ? (
                            <img
                              className="w-10 h-10 rounded-full"
                              src={item?.profilePhoto}
                              alt="Jese image"
                            />
                          ) : (
                            <RiUser3Fill className="w-10 h-10" />
                          )}
                          <div className="ps-3 flex text-center">
                            <div className="font-normal text-gray-500 mt-2">
                              {item.name}
                            </div>
                          </div>
                        </td>

                        <td className="text-[#5E5E5E] text-center">
                          {item?.Plan}
                        </td>

                        <td className="text-[#5E5E5E] text-center">
                          {item?.Billing}
                        </td>

                        <td className="text-[#5E5E5E] text-center">
                          {item.Status == 1 ? (
                            <span className="bg-[#3AB700] rounded-full px-6 py-1 text-white hover:bg-primary text-sm">
                              Active
                            </span>
                          ) : (
                            <span className="bg-[#FF0000] rounded-full px-6 py-1 text-white hover:bg-primary text-sm">
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="text-[#5E5E5E] text-center">
                          <div className="flex justify-center gap-4">
                            <div
                              data-tip
                              data-for="View"
                              className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              <BsEyeFill
                                onClick={() => setShowBillingProfile(true)}
                              />
                              <ReactTooltip
                                id="View"
                                place="bottom"
                                type="warning"
                                effect="solid"
                              >
                                <span>View</span>
                              </ReactTooltip>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="text-[#5E5E5E] font-semibold text-center text-2xl"
                        colSpan={5}
                      >
                        Data Not found !
                      </td>
                    </tr>
                  )}
                </table>
              </div>

              {filteredData.length > 0 && (
                <div className="mt-4 flex justify-end p-5">
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
                        Math.ceil(filteredData.length / itemsPerPage)
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
        </div>
      )}
    </>
  );
};

export default Billing;
