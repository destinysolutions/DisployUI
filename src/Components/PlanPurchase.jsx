import { CardElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleCreateSubscription, handlePaymentDetails } from '../Redux/PaymentSlice';
import { ADD_REGISTER_URL, CREATE_SUBSCRIPTION, PAYMENT_DETAILS } from '../Pages/Api';
import { useDispatch } from 'react-redux';
import { handleRegisterUser } from "../Redux/Authslice"

const PlanPurchase = ({ selectedPlan, customerData, discountCoupon, clientSecret, planId, Screen }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [autoPay, setAutoPay] = useState(false)
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
            AutoPay: autoPay,
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

    const CreateSubscription = ({ email, PaymentMethodId, paymentIntent, organizationID }) => {
        let product;
        if (planId === 1 || planId === "1") {
            product = "prod_PwkVKbLSFWLFbG"
        } else if (planId === 2 || planId === "2") {
            product = "prod_PwkV7yFNwyNMzl"
        } else if (planId === 3 || planId === "3") {
            product = "prod_PwkWdO5AkzWyRX"
        } else {
            product = "prod_PwkWSDVFcbz4Ui"
        }

        let params = {
            Email: email,
            PaymentMethodId: PaymentMethodId,
            ProductID: product,
        }

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: CREATE_SUBSCRIPTION,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(params),
        }

        dispatch(handleCreateSubscription({ config })).then((res) => {
            if (res?.payload?.status) {
                PaymentDetails({ paymentIntent, organizationID: organizationID })
            }
        })
    }

    const handleSubmitPayment = async (e) => {

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            // const { paymentIntent, error } = await stripe.confirmPayment({
            //     elements,
            //     redirect: 'if_required'
            // });

            const cardElement = elements.getElement(CardElement);
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            console.log('paymentMethod', paymentMethod)

            // const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            //     payment_method: {
            //         card: elements.getElement(CardElement),
            //         billing_details: {
            //             name: customerData?.email,
            //             email: customerData?.email
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
                formData.append("Phone", customerData.phone);
                formData.append("GoogleLocation", customerData.googleLocation);
                formData.append("OrganizationName", customerData.company);
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
                                if (autoPay) {
                                    CreateSubscription({ email: res?.payload?.data?.email, PaymentMethodId: paymentMethod?.id, paymentIntent: paymentMethod, organizationID: res?.payload?.data?.organizationID })
                                } else {
                                    PaymentDetails({ paymentIntent: paymentMethod, organizationID: res?.payload?.data?.organizationID })
                                }
                            }
                        })
                }
                // Payment was successful, you can access paymentIntent for confirmation data
                setMessage("Payment successful!");
            }

        } catch (error) {
            console.error("Error confirming payment:", error);
            setIsLoading(false);
            // Handle error, display error message to user, etc.
        }
    };

    return (
        <>
            {/*        <div id="payment-form" className='Payment'>
                <CardElement id="payment-element" className="CardElement" options={paymentElementOptions} />
              <PaymentElement id="payment-element" options={paymentElementOptions} />
                <div className='mb-4 flex items-center gap-2'>
                    <input type='checkbox' className='w-4 h-4 inline-block rounded-full border border-grey flex-no-shrink' onChange={() => setAutoPay(!autoPay)} value={autoPay} />
                    <label className='text-gray-600'>Auto Payment</label>
                </div>

                <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type='button'>
                    <span id="button-text">
                        {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
                    </span>
                </button>
            </div>
    */}
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
                    <div className='mb-4 flex items-center gap-2'>
                        <input type='checkbox' className='w-4 h-4 inline-block rounded-full border border-grey flex-no-shrink' onChange={() => setAutoPay(!autoPay)} value={autoPay} />
                        <label className='text-gray-600'>Auto Payment</label>
                    </div>
                    <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type='button'>
                        <span id="button-text">
                            {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
                        </span>
                    </button>
                </div>
            </div>

        </>
    )
}

export default PlanPurchase
