import React from "react";

const ThankYouPage = ({ navigate }) => {
  return (
    <>
      <div className="w-full h-full p-5 flex items-center justify-center">
        <div className="lg:w-[900px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
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
      </div>
    </>
  );
};

export default ThankYouPage;
