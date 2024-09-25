import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { handleAddCostbyarea } from '../../Redux/admin/AdvertisementSlice';
import { BsCurrencyDollar } from 'react-icons/bs';
import { MdCurrencyRupee } from 'react-icons/md';

export default function CostAreaModal({ setLoadFirst, EditData, onclose }) {
    const dispatch = useDispatch()

    const autocompleteRef = useRef(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk', // Replace with your API key
        libraries: ['places'], // Load Places library
    });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [data, setdata] = useState({
        location: '',
        cost: '',
        range: '',
        currency: 'Indian'
    });
    const [Errors, setErrors] = useState(false);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        if (EditData?.locationName || EditData?.costPerSec) {
            setdata({
                location: EditData?.locationName,
                cost: EditData?.costPerSec,
                currency: EditData?.currency,
                range: EditData?.range,
            })
        }
        setMarkerPosition({
            lat: EditData?.latitude,
            lng: EditData?.longitude,
        })

    }, [EditData]);

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place?.geometry) {
                const location = place.geometry.location;
                setLocationError(place.formatted_address)

                setdata({ ...data, location: place.formatted_address });
                setMarkerPosition({
                    lat: location.lat(),
                    lng: location.lng(),
                });

            }
        }
    };

    const onSumbit = () => {
        if (!data?.cost || !data?.location || !locationError) {
            return setErrors(true);
        }

        const payload = {
            costByAreaID: EditData?.costByAreaID ? EditData?.costByAreaID : 0,
            locationName: data?.location,
            latitude: markerPosition?.lat,
            longitude: markerPosition?.lng,
            costPerSec: data?.cost,
            currency: data?.currency,
            range: data?.range ? data?.range : 5
        }
        console.log('payload :>> ', payload);

        dispatch(handleAddCostbyarea(payload)).then((result) => {
            onclose()
            setdata()
            setLoadFirst(true)

        })
    }

    if (!isLoaded) return;

    return (
        <div>
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-1000 outline-none focus:outline-none">
                <div className="w-auto my-6 mx-auto lg:max-w-8xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none modal lg:w-[800] md:w-[600px]">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <div className="flex items-center">
                                <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium ">
                                    {EditData?.costByAreaID ? 'Edit' : 'Add New'}   Location
                                </h3>
                            </div>
                            <button
                                className="p-1 text-xl ml-8"
                                onClick={onclose}
                            >
                                <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                        </div>
                        <div className=" p-5 ">
                            <div className='w-full my-3'>
                                <Autocomplete
                                    className='border'
                                    onLoad={(ref) => (autocompleteRef.current = ref)}
                                    onPlaceChanged={onPlaceChanged}
                                    renderMenu={item => (
                                        <div className="dropdown">
                                            {item}
                                        </div>
                                    )}
                                >
                                    <input value={data?.location} type="text" placeholder="Search for an area" className='appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3'
                                        onChange={(e) => setdata({ ...data, location: e.target.value })}
                                    />
                                </Autocomplete>
                                {Errors && data?.location <= 0 ? (<p className="text-red-600 text-sm font-semibold ">Location is Required.</p>) : Errors && locationError <= 0 && <p className="text-red-600 text-sm font-semibold ">Please select the correct location</p>}
                            </div>
                            <div className='w-full mb-3'>
                                <div className="flex items-center justify-center gap-3 w-full">
                                    <input
                                        className=" appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3"
                                        type="number"
                                        placeholder="Set Cost / sec."
                                        value={data?.cost}
                                        onChange={(e) => {
                                            setdata({ ...data, cost: e.target.value })
                                        }}
                                    />
                                    {/* <div className="border border-[#D5E3FF] rounded font-bold text-black text-3xl">
                                        ￠
                                    </div> */}
                                </div>
                                {Errors && data?.cost <= 0 && (
                                    <p className="text-red-600 text-sm font-semibold ">Cost is Required.</p>
                                )}
                            </div>
                            {/* <div className='w-full mb-3'>
                                <select
                                    className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                                    id="selectOption"
                                // value={item.sequence}
                                // onChange={(e) => handleSequenceChange(index, e.target.value)}
                                >
                                    <option className='hidden'>Select Currency</option>
                                    <option value="Indian">Indian (₹)</option>
                                    <option value="Dollar">Dollar ($)</option>
                                </select>
                            </div> */}
                            <div className="flex justify-start items-center gap-2 my-2">
                                <label for='Yes' className="mr-3 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                    Currency :
                                </label>
                                <div className=" flex items-center">
                                    <input
                                        type="radio"
                                        value={data?.currency === 'Indian'}
                                        checked={data?.currency === 'Indian'}
                                        name="Monthly"
                                        id='Monthly'
                                        onChange={(e) => {
                                            setdata({ ...data, currency: 'Indian' })
                                        }}
                                    />
                                    <label for='Monthly' className="border border-[#D5E3FF] rounded font-bold text-black text-3xl p-[2px] ml-2">
                                        <MdCurrencyRupee />
                                    </label>
                                </div>
                                <div className="ml-3 flex items-center">
                                    <input
                                        id='Annually'
                                        type="radio"
                                        value={data?.currency === 'Dollar'}
                                        checked={data?.currency === 'Dollar'}
                                        name="Annually"
                                        onChange={(e) => {
                                            setdata({ ...data, currency: 'Dollar' })
                                        }}
                                    />
                                    <label for='Annually' className="border border-[#D5E3FF] rounded font-bold text-black text-3xl p-[2px] ml-2">
                                        <BsCurrencyDollar />
                                    </label>

                                </div>
                            </div>
                            <div className='flex justify-start items-center gap-2'>
                                <label for='Yes' className="mr-3 lg:text-base md:text-base sm:text-xs xs:text-xs">Range :</label>
                                <div className='relative mb-2'>
                                    <input
                                        id="labels-range-input"
                                        type="range"
                                        min="0"
                                        max="30"
                                        step="0"
                                        value={data?.range}
                                        onChange={(e) => setdata({ ...data, range: parseInt(e.target.value) })}
                                        className="w-40 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">5</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">30</span>
                                </div>
                            </div>
                        </div>
                        <div className="pb-6 flex justify-center">
                            <button
                                type='button'
                                className="bg-primary text-white px-8 py-2 rounded-full"
                                onClick={onSumbit}
                            >
                                {EditData?.costByAreaID ? 'Update' : "Save"}
                            </button>

                            <button
                                className="bg-primary text-white px-4 py-2 rounded-full ml-3"
                                onClick={onclose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
