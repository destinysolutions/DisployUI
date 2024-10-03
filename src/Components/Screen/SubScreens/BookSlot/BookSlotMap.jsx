import React, { useEffect, useRef, useState } from 'react'
import { BsCheckCircleFill } from 'react-icons/bs';
import { FiMapPin } from 'react-icons/fi';
import { MdArrowBackIosNew } from 'react-icons/md';
import Select from "react-select";
import InputAuto from '../../../Common/InputAuto';
import { ALL_CITY } from '../../../../Pages/Api';
import axios from 'axios';
import { greenOptions, IncludeExclude, kilometersToMeters } from '../../../Common/Common';
import { CgSearch } from 'react-icons/cg';
import { Circle, LayerGroup, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import mapImg from "../../../../images/DisployImg/mapImg.png";
import { Autocomplete, useLoadScript } from '@react-google-maps/api';


export default function BookSlotMap({ handleSelectCountries, selectedCountry, totalPrice, totalDuration, setAllArea, setlocationDis, locationDis,
    setSelectedValue,
    setSelectAllScreen, setSelectedScreens,
    handleSelectChange, Screenoptions,
    selectAllScreen, selectedScreen, selectedScreens,
    setSelectedScreen, screenData, screenArea,
    handleNext, countries, handleBack, allArea,
    setSelectedItem, selectedItem, Open, setOpen, handleRangeChange,
    getSelectedVal, setSelectedVal, selectedVal, setAllCity }) {


    const autocompleteRef = useRef(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk', // Replace with your API key
        libraries: ['places'], // Load Places library
    });
    const [zoom, setZoom] = useState(4);
    const center = [20.5937, 78.9629];
    const customIcon = new L.Icon({
        iconUrl: mapImg,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
    console.log('screenArea :>> ', screenArea);
    console.log('screenData :>> ', screenData);
    const handleAreaChange = (e, index) => {
        const { value } = e.target;
        const updatedDis = [...allArea];
        updatedDis[index].area = value;
        setAllArea(updatedDis);
    };


    const handleScreenClick = (screen) => {
        setSelectedScreen(screen);
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value); // Update the state with the selected value
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place?.geometry) {
                const location = place?.geometry?.location;
                const latlog = { latitude: location?.lat(), longitude: location?.lng(), searchValue: place?.formatted_address }
                setSelectedVal(place?.formatted_address)
                setZoom(14);
                getSelectedVal(latlog)
                // setdata({ ...data, location: place?.formatted_address })
                // setMarkerPosition({
                //   lat: location?.lat(),
                //   lng: location?.lng(),
                // });

            }
        }
    };
    if (!isLoaded) return;

    return (
        <div className="w-full h-full p-5 flex items-center justify-center  ">
            <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg   ">
                <div className="flex flex-row items-center gap-2">
                    <div className="icons flex items-center">
                        <div>
                            <button
                                className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                                onClick={() => handleBack()}
                            >
                                <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                            </button>
                        </div>
                    </div>
                    <div className="text-2xl font-semibold">Find Your Screen</div>
                </div>
                <div className="grid grid-cols-3 gap-4 h-[90%] overflow-auto sc-scrollbar ">
                    <div className="col-span-2 rounded-lg shadow-md bg-white p-5">
                        <div className="flex flex-col gap-2 h-full">

                            {allArea?.map((item, index) => {
                                return (
                                    <div className='flex flex-row gap-2'>
                                        <div
                                            className="flex flex-row gap-2 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-96 p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            key={index}
                                        >
                                            <span className="flex items-center ">
                                                <FiMapPin className="w-5 h-5 text-black " />
                                            </span>
                                            <div className="text-base flex items-center">
                                                <h2>{item?.searchValue}</h2>
                                            </div>
                                        </div>
                                        <div className="text-base flex items-center">
                                            <form
                                                onSubmit={(e) => handleRangeChange(e, item)}
                                                className="flex-initial w-fit"
                                            >
                                                <input
                                                    type='number'
                                                    min={0}
                                                    value={item?.area}
                                                    // onChange={(e) => setlocationDis(e.target.value)}
                                                    onChange={(e) => handleAreaChange(e, index)}
                                                    className='p-0 w-16 px-3 py-2  border border-primary rounded-md'
                                                />
                                            </form>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex justify-between items-center gap-4">
                                <select
                                    className="border border-primary rounded-lg px-4 pl-2 py-2 w-28"
                                // value={selectedValue} // Set the selected value from state
                                // onChange={handleChange} // Handle change event
                                >
                                    <option className="hidden" value=''>Select Code </option>
                                    {IncludeExclude.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="w-full">
                                    <div className="relative col-span-2">
                                        <div className="col-span-3">
                                            <Autocomplete
                                                onLoad={(ref) => (autocompleteRef.current = ref)}
                                                onPlaceChanged={onPlaceChanged}
                                            >
                                                <input value={selectedVal} type="text" placeholder="Search for an area" className='appearance-none border border-[#D5E3FF] rounded w-full py-2 px-3' onChange={(e) => setSelectedVal(e.target.value)} />
                                            </Autocomplete>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-5 h-96">
                                <div className="h-full">
                                    <MapContainer
                                        center={center}
                                        zoom={zoom}
                                        maxZoom={18}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            zIndex: 0,
                                        }}
                                    >
                                        <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>
                                        <LayerGroup>
                                            {allArea?.map((item) => {
                                                return (
                                                    <Circle
                                                        center={[item?.latitude, item?.longitude]}
                                                        pathOptions={greenOptions}
                                                        radius={kilometersToMeters(item?.area)}
                                                    />
                                                );
                                            })}

                                        </LayerGroup>
                                        <MarkerClusterGroup>
                                            {screenData?.map((screen, index) => {
                                                return (
                                                    <>
                                                        <Marker
                                                            key={index}
                                                            position={[
                                                                screen.latitude,
                                                                screen.longitude,
                                                            ]}
                                                            icon={customIcon}
                                                            eventHandlers={{
                                                                click: () =>
                                                                    handleScreenClick &&
                                                                    handleScreenClick(screen),
                                                            }}
                                                        >
                                                            <Popup>
                                                                <h3 className="flex flex-row gap-1">
                                                                    <span>Location :</span>
                                                                    <span>
                                                                        {selectedScreen?.googleLocation}
                                                                    </span>
                                                                </h3>
                                                            </Popup>
                                                        </Marker>
                                                    </>
                                                );
                                            })}
                                        </MarkerClusterGroup>
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white shadow-md p-5 flex flex-col gap-2">
                        <div>Reach</div>
                        <div className="text-2xl">
                            {selectedScreens?.length} Screens
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
                            options={Screenoptions}
                            isMulti
                        />
                        <div className="h-full w-full flex justify items-end">
                            <div>
                                <div className='mb-5 '>
                                    <div className="flex items-center gap-3 my-2">
                                        <label className="text-sm font-medium">Repetition Duration:</label>
                                        <label for='Yes' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">{totalDuration}</label>
                                    </div>
                                    {/* <div className="flex items-center gap-3">
                                <label className="text-sm font-medium">Total balance credit:</label>
                                <label for='Yes' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">$0.00</label>
                            </div> */}
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium">Total Payable Amount:</label>
                                        <label for='Yes' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">${totalPrice}</label>
                                    </div>

                                </div>

                                <div className="flex justify-center mt-2">
                                    <button
                                        className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                        onClick={() => handleNext()}
                                    >
                                        Book Your Slot
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
}
