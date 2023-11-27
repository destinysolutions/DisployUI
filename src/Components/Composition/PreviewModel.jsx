import React from "react";
function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-10 overflow-y-scroll"></div>
      <div className="z-20 absolute w-full h-full left-1/2 -translate-x-1/2 top-20 overflow-y-scroll -translate-y-[40%]">{children}</div>
    </>
    // <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-scroll mb-20">
    //   <div className="modal-overlay fixed inset-0 z-40 bg-black opacity-20"></div>
    //   <div className="modal-container bg-white  mx-auto rounded shadow-lg z-50 ">
    //     <div className="modal-content text-left">{children}</div>
    //   </div>
    // </div>
  );
}

export default Modal;
