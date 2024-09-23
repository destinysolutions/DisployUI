import React, { useRef, useState, useCallback, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const libraries = ["places"];

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const center = {
    lat: 43.6532,
    lng: -79.3832,
};

const OpenGoogleMap = ({ openMap, selectedAddress, setSelectedAddress, setCurrentCenter, currentCenter, setMarkers, markers }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk",
        libraries,
    });
    const [selected, setSelected] = useState(null);
    const [selectedLatLng, setSelectedLatLng] = useState({ lat: null, lng: null });
    const mapRef = useRef();

    // useEffect(() => {
    //     // Get the user's current location
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             setCurrentCenter({ lat: latitude, lng: longitude });
    //         },
    //         () => {
    //             // Handle error if location access is denied
    //             console.error("Error fetching location.");
    //         }
    //     );
    // }, []);



    const onMapClick = useCallback(async (e) => {
        const lat = e?.latLng?.lat();
        const lng = e?.latLng?.lng();

        setMarkers([
            {
                lat,
                lng,
                time: new Date(),
            },
        ]);

        try {
            const results = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk`
            ).then((response) => response.json());

            const address = results.results[0]?.formatted_address || "No address found";
            setSelectedAddress(address);
            setSelectedLatLng({ lat, lng });
            setCurrentCenter({ lat, lng });
        } catch (error) {
            console.log("Error: ", error);
            setSelectedAddress("Error fetching address");
            setSelectedLatLng({ lat: null, lng: null });
        }
    }, []);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
        if (currentCenter) {
            map.panTo(currentCenter);
            map.setZoom(14);
        }
    }, [currentCenter]);

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps...";

    function Search({ panTo }) {
        const {
            ready,
            value,
            suggestions: { status, data },
            setValue,
            clearSuggestions,
        } = usePlacesAutocomplete({
            requestOptions: {
                location: { lat: () => 43.6532, lng: () => -79.3832 },
                radius: 100 * 1000,
            },
        });

        const handleInput = (e) => {
            setValue(e.target.value);
        };

        const handleSelect = async (address) => {
            setValue(address, false);
            clearSuggestions();

            try {
                const results = await getGeocode({ address });
                const { lat, lng } = await getLatLng(results[0]);
                panTo({ lat, lng });
                setSelectedLatLng({ lat, lng });
                setCurrentCenter({ lat, lng });

                // Fetch address for the selected place
                const geocodeResults = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk`
                ).then((response) => response.json());
                const fullAddress = geocodeResults.results[0]?.formatted_address || "No address found";
                setSelectedAddress(fullAddress);

                setMarkers([{ lat, lng, time: new Date() }]);

            } catch (error) {
                console.log("Error: ", error);
                setSelectedAddress("Error fetching address");
            }
        };

        return (
            <div className="search mb-5 relative">
                <input
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    className="mt-1  block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search your location"
                />
                {status === "OK" && (
                    <ul className="suggestions  absolute top-0 bg-white">
                        {data.map((suggestion) => (
                            <li
                                key={suggestion.place_id}
                                onClick={() => handleSelect(suggestion.description)}
                            >
                                {suggestion.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }


    const saveLocation = () => {
        // getLocation(selectedAddress, currentCenter)
        openMap(false)
    }

    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
        >
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                <div className="modal lg:w-[1200px] md:w-[900px] sm:w-full h-80vh">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <div className="flex items-center">
                                <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                                    Select Location
                                </h3>
                            </div>
                            <button className="p-1 text-xl ml-8" onClick={() => openMap(false)}>
                                <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                        </div>

                        <div className="bg-white shadow-md rounded-lg mt-5">
                            <div className="lg:p-5 md:p-4 sm:p-3 xs:p-2">
                                <Search panTo={panTo} />

                                <GoogleMap
                                    id="map"
                                    mapContainerStyle={mapContainerStyle}
                                    zoom={8}
                                    center={currentCenter}
                                    options={options}
                                    onClick={onMapClick}
                                    onLoad={onMapLoad}
                                >
                                    {markers.map((marker) => (
                                        <Marker
                                            key={`${marker?.lat}-${marker?.lng}`}
                                            position={{ lat: marker?.lat, lng: marker?.lng }}
                                            onClick={() => {
                                                setSelected(marker);
                                            }}
                                        />
                                    ))}

                                    {selected ? (
                                        <InfoWindow
                                            position={{ lat: selected?.lat, lng: selected?.lng }}
                                            onCloseClick={() => {
                                                setSelected(null);
                                            }}
                                        >
                                            <div>
                                                <p>Marker at {selected?.lat}, {selected?.lng}</p>
                                            </div>
                                        </InfoWindow>
                                    ) : null}
                                </GoogleMap>
                            </div>
                        </div>

                        <div className="p-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Selected Address:
                            </label>
                            <input
                                type="text"
                                id="address"
                                value={selectedAddress || "No address selected"}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-4 mb-2 dark:focus:ring-yellow-900"
                                type="button"
                                onClick={saveLocation}
                                style={{
                                    width: '150px', // Adjust width as needed
                                    height: '50px'
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenGoogleMap;
