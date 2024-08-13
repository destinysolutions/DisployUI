import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { ADD_CARD } from '../Api';
import { handleAddCard } from '../../Redux/AdminSettingSlice';
import SubscriptionTerm from '../../Components/Common/PurchasePlan/SubscriptionTerm';

const Card = ({ setLoading, fetchCards }) => {
    const { user, token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const [cardholderName, setCardholderName] = useState('');
    const [disclaimer, setDisclaimer] = useState(false);
    const [isRead, setIsRead] = useState(false)
    const [key, setKey] = useState(0);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);

        const { token, error } = await stripe.createToken(cardElement, { name: cardholderName });

        if (error) {
            console.error(error);
            toast.error(error.message)
        } else {
            setLoading(true)
            const config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${ADD_CARD}?Email=${user?.emailID}&token=${token.id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken
                },
            }

            dispatch(handleAddCard({ config })).then((res) => {
                if (res?.payload?.status) {
                    fetchCards()
                    toast.success('Card added successfully!')
                    setLoading(false)

                } else {
                    toast.error("'Failed to add card'")
                    setLoading(false)
                }
            }).catch((error) => {
                console.log('error', error)
                setLoading(false)
            })
        }
    }
    const handleReset = () => {
        setCardholderName("");
        setDisclaimer(false);
        setIsRead(false);
        setKey(prevKey => prevKey + 1);
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="card-shadow lg:p-5 md:p-5 sm:p-2 xs:p-2">
                    <div className="w-full">
                        <label className="label_top text-sm">Card Holder Name</label>
                        <input
                            className="w-full bg-gray-200 bg-white border input-bor-color rounded-lg py-3 px-4 mb-3 placeholder-gray"
                            type="text"
                            placeholder="Enter Card Holder Name"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                        />
                    </div>
                    <div className="w-full">
                        <label className="label_top text-sm">Card Number</label>
                        <CardNumberElement
                            key={key}
                            className="bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: 'rgba(0, 0, 0, 0.5)',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="-mx-3 md:flex">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="label_top text-sm">Expiry Date</label>
                            <CardExpiryElement
                                key={key}
                                className="bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: 'rgba(0, 0, 0, 0.5)',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                        </div>
                        <div className="md:w-1/2 px-3">
                            <label className="label_top text-sm">CVV</label>
                            <CardCvcElement
                                key={key}
                                className="bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: 'rgba(0, 0, 0, 0.5)',
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
                    <div className="flex items-center gap-2 py-3">
                        <div className="flex items-center space-x-3">
                            <input type="checkbox" className="border-gray-300 rounded h-5 w-5 cursor-pointer" onChange={() => setDisclaimer(!disclaimer)} checked={disclaimer} />
                            <p className="text-xs text-gray-500 leading-4"><b>Disclaimer: </b> Monthly Subscription Charges</p>
                        </div>
                        <a className='underline font-medium cursor-pointer' onClick={() => setIsRead(!isRead)}>Read More</a>
                    </div>
                    {/*<div className="w-full flex items-center">
                        <input
                            type="checkbox"
                            className="border-gray-300 rounded h-5 w-5 me-3"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-gray-700 font-medium leading-none">
                                Save card for future billing?
                            </h1>
                        </div>
                            </div>*/}
                </div>
                <div className="w-full flex mt-5">
                    <button type="submit" className={`px-5 ${(disclaimer && stripe) ? "cursor-pointer" : "cursor-not-allowed"} bg-primary text-white rounded-full py-2 border border-primary me-3`} disabled={!stripe || !disclaimer}>
                        Add Card
                    </button>
                    <button type='button' className=" px-5 py-2 border border-primary rounded-full text-primary" onClick={() => handleReset()}>
                        Reset
                    </button>
                </div>
            </form>
            {isRead && (
                <SubscriptionTerm isRead={isRead} setIsRead={setIsRead} />
            )}
        </>
    )
}

export default Card
