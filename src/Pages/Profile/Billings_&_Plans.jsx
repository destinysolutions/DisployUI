import React from "react";

const BillingsPlans = () => {
  return <div>
    
    <div className="rounded-xl mt-8 shadow bg-white my-3 p-5">          
            <h4 class="user-name mb-3">Current Plan</h4>
            <div class="-mx-3 flex items-center mb-6">
              <div class="md:w-1/2 px-3 mb-6 md:mb-0">
              <p className="my-3 font-medium lg:text-md">Your Current Plan is Basic</p>
              <p className="mb-3">A simple start for everyone</p>

              <p className="my-3"><strong>Active until July 25, 2023</strong></p>
              <p className="mb-3">We will send you a notification upon Subscription expiration.</p>

              <p className="my-3"><strong>$199 Per Month</strong> </p>
              <p className="mb-3">A simple start for everyone</p>
              <div class="w-full flex">
                    <button class="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3">Upgrade Plan</button>
                    <button class=" px-5 py-2 border border-primary rounded-full text-primary">Cancel Subscription</button>
                  </div> 
              </div>  
              <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                <div class="w-full py-6 mb-5 bg-light-red text-center">
                  <p class="mt-5">We need your attention!</p> 
                  <p class="mb-5"> Your plan requires update</p>
                </div>
                <div class="w-full mb-4">
                  <div class="flex justify-between">
                    <span>Days</span><span>26 of 30 Days</span></div>
                    <input id="customRange1" class="w-full form-range" type="range" />
                    <p>6 days remaining until your plan requires update</p>
                  </div>
              </div>
            </div>        
          </div>

          <div className="rounded-xl mt-8 shadow bg-white my-3 p-5">          
            <h4 class="user-name mb-3">Payment Methods</h4>
            <div class="-mx-3 flex items-start">
              <div class="md:w-1/2 px-3">
                <div class="text-center flex flex-wrap my-3">       
                  <div class="flex items-center mr-4 ">
                    <input id="atmcard" type="radio" name="radio" class="hidden" />
                    <label for="atmcard" class="flex items-center cursor-pointer text-xl">
                    <span class="w-6 h-6 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
                    Credit/Debit/ATM Card</label>
                  </div>                
                  <div class="flex items-center">
                    <input id="cod" type="radio" name="radio" class="hidden" />
                    <label for="cod" class="flex items-center cursor-pointer text-xl">
                    <span class="w-6 h-6 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
                    COD/Cheque</label>
                  </div>
                </div>
                <form>
                  <div className="card-shadow lg:p-5 md:p-5 sm:p-2 xs:p-2">
                    <div class="w-full">
                        <label class="label_top text-sm" for="title">Card Number </label>
                        <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="title" type="text" placeholder="Enter Card Number" />
                    </div>
                    <div class="-mx-3 md:flex mb-6">
                      <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="label_top text-sm" for="company">Name</label>
                        <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="company" type="text" placeholder="Enter Holder Name" />
                      </div>
                      <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="label_top text-sm" for="company">Expiry Date</label>
                        <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="company" type="text" placeholder="mm / yyyyExpiry Date" />
                      </div>
                      <div class="md:w-1/2 px-3">
                        <label class="label_top text-sm" for="title">CVV</label>
                        <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="title" type="text" placeholder="Enter CVV" />
                      </div>
                    </div>
                    <div class="w-full flex items-center">
                        <input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" />
                        <div class="flex flex-col">
                          <h1 class="text-gray-700 font-medium leading-none">Save card for future billing?</h1>
                        </div> 
                    </div>
                  </div>
                  <div class="w-full flex mt-5">
                    <button class="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3">Save Changes</button>
                    <button class=" px-5 py-2 border border-primary rounded-full text-primary">Reset</button>
                  </div>
                </form>                
              </div>
              <div class="md:w-1/2 px-3">
                <h3 className="user-name mb-3">My Cards</h3>
                <div className="card-shadow px-5 py-3 mb-3">
                  <div class="w-full flex justify-between">
                    <div className="card_detail">
                      <img class="middle rounded-fullmiddle rounded-full" src="../../../Settings/logos_mastercard.svg" alt="" />                 
                      <p class="text-gray-900 whitespace-no-wrap flex-center-middle my-2">Tom McBride <a href="#" className="blue-btn ml-2">Primary</a></p>
                      <p class="text-gray-900 whitespace-no-wrap flex-center-middle">Axis Bank **** **** **** 8395</p> 
                    </div> 
                    <div className="card_btn_detail relative">
                      <div className="flex">
                      <button class="edit-btn me-3">Edit</button>
                      <button class="delete-btn">Delete</button>
                      </div>                      
                      <p className="absolute bottom-0" >Card expires at 10/27</p>
                    </div>                  
                  </div>
                </div>
                <div className="card-shadow px-5 py-3">
                  <div class="w-full flex justify-between">
                    <div className="card_detail">
                      <img class="middle rounded-fullmiddle rounded-full" src="../../../Settings/logos_mastercard.svg" alt="" />                 
                      <p class="text-gray-900 whitespace-no-wrap flex-center-middle my-2">Tom McBride <a href="#" className="blue-btn ml-2">Primary</a></p>
                      <p class="text-gray-900 whitespace-no-wrap flex-center-middle">Axis Bank **** **** **** 8395</p> 
                    </div> 
                    <div className="card_btn_detail relative">
                      <div className="flex">
                      <button class="edit-btn me-3">Edit</button>
                      <button class="delete-btn">Delete</button>
                      </div>                      
                      <p className="absolute bottom-0" >Card expires at 10/27</p>
                    </div>                  
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl mt-8 shadow bg-white ">          
            <h4 class="user-name p-5 pb-0">Billing Address</h4>
            <form>
              <div class="px-5 pb-5">
                <div class="-mx-3 md:flex">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="label_top text-sm" for="company">
                    Company Name
                    </label>
                    <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="company" type="text" placeholder="Enter Company Name"/>
                    <div>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="label_top text-sm" for="Enter-Billing-Email">Billing Email</label>
                    <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="company" type="text" placeholder="Enter Billing Email"/>
                    <div>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label class="label_top text-sm" for="TaxID">Tax ID </label>
                    <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="title" type="email" placeholder="Enter Tax ID" />
                  </div>                
                </div>
                <div class="-mx-3 md:flex">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="label_top text-sm" for="VATNumber">VAT Number</label>
                    <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" type="text" placeholder="Enter VAT Number" />
                  </div>
                  <div class="md:w-1/2 px-3">
                  <label class="label_top text-sm" for="PhoneNumber">Phone Number</label>
                    <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" type="text" placeholder="Enter Phone Number" />
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label class="label_top text-sm" for="title">Billing Address</label>
                    <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="title" type="text" placeholder="Enter Billing Address" />
                  </div>
                  
                </div>
                <div class="-mx-3 md:flex ">
                  <div class="md:w-1/2 px-3">
                    <label class="label_top text-sm" for="Country">Country</label>
                      <div>
                        <select class="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded" id="department">
                        <option>USA</option>
                          <option>India</option>
                          <option>UK</option>
                        </select>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label class="label_top text-sm" for="State">State</label>
                    <div>
                      <select class="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 mb-3 rounded" id="job-type">
                      <option>Abuja</option>
                        <option>Enugu</option>
                        <option>Lagos</option>
                      </select>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label class="label_top text-sm" for="application-link">Zip Code</label>
                    <input class="w-full bg-gray-200 text-black border input-bor-color rounded-lg py-3 px-4 mb-3" id="title" type="text" placeholder="Enter Billing Address" />       
                  </div>
                </div>
                <div class="-mx-3 md:flex ">
                  <div class="md:w-full px-3 flex">
                    <button class="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3">Save Changes</button>
                    <button class=" px-5 py-2 border border-primary rounded-full text-primary">Reset</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
  </div>;
};

export default BillingsPlans;
