import React from "react";

const Connection = () => {
  return <div>
    <div className="-mx-3 flex items-start mt-8">
              <div className="md:w-1/2 px-3">
                <div className="card-shadow p-0">
                  <div className="border-b border-b-[#E4E6FF] p-5">
                    <h4 className="user-name">Connected Accounts</h4>
                    <p>Display content from your connected accounts on your site</p>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/google-icon.svg" alt="Assets" className="w-6" />
                      <div className="ml-4">
                        <div className="font-medium 
                        text-sm">Google</div>
                        <div className="font-normal text-sm">Calendar and contacts</div>
                      </div>
                    </div>
                    <button className="bg-green-200 px-3 py-1 text-green-900 leading-tight font-semibold rounded-full text-sm">Connect</button>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/slack-icon.svg" alt="Assets" className="w-6" />
                      <div className="ml-4">
                        <div className="font-medium 
                        text-sm">Slack</div>
                        <div className="font-normal text-xs">Communication</div>
                      </div>
                    </div>
                    <button className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full text-sm">Disconnect</button>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/gitHub-icon.svg" alt="Assets" className="w-6" />
                      <div className="ml-4">
                        <div className="font-medium 
                        text-sm">GitHub</div>
                        <div className="font-normal text-xs">Manage your Git repositories</div>
                      </div>
                    </div>
                    <button className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full text-sm">Disconnect</button>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/mailchimp-icon.svg" alt="Assets" className="w-6" />
                      <div className="ml-4">
                        <div className="font-medium 
                        text-sm">MailChimp</div>
                        <div className="font-normal text-xs">Email marketing service</div>
                      </div>
                    </div>
                    <button className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full text-sm">Disconnect</button>
                  </div>  
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <div className="card-shadow p-0">
                  <div className="border-b border-b-[#E4E6FF] p-5">
                    <h4 className="user-name">Connected Social  Accounts</h4>
                    <p>Display content from your Connected Social Accounts on your site</p>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/facebook-icon.png" alt="Assets" className="w-8" />
                      <div className="ml-4">
                        <div className="font-medium text-sm">Facebook</div>
                        <div className="font-normal text-sm">Not connected</div>
                      </div>
                    </div>
                    <button><img src="/AppsImg/link-icon.svg" alt="Assets" className="w-8" /></button>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/twitter-icon.png" alt="Assets" className="w-8" />
                      <div className="ml-4">
                        <div className="font-medium text-sm">Twitter</div>
                        <div className="font-normal text-xs">@Pixinvent</div>
                      </div>
                    </div>
                    <button><img src="/Settings/delete-icon.svg" alt="Assets" className="w-8" /></button>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/dribbble-icon.png" alt="Assets" className="w-8" />
                      <div className="ml-4">
                        <div className="font-medium text-sm">Dribbble</div>
                        <div className="font-normal text-xs">Not connected</div>
                      </div>
                    </div>
                    <button><img src="/AppsImg/link-icon.svg" alt="Assets" className="w-8" /></button>
                  </div>
                  <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
                    <div className="flex items-center">
                      <img src="/AppsImg/instagram-icon.png" alt="Assets" className="w-8" />
                      <div className="ml-4">
                        <div className="font-medium text-sm">Instagram</div>
                        <div className="font-normal text-xs">Not connected</div>
                      </div>
                    </div>
                    <button><img src="/AppsImg/link-icon.svg" alt="Assets" className="w-8" /></button>
                  </div>  
                </div>
              </div>
  
            </div>
  </div>;
};

export default Connection;
