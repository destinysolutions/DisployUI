import React from 'react'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai'
import '../../Styles/Settings.css'
const Discount = () => {
    const [activeSection1, setActiveSection1] = useState(null);
    const [activeSection2, setActiveSection2] = useState(null);

    const handleDropupClick = (sectionNumber) => {
        setActiveSection1(sectionNumber === 1 ? (activeSection1 === 1 ? null : 1) : null);
        setActiveSection2(sectionNumber === 2 ? (activeSection2 === 2 ? null : 2) : null);
    };
    {/* withdiscount*/ }
    const [dis, setDiscount] = useState([
        {
            id: 1,
            couponcodes: 'KH31-GG7GHQ',
            addeddate: '02 / 07 / 2023',
            discountedvalue: '50% Off',
            information: 'Get 50% Off on your first 5 screens',
            statusEnabled: true,
        },
        {
            id: 2,
            couponcodes: 'GG7GHQ',
            addeddate: '02 / 07 / 2023',
            discountedvalue: '50% Off',
            information: 'Get 50% Off on your first 5 screens',
            statusEnabled: false,
        },
    ]);

    {/* without discount*/ }
    const [withoutdis, setWithoutdis] = useState([
        {
            id: 1,
            discount: '25% off Perscreen',
            addeddate: '02 / 07 / 2023',
            discountedvalue: '50% Off',
            information: 'Get 50% Off on your first 5 screens',
            statusEnabled: true,
        },
        {
            id: 2,
            discount: '50% off Perscreen',
            addeddate: '02 / 07 / 2023',
            discountedvalue: '50% Off',
            information: 'Get 50% Off on your first 5 screens',
            statusEnabled: true,
        },
        {
            id: 3,
            discount: '42% off Perscreen',
            addeddate: '02 / 07 / 2023',
            discountedvalue: '50% Off',
            information: '50% Off',
            statusEnabled: true,
        },
        {
            id: 3,
            discount: 'Custom',
            addeddate: '02 / 07 / 2023',
            discountedvalue: '50% Off',
            information: '50% Off',
            statusEnabled: true,
        },

    ]);

    const handleStatusToggle = (index) => {
        const updatedDiscount = [...dis];
        updatedDiscount[index].statusEnabled = !updatedDiscount[index].statusEnabled;
        setDiscount(updatedDiscount);
    };
    {/*New Discount Model */ }
    const [Newcopon, setShowcopon] = useState(false);
    const setShowcoponModel = () => {
        setShowcopon(!Newcopon);
    }
    {/*model tooltip */ }
    const [couponTooltipVisible, setcouponTooltipVisible] = useState(false);
    return (
        <>
            <div >
                <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
                    <h1 className='text-base text-primary font-semibold'>Discount</h1>
                </div>
                <hr className='border-[#E4E6FF]' />
                <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2 mt-1'>
                    <div className="accordions">
                        <div className="section py-3 px-5 rounded-md  border border-[#D5E3FF] flex  items-center justify-between cursor-pointer" onClick={() => handleDropupClick(1)}>
                            <h1 className="text-lg text-primary font-medium">With coupon Codes</h1>
                            <div className=" flex items-center">
                                <button
                                    className="showicon"

                                >

                                    {activeSection1 ? (
                                        <MdOutlineKeyboardArrowUp className="text-3xl" />
                                    ) : (
                                        <MdOutlineKeyboardArrowDown className="text-3xl" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {activeSection1 === 1 && (
                            <>
                                <div className='border border-[#E4E6FF] rounded-bl-xl rounded-br-xl'>
                                    <div className='my-3 text-right'>
                                        <button className="  bg-primary text-white items-center  rounded-full lg:px-6 sm:px-5 py-3 text-base sm:text-sm  hover:bg-white hover:text-primary  hover:shadow-lg hover:shadow-primary-500/50 border border-primary" onClick={() => setShowcoponModel(true)}>
                                            Add new Coupon
                                        </button>

                                    </div>
                                    <hr className='border-[#E4E6FF]' />
                                    <div className='overflow-x-auto'>
                                        <table className='w-full text-left rounded-xl' cellPadding={15}>
                                            <thead>
                                                <tr className='border-b border-b-[#E4E6FF]'>
                                                    <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center'>Coupon Codes</span></th>
                                                    <th className='text-[#5A5881] text-base font-semibold text-center'><span className='flex items-center justify-center'>Added Date</span></th>
                                                    <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center justify-center'>Discounted Value</span></th>
                                                    <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Information</div></th>
                                                    <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Status</div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dis.map((discounts, index) => (
                                                    <tr key={index} className='border-b border-b-[#E4E6FF]'>
                                                        <td className='text-[#5E5E5E]'>{discounts.couponcodes}</td>
                                                        <td className='text-[#5E5E5E] text-center lg:text-base md:text-sm sm:text-sm xs:text-xs whitespace-nowrap'><span style={{ background: '#E4E6FF', padding: '10px', borderRadius: '5px' }}>{discounts.addeddate}</span></td>
                                                        <td className='text-[#5E5E5E] text-center text-center lg:text-base md:text-sm sm:text-sm xs:text-xs whitespace-nowrap'><span style={{ background: '#E4E6FF', padding: '10px', borderRadius: '5px' }}>{discounts.discountedvalue}</span></td>
                                                        <td className='text-[#5E5E5E] text-center'><span style={{ fontSize: '12px' }}> {discounts.information}</span> </td>
                                                        <td className='text-center'>
                                                            <label className="inline-flex relative items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={discounts.statusEnabled}
                                                                    onChange={() => handleStatusToggle(index)}
                                                                />
                                                                <div
                                                                    className={`w-10 h-5 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${discounts.statusEnabled ? "bg-[#009618]" : "bg-gray"
                                                                        }`}
                                                                ></div>
                                                            </label>
                                                        </td>


                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </>
                        )}

                    </div>
                    {/*end of accordions */}
                    <div className="accordions mt-3">
                        <div className="section py-3 px-5 rounded-md  border border-[#D5E3FF] flex  items-center justify-between cursor-pointer" onClick={() => handleDropupClick(2)}>
                            <h1 className="text-lg text-primary font-medium">With coupon Codes</h1>
                            <div className=" flex items-center">
                                <button
                                    className="showicon" >

                                    {activeSection2 ? (
                                        <MdOutlineKeyboardArrowUp className="text-3xl" />
                                    ) : (
                                        <MdOutlineKeyboardArrowDown className="text-3xl" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {activeSection2 === 2 && (
                            <>
                                <div className='border border-[#E4E6FF] rounded-bl-xl rounded-br-xl mt-3'>
                                    <div className='my-3 text-right'>
                                        <button className=" bg-primary text-white items-center  rounded-full lg:px-6 sm:px-5 py-3 text-base sm:text-sm  hover:bg-white hover:text-primary  hover:shadow-lg hover:shadow-primary-500/50 border border-primary" onClick={() => showNewDiscountModal(true)}>
                                            Add New Discount
                                        </button>

                                    </div>
                                    <hr className='border-[#E4E6FF]' />
                                    <div className='overflow-x-auto'>
                                        <table className='w-full text-left rounded-xl' cellPadding={15}>
                                            <thead>
                                                <tr className='border-b border-b-[#E4E6FF]'>
                                                    <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center'>Discount</span></th>
                                                    <th className='text-[#5A5881] text-base font-semibold text-center'><span className='flex items-center justify-center'>Added Date</span></th>
                                                    <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center justify-center'>Discounted Value</span></th>
                                                    <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Information</div></th>
                                                    <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Status</div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {withoutdis.map((withoutdiscounts, index) => (
                                                    <tr key={index} className='border-b border-b-[#E4E6FF]'>
                                                        <td className='text-[#5E5E5E] flex items-center'>{withoutdiscounts.discount} <FiEdit2 className='ml-2  text-sm d' /></td>
                                                        <td className='text-[#5E5E5E] text-center'><span style={{ background: '#E4E6FF', padding: '10px', borderRadius: '5px', fontSize: '16px' }}>{withoutdiscounts.addeddate} </span></td>
                                                        <td className='text-[#5E5E5E] text-center'><span style={{ background: '#E4E6FF', padding: '10px', borderRadius: '5px' }}>{withoutdiscounts.discountedvalue}</span></td>
                                                        <td className='text-[#5E5E5E] text-center'><span style={{ fontSize: '12px' }}> {withoutdiscounts.information}</span> </td>
                                                        <td className='text-center'>
                                                            <label className="inline-flex relative items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={withoutdiscounts.statusEnabled}
                                                                    onChange={() => handleStatusToggle(index)}
                                                                />
                                                                <div
                                                                    className={`w-10 h-5 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${withoutdiscounts.statusEnabled ? "bg-[#009618]" : "bg-gray"
                                                                        }`}
                                                                ></div>
                                                            </label>
                                                        </td>


                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </>
                        )}

                    </div>
                    {/*end of accordions */}
                </div>
            </div>
            {/*Add new Coupon */}

            {Newcopon && (
                <>
                    <div className="backdrop">
                        <div className="user-model">

                            <div className="hours-heading flex justify-between items-center p-5 border-b border-gray sticky top-0 shadow-md z-[99] bg-white">
                                <h1 className='text-lg font-medium text-primary'>Add New Custom Plan 11</h1>
                                <AiOutlineCloseCircle className='text-4xl text-primary cursor-pointer' onClick={() => setShowcoponModel(false)} />
                            </div>
                            <hr className='border-gray' />
                            <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                                <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl">
                                    <div className='formgroup relative'>
                                        <input type='text' placeholder='Enter New Discount Name' className='formInput relative w-full' />
                                        <AiFillCheckCircle className='text-green text-2xl absolute right-2 top-4' />
                                    </div>

                                    <div className='formgroup relative mt-3'>
                                        <div className='relative'>
                                            <input type='text' placeholder='Enter New Discount Name' className='formInput relative w-full' />
                                            <AiFillCloseCircle className='text-red text-2xl absolute right-2 top-4' onMouseEnter={() => setcouponTooltipVisible(true)}
                                                onMouseLeave={() => setcouponTooltipVisible(false)} />
                                        </div>

                                        {couponTooltipVisible && (<div
                                            id="coupon-tooltip-bottom"
                                            role="tooltip"
                                            className="absolute z-[99] visible inline-block px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm opacity-100 tooltip bottom-[-30px] right-2  dark:bg-gray-700">
                                            This Coupon is Already exist

                                        </div>
                                        )}
                                    </div>

                                    <div className='formgroup relative mt-3'>
                                        <div className='lg:flex md:flex sm:block xs:block items-center justify-between'>
                                            <div><label className='text-primary tet-base font-medium'>Discounted Value:</label></div>
                                            <div>
                                                <div className='ml-10  flex items-center planformgroup'>
                                                    <input type='radio' checked name="disval" value='disval' id="disval" className=" bg-lightgray mr-2  relative float-left -ml-[1.5rem] border-[#444] mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                                    <label className='text-primary tet-base font-medium'>%</label>
                                                    <input type='text' placeholder='25' className='w-14 text-center mx-3 py-2 formInput' />
                                                    <label className='text-primary tet-base font-medium'>%</label>
                                                </div>

                                                <div className='ml-10  flex mt-2 items-center planformgroup'>
                                                    <input type='radio' name="disval" value='disval' id="disval" className=" bg-lightgray mr-2  relative float-left -ml-[1.5rem] border-[#444] mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                                    <label className='text-primary text-base font-medium exact-val'>Exact values</label>
                                                    <input type='text' placeholder='100' className='w-14 text-center mx-3 py-2 formInput' />
                                                    <label className='text-primary tet-base font-medium'>Rs</label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className='formgroup relative mt-3'>
                                        <p className='text-base'><span className='text-primary text-base font-semibold'>Reason:</span> Get 50% Off on your first 5 screens </p>
                                    </div>

                                    <div className=' text-center  mt-5'>
                                        <button className='bg-white text-primary text-base lg:px-6 md:px-6 sm:px-3  xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-1 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2' onClick={() => setshowuserModal(false)}>Cancel</button>
                                        <button className='bg-primary text-white text-base lg:px-8 md:px-8 sm:px-4  xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-1 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary'>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}


        </>
    )
}

export default Discount
