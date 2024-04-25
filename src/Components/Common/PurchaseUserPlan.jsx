import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { PAYMENT_INTENT_CREATE_REQUEST, VERIFY_COUPON, stripePromise } from '../../Pages/Api';
import { handlePaymentIntegration } from '../../Redux/PaymentSlice';
import { verifyDiscountCoupon } from '../../Redux/AdminSettingSlice';
import { useDispatch } from 'react-redux';
import PlanPurchaseModel from './PlanPurchaseModel';
import { Elements } from '@stripe/react-stripe-js';

const PurchaseUserPlan = ({ setPurchasePlan, purchasePlan, selectPlan }) => {
    const dispatch = useDispatch();
    const [Screen, setScreen] = useState(1);
    const [showDiscount, setShowDiscount] = useState(false);
    const [showError, setShowError] = useState(false)
    const [discountCoupon, setDiscountCoupon] = useState("")
    const [clientSecret, setClientSecret] = useState("");
    const [openPayment,setOpenPayment] = useState(false)
    const TotalPrice = Screen <= 1 ? selectPlan?.planPrice : ((Screen * selectPlan?.planPrice))

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    const handleCreate = () => {


        const params = {
            "items": {
                "id": "0",
                "amount": (TotalPrice * 100)
            }
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

    return (
        <>
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
        >
            <div className="modal-overlay">
                <div className="modal">
                    <div className="relative p-4 lg:w-[500px] md:w-[500px] sm:w-full max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
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
                                                        className={`text-white text-base px-5 py-2 border bg-SlateBlue shadow-md rounded-full ${discountCoupon?.length === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
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
                </div>
            </div>
        </div>
        {openPayment && clientSecret && (
            <div className="lg:w-[600px] md:w-[600px] w-full h-[30vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg flex items-center justify-center">
                <>
                    <Elements options={options} stripe={stripePromise}>
                        <PlanPurchaseModel selectPlan={selectPlan} discountCoupon={discountCoupon} clientSecret={clientSecret} Screen={Screen} openPayment={openPayment} setOpenPayment={setOpenPayment}/>
                    </Elements>
                </>
            </div>
        )}
        </>
    )
}

export default PurchaseUserPlan
