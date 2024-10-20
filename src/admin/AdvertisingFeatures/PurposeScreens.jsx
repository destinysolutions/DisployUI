import React, { useEffect, useState } from 'react'
import { AiFillPlusCircle, } from 'react-icons/ai';
import AddIndustry from './AddIndustry';
import { useDispatch } from 'react-redux';
import { AddPurposeScreen, getPurposeScreens } from '../../Redux/admin/AdvertisementSlice';

export default function PurposeScreens() {
    const dispatch = useDispatch()

    const [loadFirst, setLoadFirst] = useState(true);
    const [loading, setLoading] = useState(false);
    const [PurposeModal, setPurposeModal] = useState(false)
    const [data, setdata] = useState([]);

    useEffect(() => {
        if (loadFirst) {
            setLoading(true)
            dispatch(getPurposeScreens({})).then((result) => {
                setdata(result?.payload?.data)
                setLoading(false)
            })
            setLoadFirst(false)
        }
    }, [loadFirst, dispatch]);

    const onClose = () => {
        setPurposeModal(false)
        setLoadFirst(true)
    }

    const handlePurpose = (params) => {
        dispatch(AddPurposeScreen(params))
    }


    return (
        <div>
            <div className="lg:p-5 md:p-5 sm:p-2 xs:p-2">
                <div className='border-b border-gray pb-3'>
                    <div className='flex justify-between items-center'>
                        <h2 className='font-semibold text-2xl'>Purpose of advertising</h2>
                    </div>
                </div>

                <div className="clear-both">
                    {loading && (
                        <div className="flex text-center m-5 justify-center items-center h-96">
                            <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
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
                        <div className="bg-white rounded-xl mt-8 shadow screen-section  md:h-[500px]">
                            <div className="m-auto  flex justify-center flex-wrap my-3">
                                {data?.length > 0 && data?.map((item, index) => (
                                    <button
                                        // ${allSlateDetails?.selecteScreens?.includes(label) && "bg-SlateBlue border-white"}
                                        className={`border m-0 border-primary px-3 py-1 mr-2 mb-2 rounded-full `}
                                        key={index}
                                    // onClick={() => handleClick(label)}
                                    >
                                        {item?.purposeName}
                                    </button>
                                ))}
                            </div>
                            <div className='flex items-center h-full'>
                                <button
                                    className="mx-auto flex align-middle border-primary items-center border rounded-full lg:px-6 sm:px-5 py-2 text-base sm:text-sm hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50 gap-1"
                                    onClick={() => setPurposeModal(true)}
                                >
                                    <AiFillPlusCircle className="text-2xl mr-1" />
                                    Add Purpose
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {PurposeModal && (
                <AddIndustry
                    setShowIndustryModal={setPurposeModal}
                    setindustryCategory={setdata}
                    industryCategory={data}
                    addIndustry={handlePurpose}
                    onClose={onClose}
                    indetyType={'Purpose'}
                />
            )}
        </div>
    )
}
