import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { formatINRCurrency, formatToUSCurrency, PageNumber } from '../../Components/Common/Common';
import { useDispatch } from 'react-redux';
import { getAllUserAdScreen } from '../../Redux/admin/AdvertisementSlice';
import moment from 'moment';
import { updateAssteScreen } from '../../Redux/CommonSlice';
import { FaCalendarAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Datepicker from "react-tailwindcss-datepicker";
import { format } from 'date-fns';

export default function AdScreens({ sidebarOpen }) {
    const dispatch = useDispatch()
    const store = useSelector((state) => state.root.advertisementData);

    const [loadFirst, setLoadFirst] = useState(true);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [AdScreens, setAdScreens] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [assetManagement, setAssetManagement] = useState({});
    const filteredData = store?.pendingScreens?.length > 0 ? store?.pendingScreens?.filter((item) => item?.screenName.toString().toLowerCase().includes(searchTerm.toLowerCase())) : []

    const [value, setValue] = useState({
        startDate: '',
        endDate: ''
    });
    const query = {
        StartDate: value?.startDate ? moment(value.startDate).format('YYYY-MM-DD') : '',
        EndDate: value?.endDate ? moment(value.endDate).format('YYYY-MM-DD') : ''
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        if (loadFirst) {
            setLoading(true)
            dispatch(getAllUserAdScreen(query)).then((res) => {
                const screens = res?.payload?.data || [];
                const initialAssetManagement = {};
                screens.forEach(screen => {
                    initialAssetManagement[screen.screenID] = screen?.assetManagement;
                });
                setAssetManagement(initialAssetManagement);

                setAdScreens(screens)
                setLoading(false)
            })
            setLoadFirst(false)
        }
    }, [loadFirst, dispatch,]);

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm]);



    const DeactiveAsste = async (item) => {
        setAssetManagement(prev => {
            const newModalState = { ...prev };
            const index = item?.screenID;
            newModalState[index] = !prev[index];


            const payload = {
                ScreenID: item?.screenID,
                UserID: item?.userID,
                AssetManagement: newModalState[item?.screenID],
            };
            try {
                const res = dispatch(updateAssteScreen(payload));
                dispatch(getAllUserAdScreen(query));

            } catch (error) {
                console.error("Error updating asset management:", error);
            }
            return newModalState;
        });
    }

    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
                <div className='flex items-center justify-justify-between  p-2'>
                    <h2 className='font-semibold w-full text-2xl'>Ad Screens</h2>
                    <div className="flex items-center justify-end gap-3 w-full ">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <AiOutlineSearch className="w-5 h-5 text-gray" />
                            </span>
                            <input
                                type="text"
                                placeholder="Searching.."
                                className="border border-primary rounded-lg pl-10 py-1.5 search-user"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="border border-[#D5E3FF] border-1 rounded w-full p-0 m-0 ">
                            <Datepicker
                                separator="to"
                                value={value}
                                onChange={newValue => { setValue(newValue); setLoadFirst(true); }}
                                // showFooter={true}
                                className="p-0"
                            />
                        </div>
                    </div>
                </div>

                <div className="clear-both">
                    <div className="bg-white rounded-xl mt-8 shadow screen-section ">
                        <div className=" mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg ">
                            <table
                                className="screen-table w-full  lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                                cellPadding={15}
                            >
                                <thead>
                                    <tr className="items-center table-head-bg">
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center flex items-center">
                                            Screen Name
                                        </th>

                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Location
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Status
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Asset management
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Book Slot
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Received Payment
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                            Payout
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading &&
                                        currentItems?.length > 0 &&
                                        currentItems?.map((item, index) => (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center" key={index}>
                                                <td className="px-6 py-4">{item?.screenName}</td>
                                                <td className="px-6 py-4">{item?.googleLocation}</td>
                                                <td className="px-6 py-4 text-green-600">
                                                    <span
                                                        id={`changetvstatus${item?.macID}`}
                                                        className={`rounded-full px-6 py-2 text-white text-center
                                                                            ${item?.screenStatus === 1 ? "bg-[#3AB700]" : "bg-[#FF0000]"}`}
                                                    >
                                                        {item?.screenStatus === 1 ? "Live" : "offline"}
                                                    </span>

                                                </td>
                                                <td className="px-6 py-4">


                                                    <label class="inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            class="sr-only peer"
                                                            checked={assetManagement[item?.screenID]}
                                                            id={`Active_${item?.ScreenID}`}
                                                            onChange={() => {
                                                                DeactiveAsste(item)
                                                            }}
                                                        />
                                                        <div
                                                            style={{
                                                                background: (assetManagement[item?.screenID]) ? 'green' : 'gray',
                                                            }}
                                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-blue-800 dark:bg-gray-700
                                                                ${(assetManagement[item?.screenID]) ? 'bg-green-500' : 'bg-red-500'}`}
                                                        >
                                                            <div
                                                                className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-transform duration-200  dark:border-gray-600`}
                                                                style={{
                                                                    transform: (assetManagement[item?.screenID]) ? 'translateX(20px)' : 'translateX(0)',
                                                                    transition: 'transform 0.5s ease-in-out',
                                                                }}

                                                            ></div>
                                                        </div>

                                                    </label>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item?.lastSeen ? moment(item?.lastSeen).format("LLL") : null}
                                                </td>


                                                <td className="px-6 py-4 gap-2">
                                                    {item?.currency === 'INR' ? formatINRCurrency(item?.receivedPayment) : formatToUSCurrency(item?.receivedPayment)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item?.currency === 'INR' ? formatINRCurrency(item?.payout) : formatToUSCurrency(item?.payout)}
                                                </td>
                                            </tr>
                                        ))}
                                    {!loading && currentItems?.length === 0 && (
                                        <tr>
                                            <td colSpan={15}>
                                                <div className="flex text-center m-5 justify-center">
                                                    <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                                        No Data Available
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={15}>
                                            <div className="flex text-center m-5 justify-center items-center">
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
                            </table>
                        </div>
                        {currentItems?.length !== 0 && (
                            <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                                <div className="flex items-center">
                                    <span className="text-gray-500">{`Total ${currentItems?.length} Screens`}</span>
                                </div>
                                <div className="flex justify-end">
                                    <select className='px-1 mr-2 border border-gray rounded-lg'
                                        value={itemsPerPage}
                                        onChange={(e) => { setItemsPerPage(e.target.value); setCurrentPage(1) }}
                                    >
                                        {PageNumber.map((x) => (
                                            <option value={x}>{x}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
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
                                        <span className="text-gray-500">{`Page ${currentPage} of ${Math.ceil(
                                            AdScreens?.length / itemsPerPage
                                        )}`}</span>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={
                                            currentPage ===
                                            Math.ceil(AdScreens?.length / itemsPerPage)
                                        }
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
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

