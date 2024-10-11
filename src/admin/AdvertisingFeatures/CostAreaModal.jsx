import { Autocomplete, Circle, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { handleAddCostbyarea } from '../../Redux/admin/AdvertisementSlice';
import { BsCurrencyDollar } from 'react-icons/bs';
import { greenOptions, IncludeExclude, kilometersMilesToMeters, kilometersToMeters } from '../../Components/Common/Common';
import { MdCurrencyRupee } from 'react-icons/md';
import toast from 'react-hot-toast';

const containerStyle = {
    width: '100%',
    height: '330px',
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};
export default function CostAreaModal({ setLoadFirst, EditData, onclose, location }) {

    const dispatch = useDispatch();
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk', // Replace with your API key
        libraries: ['places'],
    });
    const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 });
    const [map, setMap] = useState(null);
    const autocompleteRef = useRef(null);
    const [Errors, setErrors] = useState(false);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [data, setdata] = useState({
        location: '',
        cost: '',
        range: '',
        currency: 'Indian',
        unit: 'km'

    });

    useEffect(() => {
        if (EditData) {
            setdata({
                location: EditData.locationName || '',
                cost: EditData.costPerSec || '',
                currency: EditData.currency || 'Indian',
                range: EditData.range || '',
                unit: EditData.unit || '',
            });
            if (EditData.latitude || EditData.longitude) {
                map?.setZoom(14);

                setMarkerPosition({
                    lat: parseFloat(EditData?.latitude) || 0,
                    lng: parseFloat(EditData?.longitude) || 0,
                });
                setCenter({
                    lat: parseFloat(EditData?.latitude) || 0,
                    lng: parseFloat(EditData?.longitude) || 0,
                });
            }

        }
        if (location) {
            setdata({ ...data, location: location?.locationName, })
            setCenter({
                lat: parseFloat(location?.latitude),
                lng: parseFloat(location?.longitude),
            });
            setMarkerPosition({
                lat: parseFloat(location?.latitude) || 0,
                lng: parseFloat(location?.longitude) || 0,
            });
        }
    }, [EditData, location]);

    const onLoad = (mapInstance) => {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: parseFloat(center.lat), lng: parseFloat(center.lng) });

        // mapInstance.fitBounds(bounds);
        setMap(mapInstance);
        if (EditData?.latitude || EditData?.longitude) {
            mapInstance.setZoom(12);
            setCenter({
                lat: EditData?.latitude,
                lng: EditData?.longitude,
            });
        }
        if (location?.latitude || location?.longitude) {
            mapInstance.setZoom(12);
            setCenter({
                lat: location?.latitude,
                lng: location?.longitude,
            });
        }
    };


    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place?.geometry) {
                const location = place.geometry.location;
                setdata({ ...data, location: place.formatted_address });
                map.setZoom(12);

                setMarkerPosition({
                    lat: location.lat(),
                    lng: location.lng(),
                });
                setCenter({ lat: location.lat(), lng: location.lng() }); // Center map on selected location
            }
        }
    };

    const onSumbit = () => {
        if (!data.cost || !data.location || markerPosition === null || !data.range) {
            return setErrors(true);
        }

        const payload = {
            costByAreaID: EditData?.costByAreaID || 0,
            locationName: data.location,
            latitude: markerPosition.lat,
            longitude: markerPosition.lng,
            costPerSec: data.cost,
            currency: data.currency,
            range: data.range,
            unit: data.unit,
        };
        dispatch(handleAddCostbyarea(payload)).then((res) => {
            if (res?.payload?.status) {
                setLoadFirst(true);
                toast.success('Location Saved Successfully');
            } else {
                toast.error(res?.payload?.message);
            }
            onclose();
            setdata({ location: '', cost: '', range: '', currency: 'Indian' });
        });
    };

    const getZoomLevel = (range) => {
        if (range <= 1) return 15;
        if (range <= 5) return 12;
        return 10;
    };

    if (!isLoaded) return;

    return (
        <div>
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-1000 outline-none focus:outline-none">
                <div className="w-auto my-6 mx-auto lg:max-w-8xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none modal lg:w-[800px] md:w-[800px] md:h-[500px]">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <div className="flex items-center">
                                <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium ">
                                    {EditData?.costByAreaID ? 'Edit' : 'Add New'} Location
                                </h3>
                            </div>
                            <button className="p-1 text-xl ml-8" onClick={onclose}>
                                <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                        </div>
                        <div className='grid grid-cols-12 gap-3 p-5 h-full'>
                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 border-white shadow-lg rounded-lg px-2'>
                                <div className=" ">
                                    <div className='w-full my-3'>
                                        <Autocomplete
                                            onLoad={(ref) => (autocompleteRef.current = ref)}
                                            onPlaceChanged={onPlaceChanged}
                                            renderMenu={item => (
                                                <div className="dropdown">
                                                    {item}
                                                </div>
                                            )}
                                        >
                                            <input value={data?.location} type="text" placeholder="Search for an area" className='appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3'
                                                onChange={(e) => { setdata({ ...data, location: e.target.value }); setMarkerPosition(null) }}
                                            />
                                        </Autocomplete>
                                        {Errors && data?.location <= 0 ? (<p className="text-red-600 text-sm font-semibold ">Location is Required.</p>) : Errors && markerPosition === null && <p className="text-red-600 text-sm font-semibold ">Please select the correct location</p>}
                                    </div>
                                    <div className='flex justify-start items-center gap-2 mb-3'>
                                        <label for='Yes' className="mr-3 lg:text-base md:text-base sm:text-xs xs:text-xs">Range :</label>
                                        <input
                                            type='number'
                                            min={0}
                                            value={data?.range}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value)
                                                setdata({ ...data, range: value });
                                                const newZoom = getZoomLevel(value); // Get the zoom level based on range
                                                map.setZoom(newZoom);
                                                if (markerPosition) {
                                                    map.panTo(markerPosition); // Center the map on the marker
                                                }
                                            }}
                                            className='appearance-none border border-[#D5E3FF] rounded w-16 py-1 px-3'
                                        />
                                        <select
                                            className="border border-[#D5E3FF] rounded  px-4 pl-2 py-1 w-20"
                                            value={data?.unit}
                                            onChange={(e) => {
                                                setdata({ ...data, unit: e.target.value });
                                                map.setZoom(12);
                                                if (markerPosition) {
                                                    map.panTo(markerPosition);
                                                }
                                            }}
                                        >
                                            {IncludeExclude.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='w-full mb-3'>
                                        <div className="flex items-center justify-start   gap-3">
                                            <label for='Yes' className=" lg:text-base md:text-base sm:text-xs xs:text-xs ">Cost / sec. :</label>
                                            <input
                                                className=" appearance-none border border-[#D5E3FF] rounded w-[100px] py-1 px-3"
                                                type="number"
                                                value={data?.cost}
                                                onChange={(e) => {
                                                    setdata({ ...data, cost: e.target.value })
                                                }}
                                            />
                                            <div className=" flex items-center">
                                                <select
                                                    className="border border-[#D5E3FF] rounded  px-4 pl-2 py-1 "
                                                    value={data?.currency}
                                                    onChange={(e) => setdata({ ...data, currency: e.target.value })}
                                                >
                                                    <option value={'Indian'}>Indian</option>
                                                    <option value={'Other'}>Other</option>
                                                </select>
                                            </div>
                                            {/* <div className="border border-[#D5E3FF] rounded font-bold text-black text-3xl">￠</div> */}
                                        </div>
                                        {Errors && data?.cost <= 0 && (
                                            <p className="text-red-600 text-sm font-semibold ">Cost is Required.</p>
                                        )}
                                    </div>

                                    {/* <div className="flex justify-start items-center gap-2 my-2">
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
                                            <label for='Monthly' className="border border-[#D5E3FF] rounded font-bold text-black text-xl p-[2px] ml-2">
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
                                            <label for='Annually' className="border border-[#D5E3FF] rounded font-bold text-black text-xl p-[2px] ml-2">
                                                <BsCurrencyDollar />
                                            </label>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 border-white shadow-lg'>
                                <div className="h-full">
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={center}
                                        zoom={5}
                                        onLoad={onLoad}
                                        options={options}
                                    >
                                        {markerPosition && (
                                            <>
                                                <Circle
                                                    center={markerPosition}
                                                    options={greenOptions}
                                                    radius={kilometersMilesToMeters(data)}
                                                />
                                                <Marker position={markerPosition} />
                                            </>
                                        )}

                                        {markerPosition && (
                                            <Marker position={markerPosition} />
                                        )}
                                    </GoogleMap>
                                </div>
                            </div>
                        </div>
                        <div className="pb-6 flex justify-center mt-3">
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
    );
}
