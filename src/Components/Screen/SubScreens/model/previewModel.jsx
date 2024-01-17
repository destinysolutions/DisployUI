import React from "react";
import Modal from 'react-responsive-modal';
import "react-responsive-modal/styles.css";

const Preview = ({
    open,
    onClose,
    previewData
}) => {

    const handleModalClose = () => {
        onClose();
    };
    console.log("previewData", previewData)
    return (
        <>
            <Modal
                open={open}
                onClose={handleModalClose}
                center
            >
                <h3 className="text-xl font-semibold font-bold bg-white dark:text-white m-5 ">{previewData.screenGroupName}</h3>
                <div className="grid mb-8  rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2 bg-white dark:bg-gray-800">
                    {previewData && previewData.screenGroupLists.length > 0 && previewData?.screenGroupLists.map((item, index) => (
                        <div key={index} className="grid border shadow dark:border-gray-700 gap-10 md:grid-cols-2bg-white dark:bg-gray-800 sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                            {index} <figure className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-t-lg md:rounded-t-none md:rounded-ss-lg dark:bg-gray-800 dark:border-gray-700">

                                {item.assetType === 'Video' &&
                                    <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                                        <source src={item.assetURL} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }


                                {item.assetType === 'OnlineVideo' &&
                                    <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                                        <source src={item.assetURL} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }

                                {item.assetType === 'Video' &&
                                    <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                                        <source src={item.assetURL} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }

                                {item.assetType === 'OnlineImage' &&
                                    <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                                        <source src={item.assetURL} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }

                                {item.assetType === 'Image' &&
                                    <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                                        <source src={item.assetURL} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }
                            </figure>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
}

export default Preview;
