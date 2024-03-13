import React from 'react'
import digitalMenuLogo from "../../images/AppsImg/foods.svg";

const DigitalMenuPreview = ({ customizeData, addCategory }) => {
    return (
        <>
            <div className="mt-6">
                <div className="grid grid-cols-12 gap-4 h-full">
                    <div className="lg:col-span-12 md:col-span-12 sm:col-span-12 xs:col-span-12 shadow-md bg-white rounded-lg p-5  items-center">
                        {addCategory?.map((category) => {
                            return (
                                <div>
                                    <div className='flex justify-between items-center border-b border-black'>
                                        <span>
                                            {category?.show ? category?.categoryname : ""}
                                        </span>
                                        <img src={digitalMenuLogo} className='mb-2' />
                                    </div>
                                    <div className='mt-2 grid grid-cols-8 gap-4'>
                                        <div className='lg:col-span-4 md:col-span-4 sm:col-span-8 xs:col-span-8'>

                                            {category?.allItem?.map((item) => {
                                                return (
                                                    <div>
                                                        <div className='flex justify-center'>
                                                            <img src={digitalMenuLogo} />
                                                        </div>

                                                        <div className='flex justify-between gap-3 mx-5'>
                                                            <span>
                                                                {item?.name}
                                                            </span>
                                                            <span>
                                                                {item?.price}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DigitalMenuPreview
