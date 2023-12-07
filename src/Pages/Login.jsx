import "../Styles/loginRegister.css";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsMicrosoft } from "react-icons/bs";
import { BsApple } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
// import { useCookies } from "react-cookie";
import { Alert } from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LOGIN_URL, ADD_REGISTER_URL } from "./Api";
import video from "../../public/DisployImg/iStock-1137481126.mp4";
import { useUser } from "../UserContext";
import {
  Googleauthprovider,
  appleProvider,
  auth,
  facebookProvider,
  microsoftProvider,
} from "../FireBase/firebase";
import { useDispatch } from "react-redux";
import { loginUser, signUpUser } from "../Redux/useraction";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
// import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY;

// console.log(import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY);

const Login = () => {
  //using for routing
  const history = useNavigate();
  // const { loginUser } = useUser();
  //using show or hide password field
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  //using for login faild or success meg display
  const [errorMessge, setErrorMessge] = useState(false);
  const location = useLocation();
  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(false);
  const [captcha, setcaptcha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCaptcha = (value) => {
    setcaptcha(value);
  };
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
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      emailID: "",
      // terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let data = JSON.stringify({
        emailID: values.emailID,
        password: values.password,
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
      setLoading(true);
      axios
        .request(config)
        .then((response) => {
          localStorage.setItem("userID", JSON.stringify(response.data));
          const createdDate = new Date(response.data.createdDate);
          const trialEndDate = new Date(createdDate);
          trialEndDate.setDate(
            trialEndDate.getDate() + response.data.trialDays
          );

          const currentDate = new Date();

          const daysRemaining = Math.ceil(
            (trialEndDate - currentDate) / (1000 * 60 * 60 * 24)
          );
          // if (daysRemaining > 0) {
          if (response.data.status == 200) {
            window.localStorage.setItem("timer", JSON.stringify(18_00));

            const userRole = response.data.role;
            if (userRole == 1) {
              localStorage.setItem("role_access", "ADMIN");
              window.location.href = "/";
              // navigate("/");
            } else if (userRole == 2) {
              // User login logic
              auth
                .signInWithEmailAndPassword(values.emailID, values.password)
                .then((userCredential) => {
                  const user = userCredential.user;
                  if (!user.emailVerified) {
                    alert("Please verify your email.");
                  } else {
                    // console.log(response?.data);
                    const user_ID = response.data.userID;
                    localStorage.setItem(
                      "userID",
                      JSON.stringify(response.data)
                    );
                    localStorage.setItem("role_access", "USER");
                    window.location.href = "/";
                    // navigate("/");
                  }
                  setLoading(false);
                })
                .catch((error) => {
                  var errorMessage = JSON.parse(error.message);
                  console.log("errorMessage", errorMessage);
                  switch (errorMessage.error.message) {
                    case "ERROR_INVALID_EMAIL":
                      alert("Your email address appears to be malformed.");
                      break;
                    case "ERROR_WRONG_PASSWORD":
                      alert("Your password is wrong.");
                      break;
                    case "ERROR_USER_NOT_FOUND":
                      alert("User with this email doesn't exist.");
                      break;
                    case "ERROR_USER_DISABLED":
                      alert("User with this email has been disabled.");
                      break;
                    case "ERROR_TOO_MANY_REQUESTS":
                      alert("Too many requests. Try again later.");
                      break;
                    case "ERROR_OPERATION_NOT_ALLOWED":
                      alert(
                        "Signing in with Email and Password is not enabled."
                      );
                      break;
                    case "INVALID_LOGIN_CREDENTIALS":
                      alert("Invaild Email Or Password");
                      break;

                    default:
                      alert("Something went wrong");
                  }
                  setLoading(false);
                });
            } else {
              // Handle other roles or unknown roles
              console.log("Unexpected role value:", userRole);
              alert("Invalid role: " + userRole);
              setLoading(false);
            }
          } else {
            toast.remove();
            setErrorMessge(response.data.message);
            setLoading(false);
            toast.error(response?.data?.message);
          }

          // } else {
          //   alert(
          //     "Trial days has been expired please contact the Administration"
          //   );
          // }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    },
  });

  const SignInWithGoogle = async () => {
    try {
      const res = await auth.signInWithPopup(Googleauthprovider);
      const user = res.user;
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
          // dispatch(loginUser(response.data));

          history("/", {
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

  const SignInFaceBook = async () => {
    try {
      const res = await auth.signInWithPopup(facebookProvider);
      const user = res.user;
      // onclose();
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
          history("/", {
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
      const res = await auth.signInWithPopup(appleProvider);
      const user = res.user;
      // onclose();
      console.log("user", user);
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
      const res = await auth.signInWithPopup(microsoftProvider);
      const user = res.user;
      // onclose();
      console.log("user", user);
    } catch (err) {
      console.log(err);
    }
  };

  //for signup
  const handleRegister = () => {
    history("/register");
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
    history("/forgotpassword");
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
                        checked={formik.values.terms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="flex ml-3 lg:text-sm md:text-sm sm:text-sm xs:text-[14px] flex-wrap">
                      <p className="not-italic text-white font-medium">
                        I accept the
                      </p>
                      <Link to="/termsconditions">
                        <p className="ml-1 not-italic text-white font-medium decoration-white border-b ">
                          terms and conditions
                        </p>
                      </Link>
                    </div>

                 
                  </div> */}

                  <div>
                    {/* <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      render="explicit"
                      onChange={handleCaptcha}
                    /> */}
                    {/* <div className="error">
                      {!captcha ? "Please Select Captcha" : ""}
                    </div> */}

                   {/*  <p
                      className="ml-1 mt-2 not-italic text-white font-medium  text-right hover:text-SlateBlue"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </p> */}
                    
                  </div>

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
    </>
  );
};

export default Login;
