import "../Styles/loginRegister.css";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsMicrosoft } from "react-icons/bs";
import { BsApple } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Alert } from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LOGIN_URL } from "./Api";

const Login = () => {
  //using for routing
  const history = useNavigate();

  //using show or hide password field
  const [showPassword, setShowPassword] = useState(false);

  //using for login faild or success meg display
  const [errorMessge, setErrorMessge] = useState(false);
  const location = useLocation();
  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(false);
  useEffect(() => {
    const hasSeenMessage = localStorage.getItem("hasSeenMessage");

    if (!hasSeenMessage && message != null) {
      setMessageVisible(true);
      localStorage.setItem("hasSeenMessage", "true");
    }
  }, [message]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessageVisible(false);
      setErrorMessge(false);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [errorMessge, messageVisible]);

  //using for save token
  const [cookies, setCookie] = useCookies(["token"]);

  //using for validation and login api calling
  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    terms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      emailID: "",
      terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post(
          LOGIN_URL,
          {
            password: values.password,
            emailID: values.emailID,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const token = response.data.data.token;
          setCookie("token", token, { path: "/" });
          if (response.data.status === 401) {
            setErrorMessge(response.data.message);
          } else {
            history("/dashboard", {
              state: { message: response.data.message },
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  //for signup
  const handleRegister = () => {
    history("/register");
    localStorage.removeItem("hasSeenMessage");
  };
  return (
    <>
      {/* register success meg display start */}
      {message != null && messageVisible && (
        <Alert
          className="bg-[#5dbb63] w-auto"
          style={{ position: "fixed", top: "20px", right: "20px" }}
        >
          <div className="flex">
            {message}{" "}
            <button className="ml-10" onClick={() => setMessageVisible(false)}>
              <AiOutlineClose className="text-xl" />
            </button>
          </div>
        </Alert>
      )}
      {/* register success meg display end */}
      {/* login faild error meg display start */}
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
      {/* login faild error meg display end */}

      {/* Login form start*/}
      <div className="main login">
        <div className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center min-h-screen px-6 mx-auto  lg:py-2 md:py-3 sm:py-5 xs:py-5">
            <div className="flex items-center pb-5">
              <img
                className="w-227 h-50"
                src="/DisployImg/logo.svg"
                alt="title"
              />
            </div>
            <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 sm:px-6 py-6">
                <div className="mb-2 font-inter not-italic font-medium text-[24px] text-black">
                  Sign in
                </div>
                <div className="mb-8 font-['Poppins'] not-italic font-normal text-[16px] text-black">
                  Fill in the fields below to sign into your account.
                </div>
                <form
                  className="space-y-3 md:space-y-5"
                  onSubmit={formik.handleSubmit}
                >
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
                    className="w-full text-[#FFFFFF] bg-[#002359] not-italic font-medium rounded-lg py-3.5 text-center text-base mt-4"
                  >
                    Sign in
                  </button>
                  <div className="lg:flex lg:ml-3 text-sm sm:block">
                    <label className="not-italic text-[#808080] font-medium">
                      Don’t have an account, yet?
                    </label>
                    <button
                      className="lg:ml-1 not-italic text-[#3871E1] font-medium"
                      onClick={handleRegister}
                    >
                      Sign up here
                    </button>
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
      {/* Login form end*/}
    </>
  );
};

export default Login;
