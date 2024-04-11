import { CardElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import "../../Styles/PaymentModal.css"
import { useSelector } from 'react-redux';
import { PAYMENT_DETAILS } from '../../Pages/Api';
import { useDispatch } from 'react-redux';
import { handlePaymentDetails } from '../../Redux/PaymentSlice';

const PaymentDialog = ({ togglePaymentModal, clientSecret, type, PaymentValue }) => {

    const { user, userDetails } = useSelector((state) => state.root.auth);
    const { token } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch()
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const paymentElementOptions = {
        layout: "tabs"
    }

    const handleSubmit = async (e) => {

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            const { paymentIntent, error } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required'
            });

            // const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            //     payment_method: {
            //         card: elements.getElement(CardElement),
            //         billing_details: {
            //             name: userDetails?.firstName ? userDetails?.firstName : "Admin" ,
            //         },
            //     },
            // });

            if (error) {
                if (error.type === "card_error" || error.type === "validation_error") {
                    setMessage(error.message);
                } else {
                    setMessage("An unexpected error occurred.");
                }
            } else {
                // Payment was successful, you can access paymentIntent for confirmation data
                setMessage("Payment successful!");

                let params = {
                    ...paymentIntent,
                    PaymentType: type,
                    PaymentValue: PaymentValue,
                    organizationId:user?.organizationId
                }

                const config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: PAYMENT_DETAILS,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authToken,
                    },
                    data: JSON.stringify(params),
                }
                dispatch(handlePaymentDetails({ config })).then((res) => {
                    if(res?.payload?.status){
                        navigation("/dashboard"); // Navigate to dashboard after processing payment
                    }
                })
            }

            setIsLoading(false);
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
                <div className="relative p-4 w-full max-w-xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Stripe Payment
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => togglePaymentModal()}
                            />
                        </div>
                        <div className="p-4 md:p-5">
                            <div id="payment-form" className='Payment'>
                                {/*<CardElement id="payment-element" options={paymentElementOptions} />*/}
                                <PaymentElement id="payment-element" options={paymentElementOptions} />

                                <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmit} type='button'>
                                    <span id="button-text">
                                        {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
                                    </span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentDialog
