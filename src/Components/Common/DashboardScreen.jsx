import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from 'react-icons/ai'
import { HiUserGroup } from 'react-icons/hi2';
import ReactTooltip from 'react-tooltip';
import { PageNumber } from './Common';

const DashboardScreen = ({ screenDialogOpen, setScreenDialogOpen, screen, sidebarOpen, from }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Adjust items per page as needed
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
    const [sortedField, setSortedField] = useState(null);

    // useEffect(() => {
    //     setCurrentPage(1)
    // }, [searchScreen])

    const totalPages = Math.ceil(screen?.length / itemsPerPage);

    // Function to sort the data based on a field and order
    const sortData = (data, field, order) => {
        const sortedData = [...data];
        if (field !== null) {
            sortedData.sort((a, b) => {
                if (order === "asc") {
                    return a[field] > b[field] ? 1 : -1;
                } else {
                    return a[field] < b[field] ? 1 : -1;
                }
            });
            return sortedData;
        } else {
            return data
        }
    };

    const sortedAndPaginatedData = sortData(
        screen,
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
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
        >
            <div className="modal-overlay">
                <div className="modal p-4 lg:w-[900px] md:w-[900px] sm:w-full max-h-full">
                    <div className="relative w-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-300">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Screen
                                </h3>
                                <AiOutlineCloseCircle
                                    className="text-4xl text-primary cursor-pointer"
                                    onClick={() => setScreenDialogOpen(!screenDialogOpen)}
                                />
                            </div>
                            <div className=" bg-white rounded-xl lg:mt-4 p-4 mt-2 shadow screen-section">
                                <div className="overflow-x-scroll sc-scrollbar rounded-lg ">
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
                                                {from && (
                                                    <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                        User Name
                                                    </th>
                                                )}
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Google Location
                                                </th>
                                                <th className="text-[#5A5881] text-base font-semibold  text-center w-200">
                                                    Status
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
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                screen &&
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
                                            {
                                                screen &&
                                                sortedAndPaginatedData?.length !== 0 && (
                                                    <>
                                                        {screen &&
                                                            sortedAndPaginatedData?.length > 0 &&
                                                            sortedAndPaginatedData.map((screen, index) => {
                                                                return (
                                                                    <tr key={screen.screenID}>
                                                                        <td className="text-[#5E5E5E]">
                                                                            <div className="flex items-center">
                                                                                {screen.screenName}
                                                                            </div>
                                                                        </td>
                                                                        {from && (
                                                                            <td className="break-words text-center text-[#5E5E5E]">
                                                                                {screen.userName}
                                                                            </td>
                                                                        )}
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
                                                                            {screen?.lastSeen
                                                                                ? moment(screen?.lastSeen).format(
                                                                                    "LLL"
                                                                                )
                                                                                : null}
                                                                        </td>

                                                                        <td
                                                                            className="text-center "
                                                                            style={{ wordBreak: "break-all" }}
                                                                        >
                                                                            <div

                                                                                title={screen?.assetName}
                                                                                className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                                                            >
                                                                                <p className="line-clamp-1">
                                                                                    {screen.assetName}
                                                                                </p>
                                                                                <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                                                                            </div>
                                                                        </td>

                                                                        <td className="break-words text-center text-[#5E5E5E]">

                                                                            {`${screen.scheduleName !== null ? screen.scheduleName : ""
                                                                                } Till ${moment(
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
                                                                                            screen.tags.split(",")
                                                                                                .length > 2
                                                                                                ? 3
                                                                                                : screen.tags.split(",")
                                                                                                    .length
                                                                                        )
                                                                                        .map((text) => {
                                                                                            if (
                                                                                                text.toString().length >
                                                                                                10
                                                                                            ) {
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
                                                                                    <ReactTooltip
                                                                                        id={screen.groupName}
                                                                                        place="bottom"
                                                                                        type="warning"
                                                                                        effect="solid"
                                                                                    >
                                                                                        <span>{screen.groupName}</span>
                                                                                    </ReactTooltip>
                                                                                </button>
                                                                            )}
                                                                        </td>


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
                                        <span className="text-gray-500">{`Total ${screen?.length} Screens`}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <select className='px-1 mr-2 border border-gray rounded-lg'
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(e.target.value)}
                                        >
                                            {PageNumber.map((x) => (
                                                <option value={x}>{x}</option>
                                            ))}
                                        </select>
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
                                            disabled={(currentPage === totalPages) || (screen?.length === 0)}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardScreen
