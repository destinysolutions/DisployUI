import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IoIosArrowForward } from "react-icons/io";
const AddEditDiscount = ({ togglemodal, discount, setDiscount }) => {
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600 ">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Select Discount Type
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => togglemodal()}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <div className='border-b dark:border-gray-500 border-gray-500'>
                                <div className='px-5 py-2 cursor-pointer'
                                    onClick={() => {
                                        setDiscount("Screen")
                                        togglemodal()
                                    }}
                                >
                                    <div className='flex flex-row items-center justify-between'>
                                        <div>
                                            <h1 className='text-gray-600 text-lg'>Amount off Screen</h1>
                                            <p className='text-gray-400'>Screen Cost Discount</p>
                                        </div>
                                        <div>
                                            <IoIosArrowForward />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='border-b dark:border-gray-500 border-gray-500'>
                                <div className='px-5 py-2 cursor-pointer'
                                    onClick={() => {
                                        setDiscount("Features")
                                        togglemodal()
                                    }}
                                >
                                    <div className='flex flex-row items-center justify-between'>
                                        <div>
                                            <h1 className='text-gray-600 text-lg'>Amount off Features</h1>
                                            <p className='text-gray-400'>Features Discount</p>
                                        </div>
                                        <div>
                                            <IoIosArrowForward />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<div className='border-b dark:border-gray-500 border-gray-500'>
                                <div className='px-5 py-2 cursor-pointer'
                                    onClick={() => {
                                        setDiscount("Trial Period")
                                        togglemodal()
                                    }}
                                >
                                    <div className='flex flex-row items-center justify-between'>
                                        <div>
                                            <h1 className='text-gray-600 text-lg'>Trial Period Discount</h1>
                                            <p className='text-gray-400'>Increase 14 Day Trial Period</p>
                                        </div>
                                        <div>
                                            <IoIosArrowForward />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='border-b dark:border-gray-500 border-gray-500'>
                                <div className='px-5 py-2 cursor-pointer'
                                    onClick={() => {
                                        setDiscount("Custom")
                                        togglemodal()
                                    }}
                                >
                                    <div className='flex flex-row items-center justify-between'>
                                        <div>
                                            <h1 className='text-gray-600 text-lg'>Custom Trial Period Offer</h1>
                                            <p className='text-gray-400'>Discount</p>
                                        </div>
                                        <div>
                                            <IoIosArrowForward />
                                        </div>
                                    </div>
                                </div>
                                </div>*/}
                        </div>
                        <div className="flex items-center justify-center p-3 md:p-3 border-t border-gray-200 rounded-b dark:border-gray-500 gap-2">
                            <button
                                className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                type="button"
                                onClick={() => togglemodal()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddEditDiscount
