import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import Select from "react-select";
import { getIndustry } from '../../../../Redux/CommonSlice';
import { useSelector } from 'react-redux';
import { getConvertToAdvertisement } from '../../../../Redux/Screenslice';


export default function ConvertAdvertisingModal({ setConvertAdvertisingModal, selectedItems }) {

    const dispatch = useDispatch()
    const store = useSelector((state) => state.root.common);
    const [Errors, setErrors] = useState(false);
    const [ConvertAdvertisment, setConvertAdvertisment] = useState({
        Industry: null,
        IndustryId: null,
        Exclude: null
    });
    const [submenuOptions, setSubmenuOptions] = useState([]);

    useEffect(() => {
        dispatch(getIndustry({}))
    }, [dispatch]);


    const handleIndustryChange = (selectedOption) => {
        if (selectedOption) {
            const industry = store?.Industry.find(item => item?.industryID === selectedOption?.value);
            if (industry) {
                setConvertAdvertisment({ ...ConvertAdvertisment, Industry: selectedOption })
            } else {

                setConvertAdvertisment({ ...ConvertAdvertisment, IndustryId: selectedOption })
            }
            setSubmenuOptions(industry ? industry.subIndustry : submenuOptions);
        } else {
            setSubmenuOptions([]);
        }
    };


    const onSumbit = () => {
        if ((!ConvertAdvertisment?.Exclude) || (!ConvertAdvertisment?.Industry)) {
            return setErrors(true)
        }

        const allScreenids = selectedItems.map((i) => i).join(",");

        const Payload = {
            ScreenIds: allScreenids,
            IndustryID: ConvertAdvertisment?.Industry,
            ExcludeID: ConvertAdvertisment?.Exclude?.value,
        }

        dispatch(getConvertToAdvertisement(Payload))
        setConvertAdvertisingModal(false)
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

                                <select name="Industry" id="Industry" className='border border-primary rounded-lg px-4 pl-2 py-2 w-full'
                                    value={ConvertAdvertisment?.Industry}
                                    onChange={(e) => { setConvertAdvertisment({ ...ConvertAdvertisment, Industry: e.target.value }) }}
                                >
                                    <option className='hidden'>Select Industry</option>
                                    {store?.Industry?.length > 0 ? store?.Industry?.map((item) => (
                                        <optgroup key={item?.industryID} label={item?.industryName}>
                                            {item?.subIndustry && item?.subIndustry?.length > 0 ? (
                                                item?.subIndustry.map((subItem) => (
                                                    <option key={subItem?.industryID} value={subItem?.industryID}>
                                                        {subItem?.industryName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No sub-items available</option>
                                            )}
                                        </optgroup>
                                    )) : <optgroup>Not Found</optgroup>
                                    }

                                </select>

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
