import React, { useState } from 'react'
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';

export default function CommissionRate() {
    const [loading, setLoading] = useState(false);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(false);

    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                <div className=' border-b border-gray pb-3'>
                    <h2 className='font-semibold'>Commission Rate</h2>
                </div>

                <div className="clear-both ">
                    <div className="bg-white rounded-xl mt-8 shadow screen-section ">
                        <div className=" mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg h-96">
                            <div className='flex justify-center items-center gap-3'>
                                <button
                                    className="relative group flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                    onClick={() => {
                                        // setHeading("Add")
                                        // handleAddPlan()
                                    }}
                                >
                                    Up 20 Screens
                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                </button>
                                <button
                                    className="relative group flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                    onClick={() => {
                                        // setHeading("Add")
                                        // handleAddPlan()
                                    }}
                                >
                                    More than 20 Screens
                                    <div class="tooltip-arrow" data-popper-arrow></div>
                                </button>
                            </div>
                            <div>
                                <div
                                    className="accordions shadow-md p-5 bg-blue-100 border border-blue-400 rounded-lg m-4 "
                                >
                                    <div className="section lg:flex md:flex  sm:block items-center justify-between">
                                        <div className="flex gap-2 items-center">
                                            <h1 className="text-sm capitalize">If bring the ads
                                            </h1>
                                        </div>


                                        <div className=" flex items-center justify-end">



                                            <button>
                                                {openAccordionIndex ? (
                                                    <div onClick={() => setOpenAccordionIndex(false)}>
                                                        <IoIosArrowDropup className="text-3xl" />
                                                    </div>
                                                ) : (
                                                    <div onClick={() => setOpenAccordionIndex(true)}>
                                                        <IoIosArrowDropdown className="text-3xl" />
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {openAccordionIndex && (
                                        <div className="overflow-x-scroll sc-scrollbar px-2 mt-2 bg-white ">
                                            <div className='flex items-center gap-1 my-2'>
                                                <label className="text-sm font-medium w-20 mr-2">Disploy:</label>
                                                <div>
                                                    <input
                                                        className="block w-20 p-1 text-gray-900 border border-gray-300  bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                        type="number"
                                                    // value={item?.afterevent}
                                                    // onChange={(e) => { handleaftereventChange(e, index) }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                                <label className="text-sm font-medium w-20 mr-2">Client:</label>
                                                <div>
                                                    <input
                                                        className="block w-20 p-1 text-gray-900 border border-gray-300  bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                        type="number"
                                                    // value={item?.afterevent}
                                                    // onChange={(e) => { handleaftereventChange(e, index) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
