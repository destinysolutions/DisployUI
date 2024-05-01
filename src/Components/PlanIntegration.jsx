import { Elements } from '@stripe/react-stripe-js';
import React, { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { handlePaymentIntegration } from '../Redux/PaymentSlice';
import { GET_ALL_PLANS, PAYMENT_INTENT_CREATE_REQUEST, VERIFY_COUPON, stripePromise } from '../Pages/Api';
import { useDispatch } from 'react-redux';
import PlanPurchase from './PlanPurchase';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { handleGetAllPlans } from '../Redux/CommonSlice';
import { handleGetCountries, handleGetState } from '../Redux/SettingUserSlice';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import { verifyDiscountCoupon } from '../Redux/AdminSettingSlice';

const PlanIntegration = () => {
    const { planId } = useParams();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [Screen, setScreen] = useState(1)
    const [page, setPage] = useState(0)
    const [showDiscount, setShowDiscount] = useState(false);
    const [showError, setShowError] = useState(false)
    const [discountCoupon, setDiscountCoupon] = useState("")
    const [error, setError] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        phone: false,
        googleLocation: false,
        company: false
    })
    const [customerData, setCustomerData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        company: "",
        googleLocation: ""
    })
    const TotalPrice = Screen <= 1 ? selectedPlan?.planPrice : ((Screen * selectedPlan?.planPrice))

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    useEffect(() => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${GET_ALL_PLANS}?PlanID=${planId}`,
            headers: {
            },
        }
        dispatch(handleGetAllPlans({ config })).then((res) => {
            setSelectedPlan(res?.payload?.data)
        })
    }, [planId])

    const handleCreate = () => {

        let error = false
        if (!customerData?.firstName) {
            setError(prevError => ({
                ...prevError,
                firstName: 'This Field is Required.'
            }));
            error = true;
        }
        if (!customerData?.lastName) {
            setError(prevError => ({
                ...prevError,
                lastName: 'This Field is Required.'
            }));
            error = true;
        }

        if (!customerData?.phone && !/^\d{10}$/.test(customerData?.phone)) {
            setError(prevError => ({
                ...prevError,
                phone: 'Please enter a valid phone number.'
            }));
            error = true;
        }

        if (!customerData?.email && !/\S+@\S+\.\S+/.test(customerData?.email)) {
            setError(prevError => ({
                ...prevError,
                email: 'Please enter a valid email address.'
            }));
            error = true;
        }

        if (!customerData?.password) {
            setError(prevError => ({
                ...prevError,
                password: 'This Field is Required.'
            }));
            error = true;
        }

        if (!customerData?.company) {
            setError(prevError => ({
                ...prevError,
                company: 'This Field is Required.'
            }));
            error = true;
        }

        if (!customerData?.googleLocation) {
            setError(prevError => ({
                ...prevError,
                googleLocation: 'This Field is Required.'
            }));
            error = true;
        }
        if (!error) {
            const params = {
                "items": {
                    "id": "0",
                    "amount": (TotalPrice * 100)
                }
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
                setPage(page + 1)
            }).catch((error) => {
                console.log('error', error)
            })

        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        // Update the customerData state with the new value
        setCustomerData({
            ...customerData,
            [name]: value
        });
        // Clear error state for the field being edited
        setError({
            ...error,
            [name]: false
        });
    };

    const handleVerify = () => {

        const Params = {

        };

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: VERIFY_COUPON,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(Params),
        };
        dispatch(verifyDiscountCoupon({ config })).then((res) => {
            if (res?.payload?.status) {
                setShowError(false)
            } else {
                setShowError(true)
            }
        }).catch((error) => {
            console.log('error', error)
            setShowError(false)
        })
    }

    return (
        <>
            <div className="h-screen w-screen">
                <div className="w-full h-full p-5 flex items-center justify-center">
                    {page === 0 && (
                        <div className="lg:w-[700px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
                            <>
                                <div className="text-3xl font-semibold">Create An Account</div>
                                <div className="rounded-lg shadow-md bg-white p-5">
                                    <div
                                        className="flex flex-col gap-2 h-full"
                                    >

                                        <div className="grid grid-cols-2 gap-2 my-2 border-b border-gray">
                                            <div className='flex flex-col'>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    placeholder="Enter Your First Name"
                                                    className="formInput"
                                                    value={customerData.firstName}
                                                    onChange={handleChange}
                                                />
                                                {error?.firstName && (
                                                    <span className="error">{error?.firstName}</span>
                                                )}
                                            </div>
                                            <div className='flex flex-col'>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    placeholder="Enter Your Last Name"
                                                    className="formInput"
                                                    value={customerData.lastName}
                                                    onChange={handleChange}
                                                />
                                                {error?.lastName && (
                                                    <span className="error">{error?.lastName}</span>
                                                )}
                                            </div>
                                            <div className='flex flex-col'>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    placeholder="Enter Your Phone Number"
                                                    className="formInput"
                                                    value={customerData.phone}
                                                    onChange={handleChange}
                                                />
                                                {error?.phone && (
                                                    <span className="error">{error?.phone}</span>
                                                )}
                                            </div>
                                            <div className='flex flex-col'>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Company Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    id="company"
                                                    placeholder="Enter Your Company Name"
                                                    className="formInput"
                                                    value={customerData.company}
                                                    onChange={handleChange}
                                                />
                                                {error?.company && (
                                                    <span className="error">{error?.company}</span>
                                                )}
                                            </div>
                                            <div className='flex flex-col'>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Google Location
                                                </label>
                                                <input
                                                    type="text"
                                                    name="googleLocation"
                                                    id="googleLocation"
                                                    placeholder="Enter Your Google Location"
                                                    className="formInput"
                                                    value={customerData.googleLocation}
                                                    onChange={handleChange}
                                                />
                                                {error?.googleLocation && (
                                                    <span className="error">{error?.googleLocation}</span>
                                                )}
                                            </div>
                                            <div className='flex flex-col'>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Enter Your Email"
                                                    className="formInput"
                                                    value={customerData.email}
                                                    onChange={handleChange}
                                                />
                                                {error?.email && (
                                                    <span className="error">{error?.email}</span>
                                                )}
                                            </div>
                                            <div className='flex flex-col mb-4'>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        id="password"
                                                        placeholder="Enter Your Password"
                                                        className="formInput"
                                                        value={customerData.password}
                                                        onChange={handleChange}
                                                    />
                                                    <div className="icon">
                                                        {showPassword ? (
                                                            <BsFillEyeFill
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            />
                                                        ) : (
                                                            <BsFillEyeSlashFill
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                {error?.password && (
                                                    <span className="error">{error?.password}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex flex-col border-b border-gray'>
                                            <div className='flex flex-row items-center justify-between mb-4'>
                                                <h2 className='font-medium text-xl'>
                                                    {selectedPlan?.planName} - 1 Month Plan
                                                </h2>
                                                <span className='font-medium text-xl'>
                                                    ${selectedPlan?.planPrice}
                                                </span>
                                            </div>
                                            <div className='flex flex-row items-center justify-between mb-4'>
                                                <h2 className='flex flex-row items-center gap-2'>
                                                    <p>Screen</p>
                                                </h2>
                                                <span className='font-medium text-xl'>
                                                    <input type='number'
                                                        className="relative border border-black rounded-md p-2 w-20"
                                                        placeholder='1'
                                                        value={Screen}
                                                        onChange={(e) => {
                                                            if (e.target.value <= 0) {
                                                                setScreen(Screen)
                                                            } else {
                                                                setScreen(e.target.value)
                                                            }
                                                        }
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            {Screen > 1 && (
                                                <div className='flex flex-row items-center justify-between mb-4'>
                                                    <h2 className='flex flex-row items-center gap-2'>
                                                        <p>Purchase Screen Price</p>
                                                    </h2>
                                                    <span className='font-medium text-xl'>
                                                        ${(Screen * selectedPlan?.planPrice) - selectedPlan?.planPrice}
                                                    </span>
                                                </div>
                                            )}
                                            {/* <div className='flex flex-row items-center justify-between'>
                                                <h2 className='flex flex-row items-center gap-2'>
                                                    <FaCheck className='text-green' />
                                                    <p>Screen Management</p>
                                                </h2>
                                                <span className='font-medium text-xl'>
                                                    $00
                                                </span>
                                            </div>
                                            <div className='flex flex-row items-center justify-between'>
                                                <h2 className='flex flex-row items-center gap-2'>
                                                    <FaCheck className='text-green' />
                                                    <p>Advance Scheduling</p>
                                                </h2>
                                                <span className='font-medium text-xl'>
                                                    $00
                                                </span>
                                            </div>
                                            <div className='flex flex-row items-center justify-between'>
                                                <h2 className='flex flex-row items-center gap-2'>
                                                    <FaCheck className='text-green' />
                                                    <p>Screen Grouping</p>
                                                </h2>
                                                <span className='font-medium text-xl'>
                                                    $00
                                                </span>
                                            </div>
                                            <div className='flex flex-row items-center justify-between mb-2'>
                                                <h2 className='flex flex-row items-center gap-2'>
                                                    <FaCheck className='text-green' />
                                                    <p>Support 24 x 7</p>
                                                </h2>
                                                <span className='font-medium text-xl'>
                                                    $00
                                                </span>
                    </div>*/}

                                        </div>

                                        <div className='border-b border-gray'>
                                            <div className='flex flex-row items-center justify-between mb-4 mt-2'>
                                                <h2 className='font-semibold text-xl'>
                                                    Total
                                                </h2>
                                                <p className='font-semibold text-xl'>
                                                    ${TotalPrice}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-start py-3'>
                                            <h1 className='cursor-pointer hover:underline' onClick={() => setShowDiscount(!showDiscount)}>Have a coupon code?</h1>
                                        </div>
                                        {showDiscount && (
                                            <>
                                                <div className='flex items-center justify-between mb-2'>
                                                    <div className='flex items-center gap-5'>
                                                        <input
                                                            type='text'
                                                            placeholder='Discount Coupon'
                                                            className="relative border border-black rounded-md p-2 w-48"
                                                            onChange={(e) => setDiscountCoupon(e.target.value)}
                                                            value={discountCoupon}
                                                        />
                                                        <button
                                                            className={`text-white text-base px-5 py-2 border bg-SlateBlue shadow-md rounded-full ${discountCoupon?.length === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                            type="button"
                                                            disabled={discountCoupon?.length === 0}
                                                            onClick={() => handleVerify()}
                                                        >
                                                            Verify
                                                        </button>
                                                    </div>
                                                </div>
                                                {showError && (
                                                    <span className='error mt-[-10px]'>Coupon is invalid.</span>
                                                )}
                                            </>
                                        )}

                                        <div className="w-full h-full border-t border-gray">
                                            <div className="flex justify-end pt-4 h-full items-end">
                                                <button
                                                    className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                                    onClick={() => handleCreate()}
                                                    type="submit"
                                                >
                                                    Submit Secure Payment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    )}
                    {page === 1 && clientSecret && (
                            <>
                                <Elements options={options} stripe={stripePromise}>
                                    <PlanPurchase selectedPlan={selectedPlan} customerData={customerData} discountCoupon={discountCoupon} clientSecret={clientSecret} planId={planId} Screen={Screen} TotalPrice={TotalPrice}/>
                                </Elements>
                            </>
                    )}
                </div>
            </div>
        </>
    )
}

export default PlanIntegration
