import React from 'react'
import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

import PropTypes from "prop-types";
import { TbFileReport } from 'react-icons/tb'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import '../../Styles/Report.css'
import { useDateSelect } from "react-ymd-date-select";



const Report = ({ sidebarOpen, setSidebarOpen }) => {
    Report.propTypes = {
        sidebarOpen: PropTypes.bool.isRequired,
        setSidebarOpen: PropTypes.func.isRequired,
    };

    { /*popup datepicker */ }


    const CustomDateSelectProps = {
        onChange: (value) => { },
        value: "",
    };


    function CustomDateSelect(props) {
        const dateSelect = useDateSelect(props.value, props.onChange);

        return (
            <>
                <div className='grid grid-rows-4 grid-flow-row gap-4 ml-6'>
                    <div className="col-span-12 ">
                        <label>Day </label><br />
                        <select value={dateSelect.dayValue} onChange={dateSelect.onDayChange} className=' w-full border border-[#D5E3FF] rounded-xl p-2 drop-shadow-sm'>
                            {dateSelect.dayOptions.map((dayOption) => (
                                <option key={dayOption.value} value={dayOption.value}>
                                    {dayOption.label}
                                </option>
                            ))}
                        </select>


                    </div>

                    <div className="col-span-6">
                        <label>
                            Month</label><br />
                        <select
                            value={dateSelect.monthValue}
                            onChange={dateSelect.onMonthChange}
                            className=' w-full border border-[#D5E3FF] rounded-xl p-2 drop-shadow-sm'>
                            {dateSelect.monthOptions.map((monthOption) => (
                                <option key={monthOption.value} value={monthOption.value}>
                                    {monthOption.label}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="col-span-6">
                        <label>
                            Year</label><br />
                        <select value={dateSelect.yearValue} onChange={dateSelect.onYearChange} className=' w-full border border-[#D5E3FF] rounded-xl p-2 drop-shadow-sm'>
                            {dateSelect.yearOptions.map((yearOption) => (
                                <option key={yearOption.value} value={yearOption.value}>
                                    {yearOption.label}
                                </option>
                            ))}
                        </select>


                    </div>
                    <div className="col-span-6">
                        <input
                            type="date" placeholder='From Date'
                            value={dateSelect.dateValue || ""}
                            onChange={dateSelect.onDateChange}
                            className=' w-full border border-[#D5E3FF] rounded-xl p-2 drop-shadow-sm'
                        />
                    </div>

                    <div className="col-span-6">
                        <input
                            type="date" placeholder='To Date'
                            value={dateSelect.dateValue || ""}
                            onChange={dateSelect.onDateChange}
                            className=' w-full border border-[#D5E3FF] rounded-xl p-2 drop-shadow-sm'
                        />
                    </div>

                    <div className="col-span-3">
                        <div class="my-1"><button class="bg-white border border-primary text-base px-5 py-2 rounded-full text-primary hover:bg-primary hover:text-white">Back</button></div>
                    </div>

                    <div className="col-span-6">
                        <div class="my-1"><button class="bg-primary border border-primary text-base px-5 py-2 rounded-full text-white hover:text-primary hover:bg-white ">Continue</button></div>
                    </div>

                </div>
            </>
        );
    }

    const [showModel, setShowModel] = useState(false);
    const closeModel = () => setShowModel(false)
    const MyModel = () => {
        return (
            <>
                <div className="popupbackdrop" onClick={() => closeModel()}></div>
                <div className='reportpopup'>
                    <h2 className="text-center mb-7 text-primary text-lg font-medium">How would you like to generate report?</h2>
                    <form>
                        <div className='flex justify-center'>
                            <div className='radiobtn mr-5'>
                                <div className="mb-5">
                                    <input type="radio" value="daily" name="time" className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    <label className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer">Daily</label>
                                </div>

                                <div className="mb-5">
                                    <input type="radio" value="monthly" name="time" className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    <label className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer">Monthly</label>
                                </div>
                                <div className="mb-5">
                                    <input type="radio" value="custom" name="time" className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-SlateBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-SlateBlue checked:after:bg-SlateBlue checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-SlateBlue checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-SlateBlue dark:checked:after:bg-SlateBlue dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" />
                                    <label className="mt-px inline-block pl-[0.15rem] opacity-50 hover:cursor-pointer">Custom</label>
                                </div>
                            </div>

                            <div>

                                <CustomDateSelect />

                            </div>

                        </div>
                        <button onClick={() => { setShowModel(false) }} className="absolute right-[15px] top-[15px]"><AiOutlineCloseCircle className='text-3xl' /></button>
                    </form>

                </div>

            </>
        )
    }

    return (
        <>
            <div className="flex border-b border-gray py-3">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>
            <div className="pt-6 px-5">
                <div className={`${sidebarOpen ? "ml-52" : "ml-16"}`}>
                    <div className="lg:flex lg:justify-between sm:block xs:block  items-center">
                        <h1 className="not-italic font-medium lg:text-2xl md:text-2xl sm:text-xl text-[#001737] lg:mb-0 md:mb-0 sm:mb-4 ">
                            Reports
                        </h1>
                    </div>

                    <div className="grid grid-rows-12 lg:grid-flow-col md:grid-flow-col sm:grid-flow-row xs:grid-flow-row  gap-4 mt-5">
                        <div className='lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md' onClick={() => setShowModel(true)}>
                            <div className='reportbox text-center bg-white rounded-xl p-5'>
                                <div className=''><TbFileReport className='lg:text-6xl md:text-6xl sm:text-5xl xs:text-6xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  ' /></div>
                                <div><h3 className='text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2'>Asset Report</h3></div>
                                <div><p className='text-sm font-normal'>Shoes for how make
                                    time asset file is playing.</p></div>
                            </div>

                        </div>
                        {showModel && <MyModel closeModel={closeModel} />}
                        <div className='lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md'>
                            <div className='reportbox text-center bg-white rounded-xl p-5'>
                                <div className=''><TbFileReport className='lg:text-6xl md:text-6xl sm:text-5xl xs:text-6xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  ' /></div>
                                <div><h3 className='text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2'>Asset Report</h3></div>
                                <div><p className='text-sm font-normal'>Shoes for how make
                                    time asset file is playing.</p></div>
                            </div>

                        </div>

                        <div className='lg:col-span-4 md:col-span-4 sm:col-span-6 xs:col-span-12 text-center drop-shadow-md'>
                            <div className='reportbox text-center bg-white rounded-xl p-5'>
                                <div className=''><TbFileReport className='lg:text-6xl md:text-6xl sm:text-5xl xs:text-6xl text-primary text-center mx-auto bg-white rounded-2xl lg:p-2 md:p-2 sm:p-2 xs:p-2 drop-shadow-xl  ' /></div>
                                <div><h3 className='text-base font-medium  lg:mt-5 md:mt-5 sm:mt-3 xs:mt-3 mb-2'>Asset Report</h3></div>
                                <div><p className='text-sm font-normal'>Shoes for how make
                                    time asset file is playing.</p></div>
                            </div>
                        </div>




                    </div>

                </div>
            </div>
        </>
    )
}

export default Report
