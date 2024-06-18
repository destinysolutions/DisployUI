import { round } from 'lodash';
import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { GET_ALL_PLANS, VERIFY_COUPON } from '../../Pages/Api';
import { useSelector } from 'react-redux';
import { verifyDiscountCoupon } from '../../Redux/AdminSettingSlice';
import { useDispatch } from 'react-redux';
import SubscriptionTerm from '../Common/PurchasePlan/SubscriptionTerm'
import { handleGetAllPlans } from '../../Redux/CommonSlice';

const NavbarPurchase = ({ openScreen, setOpenScreen, setAddScreen, addScreen, handlePay, discountCoupon, setDiscountCoupon, showError, setShowError, setDiscount, discount }) => {
    const { user, token, userDetails } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch()
    const [showDiscount, setShowDiscount] = useState(false);
    const [disclaimer, setDisclaimer] = useState(false);
    const [isRead, setIsRead] = useState(false)
    const [plan, setPlan] = useState({})

    useEffect(() => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${GET_ALL_PLANS}?PlanID=${userDetails?.planID}`,
            headers: {
            },
        }
        dispatch(handleGetAllPlans({ config })).then((res) => {
            setPlan(res?.payload?.data)
        })
    }, [])

    const handleVerify = () => {
        const Params = {
            "discountCode": discountCoupon,
            "featureKey": "Screen",
            "currentDate": new Date().toISOString().split('T')[0],
            "amount": round((addScreen * plan?.planPrice), 2),
            "items": addScreen
        }

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: VERIFY_COUPON,
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
            data: JSON.stringify(Params),
        };
        dispatch(verifyDiscountCoupon({ config })).then((res) => {
            if (res?.payload?.status) {
                setDiscount(res?.payload?.data)
                setShowError(false)
            } else {
                setShowError(true)
            }
        }).catch((error) => {
            console.log('error', error)
            setShowError(false)
        })
    }

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    <div className="modal p-4 lg:w-[800px] md:w-[600px] sm:w-full max-h-full">
                        <div className="relative w-full p-5">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-300">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        New Screen Purchase
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => {
                                            setOpenScreen(!openScreen);
                                        }}
                                    />
                                </div>
                                <div className="flex justify-center p-4">
                                    <div className="w-full h-full">
                                        <div className="w-full rounded-lg bg-gray-100 border border-slate-200 p-4">
                                            <div className='flex flex-col mb-5'>
                                                <div className='flex items-center justify-between pb-3'>
                                                    <p>Total number of screens required:</p>
                                                    <div className='flex items-center gap-1 ml-6'>
                                                        <input type='number'
                                                            className="relative border border-black rounded-md p-2 w-24"
                                                            onChange={(e) => {
                                                                // if (e.target.value <= 0) {
                                                                //     setAddScreen(addScreen)
                                                                // } else {
                                                                setAddScreen(e.target.value)
                                                                // }
                                                            }
                                                            }
                                                            value={addScreen}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between border-t border-gray-200 py-3'>
                                                    <p>Cost/Screen/Month:</p>
                                                    <div className='flex items-center gap-1'>
                                                        <label>${round((addScreen * plan?.planPrice), 2)}</label>
                                                    </div>
                                                </div>
                                                {discount && (
                                                    <div className='flex items-center justify-between border-t border-gray-200 py-3'>
                                                        <p>Discount:</p>
                                                        <div className='flex items-center gap-1'>
                                                            <label>${discount}</label>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className='flex justify-between items-center border-t border-gray-200 py-3'>
                                                    <div className='mt-3'>
                                                        <label>Total Price:</label>
                                                    </div>
                                                    <div>
                                                        <label>${round((addScreen * plan?.planPrice), 2) - discount}</label>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-start border-t border-gray-200 py-3'>
                                                    <h1 className='cursor-pointer hover:underline' onClick={() => setShowDiscount(!showDiscount)}>Have a coupon code?</h1>
                                                </div>
                                                {showDiscount && (
                                                    <>
                                                        <div className='flex items-center justify-between pb-5'>
                                                            <div className='flex items-center gap-5'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='Discount Coupon'
                                                                    className="relative border border-black rounded-md p-2 w-48"
                                                                    onChange={(e) => setDiscountCoupon(e.target.value.toUpperCase())}
                                                                    value={discountCoupon}
                                                                />
                                                                <button
                                                                    className={`bg-primary text-white text-base px-5 py-2 border border-primary shadow-md rounded-full ${discountCoupon?.length === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                                    type="button"
                                                                    disabled={discountCoupon?.length === 0}
                                                                    onClick={() => handleVerify()}
                                                                >
                                                                    Apply
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {showError && (
                                                            <span className='error mt-[-10px]'>Coupon is invalid.</span>
                                                        )}
                                                    </>
                                                )}

                                            </div>

                                            <div className="flex items-center justify-between py-3 border-t border-gray-200">
                                                <p className="text-xs text-gray-500 leading-4">Your trial period has not yet expired. Would you like to use the remaining trial days or begin your subscription today?</p>

                                                <label for="toggleThree" className="flex items-center cursor-pointer select-none text-dark dark:text-white">
                                                    <div className="relative">
                                                        <input type="checkbox" id="toggleThree" className="peer sr-only" />
                                                        <div className="block h-8 rounded-full bg-gray-300 w-14"></div>
                                                        <div className="absolute flex items-center justify-center w-6 h-6 transition bg-red-500 bg-[#FF0000] rounded-full dot left-1 top-1 peer-checked:translate-x-full peer-checked:bg-green"></div>
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between py-3 border-t border-gray-200">
                                                <div className="flex items-center space-x-3">
                                                    <input type="checkbox" className="border-gray-300 rounded h-5 w-5 cursor-pointer" onChange={() => setDisclaimer(!disclaimer)} checked={disclaimer} />
                                                    <p className="text-xs text-gray-500 leading-4"><b>Disclaimer: </b> Monthly Subscription Charges</p>
                                                </div>
                                                <a className='underline font-medium cursor-pointer' onClick={() => setIsRead(!isRead)}>Read More</a>
                                            </div>

                                            <div className="flex items-center justify-center pt-3 border-t border-gray-200 rounded-b gap-2">
                                                <button
                                                    className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                                    type="button"
                                                    onClick={() => setOpenScreen(!openScreen)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={`bg-primary ${(disclaimer && addScreen) ? "cursor-pointer" : "cursor-not-allowed"} text-white text-base px-8 py-3 border border-primary shadow-md rounded-full`}
                                                    type="button"
                                                    disabled={(!disclaimer || addScreen === "")}
                                                    onClick={() => handlePay()}
                                                >
                                                    Pay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

            {isRead && (
                <SubscriptionTerm isRead={isRead} setIsRead={setIsRead} />
            )}
        </>

    )
}

export default NavbarPurchase