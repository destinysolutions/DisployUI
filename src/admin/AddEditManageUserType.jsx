import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const AddEditManageUserType = ({ toggleModal, heading, isActive, setIsActive, HandleSubmit, userType, setUserType }) => {
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="relative p-4 lg:w-[500px] md:w-[500px] sm:w-full max-h-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {heading} User Type
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => {
                                            toggleModal();
                                        }}
                                    />
                                </div>
                                {/* Modal body */}
                                <div className="p-6 max-h-96 vertical-scroll-inner">
                                    <div className="space-y-3 md:space-y-5">
                                        <div className="flex flex-col">
                                            <div className="relative w-full">
                                                <input
                                                    type="text"
                                                    name="Name"
                                                    id="Name"
                                                    placeholder="Enter User Type"
                                                    className="formInput mb-3"
                                                    value={userType}
                                                    onChange={(e) => setUserType(e.target.value)}
                                                />
                                            </div>
                                            <div className='flex items-center p-2'>
                                                <label>isActive </label>
                                                <input
                                                    className="border border-primary ml-8 rounded h-6 w-6"
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onChange={() => setIsActive(!isActive)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center px-4 pt-4 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                            <button
                                                type="button"
                                                className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                                onClick={() => toggleModal()}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                                onClick={() => HandleSubmit()}
                                            >
                                                Save
                                            </button>
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

export default AddEditManageUserType
