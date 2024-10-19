import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { PAYMENT_INTENT_CREATE_REQUEST, VERIFY_COUPON, stripePromise } from '../../Pages/Api';
import { handlePaymentIntegration } from '../../Redux/PaymentSlice';
import { verifyDiscountCoupon } from '../../Redux/AdminSettingSlice';
import { useDispatch } from 'react-redux';
import PlanPurchaseModel from './PlanPurchaseModel';
import { Elements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import TalkToSaleDialog from './TalkToSaleDialog';
import PurchasePlan from '../Screen/PurchasePlan';
import UpgradePlan from '../Screen/UpgradePlan';

const PurchaseUserPlan = ({ setPurchasePlan, purchasePlan, selectPlan, userPlanType, myplan, setSelectPlan }) => {
    const dispatch = useDispatch();
    const timeZoneName = new Date().toLocaleDateString(undefined, { day: "2-digit", timeZoneName: "long", }).substring(4)
    const { token, user, userDetails } = useSelector((state) => state.root.auth);
    const [Screen, setScreen] = useState(1);
    const [showDiscount, setShowDiscount] = useState(false);
    const [showError, setShowError] = useState(false)
    const [discountCoupon, setDiscountCoupon] = useState("")
    const [clientSecret, setClientSecret] = useState("");
    const [openPayment, setOpenPayment] = useState(false)
    const [TalkToSale, setTalkToSale] = useState(false)
    const [purchaseType, setPurchaseType] = useState("")
    const [buyPlan, setBuyPlan] = useState(false)
    const [upgradePlan, setUpgradePlan] = useState(false)
    const [CountryType, setCountryType] = useState({
        India: true, Other: false
    });
    const [Monthlyplan, setMonthlyplan] = useState('Monthly');
    const TotalPrice = Screen <= 1 ? selectPlan?.planPrice : ((Screen * selectPlan?.planPrice))

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    const handleCreate = () => {
        const TimeZone = new Date()
        .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
        })
        .substring(4);
        const params = {
            "items": {
                "id": "0",
                "amount": (TotalPrice * 100)
            },
            "Currency": TimeZone?.includes("India") ? "inr" : "usd"
        }

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: PAYMENT_INTENT_CREATE_REQUEST,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(params),
        }

        dispatch(handlePaymentIntegration({ config })).then((res) => {
            setClientSecret(res?.payload?.clientSecret)
            setPurchaseType("Upgrade")
            setOpenPayment(true)
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const handleVerify = () => {

        const Params = {

        };

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: VERIFY_COUPON,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(Params),
        };
        dispatch(verifyDiscountCoupon({ config })).then((res) => {
            if (res?.payload?.status) {
                setShowError(false)
            } else {
                setShowError(true)
            }
        }).catch((error) => {
            console.log('error', error)
            setShowError(false)
        })
    }

    const handleButtonClick = (buttonType) => {
        setCountryType(prevState => ({
            ...prevState,
            India: buttonType === 'India',
            Other: buttonType === 'Other'
        }));
    };


    // console.log('myplan :>> ', myplan);
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    {/* <div className="modal">
                   <div className="relative p-4 lg:w-[500px] md:w-[500px] sm:w-full max-h-full">
                        
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            
                            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Purchase Plan
                                </h3>
                                <AiOutlineCloseCircle
                                    className="text-4xl text-primary cursor-pointer"
                                    onClick={() => setPurchasePlan(!purchasePlan)}
                                />
                            </div>
                            <div className="p-4 md:p-5">
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col border-b border-gray'>
                                        <div className='flex flex-row items-center justify-between mb-4'>
                                            <h2 className='font-medium text-xl'>
                                                {selectPlan?.planName} - 1 Month Plan
                                            </h2>
                                            <span className='font-medium text-xl'>
                                                ${selectPlan?.planPrice}
                                            </span>
                                        </div>
                                        <div className='flex flex-row items-center justify-between mb-4'>
                                            <h2 className='flex flex-row items-center gap-2'>
                                                <p>Screen</p>
                                            </h2>
                                            <span className='font-medium text-xl'>
                                                <input type='number'
                                                    className="relative border border-black rounded-md p-2 w-20"
                                                    placeholder='1'
                                                    value={Screen}
                                                    onChange={(e) => {
                                                        if (e.target.value <= 0) {
                                                            setScreen(Screen)
                                                        } else {
                                                            setScreen(e.target.value)
                                                        }
                                                    }
                                                    }
                                                />
                                            </span>
                                        </div>
                                        {Screen > 1 && (
                                            <div className='flex flex-row items-center justify-between mb-4'>
                                                <h2 className='flex flex-row items-center gap-2'>
                                                    <p>Purchase Screen Price</p>
                                                </h2>
                                                <span className='font-medium text-xl'>
                                                    ${(Screen * selectPlan?.planPrice) - selectPlan?.planPrice}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className='border-b border-gray'>
                                        <div className='flex flex-row items-center justify-between mb-4 mt-2'>
                                            <h2 className='font-semibold text-xl'>
                                                Total
                                            </h2>
                                            <p className='font-semibold text-xl'>
                                                ${TotalPrice}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-start py-3'>
                                        <h1 className='cursor-pointer hover:underline' onClick={() => setShowDiscount(!showDiscount)}>Have a coupon code?</h1>
                                    </div>
                                    {showDiscount && (
                                        <>
                                            <div className='flex items-center justify-between mb-2'>
                                                <div className='flex items-center gap-5'>
                                                    <input
                                                        type='text'
                                                        placeholder='Discount Coupon'
                                                        className="relative border border-black rounded-md p-2 w-48"
                                                        onChange={(e) => setDiscountCoupon(e.target.value)}
                                                        value={discountCoupon}
                                                    />
                                                    <button
                                                        className={text-white text-base px-5 py-2 border bg-SlateBlue shadow-md rounded-full ${discountCoupon?.length === 0 ? "cursor-not-allowed" : "cursor-pointer"}}
                                                        type="button"
                                                        disabled={discountCoupon?.length === 0}
                                                        onClick={() => handleVerify()}
                                                    >
                                                        Verify
                                                    </button>
                                                </div>
                                            </div>
                                            {showError && (
                                                <span className='error mt-[-10px]'>Coupon is invalid.</span>
                                            )}
                                        </>
                                    )}

                                    <div className="w-full h-full border-t border-gray">
                                        <div className="flex justify-end pt-4 h-full items-end">
                                            <button
                                                className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                                onClick={() => handleCreate()}
                                                type="submit"
                                            >
                                                Submit Secure Payment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                            </div>
                </div>*/}

                    <div className="modal p-4 lg:w-[1200px] md:w-[900px] sm:w-full max-h-full">

                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-300">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Purchase Plan
                                </h3>
                                <AiOutlineCloseCircle
                                    className="text-4xl text-primary cursor-pointer"
                                    onClick={() => setPurchasePlan(!purchasePlan)}
                                />
                            </div>
                            {/* <div className='flex justify-center items-center gap-3 mt-4'>
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
                            </div> */}
                            <div className="  max-h-[700px] p-5 ">
                                <div className=' border border-gray-300 rounded-lg p-2 '>
                                    <div className="flex justify-center my-2">
                                        <div className="ml-2 flex items-center">
                                            <input
                                                type="radio"
                                                value={Monthlyplan === 'Monthly'}
                                                checked={Monthlyplan === 'Monthly'}
                                                name="Monthly"
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
                                                name="Annually"
                                                onChange={() => {
                                                    setMonthlyplan('Annually');
                                                }}
                                            />
                                            <label for='Annually' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs font-semibold">
                                                Annually
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex flex-wrap vertical-scroll-inner max-h-[570px]'>
                                        {myplan
                                            ?.filter((item) => item?.isAnnually ? Monthlyplan === 'Annually' : Monthlyplan === 'Monthly')
                                            ?.filter((item) => timeZoneName === 'India Standard Time' ? item?.isIndian === true : item?.isIndian === false)
                                            ?.map((item) => {
                                                return (
                                                    <div className='w-full md:w-1/2 lg:w-1/4 xl:w-1/4 px-3 mb-4'>
                                                        <div className="h-full pricing-plan border-t-4 border-solid border-white bg-white text-center max-w-sm mx-auto hover:border-blue-700 transition-colors duration-300">
                                                            <div className="p-6">
                                                                <h4 className="font-medium leading-tight text-2xl mb-3">{item?.planName}</h4>
                                                                <p className="text-gray-600 text-sm">{item?.planDetailss}</p>
                                                            </div>
                                                            {!(item?.listOfPlansID === 4 || item?.listOfPlansID === 15 || item?.listOfPlansID === 19 || item?.listOfPlansID === 11) && (
                                                                <div className="pricing-amount bg-indigo-100 p-4 h-24">
                                                                    <p className="text-left">From</p>
                                                                    <div className="flex items-center justify-start">
                                                                        <span className="text-2xl font-semibold mr-2 mr-2">{timeZoneName === 'India Standard Time' ? "₹" : '$'} {item?.planPrice}</span>
                                                                        <span className="text-left leading-5">per screen /mo <br />+ VAT</span>
                                                                    </div>
                                                                </div>
                                                            )}



                                                            {(item?.listOfPlansID === 4 || item?.listOfPlansID === 15 || item?.listOfPlansID === 19 || item?.listOfPlansID === 11) && (
                                                                <div className="pricing-amount bg-indigo-100 p-4 h-24 flex items-center justify-start flex-wrap">
                                                                    <p>Call us at:</p>
                                                                    <p>+1 224 244 9969</p>
                                                                </div>
                                                            )}

                                                            {/* <div className='w-full border-b border-gray-300 py-3'>
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
                                                </div> */}
                                                            <div className="p-4">
                                                                {(item?.listOfPlansID === 1 || item?.listOfPlansID === 12 || item?.listOfPlansID === 16 || item?.listOfPlansID === 8) && (
                                                                    <ul className="leading-loose">
                                                                        <li>Total Storage :- 500 MB</li>
                                                                        <li>Advance Scheduling</li>
                                                                        <li>Screen Grouping</li>
                                                                        <li>Screen Management</li>
                                                                        <li>Support</li>
                                                                    </ul>
                                                                )}
                                                                {(item?.listOfPlansID === 2 || item?.listOfPlansID === 13 || item?.listOfPlansID === 17 || item?.listOfPlansID === 9) && (
                                                                    <ul className="leading-loose">
                                                                        <li>Total Storage :- 1 GB</li>
                                                                        <li>Apps (100+ app access)</li>
                                                                        <li>User Audit logs</li>
                                                                        <li>Merge Screen</li>
                                                                        <li>Multilevel Approval</li>
                                                                    </ul>
                                                                )}
                                                                {(item?.listOfPlansID === 3 || item?.listOfPlansID === 14 || item?.listOfPlansID === 18 || item?.listOfPlansID === 10) && (
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
                                                                        {/* <li>Total Storage :- 5 GB</li>
                                                                <li>Unlimited Users</li>
                                                                <li>User ROLE Permissions</li>
                                                                <li>Composition</li>
                                                                <li>Multilevel Approval</li> */}
                                                                    </ul>
                                                                )}
                                                                <div className="pt-4">
                                                                    {userDetails?.isActivePlan && userDetails?.planID === item?.listOfPlansID && (
                                                                        <button className="bg-blue-700 cursor-not-allowed hover:bg-blue-800 text-xl text-white py-2 px-6 rounded-full transition-colors duration-300">Subscribed</button>
                                                                    )}
                                                                    {userDetails?.isActivePlan && userDetails?.planID !== item?.listOfPlansID && !(item?.listOfPlansID === 4 || item?.listOfPlansID === 15 || item?.listOfPlansID === 19 || item?.listOfPlansID === 11) && (
                                                                        <button
                                                                            className="bg-blue-700 hover:bg-blue-800 text-xl text-white py-2 px-6 rounded-full transition-colors duration-300"
                                                                            onClick={() => {
                                                                                setSelectPlan(item)
                                                                                setPurchaseType("Upgrade")
                                                                                setUpgradePlan(true)
                                                                                // handleCreate()
                                                                            }}
                                                                        >
                                                                            {userDetails?.planID < item?.listOfPlansID ? "Upgrade Plan" : "Downgrade Plan"}
                                                                        </button>
                                                                    )}
                                                                    {!userDetails?.isActivePlan && !(item?.listOfPlansID === 4 || item?.listOfPlansID === 15 || item?.listOfPlansID === 19 || item?.listOfPlansID === 11) && (
                                                                        <button
                                                                            className="bg-blue-700 hover:bg-blue-800 text-xl text-white py-2 px-6 rounded-full transition-colors duration-300"
                                                                            onClick={() => {
                                                                                setSelectPlan(item)
                                                                                setBuyPlan(true)
                                                                            }}
                                                                        >
                                                                            Buy Plan
                                                                        </button>
                                                                    )}
                                                                    {userDetails?.planID !== item?.listOfPlansID && (item?.listOfPlansID === 4 || item?.listOfPlansID === 15 || item?.listOfPlansID === 19 || item?.listOfPlansID === 11) && (
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
            </div>
            {openPayment && clientSecret && (
                <div className="lg:w-[600px] md:w-[600px] w-full h-[30vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg flex items-center justify-center">
                    <>
                        <Elements options={options} stripe={stripePromise}>
                            <PlanPurchaseModel selectPlan={selectPlan} discountCoupon={discountCoupon} clientSecret={clientSecret} Screen={Screen} openPayment={openPayment} setOpenPayment={setOpenPayment} userPlanType={userPlanType} purchaseType={purchaseType} />
                        </Elements>
                    </>
                </div>
            )}
            {TalkToSale && (
                <TalkToSaleDialog setTalkToSale={setTalkToSale} TalkToSale={TalkToSale} />
            )}
            {buyPlan && (
                <PurchasePlan buyPlan={buyPlan} setBuyPlan={setBuyPlan} selectPlan={selectPlan} />
            )}

            {upgradePlan && (
                <UpgradePlan upgradePlan={upgradePlan} setUpgradePlan={setUpgradePlan} selectPlan={selectPlan} userPlanType={userPlanType} purchaseType={purchaseType} Screen={Screen} />
            )}
        </>
    )
}

export default PurchaseUserPlan
