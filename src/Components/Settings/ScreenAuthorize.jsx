import React, { useRef, useState } from 'react'
import '../../Styles/Settings.css'
import { Controller, useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import { isValidPhoneNumber } from 'react-phone-number-input'
import toast from 'react-hot-toast'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import VerifyPhoneNumber from './VerifyPhoneNumber'
import { useSelector } from 'react-redux'
import { OTP_VERIFY } from '../../Pages/Api'
import axios from 'axios'
const ScreenAuthorize = () => {
    const [openModel, setOpenModel] = useState(false)
    const {
        control,
        getValues,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const phoneNumber = watch("phone")

    const { token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [errorMessge, setErrorMessge] = useState(false);
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    const completeOtp = otpValues.join("");
    const onSubmit = (data) => {
        // Handle form submission here
        console.log(data);
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
        setOpenModel(true)
    };

    const toggleModal = () => {
        setOpenModel(!openModel)
    }
    const handleOtpChange = (index, value) => {
        const updatedOtpValues = [...otpValues];
        updatedOtpValues[index] = value;
        setOtpValues(updatedOtpValues);
        if (value.length === 1 && index < otpRefs.length - 1) {
            otpRefs[index + 1].current.focus();
        }
    };

    const verifyOTP = () => {
        let data = JSON.stringify({ otp: completeOtp });

        let config = {
            method: "post",
            url: OTP_VERIFY,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
            data,
        };

        toast.loading("Validating....");
        axios
            .request(config)
            .then((response) => {
                // console.log(response);
                if (response.data.status === 200) {
                    toast.remove();
                    setOpenModel(!openModel)
                } else {
                    setErrorMessge(response.data.message);
                    toast.remove();
                    setOpenModel(!openModel)
                }
            })
            .catch((error) => {
                console.log(error);
                setOpenModel(!openModel)
                toast.remove();
            });
    };

    return (
        <>
            <div className="screen-authorize-section text-center">

                <h1 className='lg:text-base md:text-base sm:text-sm xs:text-sm text-primary font-medium'>Enter Visible to Authorize the Screen Code </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex justify-center w-full'>
                        <div className="relative my-4">
                            <div className="w-96 px-3">
                                <label className="label_top_authorize text-xs z-10">Phone Number</label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            isValidPhoneNumber(value)
                                    }}
                                    render={({ field }) => (
                                        <PhoneInput
                                            country={'in'}
                                            onChange={(phoneNumber) =>
                                                field.onChange('+' + phoneNumber.toString())
                                            }
                                            value={field.value}
                                            autocompleteSearch={true}
                                            countryCodeEditable={false}
                                            enableSearch={true}
                                            inputStyle={{
                                                width: '100%',
                                                background: 'white',
                                                padding: '25px 0 25px 3rem',
                                                borderRadius: '10px',
                                                fontSize: '1rem',
                                                border: '1px solid #000',
                                            }}
                                            dropdownStyle={{
                                                color: '#000',
                                                fontWeight: '600',
                                                padding: '0px 0px 0px 10px',
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
                            disabled={!phoneNumber}
                            className="hover:bg-white cursor-pointer hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
                        >
                            Verify
                        </button>
                    </div>
                </form>
            </div>
            {openModel && <VerifyPhoneNumber toggleModal={toggleModal} otpValues={otpValues} handleOtpChange={handleOtpChange} otpRefs={otpRefs} verifyOTP={verifyOTP} errorMessge={errorMessge}/>}
        </>
    )
}

export default ScreenAuthorize
