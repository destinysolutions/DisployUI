import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { BiAnchor } from "react-icons/bi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { GET_ALL_FILES } from "../../Pages/Api";
import axios from "axios";
import moment from "moment";
import PreviewAssets from "../Common/PreviewAssets";

const AssetModal = ({ setShowAssetModal }) => {
  AssetModal.propTypes = {
    setShowAssetModal: PropTypes.func.isRequired,
  };
  const [popupActiveTab, setPopupActiveTab] = useState(1);
  const [assetData, setAssetData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetPreview, setAssetPreview] = useState("");
  const [assetPreviewPopup, setAssetPreviewPopup] = useState(false);

  useEffect(() => {
    axios
      .get(GET_ALL_FILES)
      .then((response) => {
        const fetchedData = response.data;
        const allAssets = [
          ...(fetchedData.image ? fetchedData.image : []),
          ...(fetchedData.video ? fetchedData.video : []),
          ...(fetchedData.doc ? fetchedData.doc : []),
          ...(fetchedData.onlineimages ? fetchedData.onlineimages : []),
          ...(fetchedData.onlinevideo ? fetchedData.onlinevideo : []),
        ];
        setAssetData(allAssets);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAssetAdd = (asset) => {
    setSelectedAsset(asset);
    setAssetPreview(asset);
  };

  const [searchAsset, setSearchAsset] = useState("");
  const handleFilter = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAsset(searchQuery);

    if (searchQuery === "") {
      setAssetData(assetData);
    } else {
      const filteredData = assetData.filter((item) => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        return itemName.includes(searchQuery);
      });
      setAssetData(filteredData);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        setShowAssetModal(false);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  return (
    <>
      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none myplaylist-popup">
        <div className="relative w-auto my-6 mx-auto myplaylist-popup-details">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
            <div className="flex items-center justify-between p-4 px-6 border-b  border-slate-200 rounded-t text-black">
              <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium">
                Set Content to Add Media
              </h3>
              <button
                className="p-1 text-xl"
                onClick={() => setShowAssetModal(false)}
              >
                <AiOutlineCloseCircle className="text-2xl" />
              </button>
            </div>

            <div className="relative lg:p-6 md:p-6 sm:p-2 xs:p-1 flex-auto">
              <div className="bg-white rounded-[30px]">
                <div>
                  <div className="lg:flex lg:flex-wrap lg:items-center md:flex md:flex-wrap md:items-center sm:block xs:block">
                    <div>
                      <nav
                        className="flex flex-col space-y-2 "
                        aria-label="Tabs"
                        role="tablist"
                        data-hs-tabs-vertical="true"
                      >
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                            popupActiveTab === 1 ? "active" : ""
                          }`}
                          // onClick={() => handleTabClick(1)}
                        >
                          <span
                            className={`p-1 rounded ${
                              popupActiveTab === 1
                                ? "bg-primary text-white"
                                : "bg-lightgray"
                            } `}
                          >
                            <IoBarChartSharp size={15} />
                          </span>
                          Assets
                        </button>
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                            popupActiveTab === 2 ? "active" : ""
                          }`}
                          //onClick={() => handleTabClick(2)}
                        >
                          <span
                            className={`p-1 rounded ${
                              popupActiveTab === 2
                                ? "bg-primary text-white"
                                : "bg-lightgray"
                            } `}
                          >
                            <RiPlayListFill size={15} />
                          </span>
                          Playlist
                        </button>
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                            popupActiveTab === 3 ? "active" : ""
                          }`}
                          // onClick={() => handleTabClick(3)}
                        >
                          <span
                            className={`p-1 rounded ${
                              popupActiveTab === 3
                                ? "bg-primary text-white"
                                : "bg-lightgray"
                            } `}
                          >
                            <BiAnchor size={15} />
                          </span>
                          Disploy Studio
                        </button>
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                            popupActiveTab === 4 ? "active" : ""
                          }`}
                          // onClick={() => handleTabClick(4)}
                        >
                          <span
                            className={`p-1 rounded ${
                              popupActiveTab === 4
                                ? "bg-primary text-white"
                                : "bg-lightgray"
                            } `}
                          >
                            <AiOutlineAppstoreAdd size={15} />
                          </span>
                          Apps
                        </button>
                      </nav>
                    </div>

                    <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                      <div className={popupActiveTab === 1 ? "" : "hidden"}>
                        <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center lg:mb-0 mb-3">
                          <div className="lg:mb-5 mb-3 relative ">
                            <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                            <input
                              type="text"
                              placeholder=" Search by Name"
                              className="border border-primary rounded-full px-7 py-2 search-user"
                              value={searchAsset}
                              onChange={handleFilter}
                            />
                          </div>
                          <Link to="/fileupload">
                            <button className="flex align-middle border-primary items-center border rounded-full px-8 py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50">
                              Add New Assets
                            </button>
                          </Link>
                        </div>
                        <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto">
                          <table
                            style={{
                              borderCollapse: "separate",
                              borderSpacing: " 0 10px",
                            }}
                          >
                            <thead>
                              <tr className="bg-lightgray">
                                <th className="p-3 w-80 text-left">
                                  Media Name
                                </th>
                                <th>Date Added</th>
                                <th className="p-3">Size</th>
                                <th className="p-3">Type</th>
                              </tr>
                            </thead>
                            {assetData.map((asset) => (
                              <tbody key={asset.id}>
                                <tr
                                  className={`${
                                    selectedAsset === asset
                                      ? "bg-[#f3c953]"
                                      : ""
                                  } border-b border-[#eee] `}
                                  onClick={() => {
                                    handleAssetAdd(asset);
                                    setAssetPreviewPopup(true);
                                  }}
                                >
                                  <td className="p-3">{asset.name}</td>
                                  <td className="p-3">
                                    {moment(asset.createdDate).format(
                                      "YYYY-MM-DD hh:mm"
                                    )}
                                  </td>
                                  <td className="p-3">{asset.fileSize}</td>
                                  <td className="p-3">{asset.categorieType}</td>
                                </tr>
                              </tbody>
                            ))}
                          </table>
                          {/* {assetPreviewPopup && (
                            <>
                              <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
                                <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 asset-preview-popup">
                                  <div className="border-0 rounded-lg shadow-lg relative min-w-[40vw] left-1/2 -translate-x-1/2 min-h-[60vh] max-h-[60vh] max-w-screen bg-black outline-none focus:outline-none">
                                    <div className="p-1 rounded-full text-white bg-primary absolute top-[-15px] right-[-16px]">
                                      <button
                                        className="text-xl"
                                        onClick={() =>
                                          setAssetPreviewPopup(false)
                                        }
                                      >
                                        <AiOutlineCloseCircle className="text-2xl" />
                                      </button>
                                    </div>
                                    <div className="absolute inset-0 w-full h-full">
                                      {assetPreview && (
                                        <>
                                          {assetPreview.assetType ===
                                            "OnlineImage" && (
                                            <div className="imagebox">
                                              <img
                                                src={
                                                  assetPreview.assetFolderPath
                                                }
                                                alt={assetPreview.assetName}
                                                className="rounded-2xl w-full h-full object-contain"
                                              />
                                            </div>
                                          )}

                                          {assetPreview.assetType ===
                                            "OnlineVideo" && (
                                            <div className="relative videobox">
                                              <video
                                                controls
                                                className="w-full rounded-2xl h-full"
                                              >
                                                <source
                                                  src={
                                                    assetPreview.assetFolderPath
                                                  }
                                                  type="video/mp4"
                                                />
                                                Your browser does not support
                                                the video tag.
                                              </video>
                                            </div>
                                          )}
                                          {assetPreview.assetType ===
                                            "Image" && (
                                            <img
                                              src={assetPreview.assetFolderPath}
                                              alt={assetPreview.assetName}
                                              className="imagebox w-full h-full p-2 object-contain"
                                            />
                                          )}
                                          {assetPreview.assetType ===
                                            "Video" && (
                                            <video
                                              controls
                                              className="w-full rounded-2xl relative h-56"
                                            >
                                              <source
                                                src={
                                                  assetPreview.assetFolderPath
                                                }
                                                type="video/mp4"
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          )}
                                          {assetPreview.assetType === "DOC" && (
                                          <a
                                            href={assetPreview.assetFolderPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {assetPreview.assetName}
                                          </a>
                                        )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-5">
              <p className="text-black text-left">
                Content will always be playing Confirm
              </p>
              <p className="text-right">
                <button
                  className="bg-primary text-white rounded-full px-5 py-2"
                  onClick={() => setShowAssetModal(false)}
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
  );
};

export default AssetModal;
