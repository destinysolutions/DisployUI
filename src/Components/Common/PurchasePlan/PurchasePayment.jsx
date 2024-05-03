import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { CREATE_SUBSCRIPTION, PAYMENT_DETAILS } from '../../../Pages/Api';
import { handleCreateSubscription, handlePaymentDetails } from '../../../Redux/PaymentSlice';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { handleLogout } from '../../../Redux/Authslice';

const PurchasePayment = ({ togglePaymentModal, clientSecret, type, PaymentValue, discountCoupon, selectPlan, TotalPrice, totalScreen }) => {
    const { user, userDetails } = useSelector((state) => state.root.auth);
    console.log('user', user)
    const { token } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch()
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [autoPay, setAutoPay] = useState(false)
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

    const PaymentDetails = ({ paymentIntent, organizationID }) => {
        let params = {
            ...paymentIntent,
            PaymentType: `${selectPlan?.planName} Plan`,
            PaymentValue: 1,
            AutoPay: true,
            ExtraScreen: (totalScreen - 1),
            type: "Screen",
            items: totalScreen,
            amount: TotalPrice,
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
                dispatch(handleLogout());
                navigation("/"); // Navigate to dashboard after processing payment
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
                PaymentDetails({ paymentIntent, organizationID: organizationID })
            }
        })
    }

    const handleSubmit = async (event) => {
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

                if (error) {
                    if (error.type === "card_error" || error.type === "validation_error") {
                        setMessage(error.message);
                    } else {
                        setMessage("An unexpected error occurred.");
                    }
                } else {
                    // Payment was successful, you can access paymentIntent for confirmation data
                    setMessage("Payment successful!");
                    CreateSubscription({ email: user?.emailID, PaymentMethodId: paymentMethod?.id, paymentIntent: paymentMethod, organizationID: user?.organizationId })

                    // let params = {
                    //     ...paymentMethod,
                    //     PaymentType: type,
                    //     PaymentValue: PaymentValue,
                    //     organizationId: user?.organizationId,
                    //     discountCoupon: discountCoupon,
                    //     AutoPay: true,
                    // }

                    // const config = {
                    //     method: "post",
                    //     maxBodyLength: Infinity,
                    //     url: PAYMENT_DETAILS,
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //         Authorization: authToken,
                    //     },
                    //     data: JSON.stringify(params),
                    // }
                    // dispatch(handlePaymentDetails({ config })).then((res) => {
                    //     if (res?.payload?.status) {
                    //         navigation("/dashboard"); // Navigate to dashboard after processing payment
                    //     }
                    // })
                }

                // setIsLoading(false);
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
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full "
            >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="relative p-4 w-[500px] max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="p-4 md:p-5">
                                    <div id="payment-form" className='Payment'>
                                        <div className="text-gray-500 hover:text-gray-700 duration-200 flex justify-between items-center mb-3 cursor-pointer" onClick={() => togglePaymentModal()}>
                                            <label className='text-black text-xl font-semibold'>
                                                Card Details
                                            </label>
                                            <IoClose size={26} />
                                        </div>
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
                                            <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmit} type="button" className="pay-button">
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

export default PurchasePayment
