import React, { useRef, useState } from 'react'
import { BsEyeFill } from 'react-icons/bs';
import { FaDownload, FaEye } from 'react-icons/fa'
import InvoiceBilling from './InvoiceBilling';
import { IoIosArrowRoundBack } from 'react-icons/io';

const Invoice = ({ permissions, showInvoice, setShowInvoice, InvoiceRef, DownloadInvoice }) => {

    return (
        <>
            {!showInvoice && (
                <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
                    <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2">
                        <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl mb-5">
                            Invoice
                        </h1>
                    </div>
                    <div className="rounded-xl mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg">
                        <table
                            className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                            cellPadding={20}
                        >
                            <thead className="items-center table-head-bg">
                                <tr>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        ID
                                    </th>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Client Name
                                    </th>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Total
                                    </th>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Issued Date
                                    </th>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Status{" "}
                                    </th>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 bg-white">
                                    <td className="px-5 py-3 text-lg">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10">
                                                <img
                                                    className="w-full h-full rounded-full"
                                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2.2&amp;w=160&amp;h=160&amp;q=80"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-blue-900 whitespace-no-wrap">
                                                    #5036
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-lg">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            Lavern Laboy
                                        </p>
                                    </td>
                                    <td className="px-5 py-3 text-lg">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            $5875
                                        </p>
                                    </td>
                                    <td className="px-5 py-3 text-lg">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            04/07/2023
                                        </p>
                                    </td>
                                    <td className="px-5 py-3 text-lg">
                                        <span className="relative inline-block px-3 py-1 font-semibold bg-orange-200 text-orange-400 leading-tight rounded-full">
                                            Pending
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-lg">
                                        <div className="flex gap-4">
                                            <>
                                                <div
                                                    data-tip
                                                    data-for="View"
                                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={() => setShowInvoice(true)}
                                                >
                                                    <BsEyeFill />

                                                </div>

                                                <div
                                                    data-tip
                                                    data-for="Edit"
                                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={() => DownloadInvoice()}
                                                >
                                                    <FaDownload />
                                                </div>
                                            </>
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {showInvoice && (
                <div className='p-4 flex justify-start items-center gap-2'>
                    <IoIosArrowRoundBack size={36} className='cursor-pointer' onClick={() => setShowInvoice(false)} />
                    <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
                        Invoice
                    </h1>
                </div>
            )}
            <div className={`${showInvoice ? "" : "hidden"}`}>
                <InvoiceBilling InvoiceRef={InvoiceRef} setShowInvoice={setShowInvoice} />
            </div>
        </>
    )
}

export default Invoice
