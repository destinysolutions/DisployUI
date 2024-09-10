import React, { useState } from 'react';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { Commission } from '../../Components/Common/Common';

export default function CommissionRate() {
    const [loading, setLoading] = useState(false);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(false);
    const [commissionRate, setCommissionRate] = useState({
        commissionRateID: 0,
        uptoScreens: true,
        moreThanScreens: false,
        upDisployBringDisploy: 0,
        upDisployBringClient: 0,
        upClientBringDisploy: 0,
        upClientBringClient: 0,
        moreDisployBringDisploy: 0,
        moreDisployBringClient: 0,
        moreClientBringDisploy: 0,
        moreClientBringClient: 0
    });

    const handleButtonClick = (buttonType) => {
        setCommissionRate(prevState => ({
            ...prevState,
            uptoScreens: buttonType === 'uptoScreens',
            moreThanScreens: buttonType === 'moreThanScreens'
        }));
    };

    const toggleAccordion = (index) => {
        setOpenAccordionIndex(prevState => prevState === index ? false : index);
    };

    const handleInputChange = (field, value) => {
        console.log('value :>> ', value);
        console.log('field :>> ', field);

        setCommissionRate(prevState => {
            const newState = {
                ...prevState,
                [field]: value
            };
            console.log('New commissionRate :>> ', newState);
            return newState;
        });
    };


    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
                <div className='border-b border-gray pb-3'>
                    <h2 className='font-semibold'>Commission Rate</h2>
                </div>

                <div className="clear-both">
                    <div className="bg-white rounded-xl mt-8 shadow screen-section">
                        <div className="mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg h-96">
                            <div className='flex justify-center items-center gap-3'>
                                <button
                                    className={`relative group flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1 ${commissionRate.uptoScreens ? 'bg-primary text-white' : ''}`}
                                    onClick={() => handleButtonClick('uptoScreens')}
                                >
                                    <input
                                        type="number"
                                        class="bg-transparent placeholder-transparent focus:outline-none focus:bg-transparent border-b-2 border-zinc-50 w-12 placeholder-gray-500"
                                        placeholder=" "
                                    />
                                    Up 20 Screens
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </button>
                                <button
                                    className={`relative group flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1 ${commissionRate.moreThanScreens ? 'bg-primary text-white' : ''}`}
                                    onClick={() => handleButtonClick('moreThanScreens')}
                                >
                                    More than 20 Screens
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </button>
                            </div>

                            <div>
                                {Commission?.map((x, index) => (
                                    <div key={index}
                                        className="accordions shadow-md p-5 bg-blue-100 border border-blue-400 rounded-lg m-4">
                                        <div className="section lg:flex md:flex sm:block items-center justify-between">
                                            <div className="flex gap-2 items-center">
                                                <h1 className="text-sm capitalize font-semibold">{x?.title}</h1>
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <button onClick={() => toggleAccordion(index)}>
                                                    {openAccordionIndex[index] ? (
                                                        <IoIosArrowDropup className="text-3xl" />
                                                    ) : (
                                                        <IoIosArrowDropdown className="text-3xl" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {openAccordionIndex === index && (
                                            <div className="overflow-x-scroll sc-scrollbar px-2 mt-2 bg-white">
                                                <div className='flex items-center gap-1 my-2'>
                                                    <label className="text-sm font-medium w-20 mr-2">Disploy:</label>
                                                    <div>
                                                        <input
                                                            placeholder='80%'
                                                            className="block w-20 p-1 text-gray-900 border border-gray-300 bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                            type="number"
                                                            value={commissionRate?.uptoScreens
                                                                ? (index === 0 ? commissionRate.upDisployBringDisploy : commissionRate.upClientBringDisploy)
                                                                : (index === 0 ? commissionRate.moreDisployBringDisploy : commissionRate.moreClientBringDisploy)}
                                                            onChange={(e) => {
                                                                handleInputChange(
                                                                    commissionRate?.uptoScreens
                                                                        ? (index === 0 ? 'upDisployBringDisploy' : 'upClientBringDisploy')
                                                                        : (index === 0 ? 'moreDisployBringDisploy' : 'moreClientBringDisploy'),
                                                                    e.target.value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <label className="text-sm font-medium w-20 mr-2">Client:</label>
                                                    <div>
                                                        <input
                                                            placeholder='20%'
                                                            className="block w-20 p-1 text-gray-900 border border-gray-300 bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                            type="number"
                                                            value={commissionRate?.uptoScreens
                                                                ? (index === 1 ? commissionRate.upClientBringClient : commissionRate.upDisployBringClient)
                                                                : (index === 1 ? commissionRate.moreClientBringClient : commissionRate.moreDisployBringClient)}
                                                            onChange={(e) => {
                                                                handleInputChange(
                                                                    commissionRate?.uptoScreens
                                                                        ? (index === 1 ? 'upClientBringClient' : 'upDisployBringClient')
                                                                        : (index === 1 ? 'moreClientBringClient' : 'moreDisployBringClient'),
                                                                    e.target.value
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
