import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleCreateSubscription, handlePaymentDetails, handleUpgradeSubscription } from '../../Redux/PaymentSlice';
import { CREATE_SUBSCRIPTION, PAYMENT_DETAILS, UPGRADE_SUBSCRIPTION } from '../../Pages/Api';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { handleLogout } from '../../Redux/Authslice';
import { IoClose } from 'react-icons/io5';
const PlanPurchaseModel = ({ selectPlan, discountCoupon, clientSecret, Screen, setOpenPayment, openPayment, userPlanType, purchaseType }) => {
    const { token, user } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(false);

    const [autoPay, setAutoPay] = useState(false)
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

    const PaymentDetails = ({ paymentIntent, organizationID, Subscription }) => {
        let params = {
            ...paymentIntent,
            PaymentType: `${selectPlan?.planName} Plan`,
            PaymentValue: 1,
            AutoPay: autoPay,
            ExtraScreen: (Screen - 1),
            type: "Screen",
            items: Screen,
            amount: selectPlan?.planPrice,
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
                Authorization: authToken
            },
            data: JSON.stringify(params),
        }
        dispatch(handlePaymentDetails({ config })).then((res) => {
            if (res?.payload?.status) {
                setIsLoading(false);
                // if (userPlanType === "LoginUser") {
                dispatch(handleLogout());
                // } else {
                //     navigation("/"); // Navigate to dashboard after processing payment
                // }
            }
        })
    }

    const CreateSubscription = ({ email, PaymentMethodId, paymentIntent, organizationID }) => {
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
                let Subscription = res?.payload?.subscriptionId
                PaymentDetails({ paymentIntent, organizationID: organizationID, Subscription })
            }
        })
    }

    const UpgradeSubscription = ({ email, PaymentMethodId, paymentIntent, organizationID }) => {
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
            PaymentMethodId: PaymentMethodId,
            ProductID: product,
        }

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: UPGRADE_SUBSCRIPTION,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(params),
        }

        dispatch(handleUpgradeSubscription({ config })).then((res) => {
            if (res?.payload?.status) {
                let Subscription = res?.payload?.subscriptionId
                PaymentDetails({ paymentIntent, organizationID: organizationID, Subscription })
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
                // const cardElement = elements.getElement(CardElement);
                // const { paymentMethod, error } = await stripe.createPaymentMethod({
                //     type: 'card',
                //     card: cardElement,
                // });

                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement(CardNumberElement),
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
                    if(purchaseType !== "Upgrade"){
                        CreateSubscription({ email: user?.emailID, PaymentMethodId: paymentMethod?.id, paymentIntent: paymentMethod, organizationID: user?.organizationId })
                    }else{
                        UpgradeSubscription({ email: user?.emailID, PaymentMethodId: paymentMethod?.id, paymentIntent: paymentMethod, organizationID: user?.organizationId })
                    }
                    // PaymentDetails({ paymentIntent: paymentMethod, organizationID: user?.organizationId })
                }
                // Payment was successful, you can access paymentIntent for confirmation data

            } catch (error) {
                console.error("Error confirming payment:", error);
                setIsLoading(false);
                // Handle error, display error message to user, etc.
            }
        }
    };


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
                        <div className="relative p-4 w-[500px] max-h-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4">
                                {/* Modal header */}
                                <div className="text-gray-500 hover:text-gray-700 duration-200 flex justify-between items-center mb-3 cursor-pointer" onClick={() => setOpenPayment(!openPayment)}>
                                    <label className='text-black text-xl font-semibold'>
                                        Card Details
                                    </label>
                                    <IoClose size={26} />
                                </div>
                                <div className='p-4'>
                                    <div className="payment-form">
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
                                        <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type="button" className="pay-button w-full">
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

        </>
    )
}

export default PlanPurchaseModel
