import React, { useRef, useState } from "react";
import "../../Styles/Settings.css";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { isValidPhoneNumber } from "react-phone-number-input";
import toast from "react-hot-toast";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import VerifyPhoneNumber from "./VerifyPhoneNumber";
import { useSelector } from "react-redux";
import {
  OTP_VERIFY,
  PHONENUMBERVERIFY,
  PHONE_OTP_VERIFY,
} from "../../Pages/Api";
import axios from "axios";
import {
  handleOTPverify,
  handlePhoneNumberverify,
} from "../../Redux/SettingUserSlice";
import { useDispatch } from "react-redux";
const ScreenAuthorize = () => {
  const [openModel, setOpenModel] = useState(false);
  const { user, token } = useSelector((state) => state.root.auth);
  const {
    control,
    getValues,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: user?.authNumber,
    },
  });
  const phoneNumber = watch("phone");
  const dispatch = useDispatch();
  const authToken = `Bearer ${token}`;
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [errorMessge, setErrorMessge] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const completeOtp = otpValues.join("");
  const onSubmit = (data) => {
    // Handle form submission here
    const { phone } = data;
    if (!isPossiblePhoneNumber(phone) || !isValidPhoneNumber(phone)) {
      toast.remove();
      toast.error("phone is invalid");
      return true;
    } else if (
      (getValues("phone") !== "" && !isPossiblePhoneNumber(phone)) ||
      !isValidPhoneNumber(phone)
    ) {
      toast.remove();
      toast.error("phone is invalid");
      return true;
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${PHONENUMBERVERIFY}?PhoneNumber=${phoneNumber}&OrgID=${user?.organizationId}`,
      headers: {
        Authorization: authToken,
      },
      data: data,
    };
    toast.loading("Verifying....");
    dispatch(handlePhoneNumberverify({ config }))
      .then((res) => {
        if (res?.payload?.status === true) {
          toast.remove();
          setOpenModel(true);
        }
      })
      .catch((error) => {
        toast.remove();
        console.log("error", error);
      });
  };

  const toggleModal = () => {
    setOpenModel(!openModel);
    setErrorMessge(false)
  };
  const handleOtpChange = (index, value) => {
    const updatedOtpValues = [...otpValues];
    updatedOtpValues[index] = value;
    setOtpValues(updatedOtpValues);
    if (value.length === 1 && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  const verifyOTP = () => {
    if (completeOtp?.length === 6) {
      let config = {
        method: "get",
        url: `${PHONE_OTP_VERIFY}?OTP=${completeOtp}&OrgID=${user?.organizationId}&PhoneNumber=${phoneNumber}`,
        headers: {
          Authorization: authToken,
        },
      };

      toast.loading("Validating....");
      dispatch(handleOTPverify({ config }))
        .then((response) => {
          if (response?.payload?.status === true) {
            toast.remove();
            toast.success(response?.payload?.message);
            setOtpValues(["", "", "", "", "", ""]);
            setOpenModel(!openModel);
            setErrorMessge(false)
          } else {
            setErrorMessge(response?.data?.message);
            toast.remove();
            setOpenModel(!openModel);
          }
        })
        .catch((error) => {
          console.log(error);
          setOpenModel(!openModel);
          toast.remove();
        });
    } else {
      setErrorMessge("please enter valid otp");
    }
  };

  return (
    <>
      <div className="screen-authorize-section text-center flex flex-col justify-center items-center lg:p-5 md:p-5 sm:p-2 xs:p-2">
        <h1 className="lg:text-base md:text-base sm:text-sm xs:text-sm text-primary font-medium">
          Enter Visible to Authorize the Screen Code{" "}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center w-full">
            <div className="relative my-4">
              <div className="w-96 px-3">
                <label className="label_top_authorize text-xs z-10">
                  Phone Number
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => isValidPhoneNumber(value),
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      country={"in"}
                      onChange={(phoneNumber) =>
                        field.onChange("+" + phoneNumber.toString())
                      }
                      value={field.value}
                      autocompleteSearch={true}
                      countryCodeEditable={false}
                      enableSearch={true}
                      inputStyle={{
                        width: "100%",
                        background: "white",
                        padding: "25px 0 25px 3rem",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        border: "1px solid #000",
                      }}
                      dropdownStyle={{
                        color: "#000",
                        fontWeight: "600",
                        padding: "0px 0px 0px 10px",
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 text-center">
            <button
              type="submit"
              disabled={!phoneNumber || user?.authNumber === phoneNumber}
              className="hover:bg-white cursor-pointer hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
      {openModel && (
        <VerifyPhoneNumber
          toggleModal={toggleModal}
          otpValues={otpValues}
          handleOtpChange={handleOtpChange}
          otpRefs={otpRefs}
          verifyOTP={verifyOTP}
          errorMessge={errorMessge}
        />
      )}
    </>
  );
};

export default ScreenAuthorize;
