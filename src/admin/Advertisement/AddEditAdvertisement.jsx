import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaPlusCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import PhoneInput from 'react-phone-input-2';
const AddEditAdvertisement = ({
  heading,
  toggleModal,
  formik,
  loading,
  hiddenFileInput,
  handleFileChange
}) => {

  const [inputs, setInputs] = useState(['']);

  const addInput = () => {
    setInputs([...inputs, '']);
  };

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
    const googleLocations = newInputs.filter(Boolean).join(' | '); // Filter out empty values and join with commas
    formik.setFieldValue(`googleLocation`, googleLocations);
  };

  const removeInput = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
    const googleLocations = newInputs.filter(Boolean).join(' | '); // Filter out empty values and join with commas
    formik.setFieldValue(`googleLocation`, googleLocations);
  };

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  const handlePhoneChange = value => {
    formik.setFieldValue('PhoneNumber', '+' + value); // Update the phoneNumber value with the correct format
  };

  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="modal-overlay">
          <div className="modal">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {heading} Advertisement
                  </h3>
                  <AiOutlineCloseCircle
                    className="text-4xl text-primary cursor-pointer"
                    onClick={() => { toggleModal() }}
                  />
                </div>
                {/* Modal body */}
                <div className="p-4">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="space-y-3 md:space-y-5"
                  >
                    <div className='max-h-96 vertical-scroll-inner p-3'>
                      <div className="flex flex-col mb-4 relative">
                        <input
                          type="text"
                          name="Name"
                          id="Name"
                          placeholder="Enter Name"
                          className="formInput"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.Name}
                        />
                        {formik.errors.Name &&
                          formik.touched.Name && (
                            <div className="error">{formik.errors.Name}</div>
                          )}
                      </div>


                      <div className='flex flex-col relative'>
                        {inputs.map((input, index) => (
                          <div className="relative flex flex-row items-center gap-3 mb-4" key={index}>
                            <input
                              type="text"
                              name={`googleLocation${index}`}
                              id={`googleLocation${index}`}
                              placeholder="Enter Your Google Location"
                              className="formInput"
                              value={input}
                              onChange={(event) => handleInputChange(index, event)}
                            />
                            {formik.errors.googleLocation && formik.touched.googleLocation && (
                              <div className="error">
                                {formik.errors.googleLocation}
                              </div>
                            )}
                            {index > 0 && (
                              <IoClose className='cursor-pointer mr-3 text-xl' onClick={() => removeInput(index)} />
                            )}
                          </div>
                        ))}
                        <span className='absolute right-5 top-5'><FaPlusCircle className='cursor-pointer' onClick={addInput} /></span>
                      </div>



                      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-2 xs:gap-2">
                        <div className="relative full">
                          <input
                            type="text"
                            name="Email"
                            id="Email"
                            placeholder="Enter Email"
                            className="formInput"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.Email}
                          />
                          {formik.errors.Email &&
                            formik.touched.Email && (
                              <div className="error">{formik.errors.Email}</div>
                            )}
                        </div>
                        <div className="relative full">
                          <PhoneInput
                            country={"in"}
                            onChange={handlePhoneChange}
                            value={formik.values.PhoneNumber.replace('+', '')} // Remove the '+' for the PhoneInput
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
                          {formik.errors.PhoneNumber &&
                            formik.touched.PhoneNumber && (
                              <div className="error">
                                {formik.errors.PhoneNumber}
                              </div>
                            )}
                        </div>
                        <div className='relative full'>
                          <span>TimeSlot</span>
                          <input
                            type="time"
                            name="startTime"
                            id="startTime"
                            placeholder="Start Time"
                            className="formInput"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.startTime}
                          />
                          {formik.errors.startTime && formik.touched.startTime && (
                            <div className="error">{formik.errors.startTime}</div>
                          )}

                        </div>
                        <div className='relative full pt-6'>
                          <input
                            type="time"
                            name="endTime"
                            id="endTime"
                            placeholder="End Time"
                            className="formInput"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.endTime}
                          />
                          {formik.errors.endTime && formik.touched.endTime && (
                            <div className="error">{formik.errors.endTime}</div>
                          )}
                        </div>
                        <div className='relative full'>
                          <span>Duration</span>
                          <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            placeholder="Start Date"
                            className="formInput"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.startDate}
                          />
                          {formik.errors.startDate && formik.touched.startDate && (
                            <div className="error">{formik.errors.startDate}</div>
                          )}

                        </div>
                        <div className='relative full pt-6'>
                          <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            placeholder="End Date"
                            className="formInput"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.endDate}
                          />
                          {formik.errors.endDate && formik.touched.endDate && (
                            <div className="error">{formik.errors.endDate}</div>
                          )}
                        </div>

                        <div className="relative full">
                          <input
                            type="Number"
                            name="Screen"
                            id="Screen"
                            placeholder="Required Number Screen"
                            className="formInput"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.Screen}
                          />
                          {formik.errors.Screen && formik.touched.Screen && (
                            <div className="error">{formik.errors.Screen}</div>
                          )}
                        </div>
                        <div className="relative w-full flex items-center justify-center">
                          <div className="flex">
                            <button
                              type='button'
                              className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3 "
                              onClick={handleClick}
                            >
                              Upload
                            </button>
                            <input
                              type="file"
                              id="upload-button"
                              accept="image/*, video/*"
                              style={{ display: "none" }}
                              ref={hiddenFileInput}
                              onChange={(e) => handleFileChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center px-4 pt-4 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                      <button
                        type="button"
                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        onClick={() => toggleModal()}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                      // disabled={loading}
                      >
                        {/* {loading ? "Saving" : "Save"} */}
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddEditAdvertisement
