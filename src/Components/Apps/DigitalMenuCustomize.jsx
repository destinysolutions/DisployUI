import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Currency, FontSize, ImageLayout, PageArray, Theme } from '../Common/Common';
import { SketchPicker } from 'react-color';

const DigitalMenuCustomize = ({ toggleModal, register, onSubmit, handleSubmit, errors, selectedColor, setSelectedColor }) => {

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-4xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                General Options
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    toggleModal();
                                }}
                            />
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <div className='h-96 overflow-y-auto'>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Time spent on each page
                                        </span>
                                        <input type='text' className="w-48 relative border border-black rounded-md p-3"
                                            {...register("EachPageTime")} />
                                    </div>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Images to display on each page
                                        </span>
                                        <select id="EachPage" name="EachPage" className="w-48 relative border border-black rounded-md p-3"
                                            {...register("EachPage")} >
                                            {PageArray?.map((item, index) => {
                                                return (
                                                    <option value={item?.page} key={index}>{item?.page}</option>
                                                )
                                            })}

                                        </select>
                                    </div>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Switch to the image layout
                                        </span>
                                        <select id="ImageLayout" name="ImageLayout" className="w-64 relative border border-black rounded-md p-3"
                                            {...register("ImageLayout")} >
                                            {ImageLayout?.map((item, index) => {
                                                return (
                                                    <option value={item?.layout} key={index}>{item?.layout}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Currency
                                        </span>
                                        <select id="Currency" name="Currency" className="w-48 relative border border-black rounded-md p-3"
                                            {...register("Currency")}>
                                            {Currency?.map((item, index) => {
                                                return (
                                                    <option value={item?.currency} key={index}>{item?.currency}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Show currency sign
                                        </span>
                                        <div>
                                            <label className="relative inline-flex items-center me-5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    id='CurrencyShow'
                                                    {...register("CurrencyShow")}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Show prices
                                        </span>
                                        <div>
                                            <label className="relative inline-flex items-center me-5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    id='ShowPrice'
                                                    {...register("ShowPrice")}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Move 'featured' items to the top of category
                                        </span>
                                        <div>
                                            <label className="relative inline-flex items-center me-5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    id='Topfeature'
                                                    {...register("Topfeature")}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Font Size
                                        </span>
                                        <select id="FontSize" name="FontSize" className="w-48 relative border border-black rounded-md p-3"
                                            {...register("FontSize")}
                                        >
                                            {FontSize?.map((item, index) => {
                                                return (
                                                    <option value={item?.size} key={index}>{item?.size}</option>
                                                )
                                            })}
                                        </select>
                                    </div>

                                    <div className='m-3'>
                                        <span className='text-3xl font-medium'>
                                            Appearance
                                        </span>

                                    </div>
                                    {/*       <div className='m-3'>
                                        <select id="Theme" name="Theme" className="formInput"
                                            {...register("Theme")}
                                        >
                                            {Theme?.map((item, index) => {
                                                return (
                                                    <option value={item?.theme} key={index}>{item?.theme}</option>
                                                )
                                            })}
                                        </select>

                                        </div>*/}
                                    <div className='flex justify-between m-3 items-center'>
                                        <span>
                                            Background Color
                                        </span>
                                        <SketchPicker
                                            id="Color"
                                            name="Color"
                                            color={selectedColor}
                                            onChange={(color) => setSelectedColor(color.hex)}
                                            className="sketch-picker-digital-menu"
                                        />
                                    </div>
                                    {/*<div className='m-3'>
                                        <input type='file' className="formInput" id='Image'
                                            {...register("Image")}
                                        />
                                    </div>*/}
                                </div>
                                <div className="flex items-center justify-center gap-2 border-t border-black">
                                    <button
                                        type="button"
                                        className="w-40 text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-full py-3.5 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
                                        onClick={() => toggleModal()}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-40 text-[#FFFFFF] bg-SlateBlue not-italic font-medium rounded-full py-3.5 text-center text-base mt-4 hover:bg-primary border border-SlateBlue hover:border-white"
                                       
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DigitalMenuCustomize
