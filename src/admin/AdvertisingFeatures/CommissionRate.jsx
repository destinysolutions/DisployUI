import React, { useEffect, useState } from 'react';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { Commission } from '../../Components/Common/Common';
import { AddcommissionRate, getcommissionRate } from '../../Redux/admin/AdvertisementSlice';
import { useDispatch } from 'react-redux';
import { FaPercentage } from "react-icons/fa";
import toast from 'react-hot-toast';

export default function CommissionRate() {
    const dispatch = useDispatch()
    const [loadFirst, setLoadFirst] = useState(true);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(false);
    const [buttonType, setbuttonType] = useState({
        uptoScreens: true,
        moreThanScreens: false,
    });

    const [commissionRate, setCommissionRate] = useState({
        commissionRateID: 0,
        uptoScreens: 20,
        moreThanScreens: 20,
        upDisployBringDisploy: 0,
        upDisployBringClient: 0,
        upClientBringDisploy: 0,
        upClientBringClient: 0,
        moreDisployBringDisploy: 0,
        moreDisployBringClient: 0,
        moreClientBringDisploy: 0,
        moreClientBringClient: 0
    });

    useEffect(() => {

        if (loadFirst) {
            toast.loading('Loading ...')
            dispatch(getcommissionRate({})).then((result) => {
                const res = result?.payload?.data
                setCommissionRate({
                    commissionRateID: res?.commissionRateID,
                    uptoScreens: res?.uptoScreens,
                    moreThanScreens: res?.moreThanScreens,
                    upDisployBringDisploy: res?.upDisployBringDisploy,
                    upDisployBringClient: res?.upDisployBringClient,
                    upClientBringDisploy: res?.upClientBringDisploy,
                    upClientBringClient: res?.upClientBringClient,
                    moreDisployBringDisploy: res?.moreDisployBringDisploy,
                    moreDisployBringClient: res?.moreDisployBringClient,
                    moreClientBringDisploy: res?.moreClientBringDisploy,
                    moreClientBringClient: res?.moreClientBringClient
                })
            })
        }
        setLoadFirst(false)
    }, [loadFirst, dispatch]);

    const handleButtonClick = (buttonType) => {
        setbuttonType(prevState => ({
            ...prevState,
            uptoScreens: buttonType === 'uptoScreens',
            moreThanScreens: buttonType === 'moreThanScreens'
        }));
    };

    const toggleAccordion = (index) => {
        setOpenAccordionIndex(prevState => prevState === index ? false : index);
    };


    const handleInputChange = (field, value) => {
        setCommissionRate(prevState => {
            const numValue = parseFloat(value || 0)
            let newState = { ...prevState, };
            // [field]: numValue 
            if (field === 'upDisployBringDisploy') {
                newState = { ...newState, upDisployBringDisploy: numValue, upDisployBringClient: (100 - numValue || 100) };
            } else if (field === 'upDisployBringClient') {
                newState = { ...newState, upDisployBringClient: numValue, upDisployBringDisploy: (100 - numValue || 100) };
            } else if (field === 'upClientBringDisploy') {
                newState = { ...newState, upClientBringDisploy: numValue, upClientBringClient: (100 - numValue || 100) };
            } else if (field === 'upClientBringClient') {
                newState = { ...newState, upClientBringClient: numValue, upClientBringDisploy: (100 - numValue || 100) };
            } else if (field === 'moreDisployBringDisploy') {
                newState = { ...newState, moreDisployBringDisploy: numValue, moreDisployBringClient: (100 - numValue || 100) };
            } else if (field === 'moreDisployBringClient') {
                newState = { ...newState, moreDisployBringClient: numValue, moreDisployBringDisploy: (100 - numValue || 100) };
            } else if (field === 'moreClientBringDisploy') {
                newState = { ...newState, moreClientBringDisploy: numValue, moreClientBringClient: (100 - numValue || 100) };
            } else if (field === 'moreClientBringClient') {
                newState = { ...newState, moreClientBringClient: numValue, moreClientBringDisploy: (100 - numValue || 100) };
            }

            if (field === 'uptoScreens') {
                newState.uptoScreens = value;
                newState.moreThanScreens = value; // Set both to the same value
            }
            return newState;
        });
    };


    const onSumbit = () => {
        dispatch(AddcommissionRate(commissionRate)).then((res) => {
            setLoadFirst(true)
        })
    }

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
                                    className={`relative group flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:shadow-lg  gap-1 ${buttonType.uptoScreens ? 'bg-primary text-white' : ''}`}
                                    onClick={() => handleButtonClick('uptoScreens')}
                                > Up
                                    <input
                                        type="number"
                                        className={`bg-transparent placeholder-slate-400 focus:text-black  focus:border-0 focus:bg-black  focus:ring-0  focus:outline-none  border-b-2 border-current w-10  mx-2`}
                                        onChange={(e) => {
                                            handleInputChange('uptoScreens', e.target.value);
                                        }}
                                        value={commissionRate?.uptoScreens}
                                    />
                                    Screens
                                </button>
                                <button
                                    className={` relative group  flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm  hover:shadow-lg  gap-1 ${buttonType.moreThanScreens ? 'bg-primary text-white' : ''}`}
                                    onClick={() => handleButtonClick('moreThanScreens')}
                                >
                                    More than
                                        <input
                                            type="number"
                                            // style={{ minWidth: '100%', width: '10px', boxSizing: 'border-box' }}
                                            class="bg-transparent placeholder-slate-400 focus:text-black  focus:border-0 focus:bg-black  focus:ring-0  focus:outline-none  border-b-2 border-current w-10  mx-2 "
                                            onChange={(e) => { handleInputChange('uptoScreens', e.target.value); }}
                                            value={commissionRate?.uptoScreens}
                                        />
                                 
                                    Screens
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
                                                    <div className="flex items-center justify-center gap-3 ">
                                                        <input
                                                            className="w-20 py-0.5 appearance-none border border-[#D5E3FF] rounded  px-3"
                                                            type="number"
                                                            // placeholder='80%'
                                                            value={buttonType?.uptoScreens
                                                                ? (index === 0 ? commissionRate?.upDisployBringDisploy : commissionRate.upClientBringDisploy)
                                                                : (index === 0 ? commissionRate?.moreDisployBringDisploy : commissionRate.moreClientBringDisploy)}
                                                            onChange={(e) => {
                                                                handleInputChange(
                                                                    buttonType?.uptoScreens
                                                                        ? (index === 0 ? 'upDisployBringDisploy' : 'upClientBringDisploy')
                                                                        : (index === 0 ? 'moreDisployBringDisploy' : 'moreClientBringDisploy'),
                                                                    e.target.value
                                                                );
                                                            }}
                                                        />
                                                        <div className="border border-[#D5E3FF] rounded">
                                                            <FaPercentage
                                                                size={23}
                                                                className="text-black p-[4px]"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <label className="text-sm font-medium w-20 mr-2">Client:</label>
                                                    <div className="flex items-center justify-center gap-3 ">
                                                        <input
                                                            className="w-20 py-0.5 appearance-none border border-[#D5E3FF] rounded  px-3"
                                                            type="number"
                                                            // placeholder='80%'
                                                            value={buttonType?.uptoScreens
                                                                ? (index === 1 ? commissionRate.upClientBringClient : commissionRate.upDisployBringClient)
                                                                : (index === 1 ? commissionRate.moreClientBringClient : commissionRate.moreDisployBringClient)}
                                                            onChange={(e) => {
                                                                handleInputChange(
                                                                    buttonType?.uptoScreens
                                                                        ? (index === 1 ? 'upClientBringClient' : 'upDisployBringClient')
                                                                        : (index === 1 ? 'moreClientBringClient' : 'moreDisployBringClient'),
                                                                    e.target.value
                                                                );
                                                            }}
                                                        />
                                                        <div className="border border-[#D5E3FF] rounded">
                                                            <FaPercentage
                                                                size={23}
                                                                className="text-black p-[4px]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className='flex justify-center'>
                                <button
                                    type='button'
                                    className={`  mx-auto border-primary  border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm bg-primary text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50`}
                                    onClick={onSumbit}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
