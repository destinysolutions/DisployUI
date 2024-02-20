import React from 'react'

const ThankYouPage = ({navigate}) => {
  return (
<>
<div className="rounded-lg shadow-md bg-white p-5">
            <div className="flex flex-col gap-2 items-center">
            <div className="text-7xl">Thank You</div>
            <div className="text-xl">For Getting In Touch With Us</div>
            <div>
              <button
                className={`border-2 bg-black text-white border-primary px-8 py-2 rounded-full`}
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
            </div>
          </div>
</>
  )
}

export default ThankYouPage