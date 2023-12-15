import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetStorageDetails } from "../../Redux/SettingSlice";

const Storagelimit = () => {
  const { token } = useSelector((state) => state.root.auth);
  const { storageDegtails } = useSelector((state) => state.root.setting);

  const dispatch = useDispatch();

  useEffect(() => {
    const response = dispatch(handleGetStorageDetails({ token }));
    if (!response) return;
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
                    {storageDegtails?.totalStorage} GB
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
                    {storageDegtails?.consumedSpace} GB
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
                    {/* {storageDegtails?.availableSpace == 3
                      ? `${storageDegtails?.availableSpace} GB`
                      : `${storageDegtails?.availableSpace} MB`} */}
                    {storageDegtails?.availableSpace} GB
                  </span>
                </td>
                <td className="text-center">
                  {storageDegtails?.usedInPercentage} %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Storagelimit;
