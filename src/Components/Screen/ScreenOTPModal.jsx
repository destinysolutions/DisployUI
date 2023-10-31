import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { OTP_VERIFY } from "../../Pages/Api";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ScreenOTPModal = ({ setShowOTPModal }) => {
  const history = useNavigate();
  const [errorMessge, setErrorMessge] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const UserData = useSelector((Alldata) => Alldata.user);
  const handleOtpChange = (index, value) => {
    const updatedOtpValues = [...otpValues];
    updatedOtpValues[index] = value;
    setOtpValues(updatedOtpValues);
    if (value.length === 1 && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  const completeOtp = otpValues.join("");

  const verifyOTP = () => {
    let data = JSON.stringify({
      otp: completeOtp,
      userID: UserData.user?.userID,
    });

    let config = {
      method: "post",
      url: OTP_VERIFY,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response);
        if (response.data.status === 200) {
          history("/newscreendetail", {
            state: {
              otpData: response.data.data,
              message: response.data.message,
            },
          });
        } else {
          setErrorMessge(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
        <div className="relative w-auto my-6 lg:mx-auto md:mx-auto lg:max-w-5xl md:max-w-3xl sm:max-w-xl xs:w-full sm:mx-3 xs:mx-3">
          <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7] border-slate-200 rounded-t">
              <h3 className="text-xl font-medium">New Screen</h3>
              <button
                className="p-1 text-xl"
                onClick={() => setShowOTPModal(false)}
              >
                <AiOutlineCloseCircle className="text-3xl text-primary" />
              </button>
            </div>
            <div className="relative lg:p-5 md:p-5 sm:p-3 xs:p-2 flex-auto">
              <div className="flex items-center justify-center mb-4">
                <img src="/DisployImg/BlackLogo.svg" />
              </div>

              <div className="flex w-7/12 mx-auto items-center justify-center relative mb-4">
                <img src="/ScreenImg/disploy-tv-img.png" alt="" />
              </div>

              <div className="mx-auto">
                <div className="w-full">
                  <div className="font-normal lg:text-lg md:text-lg sm:text-base xs:text-sm text-[#000000] text-center">
                    Enter the 6-character pairing code?
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
                            handleOtpChange(index, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center text-center text-red text-xl mt-2 font-semibold">
                    {errorMessge}
                  </div>
                  <div className="flex justify-center text-center my-2">
                    <input type="checkbox" />
                    <p className="ml-2 text-[#515151] text-sm">
                      Start screen in Preview Mode
                    </p>
                  </div>
                  <div className="flex justify-center text-center">
                    <p className="text-[#515151] text-sm max-w-lg">
                      To get pair code, please install Disploy app on your
                      Players (Android, LG, Samsung, FireStick, Raspberry Pi,
                      etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center pb-4">
              <button
                className="text-white bg-SlateBlue hover:bg-primary font-semibold   lg:px-8 md:px-6 sm:px-6 xs:px-6 lg:py-3 md:py-2 sm:py-2 xs:py-2 lg:text-base md:text-sm sm:text-sm xs:text-sm rounded-[45px]"
                type="button"
                onClick={verifyOTP}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ScreenOTPModal;
