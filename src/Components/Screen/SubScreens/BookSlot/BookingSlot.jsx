import React, { useState } from "react";
import { FaPlusCircle, FaRegClock, FaRegQuestionCircle } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { IoEarthSharp } from "react-icons/io5";
import { MdArrowBackIosNew, MdCloudUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { buttons } from "../../../Common/Common";
import { useForm } from "react-hook-form";

const BookingSlot = () => {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedDays, setSelectedDays] = useState(
    new Array(buttons.length).fill(false)
  );
  const [addGuest, SetAddGuest] = useState(false);

  const handleNext = () => {
    setPage(page + 1);
  };

  const handleBack = () => {
    if (page === 1) {
      navigate(-1);
    } else {
      setPage(page - 1);
    }
  };
  return (
    <>
      <div className="w-full h-full p-5">
        <div className="grid grid-cols-8 gap-4 rounded-lg bg-white p-5">
          <div className={`${page === 1 ? "col-span-4" : "col-span-2"}`}>
            <div className="icons flex items-center">
              <div>
                <button
                  className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                  onClick={() => handleBack()}
                >
                  <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                </button>
              </div>
            </div>
            <div className="rounded-lg bg-white p-5 flex flex-col gap-2 ">
              <div className="flex items-center gap-2 border-b border-black">
                <IoEarthSharp className="mb-2" />
                <div className="mb-2">
                  {new Date()
                    .toLocaleDateString(undefined, {
                      day: "2-digit",
                      timeZoneName: "long",
                    })
                    .substring(4)}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="flex items-center ">
                  <FiMapPin className="w-5 h-5 text-black " />
                </span>
                <div>Navrangpura, Ahmedabad, Gujarat, India</div>
              </div>
              <div className="pl-7">CG Road Screen 1</div>
              <div className="pl-7">CG Road Screen 2</div>
              <div className="flex gap-2 items-center">
                <span className="flex items-center">
                  <FiMapPin className="w-5 h-5 text-black " />
                </span>
                <div>Chicago, New Chicago, New York, USA</div>
              </div>
              <div className="pl-7">CG Road Screen 1</div>
              <div className="pl-7">CG Road Screen 2</div>
              <div className="flex gap-2 items-center">
                <span className="flex items-center">
                  <FaRegClock />
                </span>
                <div>00:00:00</div>
              </div>
              <div>Reach</div>
              <div className="text-base">17 Screens</div>
              {(page === 2 || page === 3) && (
                <div className="border-t border-black flex flex-col gap-2">
                  <div className="flex justify-between mt-4">
                    <div>Cost:</div>
                    <div>$0.2 Per Sec</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Total Schedule Time:</div>
                    <div>6 Sec</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Total Cost:</div>
                    <div>$12</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className={`${page === 1 || page === 2 ? "col-span-4" : "hidden"}`}
          >
            <div className="text-2xl font-semibold">Select a Date & Time</div>
            <div className="rounded-lg bg-white p-5">
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  datepicker
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date"
                />
              </div>
              <div>
                <input
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date"
                />
              </div>
              <div>
                <div>TimeZone</div>
                <div className="flex items-center gap-2">
                  <IoEarthSharp />
                  <div>
                    {new Date()
                      .toLocaleDateString(undefined, {
                        day: "2-digit",
                        timeZoneName: "long",
                      })
                      .substring(4)}
                  </div>
                </div>
              </div>
              {page === 1 && (
                <div className="flex justify-center">
                  <button
                    className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    onClick={() => handleNext()}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={`${page !== 2 ? "hidden" : "col-span-2"}`}>
            <div className="rounded-lg bg-white p-5 flex flex-col gap-2 h-full">
              <div className="flex items-center gap-2">Thursday, August 15</div>
              <div className="flex gap-2 items-center">
                <div>
                  <div>Start Date</div>
                  <div>
                    <input type="date" />
                  </div>
                </div>
                <div>
                  <div>End Date</div>
                  <div>
                    <input type="date" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div>Start Time</div>
                <div>End Time</div>
              </div>
              <div className="flex gap-2 items-center">
                <input type="time" />
                <input type="time" />
                <MdCloudUpload />
                <FaPlusCircle />
              </div>
              <div>Repeat 9 Days</div>
              <div className="flex gap-3 items-center">
                <input type="checkbox" />
                <div>Repeat for All Day</div>
              </div>
              <div>
                {buttons.map((label, index) => (
                  <button
                    className={`border border-primary px-3 py-1 mr-2 mt-3 rounded-full ${
                      selectedDays[index] && "bg-SlateBlue border-white"
                    } 
                                `}
                    key={index}
                    // onClick={() => handleDayButtonClick(index, label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="w-full h-full flex place-items-end">
                <div className="border-t mt-2 border-black w-full">
                  <div className="mt-4">Total Cost: $ 12</div>
                  <div className="flex justify-end">
                    <button
                      className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                      onClick={() => handleNext()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${page === 3 ? "col-span-6" : "hidden"}`}>
            <div className="rounded-lg bg-white p-5">
              <div className="text-2xl font-semibold">Select a Date & Time</div>
              <div className="rounded-lg bg-white p-5">
                <div>Enter Details</div>
                <div>Name *</div>
                <div className="relative w-full">
                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter Your Name"
                    className="formInput mb-3"
                  />
                  {errors.name && (
                    <span className="error">{errors.name.message}</span>
                  )}
                </div>
                <div>Email *</div>
                <div className="relative w-full">
                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Your Email"
                    className="formInput mb-3"
                  />
                  {errors.email && (
                    <span className="error">{errors.email.message}</span>
                  )}
                </div>
                {!addGuest && (
                  <div>
                    <button
                      className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
                      onClick={() => SetAddGuest(true)}
                    >
                      Add Guests
                    </button>
                  </div>
                )}
                {addGuest && (
                  <div>
                    <div>Guest Email(s)</div>
                    <div className="relative w-full">
                      <input
                        {...register("guestEmail")}
                        name="guestEmail"
                        id="guestEmail"
                        type="text"
                        placeholder="Enter Your Guest Emails"
                        className="formInput mb-3"
                      />
                    </div>
                  </div>
                )}
                <div>
                  Please share anything that will help prepare for our meeting.
                </div>
                <div className="relative w-full">
                  <input
                    {...register("details")}
                    type="text"
                    className="formInput mb-3"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                    onClick={() => handleNext()}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={`${page === 4 ? "col-span-6" : "hidden"}`}>
            <div className="rounded-lg bg-white p-5">
              <div className="text-2xl font-semibold">Payment Method</div>
              <div>Card Details</div>
              <div>Name on card</div>
              <div className="relative w-full">
                <input
                  type="text"
                  name="Email"
                  id="Email"
                  placeholder="Enter Card Name"
                  className="formInput mb-3"
                />
              </div>
              <div>Card Number</div>
              <div className="relative w-full">
                <input
                  type="text"
                  name="Email"
                  id="Email"
                  placeholder="Enter Card Number"
                  className="formInput mb-3"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <div>Expiration</div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="Email"
                      id="Email"
                      placeholder="mm / yyyy"
                      className="formInput mb-3"
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    CVV <FaRegQuestionCircle />
                  </div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="Email"
                      id="Email"
                      placeholder="Enter Cvv Number"
                      className="formInput mb-3"
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  className={`border-2 bg-black text-white border-primary px-8 py-2 rounded-full`}
                  onClick={() => SetAddGuest(true)}
                >
                  Pay
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
                onClick={() => handleNext()}
              >
                Schedule Event
              </button>
            </div>
          </div>
          <div className={`${page === 5 ? "col-span-6" : "hidden"}`}>
            <div className="rounded-lg bg-white p-5">
              <div>Thank You</div>
              <div>For Getting In Touch With Us</div>
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
      </div>
    </>
  );
};

export default BookingSlot;
