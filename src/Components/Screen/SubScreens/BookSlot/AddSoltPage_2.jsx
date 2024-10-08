import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { DisployScreens, Industry } from '../../../Common/Common';
import { useDispatch } from 'react-redux';
import { getIndustry } from '../../../../Redux/CommonSlice';
import { useSelector } from 'react-redux';
import { getPurposeScreens } from '../../../../Redux/admin/AdvertisementSlice';
import { IoIosArrowDown } from 'react-icons/io';

export default function AddSoltPage_2({ setPage, countries, page, setallSlateDetails, allSlateDetails, UserName }) {
    const dispatch = useDispatch()
    const store = useSelector((state) => state.root.common);
    const Purpose = useSelector((state) => state.root.advertisementData);
    const [Error, setError] = useState(false);
    const [includeoption, setincludeoption] = useState(null);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    useEffect(() => {
        dispatch(getIndustry({}))
        dispatch(getPurposeScreens({}))
    }, []);

    const handleClick = (label) => {
        setallSlateDetails((prev) => {
            const isSelected = prev.selecteScreens.includes(label);
            return {
                ...prev,
                selecteScreens: isSelected
                    ? prev.selecteScreens.filter((item) => item !== label)
                    : [...prev.selecteScreens, label]
            };
        });
    };

    const onsumbitPage2 = () => {
        if (allSlateDetails?.Industry === null || (allSlateDetails?.refCode === 'Yes' && !allSlateDetails?.refVale)) {
            return setError(true)
        }
        setPage(page + 1)
    }

    const [selectedOption, setSelectedOption] = useState(null);

    // Prepare combined options for Select
    const options1 = store?.Industry?.flatMap(item => [
        {
            value: item.industryID,
            label: (
                <div className='flex items-center justify-between' style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginLeft: '8px' }}>{item.industryName}</span>
                    <IoIosArrowDown onClicsetMenuIsOpenk={() => setincludeoption(true)} />
                </div>
            ),
            isIndustry: true // Indicate this is an industry option
        },
        ...item.industryInclude.map(include => ({
            value: `${item.industryID},${include.industryIncludeID}`,
            label: `${item.industryName} - ${include.category}`, // Nested format
            isIndustry: false // Indicate this is a category option
        }))
    ]) || [];

    const options = store?.Industry?.flatMap((item, index) => {

        const industryOption = {
            value: item?.industryID,
            label: (
                <div className='flex items-center justify-between' >
                    <span className=' w-full' style={{ marginLeft: '8px' }} onClick={() => { setMenuIsOpen(false) }}>{item?.industryName}</span>

                    <IoIosArrowDown className='h-5 w-5' onClick={() => { setincludeoption(includeoption === index ? null : index); setMenuIsOpen(true) }} />
                </div>
            ),
            isIndustry: true
        };

        const result = [industryOption];

        // Show include options if this industry is open
        if (includeoption === index) {
            const includeOptions = item.industryInclude.map(include => ({
                value: include.industryIncludeID,
                label: (<div className='w-full ' onClick={() => { setMenuIsOpen(false) }}>{`${item.industryName} - ${include.category}`}</div>),
                isIndustry: false
            }));
            result.push(...includeOptions);
        }

        return result; // Return the combined options
    }) || [];


    const handleChange = (option) => {
        setSelectedOption(option);
        setallSlateDetails({ ...allSlateDetails, Industry: option })
        // You can also handle further logic based on selected option
        console.log('Selected:', option);
    };
    return (
        <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[1000px] md:w-[700px] w-full h-[75vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
                <div className="text-2xl font-semibold">Book Slot</div>
                <div className="grid grid-cols-4 gap-4 w-full ">
                    <div className="col-span-4">
                        <div className="rounded-lg shadow-md bg-white p-5 flex flex-col gap-4 h-full">
                            <div className="w-7/12 flex flex-col justify-center m-auto">
                                <h3 className="text-center font-bold">Hi {UserName},</h3>
                                <p className="text-sm text-center"> Before we begin, please take a moment to share some details about your organization. This will help us tailor the screen experience to perfectly suit your needs.</p>
                            </div>
                            <div className="relative w-full col-span-2">

                                <Select
                                    placeholder='Select Industry'
                                    value={selectedOption}
                                    onChange={handleChange}
                                    options={[...options, { value: "others", label: "Others" }]}
                                    isClearable={true}
                                    menuIsOpen={menuIsOpen}
                                    // onFocus={handleMenuOpen} 
                                    // onBlur={handleMenuClose} 
                                    onMenuOpen={() => setMenuIsOpen(true)}
                                // onMenuClose={() => setMenuIsOpen(false)}
                                />
                                {Error && !allSlateDetails?.Industry && (
                                    <p className="text-red-600 text-sm font-semibold">This field is Required.</p>
                                )}
                            </div>
                            {allSlateDetails?.Industry?.label === 'Others' && (
                                <div className='p-0 m-auto my-2'>
                                    <input
                                        type="text"
                                        placeholder='Enter Text'
                                        className={`bg-transparent placeholder-slate-400 focus:text-black border-black  focus:border-0 focus:bg-black  focus:ring-0  focus:outline-none  border-b-2 border-current w-72 p-2`}
                                        onChange={(e) => {
                                            setallSlateDetails({ ...allSlateDetails, otherIndustry: e.target.value })
                                        }}
                                        value={allSlateDetails?.otherIndustry}
                                    />
                                </div>
                            )}

                            <div className="flex flex-col justify-center">
                                <p className="text-center mb-3">Purpose of using Disploy Screens</p>
                                <div className="m-auto  flex justify-center flex-wrap my-3">
                                    {Purpose?.data?.length > 0 && Purpose?.data?.map((label, index) => (
                                        <button
                                            className={`border m-0 border-primary px-3 py-1 mr-2 mb-2 rounded-full ${allSlateDetails?.selecteScreens?.includes(label?.purposeID) && "bg-SlateBlue border-white"} `}
                                            key={index}
                                            onClick={() => handleClick(label?.purposeID)}
                                        >
                                            {label?.purposeName}
                                        </button>
                                    ))}
                                    <button
                                        className={`border m-0 border-primary px-3 py-1 mr-2 mb-2 rounded-full ${allSlateDetails?.selecteScreens?.includes('others') && "bg-SlateBlue border-white"} `}

                                        onClick={() => handleClick('others')}
                                    >
                                        Others
                                    </button>
                                </div>
                                {allSlateDetails?.selecteScreens?.some((x) => x === "others") && (
                                    <div className='p-0 m-auto my-2'>
                                        <input
                                            type="text"
                                            placeholder='Enter Text'
                                            className={`bg-transparent placeholder-slate-400 focus:text-black border-black  focus:border-0 focus:bg-black  focus:ring-0  focus:outline-none  border-b-2 border-current w-72 p-2`}
                                            // style={{ outline: 'none', }}
                                            onChange={(e) => {
                                                setallSlateDetails({ ...allSlateDetails, purposeText: e.target.value })
                                            }}
                                            value={allSlateDetails?.purposeText}

                                        />
                                    </div>
                                )}

                                <div className="my-5  flex items-center gap-3  m-auto ">
                                    <label className="text-base font-medium">Referral Code:</label>
                                    <div className="flex justify-center items-center  gap-4 m-auto ">
                                        {allSlateDetails?.refCode === "Yes" && (
                                            <div>
                                                <input
                                                    className="block w-60 p-2 text-gray-900 border border-gray-300  bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                    type="number"
                                                    value={allSlateDetails?.refVale}
                                                    // placeholder='Enter Refernce Code'
                                                    onChange={(e) => {
                                                        setallSlateDetails({ ...allSlateDetails, refVale: e.target.value });
                                                    }}
                                                />
                                                {Error && !allSlateDetails?.refVale && (
                                                    <p className="text-red-600 text-sm font-semibold text-center ">This field is Required.</p>
                                                )}
                                            </div>
                                        )}
                                        <div className=''>
                                            <div className="flex">
                                                <div className="ml-2 flex items-center">
                                                    <input
                                                        type="radio"
                                                        value={allSlateDetails?.refCode}
                                                        checked={allSlateDetails?.refCode === "Yes"}
                                                        name="Cel"
                                                        id='Yes'
                                                        onChange={() => {
                                                            setallSlateDetails({ ...allSlateDetails, refCode: "Yes" });
                                                        }}
                                                    />
                                                    <label for='Yes' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                                        Referral Code
                                                    </label>
                                                </div>

                                                <div className="ml-3 flex items-center">
                                                    <input
                                                        id='NO'
                                                        type="radio"
                                                        value={allSlateDetails?.refCode}
                                                        checked={allSlateDetails?.refCode === "NO"}
                                                        name="Cel"
                                                        onChange={() => {
                                                            setallSlateDetails({ ...allSlateDetails, refCode: "NO" });

                                                        }}
                                                    />
                                                    <label for='NO' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                                        I don't have
                                                    </label>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className='m-auto'>
                                    <label className="custom-label flex items-center justify-center">
                                        <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded w-4 h-4 flex items-center justify-center mr-2">
                                            <input type="checkbox" name="terms"
                                                onChange={(e) => {
                                                    setallSlateDetails({ ...allSlateDetails, terms: e.target.checked });
                                                }}
                                                checked={allSlateDetails?.terms}
                                            />
                                        </div>
                                        <p className="">I have read the terms and agreement of Disploy</p>
                                    </label>
                                    {Error && !allSlateDetails?.terms && (
                                        <p className="text-red-600 text-sm font-semibold text-center my-1">This field is Required.</p>
                                    )}
                                </div>
                            </div>

                            <div className="w-full h-full">
                                <div className="flex justify-end h-full items-end">
                                    <button
                                        className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={allSlateDetails?.terms === false}
                                        className={`sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 ${!allSlateDetails?.terms ? 'cursor-not-allowed  opacity-50' : ""}`}
                                        onClick={onsumbitPage2}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}
