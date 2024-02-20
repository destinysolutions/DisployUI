import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { CHNAGE_PASSWORD } from "../Api";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { auth } from "../../FireBase/firebase"; // Import your Firebase auth instance
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Security = () => {
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const navigator = useNavigate();

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      )
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm New Password is required"),
  });

  const [currentPasswordShow, setCurrentPassword] = useState(false);
  const [newPasswordShow, setNewPassword] = useState(false);
  const [confirmPasswordShow, setConfirmPassword] = useState(false);

  const [ischeck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  // Custom handleChange function for acceptTerms checkbox
  const handleAcceptTermsChange = (event) => {
    setIsCheck(event.target.checked);
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        toast.loading("Updating...");

        const payload = {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
          acceptTerms: ischeck,
        };

        const config = {
          method: "post", // Change method to 'put' for changing the password
          url: CHNAGE_PASSWORD, // Assuming CHNAGE_PASSWORD is your API endpoint
          headers: {
            Authorization: authToken,
          },
          params: {
            OldPassowrd: payload.currentPassword, // Note: Typo in OldPassword corrected
            NewPassword: payload.newPassword,
          },
          maxBodyLength: Infinity,
        };

        const response = await axios.request(config);
        if (response.status) {
          toast.dismiss();
          toast.success("Your password change was successful");
          navigator("/userprofile");
          formik.resetForm();
        }
      } catch (error) {
        console.error("Error updating password:", error.message);
        toast.error("Error updating password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
  };

  return (
    <div className="lg:p-5 py-3">
      <div className="rounded-xl shadow-lg bg-white lg:p-5 p-3">
        <h4 className="text-xl font-bold">Change Password</h4>
        <div className="-mx-3 lg:flex md:flex mb-6">
          <div className="lg:w-1/2 md:w-1/2 w-full px-3 mb-6 md:mb-0">
            <form
              className="space-y-2"
              action="#"
              onSubmit={formik.handleSubmit}
            >
              <div className="relative">
                <label className="label_top text-sm font-medium text-gray-900 dark:text-white">
                  Current Password
                </label>
                <input
                  type={currentPasswordShow ? "text" : "password"}
                  name="currentPassword"
                  id="currentPassword"
                  className=" border  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Current Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPassword}
                />
                <div className="icon mt-3">
                  {currentPasswordShow ? (
                    <BsFillEyeFill
                      onClick={() => setCurrentPassword(!currentPasswordShow)}
                    />
                  ) : (
                    <BsFillEyeSlashFill
                      onClick={() => setCurrentPassword(!currentPasswordShow)}
                    />
                  )}
                </div>
              </div>
              {formik.touched.currentPassword &&
              formik.errors.currentPassword ? (
                <div className="text-red-500 error">
                  {formik.errors.currentPassword}
                </div>
              ) : null}
              <div className="relative">
                <label className="label_top text-sm font-medium text-gray-900 dark:text-white">
                  New Password
                </label>
                <input
                  type={newPasswordShow ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="Enter New Password"
                  className=" border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <div className="icon mt-3">
                  {newPasswordShow ? (
                    <BsFillEyeFill
                      onClick={() => setNewPassword(!newPasswordShow)}
                    />
                  ) : (
                    <BsFillEyeSlashFill
                      onClick={() => setNewPassword(!newPasswordShow)}
                    />
                  )}
                </div>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div className="text-red-500 error">
                  {formik.errors.newPassword}
                </div>
              ) : null}
              <div className="relative">
                <label className="label_top text-sm font-medium text-gray-900 dark:text-white">
                  Confirm Password
                </label>
                <input
                  type={confirmPasswordShow ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Enter Confirm New Password"
                  className=" border  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <div className="icon mt-3">
                  {confirmPasswordShow ? (
                    <BsFillEyeFill
                      onClick={() => setConfirmPassword(!confirmPasswordShow)}
                    />
                  ) : (
                    <BsFillEyeSlashFill
                      onClick={() => setConfirmPassword(!confirmPasswordShow)}
                    />
                  )}
                </div>
              </div>
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 error">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
              {/* <div className="flex items-center pb-2">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    aria-describedby="newsletter"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    checked={ischeck}
                    onChange={handleAcceptTermsChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-light text-gray-500 dark:text-gray-300">
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div> */}
              <div className="md:w-full flex lg:pt-5 pt-3">
                <button
                  className="lg:px-5 px-3 bg-primary text-white rounded-full py-2 border border-primary me-3"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className=" px-5 py-2 border border-primary rounded-full text-primary"
                  onClick={() => resetForm()}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          <div className="lg:w-1/2 md:w-1/2 w-full px-3 mb-6 md:mb-0">
            <h4 className="user-name mb-3">Password Requirements:</h4>
            <ul>
              <li className="flex items-center">
                <span className="me-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M0.0979682 7.2727C-0.0239126 7.16235 -0.0333736 6.97408 0.0768995 6.8522C0.187252 6.73024 0.375519 6.72086 0.49748 6.83113L3.20486 9.28608L9.25509 2.94963C9.3687 2.83029 9.55752 2.82552 9.67686 2.93914C9.79628 3.05267 9.80097 3.24149 9.68743 3.36091L3.43645 9.90765L3.43605 9.90725C3.32507 10.024 3.14062 10.0315 3.02048 9.92283L0.0979682 7.2727Z"
                      fill="#515151"
                    />
                    <path
                      d="M0.0979682 4.41577C-0.0239126 4.30542 -0.0333736 4.11715 0.0768995 3.99527C0.187252 3.87331 0.375519 3.86392 0.49748 3.9742L3.20486 6.42915L9.25509 0.0926969C9.3687 -0.0266397 9.55752 -0.03141 9.67686 0.0822023C9.79628 0.195735 9.80097 0.384559 9.68743 0.503975L3.43645 7.05071L3.43605 7.05032C3.32507 7.16703 3.14062 7.17458 3.02048 7.0659L0.0979682 4.41577Z"
                      fill="#515151"
                    />
                  </svg>
                </span>
                Minimum 8 characters long - the more, the better
              </li>
              {/* <li className="flex items-center">
                <span className="me-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M0.0979682 7.2727C-0.0239126 7.16235 -0.0333736 6.97408 0.0768995 6.8522C0.187252 6.73024 0.375519 6.72086 0.49748 6.83113L3.20486 9.28608L9.25509 2.94963C9.3687 2.83029 9.55752 2.82552 9.67686 2.93914C9.79628 3.05267 9.80097 3.24149 9.68743 3.36091L3.43645 9.90765L3.43605 9.90725C3.32507 10.024 3.14062 10.0315 3.02048 9.92283L0.0979682 7.2727Z"
                      fill="#515151"
                    />
                    <path
                      d="M0.0979682 4.41577C-0.0239126 4.30542 -0.0333736 4.11715 0.0768995 3.99527C0.187252 3.87331 0.375519 3.86392 0.49748 3.9742L3.20486 6.42915L9.25509 0.0926969C9.3687 -0.0266397 9.55752 -0.03141 9.67686 0.0822023C9.79628 0.195735 9.80097 0.384559 9.68743 0.503975L3.43645 7.05071L3.43605 7.05032C3.32507 7.16703 3.14062 7.17458 3.02048 7.0659L0.0979682 4.41577Z"
                      fill="#515151"
                    />
                  </svg>
                </span>{" "}
                At least one lowercase character
              </li> */}
              <li className="flex items-center">
                <span className="me-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M0.0979682 7.2727C-0.0239126 7.16235 -0.0333736 6.97408 0.0768995 6.8522C0.187252 6.73024 0.375519 6.72086 0.49748 6.83113L3.20486 9.28608L9.25509 2.94963C9.3687 2.83029 9.55752 2.82552 9.67686 2.93914C9.79628 3.05267 9.80097 3.24149 9.68743 3.36091L3.43645 9.90765L3.43605 9.90725C3.32507 10.024 3.14062 10.0315 3.02048 9.92283L0.0979682 7.2727Z"
                      fill="#515151"
                    />
                    <path
                      d="M0.0979682 4.41577C-0.0239126 4.30542 -0.0333736 4.11715 0.0768995 3.99527C0.187252 3.87331 0.375519 3.86392 0.49748 3.9742L3.20486 6.42915L9.25509 0.0926969C9.3687 -0.0266397 9.55752 -0.03141 9.67686 0.0822023C9.79628 0.195735 9.80097 0.384559 9.68743 0.503975L3.43645 7.05071L3.43605 7.05032C3.32507 7.16703 3.14062 7.17458 3.02048 7.0659L0.0979682 4.41577Z"
                      fill="#515151"
                    />
                  </svg>
                </span>{" "}
                At least one uppercase letter, one lowercase letter, one digit,
                and one special character
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="rounded-xl mt-8 shadow bg-white my-3 p-5">
        <h4 className="user-name mb-3">Two-steps verification</h4>
        <p className="font-medium lg:text-md my-3">
          Two factor authentication is not enabled yet.
        </p>
        <p className="mb-3">
          Two-factor authentication adds an additional layer of security to your
          account byrequiring more than just a password to log in.
        </p>
        <button className="px-5 bg-primary text-white rounded-full py-2 border border-primary">
          {" "}
          Enable 2FA
        </button>
      </div> */}
    </div>
  );
};

export default Security;
