import React, { useEffect, useState } from 'react'
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


export default function BookSlotMap({ setSelectedValue, setSelectAllScreen, setSelectedScreens, handleSelectChange, Screenoptions, selectAllScreen, selectedScreen, selectedScreens, setSelectedScreen, screenData, screenArea, handleNext, countries, handleBack, allArea, setSelectedItem, selectedItem, Open, setOpen, handleRangeChange, getSelectedVal, setSelectedVal, selectedVal, setAllCity }) {
    const [city, setCity] = useState([]);
    const center = [20.5937, 78.9629];
    const customIcon = new L.Icon({
        iconUrl: mapImg,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
    const FetchAllCity = () => {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: ALL_CITY,
            headers: {},
        };
        axios
            .request(config)
            .then((response) => {
                setAllCity(response.data.data);
                let arr = [];
                response.data.data?.map((item) => {
                    arr.push(item?.text);
                });
                setCity(arr);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        FetchAllCity();
    }, []);

    const getChanges = (value) => {
        console.log('location', value);
    };

    const handleScreenClick = (screen) => {
        setSelectedScreen(screen);
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value); // Update the state with the selected value
    };

    return (
            <div className="w-full h-full p-5 flex items-center justify-center ">
                <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg ">
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
                    <div className="grid grid-cols-3 gap-4 h-[93%] overflow-auto">
                        <div className="col-span-2 rounded-lg shadow-md bg-white p-5">
                            <div className="flex flex-col gap-2 h-full">
                                {/* <div className="flex gap-2 items-center">
                        <IoEarthSharp />
                        <span className="">
                          {getTimeZoneName(allTimeZone, selectedTimeZone)}
                        </span>
                      </div> */}

                                {allArea?.map((item, index) => {
                                    return (
                                        <div
                                            className="flex flex-row gap-2 bg-gray-50 border border-black text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            key={index}
                                        >
                                            <span className="flex items-center ">
                                                <FiMapPin className="w-5 h-5 text-black " />
                                            </span>
                                            <div className="text-base flex items-center">
                                                <h2>{item?.searchValue?.text}</h2>
                                            </div>

                                            <span className="flex items-center justify-end">
                                                <div className=" flex flex-row items-center border rounded-lg">
                                                    <div
                                                        className="flex items-center"
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        <div className="text-black p-1 px-2 no-underline hidden md:block lg:block cursor-pointer">
                                                            +{item?.area} km
                                                        </div>
                                                    </div>
                                                    {selectedItem === item && Open && (
                                                        <div
                                                            id="ProfileDropDown"
                                                            className={`rounded ${Open ? "none" : "hidden"
                                                                } shadow-md bg-white absolute mt-44 z-[9999] w-48`}
                                                        >
                                                            <div>
                                                                <div className="border-b flex justify-center">
                                                                    <div className="p-2">
                                                                        Current city only
                                                                    </div>
                                                                </div>
                                                                <div className="p-2 flex gap-2 items-center">
                                                                    <BsCheckCircleFill className="text-blue-6 00" />
                                                                    Cities Within Radius
                                                                </div>
                                                                <div className="relative mb-8 mx-2">
                                                                    <div>
                                                                        <input
                                                                            id="labels-range-input"
                                                                            type="range"
                                                                            min="0"
                                                                            max="30"
                                                                            step="5"
                                                                            value={item?.area}
                                                                            onChange={(e) =>
                                                                                handleRangeChange(e, item)
                                                                            }
                                                                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                                                        />
                                                                        <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
                                                                            5
                                                                        </span>

                                                                        <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                                                                            30
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </span>
                                        </div>
                                    );
                                })}

                                <div className="">
                                    {/* <select
                          className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                          value={selectedValue} // Set the selected value from state
                          onChange={handleChange} // Handle change event
                        >
                          {IncludeExclude.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select> */}


                                    <div className="col-span-3">
                                        <InputAuto
                                            pholder="Search"
                                            data={city}
                                            onSelected={getSelectedVal}
                                            onChange={getChanges}
                                            // handleKeyPress={handleKeyPress}
                                            setSelectedVal={setSelectedVal}
                                            selectedVal={selectedVal}
                                        />
                                    </div>
                                </div>
                                <div className="w-full mb-3">
                                    <Select
                                        placeholder=' Country'
                                        // value={selectedScreens}
                                        // onChange={handleSelectChange}
                                        options={
                                            countries && countries?.length > 0
                                                ? countries.map((item) => ({
                                                    value: item?.countryID,
                                                    label: item?.countryName,
                                                }))
                                                : [{ value: "", label: "Not Found" }]
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <select
                                        className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
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

                                    <div className="col-span-2">
                                        <div className="relative col-span-2">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <CgSearch className="w-5 h-5 text-black " />
                                            </span>
                                            <input
                                                placeholder='Search ...'
                                                type="search"
                                                // value={selectedVal}
                                                // onChange={handleChange}

                                                className="border border-primary rounded-lg px-7 pl-10 py-2 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 h-full">
                                    <div className="h-full">
                                        <MapContainer
                                            center={center}
                                            zoom={4}
                                            maxZoom={18}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                zIndex: 0,
                                            }}
                                        >
                                            <TileLayer url="https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=9Gu0Q6RdpEASBQwamrpM"></TileLayer>
                                            <LayerGroup>
                                                {screenArea?.map((item) => {
                                                    return (
                                                        <Circle
                                                            center={[item?.let, item?.lon]}
                                                            pathOptions={greenOptions}
                                                            radius={kilometersToMeters(item?.dis)}
                                                        />
                                                    );
                                                })}
                                            </LayerGroup>
                                            <MarkerClusterGroup>
                                                {screenData.map((screen, index) => {
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
                            <div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium">Repetition Duration:</label>
                                    <label for='Yes' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">hh:mm:ss</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium">Total balance credit:</label>
                                    <label for='Yes' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">$0.00</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium">Total Payable Amount:</label>
                                    <label for='Yes' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">$00.00</label>
                                </div>

                            </div>
                            <div className="h-full w-full flex justify-center items-end">
                                <div className="flex justify-center">
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
       
    )
}
