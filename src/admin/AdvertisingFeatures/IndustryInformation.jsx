import React, { useRef, useState } from 'react';
import { AiFillPlusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { PageNumber } from '../../Components/Common/Common';
import AddIndustry from './AddIndustry';
import toast from 'react-hot-toast';
import { MdDeleteForever } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa6';

export default function IndustryInformation({ sidebarOpen }) {

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [advertiserData, setAdvertiserData] = useState([]);
    const [ShowIndustryModal, setShowIndustryModal] = useState(false);
    const [categorymodal, setCategoryModal] = useState([]);
    const [rows, setRows] = useState([]);

    const [currentRowIndex, setCurrentRowIndex] = useState(null);
    const [modalData, setModalData] = useState({ category: '', includes: [] });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = advertiserData?.slice(indexOfFirstItem, indexOfLastItem);

    const toggleCategoryModal = (index) => {
        setCategoryModal(prev => {
            const newModalState = [...prev];
            newModalState[index] = !newModalState[index];
            return newModalState;
        });
    };
    const handleAddInformation = (e) => {
        e.preventDefault();
        if (!rows.some(row => row.category.trim().length > 0)) {
            return toast.error("Please enter some text.");
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter" || e.type === "click") {
            const updatedRows = [...rows];
            updatedRows[index].category = e.target.value;
            setRows(updatedRows);
        }
    };

    const addRow = () => {
        setRows([...rows, { category: '', includes: [] }]);
    };

    const handleOpenModal = (index) => {
        setCurrentRowIndex(index);
        setModalData(rows[index]); 
        setShowIndustryModal(true);
    };

    const handleModalDataChange = (e) => {
        const { name, value } = e.target;
        setModalData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleModalSubmit = (data) => {
        if (currentRowIndex !== null) {
            const updatedRows = [...rows];
            updatedRows[currentRowIndex] = data;
            setRows(updatedRows);
        }
    };

    const openModalForRow = (index) => {
        setCurrentRowIndex(index);
        setModalData(rows[index]);
        setShowIndustryModal(true);
    };

    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
                <div className='border-b border-gray pb-3'>
                    <h2 className='font-semibold'>Approve Request</h2>
                </div>

                <div className="clear-both">
                    <div className="bg-white rounded-xl mt-8 shadow screen-section ">
                        <div className=" mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg">
                            <table className="screen-table w-full lg:table-auto md:table-auto sm:table-auto xs:table-auto" cellPadding={15}>
                                <thead>
                                    <tr className="items-center table-head-bg">
                                        <th className="text-[#5A5881] text-sm font-semibold w-fit text-center">Business category</th>
                                        <th className="text-[#5A5881] text-sm font-semibold w-fit text-center">Includes</th>
                                        <th className="text-[#5A5881] text-sm font-semibold w-fit text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index} className="border-b border-b-[#E4E6FF]">
                                            <td className="text-[#5E5E5E] text-center">
                                                <div className='p-2 text-center flex flex-wrap items-center justify-center gap-2 break-all text-[#5E5E5E]'>
                                                    {!row.category && !categorymodal[index] && (
                                                        <span>
                                                            <AiOutlinePlusCircle
                                                                size={30}
                                                                className="m-auto cursor-pointer"
                                                                onClick={() => {
                                                                    toggleCategoryModal(index)
                                                                }}
                                                            />
                                                        </span>
                                                    )}
                                                    {categorymodal[index] && (
                                                        <form onSubmit={(e) => handleAddInformation(e)} className="flex-initial w-fit">
                                                            <input
                                                                type="text"
                                                                placeholder='Enter Category'
                                                                className="bg-transparent placeholder-slate-400 focus:text-black focus:border-0 focus:bg-black focus:ring-0 text-base focus:outline-none w-40 p-2"
                                                                onChange={(e) => {
                                                                    const updatedRows = [...rows];
                                                                    updatedRows[index].category = e.target.value;
                                                                    setRows(updatedRows);
                                                                }}
                                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                                value={row.category}
                                                            />
                                                        </form>
                                                    )}

                                                </div>
                                            </td>
                                            <td className="text-center text-[#5E5E5E]">
                                                <div className="p-2 text-center flex flex-wrap items-center justify-center gap-2 break-all text-[#5E5E5E]">
                                                    {row.includes.length <= 0 && (
                                                        <span>
                                                            <AiOutlinePlusCircle
                                                                size={30}
                                                                className="mx-auto cursor-pointer"
                                                                onClick={() => openModalForRow(index)}
                                                            />
                                                        </span>
                                                    )}
                                                    {row.includes.length > 0 && (
                                                        row.includes
                                                            .map((text) => {
                                                                if (text.length > 10) {
                                                                    return text.slice(0, 10) + "...";
                                                                }
                                                                return text;
                                                            })
                                                            .join(", ")
                                                    )}
                                                    {row?.includes?.length > 0 &&
                                                        <AiOutlinePlusCircle
                                                            onClick={() => handleOpenModal(index)}
                                                            className="w-5 h-5 cursor-pointer"
                                                        />}
                                                </div>
                                            </td>
                                            {row?.includes?.length > 0 && (
                                                <td className="text-center text-[#5E5E5E]">
                                                    <div className="p-2 text-center flex flex-wrap items-center justify-center gap-2 break-all text-[#5E5E5E]">
                                                        <div className="cursor-pointer text-xl flex gap-4">
                                                            <button
                                                                data-tip
                                                                data-for="Edit"
                                                                type="button"
                                                                className="cursor-pointer text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                onClick={() => addRow()}
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                        </div>
                                                        <div className="cursor-pointer text-xl flex gap-4 ">
                                                            <button
                                                                data-tip
                                                                data-for="Delete"
                                                                type="button"
                                                                className="rounded-full px-2 py-2 text-white text-center bg-[#FF0000] mr-2"
                                                                onClick={() => {
                                                                    // Delete logic here
                                                                }}
                                                            >
                                                                <MdDeleteForever />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {!loading && rows.length === 0 && (
                                        <tr className=' h-96'>
                                            <td colSpan={3}>
                                                <button
                                                    className="mx-auto flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                                    onClick={() => addRow()}
                                                >
                                                    <AiFillPlusCircle className="text-2xl mr-1" />
                                                    Click to add industry
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={5}>
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
                                    <span className="text-gray-500">{`Total ${advertiserData?.length} Advertiser`}</span>
                                </div>
                                <div className="flex justify-end">
                                    <select className='px-1 mr-2 border border-gray rounded-lg'
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(e.target.value)}
                                    >
                                        {PageNumber.map((x) => (
                                            <option key={x} value={x}>{x}</option>
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
                                        <span className="text-gray-500">{`Page ${currentPage} of ${Math.ceil(advertiserData?.length / itemsPerPage)}`}</span>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(advertiserData?.length / itemsPerPage)}
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
            {ShowIndustryModal && (
                <AddIndustry
                    setShowIndustryModal={setShowIndustryModal}
                    information={modalData}
                    handleModalDataChange={handleModalDataChange}
                    handleModalSubmit={handleModalSubmit}
                    setinformation={setModalData}
                />
            )}
        </div>
    );
}
