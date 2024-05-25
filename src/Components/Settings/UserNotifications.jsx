import React, { useEffect, useState } from 'react'
import { GET_ALL_USER_NOTIFICATION, GET_NOTIFICATION, SAVE_NOTIFICATION } from '../../Pages/Api'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SaveUserNotification, handleUserNotificationList } from '../../Redux/SettingUserSlice';
import { NotificationType } from '../Common/Common';
import { getUserRoleData } from '../../Redux/UserRoleSlice';
import { HiPlus } from "react-icons/hi";
import toast from 'react-hot-toast';

const UserNotifications = () => {
    const { token } = useSelector((s) => s.root.auth);
    const dispatch = useDispatch()
    const authToken = `Bearer ${token}`;
    const [listNotification, setListNotification] = useState([])
    const [Notification, setNotification] = useState([])
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState([]);
    const [getNotification,setGetNotification] = useState([])

    const fetchList = () => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${GET_ALL_USER_NOTIFICATION}`,
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
        }

        dispatch(handleUserNotificationList({ config })).then((res) => {
            if (res?.payload?.status) {
                const AllArr = res?.payload?.data?.map((item) => ({ user: [item] }));
                setNotification(AllArr)
                setListNotification(AllArr)
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const fetchGetNotification = () =>{
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${GET_NOTIFICATION}`,
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
        }

        dispatch(handleUserNotificationList({ config })).then((res) => {
            if (res?.payload?.status) {
                setGetNotification(res?.payload?.data)
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

    const handleGetOrgUsers = () => {
        setLoading(true);
        dispatch(getUserRoleData())?.then((res) => {
            setUserData(res?.payload?.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchList()
        handleGetOrgUsers()
        fetchGetNotification()
    }, [])

    const handleAlertChange = (index, event, indexs) => {
        const updatedListNotification = listNotification.map((item, idx) => {
            if (idx === indexs) {
                const updatedUser = item.user.map((userData, i) => {
                    if (i === index) {
                        return { ...userData, NotificationType: event.target.value };
                    }
                    return userData;
                });
                return { ...item, user: updatedUser };
            }
            return item;
        });
        setListNotification(updatedListNotification);
    };

    const handleEmailChange = (index, event, indexs) => {
        const updatedListNotification = listNotification.map((item, idx) => {
            if (idx === indexs) {
                const updatedUser = item.user.map((userData, i) => {
                    if (i === index) {
                        return { ...userData, EmailOrgUserID: event.target.value };
                    }
                    return userData;
                });
                return { ...item, user: updatedUser };
            }
            return item;
        });
        setListNotification(updatedListNotification);
    };

    const handlePhoneChange = (index, event, indexs) => {
        const updatedListNotification = listNotification.map((item, idx) => {
            if (idx === indexs) {
                const updatedUser = item.user.map((userData, i) => {
                    if (i === index) {
                        return { ...userData, PhoneOrgUserID: event.target.value };
                    }
                    return userData;
                });
                return { ...item, user: updatedUser };
            }
            return item;
        });
        setListNotification(updatedListNotification);
    };

    const handleAdd = () => {
        setListNotification([...listNotification, ...Notification]);
    };
    const handleReset = (indexs) => {
        const updatedListNotification = listNotification.map((item, idx) => {
            if (idx === indexs) {
                const updatedUser = item.user.map(userData => ({ ...userData, NotificationType: '', EmailOrgUserID: '', PhoneOrgUserID: '' }));
                return { ...item, user: updatedUser };
            }
            return item;
        });
        setListNotification(updatedListNotification);
    };

    const handleSave = (indexs) => {
        const Params = [];
        let hasError = false
        listNotification.forEach((item, idx) => {
            if (idx === indexs) {
                item.user.forEach(userData => {
                    const obj = {
                        UserNotificationID: "0",
                        NotificationFeatureID: userData?.notificationFeatureId,
                        NotificationType: userData?.NotificationType || "",
                        EmailOrgUserID: userData?.EmailOrgUserID || 0,
                        PhoneOrgUserID: userData?.PhoneOrgUserID || 0
                    };
                    Params.push(obj);

                    // Validate each item
                    if (!obj.NotificationType) {
                        hasError = true
                        toast.error("Please Fill Proper Details");
                        return;
                    }
                    if ((obj.NotificationType === "Email" || obj.NotificationType === "Both") && !obj.EmailOrgUserID) {
                        hasError = true
                        toast.error("Please Fill Proper Details");
                        return;
                    }
                    if ((obj.NotificationType === "Phone" || obj.NotificationType === "Both") && !obj.PhoneOrgUserID) {
                        hasError = true
                        toast.error("Please Fill Proper Details");
                        return;
                    }
                });
            }
        });

        // Params?.map(((item) => {
        //     if (item?.NotificationType === "") {
        //         toast.error("Please Fill Proper Details")
        //         return
        //     }
        //     if (item?.NotificationType === "Email") {
        //         if (!item?.EmailOrgUserID) {
        //             toast.error("Please Fill Proper Details")
        //             return
        //         }
        //     }
        //     if (item?.NotificationType === "Phone") {
        //         if (!item?.PhoneOrgUserID) {
        //             toast.error("Please Fill Proper Details")
        //             return
        //         }
        //     }
        //     if (item?.NotificationType === "Both") {
        //         if (!item?.PhoneOrgUserID) {
        //             toast.error("Please Fill Proper Details")
        //             return
        //         }
        //         if (!item?.EmailOrgUserID) {
        //             toast.error("Please Fill Proper Details")
        //             return
        //         }
        //     }
        // }))

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${SAVE_NOTIFICATION}`,
            headers: {
                Authorization: authToken,
                "Content-Type": "application/json",
            },
            data: JSON.stringify(Params)
        }
        if (!hasError) {
            dispatch(SaveUserNotification({ config }))
                .then((res) => {
                    if (res?.payload?.status) {

                    }
                }).catch((err) => {
                    console.log('err', err)
                })
        }
    };


    return (
        <>
            <div className="p-8">
                <div className="flex justify-between">
                    <h2 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">
                        Notifications
                    </h2>
                    <button
                        className={`flex align-middle items-center float-right bg-SlateBlue text-white rounded-full lg:px-6 sm:px-5 lg:mb-5 lg:mt-0 mt-3 mb-4 py-2 text-base sm:text-sm  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50`}
                        onClick={() => handleAdd()}
                    >
                        <HiPlus className="text-2xl mr-1" />
                        Add
                    </button>
                </div>
                {!loading && (
                    <>
                        {listNotification.map((data, indexs) => (
                            <div className='rounded-lg shadow-lg p-5 lg:mt-6 md:mt-6 mt-4' key={indexs}>
                                <div className="clear-both">
                                    <div className="bg-white rounded-xl screen-section">
                                        <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                                            <table
                                                className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                                                cellPadding={15}
                                            >
                                                <thead>
                                                    <tr className="items-center">
                                                        <th className="text-[#000000] text-base font-semibold text-center ">
                                                            Type
                                                        </th>
                                                        <th className="text-[#000000] text-base font-semibold text-center">
                                                            Send With
                                                        </th>
                                                        <th className="text-[#000000] text-base font-semibold text-center">
                                                            Email
                                                        </th>
                                                        <th className="text-[#000000] text-base font-semibold text-center">
                                                            Phone
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data?.user?.map((item, index) => {
                                                        console.log('data[indexs]?.user[index]?.NotificationType', listNotification[indexs]?.user[index]?.NotificationType)
                                                        return (
                                                            <tr className="border-b border-b-[#E4E6FF]" key={index}>
                                                                <td className="text-[#5E5E5E] text-center">
                                                                    {item?.notificationFeatureName}
                                                                </td>
                                                                <td className="text-[#5E5E5E] text-center">
                                                                    <select
                                                                        className="relative border border-gray rounded-md p-3 user-input bg-white w-28"
                                                                        value={listNotification[indexs]?.user[index]?.NotificationType}
                                                                        onChange={(event) => handleAlertChange(index, event, indexs)}
                                                                    >
                                                                        <option label="Select" value=""></option>
                                                                        {NotificationType?.map((notif) => (
                                                                            <option key={notif?.Value} label={notif?.Name} value={notif?.Value} />
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td className="text-[#5E5E5E] text-center">
                                                                    <select
                                                                        className="relative border border-gray rounded-md p-3 user-input bg-white w-48"
                                                                        value={listNotification[indexs]?.user[index]?.EmailOrgUserID}
                                                                        onChange={(event) => handleEmailChange(index, event, indexs)}
                                                                        disabled={(listNotification[indexs]?.user[index]?.NotificationType === "Phone" || listNotification[indexs]?.user[index]?.NotificationType === "None")}
                                                                    >
                                                                        <option label="Select" value=""></option>
                                                                        {userData?.map((user) => (
                                                                            <option key={user?.orgUserID} label={user?.text} value={user?.orgUserID} />
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td className="text-[#5E5E5E] text-center">
                                                                    <select
                                                                        className="relative border border-gray rounded-md p-3 user-input bg-white w-48"
                                                                        value={listNotification[indexs]?.user[index]?.PhoneOrgUserID}
                                                                        onChange={(event) => handlePhoneChange(index, event, indexs)}
                                                                        disabled={(listNotification[indexs]?.user[index]?.NotificationType === "Email" || listNotification[indexs]?.user[index]?.NotificationType === "None")}

                                                                    >
                                                                        <option label="Select" value=""></option>
                                                                        {userData?.map((user) => (
                                                                            <option key={user?.orgUserID} label={user?.text} value={user?.orgUserID} />
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}

                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='flex gap-3 items-center mt-4'>
                                            <button
                                                className="bg-primary text-white text-base px-6 py-3 border border-primary shadow-md rounded-full "
                                                type="button"
                                                onClick={() => handleSave(indexs)}
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                                type="button"
                                                onClick={() => handleReset(indexs)}
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {loading && (
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
                )}

            </div>
        </>
    )
}

export default UserNotifications
