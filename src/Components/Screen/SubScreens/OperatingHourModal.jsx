import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Operating_hours_actions, TotalDay } from "../../Common/Common"
const OperatingHourModal = ({
    toggleModal,
    selectedDays,
    handleDayButtonClick,
    selectedHours,
    setSelectedHours,
    handleSaveOperatingHour,
    setStartTime,
    setEndTime,
    startTime,
    endTime
}) => {

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-3xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Custom Operating Hours
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    toggleModal();
                                }}
                            />
                        </div>

                        <div className='flex flex-col gap-4 p-4'>
                            <div>
                                <span>Hours:</span>
                            </div>
                            <div className='flex flex-row items-center justify-between'>
                                <input
                                    value={startTime}
                                    type="time"
                                    className="formInput"
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                />
                                <span className='mx-10'>To</span>
                                <input
                                    value={endTime}
                                    type="time"
                                    className="formInput"
                                    onChange={(e) =>
                                        setEndTime(e.target.value)
                                    } />
                            </div>
                            <div>
                                {TotalDay?.map((item, index) => {
                                    return (
                                        <button
                                            className={`border border-primary px-3 py-1 mr-2 mb-2 rounded-full ${selectedDays[index] &&
                                                "bg-SlateBlue border-white"
                                                } 
                                `}
                                            key={index}
                                            onClick={() =>
                                                handleDayButtonClick(index, item)
                                            }
                                        >
                                            {item}
                                        </button>
                                    )
                                })}
                            </div>
                            {/* <div className='flex flex-row items-center gap-4'>
                                <span>Action</span>
                                <select
                                    className="px-2 py-2 border border-[#D5E3FF] w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                                    value={selectedHours}
                                    onChange={(e) =>
                                        setSelectedHours(e.target.value)
                                    }
                                >
                                    <option value="">Select Action</option>
                                    {Operating_hours_actions &&
                                        Operating_hours_actions.map((hour) => (
                                            <option
                                                value={hour.value}
                                                key={hour.id}
                                            >
                                                {hour.value}
                                            </option>
                                        ))}
                                </select>
                            </div> */}


                        </div>



                        <div className="flex justify-center p-4">
                            <button
                                onClick={handleSaveOperatingHour}
                                className="bg-primary text-base px-5 py-2 rounded-full text-white hover:bg-SlateBlue"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default OperatingHourModal
