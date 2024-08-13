import React from 'react'
import { IoClose } from 'react-icons/io5'

const PaymentURL = ({ PaymentUrl, PaymentUrlOpen, setPaymentUrlOpen }) => {
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full"
            >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="relative p-4 lg:w-[1000px] md:w-[900px] sm:w-full max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="p-4 md:p-5">
                                    <div id="payment-form" className='Payment'>
                                        <div className="text-gray-500 hover:text-gray-700 duration-200 flex justify-between items-center mb-5 cursor-pointer" >
                                            <label className='text-black text-2xl font-semibold'>
                                                Payment Confirmation
                                            </label>
                                            <IoClose size={26} onClick={() => setPaymentUrlOpen(!PaymentUrlOpen)} />
                                        </div>
                                        <div className='p-4'>
                                            {PaymentUrl !== "" && (
                                                <iframe
                                                    className='md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72'
                                                    title="Document Viewer"
                                                    src={PaymentUrl}
                                                ></iframe>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentURL
