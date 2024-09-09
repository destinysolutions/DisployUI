import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import Select from "react-select";
import { getIndustry } from '../../../../Redux/CommonSlice';
import { useSelector } from 'react-redux';


export default function ConvertAdvertisingModal({ setConvertAdvertisingModal, selectedItems }) {
    const dispatch = useDispatch()
    const store = useSelector((state) => state.root.common);
    const [Errors, setErrors] = useState(false);
    const [ConvertAdvertisment, setConvertAdvertisment] = useState({
        Industry: null,
        Exclude: null
    });

    useEffect(() => {
        dispatch(getIndustry({}))
    }, [dispatch]);

    const onSumbit = () => {
        console.log('ConvertAdvertisment :>> ', ConvertAdvertisment);
        if ((ConvertAdvertisment?.Exclude !== 'undefined') || (ConvertAdvertisment?.Industry !== 'undefined')) {
            return setErrors(true)
        }
        const allScreenids = selectedItems.map((i) => i).join(",");

        console.log('Errors :>> ', Errors);
        const Payload = {
            ScreenIds: allScreenids,
            IndustryID: ConvertAdvertisment?.Industry?.value,
            ExcludeID: ConvertAdvertisment?.Exclude?.value,
        }
        console.log('Payload :>> ', Payload);
    }

    return (
        <div>
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                <div

                    className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs"
                >
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <div className="flex items-center">
                                <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">
                                    Select the Screen you want Schedule add
                                </h3>
                            </div>
                            <button
                                className="p-1 text-xl ml-8"
                                onClick={() => setConvertAdvertisingModal(false)}
                            >
                                <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                        </div>
                        <div className=" p-5 ">
                            <div className='w-full mb-5'>
                                <label for='Yes' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                    Industry :
                                </label>
                                <Select
                                    value={ConvertAdvertisment?.Industry}
                                    onChange={(options) => { setConvertAdvertisment({ ...ConvertAdvertisment, Industry: options }) }}
                                    placeholder='Select Industry'
                                    options={
                                        store?.Industry.length > 0 && store?.Industry[0].subIndustry
                                            ? store?.Industry[0].subIndustry.map((item) => ({
                                                value: item?.industryID,
                                                label: item?.industryName,
                                            }))
                                            : [{ value: "", label: "Not Found" }]
                                    }
                                    isClearable={true}
                                />
                                {Errors && ConvertAdvertisment?.Industry === null && (
                                    <p className="text-red-600 text-sm font-semibold ">
                                        Industry Name is Required.
                                    </p>
                                )}
                            </div>
                            <div className='w-full'>
                                <label for='Yes' className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">
                                    Exclude :
                                </label>
                                <Select
                                    value={ConvertAdvertisment?.Exclude}
                                    onChange={(options) => { setConvertAdvertisment({ ...ConvertAdvertisment, Exclude: options }) }}
                                    placeholder='Select Exclude'
                                    options={
                                        store?.Industry.length > 0 && store?.Industry[1].subIndustry
                                            ? store?.Industry[1].subIndustry.map((item) => ({
                                                value: item?.industryID,
                                                label: item?.industryName,
                                            }))
                                            : [{ value: "", label: "Not Found" }]
                                    }
                                    isClearable={true}
                                />
                                {Errors && ConvertAdvertisment?.Exclude === null && (
                                    <p className="text-red-600 text-sm font-semibold ">
                                        Exclude Name is Required.
                                    </p>
                                )}
                            </div>

                        </div>
                        <div className="pb-6 flex justify-center">
                            <button
                                type='button'
                                className="bg-primary text-white px-8 py-2 rounded-full"
                                // onClick={()=>onSumbit()}
                                onClick={onSumbit}
                            >
                                Save
                            </button>

                            <button
                                className="bg-primary text-white px-4 py-2 rounded-full ml-3"
                                onClick={() => setConvertAdvertisingModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
