import React, { useEffect, useState } from 'react';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { FaCheckCircle } from 'react-icons/fa';
import { AiFillCloseCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useDispatch, } from 'react-redux';
import { getPendingScreen, getCostByArea, cancelPendingScreen, updatePendingScreen } from '../../Redux/admin/AdvertisementSlice';
import moment from 'moment';
import { calculateDistance, formatINRCurrency, formatToUSCurrency } from '../../Components/Common/Common';
import { updateAssteScreen } from '../../Redux/CommonSlice';
import ReactTooltip from 'react-tooltip';
import CostAreaModal from './CostAreaModal';

export default function Approve({ handleTab }) {
    const dispatch = useDispatch();
    // const store = useSelector((state) => state?.root?.advertisementData);
    const [loading, setLoading] = useState(false);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(false);
    const [loadFirst, setLoadFirst] = useState(true);
    const [filteredScreens, setFilteredScreens] = useState([]);
    const [location, setLocation] = useState({ locationName: '', latitude: '', longitude: '' });
    const [assetManagement, setAssetManagement] = useState({});
    const [AreaModal, setAreaModal] = useState(false);

    useEffect(() => {
        if (loadFirst) {
            setLoading(true);
            dispatch(getPendingScreen({})).then((res) => {
                const screens = res?.payload?.data || [];
                const initialAssetManagement = {};
                screens.forEach(screen => {
                    initialAssetManagement[screen.screenID] = screen?.assetManagement; // Default to false or your desired initial state
                });
                setAssetManagement(initialAssetManagement);

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
                const distance = calculateDistance(screenLat, screenLon, parseFloat(latitude), parseFloat(longitude));
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
            return location ? { ...screen, screenRatePerSec: location?.costPerSec, currency: location?.currency } : screen;
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
        const query = { ScreenID: item?.screenID, UserID: item?.userID, ScreenRatePerSec: item?.screenRatePerSec, Currency: item?.currency }
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


    const DeactiveAsste = async (item) => {
        setAssetManagement(prev => {
            const newModalState = { ...prev };
            const index = item?.screenID;
            newModalState[index] = !prev[index];

            const payload = {
                ScreenID: item?.screenID,
                UserID: item?.userID,
                AssetManagement: newModalState[item?.screenID],
            };
            try {
                const res = dispatch(updateAssteScreen(payload));
                if (res) {
                    dispatch(getPendingScreen({}));
                }
            } catch (error) {
                console.error("Error updating asset management:", error);
            }
            return newModalState;
        });
    }

    const onclose = () => { setAreaModal(!AreaModal) }

    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
                <div className='border-b border-gray pb-3'>
                    <h2 className='font-semibold text-2xl'>Approve Request</h2>
                </div>
                {loading && (
                    <div className='flex justify-center items-center h-96'>
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
                <div className="clear-both">
                    <div className="bg-white rounded-xl mt-8 shadow screen-section">
                        {!loading && Object.keys(groupedScreens)?.map((orgId, index) => {
                            const screens = groupedScreens[orgId];
                            const userName = screens[0]?.userName;
                            return (
                                <div className="mt-5 cursor-pointer overflow-x-scroll sc-scrollbar sm:rounded-lg h-full" key={index}>
                                    <div className="accordions shadow-md p-5 bg-blue-100 border border-blue-400 rounded-lg m-4">
                                        <div className="section lg:flex md:flex sm:block items-center justify-between"
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            <div className="flex gap-2 items-center">
                                                <h1 className="text-sm capitalize font-semibold">You have got a new request from  {userName}.</h1>
                                            </div>

                                            <div className="flex items-center justify-end">
                                                <button >
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
                                                                    <td className="px-6 py-4">{item?.screenName}  </td>
                                                                    <td className="px-6 py-4">{item?.googleLocation}</td>
                                                                    <td className="px-6 py-4">
                                                                        {item?.updatedDate ? moment(item?.updatedDate).format("LLL") : null}
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
                                                                        <label className="inline-flex items-center cursor-pointer">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="sr-only peer"
                                                                                checked={assetManagement[item?.screenID]}
                                                                                id={`Active_${item?.screenID}`}
                                                                                onChange={() => DeactiveAsste(item)}
                                                                            />
                                                                            <div
                                                                                style={{ background: (assetManagement[item?.screenID] ? 'green' : 'gray') }}
                                                                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${(assetManagement[item?.screenID] ? 'bg-green-500' : 'bg-red-500')} peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-blue-800 dark:bg-gray-700`}
                                                                            >
                                                                                <div
                                                                                    className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-transform duration-200 dark:border-gray-600`}
                                                                                    style={{
                                                                                        transform: (assetManagement[item?.screenID] ? 'translateX(20px)' : 'translateX(0)'),
                                                                                        transition: 'transform 0.5s ease-in-out',
                                                                                    }}
                                                                                ></div>
                                                                            </div>
                                                                        </label>
                                                                    </td>
                                                                    <td className="px-6 py-4 ">{item?.userName}</td>
                                                                    <td className="px-6 py-4 ">
                                                                        <div>
                                                                            {item?.screenRatePerSec ? `${item?.currency === 'INR' ? formatINRCurrency(item?.screenRatePerSec) : formatToUSCurrency(item?.screenRatePerSec)}` : ''}

                                                                            {/* {item?.screenRatePerSec ? item?.screenRatePerSec :
                                                                                (<input
                                                                                    type="number"
                                                                                    class="bg-transparent placeholder-slate-400 focus:text-black  focus:border-0 focus:bg-black  focus:ring-0  focus:outline-none  border-b-2 border-current w-10  px-2 ms-2"
                                                                                    onChange={(e) => {
                                                                                        setcost(e.target.value)
                                                                                    }}
                                                                                    value={cost}
                                                                                />)
                                                                            } */}

                                                                        </div>

                                                                        {/* {cost?.length <= 0 && Error && (
                                                                            <span className='error'>Cost Value is required.</span>
                                                                        )} */}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        {item?.screenRatePerSec ? (
                                                                            <div className="flex gap-1 justify-center">
                                                                                <div className="cursor-pointer text-xl flex gap-4">
                                                                                    <button
                                                                                        data-tip
                                                                                        data-for="Approve"
                                                                                        type="button"
                                                                                        className="cursor-pointer  focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg  text-center inline-flex items-center "
                                                                                        onClick={() => {
                                                                                            handleUpdateScreen(item)
                                                                                        }}
                                                                                    >
                                                                                        <FaCheckCircle size={20} className='text-green' />
                                                                                        <ReactTooltip
                                                                                            id="Approve"
                                                                                            place="bottom"
                                                                                            type="warning"
                                                                                            effect="solid"
                                                                                        >
                                                                                            <span>Approve</span>
                                                                                        </ReactTooltip>
                                                                                    </button>
                                                                                </div>

                                                                                <div className="cursor-pointer text-xl flex  ">
                                                                                    <button
                                                                                        data-tip
                                                                                        data-for="Rejected"
                                                                                        type="button"
                                                                                        className="rounded-full  text-center "
                                                                                        onClick={() => {
                                                                                            handleCancelScreen(item)
                                                                                        }}
                                                                                    >
                                                                                        <AiFillCloseCircle size={22} className='text-[#FF0000]' />
                                                                                        <ReactTooltip
                                                                                            id="Rejected"
                                                                                            place="bottom"
                                                                                            type="warning"
                                                                                            effect="solid"
                                                                                        >
                                                                                            <span>Rejected</span>
                                                                                        </ReactTooltip>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (<>
                                                                            <div className="cursor-pointer text-xl flex gap-4">
                                                                                <button
                                                                                    data-tip
                                                                                    data-for="Location"
                                                                                    type="button"
                                                                                    className="cursor-pointer  focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg  text-center inline-flex items-center "
                                                                                    onClick={() => { setAreaModal(true); setLocation({ locationName: item?.googleLocation, latitude: item?.latitude, longitude: item?.longitude }) }}
                                                                                >
                                                                                    <AiOutlinePlusCircle
                                                                                        size={25}
                                                                                        className="mx-auto cursor-pointer text-[black]"
                                                                                        onClick={() => { setAreaModal(true); setLocation({ locationName: item?.googleLocation, latitude: item?.latitude, longitude: item?.longitude }) }}
                                                                                    />
                                                                                    <ReactTooltip
                                                                                        id="Location"
                                                                                        place="bottom"
                                                                                        type="warning"
                                                                                        effect="solid"
                                                                                    >
                                                                                        <span>Location</span>
                                                                                    </ReactTooltip>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                        )}
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
                            )
                        })}
                    </div>
                </div>
            </div>
            {AreaModal && <CostAreaModal setLoadFirst={setLoadFirst} onclose={onclose} location={location} />}
        </div>
    );
}
