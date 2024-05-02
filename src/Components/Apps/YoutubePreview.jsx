import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import ReactPlayer from 'react-player'

const YoutubePreview = ({ setShowPreviewPopup, showPreviewPopup, isMuted, YoutubeVideo }) => {
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
                                    onClick={() => setShowPreviewPopup(!showPreviewPopup)}
                                >
                                    <AiOutlineCloseCircle size={30} />
                                </button>
                            </div>
                            <div className="fixed w-full h-full">
                                <>
                                    <ReactPlayer
                                        url={YoutubeVideo}
                                        className="youtube-preview"
                                        muted={isMuted}
                                        controls={true}
                                    />
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default YoutubePreview
