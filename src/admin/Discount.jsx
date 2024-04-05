import React, { useState } from 'react'
import { BiSolidDiscount } from "react-icons/bi";
import AddEditDiscount from './Discount/AddEditDiscount';
import ScreenDiscount from './Discount/ScreenDiscount';
import FeatureDiscount from './Discount/FeatureDiscount';
import TrialPeriodDiscount from './Discount/TrialPeriodDiscount';
import CustomDiscount from './Discount/CustomDiscount';
const Discount = () => {
    const [openModal, setOpenModal] = useState(false)
    const [discount, setDiscount] = useState("")
    const togglemodal = () => {
        setOpenModal(!openModal)
    }


    return (
        <>
            {discount === "" && (
                <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
                    <div className="flex items-center justify-between mx-2 mb-5">
                        <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
                            Discount
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                className="flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                onClick={() => setOpenModal(true)}
                            >
                                <BiSolidDiscount className="text-2xl mr-1" />
                                Add New Discount
                            </button>
                        </div>
                    </div>
                    <div className="rounded-xl mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg">
                        <table
                            className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                            cellPadding={15}
                        >
                            <thead className="items-center table-head-bg">
                                <tr>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Plan Name
                                    </th>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Reason
                                    </th>
                                    <th className="px-5 py-3 text-left text-lg font-semibold text-gray-900 ">
                                        Action
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 bg-white">
                                    <td className="px-5 py-3 text-lg">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            Lavern Laboy
                                        </p>
                                    </td>
                                    <td className="px-5 py-3 text-lg">
                                        <p className="text-gray-900 whitespace-no-wrap">$5875</p>
                                    </td>
                                    <td className="px-5 py-3 text-lg">
                                        <span className="relative inline-block px-3 py-1 font-semibold bg-orange-200 text-orange-400 leading-tight rounded-full">
                                            Pending
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {discount === "Screen" && (
                <ScreenDiscount discount={discount} setDiscount={setDiscount}/>
            )}
            {discount === "Features" && (
                <FeatureDiscount discount={discount} setDiscount={setDiscount}/>
            )}
            {discount === "Trial Period" && (
                <TrialPeriodDiscount discount={discount} setDiscount={setDiscount}/>
            )}
            {discount === "Custom" && (
                <CustomDiscount discount={discount} setDiscount={setDiscount}/>
            )}
            {openModal && (
                <AddEditDiscount togglemodal={togglemodal} setDiscount={setDiscount} discount={discount} />
            )}
        </>
    )
}

export default Discount
