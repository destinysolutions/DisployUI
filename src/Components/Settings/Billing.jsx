import React, { useState } from 'react'
import '../../Styles/Settings.css'
import { AiOutlinePlus } from 'react-icons/ai'
const Billing = () => {

    const [Addnewcard, setAddnewcard] = useState(false);
    const handleAddnewcard = () => {
        setAddnewcard(!Addnewcard);
    }
    return (
        <>
            <div>
                <h1 className='text-base text-primary font-medium mb-5'>Billing information</h1>
            </div>
            <div className='payment-method bg-[#EFF3FF] lg:p-5 md:p-5 sm:p-2 xs:p-2 rounded-lg'>
                <h2 className='text-lg text-primary font-medium'>Select a payment method</h2>
                {/* start Credit & Debit Cards */}
                <div className="grid grid-cols-6 gap-4 mt-5">
                    <div class="lg:col-start-2 md:col-start-1 sm:col-start-1 lg:col-span-4 md:col-span-6 sm:col-span-6 bg-white rounded-xl shadow-sm lg:p-5 md:p-5 sm:p-2 xs:p-2">
                        <h1 className='text-primary text-base'>Credi & Debit Cards</h1>
                        <ul className='mt-5'>
                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='lg:flex md:flex sm:flex xs:block items-center' >
                                        <img src="../../../Settings/logos_mastercard.png" className='mr-2' />
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>Axis Bank</h4>
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>**** **** **** 8395</h4>
                                    </div>

                                    <div>
                                        <input type='radio' name="paymentopt" value='axisbank' id="axisbankopt" className=" bg-[#D5E3FF] relative float-left -ml-[1.5rem] border-[#444] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}
                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='lg:flex md:flex sm:flex xs:block items-center'>
                                        <img src="../../../Settings/logos_visa.png" className='mr-2' />
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>HDFC Bank</h4>
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>**** **** **** 6246</h4>
                                    </div>

                                    <div>
                                        <input type='radio' name="paymentopt" value='axisbank' className="relative bg-[#D5E3FF] float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-[#444] border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}
                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='lg:flex md:flex sm:flex xs:block items-center'>
                                        <img src="../../../Settings/logos_mastercard.png" className='mr-2' />
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>Axis Bank</h4>
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>**** **** **** 8395</h4>
                                    </div>

                                    <div>
                                        <input type='radio' name="paymentopt" value='axisbank' className=" bg-[#D5E3FF] relative float-left -ml-[1.5rem] border-[#444] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}
                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='lg:flex md:flex sm:flex xs:block items-center'>
                                        <img src="../../../Settings/logos_visa.png" className='mr-2' />
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>HDFC Bank</h4>
                                        <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>**** **** **** 6246</h4>
                                    </div>

                                    <div>
                                        <input type='radio' name="paymentopt" value='axisbank' className="relative bg-[#D5E3FF] float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-[#444] border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}
                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div >
                                        <button className='flex items-center' onClick={handleAddnewcard}>
                                            <AiOutlinePlus className=' text-SlateBlue bg-[#E4E6FF] rounded-md text-2xl p-1 mr-2' />
                                            <h4 className='text-[#606060] lg:text-sm md:text-sm sm:text-sm xs:text-xs'>Add New Card</h4>
                                        </button>
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}
                        </ul>
                    </div>
                </div>
                {/* end of Credi & Debit Cards */}

                {/* Add New Card */}
                {Addnewcard && (
                    <div className="grid grid-cols-6 gap-4 mt-5 addnewcard">
                        <div class="lg:col-start-2 md:col-start-1 sm:col-start-1 lg:col-span-4 md:col-span-6 sm:col-span-6 bg-white rounded-xl shadow-sm lg:p-5 md:p-5 sm:p-2 xs:p-2">
                            <h1 className='text-primary text-base'>Add New Card</h1>
                            <div className="grid grid-cols-12 lg:gap-6 md:gap-6 sm:gap-6 xs:gap-4 mt-6">
                                <div className='col-span-12'>
                                    <div className="relative">
                                        <label className="formLabel">Name on card</label>
                                        <input type='text' placeholder='Enter Card Name' name="CardName " className="formInput" />
                                    </div>
                                </div>

                                <div className='col-span-12'>
                                    <div className="relative">
                                        <label className="formLabel">Card Number</label>
                                        <input type='text' placeholder='Enter Card Number' name="number " className="formInput" />
                                    </div>
                                </div>

                                <div className='lg:col-span-4 md:col-span-4 sm:col-span-12 xs:col-span-12'>
                                    <div className="relative">
                                        <label className="formLabel">Expiration</label>
                                        <input type='date' name="expdate " className="formInput" />
                                    </div>
                                </div>
                                <div className='lg:col-span-8 md:col-span-8 sm:col-span-12 xs:col-span-12'>
                                    <div className="relative">
                                        <label className="formLabel">CVV</label>
                                        <input type='text' name="cvv" placeholder='Enter Cvv Number' className="formInput" />
                                    </div>
                                </div>

                                <div className='col-span-12 text-center'>
                                    <button className='hover:bg-white hover:text-primary lg:text-base md:text-base sm:text-sm xs:text-xs xs:text-sm xs:text-xs lg:px-8 md:px-8 sm:px-6 xs:px-3 lg:py-3 md: md:py-3 sm:py-2  xs:py-2 border border-primary  shadow-md rounded-full bg-primary text-white '>Save card and Proceed</button>
                                </div>


                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-6 gap-4 mt-5">
                    <div class="lg:col-start-2 md:col-start-1 sm:col-start-1 lg:col-span-4 md:col-span-6 sm:col-span-6 bg-white rounded-xl shadow-sm lg:p-5 md:p-5 sm:p-2 xs:p-2">
                        <h1 className='text-primary text-base'>UIP</h1>

                        <ul className='mt-5'>
                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <img src="../../../Settings/gpay.png" className='mr-2' />
                                        <span className='text-[#606060] text-sm xs:text-xs'>Google Pay</span>
                                    </div>

                                    <div>
                                        <input type='radio' name="paymentupi" value='axisbank' className=" bg-[#D5E3FF] relative float-left -ml-[1.5rem] border-[#444] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}
                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <img src="../../../Settings/Pay.png" className='mr-2' />
                                        <span className='text-[#606060] text-sm xs:text-xs'>PhonePe</span>

                                    </div>

                                    <div>
                                        <input type='radio' name="paymentupi" value='axisbank' className="relative bg-[#D5E3FF] float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-[#444] border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}

                            <li className='paymentbox border border-[#D5E3FF] rounded-lg p-3 mb-3'>
                                <div className='flex items-center justify-between'>
                                    <div >
                                        <button className='flex items-center'>
                                            <AiOutlinePlus className=' text-SlateBlue bg-[#E4E6FF] rounded-md text-2xl p-1 mr-2' />
                                            <span className='text-[#606060] text-sm xs:text-xs'>Add New UPI</span>
                                        </button>
                                    </div>

                                </div>
                            </li>
                            { /*end of payment option */}
                        </ul>

                    </div>

                </div>
                {/* end of UPI */}

            </div>


        </>
    )
}

export default Billing
