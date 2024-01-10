import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SelectByUserScreen } from "../../../Redux/ScreenGroupSlice";
import toast from "react-hot-toast";
import { SELECT_BY_USER_SCREENDETAIL } from "../../../Pages/Api";

const ScreenGroupModal = ({ 
  onClose, 
  handleSave,
  editSelectedScreen
 }) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.root.screenGroup);

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [loadFirst, setLoadFirst] = useState(true);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  // const [screenData, setScreenData] = useState([ ]);

  const [screenGroupName, setScreenGroupName] = useState("");
  const [screenGroupNameError, setScreenGroupNameError] = useState(""); // Name validationError check

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);

  // Filter data based on search term
  const filteredData = store.data?.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase()
    )
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Function to sort the data based on a field and order
  const sortData = (data, field, order) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    return sortedData;
  };

  const sortedAndPaginatedData = sortData(
    filteredData,
    sortedField,
    sortOrder
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      dispatch(SelectByUserScreen({ config }));
      setLoadFirst(false);
    }

  }, [dispatch, loadFirst, sortOrder, store]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle sorting when a table header is clicked
  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  const handleScreenGroupNameChange = (e) => {
    const value = e.target.value;
    setScreenGroupName(value);
    // Validate screenGroupName on change
    if (!value.trim()) {
      setScreenGroupNameError("Screen Group Name is required");
    } else {
      setScreenGroupNameError("");
    }
  };

  const handleCheckboxChange = (screenID) => {
    const updatedSelection = [...selectedItems];
    const index = updatedSelection.indexOf(screenID);

    if (index === -1) {
      updatedSelection.push(screenID);
    } else {
      updatedSelection.splice(index, 1);
    }

    setSelectedItems(updatedSelection);
  };

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);

    if (!selectAllChecked) {
      const allScreenIDs = store.data.map((screen) => screen.screenID);
      setSelectedItems(allScreenIDs);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSaveScreen = async () => {
    // Validate screenGroupName before saving
    if (!screenGroupName.trim()) {
      setScreenGroupNameError("Screen Group Name is required");
      return; // Do not proceed with saving if validation fails
    }

    const payLoad = {
      screenGroupName: screenGroupName,
      selectedItems: selectedItems,
    };
    await handleSave(payLoad)
    // Close the modal
    onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        onClose();
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  useEffect(() => {
    if (editSelectedScreen) {
      setScreenGroupName(editSelectedScreen.name || '');
      // setSelectedItems(editSelectedScreen.selectedItems || []);
    }
  }, [editSelectedScreen]);
  
console.log("--------------- ",editSelectedScreen );

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
                    checked={selectAllChecked}
                    onChange={handleSelectAllChange}
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
                onChange={handleScreenGroupNameChange}
                value={screenGroupName}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                placeholder="Enter Screen Group Name"
              />
              {screenGroupNameError && (
                <p className="text-red-500 text-sm mt-1 error">
                  {screenGroupNameError}
                </p>
              )}
            </div>

            <div className="schedual-table bg-white rounded-xl mt-5">
              <div className="relative overflow-x-auto">
                <table
                  className="min-w-full leading-normal text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed"
                  cellPadding={20}
                >
                  <thead className="text-xs text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className="items-center border-b border-b-[#E4E6FF] table-head-bg text-left">
                      <th scope="col" className="text-[#5A5881] text-sm font-semibold p-2">
                        <div className="flex items-center">
                          Screen
                          <a href="#">
                            <svg
                              className="w-3 h-3 ms-1.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              onClick={() => handleSort("screenName")}
                            >
                              <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                            </svg>
                          </a>
                        </div>
                      </th>
                      <th scope="col" className="text-[#5A5881] text-sm font-semibold p-2">
                        <div className="flex items-center">
                          Status
                        </div>
                      </th>
                      <th scope="col" className="text-[#5A5881] text-sm font-semibold p-2">
                        <div className="flex items-center">
                          Google Location
                        </div>
                      </th>
                      <th scope="col" className="text-[#5A5881] text-sm font-semibold p-2">
                        <div className="flex items-center">
                          Associated Schedule
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {store && store.data?.length > 0 ? (
                      sortedAndPaginatedData.map((screen) => (
                        <tr
                          key={screen.screenID}
                          className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2"
                        >
                          <td className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-3"
                              checked={selectedItems.includes(screen.screenID)}
                              onChange={() => handleCheckboxChange(screen.screenID)}
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
                            {screen.scheduleName}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          {store && store.data?.length === 0
                            ? "No data found"
                            : <>
                              <span className="text-sm  hover:bg-gray-400 text-gray-800 font-semibold rounded-full text-green-800 me-2 px-2.5 py-0.5 dark:bg-green-900 dark:text-green-300">
                                Data not found
                              </span>
                            </>
                          }
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>

                <div className="flex justify-end m-5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex cursor-pointer hover:bg-white hover:text-primary items-center justify-center px-3 h-8 me-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 5H1m0 0 4 4M1 5l4-4"
                      />
                    </svg>
                    Previous
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Next
                    <svg
                      className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>
                </div>


                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button
                    data-modal-hide="static-modal"
                    type="button"
                    className="border-2 border-primary px-5 py-2 rounded-full ml-3 text-white bg-primary  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSaveScreen}
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
