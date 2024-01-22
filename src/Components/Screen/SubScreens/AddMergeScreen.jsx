import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import Navbar from "../../Navbar";
import { MdArrowBackIosNew, MdOutlineAddToQueue } from "react-icons/md";
import { Link } from "react-router-dom";
import Select from 'react-select'
import ShowAssetModal from "./model/ShowMergeAssetModal";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Draggable from 'react-draggable';
import ScreenGroupModal from "./model/ScreenMergeModal";
import { useDispatch } from "react-redux";
import { SELECT_BY_USER_SCREENDETAIL } from "../../../Pages/Api";
import { useSelector } from "react-redux";
import { SelectByUserScreen } from "../../../Redux/ScreenGroupSlice";
import toast from "react-hot-toast";


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
    const dispatch = useDispatch();

    const { token, user } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const store = useSelector((state) => state.root.screenGroup.data);


    const [loadFirst, setLoadFirst] = useState(true);

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

    const [buttonTexts, setButtonTexts] = useState([]);
    const [DataRowAndCol, setDataRowAndCol] = useState([]); 
    const [selectedButton, setSelectedButton] = useState({ row: null, col: null });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [label, setLabel] = useState('');

    useEffect(() => {
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`,
            headers: {
                Authorization: authToken,
            },
        };

        if (loadFirst) {
            dispatch(SelectByUserScreen({ config }));
            setLoadFirst(false);
        }

    }, [dispatch, loadFirst, store]);


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



    const handleSave = () => {
        console.log("selectedAsset ", selectedAsset);
    }

    const handleSaveNew = async (payload) => {
        const { row, col } = selectedButton;
        const buttonText = `Row ${row}, Col ${col} - ${payload.screenName}`;

        // Check if a button already exists in the selected row and column for the current screen
        const existingButtonInRowAndCol = Object.values(DataRowAndCol).find(button =>
            button.row === row && button.col === col
        );

        if (existingButtonInRowAndCol) {
            toast.error('This screen already has a button in the selected row and column.');
            return; // Exit the function if a button already exists
        }

        const newButtonText = {
            row,
            col,
            screenId: payload.screenID,
            screenName: payload.screenName,
        };

        // Update DataRowAndCol to include the new button data
        setDataRowAndCol(prevState => ({
            ...prevState,
            [payload.screenID]: newButtonText,
        }));

        setButtonTexts(prevState => ({ ...prevState, [`${row}-${col}`]: buttonText }));
        closeModal();
    };

    const handleDisplayButtonClick = (row, col) => {
        setLabel('Save');
        setIsModalOpen(true);
        setSelectedButton({ row, col });
    };

    const saveMergeScreen = () => {
        const payload = {
            assetName : '',
            array : DataRowAndCol
        }
        console.log("buttonTexts  ----- ", DataRowAndCol);
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

                    {store && store.data?.length > 0 ? <>
                        <div className="lg:flex lg:justify-between sm:block mt-5 items-center font-semibold w-full">
                            <div className="grid grid-cols-2 w-screen gap-2">
                                <div className="">
                                    <div className="p-4 bg-white border-gray-200  shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 h-100">
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
                                        <div className="flex items-center md:p-5 rounded-b dark:border-gray-600 ">
                                            <button
                                                data-modal-hide="static-modal"
                                                type="button"
                                                className="border-2 border-primary rounded-lg ml-3 text-white bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={saveMergeScreen}
                                            >
                                                Save
                                            </button>
                                            <button
                                                data-modal-hide="static-modal"
                                                type="button"
                                                className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                            // onClick={onClose}
                                            >
                                                Cancel
                                            </button>
                                        </div>


                                    </div>
                                </div>

                                <div className="col-span-1 bg-green-500 screen-section">
                                    <div className="p-4 bg-white border-gray-200 shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 h-100 overflow-auto">
                                        <h1 className="not-italic font-medium text-2xl text-[#001737]">
                                            Screens
                                        </h1>
                                        <hr />
                                        <table className="screen-table">
                                            <tbody>
                                                {Array.from({ length: selectedRow.value }, (_, rowIndex) => rowIndex + 1).map(row => (
                                                    <div key={row} className="grid grid-flow-col gap-4 gap-5">
                                                        {Array.from({ length: selectedColumn.value }, (_, colIndex) => colIndex + 1).map(col => (
                                                            <div
                                                                key={col}
                                                                className={`shadow btn-display rounded-lg text-black ${selectedButton.row === row && selectedButton.col === col ? 'selected' : ''}`}
                                                                onClick={() => handleDisplayButtonClick(row, col)}
                                                                style={{
                                                                    margin: "5px",
                                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                    padding: '10px',
                                                                    cursor: 'pointer',
                                                                    width: "150px",
                                                                    height: "100px",
                                                                    textAlign: "center",
                                                                    backgroundColor: selectedButton.row === row && selectedButton.col === col ? '#FFD700' : '#f0f8ff',
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
                    </> : <>
                        <div className="mt-5 w-full flex flex-col gap-2 p-4 text-center bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <div className="w-full h-full flex items-center justify-center">
                                <MdOutlineAddToQueue className=" text-gray text-lg " size={60} />
                            </div>
                            <h5 className="mb-2 text-2xl font-semibold  text-gray-500 dark:text-white">Create New Screen</h5>
                        </div>
                    </>}
                </div>
            </div>


            {/* {isModalOpen && ( */}
            <ScreenGroupModal isOpen={isModalOpen} onClose={closeModal} handleSaveNew={handleSaveNew} label={label} type='MergeScreen' />
            {/* )} */}

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