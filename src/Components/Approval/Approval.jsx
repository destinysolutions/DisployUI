import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useState } from "react";


const Data = [{
  id: "1",
  Type: "Assets",
  RequestData: '10 - May - 2023',
  ScreenID: '00503C3',
  ScreenLocation: '2425 Robinson',
  RequestedBY: 'test 1',
  Action: 0,
},
{
  id: "2",
  Type: "Assets",
  RequestData: '10 - May - 2023',
  ScreenID: '00503C3',
  ScreenLocation: '2425 Robinson',
  RequestedBY: 'test 2',
  Action: 1,
},
{
  id: "3",
  Type: "Assets",
  RequestData: '10 - May - 2023',
  ScreenID: '00503C3',
  ScreenLocation: '2425 Robinson',
  RequestedBY: 'test 3',
  Action: 0,
},
{
  id: "4",
  Type: "Assets",
  RequestData: '10 - May - 2023',
  ScreenID: '00503C3',
  ScreenLocation: '2425 Robinson',
  RequestedBY: 'test 4',
  Action: 1,
},
]

const Approval = ({ sidebarOpen, setSidebarOpen }) => {

  // pagination Start
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);

  // pagination End


  return (
    <>
      {/* sidebar and navbar display start */}
      <div className="flex border-b border-gray mt-5">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {/* sidebar and navbar display end */}
      <div className="pt-16 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <div className="lg:flex lg:justify-between sm:block items-center">
            <h1 className="not-italic font-medium text-2xl sm:text-xl text-[#001737] sm:mb-4 ml-">
              Approval
            </h1>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md overflow-y-auto relative">
            <div className="overflow-x-scroll sc-scrollbar rounded-lg">
              <table
                className="screeen-table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                cellPadding={20}
              >
                <thead>
                <tr className="items-center table-head-bg">
                    <th className="sticky top-0th-bg-100 text-md font-semibold flex items-center justify-left">
                    Type
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                    Request Data
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                    Screen ID
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                    Screen Location
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                    Requested BY
                    </th>
                    <th className=" sticky top-0 th-bg-100 text-md font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className=" border-b border-lightgray text-sm ">
                        {item?.Type}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item?.RequestData}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item?.ScreenID}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item?.ScreenLocation}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item?.RequestedBY}
                      </td>
                      <td className=" border-b border-lightgray text-sm ">
                        {item.Action === 1 ? (
                          <label className="relative inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Red</span>
                          </label>
                        ) : (
                          <label className="relative inline-flex items-center me-5 cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Red</span>
                          </label>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-[#5E5E5E] font-semibold text-center text-2xl" colSpan={5}>
                      Data Not found !
                    </td>
                  </tr>
                )}
              </table>
            </div>

            {/* Pagination start */}
            {currentItems.length > 0 && (
              <div className=" flex justify-end p-5">
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
                    disabled={currentPage === Math.ceil(Data.length / itemsPerPage)}
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
            {/* Pagination End */}
          </div>
        </div>

      </div>
    </>
  );
};

export default Approval;
