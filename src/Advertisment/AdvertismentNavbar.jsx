
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


const AdvertismentNavbar = () => {
  const dispatch = useDispatch();
  const { user, userDetails, token } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [showProfileBox, setShowProfileBox] = useState(false);

  const handleProfileClick = (e) => {
    if ((userDetails?.isSalesMan === true) && (userDetails?.isActivePlan === false) && (user?.userDetails?.isRetailer === false)) {
      setShowProfileBox(false);
    } else {
      e.stopPropagation();
      setShowProfileBox(!showProfileBox);
    }
  };

  return (
    <>
      <div className="w-full topbar  bg-white py-3 shadow-none">
        <div>
          <div className="flex-col flex">
            <div className="w-full">
              <div className=" justify-end items-center mx-auto px-4 flex relative">
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
          </div>
        </div>
      </div>
    </>
  )
}

export default AdvertismentNavbar
