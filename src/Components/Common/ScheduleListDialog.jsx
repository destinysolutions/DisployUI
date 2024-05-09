import moment from 'moment';
import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const ScheduleListDialog = ({ setShowScheduleModal, loading, schedules, handleScheduleAdd, handleScheduleUpdate, scheduleScreenID }) => {
    return (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
            <div className="w-auto my-6 mx-auto lg:max-w-6xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-center justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                        <div>Select Schedule</div>

                        <div>
                            <button
                                className="p-1"
                                onClick={() => setShowScheduleModal(false)}
                            >
                                <AiOutlineCloseCircle className="text-3xl" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-end mt-3 mr-5">
                        <Link to="/addschedule" target="_blank">
                            <button
                                className="bg-SlateBlue text-white px-5 py-2 rounded-full ml-3"
                                onClick={() => {
                                    localStorage.setItem("isWindowClosed", "false");
                                }}
                            >
                                Set New Schedule
                            </button>
                        </Link>
                    </div>
                    <div className=" overflow-x-scroll sc-scrollbar mt-5 px-5 min-h-[400px] max-h-[400px] ">
                        <table
                            className="w-full lg:table-fixed md:table-auto sm:table-auto xs:table-auto shadow-2xl p-2 mb-3"
                            cellPadding={15}
                        >
                            <thead>
                                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg">
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        Schedule Name
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        Time Zones
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        Date Added
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        start date
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        End date
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        screens Assigned
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        Tags
                                    </th>
                                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td
                                            colSpan={8}

                                        >
                                            <div className="flex text-center m-5 justify-center">
                                                <svg
                                                    aria-hidden="true"
                                                    role="status"
                                                    className="inline w-10 h-10 me-3 text-black animate-spin dark:text-gray-600"
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
                                        </td>
                                    </tr>
                                )}
                                {(!loading &&
                                    schedules.map((schedule) => (
                                        <tr
                                            className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                                            key={schedule.scheduleId}
                                        >
                                            <td className="items-center">
                                                <div className='flex'>
                                                    <input
                                                        type="checkbox"
                                                        className="mr-3"
                                                        onChange={() => handleScheduleAdd(schedule)}
                                                    />
                                                    <div>
                                                        <div>{schedule.scheduleName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {schedule.timeZoneName}
                                            </td>
                                            <td className="text-center">
                                                {moment(schedule.createdDate).format(
                                                    "YYYY-MM-DD hh:mm"
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {moment(schedule.startDate).format(
                                                    "YYYY-MM-DD hh:mm"
                                                )}
                                            </td>

                                            <td className="text-center">
                                                {moment(schedule.endDate).format(
                                                    "YYYY-MM-DD hh:mm"
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                {schedule.screenAssigned}
                                            </td>
                                            <td className="p-2 text-center">{schedule.tags}</td>
                                            <td className="text-center">
                                                <Link
                                                    to={`/addschedule?scheduleId=${schedule.scheduleId}&scheduleName=${schedule.scheduleName}&timeZoneName=${schedule.timeZoneName}`}
                                                    target="_blank"
                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                >
                                                    <BiEdit />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {!loading && schedules?.lenght === 0 && (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="flex text-center m-5 justify-center">
                                                <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2 text-black">
                                                    No Data Available
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="py-4 flex justify-center border-t border-gray">
                        <button
                            onClick={() => {
                                handleScheduleUpdate(scheduleScreenID);
                            }}
                            className="border border-primary rounded-full px-6 py-2 not-italic font-medium text-lg"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleListDialog
