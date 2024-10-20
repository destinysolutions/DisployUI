import React from 'react'
import { useState } from 'react';
import { SlCalender } from 'react-icons/sl'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MdOutlineEdit, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import '../../Styles/Settings.css'
import { useSelector } from 'react-redux';
import { ADD_EDIT_TRIAL_PLAN, GET_ALL_FEATURE_LIST, GET_ALL_PLANS, GET_TRIAL_PERIOD_DETAILS } from '../../Pages/Api';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { handleAllFeatureList, handleEditTrialPlan, handleGetAllPlans, handleGetTrialPlan } from '../../Redux/CommonSlice';
import { BsEyeFill } from 'react-icons/bs';
import ViewPlan from './ViewPlan';
import { GrPlan } from "react-icons/gr";
import TrialPlan from './TrialPlan';
import AddEditPlan from './AddEditPlan';
import { Switch } from "@material-tailwind/react";
import PurchaseUserPlan from '../Common/PurchaseUserPlan';
import ReactTooltip from 'react-tooltip';
import { handleGetUserDetails } from '../../Redux/Authslice';
import toast from 'react-hot-toast';
import TalkToSaleDialog from '../Common/TalkToSaleDialog';
import { formatINRCurrency, formatToUSCurrency } from '../Common/Common';

