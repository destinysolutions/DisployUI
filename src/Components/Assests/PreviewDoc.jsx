import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const PreviewDoc = ({ HandleClose, fileType, assetFolderPath }) => {
  let viewerSrc = "";

  if (fileType === ".pdf" || fileType === ".txt") {
    viewerSrc = assetFolderPath;
  } else if (fileType === ".csv") {
    viewerSrc = `https://docs.google.com/gview?url=${assetFolderPath}&embedded=true`;
  } else if (
    fileType === ".pptx" ||
    fileType === ".ppt" ||
    fileType === ".docx" ||
    fileType === ".doc" ||
    fileType === ".xlsx" ||
    fileType === ".xls"
  ) {
    viewerSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${assetFolderPath}`;
  }
  return (
    <>
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
              {/* Modal content */}
              <div className="p-5 md:p-8 text-center lg:w-[768px] lg:h-[432px] sm:w-[560px] sm:h-[340px] w-full h-full max-w-full">
                <iframe
                  className="h-full w-full"
                  title="Document Viewer"
                  src={viewerSrc}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewDoc;
