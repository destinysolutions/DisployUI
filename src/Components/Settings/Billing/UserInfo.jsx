import React, { useState } from 'react'
import { IoChevronBack } from 'react-icons/io5'
// import AddCreditCard from '../Common/AddCreditCard'
import { Modal } from 'react-responsive-modal';


const UserInfo = ({ setShowBillingProfile,showBillingProfile  }) => {
    const [newCardShow, setNewCardShow] = useState(false);

    const onSubmit =() =>{
        setNewCardShow(!newCardShow)
    }

    const toggleModal =() =>{
        setNewCardShow(!newCardShow)
    }
    
    return (
        <>
                <div className="flex items-center justify-between mx-2 mb-5 mt-3">
                    <div className="title">
                        <h2
                            className="font-bold text-xl flex gap-2 cursor-pointer"
                            onClick={() => setShowBillingProfile(false) }>
                            <IoChevronBack size={30} />
                            User Information
                        </h2>
                    </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-5">
                <div className="w-full md:w-1/2 px-3 mb-4">
                    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 min-h-full m-1">
                        <div className="user-details text-center border-b border-light-blue mb-4">
                            <span className="user-img"><img src="dist/images/3user-img.png" /></span>
                            <span className="user-name my-2">Harry McCall</span>
                            <span className="user-designation">Manager</span>
                            <div className="total-screens-count mt-2 mb-4">
                                <span className="screen-icon mr-3"><i className="fa fa-tv text-blue text-2xl"></i></span>
                                <span className="screen-count text-left"><strong>50</strong>
                                    <p>Total Screens</p>
                                </span>
                            </div>
                        </div>
                        <div className="user-pro-details">
                            <h3 className="user-name my-2">Details</h3>
                            <div className="flex">
                                <label>User ID:</label><span>#5036</span></div>
                            <div className="flex">
                                <label>User Name:</label><span>Harry McCall</span></div>
                            <div className="flex">
                                <label>Company Name:</label><span>Schneider-Kuphal</span></div>
                            <div className="flex">
                                <label>Email:</label><span>harrymc.call@gmail.com</span></div>
                            <div className="flex">
                                <label>Status:</label><span className="user-designation">Active</span></div>
                            <div className="flex">
                                <label>Role::</label><span>Manager</span></div>
                            <div className="flex">
                                <label>Tax ID:</label><span>Tax-8894</span></div>
                            <div className="flex">
                                <label>Contact:</label><span>(397) 294-5153</span></div>
                            <div className="flex">
                                <label>Language:</label><span>English</span></div>
                            <div className="flex">
                                <label>Country:</label><span>USA</span></div>
                            <div className="flex justify-center w-full mt-2">
                                <button className="mr-3 hover:bg-white hover:text-blue text-base px-8 py-2 border border-blue  shadow-md rounded-full bg-blue text-white ">Edit</button>
                                <button className="hover:bg-white hover:text-red-900 text-base px-8 py-2 border border-red-900 shadow-md rounded-full text-red-900  bg-red-200 "> Suspend</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4 ">
                    <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 min-h-full">
                        <div className="user-pro-details">
                            <h3 className="user-name my-2">Current Plan</h3><strong className="">Your Current Plan 14-day FREE trial</strong>
                            <p className="mb-4">A simple start for everyone</p><strong className="">Active until July 25, 2023</strong>
                            <p className="mb-4">We will send you a notification upon Subscription expiration.</p>
                            <div className="flex justify-center w-full my-5">
                                <button className="temp-button">Temp Button </button>
                            </div>
                            <div className="w-full py-6 my-5 bg-light-red text-center">
                                <p className="mt-5">We need your attention!</p>
                                <p className="mb-5"> Your plan requires update</p>
                            </div>
                            <div className="w-full mb-4">
                                <div className="flex justify-between"><span>Days</span><span>10 of 14 Days</span></div>
                                <input id="customRange1" className="w-full form-range" type="range" />
                            </div>
                            <div className="flex justify-center w-full mb-5">
                                <button className="mr-3 hover:bg-white hover:text-blue text-base px-8 py-2 border border-blue  shadow-md rounded-full bg-blue text-white ">increase trial days</button>
                                <button className="hover:bg-white hover:text-text-red-900 text-base px-8 py-2 border border-red-900 shadow-md rounded-full text-red-900  bg-red-200 "> Cancel Subscription</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 mb-5 m-1">
                <h3 className="user-name mb-4">Credi &amp; Debit Cards</h3>
                <form className="w-full space-y-6" action="">
                    <div className="mb-5">
                        <input className="sr-only peer" type="radio" name="options" id="option_1" />
                        <label className="flex items-center justify-between h-16 px-5 bg-white border border-gray-300 rounded-lg cursor-pointer group" htmlFor="option_1">
                            <div className="flex flex-col mr-6">
                                <div className="lg:flex md:flex sm:flex xs:block items-center">
                                    <img src="dist/images/logos_mastercard.png" className="mr-2" />
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">Axis Bank</h4>
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">**** **** **** 8395</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="bg-green-600 bg-gray-500 text-white px-6 py-2 mr-5 rounded-full">Default Card</span>
                                <div className="flex items-center justify-center w-6 h-6 border border-gray-600 rounded-full peer-checked:group:bg-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="hidden w-4 h-4 text-indigo-200 fill-current peer-checked:group:visible" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="mb-5">
                        <input className="sr-only peer" defaultChecked type="radio" name="options" id="option_2" />
                        <label className="flex items-center justify-between h-16 px-5 bg-white border border-gray-300 rounded-lg cursor-pointer group" htmlFor="option_2">
                            <div className="flex flex-col mr-6">
                                <div className="lg:flex md:flex sm:flex xs:block items-center">
                                    <img src="dist/images/logos_visa.png" className="mr-2" />
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">HDFC Bank</h4>
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">**** **** **** 6246</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="bg-gray-500 text-white px-6 py-2 mr-5 rounded-full">Secondary</span>
                                <div className="flex items-center justify-center w-6 h-6 border border-gray-600 rounded-full peer-checked:group:bg-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="hidden w-4 h-4 text-indigo-200 fill-current peer-checked:group:visible" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="mb-5">
                        <input className="sr-only peer" type="radio" name="options" id="option_3" />
                        <label className="flex items-center justify-between h-16 px-5 bg-white border border-gray-300 rounded-lg cursor-pointer group" htmlFor="option_3">
                            <div className="flex flex-col mr-6">
                                <div className="lg:flex md:flex sm:flex xs:block items-center">
                                    <img src="dist/images/logos_visa.png" className="mr-2" />
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">HDFC Bank</h4>
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">**** **** **** 6246</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 border border-gray-600 rounded-full peer-checked:group:bg-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="hidden w-4 h-4 text-indigo-200 fill-current peer-checked:group:visible" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                </svg>
                            </div>
                        </label>
                    </div>
                    <div className="mb-5">
                        <input className="sr-only peer" type="radio" name="options" id="option_4" />
                        <label className="flex items-center justify-between h-16 px-5 bg-white border border-gray-300 rounded-lg cursor-pointer group" htmlFor="option_4">
                            <div className="flex flex-col mr-6">
                                <div className="lg:flex md:flex sm:flex xs:block items-center">
                                    <img src="dist/images/logos_visa.png" className="mr-2" />
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">HDFC Bank</h4>
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">**** **** **** 6246</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 border border-gray-600 rounded-full peer-checked:group:bg-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="hidden w-4 h-4 text-indigo-200 fill-current peer-checked:group:visible" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                </svg>
                            </div>
                        </label>
                    </div>
                    <div className="mb-5" onClick={() => setNewCardShow(true)}>
                        <input className="sr-only peer" type="radio" name="options" id="option_5" />
                        <label className="flex items-center justify-between h-16 px-5 bg-white border border-gray-300 rounded-lg cursor-pointer group" htmlFor="option_5">
                            <div className="flex flex-col mr-6">
                                <div className="lg:flex md:flex sm:flex xs:block items-center">
                                    <i className="fa fa-plus bg-blue-lighter text-gray p-2 mr-3 rounded-lg" aria-hidden="true"></i>
                                    <h4 className="text-[#606060] lg:text-lg md:text-lg sm:text-lg xs:text-xs">Add New Card</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 border border-gray-600 rounded-full peer-checked:group:bg-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="hidden w-4 h-4 text-indigo-200 fill-current peer-checked:group:visible" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                </svg>
                            </div>
                        </label>
                    </div>
                </form>
            </div>
            <div className="bg-white shadow-xl rounded-xl p-5 border border-gray-200 min-h-full m-1">
                <h3 className="user-name my-2">Billing Address</h3>
                <div className="full flex flex-wrap -mx-3 mb-3">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <div className="user-pro-details">
                            <div className="flex">
                                <label>Company Name:</label><span>Pixinvent</span></div>
                            <div className="flex">
                                <label>Billing Email:</label><span>gertrude@gmail.com</span></div>
                            <div className="flex">
                                <label>Tax ID:</label><span>TAX-875623</span></div>
                            <div className="flex">
                                <label>VAT Number</label><span>SDF754K77</span></div>
                            <div className="flex">
                                <label>Billing Address:</label><span>100 Water Plant Avenue, Building 303 Wake Island</span></div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <div className="user-pro-details">
                            <div className="flex">
                                <label>Contact</label><span>+1(609) 933-44-22</span></div>
                            <div className="flex">
                                <label>Country:</label><span>USA</span></div>
                            <div className="flex">
                                <label>State:</label><span>Queensland</span></div>
                            <div className="flex">
                                <label>Zip Code:</label><span>403114</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserInfo
