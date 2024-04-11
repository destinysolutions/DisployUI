import { Elements } from '@stripe/react-stripe-js';
import React, { useState } from 'react'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { handlePaymentIntegration } from '../Redux/PaymentSlice';
import { GET_ALL_PLANS, PAYMENT_INTENT_CREATE_REQUEST, stripePromise } from '../Pages/Api';
import { useDispatch } from 'react-redux';
import PlanPurchase from './PlanPurchase';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { handleGetAllPlans } from '../Redux/CommonSlice';

const PlanIntegration = () => {
    const { planId } = useParams();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [page, setPage] = useState(0)
    const [error, setError] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false
    })
    const [customerData, setCustomerData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })

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
        if (!customerData?.firstName) {
            setError({
                ...error,
                firstName: true
            })
        }
        if (!customerData?.lastName) {
            setError({
                ...error,
                lastName: true
            })
        }
        if (!customerData?.email) {
            setError({
                ...error,
                email: true
            })
        }
        if (!customerData?.password) {
            setError({
                ...error,
                password: true
            })
        }
        const params = {
            "items": {
                "id": "0",
                "amount": (selectedPlan?.planPrice * 100)
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

    return (
        <>
            <div className="h-screen w-screen">
                <div className="w-full h-full p-5 flex items-center justify-center">
                    {page === 0 && (
                        <div className="lg:w-[700px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg">
                            <>
                                <div className="text-2xl font-semibold">Create An Account</div>
                                <div className="rounded-lg shadow-md bg-white p-5 h-[95%]">
                                    <div
                                        className="flex flex-col gap-2 h-full"
                                    >

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
                                            <span className="error">This Field is Required.</span>
                                        )}
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
                                            <span className="error">This Field is Required.</span>
                                        )}
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
                                            <span className="error">This Field is Required.</span>
                                        )}

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
                                            <span className="error">This Field is Required.</span>
                                        )}


                                        <div className="w-full h-full">
                                            <div className="flex justify-end pt-4 h-full items-end">
                                                <button
                                                    className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                                    onClick={() => handleCreate()}
                                                    type="submit"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    )}
                    {page === 1 && clientSecret && (
                        <div className="lg:w-[600px] md:w-[600px] w-full h-[40vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg">
                            <>
                                <Elements options={options} stripe={stripePromise}>
                                    <PlanPurchase selectedPlan={selectedPlan} customerData={customerData}/>
                                </Elements>
                            </>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default PlanIntegration
