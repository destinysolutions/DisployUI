import React, { useEffect, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getIndustry } from '../../../../Redux/CommonSlice';
import { getConvertToAdvertisement } from '../../../../Redux/Screenslice';
import { getCurrentTimewithSecound } from '../../../Common/Common';

export default function ConvertAdvertisingModal({ setConvertAdvertisingModal, selectedItems, setLoadFist }) {
    const dispatch = useDispatch();
    const store = useSelector((state) => state.root.common);
    const [type, settype] = useState(1);
    const [Errors, setErrors] = useState(false);
    const [ConvertAdvertisment, setConvertAdvertisment] = useState({
        Industry: null,
        Exclude: null,
    });
    const [excludeOptions, setExcludeOptions] = useState([]);
    const [industryOptions, setIndustryOptions] = useState([]);
    const [AllDay, setAllDay] = useState();
    const [schedule, setSchedule] = useState({
        Sunday: [{ startTime: getCurrentTimewithSecound(), endTime: getCurrentTimewithSecound(), isClose: false }],
        Monday: [{ startTime: getCurrentTimewithSecound(), endTime: getCurrentTimewithSecound(), isClose: false }],
        Tuesday: [{ startTime: getCurrentTimewithSecound(), endTime: getCurrentTimewithSecound(), isClose: false }],
        Wednesday: [{ startTime: getCurrentTimewithSecound(), endTime: getCurrentTimewithSecound(), isClose: false }],
        Thursday: [{ startTime: getCurrentTimewithSecound(), endTime: getCurrentTimewithSecound(), isClose: false }],
        Friday: [{ startTime: getCurrentTimewithSecound(), endTime: getCurrentTimewithSecound(), isClose: false }],
        Saturday: [{ startTime: getCurrentTimewithSecound(), endTime: getCurrentTimewithSecound(), isClose: false }]
    });

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

    const handleTimeChange = (day, index, type, value) => {
        const updatedDay = [...schedule[day]];
        updatedDay[index][type] = value;
        setSchedule({ ...schedule, [day]: updatedDay });
    };

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
            screenMasterScheduleLists: AllDay
        };

        setConvertAdvertisingModal(false);
        dispatch(getConvertToAdvertisement(Payload)).then((res) => {
            setLoadFist(true);
        });
    };

    const handleSchedule = () => {
        const payload = [];
        Object.keys(schedule).forEach(day => {
            schedule[day].forEach(slot => {
                payload.push({
                    dayName: day,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isClose: slot.isClose,
                });
            });
        });
        setAllDay(payload)
        return payload;
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
                        {type === 1 && (
                            <div className='py-5'>
                                <div className='bg-gray-200 text-white px-4 py-1.5 rounded-full w-52 m-auto mb-5'>
                                    <h2 className="font-semibold  text-sm text-black text-center">Screen wake up time</h2>
                                </div>
                                <div className='flex  flex-col  px-3 '>
                                    <div className='m-auto flex gap-x-16  w-[420px]  justify-end mb-3'>
                                        <h2 className=" font-medium text-black-600 mb-1 ">Start Time :</h2>
                                        <h2 className=" font-medium text-black-600 mb-1 ">End Time :</h2>
                                    </div>
                                    {Object.keys(schedule).map((day) => {
                                        const data = schedule[day][0]
                                        return (
                                            <div key={day} className='mb-3 m-auto  text-center flex  items-center justify-between w-[500px] '>
                                                <div className='flex  items-center w-[200px]  justify-between'>
                                                    <div className=" font-medium text-black-600  text-left mr-3 ">{day}</div>
                                                    <div className=" flex items-center ">
                                                        <input
                                                            className="border border-primary mr-3  rounded h-4 w-4"
                                                            type="checkbox"
                                                            checked={data?.isClose}
                                                            onChange={(e) => {
                                                                handleTimeChange(day, 0, 'isClose', e.target.checked)
                                                            }}
                                                        />
                                                        <label>Closed</label>
                                                    </div>
                                                </div>
                                                {schedule[day].map((slot, index) => (
                                                    <div key={index} className='flex items-center gap-3  '>
                                                        <input
                                                            type='time'
                                                            className="border border-gray-300 shadow p-2 w-32 rounded"
                                                            onChange={(e) => handleTimeChange(day, index, 'startTime', e.target.value)}
                                                            value={slot.startTime}
                                                            disabled={slot?.isClose}
                                                        />
                                                        <input
                                                            type='time'
                                                            // max={slot?.startTime}
                                                            disabled={slot?.isClose}
                                                            className="border border-gray-300 shadow p-2 w-32 rounded "
                                                            onChange={(e) => handleTimeChange(day, index, 'endTime', e.target.value)}
                                                            value={slot.endTime}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className=" flex justify-center gap-2 mt-3">
                                    <button
                                        className="bg-primary text-white px-5 py-2 rounded-full "
                                        onClick={() => setConvertAdvertisingModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='button'
                                        className="bg-primary text-white px-8 py-2 rounded-full"
                                        onClick={() => {
                                            handleSchedule()
                                            settype(type + 1)
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                        {type === 2 && (
                            <div >
                                <h2 className="font-semibold mt-3 text-base  text-center">Choose Your Industry (Include / Excludes)</h2>
                                <div className="p-5">
                                    <div className="w-full mb-5">
                                        <label className=" ml-1 lg:text-base md:text-base sm:text-xs xs:text-xs ">Industry :</label>
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
                                <div className="pb-6 flex justify-center gap-3">
                                    <button
                                        className="bg-primary text-white px-8 py-2 rounded-full"
                                        onClick={() => settype(type - 1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type='button'
                                        className="bg-primary text-white px-8 py-2 rounded-full"
                                        onClick={onSumbit}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
