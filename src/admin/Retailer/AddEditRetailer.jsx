import { useFormik } from "formik";
import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import * as Yup from "yup";
import { addRetailerData, updateRetailerData } from "../../Redux/admin/RetailerSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
const AddEditRetailer = ({
  heading,
  toggleModal,
  showPassword,
  setShowPassword,
  editId,
  editData,
  setShowModal,
  orgUserID
}) => {
  const dispatch = useDispatch()
  //using for validation and register api calling
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    firstName: Yup.string().required("First Name is required").max(50),
    lastName: Yup.string().required("Last Name is required").max(50),
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    googleLocation: Yup.string().required("Google Location is required"),
  });

  const editValidationSchema = Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    firstName: Yup.string().required("First Name is required").max(50),
    lastName: Yup.string().required("Last Name is required").max(50),
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    googleLocation: Yup.string().required("Google Location is required"),
  });

  const formik = useFormik({
    initialValues: editData,
    enableReinitialize: editData,
    validationSchema: editId ? editValidationSchema : validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("OrganizationName", values.companyName);
      formData.append("Password", values.password || ""); // Set a default value if null
      formData.append("FirstName", values.firstName);
      formData.append("LastName", values.lastName);
      formData.append("Email", values.emailID);
      formData.append("GoogleLocation", values.googleLocation);
      formData.append("Phone", values.phoneNumber);
      formData.append("IsRetailer", true);

      if (editId) {
        formData.append("OrgUserSpecificID", editId);
        formData.append("orgUserID", orgUserID);
        dispatch(updateRetailerData(formData)).then((res) => {
          if (res?.payload?.status === 200) {
            formik.resetForm();
            setShowModal(false);
          } else {
            toast.error(res?.payload?.message)
          }
        }).catch((err) => {
          console.log('err', err)
        });
      } else {
        formData.append("Operation", "Insert");
        dispatch(addRetailerData(formData)).then((res) => {
          if (res?.payload?.status === 200) {
            formik.resetForm();
            setShowModal(false);
          } else {
            toast.error(res?.payload?.message)
          }
        }).catch((err) => {
          console.log('err', err)
        });

        formik.resetForm();
        setShowModal(false);
      }


    },
  });

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
                    {heading} Retailer
                  </h3>
                  <AiOutlineCloseCircle
                    className="text-4xl text-primary cursor-pointer"
                    onClick={() => {
                      formik.resetForm();
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
                    <div className="flex items-center justify-center px-4 pt-4 border-t border-gray-200 rounded-b dark:border-gray-600 gap-2">
                      <button
                        type="button"
                        className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                        onClick={() => {
                          formik.resetForm();
                          toggleModal()
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                      >
                        {heading === "Add" ? "Save" : heading}
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
  );
};

export default AddEditRetailer;
