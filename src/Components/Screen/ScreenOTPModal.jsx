import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";

const ScreenOTPModal = ({ setShowOTPModal }) => {
  return (
    <>
      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 lg:mx-auto md:mx-auto lg:max-w-xl md:max-w-xl sm:max-w-lg xs:w-full  sm:mx-3 xs:mx-3">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7] border-slate-200 rounded-t">
              <h3 className="text-xl font-medium">New Screen</h3>
              <button
                className="p-1 text-xl"
                onClick={() => setShowOTPModal(false)}
              >
                <AiOutlineCloseCircle className="text-3xl text-primary" />
              </button>
            </div>

            <div className="relative lg:p-10 md:p-10 sm:p-5 xs:p-3 flex-auto">
              <div className="flex items-center justify-center mb-4">
                <img src="/DisployImg/BlackLogo.svg" />
              </div>

              <div className="bg-white rounded-[20px] newscreenpopup  lg:p-5 md:p-5 sm:p-5 xs:p-2 xs:py-5">
                <div className="container mx-auto">
                  <div className="max-w-sm mx-auto md:max-w-lg">
                    <div className="w-full">
                      <div className="bg-white   rounded text-center">
                        <div className="flex flex-col">
                          <div className="font-normal lg:text-lg md:text-lg sm:text-base xs:text-sm text-[#000000]">
                            Enter the 6-character pairing code?
                          </div>
                        </div>

                        <div
                          id="otp"
                          className="flex flex-row justify-center text-center px-2 mt-5"
                        >
                          <input
                            className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded"
                            type="text"
                            id="first"
                            maxLength="1"
                          />
                          <input
                            className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded"
                            type="text"
                            id="second"
                            maxLength="1"
                          />
                          <input
                            className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded"
                            type="text"
                            id="third"
                            maxLength="1"
                          />
                          <input
                            className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded"
                            type="text"
                            id="fourth"
                            maxLength="1"
                          />
                          <input
                            className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded"
                            type="text"
                            id="fifth"
                            maxLength="1"
                          />
                          <input
                            className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded"
                            type="text"
                            id="sixth"
                            maxLength="1"
                          />
                        </div>

                        <div className="flex justify-center text-center mt-5">
                          <input type="checkbox" />
                          <p className="ml-2 text-[#515151] lg:text-[13px] md:text-[13px] sm:text-[12px] xs:text-[12px] ">
                            Start screen in Preview Mode
                          </p>
                        </div>
                        <div className="flex justify-center text-center lg:mt-5 md:mt-5 sm:mt-3  xs:mt-3">
                          <p className="text-[#515151] text-[12px] max-w-[400px]">
                            To get pair code, please install Disploy app on your
                            Players (Android, LG, Samsung, FireStick, Raspberry
                            Pi, etc.)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center pb-7">
              <Link to="/newscreendetail">
                <button
                  className="text-white bg-[#00072E] font-semibold   lg:px-8 md:px-6 sm:px-6 xs:px-6 lg:py-3 md:py-2 sm:py-2 xs:py-2 lg:text-lg md:text-sm sm:text-sm xs:text-sm rounded-[45px]"
                  type="button"
                //onClick={() => setShowOTPVerifyModal(true)}
                >
                  Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      {/* {showOTPVerifyModal ? (
                  <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 fixed inset-0 z-50 outline-none focus:outline-none">
                      <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="border-0 rounded-[20px] shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-5">
                          <div className="relative">
                            <div className="text-lg font-normal  text-center text-md relative">
                              Enter the Verification Code <br />
                              to Validate New Screen.
                            </div>
                            <button
                              className="text-2xl absolute  top-[-9px] right-[-12px]"
                              onClick={() => setShowOTPVerifyModal(false)}
                            >
                              <AiOutlineCloseCircle />
                            </button>
                          </div>

                          <div
                            id="otp"
                            className="flex flex-row justify-center text-center px-2 mt-4 opacity-10"
                          >
                            <input
                              className="m-2 border h-8 w-8 text-center form-control rounded"
                              type="text"
                              id="first"
                              maxLength="1"
                            />
                            <input
                              className="m-2 border h-8 w-8 text-center form-control rounded"
                              type="text"
                              id="second"
                              maxLength="1"
                            />
                            <input
                              className="m-2 border h-8 w-8 text-center form-control rounded"
                              type="text"
                              id="third"
                              maxLength="1"
                            />
                            <input
                              className="m-2 border h-8 w-8 text-center form-control rounded"
                              type="text"
                              id="fourth"
                              maxLength="1"
                            />
                            <input
                              className="m-2 border h-8 w-8 text-center form-control rounded"
                              type="text"
                              id="fifth"
                              maxLength="1"
                            />
                            <input
                              className="m-2 border h-8 w-8 text-center form-control rounded"
                              type="text"
                              id="sixth"
                              maxLength="1"
                            />
                          </div>

                          <div className="flex items-center justify-center mt-5">
                            <button
                              className="text-white bg-[#00072E] font-semibold  px-8 py-2 text-sm rounded-[45px]"
                              type="button"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </>
                ) : null} */}
    </>
  );
};

export default ScreenOTPModal;
