import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { handleGetAllNotifications, handleGetAllRemoveNotifications } from '../Redux/NotificationSlice';
import { useEffect } from 'react';
import { GET_ALL_NOTIFICATIONS, GET_ALL_REMOVE_NOTIFICATIONS } from '../Pages/Api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NavbarNotification = ({ setShowNotificationBox }) => {
    const { token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const [notification, setNotification] = useState([])
    const [loading, setLoading] = useState(true)


    const fetchNotifications = () => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: GET_ALL_NOTIFICATIONS,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken
            },
        }

        dispatch(handleGetAllNotifications({ config })).then((res) => {
            setNotification(res?.payload?.data)
            setLoading(false)
        }).catch((error) => {
            console.log('error', error)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleRemoveNotification = () => {
        setLoading(true)
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: GET_ALL_REMOVE_NOTIFICATIONS,
            headers: {
                Authorization: authToken
            },
        }

        dispatch(handleGetAllRemoveNotifications({ config })).then((res) => {
            if (res?.payload?.data) {
                setNotification([])
                setLoading(false)
            }
        }).catch((error) => {
            setLoading(false)
        })
    }


    return (
        <>
            <div className="absolute top-[50px] right-0 bg-white rounded-lg border border-[#8E94A9] shadow-lg notificationpopup">
                {!loading && notification?.length > 0 && (
                    <div className='flex items-center justify-end px-5 pt-4'>
                        <p className='underline text-gray-600 cursor-pointer' onClick={() => handleRemoveNotification()}>Clear All Notification</p>
                    </div>
                )}
                {/*<div className="lg:flex md:flex sm:block items-start">
                    <div className="p-3">
                        <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Screen ID
                        </h4>
                        <p className="font-medium text-sm text-[#ACB0C7]">
                            HD-EF014
                        </p>
                    </div>
                    <div className="p-3">
                        <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Store
                        </h4>
                        <p className="font-medium text-sm text-[#ACB0C7]">
                            Store Name
                        </p>
                    </div>
                    <div className="p-3">
                        <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Location
                        </h4>
                        <p className="font-medium text-sm text-[#ACB0C7] break-words	w-[200px]">
                            132, My Street, Kingston, New York 12401.
                        </p>
                    </div>
                    <div className="p-3">
                        <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Status
                        </h4>
                        <p className="font-medium text-sm text-[#ACB0C7]">
                            Offline
                        </p>
                    </div>
    </div>*/}
                {notification?.length === 0 && !loading && (
                    <div className='flex justify-center items-center p-8'>
                        <p className='text-xl'>No Notification Avavilable</p>
                    </div>
                )}
                {loading && (
                    <div className="flex text-center m-5 justify-center">
                        <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-8 h-8 me-3 text-gray-200 animate-spin dark:text-gray-600"
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
                {notification?.length > 0 && !loading && (
                    <div className='flex flex-col items-center gap-2 p-3'>
                        <div className='flex flex-row items-center gap-3 justify-center'>
                            <h4 className="text-[#7C82A7] text-sm font-bold w-28">
                                Screen Name
                            </h4>
                            <h4 className="text-[#7C82A7] text-sm font-bold w-28">
                                Message
                            </h4>
                            <h4 className="text-[#7C82A7] text-sm font-bold w-28">
                                Location
                            </h4>
                        </div>
                        {!loading && notification?.slice(0, 5)?.map((item, index) => {
                            return (
                                <div className='flex flex-row items-center gap-3 justify-center' key={index}>
                                    <p className="font-medium text-sm text-[#ACB0C7] w-28">
                                        {item?.screenName}
                                    </p>
                                    <p className="font-medium text-sm text-[#ACB0C7] w-28">
                                        {item?.message}
                                    </p>
                                    <p className="font-medium text-sm text-[#ACB0C7] break-words w-28">
                                        {item?.location}
                                    </p>
                                    {/* <p className="font-medium text-sm text-[#ACB0C7] w-28">
                                        Offline
                            </p>*/}
                                </div>
                            )
                        })}
                        {!loading && notification?.length > 5 && (
                            <div className='w-full flex justify-center items-center p-2 bg-gray cursor-pointer'>
                                <button className='text-base font-semibold text-gray-600' onClick={() => navigation("/userprofile", {
                                    state: {
                                        notificationData: "notifications",
                                    },
                                })}>
                                    See All Notification
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default NavbarNotification
