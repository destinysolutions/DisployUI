import React from "react";
import Modal from 'react-responsive-modal';
import "react-responsive-modal/styles.css";
import ReactPlayer from 'react-player'

// Define a custom style with a fixed height
const modalStyle = {
    width: '80%', // You can adjust the width based on your preference
    height: '500px', // Set the fixed height here
};

const Preview = ({
    open,
    onClose,
    previewData
}) => {

    const handleModalClose = () => {
        onClose();
    };

    console.log("previewData", previewData);

    return (
        <>
            <Modal
                open={open}
                onClose={handleModalClose}
                center
                styles={{ modal: modalStyle }}
            >
                <hr className="m-2 h-10" />
                <div className="w-full p-4 text-center bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 h-[300px]">

                    {previewData.assetType === 'Video' &&

                        <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                            <source src={previewData.assetURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    }

                    {previewData.assetType === 'OnlineVideo' &&
                        <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                            <source src={previewData.assetURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    }


                    {previewData.assetType === 'OnlineImage' &&
                        <div className="">
                            <img src={previewData.assetURL} className="h-48 w-100 rounded-lg" />
                        </div>
                    }

                    {previewData.assetType === 'Image' &&
                        <div className="">
                            <img src={previewData.assetURL} className="h-48 w-100 rounded-lg" />
                        </div>
                    }

                </div>
            </Modal>
        </>
    );
}

export default Preview;
