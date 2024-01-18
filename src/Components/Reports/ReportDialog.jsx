import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const ReportDialog = ({ toggleModal, selectedReport }) => {
    const navigate = useNavigate();
    const currentDate = new Date().toISOString().split('T')[0];
    const [selectedOption, setSelectedOption] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [startDate, setStartDate] = useState(currentDate);
    const [endDate, setEndDate] = useState(currentDate);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [ErrorYear, setErrorYear] = useState(false);
    const [ErrorMonth, setErrorMonth] = useState(false);
    const startYear = 2000;
    const endYear = 2024;

    const yearArray = [];
    for (let year = startYear; year <= endYear; year++) {
        yearArray.push({ year });
    }

    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const totalMonths = months.map((month, index) => ({
        id: index + 1,
        name: month
    }));

    function reportformatDate(inputDate) {
        const dateObject = new Date(inputDate);
        const day = String(dateObject.getDate()).padStart(2, '0');
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = dateObject.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleCustomStartDateChange = (event) => {
        setStartDate(event.target.value);
    }
    const handleCustomEndDateChange = (event) => {
        setEndDate(event.target.value);
    }

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setErrorMonth(false)
    };
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setErrorYear(false)
    }

    const onSubmit = () => {
        if (selectedOption === 'daily') {
            const selectdate = reportformatDate(selectedDate)
            navigate(`/reports/${selectedReport}/${selectedOption}/${selectdate}`)
        } else if (selectedOption === 'monthly') {
            if (selectedMonth === null) {
                setErrorMonth(true)
            }
            if (selectedYear === null) {
                setErrorYear(true)
            }
            if (selectedMonth !== null && selectedYear !== null) {
                navigate(`/reports/${selectedReport}/${selectedOption}/${selectedMonth}&&${selectedYear}`)
            }
        } else {
            const start = reportformatDate(startDate);
            const end = reportformatDate(endDate)
            navigate(`/reports/${selectedReport}/${selectedOption}/${start}&&${end}`)
        }
    }
    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
        >
            <div className="relative p-4 w-full max-w-xl max-h-full">
                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* Modal header */}
                    <div className=" flex items-start justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black">
                        <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                            How Would You Like To Generate Report?
                        </h3>
                        <AiOutlineCloseCircle
                            className="text-2xl text-primary cursor-pointer"
                            onClick={() => {
                                toggleModal();
                            }}
                        />
                    </div>
                    {/* Modal body */}
                    <form >
                        <div className='p-6'>
                            <div className="grid grid-rows-3 grid-flow-col gap-4 mb-4">
                                <div className='flex items-center'>
                                    <input
                                        id="daily"
                                        type="radio"
                                        value="daily"
                                        name="option"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={selectedOption === 'daily'}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="daily" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Daily</label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        id="monthly"
                                        type="radio"
                                        value="monthly"
                                        name="option"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={selectedOption === 'monthly'}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="monthly" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Monthly</label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        id="custom"
                                        type="radio"
                                        value="custom"
                                        name="option"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={selectedOption === 'custom'}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor="custom" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Custom</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="date"
                                        placeholder='Enter Create Date'
                                        className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        disabled={selectedOption !== "daily"}
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                    />
                                </div>
                                <div className='flex items-center flex-col'>
                                    <select
                                        id="country"
                                        className="relative border border-black rounded-lg p-3 w-full"
                                        disabled={selectedOption !== "monthly"}
                                        onChange={handleMonthChange}
                                        value={selectedMonth}
                                    >
                                        <option value="" label="Month"></option>
                                        {totalMonths.map((month) => (
                                            <option
                                                key={month.id}
                                                value={month.id}
                                            >
                                                {month.name}
                                            </option>
                                        ))}
                                    </select>
                                    {ErrorMonth && (
                                        <span className="error w-full">This Field Required.</span>
                                    )}
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        type="date"
                                        placeholder='Enter Create Date'
                                        className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        disabled={selectedOption !== "custom"}
                                        value={startDate}
                                        onChange={handleCustomStartDateChange}
                                    />
                                </div>
                                <div>
                                </div>
                                <div className='flex items-center flex-col'>
                                    <select
                                        id="country"
                                        className="relative border border-black rounded-lg p-3 w-full"
                                        disabled={selectedOption !== "monthly"}
                                        onChange={handleYearChange}
                                        value={selectedYear}
                                    >
                                        <option value="" label="Years"></option>
                                        {yearArray.map((year) => (
                                            <option
                                                key={year.year}

                                                value={year.year}
                                            >
                                                {year.year}
                                            </option>
                                        ))}
                                    </select>
                                    {ErrorYear && (
                                        <span className="error w-full">This Field Required.</span>
                                    )}
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        type="date"
                                        placeholder='Enter Create Date'
                                        className="bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        disabled={selectedOption !== "custom"}
                                        value={endDate}
                                        onChange={handleCustomEndDateChange}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-2 md:p-2 rounded-b gap-2">
                                <button
                                    className="bg-white w-32 text-primary text-base px-8 py-3 border border-primary shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                    type="button"
                                    onClick={toggleModal}
                                >
                                    Back
                                </button>
                                <button
                                    className="bg-primary w-32 text-white text-base px-6 py-3 border border-primary shadow-md rounded-full "
                                    type="button"
                                    onClick={onSubmit}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div >
        </div >
    )
}

export default ReportDialog
