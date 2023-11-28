import "../Styles/loginRegister.css";
import {
  BsFillEyeFill,
  BsFillEyeSlashFill,
  BsFillInfoCircleFill,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { BsMicrosoft } from "react-icons/bs";
import { BsApple } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import { ADD_REGISTER_URL } from "./Api";
import video from "../../public/DisployImg/iStock-1137481126.mp4";
import {
  Googleauthprovider,
  appleProvider,
  auth,
  facebookProvider,
  microsoftProvider,
} from "../FireBase/firebase";
const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessge, setErrorMessge] = useState("");
  const [errorMessgeVisible, setErrorMessgeVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("errorMessgeVisible:", errorMessgeVisible); // Check if it's true
  console.log("errorMessge:", errorMessge);
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
  });

  const formik = useFormik({
    initialValues: {
      companyName: "",
      password: "",
      firstName: "",
      emailID: "",
      googleLocation: "",
      phoneNumber: "",
      lastName: "",
      // terms: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      auth
        .createUserWithEmailAndPassword(values.emailID, values.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("created", user);
          user
            .sendEmailVerification()
            .then(() => {
              console.log("Verification email sent.");
              alert("Verification email sent.");

              const formData = new FormData();

              formData.append("OrganizationName", values.companyName);
              formData.append("Password", values.password);
              formData.append("FirstName", values.firstName);
              formData.append("LastName", values.lastName);
              formData.append("Email", values.emailID);
              formData.append("GoogleLocation", values.googleLocation);
              formData.append("Phone", values.phoneNumber);
              formData.append("Operation", "Insert");
              setLoading(true);
              axios
                .post(ADD_REGISTER_URL, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then(() => {
                  history("/", {
                    state: { message: "Registration successfull !!" },
                  });
                  setLoading(false);
                  auth.signOut();
                })
                .catch((error) => {
                  console.log(error);
                  setErrorMessgeVisible(true);
                  setErrorMessge(error.response.data);
                  setLoading(false);
                });
            })
            .catch((error) => {
              console.error(error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log("error", error.message);
          setErrorMessgeVisible(true);
          setErrorMessge(error.message);
          var errorMessage = JSON.parse(error.message);
          switch (errorMessage.error.message) {
            case "ERROR_INVALID_EMAIL":
              alert("Your email address appears to be malformed.");
              console.log("ERROR_INVALID_EMAI");
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
              alert("Signing in with Email and Password is not enabled.");
              break;
            case "INVALID_LOGIN_CREDENTIALS":
              alert("Invaild Email Or Password");
              break;
            default:
              alert("An undefined Error happened.");
          }
          setLoading(false);
        });
    },
  });

  const SignInWithGoogle = async () => {
    try {
      const res = await auth.signInWithPopup(Googleauthprovider);
      const user = res.user;
      const formData = new FormData();

      formData.append("FirstName", user.displayName);
      formData.append("Email", user.email);

      formData.append("Phone", user.phoneNumber);
      formData.append("Operation", "Insert");
      axios
        .post(ADD_REGISTER_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          history("/", {
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
                  <div className="grid lg:grid-rows-4 md:grid-rows-4 sm:grid-rows-7 xs:grid-rows-7 lg:grid-flow-col md:grid-flow-col sm:grid-flow-rows lg:gap-4 md:gap-4 sm:gap-2 xs:gap-2">
                    <div className="relative">
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

                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter Your Name"
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
                          <div className="error">
                            {formik.errors.phoneNumber}
                          </div>
                        )}
                    </div>

                    <div className="relative">
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
                    <div className="relative">
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
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter Your Name"
                        className="formInput"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                      />
                      {formik.errors.lastName && formik.touched.lastName && (
                        <div className="error">{formik.errors.lastName}</div>
                      )}
                    </div>
                    <div className="relative">
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
      {/* registration form end*/}
    </>
  );
};

export default Registration;
