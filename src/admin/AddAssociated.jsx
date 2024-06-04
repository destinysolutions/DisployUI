import React, { useState } from 'react'
import { useEffect } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { ADD_ASSOCIATED_SALESMAN, All_SAELS_MAN_LIST } from '../Pages/Api'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { GetAllSalesMan, handleAddAssociated } from '../Redux/SalesMan/SalesManSlice'
import toast from 'react-hot-toast'

const AddAssociated = ({ showModal, setShowModal, selectedCustomer,setLoadFist }) => {
    const { token } = useSelector((s) => s.root.auth);
    const authToken = `Bearer ${token}`;
    const dispatch = useDispatch();
    const [salesManList, setSalesManList] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedData, setSelectedData] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        setLoading(true)
        let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${All_SAELS_MAN_LIST}`,
            headers: {
                Authorization: authToken,
            },
        };

        dispatch(GetAllSalesMan({ config })).then((res) => {
            if (res?.payload?.status) {
                setSalesManList(res?.payload?.data)
                setLoading(false)
            } else {
                toast.error(res?.payload?.message)
            }
        }).catch((err) => {
            console.log('err', err)
        });
    }, [])

    const handleSave = () => {
        if (selectedData === "") {
            setError(true)
            return
        }

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${ADD_ASSOCIATED_SALESMAN}?OrgID=${selectedCustomer?.orgID}&SalesManID=${selectedData}`,
            headers: {
                Authorization: authToken,
            },
        };

        dispatch(handleAddAssociated({ config })).then((res) => {
            if (res?.payload?.status) {
                setLoadFist(true)
                setShowModal(!showModal)
            }
            else {
                toast.error(res?.payload?.message)
            }

        }).catch((err) => {
            console.log('err', err)
        })
    }


    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed h-full top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="relative p-4 w-[500px]">
                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                {/* Modal header */}
                                <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Add Associated
                                    </h3>
                                    <AiOutlineCloseCircle
                                        className="text-4xl text-primary cursor-pointer"
                                        onClick={() => setShowModal(!showModal)}
                                    />
                                </div>
                                <div className="model-body lg:p-5 md:p-5 sm:p-2 xs:p-2 ">
                                    <div className='mb-3'>
                                        <select
                                            className="w-full border border-[#D5E3FF] rounded-lg p-2 mb-1"
                                            onChange={(e) => setSelectedData(e.target.value)}
                                            value={selectedData}>
                                            <option value="">Select Sales Man</option>
                                            {salesManList.map((salesman) => (
                                                <option
                                                    value={salesman.orgSingupID}
                                                    key={salesman.orgSingupID}
                                                >
                                                    {salesman.firstName}{" "}{salesman?.lastName}
                                                </option>
                                            ))}
                                        </select>

                                        {error && (
                                            <span className='error'> This field is Required.</span>
                                        )}
                                    </div>

                                    <div className='border-t border-gray-600'>
                                        <div className='col-span-12 text-center mt-3'>
                                            <button className='bg-white text-primary text-base px-8 py-3 border border-primary shadow-md rounded-full hover:bg-primary hover:text-white'
                                                onClick={() => handleSave()}
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

export default AddAssociated
