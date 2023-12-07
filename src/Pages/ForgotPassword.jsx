import "../Styles/loginRegister.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FORGOTPASSWORD } from "./Api";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import video from "../../public/DisployImg/iStock-1137481126.mp4";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Emial is required"),
  });

  //using for login faild or success meg display
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = { email: values.email};
      // Handle form submission here
      axios.post(FORGOTPASSWORD, payload, {
        headers: {"Content-Type": "application/json"},
      }).then(() => {
        toast.success("Email send.");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
      console.log(payload);
    },
  });

  return (
    <>
      {/* forgotpassword form start*/}
      <div className="videobg login relative">
      <video src={video} autoPlay muted loop />
        <div className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center loginbg  lg:px-6 md:px-6 sm:px-2 xs:px-2 lg:mx-auto md:mx-auto sm:mx-auto xs:mx-2  lg:py-2 md:py-3 sm:py-5 xs:py-5 z-10">
            <div className="w-full border-[#ffffff6e] border rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
              <div className="lg:p-6 md:p-6  sm:px-4 xs:p-2 py-6">
                <div className="mb-2 font-inter not-italic font-medium text-[24px] text-white">
                  Forgot Password
                </div>
                <div className="lg:mb-8 md:mb-8 sm:mb-3 xs:mb-2 font-['Poppins'] not-italic font-normal lg:text-base md:text-base sm:text-sm xs:text-[14px] text-white">
                  Enter your email and we'll send you a link to reset your
                  password{" "}
                </div>
                <form
                  className="space-y-3 md:space-y-5"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-200 border input-bor-color text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 error">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className="w-full text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-lg py-3.5 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
                    disabled={loading}
                  >
                    {loading ? "Sending in..." : "Send Email"}
                  </button>
                  <div className="flex lg:ml-3 lg:text-sm md:text-sm sm:text-sm xs:text-[14px] flex-wrap">
                    <p className="not-italic text-white font-medium">
                      Don’t have an account, yet?
                    </p>
                    <button
                      className="ml-1 not-italic text-white font-medium hover:text-SlateBlue"
                      onClick={() => navigate("/")}
                      disabled={loading}
                    >
                      Sign up here
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
