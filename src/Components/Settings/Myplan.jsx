import React from 'react'
import { useState } from 'react';

import { FiFilter } from 'react-icons/fi'
import { SlCalender } from 'react-icons/sl'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import '../../Styles/Settings.css'
const Myplan = () => {
    const [myplan, setmyPlan] = useState([
        {
            name: 'Plan Name',
            totalscreen: '1',
            plan: 'Basic',
            storage: '3GB',
            cost: '$25',
            discount: '50%',
            statusEnabled: true,
        },
        {
            name: 'Plan Name',
            totalscreen: '1',
            plan: 'Basic',
            storage: '3GB',
            cost: '$25',
            discount: '50%',
            statusEnabled: true,
        },
        {
            name: 'Plan Name',
            totalscreen: '1',
            plan: 'Basic',
            storage: '3GB',
            cost: '$25',
            discount: '50%',
            statusEnabled: true,
        },
        {
            name: 'Plan Name',
            totalscreen: '1',
            plan: 'Basic',
            storage: '3GB',
            cost: '$25',
            discount: '50%',
            statusEnabled: true,
        },
        {
            name: 'Plan Name',
            totalscreen: '1',
            plan: 'Basic',
            storage: '3GB',
            cost: '$25',
            discount: '50%',
            statusEnabled: true,
        }
    ]);


    const handleStatusToggle = (index) => {
        const updatedPlans = [...myplan];
        updatedPlans[index].statusEnabled = !updatedPlans[index].statusEnabled;
        setmyPlan(updatedPlans);
    };
    const [Statusenabled, setStatusEnabled] = useState(false)
    const [planModel, showPlanModal] = useState(false);
    const [discoupon, setshowdiscoupon] = useState(false)
    const [discouponcodes, setshowcouponcodes] = useState(false)
    { /* Add new discount Model */ }

    return (
        <>
        <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
            <div>
                <button className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 mb-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50" onClick={() => showPlanModal(true)}>
                    <SlCalender className="text-lg mr-2" />
                    Add New Plan
                </button>
            </div>
            <div className='clear-both overflow-x-auto'>
                <table className=' bg-[#EFF3FF] w-full text-left rounded-xl' cellPadding={15}>
                    <thead>
                        <tr className='border-b border-b-[#E4E6FF]'>

                            <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center'>Name<FiFilter className='ml-1 text-lg' /></span></th>
                            <th className='text-[#5A5881] text-base font-semibold text-center'><span className='flex items-center justify-center'>Total Screen<FiFilter className='ml-1 text-lg' /></span></th>
                            <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center justify-center'>Plan<FiFilter className='ml-1 text-lg' /></span></th>
                            <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Storage</div></th>
                            <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Cost</div></th>
                            <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Discount <FiFilter className='ml-1 text-lg' /></div></th>
                            <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Status</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {myplan.map((plan, index) => (
                            <tr key={index} className='border-b border-b-[#E4E6FF]'>
                                <td className='text-[#5E5E5E]'>{plan.name}</td>
                                <td className='text-[#5E5E5E] text-center'>{plan.totalscreen}</td>
                                <td className='text-[#5E5E5E] text-center'>{plan.plan}</td>
                                <td className='text-[#5E5E5E] text-center'><span style={{ background: '#E4E6FF', padding: '10px', borderRadius: '5px' }}> {plan.storage} </span></td>
                                <td className='text-[#5E5E5E] text-center'>{plan.cost}</td>
                                <td className='text-[#5E5E5E] text-center'>{plan.discount}</td>



                                <td className='text-center'>
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={plan.statusEnabled}
                                            onChange={() => handleStatusToggle(index)}
                                        />
                                        <div
                                            className={`w-10 h-5 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${plan.statusEnabled ? "bg-[#009618]" : "bg-[#9ddda7]"
                                                }`}
                                        ></div>
                                    </label>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>                                                    
            {/* Add new Plan */}
            {planModel && (
                <>
                    <div className="backdrop">
                        <div className="user-model">

                            <div className="hours-heading flex justify-between items-center p-5 border-b border-gray sticky top-0 shadow-md z-[99] bg-white">
                                <h1 className='text-lg font-medium text-primary'>Add New Plan</h1>
                                <AiOutlineCloseCircle className='text-4xl text-primary cursor-pointer' onClick={() => showPlanModal(false)} />

                            </div>

                            <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">

                                    <div className="grid grid-cols-12 gap-6">
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Plan Name</label>
                                                <input type='text' placeholder='Enter Plan Name' name="plan_name" className="formInput" />
                                            </div>
                                        </div>
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Total Screens</label>
                                                <input type='text' placeholder='1' name="totalscreen" className="formInput" />
                                            </div>
                                        </div>
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Type</label>
                                                <select className="formInput">
                                                    <option selected>Select Type</option>
                                                    <option>Basic</option>
                                                </select>

                                            </div>
                                        </div>
                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Storage</label>
                                                <input type='text' placeholder='Enter Storage' name="storage" className="formInput" />
                                            </div>
                                        </div>

                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Cost</label>
                                                <input type='text' placeholder='Enter Plan Cost' name="cost" className="formInput" />
                                            </div>
                                        </div>


                                        <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Status</label>
                                                <select className="formInput">
                                                    <option>Active</option>
                                                    <option>Deactive</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-span-12'>
                                            <div className="relative">
                                                <label className="formLabel">Discount</label>
                                                <span
                                                    className="flex justify-between formInput"
                                                    onClick={() =>
                                                        setshowdiscoupon(!discoupon)
                                                    }
                                                >
                                                    <label className=""> Select Discount coupon Codes </label>
                                                    {discoupon ? (
                                                        <MdOutlineKeyboardArrowUp className="text-2xl font-black cursor-pointer" />
                                                    ) : (
                                                        <MdOutlineKeyboardArrowDown className="text-2xl font-black cursor-pointer" />
                                                    )}

                                                </span>
                                            </div>
                                            {
                                                discoupon && (
                                                    <div className=" relative">
                                                        <ul className=" absolute top-0 left-0 bg-white rounded-br-lg rounded-bl-lg w-full drop-shadow-xl z-10 border-[#41479b78] border p-3">
                                                            <li className="border border-[#D5E3FF] rounded-md p-3">
                                                                <div className="relative">
                                                                    <div className="relative">
                                                                        <span className="flex justify-between" onClick={() => setshowcouponcodes(!discouponcodes)}>
                                                                            <label className=""> With coupon Codes </label>
                                                                            {discouponcodes ? (
                                                                                <MdOutlineKeyboardArrowUp className="text-2xl font-black cursor-pointer" />
                                                                            ) : (
                                                                                <MdOutlineKeyboardArrowDown className="text-2xl font-black cursor-pointer" />
                                                                            )}
                                                                        </span>



                                                                        {/* discoupon code */}
                                                                        {
                                                                            discouponcodes && (
                                                                                <>
                                                                                    <div className='border-[#41479b78] border-t py-3 mt-2'>
                                                                                        <button className=" bg-primary text-white border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 mb-5 py-2 text-base sm:text-sm  hover:bg-white hover:text-primary  hover:shadow-lg hover:shadow-primary-500/50" onClick={() => showNewDiscountModal(true)}>
                                                                                            Add new Discount
                                                                                        </button>
                                                                                        <div className='clear-both overflow-x-auto'>
                                                                                            <table cellPadding={5} className='couponcode-table'>
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th className='text-SlateBlue text-sm'>Discounted Value</th>
                                                                                                        <th className='text-SlateBlue text-sm'>Information</th>
                                                                                                        <th className='text-SlateBlue text-sm'>Status</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td className='text-sm text-[#5E5E5E]'>50% Off</td>
                                                                                                        <td className='text-sm text-[#5E5E5E]'>Get 50% Off on your first 5 screens</td>
                                                                                                        <td>
                                                                                                            <label className="inline-flex relative items-center  cursor-pointer">
                                                                                                                <input
                                                                                                                    type="checkbox"
                                                                                                                    className="sr-only peer"
                                                                                                                    checked
                                                                                                                    readOnly
                                                                                                                />
                                                                                                                <div
                                                                                                                    onClick={() => {
                                                                                                                        setStatusEnabled(!Statusenabled);
                                                                                                                    }}
                                                                                                                    className="w-10 h-5 bg-[#009618] rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all "
                                                                                                                ></div>
                                                                                                            </label>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td className='text-sm text-[#5E5E5E]'>50% Off</td>
                                                                                                        <td className='text-sm text-[#5E5E5E]'>Get 50% Off on your first 5 screens</td>
                                                                                                        <td>
                                                                                                            <label className="inline-flex relative items-center  cursor-pointer">
                                                                                                                <input
                                                                                                                    type="checkbox"
                                                                                                                    className="sr-only peer"
                                                                                                                    checked
                                                                                                                    readOnly
                                                                                                                />
                                                                                                                <div
                                                                                                                    onClick={() => {
                                                                                                                        setStatusEnabled(!Statusenabled);
                                                                                                                    }}
                                                                                                                    className="w-10 h-5 bg-[#009618] rounded-full  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all "
                                                                                                                ></div>
                                                                                                            </label>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>



                                                            </li>
                                                            <li className="border border-[#D5E3FF] rounded-md p-3 mt-2">
                                                                <div className="relative">
                                                                    <span className="flex justify-between">
                                                                        <label className=""> Without coupon Codes </label>
                                                                        <MdOutlineKeyboardArrowDown className=" text-xl font-black cursor-pointer" />
                                                                    </span>
                                                                </div>

                                                            </li>


                                                        </ul>
                                                    </div>
                                                )
                                            }



                                        </div>
                                        <div className='col-span-12 text-center'>

                                            <button className='bg-white text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white'>Save</button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}



        </>
    )
}

export default Myplan
