import React, { useEffect, useState } from 'react'
import PlanList from './PlanList'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { GET_ALL_PLANS } from '../../../Pages/Api';
import { handleGetAllPlans } from '../../../Redux/CommonSlice';

const PurchasePlanWarning = () => {
    const { token, user } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const [myplan, setmyPlan] = useState([]);
    const [choose, setChoose] = useState(false)

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
                                <div className="p-10">
                                    <div className='flex shadow rounded-lg p-10 flex-col gap-3 max-w-[550px] min-w-[550px]'>
                                        <p className="text-gray-700 mb-6 text-2xl text-black font-bold">
                                            Thank You for signing up
                                        </p>
                                        <label className='font-semibold text-lg mb-4'>you need to purchase the screen subscription to start using Disploy.</label>
                                        <div className='flex items-center justify-center'>
                                            <button
                                                className="bg-primary text-white text-base px-8 py-3 border border-primary shadow-md rounded-full "
                                                type="button"
                                                onClick={() => setChoose(true)}
                                            >
                                                Choose
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {choose && (
                <PlanList setChoose={setChoose} choose={choose} myplan={myplan}/>
            )}

        </>
    )
}

export default PurchasePlanWarning
