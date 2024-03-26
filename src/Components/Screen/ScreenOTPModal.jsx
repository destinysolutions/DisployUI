import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { OTP_SCREEN_VERIFY, OTP_VERIFY } from "../../Pages/Api";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { GET_ALL_ORGANIZATION_MASTER } from "../../admin/AdminAPI";
import toast from "react-hot-toast";
// import BlackLogo from "../../images/DisployImg/BlackLogo.svg";
import BlackLogo from "../../images/DisployImg/Black-Logo2.png";
import { getMenuAll, getMenuPermission } from "../../Redux/SidebarSlice";
import disploy_tv_img from "../../images/ScreenImg/disploy-tv-img.png";
import { useDispatch } from "react-redux";
import VerifyOTPModal from "./VerifyOTPModal";

const ScreenOTPModal = ({ setShowOTPModal, showOTPModal }) => {
  const history = useNavigate();
  const [errorMessge, setErrorMessge] = useState(false);

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpModelValues, setOtpModelValues] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [screen, setScreen] = useState();
  const [permissions, setPermissions] = useState({
    isDelete: false,
    isSave: false,
    isView: false,
  });
  const [permissionsNewScreen, setPermissionsNewScreen] = useState({
    isSave: false,
  });
  const [openVerifyModel, setOpenVerifyModel] = useState(false);
  const [OTPdata, setOTPData] = useState();

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const otpModalRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  useEffect(() => {
    dispatch(getMenuAll()).then((item) => {
      const findData = item.payload?.data?.menu.reduce((result, menuItem) => {
        if (menuItem.submenu && Array.isArray(menuItem.submenu)) {
          const submenuItem = menuItem.submenu.find(
            (submenuItem) => submenuItem.pageName === "New Screen"
          );
          if (submenuItem) {
            result = submenuItem;
          }
        }
        return result;
      }, null);

      if (findData) {
        const ItemID = findData.moduleID;
        const payload = { UserRoleID: user.userRole, ModuleID: ItemID };
        dispatch(getMenuPermission(payload)).then((permissionItem) => {
          if (
            Array.isArray(permissionItem.payload.data) &&
            permissionItem.payload.data.length > 0
          ) {
            setPermissionsNewScreen(permissionItem.payload.data[0]);
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    dispatch(getMenuAll()).then((item) => {
      const findData = item.payload.data.menu.find(
        (e) => e.pageName === "Screens"
      );
      if (findData) {
        const ItemID = findData.moduleID;
        const payload = { UserRoleID: user.userRole, ModuleID: ItemID };
        dispatch(getMenuPermission(payload)).then((permissionItem) => {
          if (
            Array.isArray(permissionItem.payload.data) &&
            permissionItem.payload.data.length > 0
          ) {
            setPermissions(permissionItem.payload.data[0]);
          }
        });
      }
    });
  }, []);

  const handleOtpChange = (index, value) => {
    const updatedOtpValues = [...otpValues];
    updatedOtpValues[index] = value;
    setOtpValues(updatedOtpValues);
    if (value.length === 1 && index < otpRefs.length - 1) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpModelChange = (index, value) => {
    const updatedOtpValues = [...otpModelValues];
    updatedOtpValues[index] = value;
    setOtpModelValues(updatedOtpValues);
    if (value.length === 1 && index < otpModalRefs.length - 1) {
      otpModalRefs[index + 1].current.focus();
    }
  };

  const completeOtp = otpValues.join("");
  const completeModelOtp = otpModelValues.join("");

  const verifyOTP = () => {
    let data = JSON.stringify({ otp: completeOtp });

    let config = {
      method: "post",
      url: OTP_VERIFY,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data,
    };

    toast.loading("Validating....");
    axios
      .request(config)
      .then((response) => {
        // console.log(response);
        if (response.data.status === 200) {
          if (response?.data?.data?.[0]?.IsNeedToValidate === true) {
            setOpenVerifyModel(true);
            setOTPData(response?.data);
          } else {
          history("/newscreendetail", {
            state: {
              otpData: response?.data?.data,
              message: response?.data?.message,
            },
          });
          }
          toast.remove();
        } else {
          setErrorMessge(response?.data?.message);
          toast.remove();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };

  const verifyOTPmodal = () => {

    let config = {
      method: "get",
      url: `${OTP_SCREEN_VERIFY}?OTP=${completeModelOtp}&ScreenID=${OTPdata?.data?.[0]?.ScreenID}`,
      headers: {
        Authorization: authToken,
      },
    };

    toast.loading("Validating....");
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status === true) {
          setOpenVerifyModel(false);
          history("/newscreendetail", {
            state: {
              otpData: OTPdata?.data,
              message: OTPdata?.message,
            },
          });
          toast.remove();
        } else {
          setOpenVerifyModel(false);
          setErrorMessge(response?.data?.message);
          toast.remove();
        }
      })
      .catch((error) => {
        setOpenVerifyModel(false);
        console.log(error);
        toast.remove();
      });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        verifyOTP();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [completeOtp]); // Empty dependency array means this effect runs once after the initial render

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_ORGANIZATION_MASTER,
      headers: { Authorization: authToken },
    };
    axios
      .request(config)
      .then((response) => {
        setScreen(response.data.data[0].screen);
        otpRefs[0].current.focus();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // if (showSearchModal) {
    //   window.document.body.style.overflow = "hidden";
    // }
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event?.target) &&
        showOTPModal
      ) {
        // window.document.body.style.overflow = "unset";
        setShowOTPModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside, showOTPModal]);

  function handleClickOutside() {
    setShowOTPModal(false);
    // window.document.body.style.overflow = "unset";
    // setSearchTerm("");
  }

  useEffect(() => {
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        setShowOTPModal(false);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  const toggleModal = () => {
    setOpenVerifyModel(!openVerifyModel);
  };

  return (
    <>
      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
        <div
          className={`relative w-auto my-6 lg:mx-auto md:mx-auto lg:max-w-5xl md:max-w-3xl sm:max-w-xl xs:w-full sm:mx-3 xs:mx-3`}
        >
          <div
            ref={modalRef}
            className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#A7AFB7] rounded-t">
              <h3 className="text-xl font-medium">New Screen</h3>
              <button
                className="p-1 text-xl"
                onClick={() => setShowOTPModal(false)}
              >
                <AiOutlineCloseCircle className="text-3xl text-primary" />
              </button>
            </div>
            <div className="relative lg:p-5 md:p-5 sm:p-3 xs:p-2 flex-auto">
              <div className="flex items-center justify-center mb-4">
                <img src={BlackLogo} className="w-52" />
              </div>

              <div className="flex w-7/12 mx-auto items-center justify-center relative mb-4">
                <img src={disploy_tv_img} alt="" />
              </div>

              <div className="mx-auto">
                <div className="w-full">
                  <div className="font-normal lg:text-lg md:text-lg sm:text-base xs:text-sm text-[#000000] text-center">
                    Enter the 6-character pairing code?
                  </div>

                  <div
                    id="otp"
                    className="flex flex-row justify-center text-center px-2"
                  >
                    {otpValues.map((value, index) => (
                      <div key={index}>
                        <input
                          ref={otpRefs[index]}
                          className="sm:m-2 xs:m-1 border h-10 w-10 text-center form-control rounded border-gray"
                          type="text"
                          value={value}
                          maxLength="1"
                          onChange={(e) =>
                            handleOtpChange(
                              index,
                              e.target.value.toLocaleUpperCase()
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center text-center text-red text-xl my-2 font-semibold">
                    {errorMessge}
                  </div>

                  <div className="flex justify-center text-center">
                    <p className="text-[#515151] text-sm max-w-lg">
                      To get pair code, please install Disploy app on your
                      Players (Android, LG, Samsung, FireStick, Windows, etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {(permissions.isSave || permissionsNewScreen.isSave) && (
              <div className="flex items-center justify-center pb-4">
                <button
                  className="text-white bg-SlateBlue hover:bg-primary font-semibold lg:px-8 md:px-6 sm:px-6 xs:px-6 lg:py-3 md:py-2 sm:py-2 xs:py-2 lg:text-base md:text-sm sm:text-sm xs:text-sm rounded-[45px]"
                  type="button"
                  onClick={verifyOTP}
                >
                  Continue
                </button>
              </div>
            )}

            {openVerifyModel && (
              <VerifyOTPModal
                toggleModal={toggleModal}
                otpValues={otpModelValues}
                handleOtpChange={handleOtpModelChange}
                otpRefs={otpModalRefs}
                verifyOTP={verifyOTPmodal}
                errorMessge={errorMessge}
              />
            )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-10 bg-black"></div>

    </>
  );
};

export default ScreenOTPModal;
