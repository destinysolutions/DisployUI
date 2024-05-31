import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createImageFromInitials } from '../Components/Navbar';
import { handleLogout } from '../Redux/Authslice';
import { RiUserShared2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { MdOutlineLogout } from 'react-icons/md';
import toast from 'react-hot-toast';


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


const SalesManNavbar = () => {
    const dispatch = useDispatch();
    const { user, userDetails, token } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const [showProfileBox, setShowProfileBox] = useState(false);


    const handleProfileClick = (e) => {
        if ((userDetails?.isTrial === false) && (userDetails?.isActivePlan === false) && (user?.userDetails?.isRetailer === false)) {
            setShowProfileBox(false);
        } else {
            e.stopPropagation();
            setShowProfileBox(!showProfileBox);
        }
    };

    return (
        <>
        <div className="w-full topbar bg-white shadow-lg top-0 fixed z-[21]">
        <div>
          <div className="flex-col flex">
            <div className="w-full">
              <div className="justify-end items-center py-2 mx-auto gap-3 px-4 flex relative">
                <div className="relative">
                  <div className='flex items-center flex-row'>
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
                    <label>{userDetails?.firstName}{" "} {userDetails?.lastName}</label>

                   {/* {showProfileBox && (
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
                            )}*/}
                  </div>
                 
                </div>

                {/* profile box end */}
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
    )
}

export default SalesManNavbar
