import React from 'react'
import { AiOutlineCloseCircle, AiOutlineSearch } from 'react-icons/ai'
import { SegmentArr } from "../../Components/Common/Common"
const AddSegments = ({ togglemodal, segment, setSegment, handleBrowser, allSegment }) => {

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600 ">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add Customer Segments
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => togglemodal()}
                            />
                        </div>
                        <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
                            <div className='flex flex-col items-start gap-2 mb-5'>
                                <h1>You Can Create A New Segment From The Customer Page.</h1>
                                <div className="relative w-full">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <AiOutlineSearch className="w-5 h-5 text-gray " />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search customer segments"
                                        className="border border-primary rounded-lg px-7 pl-10 py-2 w-full"

                                    />
                                </div>
                                {allSegment?.map((item, index) => {
                                    return (
                                        <label className="flex items-center cursor-pointer text-lg" key={index}>
                                            <input type='checkbox' className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" onChange={() => setSegment(item?.customerSegmentsID)} value={segment === item?.customerSegmentsID} />{item?.segments}
                                        </label>
                                    )
                                })}

                            </div>
                            <div className="flex items-center justify-center p-2 md:p-2 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                                <button
                                    className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                                    type="button"
                                    onClick={togglemodal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                    type="button"
                                    onClick={() => handleBrowser()}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddSegments
