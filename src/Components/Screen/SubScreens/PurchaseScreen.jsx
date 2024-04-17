import { round } from 'lodash';
import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { VERIFY_COUPON } from '../../../Pages/Api';
import { useSelector } from 'react-redux';
import { verifyDiscountCoupon } from '../../../Redux/AdminSettingSlice';
import { useDispatch } from 'react-redux';

const PurchaseScreen = ({ openScreen, setOpenScreen, setAddScreen, addScreen, handlePay, discountCoupon, setDiscountCoupon, showError, setShowError ,setDiscount, discount}) => {
    const { token } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch()
    const [showDiscount, setShowDiscount] = useState(false);
    const handleVerify = () => {

        const Params = {
            "discountCode": discountCoupon,
            "featureKey": "Screen",
            "currentDate": new Date().toISOString().split('T')[0],
            "amount": round((addScreen * 10), 2),
            "items": addScreen
          }
          console.log('Params', Params)

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: VERIFY_COUPON,
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
            data: JSON.stringify(Params),
        };
        dispatch(verifyDiscountCoupon({ config })).then((res) => {
            console.log('res', res)
            if (res?.payload?.status) {
                setDiscount(res?.payload?.data)
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
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
        >
            <div className="relative p-4 w-full max-w-xl max-h-full">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Purchase Screen
                        </h3>
                        <AiOutlineCloseCircle
                            className="text-4xl text-primary cursor-pointer"
                            onClick={() => {
                                setOpenScreen(!openScreen);
                            }}
                        />
                    </div>
                    <div className="p-4 md:p-5">
                        <div className='flex flex-col gap-3 mb-5'>
                            <span className='flex justify-center items-center font-semibold text-xl'>
                                Enter the Screen required
                            </span>

                            <div className='flex items-center justify-between'>
                                <p>Add Screen</p>
                                <div className='flex items-center gap-1 ml-6'>
                                    <input type='number'
                                        className="relative border border-black rounded-md p-2 w-24"
                                        onChange={(e) => {
                                            if (e.target.value <= 0) {
                                                setAddScreen(addScreen)
                                            } else {
                                                setAddScreen(e.target.value)
                                            }
                                        }
                                        }
                                        value={addScreen}
                                    />
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <p>Cost</p>
                                <div className='flex items-center gap-1'>
                                    <label>${round((addScreen * 10), 2)}</label>
                                </div>
                            </div>
                            {discount && (
                                <div className='flex items-center justify-between'>
                                <p>Discount</p>
                                <div className='flex items-center gap-1'>
                                    <label>${discount}</label>
                                </div>
                            </div>
                            )}
                            <div className='flex justify-between items-center gap-4 border-t border-black dark:border-gray-600'>
                                <div className='mt-3'>
                                    <label>Total Price:</label>
                                </div>
                                <div>
                                    <label>${round((addScreen * 10), 2) - discount}</label>
                                </div>
                            </div>
                            <div className='flex items-center justify-start'>
                                <h1 className='cursor-pointer hover:underline' onClick={() => setShowDiscount(!showDiscount)}>Have a coupon code?</h1>
                            </div>
                            {showDiscount && (
                                <>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-5'>
                                            <input
                                                type='text'
                                                placeholder='Discount Coupon'
                                                className="relative border border-black rounded-md p-2 w-48"
                                                onChange={(e) => setDiscountCoupon(e.target.value.toUpperCase())}
                                                value={discountCoupon}
                                            />
                                            <button
                                                className={`bg-primary text-white text-base px-5 py-2 border border-primary shadow-md rounded-full ${discountCoupon?.length === 0 ? "cursor-not-allowed" : "cursor-pointer"}`}
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

                        </div>

                        <div className="flex items-center justify-center p-2 md:p-2 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                            <button
                                className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                type="button"
                                onClick={() => setOpenScreen(!openScreen)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                type="button"
                                onClick={() => handlePay()}
                            >
                                Pay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseScreen
