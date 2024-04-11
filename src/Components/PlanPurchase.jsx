import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handlePaymentDetails } from '../Redux/PaymentSlice';
import { ADD_REGISTER_URL, PAYMENT_DETAILS } from '../Pages/Api';
import { useDispatch } from 'react-redux';
import { handleRegisterUser } from "../Redux/Authslice"

const PlanPurchase = ({ selectedPlan, customerData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

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
            PaymentType: `${selectedPlan?.planName} Plan`,
            PaymentValue: 1,
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
                const formData = new FormData();
                formData.append("Password", customerData.password);
                formData.append("FirstName", customerData.firstName);
                formData.append("LastName", customerData.lastName);
                formData.append("Email", customerData.email);
                // formData.append("UserTokan", usertoken);   // used Firebase token
                formData.append("Operation", "Insert");

                let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: ADD_REGISTER_URL,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    data: formData,
                };

                const response = dispatch(handleRegisterUser({ config }));
                if (response) {
                    response
                        .then((res) => {
                            if (res?.payload?.status === 200) {
                                PaymentDetails({ paymentIntent, organizationID: res?.payload?.data?.organizationID })
                            }
                        })
                }
                // Payment was successful, you can access paymentIntent for confirmation data
                setMessage("Payment successful!");
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
            <div id="payment-form" className='Payment'>
                {/*<CardElement id="payment-element" options={paymentElementOptions} />*/}
                <PaymentElement id="payment-element" options={paymentElementOptions} />

                <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type='button'>
                    <span id="button-text">
                        {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
                    </span>
                </button>
            </div>
        </>
    )
}

export default PlanPurchase
