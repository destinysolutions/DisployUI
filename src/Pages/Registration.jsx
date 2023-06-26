
import "../Styles/register.css";
import { BsFillEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Registration = () => {
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
                  Create account
                </div>
                <div className="mb-8 font-['Poppins'] not-italic font-normal text-[16px] text-black">
                  Fill in the fields below to sign up for an account.
                </div>
                <form className="space-y-3 md:space-y-5">
                  <div className="relative">
                    <label className="formLabel">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter Your Name"
                      className="formInput"
                      required=""
                    />
                  </div>
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
                    </div>{" "}
                  </div>
                  <button
                    type="submit"
                    className="w-full text-[#FFFFFF] bg-[#002359] not-italic font-medium rounded-lg py-3.5 text-center text-base"
                  >
                    Create Your account
                  </button>
                  <div className="lg:flex lg:ml-3 text-sm sm:block">
                    <label className="not-italic text-[#808080] font-medium">
                      Already have an account?
                    </label>
                    <Link to="/">
                      <p className="lg:ml-1 not-italic text-[#3871E1] font-medium">
                        Sign in here
                      </p>
                    </Link>
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

export default Registration;
