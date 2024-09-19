import React, { useEffect, useState } from 'react';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { FaCheckCircle } from 'react-icons/fa';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingScreen, getCostByArea, cancelPendingScreen, updatePendingScreen } from '../../Redux/admin/AdvertisementSlice';
import moment from 'moment';
import { ApproveScreens } from '../../Components/Common/Common';
import { updateAssteScreen } from '../../Redux/CommonSlice';

// Haversine formula to calculate the distance between two geographical points

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export default function Approve() {
    const dispatch = useDispatch();
    const store = useSelector((state) => state?.root?.advertisementData);
    const [loading, setLoading] = useState(false);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(false);
    const [loadFirst, setLoadFirst] = useState(true);
    const [filteredScreens, setFilteredScreens] = useState([]);
    const [cost, setcost] = useState('');
    const [Error, setError] = useState(false);

    useEffect(() => {
        // setLoading(true);
        if (loadFirst) {
            setLoading(true);
            dispatch(getPendingScreen({})).then((res) => {
                const screens = res?.payload?.data || [];

                dispatch(getCostByArea({})).then((locationRes) => {
                    const locationData = locationRes?.payload?.data || [];
                    filterScreens(screens, locationData);
                    setLoading(false);

                });
            });
            setLoadFirst(false);
        }
    }, [loadFirst, dispatch]);

    const filterScreens = (screens, locationData) => {
        const rad = 10; // radius in km (example)

        const isWithinAnyLocationRadius = (screenLat, screenLon, location) => {
            const { latitude, longitude } = location;
            if (latitude && longitude) {
                const distance = haversineDistance(screenLat, screenLon, parseFloat(latitude), parseFloat(longitude));
                return distance <= rad;
            }
            return false;
        };

        // Map screens to include costPerSec based on proximity to location data
        const filtered = screens.map(screen => {
            const screenLat = parseFloat(screen?.latitude);
            const screenLon = parseFloat(screen?.longitude);
            if (isNaN(screenLat) || isNaN(screenLon)) return null;
            const location = locationData?.find(loc => isWithinAnyLocationRadius(screenLat, screenLon, loc));
            return location ? { ...screen, screenRatePerSec: location?.costPerSec } : screen;
        })
        setFilteredScreens(filtered);
    };


    const toggleAccordion = (index) => {
        setOpenAccordionIndex(prevState => prevState === index ? false : index);
    };

    const handleCancelScreen = (item) => {
        const query = { ScreenID: item?.screenID, UserID: item?.userID }
        dispatch(cancelPendingScreen(query)).then((res) => setLoadFirst(true))

    }
    const handleUpdateScreen = (item) => {
        if (!item?.screenRatePerSec) {
            return setError(true)
        }
        const query = { ScreenID: item?.screenID, UserID: item?.userID, ScreenRatePerSec: item?.screenRatePerSec ? item?.screenRatePerSec : cost }
        dispatch(updatePendingScreen(query)).then((res) => setLoadFirst(true))
    }
    const groupedScreens = filteredScreens?.reduce((acc, screen) => {
        const orgId = screen.organizationID;
        if (!acc[orgId]) {
            acc[orgId] = [];
        }
        acc[orgId].push(screen);
        return acc;
    }, {});

    const DeactiveAsste = (item) => {
        const payload = {
            ScreenID: item?.screenID,
            UserID: item?.userID,
            AssetManagement: !item?.assetManagement,
        };

        dispatch(updateAssteScreen(payload)).then((res) => {
            if (res) {
                // dispatch(getAllUserAdScreen(SelectedDate))
                setLoadFirst(true)
            }
        })
    }

    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
                <div className='border-b border-gray pb-3'>
                    <h2 className='font-semibold'>Approve Request</h2>
                </div>
                {loading && (
                    <div className='flex justify-center'>
                        <div className="flex text-center m-5 justify-center items-center">
                            <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
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

                    </div>
                )}
                {!loading && Object.keys(groupedScreens)?.map((orgId, index) => {
                    const screens = groupedScreens[orgId];
                    const userName = screens[0]?.userName;
                    return (
                        <div key={index} className="clear-both">
                            <div className="bg-white rounded-xl mt-8 shadow screen-section">
                                <div className="mt-5 overflow-x-scroll sc-scrollbar sm:rounded-lg h-full">
                                    <div className="accordions shadow-md p-5 bg-blue-100 border border-blue-400 rounded-lg m-4">
                                        <div className="section lg:flex md:flex sm:block items-center justify-between">
                                            <div className="flex gap-2 items-center">
                                                <h1 className="text-sm capitalize font-semibold">You have got a new request from  {userName}.</h1>
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <button onClick={() => toggleAccordion(index)}>
                                                    {openAccordionIndex === index ? (
                                                        <IoIosArrowDropup className="text-3xl" />
                                                    ) : (
                                                        <IoIosArrowDropdown className="text-3xl" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {openAccordionIndex === index && (
                                            <div className="relative overflow-x-scroll sc-scrollbar rounded-lg my-3">
                                                <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <thead className="text-white bg-black dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Screen</th>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Location</th>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Request Date</th>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Status</th>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Asset Management</th>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Requested By</th>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Cost/Sec</th>
                                                            <th scope="col" className="px-6 py-3 font-semibold text-md">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {!loading && screens?.length > 0 ?
                                                            screens?.map((item, index) => (
                                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                                                    <td className="px-6 py-4">{item?.screenName}</td>
                                                                    <td className="px-6 py-4">{item?.googleLocation}</td>
                                                                    <td className="px-6 py-4">
                                                                        {item?.lastSeen ? moment(item?.lastSeen).format("LLL") : null}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-green-600">
                                                                        <span
                                                                            id={`changetvstatus${item?.macID}`}
                                                                            className={`rounded-full px-6 py-2 text-white text-center
                                                                            ${item?.screenStatus === 1 ? "bg-[#3AB700]" : "bg-[#FF0000]"}`}
                                                                        >
                                                                            {item?.screenStatus === 1 ? "Live" : "offline"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <label class="inline-flex items-center cursor-pointer">
                                                                            <input
                                                                                type="checkbox"
                                                                                class="sr-only peer"
                                                                                checked={item?.assetManagement}
                                                                                id={`Active_${item?.ScreenID}`}
                                                                                onChange={() => {
                                                                                    DeactiveAsste(item);
                                                                                }}
                                                                            />
                                                                            <div
                                                                                style={{ background: item?.assetManagement ? 'green' : 'gray', }}
                                                                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${item?.assetManagement ? 'bg-green-500' : 'bg-red-500'}peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-blue-800 dark:bg-gray-700`}
                                                                            >
                                                                                <div
                                                                                    className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-transform duration-200  dark:border-gray-600`} 
                                                                                    style={{
                                                                                        transform: item?.assetManagement ? 'translateX(20px)' : 'translateX(0)',
                                                                                        transition: 'transform 0.5s ease-in-out',
                                                                                    }}
                                                                                ></div>
                                                                            </div>
                                                                        </label>
                                                                    </td>
                                                                    <td className="px-6 py-4">{item?.userName}</td>
                                                                    <td className="px-6 py-4 flex flex-col items-center">
                                                                        <div className=' gap-2'>
                                                                            $
                                                                            {item?.screenRatePerSec ? item?.screenRatePerSec :
                                                                                (<input
                                                                                    type="number"
                                                                                    class="bg-transparent placeholder-slate-400 focus:text-black  focus:border-0 focus:bg-black  focus:ring-0  focus:outline-none  border-b-2 border-current w-10  px-2 ms-2"
                                                                                    onChange={(e) => {
                                                                                        setcost(e.target.value)
                                                                                    }}
                                                                                    value={cost}
                                                                                />)
                                                                            }

                                                                        </div>
                                                                        {cost?.length <= 0 && Error && (
                                                                            <span className='error'>Cost Value is required.</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex gap-1 items-center">
                                                                            <FaCheckCircle size={20} className='text-green'
                                                                                onClick={() => {
                                                                                    handleUpdateScreen(item)
                                                                                }}
                                                                            />
                                                                            <AiFillCloseCircle size={22} className='text-[#FF0000]'
                                                                                onClick={() => {
                                                                                    handleCancelScreen(item)
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                            : !loading && (<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                                <td colSpan={8}>
                                                                    <div className="flex text-center m-5 justify-center">
                                                                        <span className="text-sm font-semibold py-2 px-4 rounded-full me-2 text-black">
                                                                            No Data Available
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>)}
                                                    </tbody>

                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
