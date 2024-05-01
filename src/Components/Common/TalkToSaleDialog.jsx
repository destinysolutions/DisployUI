import React, { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { useDispatch } from 'react-redux';

const TalkToSaleDialog = ({ setTalkToSale, TalkToSale }) => {
  const dispatch = useDispatch();
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


  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
    >
      <div className="modal-overlay">
        <div className="modal p-4 lg:w-[700px] md:w-[700px] sm:w-full max-h-full">
          <div className="relative w-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full">
              {/* Modal header */}
              <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t border-gray-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Talk to Sales
                </h3>
                <AiOutlineCloseCircle
                  className="text-4xl text-primary cursor-pointer"
                  onClick={() => setTalkToSale(!TalkToSale)}
                />
              </div>
              <div className="flex flex-wrap p-6">
                <div className="grid grid-cols-2 gap-2 my-2 border-b border-gray w-full">
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
                      className="formInput"
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
                      className="formInput"
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
                      className="formInput"
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
                      className="formInput"
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
                      className="formInput"
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
                      className="formInput"
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
                        className="formInput"
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
                      // onClick={() => handleCreate()}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
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
