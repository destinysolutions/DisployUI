import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import "././../Styles/sidebar.css";
const Navbar = () => {
  //show profile and notification box
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [showNotificationBox, setShowNotificationBox] = useState(false);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowProfileBox(!showProfileBox);
    setShowNotificationBox(false);
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    setShowNotificationBox(!showNotificationBox);
    setShowProfileBox(false);
  };

  useEffect(() => {
    const handleDocumentClick = () => {
      setShowProfileBox(false);
      setShowNotificationBox(false);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  //used for apply navigation
  const history = useNavigate();

  //for signout
  const handleSignOut = () => {
    localStorage.removeItem("hasSeenMessage");
    history("/");
  };

  return (
    // navbar component start
    <div className="w-full topbar  bg-white py-3 shadow-none">
      <div>
        <div className="flex-col flex">
          <div className="w-full">
            <div className=" justify-end items-center mx-auto px-4 flex relative">
              <img
                src="/NavbarIcons/Union.svg"
                alt="Union"
                className="m-1 cursor-pointer bg-lightgray"
              />
              {/* Notification box start */}
              <div className="relative">
                <img
                  src="/NavbarIcons/notification.svg"
                  alt="notification"
                  className="m-1 cursor-pointer relative bg-lightgray"
                  onClick={handleNotificationClick}
                />
                {showNotificationBox && (
                  <>
                    <div className="absolute top-[50px] right-0 bg-white rounded-lg border border-[#8E94A9] shadow-lg notificationpopup">
                      <div className="lg:flex md:flex sm:block items-start">
                        <div className="p-3">
                          <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Screen ID
                          </h4>
                          <p className="font-medium text-sm text-[#ACB0C7]">
                            HD-EF014
                          </p>
                        </div>
                        <div className="p-3">
                          <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Store
                          </h4>
                          <p className="font-medium text-sm text-[#ACB0C7]">
                            Store Name
                          </p>
                        </div>
                        <div className="p-3">
                          <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Location
                          </h4>
                          <p className="font-medium text-sm text-[#ACB0C7] break-words	w-[200px]">
                            132, My Street, Kingston, New York 12401.
                          </p>
                        </div>
                        <div className="p-3">
                          <h4 className="text-[#7C82A7] text-sm font-bold mb-1">
                            Status
                          </h4>
                          <p className="font-medium text-sm text-[#ACB0C7]">
                            Offline
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* Notification box end */}
              {/* profile box start */}
              <div className="relative">
                <img
                  src="/NavbarIcons/profile.svg"
                  alt="profile"
                  className="cursor-pointer profile"
                  onClick={handleProfileClick}
                />

                {showProfileBox && (
                  <>
                    <div className="absolute top-[50px]  right-0 bg-white rounded-lg border border-[#8E94A9] shadow-lg z-[999] loginpopup">
                      <div className="flex items-center space-x-3 cursor-pointer p-2">
                        <img
                          src="/NavbarIcons/profile.svg"
                          alt="profile"
                          className="cursor-pointer profileBox p-0"
                        />

                        <div className="">
                          <div className="text-[#7C82A7] font-semibold text-lg">
                            Randy Smith
                          </div>
                          <div className="text-[#ACB0C7] font-medium text-base">
                            Lead Developer
                          </div>
                        </div>
                      </div>
                      <div className="border-b-[1px] border-[#8E94A9]"></div>
                      <div className="p-2">
                        <div className="text-base font-medium mb-1 flex justify-between items-center">
                          My Account{" "}
                          <MdOutlineNavigateNext className="text-2xl text-gray" />
                        </div>
                        <div className="text-base font-medium mb-1 flex justify-between items-center">
                          Profile settings{" "}
                          <MdOutlineNavigateNext className="text-2xl text-gray" />
                        </div>
                      </div>
                      <div className="border-b-[1px] border-[#8E94A9]"></div>
                      <div className="flex justify-center items-center p-2">
                        <div className="mr-2">
                          <RiLogoutBoxRLine className="text-xl" />
                        </div>
                        <button
                          className="text-[#001737] font-bold text-base "
                          onClick={handleSignOut}
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* profile box end */}
            </div>
          </div>
        </div>
      </div>
    </div>
    // navbar component end
  );
};

export default Navbar;
