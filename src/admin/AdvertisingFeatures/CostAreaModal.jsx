import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiSolidDollarCircle } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { handleAddCostbyarea } from '../../Redux/admin/AdvertisementSlice';

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
        cost: ''
    });
    const [Errors, setErrors] = useState(false);

    useEffect(() => {
        if (EditData?.locationName || EditData?.costPerSec) {
            setdata({
                location: EditData?.locationName,
                cost: EditData?.costPerSec,
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
                const location = place?.geometry?.location;
                setdata({ ...data, location: place?.formatted_address })
                setMarkerPosition({
                    lat: location?.lat(),
                    lng: location?.lng(),
                });

            }
        }
    };

    const onSumbit = () => {
        if (!data?.cost || !data?.location) {
            return setErrors(true);
        }
        const payload = {
            costByAreaID: EditData?.costByAreaID ? EditData?.costByAreaID : 0,
            locationName: data?.location,
            latitude: markerPosition?.lat,
            longitude: markerPosition?.lng,
            costPerSec: data?.cost,
            currency: ""
        }
        dispatch(handleAddCostbyarea(payload)).then((result) => {
            onclose()
            setdata()
            setLoadFirst(true)

        })
    }

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-1000 outline-none focus:outline-none">
                <div className="w-auto my-6 mx-auto lg:max-w-7xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-96 bg-white outline-none focus:outline-none modal lg:w-[800] md:w-[900px]">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <div className="flex items-center">
                                <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                                    {EditData?.costByAreaID ? 'Edit' : 'Add'}  New Location
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
                                <label for='Yes' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                    Location :
                                </label>
                                <Autocomplete

                                    onLoad={(ref) => (autocompleteRef.current = ref)}
                                    onPlaceChanged={onPlaceChanged}
                                >
                                    <input value={data?.location} type="text" placeholder="Search for an area" className='appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3' onChange={(e) => setdata({ ...data, location: e.target.value })} />
                                </Autocomplete>


                                {Errors && data?.location <= 0 && (
                                    <p className="text-red-600 text-sm font-semibold ">Location is Required.</p>
                                )}
                            </div>
                            <div className='w-full'>
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
                                    <div className="border border-[#D5E3FF] rounded">
                                        <BiSolidDollarCircle
                                            size={30}
                                            className="text-black p-[2px]"
                                        />
                                    </div>
                                </div>
                                {Errors && data?.cost <= 0 && (
                                    <p className="text-red-600 text-sm font-semibold ">Cost is Required.</p>
                                )}
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
