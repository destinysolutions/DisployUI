import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

const AddEditRetailer = ({
  heading,
  toggleModal,
  loading,
  formik,
  showPassword,
  setShowPassword,
  editId
}) => {
  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {heading} Retailer
              </h3>
              <AiOutlineCloseCircle
                className="text-4xl text-primary cursor-pointer"
                onClick={() => {
                  toggleModal();
                }}
              />
            </div>
            {/* Modal body */}
            <div className="p-6">
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-3 md:space-y-5"
              >
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-2 xs:gap-2">
                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      placeholder="Enter Company Name"
                      className="formInput"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.companyName}
                    />
                    {formik.errors.companyName &&
                      formik.touched.companyName && (
                        <div className="error">{formik.errors.companyName}</div>
                      )}
                  </div>
                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <input
                      type="text"
                      name="googleLocation"
                      id="googleLocation"
                      placeholder="Enter Your Google Location"
                      className="formInput"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.googleLocation}
                    />
                    {formik.errors.googleLocation &&
                      formik.touched.googleLocation && (
                        <div className="error">
                          {formik.errors.googleLocation}
                        </div>
                      )}
                  </div>

                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Enter Your First Name"
                      className="formInput"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                    />
                    {formik.errors.firstName && formik.touched.firstName && (
                      <div className="error">{formik.errors.firstName}</div>
                    )}
                  </div>
                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Enter Your Last Name"
                      className="formInput"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                    />
                    {formik.errors.lastName && formik.touched.lastName && (
                      <div className="error">{formik.errors.lastName}</div>
                    )}
                  </div>
                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <input
                      type="number"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Enter Phone Number"
                      className="formInput"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phoneNumber}
                      maxLength="12"
                    />
                    {formik.errors.phoneNumber &&
                      formik.touched.phoneNumber && (
                        <div className="error">{formik.errors.phoneNumber}</div>
                      )}
                  </div>

                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <input
                      type="email"
                      name="emailID"
                      id="emailID"
                      className="formInput"
                      placeholder="Enter Your Email Address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.emailID}
                      disabled={editId}
                    />
                    {formik.errors.emailID && formik.touched.emailID && (
                      <div className="error">{formik.errors.emailID}</div>
                    )}
                  </div>
                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter Your Password"
                        className="formInput"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        hidden={editId}
                      />
                      {!editId && (
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
                      )}
                    </div>
                    {formik.errors.password && formik.touched.password && (
                      <div className="error">{formik.errors.password}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="w-40 text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-full py-3.5 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
                    onClick={() => toggleModal()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-40 text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-full py-3.5 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditRetailer;
