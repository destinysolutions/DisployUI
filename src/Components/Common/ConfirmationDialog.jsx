import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { RiDeleteBin6Line } from "react-icons/ri";
const ConfirmationDialog = ({ HandleClose, handleDelete }) => {
  return (
    <>
      <div
        id="popup-modal"
        tabIndex="-1"
        className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <AiOutlineCloseCircle
              className="text-4xl text-primary cursor-pointer float-right"
              onClick={HandleClose}
            />

            {/* Modal content */}
            <div className="p-7 md:p-8 text-center">
            <RiDeleteBin6Line className='mx-auto mb-4 text-red-600 w-24 h-24 bg-rose-200 dark:text-gray-200 border rounded-full p-5'/>
              <h2 className="mb-4 text-2xl font-bold text-black dark:text-gray-400">
                Are You Sure ?
              </h2>
              <h4 className="mb-4 text-base font-normal text-black dark:text-gray-400">
                Are You Sure You Want To Remove This Record ?
              </h4>
              <button
                onClick={HandleClose}
                type="button"
                className="text-black mr-3 border-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-full border text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmationDialog
