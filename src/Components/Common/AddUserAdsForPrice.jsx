import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle, AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ADVERTISEMENT_SCREEN } from '../../Pages/Api';
import moment from 'moment';
import { UpdateAdsRate, getNotificationData } from '../../Redux/admin/AdvertisementSlice';
import toast from 'react-hot-toast';

const AddUserAdsForPrice = ({ toggleModal, sidebarOpen, editIdAds, setloadFirst }) => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.root.auth);
    const authToken = `Bearer ${token}`;
    const [screenCheckboxes, setScreenCheckboxes] = useState({});
    const [selectScreen, setSelectScreen] = useState([]);
    const [searchScreen, setSearchScreen] = useState("");
    const [screenData, setScreenData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [screenError, setScreenError] = useState(false);
    const [priceError, setPriceError] = useState(false);

    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
    const [sortedField, setSortedField] = useState(null);
    const [price, setPrice] = useState("");
    // get all Screen
    useEffect(() => {
        if (user?.userID) {
            setLoading(true);
            axios
                .get(`${ADVERTISEMENT_SCREEN}`, {
                    headers: {
                        Authorization: authToken,
                    },
                })
                .then((response) => {
                    const fetchedData = response?.data?.data;
                    setScreenData(fetchedData);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });
        }
    }, []);


    const handleScreenCheckboxChange = (screenID) => {
        setScreenError(false)
        // Check if the screenID is already selected
        const isSelected = selectScreen.includes(screenID);

        // Create a new array with the updated selection
        let newSelectedScreens;
        if (isSelected) {
            // Remove the screenID if it's already selected
            newSelectedScreens = selectScreen.filter(id => id !== screenID);
        } else {
            // Add the screenID if it's not already selected
            newSelectedScreens = [...selectScreen, screenID];
        }

        // Update the state with the new selection
        setSelectScreen(newSelectedScreens);
        const updatedCheckboxes = { ...screenCheckboxes };
        updatedCheckboxes[screenID] = !updatedCheckboxes[screenID];
        setScreenCheckboxes(updatedCheckboxes);
    };



    const handleScreenSearch = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        setSearchScreen(searchQuery);
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

    const handleAddPrice = () => {
        if (price === "" && selectScreen?.length === 0) {
            setPriceError(true);
            setScreenError(true);
            return;
        }
        if (price === "") {
            return (setPriceError(true))
        }
        if (selectScreen?.length === 0) {
            return (setScreenError(true))
        }
        let result = selectScreen?.map((value, index) => {
            let start = value;
            return `${start}_${user?.organizationId}`;
        });
        if (selectScreen?.length <= editIdAds?.screen) {
            const payload = { AssignAdvertisementid: editIdAds?.assignAdvertisementid, AdsPrice: price, SelectedScreen: result };
            dispatch(UpdateAdsRate(payload)).then((res) => {
                if (res?.payload?.status === true) {
                    setloadFirst(true)
                    toggleModal();
                }
            });
        } else {
            toast.error("You can only Select Required screen")
        }
    }

    return (
        <>
            <div
                id="default-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full h-full md:inset-0 max-h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-3xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Select Screen and Add Price
                            </h3>
                            <AiOutlineCloseCircle
                                className="text-4xl text-primary cursor-pointer"
                                onClick={() => {
                                    toggleModal();
                                }}
                            />
                        </div>
                        
                        <div className="flex lg:justify-end justify-center mt-4 px-5">
                            <div className="flex justify-end items-center mb-2">
                                <div className="relative w-full">
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
                        </div>
                        <div className="schedual-table bg-white mt-2 p-3 w-full">
                            <div className="overflow-x-scroll sc-scrollbar rounded-lg vertical-scroll-inner h-52">
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
                                                    
                                                >
                                                <div className="flex text-center m-5 justify-center">
                                                <svg
                                                  aria-hidden="true"
                                                  role="status"
                                                  className="inline w-10 h-10 me-3 text-gray-200 animate-spin dark:text-gray-600"
                                                  viewBox="0 0 100 101"
                                                  fill="none"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                  />
                                                  <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="#1C64F2"
                                                  />
                                                </svg>
                
                                              </div>
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
                                                            className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
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
                                                        {screen.scheduleName === "" || screen.scheduleName === null
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
                            {screenError && (
                                <span className='error'>Select Screen</span>
                            )}
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
                                        disabled={(currentPage === totalPages) || (screenData?.length === 0)}
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
                            <div className='px-4'>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Add Price
                                </label>
                                <input
                                    type="number"
                                    name="add_price"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Enter Total Screen Price"
                                    value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value)
                                        setPriceError(false)
                                    }} // Update price state on input change
                                />
                                {priceError && (
                                    <span className='error'>Enter Total Screen Price</span>
                                )}
                            </div>
                        </div>

                        <div className="py-4 flex justify-center sticky bottom-0 z-10 bg-white">
                            <button
                                className={`border-2 border-primary px-5 py-2 rounded-full ml-3 `}
                                onClick={() => handleAddPrice()}
                            >
                                Save
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUserAdsForPrice
