import React from "react";
import { FaRegClock, FaRegQuestionCircle } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { IoEarthSharp } from "react-icons/io5";
import { secondsToHMS } from "../../../Common/Common";
import { MdArrowBackIosNew } from "react-icons/md";
import { useForm } from "react-hook-form";

const AddPayment = ({
  selectedScreens,
  totalDuration,
  totalPrice,
  totalCost,
  handlebook,
  handleBack,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <>
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
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 mt-5">
        <div className="md:col-span-2 lg:col-span-2 rounded-lg bg-white shadow-md p-5 flex flex-col gap-2">
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
            <span>List of Screen</span>
          </div>
          {selectedScreens?.map((item, index) => (
            <div className="pl-7" key={index}>
              {item?.label}
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <span className="flex items-center">
              <FaRegClock />
            </span>
            <div>{secondsToHMS(totalDuration)}</div>
          </div>
          <div>Reach</div>
          <div className="text-base">{selectedScreens?.length} Screens</div>
          <div className="border-t border-black flex flex-col gap-2">
            <div className="flex justify-between mt-4">
              <div>Cost:</div>
              <div>${totalPrice} Per Sec</div>
            </div>
            <div className="flex justify-between">
              <div>Total Schedule Time:</div>
              <div>{totalDuration} Sec</div>
            </div>
            <div className="flex justify-between">
              <div>Total Cost:</div>
              <div>${totalCost}</div>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <div className="lg:mx-12 md:mx-8 sm:mx-4 mx-2 text-xl font-semibold">
              You will be automatically charged every month in advance based on
              your scheduled time slot.
            </div>
          </div>
        </div>
        <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-5">
          <div className="text-3xl font-semibold">Payment Method</div>
          <div className="rounded-lg bg-white shadow-md p-5 flex flex-col gap-2">
            <div className="text-xl font-semibold">Card Details</div>
            <div>Name on card</div>
            <div className="relative w-full">
              <input
                type="text"
                name="Name"
                id="Name"
                placeholder="Enter Card Name"
                className="formInput"
                {...register("Name", {
                  required: "Name is required",
                })}
              />
              {errors.Name && (
                <p className="text-red-500">{errors.Name.message}</p>
              )}
            </div>
            <div>Card Number</div>
            <div className="relative w-full">
              <input
                type="text"
                name="cardNumber"
                id="cardNumber"
                placeholder="Enter Card Number"
                className="formInput"
                {...register("cardNumber", {
                  required: "Card Number is required",
                  pattern: {
                    value: /^\d{16}$/,
                    message: "Invalid Card Number",
                  },
                })}
              />
              {errors.cardNumber && (
                <p className="text-red-500">{errors.cardNumber.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <div>Expiration</div>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="Expiration"
                    id="Expiration"
                    placeholder="mm / yyyy"
                    className="formInput"
                    {...register("Expiration", {
                      required: "Expiration Date is required",
                      pattern: {
                        value: /^(0[1-9]|1[0-2]) \/ \d{4}$/,
                        message: "Invalid Expiration Date",
                      },
                    })}
                  />
                  {errors.Expiration && (
                    <p className="text-red-500">{errors.Expiration.message}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  CVV <FaRegQuestionCircle />
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="CVV"
                    id="CVV"
                    placeholder="Enter Cvv Number"
                    className="formInput"
                    {...register("CVV", {
                      required: "CVV is required",
                      pattern: {
                        value: /^\d{3}$/,
                        message: "Invalid CVV",
                      },
                    })}
                  />
                  {errors.CVV && (
                    <p className="text-red-500">{errors.CVV.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <button
                className={`border-2 bg-black text-white border-primary px-8 py-2 rounded-full`}
              >
                Pay
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
              onClick={() => handlebook()}
            >
              Schedule Event
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPayment;
