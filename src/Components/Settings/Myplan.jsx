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
                <div className="flex items-center justify-between mx-2 mb-5">
                    <div className="title">
                        <h2 className="font-bold text-xl">Pricing Plans</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                            onClick={() => showPlanModal(true)}
                        >
                            <SlCalender className="text-2xl mr-1" />
                            Add New Plan
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-8">
                    <div className="w-full md:w-1/3 px-3 mb-4">
                        <div className="bg-[#ECF0F1] p-4 rounded-lg h-full">
                            <div className="flex justify-between">
                                <div className="role-name">
                                    <p>Total 5 Users</p>
                                    <h3 className="text-2xl font-semibold my-2">
                                        Basic Plan
                                    </h3>
                                    <p>A simple start for Everyone</p>
                                </div>
                                <div className="role-user ">
                                    <div className="role-user flex justify-center">
                                        <span>
                                            <img src="./dist/images/1user-img.png" />
                                        </span>
                                        <span>
                                            <img src="./dist/images/2user-img.png" />
                                        </span>
                                        <span className="pulus-user text-2xl text-white">
                                            +3
                                        </span>
                                    </div>
                                    <div className="role-user flex justify-center mt-6">
                                        <button
                                            className="text-white items-center justify-center rounded-full lg:px-4 sm:px-3 py-2 text-base sm:text-lg  text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                        >
                                            Edit Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-4">
                        <div className="bg-[#ECF0F1] p-4 rounded-lg h-full">
                            <div className="flex justify-between">
                                <div className="role-name">
                                    <p>Total 5 Users</p>
                                    <h3 className="text-2xl font-semibold my-2">
                                        Standard Plan
                                    </h3>
                                    <p>For small to medium Businesses </p>
                                </div>
                                <div className="role-user ">
                                    <div className="role-user flex justify-center">
                                        <span>
                                            <img src="./dist/images/1user-img.png" />
                                        </span>
                                        <span>
                                            <img src="./dist/images/2user-img.png" />
                                        </span>
                                        <span className="pulus-user text-2xl text-white">
                                            +3
                                        </span>
                                    </div>
                                    <div className="role-user flex justify-center mt-6">
                                        <button
                                            className="text-white items-center justify-center rounded-full lg:px-4 sm:px-3 py-2 text-base sm:text-lg  text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                        >
                                            Edit Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-4">
                        <div className="bg-[#ECF0F1] p-4 rounded-lg h-full">
                            <div className="flex justify-between">
                                <div className="role-name">
                                    <p>Total 2 Users</p>
                                    <h3 className="text-2xl font-semibold my-2">
                                        Enterprise Plan
                                    </h3>
                                    <p>A simple start for everyone </p>
                                </div>
                                <div className="role-user ">
                                    <div className="role-user flex justify-center">
                                        <span>
                                            <img src="./dist/images/1user-img.png" />
                                        </span>
                                        <span>
                                            <img src="./dist/images/2user-img.png" />
                                        </span>
                                        <span className="pulus-user text-2xl text-white">
                                            +
                                        </span>
                                    </div>
                                    <div className="role-user flex justify-center mt-6">
                                        <button
                                            className="text-white items-center  rounded-full lg:px-4 sm:px-3 py-2 text-base sm:text-lg  text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                        >
                                            Edit Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-4">
                        <div className="bg-[#ECF0F1] p-4 rounded-lg h-full">
                            <div className="flex justify-between">
                                <div className="role-name">
                                    <p>Total 5 Users</p>
                                    <h3 className="text-2xl font-semibold my-2">
                                        Supplier Plan
                                    </h3>
                                    <p>A simple start for Everyone </p>
                                </div>
                                <div className="role-user ">
                                    <div className="role-user flex justify-center">
                                        <span>
                                            <img src="./dist/images/1user-img.png" />
                                        </span>
                                        <span>
                                            <img src="./dist/images/2user-img.png" />
                                        </span>
                                        <span className="pulus-user text-2xl text-white">
                                            +3
                                        </span>
                                    </div>
                                    <div className="role-user flex justify-center mt-6">
                                        <button
                                            className="text-white items-center  rounded-full lg:px-4 sm:px-3 py-2 text-base sm:text-lg  text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                        >
                                            Edit Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full mt-12">
                    <label
                        htmlFor="toogleA"
                        className="flex items-center cursor-pointer border border-blue-500 bg-blue-lighter p-4 rounded-full">
                        <div className="text-3xl font-semibold mr-5">
                            Start with a 14-day FREE trial!
                        </div>

                        <div className="relative">
                            <input id="toogleA" type="checkbox" className="sr-only" />

                            <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>

                            <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                        </div>
                    </label>
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
                                                    <label> Select Discount coupon Codes </label>
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
                                                                            <label> With coupon Codes </label>
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
                                                                                        <button className=" bg-primary text-white border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 mb-5 py-2 text-base sm:text-sm  hover:bg-white hover:text-primary  hover:shadow-lg hover:shadow-primary-500/50">
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
                                                                        <label> Without coupon Codes </label>
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
