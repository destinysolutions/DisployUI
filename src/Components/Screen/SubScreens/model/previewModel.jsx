import React from "react";
import Modal from 'react-responsive-modal';
import "react-responsive-modal/styles.css";


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

    return (
        <>
            <Modal
                open={open}
                onClose={handleModalClose}
                center
                styles={{ modal: modalStyle }}
            >
                {/* <h3 className="text-xl font-semibold bg-white dark:text-white m-5 capitalize">{previewData.screenGroupName}</h3> */}
                <hr className="m-2 h-10" />
                <div className="w-full p-4 text-center bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 h-[300px]">
                    <div className="w-full h-full pb-5 mx-auto">
                        {previewData && previewData.map((noofBox) => {
                            return (
                                <>
                                    {noofBox.noofBox > 0 && noofBox.compositionPossition.map((comp, index) => (
                                        <div key={index}>
                                            
                                            {/* {comp.schedules.map((schedule, i) => (
                                                <div key={i}>
                                                    {schedule.mediaType === 'Video' ? (
                                                        schedule.durationInSecond >= 10 ? (
                                                            <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "250px" }}>
                                                                <source src={schedule.fileType} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : (
                                                            <p>This video is less than 10 seconds.</p>
                                                        )
                                                    ) : (
                                                        <img src={schedule.fileType} alt={`Image ${i}`} />
                                                    )}
                                                </div>
                                            ))} */}
                                        </div>
                                    ))}
                                </>
                            )
                        })}

                    </div>


                    {/* {previewData.assetType === 'Video' &&
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

                    {previewData.assetType === 'Video' &&
                        <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                            <source src={previewData.assetURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    }

                    {previewData.assetType === 'OnlineImage' &&
                        <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                            <source src={previewData.assetURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    }

                    {previewData.assetType === 'Image' &&
                        <video controls className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }}>
                            <source src={previewData.assetURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    }
                    
                    {previewData.assetType === 'Text' &&
                       <marquee
                       className="text-3xl w-full h-full flex items-center text-black"
                    //    direction={
                    //      item?.scrollType == 1 ||
                    //      item?.direction == "Left to Right"
                    //        ? "right"
                    //        : "left"
                    //    }
                       scrollamount="10"
                     >
                       {previewData.assetURL}
                     </marquee>
                    } */}

                </div>
            </Modal>
        </>
    );
}

export default Preview;
