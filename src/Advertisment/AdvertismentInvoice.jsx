import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import AdvertismentSidebar from './AdvertismentSidebar';
import AdvertismentNavbar from './AdvertismentNavbar';
import { PageNumber } from '../Components/Common/Common';
import { BsEyeFill, BsFillPrinterFill, BsFillSendFill } from 'react-icons/bs';
import ReactTooltip from 'react-tooltip';
import { LuDownload } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { getAllBookSlotInvoice } from '../Redux/BookslotSlice';
import { FaDownload } from 'react-icons/fa';
import { html2pdf } from 'html2pdf.js';
import InvoiceBilling from '../Components/Settings/InvoiceBilling';
import { IoIosArrowRoundBack } from 'react-icons/io';
import ReactToPrint from 'react-to-print';

export default function AdvertismentInvoice({ sidebarOpen, setSidebarOpen }) {
    const dispatch = useDispatch()
    const InvoiceRef = useRef(null);

    const [InvoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadFirst, setLoadFirst] = useState(true);
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectInvoiceId, setInvoiceId] = useState("")
    const [selectData, setSelectData] = useState(null)

    const sortedAndPaginatedData = InvoiceData

    useEffect(() => {
        if (loadFirst) {
            setLoading(true)
            dispatch(getAllBookSlotInvoice({})).then((res) => {
                setInvoiceData(res?.payload?.data)
                setLoading(false)
            })
        }
        setLoadFirst(false)
    }, [loadFirst, dispatch]);

    const DownloadInvoice = () => {
        const InvoiceNode = InvoiceRef.current;
        if (InvoiceNode) {
            html2pdf(InvoiceNode, {
                margin: 10,
                filename: "Invoice.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            });
        }
    };

    return (
        <>
            <div className="flex border-b border-gray ">
                <AdvertismentSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <AdvertismentNavbar />
            </div>
            <div className="pt-10 px-5 page-contain ">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    {showInvoice && (
                        <div className="bg-white rounded-xl lg:mt-8  shadow screen-section">
                            <div className='flex justify-between items-center'>
                                <div className="p-4 flex justify-start items-center gap-2">
                                    <IoIosArrowRoundBack
                                        size={36}
                                        className="cursor-pointer"
                                        onClick={() => setShowInvoice(false)}
                                    />
                                    <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
                                        Invoice
                                    </h1>
                                </div>
                                <div className="flex">
                                    <button
                                        type="button"
                                        className="px-5 bg-primary flex items-center gap-2 text-white rounded-full py-2 border border-primary me-3 "
                                    // onClick={() => SendInvoice()}
                                    >
                                        <BsFillSendFill />
                                        Send Invoice
                                    </button>
                                    <button
                                        className="bg-white text-primary text-base px-5 flex items-center gap-2 py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                        type="button"
                                    // onClick={() => DownloadInvoice()}
                                    >
                                        <FaDownload />
                                        Download
                                    </button>
                                    <ReactToPrint
                                        trigger={() => (
                                            <button
                                                className="bg-white text-primary text-base px-5 flex items-center gap-2 py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                                type="button"
                                            >
                                                <BsFillPrinterFill />
                                                Print
                                            </button>
                                        )}
                                        content={() => InvoiceRef.current}
                                    />
                                </div>

                            </div>
                            <InvoiceBilling
                                InvoiceRef={InvoiceRef}
                                setShowInvoice={setShowInvoice}
                                selectData={selectData}
                            />
                        </div>
                    )}
                    {!showInvoice && (
                        <div className=' rounded-lg p-5 '>
                            <div className="grid lg:grid-cols-3 gap-2 ">
                                <h1 className="not-italic font-medium text-2xl text-[#001737]  mt-2">
                                    Invoice
                                </h1>

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
                                                    Booking Date
                                                </th>
                                                <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                    Total Booked Screen
                                                </th>

                                                <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                    Booked Duration <br />
                                                    <label className=' text-sm'>dd:hh:mm:ss</label>
                                                </th>
                                                <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                    Paid
                                                </th>
                                                <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                                    Action
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
                                            ) : InvoiceData &&
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
                                                    {InvoiceData &&
                                                        sortedAndPaginatedData.length > 0 &&
                                                        sortedAndPaginatedData?.map((item, index) => {
                                                            return (
                                                                <tr
                                                                    className="border-b border-b-[#E4E6FF] "
                                                                    key={index}
                                                                >
                                                                    <td className="text-[#5E5E5E] mw-200 text-center">
                                                                        {item?.bookingDate}
                                                                    </td>
                                                                    <td className="mw-200 text-[#5E5E5E] text-center">
                                                                        {item?.totalScreen}
                                                                    </td>
                                                                    <td className="mw-200 text-[#5E5E5E] text-center">
                                                                        {item?.bookedDuration}
                                                                    </td>
                                                                    <td className="mw-200 text-[#5E5E5E] text-center">
                                                                        {item?.paidAmount?.toLocaleString('en-IN')}
                                                                    </td>
                                                                    <td className="mw-200 text-[#5E5E5E] text-center">
                                                                        <div className="flex gap-4 justify-center">
                                                                            <>
                                                                                <div
                                                                                    data-tip
                                                                                    data-for="View"
                                                                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                                    onClick={() => { setShowInvoice(true); setInvoiceId(item?.invoiceID) }}
                                                                                >
                                                                                    <BsEyeFill />
                                                                                    <ReactTooltip
                                                                                        id="View"
                                                                                        place="bottom"
                                                                                        type="warning"
                                                                                        effect="solid"
                                                                                    >
                                                                                        <span>View</span>
                                                                                    </ReactTooltip>
                                                                                </div>

                                                                                {/* <div
                                                                                    data-tip
                                                                                    data-for="Download"
                                                                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                                // onClick={() => { DownloadInvoice(); setInvoiceId(item?.id); }}
                                                                                >
                                                                                    <FaDownload />
                                                                                    <ReactTooltip
                                                                                        id="Download"
                                                                                        place="bottom"
                                                                                        type="warning"
                                                                                        effect="solid"
                                                                                    >
                                                                                        <span>Download</span>
                                                                                    </ReactTooltip>
                                                                                </div> */}
                                                                            </>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                                <div className="flex items-center">
                                    <span className="text-gray-500">{`Total ${filteredData?.length} Slots`}</span>
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
                                        <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
                                    </div>
                                    <span>{`Page ${currentPage} of ${totalPages}`}</span>
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
                            </div> */}
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </>
    )
}

