import React, { useState } from 'react'
import { generateYearArray, getRandomTwoDigitNumber, months } from '../Components/Common/Common';
import { FaUserTie, FaWallet } from 'react-icons/fa';
import { MdOutlineScreenshotMonitor, MdPayments } from 'react-icons/md';
import SalesManNavbar from './SalesManNavbar';
import SalesManSidebar from "./SalesManSidebar"
const Dashboard = ({sidebarOpen,setSidebarOpen}) => {
    const yearsArray = generateYearArray();
    const [currentmonth, setCurrentMonth] = useState(months[new Date().getMonth()])
    const [currentyear, setCurrentYear] = useState(new Date().getFullYear())
    const Amount = getRandomTwoDigitNumber(9000, 1000)
    let percentage = (2 / 100) * Amount;

    // Round the percentage value to the nearest whole number
    let roundedPercentage = Math.round(percentage);
    return (
        <>
            <div className="flex border-b border-gray ">
                <SalesManSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <SalesManNavbar />
            </div>
            <div className="pt-28 px-5 page-contain ">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className='shadow rounded-lg p-5 '>

                        <div className="-mx-3 md:flex justify-between items-center">
                            <div className='ml-8'>
                                <h1 className='font-bold text-3xl'>Dashboard</h1>
                            </div>
                            <div className='flex'>
                                <div className="px-3">
                                    <label className="label_top text-sm">Month</label>
                                    <div>
                                        <select className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                                            value={currentmonth}
                                            onChange={(e) => setCurrentMonth(e.target.value)}
                                        >
                                            <option label="Select Month"></option>
                                            {months.map((country) => (
                                                <option
                                                    key={country}
                                                    value={country}
                                                >
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="                                                                                                                          px-3">
                                    <label className="label_top text-sm">Year</label>
                                    <div>
                                        <select className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                                            value={currentyear}
                                            onChange={(e) => setCurrentYear(e.target.value)}

                                        >
                                            <option label="Select Year"></option>
                                            {Array.isArray(yearsArray) &&
                                                yearsArray.map((year) => (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-wrap">
                            <div class="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div class="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div class="flex flex-row items-center h-full">
                                        <div class="flex-shrink pr-4">
                                            <div class="rounded-full p-5 bg-black"><FaUserTie className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div class="flex-1 text-right md:text-center">
                                            <h5 class="font-bold uppercase text-gray-600">Total Customers</h5>
                                            <h3 class="font-bold text-3xl">{getRandomTwoDigitNumber(90, 10)} <span class="text-green-500"><i class="fas fa-caret-up"></i></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div class="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div class="flex flex-row items-center h-full">
                                        <div class="flex-shrink pr-4">
                                            <div class="rounded-full p-5 bg-black"><MdOutlineScreenshotMonitor className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div class="flex-1 text-right md:text-center">
                                            <h5 class="font-bold uppercase text-gray-600">Total Screens</h5>
                                            <h3 class="font-bold text-3xl">{getRandomTwoDigitNumber(90, 10)} <span class="text-green-500"><i class="fas fa-caret-up"></i></span></h3>
                                            <h4></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div class="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div class="flex flex-row items-center h-full">
                                        <div class="flex-shrink pr-4">
                                            <div class="rounded-full p-5 bg-black"><MdPayments className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div class="flex-1 text-right md:text-center">
                                            <h5 class="font-bold uppercase text-gray-600">Total Payout</h5>
                                            <h3 class="font-bold text-3xl">${Amount} <span class="text-green-500"><i class="fas fa-caret-up"></i></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div class="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div class="flex flex-row items-center h-full">
                                        <div class="flex-shrink pr-4">
                                            <div class="rounded-full p-5 bg-black"><FaWallet className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div class="flex-1 text-right md:text-center">
                                            <h5 class="font-bold uppercase text-gray-600">Your Payout</h5>
                                            <h3 class="font-bold text-3xl">${roundedPercentage} <span class="text-green-500"><i class="fas fa-caret-up"></i></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
