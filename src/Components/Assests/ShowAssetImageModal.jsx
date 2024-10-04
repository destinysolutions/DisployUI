import React, { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ShowAssetImageModal = ({
  setImageAssetModal,
  setShowImageAssetModal,
  imageAssetModal,
}) => {
  useEffect(() => {
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        setShowImageAssetModal(false);
        setImageAssetModal(false);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);


  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-60"
      >
        <div className="relative p-4 w-full max-w-8xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="fixed left-1/2 lg:top-1/4 md:top-1/3 sm:top-1/3 top-1/3 -translate-x-1/2 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 bg-black z-9990 inset-0">
              {/* btn */}
              <div className="fixed z-9999">
                <button
                  className="fixed cursor-pointer -top-3 -right-3 rounded-full bg-black text-white"
                  onClick={() => {
                    setShowImageAssetModal(false);
                    setImageAssetModal(null);
                  }}
                >
                  <AiOutlineCloseCircle size={30} />
                </button>
              </div>
              <div className="fixed w-full h-full">
                <>
                  {imageAssetModal?.assetType === "Image" && (
                    <img
                      className="fixed md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 object-fill inset-0"
                      src={imageAssetModal?.assetFolderPath}
                    />
                  )}
                  {imageAssetModal?.assetType === "OnlineImage" && (
                    <img
                      className="fixed md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 inset-0 object-fill"
                      src={imageAssetModal?.assetFolderPath}
                    />
                  )}
                  {imageAssetModal?.assetType === "Video" && (
                    <video
                      className="fixed md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 inset-0 object-fill"
                      controls
                    >
                      <source src={imageAssetModal?.assetFolderPath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {imageAssetModal?.assetType === "OnlineVideo" && (
                    <video
                      className="fixed md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 inset-0 object-fill"
                      controls
                    >
                      <source src={imageAssetModal?.assetFolderPath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowAssetImageModal;
