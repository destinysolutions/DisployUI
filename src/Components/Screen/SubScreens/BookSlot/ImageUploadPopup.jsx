import { Button } from '@material-tailwind/react';
import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const ImageUploadPopup = ({ index, isOpen, onClose, onSubmit }) => {

    const [verticalImage, setVerticalImage] = useState(null);
    const [horizontalImage, setHorizontalImage] = useState(null);

    const [verticalFileName, setVerticalFileName] = useState('');
    const [horizontalFileName, setHorizontalFileName] = useState('');

    const handleVerticalFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVerticalImage(file);
                setVerticalFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleHorizontalFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHorizontalImage(file);
                setHorizontalFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        onSubmit(index, verticalImage, horizontalImage);
        onClose();
    };

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="relative p-5 mb-5 lg:w-[1000px] md:w-[900px] sm:w-full max-w-2xl">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 h-150">
                                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Upload Image & video
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => { onClose() }}
                                    />
                                </div>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg screen-section">
                                    <div className="schedual-table bg-white rounded-xl mt-5 px-3">
                                        <div className="relative overflow-x-auto sc-scrollbar rounded-lg">

                                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 m-auto">
                                                <div class="mb-3 text-gray-500 dark:text-gray-400 m-auto">
                                                    <figure className="max-w-lg">
                                                        {verticalFileName && (
                                                            <p className="text-gray-900 dark:text-gray-300">
                                                                {verticalFileName}
                                                            </p>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*, video/*"
                                                            onChange={handleVerticalFileUpload}
                                                            className="hidden"
                                                            id="vertical-file-upload"
                                                        />
                                                        <label
                                                            htmlFor="vertical-file-upload"
                                                            className="py-2.5 px-5 me-2 mb-2 flex items-center mt-6 space-x-4 rtl:space-x-reverse text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
                                                        >
                                                            Vertical File Upload
                                                        </label>
                                                    </figure>
                                                </div>

                                                <div class="mb-3 text-gray-500 dark:text-gray-400 m-auto">
                                                    <figure className="max-w-lg">
                                                        {horizontalFileName && (
                                                            <p className="text-gray-900 dark:text-gray-300">
                                                                {horizontalFileName}
                                                            </p>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*, video/*"
                                                            onChange={handleHorizontalFileUpload}
                                                            className="hidden"
                                                            id="horizontal-file-upload"
                                                        />
                                                        <label
                                                            htmlFor="horizontal-file-upload"
                                                            className="py-2.5 px-5 me-2 mb-2 flex items-center mt-6 space-x-4 rtl:space-x-reverse text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
                                                        >
                                                            Horizontal File Upload
                                                        </label>
                                                    </figure>
                                                </div>
                                            </div>
                                            <div className="w-full h-full">
                                                <div className="flex justify-end pt-4 h-full items-end">
                                                    <button
                                                        className="sm:ml-2 xs:ml-1 mb-5 flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                                        type="submit"
                                                        onClick={handleSubmit}
                                                    >
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default ImageUploadPopup