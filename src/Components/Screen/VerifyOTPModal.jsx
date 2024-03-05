import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const VerifyOTPModal = ({ toggleModal, otpValues, handleOtpChange, otpRefs, verifyOTP, errorMessge }) => {
  return (
   <>
   <div
   id="default-modal"
   tabIndex="-1"
   aria-hidden="true"
   className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
>
   <div className="relative p-4 w-full max-w-3xl max-h-full">
       {/* Modal content */}
       <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
           {/* Modal header */}
           <div className="flex items-center justify-end p-3 md:p-4 rounded-t border-b dark:border-gray-600">
               <AiOutlineCloseCircle
                   className="text-4xl text-primary cursor-pointer"
                   onClick={() => {
                       toggleModal();
                   }}
               />
           </div>

           <div className='p-3'>
               <div className="font-normal lg:text-lg md:text-lg sm:text-base xs:text-sm text-[#000000] text-center">
                   Enter the Verification Code to Validate New Screen
               </div>
               <div
                   id="otp"
                   className="flex flex-row justify-center text-center px-2"
               >
                   {otpValues.map((value, index) => (
                       <div key={index}>
                           <input
                               ref={otpRefs[index]}
                               className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded border-gray"
                               type="text"
                               value={value}
                               maxLength="1"
                               onChange={(e) =>
                                   handleOtpChange(
                                       index,
                                       e.target.value.toLocaleUpperCase()
                                   )
                               }
                           />
                       </div>
                   ))}
               </div>
               <div className="flex justify-center text-center text-red text-xl my-2 font-semibold">
                   {errorMessge}
               </div>
           </div>
           <div className="flex items-center justify-center pb-4">
               <button
                   className="text-white bg-SlateBlue hover:bg-primary font-semibold lg:px-8 md:px-6 sm:px-6 xs:px-6 lg:py-3 md:py-2 sm:py-2 xs:py-2 lg:text-base md:text-sm sm:text-sm xs:text-sm rounded-[45px]"
                   type="button"
                   onClick={verifyOTP}
               >
                   Verify
               </button>
           </div>
       </div>
   </div>
</div>

   </>
  )
}

export default VerifyOTPModal
