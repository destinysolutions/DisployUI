import React, { useState } from 'react'
import '../../Styles/Settings.css'
import { Controller, useForm } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import { isValidPhoneNumber } from 'react-phone-number-input'
import toast from 'react-hot-toast'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
const ScreenAuthorize = () => {
    const [phone, setPhone] = useState("")
    const {
        control,
        getValues,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const phoneNumber = watch("phone")
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
        </>
    )
}

export default ScreenAuthorize
