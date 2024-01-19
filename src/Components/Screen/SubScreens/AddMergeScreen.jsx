import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { MdArrowBackIosNew } from "react-icons/md";
import { Link } from "react-router-dom";
import Select from 'react-select'
import ShowAssetModal from "./model/ShowGroupAssetModal";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Draggable from 'react-draggable';
import ScreenGroupModal from "./ScreenGroupModal";


const selectRow = [
    { value: 1, label: '1 Row' },
    { value: 2, label: '2 Row' },
    { value: 3, label: '3 Row' },
    { value: 4, label: '4 Row' },
    { value: 5, label: '5 Row' },
    { value: 6, label: '6 Row' },
    { value: 7, label: '7 Row' },
    { value: 8, label: '8 Row' },
    { value: 9, label: '9 Row' },
    { value: 10, label: '10 Row' },
]

const selectColumn = [
    { value: 1, label: '1 Column' },
    { value: 2, label: '2 Column' },
    { value: 3, label: '3 Column' },
    { value: 4, label: '4 Column' },
    { value: 5, label: '5 Column' },
    { value: 6, label: '6 Column' },
    { value: 7, label: '7 Column' },
    { value: 8, label: '8 Column' },
    { value: 9, label: '9 Column' },
    { value: 10, label: '10 Column' },
]


const AddMergeScreen = ({ sidebarOpen, setSidebarOpen }) => {

    const [showAssetModal, setShowAssetModal] = useState(false);
    const [assetPreview, setAssetPreview] = useState("");
    const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);
    const [popupActiveTab, setPopupActiveTab] = useState(1);

    const [selectedComposition, setSelectedComposition] = useState({ compositionName: "", });
    const [selectedAsset, setSelectedAsset] = useState({ assetName: "" });
    const [selectedYoutube, setSelectedYoutube] = useState();
    const [selectedTextScroll, setSelectedTextScroll] = useState();

    const [selectedRow, setSelectedRow] = useState(selectRow[0]);
    const [selectedColumn, setSelectedColumn] = useState(selectColumn[0]);
    
    const [buttonTexts, setButtonTexts] = useState({}); // Use an object to store text for each button
    const [selectedButton, setSelectedButton] = useState({ row: null, col: null });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [label, setLabel] = useState('');
    
    // Model Function
    const closeModal = () => {
        setIsModalOpen(false);
      };

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

  // New add groupScreen
  const handleSaveNew = async (payload) => {
    console.log("payload ------ ",payload);
  };

    const handleSave = () => {
        console.log("Selected Row: ", selectedRow);
        console.log("Selected Column: ", selectedColumn);
    }
    const handleDisplayButtonClick = (row, col) => {
        setLabel('Save')
        setIsModalOpen(true);
        // setSelectedButton({ row, col });
    };


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
                            <div class="grid grid-flow-row-dense grid-cols-4 grid-rows-5 gap-5">
                                <div class="col-span-2">
                                    <div>
                                        <label className=" text-[#5E5E5E] m-2">
                                            Enter Merge ScreenName
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ScreenName"
                                            className="border border-[#5E5E5E] rounded-lg px-2 py-2 search-user w-full"
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <label className=" text-[#5E5E5E] m-2">
                                            Select Media
                                        </label>
                                        <button
                                            style={{ width: "max-content", width: "100%" }}
                                            onClick={() => setShowAssetModal(true)}
                                            className="flex items-centerborder-gray bg-white  border rounded-lg lg:px-3 sm:px-1 xs:px-1 py-2 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto hover:bg-primary-500"
                                        >
                                            assetName
                                            <AiOutlineCloudUpload className="ml-2 text-lg" />
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 mt-5">
                                        <div class="">
                                            <div>
                                                <label className="text-[#5E5E5E] m-2">Select Row</label>
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="row"
                                                    value={selectedRow}
                                                    onChange={(selectedOption) => setSelectedRow(selectedOption)}
                                                    options={selectRow}
                                                />
                                            </div>
                                        </div>
                                        <div class="">
                                            <div>
                                                <label className="text-[#5E5E5E] m-2">Select Column</label>
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="column"
                                                    value={selectedColumn}
                                                    onChange={(selectedOption) => setSelectedColumn(selectedOption)}
                                                    options={selectColumn}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                        <tbody>
                                            {Array.from({ length: selectedRow.value }, (_, rowIndex) => rowIndex + 1).map(row => (
                                                <div key={row} className="grid grid-flow-col gap-4 gap-5">
                                                    {Array.from({ length: selectedColumn.value }, (_, colIndex) => colIndex + 1).map(col => (
                                                        <div
                                                            key={col}
                                                            className={`shadow btn-display ${selectedButton.row === row && selectedButton.col === col
                                                                    ? 'selected'
                                                                    : ''
                                                                }`}
                                                            onClick={() => handleDisplayButtonClick(row, col)}
                                                            style={{
                                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                padding: '10px',
                                                                cursor: 'pointer',
                                                                width:"150px",
                                                                height:"100px",
                                                                textAlign:"center",
                                                                backgroundColor: selectedButton.row === row && selectedButton.col === col ? '#FFD700' : 'white',
                                                            }}
                                                        >
                                                            {buttonTexts[`${row}-${col}`] || `Row ${row}, Col ${col}`}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && (
                <ScreenGroupModal isOpen={isModalOpen} onClose={closeModal} handleSaveNew={handleSaveNew} label={label} />
              )}

            {showAssetModal && (
                <ShowAssetModal
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
    );
}

export default AddMergeScreen