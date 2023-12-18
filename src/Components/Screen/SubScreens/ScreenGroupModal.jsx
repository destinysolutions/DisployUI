import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SelectByUserScreen } from "../../../Redux/ScreenGroupSlice";
import toast from "react-hot-toast";
import { SELECT_BY_USER_SCREENDETAIL } from "../../../Pages/Api";

const ScreenGroupModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const  store  = useSelector((state) => state.root.screenGroup);

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [loadFirst, setLoadFirst] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [screenData, setScreenData] = useState([]);

  const [screenGroupName, setScreenGroupName] = useState("");
  const [screenGroupNameError, setScreenGroupNameError] = useState(""); // Name validationError check
  
  console.log("store", store);

  useEffect(() => {
    // const query = { ID : user.userID, sort: sortOrder, col: sortColumn };

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`,
      headers: {
        Authorization: authToken,
      },
    };

    if (loadFirst) {
      dispatch(SelectByUserScreen({config}));
      setLoadFirst(false);
    }

    // Set message based on status
    // if (store && store.status === "loading") {
    //   toast.loading("Saving data...");
    // } else if (store && store.status === "succeeded") {
    //   toast.success("Data saved successfully");
    //   onClose(); // Close the modal when data is saved successfully
    // } else if (store && store.status === "failed") {
    //   toast.error("Failed to save data");
    // } else {
    //   toast.dismiss();
    // }

  }, [dispatch, loadFirst, sortOrder, store]);


  const sorting = (val) => {
    // Toggle sorting direction when clicking on the same column
    const direction = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(direction);
    setSortColumn(val);
    setLoadFirst(true); // Trigger API call on sorting change
  };

  const handleSelectAllCheckboxChange = () => {
    const updatedCheckboxes = {};
    const allSelected = !selectAllChecked;

    screenData.forEach((screen) => {
      updatedCheckboxes[screen.screenID] = allSelected;
    });

    setScreenCheckboxes(updatedCheckboxes);
    setSelectAllChecked(allSelected);

    const updatedSelectedItems = allSelected
      ? screenData.map((screen) => screen.screenID)
      : [];
    setSelectedItems(updatedSelectedItems);
  };

  const handleScreenCheckboxChange = (screenID) => {
    const updatedCheckboxes = {
      ...screenCheckboxes,
      [screenID]: !screenCheckboxes[screenID],
    };
    setScreenCheckboxes(updatedCheckboxes);

    const updatedSelectedItems = Object.keys(updatedCheckboxes).filter(
      (key) => updatedCheckboxes[key]
    );
    setSelectedItems(updatedSelectedItems);
  };

  const handleSave = () => {
    // Validate Screen Group Name
    // if (!screenGroupName.trim()) {
    //   setScreenGroupNameError("Screen Group Name is required");
    //   return;
    // }

    const payLoad = {
      screenGroupName: screenGroupName,
      selectedItems: selectedItems,
      ScreenGroupID: 0,
      tags: "",
    };

    // Handle the logic to process the selected items
    console.log("payLoad Items:", payLoad,screenData);

    // Close the modal
    // onClose();
  };


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
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter Screen Group Name"
              />
              {screenGroupNameError && (
                <p className="text-red-500 text-sm mt-1 error">
                  {screenGroupNameError}
                </p>
              )}
            </div>

            <div className="schedual-table bg-white rounded-xl mt-5 shadow">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-2">
                <table
                  className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  cellPadding={20}
                >
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          Screen
                          {/* <a href="#" onClick={() => sorting("screen")} > */}
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
                          Google Location
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
                          Associated Schedule
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
                    {store &&
                      store.data.length &&
                      store.data.map((screen) => (
                        <tr
                          key={screen.screenID}
                          className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                        >
                          <td className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-3"
                              onChange={() =>
                                handleScreenCheckboxChange(screen.screenID)
                              }
                              checked={screenCheckboxes[screen.screenID]}
                            />

                            {screen.screenName}
                          </td>

                          <td className="text-center">
                            <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                              Live
                            </button>
                          </td>
                          <td className="text-center break-words">
                            {screen.googleLocation}
                          </td>

                          <td className="text-center break-words">
                            Schedule Name Till 28 June 2023
                          </td>
                          <td className="text-center break-words">
                            {screen.tags}
                          </td>
                        </tr>
                      ))}
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
