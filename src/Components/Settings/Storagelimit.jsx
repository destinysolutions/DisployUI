import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetStorageDetails } from "../../Redux/SettingSlice";
import { GrAddCircle } from "react-icons/gr";
import { FaCodePullRequest } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";
import { ADD_STORAGE } from "../../Pages/Api";
import AddEditStorage from "./AddEditStorage";

const Storagelimit = () => {
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const { storageDegtails } = useSelector((state) => state.root.setting);
  const [increaseStorage, setIncreaseStorage] = useState(false);
  const [storageValue, setStorageValue] = useState("");
  const [request, setRequest] = useState(false);
  const dispatch = useDispatch();
  const [openStorage, setOpenStorage] = useState(false)
  const [addStorage, setAddStorage] = useState(2)
  useEffect(() => {
    const response = dispatch(handleGetStorageDetails({ token }));
    if (!response) return;
  }, []);

  const handleSave = () => {
    let data = JSON.stringify({
      storageId: 0,
      userId: user.userID,
      organizationId: user.organizationId,
      increasesize: storageValue,
      flagdeleted: false,
      createdby: 0,
      isAccepted: 0,
    });
    toast.loading("saving");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${ADD_STORAGE}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
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

  const toggleModal = () => {
    setOpenStorage(!openStorage)
  }

  return (
    <>
      <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2 mt-5">
        <h1 className="font-medium lg:text-2xl md:text-2xl sm:text-xl mb-5">
          Storage Limit
        </h1>
      </div>
      <div className="lg:px-5 md:px-5 sm:px-2 xs:px-2 pb-5 mt-2 ">
        <div className="rounded-xl shadow">
          <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
            <table
              className="w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
              cellPadding={15}
            >
              <thead>
                <tr className="table-head-bg">
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Total Space
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Consumed Space
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Available Space
                  </th>
                  <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                    Used in Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-[#5E5E5E] text-center flex justify-center">
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
                    <div className="flex justify-center">
                      <span
                        style={{
                          background: "#E4E6FF",
                          padding: "10px 15px",
                          borderRadius: "5px",
                        }}
                      >
                        {storageDegtails?.consumedSpace} GB
                      </span>

                    </div>
                  </td>
                  <td className="text-[#5E5E5E] text-center flex justify-center">
                    <span
                      style={{
                        background: "#E4E6FF",
                        padding: "10px 15px",
                        borderRadius: "5px",
                      }}
                    >
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

        <div className="flex justify-center items-center mt-10">
          <button className="flex items-center border-primary border rounded-full lg:pr-3 sm:px-5 py-3 text-sm px-3 hover:bg-primary hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50" onClick={() => setOpenStorage(true)}>
            Buy More Space
          </button>
        </div>
      </div>
      {openStorage && (
        <AddEditStorage
          toggleModal={toggleModal}
          addStorage={addStorage}
          setAddStorage={setAddStorage}
        />
      )}
    </>
  );
};

export default Storagelimit;
