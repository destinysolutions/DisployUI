import React, { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ADD_EDIT_BILLINGDETAILS, CANCEL_SUBSCRIPTION, GET_ALL_CARD, GET_ALL_COUNTRY, GET_ALL_PLANS, GET_BILLING_DETAILS, GET_SELECT_BY_STATE, GET_USER_BILLING_DETAILS, stripePromise } from "../Api";
import { handleCancelSubscription } from "../../Redux/PaymentSlice";
import PurchaseUserPlan from "../../Components/Common/PurchaseUserPlan";
import { useEffect } from "react";
import { handleGetAllPlans } from "../../Redux/CommonSlice";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Card from "./Card";
import { Elements } from "@stripe/react-stripe-js";
import MyCard from "./MyCard";
import { GetAllCardList } from "../../Redux/CardSlice";
import Loading from "../../Components/Loading";
import { AddEditBillingDetails, GetBillingDetails, handleGetState } from "../../Redux/SettingUserSlice";
import { useNavigate } from "react-router-dom";
import { extractPrice, extractSubstring, getDaysPassed, getDifferenceInDays, getRemainingDays } from "../../Components/Common/Common";
import moment from "moment";

const BillingsPlans = () => {
  const dispatch = useDispatch()
  const { user, token, userDetails } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const navigation = useNavigate()
  const [purchasePlan, setPurchasePlan] = useState(false)
  const [selectPlan, setSelectPlan] = useState("")
  const [myplan, setmyPlan] = useState([]);
  const [cardList, setCardList] = useState([])
  const [loading, setLoading] = useState(true)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [userPlan, setUserPlan] = useState({});
  const [billingDetails, setBillingDetails] = useState({
    companyName: "",
    billingEmail: "",
    taxID: "",
    vatNumber: "",
    phoneNumber: "",
    billingAddress: "",
    countryID: "",
    stateID: "",
    zipCode: ""
  })

  console.log('userPlan', userPlan)

  useEffect(() => {
    fetch(GET_ALL_COUNTRY)
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.data);
      })
      .catch((error) => {
        console.log("Error fetching countryID data:", error);
      });
  }, []);


  useEffect(() => {
    if (billingDetails?.countryID !== "" && billingDetails?.countryID !== null) {
      dispatch(handleGetState(billingDetails?.countryID))
        ?.then((res) => {
          setStates(res?.payload?.data);
        })
        .catch((error) => {
          console.log("Error fetching states data:", error);
        });
    }
  }, [billingDetails?.countryID])

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
    }).catch((error) => {
      console.log('error', error)
    })
  }

  const fetchCards = async () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_ALL_CARD}?Email=${user?.emailID}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        },
      }
      dispatch(GetAllCardList({ config })).then((res) => {
        if (res?.payload?.status) {
          setCardList(res?.payload?.data);
        }
      })
    } catch (error) {
      toast.error('Error fetching cards');
    }
  };

  const getUserBilling = () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_USER_BILLING_DETAILS}?Email=${user?.emailID}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        },
      }
      dispatch(GetBillingDetails({ config })).then((res) => {
        if (res?.payload?.status) {
          setUserPlan(res?.payload?.data[0])
          setLoading(false)
        }
      })
    } catch (error) {
      toast.error('Error fetching cards');
    }
  }

  const getBillingDetails = () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${GET_BILLING_DETAILS}?Email=${user?.emailID}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken
        },
      }
      dispatch(GetBillingDetails({ config })).then((res) => {
        if (res?.payload?.status) {
          setBillingDetails(res?.payload?.data)
        }
      })
    } catch (error) {
      toast.error('Error fetching cards');
    }
  }

  const fetchAllAPI = async () => {
    setLoading(true)
    await fetchAllPlan()
    await fetchCards()
    await getBillingDetails()
    await getUserBilling()
  }

  useEffect(() => {
    fetchAllAPI()
  }, [])


  const CancelSubscription = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${CANCEL_SUBSCRIPTION}?Email=${user?.emailID}`,
      headers: {
        Authorization: authToken
      },
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel subscription!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Close"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(handleCancelSubscription({ config }))
          .then((res) => {
            if (res?.payload?.status) {
              toast.success(res?.payload?.message)
              navigation("/")
            }
          })
          .catch((error) => console.log('error', error))
      }
    });
  }

  const handleBillingDetails = () => {
    let Params = {
      ...billingDetails,
      userBillingDetailsID: billingDetails?.userBillingDetailsID
    }
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADD_EDIT_BILLINGDETAILS}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
      data: JSON.stringify(Params)
    }

    dispatch(AddEditBillingDetails({ config })).then((res) => {
      if (res?.payload?.status === 200) {
        setBillingDetails(res?.payload?.data)
      }
    }).catch((error) => {
      console.log('error', error)
    })
  }

  const handleResetBilling = () => {
    setBillingDetails({
      companyName: "",
      billingEmail: "",
      taxID: "",
      vatNumber: "",
      phoneNumber: "",
      billingAddress: "",
      countryID: "",
      stateID: "",
      zipCode: ""
    })
  }

  return (
    <>
      {loading && (
        <Loading />
      )}
      {!loading && (
        <Suspense fallback={<Loading />}>
          <div>
            <div className="rounded-xl mt-8 shadow bg-white my-3 p-5">
              <h4 className="user-name mb-3">Current Plan</h4>
              <div className="-mx-3 flex items-center mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <p className="my-3 font-medium lg:text-md">
                    Your Current Plan is {extractSubstring(userPlan?.description) ? extractSubstring(userPlan?.description) : "Trial Period"}
                  </p>
                  <p className="mb-3">A simple start for everyone</p>

                  <p className="my-3">
                    <strong>Active until {moment(
                      userPlan?.endDate
                    ).format("LL")}</strong>
                  </p>
                  <p className="mb-3">
                    We will send you a notification upon Subscription expiration.
                  </p>
                  {extractPrice(userPlan?.description) && (
                    <p className="my-3">
                      <strong>${extractPrice(userPlan?.description)} Per Month</strong>{" "}
                    </p>
                  )}

                  <div className="w-full flex">
                    <button className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                      onClick={() => {
                        setPurchasePlan(true)
                      }}
                    >
                      {userDetails?.planID === 0 ? "Buy Plan" : "Upgrade Plan"}

                    </button>
                    {userDetails?.isActivePlan && (
                      <button
                        className=" px-5 py-2 border border-primary rounded-full text-primary"
                        onClick={() => {
                          CancelSubscription()
                        }}
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <div className="w-full py-6 mb-5 bg-light-red text-center">
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
                      value={getDaysPassed(userPlan?.startDate, new Date())}
                      min={0}
                      max={getDifferenceInDays(userPlan?.startDate, userPlan?.endDate)}
                      disabled
                    />
                    <p>{getRemainingDays(new Date(), userPlan?.endDate)} days remaining until your plan requires update</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl mt-8 shadow bg-white my-3 p-5">
              {/*<h4 className="user-name mb-3">Payment Methods</h4>*/}

              <div className="-mx-3 flex items-start">
                <div className="md:w-1/2 px-3">
                  <h4 className="user-name mb-3">Card Details</h4>
                  {/*<div className="text-center flex flex-wrap my-3">
                <div className="flex items-center mr-4 ">
                  <input
                    id="atmcard"
                    type="radio"
                    name="radio"
                    className="hidden"
                  />
                  <label className="flex items-center cursor-pointer text-xl">
                    <span className="w-6 h-6 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
                    Credit/Debit/ATM Card
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="cod" type="radio" name="radio" className="hidden" />
                  <label className="flex items-center cursor-pointer text-xl">
                    <span className="w-6 h-6 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
                    COD/Cheque
                  </label>
                </div>
                </div>*/}
                  <Elements stripe={stripePromise}>
                    <Card setLoading={setLoading} fetchCards={fetchCards} />
                  </Elements>
                </div>
                <MyCard fetchCards={fetchCards} cardList={cardList} setLoading={setLoading} />
              </div>
            </div>

            <div className="rounded-xl mt-8 shadow bg-white ">
              <h4 className="user-name p-5 pb-0">Billing Address</h4>
              <div className="px-5 pb-5">
                <div className="-mx-3 md:flex">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="label_top text-sm">Company Name</label>
                    <input
                      className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      type="text"
                      placeholder="Enter Company Name"
                      onChange={(e) => setBillingDetails({ ...billingDetails, companyName: e.target.value })}
                      value={billingDetails.companyName}
                    />
                    <div></div>
                  </div>
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="label_top text-sm">Billing Email</label>
                    <input
                      className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      type="email"
                      placeholder="Enter Billing Email"
                      onChange={(e) => setBillingDetails({ ...billingDetails, billingEmail: e.target.value })}
                      value={billingDetails.billingEmail}
                    />
                    <div></div>
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-sm">Tax ID </label>
                    <input
                      className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      type="number"
                      placeholder="Enter Tax ID"
                      onChange={(e) => setBillingDetails({ ...billingDetails, taxID: e.target.value })}
                      value={billingDetails.taxID}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex">
                  <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="label_top text-sm">VAT Number</label>
                    <input
                      className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      type="number"
                      placeholder="Enter VAT Number"
                      onChange={(e) => setBillingDetails({ ...billingDetails, vatNumber: e.target.value })}
                      value={billingDetails.vatNumber}
                    />
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-sm">Phone Number</label>
                    <input
                      className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      type="number"
                      placeholder="Enter Phone Number"
                      onChange={(e) => setBillingDetails({ ...billingDetails, phoneNumber: e.target.value })}
                      value={billingDetails.phoneNumber}
                    />
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-sm">Billing billingAddress</label>
                    <input
                      className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      type="text"
                      placeholder="Enter Billing billingAddress"
                      onChange={(e) => setBillingDetails({ ...billingDetails, billingAddress: e.target.value })}
                      value={billingDetails.billingAddress}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex ">
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-sm">Country</label>
                    <div>
                      <select className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                        onChange={(e) => setBillingDetails({ ...billingDetails, countryID: e.target.value })}
                        value={billingDetails.countryID}
                      >
                        <option label="Select country"></option>
                        {countries.map((country) => (
                          <option
                            key={country.countryID}
                            value={country.countryID}
                          >
                            {country.countryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-sm">State</label>
                    <div>
                      <select className="w-full text-black border rounded-lg py-3 px-4 bg-white"
                        onChange={(e) => setBillingDetails({ ...billingDetails, stateID: e.target.value })}
                        value={billingDetails.stateID}
                      >
                        <option label="Select state"></option>
                        {Array.isArray(states) &&
                          states.map((state) => (
                            <option
                              key={state.stateId}
                              value={state.stateId}
                            >
                              {state.stateName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="md:w-1/2 px-3">
                    <label className="label_top text-sm">Zip Code</label>
                    <input
                      className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                      type="number"
                      placeholder="Enter Zip Code"
                      onChange={(e) => setBillingDetails({ ...billingDetails, zipCode: e.target.value })}
                      value={billingDetails.zipCode}
                    />
                  </div>
                </div>
                <div className="-mx-3 md:flex ">
                  <div className="md:w-full px-3 flex">
                    <button className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3" onClick={() => handleBillingDetails()}>
                      Save Changes
                    </button>
                    <button className=" px-5 py-2 border border-primary rounded-full text-primary" onClick={() => handleResetBilling()}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      )}
      {purchasePlan && (
        <PurchaseUserPlan setPurchasePlan={setPurchasePlan} purchasePlan={purchasePlan} selectPlan={selectPlan} setSelectPlan={setSelectPlan} userPlanType="" myplan={myplan} />
      )}
    </>
  );
};

export default BillingsPlans;
