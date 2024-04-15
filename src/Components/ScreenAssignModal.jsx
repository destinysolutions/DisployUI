import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { SELECT_BY_USER_SCREENDETAIL, SIGNAL_R } from "../Pages/Api";
import { handleGetScreen } from "../Redux/Screenslice";
import { connection } from "../SignalR";
import toast from "react-hot-toast";
import moment from "moment";
import { socket } from "../App";
const ScreenAssignModal = ({
  setAddScreenModal,
  setSelectScreenModal,
  handleUpdateScreenAssign,
  selectedScreens,
  setSelectedScreens,
  screenSelected,
  sidebarOpen,
}) => {
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [screenCheckboxes, setScreenCheckboxes] = useState({});
  const [screenData, setScreenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [screenMacID, setScreenMacID] = useState("");

  const selectScreenRef = useRef(null);
  //   Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page as needed
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [searchScreen, setSearchScreen] = useState("");
  const selectedScreenMacIdsString = Array.isArray(screenMacID)
    ? screenMacID.join(",")
    : "";

  const signalROnSave = () => {
    toast.loading("Saving...");
    const Params = {
      id: socket.id,
      connection: socket.connected,
      macId: selectedScreenMacIdsString,
    };
    socket.emit("ScreenConnected", Params);
    try {
      // Invoke ScreenConnected method
      if (connection.state == "Disconnected") {
        connection
          .start()
          .then((res) => {
            console.log("signal connected");
          })
          .then(() => {
            connection
              .invoke("ScreenConnected", selectedScreenMacIdsString)
              .then(() => {
                console.log("func. invoked");
                toast.remove();
                handleUpdateScreenAssign(screenCheckboxes);
                setSelectedScreens([]);
              })
              .catch((err) => {
                toast.remove();
                console.log("error from invoke", err);
                toast.error("Something went wrong, try again");
              });
          });
      } else {
        connection
          .invoke("ScreenConnected", selectedScreenMacIdsString)
          .then(() => {
            console.log("func. invoked");
            toast.remove();
            handleUpdateScreenAssign(screenCheckboxes);
            setSelectedScreens([]);
          })
          .catch((err) => {
            toast.remove();
            console.log("error from invoke", err);
            toast.error("Something went wrong, try again");
          });
      }
    } catch (error) {
      console.error("Error during connection:", error);
      toast.error("Something went wrong, try again");
      toast.remove();
    }
  };

  const filteredData = Array.isArray(screenData)
    ? screenData?.filter((item) =>
        item?.screenName?.toLowerCase()?.includes(searchScreen?.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

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
  // Pagination End

  const handleSelectAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
    // Set the state of all individual screen checkboxes
    const updatedCheckboxes = {};
    for (const screenID in screenCheckboxes) {
      updatedCheckboxes[screenID] = checked;
    }
    setScreenCheckboxes(updatedCheckboxes);
    // Update the selected screens state based on whether "All Select" is checked
    if (checked) {
      const allScreenIds = screenData.map((screen) => screen.screenID);
      const allScreenmacIds = screenData.map((screen) => screen.macid);
      setSelectedScreens(allScreenIds);
      setScreenMacID(allScreenmacIds);
    } else {
      setSelectedScreens([]);
    }
  };

  const handleScreenCheckboxChange = (screenID) => {
    const updatedCheckboxes = { ...screenCheckboxes };
    updatedCheckboxes[screenID] = !updatedCheckboxes[screenID];
    setScreenCheckboxes(updatedCheckboxes);

    // Create a copy of the selected screens array
    const updatedSelectedScreens = [...selectedScreens];

    // If the screenID is already in the array, remove it; otherwise, add it
    if (updatedSelectedScreens.includes(screenID)) {
      const index = updatedSelectedScreens.indexOf(screenID);
      updatedSelectedScreens.splice(index, 1);
    } else {
      updatedSelectedScreens.push(screenID);
    }
    const screenAssigned = screenData.filter((item) =>
      updatedSelectedScreens.includes(item?.screenID)
    );
    setScreenMacID(screenAssigned.map((i) => i.macid));

    // Update the selected screens state
    setSelectedScreens(updatedSelectedScreens);

    // Check if any individual screen checkbox is unchecked
    const allChecked = Object.values(updatedCheckboxes).every(
      (isChecked) => isChecked
    );

    setSelectAllChecked(allChecked);
  };

  // get all assets files
  useEffect(() => {
    const screenAssigned = screenData.filter((item) =>
      selectedScreens.includes(item?.screenID)
    );
    const foundMacID = screenAssigned.map((i) => i.macid);
    setScreenMacID(foundMacID);

    if (user?.userID) {
      setLoading(true);
      axios
        .get(`${SELECT_BY_USER_SCREENDETAIL}?ID=${user?.userID}`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          const fetchedData = response.data.data;
          setScreenData(fetchedData);
          setLoading(false);
          let initialCheckboxes = {};
          let selectmacId = [];
          if (Array.isArray(fetchedData)) {
            fetchedData.forEach((screen) => {
              if (selectedScreens?.includes(screen.screenID)) {
                initialCheckboxes[screen.screenID] = true;
                selectmacId?.push(screen?.macid);
              } else {
                initialCheckboxes[screen.screenID] = false;
              }
            });
            setScreenMacID(selectmacId);
            setScreenCheckboxes(initialCheckboxes);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectScreenRef.current &&
        !selectScreenRef.current.contains(event?.target)
      ) {
        setSelectScreenModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  function handleClickOutside() {
    setSelectScreenModal(false);
  }

  useEffect(() => {
    dispatch(handleGetScreen({ token }));
    window.addEventListener("keydown", function (event, characterCode) {
      if (typeof characterCode == "undefined") {
        characterCode = -1;
      }
      if (event?.keyCode == 27) {
        setSelectScreenModal(false);
        setAddScreenModal(false);
      }
    });
    return () => {
      window.removeEventListener("keydown", () => null);
    };
  }, []);

  //   // Validation check
  //   if (screenName.trim() === "") {
  //     setValidationError("Screen Name cannot be empty");
  //     return; // Do not proceed with the update if validation fails
  //   } else {
  //     setValidationError("");
  //   }

  //   // Perform your screen assignment logic here
  //   setSelectScreenModal(false);
  //   setAddScreenModal(false);
  //   let config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     // url: `https://disployapi.thedestinysolutions.com/api/AssetMaster/AssignAssetToScreen?AssetId=${screenAssetID}&ScreenID=${selectedScreenIdsString}`,
  //     // headers: {
  //     //   Authorization: authToken,
  //     // },
  //   };

  //   // Add your logic for updating screen assignment

  //   const paylod = {
  //     name: screenName,
  //     assetID: selectedAsset?.assetID,
  //     selectedScreens: selectedScreenIdsString,
  //   };

  //   console.log(" Merged Screens ---- ", { paylod });
  //   // ...

  //   // Clear screenName and validationError after updating
  //   setScreenName("");
  //   setValidationError("");
  // };

  const handleScreenSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchScreen(searchQuery);
  };

  return (
    <div className="bg-black bg-opacity-50 justify-center items-center flex fixed inset-0 z-9990 outline-none focus:outline-none">
      <div
        ref={selectScreenRef}
        className="w-auto my-6 mx-auto lg:max-w-[50vw] lg:min-w-[50vw] max-w-[85vw] min-w-[85vw]"
      >
        <div className="border-0 px-4 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none ">
          <div className="flex sticky top-0 bg-white z-10 items-start justify-between p-4 px-6 border-b border-[#A7AFB7] rounded-t text-black">
            <div className="flex items-center">
              <div className=" mt-1.5">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  onChange={handleSelectAllCheckboxChange}
                  checked={
                    selectAllChecked ||
                    (Object.values(screenCheckboxes)?.length > 0 &&
                      Object.values(screenCheckboxes).every((e) => {
                        return e == true;
                      }))
                  }
                />
              </div>
              <h3 className="lg:text-xl md:text-lg sm:text-base xs:text-sm font-medium ml-3">
                All Select
              </h3>
            </div>
            
            <button
              className="p-1 text-xl"
              onClick={() => {
                setSelectScreenModal(false);
                setAddScreenModal(false);
                setSelectedScreens([]);
              }}
            >
              <AiOutlineCloseCircle className="text-3xl" />
            </button>
          </div>
           <div className="w-full flex justify-end mt-4 mb-4"> 
          <div className="relative ">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AiOutlineSearch className="w-5 h-5 text-gray " />
                </span>
                <input
                  type="text"
                  placeholder="Search Screen" //location ,screen, tag
                  className="border border-primary rounded-full px-7 pl-10 py-2 search-user w-full"
                  value={searchScreen}
                  onChange={(e) => {
                    handleScreenSearch(e);
                  }}
                />
            </div>
            </div>  
          
            <div className="max-h-72 custom-scrollbar rounded-lg ">
              <table className="screen-table w-full" cellPadding={15}>
                <thead>
                  <tr className="items-center table-head-bg">
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-left">
                      Screen
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Status
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Google Location
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Associated Schedule
                    </th>
                    <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center font-semibold text-lg"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : !loading && sortedAndPaginatedData?.length > 0 ? (
                    sortedAndPaginatedData.map((screen) => (
                      <tr
                        key={screen.screenID}
                        className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                      >
                        <td className="items-center">
                          <div className="flex">
                            <input
                              type="checkbox"
                              className="mr-3"
                              onChange={() =>
                                handleScreenCheckboxChange(screen.screenID)
                              }
                              checked={screenCheckboxes[screen.screenID]}
                            />

                            {screen.screenName}
                          </div>
                        </td>

                        <td className="text-center">
                          <span
                            id={`changetvstatus${screen?.macid}`}
                            className={`rounded-full px-6 py-2 text-white text-center ${
                              screen.screenStatus == 1
                                ? "bg-[#3AB700]"
                                : "bg-[#FF0000]"
                            }`}
                          >
                            {screen.screenStatus == 1 ? "Live" : "offline"}
                          </span>
                          {/* <button className="rounded-full px-6 py-1 text-white bg-[#3AB700]">
                          Live
                        </button> */}
                        </td>
                        <td className="text-center break-words">
                          {screen.googleLocation}
                        </td>

                        <td className="text-center break-words">
                          {screen.scheduleName == ""
                            ? ""
                            : `${screen.scheduleName} Till
                  ${moment(screen.endDate).format("YYYY-MM-DD hh:mm")}`}
                        </td>
                        <td className="text-center break-words">
                          {screen?.tags !== null
                            ? screen?.tags
                                .split(",")
                                .slice(
                                  0,
                                  screen?.tags.split(",").length > 2
                                    ? 3
                                    : screen?.tags.split(",").length
                                )
                                .map((text) => {
                                  if (text.toString().length > 10) {
                                    return text
                                      .split("")
                                      .slice(0, 10)
                                      .concat("...")
                                      .join("");
                                  }
                                  return text;
                                })
                                .join(",")
                            : ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <p className="text-center p-2">No Screen available.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
              <div className="flex items-center">
                <span className="text-gray-500">{`Total ${screenData?.length} Screen`}</span>
              </div>
              <div className="flex justify-end">
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
                  {sidebarOpen ? "Previous" : ""}
                </button>
                <div className="flex items-center me-3">
                  <span className="text-gray-500">{`Page ${currentPage} of ${totalPages}`}</span>
                </div>
                {/* <span>{`Page ${currentPage} of ${totalPages}`}</span> */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage === totalPages || screenData?.length === 0
                  }
                  className="flex hover:bg-white hover:text-primary cursor-pointer items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {sidebarOpen ? "Next" : ""}
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
            </div>
          

          <div className="py-4 flex justify-center sticky bottom-0 z-10 bg-white">
            <button
              className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
              onClick={() => {
                handleUpdateScreenAssign(
                  screenCheckboxes,
                  screenMacID.join(",").replace(/^\s+/g, "")
                );
                setSelectedScreens([]);
              }}
              // disabled={selectedScreens?.length === 0}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenAssignModal;
