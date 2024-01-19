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
    console.log("previewData", previewData)
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
                        <div className="relative z-0 mx-auto rounded-lg p-4 h-full w-full ">
                            {previewData && previewData.compositionPossition?.length > 0 && previewData.compositionPossition.map((data) => {
                                return (
                                    <>
                                        dfdfdd
                                    </>
                                )
                            })}
                        </div>


                        {/* {loading ? (
                  <div className="text-center font-semibold text-2xl">
                    Loading...
                  </div>
                ) : (
                  compositionData.length > 0 &&
                  !loading && (
                    <div className="relative z-0 mx-auto rounded-lg p-4 h-full w-full ">
                      {!fetchLayoutLoading &&
                        !loading &&
                        layotuDetails !== null &&
                        layotuDetails?.lstLayloutModelList.length > 0 &&
                        layotuDetails?.lstLayloutModelList?.map(
                          (data, index) => {
                            return (
                              <div
                                key={index}
                                className="absolute"
                                style={{
                                  left: data.leftside + "%",
                                  top: data.topside + "%",
                                  width: data?.width + "%",
                                  height: data?.height + "%",
                                  backgroundColor: data.fill,
                                }}
                              >
                                <Carousel
                                  from="screen"
                                  items={compositionData[index][index + 1]}
                                />
                              </div>
                            );
                          }
                        )}
                    </div>
                    // null
                  )
                )}
                {!loading &&
                  compositionData.length === 0 &&
                  playerData !== null &&
                  playerData !== undefined &&
                  (Object.values(playerData).includes("Video") ||
                    Object.values(playerData).includes("OnlineVideo")) && (
                    <ReactPlayer
                      url={playerData?.fileType}
                      className="w-full relative z-20 videoinner"
                      controls={true}
                      playing={true}
                      loop={true}
                    />
                  )}

                {!loading &&
                  compositionData.length === 0 &&
                  playerData !== null &&
                  playerData !== undefined &&
                  (Object.values(playerData).includes("OnlineImage") ||
                    Object.values(playerData).includes("Image")) && (
                    <img
                      src={playerData?.fileType}
                      alt="Media"
                      className="w-full h-full mx-auto object-fill"
                    />
                  )} */}
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
