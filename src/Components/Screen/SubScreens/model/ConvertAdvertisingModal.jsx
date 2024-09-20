import React, { useEffect, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getIndustry } from '../../../../Redux/CommonSlice';
import { getConvertToAdvertisement } from '../../../../Redux/Screenslice';

export default function ConvertAdvertisingModal({ setConvertAdvertisingModal, selectedItems, setLoadFist }) {
    const dispatch = useDispatch();
    const store = useSelector((state) => state.root.common);
    const [Errors, setErrors] = useState(false);
    const [ConvertAdvertisment, setConvertAdvertisment] = useState({
        Industry: null,
        Exclude: null,
    });
    const [excludeOptions, setExcludeOptions] = useState([]);
    const [industryOptions, setIndustryOptions] = useState([]);

    useEffect(() => {
        dispatch(getIndustry({})).then((res) => {
            const response = res?.payload?.data
            const formattedOptions = response?.map(industry => ({
                value: industry?.industryID,
                label: `${industry?.industryName} ${industry?.industryInclude?.length > 0 ? `(${industry?.industryInclude?.map(item => item.category).join(", ")})` : ''}`
            }));

            setIndustryOptions(formattedOptions);
        });
    }, [dispatch,]);

    useEffect(() => {
        if (ConvertAdvertisment?.Industry) {
            const selectedIndustry = store?.Industry?.find(
                (industry) => industry?.industryID === ConvertAdvertisment?.Industry?.value
            );
            if (selectedIndustry) {
                setExcludeOptions(
                    selectedIndustry?.industryExclude?.map((item) => ({
                        value: item?.industryExcludeID,
                        label: item?.excludeName,
                    }))
                );
            } else {
                setExcludeOptions([]);
            }
        } else {
            setExcludeOptions([]);
        }
    }, [ConvertAdvertisment?.Industry, store?.Industry]);

    const onSumbit = () => {
        if (!ConvertAdvertisment?.Exclude || !ConvertAdvertisment?.Industry) {
            return setErrors(true);
        }
        const allScreenids = selectedItems?.map((i) => i).join(",");
        const excludeIds = ConvertAdvertisment?.Exclude?.map(option => option?.value).join(",");

        const Payload = {
            ScreenIds: allScreenids,
            IndustryID: ConvertAdvertisment?.Industry?.value,
            ExcludeIDs: excludeIds,
        };

        setConvertAdvertisingModal(false);
        dispatch(getConvertToAdvertisement(Payload)).then((res) => {
            setLoadFist(true);
        });
    };

    return (
        <div>
            <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9990 outline-none focus:outline-none">
                <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[550px] bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
                            <h3 className="lg:text-lg md:text-lg sm:text-base xs:text-sm font-medium">Convert to Advertising</h3>
                            <button className="p-1 text-xl ml-8" onClick={() => setConvertAdvertisingModal(false)}>
                                <AiOutlineCloseCircle className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="w-full mb-5">
                                <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">Industry :</label>
                                <Select
                                    value={ConvertAdvertisment.Industry}
                                    onChange={(options) => setConvertAdvertisment({ ...ConvertAdvertisment, Industry: options, Exclude: null })}
                                    placeholder="Select Industry"
                                    options={industryOptions?.length > 0 ? industryOptions : [{ value: "", label: "Not Found" }]}
                                    isClearable={true}

                                />
                                {Errors && !ConvertAdvertisment?.Industry && (
                                    <p className="text-red-600 text-sm font-semibold">Industry Name is Required.</p>
                                )}
                            </div>
                            <div className="w-full">
                                <label className="ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs">Exclude :</label>
                                <Select
                                    isMulti
                                    value={ConvertAdvertisment?.Exclude}
                                    onChange={(options) => setConvertAdvertisment({ ...ConvertAdvertisment, Exclude: options })}
                                    placeholder="Select Exclude"
                                    options={excludeOptions?.length > 0 ? excludeOptions : [{ value: "", label: "Not Found" }]}
                                    isClearable={true}
                                />
                                {Errors && !ConvertAdvertisment?.Exclude && (
                                    <p className="text-red-600 text-sm font-semibold">Exclude Name is Required.</p>
                                )}
                            </div>
                        </div>
                        <div className="pb-6 flex justify-center">
                            <button
                                type='button'
                                className="bg-primary text-white px-8 py-2 rounded-full"
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
    );
}
