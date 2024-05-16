import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { useDispatch } from 'react-redux';
import { handleTalkToSale } from '../../Redux/PaymentSlice';
import { useSelector } from 'react-redux';
import { TALK_TO_SALE } from '../../Pages/Api';

const TalkToSaleDialog = ({ setTalkToSale, TalkToSale }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    // password: false,
    phone: false,
    googleLocation: false,
    company: false
  })
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // password: "",
    phone: "",
    company: "",
    googleLocation: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the customerData state with the new value
    setCustomerData({
      ...customerData,
      [name]: value
    });
    // Clear error state for the field being edited
    setError({
      ...error,
      [name]: false
    });
  };

  const handleCreate = () => {

    const Params = {

    }
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${TALK_TO_SALE}}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
      data: JSON.stringify(Params)
    }
    dispatch(handleTalkToSale({ config }))
      .then((res) => {
        if (res?.payload?.status) {

        }
      })
      .catch((error) => console.log('error', error))
  }


  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
    >
      <div className="modal-overlay">
        <div className="modal w-full h-screen bg-neutral-950 flex items-center">
          <div className="mb-4 flex items-center justify-between p-4 bg-white absolute w-full top-0">
            <h3 className="text-xl font-semibold text-gray-900">
              Talk to Sales
            </h3>
            <AiOutlineCloseCircle
              className="text-4xl text-primary cursor-pointer"
              onClick={() => setTalkToSale(!TalkToSale)}
            />
          </div>
          <div class="container mx-auto p-5">
            <div class="w-full flex mb-4 gap-8 h-full">
              <div class="w-1/2 bg-gray-500 h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full">
                  <div className="flex flex-wrap p-6">
                    <div className="grid grid-cols-2 gap-2 my-2 w-full">
                      <div className='flex flex-col'>
                        <label
                          htmlFor="name"
                          className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="Enter Your First Name"
                          className="Talk-formInput"
                          value={customerData.firstName}
                          onChange={handleChange}
                        />
                        {error?.firstName && (
                          <span className="error">{error?.firstName}</span>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label
                          htmlFor="name"
                          className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Enter Your Last Name"
                          className="Talk-formInput"
                          value={customerData.lastName}
                          onChange={handleChange}
                        />
                        {error?.lastName && (
                          <span className="error">{error?.lastName}</span>
                        )}
                      </div>
                      <div className='flex flex-col col-span-2'>
                        <label
                          htmlFor="name"
                          className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter Your Email"
                          className="Talk-formInput"
                          value={customerData.email}
                          onChange={handleChange}
                        />
                        {error?.email && (
                          <span className="error">{error?.email}</span>
                        )}
                      </div>
                      <div className='flex flex-col col-span-2'>
                        <label
                          htmlFor="name"
                          className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="Enter Your Phone Number"
                          className="Talk-formInput"
                          value={customerData.phone}
                          onChange={handleChange}
                        />
                        {error?.phone && (
                          <span className="error">{error?.phone}</span>
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <label
                          htmlFor="name"
                          className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="company"
                          placeholder="Enter Your Company Name"
                          className="Talk-formInput"
                          value={customerData.company}
                          onChange={handleChange}
                        />
                        {error?.company && (
                          <span className="error">{error?.company}</span>
                        )}
                      </div>
                      <div className='flex flex-col mb-4'>
                        <label
                          htmlFor="name"
                          className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Google Location
                        </label>
                        <input
                          type="text"
                          name="googleLocation"
                          id="googleLocation"
                          placeholder="Enter Your Google Location"
                          className="Talk-formInput"
                          value={customerData.googleLocation}
                          onChange={handleChange}
                        />
                        {error?.googleLocation && (
                          <span className="error">{error?.googleLocation}</span>
                        )}
                      </div>

                      {/* <div className='flex flex-col mb-4 col-span-2'>
                        <label
                          htmlFor="name"
                          className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter Your Password"
                            className="Talk-formInput"
                            value={customerData.password}
                            onChange={handleChange}
                          />
                          <div className="icon">
                            {showPassword ? (
                              <BsFillEyeFill
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            ) : (
                              <BsFillEyeSlashFill
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            )}
                          </div>
                        </div>
                        {error?.password && (
                          <span className="error">{error?.password}</span>
                        )}
                        </div>*/}
                    </div>
                    <div className="w-full h-full">
                      <div className="flex justify-end pt-2 h-full items-end">
                        <button
                          className="sm:ml-2 xs:ml-1 flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-3 md:px-6 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                          onClick={() => handleCreate()}
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-1/2 h-full">
                <div className='w-full'>
                  <h2 className='text-3xl font-bold text-slate-100 mb-4'>Talk to Sales</h2>
                  <h4 className='text-xl text-slate-300 mb-4'>We’ll show you:</h4>
                  <ul class="p-0 m-0 text-slate-300 list-inside">
                    <li class="flex items-start mb-2">
                      <i class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                      </i>
                      How to remotely manage screens in multiple locations</li>
                    <li class="flex items-start mb-2"><i class="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                    </i>
                      Our powerful and intuitive content management system that only requires minimal training</li>
                    <li class="flex items-start mb-2">
                      <i class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                      </i>
                      How to show your business-critical information securely</li>
                    <li class="flex items-start mb-2">
                      <i class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                      </i>
                      How to take over and cast to screens with live broadcasts</li>
                    <li class="flex items-start mb-2">
                      <i class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                      </i>
                      Best practices from your industry</li>
                    <li class="flex items-start mb-2">
                      <i class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                      </i>
                      The most suitable and affordable hardware options for your screen network</li>
                    <li class="flex items-start mb-2">
                      <i class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
                      </i>
                      How to create a business case demonstrating digital signage ROI for your organizationy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TalkToSaleDialog