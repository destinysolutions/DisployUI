import React, { useState } from 'react'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaPlusCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
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
                {heading} Advertisement
              </h3>
              <AiOutlineCloseCircle
                className="text-4xl text-primary cursor-pointer"
                onClick={() => {toggleModal()}}
              />
            </div>
            {/* Modal body */}
            <div className="p-4">
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-3 md:space-y-5"
              >
                <div className='max-h-96 vertical-scroll-inner'>
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

                
                    <div className='flex flex-col mb-4 relative'>
                    {inputs.map((input, index) => (
                        <div className="relative" key={index}>
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
                            <IoClose  className='cursor-pointer' onClick={() => removeInput(index)} />
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
                      <input
                        type="text"
                        name="PhoneNumber"
                        id="PhoneNumber"
                        placeholder="Enter Phone Number"
                        className="formInput"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.PhoneNumber}
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
                
                <div className="flex items-center justify-center gap-2 border-t border-gray">
                  <button
                      type="button"
                      className="w-40 bg-[#FF0000] font-medium rounded-full py-3 text-white hover:bg-primary text-center  text-base mt-4"
                      onClick={() => toggleModal()}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-40 text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-full py-3 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
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
    </>
  )
}

export default AddEditAdvertisement
