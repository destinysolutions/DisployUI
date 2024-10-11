import React, { useEffect, useState } from 'react';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { Commission } from '../../Components/Common/Common';
import { AddcommissionRate, getcommissionRate } from '../../Redux/admin/AdvertisementSlice';
import { useDispatch } from 'react-redux';
import { FaPercentage } from "react-icons/fa";

export default function CommissionRate() {
    const dispatch = useDispatch()
    const [loadFirst, setLoadFirst] = useState(true);
    const [loading, setLoading] = useState(false);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(false);
    const [buttonType, setbuttonType] = useState({
        uptoScreens: true,
        moreThanScreens: false,
    });

    const [commissionRate, setCommissionRate] = useState({
        commissionRateID: 0,
        uptoScreens: 0,
        moreThanScreens: 0,
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
            setLoading(true)

            dispatch(getcommissionRate({})).then((result) => {
                setLoading(false)
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
                newState.uptoScreens = (value || 0);
                newState.moreThanScreens = (value || 0); // Set both to the same value
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
                        {!loading && (
                            <div className="mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg h-96">
                                <div className='flex justify-center items-center gap-3'>
                                    <button
                                        className={`relative group flex align-middle border-primary items-center float-right border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm hover:shadow-lg gap-1 ${buttonType.uptoScreens ? 'bg-primary text-white' : ''}`}
                                        onClick={() => handleButtonClick('uptoScreens')}
                                    >
                                        Up
                                        <input
                                            type="number"
                                            className={`bg-transparent  text-center placeholder-slate-400 focus:text-black focus:border-0 focus:bg-black focus:ring-0 focus:outline-none border-b-2 border-current mx-2 `}
                                            onChange={(e) => {
                                                handleInputChange('uptoScreens', e.target.value);
                                            }}
                                            value={commissionRate?.uptoScreens}
                                            style={{
                                                width: `${Math.max((String(commissionRate?.uptoScreens).length + 2) * 8, 40)}px`, // Minimum width set to 40px
                                            }}
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
                                            style={{
                                                width: `${Math.max((String(commissionRate?.uptoScreens).length + 2) * 8, 40)}px`, // Minimum width set to 40px
                                            }}
                                            class="bg-transparent text-center placeholder-slate-400 focus:text-black  focus:border-0 focus:bg-black  focus:ring-0  focus:outline-none  border-b-2 border-current w-10  mx-2 "
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
                                                    <h1 className="text-sm  font-semibold">{x?.title}</h1>
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
                        )}
                        {loading && (
                            <div className="flex text-center m-5 justify-center items-center h-96">
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="#1C64F2"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
