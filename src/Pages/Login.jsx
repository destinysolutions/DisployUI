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
import logo from "../images/DisployImg/White-Logo2.png";
// import logo from "../images/DisployImg/White-Logo2.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import MicrosoftBtn from "./MicrosoftBtn";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../Components/Common/authconfig";
import { MsalProvider } from "@azure/msal-react";
import { LoginSocialFacebook } from "reactjs-social-login";

// import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY;

// console.log(import.meta.env.REACT_APP_RECAPTCHA_SITE_KEY);

const Login = () => {
  //using for routing
  // const { loginUser } = useUser();
  //using show or hide password field
  const msalInstance = new PublicClientApplication(msalConfig);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  //using for login faild or success meg display
  const [errorMessge, setErrorMessge] = useState(false);
  const location = useLocation();
  const message = location?.state?.message || null;
  const [messageVisible, setMessageVisible] = useState(false);
  const [loading, setLoading] = useState(false)

  // const { loading, user } = useSelector((state) => state.root.auth);

  const navigate = useNavigate();

  //using for save token
  // const [cookies, setCookie] = useCookies(["token"]);

  //using for validation and login api calling
  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    emailID: Yup.string()
      .required("Email is required")
      .email("E-mail must be a valid e-mail!"),
    captcha: Yup.string().required("captcha is required."),
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
      setLoading(true)

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
                if (response?.isAdvCustomer) {
                  localStorage.setItem("role_access", "ADVERTISMENT");
                } else {
                  localStorage.setItem("role_access", "ADMIN");
                }
                toast.success("Login successfully.");
                window.location.href = "/";
              } else if (userRole == 2) {

                if (response?.isSalesMan) {
                  localStorage.setItem("role_access", "SALESMAN");
                  toast.success("Login successfully.");
                } else {
                  localStorage.setItem("role_access", "USER");
                  toast.success("Login successfully.");
                  window.location.href = "/dashboard";
                }
              } else {
                // Handle other roles or unknown roles
                alert("Invalid role: " + userRole);
              }
              setLoading(false)
            } else {
              toast.remove();
              setErrorMessge(response.message);
              setLoading(false)
              toast.error(response?.message);
            }
          })
          .catch((error) => {
            console.log(error);
            setLoading(false)
          });
      }
    },
  });

  const { setFieldValue, values, getFieldProps } = formik;

  const SignInWithGooglebtn = async () => {
    setLoading(true)
    const res = await signInWithPopup(auth, Googleauthprovider)
      .then((result) => {
        // Google sign-in successful, you can access user information via result.user
        const data = JSON.stringify({
          emailID: result?.user?.email,
          googleID: result?.user?.uid,
          password: "",
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
                  // if (response?.userDetails?.isRetailer === false) {
                  localStorage.setItem("role_access", "USER");
                  // } else {
                  //   localStorage.setItem("role_access", "RETAILER");
                  // }
                  toast.success("Login successfully.");
                  // navigate("/screens");
                  window.location.href = "/dashboard";
                } else {
                  // Handle other roles or unknown roles
                  console.log("Unexpected role value:", userRole);
                  alert("Invalid role: " + userRole);
                }
              } else {
                toast.error(response?.message);
                setErrorMessge(response.message);
                toast.remove();
              }
              setLoading(false)
            })
            .catch((error) => {
              console.log(error);
              setLoading(false)
            });
        }
      })
      .catch((error) => {
        // Handle errors here
        setLoading(false)
        console.error(error);
      });
  };

  const SignInFaceBook = async (user) => {
    try {
      setLoading(true)
      const res = await signInWithPopup(auth, facebookProvider);
      // const res = await signInWithCredential(auth, facebookProvider);

      const data = JSON.stringify({
        emailID: res?.user?.email,
        googleID: res?.user?.uid,
        password: "",
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
                // if (response?.userDetails?.isRetailer === false) {
                localStorage.setItem("role_access", "USER");
                // } else {
                //   localStorage.setItem("role_access", "RETAILER");
                // }
                toast.success("Login successfully.");
                // navigate("/screens");
                window.location.href = "/dashboard";
              } else {
                // Handle other roles or unknown roles
                console.log("Unexpected role value:", userRole);
                alert("Invalid role: " + userRole);
              }
            } else {
              toast.error(response?.message);
              setErrorMessge(response.message);
              toast.remove();
            }
            setLoading(false)
          })
          .catch((error) => {
            console.log(error);
            setLoading(false)
          });
      }

    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const SignInapple = async () => {
    try {
      const res = await signInWithRedirect(auth, appleProvider);
      const user = res.user;
      // onclose();
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
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

                  <div className="relative">
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
                  </div>

                  <p
                    className="ml-1 mt-2 not-italic text-white font-medium  text-right hover:text-SlateBlue"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password ?
                  </p>

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

            <div className="flex items-center justify-center mt-4">
              <button onClick={SignInWithGooglebtn}>
                <div className="socialIcon socialIcon1">
                  <BsGoogle className="text-2xl text-white bg-primary rounded-full p-1" />
                </div>
              </button>
              <button onClick={SignInFaceBook}>
                <div className="socialIcon socialIcon2">
                  <FaFacebookF className="text-2xl text-white bg-primary rounded-full p-1" />
                </div>
              </button>
              <button onClick={SignInapple}>
                <div className="socialIcon socialIcon3">
                  <BsApple className="text-2xl text-white bg-primary rounded-full p-1" />
                </div>
              </button>
              <MsalProvider instance={msalInstance}>
                <MicrosoftBtn register={false} setLoading={setLoading} />
              </MsalProvider>
            </div>
          </div>
        </div>
      </div>
      {/* Login form end*/}
    </>
  );
};

export default Login;
