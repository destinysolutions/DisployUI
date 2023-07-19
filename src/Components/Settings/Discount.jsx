import React from 'react'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'
import { useState } from 'react';
import { FiFilter } from 'react-icons/fi'
const Discount = () => {
    const [DiscountAccord, setshowDiscountAccord] = useState(false);
    const handleDropupClick = () => {
        setshowDiscountAccord(!DiscountAccord);
    }
    const [dis, setDiscount] = useState([
        {
            couponcodes: 'KH31-GG7GHQ',
            addeddate: '02 / 07 / 2023',
            discountedvalue: '50% Off',
            information: 'Get 50% Off on your first 5 screens',
            statusEnabled: true,
        },

    ]);
    const handleStatusToggle = (index) => {
        const updatedDiscount = [...dis];
        updatedDiscount[index].statusEnabled = !updatedDiscount[index].statusEnabled;
        setmyPlan(updatedDiscount);
    };
    return (
        <>
            <div>
                <h1 className='text-base text-primary font-medium mb-5'>Discount</h1>
            </div>
            <hr className='border-[#E4E6FF]' />

            <div className="accordions">
                <div className="section shadow-md py-3 px-5 rounded-md  border border-[#D5E3FF] flex  items-center justify-between">
                    <h1 className="text-lg text-primary font-medium">With coupon Codes</h1>
                    <div className=" flex items-center">
                        <button
                            className="showicon"
                            onClick={handleDropupClick}
                        >

                            {DiscountAccord ? (
                                <MdOutlineKeyboardArrowUp className="text-3xl" />
                            ) : (
                                <MdOutlineKeyboardArrowDown className="text-3xl" />
                            )}
                        </button>
                    </div>

                </div>

                {DiscountAccord && (
                    <>
                        <div className=' py-3'>
                            <button className=" bg-primary text-white items-center float-right  rounded-full lg:px-6 sm:px-5 mb-5 py-3 text-base sm:text-sm  hover:bg-white hover:text-primary  hover:shadow-lg hover:shadow-primary-500/50" onClick={() => showNewDiscountModal(true)}>
                                Add new Coupon
                            </button>
                            <hr className='border-[#E4E6FF] clear-both' />
                        </div>

                        <div className='clear-both overflow-x-auto'>
                            <table className=' bg-[#EFF3FF] w-full text-left rounded-xl' cellPadding={15}>
                                <thead>
                                    <tr className='border-b border-b-[#E4E6FF]'>

                                        <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center'>Coupon Codes<FiFilter className='ml-1 text-lg' /></span></th>
                                        <th className='text-[#5A5881] text-base font-semibold text-center'><span className='flex items-center justify-center'>Added Date<FiFilter className='ml-1 text-lg' /></span></th>
                                        <th className='text-[#5A5881] text-base font-semibold'><span className='flex items-center justify-center'>Discounted Value<FiFilter className='ml-1 text-lg' /></span></th>
                                        <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Information</div></th>

                                        <th className='text-[#5A5881] text-base font-semibold'><div className='flex items-center justify-center'>Status</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dis.map((discounts, index) => (
                                        <tr key={index} className='border-b border-b-[#E4E6FF]'>
                                            <td className='text-[#5E5E5E]'>{discounts.couponcodes}</td>
                                            <td className='text-[#5E5E5E] text-center'>{discounts.addeddate}</td>
                                            <td className='text-[#5E5E5E] text-center'><span style={{ background: '#E4E6FF', padding: '10px', borderRadius: '5px' }}>{discounts.discountedvalue}</span></td>
                                            <td className='text-[#5E5E5E] text-center'> {discounts.information} </td>




                                            <td className='text-center'>
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={discounts.statusEnabled}
                                                        onChange={() => handleStatusToggle(index)}
                                                    />
                                                    <div
                                                        className={`w-10 h-5 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${discounts.statusEnabled ? "bg-[#009618]" : "bg-[#9ddda7]"
                                                            }`}
                                                    ></div>
                                                </label>
                                            </td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </>
                )}

            </div >

        </>
    )
}

export default Discount
