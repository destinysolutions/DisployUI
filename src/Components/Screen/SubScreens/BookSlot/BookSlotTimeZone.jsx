import React from 'react'
import { MdArrowBackIosNew, MdCloudUpload } from 'react-icons/md';
import { customTimeOrhour } from '../../../Common/Util';
import { FaPlusCircle } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { buttons, secondsToHMS } from '../../../Common/Common';
import logo from "../../../../images/DisployImg/Black-Logo2.png";
import ReactTooltip from 'react-tooltip';

export default function BookSlotTimeZone({
    allTimeZone,
    selectedTimeZone,
    handleSelectTimeZoneChange,
    repeat,
    startDate,
    handleStartDateChange,
    endDate,
    setRepeat,
    handleEndDateChange,
    getallTime,
    handleStartTimeChange,
    handleEndTimeChange,
    handleSequenceChange,
    handleaftereventChange,
    handleAftereventTypeChange,
    handleOpenImagePopup,
    handleAddItem,
    handleRemoveItem,
    selectAllDays,
    handleCheckboxChange,
    countAllDaysInRange,
    handleDayButtonClick,
    setPage,
    handleBookSlot,
    page,
    selectedDays,
    totalDuration,
}) {
    return (
        <div className="w-full h-full p-5 flex items-center justify-center">
            <div className="lg:w-[800px] md:w-[700px] w-full max-h-[70vh] bg-white lg:p-6 p-3 rounded-lg shadow-lg overflow-auto">
                {/* <div className="text-2xl font-semibold">Book Slot</div>*/}
                <div className="flex items-center justify-center mb-4">
                    <img
                        alt="Logo"
                        src={logo}
                        className="cursor-pointer duration-500 w-52"
                    />
                </div>
                <div className="grid grid-cols-4 gap-4 w-full ">
                    <div className="col-span-4">
                        <div className="flex flex-col gap-4">
                            {/*<div>TimeZone</div>*/}
                            <div className="flex items-center gap-2">
                                {/* <IoEarthSharp /> */}
                                <select
                                    className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                                    id="selectOption"
                                    value={selectedTimeZone}
                                    onChange={handleSelectTimeZoneChange}
                                >
                                    {allTimeZone?.map((timezone) => {
                                        return (
                                            <option
                                                value={timezone.timeZoneID}
                                                key={timezone.timeZoneID}
                                            >
                                                {timezone.timeZoneLabel}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* {!repeat && (
                      <div>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="relative w-full col-span-2">
                            <select
                              className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                              id="selectOption"
                              value={selectedCountry}
                              onChange={handleSelectCountries}
                            >
                              {countries?.map((country) => {
                                return (
                                  <option
                                    value={country.countryID}
                                    key={country.countryID}
                                  >
                                    {country.countryName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="relative w-full col-span-2">
                            <select
                              className="border border-primary rounded-lg px-4 pl-2 py-2 w-full"
                              id="selectOption"
                              value={selecteStates}
                              onChange={handleSelectStatesChange}
                            >
                              {states && states?.map((timezone) => {
                                return (
                                  <option
                                    value={timezone.stateId}
                                    key={timezone.stateId}
                                  >
                                    {timezone.stateName}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    )} */}
                            {/* Country end */}


                            {!repeat && (
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="relative w-full col-span-2">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            className="formInput"
                                        />
                                    </div>
                                    <div className="relative w-full col-span-2">
                                        <input
                                            type="date"
                                            min={startDate}
                                            value={endDate}
                                            className="formInput"
                                            disabled={!repeat}
                                        />
                                    </div>
                                </div>
                            )}

                            {repeat && (
                                <div>
                                    <div className="gap-4 flex">
                                        <div className="icons flex items-center">
                                            <div>
                                                <button
                                                    className="border rounded-full bg-SlateBlue text-white mr-2 hover:shadow-xl hover:bg-primary border-white shadow-lg"
                                                    onClick={() => setRepeat(false)}
                                                >
                                                    <MdArrowBackIosNew className="p-1 px-2 text-4xl text-white hover:text-white " />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative w-full col-span-2">
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={handleStartDateChange}
                                                className="formInput"
                                            />
                                        </div>
                                        <div className="relative w-full col-span-2">
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={handleEndDateChange}
                                                className="formInput"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="overflow-auto max-h-44">
                                    {getallTime?.map((item, index) => {
                                        return (
                                            <div
                                                className="flex items-center justify-center gap-4 mb-3"
                                                // className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 gap-4 mb-3"
                                                key={index}
                                            >
                                                <div className="relative w-full col-span-1">
                                                    <input
                                                        type="time"
                                                        name={`startTime${index}`}
                                                        id="name"
                                                        value={item?.startTime}
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Time"
                                                        required=""
                                                        onChange={(e) => handleStartTimeChange(e, index)}
                                                    />
                                                </div>

                                                <div className="relative w-full col-span-1">
                                                    <input
                                                        type="time"
                                                        name={`endTime${index}`}
                                                        id="name"
                                                        value={item.endTime}
                                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Time"
                                                        required=""
                                                        onChange={(e) => handleEndTimeChange(e, index)}
                                                    />
                                                </div>


                                                <div className="relative  col-span-4 flex justify-center items-center gap-4">
                                                    <div className="relative  col-span-1 " >
                                                        <select
                                                            className="border border-primary rounded-lg pl-2 py-2 w-40"
                                                            id="selectOption"
                                                            value={item.sequence}
                                                            onChange={(e) => handleSequenceChange(index, e.target.value)}
                                                        >
                                                            {/* <option value="" className="hidden">Select</option> */}
                                                            {customTimeOrhour?.map((item) => {
                                                                return (
                                                                    <option
                                                                        value={item.id}
                                                                        key={item.id}
                                                                    >
                                                                        {item.name}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                    {item?.sequence === "Custom" && (
                                                        <div className=" flex items-center   justify-center ">
                                                            <label className="text-sm font-medium w-20 mr-2">After every:</label>
                                                            <div className="flex justify-center items-center  ">
                                                                <div>
                                                                    <input
                                                                        className="block w-20 p-2 text-gray-900 border border-gray-300  bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                                        type="number"
                                                                        value={item?.afterevent}
                                                                        onChange={(e) => { handleaftereventChange(e, index) }}
                                                                    />
                                                                </div>
                                                                <div className="flex">
                                                                    <div className="ml-2 flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            value={item?.aftereventType}
                                                                            checked={item?.aftereventType === "Hour"}
                                                                            name="Cel"
                                                                            id='Hour'
                                                                            onChange={() => handleAftereventTypeChange("Hour", index)}
                                                                        />
                                                                        <label for='Hour' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">
                                                                            Hour
                                                                        </label>
                                                                    </div>
                                                                    <div className="ml-3 flex items-center">
                                                                        <input
                                                                            id='Minute'
                                                                            type="radio"
                                                                            value={item?.aftereventType}
                                                                            checked={item?.aftereventType === "Minute"}
                                                                            name="Cel"
                                                                            onChange={() => handleAftereventTypeChange("Minute", index)}
                                                                        />
                                                                        <label for='Minute' className="ml-1 lg:text-sm md:text-sm sm:text-xs xs:text-xs">
                                                                            Minute
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div
                                                            data-tip
                                                            data-for="Upload"
                                                            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            onClick={() => handleOpenImagePopup(index)}
                                                        >
                                                            <MdCloudUpload size={16} />
                                                            <ReactTooltip
                                                                id="Upload"
                                                                place="bottom"
                                                                type="warning"
                                                                effect="solid"
                                                            >
                                                                <span>Upload</span>
                                                            </ReactTooltip>
                                                        </div>
                                                        <div
                                                            data-tip
                                                            data-for="Add"
                                                            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-xl p-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            onClick={handleAddItem}
                                                        >
                                                            <FaPlusCircle size={16} />
                                                            <ReactTooltip
                                                                id="Add"
                                                                place="bottom"
                                                                type="warning"
                                                                effect="solid"
                                                            >
                                                                <span>Add</span>
                                                            </ReactTooltip>
                                                        </div>
                                                        {getallTime.length > 1 && (
                                                            <div
                                                                data-tip
                                                                data-for="Delete"
                                                                className="cursor-pointer text-white bg-rose-600 hover:bg-rose-800 font-medium rounded-full text-xl p-1.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                                onClick={() => handleRemoveItem(index)}
                                                            >
                                                                <RiDeleteBin5Line size={16} />
                                                                <ReactTooltip
                                                                    id="Delete"
                                                                    place="bottom"
                                                                    type="warning"
                                                                    effect="solid"
                                                                >
                                                                    <span>Delete</span>
                                                                </ReactTooltip>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {!repeat && (
                                    <div className="flex gap-3 items-center my-2">
                                        <input
                                            type="checkbox"
                                            className='cursor-pointer'
                                            onChange={() => setRepeat(true)}
                                        />
                                        <div>Repetition days</div>
                                    </div>
                                )}
                                {repeat && (
                                    <div className="flex flex-col gap-3 mt-2">
                                        <div className=" text-black font-medium text-lg">
                                            <label>
                                                Repeating {countAllDaysInRange()} Day(s)
                                            </label>
                                        </div>
                                        <div className="flex flex-row gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectAllDays}
                                                onChange={handleCheckboxChange}
                                                id="repeat_all_day"
                                                className='cursor-pointer'
                                            />
                                            <label
                                                className="ml-3 select-none"
                                                htmlFor="repeat_all_day"
                                            >
                                                Repeat for All Day
                                            </label>
                                        </div>
                                        <div>
                                            {buttons.map((label, index) => (
                                                <button
                                                    className={`border border-primary px-3 py-1 mr-2 mb-2 rounded-full ${selectedDays[index] &&
                                                        "bg-SlateBlue border-white"
                                                        }`}
                                                    key={index}
                                                    onClick={() =>
                                                        handleDayButtonClick(index, label)
                                                    }
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr />
                        <div className='flex justify-center font-semibold text-lg my-3'>
                            <p>Repetition Duration: {secondsToHMS(totalDuration)}</p>
                        </div>
                        <div className="w-full">
                            <div className="flex justify-center h-full items-end">
                                <button
                                    className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-4 md:px-8 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                    onClick={() => setPage(page - 1)}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="sm:ml-2 xs:ml-1  flex align-middle bg-SlateBlue text-white items-center  rounded-full xs:px-3 xs:py-1 sm:px-4 md:px-8 sm:py-2 text-base  hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                    onClick={() => handleBookSlot()}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
