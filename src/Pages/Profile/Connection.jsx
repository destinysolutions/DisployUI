import React from "react";
import google_icon from "../../images/AppsImg/google-icon.svg";
import slack_icon from "../../images/AppsImg/slack-icon.svg";
import mailchimp_icon from "../../images/AppsImg/mailchimp-icon.svg";
import facebook_icon from "../../images/AppsImg/facebook-icon.png";
import link_icon from "../../images/AppsImg/link-icon.svg";
import twitter_icon from "../../images/AppsImg/twitter-icon.png";
import delete_icon from "../../images/Settings/delete.svg";
import dribbble_icon from "../../images/AppsImg/dribbble-icon.png";
import instagram_icon from "../../images/AppsImg/instagram-icon.png";
import gitHub_icon from "../../images/AppsImg/gitHub-icon.svg";

const Connection = () => {
  return (
    <div>
      <div className="-mx-3 flex items-start mt-8">
        <div className="md:w-1/2 px-3">
          <div className="card-shadow p-0">
            <div className="border-b border-b-[#E4E6FF] p-5">
              <h4 className="user-name">Connected Accounts</h4>
              <p>Display content from your connected accounts on your site</p>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={google_icon} alt="Assets" className="w-6" />
                <div className="ml-4">
                  <div
                    className="font-medium 
                        text-sm"
                  >
                    Google
                  </div>
                  <div className="font-normal text-sm">
                    Calendar and contacts
                  </div>
                </div>
              </div>
              <button className="bg-green-200 px-3 py-1 text-green-900 leading-tight font-semibold rounded-full text-sm">
                Connect
              </button>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={slack_icon} alt="Assets" className="w-6" />
                <div className="ml-4">
                  <div
                    className="font-medium 
                        text-sm"
                  >
                    Slack
                  </div>
                  <div className="font-normal text-xs">Communication</div>
                </div>
              </div>
              <button className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full text-sm">
                Disconnect
              </button>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={gitHub_icon} alt="Assets" className="w-6" />
                <div className="ml-4">
                  <div
                    className="font-medium 
                        text-sm"
                  >
                    GitHub
                  </div>
                  <div className="font-normal text-xs">
                    Manage your Git repositories
                  </div>
                </div>
              </div>
              <button className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full text-sm">
                Disconnect
              </button>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={mailchimp_icon} alt="Assets" className="w-6" />
                <div className="ml-4">
                  <div
                    className="font-medium 
                        text-sm"
                  >
                    MailChimp
                  </div>
                  <div className="font-normal text-xs">
                    Email marketing service
                  </div>
                </div>
              </div>
              <button className="bg-red-200 px-3 py-1 font-semibold text-red-900 leading-tight rounded-full text-sm">
                Disconnect
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 px-3">
          <div className="card-shadow p-0">
            <div className="border-b border-b-[#E4E6FF] p-5">
              <h4 className="user-name">Connected Social Accounts</h4>
              <p>
                Display content from your Connected Social Accounts on your site
              </p>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={facebook_icon} alt="Assets" className="w-8" />
                <div className="ml-4">
                  <div className="font-medium text-sm">Facebook</div>
                  <div className="font-normal text-sm">Not connected</div>
                </div>
              </div>
              <button>
                <img src={link_icon} alt="Assets" className="w-8" />
              </button>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={twitter_icon} alt="Assets" className="w-8" />
                <div className="ml-4">
                  <div className="font-medium text-sm">Twitter</div>
                  <div className="font-normal text-xs">@Pixinvent</div>
                </div>
              </div>
              <button>
                <img src={delete_icon} alt="Assets" className="w-8" />
              </button>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={dribbble_icon} alt="Assets" className="w-8" />
                <div className="ml-4">
                  <div className="font-medium text-sm">Dribbble</div>
                  <div className="font-normal text-xs">Not connected</div>
                </div>
              </div>
              <button>
                <img src={link_icon} alt="Assets" className="w-8" />
              </button>
            </div>
            <div className="flex justify-between p-5 border-b border-b-[#E4E6FF]">
              <div className="flex items-center">
                <img src={instagram_icon} alt="Assets" className="w-8" />
                <div className="ml-4">
                  <div className="font-medium text-sm">Instagram</div>
                  <div className="font-normal text-xs">Not connected</div>
                </div>
              </div>
              <button>
                <img src={link_icon} alt="Assets" className="w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connection;
