import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleCreateSubscription, handlePaymentDetails } from '../Redux/PaymentSlice';
import { ADD_REGISTER_URL, CREATE_SUBSCRIPTION, PAYMENT_DETAILS, paypalOptions } from '../Pages/Api';
import { useDispatch } from 'react-redux';
import { handleRegisterUser } from "../Redux/Authslice"
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';

const PlanPurchase = ({ selectedPlan, customerData, discountCoupon, clientSecret, planId, Screen, TotalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const dispatch = useDispatch();
    const [autoPay, setAutoPay] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("Credit")

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

    const PaymentDetails = ({ paymentIntent, organizationID, Subscription, product }) => {
        const { card, ...newObj } = paymentIntent;
        const updatedObj = { ...newObj, ...card };
        let params = {
            ...updatedObj,
            PaymentType: `${selectedPlan?.planName} Plan`,
            PaymentValue: 1,
            AutoPay: autoPay,
            ExtraScreen: (Screen - 1),
            type: "Screen",
            items: Screen,
            amount: TotalPrice,
            organizationId: organizationID,
            SubscriptionID: Subscription,
            UserID: organizationID,
            SystemTimeZone: new Date()
                .toLocaleDateString(undefined, {
                    day: "2-digit",
                    timeZoneName: "long",
                })
                .substring(4),
            ProductID: product
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
                toast.success("Payment Submitted Successfully.")
                setTimeout(() => {
                    setIsLoading(false);
                    toast.remove()
                    navigation("/"); // Navigate to dashboard after processing payment
                }, 1000);
            }
        })
    }

    const CreateSubscription = ({ email, PaymentMethodId, paymentIntent, organizationID, name }) => {
        let product = selectedPlan?.productID;
        // if (planId === 1 || planId === "1") {
        //     product = "prod_PwkVKbLSFWLFbG"
        // } else if (planId === 2 || planId === "2") {
        //     product = "prod_PwkV7yFNwyNMzl"
        // } else if (planId === 3 || planId === "3") {
        //     product = "prod_PwkWdO5AkzWyRX"
        // } else {
        //     product = "prod_PwkWSDVFcbz4Ui"
        // }

        let params = {
            Email: email,
            PaymentMethodId: PaymentMethodId,
            ProductID: product,
            Name: name
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

        dispatch(handleCreateSubscription({ config })).then(async(res) => {
            if (res?.payload?.status) {
                let Subscription = res?.payload?.subscriptionId
                const SubscriptionData = res?.payload?.subscription
                let client_secret_id;
                if (SubscriptionData?.latest_invoice?.payment_intent?.client_secret) {
                    client_secret_id = SubscriptionData?.latest_invoice?.payment_intent?.client_secret
                } else {
                    client_secret_id = clientSecret
                }

                const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret = client_secret_id, {
                    payment_method: PaymentMethodId,
                });

                if (confirmError) {
                    setIsLoading(false);
                    console.error(confirmError.message);
                    setMessage(confirmError.message);
                } else if (paymentIntent.status === 'succeeded') {
                    console.log('Payment successful!');
                    setMessage("Payment successful!");
                    PaymentDetails({ paymentIntent, organizationID: organizationID, Subscription, product })
                } else if (paymentIntent.status === 'requires_action') {
                    setIsLoading(false);
                    console.log('3D Secure authentication required');
                    setErrorMessage('3D Secure authentication required. Please complete the authentication.');
                } else if (paymentIntent.status === 'requires_payment_method') {
                    setIsLoading(false);
                    console.log('Payment failed: requires payment method');
                    setErrorMessage('Payment failed: requires payment method. Please try again.');
                }
            }
        })
    }

    const handleSubmitPayment = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        if (!autoPay) {
            setErrorMessage(true)
        }

        if (autoPay) {
            setErrorMessage(false)
            setIsLoading(true);
            try {
                // const { paymentIntent, error } = await stripe.confirmPayment({
                //     elements,
                //     redirect: 'if_required'
                // });

                // const cardElement = elements.getElement(CardElement);
                // const { paymentMethod, error } = await stripe.createPaymentMethod({
                //     type: 'card',
                //     card: cardElement,
                // });

                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement(CardNumberElement),
                });

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
                        toast.error(error?.message)
                        setIsLoading(false);
                        setMessage(error.message);
                    } else {
                        toast.error("An unexpected error occurred.")
                        setIsLoading(false);
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
                                        CreateSubscription({ email: res?.payload?.data?.email, name: res?.payload?.data?.firstName + " " + res?.payload?.data?.lastName, PaymentMethodId: paymentMethod?.id, paymentIntent: paymentMethod, organizationID: res?.payload?.data?.organizationID })
                                    } else {
                                        PaymentDetails({ paymentIntent: paymentMethod, organizationID: res?.payload?.data?.organizationID, product: "" })
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
            {/*<div className="payment-form">
                <label className="card-label">
                    Card Number
                    <CardNumberElement
                        className="card-input"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </label>
                <label className="card-label">
                    Expiration Date
                    <CardExpiryElement
                        className="card-input"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </label>
                <label className="card-label">
                    CVC
                    <CardCvcElement
                        className="card-input"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </label>
                <div className="auto-pay">
                    <input type="checkbox" className="auto-pay-checkbox" onChange={() => setAutoPay(!autoPay)} value={autoPay} />
                    <label className="auto-pay-label">Auto Payment</label>
                </div>
                {errorMessage && (
                    <div className='mb-2'>
                        <label className="error-message">You need to Check Auto Pay for Further Process.</label>
                    </div>
                )}
                <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type="button" className="pay-button">
                    <span id="button-text">
                        {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
                    </span>
                </button>
                </div>*/}



            <div className="modal-overlay">
                <div className="modal">
                    <div className="relative p-4 lg:w-[1000px] md:w-[900px] sm:w-full max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="p-4 md:p-5">
                                <div id="payment-form" className='Payment'>
                                    <div className="text-gray-500 hover:text-gray-700 duration-200 flex justify-between items-center mb-5 cursor-pointer">
                                        <label className='text-black text-2xl font-semibold'>
                                            Select Payment
                                        </label>
                                    </div>
                                    <div className='flex flex-row flex-wrap'>
                                        <div className='w-full sm:w-1/3 md:w-1/4'>
                                            <div className='flex items-center border border-gray rounded py-2 px-3 mb-2'>
                                                <input
                                                    id="Credit"
                                                    type="radio"
                                                    value="Credit"
                                                    name="option"
                                                    checked={paymentMethod === "Credit"}
                                                    onChange={() => setPaymentMethod("Credit")}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label htmlFor="Credit" className="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300">Credit Card</label>
                                            </div>
                                            {/* <div className='flex items-center border border-gray rounded py-2 px-3 mb-2'>
                                                    <input
                                                        id="PayPal"
                                                        type="radio"
                                                        value="PayPal"
                                                        name="option"
                                                        checked={paymentMethod === "PayPal"}
                                                        onChange={() => setPaymentMethod("PayPal")}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <label htmlFor="PayPal" className="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300">PayPal</label>
            </div>*/}
                                        </div>
                                        <div className='w-full sm:w-2/3 md:w-3/4 pl-5'>
                                            {paymentMethod === "Credit" && (
                                                <div className="bg-white tabdetails rounded-md w-full p-4">
                                                    <label className="card-label">
                                                        Card Number
                                                        <CardNumberElement
                                                            className="card-input"
                                                            options={{
                                                                style: {
                                                                    base: {
                                                                        fontSize: '16px',
                                                                        color: '#424770',
                                                                        '::placeholder': {
                                                                            color: '#aab7c4',
                                                                        },
                                                                    },
                                                                    invalid: {
                                                                        color: '#9e2146',
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </label>
                                                    <label className="card-label">
                                                        Expiration Date
                                                        <CardExpiryElement
                                                            className="card-input"
                                                            options={{
                                                                style: {
                                                                    base: {
                                                                        fontSize: '16px',
                                                                        color: '#424770',
                                                                        '::placeholder': {
                                                                            color: '#aab7c4',
                                                                        },
                                                                    },
                                                                    invalid: {
                                                                        color: '#9e2146',
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </label>
                                                    <label className="card-label">
                                                        CVC
                                                        <CardCvcElement
                                                            className="card-input"
                                                            options={{
                                                                style: {
                                                                    base: {
                                                                        fontSize: '16px',
                                                                        color: '#424770',
                                                                        '::placeholder': {
                                                                            color: '#aab7c4',
                                                                        },
                                                                    },
                                                                    invalid: {
                                                                        color: '#9e2146',
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </label>
                                                    <div className="auto-pay">
                                                        <input type="checkbox" className="auto-pay-checkbox" onChange={() => setAutoPay(!autoPay)} value={autoPay} />
                                                        <label className="auto-pay-label">Auto Payment</label>
                                                    </div>
                                                    {errorMessage && (
                                                        <div className='mb-2'>
                                                            <label className="error-message">You need to Check Auto Pay for Further Process.</label>
                                                        </div>
                                                    )}
                                                    <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type="button" className="pay-button">
                                                        <span id="button-text">
                                                            {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                            {paymentMethod === "PayPal" && (
                                                <div className='w-full bg-white tabdetails rounded-md p-4'>
                                                    <PayPalScriptProvider options={paypalOptions}>
                                                        <PayPalButtons
                                                            style={{ layout: "horizontal" }}
                                                            createOrder={(data, actions) => {
                                                                return actions.order.create({
                                                                    purchase_units: [{
                                                                        amount: {
                                                                            value: '100.00', // Replace with your desired amount
                                                                        },
                                                                    }],
                                                                });
                                                            }}
                                                            onApprove={(data, actions) => {
                                                                return actions.order.capture().then(function (details) {
                                                                    alert('Transaction completed by ' + details.payer.name.given_name);
                                                                });
                                                            }} />
                                                    </PayPalScriptProvider>
                                                </div>
                                            )}
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

export default PlanPurchase
