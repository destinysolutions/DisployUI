import React, { useState } from 'react'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { CiCircleCheck } from "react-icons/ci";
import { ApproveScreens } from '../../Components/Common/Common';

export default function Approve() {
    const [loading, setLoading] = useState(false);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(false);

    const toggleAccordion = (index) => {
        setOpenAccordionIndex(prevState => prevState === index ? false : index);
    };
    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2  ">
                <div className=' border-b border-gray pb-3 '>
                    <h2 className='font-semibold'>Approve Request</h2>
                </div>

                <div className="clear-both ">
                    <div className="bg-white rounded-xl mt-8 shadow screen-section  ">
                        <div className=" mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg h-full">
                            {ApproveScreens?.map((x, index) => (
                                <div key={index}
                                    className="accordions shadow-md p-5 bg-blue-100 border border-blue-400 rounded-lg m-4">
                                    <div className="section lg:flex md:flex sm:block items-center justify-between ">
                                        <div className="flex gap-2 items-center">
                                            <h1 className="text-sm capitalize font-semibold">{x?.title}</h1>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <button onClick={() => toggleAccordion(index)}>
                                                {openAccordionIndex[index] ? (
                                                    <IoIosArrowDropup className="text-3xl" />
                                                ) : (
                                                    <IoIosArrowDropdown className="text-3xl" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {openAccordionIndex === index && (
                                        <div class="relative overflow-x-scroll sc-scrollbar rounded-lg my-3">
                                            <table class="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead class="text-white   bg-black dark:bg-gray-700 dark:text-gray-400">
                                                    <tr>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Screen
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Location
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Request Date
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Status
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Asset Management
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Requested By
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Cost/Sec
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 font-semibold  text-md">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                        <td class="px-6 py-4">5</td>
                                                        <td class="px-6 py-4">
                                                            India, Gujrat, Ahemdabad Cg Road
                                                        </td>
                                                        <td class="px-6 py-4">10 may, 2023, 10:32Am</td>
                                                        <td class="px-6 py-4  text-green-600">Active</td>
                                                        <td class="px-6 py-4">
                                                            <label class="inline-flex items-center me-5 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    value=""
                                                                    class="sr-only peer"
                                                                    checked
                                                                />
                                                                <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                                            </label>
                                                        </td>
                                                        <td class="px-6 py-4">Jimmy K</td>
                                                        <td class="px-6 py-4">₹ 500.00</td>
                                                        <td class="px-6 py-4">
                                                            <div className="flex gap-1 items-center">
                                                                <CiCircleCheck className="text-2xl text-green-600" />
                                                                <IoCloseCircleOutline className="text-2xl text-red-500" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
