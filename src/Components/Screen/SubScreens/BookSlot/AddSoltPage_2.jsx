import React, { useState } from 'react'
import Select from "react-select";
import { DisployScreens, Industry } from '../../../Common/Common';

export default function AddSoltPage_2({ setPage, countries, page, setallSlateDetails, allSlateDetails }) {



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

    return (
        <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[1000px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
                <div className="text-2xl font-semibold">Book Slot</div>
                <div className="grid grid-cols-4 gap-4 w-full ">
                    <div className="col-span-4">
                        <div className="rounded-lg shadow-md bg-white p-5 flex flex-col gap-4 h-full">
                            <div className="w-7/12 flex flex-col justify-center m-auto">
                                <h3 className="text-center font-bold">Hi Anand,</h3>
                                <p className="text-sm text-center"> Before we begin, please take a moment to share some details about your organization. This will help us tailor tha screen experience to perfectly suit your needs.</p>
                            </div>
                            <div className="grid grid-cols-4 gap-4 items-center">
                                <div className="relative w-full col-span-2">
                                    <Select
                                        placeholder='Select Industry'
                                        value={allSlateDetails?.Industry}
                                        onChange={(option) => { setallSlateDetails({ ...allSlateDetails, Industry: option }) }}
                                        options={
                                            Industry && Industry?.length > 0
                                                ? Industry.map((item) => ({
                                                    value: item?.id,
                                                    label: item?.title,
                                                }))
                                                : [{ value: "", label: "Not Found" }]
                                        }
                                    />
                                </div>
                                <div className="relative w-full col-span-2">
                                    <Select
                                        placeholder='Select Country'
                                        className='my-3'
                                        options={
                                            countries && countries?.length > 0
                                                ? countries.map((item) => ({
                                                    value: item?.countryID,
                                                    label: item?.countryName,
                                                }))
                                                : [{ value: "", label: "Not Found" }]
                                        }
                                        value={allSlateDetails?.country}
                                        onChange={(option) => { setallSlateDetails({ ...allSlateDetails, country: option }) }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-center mb-3">Purpose of using Disploy Screens</p>
                                <div className="m-auto  flex justify-center flex-wrap my-3">
                                    {DisployScreens.map((label, index) => (
                                        <button
                                            className={`border m-0 border-primary px-3 py-1 mr-2 mb-2 rounded-full ${allSlateDetails?.selecteScreens?.includes(label) && "bg-SlateBlue border-white"} `}
                                            key={index}
                                            onClick={() => handleClick(label)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <div className="my-5  flex items-center gap-3  m-auto">
                                    <label className="text-base font-medium">
                                        Refernce Code:
                                    </label>
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
                                            </div>
                                        )}
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
                                                    Yes
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
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <label className="custom-label flex items-center justify-center">
                                    <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded w-4 h-4 flex items-center justify-center mr-2">
                                        <input type="checkbox" name="terms"
                                            onChange={(e) => {
                                                setallSlateDetails({ ...allSlateDetails, terms: e.target.value });
                                            }}
                                            checked={allSlateDetails?.terms}
                                        />
                                    </div>
                                    <p className="">I have read the terms and agreement of Disploy</p>
                                </label>
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
                                        className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={() => setPage(page + 1)}
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
