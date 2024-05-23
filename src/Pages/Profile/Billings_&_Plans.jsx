import React, { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { CANCEL_SUBSCRIPTION, GET_ALL_CARD, GET_ALL_PLANS, stripePromise } from "../Api";
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

const BillingsPlans = () => {
  const dispatch = useDispatch()
  const { user, token, userDetails } = useSelector((s) => s.root.auth);
  const authToken = `Bearer ${token}`;
  const [purchasePlan, setPurchasePlan] = useState(false)
  const [selectPlan, setSelectPlan] = useState("")
  const [myplan, setmyPlan] = useState([]);
  const [cardList, setCardList] = useState([])
  const [loading, setLoading] = useState(true)

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
          setLoading(false)
        }
      })
    } catch (error) {
      toast.error('Error fetching cards');
    }
  };

  useEffect(() => {
    fetchAllPlan()
    fetchCards()
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
            console.log('res', res)
            if (res?.payload?.status) {
              toast.success(res?.payload?.message)
            }
          })
          .catch((error) => console.log('error', error))
      }
    });

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
                    Your Current Plan is Basic
                  </p>
                  <p className="mb-3">A simple start for everyone</p>

                  <p className="my-3">
                    <strong>Active until July 25, 2023</strong>
                  </p>
                  <p className="mb-3">
                    We will send you a notification upon Subscription expiration.
                  </p>

                  <p className="my-3">
                    <strong>$199 Per Month</strong>{" "}
                  </p>
                  <p className="mb-3">A simple start for everyone</p>
                  <div className="w-full flex">
                    <button className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3"
                      onClick={() => {
                        setPurchasePlan(true)
                      }}
                    >
                      {userDetails?.planID === 0 ? "Buy Plan" : "Upgrade Plan"}

                    </button>
                    <button
                      className=" px-5 py-2 border border-primary rounded-full text-primary"
                      onClick={() => {
                        CancelSubscription()
                      }}
                    >
                      Cancel Subscription
                    </button>
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
                      <span>26 of 30 Days</span>
                    </div>
                    <input
                      id="customRange1"
                      className="w-full form-range"
                      type="range"
                    />
                    <p>6 days remaining until your plan requires update</p>
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
                    <Card setLoading={setLoading} fetchCards={fetchCards}/>
                  </Elements>
                </div>
                <MyCard fetchCards={fetchCards} cardList={cardList} setLoading={setLoading}/>
              </div>
            </div>

            {/* <div className="rounded-xl mt-8 shadow bg-white ">
          <h4 className="user-name p-5 pb-0">Billing Address</h4>
          <form>
            <div className="px-5 pb-5">
              <div className="-mx-3 md:flex">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="label_top text-sm">Company Name</label>
                  <input
                    className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                    type="text"
                    placeholder="Enter Company Name"
                  />
                  <div></div>
                </div>
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="label_top text-sm">Billing Email</label>
                  <input
                    className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                    type="text"
                    placeholder="Enter Billing Email"
                  />
                  <div></div>
                </div>
                <div className="md:w-1/2 px-3">
                  <label className="label_top text-sm">Tax ID </label>
                  <input
                    className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                    type="email"
                    placeholder="Enter Tax ID"
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="label_top text-sm">VAT Number</label>
                  <input
                    className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                    type="text"
                    placeholder="Enter VAT Number"
                  />
                </div>
                <div className="md:w-1/2 px-3">
                  <label className="label_top text-sm">Phone Number</label>
                  <input
                    className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                    type="text"
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div className="md:w-1/2 px-3">
                  <label className="label_top text-sm">Billing Address</label>
                  <input
                    className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                    type="text"
                    placeholder="Enter Billing Address"
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex ">
                <div className="md:w-1/2 px-3">
                  <label className="label_top text-sm">Country</label>
                  <div>
                    <select className="w-full bg-gray-200 bg-white border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded">
                      <option>USA</option>
                      <option>India</option>
                      <option>UK</option>
                    </select>
                  </div>
                </div>
                <div className="md:w-1/2 px-3">
                  <label className="label_top text-sm">State</label>
                  <div>
                    <select className="w-full bg-gray-200 bg-white border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded">
                      <option>Abuja</option>
                      <option>Enugu</option>
                      <option>Lagos</option>
                    </select>
                  </div>
                </div>
                <div className="md:w-1/2 px-3">
                  <label className="label_top text-sm">Zip Code</label>
                  <input
                    className="w-full bg-gray-200 bg-white text-black border input-bor-color rounded-lg py-3 px-4 mb-3"
                    type="text"
                    placeholder="Enter Billing Address"
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex ">
                <div className="md:w-full px-3 flex">
                  <button className="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3">
                    Save Changes
                  </button>
                  <button className=" px-5 py-2 border border-primary rounded-full text-primary">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
                </div>*/}
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
