import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { getTimeFromDate } from '../../Components/Common/Common';
import AddSegments from './AddSegments';
import Select from "react-select";
const FeatureDiscount = ({ discount, setDiscount }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [method, setMethod] = useState(0)
  const [purchase, setPurchase] = useState(1)
  const [maximumDiscount, setMaximumDiscount] = useState(0)
  const [shipping, setShipping] = useState(false)
  const [selectEnd, setSelectEnd] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [segment, setSegment] = useState("")
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [amount, setAmount] = useState("")
  const [openBrowser, setOpenBrowser] = useState(false)
  const [date, setDate] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: getTimeFromDate(new Date()),
    endTime: getTimeFromDate(new Date()),
  })

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const togglemodal = () => {
    setOpenBrowser(!openBrowser)
  }

  const handleBrowser = () => {
    togglemodal()
  }

  const handleSave = () => {
    setDiscount("")
  }

  return (
    <>
      <div className='mb-5 mt-3'>
        <div className="flex items-center justify-between border-b dark:border-gray-600">
          <div className="title">
            <h2
              className="text-xl flex gap-2 cursor-pointer"
              onClick={() => setDiscount("")}
            >
              <IoIosArrowBack size={30} className='ml-2' />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Create Feature Discount
              </h3>
            </h2>
          </div>
        </div>
      </div>
      <div className='border-b dark:border-gray-600'>
        <div className="flex flex-wrap mx-3 mb-3">
          <div className="w-full md:w-2/3 px-5">
            <div className="border border-light-blue rounded-xl mb-4">
              {/*<div className="flex items-center justify-between px-5 pb-5 border-b border-light-blue">
                <div className="title">
                  <h2 className="font-medium text-xl">Amount Off Feature</h2>
                </div>
                <button
                  className="bg-white text-primary text-base px-4 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                  type="button"
                >
                  Feature Discount
                </button>
  </div>*/}
              <div className="p-4">
                <h1 className="font-medium text-xl mb-3"> Method </h1>
                <div className="flex items-center mb-3">
                  <input id="radio1" type="radio" name="radio" className="hidden" defaultChecked="" />
                  <label htmlFor="radio1" className="flex items-center cursor-pointer text-xl">
                    <input type='radio' className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" onChange={(e) => setMethod(0)} checked={method === 0} />
                    Discount Code
                  </label>
                </div>
                <div className="flex items-center mb-3">
                  <input id="radio2" type="radio" name="radio" className="hidden" />
                  <label htmlFor="radio2" className="flex items-center cursor-pointer text-xl">
                    <input type='radio' className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" onChange={(e) => setMethod(1)} checked={method === 1} />
                    Automatic Discount
                  </label>
                </div>
                <div className="flex items-center mb-3">
                  <div className="w-full md:w-1/2 inputDiv relative">
                    <label className="label_top text-xs">Discount Code</label>
                    <input
                      className="w-full text-black border rounded-lg py-3 px-4"
                      name="Discount Code"
                      placeholder='Welcome20'
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3 mt-5">
                    <button
                      className="bg-white text-primary text-base px-6 py-3 border border-primary  shadow-md rounded-full hover:bg-primary hover:text-white mr-2"
                      type="button"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <p>Customer must enter this code at checkout.</p>
              </div>
            </div>
            <div className="border border-light-blue rounded-xl mb-4 p-4">
              <h1 className="font-medium lg:text-1xl md:text-1xl sm:text-xl mb-3"> Value </h1>
              <div className="flex items-center mb-5 w-96">
                <ul className="flex items-center w-full overflow-hidden border-2 border-blue rounded-lg">
                  <li className={`text-xl font-medium w-1/2 text-center ${activeTab === 0 ? "bg-black" : ""} py-3`}
                    onClick={() => handleTabClick(0)}>
                    <button className={`${activeTab === 0 ? "text-white" : "text-black"} text-lg`}>Percentage</button>
                  </li>
                  <li className={`text-xl font-medium w-1/2 text-center ${activeTab === 1 ? "bg-black" : ""} py-3`}
                    onClick={() => handleTabClick(1)}>
                    <button className={`${activeTab === 1 ? "text-white" : "text-black"} text-lg`}>Fixed Amount</button>
                  </li>
                </ul>
              </div>
              <div className="flex items-center">
                <div className="w-full md:w-1/2 inputDiv relative mb-3">
                  <input type="text" className="w-full border border-[#D5E3FF] rounded-lg p-2" placeholder={`${activeTab === 0 ? "10 %" : "$ 10"}`} onChange={(e) => setAmount(e.target.value)} value={amount} />
                </div>
              </div>
            </div>

            <div className="border border-light-blue rounded-xl mb-4 p-4">
              <h1 className="font-medium lg:text-1xl md:text-1xl sm:text-xl mb-3">Feature List </h1>
              <div className="flex items-center mb-3">
                <label htmlFor="radio3" className="flex items-center cursor-pointer text-xl w-full">
                  <Select
                  className='w-80'
                    // value={selectedScreens}
                    // onChange={handleSelectChange}
                    // options={Screenoptions}
                    isMulti
                  />
                </label>
              </div>

            </div>


            <div className="border border-light-blue rounded-xl mb-4 p-4">
              <h1 className="font-medium lg:text-1xl md:text-1xl sm:text-xl mb-3">Minimum Purchase Requirement </h1>
              <div className="flex items-center mb-3">
                <label htmlFor="radio3" className="flex items-center cursor-pointer text-xl">
                  <input type='radio' className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" onChange={() => setPurchase(0)} checked={purchase === 0} />No Minimum Requirement
                </label>
              </div>
              <div className="flex items-center mb-3">
                <input id="radio4" type="radio" name="radio" className="hidden" />
                <label htmlFor="radio4" className="flex items-center cursor-pointer text-xl">
                  <input type='radio' className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" onChange={() => setPurchase(1)} checked={purchase === 1} />Minimum Purchase Amount ($)
                </label>
              </div>
              {purchase === 1 && (
                <div className="flex items-center mb-3">
                  <input type="text" className="border border-[#D5E3FF] rounded-lg p-2" placeholder="$ 0.00" onChange={(e) => setPurchaseAmount(e.target.value)} value={[purchaseAmount]} />
                </div>
              )}
              <div className="flex items-center">
                <input id="radio5" type="radio" name="radio" className="hidden" />
                <label htmlFor="radio5" className="flex items-center cursor-pointer text-xl">
                  <input type='radio' className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" onChange={() => setPurchase(2)} checked={purchase === 2} />
                  Minimum Quantity Of Items
                </label>
              </div>
            </div>


            <div className="border border-light-blue rounded-xl mb-4 p-4">
              <h1 className="font-medium lg:text-1xl md:text-1xl sm:text-xl mb-3">Maximum Discount Uses </h1>
              <div className="flex items-center mb-3">
                <label className="checkbox flex items-center gap-1" htmlFor="screen1">
                  <input type="checkbox" className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" id="screen1" onChange={() => setMaximumDiscount(0)} checked={maximumDiscount === 0} />
                  <div className="checkbox__indicator"></div>
                  <span className="checkbox__label">Limit Number Of Times This Discount Can Be Used in Total</span>
                </label>
              </div>
              {maximumDiscount === 0 && (
                <div className="flex items-center mb-3"><input type="text" className="border border-[#D5E3FF] rounded-lg p-2" placeholder="Maximum Discount" /></div>
              )}
              <div className="flex items-center">
                <label className="checkbox flex items-center gap-1 cursor-pointer" htmlFor="screen2">
                  <input type="checkbox" className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" id="screen2" onChange={() => setMaximumDiscount(1)} checked={maximumDiscount === 1} />
                  <div className="checkbox__indicator"></div>
                  <span className="checkbox__label">Limit To One Use Per Customer</span>
                </label>
              </div>
            </div>
            <div className="border border-light-blue rounded-xl mb-4 p-4">
              <h1 className="font-medium lg:text-1xl md:text-1xl sm:text-xl mb-2"> Combinations </h1>
              <p className="mb-2"><strong>Welcome20 Can Be Combined With:</strong></p>
              <div className="flex items-center">
                <label className="checkbox flex items-center gap-1 cursor-pointer" htmlFor="Shipping">
                  <input type="checkbox" className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" id="Shipping" onChange={() => setShipping(!shipping)} checked={shipping} />
                  <div className="checkbox__indicator"></div>
                  <span className="checkbox__label">Shipping Discounts</span>
                </label>
              </div>
            </div>
            <div className="border border-light-blue rounded-xl mb-4 p-4">
              <h1 className="font-medium lg:text-1xl md:text-1xl sm:text-xl mb-3"> Active Dates &amp; times </h1>
              <div className="flex items-center">
                <div className="w-full md:w-1/2 inputDiv relative mb-3 mr-3">
                  <label className="w-full inputLabel" htmlFor="password">Start date</label>
                  <input type="date" className="w-full border border-[#D5E3FF] rounded-lg p-2" placeholder="27-07-2023" onChange={(e) => setDate({ ...date, startDate: e.target.value })} value={date?.startDate} />
                </div>
                <div className="w-full md:w-1/2 inputDiv relative mb-3">
                  <label className="w-full inputLabel" htmlFor="password">Start time</label>
                  <input type="time" className="w-full border border-[#D5E3FF] rounded-lg p-2" placeholder="06:47 PM" onChange={(e) => setDate({ ...date, startTime: e.target.value })} value={date?.startTime} />
                </div>
              </div>
              <div className="flex items-center mb-3">
                <label className="checkbox flex items-center gap-1 cursor-pointer" htmlFor="set-date">
                  <input type="checkbox" className="w-5 h-5 inline-block mr-2 rounded-full border border-grey flex-no-shrink" id="set-date" onChange={() => setSelectEnd(!selectEnd)} checked={selectEnd} />
                  <div className="checkbox__indicator"></div>
                  <span className="checkbox__label">Set End Date &amp; Time</span>
                </label>
              </div>
              {selectEnd && (
                <div className="flex items-center">
                  <div className="w-full md:w-1/2 inputDiv relative mb-3 mr-3">
                    <label className="w-full inputLabel" htmlFor="password">End date</label>
                    <input type="date" className="w-full border border-[#D5E3FF] rounded-lg p-2" placeholder="27-07-2023" onChange={(e) => setDate({ ...date, endDate: e.target.value })} value={date?.endDate} />
                  </div>
                  <div className="w-full md:w-1/2 inputDiv relative mb-3">
                    <label className="w-full inputLabel" htmlFor="password">End time</label>
                    <input type="time" className="w-full border border-[#D5E3FF] rounded-lg p-2" placeholder="06:47 PM" onChange={(e) => setDate({ ...date, endTime: e.target.value })} value={date?.endTime} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/3 px-5 mb-4">
            <div className="border border-light-blue rounded-xl">
              <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2 py-5 border-b border-light-blue flex items-center">
                <h3 className="font-medium lg:text-2xl md:text-2xl sm:text-xl">Summary</h3>
              </div>
              <div className="p-4">
                <h1 className="font-medium lg:text-1xl md:text-1xl sm:text-xl mb-3"> Welcome20 </h1>
                <p className="mb-2"><strong>Type and Method</strong></p>
                <ul className="leading-8 mb-3">
                  <li>Amount off Screen</li>
                  <li>Code</li>
                </ul>
                <p className="mb-2"><strong>Details</strong></p>
                <ul className="leading-8">
                  <li>No Minimum Purchase Requirement</li>
                  <li>For customer  who haven’t purchased</li>
                  <li>One use per customer</li>
                  <li>can’t combine with other discount</li>
                  <li>Active from today</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='lg:p-5 md:p-5 sm:p-2 xs:p-2'>
        <div className='flex items-center justify-end'>
          <button
            className="lg:px-5 px-3 lg:text-lg md:text-md sm:text-sm bg-primary text-white rounded-full py-2 border border-primary me-3"
            onClick={() => handleSave()}
          >
            Save Discount
          </button>
        </div>
      </div>

      {openBrowser && (
        <AddSegments togglemodal={togglemodal} setSegment={setSegment} segment={segment} handleBrowser={handleBrowser} />
      )}
    </>
  )
}

export default FeatureDiscount
