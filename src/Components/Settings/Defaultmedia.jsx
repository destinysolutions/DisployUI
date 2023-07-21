import { Option } from '@material-tailwind/react';
import React from 'react'
import { useState } from "react";
import { AiOutlineCloudUpload } from 'react-icons/ai'

const Defaultmedia = () => {
    const [mediaTabs, setMediaTabs] = useState(1);
    function updateMediaTab(id) {
        setMediaTabs(id);
    }
    return (
        <>
            <div>
                <div className='Tabbutton'>
                    <ul className="flex items-center w-full">
                        <li className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium  w-1/2 text-center" onClick={() => updateMediaTab(1)} >

                            <button
                                className={mediaTabs === 1 ? "Mediatabshow mediatabactive rounded-tl-xl " : "Mediatab"}
                            >
                                Default Media
                            </button>
                        </li>
                        <li className="lg:text-lg md:text-lg sm:text-sm xs:text-sm font-medium   w-1/2 text-center" onClick={() => updateMediaTab(2)}>

                            <button
                                className={mediaTabs === 2 ? "Mediatabshow mediatabactive rounded-tr-xl" : "Mediatab"}
                            >
                                Emergency Media
                            </button>
                        </li>

                    </ul>
                </div>
                {mediaTabs === 1 && (
                    <>
                        <div>

                            <div className='grid grid-cols-12 items-center'>
                                <div className=' lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 p-3'>
                                    <div className='flex items-center justify-center mb-5 flex-wrap'>
                                        <label className='mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2'>Asset / Playing:</label>
                                        <button className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm   hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                            Asset Name
                                            <AiOutlineCloudUpload className="ml-2 text-lg" />
                                        </button>
                                    </div>
                                    <div className='text-center'>
                                        <button className='bg-white text-primary lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-6 md:px-6 sm:px-4 xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2'>Cancel</button>
                                        <button className='bg-primary text-white lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-8 md:px-8 sm:px-6 xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary'>Save</button>
                                    </div>

                                </div>
                                <div className=' lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                    <img src="../../../Settings/media1.png" className='w-full' />
                                </div>
                            </div>

                        </div>
                    </>

                )}

                {mediaTabs === 2 && (
                    <>
                        <div>

                            <div className='grid grid-cols-12 items-center'>
                                <div className=' lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 p-3'>
                                    <div className='flex items-center  mb-5 flex-wrap'>
                                        <label className='mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2'>Asset / Playing:</label>
                                        <button className="flex  items-center border-primary border rounded-full lg:pr-3 sm:px-5  py-2  text-sm   hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                            Asset Name
                                            <AiOutlineCloudUpload className="ml-2 text-lg" />
                                        </button>
                                    </div>

                                    <div className='flex items-center  mb-5 flex-wrap'>
                                        <label className='mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2'>Condition:</label>
                                        <label className="border border-[#D5E3FF] rounded-lg  text-base text-[#515151] p-3">sunny, rainy, windy, stormy</label>
                                    </div>

                                    <div className='flex items-center  mb-5 flex-wrap'>
                                        <label className='mr-3 text-primary lg:text-lg md:text-lg sm:text-base xs:text-base font-medium py-2'>Play When temp goes above:</label>
                                        <div className="formgroup border-[#D5E3FF]">
                                            <select className="formInput">
                                                <option>40C</option>
                                                <option>45C</option>
                                                <option>50C</option>
                                                <option>55C</option>
                                                <option>60C</option>
                                                <option>Custom</option>
                                            </select>
                                        </div>
                                    </div>



                                    <div className=''>
                                        <button className='bg-white text-primary lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-6 md:px-6 sm:px-4 xs:px-4 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2'>Cancel</button>
                                        <button className='bg-primary text-white lg:text-base md:text-base sm:text-sm xs:text-sm lg:px-8 md:px-8 sm:px-6 xs:px-6 lg:py-3 md:py-3 sm:py-2 xs:py-2 border border-primary  shadow-md rounded-full hover:bg-white hover:text-primary'>Save</button>
                                    </div>

                                </div>
                                <div className=' lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                    <img src="../../../Settings/media2.png" className='w-full' />
                                </div>
                            </div>

                        </div>
                    </>

                )}


            </div>
        </>
    )
}

export default Defaultmedia