import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CREATE_SUBSCRIPTION, PAYMENT_DETAILS, paypalOptions } from '../../Pages/Api';
import { IoClose } from 'react-icons/io5';
import { handleCreateSubscription, handlePaymentDetails } from '../../Redux/PaymentSlice';
import toast from 'react-hot-toast';
import { handleLogout } from '../../Redux/Authslice';

const BuyNewPlan = ({ selectPlan, clientSecret, Screen, openPayment, setOpenPayment, trialDay }) => {
    const { token, user, userDetails } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Credit")
    let cardMethod;
    const [autoPay, setAutoPay] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    let PaymentofScreen = false;
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

    const PaymentDetails = ({ paymentIntent, organizationID, Subscription, totalScreen, TotalPrice, ScreenpaymentType }) => {
        const { card, ...newObj } = paymentIntent;
        const updatedObj = { ...newObj, ...card };
        let params = {
            ...updatedObj,
            PaymentType: ScreenpaymentType ? "Screen" : `${selectPlan?.planName} Plan`,
            PaymentValue: 1,
            AutoPay: true,
            ExtraScreen: 1,
            type: "Screen",
            items: totalScreen,
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
        }

        let config = {
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
            if (res?.payload?.status) {
                // setIsLoading(false);
                // dispatch(handleLogout());
                // navigation("/"); // Navigate to dashboard after processing payment
            }
        })
    }

    const ScreenCreateSubscription = ({ email, PaymentMethodId, paymentIntent, organizationID, PaymentofScreen, name }) => {
        let product;
        if (selectPlan?.listOfPlansID === 1 || selectPlan?.listOfPlansID === "1") {
            product = "prod_Q1wI9ksVDBdRW3"
        } else if (selectPlan?.listOfPlansID === 2 || selectPlan?.listOfPlansID === "2") {
            product = "prod_Q1wITfBepgK1H7"
        } else if (selectPlan?.listOfPlansID === 3 || selectPlan?.listOfPlansID === "3") {
            product = "prod_Q1wJSPx0LoW70n"
        } else {
            product = "prod_Q1wJcEtb58TKI5"
        }

        let params = {
            Email: email,
            PaymentMethodId: PaymentMethodId,
            ProductID: product,
            quantity: (Screen - 1),
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

        dispatch(handleCreateSubscription({ config })).then((res) => {
            if (res?.payload?.status) {
                let Subscription = res?.payload?.subscriptionId
                PaymentDetails({ paymentIntent, organizationID: organizationID, Subscription, totalScreen: (Screen - 1), TotalPrice: (selectPlan?.planPrice * (Screen - 1)), ScreenpaymentType: true })
                setTimeout(() => {
                toast.success("Payment Submitted Successfully.")
                    setIsLoading(false);
                    navigation("/"); // Navigate to dashboard after processing payment
                }, 2000);
            }
            else {
                setIsLoading(false);
                toast.error(res?.payload?.data)
            }
        })
    }

    const CreateSubscription = ({ email, PaymentMethodId, paymentIntent, organizationID, name }) => {
        let product;
        if (selectPlan?.listOfPlansID === 1 || selectPlan?.listOfPlansID === "1") {
            product = "prod_PwkVKbLSFWLFbG"
        } else if (selectPlan?.listOfPlansID === 2 || selectPlan?.listOfPlansID === "2") {
            product = "prod_PwkV7yFNwyNMzl"
        } else if (selectPlan?.listOfPlansID === 3 || selectPlan?.listOfPlansID === "3") {
            product = "prod_PwkWdO5AkzWyRX"
        } else {
            product = "prod_PwkWSDVFcbz4Ui"
        }

        let params = {
            Email: email,
            Name: name,
            PaymentMethodId: PaymentMethodId,
            ProductID: product,
            trialDay,
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
                let Subscription = res?.payload?.subscriptionId
                PaymentDetails({ paymentIntent, organizationID: organizationID, Subscription, totalScreen: 1, TotalPrice: selectPlan?.planPrice, ScreenpaymentType: false })
                PaymentofScreen = true
                if (Screen > 1) {
                    ScreenCreateSubscription({ email: user?.emailID, name: user?.userDetails?.firstName + " " + user?.userDetails?.lastName, PaymentMethodId: cardMethod?.id, paymentIntent: cardMethod, organizationID: user?.organizationId })
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
                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement(CardNumberElement),
                });

                cardMethod = paymentMethod

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
                    // Payment was successful, you can access paymentIntent for confirmation data
                    setMessage("Payment successful!");
                    CreateSubscription({ email: user?.emailID, name: user?.userDetails?.firstName + " " + user?.userDetails?.lastName, PaymentMethodId: paymentMethod?.id, paymentIntent: paymentMethod, organizationID: user?.organizationId })
                }

            } catch (error) {
                console.error("Error confirming payment:", error);
                setIsLoading(false);
            }
        }
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
                    <div className="modal">
                        <div className="relative p-4 lg:w-[1000px] md:w-[900px] sm:w-full max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="p-4 md:p-5">
                                    <div id="payment-form" className='Payment'>
                                        <div className="text-gray-500 hover:text-gray-700 duration-200 flex justify-between items-center mb-5 cursor-pointer" onClick={() => setOpenPayment(!openPayment)}>
                                            <label className='text-black text-2xl font-semibold'>
                                                Select Payment
                                            </label>
                                            <IoClose size={26} />
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
                                                {/*<div className='flex items-center border border-gray rounded py-2 px-3 mb-2'>
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
            </div>

        </>
    )
}

export default BuyNewPlan