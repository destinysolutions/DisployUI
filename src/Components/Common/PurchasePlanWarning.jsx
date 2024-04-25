import React from 'react'

const PurchasePlanWarning = ({ setPlanWarning, planWarning }) => {
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
                            <div className="p-4 md:p-5">
                                <div className='flex flex-col gap-3'>
                                    <p className="text-gray-700 mb-6">
                                        Your trial period has ended. Please purchase a plan to continue using our services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchasePlanWarning
