import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ReactPlayer from "react-player";

const PreviewMerge = ({ assetPreview, setAssetPreviewPopup }) => {

  for (let i = 0; i < assetPreview?.rows; i++) {
    for (let j = 0; j < assetPreview?.columns; j++) {
      console.log("row", i + 1);
      console.log("column", j + 1);
    }
  }
  const Rows = Array.from(
    { length: assetPreview?.rows },
    (_, index) => index + 1
  );
  const Cols = Array.from(
    { length: assetPreview?.columns },
    (_, index) => index + 1
  );

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-8xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="fixed left-1/2 lg:top-1/4 md:top-1/3 sm:top-1/3 top-1/3 -translate-x-1/2 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 bg-black z-9990 inset-0">
              {/* btn */}
              <div className="fixed z-9999">
                <button
                  className="fixed cursor-pointer -top-3 -right-3 rounded-full bg-black text-white"
                  onClick={() => setAssetPreviewPopup(false)}
                >
                  <AiOutlineCloseCircle size={30} />
                </button>
              </div>
              {/* <div className="fixed">
                {Rows?.map((item) => {
                  Cols?.map((item1) => {
                    assetPreview?.mergeSubScreenDeatils?.map((asset) => {
                      if (asset?.positionY === item) {
                        if (asset?.positionX === item1) {
                          return (
                            <>
                              {asset.assetType === "OnlineImage" && (
                                <div>
                                  <img
                                    src={
                                      asset.assetFolderPath ||
                                      asset?.assetURL ||
                                      asset?.filePath
                                    }
                                    alt={
                                      asset.assetName ||
                                      asset?.assetURL ||
                                      asset?.filePath
                                    }
                                    className="imagebox z-50 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 fixed"
                                  />
                                </div>
                              )}
                              {asset.assetType === "OnlineVideo" && (
                                <div className="relative videobox">
                                  <video
                                    controls
                                    className="rounded-2xl md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72"
                                  >
                                    <source
                                      src={
                                        asset.assetFolderPath ||
                                        asset?.assetURL ||
                                        asset?.filePath
                                      }
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}
                              {asset.assetType === "Image" && (
                                <img
                                  src={
                                    asset.assetFolderPath ||
                                    asset?.assetURL ||
                                    asset?.filePath
                                  }
                                  alt={
                                    asset.assetName ||
                                    asset?.assetURL ||
                                    asset?.filePath
                                  }
                                  className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                                />
                              )}
                              {asset.assetType === "Video" && (
                                <video
                                  controls
                                  className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                                >
                                  <source
                                    src={
                                      asset?.filePath
                                    }
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              )}
                            </>
                          );
                        }
                      }
                    });
                  });
                })}
              </div> */}
              <div className="fixed flex bg-white flex-col md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72">
                {/* Loop through each row */}
                {Rows.map((row) => (
                  <div
                    key={`row-${row}`}
                    className={`flex flex-row w-full row-${assetPreview?.rows}`}
                  >
                    {/* Loop through each column in the row */}
                    {Cols.map((col) => {
                      // Find the asset that matches the current row and column
                      const matchingAsset =
                        assetPreview.mergeSubScreenDeatils.find(
                          (asset) =>
                            asset.positionX === col && asset.positionY === row
                        );
                      // Render the asset if found
                      return (
                        matchingAsset && (
                          // <div key={`asset-${matchingAsset.mergeSubScreenDeatilsId}`} className={`asset-crop-${assetPreview?.rows}-${assetPreview?.columns}`}>
                          <div
                            key={`asset-${matchingAsset.mergeSubScreenDeatilsId}`}
                            className="w-full h-full border-2 border-white"
                          >
                            {matchingAsset.assetType === "OnlineImage" && (
                              <img
                                src={
                                  matchingAsset.assetFolderPath ||
                                  matchingAsset.assetURL ||
                                  matchingAsset.filePath
                                }
                                alt={
                                  matchingAsset.assetName ||
                                  matchingAsset.assetURL ||
                                  matchingAsset.filePath
                                }
                                className="imagebox z-50 w-full h-full"
                              />
                            )}
                            {matchingAsset.assetType === "OnlineVideo" && (
                              // <div className="relative videobox">
                              //   <video
                              //     controls={false}
                              //     className="rounded-2xl w-full h-full"
                              //     autoPlay
                              //     loop
                              //     playsInline
                              //   >
                              //     <source
                              //       src={
                              //         matchingAsset.assetFolderPath ||
                              //         matchingAsset.assetURL ||
                              //         matchingAsset.filePath
                              //       }
                              //       type="video/mp4"
                              //     />
                              //     Your browser does not support the video tag.
                              //   </video>
                              // </div>
                              <ReactPlayer
                                url={
                                  matchingAsset.assetFolderPath ||
                                  matchingAsset.assetURL ||
                                  matchingAsset.filePath
                                }
                                className="w-full h-full object-fill"
                                width={"100%"}
                                height={"100%"}
                                controls={false}
                                playing={true}
                                loop={true}
                              />
                            )}
                            {matchingAsset.assetType === "Image" && (
                              <img
                                src={
                                  matchingAsset.assetFolderPath ||
                                  matchingAsset?.assetURL ||
                                  matchingAsset?.filePath
                                }
                                alt={
                                  matchingAsset.assetName ||
                                  matchingAsset?.assetURL ||
                                  matchingAsset?.filePath
                                }
                                className="imagebox w-full h-full"
                              />
                            )}
                            {matchingAsset.assetType === "Video" && (
                              // <video
                              //   controls={false}
                              //   autoPlay
                              //   loop
                              //   playsInline
                              //   className="imagebox w-full h-full"
                              // >
                              //   <source
                              //     src={matchingAsset?.filePath}
                              //     type="video/mp4"
                              //   />
                              //   Your browser does not support the video tag.
                              // </video>

                              <ReactPlayer
                                url={matchingAsset?.filePath}
                                className="w-full h-full object-fill"
                                width={"100%"}
                                height={"100%"}
                                controls={false}
                                playing={true}
                                loop={true}
                              />
                            )}
                          </div>
                        )
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* <div className="fixed">
                {assetPreview?.mergeSubScreenDeatils?.map((asset) => {
                  if (
                    Rows.includes(asset.positionY) &&
                    Cols.includes(asset.positionX)
                  ) {
                    return (
                      <div key={asset.id}>
                        {asset.assetType === "OnlineImage" && (
                          <img
                            src={
                              asset.assetFolderPath ||
                              asset.assetURL ||
                              asset.filePath
                            }
                            alt={
                              asset.assetName ||
                              asset.assetURL ||
                              asset.filePath
                            }
                            className="imagebox z-50 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 fixed"
                          />
                        )}
                        {asset.assetType === "OnlineVideo" && (
                          <div className="relative videobox">
                            <video
                              controls
                              className="rounded-2xl md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72"
                            >
                              <source
                                src={
                                  asset.assetFolderPath ||
                                  asset.assetURL ||
                                  asset.filePath
                                }
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                        {asset.assetType === "Image" && (
                          <img
                            src={
                              asset.assetFolderPath ||
                              asset?.assetURL ||
                              asset?.filePath
                            }
                            alt={
                              asset.assetName ||
                              asset?.assetURL ||
                              asset?.filePath
                            }
                            className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                          />
                        )}
                        {asset.assetType === "Video" && (
                          <video
                            controls
                            className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                          >
                            <source src={asset?.filePath} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewMerge;
