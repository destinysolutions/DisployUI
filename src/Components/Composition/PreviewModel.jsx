import React from "react";
function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay fixed inset-0 z-40 bg-black opacity-50"></div>
      <div className="modal-container bg-white  mx-auto rounded shadow-lg z-50 ">
        <div className="modal-content text-left">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
