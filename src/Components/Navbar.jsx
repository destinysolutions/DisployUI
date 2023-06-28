import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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

  return (
    <div className="w-full topbar">
      <div className="">
        <div className="flex-col flex">
          <div className="w-full">
            <div className=" justify-end items-center mx-auto px-4 flex">
              <img
                src="/NavbarIcons/Union.svg"
                alt="Union"
                className="m-1 cursor-pointer"
              />
              <img
                src="/NavbarIcons/notification.svg"
                alt="notification"
                className="m-1 cursor-pointer"
                onClick={handleNotificationClick}
              />
              <img
                src="/NavbarIcons/profile.svg"
                alt="profile"
                className="cursor-pointer profile"
                onClick={handleProfileClick}
              />
            </div>
          </div>
        </div>
      </div>
      {showProfileBox && (
        <>
          <div className="absolute top-[47px] right-[25px]  text-[35px]  z-20">
            <img
              src="/DisployImg/Polygon.svg"
              alt="notification"
              className=" cursor-pointer profilePopup"
            />
          </div>
          <div className="absolute top-[61px] right-0 mr-4 bg-white rounded-lg border border-[#635b5b] shadow-lg z-10">
            <div className="flex justify-center items-center space-x-3 cursor-pointer p-3">
              <img
                src="/NavbarIcons/profile.svg"
                alt="profile"
                className="cursor-pointer profileBox"
              />

              <div>
                <div className="text-[#7C82A7] font-bold text-lg">
                  Randy Smith
                </div>
                <div className="text-[#ACB0C7] font-bold text-base">
                  Lead Developer
                </div>
              </div>
            </div>
            <div className="border-b-[1px] border-[#8E94A9]"></div>
            <div className="p-3">
              <div>My account</div>
              <div>Profile settings</div>
            </div>
            <div className="border-b-[1px] border-[#8E94A9]"></div>
            <div className="flex justify-center items-center p-3">
              <div className="mr-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.75 9.75H6.75V8.25H15.75V9.75Z"
                    fill="#001737"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.6553 5.84473L16.2803 8.46972C16.5732 8.76259 16.5732 9.23749 16.2803 9.53037L13.6553 12.1554L12.5947 11.0947L14.6893 9.00004L12.5947 6.90538L13.6553 5.84473Z"
                    fill="#001737"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 3C12 2.58579 11.6642 2.25 11.25 2.25H2.25C1.83578 2.25 1.5 2.58579 1.5 3V15C1.5 15.4142 1.83578 15.75 2.25 15.75H11.25C11.6642 15.75 12 15.4142 12 15V12.75H10.5V14.25H3V3.75H10.5V5.25H12V3Z"
                    fill="#001737"
                  />
                </svg>
              </div>
              <Link to="/">
                <button className="text-[#001737] font-bold text-base ">
                  Sign out
                </button>
              </Link>
            </div>
          </div>
        </>
      )}

      {showNotificationBox && (
        <>
          <div className="absolute top-[47px] right-[65px]  text-[35px]  z-20">
            <img
              src="/DisployImg/Polygon.svg"
              alt="notification"
              className="cursor-pointer profilePopup"
            />
          </div>
          <div className="absolute top-[61px] right-8 bg-white rounded-lg border border-[#635b5b] shadow-lg z-10">
            <div className="lg:flex md:flex sm:block">
              <div className="p-3">
                <h4 className="text-[#7C82A7] text-[15px] font-bold">
                  Screen ID
                </h4>
                <p className="font-semibold text-[13px] text-[#ACB0C7]">
                  HD-EF014
                </p>
              </div>
              <div className="p-3">
                <h4 className="text-[#7C82A7] text-[15px] font-bold">Store</h4>
                <p className="font-semibold text-[13px] text-[#ACB0C7]">
                  Store Name
                </p>
              </div>
              <div className="p-3">
                <h4 className="text-[#7C82A7] text-[15px] font-bold">
                  Location
                </h4>
                <p className="font-semibold text-[13px] text-[#ACB0C7] break-words	w-[200px]">
                  132, My Street, Kingston, New York 12401.
                </p>
              </div>
              <div className="p-3">
                <h4 className="text-[#7C82A7] text-[15px] font-bold">Status</h4>
                <p className="font-semibold text-[13px] text-[#ACB0C7]">
                  Offline
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