const Myplan = () => {
    const { token, user, userDetails } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch()
    const [myplan, setmyPlan] = useState([]);
    const [planModel, showPlanModal] = useState(false);
    const [trialPlanModel, setTrialPlanModal] = useState(false);
    const [discoupon, setshowdiscoupon] = useState(false)
    const [discouponcodes, setshowcouponcodes] = useState(false)
    const [openView, setOpenView] = useState("")
    const [selectPlan, setSelectPlan] = useState("")
    const [featureList, setFeatureList] = useState([]);
    const [heading, setHeading] = useState("Add")
    const [loading, setLoading] = useState(true)
    const [trialData, setTrialData] = useState({
        trialDays: 14,
        isActive: true
    })
    const [purchasePlan, setPurchasePlan] = useState(false)
    const [trialDetails, setTrialDetails] = useState({
        trialDays: 14,
        isActive: true
    })
    const [TalkToSale, setTalkToSale] = useState(false)
    const [Monthlyplan, setMonthlyplan] = useState('Annually');
    const [CountryType, setCountryType] = useState({
        India: true, Other: false
    });
    const handleButtonClick = (buttonType) => {
        setCountryType(prevState => ({
            ...prevState,
            India: buttonType === 'India',
            Other: buttonType === 'Other'
        }));
    };
    const GetFeatureList = () => {
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: GET_ALL_FEATURE_LIST,
            headers: {
                Authorization: authToken,
            },
        };
        dispatch(handleAllFeatureList({ config })).then((res) => {
            if (res?.payload?.status === 200) {
                setFeatureList(res?.payload?.data)
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const handleStatusToggle = (index) => {
        const updatedPlans = [...myplan];
        updatedPlans[index].statusEnabled = !updatedPlans[index].statusEnabled;
        setmyPlan(updatedPlans);
    };

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
        if (user?.role !== "1") {
            dispatch(handleGetUserDetails({ id: user?.userID, token }));
        }
        dispatch(handleGetAllPlans({ config })).then((res) => {
            if (res?.payload?.status === 200) {
                setmyPlan(res?.payload?.data)
                setLoading(false)
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const fetchTrialDetails = ({ add }) => {
        if (add === "add") {
            toast.loading("Fetching data..")
        }
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: GET_TRIAL_PERIOD_DETAILS,
            headers: {
                Authorization: authToken
            },
        }
        dispatch(handleGetTrialPlan({ config })).then((res) => {
            if (res?.payload?.status) {
                setTrialDetails(res?.payload?.data)
                setTrialData(res?.payload?.data)
                if (add === "add") {
                    setTrialPlanModal(!trialPlanModel)
                }
                toast.remove()
            }
        }).catch((error) => {
            console.log('error', error)
            toast.remove()
        })
    }

    useEffect(() => {
        fetchAllPlan()
        fetchTrialDetails({ add: "" })
        GetFeatureList()
    }, [])

    const toggleModal = () => {
        setOpenView(!openView)
        setSelectPlan("")
    }

    const handleSaveTrialPlan = () => {
        if (trialData?.trialDays < 0) {
            toast.error("Please Enter Proper Trial Days")
            return;
        }
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
                fetchTrialDetails({ add: "" })
                setTrialPlanModal(!trialPlanModel);
            }
        }).catch((error) => {
            console.log('error', error)
            setTrialPlanModal(!trialPlanModel);
        })
    }

    const handleAddPlan = () => {
        showPlanModal(true)
    }

    return (
        <>
            <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2 w-full h-full'>
                <div className="flex items-center justify-between mx-2 mb-5 border-b border-b-[#E4E6FF] pb-3">
                    <div className='w-full '>
                        <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
                            Pricing Plans
                        </h1>
                    </div>

                    {user?.role === "1" && (

                        <div className="flex items-center justify-end gap-2 w-full lg:w-2/3 ">
                            <button
                                className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                onClick={() => {
                                    fetchTrialDetails({ add: "add" })
                                }}
                            >
                                <GrPlan className="text-2xl mr-1" />
                                Trial Plan
                            </button>

                            <button
                                className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                onClick={() => {
                                    setHeading("Add")
                                    handleAddPlan()
                                }}
                            >
                                <SlCalender className="text-2xl mr-1" />
                                Add New Custom Plan
                            </button>
                        </div>
                    )}
                </div>
                <div className='flex justify-center items-center gap-3 my-4'>
                    <button
                        className={`relative group text-base font-semibold flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:shadow-lg  gap-1 
                                        ${CountryType.India ? 'bg-primary text-white' : ''}
                                            `}
                        onClick={() => handleButtonClick('India')}
                    >India
                    </button>
                    <button
                        className={`relative group text-base font-semibold flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:shadow-lg  gap-1 
                                        ${CountryType.Other ? 'bg-primary text-white' : ''}
                                            `}
                        onClick={() => handleButtonClick('Other')}

                    >
                        Other
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </button>
                </div>
                <div className="flex justify-center my-2">
                    <div className="ml-2 flex items-center">
                        <input
                            type="radio"
                            value={Monthlyplan === 'Monthly'}
                            checked={Monthlyplan === 'Monthly'}
                            name="Cel"
                            id='Monthly'
                            onChange={() => {
                                setMonthlyplan('Monthly');
                            }}
                        />
                        <label for='Monthly' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs font-semibold">
                            Monthly
                        </label>
                    </div>
                    <div className="ml-3 flex items-center">
                        <input
                            id='Annually'
                            type="radio"
                            value={Monthlyplan === 'Annually'}
                            checked={Monthlyplan === 'Annually'}
                            name="Cel"
                            onChange={() => {
                                setMonthlyplan('Annually');
                            }}
                        />
                        <label for='Annually' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs font-semibold">
                            Annually
                        </label>
                    </div>
                </div>
                {loading && (
                    <div className="flex text-center m-5 justify-center items-center">
                        <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="#1C64F2"
                            />
                        </svg>

                    </div>
                )}
                {!loading && (
                    <>
                        <div className="flex flex-wrap mb-8 pl-10">
                            {myplan
                                ?.filter((item) => item?.isAnnually ? Monthlyplan === 'Annually' : Monthlyplan === 'Monthly')
                                ?.filter((item) => item?.isIndian ? CountryType?.India : CountryType?.Other)
                                ?.map((item) => {
                                    return (
                                        <>
                                            {user?.role !== "1" && userDetails?.planID === item?.listOfPlansID && (
                                                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 ml-5 mb-2">
                                                    <div className="p-4 rounded-lg h-full">
                                                        <div className="flex justify-between mb-4">
                                                            <div className="role-name">
                                                                {/*{user?.role === "1" && (
                                                                <p>Total 5 Users</p>
                                                            )}*/}
                                                                <h3 className="text-2xl font-semibold my-2">
                                                                    {item?.planName}

                                                                </h3>
                                                                <p>{item?.planDetailss}</p>

                                                            </div>
                                                            <div>
                                                                <div className="role-user flex justify-center items-end my-2">
                                                                    ${item?.planPrice} per screen /mo
                                                                    + VAT
                                                                </div>


                                                                <div className="flex justify-center mt-3 gap-2">
                                                                    {user?.role === "1" && (
                                                                        <div
                                                                            data-tip
                                                                            data-for="Edit"
                                                                            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                            onClick={() => {
                                                                                setSelectPlan(item)
                                                                                setHeading("Update")
                                                                                handleAddPlan()
                                                                            }}
                                                                        >
                                                                            <MdOutlineEdit />
                                                                            <ReactTooltip
                                                                                id="Edit"
                                                                                place="bottom"
                                                                                type="warning"
                                                                                effect="solid"
                                                                            >
                                                                                <span>Edit</span>
                                                                            </ReactTooltip>
                                                                        </div>
                                                                    )}
                                                                    <div
                                                                        data-tip
                                                                        data-for="View"
                                                                        className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                        onClick={() => { setOpenView(true); setSelectPlan(item) }}
                                                                    >
                                                                        <BsEyeFill />
                                                                        <ReactTooltip
                                                                            id="View"
                                                                            place="bottom"
                                                                            type="warning"
                                                                            effect="solid"
                                                                        >
                                                                            <span>View</span>
                                                                        </ReactTooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {user?.role !== "1" && userDetails?.planID === item?.listOfPlansID && (
                                                            <div className='w-full'>
                                                                <button
                                                                    type="button"
                                                                    className="flex items-center cursor-pointer text-primary text-base hover:text-SlateBlue underline"
                                                                    onClick={() => {
                                                                        setSelectPlan(item)
                                                                        setPurchasePlan(true)
                                                                    }}
                                                                >
                                                                    <span>Upgrade Plan</span>
                                                                    <i className='ml-2'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                                        </svg>
                                                                    </i>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {(user?.role === "1" || userDetails?.planID === 0) && (
                                                <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 px-3 mb-4">
                                                    <div className="p-4 bg-[#ECF0F1] rounded-lg h-full">
                                                        <div className="flex justify-between mb-4">
                                                            <div className="role-name">
                                                                {/*{user?.role === "1" && (
                                                                <p>Total 5 Users</p>
                                                            )}*/}
                                                                <h3 className="text-2xl font-semibold my-2 ">
                                                                    {item?.planName}

                                                                    {/* <span className='font-medium text-lg text-gray-600 ml-2'>{item?.isAnnually ? "(Annually)" : "(Monthly)"}</span> */}
                                                                </h3>
                                                                {item?.listOfPlansID !== 4 && (
                                                                    <div className="role-user flex justify-start items-end my-2">
                                                                        {item?.isIndian ? formatINRCurrency(item?.planPrice) : formatToUSCurrency(item?.planPrice)}
                                                                        per screen /mo + VAT
                                                                    </div>
                                                                )}
                                                                <p>{item?.planDetailss}</p>
                                                                {item?.listOfPlansID === 4 && (
                                                                    <div className="pricing-amount font-semibold flex items-center justify-start flex-wrap mt-2">
                                                                        <p>Call us at:</p>
                                                                        <p>+1 224 244 9969</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="flex justify-center  gap-2">
                                                                    {user?.role === "1" && (
                                                                        <div
                                                                            data-tip
                                                                            data-for="Edit"
                                                                            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                            onClick={() => {
                                                                                setSelectPlan(item)
                                                                                setHeading("Update")
                                                                                handleAddPlan()
                                                                            }}
                                                                        >
                                                                            <MdOutlineEdit />
                                                                            <ReactTooltip
                                                                                id="Edit"
                                                                                place="bottom"
                                                                                type="warning"
                                                                                effect="solid"
                                                                            >
                                                                                <span>Edit</span>
                                                                            </ReactTooltip>
                                                                        </div>
                                                                    )}
                                                                    <div
                                                                        data-tip
                                                                        data-for="View"
                                                                        className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                        onClick={() => { setOpenView(true); setSelectPlan(item) }}
                                                                    >
                                                                        <BsEyeFill />
                                                                        <ReactTooltip
                                                                            id="View"
                                                                            place="bottom"
                                                                            type="warning"
                                                                            effect="solid"
                                                                        >
                                                                            <span>View</span>
                                                                        </ReactTooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {user?.role !== "1" && userDetails?.planID === item?.listOfPlansID && (
                                                            <div className='w-full'>
                                                                <button
                                                                    type="button"
                                                                    className="flex items-center cursor-pointer text-primary text-base hover:text-SlateBlue underline"
                                                                    onClick={() => {
                                                                        setSelectPlan(item)
                                                                        setPurchasePlan(true)
                                                                    }}
                                                                >
                                                                    <span>Upgrade Plan</span>
                                                                    <i className='ml-2'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                                        </svg>
                                                                    </i>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {user?.role !== "1" && userDetails?.planID !== item?.listOfPlansID && !(item?.listOfPlansID === 4 || item?.listOfPlansID === 15 || item?.listOfPlansID === 19 || item?.listOfPlansID === 11) && (
                                                            <div className='w-full'>
                                                                <button
                                                                    className={`relative bg-primary text-white text-base font-semibold flex  border-primary items-center float-left border rounded-full lg:px-3 py-1 text-base sm:text-sm  hover:shadow-lg mb-3  `}
                                                                    onClick={() => {
                                                                        setSelectPlan(item)
                                                                        setPurchasePlan(true)
                                                                    }}
                                                                >
                                                                    Buy Plan
                                                                </button>

                                                            </div>
                                                        )}
                                                        {user?.role !== "1" && userDetails?.planID !== item?.listOfPlansID && (item?.listOfPlansID === 4 || item?.listOfPlansID === 15 || item?.listOfPlansID === 19 || item?.listOfPlansID === 11) && (
                                                            <div className='w-full'>
                                                                <button
                                                                    className={`relative bg-primary text-white text-base font-semibold flex  border-primary items-center float-left border rounded-full lg:px-3 py-1 text-base sm:text-sm  hover:shadow-lg mb-3  `}
                                                                    onClick={() => {
                                                                        setSelectPlan(item)
                                                                        setTalkToSale(true)

                                                                    }}
                                                                >
                                                                    Talk to Sale
                                                                </button>

                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )
                                })}

                        </div>
                        {user?.role === "1" && (
                            <div className="flex items-center justify-center w-full mt-12">
                                <div
                                    htmlFor="toogleA"
                                    className="flex items-center cursor-pointer border border-blue-500 bg-blue-lighter p-4 rounded-full">
                                    <div className="text-2xl font-semibold mr-5">
                                        Start with a {trialDetails?.trialDays}-days FREE trial!
                                    </div>

                                    <div className="relative flex">
                                        <label className="relative inline-flex items-center cursor-not-allowed">
                                            <input
                                                type="checkbox"
                                                checked={trialDetails?.isActive}
                                                className="sr-only peer"
                                                disabled
                                                id="toggle"
                                            />
                                            <div className="flex items-center relative bg-[#e8eced] border border-blue-700 w-12 h-7 rounded-full before:absolute before:bg-rose-700 before:w-5 before:h-5 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-6 peer-checked:before:bg-green"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {planModel && (
                <AddEditPlan showPlanModal={showPlanModal} featureList={featureList} selectPlan={selectPlan} setSelectPlan={setSelectPlan} heading={heading} fetchAllPlan={fetchAllPlan} />
            )}
            {openView && (
                <ViewPlan toggleModal={toggleModal} selectPlan={selectPlan} />
            )}
            {trialPlanModel && (
                <TrialPlan setTrialPlanModal={setTrialPlanModal} trialPlanModel={trialPlanModel} handleSaveTrialPlan={handleSaveTrialPlan} setTrialData={setTrialData} trialData={trialData} />
            )}
            {purchasePlan && (
                <PurchaseUserPlan setPurchasePlan={setPurchasePlan} purchasePlan={purchasePlan} selectPlan={selectPlan} setSelectPlan={setSelectPlan} userPlanType="" myplan={myplan} />
            )}
            {TalkToSale && (
                <TalkToSaleDialog setTalkToSale={setTalkToSale} TalkToSale={TalkToSale} />
            )}
        </>
    )
}

export default Myplan
