import "../Styles/loginRegister.css";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { BsMicrosoft } from "react-icons/bs";
import { BsApple } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { Alert } from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { ADD_REGISTER_URL } from "./Api";
import video from "../../public/DisployImg/iStock-1137481126.mp4";
const Registration = () => {
  //using show or hide password field
  const [showPassword, setShowPassword] = useState(false);

  //using registration faild error msg display
  const [errorMessge, setErrorMessge] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessge(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [errorMessge]);

  //using for routing
  const history = useNavigate();

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
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    phoneNumber: Yup.string()
      .required("Phone Number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    googleLocation: Yup.string().required("Google Location is required"),
    terms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
  });

  const formik = useFormik({
    initialValues: {
      companyName: "",
      password: "",
      firstName: "",
      emailID: "",
      googleLocation: "",
      phoneNumber: "",
      terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post(ADD_REGISTER_URL, {
          companyName: values.companyName,
          password: values.password,
          firstName: values.firstName,
          emailID: values.emailID,
          googleLocation: values.googleLocation,
          phoneNumber: values.phoneNumber,
          operation: "Insert",
        })
        .then(() => {
          history("/", { state: { message: "Registration successfull !!" } });
        })
        .catch((error) => {
          console.log(error);
          setErrorMessge("Registration failed.");
        });
    },
  });

  return (
    <>
      {/* registration faild error msg display start*/}
      {errorMessge && (
        <Alert
          className="bg-red w-auto"
          style={{ position: "fixed", top: "20px", right: "20px" }}
        >
          <div className="flex">
            {errorMessge}
            <button className="ml-10" onClick={() => setErrorMessge(false)}>
              <AiOutlineClose className="text-xl" />
            </button>
          </div>
        </Alert>
      )}
      {/* registration faild error msg display end*/}

      {/* registration form start*/}
      <div className="videobg login relative">
        <video src={video} autoPlay muted loop />
        <div className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center loginbg  lg:px-6 md:px-6 sm:px-2 xs:px-2 lg:mx-auto md:mx-auto sm:mx-auto xs:mx-2  lg:py-2 md:py-3 sm:py-5 xs:py-5 z-10">
            <div className="flex items-center pb-5">
              <img
                className="w-227 h-50"
                src="/DisployImg/logo.svg"
                alt="title"
              />
            </div>
            <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-5 sm:px-8 py-1">
                <div className="my-1 font-inter not-italic font-medium text-[24px] text-black mt-4">
                  Create account
                </div>
                <div className="mb-8 font-['Poppins'] not-italic font-normal text-[16px] text-black">
                  Fill in the fields below to sign up for an account.
                </div>
                <form
                  onSubmit={formik.handleSubmit}
                  className="space-y-3 md:space-y-5"
                >
                  <div className="relative">
                    <label className="formLabel">Company Name</label>
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
                  <div className="relative">
                    <label className="formLabel">Google Location</label>
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
                  <div className="relative">
                    <label className="formLabel">Name</label>
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
                  <div className="relative">
                    <label className="formLabel">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Enter Phone Number"
                      className="formInput"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phoneNumber}
                    />
                    {formik.errors.phoneNumber &&
                      formik.touched.phoneNumber && (
                        <div className="error">{formik.errors.phoneNumber}</div>
                      )}
                  </div>
                  <div className="relative">
                    <label className="formLabel">Email address</label>
                    <input
                      type="email"
                      name="emailID"
                      id="emailID"
                      className="formInput"
                      placeholder="Enter Your Email Address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.emailID}
                    />
                    {formik.errors.emailID && formik.touched.emailID && (
                      <div className="error">{formik.errors.emailID}</div>
                    )}
                  </div>
                  <div className="relative">
                    <label className="formLabel">Password</label>
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
                    {formik.errors.password && formik.touched.password && (
                      <div className="error">{formik.errors.password}</div>
                    )}
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={formik.values.terms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="lg:flex ml-3 text-sm sm:block">
                      <label className="not-italic text-[#808080] font-medium">
                        I accept the
                      </label>
                      <Link to="/termsconditions">
                        <p className="lg:ml-1 not-italic text-[#3871E1] font-medium">
                          terms and conditions
                        </p>
                      </Link>
                    </div>
                  </div>
                  {formik.errors.terms && formik.touched.terms && (
                    <div className="error">{formik.errors.terms}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-lg py-3 text-center text-base"
                  >
                    Create Your account
                  </button>
                  <div className="lg:flex lg:ml-3 text-sm sm:block">
                    <label className="not-italic text-[#808080] font-medium mb-3">
                      Already have an account?
                    </label>
                    <Link to="/">
                      <p className="lg:ml-1 not-italic text-[#3871E1] font-medium mb-3">
                        Sign in here
                      </p>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="socialIcon socialIcon1">
                <button>
                  <BsGoogle className="text-2xl text-white bg-primary rounded-full p-1" />
                </button>
              </div>
              <div className="socialIcon socialIcon2">
                <button>
                  <FaFacebookF className="text-2xl text-white bg-primary rounded-full p-1" />
                </button>
              </div>
              <div className="socialIcon socialIcon3">
                <button>
                  <BsApple className="text-2xl text-white bg-primary rounded-full p-1" />
                </button>
              </div>
              <div className="socialIcon socialIcon4">
                <button>
                  <BsMicrosoft className="text-lg text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* registration form end*/}
    </>
  );
};

export default Registration;
