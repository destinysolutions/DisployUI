import React from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";

const CustomerScreen = ({ handleClose, customerList, handleSort, handlePageChange, loading, sortedAndPaginatedData, currentPage, totalPages, selectAllChecked, handleSelectAllCheckboxChange, selectedItems, handleScreenCheckboxChange, HandleSave ,sidebarOpen}) => {
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-6xl">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-3 border-b rounded-t dark:border-gray-600">
                            <div className='flex gap-4'>
                                <input type='checkbox'
                                    onChange={handleSelectAllCheckboxChange}
                                    checked={selectAllChecked}
                                />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Select Customer
                                </h3>
                            </div>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                }}
                            />
                        </div>
                        {/* Modal body */}
                        <div className="p-6">
                            <div className=" bg-white rounded-xl shadow screen-section">
                                <div className="max-h-80 vertical-scroll-inner rounded-lg mb-4">
                                    <table
                                        className="screen-table w-full lg:table-fixed sm:table-fixed xs:table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 "
                                        cellPadding={15}
                                    >
                                        <thead className="table-head-bg screen-table-th">
                                            <tr className="items-center table-head-bg ">
                                                <th className="text-[#5A5881] text-base text-center font-semibold w-200">
                                                    <div className="flex">
                                                        Name
                                                        <svg
                                                            className="w-3 h-3 ms-1.5 mt-2 cursor-pointer"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                            onClick={() => handleSort("firstName")}
                                                        >
                                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                                        </svg>
                                                    </div>
                                                </th>
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Email
                                                </th>
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Google Location
                                                </th>
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Phone Number
                                                </th>
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Organization Name
                                                </th>
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Total Screen
                                                </th>
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Status
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading && (
                                                <tr>
                                                    <td colSpan={4}>
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
                                                customerList?.allCustomer &&
                                                sortedAndPaginatedData?.length === 0 && (
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
                                            {!loading &&
                                                customerList?.allCustomer &&
                                                sortedAndPaginatedData?.length !== 0 && (
                                                    <>
                                                        {customerList?.allCustomer &&
                                                            sortedAndPaginatedData?.length > 0 &&
                                                            sortedAndPaginatedData.map((screen, index) => {
                                                                return (
                                                                    <tr key={index} className='cursor-pointer' onClick={() => handleScreenCheckboxChange(screen.organizationID)} >
                                                                        <td className="text-[#5E5E5E]">
                                                                            <div className="flex">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="mr-3"
                                                                                    onChange={() => handleScreenCheckboxChange(screen.organizationID)}
                                                                                    checked={selectedItems.includes(screen.organizationID)}
                                                                                />
                                                                                {screen.firstName + ' ' + screen.lastName}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-2 text-center break-words text-[#5E5E5E]">
                                                                            {screen?.email}
                                                                        </td>
                                                                        <td className="p-2 text-center break-words text-[#5E5E5E]">
                                                                            {screen?.googleLocation}
                                                                        </td>
                                                                        <td className="p-2 text-center break-words text-[#5E5E5E]">
                                                                            {screen?.phone}
                                                                        </td>
                                                                        <td className="p-2 text-center break-words text-[#5E5E5E]">
                                                                            {screen?.organizationName}
                                                                        </td>
                                                                        <td className="p-2 text-center break-words text-[#5E5E5E]">
                                                                            {screen?.screen}
                                                                        </td>
                                                                        <td className="px-6 py-4 capitalize">
                                                                            <span>
                                                                                {screen?.isActive ? (
                                                                                    <span
                                                                                        style={{ backgroundColor: "#cee9d6" }}
                                                                                        className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4 text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                                                                    >
                                                                                        Active
                                                                                    </span>
                                                                                ) : (
                                                                                    <span
                                                                                        style={{ backgroundColor: "#cee9d6" }}
                                                                                        className="capitalize text-xs bg-gray-300 hover:bg-gray-400 text-[#33d117] font-semibold px-4  text-green-800 me-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                                                                    >
                                                                                        Inactive
                                                                                    </span>
                                                                                )}
                                                                            </span>

                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                    </>
                                                )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end gap-3">
                                    <div className="flex items-center">
                                    <span className="text-gray-500">{`Total ${customerList?.allCustomer?.length} Customers`}</span>
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
                                    {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={(currentPage === totalPages) || (customerList?.allCustomer?.length === 0)}
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
                            <div className="py-0 flex justify-center sticky bottom-0 z-10 bg-white">
                                <button
                                    className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
                                    onClick={() => HandleSave()}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerScreen
