import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import PlanDetails from './PlanDetails';
import TalkToSaleDialog from '../TalkToSaleDialog';

const PlanList = ({ choose, setChoose, myplan }) => {
    const [selectPlan, setSelectPlan] = useState("")
    const [planDetails, setPlanDetails] = useState(false)
    const [TalkToSale, setTalkToSale] = useState(false)
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full"
            >
                <div className="modal-overlay">
                    <div className="modal p-4 lg:w-[1200px] md:w-[900px] sm:w-full max-h-full">
                        <div className="relative w-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-300">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Purchase Plan
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => setChoose(!choose)}
                                    />
                                </div>
                                <div className="flex flex-wrap my-4 max-h-[550px] overflow-y-auto">
                                    {myplan?.map((item) => {
                                        return (
                                            <div className='w-full md:w-1/2 lg:w-1/4 xl:w-1/4 px-3 mb-4'>
                                                <div className="h-full pricing-plan border-t-4 border-solid border-white bg-white text-center max-w-sm mx-auto hover:border-blue-700 transition-colors duration-300">
                                                    <div className="p-6">
                                                        <h4 className="font-medium leading-tight text-2xl">{item?.planName}</h4>
                                                        <p className="text-gray-600 text-sm">{item?.planDetailss}</p>

                                                    </div>
                                                    {item?.listOfPlansID !== 4 && (
                                                        <div className="pricing-amount bg-indigo-100 px-4 pt-3 pb-5 h-24">
                                                            <p className="text-left">From</p>
                                                            <div className="flex items-center justify-start">
                                                                <span className="text-5xl font-semibold mr-2">${item?.planPrice}</span>
                                                                <span className="text-left leading-5">per screen /mo <br />+ VAT</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item?.listOfPlansID === 4 && (

                                                        <div className="pricing-amount bg-indigo-100 px-4 pt-3 pb-5 h-24 flex items-center justify-center">
                                                            <div className=""><span className="text-3xl font-semibold">Talk to Sales</span></div>
                                                        </div>
                                                    )}

                                                    {/*  <div className='w-full border-b border-gray-300 py-3'>
                                                    <div className="flex items-center justify-center">
                                                        <span>Annual</span>
                                                        <label
                                                            for="toggleFive"
                                                            className="mx-2 flex items-center cursor-pointer select-none text-dark dark:text-white"
                                                            >
                                                            <div className="relative">
                                                                <input
                                                                    id="toggleFive"
                                                                    type="checkbox"
                                                                    className="peer sr-only"
                                                                    />
                                                                <div
                                                                    className="h-3 rounded-full shadow-inner w-10 bg-gray-300"
                                                                    ></div>
                                                                <div
                                                                    className="absolute left-0 flex items-center justify-center transition bg-white rounded-full dot shadow-switch-1 -top-1 h-5 w-5 peer-checked:translate-x-full"
                                                                    >
                                                                    <span
                                                                        className="w-3 h-3 rounded-full active bg-gray-300"
                                                                        ></span>
                                                                </div>
                                                            </div>
                                                            </label>
                                                        <span>Monthly</span>
                                                    </div>
                                                    <p>No minimum screens</p>
                                                    </div>*/}

                                                    <div className="p-6">
                                                        {item?.listOfPlansID === 1 && (
                                                            <ul className="leading-loose">
                                                                <li>Total Storage :- 500 MB</li>
                                                                <li>Advance Scheduling</li>
                                                                <li>Screen Grouping</li>
                                                                <li>Screen Management</li>
                                                                <li>Support</li>
                                                            </ul>
                                                        )}
                                                        {item?.listOfPlansID === 2 && (
                                                            <ul className="leading-loose">
                                                                <li>Total Storage :- 1 GB</li>
                                                                <li>Apps (100+ app access)</li>
                                                                <li>User Audit logs</li>
                                                                <li>Merge Screen</li>
                                                                <li>Multilevel Approval</li>
                                                            </ul>
                                                        )}
                                                        {item?.listOfPlansID === 3 && (
                                                            <ul className="leading-loose">
                                                                <li>Total Storage :- 2 GB</li>
                                                                <li>Weather Scheduling</li>
                                                                <li>Ad Service</li>
                                                                <li>CRM</li>
                                                                <li>Report</li>
                                                            </ul>
                                                        )}
                                                        {item?.listOfPlansID === 4 && (
                                                            <ul className="leading-loose">
                                                                <li>Total Storage :- 5 GB</li>
                                                                <li>Unlimited Users</li>
                                                                <li>User ROLE Permissions</li>
                                                                <li>Composition</li>
                                                                <li>Multilevel Approval</li>
                                                            </ul>
                                                        )}
                                                        <div className="pt-4">
                                                            {item?.listOfPlansID !== 4 && (
                                                                <button
                                                                    className="bg-blue-700 hover:bg-blue-800 text-xl text-white py-2 px-6 rounded-full transition-colors duration-300"
                                                                    onClick={() => {
                                                                        setSelectPlan(item)
                                                                        setPlanDetails(true)
                                                                    }}
                                                                >
                                                                    Buy Now
                                                                </button>
                                                            )}
                                                            {item?.listOfPlansID === 4 && (
                                                                <button
                                                                    className="bg-blue-700 hover:bg-blue-800 text-xl text-white py-2 px-6 rounded-full transition-colors duration-300"
                                                                    onClick={() => {
                                                                        setSelectPlan(item)
                                                                        setTalkToSale(true)
                                                                    }}
                                                                >
                                                                    Talk to Sale
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {planDetails && (
                <PlanDetails setPlanDetails={setPlanDetails} planDetails={planDetails} selectPlan={selectPlan} />
            )}

            {TalkToSale && (
                <TalkToSaleDialog setTalkToSale={setTalkToSale} TalkToSale={TalkToSale} />
            )}

        </>
    )
}

export default PlanList
