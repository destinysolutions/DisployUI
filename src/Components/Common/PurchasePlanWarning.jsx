import React, { useEffect, useState } from 'react'
import { GET_ALL_PLANS } from '../../Pages/Api'
import { useSelector } from 'react-redux';
import { handleGetAllPlans } from '../../Redux/CommonSlice';
import { useDispatch } from 'react-redux';
import PurchaseUserPlan from './PurchaseUserPlan';

const PurchasePlanWarning = ({ setPlanWarning, planWarning }) => {
    const { token, user } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [myplan, setmyPlan] = useState([]);
    const [selectPlan, setSelectPlan] = useState("")
    const [purchasePlan, setPurchasePlan] = useState(false)
    let userPlanType ="LoginUser";

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
                setLoading(false)
            }
        }).catch((err) => {
            console.log('err', err)
        })
    }

    useEffect(() => {
        fetchAllPlan();
    }, [])


    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    <div className="modal">

                        <div className="relative p-4 max-w-[800px] min-w-[600px] max-h-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="p-4 md:p-5">
                                    {loading && (
                                            <div className="flex text-center m-5 justify-center">
                                                <svg
                                                    aria-hidden="true"
                                                    role="status"
                                                    className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="#1C64F2"
                                                    />
                                                </svg>
                                            </div>
                                    )}
                                    {!loading && (
                                        <>
                                            <div className='flex flex-col gap-3'>
                                                <p className="text-gray-700 mb-6">
                                                    Your trial period has ended. Please purchase a plan to continue using our services.
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap -mx-3 mb-8">
                                                {myplan?.map((item) => {
                                                    return (
                                                        <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 px-3 mb-4">
                                                            <div className="bg-[#ECF0F1] p-4 rounded-lg h-full">
                                                                <div className="flex justify-between mb-4">
                                                                    <div className="role-name">
                                                                        {user?.role === "1" && (
                                                                            <p>Total 5 Users</p>
                                                                        )}
                                                                        <h3 className="text-2xl font-semibold my-2">
                                                                            {item?.planName}
                                                                        </h3>
                                                                        <p>A simple start for Everyone</p>

                                                                    </div>
                                                                    <div className="role-user">
                                                                        <div className="role-user flex justify-center mb-3 font-semibold text-3xl">
                                                                            ${item?.planPrice}
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                                <div className='flex items-center justify-center'>
                                                                    <button
                                                                        type="button"
                                                                        className="hover:bg-white cursor-pointer hover:text-primary text-base px-8 py-3 border border-primary  shadow-md rounded-full bg-primary text-white"
                                                                        onClick={() => {
                                                                            setSelectPlan(item)
                                                                            setPurchasePlan(true)
                                                                        }}
                                                                    >
                                                                        Buy Plan
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {purchasePlan && (
                <PurchaseUserPlan setPurchasePlan={setPurchasePlan} purchasePlan={purchasePlan} selectPlan={selectPlan} userPlanType={userPlanType}/>
            )}
        </>
    )
}

export default PurchasePlanWarning
