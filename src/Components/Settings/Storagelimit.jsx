import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetStorageDetails } from "../../Redux/SettingSlice";
import { GrAddCircle } from "react-icons/gr";
import { AiOutlineSave } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

const Storagelimit = () => {
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const { storageDegtails } = useSelector((state) => state.root.setting);
  const [increaseStorage, setIncreaseStorage] = useState(false);
  const [storageValue, setStorageValue] = useState("");
  const [request, setRequest] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const response = dispatch(handleGetStorageDetails({ token }));

    if (!response) return;
  }, []);
  console.log(storageDegtails);
  const handleSave = () => {
    let data = JSON.stringify({
      data: {
        storageId: 0,
        userId: user.userID,
        organizationId: user.organizationId,
        increasesize: storageValue,
      },
    });
    toast.loading("saving");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://disployapi.thedestinysolutions.com/api/Storage/AddStorage",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        if (response?.data?.status == true) {
          setIncreaseStorage(false);
          setRequest(true);
        }
        toast.remove();
      })
      .catch((error) => {
        console.log(error);
        toast.remove();
      });
  };
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
                <th className="text-[#5A5881] text-base font-semibold">
                  <div className="flex items-center justify-center">
                    Increase Storage
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
                <td className="text-center">
                  {increaseStorage ? (
                    <div className="flex justify-center items-center">
                      <input
                        type="number"
                        className="border border-[#5E5E5E] w-12 h-8 rounded"
                        onChange={(e) => setStorageValue(e.target.value)}
                      />
                      <button onClick={() => handleSave()}>
                        <AiOutlineSave className="text-3xl ml-2" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="flex items-center justify-center w-full"
                        onClick={() => setIncreaseStorage(true)}
                      >
                        <GrAddCircle className="text-2xl" />
                      </button>
                      {/* {storageDegtails?.isRquested == true ? (
                        <span className="">Requested</span>
                      ) : (
                        <button
                          className="flex items-center justify-center w-full"
                          onClick={() => setIncreaseStorage(true)}
                        >
                          <GrAddCircle className="text-2xl" />
                        </button>
                      )} */}
                    </>
                  )}
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
