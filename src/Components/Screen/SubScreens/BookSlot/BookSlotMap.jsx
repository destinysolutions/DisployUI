import React, { useRef, useState } from 'react'
import { FiMapPin } from 'react-icons/fi';
import Select from "react-select";
import { filterScreensDistance, formatToUSCurrency, greenOptions, IncludeExclude, kilometersToMeters, secondsToHMS, } from '../../../Common/Common';
import L from "leaflet";
import mapImg from "../../../../images/DisployImg/mapImg.png";
import { Autocomplete, GoogleMap, useLoadScript, Circle, Marker, InfoWindow, MarkerClusterer, } from '@react-google-maps/api';
import { RiDeleteBinLine } from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import logo from "../../../../images/DisployImg/Black-Logo2.png";
import ReactTooltip from 'react-tooltip';


export default function BookSlotMap({
    totalPrice,
    totalDuration,
    setAllArea,
    setScreenData,
    setSelectAllScreen,
    setSelectedScreens,
    handleSelectChange,
    Screenoptions,
    selectAllScreen,
    selectedScreen,
    selectedScreens,
    setSelectedScreen,
    screenData,
    handleNext,
    handleBack,
    allArea,
    handleRangeChange,
    getSelectedVal,
    setSelectedVal,
    selectedVal,
    setAllCity
}) {

    const autocompleteRef = useRef(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk', // Replace with your API key
        libraries: ['places'], // Load Places library
    });
    const [map, setMap] = useState(null);
    const center = { lat: 20.5937, lng: 78.9629 };
    const [locations, setLocations] = useState(center);

    const customIcon = new L.Icon({
        iconUrl: mapImg,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -16],
    });
    const containerStyle = {
        width: '100%',
        height: '300px',
    };
    const options = {
        disableDefaultUI: true,
        scrollwheel: true,
        zoomControl: true,
    };

    const handleAreaChange = (e, index) => {
        const { value } = e.target;
        const updatedDis = [...allArea];
        updatedDis[index].area = value;
        setAllArea(updatedDis);
    };

    const onLoad = (mapInstance) => {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: parseFloat(center.lat), lng: parseFloat(center.lng) });

        setMap(mapInstance);
    };

    const handleIncludeChange = (e, index) => {
        const { value } = e.target;
        const updatedDis = [...allArea];
        updatedDis[index].include = value;
        setAllArea(updatedDis);
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef?.current.getPlace();
            if (place?.geometry) {
                const location = place?.geometry?.location;
                const latlog = { latitude: location?.lat(), longitude: location?.lng(), searchValue: place?.formatted_address }
                setLocations({ lat: latlog?.latitude, lng: latlog?.longitude });
                if (map) {
                    map.setCenter({ lat: latlog.latitude, lng: latlog.longitude });
                    map.setZoom(10);
                }
                setSelectedVal(place?.formatted_address)
                getSelectedVal(latlog)
            }
        }
    };
    if (!isLoaded) return;
    return (
        <div className="w-full h-full p-5 flex items-center justify-center  ">
            <div className="lg:w-[900px] md:w-[700px] w-full bg-white lg:p-6 p-3 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <img
                        alt="Logo"
                        src={logo}
                        className="cursor-pointer duration-500 w-52"
                    />
                </div>
                <div className="grid grid-cols-8 gap-4 pt-5">
                    <div className="col-span-5">
                        <div className="flex flex-row items-center gap-2 mb-2">
                            <h2 className="text-xl font-semibold">Find Your Screens</h2>
                        </div>
                        <div className="flex flex-col gap-2 h-full">
                            <div className='overflow-y-scroll max-h-28'>
                                {allArea?.map((item, index) => {
                                    return (
                                        <div className='flex flex-row gap-2 items-center justify-between mb-2'>
                                            <div
                                                className="cursor-pointer flex flex-row gap-2 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-96 p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                key={index}
                                                onClick={() => { setLocations({ lat: item.latitude, lng: item.longitude }); setSelectedScreen(item) }}
                                            >
                                                <span className="flex items-center ">
                                                    <FiMapPin className="w-5 h-5 text-black " />
                                                </span>
                                                <div className="text-sm flex items-center">
                                                    <h2>{item?.searchValue}</h2>
                                                </div>
                                            </div>
                                            <div className="text-sm flex items-center">
                                                <form
                                                    onSubmit={(e) => handleRangeChange(e, item)}
                                                    className="flex-initial w-fit"
                                                >
                                                    <input
                                                        type='number'
                                                        min={0}
                                                        value={item?.area}
                                                        onChange={(e) => handleAreaChange(e, index)}
                                                        className='p-0 w-16 px-3 py-2  border border-primary rounded-md'
                                                    />
                                                </form>
                                            </div>
                                            <select
                                                className="border border-primary rounded-lg px-4 pl-2 py-2 w-28"
                                                value={item?.include}
                                                onChange={(e) => handleIncludeChange(e, index)}
                                            >
                                                <option className="hidden" value=''>Select Code </option>
                                                {IncludeExclude.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                data-tip
                                                data-for="Delete"
                                                type="button"
                                                className="rounded-full text-lg p-1.5 text-white text-center bg-[#FF0000] "
                                                onClick={() => {
                                                    const updatedQuestions = allArea.filter((_, i) => i !== index);
                                                    setAllArea(updatedQuestions);
                                                    const matchingScreens = filterScreensDistance(updatedQuestions, screenData,);
                                                    setScreenData(matchingScreens);

                                                }}
                                            >
                                                <RiDeleteBinLine />
                                                <ReactTooltip
                                                    id="Delete"
                                                    place="bottom"
                                                    type="warning"
                                                    effect="solid"
                                                >
                                                    <span>Delete</span>
                                                </ReactTooltip>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {allArea?.length < 5 && (
                                <div className="flex justify-between items-center gap-4">
                                    {/* <select
                                        className="border border-primary rounded-lg px-4 pl-2 py-2 w-36"
                                        value={selectedValue}
                                        onChange={handleChange}
                                    >
                                        {IncludeExclude.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select> */}

                                    <div className="w-full">
                                        <div className="relative col-span-2">
                                            <div className="col-span-3">
                                                <Autocomplete
                                                    onLoad={(ref) => (autocompleteRef.current = ref)}
                                                    onPlaceChanged={onPlaceChanged}
                                                >
                                                    <div className='relative'>
                                                        <span className="flex items-center absolute top-2 bottom-2 left-2 ">
                                                            <IoSearch className="w-5 h-5 text-black " />
                                                        </span>
                                                        <input value={selectedVal} type="text" placeholder="Search for an area" className='appearance-none border border-[#D5E3FF] rounded w-full py-2 px-9' onChange={(e) => setSelectedVal(e.target.value)} />
                                                    </div>
                                                </Autocomplete>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-5 flex flex-col">
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={locations}
                                    zoom={12}
                                    // onLoad={onLoad}
                                    options={options}
                                >
                                    {allArea?.map((item, index) => {
                                        return (
                                            <Circle
                                                key={index}
                                                center={{ lat: item.latitude, lng: item.longitude }}
                                                options={greenOptions}
                                                radius={kilometersToMeters(item?.area)}
                                            />
                                        );
                                    })}

                                    <MarkerClusterer
                                        options={{
                                            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                                            maxZoom: 20
                                        }}
                                    >
                                        {(clusterer) =>
                                            screenData.map((screen, index) => {
                                                const lat = parseFloat(screen?.latitude);
                                                const lng = parseFloat(screen?.longitude);
                                                return (
                                                    <Marker
                                                        key={index}
                                                        position={{ lat, lng }}
                                                        icon={customIcon}
                                                        clusterer={clusterer}
                                                        onClick={() => {
                                                            setSelectedScreen(screen);
                                                        }}
                                                    >
                                                        {/*{selectedScreen?.googleLocation === screen?.googleLocation && (
                                                            <InfoWindow
                                                                onCloseClick={() => setSelectedScreen(null)}>
                                                                <h3 className="flex flex-row gap-1 p-0">
                                                                    <span>Location :</span>
                                                                    <span>{screen?.googleLocation}</span>
                                                                </h3>
                                                            </InfoWindow>
                                                        )}*/}
                                                    </Marker>
                                                );
                                            })
                                        }
                                    </MarkerClusterer>
                                    {/*{selectedScreen?.searchValue && (
                                        <InfoWindow
                                            position={{ lat: selectedScreen.latitude, lng: selectedScreen.longitude }} onCloseClick={() => setSelectedScreen(null)}>
                                            <h3 className="flex flex-row gap-1 p-0">
                                                <span>Location :</span>
                                                <span>{selectedScreen?.searchValue}</span>
                                            </h3>
                                        </InfoWindow>
                                    )}*/}
                                </GoogleMap>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-3 gap-2">
                        <div className='flex flex-row gap-2 items-center'>
                            <div className='font-semibold'>Reach</div>
                            <div className="text-lg bg-zinc-300 p-0.5 rounded-lg px-2">
                                {selectedScreens?.length} Screens
                            </div>
                        </div>
                        <div>
                            Do you want to book your slot for all screens or any
                            particular screen?
                        </div>

                        <div className="grid grid-cols-4 gap-4 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <div className="col-span-3">
                                <h2>All Screen</h2>
                            </div>

                            <span className="col-span-1 flex items-center justify-end">
                                <input
                                    type="checkbox"
                                    className="cursor-pointer"
                                    value={selectAllScreen}
                                    disabled={screenData?.length === 0}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectAllScreen(true);
                                            setSelectedScreens(Screenoptions);
                                        } else {
                                            setSelectAllScreen(false);
                                            setSelectedScreens([]);
                                        }
                                    }}
                                />
                            </span>
                        </div>
                        <Select
                            value={selectedScreens}
                            onChange={handleSelectChange}
                            options={Screenoptions.map((item) => ({
                                value: item.value,
                                label: (
                                    <div className='flex items-center justify-between gap-2' style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className='text-sm'>{item.label}</span>
                                        <span className='text-sm'>{item.Price}/Sec.</span>
                                        {(item?.screenOrientation === 1 || item?.screenOrientation === 3) && (
                                            <span className='h-2 w-7 bg-gray-400' ></span>
                                        )}
                                        {(item?.screenOrientation === 2 || item?.screenOrientation === 4) && (
                                            <span className='h-6 w-2 bg-gray-400' ></span>
                                        )}
                                    </div>
                                ),
                                Price: item?.Price,
                                // screenOrientation: item?.screenOrientation,
                            }))}
                            isMulti
                        />
                        <div className="h-full w-full flex items-end">
                            <div className='w-full'>
                                <div className="flex items-center justify-between  w-full">
                                    <label className="text-md font-medium">Repetition Duration:</label>
                                    <label for='Yes' className=" lg:text-md md:text-md sm:text-sm xs:text-xs">{secondsToHMS(totalDuration)}</label>
                                </div>
                                {/* <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Total balance credit:</label>
                                    <label for='Yes' className=" lg:text-sm md:text-sm sm:text-xs xs:text-xs">$0.00</label>
                                    </div> */}
                                <div className="flex items-center justify-between">
                                    <label className="text-md font-medium">Total Payable Amount:</label>
                                    <label for='Yes' className=" lg:text-md md:text-md sm:text-sm xs:text-xs">{formatToUSCurrency(totalPrice)}</label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className='py-4'>
                    <hr />
                </div>
                <div className="flex justify-center items-center">
                    <button
                        className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                        onClick={() => handleBack()}
                    >
                        Back
                    </button>
                    <button
                        className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                        onClick={() => handleNext()}
                    >
                        Book Your Slot
                    </button>
                </div>
            </div>

        </div >

    )
}
