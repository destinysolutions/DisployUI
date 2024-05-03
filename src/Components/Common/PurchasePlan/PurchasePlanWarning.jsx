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
                    <div className="modal lg:w-[1200px] md:w-[900px] sm:w-full h-80vh">
                        <div className="relative bg-white rounded-lg p-10 flex justify-center h-full">
                            <div className="relative max-auto w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-10 flex justify-center items-center">                                 
                                <div className='text-center tabdetails rounded-lg p-10 w-full'>
                                    <h2 className="block text-gray-700 mb-4 text-2xl text-black font-bold">
                                        Thank You for signing up
                                    </h2>
                                    <label className='block font-semibold text-lg mb-4'>you need to purchase the screen subscription to start using Disploy.</label>
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

            {choose && (
                <PlanList setChoose={setChoose} choose={choose} myplan={myplan}/>
            )}

        </>
    )
}

export default PurchasePlanWarning
