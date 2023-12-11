import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ShowAssetImageModal = ({
  setImageAssetModal,
  setShowImageAssetModal,
  imageAssetModal,
}) => {
  console.log(imageAssetModal);
  return (
    <>
      <div
        onClick={() => {
          setShowImageAssetModal(false);
          setImageAssetModal(null);
        }}
        className="inset-0 fixed bg-black/40 w-screen h-screen z-40"
      ></div>
      <div className="fixed left-1/2 -translate-x-1/2 w-[60vw] h-[70vh] bg-lightgray top-28 z-50">
        <div className="fixed w-full h-full">
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
              className="fixed max-h-full max-w-full min-w-full min-h-full object-fill inset-0"
              src={imageAssetModal?.assetFolderPath}
            />
          )}
          {imageAssetModal?.assetType === "OnlineImage" && (
            <img
              className="fixed max-h-full max-w-full min-w-full min-h-full object-fill inset-0"
              src={imageAssetModal?.assetFolderPath}
            />
          )}
          {imageAssetModal?.assetType === "Video" && (
            <video
              className="fixed max-h-full max-w-full min-w-full min-h-full object-fill inset-0"
              controls
            >
              <source src={imageAssetModal?.assetFolderPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {imageAssetModal?.assetType === "OnlineVideo" && (
            <video
              className="fixed max-h-full max-w-full min-w-full min-h-full object-fill inset-0"
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
