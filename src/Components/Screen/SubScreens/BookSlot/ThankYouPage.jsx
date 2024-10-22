import React, { useState } from "react";
import logo from "../../../../images/DisployImg/Black-Logo2.png";
import { useEffect } from "react";
import { INFOMAIL, PHONENUMBERDISPLOY } from "../../../../Pages/Api";
import ThankYouIcon from "../../../../images/MenuIcons/Thank-you-icon.svg";

const ThankYouPage = ({ navigate, Name, bookslot, isCustomer }) => {

  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (bookslot) {
        setShow(true)
      } else if (isCustomer) {
        navigate("/current-booking")
      } else {
        navigate("/book-your-slot")
      }
    }, 5000);
  }, [])

  return (
    <>
      <div className="w-full h-full p-5 flex items-center justify-center">
        <div className="lg:w-[800px] md:w-[600px] w-full h-[60vh] bg-white lg:p-6 p-3 rounded-xl shadow-xl">
          <div className="w-full h-full">
            <div className={`flex items-center justify-center ${show ? "mb-8" : ""}`}>
              <img
                alt="Logo"
                src={logo}
                className="cursor-pointer duration-500 w-52"
              />
            </div>
            {!show && (
              <div className="flex flex-col gap-2 items-center justify-center h-full pb-10">
                <img
                  alt="Thank You"
                  src={ThankYouIcon}
                  className="w-24"
                />
                <div className="text-xl font-bold">Thank You!</div>
                <div>Your payment has been processed.</div>
                {/*<div>
                <button
                  className={`border-2 bg-black text-white border-primary px-8 py-2 rounded-full`}
                  onClick={() => window.location.href = "https://web.disploy.com/"}
                >
                  Login Now
                </button>
              </div>*/}
              </div>
            )}
            {show && (
              <div className="flex flex-col gap-3 items-center justify-center">
                <img
                  alt="Thank You"
                  src={ThankYouIcon}
                  className="w-24"
                />
                <div className="text-center text-md">
                  Dear {Name},
                </div>
                <div className="text-xl font-bold w-[600px] flex justify-center items-center ">
                  <div className="text-center">
                    Thank you for booking your streaming slot on DISPLOY. We appreciate your trust in us!
                  </div>
                </div>
                <div className="text-md w-[600px] flex justify-center items-center">
                  <div className="text-center">
                    Please check your email for instructions on tracking your streaming. Follow the steps provided to get started.
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                  <div>you can write us or call us for any support:</div>
                  <div>{INFOMAIL}</div>
                  <div>{PHONENUMBERDISPLOY}</div>
                </div>

                <div>
                  <button
                    className={`border-2 bg-black text-white border-primary px-8 py-2 rounded-full`}
                    onClick={() => window.location.href = "https://web.disploy.com/"}
                  >
                    Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;
