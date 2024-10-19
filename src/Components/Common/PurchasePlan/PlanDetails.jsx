import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BsEyeFill } from 'react-icons/bs';
import ReactTooltip from 'react-tooltip';
import ViewPlan from '../../Settings/ViewPlan';
import SubscriptionTerm from './SubscriptionTerm';
import { PAYMENT_INTENT_CREATE_REQUEST, stripePromise } from '../../../Pages/Api';
import { handlePaymentIntegration } from '../../../Redux/PaymentSlice';
import PaymentDialog from '../PaymentDialog';
import { Elements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { round } from 'lodash';
import PurchasePayment from './PurchasePayment';

const PlanDetails = ({ planDetails, setPlanDetails, selectPlan }) => {
    const dispatch = useDispatch()
    const [openView, setOpenView] = useState("")
    const [isRead, setIsRead] = useState(false)
    const [disclaimer, setDisclaimer] = useState(false)
    const [totalScreen, setTotalScreen] = useState(1)
    const [clientSecret, setClientSecret] = useState("");
    const [openPayment, setOpenPayment] = useState(false);
    const [discountCoupon, setDiscountCoupon] = useState("")
    const TotalPrice = totalScreen * selectPlan?.planPrice
    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    const toggleModal = () => {
        setOpenView(!openView)
    }

    const handlePay = () => {
        const total = totalScreen * selectPlan?.planPrice;
        const TimeZone = new Date()
        .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
        })
        .substring(4);
        const params = {
            "items": {
                "id": "0",
                "amount": String(round(total * 100))
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
        })
        setOpenPayment(true)
    }

    const togglePaymentModal = () => {
        setOpenPayment(!openPayment)
    }


    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full"
            >
                <div className="modal-overlay">
                    <div className="modal p-4 lg:w-[700px] md:w-[700px] sm:w-full max-h-full">
                        <div className="relative w-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-300">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Plan details
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => { setPlanDetails(!planDetails) }}
                                    />
                                </div>
                                <div className="flex flex-wrap py-6 px-10 justify-center">

                                    <div className='p-4 shadow rounded-lg w-[550px] mb-5'>
                                        <div className='flex flex-col gap-4 '>
                                            <div className='flex items-center justify-between border-b border-gray'>
                                                <p>{selectPlan?.planName} Plan:</p>
                                                <div
                                                    data-tip
                                                    data-for="View"
                                                    className="cursor-pointer mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={() => setOpenView(true)}
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
                                            <div className='flex items-center justify-between border-b border-gray'>
                                                <p>Total number of screens required:</p>
                                                <input type='number' className="relative border mb-4 border-gray rounded-md p-2 w-16" placeholder='1'
                                                    onChange={(e) => {
                                                        if (e.target.value > 0) {
                                                            setTotalScreen(e.target.value)
                                                        }
                                                    }}
                                                    value={totalScreen} />
                                            </div>
                                            <div className='flex items-center justify-between border-b border-gray'>
                                                <p>Cost Month/screen:</p>
                                                <input type='text' className="relative border mb-4 border-gray rounded-md p-2 w-16" disabled placeholder={`$ ${selectPlan?.planPrice}`} value={`$ ${totalScreen * selectPlan?.planPrice}`} />
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <p><input type='checkbox' className='mr-2 w-4 h-4' checked={disclaimer} onChange={() => setDisclaimer(!disclaimer)} /> <label className='text-xl font-semibold'>Disclaimer: </label><span>Monthly Subscription Charges</span></p>
                                                <label
                                                    className='underline font-semibold cursor-pointer'
                                                    onClick={() => {
                                                        setIsRead(true)
                                                    }}
                                                >
                                                    Read More
                                                </label>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <button
                                            disabled={!disclaimer}
                                            className={`bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full ${disclaimer ? "cursor-pointer" : "cursor-not-allowed"}`}
                                            type="button"
                                            onClick={() => handlePay()}
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {openView && (
                <ViewPlan toggleModal={toggleModal} selectPlan={selectPlan} />
            )}
            {isRead && (
                <SubscriptionTerm isRead={isRead} setIsRead={setIsRead} />
            )}

            {openPayment && clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <PurchasePayment openPayment={openPayment} setOpenPayment={setOpenPayment} togglePaymentModal={togglePaymentModal} clientSecret={clientSecret} type="Storage" PaymentValue={totalScreen} discountCoupon={discountCoupon} selectPlan={selectPlan} TotalPrice={TotalPrice} totalScreen={totalScreen} />
                </Elements>
            )}

        </>
    )
}

export default PlanDetails
