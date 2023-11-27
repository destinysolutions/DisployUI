import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const Storagelimit = () => {
  const UserData = useSelector((Alldata) => Alldata.user);
  const authToken = `Bearer ${UserData.user.data.token}`;
  const [storageData, setStorageData] = useState("");
  useEffect(() => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/UserMaster/GetStorageDetails",
      headers: {
        Authorization: authToken,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setStorageData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2 mt-5">
        <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl mb-5">
          Storage Limit
        </h1>
      </div>
      <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal" cellPadding={20}>
            <thead>
              <tr className="border-b border-b-[#E4E6FF] bg-[#EFF3FF]">
                <th className="text-[#5A5881] text-base font-semibold">
                  <span className="flex items-center justify-center">
                    Total Space
                  </span>
                </th>
                <th className="text-[#5A5881] text-base font-semibold">
                  <div className="flex items-center justify-center">
                    Consumed Space
                  </div>
                </th>
                <th className="text-[#5A5881] text-base font-semibold">
                  <div className="flex items-center justify-center">
                    Available Space
                  </div>
                </th>
                <th className="text-[#5A5881] text-base font-semibold">
                  <div className="flex items-center justify-center">
                    Used in Percentage
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-b-[#E4E6FF]">
                <td className="text-[#5E5E5E] text-center">
                  <span
                    style={{
                      background: "#E4E6FF",
                      padding: "10px 15px",
                      borderRadius: "5px",
                    }}
                  >
                    {storageData.totalStorage}
                  </span>
                </td>
                <td className="text-[#5E5E5E] text-center">
                  <span
                    style={{
                      background: "#E4E6FF",
                      padding: "10px 15px",
                      borderRadius: "5px",
                    }}
                  >
                    {storageData.consumedSpace}
                  </span>
                </td>
                <td className="text-[#5E5E5E] text-center">
                  <span
                    style={{
                      background: "#E4E6FF",
                      padding: "10px 15px",
                      borderRadius: "5px",
                    }}
                  >
                    {storageData.availableSpace}
                  </span>
                </td>
                <td className="text-center">{storageData.usedInPercentage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Storagelimit;
