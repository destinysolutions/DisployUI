import React, { useState } from 'react'
import { useEffect } from 'react';
import { AiOutlineCloseCircle, AiOutlineSearch } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { GET_ALL_FILES } from '../../Pages/Api';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PreviewAssets from '../Common/PreviewAssets';

const DigitalMenuAssets = ({ openModal, setOpenModal,handleAssetAdd, selectedAsset,setAssetPreviewPopup,assetPreviewPopup,assetPreview ,HandleSubmitAsset}) => {
    const { user, token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [assetData, setAssetData] = useState([]);
    const [searchAssest, setSearchAssest] = useState("");
    const [assetAllData, setAssetAllData] = useState([]);

    useEffect(() => {
        axios.get(GET_ALL_FILES, { headers: { Authorization: authToken } }).then((res) => {
            const data = res?.data;
            let alldata = [...data?.image, ...data?.onlineimages]
            setAssetData(alldata)
            setAssetAllData(alldata)
            setLoading(false)

        })
    }, [])

    const handleAssestSearch = (event) => {
        setSearchAssest(event.target.value);
        const searchQuery = event.target.value.toLowerCase();
        if (searchQuery === "") {
          setAssetData(assetAllData);
        } else {
          const filteredScreen = assetAllData.filter((entry) =>
            Object.values(entry).some((val) => {
              if (typeof val === "string") {
                const keyWords = searchQuery.split(" ");
                for (let i = 0; i < keyWords.length; i++) {
                  return (
                    val.toLocaleLowerCase().startsWith(keyWords[i]) ||
                    val.toLocaleLowerCase().endsWith(keyWords[i]) ||
                    val.toLocaleLowerCase().includes(keyWords[i]) ||
                    val.toLocaleLowerCase().includes(searchQuery)
                  );
                }
              }
            })
          );
          if (filteredScreen?.length > 0) {
            setAssetData(filteredScreen);
          } else {
            setAssetData([]);
          }
        }
      };

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-5xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Set Content to Add Media
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    setOpenModal(false);
                                }}
                            />
                        </div>
                        <div
                              onClick={() => assetPreviewPopup && setAssetPreviewPopup(false)}
                            className={` relative p-2 w-full flex items-start gap-2 bg-white rounded-2xl`}
                        >
                            <div className="lg:flex lg:flex-wrap lg:items-center  w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
                                <div className="lg:p-4 drop-shadow-2xl bg-white rounded-3xl flex-1">
                                    <div>
                                        <div className="flex flex-wrap w-full items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center mb-3">
                                            <div className="mb-3 relative ">
                                                <AiOutlineSearch className="absolute top-2 left-3 w-5 h-5 z-10 text-gray" />
                                                <input
                                                    type="text"
                                                    placeholder="Search Asset"
                                                    className="border border-primary rounded-full pl-9 py-2 search-user w-56"
                                                    value={searchAssest}
                                                    onChange={(e) => handleAssestSearch(e)}
                                                />
                                            </div>
                                            <Link to="/fileupload" target="_blank">
                                                <button
                                                    className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                                                    onClick={() => {
                                                        localStorage.setItem("isWindowClosed", "false");
                                                        // setShowAssetModal(false)
                                                    }}
                                                >
                                                    Add New Assets
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="table-container md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto lg:min-h-[300px] lg:max-h-[300px] min-h-[200px] max-h-[200px] object-cover addmedia-table sc-scrollbar rounded-lg">
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
                                                        <th>Date Added</th>
                                                        <th className="p-3">Size</th>
                                                        <th className="p-3">Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading && (
                                                        <tr>
                                                            <td
                                                                className="font-semibold text-center bg-white text-lg"
                                                                colSpan={4}
                                                            >
                                                                Loading...
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {!loading && assetData && assetData.length === 0 ? (
                                                        <tr>
                                                            <td
                                                                className="font-semibold text-center bg-white text-lg"
                                                                colSpan={4}
                                                            >
                                                                No assets here.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        assetData.length > 0 &&
                                                        assetData
                                                            .map((asset) => (
                                                                <tr
                                                                    key={asset.assetID}
                                                                    className={`${selectedAsset?.assetID === asset?.assetID 
                                                                        ? "bg-[#f3c953]"
                                                                        : ""
                                                                        } border-b border-[#eee] cursor-pointer `}
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
                                                            ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${openModal ? "hidden" : ""
                                } lg:flex justify-between items-center pl-5 pr-5 pb-4`}
                              onClick={() => HandleSubmitAsset()}  
                        >
                            <p className="text-black mb-3 text-left">
                                Content will always be playing Confirm
                            </p>
                            <p className="text-right">
                                <button
                                    className="bg-primary text-white rounded-full px-5 py-2"
                                >
                                    Confirm
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {assetPreviewPopup && (
                <PreviewAssets
                  assetPreview={assetPreview}
                  setAssetPreviewPopup={setAssetPreviewPopup}
                />
              )}


        </>
    )
}

export default DigitalMenuAssets
