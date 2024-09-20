import React, { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Loading from "../Loading";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import {
  handleDeleteAllScreen,
} from "../../Redux/Screenslice";
import { AiOutlineCloudUpload, AiOutlineSearch } from "react-icons/ai";
import { PageNumber } from "../Common/Common";
import ReactTooltip from "react-tooltip";
import { SCREEN_DELETE_ALL } from "../../Pages/Api";
import toast from "react-hot-toast";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { AdvertisementPopup } from "./AdvertisementPopup";
import { socket } from "../../App";
import { getAllAdvertisementScreenData } from "../../Redux/AdvertisentScreenSlice";
import { BsPlayCircleFill } from "react-icons/bs";

const AdvertisementScreens = ({ sidebarOpen, setSidebarOpen }) => {
  const { token, user, userDetails } = useSelector((state) => state.root.auth);
  const authToken = `Bearer ${token}`;
  const dispatch = useDispatch();
  const { screens } = useSelector((s) => s.root.screen);
  const [sidebarload, setSidebarLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ScreenData, setScreenData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedField, setSortedField] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Multipal check
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [searchScreen, setSearchScreen] = useState("");
  const [loadFist, setLoadFist] = useState(true);
  const [ispopup, setIsPopup] = useState(false);
  console.log('ScreenData :>> ', ScreenData);

  const filteredData = Array.isArray(ScreenData)
    ? ScreenData?.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchScreen.toLowerCase())
      )
    )
    : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchScreen]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (field) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortOrder("asc");
      setSortedField(field);
    }
  };

  const sortData = (data, field, order) => {
    const sortedData = [...data];
    if (field !== null) {
      sortedData.sort((a, b) => {
        if (order === "asc") {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
      return sortedData;
    } else {
      return data;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const sortedAndPaginatedData = sortData(
    filteredData,
    sortedField,
    sortOrder
  ).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchScreen(searchQuery);
  };

  const fetchScreenData = async () => {
    const data = await dispatch(getAllAdvertisementScreenData({ token }));
    if (data?.payload?.status === 200) {
      setScreenData(data?.payload?.data);
    }
    setSidebarLoad(false);
    setLoading(false);
  };

  useEffect(() => {
    if (loadFist) {
      fetchScreenData();
      setLoadFist(false);
    }
  }, [loadFist]);


  const handleDeleteAllscreen = () => {
    const allScreenMacids = screens.map((i) => i?.macid).join(",");
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${SCREEN_DELETE_ALL}?ScreenIds=${selectedItems}`,
      headers: { Authorization: authToken },
    };

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(handleDeleteAllScreen({ config }));
        setSelectAllChecked(false);
        toast.remove();
        setLoadFist(true);
        toast.success("Screen deleted Successfully!");
        const Params = {
          id: socket.id,
          connection: socket.connected,
          macId: allScreenMacids,
        };
        socket.emit("ScreenConnected", Params);
      }
    });
  };

  return (
    <>
      {sidebarload && <Loading />}

      {!sidebarload && (
        <Suspense fallback={<Loading />}>
          <>
            <div className="flex bg-white border-b border-gray">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <Navbar />
            </div>

            <div
              className={
                userDetails?.isTrial &&
                  user?.userDetails?.isRetailer === false &&
                  !userDetails?.isActivePlan
                  ? "lg:pt-32 md:pt-32 sm:pt-20 xs:pt-20 px-5 page-contain"
                  : "lg:pt-24 md:pt-24 pt-10 px-5 page-contain"
              }
            >

              {
                !loading && ScreenData?.length === 0 ? (
                  <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="lg:w-[1000px] md:w-[700px] w-full h-[70vh] bg-white lg:p-6 my-10 rounded-lg shadow-lg m-auto  flex ">
                      <div className="w-full h-full">
                        <div className="text-center  my-5">
                          <h1 className="not-italic font-medium text-xl text-[#001737] sm-mb-3">
                            You dont't have any screen for advertising switch
                            your <br /> screen for advertising
                          </h1>

                          <div className="flex items-center justify-center  w-[550px]  h-[300px] rounded-lg m-auto my-10 bg-blue-100">
                            <BsPlayCircleFill size={100} className="text-[#ff2d2d]" />
                          </div>
                          <p className="not-italic font-medium text-xl text-[#001737] sm-mb-3">
                            If you have requested advertisement screens, wait for approval.<br />
                            Your screen will appear here once it has been approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`${sidebarOpen ? "ml-60" : "ml-0"}`}>
                    <div className="grid lg:grid-cols-3 gap-2">
                      <h1 className="not-italic font-medium text-2xl text-[#001737] sm-mb-3">
                        Advertising Screen
                      </h1>
                      <div className="lg:col-span-2 lg:flex items-center md:mt-0 lg:mt-0 md:justify-end sm:mt-3 flex-wrap">
                        <div className="relative md:mr-2 lg:mr-2 lg:mb-0 md:mb-0 mb-3">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <AiOutlineSearch className="w-5 h-5 text-gray " />
                          </span>
                          <input
                            type="text"
                            placeholder="Search Screens"
                            className="border border-primary rounded-full pl-10 py-2 search-user"
                            value={searchScreen}
                            onChange={handleSearch}
                          />
                        </div>

                      </div>
                    </div>

                    <div className="bg-white rounded-xl lg:mt-8 mt-5 shadow screen-section">
                      <div className="rounded-xl overflow-x-scroll sc-scrollbar sm:rounded-lg">
                        <table
                          className="screen-table w-full bg-white lg:table-auto md:table-auto sm:table-auto xs:table-auto"
                          cellPadding={15}
                        >
                          <thead>
                            <tr className="text-lext table-head-bg">
                              <th className="text-[#5A5881] text-base text-center font-semibold w-200">
                                <div className="flex">
                                  Screen Name
                                  <svg
                                    className="w-3 h-3 ms-1.5 mt-2 cursor-pointer"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    onClick={() => handleSort("screenName")}
                                  >
                                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                  </svg>
                                </div>
                              </th>
                              <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                Google Location
                              </th>
                              <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                Status
                              </th>
                              <th className="mw-200 text-[#5A5881] text-base font-semibold w-fit text-center">
                                Now Playing
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={7}>
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
                            ) : ScreenData &&
                              sortedAndPaginatedData?.length === 0 ? (
                              <tr>
                                <td colSpan={7}>
                                  <div className="flex text-center m-5 justify-center">
                                    <span className="text-2xl font-semibold py-2 px-4 rounded-full me-2">
                                      No Data Available
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              <>
                                {ScreenData &&
                                  sortedAndPaginatedData?.length > 0 &&
                                  sortedAndPaginatedData?.map((screen, index) => {
                                    return (
                                      <tr
                                        className="border-b border-b-[#E4E6FF] "
                                        key={index}
                                      >
                                        <td className="text-[#5E5E5E] mw-200">
                                          <div className="flex gap-1 items-center">
                                            <>
                                              {screen?.screenName}
                                            </>
                                          </div>
                                        </td>
                                        <td className="mw-200 text-[#5E5E5E] text-center">
                                          {screen?.googleLocation}
                                        </td>
                                        <td className="mw-200 text-[#5E5E5E] text-center flex">
                                          <td className="text-center w-full">
                                            <span
                                              id={`changetvstatus${screen?.macid}`}
                                              className={`rounded-full px-6 py-2 text-white text-center ${screen.screenStatus == 1
                                                ? "bg-[#3AB700]"
                                                : "bg-[#FF0000]"
                                                }`}
                                            >
                                              {screen?.screenStatus == 1
                                                ? "Live"
                                                : "offline"}
                                            </span>
                                          </td>
                                        </td>

                                        <td
                                          className="text-center cursor-pointer"
                                          style={{ wordBreak: "break-all" }}
                                        >
                                          <div
                                            title={screen?.assetName}
                                            className="flex items-center justify-between gap-2 border-gray bg-lightgray border rounded-full py-2 px-3 lg:text-sm md:text-sm sm:text-xs xs:text-xs mx-auto   hover:bg-SlateBlue hover:text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/50"
                                          >
                                            <p className="line-clamp-1">
                                              {screen.assetName}
                                            </p>
                                            <AiOutlineCloudUpload className="min-h-[1rem] min-w-[1rem]" />
                                          </div>
                                        </td>

                                        {/* <td className="mw-200 text-[#5E5E5E] text-center">
                                      <select
                                        className="px-2 py-2 border border-[#D5E3FF] w-full focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-full"
                                        value={screen?.screenType}
                                        onChange={(e) =>
                                          handleChange(screen, e.target.value)
                                        }
                                      >
                                        {Screen_Type &&
                                          Screen_Type?.map((screen) => (
                                            <option
                                              value={screen?.value}
                                              key={screen?.value}
                                            >
                                              {screen?.value}
                                            </option>
                                          ))}
                                      </select>
                                    </td> */}

                                      </tr>
                                    );
                                  })}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex border-b border-gray lg:flex-row lg:justify-between md:flex-row md:justify-between sm:flex-row sm:justify-between flex-col justify-end p-5 gap-3">
                        <div className="flex items-center">
                          <span className="text-gray-500">{`Total ${filteredData?.length} Screens`}</span>
                        </div>
                        <div className="flex justify-end ">
                          <select
                            className="px-1 mr-2 border border-gray rounded-lg"
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                          >
                            {PageNumber.map((x) => (
                              <option value={x}>{x}</option>
                            ))}
                          </select>
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
                              currentPage === totalPages || ScreenData?.length === 0
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
                    </div>
                  </div>
                )
              }
            </div>
            <Footer />
            {ispopup && (
              <AdvertisementPopup ispopup={ispopup} setIsPopup={setIsPopup} />
            )}
          </>
        </Suspense >
      )}
    </>
  );
};

export default AdvertisementScreens;
