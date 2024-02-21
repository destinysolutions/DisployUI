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
        onClick={() => {
          setShowImageAssetModal(false);
          setImageAssetModal(null);
        }}
        className="inset-0 fixed bg-black/40 w-screen h-screen z-40"
      ></div>
      <div className="fixed left-1/2 lg:top-1/4 md:top-1/4 sm:top-1/4 top-1/4 -translate-x-1/2 md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 bg-lightgray z-50">
        <div className="fixed md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72">
          <div
            onClick={() => {
              setShowImageAssetModal(false);
              setImageAssetModal(null);
            }}
            className="fixed cursor-pointer -top-3 -right-3 z-40 rounded-full bg-black text-white"
          >
            <AiOutlineCloseCircle size={30} />
          </div>
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
        </div>
      </div>
    </>
  );
};

export default ShowAssetImageModal;
