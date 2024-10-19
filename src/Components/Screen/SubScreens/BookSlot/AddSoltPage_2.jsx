import React, { useEffect, useRef, useState } from 'react'
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { IoIosArrowDown } from 'react-icons/io';
import logo from "../../../../images/DisployImg/Black-Logo2.png";
import { getPurposeScreens, getVaildReferralcode } from '../../../../Redux/admin/AdvertisementSlice';
import toast from 'react-hot-toast';
import { getIndustry } from '../../../../Redux/CommonSlice';

export default function AddSoltPage_2({ setPage, countries, page, setallSlateDetails, allSlateDetails, UserName }) {
    const SelectDropdownRef = useRef(null);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (SelectDropdownRef.current && !SelectDropdownRef.current.contains(event?.target)) {
                setMenuIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
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
        if (allSlateDetails?.refVale && allSlateDetails?.refCode === 'Yes') {
            dispatch(getVaildReferralcode(allSlateDetails?.refVale)).then((res) => {
                if (res?.payload?.data === false) {
                    return toast.error(res?.payload?.message)
                } else {
                    setPage(page + 1)
                }
            })
        } else { setPage(page + 1) }
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
                <div className='flex items-center justify-between' onClick={() => { setincludeoption(includeoption === index ? null : index); setMenuIsOpen(true) }}>
                    <span className=' w-full font-semibold' >{item?.industryName}</span>
                    <IoIosArrowDown className='h-5 w-5 ' onClick={() => { setincludeoption(includeoption === index ? null : index); setMenuIsOpen(true) }} />
                </div>
            ),
            isIndustry: true
        }


        const result = [industryOption];

        // Show include options if this industry is open
        if (includeoption === index) {
            const includeOptions = item.industryInclude.map(include => ({
                value: include.industryIncludeID,
                label: (<div className=' ml-5 h-full  ' onClick={() => { setMenuIsOpen(false) }}>{`${item.industryName} - ${include.category}`}</div>),
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

    };
    return (
        <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[800px] md:w-[700px] w-full bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
                {/* <div className="text-2xl font-semibold">Book Slot</div>*/}
                <div className="flex items-center justify-center mb-4">
                    <img
                        alt="Logo"
                        src={logo}
                        className="cursor-pointer duration-500 w-52"
                    />
                </div>
                <div className="grid grid-cols-4 gap-4 w-full ">
                    <div className="col-span-4">
                        <div className="p-5 flex flex-col gap-4 h-full">
                            <div className="flex flex-col justify-center m-auto">
                                <h3 className="text-center font-bold mb-2">Hi {UserName},</h3>
                                <p className="text-sm text-center"> Before we begin, please take a moment to share some details about your organization. This will help us tailor the screen experience to perfectly suit your needs.</p>
                            </div>
                            <div className="relative w-full col-span-2" ref={SelectDropdownRef}>
                                <Select

                                    placeholder='Select Industry'
                                    value={selectedOption}
                                    onChange={handleChange}
                                    options={[...options]}
                                    isClearable={true}
                                    menuIsOpen={menuIsOpen}
                                    // onFocus={handleMenuOpen} 
                                    // onBlur={handleMenuClose} 
                                    onMenuOpen={() => setMenuIsOpen(true)}
                                // onMenuClose={() =>  setMenuIsOpen(false)}
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
                                <p className="text-center mb-3 font-semibold">Purpose of using Disploy Screens</p>
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
                                    {allSlateDetails?.selecteScreens?.some((x) => x === "others") && (
                                        <div className='p-0 m-auto mt-2  bookslot-ref w-72'>
                                            <input
                                                type="text"
                                                placeholder='Enter Your Purpose'
                                                className={`bg-transparent placeholder-slate-400 border-current w-full p-2`}
                                                onChange={(e) => {
                                                    setallSlateDetails({ ...allSlateDetails, purposeText: e.target.value })
                                                }}
                                                value={allSlateDetails?.purposeText}

                                            />
                                        </div>
                                    )}
                                </div>
                                {/* {allSlateDetails?.selecteScreens?.some((x) => x === "others") && (
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
                                )} */}

                                <div className="my-3 flex items-center gap-3 m-auto">
                                    <div className="flex justify-center items-center gap-4 m-auto">
                                        <div className=''>
                                            <div className="flex">
                                                <div className="ml-2 flex items-center">
                                                    <input
                                                        type="radio"
                                                        value={allSlateDetails?.refCode}
                                                        checked={allSlateDetails?.refCode === "Yes"}
                                                        name="Cel"
                                                        id='Yes'
                                                        className='cursor-pointer'
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
                                                        className='cursor-pointer'
                                                        onChange={() => {
                                                            setallSlateDetails({ ...allSlateDetails, refCode: "NO" });

                                                        }}
                                                    />
                                                    <label for='NO' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                                        I Don't Have
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {allSlateDetails?.refCode === "Yes" && (
                                    <div className='flex justify-center items-center my-3'>
                                        <div className={`${(Error && !allSlateDetails?.refVale) ? "bookslot-ref-error" : "bookslot-ref w-52"}`}>
                                            <input
                                                type="text"
                                                className={`bg-transparent placeholder-slate-400 border-current w-52 p-2`}
                                                value={allSlateDetails?.refVale}
                                                placeholder='Referral Code'
                                                onChange={(e) => {
                                                    setallSlateDetails({ ...allSlateDetails, refVale: e.target.value });
                                                }}
                                            />
                                            {/*{Error && !allSlateDetails?.refVale && (
                                                        <p className="text-red-600 text-sm font-semibold text-center ">This field is Required.</p>
                                                    )}*/}
                                        </div>
                                    </div>
                                )}
                                <div className='m-auto'>
                                    <label className="custom-label flex items-center justify-center mb-2">
                                        <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded w-4 h-4 flex items-center justify-center mr-2">
                                            <input type="checkbox" name="terms"
                                                onChange={(e) => {
                                                    setallSlateDetails({ ...allSlateDetails, terms: e.target.checked });
                                                }}
                                                checked={allSlateDetails?.terms}
                                            />
                                        </div>
                                        <p>I have read the terms and agreement of Disploy</p>
                                    </label>
                                </div>
                            </div>

                            <div className="w-full h-full">
                                <div className="flex justify-center h-full items-end">
                                    <button
                                        className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-4 md:px-8 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={allSlateDetails?.terms === false}
                                        className={`sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-4 md:px-8 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 ${!allSlateDetails?.terms ? 'cursor-not-allowed  opacity-50' : ""}`}
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
