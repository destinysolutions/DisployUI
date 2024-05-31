import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { handleAddPlan } from '../../Redux/AdminSettingSlice';
import { useSelector } from 'react-redux';
import { ADD_EDTT_PLAN } from '../../Pages/Api';
import { useDispatch } from 'react-redux';

const AddEditPlan = ({ showPlanModal, featureList, selectPlan, setSelectPlan, heading }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const [formData, setFormData] = useState({
        PlanDetails: featureList,
        PlanName: "",
        totalscreen: 1,
        storage: "",
        cost: "",
        Status: "Active"
    });
    const [errorPlanName, setErrorPlanName] = useState(false)
    const [errorStorage, setErrorStorage] = useState(false)
    const [errorCost, setErrorCost] = useState(false)

    useEffect(() => {
        if (selectPlan) {
            let obj = {}
            obj.PlanName = selectPlan?.planName;
            obj.cost = selectPlan?.planPrice;
            obj.storage = 2;
            obj.totalscreen = 1;
            selectPlan?.planDetails?.map((item) => {
                return (item?.lstOfFeatures?.map((list) => {
                    obj[list?.name] = list?.value === "Yes" ? true : false
                }))
            })
            setFormData(obj)
        }
    }, [selectPlan])

    const handleInputChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name, isChecked) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: isChecked
        }));
    };

    const handleCreatePlan = () => {
        let hasError = false;
        if (!formData?.PlanName) {
            setErrorPlanName(true)
            hasError = true
        }
        if (!formData?.storage) {
            setErrorStorage(true)
            hasError = true
        }

        if (!formData?.cost) {
            setErrorCost(true)
            hasError = true
        }

        if (hasError) {
            return;
        }

        console.log(formData, "formData")

        
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${ADD_EDTT_PLAN}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
            },
            data: JSON.stringify(formData)
        };
        dispatch(handleAddPlan({ config })).then((res) => {
            if (res?.payload?.status === 200) {
                setSelectPlan("");
                showPlanModal(false)
            }
        }).catch((error) => {
            console.log('error', error)
        })
    }

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
                        <div className="relative p-4 lg:w-[600px] md:w-[600px] sm:w-full max-h-full">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600 ">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {heading === "Add" ? "Add New" : heading} Custom Plan
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => {
                                            setSelectPlan("");
                                            showPlanModal(false);
                                        }}
                                    />
                                </div>
                                <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                                    <div className=" lg:p-3 md:p-3 sm:p-2 xs:py-3 xs:px-1 text-left rounded-2xl max-h-80 vertical-scroll-inner">
                                        <div className="grid grid-cols-12 gap-6">
                                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                                <div className="relative">
                                                    <label className="formLabel">Plan Name</label>
                                                    <input
                                                        type='text'
                                                        placeholder='Enter Plan Name'
                                                        name="PlanName"
                                                        className="formInput"
                                                        value={formData?.PlanName}
                                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                                                </div>
                                                {errorPlanName && (
                                                    <span className='error'> This Field is Required.</span>
                                                )}
                                            </div>
                                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                                <div className="relative">
                                                    <label className="formLabel">Total Screens</label>
                                                    <input
                                                        type='number'
                                                        placeholder='1'
                                                        name="totalscreen"
                                                        className="formInput"
                                                        value={formData?.totalscreen}
                                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                                                </div>
                                            </div>
                                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                                <div className="relative">
                                                    <label className="formLabel">Storage</label>
                                                    <input
                                                        type='number'
                                                        placeholder='Enter Storage'
                                                        name="storage"
                                                        className="formInput"
                                                        value={formData?.storage}
                                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                                                </div>
                                                {errorStorage && (
                                                    <span className='error'> This Field is Required.</span>
                                                )}
                                            </div>
                                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                                <div className="relative">
                                                    <label className="formLabel">Cost</label>
                                                    <input
                                                        type='number'
                                                        placeholder='Enter Plan Cost'
                                                        name="cost"
                                                        className="formInput"
                                                        value={formData?.cost}
                                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                                                </div>
                                                {errorCost && (
                                                    <span className='error'> This Field is Required.</span>
                                                )}
                                            </div>
                                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                                <div className="relative">
                                                    <label className="formLabel">Status</label>
                                                    <select
                                                        name='Status'
                                                        className="formInput"
                                                        value={formData?.Status}
                                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Deactive">Deactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {featureList?.map((item, index) => {
                                                return (
                                                    <>
                                                        {item?.IsCheckBox && (
                                                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12'>
                                                                <div className="relative">
                                                                    <label className="formLabel">{item?.name}</label>
                                                                    <input
                                                                        type='text'
                                                                        placeholder={`Enter ${item?.name}`}
                                                                        name={item?.name}
                                                                        className="formInput"
                                                                        value={formData[item?.name]}
                                                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {!item?.IsCheckBox && (
                                                            <div className='lg:col-span-6 md:col-span-6 sm:col-span-12 xs:col-span-12 flex'>
                                                                <div className="flex items-center gap-3">
                                                                    <input
                                                                        type='checkbox'
                                                                        placeholder={`Enter ${item?.name}`}
                                                                        name={item?.name}
                                                                        checked={formData[item?.name]}
                                                                        className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink"
                                                                        onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)}
                                                                    />
                                                                    <label className="">{item?.name}</label>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )
                                            })}

                                        </div>
                                    </div>

                                    <div className='border-t border-gray-600'>
                                        <div className='col-span-12 text-center mt-3'>
                                            <button className='bg-white text-primary text-base px-8 py-3 border border-primary shadow-md rounded-full hover:bg-primary hover:text-white'
                                                onClick={() => handleCreatePlan()}

                                            >Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddEditPlan
