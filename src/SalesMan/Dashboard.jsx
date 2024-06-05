import React, { useState } from 'react'
import { generateYearArray, getRandomTwoDigitNumber, monthNames, months } from '../Components/Common/Common';
import { FaUserTie, FaWallet } from 'react-icons/fa';
import { MdOutlineScreenshotMonitor, MdPayments } from 'react-icons/md';
import SalesManNavbar from './SalesManNavbar';
import SalesManSidebar from "./SalesManSidebar"
import { SAELS_MAN_DASHBOARD } from '../Pages/Api';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GetSalesManDashboard } from '../Redux/SalesMan/SalesManSlice';
import { useEffect } from 'react';
const Dashboard = ({ sidebarOpen, setSidebarOpen }) => {
    const dispatch = useDispatch()
    const { token } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const yearsArray = generateYearArray();
    const [currentmonth, setCurrentMonth] = useState(months[new Date().getMonth()])
    const [currentyear, setCurrentYear] = useState(new Date().getFullYear())
    const [data, setData] = useState()

    const fetchData = () => {
        console.log('data', data)
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${SAELS_MAN_DASHBOARD}?Month=${currentmonth === "0" ? 0 : monthNames[currentmonth]}&Year=${currentyear === "0" ? 0 : currentyear}`,
            headers: {
                Authorization: authToken,
            },
        };
        dispatch(GetSalesManDashboard({ config })).then((res) => {
            console.log('res', res)
            if (res?.payload?.status) {
                setData(res?.payload?.data)
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

    useEffect(() => {
        fetchData()
    }, [currentmonth, currentyear])

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
                                <h1 className='font-bold text-2xl'>Dashboard</h1>
                            </div>
                            <div className='flex'>
                                <div className="px-3">
                                    <label className="label_top text-sm">Month</label>
                                    <div>
                                        <select className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                                            value={currentmonth}
                                            onChange={(e) => setCurrentMonth(e.target.value)}
                                        >
                                            <option label="Select Month" value="0">Select Month</option>
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
                                <div className="px-3">
                                    <label className="label_top text-sm">Year</label>
                                    <div>
                                        <select className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                                            value={currentyear}
                                            onChange={(e) => setCurrentYear(e.target.value)}

                                        >
                                            {<option label="Select Year" value="0"> Select Year</option>}
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
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div className="flex flex-row items-center h-full">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-black"><FaUserTie className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h5 className="font-bold uppercase text-gray-600">Total Customers</h5>
                                            <h3 className="font-bold text-3xl">{data?.noOfCustomer}<span className="text-green-500"><i className="fas fa-caret-up"></i></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div className="flex flex-row items-center h-full">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-black"><MdOutlineScreenshotMonitor className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h5 className="font-bold uppercase text-gray-600">Total Screens</h5>
                                            <h3 className="font-bold text-3xl">{data?.noOfScreens}<span className="text-green-500"><i className="fas fa-caret-up"></i></span></h3>
                                            <h4></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div className="flex flex-row items-center h-full">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-black"><MdPayments className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h5 className="font-bold uppercase text-gray-600">Total Payout</h5>
                                            <h3 className="font-bold text-3xl">${data?.totalPayment} <span className="text-green-500"><i className="fas fa-caret-up"></i></span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 xl:w-1/4 p-6 ">
                                <div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5 h-full">
                                    <div className="flex flex-row items-center h-full">
                                        <div className="flex-shrink pr-4">
                                            <div className="rounded-full p-5 bg-black"><FaWallet className='fa-2x fa-inverse text-2xl text-white' /></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-center">
                                            <h5 className="font-bold uppercase text-gray-600">Your Payout</h5>
                                            <h3 className="font-bold text-3xl">${data?.totalMargin} <span className="text-green-500"><i className="fas fa-caret-up"></i></span></h3>
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
