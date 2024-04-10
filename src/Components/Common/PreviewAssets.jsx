import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const PreviewAssets = ({ assetPreview, setAssetPreviewPopup }) => {
console.log('assetPreview', assetPreview)
  let viewerSrc = "";

  if (
    assetPreview?.fileExtention === ".pdf" ||
    assetPreview?.fileExtention === ".txt"
  ) {
    viewerSrc = assetPreview?.assetFolderPath;
  } else if (assetPreview?.fileExtention === ".csv") {
    viewerSrc = `https://docs.google.com/gview?url=${assetPreview?.assetFolderPath}&embedded=true`;
  } else if (
    assetPreview?.fileExtention === ".pptx" ||
    assetPreview?.fileExtention === ".ppt" ||
    assetPreview?.fileExtention === ".docx" ||
    assetPreview?.fileExtention === ".doc" ||
    assetPreview?.fileExtention === ".xlsx" ||
    assetPreview?.fileExtention === ".xls"
  ) {
    // viewerSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${assetPreview?.assetFolderPath}`;
    viewerSrc = `https://docs.google.com/viewer?url=${assetPreview?.assetFolderPath}&embedded=true`

  }
  
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
              <div className="fixed">
                {assetPreview && (
                  <>
                    {assetPreview.assetType === "OnlineImage" && (
                      <div>
                        <img
                          src={assetPreview.assetFolderPath || assetPreview?.assetURL}
                          alt={assetPreview.assetName || assetPreview?.assetURL}
                          className="imagebox z-50 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 fixed"
                        />
                      </div>
                    )}

                    {assetPreview.assetType === "OnlineVideo" && (
                      <div className="relative videobox">
                        <video
                          controls
                          className="rounded-2xl md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72"
                        >
                          <source
                            src={assetPreview.assetFolderPath || assetPreview?.assetURL}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                    {assetPreview.assetType === "Image" && (
                      <img
                        src={assetPreview.assetFolderPath || assetPreview?.assetURL}
                        alt={assetPreview.assetName || assetPreview?.assetURL}
                        className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                      />
                    )}
                    {assetPreview.assetType === "Video" && (
                      <video
                        controls
                        className="imagebox md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 z-50 fixed"
                      >
                        <source
                          src={assetPreview.assetFolderPath || assetPreview?.assetURL}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {assetPreview.assetType === "DOC" && (
                      <iframe
                        className='md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72'
                        title="Document Viewer"
                        src={viewerSrc}
                      ></iframe>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewAssets;
