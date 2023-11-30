import moment from "moment";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { IoBarChartSharp } from "react-icons/io5";
import { RiPlayListFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const ShowAssetModal = ({
  setShowAssetModal,
  handleAssetAdd,
  setAssetPreviewPopup,
  setPopupActiveTab,
  popupActiveTab,
  handleCompositionsAdd,
  handleAssetUpdate,
  assetPreviewPopup,
  assetData,
  assetPreview,
  selectedComposition,
  searchAsset,
  handleFilter,
  selectedAsset,
  compositionData,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event?.target)) {
        // window.document.body.style.overflow = "unset";
        setShowAssetModal(false);
        setAssetPreviewPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setShowAssetModal(false);
    setAssetPreviewPopup(false);
    // window.document.body.style.overflow = "unset";
    // setSearchTerm("");
  }

  return (
    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none myplaylist-popup">
      <div
        ref={modalRef}
        className="relative w-auto my-6 mx-auto myplaylist-popup-details"
      >
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none addmediapopup">
          <div className="flex items-start justify-between p-4 px-6 border-b border-slate-200 rounded-t text-black">
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
                      onClick={() => setPopupActiveTab(1)}
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
                      onClick={() => setPopupActiveTab(2)}
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
                      Compositions
                    </button>
                    {/* <button
                        type="button"
                        className={`inline-flex items-center gap-2 t text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 mediactivetab ${
                          popupActiveTab === 3
                            ? "active"
                            : ""
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
                          popupActiveTab === 4
                            ? "active"
                            : ""
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
                          <AiOutlineAppstoreAdd
                            size={15}
                          />
                        </span>
                        Apps
                      </button> */}
                  </nav>
                </div>

                <div className="lg:p-10 md:p-10 sm:p-1 xs:mt-3 sm:mt-3 drop-shadow-2xl bg-white rounded-3xl">
                  <div className={popupActiveTab === 1 ? "" : "hidden"}>
                    <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                      <div className="mb-5 relative ">
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
                        <button className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                          Upload
                        </button>
                      </Link>
                    </div>
                    <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table">
                      <table
                        style={{
                          borderCollapse: "separate",
                          borderSpacing: " 0 10px",
                        }}
                      >
                        <thead className="sticky top-0">
                          <tr className="bg-lightgray">
                            <th className="p-3 w-80 text-left">Media Name</th>
                            <th>Date Added</th>
                            <th className="p-3">Size</th>
                            <th className="p-3">Type</th>
                          </tr>
                        </thead>
                        {assetData.map((asset) => (
                          <tbody key={asset.assetID}>
                            <tr
                              className={`${
                                selectedAsset === asset ? "bg-[#f3c953]" : ""
                              } border-b border-[#eee] `}
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
                        ))}
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
                            {/* {assetPreview.assetType === "Image" && (
                              <img
                                src={assetPreview.assetFolderPath}
                                alt={assetPreview.assetName}
                                className="imagebox w-full h-full object-contain top-0 left-0 z-50 fixed"
                              />
                            )}
                            {assetPreview.assetType === "OnlineImage" && (
                              <div className="relative videobox">
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
                              </div>
                            )} */}
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
                                      Your browser does not support the video
                                      tag.
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
                          {/* <div className="fixed top-0 left-0  max-h-[50%]">
                            {assetPreview && (
                              <>
                                {assetPreview.assetType === "OnlineImage" && (
                                  <div className="imagebox p-3">
                                    <img
                                      src={assetPreview.assetFolderPath}
                                      alt={assetPreview.assetName}
                                      className="rounded-2xl w-full h-full object-contain"
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
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                )}
                                {assetPreview.assetType === "Image" && (
                                  <img
                                    src={assetPreview.assetFolderPath}
                                    alt={assetPreview.assetName}
                                    className="imagebox fixed w-full h-full p-2 object-contain"
                                  />
                                )}
                                {assetPreview.assetType === "Video" && (
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
                          </div> */}
                        </div>
                        // <div className="bg-black bg-opacity-50 fixed inset-0 z-50 outline-none focus:outline-none">
                        //   {/* <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 asset-preview-popup"> */}
                        //   <div className="border-0 rounded-lg shadow-lg relative min-w-[40vw] max-w-[40vw] left-1/2 -translate-x-1/2 min-h-[60vh] max-h-[60vh] bg-black outline-none focus:outline-none">
                        //     <div className="p-1 rounded-full text-white bg-primary absolute top-[-15px] right-[-16px]">
                        //       <button
                        //         className="text-xl"
                        //         onClick={() => setAssetPreviewPopup(false)}
                        //       >
                        //         <AiOutlineCloseCircle className="text-2xl" />
                        //       </button>
                        //     </div>
                        //     <div className="w-full h-full absolute inset-0">
                        //       {assetPreview && (
                        //         <>
                        //           {assetPreview.assetType === "OnlineImage" && (
                        //             <div className="imagebox p-3">
                        //               <img
                        //                 src={assetPreview.assetFolderPath}
                        //                 alt={assetPreview.assetName}
                        //                 className="rounded-2xl w-full h-full object-contain"
                        //               />
                        //             </div>
                        //           )}

                        //           {assetPreview.assetType === "OnlineVideo" && (
                        //             <div className="relative videobox">
                        //               <video
                        //                 controls
                        //                 className="w-full rounded-2xl h-full"
                        //               >
                        //                 <source
                        //                   src={assetPreview.assetFolderPath}
                        //                   type="video/mp4"
                        //                 />
                        //                 Your browser does not support the video
                        //                 tag.
                        //               </video>
                        //             </div>
                        //           )}
                        //           {assetPreview.assetType === "Image" && (
                        //             <img
                        //               src={assetPreview.assetFolderPath}
                        //               alt={assetPreview.assetName}
                        //               className="imagebox w-full h-full p-2 object-contain"
                        //             />
                        //           )}
                        //           {assetPreview.assetType === "Video" && (
                        //             <video
                        //               controls
                        //               className="w-full rounded-2xl relative h-56"
                        //             >
                        //               <source
                        //                 src={assetPreview.assetFolderPath}
                        //                 type="video/mp4"
                        //               />
                        //               Your browser does not support the video
                        //               tag.
                        //             </video>
                        //           )}
                        //           {assetPreview.assetType === "DOC" && (
                        //             <a
                        //               href={assetPreview.assetFolderPath}
                        //               target="_blank"
                        //               rel="noopener noreferrer"
                        //             >
                        //               {assetPreview.assetName}
                        //             </a>
                        //           )}
                        //         </>
                        //       )}
                        //     </div>
                        //   </div>
                        //   {/* </div> */}
                        // </div>
                      )}
                    </div>
                  </div>
                  <div className={popupActiveTab === 2 ? "" : "hidden"}>
                    <div className="flex flex-wrap items-start lg:justify-between  md:justify-center sm:justify-center xs:justify-center">
                      <div className="mb-5 relative ">
                        <AiOutlineSearch className="absolute top-[13px] left-[12px] z-10 text-gray" />
                        <input
                          type="text"
                          placeholder=" Search by Name"
                          className="border border-primary rounded-full px-7 py-2 search-user"
                          value={searchAsset}
                          onChange={handleFilter}
                        />
                      </div>
                      <Link to="/addcomposition">
                        <button className="flex align-middle  items-center rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-4 sm:py-2 text-sm   hover:text-white hover:bg-primary border-2 border-white hover:blorder-white  hover:shadow-lg hover:shadow-primary-500/50 bg-SlateBlue text-white">
                          Add New Composition
                        </button>
                      </Link>
                    </div>
                    <div className="md:overflow-x-auto sm:overflow-x-auto xs:overflow-x-auto min-h-[300px] max-h-[300px] object-cover addmedia-table">
                      <table
                        style={{
                          borderCollapse: "separate",
                          borderSpacing: " 0 10px",
                        }}
                      >
                        <thead className="sticky top-0">
                          <tr className="bg-lightgray">
                            <th className="p-3 w-80 text-left">
                              Composition Name
                            </th>
                            <th>Date Added</th>
                            <th className="p-3">Resolution</th>
                            <th className="p-3">Duration</th>
                          </tr>
                        </thead>
                        {compositionData.map((composition) => (
                          <tbody key={composition.compositionID}>
                            <tr
                              className={`${
                                selectedComposition === composition
                                  ? "bg-[#f3c953]"
                                  : ""
                              } border-b border-[#eee] `}
                              onClick={() => {
                                handleCompositionsAdd(composition);
                              }}
                            >
                              <td className="p-3 text-left">
                                {composition.compositionName}
                              </td>
                              <td className="p-3">
                                {moment(composition.dateAdded).format(
                                  "YYYY-MM-DD hh:mm"
                                )}
                              </td>
                              <td className="p-3">{composition.resolution}</td>
                              <td className="p-3">
                                {moment
                                  .utc(composition.duration * 1000)
                                  .format("hh:mm:ss")}
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-5">
            <p className="text-black">Content will always be playing Confirm</p>
            <button
              className="bg-primary text-white rounded-full px-5 py-2"
              onClick={() => {
                setShowAssetModal(false);
                handleAssetUpdate();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAssetModal;
