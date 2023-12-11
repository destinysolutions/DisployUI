import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ShowAssetImageModal = ({
  setImageAssetModal,
  setShowImageAssetModal,
  imageAssetModal,
}) => {
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
          <img
            className="fixed max-h-full max-w-full min-w-full min-h-full object-fill inset-0"
            src={imageAssetModal}
          />
        </div>
      </div>
    </>
  );
};

export default ShowAssetImageModal;
