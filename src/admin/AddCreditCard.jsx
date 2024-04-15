import React from 'react'
import { useForm } from 'react-hook-form';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const AddCreditCard = ({ onSubmit, toggleModal }) => {
    const { register, handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors } } = useForm();
    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add New Card
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    toggleModal();
                                }}
                            />
                        </div>
                        {/* Modal body */}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='p-4 md:p-5'>
                                <div className="grid gap-4 mb-2 grid-cols-2">
                                    <div className="col-span-2 sm:col-span-2">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Card holder Name</label>
                                        <div className='flex flex-col'>
                                            <div className='flex gap-2'>
                                                <input
                                                    type="number"
                                                    {...register('cardName', {
                                                        required: 'Card Name is required'
                                                    })}
                                                    name="cardName"
                                                    id="cardName"
                                                    placeholder="Enter Card Name"
                                                    className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="" />
                                            </div>
                                            {errors.cardName && (
                                                <span className="error">{errors.cardName.message}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-4 mb-2 grid-cols-2">
                                    <div className="col-span-2 sm:col-span-2">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Card Number</label>
                                        <div className='flex flex-col'>
                                            <div className='flex gap-2'>
                                                <input type="number"
                                                    {...register('cardNumber', {
                                                        required: 'Card Number is required'
                                                    })}
                                                    name="cardNumber"
                                                    id="cardNumber"
                                                    className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Card Number" required="" />
                                            </div>
                                            {errors.cardNumber && (
                                                <span className="error">{errors.cardNumber.message}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-4 mb-2 grid-cols-2">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expiration</label>
                                        <input type="text" {...register('expire', { required: 'Expire date is required' })} name="expire" id="expire" className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="mm / yyyy" required="" />
                                        {errors.expire && (
                                            <span className="error">{errors.expire.message}</span>
                                        )}
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CVV</label>
                                        <input type="text" {...register('cvv', { required: 'Cvv is required' })} name="cvv" id="cvv" className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter Cvv Number" required="" />
                                        {errors.cvv && (
                                            <span className="error">{errors.cvv.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center p-3 md:p-3 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                    <button
                                        className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                        type="submit"
                                    >
                                        Save card and Procced
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCreditCard
