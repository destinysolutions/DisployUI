import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine, RiUserShared2Fill } from "react-icons/ri";
import "././../Styles/sidebar.css";
import axios from "axios";
import { GET_ALL_PLANS, SELECT_BY_ID_USERDETAIL } from "../Pages/Api";
import { useSelector } from "react-redux";
import { auth } from "../FireBase/firebase";
import { MdNotifications, MdOutlineLogout, MdOutlineNavigateNext } from "react-icons/md";
import { handleLogout } from "../Redux/Authslice";
import { useDispatch } from "react-redux";
import notificationIcon from "../images/NavbarIcons/notification.svg"
import NavbarNotification from "./NavbarNotification";
import toast from "react-hot-toast";
import { handleGetAllPlans } from "../Redux/CommonSlice";
import PurchaseUserPlan from "./Common/PurchaseUserPlan";

const getInitials = (name) => {
  let initials;
  const nameSplit = name.split(" ");
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
    initials =
      nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1);
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1);
  } else return;

  return initials.toUpperCase();
};

const color = "#e4aa07";
export const createImageFromInitials = (size, name, color) => {
  if (name == null) return;
  name = getInitials(name);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = canvas.height = size;

  context.fillStyle = "#000";
  context.fillRect(0, 0, size, size);

  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.font = `${size / 1.5}px Trirong`;
  context.fillText(name, size / 2, size / 2);

  return canvas.toDataURL();
};

const Navbar = () => {
  //show profile and notification box
  const dispatch = useDispatch();
  const { user, userDetails, token } = useSelector((state) => state.root.auth);
  console.log('user', user)
  const authToken = `Bearer ${token}`;
  const history = useNavigate();
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const [regsiterData, setRegisterData] = useState([]);
  const [purchasePlan, setPurchasePlan] = useState(false)
  const [selectPlan, setSelectPlan] = useState("")
  const [myplan, setmyPlan] = useState([]);

  // Parse the createdDate and calculate the trial end date
  const createdDate = new Date(regsiterData.createdDate);
  const trialEndDate = new Date(createdDate);
  trialEndDate.setDate(trialEndDate.getDate() + regsiterData.trialDays);

  // Calculate the current date
  const currentDate = new Date();

  // Calculate the remaining days
  const daysRemaining = Math.ceil(
    (trialEndDate - currentDate) / (1000 * 60 * 60 * 24)
  );



  const fetchAllPlan = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ALL_PLANS,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
    }
    dispatch(handleGetAllPlans({ config })).then((res) => {
      if (res?.payload?.status === 200) {
        setmyPlan(res?.payload?.data)
      }
    }).catch((err) => {
      console.log('err', err)
    })
  }

  useEffect(() => {
    fetchAllPlan()
  }, [])



  const handleProfileClick = (e) => {
    if ((userDetails?.isTrial === false) && (userDetails?.isActivePlan === false) && (user?.userDetails?.isRetailer === false)) {
      setShowProfileBox(false);
    } else {
      e.stopPropagation();
      setShowProfileBox(!showProfileBox);
      setShowNotificationBox(false);
    }
  };

  const handleNotificationClick = (e) => {
    if ((userDetails?.isTrial === false) && (userDetails?.isActivePlan === false) && (user?.userDetails?.isRetailer === false)) {
      setShowProfileBox(false);
    } else {
      e.stopPropagation();
      setShowNotificationBox(!showNotificationBox);
      setShowProfileBox(false);
    }
  };

  // useEffect(() => {
  //   const handleDocumentClick = () => {
  //     setShowProfileBox(false);
  //     setShowNotificationBox(false);
  //   };

  //   document.addEventListener("click", handleDocumentClick);

  //   return () => {
  //     document.removeEventListener("click", handleDocumentClick);
  //   };
  // }, []);

  //used for apply navigation
 

  return (
    // navbar component start
    <>
      <div className="w-full topbar bg-white shadow-lg top-0 fixed z-[21]">
        <div>
          <div className="flex-col flex">
            <div className="w-full">
              {user?.isTrial && user?.userDetails?.isRetailer === false && !user?.isActivePlan && (
                <div>
                  <div className="flex items-center justify-center gap-2 bg-[#343c5c] p-3">
                    <p className="text-white">You have {user?.trialDays} Trial Days Remaining</p>
                    <span className="uppercase px-4 text-SlateBlue font-bold cursor-pointer hover:text-white hover:bg-SlateBlue rounded-full"
                      onClick={() => {
                        setPurchasePlan(true)
                      }}
                    >Purchase Plan Now!</span>
                  </div>
                </div>
              )}
              <div className="justify-end items-center py-2 mx-auto gap-3 px-4 flex relative">
                {/* <div className="mr-3 dayremaining-box">
                {daysRemaining > 0 ? (
                  <p className="text-sm ">
                    Trial Days Remaining : {daysRemaining}
                  </p>
                ) : (
                  <p>Your trial has expired.</p>
                )}
              </div> */}
                {/* <img
                src="/NavbarIcons/Union.svg"
                alt="Union"
                className="m-1  bg-lightgray"
              /> */}
                {/* Notification box start */}
                <div className="relative">
                  <img
                    src={notificationIcon}
                    alt="notification"
                    className="m-1 cursor-pointer relative bg-lightgray"
                    onClick={handleNotificationClick}
                  />
                  {showNotificationBox && (
                    <NavbarNotification setShowNotificationBox={setShowNotificationBox} />
                  )}
                </div>
                {/* Notification box end */}
                {/* profile box start */}
                <div className="relative">
                  <div>
                    {userDetails?.profilePhoto == "" ? (
                      <img
                        src={createImageFromInitials(
                          500,
                          userDetails?.firstName,
                          color
                        )}
                        alt="profile"
                        className="profile cursor-pointer"
                        onClick={handleProfileClick}
                      />
                    ) : (
                      <img
                        src={userDetails?.profilePhoto}
                        alt="profile"
                        className="profile cursor-pointer"
                        onClick={handleProfileClick}
                      />
                    )}

                    {showProfileBox && (
                      <>
                        <div className="absolute top-[50px]  right-0 bg-white rounded-lg border border-[#8E94A9] shadow-lg z-[999] loginpopup">
                          <div className="flex items-center space-x-3  p-2">
                            {userDetails?.profilePhoto === "" ? (
                              <img
                                src={createImageFromInitials(500, userDetails?.firstName, color)}
                                alt="profile"
                                className=" profile rounded-full "
                                onClick={handleProfileClick}
                              />
                            ) : (
                              <img
                                src={userDetails?.profilePhoto}
                                alt="profile"
                                className=" profile rounded-full"
                                onClick={handleProfileClick}
                              />
                            )}
                            <div>
                              <div className="font-semibold text-lg capitalize">
                                {userDetails?.firstName} {userDetails?.lastName}
                              </div>
                            </div>
                          </div>
                          <div className="border-b-[1px] border-[#8E94A9]"></div>

                          <div className="flex justify-start items-center p-2">
                            <div className="mr-2">
                              <RiUserShared2Fill className="text-xl" />
                            </div>
                            <Link to="/userprofile">
                              <button className="text-[#001737] font-bold text-base ">
                                My Account
                              </button>
                            </Link>
                          </div>

                          <div className="border-b-[1px] border-[#8E94A9]"></div>
                          <div className="flex justify-start items-center p-2">
                            <div className="mr-2">
                              <MdOutlineLogout className="text-xl" />
                            </div>
                            <button
                              className="text-[#001737] font-bold text-base "
                              onClick={() => {
                                toast.loading("Logout...");
                                setTimeout(() => {
                                  dispatch(handleLogout());
                                  toast.remove();
                                }, 1000);
                              }}
                            >
                              Sign out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {Array.isArray(userDetails) &&
                    userDetails.map((data) => {
                      const imgSrc = "";
                      if (data?.email) return null;
                      // <div key={data?.orgSingupID}>
                      //   {data?.image == null ? (
                      //     <img
                      //       src={
                      //         imgSrc?.length <= 0
                      //           ? createImageFromInitials(
                      //               500,
                      //               data?.firstName,
                      //               color
                      //             )
                      //           : imgSrc
                      //       }
                      //       alt="profile"
                      //       className=" profile"
                      //       onClick={handleProfileClick}
                      //     />
                      //   ) : (
                      //     <img
                      //       src={data?.image}
                      //       alt="profile"
                      //       className=" profile"
                      //       onClick={handleProfileClick}
                      //     />
                      //   )}

                      //   {showProfileBox && (
                      //     <>
                      //       <div className="absolute top-[50px]  right-0 bg-white rounded-lg border border-[#8E94A9] shadow-lg z-[999] loginpopup">
                      //         <div className="flex items-center space-x-3  p-2">
                      //           {data?.image == null ? (
                      //             <img
                      //               src={
                      //                 imgSrc?.length <= 0
                      //                   ? createImageFromInitials(
                      //                       500,
                      //                       data?.firstName,
                      //                       color
                      //                     )
                      //                   : null
                      //                 // : imgSrc
                      //               }
                      //               alt="profile"
                      //               className=" profile"
                      //               onClick={handleProfileClick}
                      //             />
                      //           ) : (
                      //             <img
                      //               src={data?.image}
                      //               alt="profile"
                      //               className=" profile"
                      //               onClick={handleProfileClick}
                      //             />
                      //           )}
                      //           <div>
                      //             <div className="text-[#7C82A7] font-semibold text-lg">
                      //               {data?.firstName}
                      //             </div>
                      //             {/* <div className="text-[#ACB0C7] font-medium text-base">
                      //         Lead Developer
                      //       </div> */}
                      //           </div>
                      //         </div>
                      //         <div className="border-b-[1px] border-[#8E94A9]"></div>
                      //         <div
                      //         //className="p-2"
                      //         >
                      //           {/* <Link to="/userprofile">
                      //           <div className="text-base font-medium mb-1 flex justify-between items-center">
                      //             My Account
                      //             <MdOutlineNavigateNext className="text-2xl text-gray" />
                      //           </div>
                      //         </Link> */}
                      //           {/* <div className="text-base font-medium mb-1 flex justify-between items-center">
                      //           Profile settings
                      //           <MdOutlineNavigateNext className="text-2xl text-gray" />
                      //         </div> */}
                      //         </div>
                      //         {/* <div className="border-b-[1px] border-[#8E94A9]"></div> */}
                      //         <div className="flex justify-center items-center p-2">
                      //           <div className="mr-2">
                      //             <RiLogoutBoxRLine className="text-xl" />
                      //           </div>
                      //           <button
                      //             className="text-[#001737] font-bold text-base "
                      //             onClick={handleSignOut}
                      //           >
                      //             Sign out
                      //           </button>
                      //         </div>
                      //       </div>
                      //     </>
                      //   )}
                      // </div>
                    })}
                </div>

                {/* profile box end */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {purchasePlan && (
        <PurchaseUserPlan setPurchasePlan={setPurchasePlan} purchasePlan={purchasePlan} selectPlan={selectPlan} setSelectPlan={setSelectPlan} userPlanType="" myplan={myplan} />
      )}
    </>

    // navbar component end
  );
};

export default Navbar;
