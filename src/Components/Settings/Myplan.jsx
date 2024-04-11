import React from 'react'
import { useState } from 'react';
import { SlCalender } from 'react-icons/sl'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MdOutlineEdit, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import '../../Styles/Settings.css'
import { useSelector } from 'react-redux';
import { ADD_EDIT_TRIAL_PLAN, GET_ALL_PLANS, GET_TRIAL_PERIOD_DETAILS } from '../../Pages/Api';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { handleEditTrialPlan, handleGetAllPlans, handleGetTrialPlan } from '../../Redux/CommonSlice';
import { BsEyeFill } from 'react-icons/bs';
import ViewPlan from './ViewPlan';
import { GrPlan } from "react-icons/gr";
import TrialPlan from './TrialPlan';
const Myplan = () => {
    const { token, user } = useSelector((state) => state.root.auth);
    console.log('user', user)
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch()
    const [myplan, setmyPlan] = useState([]);
    const [Statusenabled, setStatusEnabled] = useState(false)
    const [planModel, showPlanModal] = useState(false);
    const [trialPlanModel, setTrialPlanModal] = useState(false);
    const [discoupon, setshowdiscoupon] = useState(false)
    const [discouponcodes, setshowcouponcodes] = useState(false)
    const [openView, setOpenView] = useState("")
    const [selectPlan, setSelectPlan] = useState("")
    const [trialData, setTrialData] = useState({
        trialDays: 14,
        isActive: true
    })
    const [trialDetails, setTrialDetails] = useState({
        trialDays: 14,
        isActive: true
    })


    const handleStatusToggle = (index) => {
        const updatedPlans = [...myplan];
        updatedPlans[index].statusEnabled = !updatedPlans[index].statusEnabled;
        setmyPlan(updatedPlans);
    };
    { /* Add new discount Model */ }

    const fetchAllPlan = () => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: GET_ALL_PLANS,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken
            },
        }
        dispatch(handleGetAllPlans({ config })).then((res) => {
            setmyPlan(res?.payload?.data)
        })
    }

    const fetchTrialDetails = () => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: GET_TRIAL_PERIOD_DETAILS,
            headers: {
                Authorization: authToken
            },
        }
        dispatch(handleGetTrialPlan({ config })).then((res) => {
            setTrialDetails(res?.payload?.data)
            setTrialData(res?.payload?.data)
        })
    }

    useEffect(() => {
        fetchAllPlan()
        fetchTrialDetails()
    }, [])

    const toggleModal = () => {
        setOpenView(!openView)
    }

    const handleSaveTrialPlan = () => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${ADD_EDIT_TRIAL_PLAN}?TrialDays=${trialData?.trialDays}&IsActive=${trialData?.isActive}`,
            headers: {
                Authorization: authToken,
            },
        }
        dispatch(handleEditTrialPlan({ config })).then((res) => {
            if (res?.payload?.status) {
                fetchTrialDetails()
                setTrialPlanModal(!trialPlanModel);
            }
        }).catch((error) => {
            console.log('error', error)
            setTrialPlanModal(!trialPlanModel);
        })
    }

    return (
        <>
            <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
                <div className="flex items-center justify-between mx-2 mb-5">
                    <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
                        Pricing Plans
                    </h1>
                    {user?.role === "1" && (
                        <div className="flex items-center gap-2">
                            <button
                                className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                onClick={() => setTrialPlanModal(!trialPlanModel)}
                            >
                                <GrPlan className="text-2xl mr-1" />
                                Trial Plan
                            </button>

                            <button
                                className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                onClick={() => showPlanModal(true)}
                            >
                                <SlCalender className="text-2xl mr-1" />
                                Add New Custom Plan
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap -mx-3 mb-8">
                    {myplan?.map((item) => {
                        return (
                            <div className="w-full md:w-1/3 px-3 mb-4">
                                <div className="bg-[#ECF0F1] p-4 rounded-lg h-full">
                                    <div className="flex justify-between">
                                        <div className="role-name">
                                            <p>Total 5 Users</p>
                                            <h3 className="text-2xl font-semibold my-2">
                                                {item?.planName}
                                            </h3>
                                            <p>A simple start for Everyone</p>
                                        </div>
                                        <div className="role-user ">
                                            {user?.role === "1" && (
                                                <div className="role-user flex justify-center">
                                                    <span>
                                                        <img src="./dist/images/1user-img.png" />
                                                    </span>
                                                    <span>
                                                        <img src="./dist/images/2user-img.png" />
                                                    </span>
                                                    <span className="pulus-user text-xl text-white">
                                                        +3
                                                    </span>
                                                </div>
                                            )}
                                            <div className="role-user flex justify-center mt-6 gap-2">
                                                {user?.role === "1" && (
                                                    <div
                                                        data-tip
                                                        data-for="Edit"
                                                        className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        <MdOutlineEdit />
                                                    </div>
                                                )}
                                                <div
                                                    data-tip
                                                    data-for="View"
                                                    className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={() => { setOpenView(true); setSelectPlan(item) }}
                                                >
                                                    <BsEyeFill />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
                {user?.role === "1" && (
                    <div className="flex items-center justify-center w-full mt-12">
                        <label
                            htmlFor="toogleA"
                            className="flex items-center justify-between cursor-pointer border border-blue-500 bg-blue-lighter py-3 px-8 rounded-full">
                            <div className="text-2xl font-semibold mr-4">
                                Start with a {trialDetails?.trialDays}-days FREE trial!
                            </div>

                            
                                <div className="relative flex items-center justify-center cursor-not-allowed ">
                                    <input
                                        type="checkbox"
                                        checked={trialDetails?.isActive}
                                        className="sr-only peer"
                                        disabled

                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                </div>
                            
                        </label>
                    </div>
                )}
            </div>
            {planModel && (
                <>
                    <div className="backdrop">
                        <div className="user-model">

                            <div className="hours-heading flex justify-between items-center p-5 border-b border-gray sticky top-0 shadow-md z-[99] bg-white">
                                <h1 className='text-lg font-medium text-primary'>Add New Custom Plan</h1>
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
                                    </div>
                                </div>
                                <div className='col-span-12 text-center'>
                                    <button className='bg-white text-primary text-base px-8 py-3 border border-primary shadow-md rounded-full hover:bg-primary hover:text-white'>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {openView && (
                <ViewPlan toggleModal={toggleModal} selectPlan={selectPlan} />
            )}
            {trialPlanModel && (
                <TrialPlan setTrialPlanModal={setTrialPlanModal} trialPlanModel={trialPlanModel} handleSaveTrialPlan={handleSaveTrialPlan} setTrialData={setTrialData} trialData={trialData} />
            )}
        </>
    )
}

export default Myplan
