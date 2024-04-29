import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const ScreenStorage = ({ setScreenLimit, screenLimit }) => {
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full h-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Warning
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    setScreenLimit(!screenLimit);
                                }}
                            />
                        </div>
                        <div className='lg:p-5 md:p-5 sm:p-3 xs:p-2'>
                            <div>
                                you need to purchase screen for accessing our services.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ScreenStorage
