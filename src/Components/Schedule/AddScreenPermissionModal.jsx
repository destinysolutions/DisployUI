import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const AddScreenPermissionModal = () => {
  return (
    <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
      <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] border-slate-200 rounded-t text-black">
            <div className="flex items-center">
              <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                Select the Screen you want Schedule add
              </h3>
            </div>
            <button
              className="p-1 text-xl ml-8"
              onClick={() => setAddScreenModal(false)}
            >
              <AiOutlineCloseCircle className="text-2xl" />
            </button>
          </div>
          <div className="flex justify-center p-9 ">
            <p className="break-words w-[280px] text-base text-black text-center">
              New schedule would be applied. Do you want to proceed?
            </p>
          </div>
          <div className="pb-6 flex justify-center">
            <button
              className="bg-primary text-white px-8 py-2 rounded-full"
              onClick={() => setSelectScreenModal(true)}
            >
              OK
            </button>

            <button
              className="bg-primary text-white px-4 py-2 rounded-full ml-3"
              onClick={() => setAddScreenModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScreenPermissionModal;
