import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { CREATE_SUBSCRIPTION, GET_ALL_CARD, PAYMENT_DETAILS, paypalOptions } from '../../../Pages/Api';
import { handleCreateSubscription, handlePaymentDetails } from '../../../Redux/PaymentSlice';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { handleLogout } from '../../../Redux/Authslice';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { GetAllCardList } from '../../../Redux/CardSlice';
import { capitalizeFirstLetter } from '../Common';
import { FaPlus } from 'react-icons/fa6';

const PurchasePayment = ({ togglePaymentModal, clientSecret, type, PaymentValue, discountCoupon, selectPlan, TotalPrice, totalScreen }) => {
    const { user, userDetails } = useSelector((state) => state.root.auth);
    const { token } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch()
    const stripe = useStripe();
    const elements = useElements();
    const navigation = useNavigate()
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Credit")
    const [autoPay, setAutoPay] = useState(false)
    const [cardList, setCardList] = useState([])
    const [selectCard, setSelectCard] = useState("")
    const [activeSection, setActiveSection] = useState(null);
    const [loading, setLoading] = useState(true)


    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const fetchCards = async () => {
        try {
            const config = {
                method: "get",
                maxBodyLength: Infinity,
                url: `${GET_ALL_CARD}?Email=${user?.emailID}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
            }
            dispatch(GetAllCardList({ config })).then((res) => {
                if (res?.payload?.status) {
                    if (res?.payload?.data?.length > 0) {
                        setActiveSection(1)
                    }
                    setCardList(res?.payload?.data);
                    setLoading(false)
                }
            })
        } catch (error) {
            toast.error('Error fetching cards');
        }
    };

    useEffect(() => {
        fetchCards()
    }, [])
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

    const PaymentDetails = ({ paymentIntent, organizationID, Subscription, product }) => {
        const { card, ...newObj } = paymentIntent;
        const updatedObj = { ...newObj, ...card };
        let params = {
            ...updatedObj,
            PaymentType: `${selectPlan?.planName} Plan`,
            PaymentValue: 1,
            AutoPay: true,
            ExtraScreen: (totalScreen - 1),
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
            ProductID: product
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
                toast.success("Payment Submitted Successfully.")
                setTimeout(() => {
                    setIsLoading(false);
                    toast.remove()
                    // dispatch(handleLogout());
                    navigation("/"); // Navigate to dashboard after processing payment
                }, 1000);
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

        dispatch(handleCreateSubscription({ config })).then((res) => {
            if (res?.payload?.status) {
                let Subscription = res?.payload?.subscriptionId
                PaymentDetails({ paymentIntent, organizationID: organizationID, Subscription, product })
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

    const handleChange = (data) => {
        setSelectCard(data);
    };


    const handlePay = () => {
        if (selectCard !== "") {
            CreateSubscription({ email: user?.emailID, name: user?.userDetails?.firstName + " " + user?.userDetails?.lastName, PaymentMethodId: selectCard?.paymentMethodID, paymentIntent: selectCard?.paymentMethod, organizationID: user?.organizationId })
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
                                        <div className="text-gray-500 hover:text-gray-700 duration-200 flex justify-between items-center mb-5 cursor-pointer">
                                            <label className='text-black text-2xl font-semibold'>
                                                Select Payment
                                            </label>
                                            <IoClose size={26} onClick={() => togglePaymentModal()} />
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
                                                <div className='bg-white border border-gray rounded-lg w-full p-4'>
                                                    {paymentMethod === "Credit" && (
                                                        <>
                                                            {loading && (
                                                                <div className="flex text-center m-5 justify-center">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        role="status"
                                                                        className="inline w-10 h-10 me-3 text-black animate-spin dark:text-gray-600"
                                                                        viewBox="0 0 100 101"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                            fill="currentColor"
                                                                        />
                                                                        <path
                                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                            fill="#1C64F2"
                                                                        />
                                                                    </svg>

                                                                </div>
                                                            )}
                                                            {!loading && cardList?.length > 0 && (
                                                                <>
                                                                    <div className="accordion-section mb-4">
                                                                        <div
                                                                            className={`border border-gray-300 rounded-lg flex justify-between px-4 py-3 items-center text-gray-500 transition ease duration-500 cursor-pointer pr-10 relative ${activeSection === 1 ? 'group-focus:text-white' : ''
                                                                                }`}
                                                                            onClick={() => toggleSection(1)}
                                                                            tabIndex="1"
                                                                        >
                                                                            <div className="transition ease duration-500">Select Card</div>
                                                                            <div
                                                                                className={`h-8 w-8 items-center inline-flex justify-center transform transition ease duration-500 absolute top-0 right-0 mb-auto ml-auto mt-2 mr-2 ${activeSection === 1 ? '-rotate-180' : ''
                                                                                    }`}
                                                                            >
                                                                                <svg
                                                                                    stroke="currentColor"
                                                                                    fill="none"
                                                                                    strokeWidth="2"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="transition-transform duration-300 text-gray-500"
                                                                                    height="1.5em"
                                                                                    width="1.5em"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                >
                                                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className={`max-h-0 overflow-hidden ease duration-500 ${activeSection === 1 ? 'max-h-screen' : ''}`}
                                                                        >
                                                                            <div className="border border-gray-300 rounded-lg p-4 max-h-56 overflow-y-scroll mt-3">
                                                                                {!loading && cardList?.length > 0 && cardList?.map((item) => (
                                                                                    <div key={item.cardNumber} className='flex justify-between items-center border rounded-lg border-gray-300 px-4 py-2 mb-2'>
                                                                                        <div className='flex items-center'>
                                                                                            <i className='mr-3 w-12'>
                                                                                                <svg viewBox="0 -11 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9"></rect>
                                                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M35.3945 34.7619C33.0114 36.8184 29.92 38.0599 26.5421 38.0599C19.0047 38.0599 12.8945 31.8788 12.8945 24.254C12.8945 16.6291 19.0047 10.448 26.5421 10.448C29.92 10.448 33.0114 11.6895 35.3945 13.7461C37.7777 11.6895 40.869 10.448 44.247 10.448C51.7843 10.448 57.8945 16.6291 57.8945 24.254C57.8945 31.8788 51.7843 38.0599 44.247 38.0599C40.869 38.0599 37.7777 36.8184 35.3945 34.7619Z" fill="#ED0006"></path>
                                                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M35.3945 34.7619C38.3289 32.2296 40.1896 28.4616 40.1896 24.254C40.1896 20.0463 38.3289 16.2783 35.3945 13.7461C37.7777 11.6895 40.869 10.448 44.247 10.448C51.7843 10.448 57.8945 16.6291 57.8945 24.254C57.8945 31.8788 51.7843 38.0599 44.247 38.0599C40.869 38.0599 37.7777 36.8184 35.3945 34.7619Z" fill="#F9A000"></path>
                                                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M35.3946 13.7461C38.329 16.2784 40.1897 20.0463 40.1897 24.254C40.1897 28.4616 38.329 32.2295 35.3946 34.7618C32.4603 32.2295 30.5996 28.4616 30.5996 24.254C30.5996 20.0463 32.4603 16.2784 35.3946 13.7461Z" fill="#FF5E00"></path>
                                                                                                </svg>
                                                                                            </i>
                                                                                            {capitalizeFirstLetter(item?.funding)} Card **** **** **** {item?.cardNumber}
                                                                                        </div>
                                                                                        <span className='bg-blue-200 px-3 py-1.5 text-blue-600 rounded-full text-sm'>Set as default</span>
                                                                                        <input type='radio'
                                                                                            checked={selectCard?.paymentMethodID === item?.paymentMethodID}
                                                                                            onChange={() => handleChange(item)}
                                                                                        />
                                                                                    </div>
                                                                                ))}

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="accordion-section">
                                                                        <div
                                                                            className={`border border-gray-300 rounded-lg flex justify-between px-4 py-3 items-center text-gray-500 transition ease duration-500 cursor-pointer pr-10 relative ${activeSection === 2 ? 'group-focus:text-white' : ''
                                                                                }`}
                                                                            onClick={() => toggleSection(2)}
                                                                            tabIndex="2"
                                                                        >
                                                                            <div className='transition ease duration-500 flex items-center gap-4'>
                                                                                <FaPlus />
                                                                                <span>Add New Card</span>
                                                                            </div>
                                                                            <div
                                                                                className={`h-8 w-8 items-center inline-flex justify-center transform transition ease duration-500 absolute top-0 right-0 mb-auto ml-auto mt-2 mr-2 ${activeSection === 2 ? '-rotate-180' : ''
                                                                                    }`}
                                                                            >
                                                                                <svg
                                                                                    stroke="currentColor"
                                                                                    fill="none"
                                                                                    strokeWidth="2"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    className="transition-transform duration-300 text-gray-500"
                                                                                    height="1.5em"
                                                                                    width="1.5em"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                >
                                                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className={`max-h-0 overflow-hidden ease duration-500 ${activeSection === 2 ? 'max-h-screen' : ''}`}
                                                                        >
                                                                            <div className="border border-gray-300 rounded-lg p-4 mt-3">
                                                                                <div className="card-label w-full relative">
                                                                                    <label className='formLabel'>Card Number</label>
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
                                                                                </div>
                                                                                <div className='flex items-center gap-4 pt-3'>
                                                                                    <div className="card-label w-6/12 relative">
                                                                                        <label className='formLabel'>Expiration Date</label>
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
                                                                                    </div>
                                                                                    <div className="card-label w-6/12 relative">
                                                                                        <label className='formLabel'>CVC</label>
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
                                                                                    </div>
                                                                                </div>
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
                                                                </>
                                                            )}

                                                            {!loading && cardList?.length === 0 && (
                                                                <div className="border border-gray-300 rounded-lg p-4 mt-3">
                                                                    <div className="card-label w-full relative">
                                                                        <label className='formLabel'>Card Number</label>
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
                                                                    </div>
                                                                    <div className='flex items-center gap-4 pt-3'>
                                                                        <div className="card-label w-6/12 relative">
                                                                            <label className='formLabel'>Expiration Date</label>
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
                                                                        </div>
                                                                        <div className="card-label w-6/12 relative">
                                                                            <label className='formLabel'>CVC</label>
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
                                                                        </div>
                                                                    </div>
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
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {activeSection === 1 && (
                                                    <div className='mt-4'>
                                                        <button
                                                            className={`bg-primary ${selectCard === "" ? "cursor-not-allowed" : "cursor-pointer"} text-white text-base px-8 py-3 border border-primary shadow-md rounded-full `}
                                                            type="button"
                                                            disabled={selectCard === ""}
                                                            onClick={handlePay}
                                                        >
                                                            <span id="button-text">
                                                                {isLoading ? <div className="spinner-add-payment" id="spinner"></div> : "Pay now"}
                                                            </span>
                                                        </button>
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

export default PurchasePayment
