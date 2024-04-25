import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handlePaymentDetails } from '../../Redux/PaymentSlice';
import { PAYMENT_DETAILS } from '../../Pages/Api';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const PlanPurchaseModel = ({ selectPlan, discountCoupon, clientSecret, Screen, setOpenPayment, openPayment }) => {
    const { token, user } = useSelector((state) => state.root.auth);
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const paymentElementOptions = {
        layout: "tabs"
    }


    useEffect(() => {
        if (!stripe) {
            return;
        }
        if (!elements) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe, elements]);

    const PaymentDetails = ({ paymentIntent, organizationID }) => {
        let params = {
            ...paymentIntent,
            PaymentType: `${selectPlan?.planName} Plan`,
            PaymentValue: 1,
            AutoPay: false,
            ExtraScreen: (Screen - 1),
            type: "Screen",
            items: Screen,
            organizationId: organizationID,

            UserID: organizationID,
            SystemTimeZone: new Date()
                .toLocaleDateString(undefined, {
                    day: "2-digit",
                    timeZoneName: "long",
                })
                .substring(4),
        }

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: PAYMENT_DETAILS,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(params),
        }
        dispatch(handlePaymentDetails({ config })).then((res) => {
            if (res?.payload?.status) {
                setIsLoading(false);
                navigation("/"); // Navigate to dashboard after processing payment
            }
        })
    }


    const handleSubmitPayment = async (e) => {

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            const cardElement = elements.getElement(CardElement);
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            console.log('paymentMethod', paymentMethod)

            if (error) {
                if (error.type === "card_error" || error.type === "validation_error") {
                    setMessage(error.message);
                } else {
                    setMessage("An unexpected error occurred.");
                }
            } else {
                setMessage("Payment successful!");
                PaymentDetails({ paymentIntent: paymentMethod, organizationID: user?.organizationId })
            }
            // Payment was successful, you can access paymentIntent for confirmation data

        } catch (error) {
            console.error("Error confirming payment:", error);
            setIsLoading(false);
            // Handle error, display error message to user, etc.
        }
    };


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
                        <div className="relative p-4">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-end px-3 pt-3 md:px-4 md:pt-4 rounded-t">
                                    <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200" onClick={() => setOpenPayment(!openPayment)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                </div>
                                <div className='p-4'>
                                    <div id="payment-form" className='Payment'>
                                        <div className="payment-form-container">
                                            <h2 className='mb-3'>Secure Payment</h2>
                                            <div className="card-element-container">
                                                <CardElement
                                                    className="CardElement"
                                                    options={paymentElementOptions}
                                                />
                                                <div className="error-message" role="alert"></div>
                                            </div>
                                            {/*<div className='mb-4 flex items-center gap-2'>
                                    <input type='checkbox' className='w-4 h-4 inline-block rounded-full border border-grey flex-no-shrink' onChange={() => setAutoPay(!autoPay)} value={autoPay} />
                                    <label className='text-gray-600'>Auto Payment</label>
    </div>*/}
                                            <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type='button'>
                                                <span id="button-text">
                                                    {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
                                                </span>
                                            </button>
                                        </div>
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

export default PlanPurchaseModel
