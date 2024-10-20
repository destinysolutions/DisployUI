import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useElements, useStripe, CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../../../images/DisployImg/Black-Logo2.png";

const AddPayment = ({
  selectedScreens,
  totalDuration,
  totalPrice,
  totalCost,
  handlebook,
  handleBack,
  selectedTimeZone,
  allTimeZone,
  page,
  setPage,
  Name,
  clientSecret,
  Isshow
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user, userDetails } = useSelector((state) => state.root.auth);
  const stripe = useStripe();
  const elements = useElements();
  const navigation = useNavigate()
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!elements) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, elements]);

  const paymentElementOptions = {
    layout: "tabs"
  }

  const handleSubmitPayment = async (event) => {

    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setErrorMessage(false)
    setIsLoading(true);
    try {
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: Name || "Advertiser", // Ensure name is sent
        },
      });

      if (paymentError) {
        console.error("Payment Method Error:", paymentError);
        toast.error(paymentError.message);
        setIsLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error("Confirm Payment Error:", confirmError);
        toast.error(confirmError.message);
        setIsLoading(false);
        return;
      }
      // Payment was successful
      if (paymentIntent.status === 'succeeded') {
        toast.success("Payment succeeded!");
        handlebook(paymentMethod)
      } else {
        toast.error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setIsLoading(false);
    }
    // }
  };

  return (
    <>
      <div className="icons flex items-center justify-center">
        {/*<div>
          <button
            className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
            onClick={() => handleBack()}
          >
            <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
          </button>
        </div>*/}
        {Isshow === "True" && (
          <div className="flex items-center justify-center">
            <img
              alt="Logo"
              src={logo}
              className="cursor-pointer duration-500 w-52"
            />
          </div>
        )}
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 ${Isshow === "True" ? "mt-5" : ""}`}>
        {/* <div className="md:col-span-2 lg:col-span-2 rounded-lg bg-white shadow-md p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 border-b border-black">
            <IoEarthSharp className="mb-2" />
            <div className="mb-2">
              {(allTimeZone.find(item => item.timeZoneID === selectedTimeZone))?.timeZoneName}
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
            <div className="lg:mx-8 md:mx-8 sm:mx-4 mx-2 text-base font-semibold">
              You will be automatically charged every month in advance based on
              your scheduled time slot.
            </div>
          </div>
        </div> */}
        <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-5">
          {/*<div className="text-3xl font-semibold">Payment Method</div>*/}
          {/*<div className="rounded-lg bg-white shadow-md p-5 flex flex-col gap-2">
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
              <div className="flex flex-col col-span-2 gap-2">
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
              <div className="flex flex-col col-span-2 gap-2">
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
                  </div>*/}

          {/* <div id="payment-form" className='Payment'>
         <CardElement id="payment-element" options={paymentElementOptions} />
            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type='button'>
              <span id="button-text">
                {isLoading ? <div className="spinner-payment" id="spinner"></div> : "Pay now"}
              </span>
            </button>
          </div>
                */}

          <div className="p-2">
            <label className="card-label">
              <div className="text-lg mb-2 font-medium">
                Card Number
              </div>

              <CardNumberElement
                className="card-input"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </label>
            <label className="card-label">
              <div className="text-lg mb-2 font-medium">
                Expiration Date
              </div>
              <CardExpiryElement
                className="card-input"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </label>
            <label className="card-label">
              <div className="text-lg mb-2 font-medium">
                CVC
              </div>
              <CardCvcElement
                className="card-input"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </label>
            {/*<div className="auto-pay">
              <input type="checkbox" className="auto-pay-checkbox" onChange={() => setAutoPay(!autoPay)} value={autoPay} />
              <label className="auto-pay-label">Auto Payment</label>
            </div>
            {errorMessage && (
              <div className='mb-2'>
                <label className="error-message">You need to Check Auto Pay for Further Process.</label>
              </div>
            )}*/}
            <div className="py-3">
              <hr />
            </div>
            <div className="flex justify-center items-center gap-4">
              <button
                className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                onClick={() => handleBack()}
              >
                Back
              </button>
              <button disabled={isLoading || !stripe || !elements} id="submit" onClick={handleSubmitPayment} type="button" className="pay-bookslot-button bg-orange-400 text-white hover:border-b-orange-600 px-8 rounded-full">
                <span id="button-text">
                  {isLoading ? <div className="spinner-payment-bookslot" id="spinner"></div> : "Pay"}
                </span>
              </button>

            </div>
          </div>

          {/* <div className="flex justify-end">
            <button
              className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
              onClick={() => handlebook()}
            >
              Schedule Event
            </button>
                </div>*/}
        </div>
      </div>
    </>
  );
};

export default AddPayment;
