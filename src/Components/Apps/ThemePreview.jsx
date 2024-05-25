import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const ThemePreview = ({ viewerSrc, HandleClose }) => {
    return (
        <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
            <div className="w-auto mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="relative w-full cursor-pointer z-40 rounded-full">
                        <button
                            className="text-xl absolute -right-3 -top-4 bg-black text-white rounded-full"
                            onClick={HandleClose}
                        >
                            <AiOutlineCloseCircle className="text-3xl" />
                        </button>
                        <div className="p-3 md:p-5 text-center lg:w-[768px] lg:h-[432px] md:w-[560px] md:h-[340px] sm:w-[384px] sm:h-[216px] w-72 h-72 max-w-full">
                            <img
                                className="h-full w-full"

                                src={viewerSrc}
                            ></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThemePreview
