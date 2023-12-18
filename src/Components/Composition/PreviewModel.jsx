import React from "react";
function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 overflow-y-scroll"></div>
      <div className="z-40 fixed w-full h-full left-1/2 -translate-x-1/2 top-10 overflow-y-scroll ">
        {children}
      </div>
    </>
  );
}

export default Modal;
