import React from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import ReactPlayer from "react-player";

// Define a custom style with a fixed height
const modalStyle = {
  width: "80%", // You can adjust the width based on your preference
  height: "70vh", // Set the fixed height here
};

const Preview = ({ open, onClose, previewData }) => {
  const handleModalClose = () => {
    onClose();
  };


  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        center
        styles={{ modal: modalStyle }}
      >
        <div className="w-full text-center bg-white rounded-2xl  h-full">
          {previewData.assetType === "Video" && (
            <video
              controls
              className="flex justify-center relative w-full h-full"
              style={{ maxWidth: "100%", height: "100%" }}
            >
              <source src={previewData.assetURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {previewData.assetType === "OnlineVideo" && (
            <video
              controls
              className="flex justify-center relative w-full h-full"
              style={{ maxWidth: "100%", height: "100%" }}
            >
              <source src={previewData.assetURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {previewData.assetType === "OnlineImage" && (
            <div className="flex justify-center relative w-full h-full">
              <img src={previewData.assetURL} className="h-full rounded-lg" />
            </div>
          )}

          {previewData.assetType === "Image" && (
            <div className="flex justify-center relative w-full h-full">
              <img src={previewData.assetURL} className="h-full rounded-lg" />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Preview;
