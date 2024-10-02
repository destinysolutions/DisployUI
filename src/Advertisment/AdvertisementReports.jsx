import React, { useEffect, useState } from 'react'
import AdvertismentSidebar from './AdvertismentSidebar';
import AdvertismentNavbar from './AdvertismentNavbar';
import { AiOutlineSearch } from 'react-icons/ai';
import { PageNumber } from '../Components/Common/Common';
import { LuDownload } from 'react-icons/lu';
import ReactTooltip from 'react-tooltip';
import { useDispatch } from 'react-redux';
import { getAllSlotReport } from '../Redux/BookslotSlice';
import moment from 'moment';

export default function AdvertisementReports({ sidebarOpen, setSidebarOpen }) {
    const dispatch = useDispatch()
    const [reportsData, setReportsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const sortedAndPaginatedData = reportsData
    const [loadFirst, setLoadFirst] = useState(true);


    useEffect(() => {
        if (loadFirst) {
            setLoading(true)
            dispatch(getAllSlotReport({})).then((res) => {
                setReportsData(res?.payload?.data)
                setLoading(false)
            })
        }
        setLoadFirst(false)
    }, [loadFirst, dispatch]);

    return (
        <>
            <div className="flex border-b border-gray ">
                <AdvertismentSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <AdvertismentNavbar />
            </div>
            <div className="pt-28 px-5 page-contain ">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className=' rounded-lg p-5 '>

                        <div className="grid lg:grid-cols-3 gap-2 ">
                            <h1 className="not-italic font-medium text-2xl text-[#001737]  mt-2">
                                Reports
                            </h1>
                            <div className="lg:col-span-2 lg:flex items-center md:mt-0 lg:mt-0 md:justify-end sm:mt-3 flex-wrap ">
                                <div className="relative md:mr-2 lg:mr-2 lg:mb-0 md:mb-0 mb-3">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <AiOutlineSearch className="w-5 h-5 text-gray " />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search Screen"
                                        className="border border-primary rounded-full pl-10 py-2 search-user"
                                    // value={searchComposition}
                                    // onChange={handleSearchComposition}
                                    />
                                </div>
                                <div className="ml-2">
                                    <div
                                        data-tip
                                        data-for="Download"
                                        className="cursor-pointer text-white bg-SlateBlue hover:bg-primary focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    // onClick={() => exportDataToCSV()}
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
                        <div className="bg-white rounded-xl lg:mt-8 mt-5 shadow screen-section">
                            <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                                <table
                                    className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                                    cellPadding={15}
                                >
                                    <thead>
                                        <tr className="text-lext table-head-bg">
                                            <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit  text-center">
                                                Screen ID
                                            </th>
                                            <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                Location
                                            </th>
                                            <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                Start Date
                                            </th>
                                            <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                End Date
                                            </th>
                                            <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                Booked Duration <br />
                                                <label className=' text-sm'>dd:hh:mm:ss</label>
                                            </th>
                                            <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                Streaming Duration <br />
                                                <label className=' text-sm'>dd:hh:mm:ss</label>
                                            </th>
                                            <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                Credits <br />
                                                <label className=' text-sm'>dd:hh:mm:ss</label>
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7}>
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
                                        ) : reportsData &&
                                            sortedAndPaginatedData?.length === 0 ? (
                                            <tr>
                                                <td colSpan={7}>
                                                    <div className="flex text-center m-5 justify-center">
                                                        <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2">
                                                            No Data Available
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {reportsData &&
                                                    sortedAndPaginatedData.length > 0 &&
                                                    sortedAndPaginatedData?.map((composition, index) => {
                                                        return (
                                                            <tr
                                                                className="border-b border-b-[#E4E6FF] "
                                                                key={index}
                                                            >
                                                                <td className="text-[#5E5E5E] mw-200">
                                                                    {composition?.screenIDs}
                                                                </td>
                                                                <td className="mw-200 text-[#5E5E5E] text-center">
                                                                    {composition?.googleLocation}
                                                                </td>
                                                                <td className="mw-200 text-[#5E5E5E] text-center">
                                                                    {moment(composition.startDate).format("YYYY-MM-DD hh:mm")}
                                                                </td>
                                                                <td className="mw-200 text-[#5E5E5E] text-center">
                                                                    {moment(composition.endDate).format("YYYY-MM-DD hh:mm")}
                                                                </td>
                                                                <td className="mw-200 text-[#5E5E5E] text-center">
                                                                    {composition?.bookedDuration}
                                                                </td>
                                                                <td className="mw-200 text-[#5E5E5E] text-center">
                                                                    {composition?.streamingDuration}
                                                                </td>
                                                                <td className="mw-200 text-[#5E5E5E] text-center">
                                                                    {composition?.credits}
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
                                    {/* <span className="text-gray-500">{`Total ${filteredData?.length} Slots`}</span> */}
                                </div>
                                <div className="flex justify-end ">
                                    <select className='px-1 mr-2 border border-gray rounded-lg'
                                    // value={pageSize}
                                    // onChange={(e) => setPageSize(e.target.value)}
                                    >
                                        {PageNumber.map((x) => (
                                            <option value={x}>{x}</option>
                                        ))}
                                    </select>
                                    <button
                                        // onClick={() => handlePageChange(currentPage - 1)}
                                        // disabled={currentPage === 1}
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
                                        {/* <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span> */}
                                    </div>
                                    {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
                                    <button
                                        // onClick={() => handlePageChange(currentPage + 1)}
                                        // disabled={(currentPage === totalPages) || (bookslotData?.length === 0)}
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
