import React from "react";

const Notifications = () => {
  return <div>
    
    <div className="rounded-xl mt-8 shadow bg-white p-5">          
          <h4 class="user-name">Recent Devices</h4>
          <p>We need permission from your browser to show notifications. Request Permission</p>
          <div className="overflow-x-auto bg-white rounded-xl mt-8 shadow">
            <table className="w-full  lg:table-fixed md:table-auto sm:table-auto xs:table-auto" cellPadding={15}>
              <thead>
                <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                  <th className="text-[#5A5881] text-base font-semibold"> Type  </th>
                  <th className="text-[#5A5881] text-base font-semibold">Send alerts </th>
                  <th className="text-[#5A5881] text-base font-semibold">Email</th>
                  <th className="text-[#5A5881] text-base font-semibold"> Phone</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-b-[#E4E6FF] ">
                  <td>Screen Offline</td>
                  <td>
                    <select class="bg-gray-200 border input-bor-color text-black text-sm py-3 px-2 rounded-lg w-40">
                      <option>Select </option>
                      <option>Select1 </option>
                      <option>Select2 </option>
                      <option>Select3 </option>
                    </select>
                  </td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>                                  
                </tr>
                <tr className="border-b border-b-[#E4E6FF] ">
                  <td>Purchased Plan</td>
                  <td>
                    <select class="bg-gray-200 border input-bor-color text-black text-sm py-3 px-2 rounded-lg w-40">
                      <option>Instant </option>
                      <option>Select1 </option>
                      <option>Select2 </option>
                      <option>Select3 </option>
                    </select>
                  </td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>                                  
                </tr>
                <tr className="border-b border-b-[#E4E6FF] ">
                  <td>Added Users</td>
                  <td>
                    <select class="bg-gray-200 border input-bor-color text-black text-sm py-3 px-2 rounded-lg w-40">
                      <option>15 Minute </option>
                      <option>5 Minute </option>
                      <option>10 Minute </option>
                      <option>20 Minute</option>
                    </select>
                  </td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>                                  
                </tr>
                <tr className="border-b border-b-[#E4E6FF] ">
                  <td>Changing details</td>
                  <td><input type="text" class="bg-gray-200 border input-bor-color text-black text-sm py-3 px-2 rounded-lg w-44" placeholder="Enter time (Minute)" /></td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>                                  
                </tr>
                <tr className="border-b border-b-[#E4E6FF] ">
                  <td>Playlist</td>
                  <td>
                    <select class="bg-gray-200 border input-bor-color text-black text-sm py-3 px-2 rounded-lg w-40">
                      <option>Playlist </option>
                      <option>Playlist1 </option>
                      <option>Playlist2 </option>
                      <option>Playlist3 </option>
                    </select>
                  </td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>                                  
                </tr>
                <tr className="border-b border-b-[#E4E6FF] ">
                  <td>Assets</td>
                  <td>
                    <select class="bg-gray-200 border input-bor-color text-black text-sm py-3 px-2 rounded-lg w-40" >
                      <option>Abuja</option>
                      <option>Enugu</option>
                      <option>Lagos</option>
                    </select>
                  </td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>
                  <td><input type="checkbox" class="border-gray-300 rounded h-5 w-5 me-3" /></td>                                  
                </tr>
                
              </tbody>
            </table>            
          </div>
          <div class="flex ">
            <div class="w-full pt-5 px-3">
              <label class=" text-sm" for="Country">When should we send you notifications?</label>
                <select class="w-full bg-gray-200 border input-bor-color text-black text-xs py-3 px-4 pr-8 my-3 rounded" id="department">
                  <option>Only when I'm online</option>
                  <option>Only when I'm online</option>
                  <option>Only when I'm online</option>
                </select>

                <div class="w-full flex">
                  <button class="px-5 bg-primary text-white rounded-full py-2 border border-primary me-3">Save Changes</button>
                   <button class=" px-5 py-2 border border-primary rounded-full text-primary">Reset</button>
                </div>
            </div>
          </div>
        </div>
  </div>;
};

export default Notifications;
