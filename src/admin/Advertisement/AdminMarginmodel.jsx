import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { ADD_USER_LIST } from "../../Pages/Api";
import axios from "axios";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import moment from "moment";
import { AddMarginRate } from "../../Redux/admin/AdvertisementSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const AdminMarginmodel = ({ toggleMarginModal, sidebarOpen, selectAds, fetchAds }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const [margin, setMargin] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [sortedField, setSortedField] = useState(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [userCheckboxState, setUserCheckboxState] = useState({});
  const [accordionCheckboxState, setAccordionCheckboxState] = useState({});
  const [marginError, setMarginError] = useState(false)
  const [screenError, setScreenError] = useState(false);

  // get all Screen
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${ADD_USER_LIST}?AdsCustomerMasterID=${selectAds?.adsCustomerMasterID}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((response) => {
        const fetchedData = response?.data?.data;
        setUserData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const handleScreenSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchUser(searchQuery);
  };

  const filteredData = Array.isArray(userData)
    ? userData?.filter((item) =>
      item?.name?.toLowerCase()?.includes(searchUser?.toLowerCase())
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

  const handleAccordionClick = (index) => {
    setOpenAccordionIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleUserCheckboxChange = (userScreenID, value) => {
    setScreenError(false)
    setUserCheckboxState((prevState) => ({
      ...prevState,
      [userScreenID]: value?.checked,
    }));

    userData?.map((item) => {
      if (item?.organizationID === userScreenID) {
        item?.screens?.map((screen) => {
          setAccordionCheckboxState((prevState) => ({
            ...prevState,
            [screen.screenID]: value?.checked,
          }));
        })
      }
    })
  };

  const handleScreenCheckboxChange = (screenID) => {
    setAccordionCheckboxState((prevState) => ({
      ...prevState,
      [screenID]: !prevState[screenID],
    }));
  };

  useEffect(() => {
    // let keys = [];
    // for (let key in accordionCheckboxState) {
    //   if (accordionCheckboxState[key] === true) {
    //     keys.push(key);
    //   }
    // }
    // if (keys?.length > 0) {
    //   userData?.map((user) => {
    //     let arr = []
    //     user?.screens?.map((item) => {
    //       keys?.map((items) => {
    //         if (Number(items) === item?.screenID) {
    //           arr?.push(item?.screenID)
    //         }
    //       })
    //     })
    //     if (arr?.length === user?.screens?.length) {
    //       arr?.map((item1) => {
    //         setUserCheckboxState((prevState) => ({
    //           ...prevState,
    //           [user?.organizationID]: true,
    //         }));
    //       })
    //     } else {
    //       setUserCheckboxState((prevState) => ({
    //         ...prevState,
    //         [user?.organizationID]: false,
    //       }));
    //     }
    //   })
    // }


    let keys = Object.keys(accordionCheckboxState).filter(key => accordionCheckboxState[key]);
    setScreenError(false)
    userData?.forEach(user => {
      let arr = user.screens?.map(item => item.screenID).filter(screenID => keys.includes(screenID.toString()));
      setUserCheckboxState(prevState => ({
        ...prevState,
        [user.organizationID]: arr && arr.length === user.screens.length,
      }));
    });

  }, [accordionCheckboxState])

  const handleAddMargin = () => {
    let keys = Object.keys(accordionCheckboxState).filter(key => accordionCheckboxState[key]);
    if (margin === "" && keys?.length === 0) {
      setMarginError(true);
      setScreenError(true);
      return;
    }
    if (margin === "") {
      return (setMarginError(true))
    }
    if (keys?.length === 0) {
      return setScreenError(true);
    }

    let data = []
    userData?.map((user) => {
      let arr = []
      user?.screens?.map((screen) => {
        keys?.map((key) => {
          if (Number(key) === screen?.screenID) {
            arr?.push(screen?.screenID)
          }
        })
      })
      if (arr?.length > 0) {
        let obj = {
          name: user?.name,
          organizationID: user?.organizationID,
          adsPrice: user?.adsPrice,
          AssignAdvertisementid:user?.assignAdvertisementid,
          ScreenIDS: arr?.join(",")
        }
        data?.push(obj)
      }
    })


    if (keys?.length <= selectAds?.screen) {
      let payload = {
        adsCustomerMasterID: selectAds?.adsCustomerMasterID,
        margin: margin,
        user: data
      }
      dispatch(AddMarginRate(payload)).then((res) => {
        if (res?.payload?.status === true) {
          fetchAds()
          toggleMarginModal()
        }
      });
    } else {
      toast.error("You can only Select Required screen")
    }
  };


  return (
    <>
      <div
        id="default-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-9990 flex justify-center items-center w-full h-full m-0 md:inset-0 max-h-full bg-black bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-3xl max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select User and Add Margin
              </h3>
              <AiOutlineCloseCircle
                className="text-4xl text-primary cursor-pointer"
                onClick={() => {
                  toggleMarginModal();
                }}
              />
            </div>
            <div>
              <div className="flex lg:justify-end justify-center mt-4 px-5">
                <div className="flex justify-end items-center mb-2">
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <AiOutlineSearch className="w-5 h-5 text-gray " />
                    </span>
                    <input
                      type="text"
                      placeholder="Search User" //location ,screen, tag
                      className="border border-primary rounded-full px-7 pl-10 py-2 search-user w-full"
                      value={searchUser}
                      onChange={(e) => {
                        handleScreenSearch(e);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="schedual-table bg-white mt-2 p-3 w-full overflow-x-auto min-h-[350px] max-h-[550px]">
                <div className="overflow-x-scroll sc-scrollbar rounded-lg">
                  <table className="screen-table w-full" cellPadding={15}>
                    <thead>
                      <tr className="items-center table-head-bg">
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-left">
                          User Name
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Email
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Google Location
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Total Given Screen
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                          Price
                        </th>
                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center"></th>
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
                        sortedAndPaginatedData.map((user, i) => {
                          const isAccordionOpen = openAccordionIndex === i;
                          return (
                            <>
                              <tr
                                key={i}
                                className="mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm px-5 py-2"
                              >
                                <td className="items-center">
                                  <div className="flex">
                                    <input
                                      type="checkbox"
                                      className="mr-3"
                                      onChange={(e) =>
                                        handleUserCheckboxChange(user.organizationID, e.target)
                                      }
                                      checked={userCheckboxState[user.organizationID]}
                                    />
                                    {user.name}
                                  </div>
                                </td>

                                <td className="text-center">{user?.email}</td>
                                <td className="text-center break-words">
                                  {user.googleLocation}
                                </td>

                                <td className="text-center break-words">
                                  {user?.screen}
                                </td>
                                <td className="text-center break-words">
                                  {user?.adsPrice}
                                </td>
                                <td>
                                  {isAccordionOpen && (
                                    <button>
                                      <div
                                        onClick={() => handleAccordionClick(i)}
                                      >
                                        <IoIosArrowDropup className="text-3xl" />
                                      </div>
                                    </button>
                                  )}
                                  {!isAccordionOpen && (
                                    <button>
                                      <div
                                        onClick={() => handleAccordionClick(i)}
                                      >
                                        <IoIosArrowDropdown className="text-3xl" />
                                      </div>
                                    </button>
                                  )}
                                </td>
                              </tr>
                              {isAccordionOpen && (
                                <div className="overflow-x-scroll sc-scrollbar  pt-4">
                                  <table
                                    className="screen-table w-full"
                                    cellPadding={15}
                                  >
                                    <thead>
                                      <tr className="items-center table-head-bg">
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-left">
                                          Screen Name
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                          Status
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                          Google Location
                                        </th>
                                        <th className="text-[#5A5881] text-base font-semibold w-fit text-center">
                                          Last Seen
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {isAccordionOpen &&
                                        user &&
                                        user.screens?.length > 0 &&
                                        user.screens?.map((screen, index) => {
                                          return (
                                            <tr
                                              key={index}
                                              className=" mt-7 bg-white rounded-lg  font-normal text-[14px] text-[#5E5E5E] border-b border-lightgray shadow-sm   px-5 py-2"
                                            >
                                              <td className="p-2 text-center">
                                                <div className="flex">
                                                  <input
                                                    type="checkbox"
                                                    className="mr-3"
                                                    onChange={() =>
                                                      handleScreenCheckboxChange(
                                                        screen.screenID
                                                      )
                                                    }
                                                    checked={
                                                      accordionCheckboxState[
                                                      screen.screenID
                                                      ]
                                                    }
                                                  />
                                                  {screen.screenName}
                                                </div>
                                              </td>

                                              <td className="p-2 text-center">
                                                <span
                                                  id={`changetvstatus${screen.macid}`}
                                                  className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus === 1
                                                    ? "bg-[#3AB700]"
                                                    : "bg-[#FF0000]"
                                                    }`}
                                                >
                                                  {screen.screenStatus === 1
                                                    ? "Live"
                                                    : "offline"}
                                                </span>
                                              </td>
                                              <td className="p-2 text-center">
                                                {screen?.googleLocation}
                                              </td>
                                              <td className="p-2 text-center">
                                                {screen?.lastSeen
                                                  ? moment(
                                                    screen?.lastSeen
                                                  ).format("LLL")
                                                  : null}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <p className="text-center p-2">
                              No User available.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {screenError && (
                  <span className='error'>Select Screen</span>
                )}
                <div className="flex lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                  <div className="flex items-center">
                    <span className="text-gray-500">{`Total ${userData?.length} Screen`}</span>
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
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage === totalPages || userData?.length === 0
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
                <div className="px-4">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Add Margin
                  </label>
                  <input
                    type="number"
                    name="add_price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter Per User Margin"
                    value={margin}
                    onChange={(e) => {
                      setMargin(e.target.value)
                      setMarginError(false)
                    }}
                  />
                  {marginError && (
                    <span className='error'>Enter Margin</span>
                  )}
                </div>
              </div>

              <div className="py-4 flex justify-center sticky bottom-0 z-10 bg-white">
                <button
                  className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
                  onClick={() => handleAddMargin()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMarginmodel;
