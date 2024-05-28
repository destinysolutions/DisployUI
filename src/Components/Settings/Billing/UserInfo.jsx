import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import AddCreditCard from "../../../admin/AddCreditCard";
import { useSelector } from "react-redux";
import { handleAddCard, handleGetBillingByID } from "../../../Redux/AdminSettingSlice";
import { ADD_CREDIT_CARD, CANCEL_SUBSCRIPTION, GET_BILLING_BY_ID, INCREASE_TRIAL_DAYS } from "../../../Pages/Api";
import { useDispatch } from "react-redux";
import { IncreaseTrialDays, handleCancelSubscription } from "../../../Redux/PaymentSlice";
import { capitalizeFirstLetter, extractSubstring, getDaysPassed, getDifferenceInDays } from "../../Common/Common";
import moment from "moment";
import toast from "react-hot-toast";

const UserInfo = ({ setShowBillingProfile, showBillingProfile, cardList, userPlan, customerData }) => {

  const dispatch = useDispatch()
  const { user, token } = useSelector((s) => s.root.auth);
  console.log('user', user)
  const authToken = `Bearer ${token}`;
  const [newCardShow, setNewCardShow] = useState(false);
  const [rangeValue, setRangeValue] = useState(getDaysPassed(userPlan?.startDate, new Date()));

  const onSubmit = () => {
    const Params = {

    }
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADD_CREDIT_CARD}}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
      data: JSON.stringify(Params)
    }
    dispatch(handleAddCard({ config }))
      .then((res) => {
        if (res?.payload?.status) {

        }
      })
      .catch((error) => console.log('error', error))
    setNewCardShow(!newCardShow);
  };

  const toggleModal = () => {
    setNewCardShow(!newCardShow);
  };

  const CancelSubscription = (email) => {
    const Params = {
      Email: email
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${CANCEL_SUBSCRIPTION}}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
      data: JSON.stringify(Params)
    }
    dispatch(handleCancelSubscription({ config }))
      .then((res) => {
        if (res?.payload?.status) {

        }
      })
      .catch((error) => console.log('error', error))
  }

  const handleIncreaseTrial = (email) => {
    const Params = {
      Email: email,
      Days: rangeValue
    }
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${INCREASE_TRIAL_DAYS}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
      data: JSON.stringify(Params)
    }
    dispatch(IncreaseTrialDays({ config }))
      .then((res) => {
        if (res?.payload?.status) {
          toast.error(res?.payload?.message)
        } else {
          toast.error(res?.payload?.message)
        }
      })
      .catch((error) => console.log('error', error))
  }


  const handleChange = (event) => {
    // Extract the value from the event
    const value = event.target.value;
    // Update the state with the new value
    setRangeValue(value);
  };

  return (
    <>
      <div className="flex items-center justify-between mx-2 mb-5 mt-3">
        <div className="title">
          <h2
            className="font-bold text-xl flex gap-2 cursor-pointer"
            onClick={() => setShowBillingProfile(false)}
          >
            <IoChevronBack size={30} />
            User Information
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap mb-5">
        <div className="w-full lg:w-1/2 pl-5 pr-3 mb-4">
          <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 min-h-full m-1">
            <div className="user-details text-center border-b border-light-blue mb-4">
              <span className="user-img">
                <img src={customerData?.profilePhoto} alt="Profile Not Found" />
              </span>
              <span className="user-name my-2">{customerData?.firstName} {" "} {customerData?.lastName}</span>
              <span className="user-designation">{customerData?.userRoleName}</span>
              <div className="total-screens-count mt-2 mb-4">
                <span className="screen-icon mr-3">
                  <i className="fa fa-tv text-blue text-2xl"></i>
                </span>
                {/*<span className="screen-count text-left">
                  <strong>50</strong>
                  <p>Total Screens</p>
  </span>*/}
              </div>
            </div>
            <div className="user-pro-details text-base">
              <h3 className="user-name my-2">Details</h3>
              <div className="flex mb-2">
                <label>User ID:</label>
                <span>#${customerData?.orgUserID}</span>
              </div>
              <div className="flex mb-2">
                <label>User Name:</label>
                <span>{customerData?.firstName} {" "} {customerData?.lastName}</span>
              </div>
              <div className="flex mb-2">
                <label>Company Name:</label>
                <span>{customerData?.company}</span>
              </div>
              <div className="flex mb-2">
                <label>Email:</label>
                <span>{customerData?.email}</span>
              </div>
              <div className="flex mb-2">
                <label>Status:</label>
                <span className="user-designation">Active</span>
              </div>
              <div className="flex mb-2">
                <label>Role::</label>
                <span>{customerData?.userRoleName}</span>
              </div>
              <div className="flex mb-2">
                <label>Contact:</label>
                <span>{customerData?.phone}</span>
              </div>
              <div className="flex mb-2">
                <label>Language:</label>
                <span>{customerData?.languageName}</span>
              </div>
              <div className="flex mb-2">
                <label>Country:</label>
                <span>{customerData?.countryName}</span>
              </div>
              {/*<div className="flex justify-center w-full mt-2">
                <button className="text-white bg-blue-700 hover:bg-blue-800 rounded-full text-base px-8 py-2 text-center mr-3">
                  Edit
                </button>
                <button className="bg-[#FF0000] rounded-full px-6 py-1 text-white hover:bg-primary text-base ">
                  {" "}
                  Suspend
                </button>
  </div>*/}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 pr-5 pl-3 mb-4 ">
          <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 min-h-full">
            <div className="user-pro-details text-base">
              <h3 className="user-name my-2">Current Plan</h3>
              <h4 className="text-base font-medium">Your Current Plan {extractSubstring(userPlan?.description)}</h4>
              <p className="mb-4">A simple start for everyone</p>
              <h4 className="text-base font-medium">Active until {moment(
                userPlan?.endDate
              ).format("LL")}</h4>
              <p className="mb-4">
                We will send you a notification upon Subscription expiration.
              </p>
              <div className="w-full py-6 my-5 bg-light-red text-center">
                <p className="mt-5">We need your attention!</p>
                <p className="mb-5"> Your plan requires update</p>
              </div>
              <div className="w-full mb-4">
                <div className="flex justify-between">
                  <span>Days</span>
                  <span>{getDaysPassed(userPlan?.startDate, new Date())} of {getDifferenceInDays(userPlan?.startDate, userPlan?.endDate)} Days</span>
                </div>
                <input
                  id="customRange1"
                  className="w-full form-range"
                  type="range"
                  value={rangeValue}
                  onChange={handleChange}
                  min={0}
                  max={getDifferenceInDays(userPlan?.startDate, userPlan?.endDate)}
                />
              </div>
              <div className="flex justify-center w-full mb-5">
                <button
                  className="mr-3 text-white bg-blue-700 hover:bg-blue-800 rounded-full text-base px-3 py-2 text-center"
                  onClick={() => handleIncreaseTrial(customerData?.email)}
                >
                  increase trial days
                </button>
                <button
                  className="bg-[#FF0000] rounded-full px-3 py-2 text-white hover:bg-primary text-base"
                  onClick={() => {
                    CancelSubscription(customerData?.email)
                  }}
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 m-5 ">
        <h3 className="user-name mb-4">Credit &amp; Debit Cards</h3>
        <form className="w-full space-y-6" action="">
          {cardList?.length > 0 && cardList?.map((item) => {
            return (
              <div className="mb-5" index={item?.paymentMethodID}>
                <label
                  className="flex items-center justify-between h-16 px-5 bg-white border border-gray-300 rounded-lg cursor-pointer group"
                  htmlFor="option_1"
                >
                  <div className="flex flex-col mr-6">
                    <div className="lg:flex md:flex sm:flex xs:block items-center">
                      <img
                        src="../../Settings/logos_mastercard.svg"
                        className="mr-2"
                        alt=""
                      />
                      <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">
                        {capitalizeFirstLetter(item?.funding)} Card
                      </h4>
                      <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">
                        **** **** **** {item?.cardNumber}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="bg-green-600 bg-gray-500 text-white px-6 py-2 mr-5 rounded-full">
                      Default Card
                    </span>
                  </div>
                </label>
              </div>
            )
          })}
        </form>
      </div>
      {/*<div className="bg-white shadow-xl rounded-xl border border-gray-200 min-h-full m-5">
        <h3 className="user-name my-2 ml-5">Billing Address</h3>
        <div className="full flex flex-wrap -mx-3 mb-3">
          <div className="w-full px-3 mb-6 md:mb-0">
            <div className="user-pro-details text-base">
              <table cellpadding="0" className="w-full border-[#D5E3FF] border-t rounded screen-status">
                <tbody>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">Company Name:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">Pixinvent</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">Contact:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">+1(609) 933-44-22</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">Billing Email:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">gertrude@gmail.com</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">Country:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">USA</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">State:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">Queensland</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">Tax ID:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">TAX-875623</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">VAT Number:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">SDF754K77</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">Billing Address:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">100 Water Plant Avenue, Building 303 Wake Island</td>
                  </tr>
                  <tr className="border-b border-[#D5E3FF]">
                    <td className="text-left px-5 py-2">
                      <label className="text-base font-medium sm:font-base xs:font-base">Zip Code:</label>
                    </td>
                    <td className="text-left text-base px-5 py-2">403114</td>
                  </tr>
                </tbody>
              </table>


              <div className="flex mb-2">
                <label>Company Name:</label>
                <span>Pixinvent</span>
              </div>
              <div className="flex mb-2">
                <label>Contact:</label>
                <span>+1(609) 933-44-22</span>
              </div>
              <div className="flex mb-2">
                <label>Billing Email:</label>
                <span>gertrude@gmail.com</span>
              </div>
              <div className="flex mb-2">
                <label>Country:</label>
                <span>USA</span>
              </div>
              <div className="flex mb-2">
                <label>State:</label>
                <span>Queensland</span>
              </div>
              <div className="flex mb-2">
                <label>Tax ID:</label>
                <span>TAX-875623</span>
              </div>
              <div className="flex mb-2">
                <label>VAT Number</label>
                <span>SDF754K77</span>
              </div>
              <div className="flex">
                <label>Billing Address:</label>
                <span>100 Water Plant Avenue, Building 303 Wake Island</span>
              </div>
              <div className="flex mb-2">
                <label>Zip Code:</label>
                <span>403114</span>
              </div> 

            </div>
          </div>
           <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <div className="user-pro-details text-base">
              <div className="flex mb-2">
                <label>Contact</label>
                <span>+1(609) 933-44-22</span>
              </div>
              <div className="flex mb-2">
                <label>Country:</label>
                <span>USA</span>
              </div>
              <div className="flex mb-2">
                <label>State:</label>
                <span>Queensland</span>
              </div>
              <div className="flex mb-2">
                <label>Zip Code:</label>
                <span>403114</span>
              </div>
            </div>
          </div> 
        </div>
        </div>*/}

      {newCardShow && (
        <AddCreditCard onSubmit={onSubmit} toggleModal={toggleModal} />
      )}
    </>
  );
};

export default UserInfo;
