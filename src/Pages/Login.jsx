import "../Styles/loginRegister.css";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { BsMicrosoft } from "react-icons/bs";
import { BsApple } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useEffect, useState } from "react";
const Login = () => {
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  //const [registeredUsers, setRegisteredUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const history = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token); // Check the token value in the console
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("http://192.168.1.219/api/Register/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log(response); // Check the response object in the console

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        setLoggedIn(true);
      } else {
        // Handle authentication error
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ emailID, password });
  };

  useEffect(() => {
    if (isLoggedIn) {
      history("/dashboard");
    } else {
      history("/");
    }
  }, []);
  return (
    <>
      <div className="main login">
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
                      value={emailID}
                      onChange={(e) => setEmailID(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    </div>
                  </div>
                  <Link to="/dashboard">
                    <button
                      type="submit"
                      className="w-full text-[#FFFFFF] bg-[#002359] not-italic font-medium rounded-lg py-3.5 text-center text-base mt-4"
                      //onClick={handleSubmit}
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
    </>
  );
};

export default Login;
