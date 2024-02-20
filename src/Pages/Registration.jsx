import "../Styles/loginRegister.css";
import {
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsFillInfoCircleFill,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
// import {BsMicrosoft} from "react-icons/bs";
// import {BsApple} from "react-icons/bs";
// import {BsGoogle} from "react-icons/bs";
// import {FaFacebookF} from "react-icons/fa";
import { useRef, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import { ADD_REGISTER_URL } from "./Api";
import video from "../images/DisployImg/iStock-1137481126.mp4";
import {
  appleProvider,
  auth,
  facebookProvider,
  microsoftProvider,
} from "../FireBase/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleLoginWithGoogle, handleRegisterUser } from "../Redux/Authslice";
// import logo from "../images/DisployImg/logo.svg";
import logo from "../images/DisployImg/White-Logo2.png";
import ReCAPTCHA from "react-google-recaptcha";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessge, setErrorMessge] = useState("");
  const [errorMessgeVisible, setErrorMessgeVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  // console.log("errorMessgeVisible:", errorMessgeVisible); // Check if it's true
  // console.log("errorMessge:", errorMessge);
  //using for routing
  const navigate = useNavigate();

  const dispatch = useDispatch();

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
    // terms: Yup.boolean()
    //   .oneOf([true], "You must accept the terms and conditions")
    //   .required("You must accept the terms and conditions"),
    captcha: Yup.string().required("captcha is required."),
  });

  // const formik = useFormik({
  //   initialValues: {
  //     companyName: "",
  //     password: "",
  //     firstName: "",
  //     emailID: "",
  //     googleLocation: "",
  //     phoneNumber: "",
  //     lastName: "",
  //     // terms: false,
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     createUserWithEmailAndPassword(auth, values.emailID, values.password)
  //       .then((userCredential) => {
  //         const user = userCredential.user;
  //         const usertoken = user.za;
  //         // console.log({ usertoken, user });
  //         sendEmailVerification()
  //           .then(() => {
  //             // console.log("Verification email sent.");
  //             alert("Verification email sent.");
  //             const formData = new FormData();
  //             formData.append("OrganizationName", values.companyName);
  //             formData.append("Password", values.password);
  //             formData.append("FirstName", values.firstName);
  //             formData.append("LastName", values.lastName);
  //             formData.append("Email", values.emailID);
  //             formData.append("GoogleLocation", values.googleLocation);
  //             formData.append("Phone", values.phoneNumber);
  //             formData.append("UserTokan", usertoken);
  //             formData.append("Operation", "Insert");
  //             setLoading(true);

  //             let config = {
  //               method: "post",
  //               maxBodyLength: Infinity,
  //               url: ADD_REGISTER_URL,
  //               headers: {
  //                 "Content-Type": "multipart/form-data",
  //               },
  //               data: formData,
  //             };

  //             const response = dispatch(handleRegisterUser({ config }));
  //             if (response) {
  //               response
  //                 .then(() => {
  //                   window.localStorage.setItem("timer", JSON.stringify(18_00));
  //                   toast.success("Registration successfully.");
  //                   navigate("/screens");
  //                   setLoading(false);
  //                 })
  //                 .catch((error) => {
  //                   console.log(error);
  //                   setErrorMessgeVisible(true);
  //                   setErrorMessge(error.response.data);
  //                   setLoading(false);
  //                 });
  //             }
  //           })
  //           .catch((error) => {
  //             console.error(error);
  //             setLoading(false);
  //           });
  //       })
  //       .catch((error) => {
  //         console.log("error", error.message);
  //         setErrorMessgeVisible(true);
  //         setErrorMessge(error.message);
  //         var errorMessage = JSON.parse(error.message);
  //         switch (errorMessage.error.message) {
  //           case "ERROR_INVALID_EMAIL":
  //             alert("Your email address appears to be malformed.");
  //             console.log("ERROR_INVALID_EMAI");
  //             break;
  //           case "ERROR_WRONG_PASSWORD":
  //             alert("Your password is wrong.");
  //             break;
  //           case "ERROR_USER_NOT_FOUND":
  //             alert("User with this email doesn't exist.");
  //             break;
  //           case "ERROR_USER_DISABLED":
  //             alert("User with this email has been disabled.");
  //             break;
  //           case "ERROR_TOO_MANY_REQUESTS":
  //             alert("Too many requests. Try again later.");
  //             break;
  //           case "ERROR_OPERATION_NOT_ALLOWED":
  //             alert("Signing in with Email and Password is not enabled.");
  //             break;
  //           case "INVALID_LOGIN_CREDENTIALS":
  //             alert("Invaild Email Or Password");
  //             break;
  //           default:
  //             alert("An undefined Error happened.");
  //         }
  //         setLoading(false);
  //       });
  //   },
  // });

  const formik = useFormik({
    initialValues: {
      companyName: "",
      password: "",
      firstName: "",
      emailID: "",
      googleLocation: "",
      phoneNumber: "",
      lastName: "",
      captcha: "",
      // terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!isCheckboxChecked) {
        toast.error("Please check & accept the terms and conditions.");
        return; // Exit the submission process if checkbox is not checked
      }
      const formData = new FormData();
      formData.append("OrganizationName", values.companyName);
      formData.append("Password", values.password);
      formData.append("FirstName", values.firstName);
      formData.append("LastName", values.lastName);
      formData.append("Email", values.emailID);
      formData.append("GoogleLocation", values.googleLocation);
      formData.append("Phone", values.phoneNumber);
      // formData.append("UserTokan", usertoken);   // used Firebase token
      formData.append("Operation", "Insert");
      setLoading(true);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: ADD_REGISTER_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      const response = dispatch(handleRegisterUser({ config }));
      if (response) {
        response
          .then((res) => {
            if (res?.error?.message !== "Rejected") {
              window.localStorage.setItem("timer", JSON.stringify(18_00));
              toast.success("Registration successfully.");
              navigate("/");
              setLoading(false);
            } else {
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            setErrorMessgeVisible(true);
            setErrorMessge(error.response.data);
            setLoading(false);
          });
      }
    },
  });

  const { setFieldValue, values, getFieldProps } = formik;

  const SignInWithGoogle = async (data) => {
    //  return console.log(data);
    const formData = new FormData();

    formData.append("FirstName", data.name);
    formData.append("Email", data.email);
    formData.append("Phone", null);
    formData.append("Operation", "Insert");
    formData.append("googleID", data?.sub);

    const config = {
      method: "post",
      url: ADD_REGISTER_URL,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    // setTimeout(async () => {
    try {
      const response = await dispatch(handleLoginWithGoogle({ config }));
      if (!response) return;
      response
        .then(() => {
          window.localStorage.setItem("timer", JSON.stringify(18_00));
          toast.success("Sign up successfully.");
          // navigate("/screens");
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
          setErrorMessgeVisible(true);
          setErrorMessge("Registration failed.");
        });
    } catch (err) {
      console.log(err);
      setErrorMessgeVisible(true);
      setErrorMessge("Registration failed.");
    }
    // }, 1000);
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
          navigate("/", {
            state: { message: "Registration successfull !!" },
          });
        })
        .catch((error) => {
          console.log(error);
          setErrorMessgeVisible(true);
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
    } catch (err) {
      console.log(err);
    }
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
      {/* registration faild error msg display start*/}
      {errorMessgeVisible && (
        <div
          className="bg-[#fff2cd] px-5 py-3 border-b-2 border-SlateBlue shadow-md"
          style={{
            position: "fixed",
            top: "16px",
            right: "20px",
            zIndex: "999999",
          }}
        >
          <div className="flex text-SlateBlue  text-base font-normal items-center relative">
            <BsFillInfoCircleFill className="mr-1" />
            {errorMessge}
            <button
              className="absolute top-[-26px] right-[-26px] bg-white rounded-full p-1 "
              onClick={() => setErrorMessgeVisible(false)}
            >
              <AiOutlineClose className="text-xl  text-SlateBlue " />
            </button>
          </div>
        </div>
      )}
      {/* registration faild error msg display end*/}

      {/* registration form start*/}
      <div className="videobg login relative">
        <video src={video} autoPlay muted loop playsInline />
        <div className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center loginbg  lg:px-6 md:px-6 sm:px-2 xs:px-2 lg:mx-auto md:mx-auto sm:mx-auto xs:mx-2  lg:py-2 md:py-3 sm:py-5 xs:py-5 z-10">
            <div className="flex items-center pb-5">
              <img className="w-52 h-14" alt="logo" src={logo} />
            </div>
            <div className="w-full border-[#ffffff6e] border rounded-lg shadow-md md:mt-0  xl:p-0 lg:min-w-[600px] md:min-w-[600px] sm:min-w-auto xs:min-w-auto">
              <div className="p-3 sm:px-8 py-1">
                <div className="my-1 font-inter not-italic font-medium text-[24px] text-white mt-4">
                  Create account
                </div>
                <div className="mb-8 font-['Poppins'] not-italic font-normal text-[16px] text-white">
                  Fill in the fields below to sign up for an account.
                </div>
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
                          <div className="error">
                            {formik.errors.companyName}
                          </div>
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
                        type="tel"
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
                          <div className="error">
                            {formik.errors.phoneNumber}
                          </div>
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
                  </div>
                  <div className="flex items-start">
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
                      {/* Modal trigger */}
                      <p
                        className="ml-1 not-italic text-white font-medium decoration-white border-b cursor-pointer"
                        onClick={() => setShowModal(true)}
                      >
                        terms and conditions
                      </p>
                    </div>
                  </div>
                  <div className="relative lg:w-64 md:w-64 sm:max-w-[376px]">
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_CAPTCHA}
                      onChange={(e) => {
                        setFieldValue("captcha", e);
                      }}
                    />
                    {formik.errors.captcha && formik.touched.captcha && (
                      <div className="error">{formik.errors.captcha}</div>
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
                    <div className="flex ml-3 text-sm flex-wrap">
                      <label className="not-italic text-white font-medium">
                        I accept the
                      </label>
                       <Link to="/termsconditions">
                        <p className="lg:ml-1 not-italic text-white font-medium">
                          terms and conditions
                        </p>
                      </Link> 
                    </div>
                  </div> */}
                  {/* {formik.errors.terms && formik.touched.terms && (
                    <div className="error">{formik.errors.terms}</div>
                  )} */}
                  <button
                    type="submit"
                    className="w-full text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-lg py-3.5 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Create Your Account"}
                  </button>
                  <div className="flex lg:ml-3 text-sm flex-wrap">
                    <label className="not-italic text-white font-medium mb-3">
                      Already have an account?
                    </label>
                    <Link to="/">
                      <p className="lg:ml-1 not-italic text-white font-medium mb-3 hover:text-SlateBlue">
                        Sign in here
                      </p>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
            {/* login with google  */}
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
      {/* registration form end*/}
    </>
  );
};

export default Registration;
