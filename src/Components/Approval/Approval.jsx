import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useState } from "react";

const Approval = ({ sidebarOpen, setSidebarOpen }) => {
  const [enabled, setEnabled] = useState(false);
  const [enabled1, setEnabled1] = useState(false);
  const [enabled2, setEnabled2] = useState(false);
  const [enabled3, setEnabled3] = useState(false);
  return (
    <>
      {/* sidebar and navbar display start */}
      <div className="flex border-b border-gray">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {/* sidebar and navbar display end */}
      <div className="pt-6 px-5 page-contain">
        <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
          <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
            Approval
          </h1>
          <div className="overflow-x-auto">
            <table className="mt-9 w-full" cellPadding={15}>
              <thead>
                <tr className="flex justify-between items-center">
                  <th>
                    <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                      Type
                    </button>
                  </th>
                  <th>
                    <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                      request date
                    </button>
                  </th>
                  <th>
                    <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                      screen iD
                    </button>
                  </th>
                  <th>
                    <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                      Screen location
                    </button>
                  </th>
                  <th>
                    <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                      requested By
                    </button>
                  </th>
                  <th>
                    <button className="bg-lightgray rounded-full px-6 py-2 flex  items-center justify-center">
                      Action
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td>Assets</td>

                  <td className="break-words w-[115px]">
                    10 May 2023 10:32AM{" "}
                  </td>

                  <td> 00509CC3</td>

                  <td className="break-words w-[150px]">
                    4218 Robinson CourtSaginaw, MI 48607
                  </td>
                  <td>Jimmy K. Findley</td>
                  <td>
                    {" "}
                    <label className="inline-flex relative items-center  cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        readOnly
                      />
                      <div
                        onClick={() => {
                          setEnabled(!enabled);
                        }}
                        className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                          enabled
                            ? " bg-gray text-left pl-2 text-white text-sm"
                            : "bg-gray text-right pr-2 text-white text-sm"
                        }`}
                      >
                        {enabled ? "On" : "Off"}
                      </div>
                    </label>
                  </td>
                </tr>

                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td>Screen</td>

                  <td className="break-words w-[115px]">
                    10 May 2023 10:32AM{" "}
                  </td>

                  <td> 00365HM3 </td>

                  <td className="break-words w-[150px]">
                    4218 Robinson CourtSaginaw, MI 48607
                  </td>
                  <td>Jimmy K. Findley</td>
                  <td>
                    {" "}
                    <label className="inline-flex relative items-center  cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled1}
                        readOnly
                      />
                      <div
                        onClick={() => {
                          setEnabled1(!enabled1);
                        }}
                        className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                          enabled1
                            ? " bg-gray text-left pl-2 text-white text-sm"
                            : "bg-gray text-right pr-2 text-white text-sm"
                        }`}
                      >
                        {enabled1 ? "On" : "Off"}
                      </div>
                    </label>
                  </td>
                </tr>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td>Playlist</td>

                  <td className="break-words w-[115px]">
                    09 May 2023 10:30AM{" "}
                  </td>

                  <td> 00405BC3</td>

                  <td className="break-words w-[150px]">
                    4218 Robinson CourtSaginaw, MI 48607
                  </td>
                  <td>Jimmy K. Findley</td>
                  <td>
                    {" "}
                    <label className="inline-flex relative items-center  cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled2}
                        readOnly
                      />
                      <div
                        onClick={() => {
                          setEnabled2(!enabled2);
                        }}
                        className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                          enabled2
                            ? " bg-gray text-left pl-2 text-white text-sm"
                            : "bg-gray text-right pr-2 text-white text-sm"
                        }`}
                      >
                        {enabled2 ? "On" : "Off"}
                      </div>
                    </label>
                  </td>
                </tr>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td>Assets</td>

                  <td className="break-words w-[115px]">
                    10 May 2023 10:32AM{" "}
                  </td>

                  <td> 00509CC3</td>

                  <td className="break-words w-[150px]">
                    4218 Robinson CourtSaginaw, MI 48607
                  </td>
                  <td>Jimmy K. Findley</td>
                  <td>
                    <label className="inline-flex relative items-center  cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled3}
                        readOnly
                      />
                      <div
                        onClick={() => {
                          setEnabled3(!enabled3);
                        }}
                        className={` w-14  rounded-full peer-checked:after:translate-x-[130%] peer-checked:after:border-gray after:content-[''] after:bg-white after:absolute after:top-[-2px] after:left-[0px] after:rounded-full after:h-[25px] after:w-[25px] after:z-10  after:border-gray after:border-2 after:transition-all ${
                          enabled3
                            ? " bg-gray text-left pl-2 text-white text-sm"
                            : "bg-gray text-right pr-2 text-white text-sm"
                        }`}
                      >
                        {enabled3 ? "On" : "Off"}
                      </div>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Approval;
