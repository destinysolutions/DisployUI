import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'


const AssetsPreview = ({ setOpen, openPreview }) => {
    return (
        <>
            <div className="fixed left-1/2 lg:top-1/3 sm:top-1/2 -translate-x-1/2 lg:w-[768px] lg:h-[432px] sm:w-[560px] sm:h-[340px] w-72 h-72 bg-black z-50 inset-0 p-5">
                <div class="w-full p-4 text-center  border border-gray-200 rounded-lg  sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="fixed z-40">
                        <button className="fixed cursor-pointer -top-3 -right-3 rounded-full bg-black text-white" onClick={() => setOpen(false)}>
                            <AiOutlineCloseCircle size={30} />
                        </button>
                    </div>
                    <div className="fixed">
                        <>
                            {openPreview.assetType === "image" && (
                                <div className="imagebox p-3">
                                    <img src={openPreview.filePath} alt={openPreview.name} className="imagebox w-full h-full top-0 left-0 z-50 fixed" />
                                </div>
                            )}
                            {openPreview.assetType === "video" && (
                                <video controls className="imagebox w-full h-full top-0 left-0 z-50 fixed">
                                    <source src={openPreview.filePath} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssetsPreview