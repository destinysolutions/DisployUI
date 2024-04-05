import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const TrialPlan = ({ setTrialPlanModal, trialPlanModel, handleSaveTrialPlan, trialData, setTrialData }) => {
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
                                Trial Period Plan
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => setTrialPlanModal(!trialPlanModel)}
                            />
                        </div>
                        <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
                            <div>
                                <div className='mb-4'>
                                    <div className="relative">
                                        <label className="formLabel">Trial Days</label>
                                        <input type='text' placeholder='Enter Trial Days' name="plan_name" className="formInput" value={trialData?.trialDays} onChange={(e) => setTrialData({ ...trialData, trialDays: e.target.value })} />
                                    </div>
                                    <div className='flex gap-2 my-3'>
                                        <input type='checkbox' className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" checked={trialData?.isActive} onChange={(e) => setTrialData({ ...trialData, isActive: e.target.checked })} />
                                        <label>Is Active</label>
                                    </div>
                                </div>
                                <div className='border-t dark:border-gray-600'>
                                    <div className='col-span-12 text-center mt-3'>
                                        <button className='bg-white text-primary text-base px-8 py-3 border border-primary shadow-md rounded-full hover:bg-primary hover:text-white'
                                            onClick={() => handleSaveTrialPlan()}>Save</button>
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

export default TrialPlan
