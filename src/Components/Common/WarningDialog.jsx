import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const WarningDialog = ({ setWarning, warning }) => {
    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
        >
            <div className="modal-overlay">
                <div className="modal">

                    <div className="relative p-4 max-w-[500px] max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Attention
                                </h3>
                                <AiOutlineCloseCircle
                                    className="text-4xl text-primary cursor-pointer"
                                    onClick={() => setWarning(!warning)}
                                />
                            </div>
                            <div className="p-4 md:p-5">
                                <div className='flex flex-col gap-3'>
                                    <p className="text-gray-700 mb-6">
                                        Your trial period has ended. Please purchase a plan to continue using our services.
                                    </p>
                                </div>

                                <div className="flex items-center justify-end pt-5 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                    <button
                                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                        type="button"
                                        onClick={() => setWarning(!warning)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WarningDialog
