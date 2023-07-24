import React from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const Approval = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* sidebar and navbar display start */}
      <div className="flex border-b border-gray py-3">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar />
      </div>
      {/* sidebar and navbar display end */}
      <div className="pt-6 px-5">
        <div className={`${sidebarOpen ? "ml-52" : "ml-0"}`}>
          <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
            Approval
          </h1>
          <div className="overflow-x-auto">
            <table className="mt-9 w-full" cellPadding={15}>
              <thead>
                <tr className="flex justify-between items-center">
                  <th>
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                      Type
                    </button>
                  </th>
                  <th>
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                      request date
                    </button>
                  </th>
                  <th>
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                      screen iD
                    </button>
                  </th>
                  <th>
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                      Screen location
                    </button>
                  </th>
                  <th>
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
                      requested By
                    </button>
                  </th>
                  <th>
                    <button className="bg-[#E4E6FF] rounded-full px-6 py-2 flex  items-center justify-center">
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

                  <td className="break-words w-[150px]">4218 Robinson CourtSaginaw, MI 48607</td>
                  <td>Jimmy K. Findley</td>
                  <td></td>
                </tr>

                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td>Screen</td>

                  <td className="break-words w-[115px]">
                    10 May 2023 10:32AM{" "}
                  </td>

                  <td> 00365HM3 </td>

                  <td className="break-words w-[150px]">4218 Robinson CourtSaginaw, MI 48607</td>
                  <td>Jimmy K. Findley</td>
                  <td></td>
                </tr>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td>Playlist</td>

                  <td className="break-words w-[115px]">
                    09 May 2023 10:30AM{" "}
                  </td>

                  <td> 00405BC3</td>

                  <td className="break-words w-[150px]">4218 Robinson CourtSaginaw, MI 48607</td>
                  <td>Jimmy K. Findley</td>
                  <td></td>
                </tr>
                <tr className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border border-gray shadow-sm  flex justify-between items-center px-5 py-2">
                  <td>Assets</td>

                  <td className="break-words w-[115px]">
                    10 May 2023 10:32AM{" "}
                  </td>

                  <td> 00509CC3</td>

                  <td className="break-words w-[150px]">4218 Robinson CourtSaginaw, MI 48607</td>
                  <td>Jimmy K. Findley</td>
                  <td></td>
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
