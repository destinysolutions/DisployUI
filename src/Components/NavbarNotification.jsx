import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { handleGetAllNotifications } from '../Redux/NotificationSlice';
import { useEffect } from 'react';
import { GET_ALL_NOTIFICATIONS } from '../Pages/Api';
import { useSelector } from 'react-redux';

const NavbarNotification = () => {
    const { token, user } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const [notification, setNotification] = useState([])


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
        })
    }

    useEffect(() => {
        fetchNotifications()
    }, [])


    return (
        <>
            <div className="absolute top-[50px] right-0 bg-white rounded-lg border border-[#8E94A9] shadow-lg notificationpopup">
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
                <div className='flex flex-col items-center gap-2 p-3'>
                    <div className='flex flex-row items-center gap-3 justify-center'>
                        <h4 className="text-[#7C82A7] text-sm font-bold w-28">
                            Screen ID
                        </h4>
                        <h4 className="text-[#7C82A7] text-sm font-bold w-28">
                            Store
                        </h4>
                        <h4 className="text-[#7C82A7] text-sm font-bold w-28">
                            Location
                        </h4>
                        <h4 className="text-[#7C82A7] text-sm font-bold w-28">
                            Status
                        </h4>
                    </div>
                    <div className='flex flex-row items-center gap-3 justify-center'>
                        <p className="font-medium text-sm text-[#ACB0C7] w-28">
                            HD-EF014
                        </p>
                        <p className="font-medium text-sm text-[#ACB0C7] w-28">
                            Store Name
                        </p>
                        <p className="font-medium text-sm text-[#ACB0C7] break-words w-28">
                            132, My Street, Kingston, New York 12401.
                        </p>
                        <p className="font-medium text-sm text-[#ACB0C7] w-28">
                            Offline
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavbarNotification
