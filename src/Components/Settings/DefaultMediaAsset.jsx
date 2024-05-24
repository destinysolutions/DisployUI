import moment from 'moment';
import React from 'react'
import { AiOutlineCloseCircle, AiOutlineSearch } from 'react-icons/ai';
import { IoBarChartSharp } from "react-icons/io5";

const DefaultMediaAsset = ({ setShowAssetModal, handleOnConfirm, setAssetPreviewPopup, handleAssetAdd, selectedEmergencyAsset, mediaTabs, selectedAsset, filteredData, setSearchAssest, searchAssest, handleSearchAssest, setPopupActiveTab, popupActiveTab, assetPreviewPopup }) => {
    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
        >
            <div className="modal-overlay">
                <div className="modal">
                    <div className="relative p-4 lg:max-w-[60vw] lg:min-w-[60vw] md:max-w-[60vw] md:min-w-[60vw] sm:max-w-[80vw] sm:min-w-[80vw] max-w-[80vw] min-w-[80vw] ">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600 ">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Set Content to Add Media
                                </h3>
                                <AiOutlineCloseCircle
                                    className="text-4xl text-primary cursor-pointer"
                                    onClick={() => {
                                        setShowAssetModal(false);
                                        setSearchAssest("");
                                    }}
                                />
                            </div>
                            <div>
                                <div
                                    onClick={() => assetPreviewPopup && setAssetPreviewPopup(false)}
                                    className="lg:flex lg:mt-8 mt-3 p-2 lg:flex-wrap lg:items-center w-full md:flex md:flex-wrap md:items-center sm:block xs:block"
                                >
                                    {/* left side tabs */}

                                    <div className="lg:flex lg:flex-wrap lg:items-center w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
                                        <div className="flex-initial mb-5">
                                            <nav
                                                className="flex flex-col space-y-2 "
                                                aria-label="Tabs"
                                                role="tablist"
                                                data-hs-tabs-vertical="true"
                                            >
                                                <button
                                                    type="button"
                                                    className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${popupActiveTab === 1 ? "active" : ""
                                                        }`}
                                                    onClick={() => setPopupActiveTab(1)}
                                                >
                                                    <span
                                                        className={`p-1 rounded ${popupActiveTab === 1
                                                            ? "bg-primary text-white"
                                                            : "bg-lightgray"
                                                            } `}
                                                    >
                                                        <IoBarChartSharp size={15} />
                                                    </span>
                                                    Assets
                                                </button>
                                            </nav>
                                        </div>
                                        <div className="lg:p-4 drop-shadow-2xl bg-white rounded-3xl flex-1">
                                            <div className={popupActiveTab !== 1 && "hidden"}>
                                                <div className="flex flex-wrap w-full items-start lg:justify-between lg:mb-0 mb-3 md:justify-center sm:justify-center xs:justify-center">
                                                    <div className="mb-3 relative ">
                                                        <AiOutlineSearch className="absolute top-2.5 left-2 w-5 h-5 z-10 text-gray" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search Assest"
                                                            className="border border-primary rounded-full pl-8 py-2 search-user"
                                                            value={searchAssest}
                                                            onChange={(e) => handleSearchAssest(e, "asset")}
                                                        />
                                                    </div>
                                                    <button
                                                        className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                                                        onClick={() => {
                                                            window.open(
                                                                window.location.origin.concat("/fileupload")
                                                            );
                                                            localStorage.setItem("isWindowClosed", "false");
                                                            // setShowAssetModal(false);
                                                            setSearchAssest("");
                                                        }}
                                                    >
                                                        Add New Assets
                                                    </button>
                                                </div>
                                                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[250px] max-h-[250px] object-cover w-full addmedia-table sc-scrollbar rounded-lg">
                                                    <table
                                                        style={{
                                                            borderCollapse: "collapse",
                                                            borderSpacing: " 0 10px",
                                                        }}
                                                        className="w-full"
                                                    >
                                                        <thead className="sticky top-0">
                                                            <tr className="table-head-bg">
                                                                <th className="p-3 w-80 text-left">Media Name</th>
                                                                <th className="p-3">Date Added</th>
                                                                <th className="p-3">Size</th>
                                                                <th className="p-3">Type</th>
                                                            </tr>
                                                        </thead>
                                                        {mediaTabs === 1 && filteredData.length > 0 && (
                                                            filteredData
                                                                .filter((asset) => {
                                                                    return (
                                                                        asset.assetType !== "Folder"
                                                                    );
                                                                })
                                                                .map((asset) => (
                                                                    <tbody key={asset.assetID}>
                                                                        <tr
                                                                            className={`${selectedAsset?.assetID === asset?.assetID 
                                                                                ? "bg-[#f3c953]"
                                                                                : ""
                                                                                } border-b border-[#eee] `}
                                                                            onClick={() => {
                                                                                handleAssetAdd(asset);
                                                                                setAssetPreviewPopup(true);
                                                                            }}
                                                                        >
                                                                            <td className="p-3 text-left">
                                                                                {asset.assetName}
                                                                            </td>
                                                                            <td className="p-3 text-center">
                                                                                {moment(asset.createdDate).format(
                                                                                    "YYYY-MM-DD hh:mm"
                                                                                )}
                                                                            </td>
                                                                            <td className="p-3 text-center">
                                                                                {asset.fileSize}
                                                                            </td>
                                                                            <td className="p-3 text-center">
                                                                                {asset.assetType}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                ))
                                                        )}
                                                        {mediaTabs === 2 &&
                                                            filteredData.length > 0 && (
                                                                filteredData
                                                                    .filter((asset) => {
                                                                        return (
                                                                            asset.assetType !== "Folder" &&
                                                                            asset.assetType !== "Video" && asset.assetType !== "OnlineVideo"
                                                                        );
                                                                    })
                                                                    .map((asset) => (
                                                                        <tbody key={asset.assetID}>
                                                                            <tr
                                                                                className={`${
                                                                                    selectedEmergencyAsset?.assetID === asset?.assetID
                                                                                    ? "bg-[#f3c953]"
                                                                                    : ""
                                                                                    } border-b border-[#eee] `}
                                                                                onClick={() => {
                                                                                    handleAssetAdd(asset);
                                                                                    setAssetPreviewPopup(true);
                                                                                }}
                                                                            >
                                                                                <td className="p-3 text-left">{asset.assetName}</td>
                                                                                <td className="p-3 text-center">
                                                                                    {moment(asset.createdDate).format("YYYY-MM-DD hh:mm")}
                                                                                </td>
                                                                                <td className="p-3 text-center">{asset.fileSize}</td>
                                                                                <td className="p-3 text-center">{asset.assetType}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    ))
                                                            )}
                                                        {filteredData?.length === 0 && (
                                                            <div>
                                                                No Data Available
                                                            </div>
                                                        )}
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:flex justify-between items-center p-3 w-full">
                                        <p className="text-black text-left">
                                            Content will always be playing Confirm
                                        </p>
                                        <p className="text-right">
                                            <button
                                                className="bg-primary text-white rounded-full px-5 py-2"
                                                onClick={() => {
                                                    handleOnConfirm();
                                                }}
                                            >
                                                Confirm
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DefaultMediaAsset
