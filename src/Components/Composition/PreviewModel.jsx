import React from "react";
function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 "></div>
      <div
        className="z-40 fixed md:w-[576px] md:h-[324px] sm:w-[384px] sm:h-[216px] lg:w-[960px] lg:h-[540px] w-72 h-72 left-1/2 -translate-x-1/2 lg:top-1/2 md:top-1/2 sm:top-1/2 top-1/2 -translate-y-1/2"
        style={{ zIndex: 11111 }}
      >
        {children}
      </div>
    </>
  );
}

export default Modal;
