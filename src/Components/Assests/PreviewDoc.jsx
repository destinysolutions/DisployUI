import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

const PreviewDoc = ({ HandleClose, fileType, assetFolderPath }) => {
    let viewerSrc = '';

    if (fileType === '.pdf' || fileType === '.txt') {
        viewerSrc = assetFolderPath;
    } else if (fileType === '.csv') {
        viewerSrc = `https://docs.google.com/gview?url=${assetFolderPath}&embedded=true`;
    } else if (
        fileType === '.pptx' ||
        fileType === '.ppt' ||
        fileType === '.docx' ||
        fileType === '.doc' ||
        fileType === '.xlsx' ||
        fileType === '.xls'
    ) {
        viewerSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${assetFolderPath}`;
    }
    return (
        <>
            <div
                id="popup-modal"
                tabIndex="-1"
                className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 h-full">
                        <AiOutlineCloseCircle
                            className="text-4xl text-primary cursor-pointer float-right"
                            onClick={HandleClose}
                        />
                        {/* Modal content */}
                        <div className="p-7 md:p-8 text-center h-full">
                            <iframe
                                className='h-full w-full'
                                title="Document Viewer"
                                src={viewerSrc}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PreviewDoc
