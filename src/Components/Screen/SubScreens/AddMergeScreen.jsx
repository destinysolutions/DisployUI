import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";
import Select from 'react-select'
import ShowAssetModal from "./model/ShowGroupAssetModal";
import { AiOutlineCloudUpload } from "react-icons/ai";

const selectScreen = [
    { value: 2, label: '2 Screen' },
    { value: 4, label: '4 Screen' },
    { value: 6, label: '6 Screen' },
    { value: 8, label: '8 Screen' },
]

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        width: '250px', // Set the desired width
        height: '40px', // Set the desired height
        border: '1px solid #ccc', // Example border style
        borderRadius: '8px', // Example border-radius style
    }),
};


const AddMergeScreen = ({ sidebarOpen, setSidebarOpen }) => {

    const [showAssetModal, setShowAssetModal] = useState(false);
    const [assetPreview, setAssetPreview] = useState("");
    const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
    const [popupActiveTab, setPopupActiveTab] = useState(1);

    const [selectedComposition, setSelectedComposition] = useState({ compositionName: "", });
    const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });
    const [selectedYoutube, setSelectedYoutube] = useState();
    const [selectedTextScroll, setSelectedTextScroll] = useState();

    // Model Function
    const handleAssetAdd = (asset) => {
        setSelectedAsset(asset);
        setAssetPreview(asset);
    };

    const handleAppsAdd = (apps) => {
        setSelectedYoutube(apps);
        setSelectedTextScroll(apps);
    };

    const handleAssetUpdate = () => {
    };

    const handleSave = () => {
        console.log("selectedComposition -- > ", selectedComposition);
        console.log("selectedAsset -- > ", selectedAsset);
        console.log("selectedYoutube -- > ", selectedYoutube);
        console.log("selectedTextScroll -- > ", selectedTextScroll);
    }

    return (
        <>
            <div className="flex border-b border-gray bg-white">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Navbar />
            </div>

            <div className="lg:pt-24 md:pt-24 pt-10 px-5 page-contain">
                <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="justify-between lg:flex md:flex items-center sm:block">
                        <div className="section-title">
                            <h1 className="not-italic font-medium text-2xl text-[#001737]">
                                Add Merge Screens
                            </h1>
                        </div>
                        <Link to="/mergescreen">
                            <button className="flex align-middle border-white bg-SlateBlue text-white  items-center border rounded-full lg:px-6 sm:px-5 py-2.5 sm:mt-2  text-base sm:text-sm mr-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                                <MdArrowBackIosNew className="text-2xl mr-2 text-white rounded-full p-1" />
                                Back
                            </button>
                        </Link>
                    </div>
                    <div className="lg:flex lg:justify-between sm:block mt-5 items-center font-semibold">
                        <div className="w-full p-4 bg-white border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <div class="grid grid-cols-2 gap-2">
                                <div className="flex gap-5">
                                    <div>
                                        <label className=" text-[#5E5E5E] m-2">Enter Merge ScreenName</label>
                                        <input
                                            type="text"
                                            placeholder="ScreenName"
                                            className="border border-[#5E5E5E] rounded-lg px-2 py-2 search-user w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className=" text-[#5E5E5E] m-2">Select Screen</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="color"
                                            options={selectScreen}
                                            styles={customStyles}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="">
                                        <label className=" text-[#5E5E5E] m-2">Select Media</label>
                                        <button
                                            style={{ width: "max-content", width: "100%" }}
                                            onClick={() => setShowAssetModal(true)}
                                            className="flex items-centerborder-gray bg-white  border rounded-lg lg:px-3 sm:px-1 xs:px-1 py-2 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto hover:bg-primary-500"
                                        >
                                             assetName
                                            <AiOutlineCloudUpload className="ml-2 text-lg" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {showAssetModal && (<ShowAssetModal
                handleAssetAdd={handleAssetAdd}
                handleAssetUpdate={handleAssetUpdate}
                setSelectedComposition={setSelectedComposition}
                handleAppsAdd={handleAppsAdd}
                popupActiveTab={popupActiveTab}
                setAssetPreviewPopup={setAssetPreviewPopup}
                setPopupActiveTab={setPopupActiveTab}
                setShowAssetModal={setShowAssetModal}
                assetPreviewPopup={assetPreviewPopup}
                assetPreview={assetPreview}
                selectedComposition={selectedComposition}
                selectedTextScroll={selectedTextScroll}
                selectedYoutube={selectedYoutube}
                selectedAsset={selectedAsset}
                handleSave={handleSave}
            />
            )}

        </>
    )
}

export default AddMergeScreen