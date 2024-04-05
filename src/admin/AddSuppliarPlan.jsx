import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const AddSuppliarPlan = ({ setPlanModal, planModel, planDetail, setPlanDetail, handleNewSupllierPlan,error }) => {
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
                                Add Supplier Plan
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    setPlanModal(!planModel);
                                }}
                            />
                        </div>
                        <div className="p-4 md:p-5">
                            <div className="grid grid-cols-12 gap-6 mb-6">
                                <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                    <div className="relative">
                                        <label className="formLabel">Plan Name</label>
                                        <input type='text' placeholder='Enter Plan Name' name="plan_name" className="formInput" value={planDetail?.planName} onChange={(e) => setPlanDetail({ ...planDetail, planName: e.target.value })} />
                                    </div>
                                    {error?.planName && (
                                        <span>
                                        </span>
                                    )}
                                </div>
                                <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                    <div className="relative">
                                        <label className="formLabel">Cost Per Second</label>
                                        <input type='text' placeholder='Enter Cost' name="totalscreen" className="formInput" value={planDetail?.cost} onChange={(e) => setPlanDetail({ ...planDetail, cost: e.target.value })} />
                                    </div>
                                </div>
                              {/*  <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                    <div className="flex flex-row items-center gap-3">
                                        <input type='checkbox' placeholder='Enter Cost' name="active" checked={planDetail?.isActive} onChange={(e) => setPlanDetail({ ...planDetail, isActive: e.target.checked })} />
                                        <label>Active</label>
                                    </div>
                                    </div>*/}
                            </div>

                            <div className="flex items-center justify-center p-2 md:p-2 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                <button
                                    className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                    type="button"
                                    onClick={() => setPlanModal(!planModel)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                    type="button"
                                    onClick={() => handleNewSupllierPlan()}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddSuppliarPlan
