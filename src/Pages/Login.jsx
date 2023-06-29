import "../Styles/register.css";
import { BsFillEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="main">
        <div className="bg-cover bg-no-repeat h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
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
                <form className="space-y-3 md:space-y-5">
                  <div className="relative">
                    <label className="formLabel">Email address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="formInput"
                      placeholder="Enter Your Email Address"
                      required=""
                    />
                  </div>
                  <div className="relative">
                    <label className="formLabel">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter Your Password"
                      className="formInput"
                      required=""
                    />
                    <div className="icon">
                      <BsFillEyeFill />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        aria-describedby="terms"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required=""
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
                      <Link to="/forgotpassword">
                        <p className="lg:ml-6 not-italic text-[#3871E1] font-medium">
                          Lost password?
                        </p>
                      </Link>
                    </div>{" "}
                  </div>
                  <Link to="/dashboard">
                    <button
                      type="submit"
                      className="w-full text-[#FFFFFF] bg-[#002359] not-italic font-medium rounded-lg py-3.5 text-center text-base mt-4"
                    >
                      Sign in
                    </button>
                  </Link>
                  <div className="lg:flex lg:ml-3 text-sm sm:block">
                    <label className="not-italic text-[#808080] font-medium">
                      Don’t have an account, yet?
                    </label>
                    <Link to="/register">
                      <p className="lg:ml-1 not-italic text-[#3871E1] font-medium">
                        Sign up here
                      </p>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="socialIcon socialIcon1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 488 512"
                >
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>{" "}
              </div>
              <div className="socialIcon socialIcon2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                </svg>
              </div>
              <div className="socialIcon socialIcon3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 384 512"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
              </div>
              <div className="socialIcon socialIcon4">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8793 11.8793H0V0H11.8793V11.8793Z"
                    fill="#00072E"
                  />
                  <path
                    d="M24.9954 11.8793H13.1163V0H24.9954V11.8793Z"
                    fill="#00072E"
                  />
                  <path
                    d="M11.879 24.9998H0V13.1206H11.879V24.9998Z"
                    fill="#00072E"
                  />
                  <path
                    d="M24.9954 24.9998H13.1163V13.1206H24.9954V24.9998Z"
                    fill="#00072E"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
