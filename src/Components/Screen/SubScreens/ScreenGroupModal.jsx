import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getGroupData } from "../../../Redux/ScreenGroupSlice";
import toast from "react-hot-toast";

const ScreenGroupModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { store } = useSelector((state) => state.root.screenGroup);

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [loadFirst, setLoadFirst] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const [screenGroupName, setScreenGroupName] = useState("");
  const [screenGroupNameError, setScreenGroupNameError] = useState(""); // Name validationError check

  useEffect(() => {
    const query = { sort: sortOrder, col: sortColumn };

    if (loadFirst) {
      dispatch(getGroupData(query));
      setLoadFirst(false);
    }

    // Set message based on status
    if (store && store.status === "loading") {
      toast.loading("Saving data...");
    } else if (store && store.status === "succeeded") {
      toast.success("Data saved successfully");
      onClose();    // Close the modal when data is saved successfully
    } else if (store && store.status === "failed") {
      toast.error("Failed to save data");
    } else {
      toast.dismiss();
    }

  }, [loadFirst, sortOrder, store]);

  console.log("store", store);

  const sorting = (val) => {
    // Toggle sorting direction when clicking on the same column
    const direction = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(direction);
    setSortColumn(val);
    setLoadFirst(true); // Trigger API call on sorting change
  };

  // singal check
  const handleCheckboxChange = (itemId) => {
    const updatedSelectedItems = [...selectedItems];
    const index = updatedSelectedItems.indexOf(itemId);

    if (index !== -1) {
      updatedSelectedItems.splice(index, 1);
    } else {
      updatedSelectedItems.push(itemId);
    }

    setSelectedItems(updatedSelectedItems);
    setSelectAllChecked(false); // Uncheck "Select All" if any individual checkbox is checked
  };

  // multipal check
  const handleSelectAllCheckboxChange = () => {
    setSelectAllChecked(!selectAllChecked);

    if (!selectAllChecked) {
      // If "Select All" is checked, select all items
      const allItemIds = Data.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      // If "Select All" is unchecked, clear all selections
      setSelectedItems([]);
    }
  };

  const handleSave = () => {
    // Validate Screen Group Name
    if (!screenGroupName.trim()) {
      setScreenGroupNameError("Screen Group Name is required");
      return;
    }

    const payLoad = {
      screenGroupName: screenGroupName,
      selectedItems: selectedItems,
      ScreenGroupID : 0,
      tags : ''
    };

    // Handle the logic to process the selected items
    console.log("payLoad Items:", payLoad);

    // Close the modal
    // onClose();
  };

  const Data = [
    {
      id: 1,
      groupName: "1st",
      screen: " ",
      status: "active",
    },
    {
      id: 2,
      groupName: "2seco",
      screen: " ",
      status: "inactive",
    },
    {
      id: 3,
      groupName: "3th",
      screen: " ",
      status: "active",
    },
  ];

  return (
    <div>
      <div className="bg-black bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto lg:max-w-4xl md:max-w-xl sm:max-w-sm xs:max-w-xs">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
              <div className="flex items-center">
                <div className=" mt-1.5">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    onChange={handleSelectAllCheckboxChange}
                    checked={selectAllChecked}
                  />
                </div>
                <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium ml-3">
                  All Select
                </h3>
              </div>
              <button className="p-1 text-xl" onClick={onClose}>
                <AiOutlineCloseCircle className="text-3xl" />
              </button>
            </div>

            <div className="p-2">
              <label
                for="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Screen Group Name *
              </label>
              <input
                type="name"
                name="name"
                id="name"
                className={`bg-gray-50 border ${
                  screenGroupNameError
                    ? "border-red-700 error"
                    : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter Screen Group Name"
              />
            </div>

            <div className="schedual-table bg-white rounded-xl mt-5 shadow">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-2">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          Screen
                          <a href="#" onClick={() => sorting("screen")}>
                            <svg
                              className="w-3 h-3 ms-1.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </a>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          Status
                          <a href="#">
                            <svg
                              className="w-3 h-3 ms-1.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </a>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                        Tags
                          <a href="#">
                            <svg
                              className="w-3 h-3 ms-1.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </a>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Data &&
                      Data.length > 0 &&
                      Data.map((item, i) => {
                        return (
                          <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            key={i}
                          >
                            <td className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3"
                                onChange={() => handleCheckboxChange(item.id)}
                                checked={selectedItems.includes(item.id)}
                              />

                              {item.groupName}
                            </td>
                            <td className="px-6 py-4">{item.screen}</td>
                            <td className="px-6 py-4">{item.status}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    data-modal-hide="static-modal"
                    type="button"
                    className="border-2 border-primary px-5 py-2 rounded-full ml-3 text-white bg-primary  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    data-modal-hide="static-modal"
                    type="button"
                    className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenGroupModal;
