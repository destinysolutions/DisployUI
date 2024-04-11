import "../Styles/loginRegister.css";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsMicrosoft } from "react-icons/bs";
import { BsApple } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { useCookies } from "react-cookie";
import { Alert } from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LOGIN_URL, ADD_REGISTER_URL } from "./Api";
import video from "../images/DisployImg/iStock-1137481126.mp4";
import {
  Googleauthprovider,
  appleProvider,
  auth,
  facebookProvider,
  microsoftProvider,
} from "../FireBase/firebase";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { handleLoginUser, handleLoginWithGoogle } from "../Redux/Authslice";
import {
  FacebookAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
// import logo from "../images/DisployImg/logo.svg";
import logo from "../images/DisployImg/White-Logo2.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY;

// console.log(import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY);

const Login = () => {
  //using for routing
  // const { loginUser } = useUser();
  //using show or hide password field
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  //using for login faild or success meg display
  const [errorMessge, setErrorMessge] = useState(false);
  const location = useLocation();
  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(false);

  const { loading, user } = useSelector((state) => state.root.auth);

  const navigate = useNavigate();

  //using for save token
  // const [cookies, setCookie] = useCookies(["token"]);

  //using for validation and login api calling
  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    // terms: Yup.boolean()
    //   .oneOf([true], "You must accept the terms and conditions")
    //   .required("You must accept the terms and conditions"),
    // captcha: Yup.string().required("captcha is required."),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      emailID: "",
      captcha: "",
      // terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // if (!isCheckboxChecked) {
      //   toast.error("Please check & accept the terms and conditions.");
      //   return; // Exit the submission process if checkbox is not checked
      // }

      let data = JSON.stringify({
        emailID: values.emailID,
        password: values.password,
        SystemTimeZone: new Date()
          .toLocaleDateString(undefined, {
            day: "2-digit",
            timeZoneName: "long",
          })
          .substring(4),
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: LOGIN_URL,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = dispatch(handleLoginUser({ config }));
      if (response) {
        response
          .then((res) => {
            const response = res?.payload;
            // localStorage.setItem("userID", JSON.stringify(response));
            const createdDate = new Date(response.createdDate);
            const trialEndDate = new Date(createdDate);
            trialEndDate.setDate(trialEndDate.getDate() + response.trialDays);

            const currentDate = new Date();
            const daysRemaining = Math.ceil(
              (trialEndDate - currentDate) / (1000 * 60 * 60 * 24)
            );
            if (response.status == 200) {
              window.localStorage.setItem("timer", JSON.stringify(18_00));

              const userRole = response.role;
              if (userRole == 1) {
                localStorage.setItem("role_access", "ADMIN");
                toast.success("Login successfully.");
                window.location.href = "/";
              } else if (userRole == 2) {
                // User login logic
                const user_ID = response.userID;
                // localStorage.setItem("userID", JSON.stringify(response));
                localStorage.setItem("role_access", "USER");
                toast.success("Login successfully.");
                // console.log(response);
                // navigate("/screens");
                window.location.href = "/dashboard";
              } else {
                // Handle other roles or unknown roles
                console.log("Unexpected role value:", userRole);
                alert("Invalid role: " + userRole);
              }
            } else {
              toast.remove();
              setErrorMessge(response.message);

              toast.error(response?.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  });

  const { setFieldValue, values, getFieldProps } = formik;

  const SignInWithGoogle = async (data) => {
    try {
      const loginData = {
        companyName: null,
        password: null,
        firstName: data.name,
        emailID: data.email,
        googleLocation: null,
        phoneNumber: null,
        operation: "Insert",
        googleID: data?.sub,
      };
      const config = {
        method: "post",
        data: loginData,
        headers: {
          "Content-Type": "application/json",
        },
        url: ADD_REGISTER_URL,
      };
      const response = dispatch(handleLoginWithGoogle({ config }));
      if (!response) return;
      response
        .then((res) => {
          if (res.status == 200) {
            window.localStorage.setItem("timer", JSON.stringify(18_00));
            const userRole = res.role;
            if (userRole == 1) {
              localStorage.setItem("role_access", "ADMIN");
              toast.success("Login successfully.");
              window.location.href = "/";
            } else if (userRole == 2) {
              toast.success("Login successfully.");
              navigate("/screens");
              window.location.href = "/";
            } else {
              console.log("Unexpected role value:", userRole);
              alert("Invalid role: " + userRole);
            }
          } else {
            toast.remove();
            setErrorMessge(response.message);

            toast.error(response?.message);
          }

          // toast.success("login successfully.");
          // navigate("/screens");
        })
        .catch((error) => {
          console.log(error);
          setErrorMessge("Registration failed.");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const SignInFaceBook = async () => {
    try {
      const res = await signInWithRedirect(auth, facebookProvider);

      // const res = await signInWithCredential(auth, facebookProvider);
      const user = res.user;
      return console.log(res);

      axios
        .post(ADD_REGISTER_URL, {
          companyName: null,
          password: null,
          firstName: user.displayName,
          emailID: user.email,
          googleLocation: null,
          phoneNumber: user.phoneNumber,
          operation: "Insert",
        })
        .then(() => {
          navigate("/", {
            state: { message: "Registration successfull !!" },
          });
        })
        .catch((error) => {
          console.log(error);
          setErrorMessge("Registration failed.");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const SignInapple = async () => {
    try {
      const res = await signInWithRedirect(auth, appleProvider);
      const user = res.user;
      // onclose();
    } catch (err) {
      console.log(err);
    }
  };

  const SignInMicroSoft = async () => {
    microsoftProvider.setCustomParameters({
      prompt: "consent",
      tenant: "f8cdef31-a31e-4b4a-93e4-5f571e91255a",
    });
    try {
      // const res = await signInWithPopup(auth, microsoftProvider);
      const res = await signInWithRedirect(auth, microsoftProvider);
      const user = res.user;
      // onclose();
    } catch (err) {
      console.log(err);
    }
  };

  //for signup
  const handleRegister = () => {
    navigate("/register");
    localStorage.removeItem("hasSeenMessage");
  };

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

  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const handleCheckboxChange = (e, formik) => {
    setIsCheckboxChecked(e.target.checked);
    setShowModal(true);
  };

  const handleAcceptTerms = () => {
    setShowModal(false);
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
      <div className="videobg login relative">
        <video src={video} autoPlay muted loop playsInline />
        <div className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center loginbg  lg:px-6 md:px-6 sm:px-2 xs:px-2 lg:mx-auto md:mx-auto sm:mx-auto xs:mx-2  lg:py-2 md:py-3 sm:py-5 xs:py-5 z-10">
            <div className="flex items-center pb-5">
              <img className="w-52 h-14" alt="logo" src={logo} />
            </div>
            <div className="w-full border-[#ffffff6e] border rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
              <div className="lg:p-6 md:p-6  sm:px-4 xs:p-2 py-6">
                <div className="mb-2 font-inter not-italic font-medium text-[24px] text-white">
                  Sign in
                </div>
                <div className="lg:mb-8 md:mb-8 sm:mb-3 xs:mb-2 font-['Poppins'] not-italic font-normal lg:text-base md:text-base sm:text-sm xs:text-[14px] text-white">
                  Fill in the fields below to sign into your account.
                </div>
                <form
                  className="space-y-3 md:space-y-5"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="relative">
                    <input
                      type="email"
                      name="emailID"
                      id="emailID"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.emailID}
                      placeholder="Email"
                      className="formInput"
                    />
                    {/*<label >Email address</label> */}
                    {formik.errors.emailID && formik.touched.emailID && (
                      <div className="error">{formik.errors.emailID}</div>
                    )}
                  </div>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Password"
                        className="formInput"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      {/* <label >Password</label>*/}
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
                  {/* <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={isCheckboxChecked}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="flex ml-3 lg:text-sm md:text-sm sm:text-sm xs:text-[14px] flex-wrap">
                      <p className="not-italic text-white font-medium">
                        I accept the
                      </p>
                      <p
                        className="ml-1 not-italic text-white font-medium decoration-white border-b cursor-pointer"
                        onClick={() => setShowModal(true)}
                      >
                        terms and conditions
                      </p>
                    </div>
                  </div> */}

                  {/*<div className="relative">
                    <div className="relative">
                      <ReCAPTCHA
                        sitekey={process.env.REACT_APP_CAPTCHA}
                        onChange={(e) => {
                          setFieldValue("captcha", e);
                        }}
                      />
                    </div>
                    {formik.errors.captcha && formik.touched.captcha && (
                      <div className="error">{formik.errors.captcha}</div>
                    )}
                  </div>*/}

                  <p
                    className="ml-1 mt-2 not-italic text-white font-medium  text-right hover:text-SlateBlue"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password ?
                  </p>

                  {/* {formik.errors.terms && formik.touched.terms && (
                    <div className="error">{formik.errors.terms}</div>
                  )} */}
                  <button
                    type="submit"
                    className="w-full text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-lg py-3.5 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                  <div className="flex lg:ml-3 lg:text-sm md:text-sm sm:text-sm xs:text-[14px] flex-wrap">
                    <p className="not-italic text-white font-medium">
                      Don’t have an account, yet?
                    </p>
                    <button
                      className="ml-1 not-italic text-white font-medium hover:text-SlateBlue"
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      Sign up here
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* login with google */}
            {/* <div className="mt-4">
              <GoogleOAuthProvider
                clientId={process.env.REACT_APP_GOOGLE_DRIVE_CLIENTID}
              >
                <GoogleLogin
                  theme="outline"
                  type="standard"
                  onSuccess={(res) => {
                    SignInWithGoogle(jwtDecode(res.credential));
                  }}
                  onError={(err) => console.log(err)}
                ></GoogleLogin>
              </GoogleOAuthProvider>
            </div> */}
            {/* <div className="flex items-center justify-center mt-4">
              <div className="socialIcon socialIcon1">
                <button onClick={SignInWithGoogle}>
                  <BsGoogle className="text-2xl text-white bg-primary rounded-full p-1" />
                </button>
              </div>
              <div className="socialIcon socialIcon2">
                <button onClick={SignInFaceBook}>
                  <FaFacebookF className="text-2xl text-white bg-primary rounded-full p-1" />
                </button>
              </div>
              <div className="socialIcon socialIcon3">
                <button onClick={SignInapple}>
                  <BsApple className="text-2xl text-white bg-primary rounded-full p-1" />
                </button>
              </div>
              <div className="socialIcon socialIcon4">
                <button onClick={SignInMicroSoft}>
                  <BsMicrosoft className="text-lg text-primary" />
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Login form end*/}

      {showModal && (
        <div className="backdrop bg-white">
          <div ref={modalRef} className="user-model-TC">
            <div className="relative  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 p-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white w-full max-w-2xl max-h-full">
                  Terms And Conditions
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
                  onClick={() => {
                    setShowModal(false);
                    setIsCheckboxChecked();
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4 overflow-y-auto max-h-[calc(100vh - 200px)]">
                <ol className="space-y-4 text-gray-500 list-decimal list-inside dark:text-gray-400">
                  <li>
                    <b>Prohibited Activities</b>
                    <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                      <li>
                        You may not access or use the Site for any purpose other
                        than that for which we make the Site available. The Site
                        may not be used in connection with any commercial
                        endeavors except those that are specifically endorsed or
                        approved by us.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <b>Contribution License</b>
                    <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                      <li>
                        You and the Site agree that we may access, store,
                        process, and use any information and personal data that
                        you provide following the terms of the Privacy Policy
                        and your choices (including settings). By submitting
                        suggestions or other feedback regarding the Site, you
                        agree that we can use and share such feedback for any
                        purpose without compensation to you.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <b>Term And Termination</b>
                    <ul className="ps-5 mt-2 space-y-1 list-disc list-inside">
                      <li>
                        These terms of use shall remain in full force and effect
                        while you use the site. Without limiting any other
                        provision of these terms of use, we reserve the right
                        to, in our sole discretion and without notice or
                        liability, deny access to and use of the site and the
                        marketplace offerings (including blocking certain ip
                        addresses), to any person for any reason or for no
                        reason, including without limitation for breach of any
                        representation, warranty, or covenant contained in these
                        terms of use or of any applicable law or regulation. We
                        may terminate your use or participation in the site and
                        the marketplace offerings or delete any content or
                        information that you posted at any time, without
                        warning, in our sole discretion.
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => handleAcceptTerms()}
                >
                  I accept
                </button>
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => {
                    setShowModal(false);
                    setIsCheckboxChecked();
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
