import moment from "moment";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { IoBarChartSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ShowAppsModal from "../../../ShowAppsModal";
import { useDispatch } from "react-redux";
import { handleGetAllAssets, handleGetAllAssetsTypeBase } from "../../../../Redux/Assetslice";
import { GET_ASSET_DETAILS } from "../../../../Pages/Api";

const ShowAssetModal = ({
  setShowAssetModal,
  setAssetPreviewPopup,
  setPopupActiveTab,
  popupActiveTab,
  handleAssetUpdate,
  assetPreviewPopup,
  assetPreview,
  selectedAsset,
  handleAssetAdd,
  type,
  handleSave,
}) => {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [showAppModal, setShowAppModal] = useState(false);
  const [loadFist, setLoadFist] = useState(true);
  const store = useSelector((s) => s.root.asset);
  const [searchAssest, setSearchAssest] = useState("");
  const [filteredAssets, setFilteredAssets] = useState([]);

  const modalRef = useRef(null);

  const handleOnConfirm = async () => {
    await handleSave();
    setShowAssetModal(false);
    handleAssetUpdate();
    setAssetPreviewPopup(false);
  };

  const handleSearchAssest = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchAssest(searchQuery);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        setShowAssetModal(false);
        setAssetPreviewPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside, user]);

  function handleClickOutside() {
    setShowAssetModal(false);
    setAssetPreviewPopup(false);
  }

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

  useEffect(() => {
    const query = `ScreenType=ALL`;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_ASSET_DETAILS}?${query}`,
      headers: { "Content-Type": "application/json", Authorization: authToken },
      data: query,
    };

    if (loadFist) {
      dispatch(handleGetAllAssetsTypeBase({ config }));
      setLoadFist(false);
    }
  }, [loadFist, store]);

  useEffect(() => {
    const filteredAssets = store.data?.filter(
      (asset) =>
        asset.assetType !== "Folder" &&
        asset.assetName.toLowerCase().includes(searchAssest)
    );
    setFilteredAssets(filteredAssets);
  }, [searchAssest, store]);


  useEffect(() => {
    const handleStorageChange = () => {
      const isClosed = localStorage.getItem("isWindowClosed");
      if (isClosed === "true") {
        dispatch(handleGetAllAssets({ token }));
        localStorage.setItem("isWindowClosed", "false");
        // window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <div className="border-0 rounded-lg shadow-lg fixed z-50 max-w-[70vw] min-w-[70vw] h-auto top-12 left-1/2 -translate-x-1/2 bg-white outline-none focus:outline-none ">
        <div
          className={`${showAppModal ? "hidden" : ""
            } flex items-start justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black`}
        >
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
        <div
          onClick={() => assetPreviewPopup && setAssetPreviewPopup(false)}
          className={`${showAppModal ? "hidden" : ""
            } relative lg:p-6 md:p-6 sm:p-2 xs:p-1 w-full flex items-start gap-2 bg-white rounded-2xl`}
        >
          <div className="lg:flex lg:flex-wrap lg:items-center  w-full md:flex md:flex-wrap md:items-center sm:block xs:block">
            <div className="flex-initial">
              {type !== "merged_screens" && (
                <>
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
                </>
              )}
            </div>

            <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl flex-1">
              <div className={popupActiveTab !== 1 && "hidden"}>
                <div className="flex flex-wrap w-full items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                  <div className="mb-5 relative ">
                    <AiOutlineSearch className="absolute top-2 left-2 w-5 h-5 z-10 text-gray" />
                    <input
                      type="text"
                      placeholder="Search assest"
                      className="border border-primary rounded-full pl-8 py-2 search-user"
                      value={searchAssest}
                      onChange={handleSearchAssest}
                    />
                  </div>
                  <Link to="/fileupload" target="_blank">
                    <button className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white"
                      onClick={() => {
                        localStorage.setItem("isWindowClosed", "false");
                      }}>
                      Upload
                    </button>
                  </Link>
                </div>
                <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover w-full addmedia-table">
                  <table
                    style={{
                      borderCollapse: "separate",
                      borderSpacing: " 0 10px",
                    }}
                    className="w-full"
                  >
                    <thead className="sticky top-0">
                      <tr className="bg-lightgray">
                        <th className="p-3 w-80 text-left">Media Name</th>
                        <th>Date Added</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Type</th>
                      </tr>
                    </thead>

                    {store &&
                      filteredAssets?.map((asset) => {
                        return (
                          <>
                            <tbody key={asset.assetID}>
                              <tr
                                className={`${selectedAsset === asset ||
                                    selectedAsset === asset?.assetName
                                    ? "bg-[#f3c953]"
                                    : ""
                                  } border-b border-[#eee] text-center cursor-pointer hover:bg-black hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50`}
                                onClick={() => {
                                  handleAssetAdd(asset);
                                  setAssetPreviewPopup(true);
                                }}
                              >
                                <td className="p-3 text-left">
                                  {asset.assetName}
                                </td>
                                <td className="p-3">
                                  {moment(asset.createdDate).format(
                                    "YYYY-MM-DD hh:mm"
                                  )}
                                </td>
                                <td className="p-3">{asset.fileSize}</td>
                                <td className="p-3">{asset.assetType}</td>
                              </tr>
                            </tbody>
                          </>
                        );
                      })}
                  </table>

                  {assetPreviewPopup && (
                    <div className="fixed left-1/2 -translate-x-1/2 w-10/12 h-10/12 bg-black z-50 inset-0">
                      {/* btn */}
                      <div className="p-1 rounded-full text-white bg-primary absolute -top-3 -right-3">
                        <button
                          className="text-xl"
                          onClick={() => setAssetPreviewPopup(false)}
                        >
                          <AiOutlineCloseCircle className="text-2xl" />
                        </button>
                      </div>
                      <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[90%] w-[90%]">
                        {assetPreview && (
                          <>
                            {assetPreview.assetType === "OnlineImage" && (
                              <div className="imagebox p-3">
                                <img
                                  src={assetPreview.assetFolderPath}
                                  alt={assetPreview.assetName}
                                  className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                                />
                              </div>
                            )}

                            {assetPreview.assetType === "OnlineVideo" && (
                              <div className="relative videobox">
                                <video
                                  controls
                                  className="w-full rounded-2xl h-full"
                                >
                                  <source
                                    src={assetPreview.assetFolderPath}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}
                            {assetPreview.assetType === "Image" && (
                              <img
                                src={assetPreview.assetFolderPath}
                                alt={assetPreview.assetName}
                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                              />
                            )}
                            {assetPreview.assetType === "Video" && (
                              <video
                                controls
                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                              >
                                <source
                                  src={assetPreview.assetFolderPath}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {assetPreview.assetType === "DOC" && (
                              <a
                                href={assetPreview.assetFolderPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                              >
                                {assetPreview.assetName}
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${showAppModal ? "hidden" : ""
            } flex justify-between items-center p-5`}
        >
          <p className="text-black">Content will always be playing Confirm</p>
          <button
            className="bg-primary text-white rounded-full px-5 py-2"
            onClick={() => {
              handleOnConfirm();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
      {showAppModal && <ShowAppsModal setShowAppModal={setShowAppModal} />}
      <div
        onClick={() => handleClickOutside()}
        className="fixed inset-0 z-30 bg-black/20"
      ></div>
    </>
  );
};

export default ShowAssetModal;
