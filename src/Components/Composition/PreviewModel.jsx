import React from "react";
function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 "></div>
      <div className="z-40 fixed w-[80vw] h-[80vw] lg:w-[50vw] lg:h-[50vw] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        {children}
      </div>
    </>
  );
}

export default Modal;
