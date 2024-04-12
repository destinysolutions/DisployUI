import { loadStripe } from '@stripe/stripe-js';
import { round } from 'lodash';
import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';


const AddEditStorage = ({ toggleModal, setAddStorage, addStorage, handlePay, setDiscountCoupon, discountCoupon }) => {


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
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add More Space
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    toggleModal();
                                }}
                            />
                        </div>
                        <div className="p-4 md:p-5">
                            <div className='flex flex-col gap-3 mb-5'>
                                <span className='flex justify-center items-center font-semibold text-xl'>
                                    Enter the Storage capacity required
                                </span>
                                <div className='flex items-center justify-evenly'>
                                    <p>Add Storage</p>
                                    <div className='flex items-center gap-1 mr-5'>
                                        <input type='number'
                                            className="relative border border-black rounded-md p-2 w-24"
                                            onChange={(e) => setAddStorage(e.target.value)}
                                            value={addStorage}
                                        />
                                        <span>GB</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-evenly'>
                                    <p>Cost</p>
                                    <div className='flex items-center gap-1'>
                                        <input
                                            disabled
                                            type='number'
                                            className="relative border border-black rounded-md p-2 w-24"
                                            value={round((addStorage * 3), 2)}
                                        />
                                        <span>$</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-evenly'>
                                    <div className='flex items-center gap-1'>
                                        <input
                                            type='text'
                                            placeholder='Discount Coupon'
                                            className="relative border border-black rounded-md p-2 w-48"
                                            onChange={(e) => setDiscountCoupon(e.target.value)}
                                            value={discountCoupon}
                                        />
                                        <button
                                            className="bg-primary text-white text-base px-5 py-2 border border-primary shadow-md rounded-full "
                                            type="button"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                                <div className='flex justify-end items-center gap-4'>
                                    <div className='mt-3'>
                                        <label>Total Price:</label>
                                    </div>
                                    <div className='border-t border-black dark:border-gray-600'>
                                        <input
                                            type='text'
                                            placeholder='Total Price'
                                            className="relative border border-black rounded-md p-2 w-36 mt-3"
                                            disabled
                                            value={round((addStorage * 0.05), 2)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center p-2 md:p-2 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                <button
                                    className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                    type="button"
                                    onClick={toggleModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                    type="button"
                                    onClick={() => handlePay()}
                                >
                                    Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddEditStorage
